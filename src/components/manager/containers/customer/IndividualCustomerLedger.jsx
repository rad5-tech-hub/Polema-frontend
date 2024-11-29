import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const IndividualCustomerLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management for api requests
  const [failedSearch, setFailedSearch] = useState(false);
  const [customer, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // State for search
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Ref to handle clicking outside the search input (for closing dropdown)
  const searchInputRef = useRef(null);

  // Function to fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get customer ledger
  const getCustomerLedger = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-customer-ledger/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setEntries(response.data.ledgerEntries);
    } catch (error) {
      setFailedSearch(true);
    }
  };

  // Function to get customer name through ID
  const getCustomerByID = (id) => {
    const userCustomer = customer.find((item) => item.id === id);

    return userCustomer ? userCustomer : "Name not Found";
  };

  // Function to get product name by ID
  const getProductbyID = (id) => {
    const product = products.find((item) => item.id === id);
    return product ? product.name : "Product not Found";
  };

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter customers based on first name and last name
    const filtered = customer.filter((customer) =>
      `${customer.firstname} ${customer.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
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

  // Handle modal opening
  const handleModal = (tranxId) => {
    if (tranxId === null) return;
    setModalOpen(true);
    setTransactionId(tranxId);
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setFilteredCustomers([]); // Clear search results when clicking outside
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();

    if (id) {
      getCustomerLedger();
    }
  }, [id]);

  return (
    <>
      <Flex justify={"between"} align={"center"}>
        <div className="w-full">
          {customer.length === 0 ? (
            <Skeleton className="p-4 w-[150px]" />
          ) : (
            <Heading className="font-amsterdam">{`${
              getCustomerByID(id).firstname
            } ${getCustomerByID(id).lastname}`}</Heading>
          )}

          {customer.length === 0 ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : (
            <p className="text-sm opacity-65">
              {getCustomerByID(id).customerTag}
            </p>
          )}
        </div>

        <div className="w-[70%]">
          {/* Search Input from CustomerLedger */}
          <div className="relative w-full max-w-md" ref={searchInputRef}>
            <TextField.Root
              placeholder="Enter Customer Name"
              size={"3"}
              className=" mx-auto"
              value={searchInput}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root>

            {/* Dropdown for search results */}
            {searchInput && filteredCustomers.length > 0 && (
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
                    {highlightText(
                      `${customer.firstname} ${customer.lastname}`,
                      searchInput
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {searchInput && filteredCustomers.length === 0 && (
              <p className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full p-2 text-gray-500">
                No results found
              </p>
            )}
          </div>
        </div>
      </Flex>

      {/* Table for customer ledger details */}
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entries.length === 0 ? (
            <div className="p-4">
              {failedSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            entries.map((entry, index) => {
              return (
                <Table.Row
                  key={index}
                  className="cursor-pointer hover:bg-gray-300/10"
                  onClick={() => {
                    handleModal(entry.tranxId);
                  }}
                >
                  <Table.Cell>{refractor(entry.date)}</Table.Cell>
                  <Table.Cell>{getProductbyID(entry.productId)}</Table.Cell>
                  <Table.Cell>{entry.quantity}</Table.Cell>
                  <Table.Cell>{entry.unit}</Table.Cell>
                  <Table.Cell className="text-green-500 font-bold">
                    {formatMoney(
                      entry.credit > entry.debit ? entry.credit : " "
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-red-500 font-bold">
                    {formatMoney(
                      entry.debit > entry.credit ? entry.debit : " "
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>

      {/* Modal */}
      <DocumentsModal
        open={isModalOpen}
        setOpen={setModalOpen}
        transactionId={transactionId}
      />

      <Toaster />
    </>
  );
};

export default IndividualCustomerLedger;
