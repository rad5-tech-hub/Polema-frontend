import React, { useRef, useState } from "react";
import { refractor } from "../../../date";
import { Spinner } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import polemaLogo from "../../../../static/image/polema-logo.png";
import toast, { Toaster } from "react-hot-toast";

const OfficialReceipt = () => {
  const { id } = useParams();

  const [fetchComplete, setFetchComplete] = useState(false);

  const [receiptDetails, setReceiptDetails] = useState({});
  // Function to fetch receipt details
  const fetchDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    try {
      const resposnse = await axios.get(`${root}/customer/get-official/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReceiptDetails(resposnse.data.receipt);
      setFetchComplete(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Funciton to format money
  function formatMoney(value, separator = ",") {
    if (typeof value !== "number" && typeof value !== "string") {
      throw new Error("Value must be a number or a string.");
    }

    const [integerPart, decimalPart] = value.toString().split(".");
    const formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      separator
    );

    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  }

  React.useEffect(() => {
    fetchDetails();
  }, []);

  const receiptRef = useRef();

  const handlePrint = () => {
    if (receiptRef.current) {
      window.print();
    }
  };

  return (
    <>
      {!fetchComplete ? (
        // Loader Screen
        <div className="loading h-screen bg-black/40 flex justify-center items-center">
          <Spinner size={"3"} />
        </div>
      ) : (
        <div ref={receiptRef} className="p-6 sm:p-12 bg-gray-100">
          {/* Header Section */}
          <div className="intro flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-[20px] font-semibold text-[#434343]">
              Official Receipt
            </span>
            <button
              onClick={handlePrint}
              className="rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center print-hidden"
            >
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>

          {/* Details Section */}
          <div className="details bg-white mt-8 rounded p-8 sm:p-16">
            {/* Logo, RC, and Company Info */}
            <div className="relative">
              <h1 className="text-[24px] sm:text-[44px] font-bold text-center">
                POLEMA INDUSTRIES LIMITED
              </h1>
              {/* <div className="absolute right-[10%] text-[12px] sm:text-[16px] font-semibold italic">
                RC 131127
              </div> */}
              <p className="font-bold text-center text-sm sm:text-base">
                Manufacturers & Exporters of Palm Kernel Oil, Palm Kernel Cakes,
                and Drugs
              </p>

              {/* Logo and Addresses */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center max-sm:mt-8">
                <img
                  src={polemaLogo}
                  alt="Polema-logo"
                  className="w-[100px] sm:w-[150px]"
                />
                <div className="text-sm sm:text-base flex flex-col sm:flex-row justify-between sm:gap-12 w-full mt-4 sm:mt-0">
                  <div className="sm:w-1/2">
                    <b>FACTORY/OFFICE:</b>
                    <br /> Osisioma Industry Layout,
                    <br /> Osisioma L.G.A, Abia State.
                    <br /> Tel: 08065208084
                    <br /> Email: polema_@yahoo.com
                  </div>
                  <div className="sm:w-1/2">
                    <b>ADMIN OFFICE:</b>
                    <br /> Mobison Corporate Tower,
                    <br /> 32/34 Faulks Road,
                    <br /> P.O. Box 2582, Aba, Nigeria.
                    <br /> Tel: 07028670220
                    <br /> Email: onwaobiec@yahoo.com
                  </div>
                </div>
              </div>

              {/* Receipt Title */}
              <h4 className="font-bold text-[20px] sm:text-[32px] text-[#919191] mt-12 border-b-2 border-[#D2D2D2] mx-auto w-fit">
                OFFICIAL RECEIPT
              </h4>

              {/* Receipt Number */}
              <div className="receiptNo absolute top-[320px] sm:top-[355px] right-[10%] italic rotate-6 font-bold text-[24px] sm:text-[32px] text-[#D2D2D2]">
                0818
              </div>
            </div>

            {/* Receipt Details */}
            <div className="descriptions mt-8">
              <div className="w-full details mt-8 sm:mt-12 flex flex-col gap-2 sm:gap-4">
                {[
                  ["Date", refractor(receiptDetails.createdAt)],
                  ["Received from", receiptDetails.cashier.name],
                  ["of", receiptDetails.of],
                  ["The sum of", receiptDetails.cashier.credit],
                  ["Being", receiptDetails.being],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <label className="font-semibold text-sm sm:text-base">
                      {label}:
                    </label>
                    <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base px-8">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount and Receiver's Signature */}
            <div className="mt-12 sm:mt-24 flex flex-col sm:flex-row justify-between items-center gap-8">
              <div className="amount w-full sm:w-auto">
                <button className="border-[1px] border-[#919191] text-[#919191] rounded-lg h-[44px] bg-[#F9F9F9] w-full sm:w-[191px] text-start px-4 print-hidden">
                  # {formatMoney(receiptDetails.cashier.credit)}
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                <label className="text-sm sm:text-base mt-2">
                  RECEIVER’S SIGNATURE
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfficialReceipt;
