import React, { useEffect, useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import axios from "axios";
import UpdateURL from "../ChangeRoute";
import {
  Card,
  Select,
  Button,
  Heading,
  Separator,
  CheckboxGroup,
  Checkbox,
  TextField,
  Grid,
  Text,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AddAdmin = ({ child, setChild }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rolesArray, setRolesArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departments, setDepartments] = useState([]);

  // State management for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [roleId, setRoleId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [deptId, setDeptID] = useState("");

  // Function to fetch departments
  const fetchDept = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred,try logging in again.");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data.departments);
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

    const resetForm = () => {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setRoleId("");
      setConfirmPassword("");
      setPhone("");
      setDeptID("");
    };

    const submitobject = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phoneNumber: phone,
      ...(deptId && { department: [deptId] }),
      roleId,
      // password: password,
      // confirmPassword: confirmPassword,
    };

    try {
      const response = await axios.post(
        `${root}/admin/reg-staff`,
        submitobject,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      toast.success(response.data.message, {
        duration: 5500,
        style: {
          padding: "25px",
        },
      });

      setIsLoading(false);
      resetForm();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      toast.error(error.response.data.error, {
        duration: 6500,
        style: {
          padding: "25px",
        },
      });
    }
  };

  // Fetch departments and roles
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-rolePerm`, {
        headers: {
          Authorization: `Beaer ${retrToken}`,
        },
      });

      setRolesArray(response.data);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // Fetch departments and roles on page load
  useEffect(() => {
    fetchDepartments();
    fetchDept();
  }, []);
  return (
    <div className="!font-space">
      <Card className="w-full">
        <Heading className="text-left py-4">Create Admin</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <Grid columns={"2"} gap={"3"}>
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
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
                size={"3"}
              ></TextField.Root>
            </div>

            <div className="mt-3 input-field">
              <label
                className="text-[15px]  font-medium leading-[35px]   "
                htmlFor="password"
              >
                Last Name
              </label>
              <TextField.Root
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className=""
                type="text"
                id="lastname"
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
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="Enter phone number"
                className=""
                id="number"
                type="number"
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
                value={email}
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
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
                onValueChange={(val) => {
                  setRoleId(val);
                }}
              >
                <Select.Trigger
                  className="w-full mt-2"
                  placeholder="Select Role"
                />
                <Select.Content position="popper">
                  {rolesArray.map((item) => {
                    return (
                      <Select.Item value={item.id}>{item.name}</Select.Item>
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
                className="mt-1"
                type="text"
                id="department"
                size={"3"}
              ></TextField.Root>
            </div>

            {/* <div className="mt-3 input-field">
              <label
                className="text-[15px]  font-medium leading-[35px]   "
                htmlFor="passwordConfirm"
              >
                Confirm Password
              </label>
              <TextField.Root
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className=""
                type={showConfirmPassword ? "password" : "text"}
                id="passwordConfirm"
                size={"3"}
              >
                <span
                  className="p-2 mt-1 cursor-pointer"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </span>
              </TextField.Root>
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="flex"
                type={showPassword ? "password" : "text"}
                id="password"
                size={"3"}
              >
                <span
                  className="p-2 mt-1 cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </span>
              </TextField.Root>
            </div>
             */}
            <div className="mt-3 input-field">
              <label
                className="text-[15px]  font-medium leading-[35px]   "
                htmlFor="role"
              >
                Department
              </label>
              <Select.Root
                onValueChange={(val) => {
                  setDeptID(val);
                }}
              >
                <Select.Trigger
                  className="w-full mt-2"
                  placeholder="Select Department"
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
          </Grid>

          {/* Permissions Div */}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4  bg-theme hover:bg-theme/85"
              size={3}
              type="submit"
              disabled={isLoading}
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

export default AddAdmin;
