import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { LoaderIcon } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Flex,
} from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;

const AddSuppliers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [numbers, setNumbers] = useState([""]); // <-- array of phone numbers
  const showToast = useToast();

  const handleAddNumber = () => {
    setNumbers([...numbers, ""]);
  };

  const handleNumberChange = (value, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      firstname,
      lastname,
      address,
      ...(email && { email }),
      phoneNumber: numbers.filter((n) => n.trim() !== ""), // clean empty ones
    };

    try {
      const response = await axios.post(`${root}/customer/reg-supplier`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setIsLoading(false);
      showToast({
        message: response.data.message,
        type: "success",
        duration: 5000,
      });

      // reset form
      setFirstName("");
      setLastName("");
      setAddress("");
      setEmail("");
      setNumbers([""]);
    } catch (error) {
      setIsLoading(false);
      showToast({
        type: "error",
        message: error?.response?.data?.error || "An error occurred, try again",
        duration: 5000,
      });
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
              {/* First Name */}
              <div className="input-field mt-3">
                <label className="text-[15px] font-medium leading-[35px]" htmlFor="firstname">
                  First Name <span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  placeholder="Enter First Name"
                  type="text"
                  name="firstname"
                  value={firstname}
                  id="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
                  size="3"
                />
              </div>

              {/* Email */}
              <div className="input-field mt-3">
                <label className="text-[15px] font-medium leading-[35px]" htmlFor="email">
                  Email
                </label>
                <TextField.Root
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  name="email"
                  id="email"
                  type="text"
                  size="3"
                />
              </div>

              {/* Phone Numbers */}
              <div className="input-field mt-3">
                <label className="text-[15px] font-medium leading-[35px]">
                  Phone Numbers <span className="text-red-500">*</span>
                </label>
                {numbers.map((num, idx) => (
                  <Flex key={idx} align="center" gap="2" className="mt-2">
                    <TextField.Root
                      placeholder="Enter phone number"
                      onChange={(e) => handleNumberChange(e.target.value, idx)}
                      value={num}
                      type="number"
                      size="3"
                      className="flex-1"
                    />
                    {idx === numbers.length - 1 && (
                      <Button
                        type="button"
                        size="2"
                        onClick={handleAddNumber}
                        className="bg-theme hover:bg-theme/85"
                      >
                        +
                      </Button>
                    )}
                  </Flex>
                ))}
              </div>
            </div>

            <div className="right w-[50%]">
              {/* Last Name */}
              <div className="mt-3 input-field">
                <label className="text-[15px] font-medium leading-[35px]" htmlFor="lastname">
                  Enter Last Name <span className="text-red-500">*</span>
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  name="lastname"
                  id="lastname"
                  size="3"
                />
              </div>

              {/* Address */}
              <div className="mt-3 input-field">
                <label className="text-[15px] font-medium leading-[35px]" htmlFor="address">
                  Enter Address
                </label>
                <TextField.Root
                  placeholder="Enter Address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  type="text"
                  name="address"
                  id="address"
                  size="3"
                />
              </div>
            </div>
          </div>

          <Flex justify="end" align="end" width="100%">
            <Button
              className="mt-4 cursor-pointer bg-theme hover:bg-theme/85"
              size="3"
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
