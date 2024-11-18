import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  Flex,
  Spinner,
  Select,
  Text,
  TextField,
  Button,
  Grid,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";

const CustomerPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [seletedProductPlan, setSelectedProductPlan] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

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

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

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
    const body = {
      customerId: selectedCustomerId,
      productId: selectedProductId,
      quantity: quantity,
      unit: getMatchingUnitFromId(selectedProductId).price[0].unit,
    };

    try {
      const response = await axios.post(
        `${root}/customer/raise-customer-order`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setButtonLoading(false);
      toast.success(response.data.message, {
        style: {
          padding: "30px",
        },
        duration: 4000,
      });

      // Reset form fields
      setSelectedCustomerId("");
      setSelectedProductId("");
      setSelectedProductPlan([]);
      setQuantity("");
      setBasePrice("");
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      toast.error("An error occured,try again", {
        style: {
          padding: "30px",
        },
        duration: 5000,
      });
    }
  };

  // Get Matching unit from product Id
  const getMatchingUnitFromId = (id) => {
    const product = products.find((product) => product.id === id);
    return product ? product : "No matching unit";
  };

  // GEt matching product plans form product id
  const getMatchingPlansFromId = (id) => {
    const product = products.find((product) => product.id === id);
    Array.isArray(product.pricePlan)
      ? setSelectedProductPlan(product.pricePlan)
      : setSelectedProductPlan([]);
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
            <Text className="mb-4">
              Customer Name <span className="text-red-500">*</span>{" "}
            </Text>
            <Select.Root
              required
              disabled={customers.length === 0}
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId}
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
              Product<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              required
              disabled={products.length === 0}
              value={selectedProductId}
              onValueChange={(value) => {
                setSelectedProductId(value);
                getMatchingPlansFromId(value);
              }}
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
            <Text className="mb-4">
              {" "}
              Quantity<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              className="mt-2 "
              required
              placeholder="Input Quantity"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Text className="mb-4">Product Unit </Text>
            <TextField.Root
              className="mt-2 "
              disabled
              value={
                selectedProductId.length == 0
                  ? ""
                  : getMatchingUnitFromId(selectedProductId).price[0].unit
              }
              placeholder="Select Product First"
            />
          </div>
        </Flex>
        <Grid className="w-full mb-4" columns={"2"} gap={"4"}>
          <div className="w-full">
            <Text className="mb-4">Price Discount (Optional)</Text>
            <Select.Root disabled={seletedProductPlan.length === 0}>
              <Select.Trigger
                className="mt-2 w-full"
                placeholder={
                  seletedProductPlan.length === 0
                    ? "Product Selected has no discount"
                    : "Select plan"
                }
              />
              <Select.Content>
                {seletedProductPlan.map((plan) => {
                  return (
                    <Select.Item value={plan.category}>
                      {plan.category}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text className="mb-4"> Product Price</Text>
            <TextField.Root
              className="mt-2  "
              placeholder="Select Product First"
              disabled
              value={
                selectedProductId.length == 0
                  ? ""
                  : getMatchingUnitFromId(selectedProductId).price[0].amount
              }
            />
          </div>
        </Grid>
        <Flex className="w-full mb-4" gap={"5"} justify={"end"}>
          <Button size={"3"} type="submit" disabled={buttonLoading}>
            {buttonLoading ? <Spinner /> : "Add"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CustomerPlaceOrder;
