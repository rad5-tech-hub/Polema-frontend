import React from "react";
import { TokensIcon } from "@radix-ui/react-icons";
import {
  Table,
  TextField,
  Heading,
  Flex,
  Separator,
  Text,
  Button,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const CustomerLedger = () => {
  return (
    <>
      <Flex className="mb-4" justify={"between"}>
        <Heading>Customer Ledger</Heading>
        <Button className="!bg-theme">
          <TokensIcon />
          Filter
        </Button>
      </Flex>
      {/* <Table.Root variant="surface">

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
      </Table.Root> */}
      <div className="min-h-[70vh] justify-center items-center flex">
        <div className="flex flex-col justify-center items-center gap-3">
          <Text size={"4"} className="font-amsterdam">
            Please click the filter button below to view an individual's ledger
          </Text>
          <p>
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </p>
          <Button className="!bg-theme">
            <TokensIcon />
            Filter
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomerLedger;
