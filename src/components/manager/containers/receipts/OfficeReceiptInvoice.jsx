import React, { useState } from "react";

const OfficialReceiptInvoice = () => {
  const [openDropdown, setOpenDropdown] = useState(""); // Tracks which dropdown is open
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <b className="text-[#434343]">Official Receipt</b>
      </div>
      <form className="my-8">
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Received From</label>
            <input
              type="text"
              placeholder="Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="Escorts-name">
            <label>of</label>
            <input
              type="text"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="amount">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Amount"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="Destination">
            <label>Being</label>
            <input
              type="text"
              placeholder="input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            type="button" // Ensures it's treated as a regular button, not a form submission button
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
          >
            Generate Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfficialReceiptInvoice;
