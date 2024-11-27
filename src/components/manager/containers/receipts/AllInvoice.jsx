import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Table, Heading } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const AllInvoice = () => {
  // Function to view invoice details

  //   const fetchDetails = async () => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("an error occurred , try logging in again", {
  //         duration: 10000,
  //       });
  //       return;
  //     }

  //     try{
  // const response = await axios.get(`${root}/`)
  //     }catch(e){
  //       console.log(e);

  //     }
  //   };
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
