import React, { useState, useEffect } from "react";
import { refractor } from "../../../date";
import { faPills } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu } from "@radix-ui/themes";
import { Table, Heading, Separator, Flex, Button } from "@radix-ui/themes";
import { DropDownIcon } from "../../../icons";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-hot-toast"; // Make sure to import toast

const root = import.meta.env.VITE_ROOT;

const ViewPharmacyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  // Function to fetch info about orders placed
  const fetchOrders = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-pharm-order`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setOrders(response.data.Orders);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-pharmstore-raw`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRawMaterials(response.data.parsedStores); // Assuming parsedStores contains the raw materials
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get raw material name by ID
  const getRawMaterialName = (rawMaterialId) => {
    const rawMaterial = rawMaterials.find((item) => item.id === rawMaterialId);
    return rawMaterial ? rawMaterial.product.name : "Unknown"; // Return "Unknown" if not found
  };

  useEffect(() => {
    fetchOrders();
    fetchRaw();
  }, []); // Added fetchRaw to run on component mount

  return (
    <>
      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      {/* Table to view orders */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>RAW MATERIAL NAME</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>EXPECTED DELIVERY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{refractor(order.createdAt)}</Table.Cell>
              <Table.Cell>
                <Flex align={"center"} gap={"1"}>
                  <FontAwesomeIcon icon={faPills} />
                  {getRawMaterialName(order.rawMaterial)}{" "}
                </Flex>
              </Table.Cell>
              <Table.Cell>{order.quantity}</Table.Cell>
              <Table.Cell>{order.unit}</Table.Cell>
              <Table.Cell>{refractor(order.expectedDeliveryDate)}</Table.Cell>
              <Table.Cell>
                <Flex align={"center"} gap={"1"}>
                  <FontAwesomeIcon icon={faSquare} />
                  CONFIRMED
                </Flex>
              </Table.Cell>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="surface" className="cursor-pointer">
                    <DropDownIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>Move to LPO</DropdownMenu.Item>
                  <DropdownMenu.Item>Update Status</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default ViewPharmacyOrder;
