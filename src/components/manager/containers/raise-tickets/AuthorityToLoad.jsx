import React from "react";
import useToast from "../../../../hooks/useToast";
import { refractor } from "../../../date";
import {
  Heading,
  Button,
  Flex,
  Separator,
  Table,
  TextField,
  Text,
  Spinner,
  DropdownMenu,
  Select,
  Grid,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  return { currentData, paginate, currentPage, totalPages };
};

const AuthorityToLoad = () => {
  const [viewPageOpen, setViewPageOpen] = React.useState(false);
  const showToast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [customerId, setCustomerId] = React.useState("");
  const [ticketId, setTicketId] = React.useState("");
  const [admins, setAdmins] = React.useState([]);
  const [adminId, setAdminId] = React.useState("");
  const [vehicleNumber, setVehicleNumber] = React.useState("");
  const [driverName, setDriverName] = React.useState("");
  const [customerDropDownDisabled, setCustomerDropDownDisabled] =
    React.useState(true);

  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("Please log in again.");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(response.data.customers);
      setCustomerDropDownDisabled(false);
    } catch (error) {
      console.log("Error fetching customers:", error);
    }
  };

  const fetchSuperAdmins = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("Please log in again.");
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setAdmins(response.data.staffList);
    } catch (error) {
      console.log("Error fetching admins:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("Please log in again.");
      return;
    }
    const body = { customerId, driver: driverName, vehicleNo: vehicleNumber };
    setIsLoading(true);

    try {
      const response = await axios.post(`${root}/admin/raise-auth-load`, body, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      const ticketId = response.data.ticket.id;
      setTicketId(ticketId);

      await axios.post(
        `${root}/admin/send-load-auth/${ticketId}`,
        { adminId },
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      showToast({
        type: "success",
        message: "Authority sent successfully!",
        duration:5000
      });

      // Clear form fields after successful submission
      setVehicleNumber("");
      setDriverName("");
      setCustomerId("");
      setAdminId("");
      setTicketId("");
    } catch (error) {
      console.error("Error during submission:", error);
      showToast({
        message: "Submission failed , please try again",
        duration: 5000,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Component to view auth to load
  const ViewAuthorityToLoad = () => {
    const [details, setDetails] = React.useState([]);
    const itemsPerPage = 12; // Set the maximum items per page
    const { currentData, paginate, currentPage, totalPages } = usePagination(
      details,
      itemsPerPage
    );

    // Function to fetch auth to load
    const fetchAuthToLoad = async () => {
      const retrToken = localStorage.getItem("token");
      if (!retrToken) {
        toast.error("Please log in again.");
        return;
      }
      try {
        const response = await axios.get(`${root}/admin/view-auth-load`, {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        });

        setDetails(response.data.records);
      } catch (error) {
        console.log(error);
      }
    };

    const matchCustomerById = (id) => {
      const customer = customers.find((customer) => customer.id === id);
      return customer
        ? `${customer.firstname} ${customer.lastname}`
        : "Customer not found";
    };

    React.useEffect(() => {
      fetchAuthToLoad();
    }, []);

    return (
      <>
        <Flex align={"center"} gap={"3"}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="cursor-pointer"
            onClick={() => {
              setViewPageOpen(false);
            }}
          />
          <Heading>View Authority to Load</Heading>
        </Flex>
        <Table.Root variant="surface" className="mt-4">
          <Table.Header>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER </Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
          </Table.Header>
          <Table.Body>
            {currentData().length === 0 ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              currentData().map((detail) => {
                return (
                  <Table.Row className="relative">
                    <Table.RowHeaderCell>
                      {refractor(detail.createdAt)}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>
                      {detail.vehicleNo}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>
                      {matchCustomerById(detail.customerId)}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>{detail.driver}</Table.RowHeaderCell>
                    <Table.RowHeaderCell>{detail.status}</Table.RowHeaderCell>
                    <div className="absolute right-4 mt-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="soft">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item>
                            Go to Approved LPO
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
        <Flex justify="center" className="my-4" gap={"2"}>
          <Button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Flex>
      </>
    );
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchSuperAdmins();
  }, []);

  return (
    <>
      {viewPageOpen ? (
        <ViewAuthorityToLoad />
      ) : (
        <>
          <Flex justify={"between"}>
            <Heading>Authority to Load</Heading>
            <Button
              onClick={() => {
                setViewPageOpen(true);
              }}
            >
              View All
            </Button>
          </Flex>
          <Separator className="my-4 w-full" />
          <form onSubmit={handleSubmit}>
            <Grid columns={"2"} rows={"2"} gap={"4"}>
              <div className="w-full">
                <Text>
                  Vehicle Number<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="mt-2"
                  placeholder="Enter Vehicle Number"
                />
              </div>
              <div className="w-full">
                <Text>
                  Customer Name<span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  required
                  disabled={customerDropDownDisabled}
                  onValueChange={(value) => setCustomerId(value)}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Customer"
                  />
                  <Select.Content>
                    {customers.map((customer) => (
                      <Select.Item key={customer.id} value={customer.id}>
                        {customer.firstname} {customer.lastname}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text>
                  Driver's Name<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-2"
                  placeholder="Enter Driver's Name"
                />
              </div>
              <div className="w-full">
                <Text>
                  Send To<span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  required
                  disabled={customerDropDownDisabled}
                  onValueChange={(value) => setAdminId(value)}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Admin"
                  />
                  <Select.Content>
                    {admins.map((admin) => (
                      <Select.Item key={admin.id} value={admin.id}>
                        {admin.firstname} {admin.lastname}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </Grid>

            <Flex justify={"end"} className="mt-6">
              <Button
                className="!bg-theme cursor-pointer"
                disabled={isLoading}
                size={"3"}
              >
                {isLoading ? <Spinner /> : "Send to"}
              </Button>
            </Flex>
          </form>
          <Toaster position="top-right" />
        </>
      )}
    </>
  );
};

export default AuthorityToLoad;
