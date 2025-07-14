import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, Table, Flex, Button, Heading, Spinner, Text, Separator } from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { refractor, refractorToTime } from "../../../date";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const OfficialPasses = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [passDetails, setPassDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchGatePass = async (pageUrl = null) => {
    setLoading(true);
    setPassDetails([]);
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
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/customer/get-all-gatepass`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gatePasses = response?.data?.records || [];
      setPassDetails(gatePasses);
      if (gatePasses.length === 0) {
        setFailedSearch(true);
        setFailedText("No gate pass records found.");
      }
      const nextPage = response.data.pagination?.nextPage;
      if (nextPage && typeof nextPage === "string") {
  setPaginationUrls((prev) => {
    const newUrls = [...prev];
    if (newUrls.length <= currentPageIndex + 1) {
      newUrls.push(nextPage); // add next page only once
    }
    return newUrls;
  });
}

    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to fetch gate pass records.";
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

  const handleSendToPrintGatepass = async (id) => {
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
        `${root}/batch/add-gate-pass-to-print/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast({
        message: "Gate pass sent to print successfully!",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      showToast({
        message: error?.response?.data?.message || "Failed to send gate pass to print.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const getSquareColor = (status) => {
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

  const isDropdownDisabled = (status) => status === "pending" || status === "rejected";

  const handleNextPage = () => {
    const nextIndex = currentPageIndex + 1;
    setCurrentPageIndex(nextIndex);
    fetchGatePass(paginationUrls[currentPageIndex] || null);
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchGatePass(prevIndex === 0 ? null : paginationUrls[prevIndex - 1]);
    }
  };

  useEffect(() => {
    fetchGatePass();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="my-5 gap-4">
        <Heading size="5">View All Gate Pass Notes</Heading>
        <Button
          size="3"
          title="Create New Gate Pass For Supplier"
          className="!bg-theme !text-white hover:!bg-brown-500 cursor-pointer px-5"
          onClick={() => navigate("/admin/suppliers/create-gatepass")}
        >
          Create New Gate Pass
        </Button>
      </Flex>

      <Separator className="my-4 w-full" />

      <Table.Root variant="surface" className="mt-4 table-fixed w-full" size="2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">DRIVER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">OWNER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">GOODS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">DESTINATION</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">DEPARTURE TIME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="p-4 text-center">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="p-4 text-center">
                <Text>{failedText}</Text>
              </Table.Cell>
            </Table.Row>
          ) : passDetails.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="p-4 text-center">
                <Text>No gate pass records found</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            passDetails.map((entry) => (
              <Table.Row
                key={entry.id || `${entry.vehicleNo || entry?.transaction?.authToWeighTickets?.vehicleNo || "unknown"}-${entry.createdAt}`}
              >
                <Table.Cell>{refractor(entry.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>
                  {entry?.driver || entry?.transaction?.authToWeighTickets?.driver || "N/A"}
                </Table.Cell>
                <Table.Cell>{entry.owner || "N/A"}</Table.Cell>
                <Table.Cell>
                  {entry?.transaction?.porders?.name || entry?.rawMaterial?.name || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {entry?.transaction?.authToWeighTickets?.vehicleNo || entry?.vehicleNo || "N/A"}
                </Table.Cell>
                <Table.Cell>{entry.destination || "N/A"}</Table.Cell>
                <Table.Cell>{refractorToTime(entry.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="1">
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={getSquareColor(entry.status)}
                    />
                    <Text>{_.upperFirst(entry.status || "N/A")}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="soft"
                        disabled={loadingId === entry.id || isDropdownDisabled(entry.status)}
                        className="cursor-pointer"
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
                        onSelect={() => navigate(`/admin/receipt/view-gatepass/${entry.id}`)}
                      >
                        View Approved Gate Pass
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => handleSendToPrintGatepass(entry.id)}
                        disabled={loadingId === entry.id}
                      >
                        {loadingId === entry.id ? <Spinner size="1" /> : "Send To Print"}
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
        {console.log(paginationUrls)
        }
        {console.log(currentPageIndex)}
        
        <Button
          variant="soft"
          disabled={!paginationUrls[currentPageIndex]}
          onClick={handleNextPage}
          className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
          aria-label="Next page"
        >
          Next
        </Button>
      </Flex>
      </div>


      <Separator className="my-4 w-full" />
    </>
  );
};

export default OfficialPasses;