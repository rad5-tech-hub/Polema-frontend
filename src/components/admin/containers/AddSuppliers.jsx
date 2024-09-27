import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
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
import { Camera } from "../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
const root = import.meta.env.VITE_ROOT;

const AddSuppliers = ({ child, setChild, buttonValue }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    alert("API endpoint not provided.");
  };

  return (
    <div>
      <Card className="w-full">
        <Heading className="text-left py-4">Add Suppliers</Heading>
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
              className="mt-4 "
              size={3}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={"2"} /> : "Create"}
            </Button>
          </Flex>
        </form>
        <Toaster position="bottom-center" />
      </Card>
    </div>
  );
};

export default AddSuppliers;
