import React, { useEffect, useState } from "react";
import { Heading, Table } from "@radix-ui/themes";
import axios from "axios";
import UpdateURL from "./ChangeRoute";

const root = import.meta.env.VITE_ROOT;

const AllProducts = () => {
  const [products, setProducts] = useState([]);

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
      console.log(response);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <UpdateURL url={"/all-products"} />
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
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {products.map((product) => {
            return (
              <Table.Row>
                <Table.RowHeaderCell>{product.name}</Table.RowHeaderCell>
                <Table.Cell>Product for sale</Table.Cell>
                <Table.Cell>KG</Table.Cell>
                <Table.Cell>7000</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default AllProducts;
