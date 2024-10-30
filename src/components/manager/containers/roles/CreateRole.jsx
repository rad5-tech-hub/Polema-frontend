import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Select,
  Button,
  Heading,
  Separator,
  CheckboxGroup,
  Checkbox,
  TextField,
  Text,
  Flex,
  Spinner,
  Grid,
} from "@radix-ui/themes";
import { useSelector } from "react-redux";

import UpdateURL from "../ChangeRoute";

const CreateRole = ({ child, setChild }) => {
  // Root URL for making requests
  const root = import.meta.env.VITE_ROOT;

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
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
        toast.success("Role created successfully", {
          duration: 6500,
          style: {
            padding: "25px",
          },
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          toast.error(error.response.data.message || "Failed to create role", {
            duration: 6500,
            style: {
              padding: "25px",
            },
          });
        } else if (error.request) {
          console.log(error.request);
          toast.error("No response received from the server", {
            duration: 6500,
            style: {
              padding: "25px",
            },
          });
        } else {
          console.log("Error", error.message);
          toast.error("Request error occurred", {
            duration: 6500,
            style: {
              padding: "25px",
            },
          });
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
      toast.error(err.message, {
        duration: 6500,
        style: {
          padding: "25px",
        },
      });
      setPermissionsLoading(false);
    }
  };

  // Fetch Permission and token on page load

  useEffect(() => {
    fetchPermissions();
  }, []);
  return (
    <div className="!font-space">
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
                          <Flex gap={"2"} align={"center"}>
                            {/* <input type="checkbox" id="usersAll" onChange={handleAll} /> */}
                            {/* <label htmlFor="usersAll">Select All</label> */}
                          </Flex>
                        </Flex>
                        <Separator className="w-full mt-3" />
                        {/* <Flex className="mt-4 w-full justify-between"> */}
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
                <Button
                  className="mt-4 "
                  size={3}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size={"2"} /> : "Create Role"}
                </Button>
              </Flex>
            </div>
          )}
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateRole;
