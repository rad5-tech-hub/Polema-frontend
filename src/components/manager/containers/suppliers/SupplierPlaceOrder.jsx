import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Input, Select } from "antd";

const { Option } = Select;
const API_ROOT = import.meta.env.VITE_ROOT;

const SupplierPlaceOrder = () => {
  const { id } = useParams(); // Get ticket ID from URL params
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
  const [ticketLoading, setTicketLoading] = useState(true);

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
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    try {
      const { data } = await axios.get(`${API_ROOT}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Error fetching suppliers. Try again later.");
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    try {
      const { data } = await axios.get(`${API_ROOT}/admin/get-raw-materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Error fetching raw materials. Try again later.");
    }
  };

  // Fetch ticket details
  const fetchTicketDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) {
      toast.error("Invalid session or ticket ID.");
      setTicketLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_ROOT}/customer/view-weigh/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ticket = data.data; // Access the 'data' object from the response
      setSelectedCustomerId(ticket.authToWeigh.supplierId); // Supplier ID
      setSelectedProductId(ticket.authToWeigh.productId); // Product ID
      setQuantity(ticket.net); // Net weight as quantity
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      toast.error("Error fetching ticket details. Try again later.");
    } finally {
      setTicketLoading(false);
    }
  };

  // Update selected unit and base price when product changes
  useEffect(() => {
    if (selectedProductId && products.length > 0) {
      const selectedProduct = products.find(
        (product) => product.id === selectedProductId
      );
      if (selectedProduct) {
        setSelectedUnit(selectedProduct);
        setBasePrice(selectedProduct.price[0]?.amount?.toString() || "");
      }
    }
  }, [selectedProductId, products]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (id) fetchTicketDetails();
    else setTicketLoading(false);
  }, [id]);

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
      await axios.post(`${API_ROOT}/customer/raise-supplier-order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!", {
        style: { padding: "20px" },
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
        error.response?.data?.message || "Failed to place order. Please check your inputs."
      );
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      <Heading>Received Order</Heading>
      <Separator className="my-3 w-full" />
      {ticketLoading ? (
        <Flex justify="center" className="my-4">
          <LoaderIcon className="animate-spin" />
        </Flex>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid columns="2" gap="4" className="w-full">
            {/* Supplier Select */}
            <div className="w-full">
              <Text className="font-bold">Supplier Name</Text>
              <Select
                showSearch                
                placeholder="Select Supplier"
                optionFilterProp="children"
                onChange={(value) => setSelectedCustomerId(value)}
                value={selectedCustomerId || undefined}
                className={`w-full mt-2 text-bold text-lg disabled:text-gray-800 ${
                  customers.length === 0 || !!id ? "bg-gray-100 text-black font-bold" : ""
                }`}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={customers.length === 0 || !!id} // Disable if no customers or id exists
                required
              >
                {customers.map((customer) => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.firstname} {customer.lastname}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Product Select */}
            <div className="w-full">
              <Text className="font-bold">Raw Material</Text>
              <Select
                showSearch
                placeholder="Select Raw Material"
                optionFilterProp="children"
                onChange={(value) => setSelectedProductId(value)}
                value={selectedProductId || undefined}
                className={`w-full mt-2 placeholder:text-black ${
                  products.length === 0 || !!id ? "bg-gray-100 text-black font-bold" : ""
                }`}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={products.length === 0 || !!id} // Disable if no products or id exists
                required
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Quantity */}
            <div className="w-full">
              <Text>Quantity</Text>
              <TextField.Root
                className="mt-2"
                placeholder="Input Quantity"
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!!id} // Disable if id exists
              />
            </div>

            {/* Product Unit */}
            <div className="w-full">
              <Text>Product Unit</Text>
              <TextField.Root
                className="mt-2"
                placeholder="Unit"
                value={selectedUnit?.price[0]?.unit || ""}
                disabled
              />
            </div>

            {/* Base Price */}
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

            {/* Sub Charge */}
            <div className="w-full">
              <Text>Sub Charge</Text>
              <Input
                addonBefore="₦"
                className="mt-2"
                value={formatNumber(subCharge)}
                onChange={handleSubChargeChange}
                placeholder="Enter Supplier Subcharge"
              />
            </div>

            {/* Comment */}
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
              className="!bg-theme cursor-pointer mt-4 text-white"
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
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default SupplierPlaceOrder;