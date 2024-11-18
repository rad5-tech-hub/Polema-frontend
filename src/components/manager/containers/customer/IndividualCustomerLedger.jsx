import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";
import { useParams } from "react-router-dom";
import { Skeleton, Table, Heading, Spinner } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const IndividualCustomerLedger = () => {
  const { id } = useParams();

  // State management for api requests
  const [failedSearch, setFailedSearch] = useState(false);
  const [customer, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);

  // Fucntion to fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const repsonse = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomers(repsonse.data.customers);
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

  // Function to get customer LEdger
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

  // function to get customer name through ID
  const getCustomerByID = (id) => {
    const userCustomer = customer.find((item) => item.id === id);
    return userCustomer ? userCustomer : "Name not Found";
  };

  //  Function to get product name by ID
  const getProductbyID = (id) => {
    const product = products.find((item) => item.id === id);
    return product ? product.name : "Product not Found";
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchProducts();
    getCustomerLedger();
  }, []);
  return (
    <>
      {customer.length === 0 ? (
        <Skeleton className="p-4 w-[150px] " />
      ) : (
        <Heading className="font-amsterdam">{`${
          getCustomerByID(id).firstname
        } ${getCustomerByID(id).lastname}`}</Heading>
      )}

      {customer.length === 0 ? (
        <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
      ) : (
        <p className="text-sm opacity-65">{getCustomerByID(id).customerTag}</p>
      )}

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
                <Table.Row key={index}>
                  <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                  <Table.Cell>{getProductbyID(entry.productId)}</Table.Cell>
                  <Table.Cell>{entry.quantity}</Table.Cell>
                  <Table.Cell>{entry.unit}</Table.Cell>
                  <Table.Cell className="text-green-500 font-bold">
                    {entry.credit > entry.debit && entry.credit}
                  </Table.Cell>
                  <Table.Cell className="text-red-500 font-bold">
                    {entry.debit > entry.credit && entry.debit}
                  </Table.Cell>
                  <Table.Cell>{entry.balance}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default IndividualCustomerLedger;
