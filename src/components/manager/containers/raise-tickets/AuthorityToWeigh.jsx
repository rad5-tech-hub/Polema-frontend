import React from "react";
import { refractor } from "../../../date";
import axios from "axios";
import {
  Heading,
  Flex,
  Button,
  Separator,
  TextField,
  Grid,
  Select,
  Spinner,
  Text,
  Table,
} from "@radix-ui/themes";
import { useParams } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";

const AuthorityToWeigh = () => {
  const { customerId, orderId } = useParams();

  // State management for Switching between pages
  const [viewPageOpen, setViewPageOpen] = React.useState(false);

  // State management for fetched Customers
  const [customers, setCusomers] = React.useState([]);
  const [adminId, setAdminId] = React.useState("");
  const [vehicleNumber, setVehicleNumber] = React.useState("");
  const [driverName, setDriverName] = React.useState("");
  const [inputDisability, setInputDisability] = React.useState(true);
  const [admins, setAdmins] = React.useState([]);
  const [chiefAdminId, setChiefAdminId] = React.useState("");
  const [adminDropdownDisabled, setAdminDropdownDisabled] =
    React.useState(true);
  const [ticketId, setTicketId] = React.useState("");

  // Function to fetch customers from db
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCusomers(response.data.customers);
      setInputDisability(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch chief admins from db
  const fetchSuperAdmins = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setAdmins(response.data.staffList);
      setAdminDropdownDisabled(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: { padding: "30px" },
      });
      return;
    }

    // Reset form function
    const resetForm = () => {
      setAdminId("");
      setDriverName("");
      setVehicleNumber("");
    };

    const body = {
      customerId: adminId,
      vehicleNo: vehicleNumber,
      driver: driverName,
    };

    try {
      // Show loading toast
      const ticketToastId = toast.loading("Creating Ticket...", {
        style: { padding: "20px" },
      });

      // First API Request: Raise the ticket
      const ticketResponse = await axios.post(
        `${root}/admin/raise-auth-weigh/${orderId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      const ticketId = ticketResponse.data.ticket.id; // Extract ticket ID

      // Update state after successful first API call
      setTicketId(ticketId);

      const sendResponse = await axios.post(
        `${root}/admin/send-weigh-auth/${ticketId}`,
        { adminId: chiefAdminId },
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      // Success Toast
      toast.success("Ticket successfully sent!", { id: ticketToastId });

      // Reset form fields
      resetForm();
    } catch (error) {
      // Error Toast
      console.error(error);
      toast.error("An error occurred. Please try again later.", {
        style: { padding: "20px" },
      });
    }
  };

  // Function to get customer name by id
  const matchCustomerNameById = () => {
    const customer = customers.find((item) => item.id === customerId);
    return customer ? customer : "Customer not found";
  };

  // const ViewAuthorityToWeigh = () => {
  //   const [details, setDetails] = React.useState([]);

  //   // Function to fetch details
  //   const fetchDetails = async () => {
  //     const retrToken = localStorage.getItem("token");

  //     // Check if the token is available
  //     if (!retrToken) {
  //       toast.error("An error occurred. Try logging in again", {
  //         duration: 6500,
  //         style: {
  //           padding: "30px",
  //         },
  //       });

  //       return;
  //     }

  //     try {
  //       const response = await axios.get(`${root}/admin/view-auth-weigh`, {
  //         headers: {
  //           Authorization: `Bearer ${retrToken}`,
  //         },
  //       });

  //       setDetails(response.data.records);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   React.useEffect(() => {
  //     fetchDetails();
  //   }, []);
  //   return (
  //     <>
  //       <Flex align={"center"} gap={"3"}>
  //         <FontAwesomeIcon
  //           icon={faArrowLeft}
  //           className="cursor-pointer"
  //           onClick={() => {
  //             setViewPageOpen(false);
  //           }}
  //         />
  //         <Heading>View Authority To Weigh</Heading>
  //       </Flex>
  //       <Separator className="w-full my-4" />
  //       <Table.Root variant="surface">
  //         <Table.Header>
  //           <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
  //           <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
  //           <Table.ColumnHeaderCell>CUSTOMER</Table.ColumnHeaderCell>
  //           <Table.ColumnHeaderCell>DRIVER </Table.ColumnHeaderCell>

  //           <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
  //         </Table.Header>
  //         <Table.Body>
  //           {details.length === 0 ? (
  //             <div className="p-4">
  //               <Spinner />
  //             </div>
  //           ) : (
  //             details.map((detail) => {
  //               return (
  //                 <Table.Row>
  //                   <Table.RowHeaderCell>
  //                     {refractor(detail.createdAt)}
  //                   </Table.RowHeaderCell>
  //                   <Table.RowHeaderCell>
  //                     {detail.vehicleNo}
  //                   </Table.RowHeaderCell>
  //                   <Table.RowHeaderCell>
  //                     {detail.vehicleNo}
  //                   </Table.RowHeaderCell>
  //                   <Table.RowHeaderCell>{detail.driver}</Table.RowHeaderCell>
  //                   <Table.RowHeaderCell>{detail.status}</Table.RowHeaderCell>
  //                 </Table.Row>
  //               );
  //             })
  //           )}
  //         </Table.Body>
  //       </Table.Root>
  //     </>
  //   );
  // };

  React.useEffect(() => {
    fetchCustomers();
    matchCustomerNameById();
    fetchSuperAdmins();
  }, []);
  return (
    <>
      {viewPageOpen ? (
        <ViewAuthorityToWeigh />
      ) : (
        <>
          <Heading>Authority to Weigh</Heading>

          <Separator className="my-5 w-full" />

          <form action="" onSubmit={handleSubmit}>
            <Grid columns={"2"} rows={"2"} gap={"4"}>
              <div className="w-full">
                <Text>
                  Vehicle Number<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Vehicle Number"
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  value={vehicleNumber}
                  className="mt-2"
                />
              </div>
              <div className="w-full">
                <Text>
                  Customer Name<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  className="w-full mt-2 "
                  disabled
                  placeholder="Customer Name"
                  value={
                    customers.length !== 0
                      ? `${matchCustomerNameById().firstname} ${
                          matchCustomerNameById().lastname
                        }`
                      : ""
                  }
                />
              </div>
              <div className="w-full">
                <Text>
                  Driver's Name<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Driver's Name"
                  value={driverName}
                  className="mt-2"
                  required
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Text>
                  Send To<span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  required
                  disabled={adminDropdownDisabled}
                  onValueChange={(value) => {
                    setChiefAdminId(value);
                  }}
                >
                  <Select.Trigger
                    placeholder="Select Admin"
                    className="w-full mt-2"
                  />
                  <Select.Content>
                    {admins.map((item) => {
                      return (
                        <Select.Item key={item.id} value={item.id}>
                          {item.firstname} {item.lastname}
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
            </Grid>

            <Flex justify={"end"}>
              <Button size={"3"} className="cursor-pointer mt-5 !bg-theme">
                Send
              </Button>
            </Flex>
          </form>
          <Toaster position="top-right" />
        </>
      )}
    </>
  );
};

export default AuthorityToWeigh;
