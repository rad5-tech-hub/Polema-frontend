import React from "react";
import { Heading, Table } from "@radix-ui/themes";

const AllWayBill = () => {
  return (
    <>
      <Heading>View All Waybill</Heading>

      {/* Table to show Waybill Detials */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TRANSPORT </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default AllWayBill;
