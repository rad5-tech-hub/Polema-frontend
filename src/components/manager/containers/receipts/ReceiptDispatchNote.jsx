import React, { useEffect, useState } from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import polemaLogo from "../../../../static/image/polema-logo.png";

// Tailwind CSS loader using animation classes
const ReceiptDispatchNote = () => {
  const { id } = useParams();

  console.log("ID from URL: ", id); // Check if ID is available from URL

  const [dispatchNote, setDispatchNote] = useState({
    driversName: "",
    vehicleNo: "",
    escortName: "",
    destination: "",
    approvedBy: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true); // State for loading

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (!id) {
      console.error("ID is not available!");
      return;
    }

    console.log(
      `Fetching data from:${root}g/customer/view-vehicle/${id}`
    );

    // Fetch data from API
    axios
      .get(`${root}/customer/view-vehicle/${id}`)
      .then((response) => {
        console.log("API Response:", response); // Log the full response
        const data = response.data.vehicle; // Access the 'vehicle' object inside the response
        if (data) {
          setDispatchNote({
            driversName: data.driversName || "Not Available",
            vehicleNo: data.vehicleNo || "Not Available",
            escortName: data.escortName || "Not Available",
            destination: data.destination || "Not Available",
            approvedBy: data.approvedBy || "Not Available",
            createdAt: data.createdAt || "",
          });
          setLoading(false); // Data is fetched, hide loader
        } else {
          console.error("No vehicle data found for the given ID");
          setLoading(false); // Even on error, hide loader
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Hide loader in case of error
      });
  }, [id]); // Ensure useEffect reruns when `id` changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-theme border-solid rounded-full animate-spin"></div>{" "}
        {/* Tailwind CSS loader */}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-8">
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

      <div className="mt-8 bg-white p-4 sm:p-16">
        <div className="heading relative h-fit">
          <div className="flex flex-col gap-4 sm:gap-28 text-center">
            <h1 className="text-[24px] sm:text-[48px] font-bold text-[#434343]">
              POLEMA INDUSTRIES LIMITED
              <br /> ABA
            </h1>
            <h3 className="text-[#919191] text-[18px] sm:text-[32px] font-bold w-fit mx-auto border-b-2 border-[#919191]">
              VEHICLE DESPATCH NOTE{" "}
            </h3>
          </div>

          <div className="logo absolute top-4 sm:top-8">
            <img
              src={polemaLogo}
              alt="polema-logo"
              className="w-16 sm:w-24 h-auto"
            />
          </div>

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

          <div className="details mt-8 sm:mt-12 flex flex-col gap-4 sm:gap-[25px]">
            {[
              ["Date", new Date(dispatchNote.createdAt).toLocaleDateString()],
              ["Driver's Name", dispatchNote.driversName || "Not Available"],
              ["Escort's Name", dispatchNote.escortName || "Not Available"],
              ["Vehicle No", dispatchNote.vehicleNo || "Not Available"],
              ["Destination", dispatchNote.destination || "Not Available"],
              [
                "Time of Departure",
                new Date(dispatchNote.createdAt).toLocaleTimeString(),
              ],
              ["Authorized By", dispatchNote.approvedBy || "Not Available"],
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
                  className={`border-b pl-6 border-black border-dotted flex-grow text-sm sm:text-base ${
                    label === "Date" ? "w-auto text-right" : ""
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}

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
                  APPROVING OFFICER’S SIGNATURE
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
