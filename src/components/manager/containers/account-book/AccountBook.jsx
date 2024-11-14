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
  const [comment, setComment] = useState("");
  const [deptID, setDeptID] = useState("");

  const [accountRecipient, setAccountRecipient] = useState("customers");
  const [department, setDepartment] = useState([]);
  const [otherName, setOtherName] = useState("");

  // Function to reset form
  const resetForm = () => {
    setSelectedCustomerId("");
    setSelectedProductId("");
    setBasePrice("");
    setBankName("");
    setComment("");
    setDeptID("");
    setOtherName("");
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "");
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue);
    }
  };

  // Function to fetch customer and suppliers
  const fetchCustomer = async () => {
    setCustomers([]);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Function to check for customer or supplier
    const isCustomer = () => {
      if (accountRecipient === "customers") {
        return true;
      } else {
        return false;
      }
    };
    try {
      const response = await axios.get(
        `${root}/customer/${isCustomer() ? "get-customers" : "get-suppliers"}`,
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

  // Function to fetch products and raw materials
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Function to check for customer or supplier
    const isCustomer = () => {
      if (accountRecipient === "customers") {
        return true;
      } else {
        return false;
      }
    };
    try {
      const repsonse = await axios.get(
        `${root}/admin/${isCustomer() ? "get-products" : "get-raw-materials"}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setProducts(repsonse.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch department
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDepartment(response.data.departments);
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

    // Function to check if account Receipient is either customer/supplier or others
    const customerOrSupplier = () => {
      if (
        accountRecipient === "customers" ||
        accountRecipient === "suppliers"
      ) {
        return true;
      } else {
        return false;
      }
    };

    // Function to check if account receipient is either customer or supplier
    const isCustomer = () => {
      if (accountRecipient === "customers") {
        return true;
      } else if (accountRecipient === "suppliers") {
        return false;
      } else if (accountRecipient === "others") {
        return null;
      }
    };

    const submissionData = {
      [isCustomer ? "customerId" : "supplierId"]: selectedCustomerId,
      productId: selectedProductId,
      amount: basePrice,
      bankName: bankName,
      ...(isCustomer() === true && { customerId: selectedCustomerId }),
      ...(isCustomer() === false && { supplierId: selectedCustomerId }),
      ...(customerOrSupplier() && { productId: selectedProductId }),

      [isCustomer() ? "credit" : "debit"]: basePrice,
      comments: comment,
      bankName,
      ...(isCustomer() === null && { other: otherName }),
      ...(!customerOrSupplier() && { departmentId: deptID }),
    };

    console.log(submissionData);

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
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // Make the below requests when page loads
  useEffect(() => {
    fetchCustomer();
    fetchProducts();
  }, [accountRecipient]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <Flex justify={"between"}>
        <Heading className="mb-4">Add</Heading>
        <Select.Root
          defaultValue="customers"
          onValueChange={(value) => {
            setAccountRecipient(value);
            resetForm();
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="customers">Customers</Select.Item>
            <Select.Item value="suppliers">Suppliers</Select.Item>
            <Select.Item value="others">Others</Select.Item>
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
        <Grid columns={"2"} gap={"4"}>
          {accountRecipient === "others" && (
            <>
              <div className="w-full">
                <Text>Input Name</Text>
                <TextField.Root
                  className="mt-2 w-full"
                  value={otherName}
                  onChange={(e) => {
                    setOtherName(e.target.value);
                  }}
                  placeholder="Input Name"
                />
              </div>
              <div className="w-full">
                <Text>Department</Text>
                <Select.Root
                  onValueChange={(value) => {
                    setDeptID(value);
                  }}
                >
                  <Select.Trigger
                    disabled={department.length === 0}
                    placeholder="Select Department"
                    className="w-full mt-2"
                  />
                  <Select.Content>
                    {department.map((item) => {
                      return (
                        <Select.Item value={item.id}>{item.name}</Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
            </>
          )}

          {accountRecipient !== "others" && (
            <>
              <div className="w-full">
                <Text className="mb-4">
                  {accountRecipient === "customers" && "Customer Name"}
                  {accountRecipient === "suppliers" && "Supplier Name"}
                </Text>
                <Select.Root
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                  disabled={customers.length === 0}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder={
                      accountRecipient === "customers"
                        ? "Select Customers"
                        : "Select Suppliers"
                    }
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
                  {accountRecipient === "customers" && "Select Product"}
                  {accountRecipient === "suppliers" && "Select Raw Materials"}
                </Text>
                <Select.Root
                  value={selectedProductId}
                  disabled={products.length === 0}
                  onValueChange={setSelectedProductId} // Update selected product ID
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder={
                      accountRecipient === "customers"
                        ? "Select Products"
                        : "Select Raw Materials"
                    }
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
            </>
          )}

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

          <div className="w-full">
            <Text>Comment</Text>
            <TextField.Root
              className="mt-2 "
              placeholder="Write any comment"
              onChange={(e) => {
                setComment(e.target.value);
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
