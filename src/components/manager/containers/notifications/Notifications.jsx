import React, { useState, useEffect, useRef } from "react";
import { rejectTicket, acceptTicket, sendTicket, cashTicketConfirm } from "./NotificationsData";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import { BellIcon } from "@radix-ui/react-icons";
import { Card, Text, Tabs, Flex, Button, Spinner, Separator, TextField } from "@radix-ui/themes";
import { faInfo, faRefresh, faCircle, faUser, faTags } from "@fortawesome/free-solid-svg-icons";
import { Button as AntButton, Switch } from "antd";
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
  const [allNotifications, setAllNotifications] = useState([]);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const notificationRef = useRef(null);
  const [confirmAuthOpen, setConfirmAuthOpen] = useState({});
  const [confirmBtnLoading, setConfirmBtnLoading] = useState({});
  const [selectedTicket, setSelectedTicket] = useState("");

  // State management for SelectAdminSidePane
  const [sidePaneState, setSidePaneState] = useState({ openId: null, type: null, ticketId: null, ticketStatus: null });
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [approveButtonLoading, setApproveButtonLoading] = useState({});
  const [isSidePaneSubmitting, setIsSidePaneSubmitting] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    setFetchLoading(true);
    try {
      const response = await axios.get(`${root}/admin/get-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUnreadNotifications = response.data.data.unreadNotifications || [];
      const generalNotifications = [
        ...response.data.data.unreadNotifications,
        ...response.data.data.readNotifications,
      ];

      setNotifications(generalNotifications);
      setAllNotifications(generalNotifications);
      setUnreadNotifications(fetchedUnreadNotifications);
      setFetchLoading(false);
    } catch (error) {
      if (error.status != 403) {
        console.error("Error fetching notifications:", error);
      }
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
    setIsSlidingOut(true);
    setTimeout(() => {
      setIsNotificationsOpen(false);
      setIsSlidingOut(false);
      setSidePaneState({ openId: null, type: null, ticketId: null, ticketStatus: null });
      setSelectedAdmins([]);
    }, 300);
  };

  const closeNotifications = () => {
    slideOutNotifications();
    setSidePaneState({ openId: null, type: null, ticketId: null, ticketStatus: null });
  };

  const denyTicket = async (ticketType, ticketId) => {
    const token = localStorage.getItem("token");
    const endpoint = rejectTicket[ticketType];
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    if (!endpoint || endpoint === null || endpoint === undefined) {
      toast.error("ticket type does not exist");
      return;
    }

    try {
      const response = await axios.patch(`${root}/${endpoint}/${ticketId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ticket Denied Successfully", { duration: 3500 });
      fetchNotifications();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message || "An error occurred while trying to deny ticket");
    }
  };

  const fetchAdminDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.staffList);
    } catch (e) {
      if (e.status !== 403) {
        console.log(e);
        toast.error(e.message || e.response.data.message || "An error occurred while trying to fetch admin details");
      }
    }
  };

  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token")); // Fixed typo from decode BOTHtoken
  };

  const confirmCashTicket = async (ticketId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    setConfirmBtnLoading((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const response = await axios.post(`${root}/${cashTicketConfirm}/${ticketId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      fetchNotifications();
      setConfirmBtnLoading((prev) => ({ ...prev, [ticketId]: false }));
    } catch (error) {
      toast.error(error.response.data.message || "Error confirming cash ticket");
      setConfirmBtnLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const sendApprovedTicket = async (type, ticketId, adminsId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    try {
      const response = await axios.post(`${root}/${sendTicket[type]}/${ticketId}`, {
        adminIds: adminsId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Ticket not sent successfully.", { duration: 4500 });
      return error.status;
    }
  };

  const SelectAdminSidePane = ({ type, ticketID, ticketStatus }) => {
    const approveTicket = async (ticketType, ticketId) => {
      const token = localStorage.getItem("token");
      const endpoint = acceptTicket[ticketType];
      if (!token) {
        toast.error("An error occurred, try logging in again");
        return;
      }

      if (!endpoint) {
        toast.error("Ticket type does not exist");
        return;
      }

      setApproveButtonLoading((prev) => ({ ...prev, [ticketId]: true }));
      try {
        const response = await axios.patch(`${root}/${endpoint}/${ticketId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApproveButtonLoading((prev) => ({ ...prev, [ticketId]: false }));
        return response.status;
      } catch (error) {
        setApproveButtonLoading((prev) => ({ ...prev, [ticketId]: false }));
        toast.error(error.response?.data?.message || "An error occurred while trying to approve ticket");
        return error.response?.status || 500;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("An error occurred, try logging in again.");
        return;
      }

      if (selectedAdmins.length === 0 || selectedAdmins.includes(null)) {
        toast.error("Select at least one staff.");
        return;
      }

      setIsSidePaneSubmitting(true);
      try {
        if (ticketStatus === "approved") {
          await sendApprovedTicket(type, ticketID, selectedAdmins);
          toast.success("Ticket already approved, sending details...", {
            duration: 3000,
            style: { padding: "30px" },
          });
        } else {
          const firstRequest = await approveTicket(type, ticketID);
          if (firstRequest === 200) {
            await sendApprovedTicket(type, ticketID, selectedAdmins);
            toast.success("Ticket approved and sent successfully", {
              duration: 3000,
              style: { padding: "30px" },
            });
          } else {
            throw new Error("Error occurred in approving ticket");
          }
        }
        fetchNotifications();
        setSidePaneState({ openId: null, type: null, ticketId: null, ticketStatus: null });
        setSelectedAdmins([]);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      } finally {
        setIsSidePaneSubmitting(false);
      }
    };

    const handleCheckboxChange = (adminId) => {
      setSelectedAdmins((prev) =>
        prev.includes(adminId) ? prev.filter((id) => id !== adminId) : [...prev, adminId]
      );
    };

    return (
      <div className="absolute z-[60] -translate-x-[300px] top-0 mb-20 bg-white min-w-[300px] min-h-[300px] p-4 shadow-md">
        <h1 className="font-space font-bold text-[1.1rem]">Approve To</h1>
        <p
          className="absolute right-[10px] cursor-pointer top-[5px]"
          onClick={() => setSidePaneState({ openId: null, type: null, ticketId: null, ticketStatus: null })}
        >
          <FontAwesomeIcon icon={faClose} />
        </p>
        <form action="" onSubmit={handleSubmit}>
          <div className="my-2 h-[180px] overflow-scroll overflow-x-hidden">
            {admins.map((admin) => (
              <label
                key={admin.id}
                className="flex items-center flex-row-reverse cursor-pointer gap-2"
              >
                <input
                  type="checkbox"
                  className=""
                  value={admin.id}
                  checked={selectedAdmins.includes(admin.roleId)}
                  onChange={() => handleCheckboxChange(admin.roleId)}
                />
                <span className="w-full p-2">
                  {`${admin.firstname} ${admin.lastname} (${admin.role?.name || ""})`}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-4 mb-15">
            <button
              className="bg-theme px-4 py-2 text-white rounded"
              disabled={isSidePaneSubmitting}
            >
              {isSidePaneSubmitting ? <Spinner /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const AuthToWeighConfirmPane = ({ id }) => {
    const [selectedOption, setSelectedOption] = useState("all");
    const [quantity, setQuantity] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleRadioChange = (e) => {
      setSelectedOption(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("An error occurred, try logging in again");
        return;
      }

      if (selectedOption === "other" && quantity.length === 0) {
        toast.error("Provide a quantity");
        return;
      }
      const body = { ...(quantity && { quantityLoaded: quantity }) };

      setButtonLoading(true);
      try {
        const response = await axios.post(`${root}/admin/load/${id}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Ticket Sent Successfully", {
          duration: 3000,
          style: { padding: "20px" },
        });
        fetchNotifications();
        setButtonLoading(false);
        setQuantity("");
        setConfirmAuthOpen({});
      } catch (error) {
        setButtonLoading(false);
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to confirm weigh ticket");
      }
    };

    return (
      <div className="absolute z-[60] -translate-x-[300px] top-0 mb-20 bg-white min-w-[250px] min-h-[170px] p-4 shadow-md rounded-md">
        <button
          className="absolute right-[10px] top-[10px] text-gray-600 hover:text-gray-800"
          onClick={() => setConfirmAuthOpen({})}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <h1 className="font-bold mb-3">What quantity did you load?</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="options"
                value="all"
                checked={selectedOption === "all"}
                onChange={handleRadioChange}
              />
              All
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="options"
                value="other"
                checked={selectedOption === "other"}
                onChange={handleRadioChange}
              />
              Other
            </label>
          </div>
          {selectedOption === "other" && (
            <TextField.Root
              type="number"
              placeholder="Enter Quantity"
              className="mt-3 w-full"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {buttonLoading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    fetchNotifications();
    fetchAdminDetails();
  }, []);

  return (
    <>
      <div className="relative" ref={notificationRef}>
        <div
          className="cursor-pointer relative border-[1px] z-[40] border-[#000]/60 rounded-lg p-3"
          onClick={() => {
            toggleNotifications();
            fetchNotifications();
            fetchAdminDetails();
          }}
        >
          <BellIcon />
          {notifications.length > 0 && (
            <div className="absolute right-[-5px] top-[-3px] bg-red-500 w-[15px] h-[15px] rounded-full">
              <span className="text-white flex justify-center items-center text-[.6rem] font-bold">
                {notifications.length}
              </span>
            </div>
          )}
        </div>
        <div>
          <div
            className={`notifications-panel absolute top-10 right-[-70px] w-[30rem] z-[50] !overflow-x-visible shadow-md p-4 max-h-[100vh] bg-white border border-gray-200 rounded-md ${
              isNotificationsOpen && !isSlidingOut
                ? "translate-x-0 block opacity-100"
                : "translate-x-[160%] opacity-0 hidden"
            }`}
            style={{ borderRadius: "8px", overflowY: "", overflowX: "visible" }}
          >
            <div className="notification-container">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-space font-medium text-[1.7rem]">Notifications</h1>
                <Button
                  color="red"
                  className="text-[.7rem] cursor-pointer"
                  onClick={closeNotifications}
                >
                  <FontAwesomeIcon icon={faClose} />
                </Button>
              </div>
              {selectedTicket && (
                <IndividualInfo
                  open={detailsPageOpen}
                  selectedTicket={selectedTicket}
                  setOpen={setDetailsPageOpen}
                />
              )}
              <div className="absolute right-[10px] mt-3 flex gap-1 items-center">
                <label htmlFor="switch" className="text-sm cursor-pointer font-amsterdam">
                  Unread
                </label>
                <Switch
                  id="switch"
                  size="small"
                  onChange={(val) => {
                    if (val) {
                      setNotifications(unreadNotifications);
                    } else {
                      setNotifications(allNotifications);
                    }
                  }}
                />
              </div>

              <Tabs.Root defaultValue="all" className="!overflow-visible">
                <Tabs.List>
                  <Tabs.Trigger value="all">All</Tabs.Trigger>
                  <Tabs.Trigger value="tickets">Tickets</Tabs.Trigger>
                  <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
                </Tabs.List>

                <div className="pt-3 max-h-[100vh] w-full notifications-box" style={{ overflowY: "", overflowX: "" }}>
                  <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "scroll", overflowX: "hidden" }}>
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
                              className="mb-3 p-2 rounded cursor-pointer relative"
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
                                        {refractor(notification.createdAt)},{" "}
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
                                        <span>{_.upperFirst(notification.type)}</span>
                                      </div>
                                    </Text>

                                    {decodeToken().isAdmin && notification.ticketStatus == "pending" && (
                                      <div className="button-groups flex gap-4 mt-4">
                                        <AntButton
                                          className="bg-theme text-white hover:!bg-theme hover:text-white"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSidePaneState({
                                              openId: notification.id,
                                              type: notification.type,
                                              ticketId: notification.ticketId,
                                              ticketStatus: notification.ticketStatus,
                                            });
                                          }}
                                        >
                                          {approveButtonLoading[notification?.ticketId] ? <Spinner /> : "Approve"}
                                        </AntButton>
                                        <AntButton
                                          onClick={(e) => {
                                            e.preventDefault();
                                            denyTicket(notification.type, notification?.ticketId || null);
                                          }}
                                        >
                                          Deny
                                        </AntButton>
                                      </div>
                                    )}

                                    {notification.type === "cash" && notification.ticketStatus == "approved" && (
                                      <div className="button-groups flex gap-4 mt-4">
                                        <AntButton
                                          className="bg-green-500 text-white"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            confirmCashTicket(notification.ticketId);
                                          }}
                                        >
                                          {confirmBtnLoading[notification?.ticketId] ? <Spinner /> : "Confirm"}
                                        </AntButton>
                                      </div>
                                    )}
                                    {notification.type === "weigh" && notification.ticketStatus === "approved" && (
                                      <div className="button-groups flex gap-4 mt-4">
                                        <AntButton
                                          className="bg-green-500 text-white"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setConfirmAuthOpen((prev) => ({
                                              ...prev,
                                              [notification.id]: true,
                                            }));
                                          }}
                                        >
                                          Confirm
                                        </AntButton>
                                      </div>
                                    )}
                                  </div>
                                </Flex>
                              </Flex>
                            </div>
                            {notifications.length > 1 && <Separator className="w-full" />}
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
                      <Text className="text-gray-500">No Inventory notifications</Text>
                    </Tabs.Content>
                  </div>
                  {/* Render side panes outside the scrolling container */}
                  {sidePaneState.openId && (
                    <div className="top-0 left-0 z-[100] w-full h-full">
                      <SelectAdminSidePane
                        type={sidePaneState.type}
                        ticketID={sidePaneState.ticketId}
                        ticketStatus={sidePaneState.ticketStatus}
                      />
                    </div>
                  )}
                  {Object.keys(confirmAuthOpen).map((id) => (
                    confirmAuthOpen[id] && (
                      <AuthToWeighConfirmPane key={id} id={notifications.find(n => n.id === id)?.ticketId} />
                    )
                  ))}
                </div>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default Notifications;