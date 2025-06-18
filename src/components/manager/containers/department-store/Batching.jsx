import React from "react";
import { Heading, Flex, Button, Table } from "@radix-ui/themes";
const Batching = () => {
  return (
    <>
      <Flex justify={"between"}>
        <Heading>Batching Records</Heading>
        <Button color="brown" className="cursor-pointer">New Batch</Button>
      </Flex>

      <Table.Root className="mt-4" variant="surface">
        <Table.Row>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TOTAL FVO SOLD (TONS)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TOTAL CPKO BOUGHT (TONS)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TOTAL FATTY ACID SOLD</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>TOTAL SLUDGE SOLD</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Root>
    </>
  );
};

export default Batching;
