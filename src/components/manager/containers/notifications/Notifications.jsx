import React, { useState, useEffect, useRef } from "react";
import { refractor } from "../../../date";
import { BellIcon } from "@radix-ui/react-icons";
import { Card, Text, Tabs, Box, Flex, Button } from "@radix-ui/themes";
import { faInfo, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const Notifications = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
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
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const closeNotifications = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsNotificationsOpen(false);
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
        className="cursor-pointer relative border-[1px] border-[#000]/60 rounded-lg p-3"
        onClick={toggleNotifications}
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
      {isNotificationsOpen && (
        <Card
          className="absolute top-10 right-0 w-80 bg-white shadow-md p-4 z-50 border border-gray-200 rounded-md"
          style={{ borderRadius: "8px" }}
        >
          {/* Reload Button */}
          <Flex justify="end" mb="2">
            <Button
              className="text-[.7rem] cursor-pointer"
              onClick={fetchNotifications}
            >
              <FontAwesomeIcon icon={faRefresh} />
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
                      className="mb-3 p-2 rounded hover:bg-gray-100"
                    >
                      <Flex gap="2" align="center">
                        <Card className="bg-red-400 p-4 w-[40px] place-self-start h-[40px] flex justify-center items-center">
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
                          <Flex gap={"2"} className="mt-1">
                            <Button
                              className="text-[.6rem] cursor-pointer"
                              color="red"
                            >
                              Disapprove
                            </Button>
                            <Button
                              className="text-[.6rem] cursor-pointer"
                              color="green"
                            >
                              Approve
                            </Button>
                          </Flex>
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
        </Card>
      )}
    </div>
  );
};

export default Notifications;
