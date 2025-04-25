import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, Table, Flex, Button, Heading, Spinner, Text } from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import { usePagination } from "../../../../hooks/usePagination";

const root = import.meta.env.VITE_ROOT;

const AllGatePass = () => {
  const navigate = useNavigate();
  const [passDetails, setPassDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // Fetch gate pass details
  const fetchGatePass = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
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
      console.error("Error fetching gate passes:", error);
      setFailedSearch(true);
      setFailedText("Failed to fetch data.");
      toast.error("Failed to load gate passes.");
    }
  };

  // Handle sending gate pass to print
  const handleSendToPrintGatepass = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      return;
    }

    setLoadingId(id);
    try {
      const response = await axios.post(
        `${root}/batch/add-gate-pass-to-print/${id}`,
        {}, // Empty body if no data is required
        { headers: { Authorization: `Bearer ${token}` } } // Correct headers placement
      );

      toast.success("Gate pass sent to print successfully!");
      console.log("Gate Pass Response:", response.data);
    } catch (error) {
      console.error("Error sending gate pass to print:", error);
      toast.error(error.response?.data?.message || "Failed to send gate pass to print.");
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

  // Pagination hook
  const {
    currentData: paginatedInvoices,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(passDetails, 15);

  // Fetch data on component mount
  useEffect(() => {
    fetchGatePass();
  }, []);

  return (
    <>
    <div className="flex justify-between items-center my-5 gap-4">
      <Heading>View All Gate Pass Note</Heading>
      <Button
        size="3"     
        title="Create New Gate Pass For Supplier"   
        className="cursor-pointer px-5 !bg-theme"
        onClick={() => navigate("/admin/suppliers/create-gatepass")}
      >
        Create New Gate Pass
      </Button>
    </div>

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
            <Table.Row>
              <Table.Cell colSpan={9} className="p-4">
                {failedSearch ? <Text>{failedText}</Text> : <Spinner />}
              </Table.Cell>
            </Table.Row>
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
                      className={getSquareColor(entry.status)}
                    />
                    {_.upperFirst(entry.status)}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {isDropdownDisabled(entry.status) ? (
                    <Button
                      variant="soft"
                      disabled={loadingId === entry.id || isDropdownDisabled(entry.status)}
                    >
                      {loadingId === entry.id ? (
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
                          disabled={loadingId === entry.id}
                        >
                          {loadingId === entry.id ? (
                            <Spinner size="1" />
                          ) : (
                            <FontAwesomeIcon icon={faEllipsisV} />
                          )}
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onSelect={() =>
                            navigate(`/admin/receipt/view-gatepass/${entry.id}`)
                          }
                        >
                          View Approved Gate Pass
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={() => handleSendToPrintGatepass(entry.id)}
                          disabled={loadingId === entry.id}
                        >
                          {loadingId === entry.id ? (
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