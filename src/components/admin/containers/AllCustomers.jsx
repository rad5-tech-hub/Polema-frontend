// Manager's View

import React, { useState, useEffect } from "react";

import AddCustomer from "./AddCustomer";
import { Button, Table } from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const AllCustomers = ({ child, setChild }) => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    axios.get(`${root}/customer/get-customers`).then((response) => {
      const data = response.data; // Assuming response.data is the object returned by the API
      const result = Object.values(data);
      const resultInfo = result[1];

      // if (resultInfo === undefined) {
      //   setCustomerData([]);
      // } else {
      //   setCustomerData(resultInfo);
      // }
    });
  }, []);

  return (
    <>
      {customerData.length !== 0 ? (
        <Table.Root size={"3"} variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>

              <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {customerData.map((details) => {
              return (
                <Table.Row>
                  <Table.RowHeaderCell>{details.name}</Table.RowHeaderCell>
                  <Table.Cell>{details.category}</Table.Cell>
                  <Table.Cell>{details.address}</Table.Cell>
                  <Table.Cell>{details.phonenumber}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      ) : (
        <div className="h-screen flex items-center flex-col gap-5 justify-center">
          <p className="text-xl">No available customers.</p>
          <Button
            className="cursor-pointer"
            onClick={() => {
              setChild(<AddCustomer child={child} setChild={setChild} />);
            }}
          >
            Create Customer
          </Button>
        </div>
      )}
    </>
  );
};

export default AllCustomers;
