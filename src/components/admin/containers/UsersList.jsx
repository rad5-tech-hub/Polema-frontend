import React, { useState, useEffect } from "react";
import AddCustomer from "./AddCustomer";
import { Button, Heading, Table, Spinner } from "@radix-ui/themes";
import axios from "axios";
import { upperFirst } from "lodash";

import { LoaderIcon } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const UsersList = ({ child, setChild, page }) => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    axios
      .get(`${root}/customer/get-customers`)
      .then((response) => {
        const data = response.data; // Assuming response.data is the object returned by the API
        const result = Object.values(data);
        const resultInfo = result[1];

        if (resultInfo === undefined) {
          setCustomerData([]);
        } else {
          setCustomerData(resultInfo);
        }
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    <>
      {customerData.length !== 0 ? (
        <>
          <Heading className="py-4">{upperFirst(page)}</Heading>
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
              {customerData.map((details) => (
                <Table.Row key={details.id}>
                  <Table.RowHeaderCell>{details.name}</Table.RowHeaderCell>
                  <Table.Cell>{details.category}</Table.Cell>
                  <Table.Cell>{details.address}</Table.Cell>
                  <Table.Cell>{details.phonenumber}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </>
      ) : (
        <div className="h-screen flex items-center flex-col gap-5 justify-center">
          <p className="text-xl">No available {page}.</p>
        </div>
      )}
    </>
  );
};

export default UsersList;
