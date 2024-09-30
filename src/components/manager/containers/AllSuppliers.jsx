import { UpdateIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { refractor } from "../../date";
import React, { useEffect, useState } from "react";
import UpdateURL from "./ChangeRoute";
import { Heading, Table, TextField, Spinner, Flex } from "@radix-ui/themes";
import axios from "axios";

//All imports for the Dialog Box
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
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

    // Check if the token is available
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
      console.log(response);
      toast.success("Admin Suspended successfully", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
      fetchSuppliers();
      onClose();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      console.log(error);
      {
        error.response.data.error
          ? toast.error(error.response.data.error)
          : toast.error(error.message);
      }
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            <Heading as="h1" className="text-[25px]">
              Edit Supplier
            </Heading>
          </Dialog.Title>

          <form action="" className="mt-4">
            <Flex justify={"between"} width={"100%"}>
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
                className="p-1 rounded-sm mb-5 w-fit"
              />
            </Flex>

            <Flex justify={"between"} width={"100%"}>
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
            </Flex>

            <Flex justify={"between"} width={"100%"}>
              <label
                className="text-[15px] text-black  font-medium leading-[35px]"
                htmlFor="lastname"
              >
                Email Address
              </label>
              <TextField.Root
                placeholder="Enter Last Name"
                id="lastname"
                defaultValue={id.email}
                onChange={(e) => setChangedEmail(e.target.value)}
                type="text"
                className="p-1 rounded-sm mb-5"
              />
            </Flex>

            <Flex justify={"between"} width={"100%"}>
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
            </Flex>

            <Flex justify={"between"} width={"100%"}>
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
            </Flex>
          </form>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-blue-700 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                EditSupplier(id);
              }}
              className=" ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {suspendLoading ? <LoaderIcon /> : "Yes"}
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
    }
  };

  useEffect(() => {
    // Run this function as page loads
    fetchSuppliers();
  }, []);

  return (
    <>
      <UpdateURL url={"/all-suppliers"} />
      <TextField.Root placeholder="Search Suppliers.." className="w-[55%] mb-5">
        <TextField.Slot>
          <MagnifyingGlassIcon height={"16"} width={"16"} />
        </TextField.Slot>
      </TextField.Root>

      <Heading className="mb-3">All Suppliers</Heading>
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
                    className="cursor-pointer hover:bg-[rgb(225,225,225)]/30"
                    onClick={() => setViewStaff(supplier)}
                  >
                    <Table.Cell>{`${supplier.firstname} ${supplier.lastname}`}</Table.Cell>
                    <Table.Cell>{supplier.email}</Table.Cell>
                    <Table.Cell>{supplier.address}</Table.Cell>
                    <Table.Cell>{supplier.phoneNumber}</Table.Cell>
                    <Table.Cell>{refractor(supplier.createdAt)}</Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        )}
      </Table.Root>
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
