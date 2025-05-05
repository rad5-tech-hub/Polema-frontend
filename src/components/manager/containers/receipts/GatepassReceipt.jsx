import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Card, Spinner } from "@radix-ui/themes";
import { Switch } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import polemaLogo from "../../../../static/image/polema-logo.png";
import mobisonLogo from "../../../../static/image/mob-logo.png"; // Placeholder: Replace with actual Mobison logo path
import { refractor, refractorToTime } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const GatepassReceipt = () => {
  const { id } = useParams();
  const [gatePassLoading, setGatePassLoading] = useState(true);
  const [passDetails, setPassDetails] = useState({});
  const [failedSearch, setFailedSearch] = useState(false);
  const [isMobison, setIsMobison] = useState(false);

  // Function to view gatepass details
  const viewGatePass = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 10000,
        style: { padding: "20px" },
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/view-gatepass/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPassDetails(response.data.gatePass);
      setGatePassLoading(false);
    } catch (error) {
      console.log(error);
      setFailedSearch(true);
      setGatePassLoading(false);
      toast.error("Failed to fetch gatepass details", {
        duration: 5000,
        style: { padding: "20px" },
      });
    }
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    viewGatePass();
  }, []);

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
          }
        `}
      </style>

      <div className="bg-gray-50 p-4 sm:p-8">
        {gatePassLoading ? (
          <div className="w-full bg-black/35 flex justify-center items-center h-screen">
            {failedSearch ? (
              <Card className="bg-red-400">An error occurred, try again</Card>
            ) : (
              <Spinner />
            )}
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-row justify-center lg:justify-between items-center gap-5 no-print pb-6 border-b border-[#919191]">
              <div className="w-full max-w-[300px] lg:w-auto text-center lg:text-left">
                <h3 className="text-sm sm:text-[20px] font-semibold">
                  Approved Gate Pass Note
                </h3>
              </div>
              <div className="w-full max-w-[300px] lg:w-auto text-center">
                <Switch
                  className="custom-black-switch"
                  checked={isMobison}
                  onChange={(checked) => setIsMobison(checked)}
                />
                <p className="text-sm font-semibold mt-2 text-[#D2D2D2]">
                  {isMobison
                    ? "Switch off for Polema"
                    : "Switch on for Mobison"}
                </p>
              </div>
              <div className="lg:text-end text-center w-full">
                <button
                  onClick={() => handlePrint()}
                  className="rounded-lg border-[1px] border-[#919191] font-semibold shadow-lg text-sm sm:text-base cursor-pointer p-2 px-8"
                >
                  Print
                </button>
              </div>
            </div>

            {/* Main Gatepass Content */}
            <div className="mt-8 bg-white p-4 sm:p-16">
              <div className="heading relative h-fit">
                <div className="flex justify-between items-center gap-5">
                  {/* Logo */}
                  <div>
                    <img
                      src={isMobison ? mobisonLogo : polemaLogo}
                      alt={isMobison ? "mobison-logo" : "polema-logo"}
                      className="object-contain"
                      style={{
                        height: "100px",
                      }}
                    />
                  </div>

                  {/* Header Title */}
                  <div className="text-center">
                    <h3 className="text-[23px] font-bold text-[#434343]">
                      {isMobison
                        ? "MAOBISON INTER-LINK ASSOCIATES LTD."
                        : "POLEMA INDUSTRIES LIMITED"}
                    </h3>
                    <p className="text-[#919191] text-lg font-semibold w-fit mx-auto border-b-2 border-[#919191]">
                      GATE PASS NOTE
                    </p>
                  </div>

                  {/* RC Information */}
                  <div>
                    <p>
                      <i>{isMobison ? "RC 64084" : "RC 131127"}</i>
                    </p>
                    <b>
                      <i className="text-[#D2D2D2] font-bold text-[18px] sm:text-[32px]">
                        0818
                      </i>
                    </b>
                  </div>
                </div>

                {/* Details Section */}
                <div className="details mt-8  flex flex-col gap-4 sm:gap-[25px]">
                  {[
                    ["Date", refractor(passDetails.createdAt) || "-"],
                    [
                      "Driver's Name",
                      passDetails.transaction?.authToWeighTickets?.driver ||
                        passDetails.driver ||
                        "-",
                    ],
                    ["Escort's Name", passDetails.escortName || "-"],
                    [
                      "Vehicle No",
                      passDetails.transaction?.authToWeighTickets?.vehicleNo ||
                        passDetails.vehicleNo ||
                        "-",
                    ],
                    [
                      "Goods/Invoice No",
                      passDetails.transaction
                        ? `${
                            passDetails.transaction?.quantityloaded
                              ?.quantityLoaded || "-"
                          }  ${passDetails.transaction?.unit || "-"}  of  ${
                            passDetails.transaction?.porders?.name
                          } /
                          ${
                            passDetails.transaction.invoice?.invoiceNumber
                              ? `000${passDetails.transaction.invoice.invoiceNumber}`
                              : ""
                          }`
                        : passDetails.rawMaterial?.name || "-",
                    ],
                    [
                      "Owner of Goods",
                      passDetails.transaction
                        ? `${passDetails.transaction.corder?.firstname || ""} ${
                            passDetails.transaction.corder?.lastname || ""
                          }`.trim() || "-"
                        : passDetails.owner || "-",
                    ],
                    ["Destination", passDetails.destination || "-"],
                    [
                      "Time of Departure",
                      refractorToTime(passDetails.createdAt) || "-",
                    ],
                    [
                      "Authorized By",
                      passDetails.preparedByRole?.admins?.[0]
                        ? `${passDetails.preparedByRole.admins[0].firstname} ${passDetails.preparedByRole.admins[0].lastname}`
                        : "-",
                    ],
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

                  {/* Signatures Section */}
                  <div className="signatures w-full flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 mt-5">
                    {/* Prepared By Signature */}
                    <div className="prepared-by flex flex-col gap-2 sm:gap-4 items-start">
                      {passDetails.preparedByRole?.admins?.[0]?.signature ? (
                        <>
                          <img
                            src={passDetails.preparedByRole.admins[0].signature}
                            alt="Prepared By Signature"
                            className="object-contain"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <span>
                            {passDetails.preparedByRole?.admins?.[0]?.firstname}{" "}
                            {passDetails.preparedByRole?.admins?.[0]?.lastname}
                          </span>
                        </>
                      ) : (
                        <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                      )}
                      <label className="w-fit text-sm sm:text-base">
                        AUTHORIZED BY SIGNATURE
                      </label>
                    </div>

                    {/* Approved By Signature */}
                    <div className="approved-by flex flex-col gap-2 items-end">
                      {passDetails.approvedByRole?.admins?.[0]?.signature ? (
                        <>
                          <img
                            src={passDetails.approvedByRole.admins[0].signature}
                            alt="Approved By Signature"
                            className="object-contain"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <span>
                            {passDetails.approvedByRole?.admins?.[0]?.firstname}{" "}
                            {passDetails.approvedByRole?.admins?.[0]?.lastname}
                          </span>
                        </>
                      ) : (
                        <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                      )}
                      <label className="w-fit text-sm sm:text-base">
                        ADMIN OFFICER’S SIGNATURE
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default GatepassReceipt;
