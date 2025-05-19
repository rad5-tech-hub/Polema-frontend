import React, { useState } from "react";
import { refractor, formatMoney } from "../../../date";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Heading, Table, TextField, Button } from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;
import { Modal, Select } from "antd"; // Import Select from antd
import { jwtDecode } from "jwt-decode";
import useToast from "../../../../hooks/useToast";

const IndividualDepartmentLedger = () => {
  const { id, ledgerName } = useParams();
  const showToast = useToast();
  const [ledger, setLedger] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);
  const [creditCustomerModalOpen, setCreditCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);

  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to get a department ledger
  const getDeptLedger = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/department-ledger/${id}`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      Array.isArray(response.data)
        ? setLedger(response.data)
        : setFailedSearch(true);
    } catch (error) {
      console.log(error);
      {
        error.response.status === 404 && setFailedSearch(true);
      }
    }
  };

  // Function to get products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to get customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        message: "An error occurred. Try logging in again",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      {
        response.data.customers.length === 0
          ? setCustomerData([])
          : setCustomerData(response.data.customers);
      }
    } catch (error) {
      {
        error.message
          ? toast.error(error.message, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            })
          : toast.error("An Error Occurred", {
              duration: 6500,
              style: {
                padding: "30px",
              },
            });
      }
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  // Modal for crediting customer
  const CreditDeptModal = () => {
    const [productId, setProductId] = useState("");
    const [transactionType, setTransactionType] = useState("credit");
    const [customerName, setCustomerName] = useState("");
    const [comments, setComments] = useState("");
    const [creditAmount, setCreditAmount] = useState("");
    const [itemName, setItemName] = useState(""); // New state for Item Name
    const [buttonLoading, setButtonLoading] = useState(false);
    const [selectedField, setSelectedField] = useState("product"); // Track active field: 'product' or 'itemName'

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setCreditAmount(value);
      } else {
        setCreditAmount("");
      }
    };

    const handleItemNameChange = (e) => {
      setItemName(e.target.value);
    };
    const handleComment = (e) => {
      setComments(e.target.value);
    };

    const handleFieldToggle = (field) => {
      setSelectedField(field);
      // Clear the other field's value when toggling
      if (field === "product") {
        setItemName("");
      } else {
        setProductId("");
      }
    };

    const handleCreditSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "error",
          message: "An error occurred, try logging in again.",
        });
        return;
      }
      if (!customerName) {
        showToast({
          message: "Enter a customer name first",
          type: "error",
        });
        return;
      }
      // if (selectedField === "product" && !productId) {
      //   showToast({
      //     message: "Select a product first",
      //     type: "error",
      //   });
      //   return;
      // }
      if (!itemName) {
        showToast({
          message: "Enter an item name",
          type: "error",
        });
        return;
      }
      if (!creditAmount) {
        showToast({
          message: "Enter an amount",
          type: "error",
        });
        return;
      }
      setButtonLoading(true);
      const body = {
        departmentId: id,
        name: customerName,
        [transactionType]: creditAmount,
        comments: comments,
        // ...(selectedField === "product" && { productId: productId }),
        productName: itemName,
      };

      try {
        const response = await axios.post(
          `${root}/customer/create-deptledger`,
          body,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast({
          message: "Ledger Updated Successfully",
          type: "success",
          duration: 5000,
        });

        setButtonLoading(false);
        setCreditCustomerModalOpen(false);
        if (id) getDeptLedger();
      } catch (err) {
        showToast({
          type: "error",
          message:
            err.message || "An error occurred while trying to update ledger",
        });
        setButtonLoading(false);
      }
    };

    // Custom filter function for customer search
    const filterCustomerOption = (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    // Custom filter function for product search
    const filterProductOption = (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
      <Modal
        open={creditCustomerModalOpen}
        title="Record Book Details"
        footer={null}
        onCancel={() => {
          setCreditCustomerModalOpen(false);
          setCustomerName("");
          setComments("");
          setProductId("");
          setItemName("");
          setSelectedField("product");
        }}
      >
        <form action="" onSubmit={handleCreditSubmit}>
          <div className="mt-4">
            <label htmlFor="customer-select" className="font-bold">
              Customer Name
            </label>
            {/* <Select
              id="customer-select"
              showSearch
              placeholder="Search for a customer"
              optionFilterProp="children"
              onChange={(value) => setCustomerId(value)}
              value={customerName || undefined}
              filterOption={filterCustomerOption}
              options={customerData.map((customer) => ({
                value: customer.id,
                label: `${customer.firstname} ${customer.lastname}`,
              }))}
              style={{ width: "100%", marginTop: 8 }}
              allowClear
            /> */}
            <TextField.Root
              id="item-name"
              placeholder="Enter Customer Name"
              className="p-3"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
              }}
            />
          </div>
          {/* <div className="mt-4">
            <div className="flex justify-between">
              <label htmlFor="product-select" className="font-bold">
                Product
              </label>
              <input
                type="checkbox"
                checked={selectedField === "product"}
                onChange={() => handleFieldToggle("product")}
              />
            </div>
            <Select
              id="product-select"
              showSearch
              placeholder="Search for a product"
              optionFilterProp="children"
              onChange={(value) => setProductId(value)}
              value={productId || undefined}
              filterOption={filterProductOption}
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              style={{ width: "100%", marginTop: 8 }}
              allowClear
              disabled={selectedField !== "product"}
            />
          </div> */}
          <div className="mt-4">
            <div className="flex justify-between">
              <label htmlFor="item-name" className="font-bold">
                Item Name
              </label>
              {/* <input
                type="checkbox"
                checked={selectedField === "itemName"}
                onChange={() => handleFieldToggle("itemName")}
              /> */}
            </div>
            <TextField.Root
              id="item-name"
              placeholder="Enter Item Name"
              className="p-3"
              value={itemName}
              onChange={handleItemNameChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="transaction-type" className="font-bold mt-4">
              Transaction Type
            </label>
            <select
              id="transaction-type"
              className="block w-full border-2 border-black/60 p-3 rounded"
              onChange={(e) => setTransactionType(e.target.value)}
              value={transactionType}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="amount" className="font-bold mt-4">
              Enter Amount
            </label>
            <TextField.Root
              id="amount"
              placeholder="Enter Amount"
              className="p-3"
              value={formatNumberWithCommas(creditAmount)}
              onChange={handlePriceChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="comment" className="font-bold mt-4">
              Comment
            </label>
            <TextField.Root
              id="comment"
              placeholder="Optional Comment"
              className="p-3"
              value={comments}
              onChange={handleComment}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 p-2 text-white !bg-blue-400"
            disabled={buttonLoading}
          >
            {buttonLoading ? "Please Wait..." : "Submit"}
          </Button>
        </form>
      </Modal>
    );
  };

  React.useEffect(() => {
    getDeptLedger();
    fetchProducts();
  }, []);

  return (
    <>
      <Heading>{ledgerName}</Heading>
      <p className="text-sm opacity-40">Department Ledger</p>
      {decodeToken().isAdmin && ledger.length > 0 && (
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => {
            setCreditCustomerModalOpen(true);
          }}
        >
          Credit Ledger
        </Button>
      )}

      {/* Table for ledger details */}
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNITS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              {failedSearch ? <p>No records found.</p> : <Spinner />}
            </div>
          ) : (
            ledger.map((item, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.comments}</Table.Cell>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.unitPrice}</Table.Cell>
                  <Table.Cell className="text-green-500 font-bold">
                    {formatMoney(item.credit > item.debit ? item.credit : "")}
                  </Table.Cell>
                  <Table.Cell className="text-red-500 font-bold">
                    {formatMoney(item.debit > item.credit ? item.debit : "")}
                  </Table.Cell>
                  <Table.Cell>{formatMoney(item.balance)}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
      <CreditDeptModal />
    </>
  );
};

export default IndividualDepartmentLedger;
