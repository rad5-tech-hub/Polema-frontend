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
  TextField,
  Flex,
} from "@radix-ui/themes";
import { Phone } from "../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

const AddAdmin = () => {
  const [value, setValue] = useState("admin");
  const [selectedItems, setSelectedItems] = useState([]);
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
    console.log(e);
    console.log(selectedItems);
    const submitobject = {
      fullname: e.target[1].value,
      email: e.target[2].value,
      phoneNumber: e.target[3].value,
      department: "",
      profileURL: "",
      products: selectedItems,
      role: e.target[5].value,
      password: e.target[8].value,
    };
    console.log(submitobject);

    // Handle form submission, including the imageURL which is the Cloudinary URL

    // Add your form submission logic here
  };

  return (
    <div>
      <div className="flex justify-end my-4">
        <Button>View Admins</Button>
      </div>
      <Card className="w-full">
        <Heading className="text-left p-4">Add Admin</Heading>
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
              <PersonIcon width={40} height={40} />
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
                  className="text-[15px]  font-medium leading-[35px] text-white"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <TextField.Root
                  placeholder="Enter fullname"
                  className=""
                  type="text"
                  id="fullname"
                  size={"3"}
                >
                  <TextField.Slot>
                    <PersonIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px] text-white"
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
                  className="text-[15px]  font-medium leading-[35px] text-white"
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
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px] text-white"
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
              </div>

              {showOtherInput && (
                <div className="input-field mt-3">
                  <label
                    className="text-[15px]  font-medium leading-[35px] text-white"
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
              )}

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px] text-white"
                  htmlFor="role"
                >
                  Assign Role
                </label>
                <Select.Root
                  value={value}
                  onValueChange={handleValueChange}
                  size={"3"}
                >
                  <Select.Trigger
                    className="w-full"
                    id="role"
                    placeholder="Select Product(s)"
                  >
                    <Flex as="span" align="center" gap="2">
                      {data[value].icon}
                      {data[value].label}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    <Select.Item value="admin1">Admin 1</Select.Item>
                    <Select.Item value="admin2">Admin 2</Select.Item>
                    <Select.Item value="admin3">Admin 3</Select.Item>
                    <Select.Item value="accountant">Accountant</Select.Item>
                    <Select.Item value="keeperPharmacy">
                      Store Keeper (Pharmacy)
                    </Select.Item>
                    <Select.Item value="keeperGeneral">
                      Store Keeper (General)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px] text-white"
                  htmlFor="password"
                >
                  Enter Password
                </label>
                <TextField.Root
                  placeholder="Password"
                  className=""
                  type="password"
                  id="password"
                  size={"3"}
                ></TextField.Root>
              </div>
              <Flex justify={"end"} align={"end"} width={"100%"}>
                <Button className="mt-4 " size={3} type="submit">
                  Create
                </Button>
              </Flex>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddAdmin;
