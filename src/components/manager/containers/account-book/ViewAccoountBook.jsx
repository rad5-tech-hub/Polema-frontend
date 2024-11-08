import React, { useEffect, useState } from "react";
import { refractor } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Table, Heading, Select, Flex } from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const ViewAccoountBook = () => {
  const [accountBook, setAccountBook] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerActive, setCustomerActive] = useState(true);

  // Fetch Details of account book
  const fetchAccountBookDetails = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-accountbook`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setAccountBook(response.data.acct);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Fetch Customer details form backend
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

  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
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

      console.log(response.data.products);
      response.data.length === 0
        ? setProducts([])
        : setProducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Matching customers based on their IDs
  const getCustomerNameById = (id) => {
    const customer = customers.find((customer) => customer.id === id);

    return customer ? `${customer.firstname} ${customer.lastname}` : "Unknown";
  };

  const getProductNameById = (id) => {
    const product = products.find((product) => product.id === id);

    return product ? `${product.name}` : "Unknown";
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchAccountBookDetails();
  }, []);

  return (
    <>
      <Flex justify={"between"}>
        <Heading className="mb-4">Account Book</Heading>
        <Select.Root
          defaultValue="customers"
          onValueChange={(value) => {
            value === "customers"
              ? setCustomerActive(true)
              : setCustomerActive(false);
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="customers">Customers</Select.Item>
            <Select.Item value="suppliers"> Suppliers</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {customerActive ? "CUSTOMER" : "SUPPLIER"} NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {customerActive ? "PRODUCT" : "RAW MATERIAL"}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>AMOUNT(₦)</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <div className="p-4">
            <Spinner />
          </div>
        ) : (
          <Table.Body>
            {accountBook.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan="3">No records found</Table.Cell>
              </Table.Row>
            ) : (
              accountBook.map((details) => (
                <Table.Row key={details.id}>
                  <Table.Cell>{refractor(details.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {getCustomerNameById(details.customerId)}
                  </Table.Cell>
                  <Table.Cell>
                    {getProductNameById(details.productId)}
                  </Table.Cell>
                  <Table.Cell>{details.amount}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        )}
      </Table.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default ViewAccoountBook;
