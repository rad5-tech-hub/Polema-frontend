import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Card,
  Select,
  Button,
  Heading,
  Separator,
  TextField,
  Text,
  Spinner,
  Flex,
} from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;

const AddCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState(" ");
  // State management for the form content
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const resetForm = () => {
      setFirstName("");
      setLastname("");
      setEmail("");
      setAddress("");
      setNumber("");
    };

    // Dynamically build submitobject to exclude email if it's empty
    const submitobject = {
      firstname: firstname,
      lastname: lastname,
      ...(email && { email }),
      phoneNumber: number,
      profilePic: imageURL,
      address: address,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${root}/customer/reg-customer`,
        submitobject,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setIsLoading(false);

      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
      resetForm();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response?.data?.error || error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };

  return (
    <div>
      <Card className="w-full">
        <Heading className="text-left p-4">Customers</Heading>
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
                  value={firstname}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                  id="number"
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
                  Enter Last Name
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  className=""
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  type="text"
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
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder="Enter Address"
                  className=""
                  type="text"
                  id="address"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>
          </div>

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4  bg-theme hover:bg-theme/85"
              size={3}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={"2"} /> : "Create"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddCustomer;
