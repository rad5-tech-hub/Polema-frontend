import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStop, faRedo } from "@fortawesome/free-solid-svg-icons";
import DocumentsModal from "./DocumentsModal";
import toast, { Toaster } from "react-hot-toast";
import { refractor, formatMoney } from "../../../date";
import { useParams, useNavigate } from "react-router-dom";
import {
  Skeleton,
  Table,
  Heading,
  Spinner,
  Flex,
  Button,
  TextField,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import { Modal } from "antd";
import { StopOutlined } from "@ant-design/icons";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const IndividualCustomerLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [failedSearch, setFailedSearch] = useState(false);
  const [customer, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [creditCustomerModalOpen, setCreditCustomerModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading per transaction

  const [productId, setProductId] = useState("");
  const [transactionType, setTransanctionType] = useState("");
  const [creditAmount, setCreditAmount] = useState("");

  const searchInputRef = useRef(null);
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const decodeToken = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  // Fetch customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch products
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

  // Fetch customer ledger
  const getCustomerLedger = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const { data } = await axios.get(
        `${root}/customer/get-customer-ledger/${id}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      setEntries(data.ledgerEntries);
      setFailedSearch(false);
    } catch (error) {
      setFailedSearch(true);
      console.error("Error fetching customer ledger:", error);
    }
  };

  // End transaction
  const handleEndTransaction = async (tranxId) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [tranxId]: true }));
    try {
      await axios.patch(
        `${root}/customer/end-transaction/${tranxId}`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      showToast({
        message: "Transaction ended successfully",
        type: "success",
        duration: 5000,
      });

      getCustomerLedger(); // Refresh ledger
    } catch (error) {
      console.error("Error ending transaction:", error);
      toast.error("Failed to end transaction");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [tranxId]: false }));
    }
  };

  // Restart transaction
  const handleRestartTransaction = async (tranxId) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [tranxId]: true }));
    try {
      await axios.patch(
        `${root}/customer/reopen-transaction/${tranxId}`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );

      showToast({
        message: "Transaction restarted successfully",
        type: "success",
        duration: 5000,
      });
      getCustomerLedger(); // Refresh ledger
    } catch (error) {
      console.error("Error restarting transaction:", error);
      toast.error("Failed to restart transaction");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [tranxId]: false }));
    }
  };

  const getCustomerByID = (id) => {
    const userCustomer = customer.find((item) => item.id === id);
    return (
      userCustomer || {
        firstname: "Name",
        lastname: "Not Found",
        customerTag: "N/A",
      }
    );
  };

  const getProductByID = (id) => {
    const product = products.find((item) => item.id === id);
    return product ? product.name : "Product not Found";
  };

  //Modal for crediting customer
  const CreditCustomerModal = () => {
    const [productId, setProductId] = useState("");
    const [transactionType, setTransanctionType] = useState("credit");
    const [creditAmount, setCreditAmount] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handlePriceChange = (e) => {
      const value = e.target.value.replace(/,/g, "");

      if (!isNaN(value) && value !== "" && Number(value) >= 0) {
        setCreditAmount(value);
      } else {
        setCreditAmount("");
      }
    };

    const handleCreditSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token")
      if(!token){
        showToast({
          type:"error",
          message:"An error occurred ,try loggging in again."
        })
        return 
      }
      setButtonLoading(true);
      const body = {
        customerId: id,
        productId,
        [transactionType]: creditAmount,
      };

      try {
        const response = await axios.post(
          `${root}/customer/create-ledger`,
          body,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast({
          message: "Ledger Updated Successfully",
          type: "success",
          duration:5000
        })

        setButtonLoading(false);
        setCreditCustomerModalOpen(false);
        if (id) getCustomerLedger();

      } catch (err) {
        showToast({
          type: "error",
          message:
            err.message || "An error occurred while trying to update ledger",
        });

        setButtonLoading(false);
      }
    };

    return (
      <Modal
        open={creditCustomerModalOpen}
        title="Record Book Details"
        footer={null}
        onCancel={() => {
          setCreditCustomerModalOpen(false);
        }}
      >
        <form action="" onSubmit={handleCreditSubmit}>
          <div className="mt-4">
            <label htmlFor="" className="font-bold">
              Product
            </label>
            <select
              className="block w-full border-2 border-black/60 p-3 rounded"
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((product) => {
                return <option value={product.id}>{product.name}</option>;
              })}
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="" className="font-bold mt-4">
              Transaction Type
            </label>
            <select
              className="block w-full border-2 border-black/60 p-3 rounded"
              onChange={(e) => setTransanctionType(e.target.value)}
            >
              <option value={"credit"}>Credit</option>
              <option value={"debit"}>Debit</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="" className="font-bold mt-4">
              Enter Amount
            </label>
            <TextField.Root
              placeholder="Enter Amount"
              className="p-3"
              value={formatNumberWithCommas(creditAmount)}
              onChange={handlePriceChange}
            />
          </div>

          <button
            className="mt-4 p-2 text-white !bg-blue-400"
            disabled={buttonLoading}
          >
            {buttonLoading ? "Please Wait.." : "Submit"}
          </button>
        </form>
      </Modal>
    );
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    const filtered = customer.filter(({ firstname, lastname }) =>
      `${firstname} ${lastname}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleModal = (tranxId) => {
    if (!tranxId) return;

    setModalOpen(true);
    setTransactionId(tranxId);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (id) getCustomerLedger();
  }, [id]);

  return (
    <>
      <Flex justify="between" align="center">
        <div className="w-full">
          {!customer.length ? (
            <Skeleton className="p-4 w-[150px]" />
          ) : (
            <Heading className="font-amsterdam">{`${
              getCustomerByID(id).firstname
            } ${getCustomerByID(id).lastname}`}</Heading>
          )}

          {!customer.length ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : (
            <p className="text-sm opacity-65">
              {getCustomerByID(id).customerTag}
            </p>
          )}
          {decodeToken().isAdmin && customer.length > 0 && (
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => {
                setCreditCustomerModalOpen(true);
              }}
            >
              Credit Customer
            </Button>
          )}
        </div>

        <Modal
          isOpen={creditCustomerModalOpen}
          onClose={() => setCreditCustomerModalOpen(false)}
        >
          <Modal.Header>
            <Modal.Title>Credit Customer</Modal.Title>
            <Modal.Description>
              Enter the amount you want to credit the customer
            </Modal.Description>
          </Modal.Header>
          <Modal.Content>
            <input
              type="number"
              placeholder="Enter amount"
              className="border border-gray-300 rounded p-2 w-full"
              onChange={(e) => setCreditAmount(e.target.value)}
            />
          </Modal.Content>
        </Modal>
        <div className="w-[70%]">
          <div className="relative w-full max-w-md" ref={searchInputRef}>
            <TextField.Root
              placeholder="Enter Customer Name"
              size="3"
              className="mx-auto"
              value={searchInput}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root>

            {searchInput && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchInput(
                        `${customer.firstname} ${customer.lastname}`
                      );
                      setFilteredCustomers([]);
                      navigate(
                        `/admin/customers/customer-ledger/${customer.id}`
                      );
                    }}
                  >
                    {customer.firstname} {customer.lastname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Flex>

      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ACTION</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!entries.length ? (
            <Table.Row>
              <Table.Cell colSpan={9} className="p-4 text-center">
                {failedSearch ? "No records found" : <Spinner />}
              </Table.Cell>
            </Table.Row>
          ) : (
            entries.map((entry, index) => (
              <Table.Row
                key={index}
                className="cursor-pointer hover:bg-gray-300/10"
                onClick={() => handleModal(entry.tranxId)}
              >
                <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                <Table.Cell>{getProductByID(entry.productId)}</Table.Cell>
                <Table.Cell>{entry.unit}</Table.Cell>
                <Table.Cell>{entry.quantity}</Table.Cell>
                <Table.Cell>
                  {entry.unitPrice ? formatMoney(entry.unitPrice) : ""}
                </Table.Cell>
                <Table.Cell className="text-green-500 font-bold">
                  {formatMoney(entry.credit > entry.debit ? entry.credit : " ")}
                </Table.Cell>
                <Table.Cell className="text-red-500 font-bold">
                  {formatMoney(entry.debit > entry.credit ? entry.debit : " ")}
                </Table.Cell>
                <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
                <Table.Cell>
                  {entry.isEnd ? (
                    <Button
                      variant="soft"
                      color="blue"
                      title="Restart Transaction"
                      size="2"
                      disabled={loadingStates[entry.id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestartTransaction(entry.id);
                      }}
                    >
                      {loadingStates[entry.id] ? (
                        <Spinner size="1" />
                      ) : (
                        <FontAwesomeIcon icon={faRedo} />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="soft"
                      color="red"
                      title="End Transaction"
                      size="2"
                      disabled={loadingStates[entry.id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEndTransaction(entry.id);
                      }}
                    >
                      {loadingStates[entry.id] ? (
                        <Spinner size="1" />
                      ) : (
                        <StopOutlined
                          StopOutlinedColor="#ff4d4f"
                          style={{ fontSize: "20px" }}
                        />
                      )}
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <CreditCustomerModal />
      <DocumentsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        customerId={transactionId}
        customerName={`${getCustomerByID(id).firstname} ${
          getCustomerByID(id).lastname
        }`}
      />
      {/* <Toaster /> */}
    </>
  );
};

export default IndividualCustomerLedger;
