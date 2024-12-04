import React from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import polemaLogo from "../../../../static/image/polema-logo.png";

const ReceiptDispatchNote = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-8">
      {/* Header Section */}
      <div className="intro flex justify-between items-center pb-6 border-b border-[#919191]">
        <span className="text-sm sm:text-[20px] font-semibold text-[#434343]">
          Approved Vehicle Dispatch Pass Note
        </span>
        <button
          onClick={handlePrint}
          className="rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center"
        >
          <FontAwesomeIcon icon={faPrint} />
          Print
        </button>
      </div>

      {/* Main Gatepass Content */}
      <div className="mt-8 bg-white p-4 sm:p-16">
        <div className="heading relative h-fit">
          {/* Header Title */}
          <div className="flex flex-col gap-4 sm:gap-28 text-center">
            <h1 className="text-[24px] sm:text-[48px] font-bold text-[#434343]">
              POLEMA INDUSTRIES LIMITED
              <br /> ABA
            </h1>
            <h3 className="text-[#919191] text-[18px] sm:text-[32px] font-bold w-fit mx-auto border-b-2 border-[#919191]">
              VEHICLE DESPATCH NOTE{" "}
            </h3>
          </div>

          {/* Logo */}
          <div className="logo absolute top-4 sm:top-8">
            <img
              src={polemaLogo}
              alt="polema-logo"
              className="w-16 sm:w-24 h-auto"
            />
          </div>

          {/* RC Information */}
          <div className="rc flex flex-col absolute right-[5%] sm:right-[15%] top-[5%] sm:top-[10%] gap-4 sm:gap-24">
            <p className="w-fit">
              <i>RC 131127</i>
            </p>
            <b>
              <i className="text-[#D2D2D2] font-bold text-[18px] sm:text-[32px]">
                0818
              </i>
            </b>
          </div>

          {/* Details Section */}
          <div className="details mt-8 sm:mt-12 flex flex-col gap-4 sm:gap-[25px]">
            {/* Single Detail Template */}
            {[
              ["Date", "06-12-24"],
              ["Driver's Name", "Ugwuanyi Chibuikem Christian"],
              ["Escort's Name", "Chukwuemeka Dennison Igwe"],
              ["Vehicle No", "HTE 713 YIS"],
              ["Destination", "Chinedu Godman"],
              ["Time of Departure", "03:13PM"],
              ["Authorized By", "Transport Manager"],
            ].map(([label, value], idx) => (
              <div
                key={idx}
                className={`flex flex-wrap gap-2 items-center ${
                  label === "Date"
                    ? "justify-end"
                    : "justify-between sm:justify-start"
                }`}
              >
                <label
                  className={`font-semibold truncate ${
                    label === "Date" ? "w-auto mr-4" : "w-1/3 sm:w-auto"
                  }`}
                >
                  {label}:
                </label>
                <p
                  className={`border-b border-black border-dotted flex-grow text-sm sm:text-base ${
                    label === "Date" ? "w-auto text-right" : ""
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}

            {/* Admin Officer's Signature */}
            <div className="owner-of-goods w-full flex justify-between gap-2 sm:gap-4  mt-12 sm:mt-24">
              <div className="flex flex-col gap-4">
                <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                <label className="w-fit text-sm sm:text-base ml-4">
                  DRIVER’S SIGNATURE
                </label>
              </div>
              <div className="flex flex-col gap-4">
                <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                <label className="w-fit text-sm sm:text-base ml-4">
                  CASHIER’S SIGNATURE
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDispatchNote;
