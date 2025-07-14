import React, { useState } from "react";
import { refractor, formatMoney } from "../../../date";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Spinner,
  Heading,
  Table,
  TextField,
  Button,
  Flex,
  Text,
} from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;
import { Modal, Select } from "antd";
import { jwtDecode } from "jwt-decode";
import useToast from "../../../../hooks/useToast";
import { DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";

const { RangePicker } = DatePicker;

const IndividualDepartmentLedger = () => {
  const { id, ledgerName } = useParams();
  const showToast = useToast();
  const [ledger, setLedger] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);
  const [creditCustomerModalOpen, setCreditCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to get a department ledger
  const getDeptLedger = async (
    startDate = null,
    endDate = null,
    pageUrl = null
  ) => {
    setLoading(true);
    setLedger([]);
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
      url = `${root}/dept/department-ledger/${id}?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/dept/department-ledger/${id}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      const output = response.data.data || [];

      if (!Array.isArray(output) || output.length === 0) {
        setFailedSearch(true);
        setLedger([]);
      } else {
        setLedger(output);
        setFailedSearch(false);
      }

      if (response.data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = response.data.pagination.nextPage;
          if (!prev.includes(newUrl)) {
            if (!pageUrl || currentPageIndex >= prev.length - 1) {
              return pageUrl && currentPageIndex >= prev.length - 1
                ? [...prev, newUrl]
                : [newUrl];
            }
            return prev;
          }
          return prev;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching ledger:", error);
      setLoading(false);
      showToast({
        message: "Failed to fetch ledger data",
        type: "error",
      });
      setFailedSearch(error.response?.status === 404);
    }
  };

  // Function to get products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  // Function to get customers
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
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomerData(response.data.customers || []);
    } catch (error) {
      showToast({
        message: error.message || "An error occurred while fetching customers",
        type: "error",
        duration: 6500,
        style: { padding: "30px" },
      });
    }
  };

  // Handle clear date range
  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    getDeptLedger();
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      getDeptLedger(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      getDeptLedger(null, null, paginationUrls[currentPageIndex]);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      getDeptLedger(null, null, paginationUrls[prevIndex]);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchProducts();
    getDeptLedger();
  }, []);

  // Modal for crediting customer
  const CreditDeptModal = () => {
    const [productId, setProductId] = useState("");
    const [transactionType, setTransactionType] = useState("credit");
    const [customerName, setCustomerName] = useState("");
    const [comments, setComments] = useState("");
    const [creditAmount, setCreditAmount] = useState("");
    const [itemName, setItemName] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [selectedField, setSelectedField] = useState("product");

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setCreditAmount(value);
      } else {
        setCreditAmount("");
      }
    };

    const handleItemNameChange = (e) => {
      setItemName(e.target.value);
    };
    const handleComment = (e) => {
      setComments(e.target.value);
    };

    const handleFieldToggle = (field) => {
      setSelectedField(field);
      if (field === "product") {
        setItemName("");
      } else {
        setProductId("");
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
      if (!customerName) {
        showToast({
          message: "Enter a customer name first",
          type: "error",
        });
        return;
      }
      if (!itemName) {
        showToast({
          message: "Enter an item name",
          type: "error",
        });
        return;
      }
      if (!creditAmount) {
        showToast({
          message: "Enter an amount",
          type: "error",
        });
        return;
      }
      setButtonLoading(true);
      const body = {
        departmentId: id,
        name: customerName,
        [transactionType]: creditAmount,
        comments: comments,
        productName: itemName,
      };

      try {
        const response = await axios.post(
          `${root}/customer/create-deptledger`,
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
        getDeptLedger(
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

    return (
      <Modal
        open={creditCustomerModalOpen}
        title="Record Book Details"
        footer={null}
        onCancel={() => {
          setCreditCustomerModalOpen(false);
          setCustomerName("");
          setComments("");
          setProductId("");
          setItemName("");
          setSelectedField("product");
        }}
      >
        <form action="" onSubmit={handleCreditSubmit}>
          <div className="mt-4">
            <label htmlFor="customer-select" className="font-bold">
              Customer Name
            </label>
            <TextField.Root
              id="customer-name"
              placeholder="Enter Customer Name"
              className="p-3"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
              }}
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label htmlFor="item-name" className="font-bold">
                Item Name
              </label>
            </div>
            <TextField.Root
              id="item-name"
              placeholder="Enter Item Name"
              className="p-3"
              value={itemName}
              onChange={handleItemNameChange}
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
            <label htmlFor="comment" className="font-bold mt-4">
              Comment
            </label>
            <TextField.Root
              id="comment"
              placeholder="Optional Comment"
              className="p-3"
              value={comments}
              onChange={handleComment}
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

  return (
    <>
      <div className="">
        {/* <div className="sticky top-0 z-[1001] bg-[#f9fafb] p-2"> */}
        
      <Flex justify="between" align="center" className="mb-4 top-0 left-0">
        <div>
          <Heading>{ledgerName}</Heading>
          <p className="text-sm opacity-40">Department Ledger</p>
          {decodeToken().isAdmin && ledger.length > 0 && (
            <Button
              className="cursor-pointer mt-2"
              onClick={() => {
                setCreditCustomerModalOpen(true);
              }}
            >
              Credit Ledger
            </Button>
          )}
        </div>
        <Flex gap="4">
          <div className="date-picker">
            <RangePicker
              value={dateRange}
              onCalendarChange={(dates) => {
                setDateRange(dates);
                if (dates && dates[0] && dates[1]) {
                  setPaginationUrls([]);
                  setCurrentPageIndex(0);
                  getDeptLedger(
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
      </Flex>
      
    </div>

      {/* Table for ledger details */}
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNITS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="10">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : ledger.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="10" className="p-4">
                {failedSearch ? "No records found." : "No data available."}
              </Table.Cell>
            </Table.Row>
          ) : (
            ledger.map((item) => (
              <Table.Row key={item.id || item.createdAt + item.name}>
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.comments}</Table.Cell>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{formatMoney(item.unitPrice)}</Table.Cell>
                <Table.Cell className="text-green-500 font-bold">
                  {formatMoney(item.credit > item.debit ? item.credit : "")}
                </Table.Cell>
                <Table.Cell className="text-red-500 font-bold">
                  {formatMoney(item.debit > item.credit ? item.debit : "")}
                </Table.Cell>
                <Table.Cell>{formatMoney(item.balance)}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
<div className="pagination-fixed">

      {paginationUrls.length > 0 && (
        <Flex justify="end" className="mt-4">
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
</div>

      <CreditDeptModal />
      <Toaster position="top-right" />
    </>
  );
};

export default IndividualDepartmentLedger;
