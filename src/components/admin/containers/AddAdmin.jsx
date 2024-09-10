import React, { useState } from "react";

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
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { Phone } from "../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import AllAdmins from "./AllAdmins";
import { Camera } from "../../icons";

const AddAdmin = ({ child, setChild }) => {
  const [value, setValue] = useState("admin");
  const [selectedItems, setSelectedItems] = useState([]);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="!font-space">
      <div className="flex justify-end my-4">
        <Button
          onClick={() => {
            setChild(<AllAdmins />);
          }}
        >
          View Admins
        </Button>
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
              <Camera />
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
                  Full Name
                </label>
                <TextField.Root
                  placeholder="Enter fullname"
                  className=""
                  type="text"
                  id="fullname"
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
              <div className="input-field mt-3">
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
              </div>

              {showOtherInput && (
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
              )}

              <div className="mt-3 input-field">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
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
                  className="text-[15px]  font-medium leading-[35px]   "
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
            </div>
          </div>

          {/* Permissions Div */}
          <Separator className="w-full mt-8" />
          <div className="permission-box mt-5">
            <Heading className="mb-5">Permissions</Heading>

            {/* Users & Role */}
            <Flex className="w-full" gap={"7"}>
              <Card className="w-full" id="users">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">USERS</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox id="usersAll" />
                    <label htmlFor="usersAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewUser" />
                      <label htmlFor="viewUser">View User</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editUser" />
                      <label htmlFor="editUser">Edit User</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="resetUserPassword" />
                      <label htmlFor="resetUserPassword">
                        Reset User password
                      </label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createUser" />
                      <label htmlFor="createUser">Create User</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="suspendUser" />
                      <label htmlFor="suspendUser">Suspend User</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deleteUser" />
                      <label htmlFor="deleteUser">Delete User</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">ROLE</Text>
                  <Flex gap={"3"} align={"center"}>
                    <Checkbox id="usersAll" />
                    <label htmlFor="usersAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewRole" />
                      <label htmlFor="viewRole">View Role</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editRole" />
                      <label htmlFor="editRole">Edit Role</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createRole" />
                      <label htmlFor="createRole">Create Role</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="suspendUser" />
                      <label htmlFor="suspendUser">Delete Role</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Flex>

            {/* Customers and Pharmacy Products */}
            <Flex className="w-full mt-4" gap={"7"}>
              <Card className="w-full" id="customers">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">CUSTOMERS</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox id="customersAll" />
                    <label htmlFor="customersAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewCustomer" />
                      <label htmlFor="viewCustomer">View Customer</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editCustomer" />
                      <label htmlFor="editCustomer">Edit Customer</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createCustomer" />
                      <label htmlFor="createCustomer">Create Customer</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deleteCustomer" />
                      <label htmlFor="deleteCustomer">Delete Customer</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full" id="pharm">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">PHARMACY PRODUCT</Text>
                  <Flex gap={"3"} align={"center"}>
                    <Checkbox id="pharmProductAll" />
                    <label htmlFor="pharmProductAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewProduct" />
                      <label htmlFor="viewProduct">View Product</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editPharmProduct" />
                      <label htmlFor="editPharmProduct">Edit Product</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createPharmProduct" />
                      <label htmlFor="createPharmProduct">Create Product</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deletePharmProduct" />
                      <label htmlFor="deletePharmProduct">Delete Product</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Flex>

            {/* Ticket and Products */}
            <Flex className="w-full mt-4" gap={"7"}>
              <Card className="w-full" id="tickets">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">TICKETS</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox id="usersAll" />
                    <label htmlFor="usersAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewTicket" />
                      <label htmlFor="viewTicket">View Ticket</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editTicket" />
                      <label htmlFor="editTicket">Edit Ticket</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="approveTicket" />
                      <label htmlFor="approveTicket">Approve Ticket</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createTicket" />
                      <label htmlFor="createTicket">Create Ticket</label>
                    </Flex>

                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deleteTicket" />
                      <label htmlFor="deleteTicket">Delete Ticket</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full" id="products">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">PRODUCTS</Text>
                  <Flex gap={"3"} align={"center"}>
                    <Checkbox id="productAll" />
                    <label htmlFor="productAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewProducts" />
                      <label htmlFor="viewProducts">View Products</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editProduct" />
                      <label htmlFor="editProduct">Edit Product</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createProduct" />
                      <label htmlFor="createProduct">Create Product</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="editProductPrice" />
                      <label htmlFor="editProductPrice">
                        Edit Product Price
                      </label>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Flex>

            {/* Supplier and Order */}
            <Flex className="w-full mt-4" gap={"7"}>
              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">SUPPLIER</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox id="supplierAll" />
                    <label htmlFor="supplierAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewSupplier" />
                      <label htmlFor="viewSupplier">View Supplier</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editSupplier" />
                      <label htmlFor="editSupplier">Edit Supplier</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createSupplier" />
                      <label htmlFor="createSupplier">Create Supplier</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deleteSupplier" />
                      <label htmlFor="deleteSupplier">Delete Supplier</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">ORDER</Text>
                  <Flex gap={"3"} align={"center"}>
                    <Checkbox id="orderAll" />
                    <label htmlFor="orderAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewOrder" />
                      <label htmlFor="viewOrder">View Order</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editOrder" />
                      <label htmlFor="editOrder">Create Order</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="deleteOrder" />
                      <label htmlFor="deleteOrder">Delete Order</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Flex>

            {/* Report and Store */}
            <Flex className="w-full mt-4" gap={"7"}>
              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">Report</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox id="reportAll" />
                    <label htmlFor="reportAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewReport" />
                      <label htmlFor="viewUser">View Report</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="downloadReport" />
                      <label htmlFor="downloadReport">Download Report</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createReport" />
                      <label htmlFor="createReport">Create Report</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="shareReport" />
                      <label htmlFor="shareReport">Share Report</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">STORE</Text>
                  <Flex gap={"3"} align={"center"}>
                    <Checkbox id="storeAll" />
                    <label htmlFor="storeAll">Select All</label>
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="viewInventory" />
                      <label htmlFor="viewInventory">View Inventory</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <Checkbox id="editInventory" />
                      <label htmlFor="editInventory">Edit Inventory</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="createInventory" />
                      <label htmlFor="createInventory">Create Inventory</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <Checkbox id="updateInventory" />
                      <label htmlFor="updateInventory">Update Inventory</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Flex>
          </div>

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button className="mt-4 " size={3} type="submit">
              {isLoading ? <Spinner size={"2"} /> : "Create Admin"}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
};

export default AddAdmin;
