import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import { refractor } from "../../../date";
import { Heading, Flex, Button, Table, Text, Spinner, DropdownMenu, Dialog, TextField } from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const Batching = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBatchButtonLoading, setNewBatchButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newestRecordRunnning, setNewestRecordRunning] = useState(false);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [batchProducts, setBatchProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [quantities, setQuantities] = useState({});

  const fetchBatchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", message: "An error occurred, try logging in again." });
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`${root}/batch/batch-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatchProducts(data.data);
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || "An error occurred, please try again.",
      });
    }
  };

  const fetchBatches = async (pageUrl = null) => {
    setIsLoading(true);
    setBatches([]);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", message: "An error occurred, try logging in again." });
      setIsLoading(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/batch/all-batch`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Process batches to extract first occurrence of each raw material and product
      const processedBatches = response.data.data.map((batch) => {
        // Extract first occurrence from raw-material
        const cpko = batch["raw-material"]?.find((item) => item.rawName.toLowerCase() === "cpko");
        const fvo = batch["raw-material"]?.find((item) => item.rawName.toLowerCase() === "fvo");
        // Extract first occurrence from products
        const sludge = batch.products?.find((item) => item.rawName.toLowerCase() === "sludge");
        const fattyAcid = batch.products?.find((item) => item.rawName.toLowerCase() === "fatty acid");

        return {
          ...batch,
          totalCPKOBought: cpko ? cpko.totalQuantity : "N/A",
          totalFVOSold: fvo ? fvo.totalQuantity : "N/A",
          totalSludgeSold: sludge ? sludge.totalQuantity : "N/A",
          totalFattyAcidSold: fattyAcid ? fattyAcid.totalQuantity : "N/A",
        };
      });

      setBatches(processedBatches || []);
      setNewestRecordRunning(response.data.data[0]?.isActive || false);
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
      setError(err?.response?.data?.message || "An error occurred, please try again.");
      showToast({
        type: "error",
        message: err?.response?.data?.message || "An error occurred, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewBatch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", message: "An error occurred, try logging in again." });
      return;
    }
    setNewBatchButtonLoading(true);
    try {
      await axios.post(`${root}/batch/start-batch`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast({
        type: "success",
        position: "top-center",
        message:
          "🎉 Batch Started Successfully \n \n Your batch has been opened. To monitor or update records, head over to 'Opened Batches' and select 'View Records' to get started",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchBatches();
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data?.message || "An error occurred when starting new batch.",
      });
    } finally {
      setNewBatchButtonLoading(false);
    }
  };

  const handleEndBatchClick = (batchId) => {
    setSelectedBatchId(batchId);
    setQuantities({});
    setIsModalOpen(true);
  };

  const handleSaveLikeThat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", message: "An error occurred, try logging in again." });
      return;
    }
    try {
      await axios.patch(`${root}/batch/end-batch/${selectedBatchId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast({ type: "success", message: "Batch ended successfully." });
      setIsModalOpen(false);
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchBatches();
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data?.message || "An error occurred while trying to end batch.",
      });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", message: "An error occurred, try logging in again." });
      return;
    }
    const payload = Object.keys(quantities).reduce((acc, productId) => {
      if (quantities[productId]) {
        acc[productId] = Number(quantities[productId]);
      }
      return acc;
    }, {});

    if (Object.keys(payload).length === 0) {
      showToast({ type: "warning", message: "Please enter at least one quantity." });
      return;
    }

    try {
      await axios.patch(`${root}/batch/update-batchProd/${selectedBatchId}`, { updates: payload }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.patch(`${root}/batch/end-batch/${selectedBatchId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast({ type: "success", message: "Batch updated and ended successfully." });
      setIsModalOpen(false);
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchBatches();
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data?.message || "An error occurred while trying to update and end batch.",
      });
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
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
    fetchBatchProducts();
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

      <Table.Root className="mt-4 table-fixed w-full" variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">PERIOD</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">TOTAL FVO SOLD (TONS)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">TOTAL CPKO BOUGHT (TONS)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">TOTAL FATTY ACID SOLD</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">TOTAL SLUDGE SOLD</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">STATUS</Table.ColumnHeaderCell>
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
            batches.map((batch) => (
              <Table.Row key={batch.id || `${batch.startDate}-${batch.endDate}`}>
                <Table.Cell>{`${refractor(batch?.startDate) || "N/A"} - ${batch?.endDate ? refractor(batch?.endDate) : ""}`}</Table.Cell>
                <Table.Cell>{batch?.totalFVOSold || "N/A"}</Table.Cell>
                <Table.Cell>{batch?.totalCPKOBought || "N/A"}</Table.Cell>
                <Table.Cell>{batch?.totalFattyAcidSold || "N/A"}</Table.Cell>
                <Table.Cell>{batch?.totalSludgeSold || "N/A"}</Table.Cell>
                <Table.Cell className="text-sm">
                  <FontAwesomeIcon
                    className={`${batch?.isActive ? "text-green-500" : "text-red-500"} mr-2`}
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
                        onClick={() => navigate(`/admin/department-store/batching/${batch.id}`)}
                      >
                        View Batch Records
                      </DropdownMenu.Item>
                      {batch?.isActive && (
                        <DropdownMenu.Item onClick={() => handleEndBatchClick(batch.id)}>
                          End Batch
                        </DropdownMenu.Item>
                      )}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              </Table.Row>
            ))
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

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content className="max-w-lg">
          <Flex justify="between" align="center" className="mb-4">
            <Dialog.Title>End Batch</Dialog.Title>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4"
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Flex>
          <Flex direction="column" gap="3">
            {batchProducts.map((product) => (
              <div className="flex gap-4 items-center mb-4" key={product.id}>
                <p className="text-[15px] w-[40%]">{product.name}</p>
                <TextField.Root
                  className="w-full"
                  placeholder={`Enter quantity for ${product.name} in TONS`}
                  value={quantities[product.id] || ""}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                />
              </div>
            ))}
          </Flex>
          <Flex justify="end" gap="3" className="mt-4">
            <Button
              variant="surface"
              onClick={handleSaveLikeThat}
              className="cursor-pointer !bg-theme/75 text-white"
            >
              Finish
            </Button>
            <Button
              variant="solid"
              onClick={handleSave}
              className="cursor-pointer !bg-theme"
            >
              Save
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default Batching;