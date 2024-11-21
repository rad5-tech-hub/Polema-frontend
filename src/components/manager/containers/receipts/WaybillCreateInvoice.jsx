import React, { useState } from "react";

const WaybillCreateInvoice = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
  const [selectedRecipient, setSelectedRecipient] = useState(""); // Track selected recipient
  const [selectedTransport, setSelectedTransport] = useState(""); // Track selected transport method

  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleTransportChange = (e) => {
    setSelectedTransport(e.target.value);
  };

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343]">Waybill</b>
        <button className="btn border text-[#919191] border-[#919191] px-6 rounded-lg h-[40px]">
          View all
        </button>
      </div>
      <form className="my-8">
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>To (Driver's Name)</label>
            <input
              type="text"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="address">
            <label>Address</label>
            <input
              type="text"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="transport-carried-out-by">
            <label>Transport Carried out by</label>
            <select
              value={selectedTransport}
              onChange={handleTransportChange}
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Company Vehicle">Company Vehicle</option>
              <option value="Third-Party Logistics">
                Third-Party Logistics
              </option>
              <option value="Driver's Personal Vehicle">
                Driver's Personal Vehicle
              </option>
            </select>
          </div>
          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              type="number"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="licence-no">
            <label>Driver's Driving Licence No</label>
            <input
              type="number"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="invoice-no">
            <label>Invoice No</label>
            <input
              type="number"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="No-of-bags">
            <label>No. of Bags (Applicable only for PKC)</label>
            <input
              type="number"
              placeholder="Input the No."
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
            onClick={toggleDropdown} // Open dropdown when clicked
          >
            Send to
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 bottom-[-45px] bg-white shadow-md rounded-lg w-[200px] border border-gray-300 z-10">
              <div
                className="py-2 px-4 cursor-pointer text-gray-500 hover:bg-theme m-4 rounded-lg hover:text-white"
                onClick={() => handleSelectRecipient("MD")}
              >
                MD
              </div>
              <div
                className="py-2 px-4 cursor-pointer text-gray-500 hover:bg-theme m-4 rounded-lg hover:text-white"
                onClick={() => handleSelectRecipient("Chairman")}
              >
                Chairman
              </div>
            </div>
          )}

          {selectedRecipient && (
            <div className="text-gray-700 sm:mt-[54px] sm:ml-4">
              <b>Selected Recipient:</b> {selectedRecipient}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default WaybillCreateInvoice;
