import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
import { Select } from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;
import useToast from "../../../../hooks/useToast";

const CreateInvoice = () => {
  const { id } = useParams();
  const showToast = useToast()
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [customer, setCustomer] = useState("");
  const [customerId, setCustomerId] = useState("");

  // Fetch transaction details
  const TransDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", { duration: 5000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customerInfo = response.data.ledger?.customerId;
      setCustomerId(customerInfo);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch customer details.");
    }
  };

  // Fetch customer details
  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", { duration: 5000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customerInfo = response.data.customer;
      setCustomerData(customerInfo);
      setCustomer(`${customerInfo.firstname} ${customerInfo.lastname}`);
      setAddress(customerInfo.address || "loading");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch customer details.");
    }
  };

  // Fetch admin list
  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", { duration: 10000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch admins.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      setBtnLoading(false);
      return;
    }
    if (!adminId) {
      showToast({
        message: "Please select an admin to send the invoice to.",
        type: "error",
        duration: 5000,
      }
      )
      return;
    }
    setBtnLoading(true);
    try {
      const response = await axios.post(
        `${root}/customer/create-invoice/${id}`,
        { adminId, customerName: customer, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const invoiceId = response.data.invoice.id;

      await axios.post(
        `${root}/customer/sendInvoice/${invoiceId}`,
        { adminIds: [adminId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast({
        message: "Invoice created and sent successfully.",
        type: "success",
        duration:5000
      })
      
      setBtnLoading(false);

      setTimeout(() => {
        
        navigate("/admin/receipts/invoice");
      },3000)
    } catch (error) {
      console.log(error);
      showToast({
        message: "An error occurred, please try again.",
        type: "error",
        duration: 5000,
      })
      
      setBtnLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAdmins();
    TransDetails();
    if (customerId) {
      fetchDetails();
    }
  }, [id, customerId]);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343] text-lg">Invoice</b>
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-y-[1px] border-[#9191914] py-8">
          <div className="customer-name">
            <label>Customer Name</label>
            <input
              type="text"
              disabled
              placeholder="Enter Customer Name"
              value={customer}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="customer-address">
            <label>Customer's Address</label>
            <input
              type="text"
              disabled
              placeholder="Enter Address"
              value={address}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <p>Send To:</p>
            <Select.Root
              size={"3"}
              required
              disabled={superAdmins.length === 0}
              value={adminId} // Bind the value to adminId state
              onValueChange={(val) => setAdminId(val)} // Update adminId on change
            >
              <Select.Trigger className="w-full mt-2" placeholder="Select Admin" />
              <Select.Content position="popper">
                {superAdmins.map((admin) => (
                  <Select.Item key={admin.role?.id} value={admin.role?.id || " "}>
                    {`${admin.firstname} ${admin.lastname}`}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root> 
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            disabled={btnLoading}
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
          >
            {btnLoading ? <LoaderIcon /> : "Send"}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateInvoice;