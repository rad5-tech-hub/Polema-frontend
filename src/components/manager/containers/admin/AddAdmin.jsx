import React, { useEffect, useState } from "react";
import SignatureCanvas from "../../../signature-pad/SignatureCanvas";
import { EyeOpenIcon, EyeClosedIcon, PlusIcon } from "@radix-ui/react-icons";
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
  Spinner,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const AddAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rolesArray, setRolesArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

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

  useEffect(() => {
    fetchDept();
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    const submitObject = {
      firstname: firstName,
      lastname: lastName,
      signature: signatureImage,
      
      email: email,
      phoneNumber: phone,
      ...(address && { address: address }),
      roleId,
      ...(deptId &&
        additionalDepartments.length !== 0 && {
          department: [deptId, ...additionalDepartments],
        }),
    };
    try {
      const response = await axios.post(
        `${root}/admin/reg-staff`,
        submitObject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message, {
        duration: 10000,
        style: {
          padding: "20px",
        },
      });
      setIsLoading(false);

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
      // setRoleId("");
      setDeptID("");
      setCanvasVisible(false)
      setAdditionalDepartments([]);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("An error occurred.");
    }
  };

  const handleAddDepartment = () => {
    setAdditionalDepartments([...additionalDepartments, ""]);
  };

  const handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...additionalDepartments];
    updatedDepartments[index] = value;
    setAdditionalDepartments(updatedDepartments);
  };

  return (
    <div className="!font-space">
      {/* <Card className="w-full"> */}
      <Heading className="text-left py-4">Create Admin</Heading>
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
              required
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
              required
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
              required
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
            <Select.Root onValueChange={setRoleId} required>
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
              required
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>
          <div className="input-field mt-3">
            <Text className="text-[15px] font-medium leading-[35px]">
              Siganture
            </Text>
            <Flex
              className="w-full"
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
              <Button className="w-[30%] bg-theme" type="button">
                Sign{" "}
              </Button>
            </Flex>
          </div>
          {canvasVisible && <SignatureCanvas onSave={setSignatureImage} />}
        </Grid>

        <Card className="mt-4">
          <Grid columns={"2"} width={"100%"} gap={"3"}>
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="dept"
              >
                Select department to view Ledger
              </label>
              <Select.Root onValueChange={setDeptID}>
                <Select.Trigger
                  className="w-full mt-2"
                  placeholder="Select Department"
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

            {additionalDepartments.map((_, index) => (
              <div key={index} className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="dept"
                >
                  Select department to view Ledger ({index + 2})
                </label>
                <Select.Root
                  onValueChange={(value) =>
                    handleDepartmentChange(index, value)
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

        <Button type="button" onClick={handleAddDepartment} className="mt-4">
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
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon /> : "Create Admin"}
          </Button>
        </Flex>
      </form>
      {/* </Card> */}
      <Toaster position="top-right" />
    </div>
  );
};

export default AddAdmin;
