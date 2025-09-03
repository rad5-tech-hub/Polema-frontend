import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  Heading,
  Spinner,
  Table,
  Button,
  Text,
  Flex,
  Separator,
} from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor } from "../../../date";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const AllWayBill = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [billDetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchWaybills = async (pageUrl = null) => {
    setLoading(true);
    setBillDetails([]);
    setFailedSearch(false);
    setFailedText("");
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "Please log in again.",
        type: "error",
        duration: 10000,
      });
      setFailedSearch(true);
      setFailedText("Authentication required.");
      setLoading(false);
      return;
    }
    try {
      const url = pageUrl
        ? `${root}${pageUrl}`
        : `${root}/customer/get-all-waybill`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const records = response.data.records || [];
      setBillDetails(records);
      if (records.length === 0) {
        setFailedSearch(true);
        setFailedText("No waybill records found.");
      }
      const nextPage = response.data.pagination?.nextPage;
      if (
        nextPage &&
        typeof nextPage === "string" &&
        nextPage !== "/customer/get-all-waybill"
      ) {
        setPaginationUrls((prev) => {
          const newUrls = [...prev];
          newUrls[currentPageIndex] = nextPage;
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex));
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch waybill records.";
      setFailedSearch(true);
      setFailedText(errorMessage);
      showToast({
        message: errorMessage,
        type: "error",
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToPrintWaybill = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "Please log in again.",
        type: "error",
        duration: 10000,
      });
      return;
    }
    setLoadingId(id);
    try {
      await axios.post(
        `${root}/batch/add-waybill-to-print/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast({
        message: "Waybill sent to print successfully!",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      showToast({
        message:
          error?.response?.data?.message || "Failed to send waybill to print.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status) => {
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

  const isDropdownDisabled = (status) =>
    status === "pending" || status === "rejected";

  const handleNextPage = () => {
    const nextIndex = currentPageIndex + 1;
    setCurrentPageIndex(nextIndex);
    fetchWaybills(paginationUrls[currentPageIndex] || null);
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchWaybills(prevIndex === 0 ? null : paginationUrls[prevIndex - 1]);
    }
  };

  useEffect(() => {
    fetchWaybills();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="my-5 gap-4">
        <Heading size="5">View All Waybills</Heading>
        <Button
          size="3"
          title="Create New Waybill"
          className="!bg-theme !text-white hover:!bg-brown-500 cursor-pointer px-5"
          onClick={() => navigate("/admin/receipts/create-waybill")}
        >
          Create New Waybill
        </Button>
      </Flex>

      <Separator className="my-4 w-full" />

      <Table.Root
        variant="surface"
        className="mt-4 mb-20 table-fixed w-full"
        size="2"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              BAGS (PKC)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TO
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              ADDRESS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TRANSPORT CARRIED OUT BY
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              VEHICLE NO.
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : billDetails.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Text>No waybill records found</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            billDetails.map((item) => (
              <Table.Row
                key={
                  item.id ||
                  `${item.invoice?.vehicleNo || "unknown"}-${item.createdAt}`
                }
              >
                <Table.Cell>{refractor(item.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>
                  {item.bags ? `${item.bags} bags` : "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {`${item?.transaction?.corder?.firstname || "N/A"} ${
                    item?.transaction?.corder?.lastname || "N/A"
                  }`.trim()}
                </Table.Cell>
                <Table.Cell>{item.address || "N/A"}</Table.Cell>
                <Table.Cell>{item.transportedBy || "N/A"}</Table.Cell>
                <Table.Cell>{item.invoice?.vehicleNo || "N/A"}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getStatusColor(item.status)}
                    />
                    <Text>{_.upperFirst(item.status || "N/A")}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="soft"
                        disabled={
                          loadingId === item.id ||
                          isDropdownDisabled(item.status)
                        }
                        className="cursor-pointer"
                      >
                        {loadingId === item.id ? (
                          <Spinner size="1" />
                        ) : (
                          <FontAwesomeIcon icon={faEllipsisV} />
                        )}
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onSelect={() =>
                          navigate(`/admin/receipts/waybill-invoice/${item.id}`)
                        }
                      >
                        View Approved Waybill
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleSendToPrintWaybill(item.id)}
                        disabled={loadingId === item.id}
                      >
                        {loadingId === item.id ? (
                          <Spinner size="1" />
                        ) : (
                          "Send To Print"
                        )}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
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
            disabled={!paginationUrls[currentPageIndex]}
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

export default AllWayBill;
