import React, { useEffect, useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { refractor } from "../../../date";
import { DeleteIcon, DropDownIcon, Suspend } from "../../../icons";
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import { Heading, Spinner, Table, Button } from "@radix-ui/themes";
import UpdateURL from "../ChangeRoute";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

// Delete Dialog Box
const DeleteDialog = ({ isOpen, onClose, user, id }) => {
  // State management for loading icon on button
  const [suspendLoading, setSuspendLoading] = useState(false);

  const deleteRole = async () => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    alert("Endpoint for deleting role not available.");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Delete Role
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to delete this role ?`}
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
                deleteRole(id);
              }}
              disabled={suspendLoading}
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

// Edit Content Box
const EditRole = ({ isOpen, onClose, id }) => {
  // Root URL for making requests
  const root = import.meta.env.VITE_ROOT;

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

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

  const handleAll = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      console.log(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitobject = {
      name: e.target[0].value,
      permissionsId: selectedCheckboxes,
    };

    console.log(submitobject);
    if (submitobject.name === "") {
      toast.error("Assign a name to the role");
    } else if (submitobject.permissionsId.length === 0) {
      toast.error("Assign tasks to the role");
    } else {
      setIsLoading(true);

      // Get the token
      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");
        setIsLoading(false); // Ensure loading state is reset
        return;
      }

      console.log(submitobject);

      try {
        // Make the API request with await
        const response = await axios.post(
          `${root}/admin/create-role`,
          submitobject,
          {
            headers: {
              Authorization: `Bearer ${retrToken}`,
            },
          }
        );

        console.log(response);
        toast.success("Role created successfully");
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          toast.error(error.response.data.message || "Failed to create role");
        } else if (error.request) {
          console.log(error.request);
          toast.error("No response received from the server");
        } else {
          console.log("Error", error.message);
          toast.error("Request error occurred");
        }
      } finally {
        // Reset loading state
        setIsLoading(false);
      }
    }
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
      console.log(response);

      {
        response.status === 200 && toast.success("Loaded Successfully.");
      }
      setPermissionsLoading(false);
    } catch (err) {
      toast.error(err.message);
      setPermissionsLoading(false);
    }
  };

  // Fetch Permission and token on page load

  useEffect(() => {
    fetchPermissions();
  }, []);
  return (
    <div className="!font-space">
      <UpdateURL url={"/create-role"} />
      <Card className="w-full">
        <Heading className=" py-4">Create Role</Heading>

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
                  placeholder="Enter Role"
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
                              <Flex gap={"2"} align={"center"} className="mt-3">
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

              <Flex justify={"end"} align={"end"} width={"100%"}>
                <Button className="mt-4 " size={3} type="submit">
                  {isLoading ? <Spinner size={"2"} /> : "Create Role"}
                </Button>
              </Flex>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

const AllRoles = () => {
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State management for delete dilog boxes
  const [selectedRole, setSelectedRole] = useState(null);

  // Function for handling delete dialog
  const handleDeleteClick = (staff) => {
    setSelectedRole(staff);
  };

  // State management for edit dialog boxes
  const [editRole, setEditRole] = useState(null);

  // Function for handling edit dialog
  const handleEdit = (role) => {
    setEditRole(role);
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
      toast.error("An error occurred .Try again ");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <UpdateURL url={"/view-roles"} />
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
                              onClick={() => console.log("Cliced")}
                            >
                              Edit
                            </DropdownMenu.Item>
                            {}
                            {/* <DropdownMenu.Item
                              color="red"
                              shortcut={<DeleteIcon />}
                              onClick={() => setSelectedRole(role)}
                            >
                              Delete
                            </DropdownMenu.Item> */}
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
      {selectedRole && (
        <DeleteDialog
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(null)}
          id={selectedRole.id}
        />
      )}

      {editRole && <EditRole />}
    </>
  );
};

export default AllRoles;
