import React, { useEffect, useState } from "react";
import { refractor } from "../../../date";
import {
  Spinner,
  Heading,
  Separator,
  Table,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;

const ViewCustomerOrders = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [product, setProducts] = useState([]);

  // Function to fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      {
        response.data.customers.length === 0
          ? setCustomerData([])
          : setCustomerData(response.data.customers);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      {
        error.message
          ? toast.error(error.message, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            })
          : toast.error("An Error Occured", {
              duration: 6500,
              style: {
                padding: "30px",
              },
            });
      }
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

  // Function to fetch orders details
  const fetchOrders = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setStore(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get matching products by id
  const getMatchingProductByID = (id) => {
    const products = product.find((item) => item.id === id);
    return products ? products.name : "Product Not Found";
  };

  // Function to get matching customer by id
  const getMatchingCustomerById = (id) => {
    const customers = customerData.find((item) => item.id === id);
    return customers ? customers : "Customer Not Found";
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <>
      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      {/* Table to view orders details */}
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {store.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            store.map((item, index) => (
              <Table.Row key={item.id} className="relative">
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {getMatchingCustomerById(item.customerId).firstname}{" "}
                  {getMatchingCustomerById(item.customerId).lastname}
                </Table.Cell>
                <Table.Cell>
                  {getMatchingProductByID(item.productId)}
                </Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <div className="absolute right-[3px] mt-1">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="soft">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => {
                          navigate(
                            `/admin/customers/customer-ledger/${
                              getMatchingCustomerById(item.customerId).id
                            }`
                          );
                        }}
                      >
                        View Ledger
                      </DropdownMenu.Item>
                      <DropdownMenu.Item>View Authority</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default ViewCustomerOrders;
