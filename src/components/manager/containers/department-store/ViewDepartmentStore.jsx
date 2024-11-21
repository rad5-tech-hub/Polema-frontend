import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import {
  Separator,
  Grid,
  Blockquote,
  Table,
  Button,
  DropdownMenu,
  Flex,
  Select,
  Heading,
  Spinner,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const ViewDepartmentStore = () => {
  const [isProductActive, setIsProductActive] = useState(true);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch store data
  const fetchStore = async () => {
    let retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/${
          isProductActive ? "view-deptstore-prod" : "view-deptstore-raw"
        }`,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setStore(response.data.stores);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the right status color based on status
  const sqColor = (arg) => {
    switch (arg) {
      case "In Stock":
        return "text-green-500";
        break;
      case "Out Stock":
        return "text-red-500";
        break;
      case "Low Stock":
        return "text-yellow-500";
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStore();
  }, [isProductActive]);

  // Handle opening modals
  const handleOpenModal = (type, product) => {
    setSelectedProduct(product);
    setOpenModal(type);
  };

  const closeModal = () => {
    setOpenModal(null);
    setSelectedProduct(null);
  };

  // Callback to delete product from store state and server
  const handleDeleteProduct = async () => {
    try {
      const retrToken = localStorage.getItem("token");
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");
        return;
      }

      await axios.delete(`${root}/deleteproduct/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      setStore((prevStore) =>
        prevStore.filter((item) => item.id !== selectedProduct.id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      closeModal();
    }
  };

  // Callback to update product in store state
  const handleEditProduct = (updatedProduct) => {
    setStore((prevStore) =>
      prevStore.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
  };

  // Callback to add a new product to store state
  const handleAddProduct = (newProduct) => {
    setStore((prevStore) => [...prevStore, newProduct]);
  };

  return (
    <div>
      <Flex justify={"between"}>
        <Heading>View Store</Heading>
        <Select.Root
          defaultValue="products"
          onValueChange={(value) => setIsProductActive(value === "products")}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="products">Products</Select.Item>
            <Select.Item value="raw materials">Raw Materials</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="my-3 w-full" />

      <Table.Root className="mt-6 mb-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {isProductActive ? "PRODUCT" : "RAW MATERIAL"} NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Flex
                  justify="center"
                  align="center"
                  style={{ height: "100px" }}
                >
                  <Spinner size="large" />
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body>
            {store.map((storeItem) => (
              <Table.Row key={storeItem.id} className="relative">
                <Table.RowHeaderCell>
                  {refractor(storeItem.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.product.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.product.department.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{storeItem.unit}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{storeItem.quantity}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.thresholdValue}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <FontAwesomeIcon
                    icon={faSquare}
                    className={`mr-1 ${sqColor(storeItem.status)}`}
                  />
                  {storeItem.status}
                </Table.RowHeaderCell>
                <div className="mt-2 mr-1 top-1 right-1">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="surface">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Group>
                        <DropdownMenu.Item
                          onClick={() => handleOpenModal("add", storeItem)}
                        >
                          Add
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleOpenModal("edit", storeItem)}
                        >
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleOpenModal("delete", storeItem)}
                        >
                          Remove
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table.Root>

      {openModal === "add" && (
        <AddProductModal
          product={selectedProduct}
          closeModal={closeModal}
          runFetch={fetchStore}
          onAddProduct={handleAddProduct}
        />
      )}
      {openModal === "edit" && (
        <EditProductModal
          product={selectedProduct}
          closeModal={closeModal}
          runFetch={fetchStore}
          onEditProduct={handleEditProduct}
        />
      )}
      {openModal === "delete" && (
        <DeleteProductModal
          product={selectedProduct}
          runFetch={fetchStore}
          closeModal={closeModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default ViewDepartmentStore;
