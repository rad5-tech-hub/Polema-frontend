import React, { useState } from "react";

const CreateInvoice = () => {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("PM");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
  const [selectedRecipient, setSelectedRecipient] = useState(""); // Track selected recipient

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  ); // 01 to 12
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  ); // 00 to 59
  const periods = ["AM", "PM"];

  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="p-6 relative mb-16">
      <div className="invoice flex justify-between items-center py-2">
        <b className="text-[#434343]">Invoice</b>
        <button className="btn border text-[#919191] border-[#919191] px-6 rounded-lg h-[40px]">
          View all
        </button>
      </div>
      <form className="my-8">
        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8 border-y-[1px] border-[#9191914] py-8">
          <div className="customer-name">
            <label>Customer Name</label>
            <input
              type="text"
              placeholder="Adaku"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="customer-address">
            <label>Customer's Address</label>
            <input
              type="text"
              placeholder="Adaku"
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
          <div className="date">
            <label>Date</label>
            <input
              type="date"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="timeout relative">
            <label>Timeout</label>
            <div
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full flex items-center cursor-pointer flex justify-between"
              onClick={() => setIsTimePickerOpen((prev) => !prev)}
            >
              <span className="text-gray-700">{`${selectedHour}:${selectedMinute}`}</span>
              <span className="text-gray-700"> {`${selectedPeriod}`}</span>
            </div>
            {isTimePickerOpen && (
              <div className="absolute top-16 bg-white shadow-md rounded-lg p-4 z-50 w-full max-w-xs">
                <div className="flex justify-around items-center bg-gray-100 rounded-lg p-2 mb-4">
                  <div className="text-blue-500 font-bold">{selectedHour}</div>
                  <div className="text-blue-500 font-bold">:</div>
                  <div className="text-blue-500 font-bold">
                    {selectedMinute}
                  </div>
                  <div className="text-blue-500 font-bold">
                    {selectedPeriod}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="overflow-y-auto h-32 w-1/3 text-center no-scrollbar">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className={`py-2 px-2 text-gray-700 cursor-pointer ${
                          hour === selectedHour ? "text-blue-500 font-bold" : ""
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
                            ? "text-blue-500 font-bold"
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
                            ? "text-blue-500 font-bold"
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

        <div className="my-8 grid grid-cols-2 max-sm:grid-cols-1 gap-8">
          <div className="additional-purchase">
            <label>Additional Purchase</label>
            <input
              type="text"
              placeholder="Input Name"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="price">
            <label>Enter Price</label>
            <input
              type="number"
              placeholder="Enter Price"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="quantity-ordered">
            <label>Quantity Ordered</label>
            <input
              type="number"
              placeholder="Quantity Ordered"
              className="border border-[#8C949B40] rounded-lg px-4 h-[44px] mt-2 w-full"
            />
          </div>
          <div className="specification">
            <label>Specification and Comments</label>
            <input
              type="text"
              placeholder="Add any comment"
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
                className="py-2 px-4  cursor-pointer text-gray-500 hover:bg-theme m-4 rounded-lg hover:text-white"
                onClick={() => handleSelectRecipient("MD")}
              >
                MD
              </div>
              <div
                className="py-2 px-4  cursor-pointer text-gray-500 hover:bg-theme m-4 rounded-lg hover:text-white"
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

export default CreateInvoice;
