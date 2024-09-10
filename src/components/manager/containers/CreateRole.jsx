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

import { Camera } from "../../icons";

const CreateRole = ({ child, setChild }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [permissions, setPermissions] = useState({
    users: {
      selectAll: false,
      viewUser: false,
      editUser: false,
      resetUserPassword: false,
      createUser: false,
      suspendUser: false,
      deleteUser: false,
    },
    roles: {
      selectAll: false,
      viewRole: false,
      editRole: false,
      createRole: false,
      deleteRole: false,
    },
    customers: {
      selectAll: false,
      viewCustomer: false,
      editCustomer: false,
      createCustomer: false,
      deleteCustomer: false,
    },
    // Add other permission categories in a similar way
  });

  const handleSelectAll = (category) => {
    const updatedCategory = Object.keys(permissions[category]).reduce(
      (acc, key) => {
        acc[key] = !permissions[category].selectAll;
        return acc;
      },
      {}
    );
    setPermissions((prev) => ({
      ...prev,
      [category]: updatedCategory,
    }));
  };

  const handlePermissionChange = (category, permission) => {
    setPermissions((prev) => {
      const updatedPermissions = {
        ...prev[category],
        [permission]: !prev[category][permission],
      };

      // Automatically update selectAll status
      const allSelected = Object.keys(updatedPermissions)
        .filter((key) => key !== "selectAll")
        .every((key) => updatedPermissions[key]);
      updatedPermissions.selectAll = allSelected;

      return {
        ...prev,
        [category]: updatedPermissions,
      };
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
      <Card className="w-full">
        <Heading className=" py-4">Create Role</Heading>

        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]   "
                  htmlFor="role"
                >
                  Role
                </label>
                <TextField.Root
                  placeholder="Enter Role"
                  className=""
                  type="text"
                  id="role"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>
          </div>

          {/* Permissions Div */}
          <Separator className="w-full mt-4" />
          <div className="permission-box mt-5">
            {/* Users & Role */}
            <Flex className="w-full" gap={"7"}>
              <Card className="w-full" id="users">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">USERS</Text>
                  <Flex gap={"2"} align={"center"}>
                    <Checkbox
                      id="usersAll"
                      checked={permissions.users.selectAll}
                      onChange={() => handleSelectAll("users")}
                    />
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
              {isLoading ? <Spinner size={"2"} /> : "Create Role"}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
};

export default CreateRole;
