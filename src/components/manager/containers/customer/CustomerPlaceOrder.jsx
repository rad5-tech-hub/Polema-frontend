import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  Flex,
  Select,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const CustomerPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

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
      console.log(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("form Submitted");
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);
  return (
    <>
      <Heading>Place Order</Heading>
      <Separator className="my-3 w-full" />
      <form action="" onSubmit={handleSubmit}>
        <Flex className="w-full mb-4" gap={"5"}>
          <div className="w-full">
            <Text className="mb-4">Customer Name</Text>
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
            <Text className="mb-4">Product</Text>
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

        <Flex className="w-full mb-4" gap={"5"}>
          <div className="w-full">
            <Text className="mb-4"> Quantity</Text>
            <TextField.Root className="mt-2 " placeholder="Input Quantity" />
          </div>
          <div className="w-full">
            <Text className="mb-4">Product Unit </Text>
            <TextField.Root className="mt-2 " placeholder="Enter Unit" />
          </div>
        </Flex>
        <Flex className="w-full mb-4" gap={"5"}>
          <div className="w-full">
            <Text className="mb-4">Price Discount (Optional)</Text>
            <Select.Root
              value={selectedProductId}
              onValueChange={setSelectedProductId} // Update selected product ID
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Plan"
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
          <div className="w-full">
            <Text className="mb-4"> Enter Price</Text>
            <TextField.Root
              className="mt-2  "
              placeholder="Enter Price in Naira(₦)"
              value={formatNumber(basePrice)} // Display formatted number
              onChange={handleBasePriceChange}
            />
          </div>
        </Flex>
        <Flex className="w-full mb-4" gap={"5"} justify={"end"}>
          <Button size={"3"} type="submit">
            Add
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default CustomerPlaceOrder;
