import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UpdateURL from "../ChangeRoute";
import {
  Select,
  Separator,
  Grid,
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
  const [bankName, setBankName] = useState("");

  const [isCustomer, setIsCustomer] = React.useState(true);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "");
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue);
    }
  };

  const fetchCustomers = async () => {
    setCustomers([]);
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
    setProducts([]);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(
        `${root}/admin/${isCustomer ? "get-products" : "get-raw-materials"}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
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
      bankName: bankName,
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

      // Clear the form fields upon successful submission
      setSelectedCustomerId("");
      setSelectedProductId("");
      setBasePrice("");
      setBankName("");
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }

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
              onValueChange={setSelectedCustomerId}
              disabled={customers.length === 0}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder={`Select ${isCustomer ? "Customer" : "Supplier"}`}
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
              disabled={products.length === 0}
              onValueChange={setSelectedProductId}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder={`Select ${
                  isCustomer ? "Product" : "Raw Material"
                }`}
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

        <Grid columns={"2"} gap={"5"}>
          <div className="w-full">
            <Text>Enter Amount</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Enter Amount in Naira (₦)"
              value={formatNumber(basePrice)}
              onChange={handleBasePriceChange}
            />
          </div>
          <div className="w-full">
            <Text>Bank Name</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Enter Bank Name"
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
              }}
            />
          </div>
        </Grid>

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
