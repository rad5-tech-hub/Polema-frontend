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

  const [failedSearch, setFailedSearch] = useState(false);
  const [customer, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const searchInputRef = useRef(null);

  // Fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch products
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
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch customer ledger
  const getCustomerLedger = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(
        `${root}/customer/get-customer-ledger/${id}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      setEntries(data.ledgerEntries);
    } catch (error) {
      setFailedSearch(true);
      console.error("Error fetching customer ledger:", error);
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

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    const filtered = customer.filter(({ firstname, lastname }) =>
      `${firstname} ${lastname}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
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
      <Flex justify="between" align="center">
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
        </div>

        <div className="w-[70%]">
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
        </div>
      </Flex>

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
          {!entries.length ? (
            <div className="p-4">
              {failedSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            entries.map((entry, index) => (
              <Table.Row
                key={index}
                className="cursor-pointer hover:bg-gray-300/10"
                onClick={() => handleModal(entry.tranxId)}
              >
                <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                <Table.Cell>{getProductByID(entry.productId)}</Table.Cell>
                <Table.Cell>{entry.quantity}</Table.Cell>
                <Table.Cell>{entry.unit}</Table.Cell>
                <Table.Cell className="text-green-500 font-bold">
                  {formatMoney(entry.credit > entry.debit ? entry.credit : " ")}
                </Table.Cell>
                <Table.Cell className="text-red-500 font-bold">
                  {formatMoney(entry.debit > entry.credit ? entry.debit : " ")}
                </Table.Cell>
                <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <DocumentsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        customerId={transactionId}
        customerName={`${getCustomerByID(id).firstname} ${
          getCustomerByID(id).lastname
        }`}
      />
      <Toaster />
    </>
  );
};

export default IndividualCustomerLedger;
