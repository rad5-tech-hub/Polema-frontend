import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Select, Flex, Button, Spinner } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CreateGatepass = () => {
  const { id } = useParams();
  const [escort, setEscort] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [destination, setDestination] = useState("");
  const [entryDetails, setEntryDetails] = useState({});
  const [superAdmins, setSuperAdmins] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [goodsOwner, setGoodsOwner] = useState("");
  const [customerId, setCustomerId] = useState("");

  const TransDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-summary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const customerInfo = response.data.ledger?.customerId;
      setCustomerId(customerInfo);    
    } catch (error) {

      toast.error("Failed to fetch gate pass details");
    }
  };

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", {
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customerInfo = response.data.customer;
      setDestination(customerInfo.address || "Loading");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch customer details.");
    }
  };
  
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred ,try logging in again", {
        duration: 10000,
      });
    }
    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to submit form
  const submitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    const resetForm = function () {
      setDestination("");
      setEscort("");
    };
    const body = {
      escortName: escort,
      destination,
    };
    try {
      const response = await axios.post(
        `${root}/customer/create-gatepass/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SECOND API REQUEST
      const passID = response.data.gatepass.id;

      const secondResponse = await axios.post(
        `${root}/customer/send-gate-pass/${passID}`,
        {
          adminIds: [adminId],
        }
      );
      toast.success("Successfully sent to admin", {
        style: {
          padding: "30px",
        },
        duration: 10000,
      });
      setButtonLoading(false);
      resetForm();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdmins();

    setDriverName(entryDetails.order?.authToWeighTickets?.driver || "");
    setVehicleNumber(entryDetails.order?.authToWeighTickets?.vehicleNo || "")
    setGoodsOwner(
      `${
        entryDetails.ledgerSummary?.ledgerEntries[0]?.customer?.firstname || ""
      } ${
        entryDetails.ledgerSummary?.ledgerEntries[0]?.customer?.lastname || ""
      }`
    );
  }, []);

  useEffect(() => {      
    TransDetails();
    if (customerId) {
      fetchDetails();
    }
  }, [id, customerId]);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <b className="text-[#434343] font-amsterdam text-lg">Gate Pass Note</b>
      </div>
      <form className="my-8" onSubmit={submitForm}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Driver's Name</label>
            <input
              type="text"
              placeholder="Enter Driver Name"
              value={driverName}
              onChange={(e) => {
                setDriverName(e.target.value);
              }}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="Escorts-name">
            <label>Escort's Name</label>
            <input
              type="text"
              value={escort}
              onChange={(e) => {
                setEscort(e.target.value);
              }}
              placeholder="Input Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              type="text"
              // disabled
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
              }}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="owner">
            <label>Owner of Goods</label>
            <input
              type="text"
              // disabled
              placeholder="Enter Owner of Goods"
              value={goodsOwner}
              onChange={(e) => {
                setGoodsOwner(e.target.value);
              }}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Destination</label>
            <TextField.Root
              size={"3"}
              className="mt-2"
              placeholder="Enter Destination"
              value={destination}
              disabled
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="">Send To:</label>
            <Select.Root
              size={"3"}
              disabled={superAdmins.length === 0}
              onValueChange={(value) => {
                setAdminId(value);
              }}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Admin"
              />
              <Select.Content position="popper">
                {superAdmins.map((admin) => {
                  return (
                    <Select.Item
                      value={admin.role?.id || " "}
                    >{`${admin.firstname} ${admin.lastname}`} ({admin.role?.name})</Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <Flex justify={"end"}>
          <Button
            size={"4"}
            className="bg-theme cursor-pointer font-amsterdam"
            disabled={buttonLoading}
          >
            {buttonLoading ? <LoaderIcon /> : "Submit"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateGatepass;
