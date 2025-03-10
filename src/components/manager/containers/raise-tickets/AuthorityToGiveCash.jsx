import React, { useEffect, useState } from "react";
import {
  Tabs,
  Heading,
  Select,
  Text,
  Grid,
  Flex,
  Spinner,
  TextField,
  Button,
  Separator,
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
  const [authorityType, setAuthorityType] = useState("credit");
  const [othersDescription, setOthersDescription] = useState("");
  const [originalAmount, setOriginalAmount] = useState("");
  const [othersLoading, setOthersLoading] = useState(false);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [ticketId, setTicketId] = useState("");

  // STATE MANAGAEMENT FOR THE STAFF TABS
  const [staffName, setStaffName] = useState("");
  const [itemName, setItemName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [comments, setComments] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [staffAmount, setStaffAmount] = useState("");


  // Function that is used to remove commas from the amount string
  function removeCommas(numberStr) {
    return numberStr.includes(",")
      ? parseInt(numberStr.replace(/,/g, ""), 10)
      : numberStr;
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

  // Function to fetch all super admins
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured,try logging in again.");
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch departments
  const fetchDept = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured,try logging in again.");
    }

    try {
      const request = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(request.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCustomersSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setButtonLoading(false);
      return;
    }
    const resetForm = () => {
      setAmount("");
      setSelectedCustomer("");
      setSelectedProduct("");
      setComments("");
    };

    const body = {
      amount: removeCommas(originalAmount),
      customerId: selectedCustomer,
      comments,
      productId: selectedProduct,
      creditOrDebit: authorityType,
    };

    try {
      const response = await axios.post(`${root}/admin/cash-ticket`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      const ticketId = response.data.ticket.id;
      setTicketId(ticketId);

      await axios.post(
        `${root}/admin/send-ticket/${ticketId}`,
        { adminIds:[adminId] },
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      resetForm();
      toast.success("Ticket created and sent successfully!", {
        style: {
          padding: "20px",
        },
        duration: 5500,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to submit the form. Please try again.");
      setLoading(false);
    }
  };

  const staffSubmit = async (e) => {
    e.preventDefault();
    setOthersLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again");
      setOthersLoading(false);
      return;
    }

    const resetForm = () => {
      setStaffAmount("");
      setStaffName("");
      setItemName("");
      setComments("");
    };

    const body = {
      amount: Number(staffAmount),
      item: itemName,
      creditOrDebit: authorityType,
      comments,
      departmentId,
    };

    try {
      // First API call
      const firstResponse = await axios.post(
        `${root}/admin/cash-ticket`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newTicketId = firstResponse.data.ticket.id;
      setTicketId(newTicketId);

      const secondResponse = await axios.post(
        `${root}/admin/send-ticket/${newTicketId}`,
        {
          adminIds:[adminId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetForm();
      toast.success("Ticket processed successfully!", {
        style: {
          padding: "20px",
        },
        duration: 5500,
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing the ticket.");
    } finally {
      setOthersLoading(false);
    }
  };
  const formatWithCommas = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return Number(numericValue).toLocaleString(); // Format with commas
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchSuperAdmins();
    fetchDept();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Heading>Authority To Give Cash</Heading>
        <Select.Root
          defaultValue="give"
          onValueChange={(value) => {
            value === "credit"
              ? setAuthorityType("credit")
              : setAuthorityType("debit");
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="give">Give Cash</Select.Item>
            <Select.Item value="collect">Collect Cash</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Separator className="my-4 w-full" />
      <Tabs.Root defaultValue="Customers">
        <Tabs.List className="justify-center flex w-full items-center">
          <Tabs.Trigger value="Customers">Customers</Tabs.Trigger>
          <Tabs.Trigger value="Staff">Staff</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Customers">
          <form onSubmit={handleCustomersSubmit} className="mt-6">
            <div className="flex w-full justify-between gap-8">
              <div className="w-full">
                <Text size={"4"}>
                  Customer Name <span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  value={selectedCustomer}
                  required
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
                <Text size={"4"}>
                  Select Product <span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  required
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
                <label htmlFor="amount">
                  Enter Amount <span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  id="amount"
                  required
                  className="mt-3"
                  value={amount}
                  onChange={(e) => {
                    const formattedAmount = formatWithCommas(e.target.value);
                    setOriginalAmount(e.target.value);
                    setAmount(formattedAmount);
                  }}
                  placeholder="Enter Amount in Naira (₦)"
                />
              </div>

              <div className="comments w-[50%]">
                <label htmlFor="comments">Comments</label>
                <TextField.Root
                  id="comments"
                  required
                  className="mt-3 mb-4"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter a description..."
                />
              </div>
            </div>
            <div className="w-[49%]">
              <Text>Send To</Text>
              <Select.Root
                disabled={superAdmins.length === 0}
                onValueChange={(value) => setAdminId(value)}
              >
                <Select.Trigger
                  className="mt-3 w-full"
                  placeholder="Select Admin"
                />
                <Select.Content position="popper">
                  {superAdmins.map((admin) => (
                    <Select.Item
                      key={admin.role?.id || " "}
                      value={admin.role?.id || " "}
                    >{`${admin.firstname} ${admin.lastname}`}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <Flex justify={"end"} className="mt-4">
              <Button size={"2"} disabled={loading} type="submit">
                {loading ? <Spinner /> : "Send"}
              </Button>
            </Flex>
          </form>
        </Tabs.Content>

        <Tabs.Content value="Staff">
          <form className="mt-6" onSubmit={staffSubmit}>
            <Grid columns={"2"} gap={"4"}>
              <div className="w-full">
                <Text>
                  Staff Name <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Staff Name"
                  value={staffName}
                  required
                  onChange={(e) => {
                    setStaffName(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <Text>Input Item</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Item Name"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <Text>Price</Text>
                <TextField.Root
                  className="mt-2"
                  value={staffAmount}
                  placeholder="Enter Price"
                  onChange={(e) => {
                    setStaffAmount(e.target.value);
                  }}
                >
                  <TextField.Slot>₦</TextField.Slot>
                </TextField.Root>
              </div>
              <div className="w-full">
                <Text>Select Department</Text>
                <Select.Root
                  onValueChange={(val) => {
                    setDepartmentId(val);
                  }}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Department"
                  />
                  <Select.Content position="popper">
                    {departments.map((dept) => {
                      return (
                        <Select.Item key={dept.id} value={dept.id} >
                          {dept.name}
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text>Comments </Text>
                <TextField.Root className="mt-2" placeholder="Enter Comments" />
              </div>
              <div className="w-full">
                <Text>Send To</Text>
                <Select.Root
                  disabled={superAdmins.length === 0}
                  onValueChange={(value) => {
                    setAdminId(value);
                  }}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Admin"
                  />
                  <Select.Content>
                    {superAdmins.map((admin) => {
                      return (
                        <Select.Item
                          value={admin.role?.id || " "}
                        >{`${admin.firstname} ${admin.lastname}`}</Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
            </Grid>

            <Flex justify={"end"} className="mt-4">
              <Button size={"2"} disabled={othersLoading} type="submit">
                {othersLoading ? <Spinner /> : "Send"}
              </Button>
            </Flex>
          </form>
        </Tabs.Content>
      </Tabs.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default AuthorityToGiveCash;
