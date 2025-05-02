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

  const [weighDetails, setWeighDetails] = React.useState([]);
  const [customerFailedSearch, setCustomerFailedSearch] = React.useState(false);
  const [supplierFailedSearch, setSupplierFailedSearch] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);
  const [decodedToken, setDecodedToken] = React.useState(null);

  const fetchWeighDetails = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("Token missing. Please log in again.");
      return;
    }

    try {
      setIsFetching(true);
      const response = await axios.get(`${root}/admin/view-all-auth-weigh`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      const records = response.data.records || [];
      setWeighDetails(records);
      setCustomerFailedSearch(
        records.filter((r) => r.supplierId === null).length === 0
      );
      setSupplierFailedSearch(
        records.filter((r) => r.customerId === null).length === 0
      );
      setHasFetched(true);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred fetching ATW");
    } finally {
      setIsFetching(false);
    }
  };

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

  const getClientName = (item) => {
    if (item.customer) {
      return `${item.customer.firstname} ${item.customer.lastname}`;
    } else if (item.supplier) {
      return `${item.supplier.firstname} ${item.supplier.lastname}`;
    }
    return "Name not available";
  };

  const customerRecords = weighDetails.filter(
    (item) => item.supplierId === null
  );
  const supplierRecords = weighDetails.filter(
    (item) => item.customerId === null
  );
  //console.log("supplierRecord", supplierRecords);
  React.useEffect(() => {
    if (!hasFetched && !isFetching) {
      fetchWeighDetails();
    }

    const retrToken = localStorage.getItem("token");
    if (retrToken) {
      try {
        const payload = retrToken.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [hasFetched, isFetching]);

  const isWeighbridge = decodedToken?.roleName
    ?.toLowerCase()
    .replace(/[^a-z]/g, "") // remove spaces, dashes, etc.
    .includes("weighbridge");
  const isAdmin = decodedToken?.isAdmin == true;

  return (
    <>
      <Toaster position="top-right" />
      <Flex justify="between" gap="5" className="mb-4 mt-2">
        <Heading>Authority to Weigh</Heading>
        <Button
          size="3"
          className="!bg-theme cursor-pointer"
          onClick={() => navigate("/admin/raise-ticket/new-authority-to-weigh")}
        >
          <span className="text-white">New Authority</span>
        </Button>
      </Flex>

      <Tabs.Root defaultValue="customer-atw">
        <div className="flex justify-center mb-4">
          <Tabs.List className="flex gap-2">
            <Tabs.Trigger value="customer-atw">Customer ATW</Tabs.Trigger>
            <Tabs.Trigger value="supplier-atw">Supplier ATW</Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="customer-atw">
          <Table.Root variant="surface">
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
                        className={checkStatus(item.status)}
                      />{" "}
                      {_.upperFirst(item.status)}
                    </Table.Cell>
                    <Table.Cell>
                      {item.status !== "pending" && (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            {/* 
           Show "New Weigh" ONLY if:
          - status is "approved"
          - user is either isAdmin and Weighbridge
        */}
                            {item.status == "approved" &&
                              (isAdmin || isWeighbridge) && (
                                <DropdownMenu.Item
                                  onClick={() =>
                                    navigate(
                                      `/admin/weighing-operations/new-weigh/${item.id}`
                                    )
                                  }
                                >
                                  New Weigh
                                </DropdownMenu.Item>
                              )}
                            {/* 
           Always show "View Approved" to everyone 
          if status is "approved" or "completed"
        */}
                            {(item.status === "approved" ||
                              item.status === "completed") && (
                              <DropdownMenu.Item
                                onClick={() =>
                                  navigate(
                                    `/admin/tickets/view-auth-to-weigh/${item.id}`
                                  )
                                }
                              >
                                View Approved
                              </DropdownMenu.Item>
                            )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>

        <Tabs.Content value="supplier-atw">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>SUPPLIER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  TRANSPORT CARRIED BY
                </Table.ColumnHeaderCell>
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
                        className={checkStatus(item.status)}
                      />{" "}
                      {_.upperFirst(item.status)}
                    </Table.Cell>
                    <Table.Cell>
                      {item.status !== "pending" && (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            {item.status === "approved" &&
                              (isAdmin || isWeighbridge) && (
                                <DropdownMenu.Item
                                  onClick={() =>
                                    navigate(
                                      `/admin/weighing-operations/new-weigh/${item.id}`
                                    )
                                  }
                                >
                                  New Weigh
                                </DropdownMenu.Item>
                              )}

                            {item.status === "completed" && !isWeighbridge && (
                              <DropdownMenu.Item
                                onClick={() =>
                                  navigate(
                                    `/admin/weighing-operations/raise-order/${item.id}`
                                  )
                                }
                              >
                                Raise Supplier Order
                              </DropdownMenu.Item>
                            )}

                            {(item.status === "approved" ||
                              item.status === "completed") && (
                              <DropdownMenu.Item
                                onClick={() =>
                                  navigate(
                                    `/admin/tickets/view-auth-to-weigh/${item.id}`
                                  )
                                }
                              >
                                View Approved
                              </DropdownMenu.Item>
                            )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default ViewAuthorityToWeigh;
