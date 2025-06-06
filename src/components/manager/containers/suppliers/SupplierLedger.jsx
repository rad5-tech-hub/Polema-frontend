import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { faSearch, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { refractor, formatMoney } from "../../../date";
import { useParams } from "react-router-dom";
import {
  Heading,
  Table,
  Skeleton,
  Spinner,
  Flex,
  TextField,
  Button,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { Modal, Select, DatePicker } from "antd";
import useToast from "../../../../hooks/useToast";
import { jwtDecode } from "jwt-decode";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

const SupplierLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [emptyLedger, setEmptyLedger] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      const suppliersData = response.data.customers || [];
      setSuppliers(suppliersData);
      setFilteredSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      showToast({
        message: "Failed to fetch suppliers",
        type: "error",
      });
    }
  };

  // Function to match user details with id
  const getSupplierDetailsByID = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return (
      supplier || {
        firstname: "Name",
        lastname: "Not Found",
        supplierTag: "N/A",
      }
    );
  };

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    const filtered = suppliers.filter((supplier) =>
      `${supplier.firstname} ${supplier.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  // Function to highlight matching text
  const highlightText = (fullText, searchTerm) => {
    if (!searchTerm) return fullText;
    const parts = fullText.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Fetch ledger details
  const fetchLedger = async (
    startDate = null,
    endDate = null,
    pageUrl = null
  ) => {
    setLoading(true);
    setLedger([]);
    setEmptyLedger(false);
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
      url = `${root}/customer/get-supplier-ledger/${id}?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/customer/get-supplier-ledger/${id}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      const result = response.data.data || [];
      if (result.length === 0) {
        setEmptyLedger(true);
        setLedger([]);
      } else {
        setLedger(result);
        setEmptyLedger(false);
      }

      if (response.data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = response.data.pagination.nextPage;
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
      console.error("Error fetching ledger:", error);
      showToast({
        message: "Failed to fetch supplier ledger",
        type: "error",
      });
      setEmptyLedger(true);
      setLoading(false);
    }
  };

  // Fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRawMaterials(response.data.products || []);
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      showToast({
        message: "Failed to fetch raw materials",
        type: "error",
      });
    }
  };

  // Function to get product details by their id
  const fetchProductByID = (id) => {
    const material = rawMaterials.find((item) => item.id === id);
    return material || { name: "Raw Material not found" };
  };

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode(token);
  };

  // Handle clear date range
  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    fetchLedger();
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchLedger(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchLedger(null, null, paginationUrls[currentPageIndex]);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchLedger(null, null, paginationUrls[prevIndex]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchRaw();
    if (id) {
      fetchLedger();
    }
  }, [id]);

  const CreditSupplierModal = () => {
    const [productId, setProductId] = useState("");
    const [transactionType, setTransactionType] = useState("credit");
    const [amount, setAmount] = useState("");
    const [comments, setComments] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setAmount(value);
      } else {
        setAmount("");
      }
    };

    const handleSubmit = async (e) => {
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
          message: "Select a raw material first",
          type: "error",
        });
        return;
      }
      if (!amount || Number(amount) <= 0) {
        showToast({
          message: "Please enter a valid amount",
          type: "error",
        });
        return;
      }
      setButtonLoading(true);
      const body = {
        supplierId: id,
        productId,
        [transactionType]: amount,
        comments,
      };
      try {
        await axios.post(`${root}/customer/create-supplier-ledger`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast({
          message: "Supplier Ledger Updated Successfully",
          type: "success",
          duration: 5000,
        });
        setProductId("");
        setAmount("");
        setComments("");
        setTransactionType("credit");
        setIsModalOpen(false);
        fetchLedger(
          dateRange?.[0]?.format("YYYY-MM-DD"),
          dateRange?.[1]?.format("YYYY-MM-DD")
        );
      } catch (err) {
        showToast({
          type: "error",
          message:
            err.response?.data?.message ||
            "An error occurred while updating supplier ledger",
        });
      } finally {
        setButtonLoading(false);
      }
    };

    const filterProductOption = (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
      <Modal
        open={isModalOpen}
        title="Record Supplier Transaction"
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setProductId("");
          setAmount("");
          setComments("");
          setTransactionType("credit");
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="product-select" className="font-bold">
              Raw Material
            </label>
            <Select
              id="product-select"
              showSearch
              placeholder="Search for a raw material"
              optionFilterProp="children"
              onChange={(value) => setProductId(value)}
              value={productId || undefined}
              filterOption={filterProductOption}
              options={rawMaterials.map((material) => ({
                value: material.id,
                label: material.name,
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
              value={amount ? formatMoney(amount) : ""}
              onChange={handlePriceChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="comments" className="font-bold mt-4">
              Comments
            </label>
            <TextField.Root
              id="comments"
              placeholder="Enter Comment"
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
            {buttonLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </Modal>
    );
  };

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <div className="w-full">
          {suppliers.length === 0 ? (
            <Skeleton className="p-4 w-[150px]" />
          ) : (
            <Heading className="font-amsterdam">{`${
              getSupplierDetailsByID(id).firstname
            } ${getSupplierDetailsByID(id).lastname}`}</Heading>
          )}
          {suppliers.length === 0 ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : (
            <p className="text-sm opacity-65">
              {getSupplierDetailsByID(id).supplierTag || "Supplier"}
            </p>
          )}
          {decodeToken()?.isAdmin && (
            <Button
              className="mt-4 bg-green-600 text-white cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Credit Supplier
            </Button>
          )}
        </div>
        <div className="w-[70%]">
          <Flex gap="3" align="center">
            <div className="relative w-full max-w-md">
              <TextField.Root
                placeholder="Enter Supplier Name"
                size="3"
                className="mx-auto"
                disabled={suppliers.length === 0}
                value={searchInput}
                onChange={handleSearchInput}
              >
                <TextField.Slot>
                  <FontAwesomeIcon icon={faSearch} />
                </TextField.Slot>
              </TextField.Root>
              {searchInput && filteredSuppliers.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                  {filteredSuppliers.map((supplier) => (
                    <li
                      key={supplier.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchInput(
                          `${supplier.firstname} ${supplier.lastname}`
                        );
                        setFilteredSuppliers([]);
                        navigate(
                          `/admin/supplier/supplier-ledger/${supplier.id}`
                        );
                      }}
                    >
                      {highlightText(
                        `${supplier.firstname} ${supplier.lastname}`,
                        searchInput
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {searchInput && filteredSuppliers.length === 0 && (
                <p className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full p-2 text-gray-500">
                  No results found
                </p>
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
                    fetchLedger(
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

      <Table.Root className="mt-4" variant="surface">
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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="9">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : ledger.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="9" className="p-4 text-center">
                {emptyLedger ? "No records found" : "No data available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            ledger.map((entry) => (
              <Table.Row key={entry.id || entry.createdAt + entry.productId}>
                <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                <Table.Cell>
                  {fetchProductByID(entry.productId).name}
                </Table.Cell>
                <Table.Cell>{entry.unit}</Table.Cell>
                <Table.Cell>{entry.quantity}</Table.Cell>
                <Table.Cell>
                  {entry.unitPrice ? formatMoney(entry.unitPrice) : ""}
                </Table.Cell>
                <Table.Cell>
                  {entry.comments !== null ? entry.comments : ""}
                </Table.Cell>
                <Table.Cell className="text-green-500">
                  {formatMoney(entry.credit > entry.debit ? entry.credit : "")}
                </Table.Cell>
                <Table.Cell className="text-red-500">
                  {formatMoney(entry.debit > entry.credit ? entry.debit : "")}
                </Table.Cell>
                <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
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

      <CreditSupplierModal />
    </>
  );
};

export default SupplierLedger;
