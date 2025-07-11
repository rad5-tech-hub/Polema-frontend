import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Heading, Button, Flex } from "@radix-ui/themes";
const AllChequeRecords = () => {
  const navigate = useNavigate();
  return (
    <>
      <Flex justify={"between"} align={"center"} className="mb-8">
        <Heading className="mb-4">All Cheque Records</Heading>
        <Button
          className="!bg-theme cursor-pointer"
          onClick={() => {
            navigate("/admin/receipts/cheques");
          }}
        >
           Cheque Record
        </Button>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CHEQUE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BANK</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>AMOUNT</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>PURPOSE OF PAYMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default AllChequeRecords;
