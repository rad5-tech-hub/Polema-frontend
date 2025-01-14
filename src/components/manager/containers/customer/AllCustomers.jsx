import React, { useState, useEffect, useMemo } from "react";
import { refractor } from "../../../date";
import { Table, Spinner, TextField, Flex, Text } from "@radix-ui/themes";
import axios from "axios";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import { DropdownMenu, Button, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUser, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Suspend } from "../../../icons";

//All imports for the Dialog Box
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const root = import.meta.env.VITE_ROOT;

//Edit Dialog Box $//
const EditDialog = ({ isOpen, onClose, fetchCustomers, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangesLastName] = useState(id.lastname);
  const [changedPhone, setChangedPhone] = useState(id.phoneNumber);
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
      phoneNumber: changedPhone,
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
      toast.success(response.data.message, {
        duration: 6500,
        style: { padding: "30px" },
      });
      fetchCustomers();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      onClose();
      toast.error(error.message, {
        duration: 6500,
        style: { padding: "30px" },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="fixed top-[50%] left-[50%]  h-fit w-[90vw] max-w-[450px] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
        <Heading as="h1" className="text-2xl font-semibold mb-4 text-black">
          Edit Customer
        </Heading>

        <form className="mt-4">
          <label className="text-sm font-medium text-black leading-[35px]">
            First Name
          </label>
          <input
            placeholder="Enter First Name"
            defaultValue={id.firstname}
            onChange={(e) => setChangedFirstName(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />

          <label className="text-sm font-medium text-black leading-[35px]">
            Last Name
          </label>
          <input
            placeholder="Enter Last Name"
            defaultValue={id.lastname}
            onChange={(e) => setChangesLastName(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />

          <label className="text-sm font-medium text-black leading-[35px]">
            Email
          </label>
          <input
            placeholder="Enter Email"
            defaultValue={id.email}
            onChange={(e) => setChangedEmail(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />

          <label className="text-sm font-medium text-black leading-[35px]">
            Phone Number
          </label>
          <input
            placeholder="Enter Phone Number"
            defaultValue={id.phoneNumber}
            onChange={(e) => setChangedPhone(e.target.value)}
            className="w-full p-2 mb-5 rounded-sm border"
          />

          <label className="text-sm font-medium text-black leading-[35px]">
            Address
          </label>
          <input
            placeholder="Enter Address"
            defaultValue={id.address}
            onChange={(e) => setChangedAddress(e.target.value)}
            type="text"
            className="w-full p-2 mb-5 rounded-sm border"
          />
        </form>

        <div className="mt-6 flex justify-end ">
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
          &times;
        </button>
      </div>
    </div>
  );
};

const AllCustomers = () => {
  const [customerData, setCustomerData] = useState([]);

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

  // Highlight function: Wrap matching text in <span>
  const highlightText = (text, search) => {
    if (!search) return text; // Return unaltered text if no search term
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="bg-yellow-200">${match}</span>`
    );
  };

  // Filter and highlight customers based on the search term
  const filteredCustomers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    // Step 1: Filter customers
    const filtered = customerData.filter((customer) =>
      `${customer.firstname} ${customer.lastname}`
        .toLowerCase()
        .includes(searchLower)
    );

    // Step 2: Apply highlighting
    return filtered.map((customer) => {
      const fullName = `${customer.firstname} ${customer.lastname}`;
      const highlightedName = highlightText(fullName, searchLower);
      return { ...customer, highlightedName };
    });
  }, [searchTerm, customerData]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
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

      <Table.Root size={"3"} variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
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
                    <span
                      dangerouslySetInnerHTML={{
                        __html: customer.highlightedName,
                      }}
                    />
                  </Table.RowHeaderCell>
                  <Table.Cell>{customer.email}</Table.Cell>
                  <Table.Cell>{customer.address}</Table.Cell>
                  <Table.Cell>
                    {customer.phoneNumber.map((item, index) => (
                      <span key={index}>
                        {item} <br />
                      </span>
                    ))}
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
                            onClick={() => handleEditClick(customer)}
                          >
                            Edit
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
