import React from "react";
import { Heading, Table } from "@radix-ui/themes";

const AllReceipts = () => {
  return (
    <>
      <Heading>View All Receipts</Heading>

      {/* Table showing receipts data */}
      <Table.Root></Table.Root>
    </>
  );
};

export default AllReceipts;
