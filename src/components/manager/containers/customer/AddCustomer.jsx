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
  CheckboxGroup,
  Checkbox,
  TextField,
  Text,
  Spinner,
  Flex,
} from "@radix-ui/themes";

import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import UpdateURL from "../ChangeRoute";

const root = import.meta.env.VITE_ROOT;

const AddCustomer = ({ child, setChild, buttonValue }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("admin");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState(" ");

  // const data = {
  //   admin: { label: "Admin", icon: <PersonIcon /> },
  //   admin1: { label: "Admin 1", icon: <PersonIcon /> },
  //   admin2: { label: "Admin 2", icon: <PersonIcon /> },
  //   admin3: { label: "Admin 3", icon: <PersonIcon /> },
  //   accountant: { label: "Accountant", icon: <PersonIcon /> },
  //   keeperGeneral: { label: "Storekeeper (General)", icon: <PersonIcon /> },
  //   keeperPharmacy: { label: "Storekeeper (Pharmacy)", icon: <PersonIcon /> },
  // };

  const handleValueChange = (value) => {
    setValue(value);
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

  const handleOtherBlur = () => {
    if (otherValue.trim() !== "") {
      setSelectedItems((prevItems) => [...prevItems, otherValue]);
    }
    setOtherValue("");
    setShowOtherInput(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        uploadImageToCloudinary(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    const submitobject = {
      firstname: e.target[0].value,
      lastname: e.target[3].value,
      email: e.target[1].value,
      phoneNumber: e.target[2].value,
      profilePic: imageURL,
      address: e.target[4].value,
    };
    setIsLoading(true);
    console.log(e);

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
      console.log(response.data);
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      // Redirect to all customers page
      navigate("/admin/customer/view-customers");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      {
        error.response.data.error
          ? toast.error(error.response.data.error, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            })
          : toast.error(error.message, {
              duration: 6500,
              style: {
                padding: "30px",
              },
            });
      }
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
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddCustomer;
