import React, { useState, useEffect, useMemo, useRef } from "react";
import { formatMoney, refractor, isNegative } from "../../../date";
import {
  Table,
  Spinner,
  TextField,
  Flex,
  Text,
  Card,
  Select,
  DropdownMenu,
  Button,
  Heading,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faBook, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { MagnifyingGlassIcon, TrashIcon, PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditDialog = ({ isOpen, onClose, fetchCustomers, id }) => {
  const showToast = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangedLastName] = useState(id.lastname);
  const [changedPhone, setChangedPhone] = useState(id.phoneNumber || []);
  const [changedAddress, setChangedAddress] = useState(id.address);
  const [changedEmail, setChangedEmail] = useState(id.email);

  const editCustomer = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again.",
      });
      setDeleteLoading(false);
      return;
    }
    const body = {
      firstname: changedFirstName,
      lastname: changedLastName,
      address: changedAddress,
      ...(changedEmail && { email: changedEmail }),
      phoneNumber: changedPhone.filter((phone) => phone.trim() !== ""),
    };
    try {
      const response = await axios.patch(
        `${root}/customer/edit-customer/${id.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      showToast({
        type: "success",
        message: response.data.message || "Customer updated successfully.",
      });
      onClose();
      fetchCustomers();
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || "An error occurred while trying to edit customer.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const addPhoneNumber = () => {
    setChangedPhone([...changedPhone, ""]);
  };

  const deletePhoneNumber = (index) => {
    setChangedPhone(changedPhone.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index, value) => {
    const newPhoneNumbers = [...changedPhone];
    newPhoneNumbers[index] = value;
    setChangedPhone(newPhoneNumbers);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="fixed top-[50%] left-[50%] h-[90%] w-[90vw] max-w-[450px] overflow-y-scroll transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
        <Heading as="h1" className="text-2xl font-semibold mb-4 text-black">
          Edit Customer
        </Heading>
        <form className="mt-4">
          <label className="text-sm font-medium text-black leading-[35px]">
            First Name
          </label>
          <input
            placeholder="Enter First Name"
            value={changedFirstName}
            onChange={(e) => setChangedFirstName(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />
          <label className="text-sm font-medium text-black leading-[35px]">
            Last Name
          </label>
          <input
            placeholder="Enter Last Name"
            value={changedLastName}
            onChange={(e) => setChangedLastName(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />
          <label className="text-sm font-medium text-black leading-[35px]">
            Email
          </label>
          <input
            placeholder="Enter Email"
            value={changedEmail}
            onChange={(e) => setChangedEmail(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />
          <label className="text-sm font-medium text-black leading-[35px]">
            Phone Numbers
          </label>
          {changedPhone.map((phone, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                type="text"
                className="w-full p-2 rounded-lg border"
              />
              <button
                type="button"
                onClick={() => deletePhoneNumber(index)}
                className="bg-red-400 p-2 rounded-sm cursor-pointer"
              >
                <TrashIcon className="text-white" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoneNumber}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md mt-2 mb-5"
          >
            <PlusIcon className="text-white" />
          </button>
          <br />
          <label className="text-sm font-medium text-black leading-[35px]">
            Address
          </label>
          <input
            placeholder="Enter Address"
            value={changedAddress}
            onChange={(e) => setChangedAddress(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />
        </form>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            disabled={deleteLoading}
            onClick={() => editCustomer(id)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {deleteLoading ? <Spinner size="1" /> : "Save Changes"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const AllCustomers = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectEditCustomer, setSelectEditCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [arrangeType,setArrangeType] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false);
  const showToast = useToast();
  const navigate = useNavigate();

  const fetchCustomers = async (pageUrl = null, pageIndex = 0) => {
    setLoading(true);
    setCustomerData([]);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again.",
      });
      setLoading(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/customer/all-customers`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomerData(response.data.customers || []);
      const nextPage = response.data.pagination?.nextPage;
      setHasNextPage(!!nextPage);
      if (nextPage && !paginationUrls.includes(nextPage)) {
        setPaginationUrls((prev) => [...prev, nextPage]);
      }
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || "An error occurred while fetching customers.",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (search) => {
    setLoading(true);
    setCustomerData([]);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again.",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/search-customer?search=${encodeURIComponent(search)}`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomerData(response.data.customerList || []);
       // Search results are not paginated
      setPaginationUrls([]);
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || "An error occurred while searching customers.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = (customers, searchTerm) => {
    if (!searchTerm.trim()) {
      return customers;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return customers.filter((customer) =>
      [
        customer.customerTag,
        customer.firstname,
        customer.lastname, // Fixed typo: lastnmae -> lastname
        customer.email,
        customer.address,
        ...(customer.phoneNumber || []),
      ].some((field) => String(field || "").toLowerCase().includes(lowerCaseSearchTerm))
    );
  };

  const filteredCustomers = useMemo(() => filterCustomers(customerData, searchTerm), [customerData, searchTerm]);

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchCustomers(paginationUrls[currentPageIndex], nextIndex);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchCustomers(prevIndex === 0 ? null : paginationUrls[prevIndex - 1], prevIndex);
    }
  };

  const handleEditClick = (customer) => {
    setSelectEditCustomer(customer);
  };


  const arrangeList = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again.",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/all-customers?sortByBalance=true&sortOrder=${arrangeType === "asc" ? "ASC" : "DESC"}`,{
        headers: {
          Authorization:`Bearer ${retrToken}`
        }
      })
      setCustomerData(response.data.customers || []);
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred while fetching customers.",
      });
    }
  }
  useEffect(() => {
    if (arrangeType !== null) {
      arrangeList();
    }
  }, [arrangeType]);
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (searchTerm.trim() === "") {
      // If search is cleared, fetch all customers
      searchTimeout.current = setTimeout(() => {
        setCurrentPageIndex(0);
        setPaginationUrls([]);
        fetchCustomers();
      }, 500);
    } else {
      // Debounced search
      searchTimeout.current = setTimeout(() => {
        searchCustomers(searchTerm);
      }, 500);
    }
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);
  useEffect(() => {
    fetchCustomers();
  }, []);




  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <div className="w-full">
          <Heading className="mb-4">Customers</Heading>
          <TextField.Root
            placeholder="Search customers"
            className="mb-4 w-[60%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </div>
        <div>
          
          <Select.Root size="2"  onValueChange={(val)=>{
              setArrangeType(val)
            }}>
            <Select.Trigger placeholder="Arrange List By:" />
            <Select.Content position="popper">
              {/* <Select.Item value="asc">Highest Indebted Customers</Select.Item> */}
              <Select.Item value="asc">Debt</Select.Item>

              {/* <Select.Item value="desc">Lowest Indebted Customers</Select.Item> */}
              <Select.Item value="desc">Credit</Select.Item>

            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <Table.Root className="mt-4 table-fixed w-full" variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">PHONE</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell className="text-left">BALANCE(₦)</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body aria-live="polite">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center p-4">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : customerData.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center p-4">
                No Customers Found
              </Table.Cell>
            </Table.Row>
          ) : (
            customerData.map((customer) => (
              <Table.Row key={customer.id || `${customer.customerTag}-${customer.createdAt}`} className="relative cursor-pointer">
                <Table.Cell>{refractor(customer.createdAt) || "N/A"}</Table.Cell>
                <Table.Cell>{customer.customerTag || "N/A"}</Table.Cell>
                <Table.RowHeaderCell>
                  {customer.firstname || "N/A"} {customer.lastname || "N/A"}
                </Table.RowHeaderCell>
                <Table.Cell>{customer.email || "N/A"}</Table.Cell>
                <Table.Cell>{customer.address || "N/A"}</Table.Cell>
                <Table.Cell>
                  {Array.isArray(customer?.phoneNumber) && customer.phoneNumber.length > 0 ? (
                    customer.phoneNumber.map((item, index) => (
                      <span key={index}>
                        {item || "N/A"} <br />
                      </span>
                    ))
                  ) : (
                    JSON.parse(customer?.phoneNumber) || ""
                  )}
                </Table.Cell>
                {/* <Table.Cell
                  className={
                    isNegative(customer?.latestBalance || 0)
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {formatMoney(customer?.latestBalance || 0)}
                </Table.Cell> */}
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="surface" className="cursor-pointer">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content variant="solid">
                      <DropdownMenu.Item
                        shortcut={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => handleEditClick(customer)}
                      >
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        shortcut={<FontAwesomeIcon icon={faBook} />}
                        onClick={() => navigate(`/admin/customers/customer-ledger/${customer.id}`)}
                      >
                        View Ledger
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <div className="pagination-fixed">

      {(paginationUrls.length > 0 || currentPageIndex > 0) && (
        <Flex justify="center" className="mt-4">
          <Flex gap="2" align="center">
            <Button
              variant="soft"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Text>Page {currentPageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={!hasNextPage}
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Next page"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}
      </div>


      {selectEditCustomer && (
        <EditDialog
          isOpen={!!selectEditCustomer}
          onClose={() => {
            setSelectEditCustomer(null);
            setCurrentPageIndex(0);
            setPaginationUrls([]);
            fetchCustomers();
          }}
          id={selectEditCustomer}
          fetchCustomers={() => {
            setCurrentPageIndex(0);
            setPaginationUrls([]);
            fetchCustomers();
          }}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllCustomers;