import React, { useState, useEffect, useMemo } from "react";
import { formatMoney, refractor } from "../../../date";
import {
  Table,
  Spinner,
  TextField,
  Flex,
  Text,
  Card,
  Select,
} from "@radix-ui/themes";
import axios from "axios";

// All imports for the dropdown menu
import { isNegative } from "../../../date";
import { DropdownMenu, Button, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faUser,
  faEllipsisV,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

//All imports for the Dialog Box

import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

//Edit Dialog Box $//
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
      toast.error("An error occurred. Try logging in again");
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
      setDeleteLoading(false);
      onClose();
      showToast({
        message: response.data.message,
        type: "success",
      });

      fetchCustomers();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      onClose();
      showToast({
        message:
          error?.message || "An error occurred while trying to edit customer",
        type: "error",
      });
    }
  };

  // Add a new phone number input
  const addPhoneNumber = () => {
    setChangedPhone([...changedPhone, ""]);
  };

  // Delete a phone number by index
  const deletePhoneNumber = (index) => {
    setChangedPhone(changedPhone.filter((_, i) => i !== index));
  };

  // Update a phone number by index
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
          </button>{" "}
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
            {deleteLoading ? "Loading..." : "Save Changes"}
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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // State management for the delete dialog
  const [selectCustomer, setSelectedCustomer] = useState(null);

  // Handle opening the delete dialog for a specific customer
  const handleDeleteClick = (staff) => {
    setSelectedCustomer(staff);
  };

  const [selectEditCustomer, setSelectEditCustomer] = useState(null);
  // Handle opening the edit  dialog for a specific customer
  const handleEditClcik = (staff) => {
    setSelectEditCustomer(staff);
  };

  const fetchCustomers = async () => {
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
    try {
      const response = await axios.get(`${root}/customer/all-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      {
        response.data.customers.length === 0
          ? setCustomerData([])
          : setCustomerData(response.data.customers);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      {
        error.message
          ? toast.error(error.message, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            })
          : toast.error("An Error Occured", {
              duration: 6500,
              style: {
                padding: "30px",
              },
            });
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filterCustomers = (customers, searchTerm) => {
    if (!searchTerm.trim()) {
      return customers; // Return all customers if searchTerm is empty
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return customers.filter((customer) =>
      // Check each relevant field for a match
      [
        customer.customerTag, // ID
        customer.firstname, //First Name
        customer.lastnmae, //Last Name
        customer.email, // Email
        customer.address, // Address
        ...customer.phoneNumber, // Phone (spread for array fields)
      ].some((field) =>
        String(field).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  };

  // Use this function to derive the filtered customer data
  const filteredCustomers = filterCustomers(customerData, searchTerm);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="flex w-full justify-between">
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
          <Select.Root size="2">
            <Select.Trigger placeholder="Filter Customers" />
            <Select.Content>
              
              <Select.Item value="debt" >
                Indebted Customers
              </Select.Item>
              <Select.Item value="no-debt" >
                Non-Indebted Customers
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <Table.Root size={"3"} variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <div className="p-4">
            <Spinner />
          </div>
        ) : (
          <Table.Body>
            {filteredCustomers.length === 0 ? (
              <Table.Cell colSpan={6} className="text-center">
                No Customers Found
              </Table.Cell>
            ) : (
              filteredCustomers.map((customer) => (
                <Table.Row
                  key={customer.id}
                  className="relative cursor-pointer"
                >
                  <Table.Cell>{refractor(customer.createdAt)}</Table.Cell>
                  <Table.Cell>{customer.customerTag}</Table.Cell>
                  <Table.RowHeaderCell>
                    {/* Render highlighted name */}
                    {customer.firstname} {customer.lastname}
                  </Table.RowHeaderCell>
                  <Table.Cell>{customer.email}</Table.Cell>
                  <Table.Cell>{customer.address}</Table.Cell>

                  <Table.Cell>
                    {customer?.phoneNumber &&
                      customer.phoneNumber.map((item, index) => (
                        <span key={index}>
                          {item} <br />
                        </span>
                      ))}
                  </Table.Cell>
                  <Table.Cell
                    className={
                      isNegative(customer?.latestBalance || 0)
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatMoney(customer?.latestBalance || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="right-4 top-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface" className="cursor-pointer">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="solid">
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => handleEditClcik(customer)}
                          >
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faBook} />}
                            onClick={() =>
                              navigate(
                                `/admin/customers/customer-ledger/${customer.id}`
                              )
                            }
                          >
                            View Ledger
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        )}
      </Table.Root>

      {selectEditCustomer && (
        <EditDialog
          isOpen={!!selectEditCustomer}
          onClose={() => setSelectEditCustomer(null)}
          id={selectEditCustomer}
          fetchCustomers={fetchCustomers}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllCustomers;
