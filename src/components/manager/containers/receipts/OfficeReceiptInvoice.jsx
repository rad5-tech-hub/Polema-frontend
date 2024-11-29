import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;
import axios from "axios";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
import { set } from "lodash";

const OfficialReceiptInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ofValue, setOfValue] = useState("");
  const [receiptDetails, setReceiptDetails] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  // Function to fetch Receipt Details
  const fetchDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("an error occurred, try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/create-official/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReceiptDetails(response.data.cashierEntry);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setBtnLoading(true);

    if (!token) {
      toast.error("an error occured , try logging in again", {
        style: {
          padding: "30px",
        },
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${root}/customer/create-official-receipt/${id}`,
        {
          of: ofValue,
          being:
            typeof receiptDetails != "string" ? receiptDetails.comment : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBtnLoading(false);
      toast.loading("Creating Receipt...", {
        style: {
          padding: "30px",
        },
        duration: 4000,
      });
      const receiptID = response.data.officialReceipt.id;

      setTimeout(() => {
        navigate(`/admin/receipt/official-receipt/${receiptID}`);
      }, 5500);
    } catch (error) {
      console.log(error);
      setBtnLoading(false);
      toast.error("an error occurred ,try again later", {
        style: {
          padding: "20px",
        },
        duration: 10000,
      });
    }
  };

  React.useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <b className="text-[#434343]">Generate Receipt</b>
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Received From</label>
            <input
              type="text"
              disabled
              value={
                typeof receiptDetails != "string" ? receiptDetails.name : ""
              }
              placeholder="Enter Sender"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="Escorts-name">
            <label>of</label>
            <input
              type="text"
              value={ofValue}
              onChange={(e) => {
                setOfValue(e.target.value);
              }}
              placeholder="Enter Details"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="amount">
            <label>Amount</label>
            <input
              disabled
              value={
                typeof receiptDetails != "string" ? receiptDetails.credit : ""
              }
              placeholder="Amount"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="Destination">
            <label>Being</label>
            <input
              type="text"
              value={
                typeof receiptDetails != "string" ? receiptDetails.comment : ""
              }
              disabled
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            type="submit" // Ensures it's treated as a regular button, not a form submission button
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
          >
            {btnLoading ? <LoaderIcon /> : "Generate Receipt"}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default OfficialReceiptInvoice;
