import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, Flex, Table, Heading, Button, Spinner, Text } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const AllInvoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all invoices
  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { invoices } = response.data;
      setInvoices(invoices);

      if (invoices.length === 0) {
        setFailedSearch(true);
        setFailedText("No records found.");
      } else {
        setFailedSearch(false);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setFailedSearch(true);
      setFailedText("Failed to fetch invoices.");
      toast.error("Failed to load invoices.");
    }
  };

  // Handle sending invoice to print
  const handleSendToPrintInvoice = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      return;
    }

    setLoadingId(id);
    try {
      const response = await axios.post(
        `${root}/batch/add-invoice-to-print/${id}`, // Adjust endpoint as needed
        {}, // Empty body if no data is required
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Invoice sent to print successfully!");
      console.log("Invoice Response:", response.data);
    } catch (error) {
      console.error("Error sending invoice to print:", error);
      toast.error(error.response?.data?.message || "Failed to send invoice to print.");
    } finally {
      setLoadingId(null);
    }
  };

  // Determine square color based on status
  const getSquareColor = (status) => {
    switch (status) {
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

  // Check if dropdown should be disabled
  const isDropdownDisabled = (status) => status === "pending" || status === "rejected";

  // Fetch invoices on component mount
  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      <Heading>View All Invoices</Heading>

      {/* Table showing invoice details */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>INVOICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TIME OUT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIPT STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4">
                {failedSearch ? <Text>{failedText}</Text> : <Spinner />}
              </Table.Cell>
            </Table.Row>
          ) : (
            invoices.map((invoice) => (
              <Table.Row key={invoice.id}>
                <Table.Cell>{refractor(invoice.createdAt)}</Table.Cell>
                <Table.Cell>{invoice.invoiceNumber || ""}</Table.Cell>
                <Table.Cell>
                  {`${invoice.customer?.firstname || ""} ${invoice.customer?.lastname || ""}`}
                </Table.Cell>
                <Table.Cell>{invoice.vehicleNo || ""}</Table.Cell>
                <Table.Cell>{refractorToTime(invoice.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getSquareColor(invoice.status)}
                    />
                    {_.upperFirst(invoice.status)}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {isDropdownDisabled(invoice.status) ? (
                    <Button
                      variant="soft"
                      disabled={loadingId === invoice.id || isDropdownDisabled(invoice.status)}
                    >
                      {loadingId === invoice.id ? (
                        <Spinner size="1" />
                      ) : (
                        <FontAwesomeIcon icon={faEllipsisV} />
                      )}
                    </Button>
                  ) : (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          variant="soft"
                          disabled={loadingId === invoice.id}
                        >
                          {loadingId === invoice.id ? (
                            <Spinner size="1" />
                          ) : (
                            <FontAwesomeIcon icon={faEllipsisV} />
                          )}
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onSelect={() => navigate(`/admin/receipts/invoice/${invoice.id}`)}
                        >
                          View Approved Invoice
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={() => handleSendToPrintInvoice(invoice.id)}
                          disabled={loadingId === invoice.id}
                        >
                          {loadingId === invoice.id ? (
                            <Spinner size="1" />
                          ) : (
                            "Send To Print"
                          )}
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

      <Toaster position="top-right" />
    </>
  );
};

export default AllInvoice;