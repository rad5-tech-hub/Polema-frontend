import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  Flex,
  Select,
  Text,
  TextField,
  Button,
  Spinner,
} from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const SupplierPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
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
      const response = await axios.get(`${root}/customer/get-suppliers`, {
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
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Update selectedUnit when selectedProductId changes
  useEffect(() => {
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId
    );
    setSelectedUnit(selectedProduct ? selectedProduct.price[0].unit : ""); // Set the unit of the selected product
  }, [selectedProductId, products]);

  // Function for submitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    const body = {
      supplierId: selectedCustomerId,
      productId: selectedProductId,
      quantity,
      price: basePrice,
      comments: comment,
      unit: selectedUnit,
    };

    try {
      const response = await axios.post(
        `${root}/customer/raise-supplier-order`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setButtonLoading(false);
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      toast.error(
        "An error occurred, check your form details and try again later.",
        {
          style: {
            padding: "20px",
          },
          duration: 4500,
        }
      );
    }
    console.log(body);
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
            <Text className="mb-4">Supplier Name</Text>
            <Select.Root
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId} // Update selected customer ID
            >
              <Select.Trigger
                disabled={customers.length === 0}
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
                disabled={products.length === 0}
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
            <TextField.Root
              className="mt-2 "
              placeholder="Input Quantity"
              type="number"
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
              placeholder="Enter Unit"
              value={selectedUnit} // Set value to selected unit
              disabled
            />
          </div>
        </Flex>
        <Flex className="w-full mb-4" gap={"5"}>
          <div className="w-full">
            <Text className="mb-4"> Enter Price</Text>
            <TextField.Root
              className="mt-2  "
              placeholder="Enter Price in Naira(₦)"
              value={formatNumber(basePrice)} // Display formatted number
              onChange={handleBasePriceChange}
            />
          </div>
          <div className="w-full">
            <Text className="mb-4"> Comment or Specification</Text>
            <TextField.Root
              className="mt-2 "
              placeholder="Enter Comment or Description"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
        </Flex>
        <Flex className="w-full mb-4" gap={"5"} justify={"end"}>
          <Button
            size={"3"}
            className="!bg-theme cursor-pointer"
            disabled={buttonLoading}
          >
            {buttonLoading ? <Spinner /> : "Add"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default SupplierPlaceOrder;
