import React, { useState } from "react";
import { faPills } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu } from "@radix-ui/themes";
import { Table, Heading, Separator, Flex, Button } from "@radix-ui/themes";
import { DropDownIcon } from "../../../icons";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ViewPharmacyOrder = () => {
  return (
    <>
      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      {/* Table to view orders  */}
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
          <Table.Row>
            <Table.Cell>2022-01-01</Table.Cell>
            <Table.Cell>
              <Flex align={"center"} gap={"1"}>
                <FontAwesomeIcon icon={faPills} />
                Septodont
              </Flex>
            </Table.Cell>
            <Table.Cell>20</Table.Cell>
            <Table.Cell>TONS</Table.Cell>
            <Table.Cell>10/12/2024</Table.Cell>
            <Table.Cell>
              <Flex align={"center"} gap={"1"}>
                <FontAwesomeIcon icon={faSquare} />
                CONFIRMED
              </Flex>
            </Table.Cell>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="surface" className="cursor-pointer ">
                  <DropDownIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Move to LPO</DropdownMenu.Item>
                <DropdownMenu.Item>Update Status</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2022-01-01</Table.Cell>
            <Table.Cell>
              {" "}
              <Flex align={"center"} gap={"1"}>
                <FontAwesomeIcon icon={faPills} />
                Septodont
              </Flex>
            </Table.Cell>
            <Table.Cell>20</Table.Cell>
            <Table.Cell>TONS</Table.Cell>
            <Table.Cell>10/12/2024</Table.Cell>
            <Table.Cell>
              <Flex align={"center"} gap={"1"}>
                <FontAwesomeIcon icon={faSquare} color="rgba(74,222,128)" />
                CONFIRMED
              </Flex>
            </Table.Cell>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="surface" className="cursor-pointer ">
                  <DropDownIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Move to LPO</DropdownMenu.Item>
                <DropdownMenu.Item>Update Status</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default ViewPharmacyOrder;
