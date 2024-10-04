import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { refractor } from "../../../date";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { DeleteIcon, DropDownIcon, Suspend } from "../../../icons";

import {
  DropdownMenu,
  Button,
  Spinner,
  Table,
  Heading,
  Flex,
  Separator,
  TextField,
  Card,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import UpdateURL from "../ChangeRoute";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const root = import.meta.env.VITE_ROOT;

// Suspend Dialog
const SuspendDialog = ({ isOpen, onClose, runFetch, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);

  const suspendAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.patch(
        `${root}/admin/suspend-staff/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setSuspendLoading(false);
      console.log(response);
      onClose();
      toast.success("Admin Suspended successfully", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
      runFetch();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      console.log(error);
      {
        error.response.data.error
          ? toast.error(error.response.data.error, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            })
          : toast.error(error.message, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            });
      }
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Suspend User
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to suspend this user ?`}
          </Heading>

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
                suspendAdmin(id);
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

// Edit Dialog
const EditDialog = ({ isOpen, onClose, user, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangesLastName] = useState(id.lastname);
  const [changedPhone, setChangedPhone] = useState(id.phoneNumber);
  const [changedAddress, setChangedAddress] = useState(id.address);

  const suspendAdmin = async (id) => {
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
      address: changedAddress,
    };

    try {
      const response = await axios.patch(
        `${root}/admin/update-staff/${id.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setSuspendLoading(false);
      console.log(response);
      onClose();
      // toast.success("Admin Suspended successfully");
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
              Edit Admin
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
                className="bg-blue-700 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                suspendAdmin(id);
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

const AllAdmins = () => {
  const [staffList, setStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State management for the suspend dialog boxes
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  // State management for the selected staff for suspend dialog
  const [selectedStaff, setSelectedStaff] = useState(null);

  //State management fot the edit dialog boxes
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // State management for the selected staff for suspend dialog
  const [editedStaff, setEditedStaff] = useState(null);

  // Fetch all roles from db and match with that of the staff data
  const fetchRoles = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-rolePerm`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setRolesList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data from db
  const fetchStaffData = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);

      setStaffList(response.data.staffList);
    } catch (error) {
      console.error(error);
      {
        error.message
          ? toast.error(error.message)
          : toast.error("An Error Occured");
      }
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Find role name by matching role ID
  const getRoleNameById = (roleId) => {
    const role = rolesList.find((role) => role.id === roleId);
    return role ? role.name : "No Role Assigned";
  };

  // Handle opening the suspend dialog for a specific staff
  const handleSuspendClick = (staff) => {
    setSelectedStaff(staff);
  };

  // Handle opening the edit dialog for a specific staff
  const handleEditClick = (staff) => {
    setEditedStaff(staff);
  };

  useEffect(() => {
    fetchRoles();
    fetchStaffData();
  }, []);

  // Edit Dialog
  const EditDialog = () => {
    <div className="!font-space">
      <Card className="w-full">
        <Heading className="text-left py-4">Create Admin</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="fullname"
                >
                  First Name
                </label>
                <TextField.Root
                  placeholder="Enter First Name"
                  className=""
                  type="text"
                  id="firstname"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="email"
                >
                  Email
                </label>
                <TextField.Root
                  placeholder="Enter email"
                  className=""
                  id="email"
                  type="text"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="number"
                >
                  Phone Number
                </label>
                <TextField.Root
                  placeholder="Enter phone number"
                  className=""
                  id="number"
                  type="number"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="password"
                >
                  Password
                </label>
                <TextField.Root
                  placeholder="Enter Password"
                  className=""
                  type="password"
                  id="password"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>

            <div className="right w-[50%]">
              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="password"
                >
                  Last Name
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  className=""
                  type="text"
                  id="lastname"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="role"
                >
                  Assign Role
                </label>
                <Select.Root
                  value={value}
                  id={id}
                  onValueChange={handleValueChange}
                  size={"3"}
                >
                  <Select.Trigger
                    className="w-full"
                    id="role"
                    placeholder="Select role"
                  >
                    <Flex as="span" align="center" gap="2">
                      <PersonIcon />
                      {value}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    {rolesArray.map((role) => {
                      return (
                        <Select.Item value={role.name} id={role.id}>
                          {role.name}
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="password"
                >
                  Address
                </label>
                <TextField.Root
                  placeholder="Enter Address"
                  className=""
                  type="text"
                  id="department"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="passwordConfirm"
                >
                  Confirm Password
                </label>
                <TextField.Root
                  placeholder="Confirm Password"
                  className=""
                  type="password"
                  id="passwordConfirm"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>
          </div>

          {/* Permissions Div */}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button className="mt-4 " size={3} type="submit">
              {isLoading ? <Spinner size={"2"} /> : "Create Admin"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>;
  };

  return (
    <>
      <UpdateURL url={"/view-admins"} />

      <EditDialog />

      <TextField.Root placeholder="Search admins.." className="w-[55%] mb-5">
        <TextField.Slot>
          <MagnifyingGlassIcon height={"16"} width={"16"} />
        </TextField.Slot>
      </TextField.Root>

      <Heading>Admins</Heading>
      <Table.Root variant="surface" size={"3"} className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Spinner size={"2"} className="my-4 ml-4" />
        ) : (
          <Table.Body>
            {staffList.length === 0 ? (
              <Table.Cell colSpan={3} className="text-center">
                No Admins Yet
              </Table.Cell>
            ) : (
              staffList.map((staff, index) => (
                <>
                  <Table.Row key={index} className="relative">
                    <Table.RowHeaderCell
                      className={`${staff.active ? "" : "text-red-400"}`}
                    >{`${upperFirst(staff.firstname)} ${
                      staff.lastname
                    }`}</Table.RowHeaderCell>
                    <Table.Cell
                      className={`${staff.active ? "" : "text-red-400"}`}
                    >
                      {staff.email}
                    </Table.Cell>
                    <Table.Cell
                      className={`${staff.active ? "" : "text-red-400"}`}
                    >
                      {getRoleNameById(staff.roleId)}
                    </Table.Cell>
                    <Table.Cell
                      className={`${staff.active ? "" : "text-red-400"}`}
                    >
                      {refractor(staff.createdAt)}
                    </Table.Cell>
                    <div className="absolute right-4 top-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface" className="cursor-pointer">
                            <DropDownIcon />
                            {/* <DropdownMenu.TriggerIcon /> */}
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => handleEditClick(staff)}
                          >
                            Edit
                          </DropdownMenu.Item>
                          {}
                          <DropdownMenu.Item
                            color="red"
                            shortcut={<Suspend />}
                            onClick={() => handleSuspendClick(staff)}
                            // onClick={() => setSuspendDialogOpen(true)}
                          >
                            Suspend
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </Table.Row>
                </>
              ))
            )}
          </Table.Body>
        )}
      </Table.Root>
      {/* Suspend Dialog */}
      {selectedStaff && (
        <SuspendDialog
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          user={selectedStaff.firstname}
          runFetch={fetchStaffData}
          id={selectedStaff.id}
        />
      )}

      {/* {editedStaff && (
        <EditDialog
          isOpen={!!editedStaff}
          onClose={() => setEditedStaff(null)}
          id={editedStaff}
        />
      )}
       */}
      <Toaster position="top-right" />
    </>
  );
};

export default AllAdmins;