import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { Spinner, Grid, Button, Text } from "@radix-ui/themes";
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
    }

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
  
  const closeModal = () => {
    // setModalOpen(false);
    setOpen(false);
  };

  React.useEffect(() => {
    fetchTicketDetails();
    fetchGeneralStore();
  }, []);

  return (
    <>
      {/* <Dialog.Root open={true}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/70 data- fixed inset-0" />
          <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio sed
            fuga praesentium mollitia natus incidunt, quibusdam ipsum, doloribus
            nesciunt omnis molestias pariatur neque adipisci, maiores provident
            ratione accusamus labore? Mollitia!
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}

      <Modal open={open} footer={null} onCancel={closeModal}>
        <div className=" bg-white h-full z-[11] rounded-md top-0 left-0 p-6 right-[-70px] w-[25rem]">
          <div
            className="absolute right-[17px] top-[10px] cursor-pointer"
            onClick={() => {
              setDetailsPageOpen(false);
            }}
          >
            {/* <FontAwesomeIcon icon={faClose} /> */}
          </div>
          <div className="flex items-center gap-4">
            <img src={Image} width={"30px"} />{" "}
            {selectedTicket?.type && (
              <>{_.upperFirst(selectedTicket.type)} Ticket Details</>
            )}
          </div>
          {/* <Separator className="my-2 w-full" /> */}
          <div className="details-container h-[75%]">
            {typeof ticketDetails !== "object" ? (
              <div className="p-4">
                <LoaderIcon />
              </div>
            ) : (
              <>
                <div className="h-full relative">
                  <Grid columns={"3"}>
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
                            {`${ticketDetails.transaction.corder.firstname} ${ticketDetails.transaction.corder.lastname}`}
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
                            {ticketDetails.transaction.porders.name}
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
                          <p className="text-[.7rem]">
                            {ticketDetails.product?.name}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            BANK NAME
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.bankName}
                          </p>
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
                          <p className="text-[.7rem]">
                            {ticketDetails.vehicleNo}
                          </p>
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
                                  {entry.quantity} {entry.unit} of{" "}
                                  {entry.productName}
                                </p>
                              );
                            })
                          ) : (
                            <div>No entries</div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Weigh Ticket Example */}
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
                            {ticketDetails.transactions?.quantity}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            VEHICLE NO
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.vehicleNo}
                          </p>
                        </div>
                      </>
                    )}

                    {/* LPO DETAILS */}
                    {selectedTicket.type === "lpo" && (
                      <>
                        {/* {console.log(ticketDetails)} */}
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
                          <p className="text-[.7rem]">
                            {ticketDetails?.product?.name || ""}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            QUANTITY ORDERED
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.quantOrdered}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            UNIT PRICE
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.unitPrice}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            DELIVERED TO
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.deliveredTo}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            COMMENT
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.comments}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Cash Example */}
                    {selectedTicket.type === "cash" && (
                      <>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            PRODUCT
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.product?.name}
                          </p>
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
                          <p className="text-[.7rem]">
                            {ticketDetails.comments}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            TYPE
                          </Text>
                          {ticketDetails.creditOrDebit === "credit" ? (
                            <p className="text-[.7rem] text-green-500">
                              Give Cash
                            </p>
                          ) : (
                            <p className="text-[.7rem] text-red-500">
                              Collected Cash
                            </p>
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

                    {/* Store Details */}
                    {selectedTicket.type === "store" && (
                      <>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            RECEIVED BY
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.recievedBy}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            COMMENTS
                          </Text>
                          <p className="text-[.7rem]">
                            {ticketDetails.comments}
                          </p>
                        </div>
                        <div>
                          <Text className="text-[.56rem] font-black tracking-wide">
                            ITEMS
                          </Text>
                          {ticketDetails.items &&
                            Object.entries(ticketDetails.items).map(
                              ([goodsName, quantity]) => (
                                <p key={goodsName} className="text-[.7rem]">
                                  {fetchStoreNameByID(goodsName).name}:{" "}
                                  {quantity}{" "}
                                  {fetchStoreNameByID(goodsName).unit}
                                </p>
                              )
                            )}
                        </div>
                      </>
                    )}
                  </Grid>

                  {ticketDetails?.status === "approved" &&
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
                    <div className="buttons-div justify-center mt-[5px] bottom-0 flex">
                      <div className="flex gap-4">
                        <Button
                          color="red"
                          size={"2"}
                          disabled={rejectLoading}
                          className="p-3 rounded"
                          onClick={rejectTicket}
                        >
                          {rejectLoading ? <LoaderIcon /> : "Disapprove"}
                        </Button>
                        <Button
                          color="green"
                          className="p-3 rounded"
                          size={"2"}
                          onClick={approveTicket}
                          disabled={approveLoading}
                        >
                          {approveLoading ? <LoaderIcon /> : "Approve"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="flex mt-4 justify-end">
                        <div
                          className="hover:bg-slate-400/30 cursor-pointer p-2 rounded-md"
                          onClick={(e) => {
                            setDialogOpen(!dialogOpen);
                          }}
                        >
                          <FontAwesomeIcon icon={faExpand} />
                        </div>
                      </div> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      <Toaster position="top-right" />
    </>
  );
};

export default IndividualInfo;
