import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Spinner,
  Flex,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";

const root = import.meta.env.VITE_ROOT;

const AddCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]); // Array to manage phone numbers

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedNumbers);
  };

  const handlePhoneNumberChange = (value, index) => {
    const updatedNumbers = phoneNumbers.map((num, i) =>
      i === index ? value : num
    );
    setPhoneNumbers(updatedNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const resetForm = () => {
      setFirstName("");
      setLastname("");
      setEmail("");
      setAddress("");
      setPhoneNumbers([""]);
    };

    const submitobject = {
      firstname,
      lastname,
      ...(email && { email }),
      phoneNumber: phoneNumbers,
      ...(imageURL && { profilePic: imageURL }),
      address,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${root}/customer/reg-customer`,
        submitobject,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setIsLoading(false);
      toast.success(response.data.message, { duration: 6500 });
      resetForm();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.response?.data?.error || error.message, {
        duration: 6500,
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
                <label className="text-[15px] font-medium leading-[35px]">
                  First Name
                </label>
                <TextField.Root
                  placeholder="Enter First Name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-field mt-3">
                <label className="text-[15px] font-medium leading-[35px]">
                  Email
                </label>
                <TextField.Root
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field mt-3">
                <label className="text-[15px] font-medium leading-[35px]">
                  Phone Number(s)
                </label>
                {phoneNumbers.map((number, index) => (
                  <div
                    className="flex items-center gap-2 w-full relative mt-2"
                    key={index}
                  >
                    <TextField.Root
                      placeholder="Enter phone number"
                      value={number}
                      onChange={(e) =>
                        handlePhoneNumberChange(e.target.value, index)
                      }
                      className="w-full"
                    />
                    <Button type="button" onClick={handleAddPhoneNumber}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    {phoneNumbers.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemovePhoneNumber(index)}
                        className="bg-red-500 hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="right w-[50%]">
              <div className="mt-3 input-field">
                <label className="text-[15px] font-medium leading-[35px]">
                  Enter Last Name
                </label>
                <TextField.Root
                  placeholder="Enter Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div className="mt-3 input-field">
                <label className="text-[15px] font-medium leading-[35px]">
                  Enter Address
                </label>
                <TextField.Root
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4 bg-theme hover:bg-theme/85"
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
