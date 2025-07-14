import React, { useState, useEffect } from "react";
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
  Separator,
} from "@radix-ui/themes";
import _ from "lodash";
import axios from "axios";
import { refractor } from "../../../date";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const AllDispatchNote = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [dispatchNotes, setDispatchNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchDispatchNotes = async (pageUrl = null) => {
    setLoading(true);
    setDispatchNotes([]);
    setFailedSearch(false);
    setFailedText("");
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "Please log in again.",
        type: "error",
        duration: 10000,
      });
      setFailedSearch(true);
      setFailedText("Authentication required.");
      setLoading(false);
      return;
    }
    try {
      const url = pageUrl
        ? `${root}${pageUrl}`
        : `${root}/customer/get-all-vehicle-dispatch`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notes = response.data.records || [];
      setDispatchNotes(notes);
      if (notes.length === 0) {
        setFailedSearch(true);
        setFailedText("No dispatch notes found.");
      }
      if (
        response.data.pagination?.nextPage &&
        response.data.pagination.nextPage !==
          "/customer/get-all-vehicle-dispatch"
      ) {
        setPaginationUrls((prev) => {
          const newUrls = [...prev];
          newUrls[currentPageIndex] = response.data.pagination.nextPage;
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex));
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch dispatch notes.";
      setFailedSearch(true);
      setFailedText(errorMessage);
      showToast({
        message: errorMessage,
        type: "error",
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToPrintDispatch = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "Please log in again.",
        type: "error",
        duration: 10000,
      });
      return;
    }
    setLoadingId(id);
    try {
      await axios.post(
        `${root}/batch/add-vehicle-to-print/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast({
        message: "Dispatch note sent to print successfully!",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      showToast({
        message:
          error?.response?.data?.message ||
          "Failed to send dispatch note to print.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const isDropdownDisabled = (status) =>
    status === "pending" || status === "rejected";

  const handleNextPage = () => {
    if (currentPageIndex <= paginationUrls.length) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchDispatchNotes(paginationUrls[currentPageIndex] || null);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchDispatchNotes(
        prevIndex === 0 ? null : paginationUrls[prevIndex - 1]
      );
    }
  };

  useEffect(() => {
    fetchDispatchNotes();
  }, []);

  return (
    <>
      <Flex
        justify="between"
        align="center"
        className="border-b border-gray-400 py-4"
      >
        <Heading size="5">View All Vehicle Dispatch Notes</Heading>
        <Button
          className="!bg-theme !text-white hover:!bg-brown-500 cursor-pointer"
          onClick={() => navigate("/admin/receipts/vehicle-dispatch-note")}
        >
          Create New
        </Button>
      </Flex>

      <Separator className="my-4 w-full" />
      <Table.Root
        variant="surface"
        className="mt-4 table-fixed w-full"
        size="2"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              DRIVER'S NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              ESCORT'S NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              VEHICLE NO.
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              DESTINATION
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4 text-center">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : dispatchNotes.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="p-4 text-center">
                <Text>No dispatch notes found</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            dispatchNotes.map((note) => (
              <Table.Row key={note.id || `${note.vehicleNo}-${note.createdAt}`}>
                <Table.Cell>{refractor(note.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>{note.driversName || "N/A"}</Table.Cell>
                <Table.Cell>{note.escortName || "N/A"}</Table.Cell>
                <Table.Cell>{note.vehicleNo || "N/A"}</Table.Cell>
                <Table.Cell>{note.destination || "N/A"}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getStatusColor(note.status)}
                    />
                    <Text>{_.upperFirst(note.status || "N/A")}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="soft"
                        disabled={
                          loadingId === note.id ||
                          isDropdownDisabled(note.status)
                        }
                        className="cursor-pointer"
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
                          navigate(
                            `/admin/receipt/receipt-dispatchnote/${note.id}`
                          )
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
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <div className="pagination-fixed">
        {(paginationUrls.length > 0 || currentPageIndex > 0) && (
          <Flex justify="center" align="center" gap="2" className="mt-4">
            <Button
              variant="soft"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Text>Page {currentPageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={
                currentPageIndex >= paginationUrls.length &&
                !paginationUrls[currentPageIndex - 1]
              }
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Next page"
            >
              Next
            </Button>
          </Flex>
        )}
      </div>
      <Separator className="my-4 w-full" />
    </>
  );
};

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
