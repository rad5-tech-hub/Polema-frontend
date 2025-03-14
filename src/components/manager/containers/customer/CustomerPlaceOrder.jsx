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
import { Select as AntSelect } from "antd";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

const CustomerPlaceOrder = () => {
  const [basePrice, setBasePrice] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [seletedProductPlan, setSelectedProductPlan] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [planAmount, setPlanAmount] = useState("");

  const [rawPrice, setRawPrice] = useState("");

  // Function to format the number with commas
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to remove commas and store raw number
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
    if (!isNaN(rawValue)) {
      setRawPrice(rawValue);
      setBasePrice(rawValue); // Store raw number in parent state
    }
  }

  

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

    // // Check if customer was seleected
    // if(!selectedCustomerId){
    //   toast.error("Sele", {
    //     duration: 2000,
    //     style: {
    //       padding: "30px",
    //     },
    //   });

    //   return;
    // }

    const body = {
      customerId: selectedCustomerId,
      productId: selectedProductId,
      quantity: quantity,
      unit: getMatchingUnitFromId(selectedProductId).price[0].unit,
      price: basePrice,
      ...(planAmount && { discount: Number(planAmount) }),
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
        duration: 10000,
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
            <AntSelect
              showSearch
              className="w-full mt-2"
              placeholder="Select Customer"
              value={selectedCustomerId || undefined}
              onChange={setSelectedCustomerId}
              disabled={customers.length === 0}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }>
              {customers.map((customer) => (
                <AntSelect.Option key={customer.id} value={customer.id}>
                  {customer.firstname} {customer.lastname}
                </AntSelect.Option>
              ))}
            </AntSelect>
          </div>

          <div className="w-full">
            <Text className="mb-4">
              Product<span className="text-red-500">*</span>
            </Text>
            <AntSelect
              showSearch
              className="w-full mt-2"
              placeholder="Select Product"
              value={selectedProductId || undefined}
              onChange={(value) => {
                setSelectedProductId(value);
                getMatchingPlansFromId(value);
                setBasePrice(getMatchingUnitFromId(value).price[0].amount);
              }}
              disabled={products.length === 0}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }>
              {products.map((product) => (
                <AntSelect.Option key={product.id} value={product.id}>
                  {product.name}
                </AntSelect.Option>
              ))}
            </AntSelect>
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
            {/* <Select.Root
              disabled={seletedProductPlan.length === 0}
              onValueChange={(val) => {
                setPlanAmount(val);
              }}>
              <Select.Trigger
                className="mt-2 w-full"
                placeholder={
                  seletedProductPlan.length === 0
                    ? "Product Selected has no discount"
                    : "Select plan"
                }
              />
              <Select.Content position="popper">
                {seletedProductPlan.map((plan) => {
                  return (
                   <>
                    <Select.Item value={plan.amount}>
                      {plan.category}
                    </Select.Item>
                    <Select.Item value="none">
                      none
                    </Select.Item>
                   </>
                  );
                })}
              </Select.Content>
            </Select.Root> */}
            <AntSelect
              className="w-full mt-2"
              placeholder={
                seletedProductPlan.length === 0
                  ? "Product Selected has no discount"
                  : "Select plan"
              }
              disabled={seletedProductPlan.length === 0}
              value={undefined} // Ensure no default selection
              onChange={(value) => {
                if (value === "none") {
                  setPlanAmount(null); // Set nothing if "None" is selected
                } else {
                  setPlanAmount(value);
                }
              }}>
              {seletedProductPlan.map((plan) => (
                <AntSelect.Option key={plan.category} value={plan.amount}>
                  {plan.category}
                </AntSelect.Option>
              ))}
              {/* Add "None" option to remove discount */}
              <AntSelect.Option value="none">None</AntSelect.Option>
            </AntSelect>
          </div>
          <div className="w-full">
      <Text className="mb-4">Product Price</Text>
      <TextField.Root
        className="mt-2"
        placeholder="Select Product First"
        value={formatNumberWithCommas(basePrice)} // Show formatted value
        onChange={handlePriceChange} // Handle change with raw number
      />
    </div>
        </Grid>
        <Flex className="w-full mb-4" gap={"5"} justify={"end"}>
          <Button
            size={"3"}
            type="submit"
            disabled={buttonLoading}
            className=" bg-theme hover:bg-theme/85">
            {buttonLoading ? <LoaderIcon /> : "Add"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CustomerPlaceOrder;
