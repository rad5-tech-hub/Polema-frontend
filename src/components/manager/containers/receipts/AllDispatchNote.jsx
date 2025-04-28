import React, { useState, useEffect } from "react";
import useToast from "../../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  Table,
  Heading,
  Button,
  Spinner,
  Text,
  Flex,
} from "@radix-ui/themes";
import _ from "lodash";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const AllDispatchNote = () => {
  const navigate = useNavigate();
  const showToast = useToast()
  const [dispatchNotes, setDispatchNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null); // Tracks the ID of the loading item
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch dispatch notes from API
  const fetchDispatchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      setFailedSearch(true);
      setFailedText("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-vehicle-dispatch`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notes = response.data.vehicles || [];
      setDispatchNotes(notes);

      if (notes.length === 0) {
        setFailedSearch(true);
        setFailedText("No dispatch notes found.");
      } else {
        setFailedSearch(false);        
      }
    } catch (error) {
      console.error("Error fetching dispatch notes:", error);
      setFailedSearch(true);
      setFailedText("Failed to fetch dispatch notes.");
      toast.error(error.response?.data?.message || "Failed to load dispatch notes.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending dispatch note to print
  const handleSendToPrintDispatch = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "15px" }, duration: 10000 });
      return;
    }

    setLoadingId(id);
    try {
      await axios.post(
        `${root}/batch/add-vehicle-to-print/${id}`, // Adjust endpoint as needed
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast({
        message:"Dispatch note sent to print successfully!",
        type:"success",
        duration:5000
      })

  
    } catch (error) {
      console.error("Error sending dispatch note to print:", error);
      showToast({
        message:
          error.response?.data?.message ||
          "Failed to send dispatch note to print.",
        type:"error",
        duration:5000
      });
      
    } finally {
      setLoadingId(null);
    }
  };

  // Check if dropdown should be disabled (non-approved statuses)
  const isDropdownDisabled = (status) => status === "pending" || status === "rejected";;

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dispatchNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dispatchNotes.length / itemsPerPage);

  // Fetch dispatch notes on component mount
  useEffect(() => {
    fetchDispatchNotes();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="border-b border-gray-400 py-4">
        <Heading size="5">View All Vehicle Dispatch Notes</Heading>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/receipts/vehicle-dispatch-note")}
        >
          Create New
        </Button>
      </Flex>

      {/* Table showing dispatch notes */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER'S NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ESCORT'S NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DESTINATION</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4 text-center">
                <Spinner size="3" />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            currentItems.map((note) => (
              <Table.Row key={note.id}>
                <Table.Cell>{refractor(note.createdAt) || ""}</Table.Cell>
                <Table.Cell>{note.driversName || ""}</Table.Cell>
                <Table.Cell>{note.escortName || ""}</Table.Cell>
                <Table.Cell>{note.vehicleNo || ""}</Table.Cell>
                <Table.Cell>{note.destination || ""}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getStatusColor(note.status)}
                    />
                    <Text>{_.upperFirst(note.status || "")}</Text>
                  </Flex>
                </Table.Cell>               
                <Table.Cell>
                  {isDropdownDisabled(note.status) ? (
                    <Button
                      variant="soft"
                      disabled={loadingId === note.id || isDropdownDisabled(note.status)}
                    >
                      {loadingId === note.id ? (
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
                        disabled={loadingId === note.id || isDropdownDisabled(note.status)}
                      >
                        {loadingId === note.id ? (
                          <Spinner size="1" />
                        ) : (
                          <FontAwesomeIcon icon={faEllipsisV} />
                        )}
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onSelect={() =>
                          navigate(`/admin/receipt/receipt-dispatchnote/${note.id}`)
                        }
                      >
                        View Dispatch Note
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleSendToPrintDispatch(note.id)}
                        disabled={loadingId === note.id}
                      >
                        {loadingId === note.id ? (
                          <Spinner size="1" />
                        ) : (
                          "Send to Print"
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
      {!loading && dispatchNotes.length > 0 && (
        <Flex justify="center" align="center" gap="3" className="mt-4">
          <Button
            variant="soft"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </Button>
          <Text size="2">
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            variant="soft"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </Button>
        </Flex>
      )}

      <Toaster position="top-right" />
    </>
  );
};

// Determine square color based on status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "text-yellow-500";
    case "approved":
      return "text-green-500";
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default AllDispatchNote;