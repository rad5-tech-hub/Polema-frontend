import React, { useEffect, useState } from "react";
import { refractor, formatMoney } from "../../../date";
import { DropDownIcon } from "../../../icons";
import {
  DropdownMenu,
  Button,
  Heading,
  Select,
  Flex,
  Table,
  Spinner,
} from "@radix-ui/themes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import DeleteDialog from "./DeleteDialog"; // Import DeleteDialog
import EditDialog from "./EditDialog"; // Import EditDialog

const root = import.meta.env.VITE_ROOT;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productActive, setProductActive] = useState(true);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [displayPricePlan, setDisplayPricePlan] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const retrToken = localStorage.getItem("token");

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
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productActive]);

  const handleEditClick = (product) => {
    if (product.pricePlan) {
      setDisplayPricePlan(true);
    } else {
      setDisplayPricePlan(false);
    }
    setSelectedEditProduct(product);
  };

  return (
    <>
      {selectedEditProduct ? (
        <EditDialog
          product={selectedEditProduct}
          displayPricePlan={displayPricePlan}
          onClose={() => {
            setSelectedEditProduct(null);
            fetchProducts();
          }}
        />
      ) : (
        <div>
          <Flex justify="between" align="center">
            <Heading>
              All {productActive ? "Products" : "Raw Materials"}
            </Heading>
            <Select.Root
              defaultValue="products"
              onValueChange={(value) => setProductActive(value === "products")}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="products">Products</Select.Item>
                <Select.Item value="raw materials">Raw Materials</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Table.Root size="3" variant="surface" className="mt-5">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            {loading ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : products.length === 0 ? (
              <Table.Body className>
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No Products Found
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ) : (
              <Table.Body>
                {products.map((product) => (
                  <Table.Row key={product.id}>
                    <Table.Cell>{refractor(product.createdAt)}</Table.Cell>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>
                      {product.price.map((p, index) => (
                        <div key={index}>{p.unit}</div>
                      ))}
                    </Table.Cell>

                    <Table.Cell>
                      {product.price.map((p, index) => (
                        <div key={index}>₦{p.amount}</div>
                      ))}
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface">
                            <DropDownIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            onClick={() => handleEditClick(product)}
                          >
                            <FontAwesomeIcon icon={faPen} /> Edit
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
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
