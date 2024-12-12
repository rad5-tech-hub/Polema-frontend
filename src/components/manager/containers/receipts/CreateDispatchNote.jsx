import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "@radix-ui/themes";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const CreateDispatchNote = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [superAdmins, setSuperAdmins] = useState([]);

  // State management for form details
  const [driverName, setDriverName] = useState("");
  const [escortName, setEscortName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [destination, setDestination] = useState("");

  const navigate = useNavigate();

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
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    const body = {
      escortName,
      destination,
      vehicleNo: vehicleNumber,
      driversName: driverName,
    };

    try {
      // FIRST REQUEST
      const firstRequest = await axios.post(
        `${root}/customer/create-vehicle-dispatch`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dispatchId = firstRequest.data.vehicle.id;

      // SECOND REQUEST
      await axios.post(
        `${root}/customer/send-vehicle/${dispatchId}`,
        { adminId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setButtonLoading(false);
      toast.success("Dispatch note generated and sent to the admin", {
        style: { padding: "25px" },
        duration: 10000,
      });

      // Navigate to receipt page under the `/admin` route
      navigate(`/admin/receipt/receipt-dispatchnote/${dispatchId}`);
    } catch (error) {
      console.error(error);
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2 flex justify-between">
        <b className="text-[#434343]">Vehicle Dispatch Note</b>
        <button
          className="bg-theme px-4 py-2 text-white rounded-lg hover:bg-theme/75"
          onClick={() => navigate("/admin/receipts/all-dispatchnote")}
        >
          View All
        </button>
      </div>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Driver's Name</label>
            <input
              required
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              type="text"
              placeholder="Enter Driver Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="escorts-name">
            <label>Escort's Name</label>
            <input
              value={escortName}
              onChange={(e) => setEscortName(e.target.value)}
              type="text"
              placeholder="Enter Escort Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter Vehicle Number"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="destination">
            <label>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter Destination"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="send-to">
            <label>Send To:</label>
            <Select.Root
              size={"3"}
              required
              disabled={superAdmins.length === 0}
              onValueChange={(val) => setAdminId(val)}
            >
              <Select.Trigger
                className="w-full mt-3"
                placeholder="Select Admin"
              />
              <Select.Content position="popper">
                {superAdmins.map((admin) => (
                  <Select.Item key={admin.id} value={admin.id}>
                    {`${admin.firstname} ${admin.lastname}`}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            type="submit"
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
          >
            {buttonLoading ? <LoaderIcon /> : "Send"}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateDispatchNote;
