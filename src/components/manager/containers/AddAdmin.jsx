import React, { useEffect, useState } from "react";

import axios from "axios";
import UpdateURL from "./ChangeRoute";
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
import { Phone } from "../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Camera } from "../../icons";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AddAdmin = ({ child, setChild }) => {
  const [value, setValue] = useState("");
  const [id, setID] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rolesArray, setRolesArray] = useState([]);

  const data = rolesArray.reduce((acc, role) => {
    acc[role.name] = {
      label: role.name,
      icon: <PersonIcon />,
    };
    return acc;
  }, {});

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
      department: e.target[7].value,
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
      toast.success(response.data.message);

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      toast.error(error.response.data.error);
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
      <UpdateURL url={"/create-admin"} />
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
                  className=""
                  type="password"
                  id="password"
                  size={"3"}
                ></TextField.Root>
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
                  Department
                </label>
                <TextField.Root
                  placeholder="Department"
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
                  type="password"
                  id="passwordConfirm"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>
          </div>

          {/* Permissions Div */}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button className="mt-4 " size={3} type="submit">
              {isLoading ? <Spinner size={"2"} /> : "Create Admin"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default AddAdmin;

{
  /* <div className="input-field mt-3">
  <label
    className="text-[15px]  font-medium leading-[35px]   "
    htmlFor="products"
  >
    Assign Product(s)
  </label>
  <Select.Root value={selectedItems.join(", ")} size={"3"}>
    <Select.Trigger
      className="w-full"
      id="products"
      placeholder="Select Product(s)"
    >
      <Flex as="span" align="center" gap="2">
        <PersonIcon />
        {selectedItems.length === 0
          ? "Select Product(s)"
          : selectedItems.join(", ")}
      </Flex>
    </Select.Trigger>
    <Select.Content position="popper">
      <CheckboxGroup.Root value={selectedItems}>
        <CheckboxGroup.Item
          value="pkc"
          onClick={() => handleCheckboxChange("pkc")}
        >
          PKC
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="engine-oil"
          onClick={() => handleCheckboxChange("engine-oil")}
        >
          Engine Oil
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="drugs"
          onClick={() => handleCheckboxChange("drugs")}
        >
          Drugs (pharmacy)
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="plastics"
          onClick={() => handleCheckboxChange("plastics")}
        >
          Plastics
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="sludge"
          onClick={() => handleCheckboxChange("sludge")}
        >
          Sludge
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="rvo"
          onClick={() => handleCheckboxChange("rvo")}
        >
          RVO (Refined Vegetable Oil)
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="ledger"
          onClick={() => handleCheckboxChange("ledger")}
        >
          Ledger
        </CheckboxGroup.Item>
        <CheckboxGroup.Item
          value="others"
          onClick={() => handleCheckboxChange("others")}
        >
          Others
        </CheckboxGroup.Item>
      </CheckboxGroup.Root>
    </Select.Content>
  </Select.Root>
</div> */
}

{
  /* {showOtherInput && (
  <div className="input-field mt-3">
    <label
      className="text-[15px]  font-medium leading-[35px]   "
      htmlFor="products"
    >
      Assign Product(s)
    </label>
    <TextField.Root
      placeholder="Add Product"
      className=""
      type="text"
      size={"3"}
      value={otherValue}
      onChange={(e) => setOtherValue(e.target.value)}
      onBlur={handleOtherBlur}
    />
  </div>
)} */
}
