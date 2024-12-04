import React, { useEffect } from "react";

import {
  Heading,
  DropdownMenu,
  Separator,
  Button,
  Table,
  Spinner,
  Flex,
} from "@radix-ui/themes";
import axios from "axios";
import { toast } from "react-hot-toast";
import { refractor } from "../../../date";
import {
  faSquare,
  faEllipsisV,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

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
      // setShelf(response.data.stores);
    } catch (error) {
      console.log(error);
      // setShelf([]);
    }
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  // Pagination Functionality
  return (
    <div>
      <Heading>View Shelf</Heading>
      <Separator className="w-full my-4" />
      <Table.Root className="relative !h-fit" variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>SHELF NAME</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body></Table.Body>
      </Table.Root>
    </div>
  );
};

export default ViewShelf;
