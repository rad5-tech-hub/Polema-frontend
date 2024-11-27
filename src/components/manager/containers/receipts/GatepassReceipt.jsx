import React, { useState } from "react";
import { refractor, refractorToTime } from "../../../date";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { Card, Spinner } from "@radix-ui/themes";
import polemaLogo from "../../../../static/image/polema-logo.png";
import toast, { Toaster } from "react-hot-toast";
const GatepassReceipt = () => {
  const { id } = useParams();
  const [gatePassLoading, setGatePassLoading] = useState(true);
  const [passDetails, setPassDetails] = useState({});
  const [failedSearch, setFailedSearch] = useState(false);

  // Function to view gatepass details
  const viewGatePass = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred ,try logging in again", {
        duration: 10000,
        style: {
          padding: "20px",
        },
      });
    }

    try {
      const response = await axios.get(`${root}/customer/view-gatepass/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGatePassLoading(false);

      setPassDetails(response.data.gatePass);
    } catch (error) {
      console.log(error);
      // setFailedSearch(true);
    }
  };

  React.useEffect(() => {
    viewGatePass();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-8">
      {gatePassLoading ? (
        <div className="w-full bg-black/35 flex justify-center items-center h-screen">
          {failedSearch ? (
            <Card className="bg-red-400">An error occurred ,try again</Card>
          ) : (
            <Spinner />
          )}
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="intro flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-[20px] font-semibold">
              Approved Gate Pass Note
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
                <h1 className="text-[24px] sm:text-[48px] font-bold">
                  POLEMA INDUSTRIES LIMITED
                  <br /> ABA
                </h1>
                <h3 className="text-[#919191] text-[18px] sm:text-[32px] font-bold w-fit mx-auto border-b-2 border-[#919191]">
                  GATE PASS NOTE
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
                  ["Date", refractor(passDetails.createdAt)],
                  [
                    "Driver's Name",
                    passDetails.transaction.authToWeighTickets === null
                      ? ""
                      : passDetails.transaction?.authToWeighTickets?.driver ||
                        "",
                  ],
                  ["Escort's Name", passDetails.escortName],
                  [
                    "Vehicle No",
                    passDetails.transaction.authToWeighTickets === null
                      ? ""
                      : passDetails.transaction?.authToWeighTickets?.driver ||
                        "",
                  ],
                  [
                    "Goods/Invoice No",
                    passDetails.transaction.waybill === null
                      ? ""
                      : passDetails.transaction.waybill.invoice.invoiceNumber,
                  ],
                  [
                    "Owner of Goods",
                    `${passDetails.transaction.corder.firstname} ${passDetails.transaction.corder.lastname}`,
                  ],
                  ["Destination", passDetails.destination],
                  ["Time of Departure", refractorToTime(passDetails.createdAt)],
                  ["Authorized By", ""],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap gap-2 items-center justify-between sm:justify-start"
                  >
                    <label className="w-1/3 sm:w-auto font-semibold truncate">
                      {label}:
                    </label>
                    <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base">
                      {value}
                    </p>
                  </div>
                ))}

                {/* Admin Officer's Signature */}
                <div className="owner-of-goods w-full flex flex-col gap-2 sm:gap-4 items-end mt-12 sm:mt-24">
                  <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                  <label className="w-fit text-sm sm:text-base">
                    ADMIN OFFICER’S SIGNATURE
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GatepassReceipt;
