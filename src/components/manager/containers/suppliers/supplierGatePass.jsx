import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Select, Flex, Button, Spinner } from "@radix-ui/themes";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CreateGatepassForSupplier = () => {
  const [escort, setEscort] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [destination, setDestination] = useState("");
  const [superAdmins, setSuperAdmins] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [goodsOwner, setGoodsOwner] = useState("");
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Fetch super admins
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 10000,
      });
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch admins.");
    }
  };

  // Fetch raw materials
  const fetchRawMaterials = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 10000,
      });
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRawMaterials(response.data.products || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch raw materials.");
    }
  };

  // Submit form
  const submitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);
    if (!token) {
      toast.error("An error occurred, try logging in again");
      setButtonLoading(false);
      return;
    }

    const resetForm = () => {
      setDriverName("");
      setEscort("");
      setVehicleNumber("");
      setGoodsOwner("");
      setDestination("");
      setAdminId("");
      setSelectedProductId("");
    };

    const body = {
      escortName: escort,
      destination,
      driver: driverName,
      vehicleNo: vehicleNumber,
      owner: goodsOwner,
      productId: selectedProductId,
    };

    try {
      const response = await axios.post(
        `${root}/customer/create-supplier-gatepass`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Second API request to send gate pass to admin
      const passID = response.data.gatepass.id;
      const secondResponse = await axios.post(
        `${root}/customer/send-gate-pass/${passID}`,
        {
          adminIds: [adminId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      toast.error("Failed to create gate pass.");
      setButtonLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchSuperAdmins();
    fetchRawMaterials();    
  },[]);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <h3 className="text-[#434343] text-lg">Supplier Gate Pass Note</h3>
      </div>
      <form className="my-8" onSubmit={submitForm}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Driver's Name</label>
            <input
              type="text"
              placeholder="Enter Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="escorts-name">
            <label>Escort's Name</label>
            <input
              type="text"
              value={escort}
              onChange={(e) => setEscort(e.target.value)}
              placeholder="Input Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              type="text"
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="owner">
            <label>Owner of Goods</label>
            <input
              type="text"
              placeholder="Enter Owner of Goods"
              value={goodsOwner}
              onChange={(e) => setGoodsOwner(e.target.value)}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Destination</label>
            <TextField.Root
              size={"3"}
              className="mt-2"
              placeholder="Enter Destination"
              value={destination || ''}            
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Raw Material</label>
            <Select.Root
              size={"3"}
              disabled={rawMaterials.length === 0}
              onValueChange={(value) => setSelectedProductId(value)}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Raw Material"
              />
              <Select.Content position="popper">
                {rawMaterials.map((material) => (
                  <Select.Item key={material.id} value={material.id}>
                    {material.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <label htmlFor="">Send To:</label>
            <Select.Root
              size={"3"}
              disabled={superAdmins.length === 0}
              onValueChange={(value) => setAdminId(value)}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Admin"
              />
              <Select.Content position="popper">
                {superAdmins.map((admin) => (
                  <Select.Item
                    key={admin.role?.id}
                    value={admin.role?.id || ""}
                  >
                    {`${admin.firstname} ${admin.lastname}`}
                  </Select.Item>
                ))}
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

export default CreateGatepassForSupplier;