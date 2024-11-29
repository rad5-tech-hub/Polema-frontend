import React, { useState, useEffect, useRef } from "react";

import _ from "lodash";
import { refractor } from "../../../date";
import { BellIcon } from "@radix-ui/react-icons";
import {
  Card,
  Text,
  Tabs,
  Box,
  Flex,
  Button,
  Spinner,
  Separator,
  Grid,
} from "@radix-ui/themes";
import { faInfo, faRefresh, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const Notifications = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const notificationRef = useRef(null);

  const [selectedTicket, setSelectedTicket] = useState("");

  // Component for individual notification info
  const IndividualInfo = () => {
    const [ticketDetails, setTicketDetails] = useState();
    const [rejectLoading, setRejectLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);

    const getAppropriateEndpoint = () => {
      switch (selectedTicket.type) {
        case "lpo":
          return "admin/view-approved-lpo";
        case "vehicle":
          return "customer/view-vehicle";
        case "cash":
          return "admin/view-cash-ticket";
        case "store":
          return "admin/view-approved-store-auth";
        case "gatepass":
          return "customer/view-gatepass";
        case "invoice":
          return "customer/get-invoice";
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

    // Functon to fetch ticket details
    const fetchTicketDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("An error occurred ,try logging in again", {
          style: {
            padding: "20px",
          },
          duration: 6000,
        });
      }

      try {
        const response = await axios.get(
          `${root}/${getAppropriateEndpoint()}/${selectedTicket.ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        switch (selectedTicket.type) {
          case "lpo":
            setTicketDetails(response.data.record);
            break;
          case "vehicle":
            setTicketDetails(response.data.vehicle);
          case "invoice":
            setTicketDetails(response.data.invoice);
          case "weigh":
            setTicketDetails(response.data.ticket);
          case "gatepass":
            setTicketDetails(response.data.gatePass);
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Function to approve tickets
    const approveTicket = async () => {
      const token = localStorage.getItem("token");
      setApproveLoading(true);
      try {
        const response = await axios.patch(
          `${root}/${getAppropriateAcceptEndpoint()}/${
            selectedTicket.ticketId
          }`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApproveLoading(false);
        toast.success("Ticket Approved", {
          style: {
            padding: "20px",
          },
          duration: 3000,
        });

        setTimeout(() => {
          setDetailsPageOpen(false);
        }, 5000);
      } catch (error) {
        console.log(error);
        setApproveLoading(false);
      }
    };

    // Function to disapprove tickets
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRejectLoading(false);
        toast.success("Ticket Disapproved");
      } catch (error) {
        console.log(error);
      }
    };

    React.useEffect(() => {
      fetchTicketDetails();
    }, []);
    return (
      <>
        <div className="absolute  bg-white h-full z-10 rounded-md top-0 left-0 p-6 right-[-70px] w-[25rem]">
          <div
            className="absolute right-[17px] top-[10px] cursor-pointer"
            onClick={() => {
              setDetailsPageOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
          <h1> {_.upperFirst(selectedTicket.type)} Ticket Details</h1>
          <Separator className="my-2 w-full" />

          <div className="details-container h-[75%]">
            {typeof ticketDetails !== "object" ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              <>
                <Grid columns={"3"}>
                  {ticketDetails.deliveredTo && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        DELIVERED TO
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.deliveredTo}
                      </p>
                    </div>
                  )}
                  {ticketDetails?.product && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        PRODUCT
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.product.name}
                      </p>
                    </div>
                  )}
                  {ticketDetails.quantOrdered && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        Quantity Ordered
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.quantOrdered}
                      </p>
                    </div>
                  )}
                  {ticketDetails.unitPrice && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        UNIT PRICE
                      </Text>
                      <p className="text-[.7rem]">{ticketDetails.unitPrice}</p>
                    </div>
                  )}
                  {ticketDetails?.supplier?.firstname && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        SUPPLIER
                      </Text>
                      <p className="text-[.7rem]">
                        {`${ticketDetails?.supplier.firstname} ${ticketDetails?.supplier.lastname}`}
                      </p>
                    </div>
                  )}
                  {ticketDetails?.customer?.firstname && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        CUSTOMER
                      </Text>
                      <p className="text-[.7rem]">
                        {`${ticketDetails?.customer.firstname} ${ticketDetails?.customer.lastname}`}
                      </p>
                    </div>
                  )}
                  {ticketDetails.raisedByAdminId && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        SENT BY
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.raisedByAdminId}
                      </p>
                    </div>
                  )}
                  {ticketDetails.role && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        ADMIN ROLE
                      </Text>
                      <p className="text-[.7rem]">{ticketDetails.role.name}</p>
                    </div>
                  )}
                  {ticketDetails?.driversName && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        DRIVER NAME
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.driversName}
                      </p>
                    </div>
                  )}
                  {ticketDetails?.escortName && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        ESCORT NAME
                      </Text>
                      <p className="text-[.7rem]">{ticketDetails.escortName}</p>
                    </div>
                  )}
                  {ticketDetails?.vehicleNo && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        VEHICLE NO
                      </Text>
                      <p className="text-[.7rem]">{ticketDetails.vehicleNo}</p>
                    </div>
                  )}
                  {ticketDetails?.destination && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        DESTINATION
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.destination}
                      </p>
                    </div>
                  )}
                  {/* Weigh Ticket Details */}
                  {ticketDetails?.driver && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        DRIVER
                      </Text>
                      <p className="text-[.7rem]">{ticketDetails.driver}</p>
                    </div>
                  )}
                  {ticketDetails?.transactions?.corder.firstname && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        NAME
                      </Text>
                      <p className="text-[.7rem]">
                        {`${ticketDetails.transactions?.corder.firstname} ${ticketDetails.transactions?.corder.lastname}`}
                      </p>
                    </div>
                  )}
                  {ticketDetails?.transactions.quantity && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        QUANTITY
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.transactions.quantity}
                      </p>
                    </div>
                  )}
                  {/* Details for gatepass */}
                  {ticketDetails?.destination && (
                    <div className="w-full">
                      <Text className="text-[.56rem] font-black tracking-wide">
                        DESTINATION
                      </Text>
                      <p className="text-[.7rem]">
                        {ticketDetails.destination}
                      </p>
                    </div>
                  )}
                  {/* Details for store ticket */}
                  {ticketDetails?.records &&
                    selectedTicket.type === "store" && (
                      <div className="w-full">
                        <Text className="text-[.56rem] font-black tracking-wide">
                          DESTINATION
                        </Text>
                        <p className="text-[.7rem]">
                          {ticketDetails.destination}
                        </p>
                      </div>
                    )}
                  <div className="w-full"></div>
                  <div className="w-full"></div>
                </Grid>
                {/* Allow mapping through entries */}
                {ticketDetails?.ledgerEntries && (
                  <>
                    <h1 className="text-[.56rem] font-black tracking-wide mt-2">
                      LEDGER DETAILS
                    </h1>
                    {ticketDetails.ledgerEntries.map((entry, index) => {
                      return (
                        <div key={index} className="mt-2">
                          <p>
                            {entry.quantity} {entry.unit}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>

          <div className="buttons-div justify-center flex">
            <div className="flex gap-4">
              <Button
                color="red"
                size={"2"}
                disabled={rejectLoading}
                onClick={rejectTicket}
              >
                {rejectLoading ? <Spinner /> : "Disapprove"}
              </Button>
              <Button
                color="green"
                size={"2"}
                onClick={approveTicket}
                disabled={approveLoading}
              >
                {approveLoading ? <Spinner /> : "Approve"}
              </Button>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </>
    );
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    setFetchLoading(true);
    try {
      const response = await axios.get(`${root}/admin/get-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allNotifications = [
        ...response.data.data.unreadNotifications,
        ...response.data.data.readNotifications,
      ];
      const fetchedUnreadNotifications =
        response.data.data.unreadNotifications || [];

      setNotifications(allNotifications);
      setUnreadNotifications(fetchedUnreadNotifications);
      setFetchLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setFetchLoading(false);
    }
  };

  const toggleNotifications = () => {
    if (isNotificationsOpen) {
      slideOutNotifications();
    } else {
      setIsNotificationsOpen(true);
    }
  };

  const slideOutNotifications = () => {
    setIsSlidingOut(true); // Start slide-out animation
    setTimeout(() => {
      setIsNotificationsOpen(false); // Hide panel after animation
      setIsSlidingOut(false); // Reset sliding state
    }, 300); // Match animation duration
  };

  const closeNotifications = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      slideOutNotifications();
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeNotifications, true);
    fetchNotifications();
    return () => {
      document.removeEventListener("click", closeNotifications, true);
    };
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <div
        className="cursor-pointer relative border-[1px] z-[999] border-[#000]/60 rounded-lg p-3"
        onClick={() => {
          toggleNotifications();
          fetchNotifications();
        }}
      >
        <BellIcon />
        {unreadNotifications.length > 0 && (
          <div className="absolute right-[-5px] top-[-3px] bg-red-500 w-[15px] h-[15px] rounded-full">
            <span className="text-white flex justify-center items-center text-[.6rem] font-bold">
              {unreadNotifications.length}
            </span>
          </div>
        )}
      </div>
      <div>
        <div
          className={`notifications-panel absolute top-10 right-[-70px] w-[25rem] z-[9999] shadow-md p-4 bg-white border border-gray-200 rounded-md transition-transform duration-300 ${
            isNotificationsOpen && !isSlidingOut
              ? "translate-x-0"
              : "translate-x-full"
          }`}
          style={{ borderRadius: "8px" }}
        >
          {detailsPageOpen && <IndividualInfo />}
          <Flex justify="end" mb="2">
            <Button
              className="text-[.7rem] cursor-pointer"
              onClick={fetchNotifications}
            >
              {fetchLoading ? (
                <Spinner />
              ) : (
                <FontAwesomeIcon icon={faRefresh} />
              )}
            </Button>
          </Flex>

          <Tabs.Root defaultValue="all">
            <Tabs.List>
              <Tabs.Trigger value="all">All</Tabs.Trigger>
              <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
            </Tabs.List>

            <Box
              pt="3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
              className="notifications-box"
            >
              <Tabs.Content value="all">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="mb-3 p-2 rounded hover:bg-gray-100"
                    >
                      <Flex gap="2" align="center">
                        <Card className="bg-green-400 p-4 w-[40px] h-[40px] flex justify-center items-center">
                          <FontAwesomeIcon icon={faInfo} />
                        </Card>
                        <div>
                          <Text className="text-[.7rem] font-medium">
                            {notification.message}
                          </Text>
                          <br />
                          <Text className="text-[.5rem] text-gray-500">
                            {refractor(notification.createdAt)}
                          </Text>
                        </div>
                      </Flex>
                    </div>
                  ))
                ) : (
                  <Text className="text-gray-500">No notifications</Text>
                )}
              </Tabs.Content>

              <Tabs.Content value="unread">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        setSelectedTicket(notification);
                        setDetailsPageOpen(true);
                      }}
                      className="mb-3 p-2 rounded hover:bg-gray-100"
                    >
                      <Flex gap="2" align="center">
                        <Card className="bg-red-400 p-4 w-[40px] h-[40px] flex justify-center items-center">
                          <FontAwesomeIcon icon={faInfo} />
                        </Card>
                        <div>
                          <Text className="text-[.7rem] font-medium">
                            {notification.message}
                          </Text>
                          <br />
                          <Text className="text-[.5rem] text-gray-500">
                            {refractor(notification.createdAt)}
                          </Text>
                        </div>
                      </Flex>
                    </div>
                  ))
                ) : (
                  <Text className="text-gray-500">No unread notifications</Text>
                )}
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
