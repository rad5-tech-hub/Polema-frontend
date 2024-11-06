import React from "react";
import { Heading, Separator, Table } from "@radix-ui/themes";

const DepartmentStoreViewOrders = () => {
  return (
    <div>
      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.RowHeaderCell>Date</Table.RowHeaderCell>
            <Table.RowHeaderCell>Raw Materials</Table.RowHeaderCell>
            <Table.RowHeaderCell>Quantity</Table.RowHeaderCell>
            <Table.RowHeaderCell>Unit</Table.RowHeaderCell>
            <Table.RowHeaderCell>Ecpected Delivery</Table.RowHeaderCell>
            <Table.RowHeaderCell>Status</Table.RowHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </div>
  );
};

export default DepartmentStoreViewOrders;
