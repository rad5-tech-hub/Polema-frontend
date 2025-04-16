import React from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { refractor } from "../../../date";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Spinner,
  Table,
  DropdownMenu,
  Flex,
  Button,
  Tabs,
} from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const ViewAuthorityToWeigh = () => {
  const navigate = useNavigate();

  // State for ATW
  const [weighDetails, setWeighDetails] = React.useState([]);
  const [customerFailedSearch, setCustomerFailedSearch] = React.useState(false);
  const [supplierFailedSearch, setSupplierFailedSearch] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  // Fetch all auth weigh details
  const fetchWeighDetails = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      const response = await axios.get(`${root}/admin/view-all-auth-weigh`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setWeighDetails(response.data.records || []);
      // Check if customer or supplier records exist
      const customerRecords = response.data.records.filter(
        (item) => item.supplierId === null
      );
      const supplierRecords = response.data.records.filter(
        (item) => item.customerId === null
      );
      setCustomerFailedSearch(customerRecords.length === 0);
      setSupplierFailedSearch(supplierRecords.length === 0);
      setHasFetched(true);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred fetching ATW");
    } finally {
      setIsFetching(false);
    }
  };

  // Check status color
  const checkStatus = (arg) => {
    switch (arg) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  // Get client name from customer or supplier
  const getClientName = (item) => {
    if (item.customer) {
      return `${item.customer.firstname} ${item.customer.lastname}`;
    } else if (item.supplier) {
      return `${item.supplier.firstname} ${item.supplier.lastname}`;
    }
    return "Name not available";
  };

  // Filter customer and supplier records
  const customerRecords = weighDetails.filter((item) => item.supplierId === null);
  const supplierRecords = weighDetails.filter((item) => item.customerId === null);

  // Fetch weigh details on mount
  React.useEffect(() => {
    if (!hasFetched && !isFetching) {
      fetchWeighDetails();
    }
  }, [hasFetched, isFetching]);

  return (
    <>
      <Flex justify={"between"} gap={"5"} className="mb-4 mt-2">
        <Heading>Authority to Weigh</Heading>
        <Button
          size={"3"}
          title="New Authority to Weigh"
          className="!bg-theme cursor-pointer"
          type="button"
          onClick={() => navigate("/admin/raise-ticket/new-authority-to-weigh")}
        >
          <span className="text-white">New Authority</span>
        </Button>
      </Flex>

      <Tabs.Root defaultValue="customer-atw" className="border-none">
        <div className="flex items-center justify-center mb-4">
          <Tabs.List className="border-none flex w-fit gap-2">
            <Tabs.Trigger
              value="customer-atw"
              className="data-[state=active]:border-b-2 data-[state=active]:border-theme data-[state=active]:text-theme data-[state=inactive]:text-gray-500 px-4 py-2 bg-transparent focus:outline-none"
            >
              Customer ATW
            </Tabs.Trigger>
            <Tabs.Trigger
              value="supplier-atw"
              className="data-[state=active]:border-b-2 data-[state=active]:border-theme data-[state=active]:text-theme data-[state=inactive]:text-gray-500 px-4 py-2 bg-transparent focus:outline-none"
            >
              Supplier ATW
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {/* Customer ATW Tab */}
        <Tabs.Content value="customer-atw">
          <Table.Root className="mt-4" variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isFetching ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center p-4">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) : customerRecords.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center p-4">
                    {customerFailedSearch ? "No records found" : "No data"}
                  </Table.Cell>
                </Table.Row>
              ) : (
                customerRecords.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                    <Table.Cell>{item.vehicleNo}</Table.Cell>
                    <Table.Cell>{getClientName(item)}</Table.Cell>
                    <Table.Cell>{item.driver}</Table.Cell>
                    <Table.Cell>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`${checkStatus(item.status)}`}
                      />{" "}
                      {_.upperFirst(item.status)}
                    </Table.Cell>
                    {item.status !== "pending" && (
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              onClick={() =>
                                navigate(`/admin/weighing-operations/new-weigh/${item.id}`)
                              }
                            >
                              New Weigh
                            </DropdownMenu.Item>
                            {item.status === "approved" && (
                              <DropdownMenu.Item
                                onClick={() =>
                                  navigate(`/admin/tickets/view-auth-to-weigh/${item.id}`)
                                }
                              >
                                View Approved
                              </DropdownMenu.Item>
                            )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>

        {/* Supplier ATW Tab */}
        <Tabs.Content value="supplier-atw">
          <Table.Root className="mt-4" variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>SUPPLIER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>TRANSPORT CARRIED BY</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isFetching ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center p-4">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) : supplierRecords.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center p-4">
                    {supplierFailedSearch ? "No records found" : "No data"}
                  </Table.Cell>
                </Table.Row>
              ) : (
                supplierRecords.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                    <Table.Cell>{item.vehicleNo}</Table.Cell>
                    <Table.Cell>{getClientName(item)}</Table.Cell>
                    <Table.Cell>{item.driver}</Table.Cell>
                    <Table.Cell>{item.transportedBy || "-"}</Table.Cell>
                    <Table.Cell>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`${checkStatus(item.status)}`}
                      />{" "}
                      {_.upperFirst(item.status)}
                    </Table.Cell>
                    {item.status !== "pending" && (
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              onClick={() =>
                                navigate(`/admin/weighing-operations/new-weigh/${item.id}`)
                              }
                            >
                              New Weigh
                            </DropdownMenu.Item>
                            {item.status === "approved" && (
                              <DropdownMenu.Item
                                onClick={() =>
                                  navigate(`/admin/tickets/view-auth-to-weigh/${item.id}`)
                                }
                              >
                                View Approved
                              </DropdownMenu.Item>
                            )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>
      </Tabs.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default ViewAuthorityToWeigh;