import React, { useRef, useState } from "react";
import { refractor } from "../../../date";
import { Spinner } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import {Button, Dropdown, Menu } from "antd";
import polemaLogo from "../../../../static/image/polema-logo.png";
import toast, { Toaster } from "react-hot-toast";

const OfficialReceipt = () => {
  const { id } = useParams();

  const [fetchComplete, setFetchComplete] = useState(false);
  const [loadingId, setLoadingId] = useState(null); 

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

    // Handle sending dispatch note to print
    const handleSendToPrint = async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in again.", { style: { padding: "15px" }, duration: 10000 });
        return;
      }
  
      setLoadingId(id);
      try {
        await axios.post(
          `${root}/batch/add-official-receipt-to-print/${id}`, // Adjust endpoint as needed
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        toast.success("Offical Receipt sent to print successfully!", {
          style: { padding: "20px" },
          duration: 4000,
        });
      } catch (error) {
        console.error("Error sending official reciept to print:", error);
        toast.error(error.response?.data?.message || "Failed to send dispatch note to print.");
      } finally {
        setLoadingId(null);
      }
    };
  

  const handlePrint = () => {
    if (receiptRef.current) {
      window.print();
    }
  };
  // Dropdown menu for print actions
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === "print") {
          handlePrint();
        } else if (key === "sendToPrint") {
          handleSendToPrint(id);
        }
      }}
      className="no-print"
    >
      <Menu.Item key="print">Print</Menu.Item>
      <Menu.Item key="sendToPrint">Send to Print</Menu.Item>
    </Menu>
  );

  return (
    <>
      <style>
        {`
        @media print {
          .no-print {
            display: none !important;
          }
          * {
            box-shadow: none !important;
          }
          .footerMoney {
            display: flex !important;
            justify-content: space-between !important;
            gap: 5px;
          }
        }
        `}
      </style>
      {!fetchComplete ? (
        // Loader Screen
        <div className="loading h-screen bg-black/40 flex justify-center items-center">
          <Spinner size={"3"} />
        </div>
      ) : (
        <div ref={receiptRef} className="p-6 sm:p-12 bg-gray-100">
          {/* Header Section */}
          <div className="no-print flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-[20px] font-semibold text-[#434343]">
              Official Receipt
            </span>
            <div className="w-fit">
              {!loadingId ? <Dropdown overlay={menu} trigger={["click"]}>
                <button className="rounded-lg border-[1px] border-[#919191] p-2 shadow-lg text-sm sm:text-base cursor-pointer w-full lg:w-auto">
                  Select Action
                </button>
              </Dropdown> : <Button> <Spinner size={3}/> </Button>}
            </div>
          </div>

          {/* Details Section */}
          <div className="details bg-white mt-8 rounded p-6">
            {/* Logo, RC, and Company Info */}
            <div className="relative">
              <h5 className="text-[24px] font-bold text-[#434343] text-center">
                POLEMA INDUSTRIES LIMITED
              </h5>
              {/* <div className="absolute right-[10%] text-[12px] sm:text-[16px] font-semibold italic">
                RC 131127
              </div> */}
              <p className="font-semibold text-center text-sm">
                Manufacturers & Exporters of Palm Kernel Oil, Palm Kernel Cakes,
                and Drugs
              </p>

              {/* Logo and Addresses */}
              <div className="flex gap-4 items-center justify-center">
                <img
                  src={polemaLogo}
                  alt="Polema-logo"
                  className="h-[120px] object-contain"
                />
                <div className="text-sm  flex items-center gap-3">
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
              <h4 className="font-semibold text-[18px] text-[#919191] mt-4 border-b-2 border-[#D2D2D2] mx-auto w-fit">
                OFFICIAL RECEIPT
              </h4>

              {/* Receipt Number */}
              <div className="receiptNo absolute top-[320px] right-[10%] italic rotate-6 font-bold text-[24px] sm:text-[32px] text-[#D2D2D2]">
                0818
              </div>
            </div>

            {/* Receipt Details */}
            <div className="descriptions">
              <div className="w-full details mt-6 flex flex-col gap-2 sm:gap-4">
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
            <div className="footerMoney mt-12 sm:mt-20 flex justify-between items-center gap-8">
              <div className="amount ">
                <button className="border-[1px] border-[#919191] text-[#919191] h-fit rounded-lg bg-[#F9F9F9] w-fit text-start px-4 py-3">
                  ₦ {formatMoney(receiptDetails.cashier.credit)}
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
      <Toaster position="top-right" />

    </>
  );
};

export default OfficialReceipt;
