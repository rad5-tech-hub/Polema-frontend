import React, { useState, useEffect, useCallback } from "react";
import useToast from "../../../../hooks/useToast";
import axios from "axios";
import { TextField, Select, Flex, Button } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
//import { Loader2 as LoaderIcon } from "lucide-react"; // or another loader icon import

const root = import.meta.env.VITE_ROOT;

const CreateGatepass = () => {
  const { id } = useParams();
  const [escort, setEscort] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [destination, setDestination] = useState("");
  const [superAdmins, setSuperAdmins] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [goodsOwner, setGoodsOwner] = useState("");
  const [customerId, setCustomerId] = useState("");
  const showToast = useToast();

  // Fetch gate pass related details
  const TransDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("An error occurred, try logging in again");

    try {
      const response = await axios.get(`${root}/customer/get-summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const customerId = data.ledger?.customerId;
      setCustomerId(customerId);

      setDriverName(data.order?.authToWeighTickets?.driver || "");
      setVehicleNumber(data.order?.authToWeighTickets?.vehicleNo || "");

      const customer = data.ledgerSummary?.ledgerEntries[0]?.customer;
      const fullName = `${customer?.firstname || ""} ${
        customer?.lastname || ""
      }`;
      setGoodsOwner(fullName);
    } catch (error) {
      toast.error("Failed to fetch gate pass details");
    }
  }, [id]);

  // Fetch customer destination address
  const fetchCustomerDetails = useCallback(async () => {
    if (!customerId) return;

    const token = localStorage.getItem("token");
    if (!token) return toast.error("An error occurred, try logging in again");

    try {
      const response = await axios.get(
        `${root}/customer/get-customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const customerInfo = response.data.customer;
      setDestination(customerInfo.address || "");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch customer details.");
    }
  }, [customerId]);

  // Fetch super admin list
  const fetchSuperAdmins = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("An error occurred, try logging in again");

    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load admins");
    }
  }, []);

  useEffect(() => {
    fetchSuperAdmins();
    TransDetails();
  }, [fetchSuperAdmins, TransDetails]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId, fetchCustomerDetails]);

  // Submit gatepass form
  const submitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("An error occurred, try logging in again");

    setButtonLoading(true);
    if (!selectedAdminId) {
      toast.error("Please select an admin role");
      setButtonLoading(false);
      return;
    }
    const selectedAdmin = superAdmins.find(
      (admin) => admin.id === selectedAdminId
    );
    if (!selectedAdmin) {
      toast.error("Selected admin not found");
      setButtonLoading(false);
      return;
    }

    const roleIdToSend = selectedAdmin.roleId;

    const body = {
      escortName: escort,
      destination,
    };

    try {
      const res = await axios.post(
        `${root}/customer/create-gatepass/${id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const passID = res.data.gatepass.id;

      await axios.post(
        `${root}/customer/send-gate-pass/${passID}`,
        { adminIds: [roleIdToSend] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast({
        message: "Successfully sent to admin",
        type: "success",
        duration: 5000,
      });

      setDestination("");
      setEscort("");
      setVehicleNumber("");
      setDriverName("");
      setGoodsOwner("");
      setSelectedAdminId("");
    } catch (error) {
      console.log(error);
      showToast({
        message: "An error occurred while creating the gate pass",
        type: "error",
        duration: 5000,
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <b className="text-[#434343] font-amsterdam text-lg">Gate Pass Note</b>
      </div>
      <form className="my-8" onSubmit={submitForm}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div>
            <label>Driver's Name</label>
            <TextField.Root
              size="3"
              className="mt-2"
              placeholder="Enter Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label>Escort's Name</label>
            <TextField.Root
              size="3"
              className="mt-2"
              placeholder="Input Name"
              value={escort}
              onChange={(e) => setEscort(e.target.value)}
            />
          </div>
          <div>
            <label>Vehicle No</label>
            <TextField.Root
              size="3"
              className="mt-2"
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label>Owner of Goods</label>
            <TextField.Root
              size="3"
              className="mt-2"
              placeholder="Enter Owner of Goods"
              value={goodsOwner}
              onChange={(e) => setGoodsOwner(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label>Destination</label>
            <TextField.Root
              size="3"
              className="mt-2"
              placeholder="Enter Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div>
            <label>Send To:</label>
            <Select.Root
              value={selectedAdminId}
              onValueChange={setSelectedAdminId}
              disabled={superAdmins.length === 0}
            >
              <Select.Trigger className="w-full mt-2" />
              <Select.Content>
                {superAdmins.map((admin) => (
                  <Select.Item key={admin.id} value={admin.id}>
                    {`${admin.firstname} ${admin.lastname}`} ({admin.role?.name})
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <Flex justify="end">
          <Button
            size="4"
            className="bg-theme cursor-pointer font-amsterdam"
            disabled={buttonLoading}
          >
            {buttonLoading ? <LoaderIcon className="animate-spin" /> : "Submit"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateGatepass;
