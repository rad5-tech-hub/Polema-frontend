import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, Heading, Spinner, Table, Button, Text, Flex } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";
import { refractor } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const AllWayBill = () => {
  const navigate = useNavigate();
  const [billDetails, setBillDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // Tracks the ID of the loading item

  // Fetch all waybills
  const fetchWaybills = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 5000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-waybill`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { waybills } = response.data;
      setBillDetails(waybills);

      if (!waybills || waybills.length === 0) {
        setFailedSearch(true);
        setFailedText("No records found.");
      } else {
        setFailedSearch(false);
      }
    } catch (error) {
      console.error("Error fetching waybills:", error);
      setFailedSearch(true);
      setFailedText("Failed to fetch waybills.");
      toast.error(error.response?.data?.message || "Failed to fetch waybills.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending waybill to print
  const handleSendToPrintWaybill = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 5000 });
      return;
    }

    setLoadingId(id);
    try {
      const response = await axios.post(
        `${root}/batch/add-waybill-to-print/${id}`, // Adjust endpoint as needed
        {}, // Empty body if no data is required
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Waybill sent to print successfully!");
      console.log("Waybill Response:", response.data);
    } catch (error) {
      console.error("Error sending waybill to print:", error);
      toast.error(error.response?.data?.message || "Failed to send waybill to print.");
    } finally {
      setLoadingId(null);
    }
  };

  // Determine square color based on status
  const getStatusColor = (status) => {
    switch (status) {
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

  // Check if dropdown should be disabled
  const isDropdownDisabled = (status) => status === "pending" || status === "rejected";

  // Fetch waybills on component mount
  useEffect(() => {
    fetchWaybills();
  }, []);

  return (
    <>
      <Heading>View All Waybills</Heading>

      {/* Table showing waybill details */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BAGS (PKC)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TRANSPORT CARRIED OUT BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            billDetails.map((item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>{refractor(item.createdAt)}</Table.RowHeaderCell>
                <Table.Cell>{item.bags ? `${item.bags} bags` : ""}</Table.Cell>
                <Table.Cell>
                  {`${item?.transaction?.corder?.firstname || ""} ${
                    item?.transaction?.corder?.lastname || ""
                  }`}
                </Table.Cell>
                <Table.Cell>{item.address || ""}</Table.Cell>
                <Table.Cell>{item.transportedBy || ""}</Table.Cell>
                <Table.Cell>{item.invoice?.vehicleNo || ""}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getStatusColor(item.status)}
                    />
                    {_.upperFirst(item.status) || ""}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  {isDropdownDisabled(item.status) ? (
                    <Button
                      variant="soft"
                      disabled={loadingId === item.id || isDropdownDisabled(item.status)}
                    >
                      {loadingId === item.id ? (
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
                          disabled={loadingId === item.id}
                        >
                          {loadingId === item.id ? (
                            <Spinner size="1" />
                          ) : (
                            <FontAwesomeIcon icon={faEllipsisV} />
                          )}
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onSelect={() => navigate(`/admin/receipts/waybill-invoice/${item.id}`)}
                        >
                          View Approved Waybill
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onSelect={() => handleSendToPrintWaybill(item.id)}
                          disabled={loadingId === item.id}
                        >
                          {loadingId === item.id ? (
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

export default AllWayBill;