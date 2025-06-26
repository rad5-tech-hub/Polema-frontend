import React, { useState, useEffect, useRef } from "react";
import Image from "../../../../static/image/polema-logo.png";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faStop,
  faRedo,
  faClose,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import DocumentsModal from "./DocumentsModal";
import toast, { Toaster } from "react-hot-toast";
import { refractor, formatMoney } from "../../../date";
import { useParams, useNavigate } from "react-router-dom";
import {
  Skeleton,
  Table,
  Heading,
  Spinner,
  Flex,
  Button,
  TextField,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { Modal, Select, DatePicker } from "antd";
import { StopOutlined } from "@ant-design/icons";
import useToast from "../../../../hooks/useToast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

const IndividualCustomerLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [failedSearch, setFailedSearch] = useState(false);
  const [customer, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [creditCustomerModalOpen, setCreditCustomerModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [dateRange, setDateRange] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [startingDateRange, setStartingDateRange] = useState({
    start: "",
    end: "",
  });
  const [statementDetails, setStatementDetails] = useState([]);
  const [isStatementDateModalOpen, setIsStatementDateModalOpen] = useState(false);

  const searchInputRef = useRef(null);

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  // Fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }
    try {
      const { data } = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showToast({
        message: "Failed to fetch customers",
        type: "error",
      });
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }
    try {
      const { data } = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast({
        message: "Failed to fetch products",
        type: "error",
      });
    }
  };

  // Fetch customer ledger for displayed transactions
  const getCustomerLedger = async (
    startDate = null,
    endDate = null,
    pageUrl = null
  ) => {
    setLoading(true);
    setEntries([]);
    setFailedSearch(false);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      setLoading(false);
      return;
    }

    let url;
    if (pageUrl) {
      url = `${root}${pageUrl}`;
    } else if (startDate && endDate) {
      url = `${root}/customer/get-customer-ledger/${id}?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/customer/get-customer-ledger/${id}`;
    }

    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      const output = data.data || [];
      if (output.length === 0) {
        setFailedSearch(true);
        setEntries([]);
      } else {
        setEntries(output);
        setFailedSearch(false);
      }

      if (data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = data.pagination.nextPage;
          if (!prev.includes(newUrl)) {
            return pageUrl && currentPageIndex >= prev.length - 1
              ? [...prev, newUrl]
              : [newUrl];
          }
          return prev;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer ledger:", error);
      showToast({
        message: "Failed to fetch customer ledger",
        type: "error",
      });
      setFailedSearch(true);
      setLoading(false);
    }
  };

  // Fetch statement details for PDF
  const fetchStatementDetails = async (startDate, endDate) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }

    try {
      const { data } = await axios.get(
        `${root}/customer/get-customer-ledger/${id}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );

      const output = data.data || [];
      setStatementDetails(output);
      if (output.length === 0) {
        showToast({
          message: "No records found for the selected date range",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching statement details:", error);
      showToast({
        message: "Failed to fetch statement details",
        type: "error",
      });
      setStatementDetails([]);
    }
  };

  // Update startingDateRange when entries change
  useEffect(() => {
    if (entries.length > 0) {
      setStartingDateRange({
        start: refractor(entries[0]?.createdAt) || "",
        end: refractor(entries[entries.length - 1]?.createdAt) || "",
      });
    } else {
      setStartingDateRange({ start: "", end: "" });
    }
  }, [entries]);

  // Generate PDF
  const generatePDF = (startDate, endDate) => {
    setGeneratingPDF(true);
    const customerName = `${getCustomerByID(id).firstname} ${
      getCustomerByID(id).lastname
    }`;
    const dateRangeStr = startDate && endDate
      ? `${startDate}_to_${endDate}`
      : dateRange
      ? `${dateRange[0].format("YYYY-MM-DD")}_to_${dateRange[1].format(
          "YYYY-MM-DD"
        )}`
      : `${startingDateRange.start}_to_${startingDateRange.end}`;
    const fileName = `${customerName}-${dateRangeStr}.pdf`;

    const doc = new jsPDF();

    // Add image to the PDF
    const imgWidth = 50;
    const imgHeight = 20;
    doc.addImage(Image, "PNG", 14, 10, imgWidth, imgHeight);

    // Add text below the image
    doc.setFontSize(16);
    doc.text(`Transaction Statement for ${customerName}`, 14, 35);
    doc.setFontSize(12);
    doc.text(
      `Date Range: ${
        startDate && endDate
          ? `${startDate} to ${endDate}`
          : dateRange
          ? dateRangeStr.replace("_to_", " to ")
          : `${startingDateRange.start} to ${startingDateRange.end}`
      }`,
      14,
      45
    );

    const tableData = statementDetails.map((entry) => [
      refractor(entry.createdAt),
      getProductByID(entry.productId),
      entry.unit,
      entry.quantity,
      entry.unitPrice ? formatMoney(entry.unitPrice) : "",
      entry.comments || "",
      `${formatMoney(entry.credit > entry.debit ? entry.credit : "")}`,
      `${formatMoney(entry.debit > entry.credit ? entry.debit : "")}`,
      `${formatMoney(entry.balance)}`,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [
        [
          "Date",
          "Product",
          "Unit",
          "Quantity",
          "Unit Price",
          "Comments",
          "Credit",
          "Debit",
          "Balance",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [67, 67, 67], textColor: 255 },
      styles: { fontSize: 10 },
    });

    doc.save(fileName);
    setGeneratingPDF(false);
    showToast({
      message: "PDF generated successfully",
      type: "success",
      duration: 5000,
    });
    setIsStatementDateModalOpen(false); // Close the modal after generating PDF
  };

  // End transaction
  const handleEndTransaction = async (tranxId) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [tranxId]: true }));
    try {
      await axios.patch(
        `${root}/customer/end-transaction/${tranxId}`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      showToast({
        message: "Transaction ended successfully",
        type: "success",
        duration: 5000,
      });

      getCustomerLedger(
        dateRange?.[0]?.format("YYYY-MM-DD"),
        dateRange?.[1]?.format("YYYY-MM-DD")
      );
    } catch (error) {
      console.error("Error ending transaction:", error);
      showToast({
        message: "Failed to end transaction",
        type: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [tranxId]: false }));
    }
  };

  // Restart transaction
  const handleRestartTransaction = async (tranxId) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [tranxId]: true }));
    try {
      await axios.patch(
        `${root}/customer/reopen-transaction/${tranxId}`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );

      showToast({
        message: "Transaction restarted successfully",
        type: "success",
        duration: 5000,
      });
      getCustomerLedger(
        dateRange?.[0]?.format("YYYY-MM-DD"),
        dateRange?.[1]?.format("YYYY-MM-DD")
      );
    } catch (error) {
      console.error("Error restarting transaction:", error);
      showToast({
        message: "Failed to restart transaction",
        type: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [tranxId]: false }));
    }
  };

  const getCustomerByID = (id) => {
    const userCustomer = customer.find((item) => item.id === id);
    return (
      userCustomer || {
        firstname: "Name",
        lastname: "Not Found",
        customerTag: "N/A",
      }
    );
  };

  const getProductByID = (id) => {
    const product = products.find((item) => item.id === id);
    return product ? product.name : "Product not Found";
  };

  // Modal for crediting customer
  const CreditCustomerModal = () => {
    const [productId, setProductId] = useState("");
    const [transactionType, setTransactionType] = useState("credit");
    const [creditAmount, setCreditAmount] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [comments, setComments] = useState("");

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setCreditAmount(value);
      } else {
        setCreditAmount("");
      }
    };

    const handleCreditSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "error",
          message: "An error occurred, try logging in again.",
        });
        return;
      }
      if (!productId) {
        showToast({
          message: "Select a product first",
          type: "error",
        });
        return;
      }
      if (!creditAmount) {
        showToast({
          message: "Enter an amount first",
          type: "error",
        });
        return;
      }
      setButtonLoading(true);
      const body = {
        customerId: id,
        productId,
        [transactionType]: creditAmount,
        comments,
      };

      try {
        const response = await axios.post(
          `${root}/customer/create-ledger`,
          body,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast({
          message: "Ledger Updated Successfully",
          type: "success",
          duration: 5000,
        });

        setButtonLoading(false);
        setCreditCustomerModalOpen(false);
        getCustomerLedger(
          dateRange?.[0]?.format("YYYY-MM-DD"),
          dateRange?.[1]?.format("YYYY-MM-DD")
        );
      } catch (err) {
        showToast({
          type: "error",
          message:
            err.message || "An error occurred while trying to update ledger",
        });
        setButtonLoading(false);
      }
    };

    const filterProductOption = (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
      <Modal
        open={creditCustomerModalOpen}
        title="Record Book Details"
        footer={null}
        onCancel={() => {
          setCreditCustomerModalOpen(false);
          setProductId("");
          setCreditAmount("");
          setComments("");
        }}
      >
        <form onSubmit={handleCreditSubmit}>
          <div className="mt-4">
            <label htmlFor="product-select" className="font-bold">
              Product
            </label>
            <Select
              id="product-select"
              showSearch
              placeholder="Search for a product"
              optionFilterProp="children"
              onChange={(value) => setProductId(value)}
              value={productId || undefined}
              filterOption={filterProductOption}
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              style={{ width: "100%", marginTop: 8 }}
              allowClear
            />
          </div>
          <div className="mt-4">
            <label htmlFor="transaction-type" className="font-bold mt-4">
              Transaction Type
            </label>
            <select
              id="transaction-type"
              className="block w-full border-2 border-black/60 p-3 rounded"
              onChange={(e) => setTransactionType(e.target.value)}
              value={transactionType}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="amount" className="font-bold mt-4">
              Enter Amount
            </label>
            <TextField.Root
              id="amount"
              placeholder="Enter Amount"
              className="p-3"
              value={formatNumberWithCommas(creditAmount)}
              onChange={handlePriceChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="comments" className="font-bold mt-4">
              Comments
            </label>
            <TextField.Root
              id="comments"
              placeholder="Enter Comments"
              className="p-3"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 p-2 text-white !bg-blue-400"
            disabled={buttonLoading}
          >
            {buttonLoading ? "Please Wait..." : "Submit"}
          </Button>
        </form>
      </Modal>
    );
  };

  const StatementDateDetails = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!startDate || !endDate) {
        showToast({
          message: "Please select both start and end dates",
          type: "error",
        });
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        showToast({
          message: "Start date cannot be after end date",
          type: "error",
        });
        return;
      }
      fetchStatementDetails(startDate, endDate).then(() => {
        if (statementDetails.length > 0) {
          generatePDF(startDate, endDate);
        }
      }).catch((err)=>{
        showToast({
          type:"error",
          message:"An error occurred in fetching statement details"
        })  
      })
    };

    return (
      <div
        className={`p-4 shadow-md w-[450px] rounded absolute z-[999] bg-white ${
          isStatementDateModalOpen ? "block" : "hidden"
        }`}
      >
        <h1 className="font-bold text-lg mb-0">Generate Account Statement</h1>
        <p className="mb-4 opacity-80">{`${
              getCustomerByID(id).firstname
            } ${getCustomerByID(id).lastname}`}</p>
        <form onSubmit={handleSubmit}>
          <FontAwesomeIcon icon={faClose} className="absolute top-4 right-4 cursor-pointer" onClick={()=>{
            setIsStatementDateModalOpen(false)
          }} />
          
          <div className="mb-4">
            <label htmlFor="start-date" className="block font-bold">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="end-date" className="block font-bold">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="!bg-blue-400 text-white"
            disabled={generatingPDF}
          >
            {generatingPDF ? "Generating..." : "Submit"}
          </Button>
        </form>
      </div>
    );
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    const filtered = customer.filter(({ firstname, lastname }) =>
      `${firstname} ${lastname}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    getCustomerLedger();
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      getCustomerLedger(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      getCustomerLedger(null, null, paginationUrls[currentPageIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      getCustomerLedger(null, null, paginationUrls[prevIndex]);
    }
  };

  const handleModal = (tranxId) => {
    if (!tranxId) return;

    setModalOpen(true);
    setTransactionId(tranxId);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (id) getCustomerLedger();
  }, [id]);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <div className="w-full">
          {!customer.length ? (
            <Skeleton className="p-4 w-[150px]" />
          ) : (
            <Heading className="font-amsterdam">{`${
              getCustomerByID(id).firstname
            } ${getCustomerByID(id).lastname}`}</Heading>
          )}
          {!customer.length ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : (
            <p className="text-sm opacity-65">
              {getCustomerByID(id).customerTag}
            </p>
          )}
          {decodeToken().isAdmin && customer.length > 0 && (
            <div className="flex gap-4 relative">
              <Button
                className="mt-4 cursor-pointer"
                onClick={() => {
                  setCreditCustomerModalOpen(true);
                }}
              >
                Credit Customer
              </Button>
              <Button
                className="mt-4 cursor-pointer"
                color="green"
                onClick={() => setIsStatementDateModalOpen(true)}
                disabled={loading || entries.length === 0}
              >
                Generate Statement
              </Button>
              <StatementDateDetails />
            </div>
          )}
        </div>

        <div className="w-[70%]">
          <Flex gap="3" align="center" direction="column">
            <div className="relative w-full max-w-md" ref={searchInputRef}>
              <TextField.Root
                placeholder="Enter Customer Name"
                size="3"
                className="mx-auto"
                value={searchInput}
                onChange={handleSearchInput}
              >
                <TextField.Slot>
                  <FontAwesomeIcon icon={faSearch} />
                </TextField.Slot>
              </TextField.Root>
              {searchInput && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                  {filteredCustomers.map((customer) => (
                    <li
                      key={customer.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchInput(
                          `${customer.firstname} ${customer.lastname}`
                        );
                        setFilteredCustomers([]);
                        navigate(
                          `/admin/customers/customer-ledger/${customer.id}`
                        );
                      }}
                    >
                      {customer.firstname} {customer.lastname}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="date-picker">
              <RangePicker
                value={dateRange}
                onCalendarChange={(dates) => {
                  setDateRange(dates);
                  if (dates && dates[0] && dates[1]) {
                    setPaginationUrls([]);
                    setCurrentPageIndex(0);
                    getCustomerLedger(
                      dates[0].format("YYYY-MM-DD"),
                      dates[1].format("YYYY-MM-DD")
                    );
                  }
                }}
              />
              {dateRange !== null && (
                <FontAwesomeIcon
                  icon={faRedoAlt}
                  className="ml-2 cursor-pointer"
                  onClick={handleClearDateRange}
                />
              )}
            </div>
          </Flex>
        </div>
      </Flex>

      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ACTION</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="10">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : entries.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="10" className="p-4 text-center">
                {failedSearch ? "No records found" : "No data available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            entries.map((entry) => (
              <Table.Row
                key={entry.id || entry.tranxId}
                className="cursor-pointer hover:bg-gray-300/10"
                onClick={() => handleModal(entry.tranxId)}
              >
                <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                <Table.Cell>{getProductByID(entry.productId)}</Table.Cell>
                <Table.Cell>{entry.unit}</Table.Cell>
                <Table.Cell>{entry.quantity}</Table.Cell>
                <Table.Cell>
                  {entry.unitPrice ? formatMoney(entry.unitPrice) : ""}
                </Table.Cell>
                <Table.Cell>
                  {entry.comments !== null ? entry.comments : ""}
                </Table.Cell>
                <Table.Cell className="text-green-500 font-bold">
                  {formatMoney(entry.credit > entry.debit ? entry.credit : "")}
                </Table.Cell>
                <Table.Cell className="text-red-500 font-bold">
                  {formatMoney(entry.debit > entry.credit ? entry.debit : "")}
                </Table.Cell>
                <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
                <Table.Cell>
                  {entry.isEnd ? (
                    <Button
                      variant="soft"
                      color="blue"
                      title="Restart Transaction"
                      size="2"
                      disabled={loadingStates[entry.id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestartTransaction(entry.id);
                      }}
                    >
                      {loadingStates[entry.id] ? (
                        <Spinner size="1" />
                      ) : (
                        <FontAwesomeIcon icon={faRedo} />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="soft"
                      color="red"
                      title="End Transaction"
                      size="2"
                      disabled={loadingStates[entry.id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEndTransaction(entry.id);
                      }}
                    >
                      {loadingStates[entry.id] ? (
                        <Spinner size="1" />
                      ) : (
                        <StopOutlined style={{ fontSize: "20px" }} />
                      )}
                    </Button>
                  )}
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
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Previous
            </Button>
            <Text>Page {currentPageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={currentPageIndex >= paginationUrls.length}
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}

      <CreditCustomerModal />
      <DocumentsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        customerId={transactionId}
        customerName={`${getCustomerByID(id).firstname} ${
          getCustomerByID(id).lastname
        }`}
      />
      {/* <Toaster position="top-right" /> */}
    </>
  );
};

export default IndividualCustomerLedger;