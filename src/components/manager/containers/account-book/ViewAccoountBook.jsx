import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "antd";
import { refractor, formatMoney } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import {
  Spinner,
  Table,
  Heading,
  Select,
  Flex,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { Modal } from "antd";
const { RangePicker } = DatePicker;

const root = import.meta.env.VITE_ROOT;

const ViewAccountBook = () => {
  const [rawAccountBook, setRawAccountBook] = useState([]);
  const [accountBook, setAccountBook] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerActive, setCustomerActive] = useState(true);
  const [department, setDepartments] = useState([]);
  const [accountRecepient, setAccountRecepient] = useState("customers");
  const [failedSearch, setFailedSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBank, setSelectedBank] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  // New states for pagination
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Fetch Bank Details
  const fetchBankDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankDetails(response.data.banks || []);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Error: Error in getting bank details");
    }
  };

  // Fetch Account Book Details
  const fetchAccountBookDetails = async (
    startDate,
    endDate,
    pageUrl = null
  ) => {
    setLoading(true);
    setRawAccountBook([]);
    setAccountBook([]);
    setFailedSearch(false);
    let retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setLoading(false);
      return;
    }

    const changeURLByRecepient = (recepient) => {
      switch (recepient) {
        case "customers":
          return "get-accountbook";
        case "suppliers":
          return "get-supplier-accountbook";
        case "others":
          return "get-other-accountbook";
        default:
          return "";
      }
    };
    

    let url =
      `${root}${pageUrl}` || `${root}/customer/${changeURLByRecepient(accountRecepient)}`;
    if (startDate && endDate && !pageUrl) {
      url = `${root}/customer/acctbook-filter?startDate=${startDate}&endDate=${endDate}`;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      const output =
        startDate && endDate ? response.data.data : response.data.acct;
      if (output.length === 0) {
        setFailedSearch(true);
        setRawAccountBook([]);
        setAccountBook([]);
      } else {
        setRawAccountBook(output);
        setAccountBook(output);
        setFailedSearch(false);
        // Store nextPage URL if it exists and we're using date filter
        if (startDate && endDate && response.data.pagination?.nextPage) {
          setPaginationUrls((prev) => {
            // Only add new URL if it's not already in the array
            if (!prev.includes(response.data.pagination.nextPage)) {
              return [...prev, response.data.pagination.nextPage];
            }
            return prev;
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching account book:", error);
      setLoading(false);
      toast.error("An error occurred, try again later", {
        style: { padding: "20px" },
        duration: 5000,
      });
      setFailedSearch(true);
    }
  };

  // Fetch Customer details
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      toast.error(error.message || "An Error Occurred");
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setProducts(response.data.length === 0 ? [] : response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const matchDepartmentNameById = (id) => {
    const dept = department.find((item) => item.id === id);
    return dept ? dept.name : "";
  };

  // Handle row click to open modal
  const handleRowClick = (details) => {
    setSelectedRow(details);
    setIsModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  // Handle bank selection
  const handleBankChange = (value) => {
    setSelectedBank(value);
  };

  // Handle clear date range
  const handleClearDateRange = () => {
    setDateRange(null);
    fetchAccountBookDetails();
    setPaginationUrls([]); // Clear pagination URLs when clearing date range
    setCurrentPageIndex(0);
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchAccountBookDetails(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      fetchAccountBookDetails(null, null, paginationUrls[currentPageIndex]);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchAccountBookDetails(null, null, paginationUrls[prevIndex]);
    }
  };

  // Filter accountBook based on selectedBank
  useEffect(() => {
    if (selectedBank === "all") {
      setAccountBook(rawAccountBook);
      setFailedSearch(rawAccountBook.length === 0);
    } else {
      const filtered = rawAccountBook.filter(
        (details) => details.bank?.name?.toString() === selectedBank
      );
      setAccountBook(filtered);
      setFailedSearch(filtered.length === 0);
    }
  }, [selectedBank, rawAccountBook]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchDepartments();
    fetchBankDetails();
    fetchAccountBookDetails();
  }, []);

  useEffect(() => {
    fetchAccountBookDetails();
    setPaginationUrls([]); // Reset pagination when recipient changes
    setCurrentPageIndex(0);
  }, [accountRecepient]);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>Account Book</Heading>
        <div className="flex gap-4">
          <div className="date-picker right-0 top-0">
            <RangePicker
              value={dateRange}
              onCalendarChange={(dates) => {
                setDateRange(dates);
                if (dates && dates[0] && dates[1]) {
                  setPaginationUrls([]); // Reset pagination on new date filter
                  setCurrentPageIndex(0);
                  fetchAccountBookDetails(
                    dates[0].format("YYYY-MM-DD"),
                    dates[1].format("YYYY-MM-DD")
                  );
                }
              }}
            />
            {dateRange !== null && (
              <FontAwesomeIcon
                icon={faClose}
                className="ml-2 cursor-pointer"
                onClick={handleClearDateRange}
              />
            )}
          </div>
          <Select.Root
            value={selectedBank}
            onValueChange={handleBankChange}
            size="2"
          >
            <Select.Trigger placeholder="Filter by Bank" />
            <Select.Content>
              <Select.Item value="all">All Banks</Select.Item>
              {bankDetails.length === 0 ? (
                <Select.Item value="no-banks" disabled>
                  No Banks Available
                </Select.Item>
              ) : (
                bankDetails.map((bank) => (
                  <Select.Item key={bank.id} value={bank.name.toString()}>
                    {bank.name}
                  </Select.Item>
                ))
              )}
            </Select.Content>
          </Select.Root>
        </div>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BANK NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RAW MATERIALS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {selectedBank === "all" ? "BALANCE" : "BANK BALANCE"}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="9">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : accountBook.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="9">
                {failedSearch ? "No Records Found" : "No Data Available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            accountBook.map((details) => (
              <Table.Row
                key={details.id}
                className="hover:bg-gray-600/10"
                onClick={() => handleRowClick(details)}
                style={{ cursor: "pointer" }}
              >
                <Table.Cell>{refractor(details.createdAt)}</Table.Cell>
                <Table.Cell>
                  {details.other === null
                    ? details.theSupplier === null
                      ? `${details.theCustomer?.firstname || ""} ${
                          details.theCustomer?.lastname || ""
                        }`
                      : `${details.theSupplier?.firstname || ""} ${
                          details.theSupplier?.lastname || ""
                        }`
                    : details.other}
                </Table.Cell>
                <Table.Cell>
                  {details.bank?.name || "No bank provided"}
                </Table.Cell>
                <Table.Cell>
                  {matchDepartmentNameById(details.departmentId)}
                </Table.Cell>
                <Table.Cell>
                  {details.other == null
                    ? details.credit < details.debit
                      ? ""
                      : details.theProduct.name
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  {details.other == null
                    ? details.credit < details.debit
                      ? details.theProduct.name
                      : ""
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(
                    details.credit > details.debit ? details.credit : ""
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(
                    details.debit > details.credit ? details.debit : ""
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(
                    selectedBank === "all"
                      ? details.balance
                      : details.bankBalance || ""
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      {paginationUrls.length > 0 && (
        <Flex justify="center" gap="2" className="mt-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPageIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={
              currentPageIndex >= paginationUrls.length - 1 &&
              !paginationUrls[currentPageIndex]
            }
          >
            Next
          </Button>
        </Flex>
      )}

      {/* Modal for showing credit/debit details */}
      <Modal
        title="Transaction Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRow && (
          <div>
            <p style={{ padding: "8px 0" }}>
              <strong>Date:</strong> {refractor(selectedRow.createdAt)}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Name:</strong>
              {selectedRow.other === null
                ? selectedRow.theSupplier === null
                  ? `${selectedRow.theCustomer?.firstname || ""} ${
                      selectedRow.theCustomer?.lastname || ""
                    }`
                  : `${selectedRow.theSupplier?.firstname || ""} ${
                      selectedRow.theSupplier?.lastname || ""
                    }`
                : selectedRow.other}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Bank Name:</strong>{" "}
              {selectedRow.bank?.name || "No bank provided"}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Department:</strong>{" "}
              {matchDepartmentNameById(selectedRow.departmentId)}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Credit (₦):</strong>{" "}
              {formatMoney(
                selectedRow.credit > selectedRow.debit ? selectedRow.credit : 0
              )}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Debit (₦):</strong>{" "}
              {formatMoney(
                selectedRow.debit > selectedRow.credit ? selectedRow.debit : 0
              )}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>
                {selectedBank === "all" ? "Balance" : "Bank Balance"} (₦):
              </strong>{" "}
              {formatMoney(
                selectedBank === "all"
                  ? selectedRow.balance
                  : selectedRow.bankBalance || 0
              )}
            </p>
            <p style={{ padding: "8px 0" }}>
              <strong>Comment:</strong> {selectedRow.comments}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewAccountBook;
