import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React, { useSyncExternalStore, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
} from "@radix-ui/themes";
import axios from "axios";
import { Modal, Select } from "antd";
import useToast from "../../../../hooks/useToast";
import {jwtDecode} from "jwt-decode"

const root = import.meta.env.VITE_ROOT;

const SupplierLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = React.useState([]);
  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [ledger, setLedger] = React.useState([]);
  const [emptyLedger, setEmptyLedger] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredSuppliers, setFilteredSuppliers] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showToast = useToast();

  // New states for modal form
  const [selectedProductId, setSelectedProductId] = React.useState("");
  const [credit, setCredit] = React.useState("");
  const [debit, setDebit] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuppliers(response.data.customers);
      setFilteredSuppliers(response.data.customers); // Set filtered suppliers initially
    } catch (error) {
      console.log(error);
    }
  };

  // Function to match user details with id
  const getSupplierDetailsByID = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier : "Supplier Not Found";
  };

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter suppliers based on firstname and lastname
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
  const fetchLedger = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-supplier-ledger/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      response.data.ledgerEntries.length === 0
        ? setEmptyLedger(true)
        : setLedger(response.data.ledgerEntries);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRawMaterials(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get product details by their id
  const fetchProductByID = (id) => {
    const material = rawMaterials.find((item) => item.id === id);
    return material ? material : "Raw Material not found";
  };

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
      return jwtDecode(token);
    };

  React.useEffect(() => {
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
    const [buttonLoading, setButtonLoading] = useState(false);

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setAmount(Number(value));
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
          type: "error",
          message: "Please enter a valid amount",
        });
        return;
      }
      setButtonLoading(true);

      const body = {
        supplierId: id,
        productId,
        [transactionType]: amount,
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
        setTransactionType("credit");
        setIsModalOpen(false);
        fetchLedger();
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
              value={amount ? amount.toLocaleString() : ""}
              onChange={handlePriceChange}
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
      <Flex justify={"between"}>
        <div className="w-full">
          {suppliers.length === 0 ? (
            <Skeleton className="p-4 w-[150px] " />
          ) : (
            <Heading className="font-amsterdam">{`${
              getSupplierDetailsByID(id).firstname
            } ${getSupplierDetailsByID(id).lastname}`}</Heading>
          )}
          {suppliers.length === 0 ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : getSupplierDetailsByID(id).supplierTag ? (
            <p>{`${getSupplierDetailsByID(id).supplierTag} `}</p>
          ) : (
            "Supplier"
          )}
        </div>
        <div className="w-[70%]">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <TextField.Root
              placeholder="Enter Supplier Name"
              size={"3"}
              className="t mx-auto"
              disabled={suppliers.length === 0}
              value={searchInput}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root>

            {/* Dropdown for search results */}
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

            {/* No results */}
            {searchInput && filteredSuppliers.length === 0 && (
              <p className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full p-2 text-gray-500">
                No results found
              </p>
            )}
          </div>
        </div>
      </Flex>
      {decodeToken().isAdmin && (
        <Flex justify="start" className="mt-4">
          <Button
            className="bg-green-600 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Credit Supplier
          </Button>
        </Flex>
      )}

      {/* Table to show supplier ledger details */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-green-500">
            CREDIT(₦)
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-red-500">
            DEBIT(₦)
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              {emptyLedger ? "No records found" : <Spinner />}
            </div>
          ) : (
            ledger.map((entry) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {fetchProductByID(entry.productId).name}
                  </Table.Cell>
                  <Table.Cell>{entry.unit}</Table.Cell>
                  <Table.Cell>{entry.quantity}</Table.Cell>
                  <Table.Cell>
                    {entry.unitPrice ? formatMoney(entry.unitPrice) : ""}
                  </Table.Cell>
                  <Table.Cell className="text-green-500">
                    {formatMoney(
                      entry.credit > entry.debit ? entry.credit : ""
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-red-500">
                    {formatMoney(entry.debit > entry.credit ? entry.debit : "")}
                  </Table.Cell>
                  <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
      <CreditSupplierModal />
    </>
  );
};

export default SupplierLedger;
