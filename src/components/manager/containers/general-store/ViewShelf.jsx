import React, { useEffect } from "react";

import {
  Heading,
  Separator,
  Table,
  Spinner,
  Flex,
  DropdownMenu,
  TabNav,
} from "@radix-ui/themes";
import axios from "axios";
import { toast } from "react-hot-toast";

import { refractor } from "../../../date";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const root = import.meta.env.VITE_ROOT;

const ViewShelf = () => {
  const [shelf, setShelf] = React.useState([]);

  // Function to fetch shelf from db
  const fetchShelf = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-gen-store`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setShelf(response.data.stores);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch shelf data."); // Optionally handle errors
    }
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  return (
    <div>
      <Heading>View Shelf</Heading>
      <Separator className="w-full my-4" />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>SHELF NAME</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {shelf.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            shelf.map((item, index) => (
              <Table.Row key={index} className="relative">
                <Table.RowHeaderCell>
                  {refractor(item.createdAt)}
                </Table.RowHeaderCell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.thresholdValue}</Table.Cell>
                <Table.Cell>
                  <Flex gap={"1"} align={"center"}>
                    <FontAwesomeIcon
                      icon={faSquare}
                      color={`${item.status != "In Stock" ? "red " : "green"}`}
                    />
                    {item.status}
                  </Flex>
                </Table.Cell>
                <div className="p-3 rounded-full cursor-pointer absolute right-[10px] hover:bg-[rgba(225,225,225,1)]">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </div>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default ViewShelf;
