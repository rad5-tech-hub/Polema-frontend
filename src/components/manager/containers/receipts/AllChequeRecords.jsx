import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Heading, Button, Flex, Text, Spinner, Separator } from "@radix-ui/themes";
import axios from "axios";
import { formatMoney, refractor } from "../../../date";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const AllChequeRecords = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [cheques, setCheques] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchCheques = async (pageUrl = null) => {
    setIsLoading(true);
    setCheques([]);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
        duration: 4000,
      });
      setIsLoading(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/admin/get-cheques`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCheques(response.data.data || []);
      if (response.data.pagination?.nextPage && response.data.pagination.nextPage !== "/admin/get-cheques") {
        setPaginationUrls((prev) => {
          const newUrls = [...prev];
          newUrls[currentPageIndex] = response.data.pagination.nextPage;
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Error fetching cheque records";
      setError(errorMessage);
      showToast({
        message: errorMessage,
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex <= paginationUrls.length) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchCheques(paginationUrls[currentPageIndex] || null);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchCheques(prevIndex === 0 ? null : paginationUrls[prevIndex - 1]);
    }
  };

  useEffect(() => {
    fetchCheques();
  }, []);

  return (
    <>
    <div className="flex justify-between items-center">

        <Heading className="mb-4">All Cheque Records</Heading>
        <Button
          className="!bg-theme !text-white hover:!bg-brown-500 cursor-pointer"
          onClick={() => navigate("/admin/receipts/cheque-records")}
        >
          New Cheque Record
        </Button>
    </div>
      <Separator className="my-4 w-full" />
      <Table.Root className="mt-4 table-fixed w-full" variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">CHEQUE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">BANK</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">AMOUNT(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">PURPOSE OF PAYMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
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
          ) : cheques.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                No cheque records found
              </Table.Cell>
            </Table.Row>
          ) : (
            cheques.map((cheque) => (
              <Table.Row key={cheque.id || `${cheque.chequeNo}-${cheque.createdAt}`}>
                <Table.Cell>{cheque.createdAt ? refractor(cheque.createdAt) : "N/A"}</Table.Cell>
                <Table.Cell>{cheque.name || "N/A"}</Table.Cell>
                <Table.Cell>{cheque.chequeNo || "N/A"}</Table.Cell>
                <Table.Cell>{cheque.bank?.name || "N/A"}</Table.Cell>
                <Table.Cell>{formatMoney(cheque.amount || 0)}</Table.Cell>
                <Table.Cell>{cheque.purpose || "N/A"}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {(paginationUrls.length > 0 || currentPageIndex > 0) && (
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
              disabled={currentPageIndex >= paginationUrls.length && !paginationUrls[currentPageIndex - 1]}
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

export default AllChequeRecords;