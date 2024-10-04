import React, { useState, useEffect } from "react";
import { refractor } from "../../../date";
import { Table, Spinner, TextField, Flex, Text } from "@radix-ui/themes";
import axios from "axios";
import UpdateURL from "../ChangeRoute";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import { DropdownMenu, Button, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUser } from "@fortawesome/free-solid-svg-icons";
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

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    const body = {
      firstname: changedFirstName,
      lastname: changedLastName,
      address: changedAddress,
      email: changedEmail,
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
      console.log(response);
      onClose();
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
      fetchCustomers();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      onClose();
      toast.error(error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] !bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0  font-medium text-black">
            <Heading as="h1" className="text-[25px]">
              Edit Customer
            </Heading>
          </Dialog.Title>

          <form action="" className="mt-4">
            <label
              className="text-[15px] text-black  font-medium leading-[35px]"
              htmlFor="firstname"
            >
              First Name
            </label>
            <TextField.Root
              placeholder="Enter First Name"
              id="firstname"
              defaultValue={id.firstname}
              onChange={(e) => setChangedFirstName(e.target.value)}
              type="text"
              className="p-1 rounded-sm mb-5"
            />

            <label
              className="text-[15px] text-black  font-medium leading-[35px]"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <TextField.Root
              placeholder="Enter Last Name"
              id="lastname"
              defaultValue={id.lastname}
              onChange={(e) => setChangesLastName(e.target.value)}
              type="text"
              className="p-1 rounded-sm mb-5"
            />

            <label
              className="text-[15px] text-black  font-medium leading-[35px]"
              htmlFor="address"
            >
              Email
            </label>
            <TextField.Root
              placeholder="Enter Email"
              id="address"
              defaultValue={id.email}
              onChange={(e) => setChangedEmail(e.target.value)}
              type="text"
              className="p-1 rounded-sm mb-5"
            />

            <label
              className="text-[15px] text-black  font-medium leading-[35px]"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <TextField.Root
              placeholder="Enter Phone Number"
              id="phone"
              defaultValue={id.phoneNumber}
              type="number"
              onChange={(e) => setChangedPhone(e.target.value)}
              className="p-1 rounded-sm mb-5"
            />

            <label
              className="text-[15px] text-black  font-medium leading-[35px]"
              htmlFor="address"
            >
              Address
            </label>
            <TextField.Root
              placeholder="Enter Address"
              id="address"
              defaultValue={id.address}
              onChange={(e) => setChangedAddress(e.target.value)}
              type="text"
              className="p-1 rounded-sm"
            />
          </form>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-red-600 hover:bg-red-500 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              disabled={deleteLoading}
              onClick={() => {
                editCustomer(id);
              }}
              className=" ml-4 bg-green-800 text-white hover:bg-green-700 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {deleteLoading ? <LoaderIcon /> : "Save Changes"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

//Delete Dialog Box $//
const DeleteDialog = ({ isOpen, onClose, user, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteCustomer = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.delete(
        `${root}/customer/delete-customer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      console.log(response);
      setDeleteLoading(false);
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      toast(error.message);
      onClose();
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Delete Customer
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to delete this customer ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-blue-500 hover:bg-blue-800 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              disabled={deleteLoading}
              onClick={() => {
                deleteCustomer(id);
              }}
              className=" ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {deleteLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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

      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "25px",
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <UpdateURL url={"/all-customers"} />
      <TextField.Root placeholder="Search Customers.." className="w-[55%] mb-5">
        <TextField.Slot>
          <MagnifyingGlassIcon height={"16"} width={"16"} />
        </TextField.Slot>
      </TextField.Root>
      <Heading className="mb-4">Customers</Heading>
      <Table.Root size={"3"} variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <div className="p-4">
            <Spinner />
          </div>
        ) : (
          <Table.Body>
            {customerData.length === 0 ? (
              <Table.Cell colSpan={6} className="text-center">
                No Customers Yet
              </Table.Cell>
            ) : (
              customerData.map((customer) => (
                <>
                  <Table.Row
                    key={customer.id}
                    onClick={() => handleEditClcik(customer)}
                    className="relative hover:bg-[rgb(225,225,225)]/30 cursor-pointer"
                  >
                    {" "}
                    {/* Ensure unique key */}
                    <Table.RowHeaderCell>
                      {customer.firstname} {customer.lastname}
                    </Table.RowHeaderCell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.address}</Table.Cell>
                    <Table.Cell>{customer.phoneNumber}</Table.Cell>
                    <Table.Cell>{refractor(customer.createdAt)}</Table.Cell>
                    {/* <div className="absolute right-4 top-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface" className="cursor-pointer">
                            <DropDownIcon />
                            
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => handleEditClcik(customer)}
                          >
                            Edit
                          </DropdownMenu.Item>
                          {}
                          <DropdownMenu.Item
                            color="red"
                            shortcut={<DeleteIcon />}
                            onClick={() => handleDeleteClick(customer)}
                          >
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div> */}
                  </Table.Row>
                </>
              ))
            )}
          </Table.Body>
        )}
      </Table.Root>
      {selectCustomer && (
        <DeleteDialog
          isOpen={!!selectCustomer}
          onClose={() => setSelectedCustomer(null)}
          id={selectCustomer.id}
        />
      )}
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
