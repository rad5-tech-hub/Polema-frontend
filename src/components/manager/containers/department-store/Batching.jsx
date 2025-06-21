import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { refractor } from "../../../date";
import {
  Heading,
  Flex,
  Button,
  Table,
  Text,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const Batching = () => {
  const showToast = useToast();
  const navigate = useNavigate()
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBatchButtonLoading, setNewBatchButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newestRecordRunnning, setNewestRecordRunning] = useState(false);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchBatches = async (pageUrl = null) => {
    setIsLoading(true);
    setBatches([]);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });
      setIsLoading(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/batch/all-batch`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBatches(response.data.data || []);
      setNewestRecordRunning(response.data.data[0].isActive);
      if (response.data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = response.data.pagination.nextPage;
          const newUrls = prev.slice(0, currentPageIndex + 1);
          if (!newUrls.includes(newUrl)) {
            return [...newUrls, newUrl];
          }
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred, please try again."
      );
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewBatch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });
      return;
    }
    setNewBatchButtonLoading(true);
    try {
      await axios.post(
        `${root}/batch/start-batch`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast({
        type: "success",
        message: "New Batch started successfully.",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchBatches();
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred when starting new batch.",
      });
    } finally {
      setNewBatchButtonLoading(false);
    }
  };

  const statusFunction = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });
      return;
    }
    try {
      await axios.patch(
        `${root}/batch/end-batch/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast({
        type: "success",
        message: "Batch ended successfully.",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchBatches();
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred while trying to end batch.",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchBatches(paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchBatches(paginationUrls[currentPageIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchBatches(prevIndex === 0 ? null : paginationUrls[prevIndex]);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>Batching Records</Heading>
        <Button
          className={` text-white hover:!bg-brown-500 ${
            newestRecordRunnning ? "!bg-theme/70 cursor-not-allowed" : "!bg-theme cursor-pointer"
          }`}
          disabled={newestRecordRunnning}
          onClick={startNewBatch}
        >
          
          {newBatchButtonLoading ? <Spinner size="1" /> : "New Batch"}
        </Button>
      </Flex>

      <Table.Root
        className="mt-4 table-fixed w-full"
        variant="surface"
        size="2"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              PERIOD
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TOTAL FVO SOLD (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TOTAL CPKO BOUGHT (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TOTAL FATTY ACID SOLD
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              TOTAL SLUDGE SOLD
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : error ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                <Text color="red">{error}</Text>
              </Table.Cell>
            </Table.Row>
          ) : batches.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                No batch records found.
              </Table.Cell>
            </Table.Row>
          ) : (
            batches.map((batch) => {
              return (
                <Table.Row
                  key={batch.id || `${batch.startDate}-${batch.endDate}`}
                >
                  <Table.Cell>
                    {`${refractor(batch?.startDate) || "N/A"} - ${
                      batch?.endDate ? refractor(batch?.endDate) : ""
                    }`}
                  </Table.Cell>
                  <Table.Cell>{batch?.totalFVOSold || "N/A"}</Table.Cell>
                  <Table.Cell>{batch?.totalCPKOBought || "N/A"}</Table.Cell>
                  <Table.Cell>{batch?.totalFattyAcidSold || "N/A"}</Table.Cell>
                  <Table.Cell>{batch?.totalSludgeSold || "N/A"}</Table.Cell>
                  <Table.Cell className="text-sm">
                    <FontAwesomeIcon
                      className={`${
                        batch?.isActive ? "text-green-500" : "text-red-500"
                      } mr-2`}
                      icon={faSquare}
                    />
                    {batch?.isActive ? "Open" : "Closed"}
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" className="cursor-pointer">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content variant="solid">
                        <DropdownMenu.Item
                          onClick={() =>
                            navigate(`/admin/department-store/batching/${batch.id}`)
                          }
                        >
                          View Batch Records
                        </DropdownMenu.Item>
                        {batch?.isActive && (
                          <DropdownMenu.Item
                            onClick={() => statusFunction(batch.id)}
                          >
                            End Batch
                          </DropdownMenu.Item>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>

      {paginationUrls.length > 0 && (
        <Flex justify="center" className="mt-4">
          <Flex gap="2" align="center">
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
              disabled={currentPageIndex >= paginationUrls.length}
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Next page"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Batching;
