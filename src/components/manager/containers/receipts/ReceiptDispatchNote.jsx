import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import polemaLogo from "../../../../static/image/polema-logo.png";
import { refractor } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const ReceiptDispatchNote = () => {
  const { id } = useParams();
  const [dispatchNote, setDispatchNote] = useState({
    driversName: "",
    vehicleNo: "",
    escortName: "",
    destination: "",
    approvedBy: "",
    createdAt: "",
    prepareBy: "",
    prepareByRoleName: "",
    prepareByRoleFirstName: "",
    prepareByRoleLastName: "",
    approvedByRoleSignature: "",
    approvedByRoleFirstName: "",
    approvedByRoleLastName: "",
  });
  const [loading, setLoading] = useState(true);
  const [signatureError, setSignatureError] = useState({
    prepareBy: false,
    approvedBy: false,
  });

  // Fetch dispatch note data
  useEffect(() => {
    if (!id) {
      toast.error("Invalid dispatch note ID", {
        duration: 5000,
        style: { padding: "20px" },
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${root}/customer/view-vehicle/${id}`);
        const data = response.data.vehicle;
        if (data) {
          setDispatchNote({
            driversName: data.driversName || "Not Available",
            vehicleNo: data.vehicleNo || "Not Available",
            escortName: data.escortName || "Not Available",
            destination: data.destination || "Not Available",
            approvedBy: data.approvedBy || "Transport Manager",
            createdAt: data.createdAt || "",
            prepareBy: data.preparedByRole?.admins?.[0]?.signature || "",
            prepareByRoleName: data.preparedByRole?.name || "",
            prepareByRoleFirstName: data.preparedByRole?.admins?.[0]?.firstname || "",
            prepareByRoleLastName: data.preparedByRole?.admins?.[0]?.lastname || "",
            approvedByRoleSignature: data.approvedByRole?.admins?.[0]?.signature || "",
            approvedByRoleFirstName: data.approvedByRole?.admins?.[0]?.firstname || "",
            approvedByRoleLastName: data.approvedByRole?.admins?.[0]?.lastname || "",
          });
        } else {
          toast.error("No vehicle data found", {
            duration: 5000,
            style: { padding: "20px" },
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch dispatch note", {
          duration: 5000,
          style: { padding: "20px" },
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle signature image load error
  const handleSignatureError = (type) => {
    setSignatureError((prev) => ({ ...prev, [type]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-theme border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

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
            .signature-img {
              max-width: 150px !important;
              height: auto !important;
            }
          }
        `}
      </style>

      <div className="bg-gray-50 p-4 sm:p-8">
        <div className="intro flex flex-row justify-center lg:justify-between items-center gap-5 no-print pb-6 border-b border-[#919191]">
          <div className="w-full max-w-[300px] lg:w-auto text-center lg:text-left">
            <h3 className="text-sm sm:text-[20px] font-semibold text-[#434343]">
              Approved Vehicle Dispatch Pass Note
            </h3>
          </div>

          <div className="w-fit lg:text-end text-center">
            <button
              onClick={handlePrint}
              className="rounded-lg border-[1px] border-[#919191] px-8 shadow-lg text-sm sm:text-base cursor-pointer p-2"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-4 sm:p-16">
          <div className="heading relative h-fit">
            <div className="flex justify-between items-center gap-4">
              {/* Logo Section */}
              <div className="flex flex-col items-start">
                <img
                  src={polemaLogo}
                  alt="Polema Industries Logo"
                  className="w-16 sm:w-24 h-auto"
                />
              </div>

              {/* Heading and RC Section */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-[25px] sm:text-[32px] font-bold text-[#434343]">
                  POLEMA INDUSTRIES LIMITED
                </h1>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-[#434343]">
                  A DIVISION OF POLEMA INDUSTRIES LIMITED
                </p>
                <p className="text-[#919191] text-lg font-semibold w-fit border-b-2 border-[#919191] mt-2">
                  VEHICLE DISPATCH NOTE
                </p>
              </div>

              {/* RC Section */}
              <div className="flex flex-col items-end">
                <p className="text-xs sm:text-sm">
                  <i>RC 131127</i>
                </p>
              </div>
            </div>

            <div className="details mt-8 sm:mt-12 flex flex-col gap-4 sm:gap-[25px]">
              {[
                ["Date", refractor(dispatchNote.createdAt)],
                ["Driver's Name", dispatchNote.driversName || "Not Available"],
                ["Escort's Name", dispatchNote.escortName || "Not Available"],
                ["Vehicle No", dispatchNote.vehicleNo || "Not Available"],
                ["Destination", dispatchNote.destination || "Not Available"],
                [
                  "Time of Departure",
                  dispatchNote.createdAt
                    ? new Date(dispatchNote.createdAt).toLocaleTimeString()
                    : "Not Available",
                ],
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
                  <label className="font-semibold truncate w-auto mr-4">
                    {label}:
                  </label>
                  <p className="border-b pl-6 border-black border-dotted flex-grow text-sm sm:text-base">
                    {value}
                  </p>
                </div>
              ))}

              <div className="signatures w-full flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 mt-12 sm:mt-24">
                {/* Driver's Signature */}
                <div className="flex flex-col gap-4">
                  <p className="border-b border-black border-dotted w-[150px] sm:w-[230px]"></p>
                  <label className="w-fit text-sm sm:text-base ml-4">
                    DRIVER’S SIGNATURE
                  </label>
                </div>

                {/* Approved By Signature */}
                <div className="flex flex-col gap-4 items-center">
                  {dispatchNote.approvedByRoleSignature && !signatureError.approvedBy ? (
                    <>
                      <img
                        src={dispatchNote.approvedByRoleSignature}
                        alt={`Signature of ${dispatchNote.approvedByRoleFirstName || "Approving Officer"}`}
                        className="signature-img w-[150px] sm:w-[230px] h-auto object-contain"
                        onError={() => handleSignatureError("approvedBy")}
                      />
                      <span>
                        {dispatchNote.approvedByRoleFirstName}{" "}
                        {dispatchNote.approvedByRoleLastName}
                      </span>
                    </>
                  ) : (
                    <p className="border-b border-black border-dotted w-[150px] sm:w-[230px] mx-auto"></p>
                  )}
                  <label className="w-fit text-sm sm:text-base text-center">
                    APPROVING OFFICER’S SIGNATURE
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export default ReceiptDispatchNote;