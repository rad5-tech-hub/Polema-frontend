

import useToast from "../../../../hooks/useToast";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionBox, setPermissionBox] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [defaultRoleName, setDefaultRoleName] = useState("");
  const [defaultRoles, setDefaultRoles] = useState(new Set());
  const [roleId, setRoleId] = useState("");
const showToast = useToast()
  const root = import.meta.env.VITE_ROOT;
  const { id } = useParams();
  const navigate = useNavigate();

  // Function to get details for a specific role
  const getARole = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: { padding: "20px" },
        duration: 5500,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-a-role/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = response.data;
      const navParents = role.navParents;
      setRoleName(role.name);
      setDefaultRoleName(role.name);
      setRoleId(role.id);

      // Extract permission IDs
      const permissionIds = navParents
        .flatMap((parent) => parent.permissions)
        .map((permission) => String(permission.id)); // Convert IDs to strings

      setDefaultRoles(new Set(permissionIds)); // Use Set for lookups
      setSelectedCheckboxes(permissionIds); // Sync selectedCheckboxes
    } catch (error) {
      console.error("Failed to fetch role:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;

    setDefaultRoles((prevRoles) => {
      const updatedRoles = new Set(prevRoles);

      if (checked) {
        updatedRoles.add(id); // Add the ID if checked
      } else {
        updatedRoles.delete(id); // Remove the ID if unchecked
      }

      setSelectedCheckboxes(Array.from(updatedRoles)); // Sync selectedCheckboxes
      return updatedRoles;
    });
  };

  const handleSelectAll = (navParentName, permissions, checked) => {
    setDefaultRoles((prevRoles) => {
      const updatedRoles = new Set(prevRoles);

      permissions.forEach((item) => {
        const itemId = String(item.id);
        if (checked) {
          updatedRoles.add(itemId);
        } else {
          updatedRoles.delete(itemId);
        }
      });

      setSelectedCheckboxes(Array.from(updatedRoles));
      return updatedRoles;
    });
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${root}/admin/get-all-nav`);
      setPermissionBox(response.data.navParentsWithPermissions);
    } catch (err) {
      toast.error("Failed to load permissions");
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: { padding: "20px" },
        duration: 6500,
      });
      return;
    }

    if (selectedCheckboxes.length === 0) {
      toast.error(`Assign Permissions to role: ${defaultRoleName}`, {
        style: { padding: "20px" },
        duration: 4000,
      });
      return;
    }

    const body = {
      permissionsId: selectedCheckboxes,
      name: roleName,
    };

    try {
      await axios.put(`${root}/admin/edit-role/${roleId}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast({
        type: "success",
        message: "Role updated successfully",
        duration:5000
      });
      setTimeout(() => {
        navigate("/admin/admins/view-roles");
      }, 3000);
    } catch (err) {
      showToast({
        type:"error",
        message:"Failed to update role",
        duration:4000
      })
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    getARole();
  }, [id]);

  return (
    <>
      <Card className="w-full">
        <Heading className="py-4">Edit Role</Heading>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="role"
                >
                  Role
                </label>
                <TextField.Root
                  value={roleName}
                  placeholder={defaultRoleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  id="role"
                  size={3}
                />
              </div>
            </div>
          </div>

          {permissionsLoading ? (
            <div className="w-full mt-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div>
              <Separator className="w-full mt-4" />
              <div className="permission-box mt-5">
                <Grid columns={"2"} gap={"7"}>
                  {permissionBox.map((box, index) => {
                    const allSelected = box.permissions.every((item) =>
                      defaultRoles.has(String(item.id))
                    );

                    return (
                      <Card className="w-full" key={index}>
                        <Flex justify={"between"} align={"center"}>
                          <Text className="font-medium">
                            {box.navParentName}
                          </Text>
                          <div className="flex gap-2">
                            <p>Select All</p>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={(e) =>
                                handleSelectAll(
                                  box.navParentName,
                                  box.permissions,
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                        </Flex>
                        <Separator className="w-full mt-3" />
                        <Grid className="mt-4" columns={"2"} gap={"1"}>
                          {box.permissions.map((item) => (
                            <Flex
                              gap={"2"}
                              align={"center"}
                              className="mt-3"
                              key={item.id}
                            >
                              <input
                                type="checkbox"
                                id={item.id}
                                checked={defaultRoles.has(String(item.id))}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor={item.id}>{item.name}</label>
                            </Flex>
                          ))}
                        </Grid>
                      </Card>
                    );
                  })}
                </Grid>
              </div>
              <Flex justify={"end"} gap={"3"}>
                <Button
                  color="red"
                  size={3}
                  type="button"
                  onClick={() => navigate("/admin/admins/view-roles")}
                >
                  Discard Changes
                </Button>
                <Button size={3} type="submit">
                  {isLoading ? <Spinner size={"2"} /> : "Save Changes"}
                </Button>
              </Flex>
            </div>
          )}
        </form>
      </Card>
      <Toaster position="top-right" />
    </>
  );
};

export default EditRole;
