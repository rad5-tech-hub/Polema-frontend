import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Spinner,
  Flex,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AddSuppliers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    const body = {
      firstname: firstname,
      lastname: lastname,
      address: address,
      ...(email && { email }),
      phoneNumber: number,
    };

    try {
      const response = await axios.post(`${root}/customer/reg-supplier`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setIsLoading(false);
      toast.success(response.data.message, {
        duration: 6000,
        style: {
          padding: "30px",
        },
      });
      // Clear the form fields
      setFirstName("");
      setLastName("");
      setAddress("");
      setNumber("");
      setEmail("");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  return (
    <div>
      <Card className="w-full">
        <Heading className="text-left py-4">Add Supplier</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="fullname"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  placeholder="Enter First Name"
                  className=""
                  type="text"
                  name="firstname"
                  value={firstname}
                  id="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  className=""
                  value={email}
                  name="email"
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
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  placeholder="Enter phone number"
                  onChange={(e) => setNumber(e.target.value)}
                  className=""
                  id="number"
                  value={number}
                  name="phoneNumber"
                  type="number"
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
                  Enter Last Name<span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  className=""
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  name="lastname"
                  id="lastname"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="address"
                >
                  Enter Address
                </label>
                <TextField.Root
                  placeholder="Enter Address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  className=""
                  name="address"
                  type="text"
                  value={address}
                  id="address"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>
          </div>

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4 cursor-pointer  bg-theme hover:bg-theme/85"
              size={"3"}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <LoaderIcon /> : "Create"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddSuppliers;
