import React, { useEffect, useState } from "react";
import { refractor } from "../../../date";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import {
  DropdownMenu,
  Button,
  TextField,
  Select,
  Switch,
  Flex,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTags, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { Suspend } from "../../../icons";

//All imports for the Dialog Box
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";

import { Heading, Table, Spinner } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UpdateURL from "../ChangeRoute";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const root = import.meta.env.VITE_ROOT;

//Delete Dialog Box $//
const DeleteDialog = ({ isOpen, onClose, runFetch, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteProduct = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.delete(
        `${root}/admin/delete-product/${id}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      console.log(response);
      setDeleteLoading(false);
      onClose();
      toast.success(response.data.message);
      runFetch();
    } catch (error) {
      console.log(error);
      onClose();
      toast.error(error.message);
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Delete Product
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to delete this product ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-blue-500 hover:bg-blue-800 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              disabled={deleteLoading}
              onClick={() => {
                deleteProduct(id);
              }}
              className=" ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {deleteLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State management for the delete dialog
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle opening the delete dialog for a specific product
  const handleDeleteClick = (staff) => {
    setSelectedProduct(staff);
  };

  // State management for the edit dialog
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Handle opening the edit dialog for a specific product
  const handleEditClick = (staff) => {
    setSelectedEditProduct(staff);
  };

  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setLoading(false);
      console.log(response.data.products);
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
    const [plans, setPlans] = useState([{ name: "", discount: "" }]);

    // State management for selected category
    const [selectedCategory, setSelectedCategory] = useState("");

    // State management for selected department
    const [selectedDept, setSelectedDept] = useState("");

    // State management for fetched departments
    const [department, setDepartment] = useState([]);

    const [imageURL, setImageURL] = useState("");

    const handleSwitchChange = (checked) => {
      setPricePlan(checked);
    };

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
        console.log(response);
        setDepartment([]);
      } catch (error) {
        console.log(error);
        toast.error();
      }
    };
    return (
      <>
        <form>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="product-name"
                >
                  Product Name
                </label>
                <TextField.Root
                  placeholder="Enter Product name"
                  type="text"
                  id="product-name"
                  size={"3"}
                />
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="price"
                >
                  Base Price
                </label>
                <TextField.Root
                  placeholder="Enter Base Price"
                  id="price"
                  type="text" // Use text type to enable formatting
                  value={formatNumber(basePrice)} // Display formatted number
                  onChange={handleBasePriceChange} // Update raw value without commas
                />
              </div>

              {/* Category Dropdown */}
              <div className="w-full mt-3">
                <label className="text-[15px]  font-medium leading-[35px]">
                  Category
                </label>
                <Select.Root
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)} // Initial value
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="Select Catgory"
                  >
                    <Flex as="span" align="center" gap="2">
                      <FontAwesomeIcon icon={faTags} />
                      {selectedCategory || "Select Category"}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    {/* {products.map((product) => ( */}

                    <Select.Item value="For Sale">For Sale</Select.Item>
                    <Select.Item value="For Purchase">For Purchase</Select.Item>
                    {/* ))} */}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <div className="right w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="unit"
                >
                  Product Unit
                </label>
                <TextField.Root
                  placeholder="Specify Unit (kg, litres, bags, others)"
                  id="unit"
                  type="text"
                  size={"3"}
                />
              </div>

              {/* Departments Dropdown */}
              <div className="w-full mt-3">
                <label className="text-[15px]  font-medium leading-[35px]">
                  Department
                </label>
                <Select.Root
                  value={selectedDept}
                  onValueChange={(value) => setSelectedDept(value)} // Initial value
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="Select Department"
                  >
                    <Flex as="span" align="center" gap="2">
                      <FontAwesomeIcon icon={faBriefcase} />
                      {department.find((dept) => dept.id === selectedDept)
                        ?.name || "Select Department"}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    {department.map((dept) => {
                      return (
                        <Select.Item value={dept.id}>{dept.name}</Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          <div className="input-field mt-3 flex justify-end">
            <div>
              <label
                className="text-[15px] leading-none pr-[15px]"
                htmlFor="pricePlan"
              >
                Price Plan
              </label>
              <Switch.Root
                className={`
                ${pricePlan ? "bg-green-500" : "bg-gray-500"}
                w-[32px] h-[15px] bg-black-600 rounded-full relative shadow-[0_2px_10px] border-2 border-black shadow-black/25  data-[state=checked]:bg-green outline-none cursor-default`}
                id="pricePlan"
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
              >
                <Switch.Thumb className="block w-[11px] h-[11px] bg-white rounded-full shadow-[0_2px_2px] shadow-black transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>
          </div>

          {pricePlan && (
            <Card className="mt-4">
              <Heading className="py-4">Pricing Plan</Heading>
              <Separator className="w-full mb-4" />

              {plans.map((plan, index) => (
                <Flex key={index} gap={"4"} className="mb-2">
                  <div className="w-full">
                    <label htmlFor={`plan-name-${index}`}>
                      Pricing Plan Name
                    </label>
                    <TextField.Root
                      type="text"
                      placeholder="Enter Plan Name"
                      className="mt-1"
                      value={plan.name}
                      onChange={(e) =>
                        handlePlanChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor={`plan-discount-${index}`}>
                      Plan Discount
                    </label>
                    <TextField.Root
                      type="text" // Use text type to enable formatting
                      placeholder="Enter Price Discount (in Naira)"
                      className="mt-1"
                      value={formatNumber(plan.discount)}
                      onChange={(e) =>
                        handlePlanChange(
                          index,
                          "discount",
                          e.target.value.replace(/,/g, "")
                        )
                      }
                    />
                  </div>
                </Flex>
              ))}

              <Button
                className="mt-3"
                color="brown"
                radius="medium"
                onClick={handleAddPlan}
              >
                <PlusIcon width={"20px"} height={"20px"} />
                Add Plan
              </Button>
            </Card>
          )}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button
              className="mt-4"
              size={3}
              type="submit"
              disabled={isloading}
            >
              {isloading ? <Spinner /> : "Create"}
            </Button>
          </Flex>
        </form>
      </>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <UpdateURL url={"/all-products"} />

      {editDialogOpen ? (
        <EditDialog />
      ) : (
        <div>
          {/* Search Box */}
          <TextField.Root
            placeholder="Search by product name"
            className="w-[55%] mb-5"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height={"16"} width={"16"} />
            </TextField.Slot>
          </TextField.Root>

          <Heading size={"6"} className="p-4">
            All Products
          </Heading>
          <Table.Root size={"3"} variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
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
                                onClick={() => console.log("Hello World")}
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
