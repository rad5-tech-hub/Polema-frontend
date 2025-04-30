import React, { useState, useEffect } from "react";
import { LoaderIcon } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Select } from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const WaybillCreateInvoice = () => {
  const { id } = useParams();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState(null); // Initialize as `null` for type safety.
  const [selectedTransport, setSelectedTransport] = useState("");

  // State management for the form details
  const [driverLicense, setDriverLicense] = useState("");
  const [superAdmins, setSuperAdmins] = useState([]);
  const [bagNumber, setBagNumber] = useState("");
  const [carriedByWho, setCarriedByWho] = useState("");
  const [adminId, setAdminId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [address, setAddress] = useState("");

  const [driverName, setDriverName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
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
      setAddress(customerInfo.address || "Loading");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch customer details.");
    }
  };
  // Function to fetch super admins
  const fetchSuperAdmins = async () => {
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
      if (response.data?.staffList) {
        setSuperAdmins(response.data.staffList);
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (error) {
      console.error("Error fetching super admins:", error);
      toast.error("An error occurred while fetching admin list.");
    }
  };

  const handleTransportChange = (e) => {
    setCarriedByWho(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      setButtonLoading(false);
      return;
    }

    // Prepare the request body
    const body = {
      ...(bagNumber && { bags: bagNumber }),
      driversLicense: driverLicense,
      transportedBy: carriedByWho,
    };

      // console.log(body);

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

      const wayBillId = response.data?.waybill?.id;
      if (!wayBillId) {
        throw new Error("Waybill creation failed, no ID returned.");
      }

      // SECOND REQUEST: Send Waybill
      await axios.post(
        `${root}/customer/send-Waybill/${wayBillId}`,
        { adminIds:[adminId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form inputs (except disabled ones)
      setDriverLicense("");
      setBagNumber("");
      setSelectedTransport("");
      setAdminId("");
      setAddress("");
      setInvoiceNo("");

      setButtonLoading(false);
      toast.success("Waybill created and sent successfully!", {
        style: {
          padding: "20px",
        },
        duration: 10000,
      });
    } catch (error) {
      console.error("Error during request:", error);
      setButtonLoading(false);
      toast.error("An error occurred, please try again later", {
        style: {
          padding: "20px",
        },
      });
    }
  };

  useEffect(() => {
    fetchSuperAdmins();

    //get driver name and vehicle number when page loads
    setDriverName(ledgerEntries?.authToWeighTickets?.driver || "");
    setVehicleNo(ledgerEntries?.authToWeighTickets?.vehicleNo || "");
  }, []);

  useEffect(() => {      
    TransDetails();
    if (customerId) {
      fetchDetails();
    }
  }, [id, customerId]);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343] text-lg">Waybill</b>
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>To (Driver's Name)</label>
            <input
              type="text"
              placeholder="Enter Driver Name"
              onChange={(e) => setDriverName(e.target.value)}
              value={driverName}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="address">
            <label>Address</label>
            <input
              value={address}
              disabled
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Enter Address"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="transport-carried-out-by">
            <label>Transport Carried out by</label>
            <select
              required
              value={carriedByWho}
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
              placeholder="Enter Vehicle Number"
              // disabled
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="licence-no">
            <label>Driver's Driving Licence No</label>
            <input
              placeholder="Input Driver License"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
              required
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="invoice-no">
            <label>Invoice No</label>
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter Invoice No"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="No-of-bags">
            <label>No. of Bags (Applicable only for PKC)</label>
            <input
              type="number"
              value={bagNumber}
              onChange={(e) => setBagNumber(e.target.value)}
              placeholder="Input number of bags"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div>
            <label>Send To:</label>
            <Select.Root
              size="3"
              value={adminId}
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
                    key={admin.id}
                    value={admin.role?.id || " "}
                  >{`${admin.firstname} ${admin.lastname}`}</Select.Item>
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
            {buttonLoading ? <LoaderIcon /> : "Send to"}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default WaybillCreateInvoice;
