import React, { useState } from "react";
import { formatMoney, refractor, refractorToTime } from "../../../date";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useParams } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";
import polemaLogo from "../../../../static/image/polema-logo.png";
import { Spinner } from "@radix-ui/themes";

const Invoice = () => {
  const { id } = useParams();
  const [fetchComplete, setFetchComplete] = React.useState(false);
  const [invoice, setInvoice] = React.useState({});

  // Funciton to get details of an invoice
  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logginng in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/invoice-pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFetchComplete(true);
      setInvoice(response.data.invoice);
      setTableData(response.data.invoice.ledgerEntries);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  // State for table data
  const [tableData, setTableData] = useState([
    { item: "1", description: "Cement", rate: 3500, amount: 7000 },
    { item: "2", description: "Sand", rate: 500, amount: 2500 },
    { item: "3", description: "Gravel", rate: 800, amount: 3200 },
    { item: "4", description: "Iron Rod", rate: 4500, amount: 9000 },
    { item: "5", description: "Blocks", rate: 200, amount: 1000 },
    { item: "6", description: "Water", rate: 150, amount: 300 },
  ]);

  const totalCreditBalance = tableData.reduce((total, row) => {
    const higherValue = Math.max(row.credit || 0, row.debit || 0);
    return Number(total) + Number(higherValue);
  }, 0);
  const handlePrint = () => {
    window.print();
  };

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
      {fetchComplete ? (
        <>
          {/* Header Section */}
          <div className="intro flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-[#919191] no-print">
            <span className="text-sm sm:text-lg md:text-xl font-semibold text-center">
              Approved Invoice
            </span>{" "}
            
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
                <p className="rc flex justify-end text-xs sm:text-sm">
                  RC 131127
                </p>
                <div className="heading text-center">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
                    POLEMA INDUSTRIES LIMITED
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-[#434343]">
                    A DIVISION OF MOBISON INTER-LINK & ASSOCIATES LTD.
                  </p>
                </div>
                <div className="address flex justify-end text-xs sm:text-sm">
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
                CASH/CREDIT SALES INVOICE
              </h1>
            </div>
            {/* <div className="invoive-no absolute bottom-48 right-[22%] rotate-6 text-[32px] text-[#D2D2D2] font-bold">
          0818
        </div> */}
            {/* Customer Details Section */}
            <div className="customer mt-6 sm:mt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="customer-address p-6 rounded-2xl shadow-lg bg-[#E1E1E1] border-r-8 border-b-8 border-[#43434380] w-full lg:w-1/2">
                <div className="name flex gap-2 items-center">
                  <label className="text-sm sm:text-lg">Name:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {`${invoice.customer.firstname} ${invoice.customer.lastname}`}
                  </p>
                </div>
                <div className="address flex gap-2 items-center mt-4">
                  <label className="text-sm sm:text-lg">Address:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {invoice.customer.address && invoice.customer.address}
                  </p>
                </div>
                <div className="vehicle-no flex gap-2 items-center mt-4">
                  <label className="text-sm sm:text-lg">Vehicle No:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {invoice.vehicleNo}
                  </p>
                </div>
              </div>
              <div className="schedule time-and-date w-full lg:w-1/2 flex flex-col gap-4">
                <div className="date flex gap-2 items-center">
                  <label className="text-sm sm:text-lg">Date:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {refractor(invoice.createdAt)}
                  </p>
                </div>
                <div className="timeout flex gap-2 items-center mt-4">
                  <label className="text-sm sm:text-lg">Timeout:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {refractorToTime(invoice.createdAt)}
                  </p>
                </div>
              </div>
            </div>

              <p className="mt-4 text-xs">Balance Brought Forward : ₦ {formatMoney(invoice.balanceBeforeDebit)} </p>
            {/* Table Section */}
            <table className="w-full mt-6 sm:mt-8 border-collapse border-spacing-0">
              <thead>
                <tr className="bg-[#E1E1E1]">
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    ITEM
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    DATE
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    DESCRIPTION
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    RATE
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    AMOUNT (#)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className={`text-center ${row.debit > row.credit && "text-red-"}`}>
                    <td className="border border-[#43434380] px-4  py-2 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-[#43434380] px-4  py-2 text-xs sm:text-sm">
                      {refractor(row.createdAt)}
                    </td>
                    
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.quantity &&
                        row.unit &&
                        `${row.quantity}  ${row.unit} of`}{" "}
                      {`${row.productName} ${row.credit > row.debit ? "returned" :""}`}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row?.order?.rate && row.order.rate}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.debit > row.credit ? formatMoney(row.debit) : formatMoney(row.credit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tfoot>
                <tr>
                  <td
                    colSpan="4"
                    className="text-right mt-4 px-4 py-2 font-bold text-sm sm:text-base"
                  >
                    TOTAL BALANCE:
                  </td>
                  <td className="border border-[#43434380] px-4 py-2 font-bold text-sm sm:text-base">
                    {totalCreditBalance.toLocaleString()}
                  </td>
                </tr>
              </tfoot> */}

            </table>
              <div className="flex justify-end w-full text-[0.8rem] mt-6">
                <div>
                  <p><span className="underline">TOTAL CREDIT BALANCE</span>: ₦{formatMoney(invoice.currentBalance)}</p>
                </div>
              </div>

            {/* <p className="mt-4 text-xs">Customer Current Balance : ₦ {formatMoney(invoice.currentBalance)} </p> */}


            {/* Additional Table Section */}
            <table className="w-full mt-6 sm:mt-8 border-collapse border-spacing-0">
              <thead>
                <tr className="">
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    Prepared by
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    Delivered by
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    Checked by
                  </th>
                  <th className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                    Customer's Signature
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm"></td>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm"></td>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm"></td>
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="h-screen justify-center items-center flex  bg-black/25">
          <Spinner size={"3"} />
        </div>
      )}

      <Toaster position="top-righ" />
    </div>
  );
};

export default Invoice;
