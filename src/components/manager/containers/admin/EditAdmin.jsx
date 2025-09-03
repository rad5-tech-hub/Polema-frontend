import React, { useEffect, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Select,
  Button,
  Heading,
  Separator,
  TextField,
  Grid,
  Flex,
  Text,
  Skeleton,
  Spinner,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import useToast from "../../../../hooks/useToast";
import SignatureCanvas from "../../../signature-pad/SignatureCanvas";

const root = import.meta.env.VITE_ROOT;

const EditAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [rolesArray, setRolesArray] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [additionalDepartments, setAdditionalDepartments] = useState([]);
  const [adminDepartments, setAdminDepartments] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [address, setAddress] = useState("");
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

  const showToast = useToast();

  // Fetch departments
  const fetchDept = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-rolePerm`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRolesArray(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch admins
  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.staffList);
      setSkeletonLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Get admin name by ID
  const getAdminNameById = (id) => {
    const adminDetails = admins.find((item) => item.id === id);
    return adminDetails
      ? `${adminDetails.firstname} ${adminDetails.lastname}`
      : "Admin Name not found";
  };

  // Get admin details by ID
  const getAdminsDetailsFromID = (id) => {
    const details = admins.find((item) => item.id === id);
    return details ? details : "";
  };

  // Update form details
  const updateFormDetails = () => {
    const adminDetails = getAdminsDetailsFromID(id);
    setFirstName(adminDetails.firstname || "");
    setLastName(adminDetails.lastname || "");
    setPhone(adminDetails.phoneNumber || "");
    setEmail(adminDetails.email || "");
    setRoleId(adminDetails.roleId || "");
    setAddress(adminDetails.address || "");

    if (typeof adminDetails.department === "string") {
      try {
        setAdminDepartments(JSON.parse(adminDetails.department) || []);
      } catch (error) {
        console.error("Failed to parse department JSON:", error);
        setAdminDepartments([]);
      }
    } else {
      setAdminDepartments(
        Array.isArray(adminDetails.department) ? adminDetails.department : []
      );
    }
  };

  useEffect(() => {
    fetchDept();
    fetchRoles();
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!skeletonLoading) {
      updateFormDetails();
    }
  }, [skeletonLoading]);

  // Handle updating existing department
  const handleExistingDepartmentChange = (index, value) => {
    setAdminDepartments((prev) =>
      prev.map((dept, i) => (i === index ? value : dept))
    );
  };

  // Handle removing existing department
  const handleRemoveExistingDepartment = (index) => {
    setAdminDepartments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle adding a new department input
  const handleAddDepartment = () => {
    setAdditionalDepartments((prev) => [...prev, ""]);
  };

  // Handle updating a new department value
  const handleUpdateDepartment = (index, value) => {
    setAdditionalDepartments((prev) =>
      prev.map((dept, i) => (i === index ? value : dept))
    );
  };

  // Handle removing a new department
  const handleRemoveDepartment = (index) => {
    setAdditionalDepartments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      setIsLoading(false);
      return;
    }

    const submitObject = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phoneNumber: phone,
      ...(address && { address }),
      ...(signatureImage && { signature: signatureImage }),
      roleId,
      department: [...adminDepartments, ...additionalDepartments].filter(
        (dept) => dept !== ""
      ),
    };

    try {
      const response = await axios.patch(
        `${root}/admin/update-staff/${id}`,
        submitObject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast({
        message: response.data.message,
        type: "success",
        duration: 5000,
      });
      setIsLoading(false);

      setTimeout(() => {
        navigate("/admin/admins/view-admins");
      }, 5000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("An error occurred.", {
        duration: 10000,
        style: { padding: "20px" },
      });
    }
  };

  return (
    <div className="!font-space">
      <Card className="w-full">
        <Heading className="text-left py-4">
          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate(`/admin/admins/view-admins`);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <>
              {skeletonLoading ? (
                <Skeleton className="w-[300px] h-[45px]" />
              ) : (
                <p>Edit {getAdminNameById(id)} Profile</p>
              )}
            </>
          </div>
        </Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <Grid columns={"2"} gap={"3"}>
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="firstname"
              >
                First Name
              </label>
              <TextField.Root
                placeholder="Enter First Name"
                id="firstname"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>

            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="lastname"
              >
                Last Name
              </label>
              <TextField.Root
                placeholder="Enter Last Name"
                id="lastname"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>

            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <TextField.Root
                placeholder="Enter Phone Number"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
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
                placeholder="Enter Email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="role"
              >
                Assign Role
              </label>
              <Select.Root onValueChange={setRoleId} value={roleId}>
                <Select.Trigger
                  className="w-full mt-2"
                  placeholder="Select Role"
                />
                <Select.Content position="popper">
                  {rolesArray.map((role) => (
                    <Select.Item key={role.id} value={role.id}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <div className="input-field mt-3">
              <Text className="text-[15px] font-medium leading-[35px]">
                Signature
              </Text>
              <Flex
                className="w-full mt-2"
                onClick={() => {
                  setCanvasVisible(!canvasVisible);
                }}
              >
                <TextField.Root
                  placeholder="Sign Here"
                  value={""}
                  disabled
                  className="w-[70%]"
                ></TextField.Root>
                <Button
                  className="w-[30%] bg-theme cursor-pointer"
                  type="button"
                >
                  Sign
                </Button>
              </Flex>
            </div>
            {canvasVisible && (
              <div className="block">
                <SignatureCanvas onSave={setSignatureImage} />
              </div>
            )}
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="address"
              >
                Address
              </label>
              <TextField.Root
                placeholder="Enter Address"
                className="mt-2"
                id="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </div>

            {Array.isArray(adminDepartments) &&
              adminDepartments.map((dept, index) => (
                <div
                  key={`existing-dept-${index}`}
                  className="input-field mt-3"
                >
                  <div className="flex justify-between items-center">
                    <label
                      className="text-[15px] font-medium leading-[35px]"
                      htmlFor={`existing-dept-${index}`}
                    >
                      Department {index + 1}
                    </label>
                    <p
                      className="text-red-500 text-sm cursor-pointer underline"
                      onClick={() => handleRemoveExistingDepartment(index)}
                    >
                      -Remove
                    </p>
                  </div>
                  <Select.Root
                    value={dept}
                    onValueChange={(value) =>
                      handleExistingDepartmentChange(index, value)
                    }
                  >
                    <Select.Trigger
                      className="mt-2 w-full"
                      placeholder="Select Department"
                    />
                    <Select.Content>
                      {Array.isArray(departments) &&
                        departments.map((d) => (
                          <Select.Item key={d.id} value={d.id}>
                            {d.name}
                          </Select.Item>
                        ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              ))}
          </Grid>
          {additionalDepartments.length !== 0 && (
            <Card className="mt-4">
              <Grid columns={"2"} gap={"3"}>
                {additionalDepartments.map((value, index) => (
                  <div key={`new-dept-${index}`} className="input-field mt-2">
                    <div className="flex justify-between items-center">
                      <label
                        className="text-[15px] font-medium leading-[35px]"
                        htmlFor={`new-dept-${index}`}
                      >
                        New Department {index + 1}
                      </label>
                      <p
                        className="text-red-500 text-sm cursor-pointer underline"
                        onClick={() => handleRemoveDepartment(index)}
                      >
                        -Remove
                      </p>
                    </div>
                    <Select.Root
                      value={value}
                      onValueChange={(selectedValue) =>
                        handleUpdateDepartment(index, selectedValue)
                      }
                    >
                      <Select.Trigger
                        className="w-full mt-2"
                        placeholder="Select Additional Department"
                      />
                      <Select.Content position="popper">
                        {departments.map((dept) => (
                          <Select.Item key={dept.id} value={dept.id}>
                            {dept.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>
                ))}
              </Grid>
            </Card>
          )}

          <Button type="button" onClick={handleAddDepartment} className="mt-10">
            <Flex align={"center"} gap={"1"}>
              <PlusIcon />
              Add Department
            </Flex>
          </Button>

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4 bg-theme hover:bg-theme/85"
              size={3}
              type="submit"
            >
              {isLoading ? <LoaderIcon /> : "Save"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default EditAdmin;
