import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, Flex } from "@radix-ui/themes";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import { Spinner } from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import { Table, Heading, Button } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const AllInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  // Function to view invoice details

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("an error occurred , try logging in again", {
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
    } catch (e) {
      console.log(e);
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
    fetchDetails();
  }, []);

  return (
    <>
      <Heading>View all Invoice</Heading>

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
          {invoices.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            invoices.map((invoice, index) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(invoice.createdAt)}</Table.Cell>
                  <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
                  <Table.Cell>{`${invoice.customer.firstname} ${invoice.customer.lastname}`}</Table.Cell>
                  <Table.Cell>{invoice.vehicleNo}</Table.Cell>
                  <Table.Cell>{refractorToTime(invoice.createdAt)}</Table.Cell>
                  <Table.Cell>
                    <Flex align={"center"} gap={"1"}>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={getSquareColor(invoice.status)}
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
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default AllInvoice;
