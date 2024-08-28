import React, { useState } from "react";
import axios from "axios";
import AllAdmins from "./AllAdmins";
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

const AddCustomer = () => {
  const [value, setValue] = useState("admin");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const data = {
    admin: { label: "Admin", icon: <PersonIcon /> },
    admin1: { label: "Admin 1", icon: <PersonIcon /> },
    admin2: { label: "Admin 2", icon: <PersonIcon /> },
    admin3: { label: "Admin 3", icon: <PersonIcon /> },
    accountant: { label: "Accountant", icon: <PersonIcon /> },
    keeperGeneral: { label: "Storekeeper (General)", icon: <PersonIcon /> },
    keeperPharmacy: { label: "Storekeeper (Pharmacy)", icon: <PersonIcon /> },
  };

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

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    await axios
      .post("https://api.cloudinary.com/v1_1/da4yjuf39/image/upload", formData)
      .then((result) => {
        setImageURL(result.data.secure_url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitobject = {
      name: e.target[1].value + " " + e.target[4].value,
      category: "A",
      phonenumber: e.target[3]?.value,
      profilePic: imageURL,
      address: e.target[5]?.value,
    };
    setIsLoading(true);
    // console.log(submitobject);
    axios
      .post(`http://${root}/customer/register`, submitobject)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Handle form submission, including the imageURL which is the Cloudinary URL

    // Add your form submission logic here
  };

  return (
    <div>
      <div className="flex justify-end my-4">
        <Button>
          <a href="/dashboard/md?action=view-admins">View Customers</a>
        </Button>
      </div>
      <Card className="w-full">
        <Heading className="text-left p-4">Customers</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div
            className="add-image flex justify-center items-center w-[70px] mt-6 h-[70px] border border-white rounded-full cursor-pointer"
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Camera width={50} height={50} />
            )}
          </div>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

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
                  placeholder="Enter fullname"
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
    </div>
  );
};

export default AddCustomer;
