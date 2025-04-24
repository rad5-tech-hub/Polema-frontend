import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Separator,
  Flex,
  Text,
  TextField,
  Button,
  Grid,
  Spinner as RadixSpinner,
} from "@radix-ui/themes";
import { Select as AntSelect } from "antd";

const root = import.meta.env.VITE_ROOT;

const CustomerPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customCustomerName, setCustomCustomerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductPlan, setSelectedProductPlan] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [planAmount, setPlanAmount] = useState("");
  const [planAmountValue, setPlanAmountValue] = useState("");

  // Function to fetch customers
  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Fetch customers error:", error);
      toast.error("Failed to fetch customers", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
      });
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to fetch products", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
      });
    }
  };

  // Get matching product details
  const getMatchingUnitFromId = (id) => {
    const product = products.find((product) => product.id === id);
    return product
      ? product
      : { price: [{ unit: "", amount: "" }], department: { name: "" }, pricePlan: [] };
  };

  // Get matching price plans
  const getMatchingPlansFromId = (id) => {
    const product = getMatchingUnitFromId(id);
    setSelectedProductPlan(Array.isArray(product.pricePlan) ? product.pricePlan : []);
  };

  // Handle price input change
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(value) && value !== "" && Number(value) >= 0) {
      setBasePrice(value);
    } else {
      setBasePrice("");
    }
  };

  // Handle custom discount change
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
      setPlanAmountValue(value);
    }
  };

  // Format number with commas for display
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to continue", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 6500,
      });
      setButtonLoading(false);
      return;
    }

    const product = getMatchingUnitFromId(selectedProductId);
    const isCrushing = product.department?.name === "Crushing";

    if (!selectedProductId || (!isCrushing && !selectedCustomerId) || (isCrushing && !customCustomerName) || !quantity) {
      toast.error("Please fill all required fields", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
      setButtonLoading(false);
      return;
    }

    const body = {
      ...(isCrushing ? { customerName: customCustomerName } : { customerId: selectedCustomerId }),
      productId: selectedProductId,
      quantity: Number(quantity),
      unit: product.price[0]?.unit || "",
      price: Number(basePrice) || Number(product.price[0]?.amount) || 0,
      discount: planAmount === "custom" ? Number(planAmountValue) : Number(planAmount) || null,
    };

    try {
      const response = await axios.post(
        `${root}/customer/raise-customer-order`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message, {
        style: { background: "#ecfdf5", color: "#047857", padding: "16px" },
        duration: 10000,
      });

      // Reset form fields
      setSelectedCustomerId("");
      setCustomCustomerName("");
      setSelectedProductId("");
      setSelectedProductPlan([]);
      setQuantity("");
      setBasePrice("");
      setPlanAmount("");
      setPlanAmountValue("");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "An error occurred, try again", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
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
      <Heading size="6">Place Order</Heading>
      <Separator className="my-4 w-full" />
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          {/* Product and Customer */}
          <Flex gap="4" className="w-full">
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Product <span className="text-red-500">*</span>
              </Text>
              <AntSelect
                showSearch
                className="w-full mt-1"
                placeholder="Select Product"
                value={selectedProductId || undefined}
                onChange={(value) => {
                  setSelectedProductId(value);
                  getMatchingPlansFromId(value);
                  setBasePrice(getMatchingUnitFromId(value).price[0]?.amount || "");
                  setSelectedCustomerId("");
                  setCustomCustomerName("");
                  setPlanAmount("");
                  setPlanAmountValue("");
                }}
                disabled={products.length === 0}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <AntSelect.Option key={product.id} value={product.id}>
                    {product.name}
                  </AntSelect.Option>
                ))}
              </AntSelect>
            </div>
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Customer Name <span className="text-red-500">*</span>
              </Text>
              {getMatchingUnitFromId(selectedProductId).department?.name === "Crushing" ? (
                <TextField.Root
                  size="2"
                  className="mt-1 w-full"
                  required
                  placeholder="Enter Customer Name"
                  value={customCustomerName}
                  onChange={(e) => setCustomCustomerName(e.target.value)}
                />
              ) : (
                <AntSelect
                  showSearch
                  className="w-full mt-1"
                  placeholder="Select Customer"
                  value={selectedCustomerId || undefined}
                  onChange={setSelectedCustomerId}
                  disabled={customers.length === 0}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {customers.map((customer) => (
                    <AntSelect.Option
                      key={customer.id}
                      value={customer.id}
                      label={`${customer.firstname} ${customer.lastname}`}
                    >
                      {customer.firstname} {customer.lastname}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              )}
            </div>
          </Flex>

          {/* Quantity and Unit */}
          <Flex gap="4" className="w-full">
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Quantity <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                size="2"
                type="number"
                className="mt-1 w-full"
                required
                placeholder="Input Quantity"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                    setQuantity(value);
                  }
                }}
              />
            </div>
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Product Unit
              </Text>
              <TextField.Root
                size="2"
                className="mt-1 w-full"
                disabled
                value={
                  selectedProductId ? getMatchingUnitFromId(selectedProductId).price[0]?.unit || "" : ""
                }
                placeholder="Select Product First"
              />
            </div>
          </Flex>

          {/* Discount and Price */}
          <Grid columns="2" gap="4" className="w-full">
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Price Discount (Optional)
              </Text>
              {planAmount === "custom" ? (
                <TextField.Root
                    size="2"
                    type="text" // Use text to allow typing with commas
                    className="mt-1 w-full"
                    placeholder="Enter custom discount"
                    value={formatNumberWithCommas(planAmountValue)} // Format the value with commas
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, ""); // Remove commas for raw input
                      if (!isNaN(rawValue) && Number(rawValue) >= 0) {
                        setPlanAmountValue(rawValue); // Update the raw numeric value
                      }
                    }}
                  />
              ) : (
                <AntSelect
                  className="w-full mt-1"
                  placeholder={
                    selectedProductPlan.length === 0
                      ? "Product selected has no discount"
                      : "Select discount plan"
                  }
                  value={planAmount || undefined}
                  onChange={(value) => {
                    if (value === "custom") {
                      setPlanAmount("custom");
                    } else if (value === "none") {
                      setPlanAmount("");
                      setPlanAmountValue("");
                    } else {
                      setPlanAmount(value);
                      setPlanAmountValue("");
                    }
                  }}
                >
                  {selectedProductPlan.map((plan) => (
                    <AntSelect.Option key={plan.category} value={plan.amount}>
                      {plan.category}
                    </AntSelect.Option>
                  ))}
                  <AntSelect.Option value="custom">Custom</AntSelect.Option>
                  <AntSelect.Option value="none">None</AntSelect.Option>
                </AntSelect>
              )}
            </div>
            <div className="w-full">
              <Text as="label" size="2" weight="medium">
                Product Price
              </Text>
              <TextField.Root
                size="2"
                className="mt-1 w-full"
                placeholder="Select Product First"
                value={formatNumberWithCommas(basePrice)}
                onChange={handlePriceChange}
              />
            </div>
          </Grid>

          {/* Submit Button */}
          <Flex gap="4" justify="end">
            <Button
              size="3"
              type="submit"
              disabled={buttonLoading}
              className="!bg-theme !text-white hover:!bg-theme flex items-center gap-2"
            >
              {buttonLoading ? (
                <>
                  <RadixSpinner className="w-5 h-5 text-white animate-spin" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </Flex>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CustomerPlaceOrder;