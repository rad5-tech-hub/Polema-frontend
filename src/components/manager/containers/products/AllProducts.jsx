import React, { useEffect, useState } from "react";

import { refractor } from "../../../date";
// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import {
  DropdownMenu,
  Button,
  TextField,
  Grid,
  Text,
  Select,
  Flex,
  Separator,
  Card,
} from "@radix-ui/themes";
import * as Switch from "@radix-ui/react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
//All imports for the Dialog Box
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Heading, Table, Spinner } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const DeleteDialog = ({ isOpen, onClose, runFetch, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteProduct = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setDeleteLoading(false);
      return;
    }

    console.log(id);

    try {
      const response = await axios.delete(
        `${root}/admin/delete-product/${id}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );

      setDeleteLoading(false);

      toast.success("Deleted Successfully", {
        style: {
          padding: "30px",
        },
        duration: 5000,
      });
      onClose();
      runFetch();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      toast.error(error.message);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[101]">
      <div className="relative bg-white p-6 rounded-md shadow-md w-[90vw] max-w-[450px]">
        <h2 className="text-[17px] font-medium text-black">Delete Product</h2>
        <p className="mt-4 text-center text-[15px] text-black">
          Are you sure you want to delete this product?
        </p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium"
          >
            No
          </button>
          <button
            disabled={deleteLoading}
            onClick={() => deleteProduct(id)}
            className={`ml-4 bg-blue-500 text-white px-4 py-2 rounded-md font-medium ${
              deleteLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {deleteLoading ? <Spinner /> : "Yes"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productActive, setProductActive] = useState(true);
  const [selectedEditProduct, setSelectedEditProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  // State management for the delete dialog
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle opening the delete dialog for a specific product
  const handleDeleteClick = (staff) => {
    setSelectedProduct(staff);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchProducts = async () => {
    setProducts([]);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(
        `${root}/admin/${productActive ? "get-products" : "get-raw-materials"}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setLoading(false);
      response.data.length === 0
        ? setProducts([])
        : setProducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const EditDialog = () => {
    const [isloading, setIsLoading] = useState(false);
    const [pricePlan, setPricePlan] = useState(false);
    const [basePrice, setBasePrice] = useState("");
    const [departments, setDepartments] = useState([]);

    // Function to format number with commas
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Handle base price input change
    const handleBasePriceChange = (e) => {
      const inputValue = e.target.value.replace(/,/g, ""); // Remove commas from the input value
      if (!isNaN(inputValue)) {
        setBasePrice(inputValue); // Update state with raw number (without commas)
      }
    };

    const handlePlanChange = (index, field, value) => {
      const updatedPlans = [...plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        [field]: value,
      };
      setPlans(updatedPlans);
    };
    // Add new plan fields
    const handleAddPlan = () => {
      setPlans([...plans, { name: "", discount: "" }]);
    };

    // Fetch departments from db
    const fetchDepartments = async () => {
      let retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");

        return;
      }

      try {
        const response = await axios.get(`${root}/dept/get-department`);
        setDepartments(response.data.departments);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      fetchDepartments();
    }, []);
    return (
      <>
        <Flex align={"center"} gap={"2"}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="cursor-pointer"
            onClick={() => {
              setEditDialogOpen(false);
            }}
          />
          <Heading>Edit {selectedEditProduct.name}</Heading>
        </Flex>
        <Separator className="w-full my-4" />

        <form action="">
          <Grid columns={"2"} rows={"2"} gapX={"5"} gapY={"2"}>
            <div className="w-full">
              <Text>Product Name</Text>
              <TextField.Root
                className="mt-2"
                value={selectedEditProduct.name}
              />
            </div>
            <div className="w-full">
              <Text>Product Unit</Text>
              <TextField.Root
                className="mt-2"
                value={selectedEditProduct.price[0].unit}
              />
            </div>
            <div className="w-full">
              <Text>Base Price</Text>
              <TextField.Root
                className="mt-2"
                value={selectedEditProduct.price[0].amount}
              />
            </div>
            <div className="w-full">
              <Text>Select Department</Text>
              <Select.Root
                defaultValue={selectedEditProduct.departmentId}
                disabled={departments.length == 0}
              >
                <Select.Trigger className="w-full mt-2" />
                <Select.Content>
                  {departments.map((department) => {
                    return (
                      <Select.Item value={department.id}>
                        {department.name}
                      </Select.Item>
                    );
                  })}
                </Select.Content>
              </Select.Root>
            </div>
          </Grid>

          <div className="input-field mt-4 flex justify-end">
            <div>
              {/* <label
                className="text-[15px] leading-none pr-[15px]"
                htmlFor="pricePlan"
              >
                Price Plan
              </label> */}
            </div>
          </div>
          {Array.isArray(selectedEditProduct.pricePlan) && (
            <Card className="mt-4">
              <Heading>Pricing Plan</Heading>
              {selectedEditProduct.pricePlan.map((plan) => {
                return (
                  <Grid columns={"2"} gap={"3"} className="mt-4">
                    <div className="w-full">
                      <Text>Price Plan Name</Text>
                      <TextField.Root
                        className="mt-2 w-full"
                        placeholder="Price Name"
                        defaultValue={plan.category}
                      />
                    </div>
                    <div className="w-full">
                      <Text>Plan Discount</Text>
                      <TextField.Root
                        className="mt-2 w-full"
                        defaultValue={plan.amount}
                        placeholder="Enter Price Discount in Naira"
                      />
                    </div>
                  </Grid>
                );
              })}
              <Button color="brown" className="mt-4" type="button">
                <FontAwesomeIcon icon={faPlus} />
                Add Plan
              </Button>
            </Card>
          )}
        </form>
      </>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, [productActive]);
  return (
    <>
      {editDialogOpen ? (
        <EditDialog />
      ) : (
        <div>
          <Flex justify={"between"} align={"center"}>
            <Heading size={"6"} className="p-4">
              All {productActive ? "Products" : "Raw Materials"}
            </Heading>
            <Select.Root
              defaultValue="products"
              onValueChange={(value) => {
                value === "products"
                  ? setProductActive(true)
                  : setProductActive(false);
              }}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="products">Products</Select.Item>
                <Select.Item value="raw materials">Raw Materials</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Table.Root size={"3"} variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  {productActive ? "Product" : "Raw Material"} Name
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            {loading ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              <Table.Body>
                {products.length === 0 ? (
                  <Table.Cell colSpan={4} className="text-center">
                    No Products Yet
                  </Table.Cell>
                ) : (
                  products.map((product) => (
                    <>
                      <Table.Row key={product.id} className="relative">
                        {" "}
                        {/* Ensure unique key */}
                        <Table.RowHeaderCell>
                          {product.name}
                        </Table.RowHeaderCell>
                        <Table.Cell>{product.category}</Table.Cell>
                        <Table.Cell>
                          {product.price.map((price, index) => (
                            <div key={index}>
                              {price.unit} <br />
                            </div>
                          ))}
                        </Table.Cell>
                        <Table.Cell>
                          {product.price.map((price, index) => (
                            <div key={index}>
                              ₦ {price.amount} <br />
                            </div>
                          ))}
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            {refractor(product.createdAt)} <br />
                          </div>
                        </Table.Cell>
                        <div className="absolute right-4 top-2">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                              <Button
                                variant="surface"
                                className="cursor-pointer"
                              >
                                <DropDownIcon />
                                {/* <DropdownMenu.TriggerIcon /> */}
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item
                                shortcut={<FontAwesomeIcon icon={faPen} />}
                                onClick={() => {
                                  setSelectedEditProduct(product);
                                  setEditDialogOpen(true);
                                }}
                              >
                                Edit
                              </DropdownMenu.Item>
                              {}
                              <DropdownMenu.Item
                                color="red"
                                shortcut={<DeleteIcon />}
                                onClick={() => handleDeleteClick(product)}
                              >
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </div>
                      </Table.Row>
                    </>
                  ))
                )}
              </Table.Body>
            )}
          </Table.Root>

          {selectedProduct && (
            <DeleteDialog
              isOpen={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
              id={selectedProduct.id}
              runFetch={fetchProducts}
            />
          )}
        </div>
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default AllProducts;
