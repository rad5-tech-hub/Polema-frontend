import React, { useEffect, useState } from "react";
import { refractor } from "../../../date";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import {
  DropdownMenu,
  Button,
  TextField,
  Select,
  Flex,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTags } from "@fortawesome/free-solid-svg-icons";
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
const DeleteDialog = ({ isOpen, onClose, user, id }) => {
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
    } catch (error) {
      console.log(error);
      onClose();
      toast.error("Error");
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

// Edit Dialog Box
const EditDialog = ({ isOpen, onClose, user, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changedName, setChangedName] = useState(id.name);
  const [changedCategory, setChangedCategory] = useState(id.category);

  // State management for selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for price and pricePlan
  const [price, setPrice] = useState(id.price || []);
  const [pricePlan, setPricePlan] = useState(id.pricePlan || []);

  // Handle changes to price input fields
  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...price];
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value,
    };
    setPrice(updatedPrices);
  };

  // Handle changes to pricePlan input fields
  const handlePricePlanChange = (index, field, value) => {
    const updatedPricePlans = [...pricePlan];
    updatedPricePlans[index] = {
      ...updatedPricePlans[index],
      [field]: value,
    };
    setPricePlan(updatedPricePlans);
  };

  const editCustomer = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Constructing the request body
    const body = {
      name: changedName,
      category: selectedCategory || changedCategory,
      price: price,
      pricePlan: pricePlan,
    };

    const bodyWithoutPricePlan = {
      name: changedName,
      category: selectedCategory || changedCategory,
      price: price,
    };

    console.log(body);
    try {
      const response = await axios.patch(
        `${root}/admin/edit-product/${id.id}`,
        pricePlan.length > 0 ? body : bodyWithoutPricePlan,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setDeleteLoading(false);
      onClose();
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      setDeleteLoading(false);
      onClose();
      toast.error(error.message);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg">
          <Dialog.Title className="font-medium text-black">
            <Heading as="h1" className="text-[25px] text-black">
              Edit Product
            </Heading>
          </Dialog.Title>

          <form className="mt-4">
            <label className="text-[15px] font-medium text-black">Name</label>
            <TextField.Root
              placeholder="Enter Name"
              defaultValue={id.name}
              onChange={(e) => setChangedName(e.target.value)}
              className="p-1 rounded-sm mb-5"
            />

            <label className="text-[15px] font-medium text-black">
              Category
            </label>
            <Select.Root
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <Select.Trigger className="w-full mb-4 p-2 text-black">
                {selectedCategory || id.category}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="For Sale">For Sale</Select.Item>
                <Select.Item value="For Purchase">For Purchase</Select.Item>
              </Select.Content>
            </Select.Root>

            {/* Price Fields */}
            <Flex justify="between" gap="3">
              {price.map((product, index) => (
                <React.Fragment key={index}>
                  <div>
                    <label className="text-[15px] font-medium text-black">
                      Unit
                    </label>
                    <TextField.Root
                      placeholder="Enter Unit"
                      defaultValue={product.unit}
                      onChange={(e) =>
                        handlePriceChange(index, "unit", e.target.value)
                      }
                      className="p-1 rounded-sm mb-5"
                    />
                  </div>
                  <div>
                    <label className="text-[15px] font-medium text-black">
                      Price
                    </label>
                    <TextField.Root
                      placeholder="Enter Price"
                      defaultValue={product.amount}
                      onChange={(e) =>
                        handlePriceChange(index, "amount", e.target.value)
                      }
                      className="p-1 rounded-sm mb-5"
                    />
                  </div>
                </React.Fragment>
              ))}
            </Flex>

            {/* Price Plan Fields */}
            {Array.isArray(pricePlan) && (
              <>
                {pricePlan.map((plan, index) => (
                  <Flex justify="between" gap="3" key={index}>
                    <div>
                      <label className="text-[15px] font-medium text-black">
                        Price Plan
                      </label>
                      <TextField.Root
                        placeholder="Enter Plan"
                        defaultValue={plan.category}
                        onChange={(e) =>
                          handlePricePlanChange(
                            index,
                            "category",
                            e.target.value
                          )
                        }
                        className="p-1 rounded-sm mb-5"
                      />
                    </div>
                    <div>
                      <label className="text-[15px] font-medium text-black">
                        Amount
                      </label>
                      <TextField.Root
                        placeholder="Enter Amount"
                        defaultValue={plan.amount}
                        onChange={(e) =>
                          handlePricePlanChange(index, "amount", e.target.value)
                        }
                        className="p-1 rounded-sm mb-5"
                      />
                    </div>
                  </Flex>
                ))}
              </>
            )}
          </form>

          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              disabled={deleteLoading}
              onClick={() => editCustomer(id)}
              className="ml-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {deleteLoading ? <LoaderIcon /> : "Save Changes"}
            </button>
          </div>
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

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <UpdateURL url={"/all-products"} />

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
                    <Table.RowHeaderCell>{product.name}</Table.RowHeaderCell>
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
                          <Button variant="surface" className="cursor-pointer">
                            <DropDownIcon />
                            {/* <DropdownMenu.TriggerIcon /> */}
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => handleEditClick(product)}
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
      {selectedEditProduct && (
        <EditDialog
          isOpen={!!selectedEditProduct}
          onClose={() => setSelectedEditProduct(null)}
          id={selectedEditProduct}
        />
      )}
      {selectedProduct && (
        <DeleteDialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          id={selectedProduct.id}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllProducts;
