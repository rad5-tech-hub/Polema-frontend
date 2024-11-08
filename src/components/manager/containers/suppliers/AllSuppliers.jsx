import { UpdateIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { refractor } from "../../../date";
import React, { useEffect, useState } from "react";
import { DeleteIcon, DropDownIcon } from "../../../icons";
import {
  Heading,
  Table,
  TextField,
  Spinner,
  Flex,
  Separator,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";

//All imports for the Dialog Box
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

// Dialog for viewing customers

const EditDialog = ({ isOpen, onClose, fetchSuppliers, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangesLastName] = useState(id.lastname);
  const [changedEmail, setChangedEmail] = useState(id.email);
  const [changedPhone, setChangedPhone] = useState(id.phoneNumber);
  const [changedAddress, setChangedAddress] = useState(id.address);

  const EditSupplier = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      firstname: changedFirstName,
      lastname: changedLastName,
      phoneNumber: changedPhone,
      email: changedEmail,
      address: changedAddress,
    };

    try {
      const response = await axios.patch(
        `${root}/customer/edit-supplier/${id.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setSuspendLoading(false);
      toast.success("Admin Edited successfully", {
        duration: 6500,
        style: { padding: "30px" },
      });
      fetchSuppliers();
      onClose();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      toast.error(error.response?.data?.error || error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 max-w-lg w-full rounded shadow-lg relative">
        <h1 className="text-xl font-semibold mb-4">Edit Supplier</h1>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-black"
            >
              First Name
            </label>
            <input
              id="firstname"
              type="text"
              placeholder="Enter First Name"
              defaultValue={id.firstname}
              onChange={(e) => setChangedFirstName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-black"
            >
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              placeholder="Enter Last Name"
              defaultValue={id.lastname}
              onChange={(e) => setChangesLastName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email Address
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={id.email}
              onChange={(e) => setChangedEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-black"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="number"
              placeholder="Enter Phone Number"
              defaultValue={id.phoneNumber}
              onChange={(e) => setChangedPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-black"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Enter Address"
              defaultValue={id.address}
              onChange={(e) => setChangedAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          >
            No
          </button>
          <button
            onClick={() => EditSupplier(id)}
            disabled={suspendLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {suspendLoading ? <LoaderIcon /> : "Yes"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // State management for the selected staff for View Staff Dialog
  const [viewStaff, setViewStaff] = useState(null);

  // Handle opening the edit dialog for a specific staff
  const handleEditClick = (staff) => {
    setViewStaff(staff);
  };

  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const repsonse = await axios.get(`${root}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      console.log(repsonse);
      setPageLoading(false);
      setSuppliers(repsonse.data.customers);
    } catch (error) {
      console.log(error);
      setPageLoading(false);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    // Run this function as page loads
    fetchSuppliers();
  }, []);

  return (
    <>
      <div className="">
        <Heading className="mb-3 ">All Suppliers</Heading>
        <Separator className="my-4 w-full" />
        <Table.Root size={"3"} variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>

              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>

              <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {pageLoading ? (
            <Spinner className="m-4" />
          ) : (
            <Table.Body>
              {suppliers.length === 0 ? (
                <Table.Cell colSpan={5} className="text-center ">
                  No Admins Yet
                </Table.Cell>
              ) : (
                suppliers.map((supplier) => {
                  return (
                    <Table.Row
                      className="cursor-pointer  relative"
                      onClick={() => setViewStaff(supplier)}
                    >
                      <Table.Cell>{refractor(supplier.createdAt)}</Table.Cell>
                      <Table.Cell>{supplier.supplierTag}</Table.Cell>

                      <Table.Cell>{`${supplier.firstname} ${supplier.lastname}`}</Table.Cell>
                      <Table.Cell>{supplier.email}</Table.Cell>
                      <Table.Cell>{supplier.address}</Table.Cell>
                      <Table.Cell>{supplier.phoneNumber}</Table.Cell>
                      <Table.Cell>
                        <div className="absolute right-4 top-2">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                              <Button
                                variant="surface"
                                className="cursor-pointer"
                              >
                                <DropDownIcon />
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content variant="solid">
                              <DropdownMenu.Item
                                shortcut={<FontAwesomeIcon icon={faPen} />}
                                onClick={() => setViewStaff(supplier)}
                              >
                                Edit
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          )}
        </Table.Root>
      </div>
      {viewStaff && (
        <EditDialog
          isOpen={!!viewStaff}
          onClose={() => setViewStaff(null)}
          fetchSuppliers={fetchSuppliers}
          id={viewStaff}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default AllSuppliers;
