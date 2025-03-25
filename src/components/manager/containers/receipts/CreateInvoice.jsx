import axios from "axios";
import { Select } from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;
import React, { useState, useEffect } from "react";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";

const CreateInvoice = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [address, setAddress] = useState("");

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", {
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntry(response.data.ledgerSummary);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch customer details.");
    }
  };

  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.", {
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch admins.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${root}/customer/create-invoice/${id}`,
        { adminId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const invoiceId = response.data.invoice.id;

      const secondResponse = await axios.post(
        `${root}/customer/sendInvoice/${invoiceId}`,
        {
          adminIds:[adminId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Invoice created and sent successfully.", {
        duration: 10000,
        style: {
          padding: "20px",
        },
        
      });
      setAddress("")
      setBtnLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred, please try again", {
        duration: 7000,
      });
      toast.error("Failed to create invoice.");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchDetails();
  }, [id]);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343]">Invoice</b>
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-y-[1px] border-[#9191914] py-8">
          <div className="customer-name">
            <label>Customer Name</label>
            <input
              type="text"
              // disabled
              value={
                entry?.ledgerEntries?.[0]?.customer
                  ? `${entry.ledgerEntries[0].customer.firstname} ${entry.ledgerEntries[0].customer.lastname}`
                  : ""
              }
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="customer-address">
            <label>Customer's Address</label>
            <input
              type="text"
              placeholder="Enter Address"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <div>
            <p>Send To:</p>
            <Select.Root
              size={"3"}
              required
              disabled={superAdmins.length === 0}
              onValueChange={(val) => setAdminId(val)}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Admin"
              />
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
