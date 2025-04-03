import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  Flex,
  Text,
  TextField,
  Button,
  Grid,
} from "@radix-ui/themes";
import toast, { Toaster, LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { Input, Select } from "antd"; // Import Ant Design Select

const { Option } = Select;

const root = import.meta.env.VITE_ROOT;

const SupplierPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [subCharge, setSubCharge] = useState("");

  // Format number with commas
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle base price change
  const handleBasePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      setBasePrice(value);
    }
  };

  // Handle sub charge change
  const handleSubChargeChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      setSubCharge(value);
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

  // Update selected unit and base price when product changes
  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = products.find(
        (product) => product.id === selectedProductId
      );
      if (selectedProduct) {
        setSelectedUnit(selectedProduct);
        setBasePrice(selectedProduct.price[0].amount.toString());
      }
    }
  }, [selectedProductId, products]);

  // Handle form submission
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
      price: basePrice.replace(/,/g, ""),
      ...(comment && { comments: comment }),
      ...(subCharge && { discount: subCharge.replace(/,/g, "") }),
      unit: selectedUnit?.price[0]?.unit || "",
    };

    try {
      await axios.post(`${root}/customer/raise-supplier-order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!", {
        style: {
          padding: "20px",
        },
        duration: 5000,
      });
      setBasePrice("");
      setSelectedCustomerId("");
      setSelectedProductId("");
      setQuantity("");
      setComment("");
      setSubCharge("");
      setSelectedUnit(null);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "Failed to place order. Please check your inputs and try again."
      );
    } finally {
      setButtonLoading(false);
    }
  };

  // Fetch customers and products on component mount
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  return (
    <>
      <Heading>Received Order</Heading>
      <Separator className="my-3 w-full" />
      <form onSubmit={handleSubmit}>
        <Grid columns="2" gap={"4"} className="w-full">
          {/* Supplier Select with Ant Design Search */}
          <div className="w-full">
            <Text>Supplier Name</Text>
            <Select
              showSearch
              placeholder="Select Supplier"
              optionFilterProp="children"
              onChange={(value) => setSelectedCustomerId(value)}
              value={selectedCustomerId || undefined}
              className="w-full mt-2"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={customers.length === 0}
              required
            >
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.firstname} {customer.lastname}
                </Option>
              ))}
            </Select>
          </div>

          {/* Product Select with Ant Design Search */}
          <div className="w-full">
            <Text>Raw Material</Text>
            <Select
              showSearch
              placeholder="Select Raw Material"
              optionFilterProp="children"
              onChange={(value) => setSelectedProductId(value)}
              value={selectedProductId || undefined}
              className="w-full mt-2"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={products.length === 0}
              required
            >
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-full">
            <Text>Quantity</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Input Quantity"
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="w-full">
            <Text>Product Unit</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Unit"
              value={selectedUnit?.price[0]?.unit || ""}
              disabled
            />
          </div>

          <div className="w-full">
            <Text>Base Price (₦)</Text>
            <Input
              addonBefore="₦"
              value={formatNumber(basePrice)}
              onChange={handleBasePriceChange}
              className="mt-2"
              placeholder="Enter Price"
            />
          </div>

          <div className="w-full">
            <Text>Sub Charge</Text>
            <Input
              addonBefore="₦"
              className="mt-2"
              value={formatNumber(subCharge)} // Add comma formatting
              onChange={handleSubChargeChange}
              placeholder="Enter Supplier Subcharge"
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
        </Grid>

        {/* Submit Button */}
        <Flex justify="end" gap="5">
          <Button
            size="3"
            className="!bg-theme cursor-pointer mt-4"
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              "Submit Order"
            )}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default SupplierPlaceOrder;
