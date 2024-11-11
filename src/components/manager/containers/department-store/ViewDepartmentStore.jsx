import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";
import React, { useState } from "react";
import {
  Separator,
  Grid,
  Blockquote,
  Table,
  Button,
  DropdownMenu,
  Flex,
  Select,
  Heading,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEllipsisV,
  faPills,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const ViewDepartmentStore = () => {
  const [isProductActive, setIsProductActive] = React.useState(true);
  const [store, setStore] = React.useState([]);

  // Function to fetch store details
  const fetchStore = async () => {
    let retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Check if the api returns an empty array
    try {
      const response = await axios.get(
        `${root}/dept/${
          isProductActive ? "view-deptstore-prod" : "view-deptstore-raw"
        }`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setStore(response.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchStore();
  }, [isProductActive]);
  return (
    <div>
      <Flex justify={"between"}>
        <Heading>View Store</Heading>
        <Select.Root
          defaultValue="products"
          onValueChange={(value) => {
            value === "products"
              ? setIsProductActive(true)
              : setIsProductActive(false);
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="products">Products</Select.Item>
            <Select.Item value="raw materials">Raw Materials</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Table to show store details */}
      <Table.Root className="mt-6 mb-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {isProductActive ? "PRODUCT" : "RAW MATERIAL"} NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {store.map((storeItem) => {
            return (
              <Table.Row className="relative">
                <Table.RowHeaderCell>
                  {refractor(storeItem.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.product.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.product.department.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{storeItem.unit}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.thresholdValue}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{storeItem.status}</Table.RowHeaderCell>
                <div className="absolute top-1  right-1 ">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="surface">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Group>
                        <DropdownMenu.Item>Add</DropdownMenu.Item>
                        <DropdownMenu.Item>Remove</DropdownMenu.Item>
                        <DropdownMenu.Item>Edit</DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
      <Toaster position="top-right" />
    </div>
  );
};

export default ViewDepartmentStore;
