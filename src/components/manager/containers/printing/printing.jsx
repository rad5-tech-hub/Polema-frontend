import React, { useState, useEffect } from "react";
import useToast from "../../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { Table, Heading, Spinner, Text, Button, Flex } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const PrintingRecords = () => {
  const navigate = useNavigate();
  const showToast = useToast()
  const [printingRecords, setPrintingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch printing records
  const fetchPrintingRecords = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", {
        style: { padding: "20px" },
        duration: 10000,
      });
      setFailedSearch(true);
      setFailedText("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${root}/batch/get-all-print`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const records = response.data.data || [];
      setPrintingRecords(records);

      if (records.length === 0) {
        setFailedSearch(true);
        setFailedText("No printing records found.");
      } else {
        setFailedSearch(false);
      }
    } catch (error) {
      console.error("Error fetching printing records:", error);
      setFailedSearch(true);
      setFailedText("Failed to fetch printing records.");
      toast.error(
        error.response?.data?.message || "Failed to load printing records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox toggle for individual records
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedIds.length === printingRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(printingRecords.map((record) => record.id));
    }
  };

  // Handle deletion of selected records
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("No records selected for deletion.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} record(s)?`
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${root}/batch/delete-prints`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { printIds: selectedIds },
      });

      // setPrintingRecords((prev) =>
      //   prev.filter((record) => !selectedIds.includes(record.id))
      // );
      fetchPrintingRecords(); // Re-fetch records to update the list
      setSelectedIds([]);
      showToast({
        type:"success",
        message:"Selected records deleted successfully."
      })
      
    } catch (error) {
      console.error("Error deleting records:", error);
      showToast({
        message:error.response?.data?.message || "Failed to delete records.",
        type:"error"
      })
      
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle redirection based on type
  const handleRedirect = (type, id) => {
    let url = "";
    switch (type) {
      case "invoice":
        url = `/admin/receipts/invoice/${id}`;
        break;
      case "gatepass":
        url = `/admin/receipt/view-gatepass/${id}`;
        break;
      case "waybill":
        url = `/admin/receipts/waybill-invoice/${id}`;
        break;
      case "vehicle":
        url = `/admin/receipt/receipt-dispatchnote/${id}`;
        break;
      case "officialReceipt":
        url = `/admin/receipt/official-receipt/${id}`;
        break;
      default:
        toast.error("Unknown receipt type.");
        return;
    }
    navigate(url);
  };

  // Fetch records on component mount
  useEffect(() => {
    fetchPrintingRecords();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <Flex justify="between" align="center" className="mb-4">
        <Heading size="6">View All Printing Records</Heading>
        {selectedIds.length > 0 &&
          <Button
            variant="solid"
            color="red"
            onClick={handleDelete}
            disabled={deleteLoading || selectedIds.length == 0}
            className="cursor-pointer"
          >
            {deleteLoading ? <Spinner size="2" /> : "Delete Selected"}
          </Button>
        }
      </Flex>

      {/* Table showing printing records */}
      <Table.Root variant="surface" className="mt-3 shadow-lg rounded-lg">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <input
                type="checkbox"
                checked={
                  printingRecords.length > 0 &&
                  selectedIds.length === printingRecords.length
                }
                onChange={handleSelectAll}
                disabled={loading || failedSearch}
                className="cursor-pointer"
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TYPE OF RECEIPT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="p-4 text-center">
                <Spinner size="3" />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            printingRecords.map((record) => (
              <Table.Row
                key={record.id}
                style={{ opacity: selectedIds.includes(record.id) ? 0.5 : 1 }}
                className="hover:bg-gray-100 transition-opacity duration-200"
              >
                <Table.Cell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(record.id)}
                    onChange={() => handleCheckboxChange(record.id)}
                    className="cursor-pointer"
                  />
                </Table.Cell>
                <Table.Cell>{refractor(record.createdAt) || ""}</Table.Cell>
                <Table.Cell>{record.type || ""}</Table.Cell>
                <Table.Cell className="flex justify-between gap-3 items-center">
                  <span>{record.role?.name || ""}</span>
                  <Button
                    variant="soft"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleRedirect(record.type, record.ticketId)}
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default PrintingRecords;
