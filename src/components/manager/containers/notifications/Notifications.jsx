import React, { useState, useEffect, useRef } from "react";
import { refractor } from "../../../date";
import { BellIcon } from "@radix-ui/react-icons";
import { Card, Text, Tabs, Box, Flex, Button, Spinner } from "@radix-ui/themes";
import { faInfo, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const Notifications = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Mapping for notification types
  const notificationRoutes = {
    "Authority to weigh": "/admin/approve-weigh-auth/",
    LPO: "/admin/approve-lpo/",
    "cash ticket": "/admin/approve-cash-ticket/",
    "Authority to collect from General Store": "/admin/approve-store-auth/",
    waybill: "/customer/approve-waybill/",
    gatepass: "/customer/approve-gatepass/",
    Invoice: "/customer/approveInvoice/",
  };

  const rejectionRoutes = {
    lpo: "/admin/reject-lpo",
    weigh: "/admin/reject-weigh-auth",
    store: "/admin/reject-store-auth",
    waybill: "/customer/reject-waybill",
    gatepass: "/customer/reject-gatepass",
    invoice: "/customer/rejectInvoice",
    cash: "/admin/reject-cashticket",
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    setFetchLoading(true);
    try {
      const { data } = await axios.get(`${root}/admin/get-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allNotifications = [
        ...(data?.data?.unreadNotifications || []),
        ...(data?.data?.readNotifications || []),
      ];
      setNotifications(allNotifications);
      setUnreadNotifications(data?.data?.unreadNotifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Close notifications on outside click
  const closeNotifications = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsNotificationsOpen(false);
    }
  };

  // Handle notification toggle
  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  // Approve notification
  const approveTicket = async (message, id) => {
    const token = localStorage.getItem("token");
    const route = Object.keys(notificationRoutes).find((key) =>
      message.includes(key)
    );

    if (!route) {
      console.error("Invalid notification type");
      return;
    }

    setButtonLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(
        `${root}${notificationRoutes[route]}${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error approving ticket:", error);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Disapprove notification
  const disapproveTicket = async (type, id) => {
    const token = localStorage.getItem("token");
    const route = rejectionRoutes[type];
    if (!route) return;

    setButtonLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(
        `${root}${route}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error disapproving ticket:", error);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Render notifications
  const renderNotifications = (list) =>
    list.length > 0 ? (
      list.map((notification) => (
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
              <Flex gap="2" className="mt-1">
                <Button
                  className="text-[.6rem]"
                  color="red"
                  onClick={() =>
                    disapproveTicket(notification.type, notification.ticketId)
                  }
                  disabled={buttonLoading[notification.ticketId]}
                >
                  {buttonLoading[notification.ticketId] ? (
                    <Spinner />
                  ) : (
                    "Disapprove"
                  )}
                </Button>
                <Button
                  className="text-[.6rem]"
                  color="green"
                  onClick={() =>
                    approveTicket(notification.message, notification.ticketId)
                  }
                  disabled={buttonLoading[notification.ticketId]}
                >
                  {buttonLoading[notification.ticketId] ? (
                    <Spinner />
                  ) : (
                    "Approve"
                  )}
                </Button>
              </Flex>
            </div>
          </Flex>
        </div>
      ))
    ) : (
      <Text className="text-gray-500">No notifications</Text>
    );

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
        <div
          className="absolute top-10 right-0 w-80 !z-[9999] shadow-md p-4 bg-white border border-gray-200 rounded-md"
          style={{ borderRadius: "8px" }}
        >
          <Flex justify="end" mb="2">
            <Button
              className="text-[.7rem]"
              onClick={fetchNotifications}
              disabled={fetchLoading}
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
            <Box pt="3" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <Tabs.Content value="all">
                {renderNotifications(notifications)}
              </Tabs.Content>
              <Tabs.Content value="unread">
                {renderNotifications(unreadNotifications)}
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      )}
    </div>
  );
};

export default Notifications;
