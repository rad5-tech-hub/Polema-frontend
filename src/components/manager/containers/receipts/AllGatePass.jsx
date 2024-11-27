import React, { useState } from "react";
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

  // Function to fetch gatepass details
  const fetchGatePass = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging in again", {
        style: {
          padding: "20px",
        },
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-gatepass`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPassDetails(response.data.gatePasses);
      if (response.data.gatePasses.length === 0) {
        setFailedSearch(true);
        setFailedText("No records");
      }
    } catch (error) {
      console.log(error);
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
  const {
    currentData: paginatedInvoices,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(passDetails, 15);

  React.useEffect(() => {
    fetchGatePass();
  }, []);

  return (
    <>
      <Heading>View All Gate Pass Note</Heading>

      {/* Table showing gate pass details */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>ESCORT NAME</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GOODS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DESTINATION</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTURE TIME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {passDetails.length === 0 ? (
            <div className="p-4">
              {failedSearch ? <>{failedText}</> : <Spinner />}
            </div>
          ) : (
            paginatedInvoices.map((entry) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {entry.transaction.authToWeighTickets.driver}
                  </Table.Cell>
                  {/* <Table.Cell>{entry.escortName}</Table.Cell> */}
                  <Table.Cell>{`${entry.transaction.corder.firstname} ${entry.transaction.corder.lastname}`}</Table.Cell>
                  <Table.Cell>{entry.transaction.porders.name}</Table.Cell>
                  <Table.Cell>
                    {entry.transaction.authToWeighTickets.vehicleNo}
                  </Table.Cell>
                  <Table.Cell>{entry.destination}</Table.Cell>
                  <Table.Cell>{refractorToTime(entry.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {
                      <Flex align={"center"} gap={"1"}>
                        <FontAwesomeIcon
                          icon={faSquare}
                          className={`${getSquareColor(entry.status)}`}
                        />
                        {_.upperFirst(entry.status)}
                      </Flex>
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger
                        disabled={disableDropdown(entry.status)}
                      >
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => {
                            navigate(
                              `/admin/receipt/view-gatepass/${entry.id}`
                            );
                          }}
                        >
                          View Approved Gate Pass
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
