import React from "react";

import { DropdownMenu } from "@radix-ui/themes";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import { Table, Flex, Heading, Spinner, Button, Text } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { usePagination } from "../../../../hooks/usePagination";

const root = import.meta.env.VITE_ROOT;

const AllInvoice = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);

  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(response.data.invoices);
    } catch (error) {
      console.log(error);
      setFailedSearch(true);
    }
  };

  const getSquareColor = (arg) => {
    switch (arg) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        break;
    }
  };

  // Function to disable dropdown
  const disableDropdown = (arg) => {
    if (arg === "pending" || arg === "rejected") return true;
    else return false;
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  // Use the pagination hook
  const {
    currentData: paginatedInvoices,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(invoices, 17);

  return (
    <>
      <Heading>View all Invoices</Heading>

      {/* Table showing invoice details */}
      <Table.Root variant="surface" className="mt-2">
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
          {paginatedInvoices.length === 0 ? (
            <div className="p-4">
              {failedSearch ? <p>No records found</p> : <Spinner />}
            </div>
          ) : (
            paginatedInvoices.map((invoice) => (
              <Table.Row key={invoice.invoiceNumber}>
                <Table.Cell>{refractor(invoice.createdAt)}</Table.Cell>
                <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
                <Table.Cell>{`${invoice.customer.firstname} ${invoice.customer.lastname}`}</Table.Cell>
                <Table.Cell>{invoice.vehicleNo}</Table.Cell>
                <Table.Cell>{refractorToTime(invoice.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Flex align={"center"} gap={"1"}>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${getSquareColor(invoice.status)}`}
                    />
                    {_.upperFirst(invoice.status)}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      disabled={disableDropdown(invoice.status)}
                    >
                      <Button variant="soft">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item>
                        View Approved Invoice
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      <Flex justify="center" align="center" gap="3" className="mt-4">
        <Button disabled={currentPage === 1} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Text size="2">
          Page {currentPage} of {totalPages}
        </Text>
        <Button disabled={currentPage === totalPages} onClick={goToNextPage}>
          Next
        </Button>
      </Flex>

      <Toaster position="top-right" />
    </>
  );
};

export default AllInvoice;
