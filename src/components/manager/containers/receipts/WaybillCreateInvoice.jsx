import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Select } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const WaybillCreateInvoice = () => {
  const { id } = useParams();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("");

  // State management for the form details
  const [driverLicense, setDriverLiscense] = React.useState("");
  const [superAdmins, setSuperAdmins] = React.useState([]);
  const [bagNumber, setBagNumber] = React.useState("");
  const [carriedByWho, setCarriedByWho] = React.useState("");
  const [adminId, setAdminId] = useState("");
  const [wayBillId, setWayBillId] = useState("");

  // Function to fetch entry details
  const fetchEntryDetails = async () => {
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
      setLedgerEntries(response.data.order);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred ,try again.");
    }
  };

  //  Function to fetch super admins
  const fetchSuperAdmmins = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
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
    }
  };

  const handleTransportChange = (e) => {
    setSelectedTransport(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    // Prepare the request body
    const body = {
      ...(bagNumber && { bags: bagNumber }),
      driverLicense: driverLicense,
      transportedBy: carriedByWho,
    };

    try {
      // FIRST REQUEST: Create Waybill
      const response = await axios.post(
        `${root}/customer/create-waybill/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const wayBillId = response.data.waybill.id; // Extract wayBillId directly

      // SECOND REQUEST: Send Waybill
      await axios.post(
        `${root}/customer/send-Waybill/${wayBillId}`,
        { adminId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success message after both requests
      setButtonLoading(false);
      toast.success("Waybill created and sent successfully!", {
        style: {
          padding: "20px",
        },
        duration: 6000,
      });
    } catch (error) {
      console.error("Error during request:", error);
      setButtonLoading(false);
      // Show error toast
      toast.error("An error occurred, please try again later", {
        style: {
          padding: "20px",
        },
      });
    }
  };

  React.useEffect(() => {
    fetchEntryDetails();
    fetchSuperAdmmins();
  }, []);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343]">Waybill</b>
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>To (Driver's Name)</label>
            <input
              type="text"
              placeholder="Input"
              disabled
              value={ledgerEntries && ledgerEntries.authToWeighTickets.driver}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="address">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter Address"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="transport-carried-out-by">
            <label>Transport Carried out by</label>
            <select
              required
              value={selectedTransport}
              onChange={handleTransportChange}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Company">Company Vehicle</option>
              <option value="Customer">Customer Vehicle</option>
            </select>
          </div>
          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              placeholder="Input"
              disabled
              value={
                ledgerEntries && ledgerEntries.authToWeighTickets.vehicleNo
              }
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="licence-no">
            <label>Driver's Driving Licence No</label>
            <input
              placeholder="Input Driver License"
              value={driverLicense}
              onChange={(e) => {
                setDriverLiscense(e.target.value);
              }}
              required
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="invoice-no">
            <label>Invoice No</label>
            <input
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="No-of-bags">
            <label>No. of Bags (Applicable only for PKC)</label>
            <input
              type="number"
              value={bagNumber}
              onChange={(e) => {
                setBagNumber(e.target.value);
              }}
              placeholder="Input the No."
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div>
            <label>Send TO:</label>
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
                      value={admin.id}
                    >{`${admin.firstname} ${admin.lastname}`}</Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12">
            {buttonLoading ? <LoaderIcon /> : "Send to"}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default WaybillCreateInvoice;
