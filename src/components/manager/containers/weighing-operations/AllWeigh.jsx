import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refractor } from "../../../date";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Table,
  Separator,
  Flex,
  Button,
  Text,
  Box,
  Spinner as RadixSpinner,
  Select,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
import _ from "lodash";
import useToast from "../../../../hooks/useToast";
const root = import.meta.env.VITE_ROOT;

const WeighDetailsDialog = ({ isOpen, onClose, selectedWeigh }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Weigh Details</h2>
          <button
            onClick={onClose}
            className="text-white rounded-md px-2 py-0 text-xl bg-red-500 hover:bg-red-700 hover:text-white"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {selectedWeigh ? (
            <>
              <div className="mb-4">
                {selectedWeigh.image ? (
                  <img
                    src={selectedWeigh.image}
                    alt="Weigh image"
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "contain",
                    }}
                    className="w-full"
                  />
                ) : (
                  <Text as="p" className="text-gray-500">
                    No image available
                  </Text>
                )}
              </div>
              <Text as="p">
                <strong>Date:</strong> {refractor(selectedWeigh.createdAt)}
              </Text>
              <Text as="p">
                <strong>Client Name:</strong>{" "}
                {selectedWeigh.customer
                  ? `${selectedWeigh.customer.firstname} ${selectedWeigh.customer.lastname}`
                  : selectedWeigh.supplier
                  ? `${selectedWeigh.supplier.firstname} ${selectedWeigh.supplier.lastname}`
                  : "-"}
              </Text>
              <Text as="p">
                <strong>Quantity:</strong>{" "}
                {selectedWeigh.transactions?.quantity || 0}
              </Text>
              {selectedWeigh.gross && (
                <Text as="p">
                  <strong>Gross:</strong> {selectedWeigh.gross || "-"}
                </Text>
              )}
              {selectedWeigh.tar && (
                <Text as="p">
                  <strong>Tar:</strong> {selectedWeigh.tar || "-"}
                </Text>
              )}
              {selectedWeigh.net && (
                <Text as="p">
                  <strong>Net:</strong> {selectedWeigh.net || "-"}
                </Text>
              )}
              {selectedWeigh.extra && (
                <Text as="p">
                  <strong>Extra:</strong> {selectedWeigh.extra || "-"}
                </Text>
              )}
              {selectedWeigh.vehicleNo && (
                <Text as="p">
                  <strong>Vehicle Number:</strong>{" "}
                  {selectedWeigh.vehicleNo || "-"}
                </Text>
              )}
              <div className="flex items-end justify-end">
                <div>
                  {selectedWeigh.signInSupervisor && (
                    <Text as="p">
                      <strong className="pe-2">
                        {selectedWeigh.signInSupervisor}:
                      </strong>{" "}
                      {selectedWeigh.signIn ? "Signed In" : "-"}
                    </Text>
                  )}
                  {selectedWeigh.signOutSupervisor && (
                    <Text as="p">
                      <strong className="pe-2">
                        {selectedWeigh.signOutSupervisor}:
                      </strong>{" "}
                      {selectedWeigh.signOut ? "Signed Out" : "-"}
                    </Text>
                  )}
                  <Text
                    as="p"
                    className={`${
                      selectedWeigh.status === "uncompleted"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    {selectedWeigh.status === "uncompleted"
                      ? "Pending"
                      : "Completed"}
                  </Text>
                </div>
              </div>
            </>
          ) : (
            <Text as="p" className="text-gray-500">
              No weigh details available.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

const AllWeigh = ({ onWeighAction }) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [weighDetails, setWeighDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedWeigh, setSelectedWeigh] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedWeighId, setSelectedWeighId] = useState(null);
  const itemsPerPage = 10;

  // Helper to determine status class
  const checkStatus = (status) =>
    status === "uncompleted"
      ? "text-red-500 bg-red-100"
      : "text-green-500 bg-green-100";

  // Fetch weigh details based on filter
  const fetchWeighDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "Please log in to continue",
        type: "error",
      });

      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      let allWeighs = [];

      if (filter === "all") {
        const [completedCustomerResponse, uncompletedCustomerResponse] =
          await Promise.all([
            axios.get(`${root}/customer/view-weighs`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${root}/customer/view-saved`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const completedCustomerWeighs =
          completedCustomerResponse.data.data || [];
        const uncompletedCustomerWeighs =
          uncompletedCustomerResponse.data.data || [];

        allWeighs = [
          ...completedCustomerWeighs.map((item) => ({
            ...item,
            status: "completed",
          })),
          ...uncompletedCustomerWeighs.map((item) => ({
            ...item,
            status: "uncompleted",
          })),
        ];
      } else if (filter === "completed") {
        const [customerResponse] = await Promise.all([
          axios.get(`${root}/customer/view-weighs`, {
            headers: { Authorization: `Bearer ${filter}` },
          }),
        ]);
        allWeighs = (customerResponse.data.data || []).map((item) => ({
          ...item,
          status: "completed",
        }));
      } else if (filter === "uncompleted") {
        const [customerResponse] = await Promise.all([
          axios.get(`${root}/customer/view-saved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        allWeighs = (customerResponse.data.data || []).map((item) => ({
          ...item,
          status: "uncompleted",
        }));
      }

      if (allWeighs.length === 0) {
        setFailedSearch(true);
        setWeighDetails([]);
      } else {
        const uniqueWeighs = Array.from(
          new Map(allWeighs.map((item) => [item.id, item])).values()
        );
        const sortedWeighs = uniqueWeighs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setWeighDetails(sortedWeighs);
        setFailedSearch(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch weigh details", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      setFailedSearch(true);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle send to admin dialog submit
  const handleSendToAdminSubmit = async () => {
    if (selectedWeighId && selectedRoleId) {
      await sendToAdmin(selectedWeighId, selectedRoleId);
      setIsSendToAdminDialogOpen(false);
      setSelectedRoleId(null);
      setIsDialogOpen(false);
      setSelectedWeighId(null);
    }
  };

  // Fetch admins and weigh details on mount
  useEffect(() => {
    setCurrentPage(1);
    fetchWeighDetails();
  }, [filter]);

  // Pagination calculations
  const totalPages = Math.ceil(weighDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWeighDetails = weighDetails.slice(startIndex, endIndex);

  // Custom loader
  const Loader = () => (
    <Box className="flex justify-center p-4">
      <RadixSpinner className="w-8 h-8 text-blue-500 animate-spin" />
    </Box>
  );

  // Handle row click to open dialog
  const handleRowClick = (weigh) => {
    setSelectedWeigh(weigh);
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedWeigh(null);
  };

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>View Weighs</Heading>
        <Select.Root value={filter} onValueChange={setFilter}>
          <Select.Trigger placeholder="Filter weighs" />
          <Select.Content>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
            <Select.Item value="uncompleted">Uncompleted</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="my-4 w-full" />

      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CLIENT NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GROSS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TAR</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NET</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EXTRA</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isFetching ? (
            <Table.Row>
              <Table.Cell colSpan={9}>
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : paginatedWeighDetails.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="text-center p-4">
                {failedSearch ? "No weighs found" : "No data"}
              </Table.Cell>
            </Table.Row>
          ) : (
            paginatedWeighDetails.map((item) => (
              <Table.Row
                key={item.id}
                onClick={() => handleRowClick(item)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {item.customer
                    ? `${item.customer.firstname} ${item.customer.lastname}`
                    : item.supplier
                    ? `${item.supplier.firstname} ${item.supplier.lastname}`
                    : "-"}
                </Table.Cell>
                <Table.Cell>{item.transactions?.quantity || 0}</Table.Cell>
                <Table.Cell>{item.gross || "-"}</Table.Cell>
                <Table.Cell>{item.tar || "-"}</Table.Cell>
                <Table.Cell>{item.net || "-"}</Table.Cell>
                <Table.Cell>{item.extra || "-"}</Table.Cell>
                <Table.Cell>{item.vehicleNo || "-"}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`${checkStatus(item.status)} p-1 rounded`}
                        title={
                          item.status === "uncompleted"
                            ? "Uncompleted"
                            : "Completed"
                        }
                      />
                      <span className={`${checkStatus(item.status)} text-sm`}>
                        {item.status === "uncompleted"
                          ? "Pending"
                          : "Completed"}
                      </span>
                    </div>
                    {item.status === "uncompleted" && (
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button
                            variant="soft"
                            title="Actions"
                            size="2"
                            onClick={(e) => e.stopPropagation()}
                            className="!p-1 hover:!bg-gray-200"
                          >
                            <FontAwesomeIcon
                              icon={faEllipsisV}
                              className="text-gray-500 hover:text-gray-700"
                            />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          {item.status === "uncompleted" && (
                            <DropdownMenu.Item
                              onSelect={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/admin/weighing-operations/finish-weigh/${item.id}`
                                );
                              }}
                            >
                              Complete Weigh
                            </DropdownMenu.Item>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Weigh Details Dialog */}
      <WeighDetailsDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        selectedWeigh={selectedWeigh}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Flex justify="center" className="mt-4">
          <Flex gap="2" align="center">
            <Button
              variant="soft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "solid" : "soft"}
                onClick={() => setCurrentPage(page)}
                className={
                  page === currentPage
                    ? "!bg-blue-600 !text-white"
                    : "!bg-blue-50 hover:!bg-blue-100"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="soft"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default AllWeigh;
