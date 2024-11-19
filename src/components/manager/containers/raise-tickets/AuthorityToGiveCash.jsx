import React, { useEffect, useState } from "react";
import {
  Tabs,
  Select,
  Text,
  Flex,
  Spinner,
  TextField,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AuthorityToGiveCash = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authorityType, setAuthorityType] = useState("");
  const [othersDescription, setOthersDescription] = useState("");
  const [othersAmount, setOthersAmount] = useState("");
  const [othersLoading, setOthersLoading] = useState(false);

  // Function to format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle base price input change and remove commas before setting state
  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "");
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue);
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
      toast.error(error.message);
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
      toast.error(error.message);
    }
  };

  const handleCustomersSubmit = async (e) => {
    e.preventDefault();
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      amount: amount,
      customerId: selectedCustomer,
      productId: selectedProduct,
      creditOrDebit: authorityType,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${root}/customer/raise-cashticket`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      toast.success(response.data.message, {
        duration: 6500,
        style: { padding: "30px" },
      });

      setAmount("");
      setSelectedCustomer(null);
      setSelectedProduct(null);
      setAuthorityType("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOthersLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      amount: othersAmount,
      staffName: othersDescription,
      creditOrDebit: authorityType,
    };

    try {
      const response = await axios.post(
        `${root}/customer/raise-cashticket`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      toast.success(response.data.message);
      setOthersAmount("");
      setOthersDescription("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOthersLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  return (
    <>
      <Tabs.Root defaultValue="Customers">
        <Tabs.List className="justify-center flex w-full items-center">
          <Tabs.Trigger value="Customers">Customers</Tabs.Trigger>
          <Tabs.Trigger value="Others">Others</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Customers">
          <form onSubmit={handleCustomersSubmit} className="mt-6">
            <div className="flex w-full justify-between gap-8">
              <div className="w-full">
                <Text size={"4"}>Customer Name</Text>
                <Select.Root
                  value={selectedCustomer}
                  onValueChange={setSelectedCustomer}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Customer Name"
                  />
                  <Select.Content position="popper">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    {customers
                      .filter(
                        (customer) =>
                          customer.firstname
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          customer.lastname
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((customer) => (
                        <Select.Item key={customer.id} value={customer.id}>
                          {customer.firstname} {customer.lastname}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="w-full">
                <Text size={"4"}>Select Product</Text>
                <Select.Root
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Product"
                  />
                  <Select.Content position="popper">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchProductQuery}
                        onChange={(e) => setSearchProductQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    {products
                      .filter((product) =>
                        product.name
                          .toLowerCase()
                          .includes(searchProductQuery.toLowerCase())
                      )
                      .map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <div className="flex w-full mt-4 justify-between gap-8">
              <div className="w-[49%]">
                <label htmlFor="amount">Enter Amount</label>
                <TextField.Root
                  id="amount"
                  className="mt-3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount in Naira (₦)"
                />
              </div>
              <div className="w-[49%]">
                <label htmlFor="authorityType">Authority Type</label>
                <Select.Root
                  value={authorityType}
                  onValueChange={setAuthorityType}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Choose Authority Type"
                  />
                  <Select.Content position="popper">
                    <Select.Item value="debit">
                      Authority to give Cash
                    </Select.Item>
                    <Select.Item value="credit">
                      Authority to collect Cash
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <Flex justify={"end"} className="mt-4">
              <Button size={"2"} disabled={loading} type="submit">
                {loading ? <Spinner /> : "Send"}
              </Button>
            </Flex>
          </form>
        </Tabs.Content>
        <Tabs.Content value="Others">
          <form onSubmit={handleOrderSubmit} className="mt-6">
            <div className="flex w-full mt-4 justify-between gap-8">
              <div className="w-[49%]">
                <label htmlFor="othersDescription">Description</label>
                <TextField.Root
                  id="othersDescription"
                  className="mt-2"
                  value={othersDescription}
                  placeholder="Enter Ticket Description"
                  onChange={(e) => setOthersDescription(e.target.value)}
                />
              </div>
              <div className="w-[49%]">
                <label htmlFor="othersAmount">Amount</label>
                <TextField.Root
                  id="othersAmount"
                  className="mt-2"
                  value={othersAmount}
                  placeholder="Enter Amount"
                  onChange={(e) => setOthersAmount(e.target.value)}
                />
              </div>
            </div>

            <Flex justify={"end"} className="mt-4">
              <Button size={"2"} disabled={othersLoading} type="submit">
                {othersLoading ? <Spinner /> : "Send"}
              </Button>
            </Flex>
          </form>
        </Tabs.Content>
      </Tabs.Root>
      <Toaster />
    </>
  );
};

export default AuthorityToGiveCash;
