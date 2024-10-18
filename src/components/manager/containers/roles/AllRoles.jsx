import React, { useEffect, useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { refractor } from "../../../date";
import { DeleteIcon, DropDownIcon, Suspend } from "../../../icons";
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Spinner,
  Table,
  Button,
  Separator,
  Grid,
  Flex,
  Text,
  Card,
  TextField,
} from "@radix-ui/themes";
import UpdateURL from "../ChangeRoute";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const AllRoles = () => {
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State management for delete dilog boxes
  const [selectedRole, setSelectedRole] = useState("");

  //State manangement to check if edit role dialog is open
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // State management for edit dialog boxes
  const [editRole, setEditRole] = useState(null);

  // Function for handling edit dialog
  const handleEdit = (role) => {
    setEditDialogOpen(true);
    setSelectedRole(role);
  };

  const fetchRoles = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "20px",
        },
      });

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-roles`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      setLoading(false);

      response.data.roles = undefined
        ? setRolesList([])
        : setRolesList(response.data.roles);

      toast.success("Retrieved Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred .Try again ");
    }
  };

  // function to manage editing of roles for a singular role
  const editStaff = (role) => {
    selectedRole(role);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Edit Content Box
  const EditRole = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");

    const [roleName, setRoleName] = useState(selectedRole.name);
    // Default loader until permissions fetch
    const [permissionsLoading, setPermissionsLoading] = useState(true);

    // State management for permission fetch
    const [permissionBox, setPermissionBox] = useState([]);

    // Array for all selected permissions/roles
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const handleCheckboxChange = (event) => {
      const { id, checked } = event.target;
      if (checked) {
        setSelectedCheckboxes((prevSelected) => [...prevSelected, id]);
      } else {
        setSelectedCheckboxes((prevSelected) =>
          prevSelected.filter((checkboxId) => checkboxId !== id)
        );
      }
    };

    // Fetch token from local storage
    const fetchToken = async () => {
      const retrToken = await localStorage.getItem("token");

      setToken(retrToken);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const submitobject = {
        permissionsId: selectedCheckboxes,
      };

      setIsLoading(true);

      // Get the token
      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");
        setIsLoading(false);
        return;

        console.log(submitobject);

        // try {
        //   // Make the API request with await
        //   const response = await axios.post(
        //     `${root}/admin/create-role`,
        //     submitobject,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${retrToken}`,
        //       },
        //     }
        //   );

        //   console.log(response);
        //   toast.success("Role created successfully");
        // } catch (error) {
        //   if (error.response) {
        //     console.log(error.response.data);
        //     toast.error(error.response.data.message || "Failed to create role");
        //   } else if (error.request) {
        //     console.log(error.request);
        //     toast.error("No response received from the server");
        //   } else {
        //     console.log("Error", error.message);
        //     toast.error("Request error occurred");
        //   }
        // } finally {
        //   // Reset loading state
        //   setIsLoading(false);
        // }
      }

      // try {
      //   const response = await axios.patch(
      //     `${root}/add-permission/${selectedRole.id}/permissions`,
      //     { submitobject },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${retrToken}`,
      //       },
      //     }
      //   );
      //   console.log(response);
      // } catch (error) {
      //   console.log(error);
      // }

      alert("Endpoint not functional");
    };

    // function to fetch the permission boxes from database
    const fetchPermissions = async () => {
      // Get the token
      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occured.Try logging in again");
        return;
      }

      try {
        // Make the API request
        const response = await axios.get(`${root}/admin/get-all-nav`, {});

        setPermissionBox(response.data.navParentsWithPermissions);

        {
          response.status === 200 && toast.success("Loaded Successfully.");
        }
        setPermissionsLoading(false);
      } catch (err) {
        toast.error(err.message);
        setPermissionsLoading(false);
      }
    };

    useEffect(() => {
      fetchPermissions();
    }, []);
    return (
      <div className="!font-space">
        <Card className="w-full">
          <Heading className=" py-4">Edit Role</Heading>

          <form onSubmit={handleSubmit}>
            <div className="flex w-full justify-between gap-8">
              <div className="left w-[50%]">
                <div className="input-field mt-3">
                  <label
                    className="text-[15px]  font-medium leading-[35px]   "
                    htmlFor="role"
                  >
                    Role
                  </label>

                  <TextField.Root
                    defaultValue={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter Role"
                    value={roleName}
                    className=""
                    type="text"
                    id="role"
                    size={"3"}
                  ></TextField.Root>
                </div>
              </div>
            </div>

            {/* Permissions Div */}
            {permissionsLoading ? (
              <div className="w-full  mt-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div>
                <Separator className="w-full mt-4" />
                <div className="permission-box mt-5">
                  {/* Users & Role */}

                  <Grid columns={"2"} gap={"7"}>
                    {permissionBox.map((box, index) => {
                      return (
                        <Card className="w-full" id="users" key={index}>
                          <Flex justify={"between"} align={"center"}>
                            <Text className="font-medium">
                              {box.navParentName}
                            </Text>
                            <Flex gap={"2"} align={"center"}></Flex>
                          </Flex>
                          <Separator className="w-full mt-3" />

                          <Grid
                            className="mt-4"
                            columns={"2"}
                            rows={"3"}
                            gap={"1"}
                            height={"auto"}
                          >
                            {box.permissions.map((item) => {
                              return (
                                <Flex
                                  gap={"2"}
                                  align={"center"}
                                  className="mt-3"
                                >
                                  <input
                                    type="checkbox"
                                    name=""
                                    id={item.id}
                                    onChange={handleCheckboxChange}
                                  />
                                  <label htmlFor={item.id}>{item.name}</label>
                                </Flex>
                              );
                            })}
                            {/* </div> */}
                          </Grid>
                          {/* </Flex> */}
                        </Card>
                      );
                    })}
                  </Grid>
                </div>

                <Flex justify={"end"} align={"end"} width={"100%"} gap={"3"}>
                  <Button
                    className="mt-4 cursor-pointe"
                    color="red"
                    size={3}
                    type="submit"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Discard Changes
                  </Button>
                  <Button className="mt-4 " size={3} type="submit">
                    {isLoading ? <Spinner size={"2"} /> : "Save Changes"}
                  </Button>
                </Flex>
              </div>
            )}
          </form>
        </Card>
      </div>
    );
  };

  return (
    <>
      {editDialogOpen ? (
        <EditRole />
      ) : (
        <div>
          <Heading className="mb-4">Roles</Heading>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PERMISSION</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            {loading ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              <Table.Body>
                {rolesList.length === 0 ? (
                  "No Assigned Roles yet"
                ) : (
                  <>
                    {rolesList.map((role, name) => {
                      return (
                        <Table.Row className="relative">
                          <Table.RowHeaderCell>{role.name}</Table.RowHeaderCell>
                          <Table.RowHeaderCell>
                            {role.nav.map((perm) => perm.name).join(", ")}
                          </Table.RowHeaderCell>

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
                                  onClick={() => handleEdit(role)}
                                >
                                  Edit
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Root>
                          </div>
                        </Table.Row>
                      );
                    })}
                  </>
                )}
              </Table.Body>
            )}
          </Table.Root>
        </div>
      )}
    </>
  );
};

export default AllRoles;
