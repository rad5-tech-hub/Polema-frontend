import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { refractor } from "../../../date";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Heading,
  Spinner,
  Separator,
  Table,
  DropdownMenu,
  Flex,
  Button,
  Tabs,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const ViewAuthorityToWeigh = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [weighDetails, setWeighDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("customer");

  const fetchWeighDetails = async (pageUrl = null, tab = activeTab) => {
    setLoading(true);
    setFailedSearch(false);
    setErrorText("");
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "Token missing. Please log in again.",
        type: "error",
      });
      setFailedSearch(true);
      setErrorText("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const url = pageUrl
        ? `${root}${pageUrl}`
        : `${root}/admin/view-all-auth-weigh`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      const records = response.data.records || [];
      setWeighDetails(records);
      const filtered =
        tab === "customer"
          ? records.filter((r) => r.supplierId === null)
          : records.filter((r) => r.customerId === null);
      setFailedSearch(filtered.length === 0);
      setErrorText(filtered.length === 0 ? `No ${tab} ATW records found.` : "");

      const nextPage = response.data.pagination?.nextPage;
      setPaginationUrls((prev) => {
        const updated = [...prev];
        if (
          nextPage &&
          typeof nextPage === "string" &&
          !prev.includes(nextPage)
        ) {
          updated[pageIndex] = nextPage;
        }
        return updated;
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch ATW records.";
      setFailedSearch(true);
      setErrorText(errorMessage);
      showToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (item) => {
    if (item.customer) {
      return `${item.customer.firstname || ""} ${
        item.customer.lastname || ""
      }`.trim();
    } else if (item.supplier) {
      return `${item.supplier.firstname || ""} ${
        item.supplier.lastname || ""
      }`.trim();
    }
    return "N/A";
  };

  const checkStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handlePagination = (direction) => {
    if (direction === "next" && paginationUrls[pageIndex]) {
      const nextIndex = pageIndex + 1;
      setPageIndex(nextIndex);
      fetchWeighDetails(paginationUrls[pageIndex], activeTab);
    }
    if (direction === "prev" && pageIndex > 0) {
      const prevIndex = pageIndex - 1;
      setPageIndex(prevIndex);
      fetchWeighDetails(
        prevIndex === 0 ? null : paginationUrls[prevIndex - 1],
        activeTab
      );
    }
  };

  useEffect(() => {
    const retrToken = localStorage.getItem("token");
    if (retrToken) {
      try {
        const payload = retrToken.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setDecodedToken(decoded);
      } catch {
        showToast({ message: "Failed to decode token.", type: "error" });
      }
    }
  }, []);

  useEffect(() => {
    fetchWeighDetails();
  }, [activeTab]);

  const isWeighbridge = decodedToken?.roleName
    ?.toLowerCase()
    ?.includes("weighbridge");
  const isAdmin = decodedToken?.isAdmin === true;

  const records =
    activeTab === "customer"
      ? weighDetails.filter((item) => item.supplierId === null)
      : weighDetails.filter((item) => item.customerId === null);

  return (
    <>
      <Flex justify="between" align="center" className="my-5">
        <Heading size="5">Authority to Weigh</Heading>
        <Button
          size="3"
          className="!bg-theme !text-white hover:!bg-brown-500"
          onClick={() => navigate("/admin/raise-ticket/new-authority-to-weigh")}
        >
          New Authority
        </Button>
      </Flex>

      <Tabs.Root
        defaultValue="customer"
        onValueChange={(tab) => {
          setActiveTab(tab);
          setPageIndex(0);
          setPaginationUrls([]);
        }}
      >
        <Tabs.List className="flex gap-2 mb-4 justify-center">
          <Tabs.Trigger value="customer">Customer ATW</Tabs.Trigger>
          <Tabs.Trigger value="supplier">Supplier ATW</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value={activeTab}>
          <Separator className="my-4" />
          <Table.Root variant="surface" className="table-fixed w-full" size="2">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>VEHICLE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DRIVER</Table.ColumnHeaderCell>
                {activeTab === "supplier" && (
                  <Table.ColumnHeaderCell>
                    TRANSPORTED BY
                  </Table.ColumnHeaderCell>
                )}
                <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Spinner size="2" />
                  </Table.Cell>
                </Table.Row>
              ) : failedSearch ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Text>{errorText}</Text>
                  </Table.Cell>
                </Table.Row>
              ) : records.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Text>No records found.</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                records.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                    <Table.Cell>{item.vehicleNo || "N/A"}</Table.Cell>
                    <Table.Cell>{getClientName(item)}</Table.Cell>
                    <Table.Cell>{item.driver || "N/A"}</Table.Cell>
                    {activeTab === "supplier" && (
                      <Table.Cell>{item.transportedBy || "N/A"}</Table.Cell>
                    )}
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <FontAwesomeIcon
                          icon={faSquare}
                          className={checkStatus(item.status)}
                        />
                        <Text>{_.upperFirst(item.status)}</Text>
                      </Flex>
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
                                  onSelect={() =>
                                    navigate(
                                      `/admin/weighing-operations/new-weigh/${item.id}`
                                    )
                                  }
                                >
                                  New Weigh
                                </DropdownMenu.Item>
                              )}
                            {item.status === "completed" &&
                              activeTab === "supplier" &&
                              !isWeighbridge && (
                                <DropdownMenu.Item
                                  onSelect={() =>
                                    navigate(
                                      `/admin/suppliers/place-supplier-order/${
                                        item.weigh?.id || item.id
                                      }${item.weigh?.id ? "" : "-not-weigh"}`
                                    )
                                  }
                                >
                                  Receive Supplier Order
                                </DropdownMenu.Item>
                              )}
                            {(item.status === "approved" ||
                              item.status === "completed") && (
                              <DropdownMenu.Item
                                onSelect={() =>
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
          <div className="pagination-fixed">

          <Flex justify="center" align="center" gap="2" className="mt-4">
            <Button
              variant="soft"
              disabled={pageIndex === 0}
              onClick={() => handlePagination("prev")}
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Previous
            </Button>
            <Text>Page {pageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={!paginationUrls[pageIndex]}
              onClick={() => handlePagination("next")}
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Next
            </Button>
          </Flex>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default ViewAuthorityToWeigh;
