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
  Text,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { Phone } from "../../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Camera } from "../../../icons";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AddAdmin = ({ child, setChild }) => {
  const [value, setValue] = useState("");
  const [id, setID] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rolesArray, setRolesArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleValueChange = (value) => {
    setValue(value);
    setID(value);
  };

  const handleCheckboxChange = (selectedValue) => {
    if (selectedValue === "others") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setSelectedItems((prevItems) => {
        if (prevItems.includes(selectedValue)) {
          return prevItems.filter((item) => item !== selectedValue);
        } else {
          return [...prevItems, selectedValue];
        }
      });
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

    const nameToFind = e.target[6].value;
    const result = rolesArray.find((item) => item.name === nameToFind);

    const submitobject = {
      firstname: e.target[0].value,
      lastname: e.target[4].value,
      email: e.target[1].value,
      phoneNumber: e.target[2].value,
      department: ["marketer"],
      roleId: result.id,
      password: e.target[3].value,
      confirmPassword: e.target[8].value,
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
      console.log(response);
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "25px",
        },
      });

      setIsLoading(false);
      setTimeout(() => {
        window.location.href = "/md/view-admins";
      }, 1500);
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
  }, []);
  return (
    <div className="!font-space">
      <Card className="w-full">
        <Heading className="text-left py-4">Create Admin</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
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
                  id="email"
                  type="text"
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
                  placeholder="Enter phone number"
                  className=""
                  id="number"
                  type="number"
                  size={"3"}
                ></TextField.Root>
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
            </div>

            <div className="right w-[50%]">
              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="password"
                >
                  Last Name
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  className=""
                  type="text"
                  id="lastname"
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
                  value={value}
                  id={id}
                  onValueChange={handleValueChange}
                  size={"3"}
                >
                  <Select.Trigger
                    className="w-full"
                    id="role"
                    placeholder="Select role"
                  >
                    <Flex as="span" align="center" gap="2">
                      <PersonIcon />
                      {value}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    {rolesArray.map((role) => {
                      return (
                        <Select.Item value={role.name} id={role.id}>
                          {role.name}
                        </Select.Item>
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
                  className=""
                  type="text"
                  id="department"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="passwordConfirm"
                >
                  Confirm Password
                </label>
                <TextField.Root
                  placeholder="Confirm Password"
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
            </div>
          </div>

          {/* Permissions Div */}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4 "
              size={3}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={"2"} /> : "Create Admin"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddAdmin;
