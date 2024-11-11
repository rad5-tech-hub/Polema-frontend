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

  const detailsArray = [
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Paracetamol",
      stockNumber: 350,
      stockAvailable: false,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 40,
      stockAvailable: false,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
  ];

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
      <Separator className="my-2 w-full" />

      <div>
        <Grid columns={"6"} rows={"3"} gapX={"4"} gapY={"3"}>
          {store.map((item, index) => {
            return (
              <div
                className="p-5 shadow-xl max-w-[175px] max-h-[101px] rounded-lg relative"
                key={index}
              >
                <div className="absolute top-2 right-2 ">
                  <FontAwesomeIcon
                    icon={faPills}
                    width={"16px"}
                    className="opacity-40"
                    height={"16px"}
                  />
                </div>
                <Blockquote>
                  <p className="text-[0.6rem]">{item.product.name}</p>
                  <p className="text-3xl  font-amsterdam">{item.quantity}</p>
                  {item.status === "In Stock" ? (
                    <p className="text-green-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowUp} />
                      Currently in Stock
                    </p>
                  ) : (
                    <p className="text-red-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowDown} />
                      Currently out of Stock
                    </p>
                  )}
                </Blockquote>
              </div>
            );
          })}
        </Grid>
      </div>

      {/* Table to show store details */}
      <Table.Root className="mt-6 mb-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT NAME</Table.ColumnHeaderCell>
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
