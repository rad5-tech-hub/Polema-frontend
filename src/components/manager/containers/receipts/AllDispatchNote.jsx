import React from "react";
import { Heading, Table } from "@radix-ui/themes";

const AllDispatchNote = () => {
  return (
    <>
      <Heading>View All Dispatch Note</Heading>

      {/* Table to view dispatch notes */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER'S NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ESCORT NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTURE TIME</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default AllDispatchNote;
