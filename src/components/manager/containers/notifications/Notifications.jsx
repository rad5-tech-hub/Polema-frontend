import React, { useState, useEffect, useRef } from "react";
import { rejectTicket, acceptTicket,sendTicket } from "./NotificationsData";
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
} from "@radix-ui/themes";
import {
  faInfo,
  faRefresh,
  faCircle,
  faUser,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { Button as AntButton, Select } from "antd";
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
  const [admins, setAdmins] = useState([]);
  const notificationRef = useRef(null);
  const [isSidePaneOpen,setIsSidePaneOpen] = useState({});
  const [sSelectedTicketType,setSelectedTicketType] = useState("")


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
    setIsSidePaneOpen({})
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

      // toast.success("Ticket approved successfully.", {
      //   duration: 3000,
      // });
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
      console.log(e);
      toast.error(
        e.message ||
          e.response.data.message ||
          "An error occurred while trying to fetch admin details"
      );
    }
  };

  // Function to decode token 
  const decodeToken = ()=>{
    return jwtDecode(localStorage.getItem("token"))
  }

  

  // Component for select admin side pane
  const SelectAdminSidePane = ({type,ticketID}) => {
    const [selectedAdmins, setSelectedAdmins] = useState([]);
  
    const handleCheckboxChange = (adminId) => {
      setSelectedAdmins((prev) =>
        prev.includes(adminId) ? prev.filter((id) => id !== adminId) : [...prev, adminId]
      );
    };

    const token = localStorage.getItem("token")
    
    
    const handleSubmit = async(e) => {
      e.preventDefault()
      if(!token){
        toast.error("An error occurred , try logging in again.")
        return
      }
      
      if(selectedAdmins.length === 0) {
        toast.error("Select at least one admin");
        return;
      }

      try {
        const firstRequest = await approveTicket(type,ticketID)
      } catch (error) {
        console.log(error);
        
      }
      console.log("Selected Admin IDs:", selectedAdmins);
    };
  
     // approveTicket(
     //   notification.type,
       //   notification?.ticketId || null
           // );
    return (
      <div className="absolute z-30 left-[-300px] top-0 mb-20 bg-white min-w-[250px] h-[230px] p-4 shadow-md overflow-scroll overflow-x-hidden">
        <h1 className="font-space font-bold text-[1.1rem]">Approve To</h1>
        <p className="absolute right-[10px] cursor-pointer top-[5px]" onClick={()=>{
          setIsSidePaneOpen({})
        }}>
          <FontAwesomeIcon icon={faClose}/>
        </p>
        {/* <p className="text-[.7rem]">
          <span>Selected Admin</span>: <span>{selectedAdmins.join(", ") || "None"}</span>
        </p> */}
  
        <form action="" onSubmit={handleSubmit}>
        <div className="my-2">
          {admins.map((admin) => (
            <label key={admin.id} className="flex items-center flex-row-reverse cursor-pointer gap-2">
              <input
                type="checkbox"
                className=""
                value={admin.id}
                checked={selectedAdmins.includes(admin.roleId)}
                onChange={() => handleCheckboxChange(admin.roleId)}
              />
             <span className="w-full p-2"> {`${admin.firstname} ${admin.lastname}`} {`(${admin.role?.name || ""})`}
             </span>
                         </label>
          ))}
        </div>
  
        <div className="flex justify-end mt-4 mb-15">
          <button className="bg-theme px-4 py-2 text-white rounded" >
            Submit
          </button>
        </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    fetchNotifications();
    fetchAdminDetails()
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
            className={`notifications-panel absolute top-10 right-[-70px] w-[30rem] z-[9999] !overflow-x-visible shadow-md p-4 bg-white border border-gray-200 rounded-md transition-transform duration-300 ${
              isNotificationsOpen && !isSlidingOut
                ? "translate-x-0 block opacity-100"
                : "translate-x-[160%] opacity-0 hidden"
            }`}
            style={{ borderRadius: "8px" ,overflowY:""}}
          >
            {/* {detailsPageOpen && <IndividualInfo />} */}
            <div className="flex justify-between items-center w-full">

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
            
            </div>
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

              <div className="pt-3 max-h-[500px] notifications-box">
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
                          className="mb-3 p-2 rounded  cursor-pointer relative"
                        >
                          {isSidePaneOpen[notification.id] && <SelectAdminSidePane  type={notification.type} ticketID={notification.ticketId}/>}
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
                                {decodeToken().isAdmin  &&      <div className="button-groups flex gap-4 mt-4">
                                  <AntButton
                                    className="bg-theme text-white hover:!bg-theme hover:text-white"
                                    onClick={(e) => {
                                      e.preventDefault();
                                     
                                      setIsSidePaneOpen((prev) => ({
                                        ...prev,
                                        [notification.id]: true,
                                      }));
                                      setSelectedTicket(notification.type)
                                      
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
                                </div> }

                                {notification.type === "cash" && <div className="button-groups flex gap-4 mt-4">
                              
                              <AntButton
                              className="bg-green-500 text-white"
                                onClick={(e) => { 
                                  e.preventDefault();
                                  denyTicket(
                                    notification.type,
                                    notification?.ticketId || null
                                  );
                                }}
                              >
                                Confirm
                              </AntButton>
                            </div>}

                           
                              </div>
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
              {/* </Box> */}

              </div>
            </Tabs.Root>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default Notifications;
