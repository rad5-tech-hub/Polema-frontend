import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import axios from "axios";
import { Spinner, Grid, Button, Text } from "@radix-ui/themes";
import {refractor,formatMoney} from "../../../date"
import { Modal } from "antd";
import Image from "../../../../static/image/polema-logo.png";
import { Toaster, toast, LoaderIcon } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;
const IndividualInfo = ({ open, setOpen, selectedTicket }) => {
  const [ticketDetails, setTicketDetails] = useState();
  const [rejectLoading, setRejectLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // --------------------State management for opening and closing the dialog------------------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [storeDetails, setStoreDetails] = useState([]);

  //------------- State management for approving to to other admins-------------
  const [approveToOtherAdminChecked,setApproveToOtherAdminChecked] = useState(false)

  // Function to fetch general store
  const fetchGeneralStore = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
    }
    try {
      const { data } = await axios.get(`${root}/dept/view-gen-store`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStoreDetails(data.stores);
    } catch (error) {
      console.log(error);
    }
  };
  // Function to fetch store item name by id
  const fetchStoreNameByID = (id) => {
    const store = storeDetails.find((item) => item.id === id);
    return store && store;
  };
  const getAppropriateEndpoint = () => {
    switch (selectedTicket.type) {
      case "lpo":
        return "admin/view-approved-lpo";
      case "vehicle":
        return "customer/view-vehicle";
      case "cash":
        return "admin/view-aproved-cash-ticket";
      case "store":
        return "admin/view-approved-store-auth";
      case "gatepass":
        return "customer/view-gatepass";
      case "invoice":
        return "customer/invoice-pdf";
      case "weigh":
        return "admin/view-auth-weigh";
        case "waybill":
          return "customer/waybill-pdf";
      default:
        break;
    }
  };
  const getAppropriateAcceptEndpoint = () => {
    switch (selectedTicket.type) {
      case "lpo":
        return "admin/approve-lpo";
      case "vehicle":
        return "customer/approve-vehicle";
      case "store":
        return "admin/approve-store-auth";
      case "invoice":
        return "customer/approveInvoice";
      case "weigh":
        return "admin/approve-weigh-auth";
      case "gatepass":
        return "customer/approve-gatepass";
      case "cash":
        return "admin/approve-cash-ticket";
      case "waybill":
        return "customer/approve-waybill";
    }
  };
  const getAppropriateRejectTicket = () => {
    switch (selectedTicket.type) {
      case "lpo":
        return "admin/reject-lpo";
      case "vehicle":
        return "customer/reject-vehicle";
      case "store":
        return "admin/reject-store-auth";
      case "invoice":
        return "customer/rejectInvoice";
      case "weigh":
        return "admin/reject-weigh-auth";
      case "gatepass":
        return "customer/reject-gatepass";
      case "cash":
        return "admin/reject-cash-ticket";
      case "waybill":
        return "customer/reject-waybill";
    }
  };
  const fetchTicketDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred ,try logging in again", {
        style: { padding: "20px" },
        duration: 6000,
      });
      return
    }

    // setTicketDetails({})

    try {
      const response = await axios.get(
        `${root}/${getAppropriateEndpoint()}/${selectedTicket.ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      switch (selectedTicket?.type) {
        case "lpo":
          setTicketDetails(response.data.record);
          break;
        case "vehicle":
          setTicketDetails(response.data.vehicle);
          break;
        case "invoice":
          setTicketDetails(response.data.invoice);
          break;
        case "weigh":
          setTicketDetails(response.data.ticket);
          break;
        case "gatepass":
          setTicketDetails(response.data.gatePass);
          break;
        case "cash":
          setTicketDetails(response.data.record);
          break;
        case "store":
          setTicketDetails(response.data.records);
          break;
          case "waybill":
            setTicketDetails(response.data?.parse || []);
            break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const approveTicket = async () => {
    const token = localStorage.getItem("token");
    setApproveLoading(true);
    try {
      const response = await axios.patch(
        `${root}/${getAppropriateAcceptEndpoint()}/${selectedTicket.ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApproveLoading(false);
      setOpen(false);
      setTimeout(() => {
        toast.success("Ticket Approved", {
          style: { padding: "20px" },
          duration: 3000,
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      setApproveLoading(false);
    }
  };
  const rejectTicket = async () => {
    const token = localStorage.getItem("token");
    setRejectLoading(true);
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }
    try {
      const response = await axios.patch(
        `${root}/${getAppropriateRejectTicket()}/${selectedTicket.ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRejectLoading(false);
      toast.success("Ticket Disapproved");
    } catch (error) {
      console.log(error);
      setRejectLoading(false);
      toast.error(
        error.response?.data?.message ||
          error.response?.data.error ||
          error.response?.message ||
          "An error occurred while trying ot reject ticket"
      );
    }
  };
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
      toast.success("Ticket Confimed", {
        duration: 6500,
      });
      setConfirmLoading(false);
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  };
  // Function to get token from LS
  const getToken = () => {
    const token = localStorage.getItem("token");

    return jwtDecode(token);
  };

  // Function to close modal
  const closeModal = () => {
    // setModalOpen(false);
    setOpen(false);
  };

  
  React.useEffect(() => {
    fetchTicketDetails();
    fetchGeneralStore();
  }, [selectedTicket]);
  return (
    <>
      <Modal open={open} footer={null} onCancel={closeModal}>
        <div className=" bg-white h-full z-[11] rounded-md top-0 left-0 p-6 right-[-70px] w-[25rem]">
          <div
            className="absolute right-[17px] top-[10px] cursor-pointer"
            onClick={() => {
              setDetailsPageOpen(false);
            }}
          ></div>
          <div className="flex items-center gap-4">
            <img src={Image} width={"30px"} />{" "}
            {selectedTicket?.type && (
              <>{_.upperFirst(selectedTicket.type)} Ticket Details</>
            )}
          </div>

          <div className="details-container h-[75%]">
            {typeof ticketDetails !== "object" ? (
              <div className="p-4">
                <LoaderIcon />
              </div>
            ) : (
              <>
                <div className="h-full relative mt-4">
                  {/* <Grid columns={"3"}> */}
                  {/* Ticket Type Specific Details */}
                  {selectedTicket.type === "gatepass" && (
                    <>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          ESCORT NAME
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.escortName}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          CUSTOMER
                        </Text>
                        <p className="text-[.7rem]">
                          {`${ticketDetails.transaction?.corder.firstname} ${ticketDetails.transaction?.corder.lastname}`}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          DESTINATION
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.destination}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          PRODUCT NAME
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.transaction?.porders?.name}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Vehicle details */}
                  {selectedTicket.type === "vehicle" && (
                    <>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          DRIVER NAME
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.driversName}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          VEHICLE NUMBER
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.vehicleNo}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          DESTINATION
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.destination}
                        </p>
                      </div>
                      <div>
                        <Text className="text-[.56rem] font-black tracking-wide">
                          ESCORT NAME
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.escortName}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Invoice Details */}
                  {selectedTicket.type === "invoice" && (
                    <>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          CUSTOMER
                        </Text>
                        <p className="text-[.9rem]">
                          {`${ticketDetails?.customer?.firstname} ${ticketDetails?.customer?.lastname}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          PRODUCT
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.product?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          BANK NAME
                        </Text>
                        <p className="text-[.9rem]">{ticketDetails.bankName}</p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          QUANTITY ORDERED
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.quantityOrdered}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          VEHICLE NO
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.vehicleNo}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          LEDGER ENTRIES
                        </Text>
                        {/* Ledger Entries */}
                        <div className="flex flex-col">
                          {Array.isArray(ticketDetails.ledgerEntries) ? (
                            ticketDetails.ledgerEntries.map((entry) => {
                              return (
                                <>
                                  <p className="text-[.5rem]">
                                    {entry.quantity} {entry.unit} of{" "}
                                    {entry.productName}
                                  </p>{" "}
                                </>
                              );
                            })
                          ) : (
                            <div>No entries</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Weigh Ticket Example */}
                  {selectedTicket.type === "weigh" && (
                    <>
                      <div className="flex w-full justify-between items-center p-2">
                        <Text className="text-[.9rem] font-black tracking-wide">
                          DRIVER
                        </Text>
                        <p className="text-[.9rem]">{ticketDetails.driver}</p>
                      </div>
                      <div className="flex w-full justify-between items-center p-2">
                        <Text className="text-[.9rem] font-black tracking-wide">
                          CUSTOMER NAME
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.supplierId && ticketDetails.supplier
                          ? `${ticketDetails.supplier.firstname} ${ticketDetails.supplier.lastname}`
                          : ticketDetails.customerId && ticketDetails.transactions?.corder
                          ? `${ticketDetails.transactions.corder.firstname} ${ticketDetails.transactions.corder.lastname}`
                          : "Name not available"}
                        </p>
                      </div>
                      {ticketDetails.transactions && <div className="flex w-full justify-between items-center p-2">
                        <Text className="text-[.9rem] font-black tracking-wide">
                          QUANTITY
                        </Text>
                        <p className="text-[.9rem]">
                          {formatMoney(ticketDetails.transactions?.quantity) ||
                            ""}{" "}
                          {ticketDetails.transactions?.unit || ""}
                        </p>
                      </div>}
                      {ticketDetails.transactions && <div className="flex w-full justify-between items-center p-2">
                        <Text className="text-[.9rem] font-black tracking-wide">
                          PRODUCT
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.transactions?.porders.name}
                        </p>
                      </div>}
                      <div className="flex w-full justify-between items-center p-2">
                        <Text className="text-[.9rem] font-black tracking-wide">
                          VEHICLE NO
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.vehicleNo}
                        </p>
                      </div>
                    </>
                  )}

                  {/* LPO DETAILS */}
                  {selectedTicket.type === "lpo" && (
                    <>
                      {/* {console.log(ticketDetails)} */}
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          SUPPLIER
                        </Text>
                        <p className="text-[.7rem]">
                          {`${ticketDetails?.supplier?.firstname} ${ticketDetails?.supplier?.lastname}`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          PRODUCT
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails?.product?.name || ""}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          QUANTITY ORDERED
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.quantOrdered}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          UNIT PRICE
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.unitPrice}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          DELIVERED TO
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.deliveredTo}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          COMMENT
                        </Text>
                        <p className="text-[.7rem]">{ticketDetails.comments}</p>
                      </div>
                    </>
                  )}

                  {/* Cash Example */}
                  {selectedTicket.type === "cash" && (
                    <>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[.56rem] font-black tracking-wide">
                          PRODUCT
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.product?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[.56rem] font-black tracking-wide">
                          AMOUNT
                        </Text>
                        <p className="text-[.9rem]">
                          ₦{formatMoney(ticketDetails.amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[.56rem] font-black tracking-wide">
                          COMMENTS
                        </Text>
                        <p className="text-[.9rem]">{ticketDetails.comments}</p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[.56rem] font-black tracking-wide">
                          TYPE
                        </Text>
                        {ticketDetails.creditOrDebit === "credit" ? (
                          <p className="text-[.9rem] text-green-500">
                            {/* Give Cash */}
                            {/* This was changed to collected cash because if the cash is given , the admin collect it  */}
                            Collect Cash
                          </p>
                        ) : (
                          <p className="text-[.9rem] text-red-500">
                            {/* This was changed because of the reverse of the abpve comments  */}
                            {/* Collected Cash */}
                            Give Cash
                          </p>
                        )}
                      </div>
                      {ticketDetails?.customer && (
                        <div className="flex items-center gap-6 justify-between">
                          <Text className="text-[.56rem] font-black tracking-wide">
                            NAME
                          </Text>
                          <p className="text-[.9rem]">
                            {`${ticketDetails.customer.firstname} ${ticketDetails.customer.lastname}`}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Store Details */}
                  {selectedTicket.type === "store" && (
                    <>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold font-space tracking-wide">
                          RECEIVED BY
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.recievedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          COMMENTS
                        </Text>
                        <p className="text-[.9rem]">{ticketDetails.comments}</p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          ITEMS
                        </Text>
                        {ticketDetails.items &&
                          Object.entries(ticketDetails.items).map(
                            ([goodsName, quantity]) => (
                              <>
                                <p key={goodsName} className="text-[.9rem]">
                                  {fetchStoreNameByID(goodsName).name}:{" "}
                                  {quantity}{" "}
                                  {fetchStoreNameByID(goodsName).unit}
                                </p>
                              </>
                            )
                          )}
                      </div>
                    </>
                  )}

                  {/* Waybill Details  */}
                  {selectedTicket.type === "waybill" && (
                    <>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold font-space tracking-wide">
                          CUSTOMER
                        </Text>
                        <p className="text-[.9rem]">
                          {`${ticketDetails.transaction.corder.firstname} ${ticketDetails.transaction.corder.lastname} ` ||
                            ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          PRODUCT ORDERED
                        </Text>
                        <p className="text-[.9rem]">
                          {ticketDetails.transaction.porders.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          CUSTOMER ADDRESS
                        </Text>
                        {ticketDetails.address || ""}
                      </div>
                      <div className="flex items-center gap-6 justify-between">
                        <Text className="text-[1rem] font-bold tracking-wide">
                          BAGS (FOR PKC)
                        </Text>
                        {ticketDetails.bags || ""}
                      </div>
                    </>
                  )}
                  {/* </Grid> */}

                  {/* Checkbox to approve to other admins */}
                  {/* {ticketDetails?.status !== "approved" && (
                    <div className="flex gap-3 mt-4">
                      <input type="checkbox" name="" id="" />
                      <p>Approve to other admin</p>
                    </div>
                  )} */}

                  {/* {ticketDetails?.status === "approved" &&
                    selectedTicket?.type === "cash" &&
                    ticketDetails?.approvedBySuperAdminId !==
                      getToken()?.id && (
                      <div className="buttons-div justify-center mt-px absolute bottom-0 flex">
                        <Button
                          color="green"
                          size={"2"}
                          onClick={confirmCash}
                          disabled={confirmLoading}
                        >
                          {confirmLoading ? <Spinner /> : "Confirm"}
                        </Button>
                      </div>
                    )}

                  {ticketDetails.status !== "approved" && (
                    <div className="buttons-div justify-start mt-12 bottom-0 flex w-full">
                      <div className="flex gap-4">
                        <Button
                          color="red"
                          size={"2"}
                          disabled={rejectLoading}
                          className="p-3 rounded w-full cursor-pointer"
                          onClick={rejectTicket}
                        >
                          {rejectLoading ? <LoaderIcon /> : "Disapprove"}
                        </Button>
                        <Button
                          color="green"
                          className="p-3 rounded w-full cursor-pointer"
                          size={"2"}
                          onClick={approveTicket}
                          disabled={approveLoading}
                        >
                          {approveLoading ? <LoaderIcon /> : "Approve"}
                        </Button>
                      </div>
                    </div>
                  )} */}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* <Toaster position="top-right" /> */}
    </>
  );
};

export default IndividualInfo;
