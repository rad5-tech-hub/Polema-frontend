import React, { useState } from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useParams} from "react-router-dom";
import polemaLogo from "../../../../static/image/polema-logo.png";
import axios from "axios";
import { Spinner } from "@radix-ui/themes";
import { refractor,formatMoney } from "../../../date";
const root = import.meta.env.VITE_ROOT
const WaybillInvoice = () => {
  const {id} = useParams();

  // State for table data
  const [tableData, setTableData] = useState([
    { item: "1", description: "Cement", rate: 3500, amount: 7000 },
    { item: "2", description: "Sand", rate: 500, amount: 2500 },
    { item: "3", description: "Gravel", rate: 800, amount: 3200 },
    { item: "4", description: "Iron Rod", rate: 4500, amount: 9000 },
    { item: "5", description: "Blocks", rate: 200, amount: 1000 },
    { item: "6", description: "Water", rate: 150, amount: 300 },
  ]);
  const [billDetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalCreditBalance = tableData.reduce(
    (total, row) => total + row.amount,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  // Function to fetch waybill details 
  const fetchWaybillDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/waybill-pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // const { waybill } = response.data;
      const waybill = response.data.parse;

      if (!waybill) {
        // setFailedText("No records found.");
        setFailedSearch(true);
        setBillDetails([]);
      } else {
        // setFailedSearch(false);
        setBillDetails(waybill);
      }
      
    } catch (error) {
      console.error("Error fetching waybills:", error);
      toast.error("Failed to fetch waybills. Please try again.", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchWaybillDetails()
  }, [])
  

  // Loading Component 
  const LoadingComponent = () => {
    return (
      <>
        <div className="w-full h-screen bg-black/20 flex justify-center items-center">
 
      <Spinner size={"3"}/>
        </div>
      </>
    )
  }

  
  return (
    <div className="p-4 sm:p-8">
      {/* Inline style for print-specific rules */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Header Section */}
          <div className="intro flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-[#919191] no-print">
            <span className="text-sm sm:text-lg md:text-xl font-semibold text-center">
              Approved Gate Pass Note
            </span>
            <button
              onClick={handlePrint}
              className="mt-4 sm:mt-0 rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>

          {/* Invoice Section */}
          <div className="mt-8 bg-white p-6 sm:p-8 lg:p-14 rounded">
            {/* Header with Logo */}
            <header className="flex items-center">
              <div className="logo">
                <img
                  src={polemaLogo}
                  alt="Polema Logo"
                  className="max-md:w-24 max-md:h-[200px]"
                />
              </div>
              <div className="description w-full">
                <div className="heading text-center">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
                    POLEMA INDUSTRIES LIMITED
                  </h1>
                  <p className="rc flex justify-end text-xs sm:text-sm pr-[120px]">
                    RC 131127
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-[#434343]">
                    A DIVISION OF MOBISON INTER-LINK & ASSOCIATES LTD.
                  </p>
                  <small className="font-bold text-[#434343] text-[15px]">
                    Manufactures' & Exporters of Palm Kernel Oil, Palm Kernel
                    Cakes and Drugs
                  </small>
                </div>
                <div className="address text-xs sm:text-sm pl-12">
                  <p>
                    <b className="italic">FACTORY/OFFICE:</b>
                    <br /> Osisioma Industry Layout,
                    <br /> Osisioma L.G.A, Abia State.
                    <br /> Tel: 08065208084
                    <br /> Email: polema_@yahoo.com
                    <br />
                    <span>onwaobiec@yahoo.com</span>
                  </p>
                </div>
              </div>
            </header>

            {/* Title Section */}
            <div className="title flex justify-center mt-6 sm:mt-8 relative">
              <h1 className="border border-b-8 border-[#43434380] px-4 sm:px-8 py-2 text-[#919191] rounded-xl shadow-lg text-lg sm:text-xl lg:text-2xl font-bold">
                WAYBILL
              </h1>
            </div>
            {/* <div className="invoive-no absolute bottom-48 right-[22%] rotate-6 text-[32px] text-[#D2D2D2] font-bold">
          0818
        </div> */}
            {/* Customer Details Section */}
            {/* Receipt Details */}
            {/* Customer Details Section */}
            <div className="descriptions mt-8">
              <div className="w-full details mt-8 sm:mt-12 flex flex-col gap-2 sm:gap-4">
                {/* Single-line entries */}
                {[
                  ["Date", `${refractor(billDetails.createdAt)}`],
                  [
                    "To",
                    `${billDetails.transaction?.corder?.firstname} ${billDetails.transaction?.corder?.lastname}`,
                  ],
                  ["Address", `${billDetails.address || ""}`],
                  [
                    "Transport Carried out by:",
                    `${billDetails?.transportedBy || ""}`,
                  ],
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

                {/* Two items per row */}
                <div className="flex flex-wrap gap-4">
                  {/* Vehicle No. and Time Out */}
                  <div className="flex items-center gap-2 flex-grow">
                    <label className="font-semibold text-sm sm:text-base">
                      Vehicle No.:
                    </label>
                    <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base px-8">
                      {billDetails.invoice?.vehicleNo || ""}
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2 flex-grow">
                <label className="font-semibold text-sm sm:text-base">
                  Time Out:
                </label>
                <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base px-8">
                  00:00 PM
                </p>
              </div> */}
                </div>

                <div className="flex flex-wrap gap-4 mt-2">
                  {/* Driver's Driving License and Invoice No. */}
                  <div className="flex items-center gap-2 flex-grow">
                    <label className="font-semibold text-sm sm:text-base">
                      Driver’s Driving License No.:
                    </label>
                    <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base px-8">
                      {billDetails?.driversLicense || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-grow">
                    <label className="font-semibold text-sm sm:text-base">
                      Invoice No.:
                    </label>
                    <p className="border-b border-black border-dotted flex-grow text-sm sm:text-base px-8">
                      {billDetails.invoice?.invoiceNumber || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <table className="w-full mt-6 sm:mt-8 border-collapse border-spacing-0">
              <thead>
                <tr className="bg-[#E1E1E1]">
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    ITEM
                  </th>
                  {/* <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                QUANTITY
              </th> */}
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    GOODS
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    RATE
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {billDetails?.invoice?.ledgerEntries.map((row, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {`${formatMoney(row.quantity)}  ${row.unit} of ${
                        row.product?.name || ""
                      }`}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.order?.rate || ""}
                    </td>

                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.credit > row.debit
                        ? formatMoney(row.credit)
                        : formatMoney(row.debit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tfoot>
            <tr>
              <td
                colSpan="3"
                className="text-right px-4 py-2 font-bold text-sm sm:text-base"
              >
                TOTAL CREDIT BALANCE:
              </td>
              <td className="border border-[#43434380] px-4 py-2 font-bold text-sm sm:text-base">
                {totalCreditBalance.toLocaleString()}
              </td>
            </tr>
          </tfoot> */}
            </table>

            {/* Additional Table Section */}
            <table className="w-full mt-6 sm:mt-8 border-collapse border-spacing-0">
              <thead>
                <tr className="">
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    DISPATCHED BY
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    DRIVER'S NAME
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    RECEIVED BY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm">
                    {/* <p>Name: John Doe</p>
                <p className="mt-2">Sign: ___________</p>
                <p className="mt-2">Date: 06-12-24</p> */}
                  </td>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm">
                    {/* <p>Name: Michael Smith</p>
                <p className="mt-2">Sign: ___________</p>
                <p className="mt-2">Date: 06-12-24</p> */}
                  </td>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm">
                    {/* <p>Name: Chibuike Ugwuanyi</p>
                <p className="mt-2">Sign: ___________</p>
                <p className="mt-2">Date: 06-12-24</p> */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default WaybillInvoice;
