import React from "react";
import { Table, Select, Heading, Separator } from "@radix-ui/themes";

const CashManagementLedger = () => {
  return (
    <>
      <Heading>Cash Ledger</Heading>

      {/* Table to show the  cash ledger details */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GIVEN TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>APROVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CREDIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </>
  );
};

export default CashManagementLedger;
