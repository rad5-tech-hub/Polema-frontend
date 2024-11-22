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
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
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
    const retrToken = localStorage.getItem("token");
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
      console.error("Error fetching store data:", error);
      toast.error("Failed to fetch store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStore();
  }, [isProductActive]);

  // Handle opening modals
  const handleOpenModal = (type, product = null) => {
    setSelectedProduct(product);
    setOpenModal(type);
  };

  const closeModal = () => {
    setOpenModal(null);
    setSelectedProduct(null);
  };

  // Callback to delete product from store state and server
  const handleDeleteProduct = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
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
      <Flex justify={"between"} align="center">
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
                <Table.RowHeaderCell>{storeItem.status}</Table.RowHeaderCell>
                <div className="absolute top-1 right-1">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="surface">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Group>
                        <DropdownMenu.Item
                          onClick={() => handleOpenModal("add")}
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
                          Delete
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
          closeModal={closeModal}
          onAddProduct={handleAddProduct}
        />
      )}
      {openModal === "edit" && (
        <EditProductModal
          product={selectedProduct}
          closeModal={closeModal}
          onEditProduct={handleEditProduct}
        />
      )}
      {openModal === "delete" && (
        <DeleteProductModal
          product={selectedProduct}
          closeModal={closeModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default ViewDepartmentStore;
