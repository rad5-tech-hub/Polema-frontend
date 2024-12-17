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
  Skeleton,
  Spinner,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

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

  // State management for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [address, setAddress] = useState("");
  const [deptId, setDeptID] = useState("");
  const [adminDepartments, setAdminDepartments] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

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

  // Function to fetch admins
  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging in again.");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data.staffList);
      setSkeletonLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get admin name by id
  const getAdminNameById = (id) => {
    const adminDetails = admins.find((item) => item.id === id);
    return adminDetails
      ? `${adminDetails.firstname} ${adminDetails.lastname}`
      : "Admin Name not found";
  };

  // Function to get admin details
  const getAdminsDetailsFromID = (id) => {
    const details = admins.find((item) => item.id === id);
    return details ? details : "";
  };

  // Function to update state on loading
  const updateFormDetails = () => {
    const adminDetails = getAdminsDetailsFromID(id);

    setFirstName(adminDetails.firstname);
    setLastName(adminDetails.lastname);
    setPhone(adminDetails.phoneNumber);
    setEmail(adminDetails.email);
    setRoleId(adminDetails.roleId);
    setAddress(adminDetails.address);

    if (typeof adminDetails.department === "string") {
      try {
        setAdminDepartments(JSON.parse(adminDetails.department));
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
    {
      !skeletonLoading && updateFormDetails();
    }
  }, [skeletonLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    const submitObject = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phoneNumber: phone,
      address,
      roleId,
      ...(deptId &&
        additionalDepartments.length !== 0 && {
          department: [deptId, ...additionalDepartments],
        }),
    };

    console.log(submitObject);
    console.log(allDepartments);

    // try {
    //   const response = await axios.post(
    //     `${root}/admin/reg-staff`,
    //     submitObject,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   toast.success(response.data.message, {
    //     duration: 10000,
    //     style: {
    //       padding: "20px",
    //     },
    //   });
    //   setIsLoading(false);

    //   // Reset form
    //   setFirstName("");
    //   setLastName("");
    //   setEmail("");
    //   setPhone("");
    //   setAddress("");
    //   // setRoleId("");
    //   setDeptID("");
    //   setAdditionalDepartments([]);
    // } catch (error) {
    //   console.log(error);
    //   setIsLoading(false);
    //   toast.error("An error occurred.");
    // }
  };

  const handleAddDepartment = () => {
    // console.log(additionalDepartments);

    additionalDepartments.length === 0
      ? setAdditionalDepartments([""])
      : setAdditionalDepartments([...additionalDepartments, ""]);
  };

  const handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...additionalDepartments];
    updatedDepartments[index] = value;
    // setAdditionalDepartments(updatedDepartments);
  };

  const handleDepartments = (idx, val) => {
    const allDepartments = [
      ...(deptId && deptId),
      ...(adminDepartments.length !== 0 ? adminDepartments : []),
      ...additionalDepartments,
    ];
    console.log(deptId + "deptId");
    console.log(adminDepartments + "admin departments");
    console.log(additionalDepartments + "additional Departments");

    console.log(allDepartments);

    allDepartments[idx] = val;
    setAllDepartments(allDepartments);
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
              <Select.Root onValueChange={setRoleId} defaultValue={roleId}>
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
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="address"
              >
                Address
              </label>
              <TextField.Root
                placeholder="Enter Address "
                className="mt-2"
                id="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </div>

            {Array.isArray(adminDepartments) &&
              adminDepartments.map((_, index) => (
                <div key={`dept-${index}`} className="input-field mt-3">
                  <label
                    className="text-[15px] font-medium leading-[35px]"
                    htmlFor={`dept-${index}`}
                  >
                    Department {index + 1}
                  </label>
                  <Select.Root
                    onValueChange={(value) =>
                      // handleDepartmentChange(index, value)
                      handleDepartments(Number(index), value)
                    }
                    defaultValue={_}
                  >
                    <Select.Trigger
                      className="mt-2 w-full"
                      placeholder="Additional Department"
                    />

                    <Select.Content>
                      {Array.isArray(departments) &&
                        departments.map((dept) => (
                          <Select.Item key={dept.id} value={dept.id}>
                            {dept.name}
                          </Select.Item>
                        ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              ))}

            {additionalDepartments.map((_, index) => (
              <div key={index} className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="dept"
                >
                  {!Array.isArray(adminDepartments)
                    ? `Department ${index + 1}`
                    : `Department ${adminDepartments.length + index + 1}`}
                </label>
                <Select.Root
                  onValueChange={(value) => {
                    if (!Array.isArray(adminDepartments)) {
                      handleDepartments(Number(index), value);
                      // console.log(value + "NOt an array");
                    } else {
                      handleDepartments(Number(index), value);
                      // console.log(value + " an array");
                    }
                  }}
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
              // disabled={isLoading}
            >
              {isLoading ? <LoaderIcon /> : "Create Admin"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default EditAdmin;
