import React from "react";
import { Table, Heading } from "@radix-ui/themes";

const AllInvoice = () => {
  return (
    <>
      <Heading>View all Invoice</Heading>

      {/* Table showing invoice details */}
      <Table.Root variant="surface" className="mt-2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>INVOICE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TIME OUT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIPT STATUS</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default AllInvoice;
