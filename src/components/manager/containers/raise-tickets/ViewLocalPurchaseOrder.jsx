import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor } from "../../../date";
import {
  Heading,
  Table,
  Separator,
  Button,
  Flex,
  Spinner,
  DropdownMenu,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import LocalPurchaseOrder from "./LocalPurchaseOrder";

const root = import.meta.env.VITE_ROOT;

const ViewLocalPurchaseOrder = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessageFromSearch, setErrorMessageFromSearch] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showCreateLPO, setShowCreateLPO] = useState(false);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchLPOOrders = async (pageUrl = null) => {
    setLoading(true);
    setOrders([]);
    setErrorMessageFromSearch(false);
    setErrorText("");

    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "An error occurred. Try logging in again.",
        type: "error",
        duration: 10000,
      });
      setErrorMessageFromSearch(true);
      setErrorText("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const isInitialLoad = pageUrl === null;
      const url = isInitialLoad
        ? `${root}/admin/view-lpo`
        : `${root}${pageUrl}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const records = response.data.records || [];
      setOrders(records);

      if (records.length === 0) {
        setErrorMessageFromSearch(true);
        setErrorText("No LPO records found.");
      }

      // Reset pagination state on first load
      if (isInitialLoad) {
        setPaginationUrls([]);
        setCurrentPageIndex(0);
      }

      const nextPage = response.data.pagination?.nextPage;
      if (nextPage && typeof nextPage === "string") {
        setPaginationUrls((prev) => {
          const newUrls = [...prev];
          if (newUrls.length <= currentPageIndex + 1) {
            newUrls[currentPageIndex + 1] = nextPage;
          }
          return newUrls;
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch LPO records.";
      setErrorMessageFromSearch(true);
      setErrorText(errorMessage);
      showToast({
        message: errorMessage,
        type: "error",
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseLPO = () => {
    setShowCreateLPO(true);
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

  const handleNextPage = () => {
    const nextUrl = paginationUrls[currentPageIndex + 1];
    if (nextUrl) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchLPOOrders(nextUrl);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      const prevUrl = paginationUrls[prevIndex] || null;
      fetchLPOOrders(prevUrl);
    }
  };

  useEffect(() => {
    fetchLPOOrders();
  }, []);

  if (showCreateLPO) {
    return <LocalPurchaseOrder />;
  }

  return (
    <>
      <Flex justify="between" align="center" className="my-5 gap-4">
        <Heading size="5">View Local Purchase Orders</Heading>
        <Button
          size="3"
          title="Raise Local Purchase Order"
          className="!bg-theme !text-white hover:!bg-brown-500 cursor-pointer px-5"
          onClick={handleRaiseLPO}
        >
          Raise LPO
        </Button>
      </Flex>

      <Separator className="my-4 w-full" />

      <Table.Root
        variant="surface"
        className="mt-4 table-fixed w-full"
        size="2"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              LPO ID
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              DELIVERED TO
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              SUPPLIER NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TICKET STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="p-4 text-center">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : errorMessageFromSearch ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="p-4 text-center">
                <Text>{errorText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : orders.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="p-4 text-center">
                <Text>No LPO records found</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            orders.map((order) => (
              <Table.Row
                key={
                  order.id || `${order.lpoId || "unknown"}-${order.createdAt}`
                }
              >
                <Table.Cell>{refractor(order.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>{order.lpoId || "N/A"}</Table.Cell>
                <Table.Cell>{order.deliveredTo || "N/A"}</Table.Cell>
                <Table.Cell>
                  {`${order.supplier?.firstname || "N/A"} ${
                    order.supplier?.lastname || ""
                  }`.trim()}
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={checkStatus(order.status)}
                    />
                    <Text>{_.upperFirst(order.status || "N/A")}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {order.status === "approved" && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft" className="cursor-pointer">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onSelect={() =>
                            navigate(
                              `/admin/raise-ticket/officialLPO/${order.id}`
                            )
                          }
                        >
                          View Approved LPO
                        </DropdownMenu.Item>
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
            disabled={currentPageIndex === 0}
            onClick={handlePrevPage}
            className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Text>Page {currentPageIndex + 1}</Text>
          <Button
            variant="soft"
            disabled={!paginationUrls[currentPageIndex + 1]}
            onClick={handleNextPage}
            className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
            aria-label="Next page"
          >
            Next
          </Button>
        </Flex>
      </div>

      <Separator className="my-4 w-full" />
    </>
  );
};

export default ViewLocalPurchaseOrder;
