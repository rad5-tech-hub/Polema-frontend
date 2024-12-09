import React, { useEffect, useState } from "react";

import { refractor } from "../../../date";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { DropDownIcon, Suspend } from "../../../icons";

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
  Grid,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const root = import.meta.env.VITE_ROOT;

const SuspendDialog = ({ isOpen, onClose, runFetch, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);

  const suspendAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

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
      toast.error(error.response?.data.error || error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="relative w-[90vw] max-w-[450px] bg-white rounded-[6px] p-[25px] shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-[17px] font-medium text-black">Suspend User</h2>
          <button onClick={onClose} className="focus:outline-none">
            <FontAwesomeIcon icon={faClose} color="black" />
          </button>
        </div>

        <p className="mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
          {`Are you sure you want to suspend this user?`}
        </p>

        <div className="flex justify-end mt-[25px]">
          <button
            onClick={onClose}
            className="bg-blue-700 text-white px-[15px] h-[35px] rounded-[4px] font-medium focus:outline-none"
          >
            No
          </button>
          <button
            onClick={() => suspendAdmin(id)}
            className="ml-4 bg-red-500 text-white hover:bg-red-600 px-[15px] h-[35px] rounded-[4px] font-medium focus:outline-none"
          >
            {suspendLoading ? <LoaderIcon /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
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
  };

  const EditDialog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [firstname, setFirstname] = useState(adminForEdit.firstname);
    const [lastname, setLastName] = useState(adminForEdit.lastname);
    const [email, setEmail] = useState(adminForEdit.email);
    const [address, setAddress] = useState(adminForEdit.address || "");
    const [number, setNumber] = useState(adminForEdit.phoneNumber);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(adminForEdit.roleId);
    const [rolesArray, setRolesArray] = useState([]);
    const [adminDepartments, setAdminDepartments] = useState(
      JSON.parse(adminForEdit.department)
    );
    const [departments, setDepartments] = useState([]);

    const [roleID, setRoleId] = useState("");

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to fetch departments
    const fetchDept = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("An error occurred ,try logging in again", {
          duration: 7000,
          style: {
            padding: "20px",
          },
        });
        return;
      }

      try {
        const response = await axios.get(`${root}/dept/view-department`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const departments = response.data?.departments || [];

        setDepartments(departments);
      } catch (e) {
        console.log(e);
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
        ...(password && { password: password }),
        email,
        ...(confirmPassword && { confirmPassword: confirmPassword }),
        roleId: roleID,
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

        toast.error(error.response.data.error);
      }
    };

    useEffect(() => {
      fetchRoles();
      fetchDept();
    }, []);

    return (
      <>
        <Heading>Edit Admin</Heading>
        <Separator className="w-full my-3" />
        <form onSubmit={handleSubmit}>
          <Grid columns={"2"} gap={"4"}>
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
              <label className="text-[15px] font-medium leading-[35px]">
                Address
              </label>
              <TextField.Root
                placeholder="Enter Address"
                onChange={(e) => setAddress(e.target.value)}
                defaultValue={address}
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
                htmlFor="role"
              >
                Assign Role
              </label>
              <Select.Root
                size={"3"}
                defaultValue={role}
                onValueChange={(val) => {
                  setRoleId(val);
                }}
              >
                <Select.Trigger className="w-full" placeholder="Assign Role" />
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
            {/* Sections for various departments */}
            {adminDepartments === null ? (
              <div className="mt-3 input-field">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="passwordConfirm"
                >
                  Department
                </label>
                <Select.Root size={"3"}>
                  <Select.Trigger
                    placeholder="View Department Ledger"
                    className="w-full "
                  />
                  <Select.Content position="popper">
                    {departments.map((item) => {
                      return (
                        <Select.Item value={item.id}>{item.name}</Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
            ) : (
              adminDepartments.map((item, index) => {
                return (
                  <div className="mt-3 input-field">
                    <label
                      className="text-[15px] font-medium leading-[35px]"
                      htmlFor="passwordConfirm"
                    >
                      Department {index + 1}
                    </label>
                    <Select.Root size={"3"} defaultValue={item}>
                      <Select.Trigger
                        placeholder="View Department Ledger"
                        className="w-full "
                      />
                      <Select.Content position="popper">
                        {departments.map((deptItem) => {
                          return (
                            <Select.Item value={deptItem.id}>
                              {deptItem.name}
                            </Select.Item>
                          );
                        })}
                      </Select.Content>
                    </Select.Root>
                  </div>
                );
              })
            )}
          </Grid>

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
          <Heading>Admins</Heading>
          <Table.Root variant="surface" size={"3"} className="mt-4">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
                        <div className="mt-2 right-4 top-2">
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
