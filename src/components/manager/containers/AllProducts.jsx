import React, { useEffect, useState } from "react";
import { Heading, Table } from "@radix-ui/themes";
import axios from "axios";
import UpdateURL from "./ChangeRoute";

const root = import.meta.env.VITE_ROOT;

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
  } catch (error) {
    console.log(error);
  }
};

const AllProducts = () => {
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
          <Table.Row>
            <Table.RowHeaderCell>PKC</Table.RowHeaderCell>
            <Table.Cell>Product for sale</Table.Cell>
            <Table.Cell>KG</Table.Cell>
            <Table.Cell>7000</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>PK</Table.RowHeaderCell>
            <Table.Cell>Product for sale</Table.Cell>
            <Table.Cell>Tons</Table.Cell>
            <Table.Cell>5400</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default AllProducts;
