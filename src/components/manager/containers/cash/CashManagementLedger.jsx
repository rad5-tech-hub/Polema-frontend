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
} from "@fortawesome/free-solid-svg-icons";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const CashManagementLedger = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [ledger, setLedger] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const itemsPerPage = 17;

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

  const fetchCashManagementLedger = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/cashier-ledger`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      response.data.entries.length === 0
        ? setFailedSearch(true)
        : setLedger(response.data.entries);
    } catch (error) {
      console.log(error);
      showToast({
        message: "Failed to fetch ledger data",
        type: "error",
      });
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
      // Refresh the ledger data
      fetchCashManagementLedger();
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    fetchCashManagementLedger();
  }, []);

  // Pagination helpers
  const totalPages = Math.ceil(ledger.length / itemsPerPage);

  const currentPageData = ledger.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Heading>Cash Ledger</Heading>

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
          {currentPageData.length === 0 ? (
            <div className="p-4">
              {failedSearch ? "No records Found" : <Spinner />}
            </div>
          ) : (
            currentPageData.map((entry, index) => (
              <Table.Row
                key={index}
                className={`${
                  getToken()?.isAdmin
                    ? "cursor-pointer hover:bg-gray-400/10"
                    : ""
                }`}
                onClick={() => getToken()?.isAdmin && showHighlightModal(entry)}
                style={{
                  backgroundColor: entry.isQuery && "#ffeb3b33" ,
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

      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>

      
    </>
  );
};

export default CashManagementLedger;
