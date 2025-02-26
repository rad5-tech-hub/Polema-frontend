import React, { useState, useEffect, useRef } from "react";
import { rejectTicket, acceptTicket } from "./NotificationsData";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
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
} from "@radix-ui/themes";
import {
  faInfo,
  faRefresh,
  faCircle,
  faUser,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { Button as AntButton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import IndividualInfo from "./IndividualInfo";
const root = import.meta.env.VITE_ROOT;
const Notifications = () => {
  const getToken = () => {
    const token = localStorage.getItem("token");

    return jwtDecode(token);
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const notificationRef = useRef(null);

  const [selectedTicket, setSelectedTicket] = useState("");

  // Component for individual notification info
  const [storeDetails, setStoreDetails] = useState([]);

  const [approveButtonLoading, setApproveButtonLoading] = useState({});

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
    slideOutNotifications();
  };

  // Function to approve ticket
  const approveTicket = async (ticketType, ticketId) => {
    const token = localStorage.getItem("token");
    const endpoint = acceptTicket[ticketType];
    if (!token) {
      toast.error("An error occurred , try logging in again");
      return;
    }

    if (!endpoint || endpoint === null || endpoint === undefined) {
      toast.error("ticket type does not exist");
      return;
    }
    //Display Loader Ovet the button
    setApproveButtonLoading((prev) => ({
      ...prev,
      [ticketId]: true,
    }));

    try {
      const response = await axios.patch(
        `${root}/${endpoint}/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApproveButtonLoading((prev) => ({
        ...prev,
        [ticketId]: false,
      }));

      toast.success("Ticket approved successfully.", {
        duration: 3000,
      });
    } catch (e) {
      setApproveButtonLoading((prev) => ({
        ...prev,
        [ticketId]: false,
      }));

      console.log(e);

      toast.error(
        e.response.data.message ||
          "An error occurred , while trying to approve ticket"
      );
    }
  };

  // Function to deny ticket
  const denyTicket = async (ticketType, ticketId) => {
    const token = localStorage.getItem("token");
    const endpoint = rejectTicket[ticketType];
    if (!token) {
      toast.error("An error occurred , try logging in again");
      return;
    }

    if (!endpoint || endpoint === null || endpoint === undefined) {
      toast.error("ticket type does not exist");
      return;
    }

    try {
      const response = await axios.patch(
        `${root}/${endpoint}/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Ticket Denied Successfully", {
        duration: 3500,
      });
    } catch (e) {
      console.log(e);

      toast.error(
        e.response.data.message ||
          "An error occurred , while trying to deny ticket"
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchGeneralStore();
  }, []);

  return (
    <>
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
            className={`notifications-panel absolute top-10 right-[-70px] w-[30rem] z-[9999] shadow-md p-4 bg-white border border-gray-200 rounded-md transition-transform duration-300 ${
              isNotificationsOpen && !isSlidingOut
                ? "translate-x-0"
                : "translate-x-full"
            }`}
            style={{ borderRadius: "8px" }}
          >
            {/* {detailsPageOpen && <IndividualInfo />} */}
            <Flex justify="between" mb="2" align={"center"} width={"100%"}>
              <h1 className="font-space font-medium text-[1.7rem]">
                Notifications
              </h1>
              <Button
                color="red"
                className="text-[.7rem] cursor-pointer"
                onClick={closeNotifications}
              >
                <FontAwesomeIcon icon={faClose} />
              </Button>
              {/* <Button
                className="text-[.7rem] cursor-pointer"
                onClick={fetchNotifications}
              >
                {fetchLoading ? (
                  <Spinner />
                ) : (
                  <FontAwesomeIcon icon={faRefresh} />
                )}
              </Button> */}
            </Flex>
            {selectedTicket && (
              <IndividualInfo
                // ticketDetails={}
                open={detailsPageOpen}
                selectedTicket={selectedTicket}
                setOpen={setDetailsPageOpen}
              ></IndividualInfo>
            )}

            <Tabs.Root defaultValue="all">
              <Tabs.List>
                <Tabs.Trigger value="all">All</Tabs.Trigger>
                {/* <Tabs.Trigger value="unread">Unread</Tabs.Trigger> */}
                <Tabs.Trigger value="tickets">Tickets</Tabs.Trigger>
                <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
              </Tabs.List>

              <Box
                pt="3"
                style={{ maxHeight: "300px", overflowY: "auto" }}
                className="notifications-box"
              >
                <Tabs.Content value="all">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <>
                        <div
                          key={notification.id}
                          onClick={() => {
                            // setSelectedTicket(notification);
                            // setDetailsPageOpen(true);
                          }}
                          className="mb-3 p-2 rounded  cursor-pointer"
                        >
                          <Flex gap="2" align="center" className="relative">
                            <div className="self-start">
                              <Card className="bg-green-400 p-4 w-[40px] h-[40px] flex justify-center items-center">
                                <FontAwesomeIcon icon={faUser} />
                              </Card>
                            </div>
                            <Flex gap={"3"}>
                              <div>
                                <Text
                                  className="text-[.85rem] font-medium m-0 p-0 hover:underline"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setSelectedTicket(notification);
                                    setDetailsPageOpen(true);
                                  }}
                                >
                                  {notification.message}
                                </Text>
                                <br />
                                <Text className="text-[.5rem] text-gray-500">
                                  <div>
                                    {refractor(notification.createdAt)},
                                    {refractorToTime(notification.createdAt)}
                                  </div>
                                  <div
                                    className="mt-2 flex gap-2 items-center bg-[#424242]/10 text-black p-2 w-fit rounded-md"
                                    onClick={() => {
                                      setSelectedTicket(notification);
                                      setDetailsPageOpen(true);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTags} />
                                    <span>
                                      {_.upperFirst(notification.type)}
                                    </span>
                                  </div>
                                </Text>

                                <div className="button-groups flex gap-4 mt-4">
                                  <AntButton
                                    className="bg-theme text-white hover:!bg-theme hover:text-white"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      approveTicket(
                                        notification.type,
                                        notification?.ticketId || null
                                      );
                                    }}
                                  >
                                    {" "}
                                    {approveButtonLoading[
                                      notification?.ticketId
                                    ] ? (
                                      <Spinner />
                                    ) : (
                                      "Approve"
                                    )}
                                  </AntButton>
                                  <AntButton
                                    onClick={(e) => {
                                      e.preventDefault();
                                      denyTicket(
                                        notification.type,
                                        notification?.ticketId || null
                                      );
                                    }}
                                  >
                                    Deny
                                  </AntButton>
                                </div>
                              </div>

                              {/* <div>
                                
                              </div> */}
                            </Flex>
                          </Flex>
                        </div>
                        <Separator className="w-full" />
                      </>
                    ))
                  ) : (
                    <Text className="text-gray-500">No notifications</Text>
                  )}
                </Tabs.Content>

                <Tabs.Content value="tickets">
                  <Text className="text-gray-500">No ticket notifications</Text>
                </Tabs.Content>
                <Tabs.Content value="inventory">
                  <Text className="text-gray-500">
                    No Inventory notifications
                  </Text>
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default Notifications;
