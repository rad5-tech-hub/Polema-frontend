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
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
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

  // Format number with commas
  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleBasePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      setBasePrice(value);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please log in again.");

    try {
      const { data } = await axios.get(`${root}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(data.customers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Error fetching customers. Try again later.");
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please log in again.");

    try {
      const { data } = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Error fetching products. Try again later.");
    }
  };

  // Update selected unit when product changes
  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = products.find(
        (product) => product.id === selectedProductId
      );
      setSelectedUnit(selectedProduct ? selectedProduct : "");
    }
  }, [selectedProductId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.");
      setButtonLoading(false);
      return;
    }

    const orderData = {
      supplierId: selectedCustomerId,
      productId: selectedProductId,
      quantity,
      price: selectedUnit.price[0].amount,
      comments: comment,
      unit: selectedUnit.price[0].unit,
    };

    try {
      await axios.post(`${root}/customer/raise-supplier-order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      setBasePrice("");
      setSelectedCustomerId("");
      setSelectedProductId("");
      setQuantity("");
      setComment("");
      setSelectedUnit("");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "Failed to place order. Please check your inputs and try again."
      );
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  return (
    <>
      <Heading>Place Supplier Order</Heading>
      <Separator className="my-3 w-full" />
      <form onSubmit={handleSubmit}>
        <Flex className="w-full mb-4" gap="5">
          {/* Supplier Select */}
          <div className="w-full">
            <Text>Supplier Name</Text>
            <Select.Root
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId}
            >
              <Select.Trigger
                disabled={customers.length === 0}
                className="w-full mt-2"
                placeholder="Select Supplier"
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

          {/* Product Select */}
          <div className="w-full">
            <Text>Product</Text>
            <Select.Root
              value={selectedProductId}
              onValueChange={setSelectedProductId}
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

        {/* Quantity and Unit */}
        <Flex className="w-full mb-4" gap="5">
          <div className="w-full">
            <Text>Quantity</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Input Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Product Unit</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Unit"
              value={selectedUnit && selectedUnit.price[0].unit}
              disabled
            />
          </div>
        </Flex>

        {/* Base Price and Comments */}
        <Flex className="w-full mb-4" gap="5">
          <div className="w-full">
            <Text>Base Price (₦)</Text>
            <TextField.Root
              disabled
              value={selectedUnit && selectedUnit.price[0].amount}
              className="mt-2"
              placeholder="Enter Price"
            />
          </div>
          <div className="w-full">
            <Text>Comment</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Optional Description"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </Flex>

        {/* Submit Button */}
        <Flex justify="end" gap="5">
          <Button size="3" className="!bg-theme" disabled={buttonLoading}>
            {buttonLoading ? <LoaderIcon /> : "Submit Order"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default SupplierPlaceOrder;
