import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import { BellIcon } from "@radix-ui/react-icons";
import { Card, Text, Tabs, Box, Flex, Button, Spinner } from "@radix-ui/themes";
import { faInfo, faRefresh, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
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

  // -------Individual Info Resides Here ----------

  // --------Individual Info Resides Here --------

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
    fetchGeneralStore();
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
          {/* {detailsPageOpen && <IndividualInfo />} */}
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
                      onClick={() => {
                        if (getToken().id === notification.adminId) {
                          return;
                        } else {
                          

                          setSelectedTicket(notification);
                          setDetailsPageOpen(true);
                        }
                      }}
                      key={notification.id}
                      className="mb-3 p-2 rounded hover:bg-gray-100 relative cursor-pointer"
                    >
                      {!notification.read && (
                        <div className="check  absolute top-0 left-0 z-[10]">
                          <FontAwesomeIcon
                            icon={faCircle}
                            className="text-red-500 w-[10px]"
                          />
                        </div>
                      )}
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
                            {refractor(notification.createdAt)},
                            {refractorToTime(notification.createdAt)}
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
                      className="mb-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <Flex gap="2" align="center" className="relative">
                        <Card className="bg-red-400 p-4 w-[40px] h-[40px] flex justify-center items-center">
                          <FontAwesomeIcon icon={faInfo} />
                        </Card>
                        <Flex justify={"between"} gap={"3"}>
                          <div>
                            <Text className="text-[.7rem] font-medium">
                              {notification.message}
                            </Text>
                            <br />
                            <Text className="text-[.5rem] text-gray-500">
                              {refractor(notification.createdAt)},
                              {refractorToTime(notification.createdAt)}
                            </Text>
                          </div>

                          {notification.read && (
                            <div className="delete-icon cursor-zoom-in">
                              <FontAwesomeIcon
                                icon={faTrash}
                                color="red"
                                className="w-[10px]"
                              />
                            </div>
                          )}
                        </Flex>
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
