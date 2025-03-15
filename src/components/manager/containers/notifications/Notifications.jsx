import React, { useState, useEffect, useRef } from "react";
import {
  rejectTicket,
  acceptTicket,
  sendTicket,
  cashTicketConfirm,
} from "./NotificationsData";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
// import { jwtDecode } from "jwt-decode";
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
  TextField,
} from "@radix-ui/themes";
import {
  faInfo,
  faRefresh,
  faCircle,
  faUser,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { Button as AntButton, Select, Switch } from "antd";
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
  const [alllNotifications, setAllNotifications] = useState([]);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const notificationRef = useRef(null);
  const [isSidePaneOpen, setIsSidePaneOpen] = useState({});
  const [confirmAuthOpen, setConfirmAuthOpen] = useState({});
  const [SelectedTicketType, setSelectedTicketType] = useState("");
  const [confirmBtnLoading,setConfirmBtnLoading] = useState({})

  // State manangement for everything that has to do with  the Select Admin Side PAne 
  const [sidePaneDetails,setSidePanelDetails] = useState({});
  const [fixedTopValue,setFixedTopValue] = useState(0);


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
      //putting check for only error 403
      if ((error.status = !403)) {
        console.log(error);
      }
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

      const fetchedUnreadNotifications =
        response.data.data.unreadNotifications || [];
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
    setIsSlidingOut(true); // Start slide-out animation
    setTimeout(() => {
      setIsNotificationsOpen(false); // Hide panel after animation
      setIsSlidingOut(false); // Reset sliding state
    }, 300); // Match animation duration
  };

  const closeNotifications = (event) => {
    slideOutNotifications();
    setIsSidePaneOpen({});
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

  //  Function to fetch admin details
  const fetchAdminDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try loggin in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data.staffList);
    } catch (e) {
      if (e.status !== 403) {
        console.log(e);
        toast.error(
          e.message ||
            e.response.data.message ||
            "An error occurred while trying to fetch admin details"
        );
      }
    }
  };

  // Function to decode token
  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  // Function to confirm cash ticket
  const confirmCashTicket = async (ticketId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging in again.");
      return;
    }
    
    setConfirmBtnLoading((prev) => ({
      ...prev,
      [ticketId]: true,
    }));
    try {
      const response = await axios.post(
        `${root}/${cashTicketConfirm}/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setConfirmBtnLoading((prev) => ({
        ...prev,
        [ticketId]: false,
      }));
    } catch (error) {
      toast.error(
        error.response.data.message || "Error confirming cash ticket"
      );
      setConfirmBtnLoading((prev) => ({
        ...prev,
        [ticketId]: false,
      }));
    }
  };

  // Function to send approvedTicket
  const sendApprovedTicket = async (type, ticketId, adminsId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured ,try logging in again");
      return;
    }

    try {
      const response = await axios.post(
        `${root}/${sendTicket[type]}/${ticketId}`,
        {
          adminIds: adminsId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // toast.success("Ticket Sent Successfully");
      return response.status;
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Ticket not sent successfullly.",
        {
          duration: 4500,
        }
      );
      return error.status;
    }
  };

  // Component for select admin side pane
  const SelectAdminSidePane = ({ type, ticketID, ticketStatus }) => {
    const [selectedAdmins, setSelectedAdmins] = useState([]);

    const handleCheckboxChange = (adminId) => {
      setSelectedAdmins((prev) =>
        prev.includes(adminId)
          ? prev.filter((id) => id !== adminId)
          : [...prev, adminId]
      );
    };

    const token = localStorage.getItem("token");

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

      // Display Loader over the button
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

        return response.status;
      } catch (error) {
        setApproveButtonLoading((prev) => ({
          ...prev,
          [ticketId]: false,
        }));

        toast.error(
          error.response?.data?.message ||
            "An error occurred while trying to approve ticket"
        );

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

      try {
        if (ticketStatus === "approved") {
          // ✅ Directly send approved ticket if already approved
          await sendApprovedTicket(type, ticketID, selectedAdmins);
          toast.success("Ticket already approved, sending details...", {
            duration: 3000,
            style: {
              padding: "30px",
            },
          });
        } else {
          // ✅ Approve first, then send ticket
          const firstRequest = await approveTicket(type, ticketID);

          if (firstRequest === 200) {
            await sendApprovedTicket(type, ticketID, selectedAdmins);
            toast.success("Ticket approved and sent successfully", {
              duration: 3000,
              style: {
                padding: "30px",
              },
            });
          } else {
            throw new Error("Error occurred in approving ticket");
          }
        }
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    };

    return (
      <div className="absolute z-[60]  -translate-x-[300px]  top-0 mb-20 bg-white min-w-[300px] min-h-[300px] p-4 shadow-md  ">
        <h1 className="font-space font-bold text-[1.1rem]">Approve To</h1>
        <p
          className="absolute right-[10px] cursor-pointer top-[5px]"
          onClick={() => {
            setIsSidePaneOpen({});
          }}>
          <FontAwesomeIcon icon={faClose} />
        </p>
        {/* <p className="text-[.7rem]">
          <span>Selected Admin</span>: <span>{selectedAdmins.join(", ") || "None"}</span>
        </p> */}

        <form action="" onSubmit={handleSubmit}>
          <div className="my-2 h-[180px] overflow-scroll overflow-x-hidden ">
            {admins.map((admin) => (
              <label
                key={admin.id}
                className="flex items-center flex-row-reverse cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className=""
                  value={admin.id}
                  checked={selectedAdmins.includes(admin.roleId)}
                  onChange={() => handleCheckboxChange(admin.roleId)}
                />
                <span className="w-full p-2">
                  {" "}
                  {`${admin.firstname} ${admin.lastname}`}{" "}
                  {`(${admin.role?.name || ""})`}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-4 mb-15">
            <button className="bg-theme px-4 py-2 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Component for auth to weigh  side pane
  const AuthToWeighConfirmPane = ({ id }) => {
    const [selectedOption, setSelectedOption] = useState("all");
    const [quantity, setQuantity] = useState("");
    const [buttonLoading, setBUttonLoading] = useState(false);

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
        // console.log("Quantity:", quantity);
        toast.error("Provide a quantity");
      }
      const body = {
        ...(quantity && { quantityLoaded: quantity }),
      };

      setBUttonLoading(true);
      try {
        const response = await axios.post(`${root}/admin/load/${id}`, body,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        toast.success("Ticket Sent Successffuly", {
          duration: 3000,
          style: {
            padding: "20px",
          },
        });
        setBUttonLoading(false);
        setQuantity(false);
      } catch (error) {
        setBUttonLoading(false);
        console.log(error);
        
        // toast.error(error)
      }
      // admin/load
      // Handle submission logic here...
    };

    return (
      <div className="absolute z-[60] -translate-x-[300px] top-0 mb-20 bg-white min-w-[250px] min-h-[170px] p-4 shadow-md rounded-md">
        {/* Close Button */}
        <button
          className="absolute right-[10px] top-[10px] text-gray-600 hover:text-gray-800"
          onClick={() => setConfirmAuthOpen(false)}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        {/* Title */}
        <h1 className="font-bold mb-3">What quantity did you load?</h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Radio Options */}
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

          {/* Quantity Input (Only when "Other" is selected) */}
          {selectedOption === "other" && (
            <TextField.Root
              type="number"
              placeholder="Enter Quantity"
              className="mt-3 w-full"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded">
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
    fetchGeneralStore();
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
          }}>
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
            className={`notifications-panel  absolute top-10 right-[-70px] w-[30rem] z-[50] !overflow-x-visible shadow-md p-4 max-h-[100vh]  bg-white border border-gray-200 rounded-md ${
              isNotificationsOpen && !isSlidingOut
                ? "translate-x-0 block opacity-100"
                : "translate-x-[160%] opacity-0 hidden"
            }`}
            style={{ borderRadius: "8px", overflowY: "",overflowX:"visible" }}>
            {/* {detailsPageOpen && <IndividualInfo />} */}
         
          <div className="notification-container">
               <div className="flex justify-between items-center w-full">
              <h1 className="font-space font-medium text-[1.7rem]">
                Notifications
              </h1>
              <Button
                color="red"
                className="text-[.7rem] cursor-pointer"
                onClick={closeNotifications}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
            
            </div>
            {selectedTicket && (
              <IndividualInfo
                // ticketDetails={}
                open={detailsPageOpen}
                selectedTicket={selectedTicket}
                setOpen={setDetailsPageOpen}></IndividualInfo>
            )}
            <div className="absolute right-[10px] mt-3 flex gap-1 items-center">
              <label
                htmlFor="switch"
                className="text-sm cursor-pointer font-amsterdam">
                Unread
              </label>
              <Switch
                id="switch"
                size="small"
                onChange={(val) => {
                  if (val) {
                    setNotifications(unreadNotifications);
                  } else {
                    setNotifications(alllNotifications);
                  }
                }}
              />
            </div>

            <Tabs.Root defaultValue="all" className="!overflow-visible">
              <Tabs.List>
                <Tabs.Trigger value="all">All</Tabs.Trigger>
                {/* <Tabs.Trigger value="unread">Unread</Tabs.Trigger> */}
                <Tabs.Trigger value="tickets">Tickets</Tabs.Trigger>
                <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
              </Tabs.List>

              <div
                className="pt-3 max-h-[100vh] w-full notifications-box "
                style={{ overflowY: "", overflowX: "" }}>
                {/* <Box
                pt="3"
                style={{ maxHeight: "500px" }}
                className="notifications-box"
              > */}

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
                          className="mb-3 p-2 rounded  cursor-pointer relative">
                          {/* {isSidePaneOpen[notification.id] && (
                            <SelectAdminSidePane
                              type={notification.type}
                              ticketID={notification.ticketId}
                              ticketStatus={notification.ticketStatus}
                            />
                          )} */}
                          {isSidePaneOpen[notification.id] && (
                            <div className=" top-0 left-0 z-[100] w-full h-full">
                              <SelectAdminSidePane
                                type={notification.type}
                                ticketID={notification.ticketId}
                                ticketStatus={notification.ticketStatus}
                              />
                            </div>
                          )}
                          {confirmAuthOpen[notification.id] && (
                            <AuthToWeighConfirmPane
                              id={notification.ticketId}
                            />
                          )}
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
                                  }}>
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
                                    }}>
                                    <FontAwesomeIcon icon={faTags} />
                                    <span>
                                      {_.upperFirst(notification.type)}
                                    </span>
                                  </div>
                                </Text>

                                {/* Make approve and deny button only available to super admins  */}
                                {decodeToken().isAdmin &&
                                  notification.ticketStatus == "pending" && (
                                    <div className="button-groups flex gap-4 mt-4">
                                      <AntButton
                                        className="bg-theme text-white hover:!bg-theme hover:text-white"
                                        onClick={(e) => {
                                          e.preventDefault();

                                          setIsSidePaneOpen((prev) => ({
                                            ...prev,
                                            [notification.id]: true,
                                          }));
                                          setSelectedTicketType(
                                            notification.type
                                          );
                                        }}>
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
                                        }}>
                                        Deny
                                      </AntButton>
                                    </div>
                                  )}

                                {notification.type === "cash" &&
                                  notification.ticketStatus == "approved" && (
                                    <div className="button-groups flex gap-4 mt-4">
                                      <AntButton
                                        className="bg-green-500 text-white"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          confirmCashTicket(
                                            notification.ticketId
                                          );
                                        }}>
                                      {confirmBtnLoading[
                                          notification?.ticketId
                                        ] ? (
                                          <Spinner />
                                        ) : (
                                          "Confirm"
                                        )}
                                      </AntButton>
                                    </div>
                                  )}
                                {notification.type === "weigh" && (
                                  <div className="button-groups flex gap-4 mt-4">
                                    <AntButton
                                      className="bg-green-500 text-white"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setConfirmAuthOpen((prev) => ({
                                          ...prev,
                                          [notification.id]: true,
                                        }));
                                      }}>
                                      Confirm
                                    </AntButton>
                                  </div>
                                )}
                              </div>
                            </Flex>
                          </Flex>
                        </div>

                        {notifications.length > 1 && (
                          <Separator className="w-full" />
                        )}
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
                {/* </Box> */}
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
