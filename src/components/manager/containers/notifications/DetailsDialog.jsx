import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@radix-ui/themes";
import Image from "../../../../static/image/polema-logo.png";
import * as Dialog from "@radix-ui/react-dialog";
import _ from "lodash";
import { Text } from "@radix-ui/themes";
import useToast from "../../../../hooks/useToast";

const DetailsDialog = ({ isOpen, selectedTicket, ticketDetails }) => {
  // State management for component UI
  const showToast = useToast();
  const [rejectLoading, setRejectLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Function to confirm cash ticket
  const confirmCash = async () => {
    setConfirmLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred  while trying to log in.");
    }

    try {
      const response = await axios.post(
        `${root}/admin/recieve-cash-ticket/${ticketDetails.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast({
        message: "Ticket Confirmed",
        type: "success",
        duration: 6000,
      });

      setConfirmLoading(false);
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  };

  // Function to get token
  const getToken = () => {
    const token = localStorage.getItem("token");

    return jwtDecode(token);
  };

  return (
    <>
      <Dialog.Root open={isOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/70 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <div className="flex items-center gap-4 mb-4">
              <div className="border-r-[2px] pr-4 border-black/30">
                <img src={Image} width={"20px"} />
              </div>
              <Dialog.Title>
                <h1 className="text-md font-bold font-amsterdam">
                  POLEMA INDUSTRIES LIMITED
                </h1>
                {_.upperFirst(selectedTicket.type)} Ticket Details
              </Dialog.Title>
            </div>
            {/* Vehicle Details */}
            {selectedTicket.type === "vehicle" && (
              <>
                <div className="flex items-center gap-4 ">
                  <Text className="text-[.8rem] font-black font-space tracking-wide w-full">
                    DRIVER NAME:
                  </Text>
                  <p className="text-[.7rem] border-b-2 border-dotted  border-black w-full">
                    {ticketDetails.driversName}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Text className="text-[.8rem] font-black font-space tracking-wide w-full">
                    VEHICLE NUMBER
                  </Text>
                  <p className="text-[.7rem] border-b-2 border-dotted  border-black w-full">
                    {ticketDetails.vehicleNo}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Text className="text-[.8rem] font-black font-space tracking-wide w-full">
                    DESTINATION
                  </Text>
                  <p className="text-[.7rem] border-b-2 border-dotted  border-black w-full">
                    {ticketDetails.destination}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <Text className="text-[.8rem] font-black font-space tracking-wide w-full">
                    ESCORT NAME
                  </Text>
                  <p className="text-[.7rem] border-b-2 border-dotted  border-black w-full">
                    {ticketDetails.escortName}
                  </p>
                </div>
              </>
            )}
            {/* Cash Ticket Details */}
            {selectedTicket.type === "cash" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    PRODUCT
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.product.name}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    AMOUNT
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.amount}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    COMMENTS
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.comments}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    TYPE
                  </Text>
                  {ticketDetails.creditOrDebit === "credit" ? (
                    <p className="text-[.7rem] text-green-500">Give Cash</p>
                  ) : (
                    <p className="text-[.7rem] text-red-500">Collected Cash</p>
                  )}
                </div>
                {ticketDetails?.customer && (
                  <div>
                    <Text className="text-[.56rem] font-black tracking-wide">
                      NAME
                    </Text>
                    <p className="text-[.7rem]">
                      {`${ticketDetails.customer.firstname} ${ticketDetails.customer.lastname}`}
                    </p>
                  </div>
                )}
              </>
            )}
            {/* Store Ticket Details */}
            {selectedTicket.type === "store" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    RECEIVED BY
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.recievedBy}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    COMMENTS
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.comments}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    ITEMS
                  </Text>
                  {ticketDetails.items &&
                    Object.entries(ticketDetails.items).map(
                      ([goodsName, quantity]) => (
                        <p key={goodsName} className="text-[.7rem]">
                          {fetchStoreNameByID(goodsName).name}: {quantity}{" "}
                          {fetchStoreNameByID(goodsName).unit}
                        </p>
                      )
                    )}
                </div>
              </>
            )}
            {/* LPO TICKET DETAILS */}
            {selectedTicket.type === "lpo" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    SUPPLIER
                  </Text>
                  <p className="text-[.7rem]">
                    {`${ticketDetails?.supplier?.firstname} ${ticketDetails?.supplier?.lastname}`}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    PRODUCT
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.product.name}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    QUANTITY ORDERED
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.quantOrdered}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    UNIT PRICE
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.unitPrice}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    DELIVERED TO
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.deliveredTo}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    COMMENT
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.comments}</p>
                </div>
              </>
            )}
            {/* Weigh Ticket Details */}
            {selectedTicket.type === "weigh" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    DRIVER
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.driver}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    CUSTOMER NAME
                  </Text>
                  <p className="text-[.7rem]">
                    {`${ticketDetails.transactions?.corder.firstname} ${ticketDetails.transactions?.corder.lastname}`}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    QUANTITY
                  </Text>
                  <p className="text-[.7rem]">
                    {ticketDetails.transactions.quantity}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    VEHICLE NO
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.vehicleNo}</p>
                </div>
              </>
            )}
            {/* Invoice Ticket Details */}
            {selectedTicket.type === "invoice" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    CUSTOMER
                  </Text>
                  <p className="text-[.7rem]">
                    {`${ticketDetails?.customer?.firstname} ${ticketDetails?.customer?.lastname}`}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    PRODUCT
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.product.name}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    BANK NAME
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.bankName}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    QUANTITY ORDERED
                  </Text>
                  <p className="text-[.7rem]">
                    {ticketDetails.quantityOrdered}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    VEHICLE NO
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.vehicleNo}</p>
                </div>

                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    LEDGER ENTRIES
                  </Text>
                  {/* Ledger Entries */}
                  {Array.isArray(ticketDetails.ledgerEntries) ? (
                    ticketDetails.ledgerEntries.map((entry) => {
                      return (
                        <p className="text-[.7rem]">
                          {entry.quantity} {entry.unit} of {entry.productName}
                        </p>
                      );
                    })
                  ) : (
                    <div>No entries</div>
                  )}
                </div>
              </>
            )}
            {/* Gatepass Ticket Details    */}
            {selectedTicket.type === "gatepass" && (
              <>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    ESCORT NAME
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.escortName}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    CUSTOMER
                  </Text>
                  <p className="text-[.7rem]">
                    {`${ticketDetails.transaction.corder.firstname} ${ticketDetails.transaction.corder.lastname}`}
                  </p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    DESTINATION
                  </Text>
                  <p className="text-[.7rem]">{ticketDetails.destination}</p>
                </div>
                <div>
                  <Text className="text-[.56rem] font-black tracking-wide">
                    PRODUCT NAME
                  </Text>
                  <p className="text-[.7rem]">
                    {ticketDetails.transaction.porders.name}
                  </p>
                </div>
              </>
            )}
            <div className="flex w-full justify-between mt-4">
              <Dialog.Close asChild>
                <button className="bg-green-500 hover:bg-green-800 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                  Approve
                </button>
              </Dialog.Close>
              <button className="ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Disapprove
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default DetailsDialog;
