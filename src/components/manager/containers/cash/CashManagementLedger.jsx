import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refractor, formatMoney } from "../../../date";
import {
  Table,
  Select,
  Heading,
  DropdownMenu,
  Separator,
  Spinner,
  Button,
  Flex,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Modal } from "antd";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisV,
  faArrowRight,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import useToast from "../../../../hooks/useToast";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

const CashManagementLedger = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [ledger, setLedger] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
      });
      return null;
    }
    return jwtDecode(token);
  };

  const fetchCashManagementLedger = async (
    startDate = null,
    endDate = null,
    pageUrl = null
  ) => {
    setLoading(true);
    setLedger([]);
    setFailedSearch(false);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setLoading(false);
      return;
    }

    let url;
    if (pageUrl) {
      url = `${root}${pageUrl}`;
    } else if (startDate && endDate) {
      url = `${root}/admin/cashier-ledger?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/admin/cashier-ledger`;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      const output = response.data.data || [];

      if (output.length === 0) {
        setFailedSearch(true);
        setLedger([]);
      } else {
        setLedger(output);
        setFailedSearch(false);
      }

      if (response.data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = response.data.pagination.nextPage;
          if (!prev.includes(newUrl)) {
            if (!pageUrl || currentPageIndex >= prev.length - 1) {
              return pageUrl && currentPageIndex >= prev.length - 1
                ? [...prev, newUrl]
                : [newUrl];
            }
            return prev;
          }
          return prev;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching ledger:", error);
      setLoading(false);
      showToast({
        message: "Failed to fetch ledger data",
        type: "error",
      });
      setFailedSearch(true);
    }
  };

  const handleHighlightToggle = async (entryId, shouldHighlight) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
      });
      return;
    }

    try {
      await axios.patch(
        `${root}/customer/cash-ledger-query/${entryId}`,
        { isQuery: shouldHighlight },
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      showToast({
        message: `Entry ${
          shouldHighlight ? "highlighted" : "unhighlighted"
        } successfully`,
        type: "success",
      });
      fetchCashManagementLedger(
        dateRange?.[0]?.format("YYYY-MM-DD"),
        dateRange?.[1]?.format("YYYY-MM-DD")
      );
    } catch (error) {
      console.error("Error updating highlight:", error);
      showToast({
        message: "Failed to update highlight status",
        type: "error",
      });
    }
  };

  const showHighlightModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (selectedEntry) {
      handleHighlightToggle(selectedEntry.id, !selectedEntry.isQuery);
    }
    setIsModalVisible(false);
    setSelectedEntry(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedEntry(null);
  };

  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    fetchCashManagementLedger();
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchCashManagementLedger(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchCashManagementLedger(null, null, paginationUrls[currentPageIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchCashManagementLedger(null, null, paginationUrls[prevIndex]);
    }
  };

  useEffect(() => {
    fetchCashManagementLedger();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>Cash Ledger</Heading>
        <div className="date-picker">
          <RangePicker
            value={dateRange}
            onCalendarChange={(dates) => {
              setDateRange(dates);
              if (dates && dates[0] && dates[1]) {
                setPaginationUrls([]);
                setCurrentPageIndex(0);
                fetchCashManagementLedger(
                  dates[0].format("YYYY-MM-DD"),
                  dates[1].format("YYYY-MM-DD")
                );
              }
            }}
          />
          {dateRange !== null && (
            <FontAwesomeIcon
              icon={faRedoAlt}
              className="ml-2 cursor-pointer"
              onClick={handleClearDateRange}
            />
          )}
        </div>
      </Flex>

      <Separator className="my-4 w-full" />

      <Table.Root variant="surface" className="mt-3 mb-6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIVED FROM</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GIVEN TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>APPROVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="9">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : ledger.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="9">
                {failedSearch ? "No Records Found" : "No Data Available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            ledger.map((entry) => (
              <Table.Row
                key={entry.id}
                className={`${
                  getToken()?.isAdmin
                    ? "cursor-pointer hover:bg-gray-400/10"
                    : ""
                }`}
                onClick={() => getToken()?.isAdmin && showHighlightModal(entry)}
                style={{
                  backgroundColor: entry.isQuery ? "#ffeb3b33" : "",
                }}
              >
                <Table.RowHeaderCell>
                  {refractor(entry.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{entry.comment}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.credit > entry.debit && entry.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.debit > entry.credit && entry.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.approvedByRole?.name || ""}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell className="text-green-500">
                  {entry.credit > entry.debit && formatMoney(entry.credit)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell className="text-red-500">
                  {entry.debit > entry.credit && formatMoney(entry.debit)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {formatMoney(entry.balance)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.credit > entry.debit && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => {
                            navigate(
                              `/admin/receipt/generate-receipt/${entry.id}`
                            );
                          }}
                        >
                          Generate Receipt
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  )}
                </Table.RowHeaderCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <Modal
        title={selectedEntry?.isQuery ? "Remove Highlight" : "Highlight Entry"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ disabled: !getToken()?.isAdmin }}
        cancelButtonProps={{ disabled: !getToken()?.isAdmin }}
      >
        <p>
          Do you want to{" "}
          {selectedEntry?.isQuery ? "remove highlight from" : "highlight"} this
          entry?
        </p>
      </Modal>

      <div className="flex justify-center items-center mt-4 gap-4 pagination-fixed">
        <Button
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span>
          Page {currentPageIndex + 1} of{" "}
          {paginationUrls.length > 0 ? paginationUrls.length : 1}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPageIndex >= paginationUrls.length}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default CashManagementLedger;
