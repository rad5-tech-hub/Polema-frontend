import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { refractor } from "../../../date";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import polemaLogo from "../../../../static/image/polema-logo.png";
import { Spinner } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const InvoiceAuthorityToWeigh = () => {
  const [authDetails, setAuthDetails] = useState("");
  const { id } = useParams();

  // Function to get approved weigh
  const fetchApprovedWeigh = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${root}/admin/view-auth-weigh/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthDetails(response.data.ticket);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchApprovedWeigh();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-Specific Styles */}
      <style>
        {`
          @media print {
            * {
              box-shadow: none !important;
              text-shadow: none !important;
            }
            body {
              margin: 0;
              padding: 0;
              color-adjust: exact !important;
            }
            .print-hidden {
              display: none !important;
            }
            .print-border {
              border-style: dotted !important;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .flex {
              display: flex !important;
            }
            .text-center {
              text-align: center !important;
            }
            .mt-8, .mt-12 {
              margin-top: 1rem !important;
            }
            .sm\\:p-16 {
              padding: 1rem !important;
            }
            .w-32 {
              width: 8rem !important;
            }
          }
        `}
      </style>

      {!authDetails ? (
        <div className="onboarding-screen h-screen flex justify-center items-center bg-black/40">
          <h1>
            <Spinner size={"3"} />{" "}
          </h1>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 sm:p-8">
          {/* Header Section */}
          <div className="flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-lg font-semibold text-[#434343]">
              Approved Authority to Weigh
            </span>
            <button
              onClick={handlePrint}
              className="print-hidden rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>

          <div className="mt-8 bg-white p-4 sm:p-16 border border-[#ccc] rounded-md">
            <div className="relative">
              <h1 className="text-[24px] sm:text-[32px] font-bold text-[#434343] text-center mt-8">
                POLEMA INDUSTRIES LIMITED ABA
              </h1>
              <p className="text-center font-bold">
                A DIVISION OF MAOBISON INTER-LINK & ASSOCIATES LTD.
              </p>

              <div className="flex justify-between items-center max-md:px-8">
                <div className="w-16 sm:w-24">
                  <img
                    src={polemaLogo}
                    alt="Polema Logo"
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-left text-sm sm:text-base">
                  <p>
                    <strong>FACTORY/OFFICE:</strong>
                  </p>
                  <p>Osisioma Industry Layout,</p>
                  <p>Osisioma L.G.A, Abia State.</p>
                  <p>Tel: 08065208084</p>
                  <p>Email: polema_@yahoo.com</p>
                </div>
                <div className="text-left">
                  <p className="italic text-sm sm:text-base">RC 131127</p>
                  <h2 className="text-[#D2D2D2] text-2xl sm:text-4xl font-bold">
                    0818
                  </h2>
                </div>
              </div>

              <h2 className="text-[#919191] text-lg sm:text-2xl font-bold border-2 border-[#919191] border-b-4 shadow-lg px-4 py-2 w-fit rounded-lg text-center mx-auto mt-12">
                AUTHORITY TO WEIGH
              </h2>

              <div className="pb-16">
                {[
                  ["Date", refractor(authDetails.createdAt)],
                  ["Vehicle No", authDetails.vehicleNo],
                  [
                    "Customer's Name",
                    `${authDetails.transactions.corder.firstname} ${authDetails.transactions.corder.lastname}`,
                  ],
                  ["Driver's Name", authDetails.driver],
                ].map(([label, value], idx) => (
                  <div
                    className="flex justify-between items-center mt-4"
                    key={idx}
                  >
                    <span className="font-semibold w-1/3 text-start">
                      {label}:
                    </span>
                    <span className="border-b border-black border-dotted flex-grow text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

                <div>
                  {/* <p>{authDetails}</p> */}
                  <p>
                    
                  {`${authDetails.transactions.quantity} ${authDetails.transactions.unit} of ${authDetails.transactions.porders.name}`}
                </p>
              </div>

              <div className="flex justify-between mt-12">
                {[
                  "AUTHORISED SIGNATURE",
                  "CUSTOMER’S SIGNATURE",
                  "SIGNATURE",
                ].map((label, idx) => (
                  <div key={idx} className="text-left">
                    <div className="border-b border-black border-dotted w-32 mx-auto mb-4"></div>
                    <span className="text-sm sm:text-base">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceAuthorityToWeigh;
