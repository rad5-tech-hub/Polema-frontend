import React from "react";
import { TokensIcon } from "@radix-ui/react-icons";
import {
  Table,
  TextField,
  Heading,
  Flex,
  Separator,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const CustomerLedger = () => {
  const fetchLedgerDetails = async () => {
    try {
      const response = await axios.get(`${root}/`);
    } catch (error) {}
  };
  return (
    <>
      <Flex className="mb-4" justify={"between"}>
        <Heading>Customer Ledger</Heading>
        <Button className="!bg-theme">
          <TokensIcon />
          Filter
        </Button>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QTY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CREDIT TYPE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT (₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT (₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default CustomerLedger;
