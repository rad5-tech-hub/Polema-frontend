import React, { useState, useEffect } from "react";
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
  const [printingRecords, setPrintingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");

  // Fetch printing records
  const fetchPrintingRecords = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
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
      toast.error(error.response?.data?.message || "Failed to load printing records.");
    } finally {
      setLoading(false);
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
    <>
      <Heading>View All Printing Records</Heading>

      {/* Table showing printing records */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
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
              <Table.Row key={record.id}>
                <Table.Cell>{refractor(record.createdAt) || ""}</Table.Cell>
                <Table.Cell>{record.type || ""}</Table.Cell>
                <Table.Cell className="flex justify-between gap-3 items-center">
                  <span>{record.role?.name || ""}</span>
                  <Button
                    variant="soft"
                    className="cursor-pointer"
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

      <Toaster position="top-right" />
    </>
  );
};

export default PrintingRecords;