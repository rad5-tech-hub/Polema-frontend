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
  Select,
  TextField,
  Card,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";
import {
  MagnifyingGlassIcon,
  PersonIcon,
  EyeClosedIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

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

const AllAdmins = () => {
  const [staffList, setStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State management for the suspend dialog boxes
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  // State management for the selected staff for suspend dialog
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [adminForEdit, setAdminForEdit] = useState("");

  //State management fot the edit dialog boxes
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

      setStaffList(response.data.staffList);
    } catch (error) {
      console.error(error);
      {
        error.message
          ? toast.error(error.message)
          : toast.error("An Error Occured");
      }
    } finally {
      setLoading(false);
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

  const handleEditClick = (admin) => {
    setEditDialogOpen(true);
    setAdminForEdit(admin);
    console.log(admin);
  };

  const EditDialog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [firstname, setFirstname] = useState(adminForEdit.firstname);
    const [lastname, setLastName] = useState(adminForEdit.lastname);
    const [email, setEmail] = useState(adminForEdit.email);
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState(adminForEdit.phoneNumber);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [rolesArray, setRolesArray] = useState([]);
    const [value, setValue] = useState(""); // This will store the role's name
    const [id, setID] = useState(""); // This will store the role's ID

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleValueChange = (value) => {
      setValue(value);
      const selectedRole = rolesArray.find((role) => role.id === value);
      if (selectedRole) {
        setID(selectedRole.id); // Update ID with the role's ID
      }
    };

    const fetchRoles = async () => {
      const retrToken = localStorage.getItem("token");

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
        setRolesArray(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");

        return;
      }

      const body = {
        firstname: firstname,
        lastname: lastname,
        phoneNumber: number,
        password: password,
        confirmPassword: confirmPassword,
        roleId: e.target[6].value, // Add the roleId to the body
      };

      console.log(body);

      try {
        const response = await axios.patch(
          `${root}/admin/update-staff/${adminForEdit.id}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${retrToken}`,
            },
          }
        );
        console.log(response);
        setIsLoading(false);
        toast.success(response.data.message, {
          duration: 6500,
          style: {
            padding: "30px",
          },
        });
        fetchStaffData();
        setTimeout(() => {
          setEditDialogOpen(false);
        }, 1500);
      } catch (error) {
        console.log(error);
        setIsLoading(false);

        toast.error(error.mes);
      }
    };

    useEffect(() => {
      fetchRoles();
    }, []);

    return (
      <>
        <Heading>Edit Admin</Heading>
        <Separator className="w-full my-3" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="firstname"
                >
                  First Name
                </label>
                <TextField.Root
                  placeholder="Enter First Name"
                  defaultValue={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  size={"3"}
                />
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="email"
                >
                  Email
                </label>
                <TextField.Root
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  defaultValue={email}
                  size={"3"}
                />
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="number"
                >
                  Phone Number
                </label>
                <TextField.Root
                  placeholder="Enter phone number"
                  onChange={(e) => setNumber(e.target.value)}
                  type="number"
                  defaultValue={number}
                  size={"3"}
                />
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="password"
                >
                  Password
                </label>
                <TextField.Root
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  size={"3"}
                >
                  <TextField.Slot
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOpenIcon height={"16"} width={"16"} />
                    ) : (
                      <EyeClosedIcon height={"16"} width={"16"} />
                    )}
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>

            <div className="right w-[50%]">
              <div className="mt-3 input-field">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="lastname"
                >
                  Last Name
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  defaultValue={lastname}
                  size={"3"}
                />
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="role"
                >
                  Assign Role
                </label>
                <Select.Root>
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Assign Role"
                  />
                  <Select.Content position="popper">
                    {rolesArray.map((customer) => {
                      return (
                        <Select.Item key={customer.id} value={customer.id}>
                          {customer.name}
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="passwordConfirm"
                >
                  Confirm Password
                </label>
                <TextField.Root
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  size={"3"}
                >
                  <TextField.Slot
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOpenIcon height={"16"} width={"16"} />
                    ) : (
                      <EyeClosedIcon height={"16"} width={"16"} />
                    )}
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>
          </div>

          <Flex
            justify={"end"}
            align={"end"}
            width={"100%"}
            gap={"3"}
            className="mt-4"
          >
            <Button
              className="mt-4 cursor-pointer"
              size={3}
              type="button"
              color="red"
              onClick={() => setEditDialogOpen(false)}
            >
              Discard Changes
            </Button>
            <Button
              className="mt-4 cursor-pointer"
              size={3}
              type="submit"
              color="green"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={"2"} /> : "Save Changes"}
            </Button>
          </Flex>
        </form>
        <Toaster position="top-right" />
      </>
    );
  };

  useEffect(() => {
    fetchRoles();
    fetchStaffData();
  }, []);

  return (
    <>
      {editDialogOpen ? (
        <EditDialog />
      ) : (
        <div>
          <TextField.Root
            placeholder="Search admins.."
            className="w-[55%] mb-5"
          >
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
                              <Button
                                variant="surface"
                                className="cursor-pointer"
                              >
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

          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
};

export default AllAdmins;
