import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "@radix-ui/react-icons";
import { Card, Text, Separator, Flex, Tabs, Box } from "@radix-ui/themes";
import Logout from "../Logout";
import { faBars, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const Header = ({ sidebarOpen, setSidebarOpen, user, role }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Dummy notifications data
  const notifications = [
    { id: 1, title: "New User Registered", time: "2 mins ago" },
    { id: 2, title: "System Update", time: "1 hour ago" },
    { id: 3, title: "New Message", time: "Yesterday" },
  ];

  // Function to get notifcations
  const getNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${root}/admin/get-noifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
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

  // Close the popup on outside click
  useEffect(() => {
    document.addEventListener("click", closeNotifications, true);
    return () => {
      document.removeEventListener("click", closeNotifications, true);
    };
  }, []);

  const getAdminName = () => {
    const name = localStorage.getItem("adminFirstName");
    return name || "Admin";
  };

  return (
    <header className="top-0 z-10 font-amsterdam flex w-full shadow-md dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-[99999] block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Welcome Message */}
        <div className="hidden sm:block">
          <h1 className="text-[2.0rem] z-0">Welcome {getAdminName()}</h1>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Notifications Bell */}
          <div className="relative" ref={notificationRef}>
            <div
              className="cursor-pointer relative border-[1px] border-[#000]/60 rounded-lg p-3"
              onClick={toggleNotifications}
            >
              <BellIcon />
              <div className="absolute right-[-5px] top-[-3px] bg-red-500 w-[15px] h-[15px] rounded-full">
                <span className="text-white flex justify-center items-center text-[.6rem] font-bold">
                  {notifications.length}
                </span>
              </div>
            </div>
            {isNotificationsOpen && (
              <Card
                className="absolute top-10 right-0 w-80 bg-white shadow-md p-4 z-50 border border-gray-200 rounded-md"
                style={{ borderRadius: "8px" }}
              >
                <Tabs.Root defaultValue="account">
                  <Tabs.List>
                    <Tabs.Trigger value="all">All</Tabs.Trigger>
                    <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
                  </Tabs.List>

                  <Box pt="3">
                    <Tabs.Content value="all">
                      <Text size="2">Make changes to your account.</Text>
                    </Tabs.Content>

                    <Tabs.Content value="unread">
                      <Text size="2">Access and update your documents.</Text>
                    </Tabs.Content>
                  </Box>
                </Tabs.Root>

                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="mb-3 p-2 rounded hover:bg-gray-100"
                    >
                      <Flex gap={"2"} align={"center"}>
                        <Card className="bg-green-400 p-4 w-[40px] h-[40px] flex justify-center items-center">
                          <FontAwesomeIcon icon={faInfo} />
                        </Card>
                        <div>
                          <Text className="text-[.7rem] font-medium">
                            {notification.title}
                          </Text>
                          <br />
                          <Text className="text-[.5rem] text-gray-500">
                            {notification.time}
                          </Text>
                        </div>
                      </Flex>
                    </div>
                  ))
                ) : (
                  <Text className="text-gray-500">No notifications</Text>
                )}
              </Card>
            )}
          </div>

          {/* Logout Button */}
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
