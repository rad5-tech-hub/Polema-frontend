import React from "react";
import { Heading, Table } from "@radix-ui/themes";

const AllProducts = () => {
  return (
    <>
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
