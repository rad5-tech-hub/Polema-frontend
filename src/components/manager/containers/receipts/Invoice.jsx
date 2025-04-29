import React, { useState, useEffect } from "react";
import { formatMoney, refractor, refractorToTime } from "../../../date";
import { Switch, Dropdown, Menu } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";
import polemaLogo from "../../../../static/image/polema-logo.png";
import mobisonLogo from "../../../../static/image/mob-logo.png"; // Placeholder: Replace with actual Mobison logo path
import { Spinner } from "@radix-ui/themes";

const Invoice = () => {
  const { id } = useParams();
  const [fetchComplete, setFetchComplete] = useState(false);
  const [invoice, setInvoice] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isMobison, setIsMobison] = useState(false); // State for Switch

  // Fetch invoice details
  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/invoice-pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoice(response.data.invoice);
      setTableData(response.data.invoice.ledgerEntries);
      setFetchComplete(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === "print") {
          handlePrint();
        } else if (key === "sendToPrint") {
          handleSendToPrint();
        }
      }}
      className="headers"
    >
      <Menu.Item key="print">Print</Menu.Item>
      <Menu.Item key="sendToPrint">Send to Print</Menu.Item>
    </Menu>
  );

  return (
    <div className="p-4 sm:p-8">
      {/* Inline styles for print-specific rules */}
      <style>
        {`
          @media print {
            .headers {
              display: none !important;
            }
            /* Force background colors to be printed */
            body, .bg-white, .bg-[#E1E1E1] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: inherit !important;            
            }
            *{           
              box-shadow: none !important;              
            }
            /* Ensure borders are visible */
            table, th, td {
              border: 1px solid black !important;
            }
            table th {
              background-color: #E1E1E1 !important;
            }

            /* Force grid layout during print */
            .customer {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 1.5rem;
            }

            .customer-address {
              background-color: #E1E1E1 !important;
            }

            .customer-address .schedule {
              width: 100%;
            }          
          }
        `}
      </style>
      {fetchComplete ? (
        <>
          {/* Header Section */}
          <div className="flex flex-row justify-center lg:justify-between items-center gap-5 headers pb-6 border-b border-[#919191]">
            <div className="w-full max-w-[300px] lg:w-auto text-center lg:text-left">
              <h3 className="text-sm sm:text-[20px] font-semibold">
                Approved Invoice
              </h3>
            </div>
            <div className="w-full max-w-[300px] lg:w-auto text-center">
              <Switch
                className="custom-black-switch"
                checked={isMobison}
                onChange={(checked) => setIsMobison(checked)}
              />
              <p className="text-sm font-semibold mt-2 text-[#D2D2D2]">
                {isMobison ? "Switch off for Polema" : "Switch on for Mobison"}
              </p>
            </div>
            <div className="w-full lg:text-end text-center">              
              <button onClick={()=> handlePrint()} className="rounded-lg border-[1px] border-[#919191]  px-8 shadow-lg text-sm sm:text-base cursor-pointer p-2">
                Print
              </button>              
            </div>
          </div>

          {/* Invoice Section */}
          <div className="mt-5 bg-white p-6 sm:p-8 lg:p-14 rounded print:block">
            {/* Header with Logo */}
            <div className="flex justify-between gap-5">
              <div className="logo">
                <img
                  src={isMobison ? mobisonLogo : polemaLogo}
                  alt={isMobison ? "mobison-logo" : "polema-logo"}
                  className="h-[120px] object-contain"
                />
                {isMobison && <div>
                  <p className="text-start text-xs italic">
                    Pharmaceuticals,<br/>
                    Industrialists,<br/>
                    Oil Milling and<br/>
                    General Commerce<br/>
                  </p>
                  </div>}
              </div>
              <div className="heading text-center">
                <div>
                  <p className="flex justify-end mb-6 text-xs sm:text-sm">
                  <i>{isMobison ? 'RC 64084' : 'RC 131127'}</i>
                  </p>
                  <h3
                    className="text-[25px] font-bold text-[#434343]"                  
                  >
                    {isMobison ? "MAOBISON INTER-LINK ASSOCIATES LTD." : "POLEMA INDUSTRIES LIMITED"}                  
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-[#434343]">
                    A DIVISION OF {!isMobison ? "MAOBISON INTER-LINK ASSOCIATES LTD." : "POLEMA INDUSTRIES LIMITED"}<br/>
                    <span className="text-sm font-bold text-[#434343]">Manufactures' & Exporters of Palm Kernel Oil, Palm Kernel Cakes and Drugs</span>
                  </p>
                </div>
              </div>
              {isMobison ? (<div className="flex items-center text-xs sm:text-sm justify-end">
                  <p><b className="italic">HEAD OFFICE:</b> Old Aba-Owerri Road,<br/>
                  Osisioma Industry Layout, <br/>
                  Osisioma L.G.A, Abia State. <br/>
                  Tel: 08065208084<br/>
                  Email: onwaobiec@yahoo.com<br/></p>
                </div> ) : (<div className="flex items-center text-xs sm:text-sm justify-end">                
                <p>
                  <b className="italic">FACTORY/OFFICE:</b>
                  <br /> Osisioma Industry Layout,
                  <br /> Osisioma L.G.A, Abia State.
                  <br /> Tel: 08065208084
                  <br /> Email: polema_@yahoo.com
                  <br />
                  <span>onwaobiec@yahoo.com</span>
                </p>
              </div>)}
            </div>

            {/* Title Section */}
            <div className="title flex justify-center mt-3 relative">
              <h1 className="border border-b-8 border-[#43434380] px-4 sm:px-8 py-2 text-[#919191] rounded-xl shadow-lg text-lg sm:text-xl lg:text-2xl font-bold">
                CASH/CREDIT SALES INVOICE
              </h1>
            </div>

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
                    {invoice.customer.address || ""}
                  </p>
                </div>
                <div className="vehicle-no flex gap-2 items-center mt-4">
                  <label className="text-sm sm:text-lg">Vehicle No:</label>
                  <p className="border-b-4 border-dotted border-[#43434380] w-full pl-4 text-[#434343] text-xs sm:text-base">
                    {invoice.vehicleNo || ""}
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
            <p className="mt-4 text-sm">
              Balance Brought Forward : ₦ {formatMoney(invoice.balanceBeforeDebit)}{" "}
            </p>
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
                    AMOUNT (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      row.debit > row.credit ? "text-red-" : ""
                    }`}
                  >
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {refractor(row.createdAt)}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.quantity && row.unit && `${row.quantity} ${row.unit} of`}{" "}
                      {`${row.productName} ${row.credit > row.debit ? "returned" : ""}`}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row?.order?.rate || ""}
                    </td>
                    <td className="border border-[#43434380] px-4 py-2 text-xs sm:text-sm">
                      {row.debit > row.credit
                        ? formatMoney(row.debit)
                        : formatMoney(row.credit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end w-full text-[0.8rem] mt-6">
              <div>
                <p>
                  <span className="underline">TOTAL CREDIT BALANCE</span>: ₦
                  {formatMoney(invoice.currentBalance)}
                </p>
              </div>
            </div>

            {/* Additional Table Section */}
            <table className="w-full mt-6 sm:mt-8 border-collapse border-spacing-0">
              <thead>
                <tr>
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
                  {/* PREPARED BY */}
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm text-center">
                    {invoice?.role?.admins?.[0]?.signature ? (
                      <img
                        src={invoice.role.admins[0].signature}
                        alt="Prepared by signature"
                        className="object-contain mx-auto"
                        style={{ height: "50px", width: "50px" }}
                      />
                    ) : (
                      <>
                        {invoice?.role?.admins?.[0]?.firstname} {invoice?.role?.admins?.[0]?.lastname}
                      </>
                    )}
                  </td>

                  {/* DELIVERED BY */}
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm">
                    {invoice?.role?.admins?.[0]?.signature ? (
                      <img
                        src={invoice.role.admins[0].signature}
                        alt="Prepared by signature"
                        className="object-contain mx-auto"
                        style={{ height: "50px", width: "50px" }}
                      />
                    ) : (
                      <>
                        {invoice?.role?.admins?.[0]?.firstname} {invoice?.role?.admins?.[0]?.lastname}
                      </>
                    )}
                  </td>

                  {/* CHECKED BY */}
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm text-center">
                    {invoice?.approvedByRole?.admins?.[0]?.signature ? (
                      <img
                        src={invoice.approvedByRole.admins[0].signature}
                        alt="Checked by signature"
                        className="object-contain mx-auto"
                        style={{ height: "50px", width: "50px" }}
                      />
                    ) : (
                      <>
                        {invoice?.approvedByRole?.admins?.[0]?.firstname} {invoice?.approvedByRole?.admins?.[0]?.lastname}
                      </>
                    )}
                  </td>

                  {/* CUSTOMER'S SIGNATURE */}
                  <td className="border border-[#43434380] px-4 py-[20px] text-xs sm:text-sm text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="h-screen justify-center items-center flex bg-black/25">
          <Spinner size={"3"} />
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default Invoice;