import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UpdateURL from "../ChangeRoute";
import {
  Select,
  Separator,
  DropdownMenu,
  Text,
  Flex,
  TextField,
  Button,
  Spinner,
  Heading,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const AccountBook = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [isCustomer, setIsCustomer] = React.useState(true);

  // Function to format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle base price input change
  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, ""); // Remove commas from the input value
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue); // Update state with raw number (without commas)
    }
  };

  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/${isCustomer ? "get-customers" : "get-suppliers"}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setCustomers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const submissionData = {
      [isCustomer ? "customerId" : "supplierId"]: selectedCustomerId,
      productId: selectedProductId,
      amount: basePrice,
    };

    try {
      const response = await axios.post(
        `${root}/customer/create-account`,
        submissionData,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      console.log(response);
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }

    // Reset loading after submitting
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, [isCustomer]);

  return (
    <>
      <Flex justify={"between"}>
        <Heading className="mb-4">Add</Heading>
        <Select.Root
          defaultValue="customers"
          onValueChange={(value) => {
            value === "customers" ? setIsCustomer(true) : setIsCustomer(false);
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="customers">Customers</Select.Item>
            <Select.Item value="suppliers">Suppliers</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="my-3 w-full" />
      <form onSubmit={handleSubmit}>
        <Flex className="w-full mb-4" gap={"5"}>
          <div className="w-full">
            <Text className="mb-4">
              {isCustomer ? "Customer" : "Supplier"} Name
            </Text>
            <Select.Root
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId} // Update selected customer ID
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Customer"
              />
              <Select.Content position="popper">
                {customers.map((customer) => (
                  <Select.Item key={customer.id} value={customer.id}>
                    {customer.firstname} {customer.lastname}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className="w-full">
            <Text className="mb-4">
              {isCustomer ? "Product" : "Raw Material"}
            </Text>
            <Select.Root
              value={selectedProductId}
              onValueChange={setSelectedProductId} // Update selected product ID
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Product"
              />
              <Select.Content position="popper">
                {products.map((product) => (
                  <Select.Item key={product.id} value={product.id}>
                    {product.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>

        <div>
          <Text>Enter Amount</Text>
          <TextField.Root
            className="mt-2 w-[50%]"
            placeholder="Enter Amount in Naira (₦)"
            value={formatNumber(basePrice)} // Display formatted number
            onChange={handleBasePriceChange}
          />
        </div>

        <Flex justify={"end"} className="mt-4 cursor-pointer">
          <Button className="cursor-pointer" type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </Flex>
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default AccountBook;
