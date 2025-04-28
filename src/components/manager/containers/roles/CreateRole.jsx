import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import {
  Card,
  Button,
  Heading,
  Separator,
  Flex,
  Spinner,
  Grid,
  TextField,
} from "@radix-ui/themes";

const CreateRole = () => {
  const showToast = useToast();
  const root = import.meta.env.VITE_ROOT;
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionBox, setPermissionBox] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [roleName, setRoleName] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      const retrToken = localStorage.getItem("token");
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again.");
        return;
      }
      try {
        const response = await axios.get(`${root}/admin/get-all-nav`);
        const fetchedPermissions = response.data.navParentsWithPermissions;

        const initialState = fetchedPermissions.reduce((acc, box) => {
          acc[box.navParentName] = [];
          return acc;
        }, {});

        setPermissionBox(fetchedPermissions);
        setSelectedCheckboxes(initialState);
        setPermissionsLoading(false);
      } catch (err) {
        toast.error(err.message);
        setPermissionsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (boxName, permissionId) => {
    setSelectedCheckboxes((prevSelected) => {
      const updatedPermissions = prevSelected[boxName].includes(permissionId)
        ? prevSelected[boxName].filter((id) => id !== permissionId)
        : [...prevSelected[boxName], permissionId];

      return {
        ...prevSelected,
        [boxName]: updatedPermissions,
      };
    });
  };

  const handleSelectAll = (boxName, permissions) => {
    setSelectedCheckboxes((prevSelected) => ({
      ...prevSelected,
      [boxName]:
        prevSelected[boxName].length === permissions.length
          ? []
          : permissions.map((p) => p.id),
    }));
  };

  const handleGlobalSelectAll = () => {
    setSelectAll((prev) => !prev);
    setSelectedCheckboxes((prevSelected) => {
      if (!selectAll) {
        const allSelectedState = permissionBox.reduce((acc, box) => {
          acc[box.navParentName] = box.permissions.map((p) => p.id);
          return acc;
        }, {});
        return allSelectedState;
      } else {
        return permissionBox.reduce((acc, box) => {
          acc[box.navParentName] = [];
          return acc;
        }, {});
      }
    });
  };

  // const handleSubmit = async () => {
  //   setIsLoading(true);
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     toast.error("An error occurred , try logging in again");
  //     return;
  //   }
  //   if (!name || name.length === 0){
  //     toast.error("Assign a name to the role");
  //     return
  //   }

  //   try {
  //     const payload = {
  //       name: roleName,
  //       permissionsId: Object.values(selectedCheckboxes).flat(),
  //     };
  //     await axios.post(`${root}/admin/create-role`, payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     
  //   } catch (err) {
  //     toast.error("Error creating role");
  //   }
  //   setIsLoading(false);
  // };
const handleSubmit = async () => {
  setIsLoading(true);
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("An error occurred, try logging in again");
    setIsLoading(false);
    return;
  }

  if (!roleName.trim()) {
    toast.error("Assign a name to the role", {
      style:{
        padding:"30px"
      },duration:3000
    });
    setIsLoading(false);
    return;
  }

  try {
    const payload = {
      name: roleName,
      permissionsId: Object.values(selectedCheckboxes).flat(),
    };

    await axios.post(`${root}/admin/create-role`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast({
      message:"Role Created Successfully",
      type: "success",
      duration:5000
    })

    // ✅ Clear form after success
    setRoleName("");
    setSelectedCheckboxes({});
    setSelectAll(false);
  } catch (err) {
      showToast({
      message:"Error creating role",
      type: "error",
      duration:5000
    })
    
  }

  setIsLoading(false);
};

  return (
    <div className="!font-space">
      <Card className="w-full">
        <Heading className="py-4">Create Role</Heading>
        <label htmlFor="">Role Name</label>
        <TextField.Root
          placeholder="Enter Role Name"
          className="w-[65%]"
          value={roleName}
          onChange={(e) => {
            setRoleName(e.target.value);
          }}
        ></TextField.Root>
        {permissionsLoading ? (
          <div className="w-full mt-8 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <Separator className="w-full mt-4" />
            <Flex justify="end" align="center" className="mb-4">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleGlobalSelectAll}
              />
              <span className="ml-2">Select All Roles</span>
            </Flex>
            <div className="permission-box mt-5">
              <Grid columns="2" gap="7">
                {permissionBox.map((box, index) => {
                  const allSelected =
                    selectedCheckboxes[box.navParentName]?.length ===
                    box.permissions.length;
                  return (
                    <Card className="w-full" key={index}>
                      <Flex justify="between" align="center">
                        <span className="font-medium">{box.navParentName}</span>
                        <Flex gap="2" align="center">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() =>
                              handleSelectAll(
                                box.navParentName,
                                box.permissions
                              )
                            }
                          />
                          Select All
                        </Flex>
                      </Flex>
                      <Separator className="w-full mt-3" />
                      <Grid className="mt-4" columns="2" rows="3" gap="1">
                        {box.permissions.map((item) => (
                          <Flex
                            key={item.id}
                            gap="2"
                            align="center"
                            className="mt-3"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCheckboxes[
                                box.navParentName
                              ]?.includes(item.id)}
                              onChange={() =>
                                handleCheckboxChange(box.navParentName, item.id)
                              }
                            />
                            <label>{item.name}</label>
                          </Flex>
                        ))}
                      </Grid>
                    </Card>
                  );
                })}
              </Grid>
            </div>
            <Flex justify="end" width="100%">
              <Button
                className="mt-4 bg-theme hover:bg-theme/85 cursor-pointer"
                size="3"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? <Spinner size="2" /> : "Create Role"}
              </Button>
            </Flex>
          </div>
        )}
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateRole;
