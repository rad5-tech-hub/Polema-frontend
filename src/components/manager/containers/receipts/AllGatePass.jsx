import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@radix-ui/themes";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import { usePagination } from "../../../../hooks/usePagination";
import { Table, Flex, Button, Heading, Spinner, Text } from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const AllGatePass = () => {
  const navigate = useNavigate();
  const [passDetails, setPassDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");

  // Fetch gate pass details
  const fetchGatePass = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: { padding: "20px" },
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-gatepass`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { gatePasses } = response.data;
      setPassDetails(gatePasses);

      if (gatePasses.length === 0) {
        setFailedSearch(true);
        setFailedText("No records found.");
      } else {
        setFailedSearch(false);
      }
    } catch (error) {
      console.error(error);
      setFailedSearch(true);
      setFailedText("Failed to fetch data.");
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
        return "";
    }
  };

  const disableDropdown = (arg) => arg === "pending" || arg === "rejected";

  const {
    currentData: paginatedInvoices,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(passDetails, 15);

  useEffect(() => {
    fetchGatePass();
  }, []);

  return (
    <>
      <Heading>View All Gate Pass Note</Heading>

      {/* Table */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GOODS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DESTINATION</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTURE TIME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedInvoices.length === 0 ? (
            <div className="p-4">
              {failedSearch ? <Text>{failedText}</Text> : <Spinner />}
            </div>
          ) : (
            paginatedInvoices.map((entry) => (
              <Table.Row key={entry.id}>
                <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                <Table.Cell>
                  {entry?.transaction?.authToWeighTickets?.driver || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {`${entry?.transaction?.corder?.firstname || ""} ${
                    entry?.transaction?.corder?.lastname || ""
                  }`}
                </Table.Cell>
                <Table.Cell>
                  {entry?.transaction?.porders?.name || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {entry?.transaction?.authToWeighTickets?.vehicleNo || "N/A"}
                </Table.Cell>
                <Table.Cell>{entry.destination || "N/A"}</Table.Cell>
                <Table.Cell>{refractorToTime(entry.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${getSquareColor(entry.status)}`}
                    />
                    {_.upperFirst(entry.status)}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {disableDropdown(entry.status) ? (
                    <Button variant="soft" disabled>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </Button>
                  ) : (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() =>
                            navigate(`/admin/receipt/view-gatepass/${entry.id}`)
                          }
                        >
                          View Approved Gate Pass
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

export default AllGatePass;
