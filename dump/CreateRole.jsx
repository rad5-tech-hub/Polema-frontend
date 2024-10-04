import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
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
import { useSelector } from "react-redux";
import UpdateURL from "../ChangeRoute";

const CreateRole = ({ child, setChild }) => {
  // Root URL for making requests
  const root = import.meta.env.VITE_ROOT;

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  // Array for all selected permissions/roles
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((checkboxId) => checkboxId !== id)
      );
    }
  };

  const dataAtStore = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    const retrToken = localStorage.getItem("token");

    setToken(retrToken);
  }, []);

  // Fetch token from local storage

  const handleAll = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      console.log(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitobject = {
      name: e.target[0].value,
      permissions: selectedCheckboxes,
    };

    if (submitobject.role === "") {
      toast.error("Assign a name to the role");
    } else if (submitobject.permissions.length === 0) {
      toast.error("Assign tasks to the role");
    } else {
      axios
        .post(`${root}/admin/create-role`, submitobject, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            toast.error(error.response.data.message || "Failed to create role");
          } else if (error.request) {
            console.log(error.request);
            toast.error("No response received from the server");
          } else {
            console.log("Error", error.message);
            toast.error("Request error occurred");
          }
        });
    }
  };

  // Change displayed route/url on loading the sites

  return (
    <div className="!font-space">
      <UpdateURL url={"/create-role"} />
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
                    {/* <input type="checkbox" id="usersAll" onChange={handleAll} /> */}
                    {/* <label htmlFor="usersAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-permission">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        name=""
                        id="viewUser"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewUser">View User</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editUser"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editUser">Edit User</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="resetUserPassword"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="resetUserPassword">
                        Reset User password
                      </label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createUser"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createUser">Create User</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="suspendUser"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="suspendUser">Suspend User</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteUser"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="deleteUser">Delete User</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">ROLE</Text>
                  <Flex gap={"3"} align={"center"}>
                    {/* <input type="checkbox" id="rolesAll" /> */}
                    {/* <label htmlFor="usersAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewRole"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewRole">View Role</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editRole"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editRole">Edit Role</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createRole"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createRole">Create Role</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteRole"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="deleteRole">Delete Role</label>
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
                    {/* <input type="checkbox" id="customersAll" /> */}
                    {/* <label htmlFor="customersAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewCustomer"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewCustomer">View Customer</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editCustomer"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editCustomer">Edit Customer</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createCustomer"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createCustomer">Create Customer</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteCustomer"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="deleteCustomer">Delete Customer</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full" id="pharm">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">PHARMACY PRODUCT</Text>
                  <Flex gap={"3"} align={"center"}>
                    {/* <input type="checkbox" id="pharmProductAll" /> */}
                    {/* <label htmlFor="pharmProductAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewPharmProduct"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewPharmProduct">View Product</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editPharmProduct"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editPharmProduct">Edit Product</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createPharmProduct"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createPharmProduct">Create Product</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deletePharmProduct"
                        onChange={handleCheckboxChange}
                      />
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
                    {/* <input type="checkbox" id="ticketsAll" /> */}
                    {/* <label htmlFor="usersAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewTicket"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewTicket">View Ticket</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editTicket"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editTicket">Edit Ticket</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="approveTicket"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="approveTicket">Approve Ticket</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createTicket"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createTicket">Create Ticket</label>
                    </Flex>

                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteTicket"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="deleteTicket">Delete Ticket</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full" id="products">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">PRODUCTS</Text>
                  <Flex gap={"3"} align={"center"}>
                    {/* <input type="checkbox" id="productAll" /> */}
                    {/* <label htmlFor="productAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewProducts"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewProducts">View Products</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editProduct"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editProduct">Edit Product</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createProduct"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createProduct">Create Product</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editProductPrice"
                        onChange={handleCheckboxChange}
                      />
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
                    {/* <input type="checkbox" id="supplierAll" /> */}
                    {/* <label htmlFor="supplierAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewSupplier"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewSupplier">View Supplier</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editSupplier"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editSupplier">Edit Supplier</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createSupplier"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createSupplier">Create Supplier</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteSupplier"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="deleteSupplier">Delete Supplier</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">ORDER</Text>
                  <Flex gap={"3"} align={"center"}>
                    {/* <input type="checkbox" id="orderAll" /> */}
                    {/* <label htmlFor="orderAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewOrder"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewOrder">View Order</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editOrder"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createOrder">Create Order</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="deleteOrder"
                        onChange={handleCheckboxChange}
                      />
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
                    {/* <input type="checkbox" id="reportAll" /> */}
                    {/* <label htmlFor="reportAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-3" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewReport"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewReport">View Report</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="downloadReport"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="downloadReport">Download Report</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createReport"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createReport">Create Report</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="shareReport"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="shareReport">Share Report</label>
                    </Flex>
                  </div>
                </Flex>
              </Card>

              <Card className="w-full">
                <Flex justify={"between"} align={"center"}>
                  <Text className="font-medium">STORE</Text>
                  <Flex gap={"3"} align={"center"}>
                    {/* <input type="checkbox" id="storeAll" /> */}
                    {/* <label htmlFor="storeAll">Select All</label> */}
                  </Flex>
                </Flex>
                <Separator className="w-full mt-2" />
                <Flex className="mt-4 w-full justify-between">
                  <div className="left-perimssion">
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="viewInventory"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="viewInventory">View Inventory</label>
                    </Flex>
                    <Flex gap={"2"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="editInventory"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="editInventory">Edit Inventory</label>
                    </Flex>
                  </div>
                  <div className="right-permission">
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="createInventory"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="createInventory">Create Inventory</label>
                    </Flex>
                    <Flex gap={"3"} align={"center"} className="mt-3">
                      <input
                        type="checkbox"
                        id="updateInventory"
                        onChange={handleCheckboxChange}
                      />
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
      <Toaster position="bottom-center" />
    </div>
  );
};

export default CreateRole;

// "viewUser",
// "editUser",
// "resetUserPassword",
// "createUser",
// "suspendUser",
// "deleteUser",

// "viewRole",
// "editRole",
// "createRole",
// "deleteRole",

// "viewCustomer",
// "editCustomer",
// "createCustomer",
// "deleteCustomer",

// "viewPharmProduct",
// "editPharmProduct",
// "createPharmProduct",
// "deletePharmProduct",

// "viewTicket",
// "editTicket",
// "approveTicket",
// "createTicket",
// "deleteTicket",

// "viewProducts",
// "editProduct",
// "createProduct",
// "editProductPrice",

// "viewSupplier",
// "editSupplier",
// "createSupplier",
// "deleteSupplier",

// "viewOrder",
// "createOrder",
// "deleteOrder",

// "viewReport",
// "downloadReport",
// "createReport",
// "shareReport",

// "viewInventory",
// "editInventory",
// "createInventory",
// "updateInventory",
