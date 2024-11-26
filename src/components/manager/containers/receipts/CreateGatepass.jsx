import React, { useState } from "react";

import { useParams } from "react-router-dom";

const CreateGatepass = () => {
  const { id } = useParams();

  const [openDropdown, setOpenDropdown] = useState(""); // Tracks which dropdown is open
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const hours = [...Array(12).keys()].map((h) => (h + 1).toString());
  const minutes = [...Array(60).keys()].map((m) =>
    m.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(""); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(dropdown); // Open the selected dropdown
    }
  };

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setOpenDropdown("");
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setOpenDropdown("");
  };

  const handleSelectOwner = (owner) => {
    setSelectedOwner(owner);
    setOpenDropdown("");
  };

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice py-2">
        <b className="text-[#434343]">Gate Pass Note</b>
      </div>
      <form className="my-8">
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-t-[1px] border-[#9191914] py-8">
          <div className="drivers-name">
            <label>Driver's Name</label>
            <input
              type="text"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="Escorts-name">
            <label>Escort's Name</label>
            <input
              type="text"
              placeholder="Input Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="vehicle-no">
            <label>Vehicle No</label>
            <input
              type="number"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="product relative">
            <label>Product</label>
            <div
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("product")}
            >
              <span className="text-gray-700">
                {selectedProduct || "Select Product"}
              </span>
              <i className="fas fa-chevron-down text-gray-500"></i>
            </div>
            {openDropdown === "product" && (
              <div className="absolute top-20 bg-white shadow-md rounded-lg p-4 z-50 w-full">
                {["Product A", "Product B", "Product C"].map((product) => (
                  <div
                    key={product}
                    className="py-2 px-2 text-gray-700 cursor-pointer hover:bg-theme hover:text-white"
                    onClick={() => handleSelectProduct(product)}
                  >
                    {product}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="Invoice-no">
            <label>Invoice No.</label>
            <input
              type="number"
              placeholder="Input"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>

          <div className="owner relative">
            <label>Owner of Goods</label>
            <div
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("owner")}
            >
              <span className="text-gray-700">
                {selectedOwner || "Select Owner"}
              </span>
              <i className="fas fa-chevron-down text-gray-500"></i>
            </div>
            {openDropdown === "owner" && (
              <div className="absolute top-20 bg-white shadow-md rounded-lg p-4 z-50 w-full">
                {["Owner A", "Owner B", "Owner C"].map((owner) => (
                  <div
                    key={owner}
                    className="py-2 px-2 text-gray-700 cursor-pointer hover:bg-theme hover:text-white"
                    onClick={() => handleSelectOwner(owner)}
                  >
                    {owner}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="Destination">
            <label>Input Address</label>
            <input
              type="text"
              placeholder="Select customer"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="timeout relative">
            <label>Time of Departure</label>
            <div
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full flex items-center cursor-pointer justify-between"
              onClick={() => setIsTimePickerOpen((prev) => !prev)}
            >
              <span className="text-gray-700">{`${selectedHour}:${selectedMinute}`}</span>
              <span className="text-gray-700">{selectedPeriod}</span>
              <i className="fas fa-clock text-gray-500"></i>
            </div>
            {isTimePickerOpen && (
              <div className="absolute top-16 bg-white shadow-md rounded-lg p-4 z-50 w-full max-w-xs">
                <div className="flex justify-between">
                  <div className="overflow-y-auto h-32 w-1/3 text-center no-scrollbar">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className={`py-2 px-2 text-gray-700 cursor-pointer ${
                          hour === selectedHour ? "text-theme font-bold" : ""
                        }`}
                        onClick={() => setSelectedHour(hour)}
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                  <div className="overflow-y-auto h-32 w-1/3 text-center no-scrollbar">
                    {minutes.map((minute) => (
                      <div
                        key={minute}
                        className={`py-2 px-2 text-gray-700 cursor-pointer ${
                          minute === selectedMinute
                            ? "text-theme font-bold"
                            : ""
                        }`}
                        onClick={() => setSelectedMinute(minute)}
                      >
                        {minute}
                      </div>
                    ))}
                  </div>
                  <div className="overflow-y-auto h-32 w-1/3 text-center no-scrollbar">
                    {periods.map((period) => (
                      <div
                        key={period}
                        className={`py-2 px-2 text-gray-700 cursor-pointer ${
                          period === selectedPeriod
                            ? "text-theme font-bold"
                            : ""
                        }`}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="btn flex justify-end max-sm:flex-col">
          <button
            type="button" // Ensures it's treated as a regular button, not a form submission button
            className="h-[40px] bg-theme hover:bg-theme/85 text-white px-8 rounded-lg shadow-lg my-12"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              toggleDropdown("recipient"); // Open the dropdown
            }}
          >
            Send to
          </button>
          {openDropdown === "recipient" && (
            <div className="absolute right-4 bottom-[-80px] bg-white shadow-md rounded-lg p-6 z-50">
              {["Security", "Admin", "Logistics"].map((recipient) => (
                <div
                  key={recipient}
                  className="py-2 px-4 rounded-lg text-gray-700 cursor-pointer hover:bg-theme hover:text-white"
                  onClick={() => handleSelectRecipient(recipient)}
                >
                  {recipient}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateGatepass;
