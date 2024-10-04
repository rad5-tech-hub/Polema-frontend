import React from "react";
import UpdateURL from "../ChangeRoute";
import { Table, TextField } from "@radix-ui/themes";
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
      <UpdateURL url={"/customer-ledger"} />

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
