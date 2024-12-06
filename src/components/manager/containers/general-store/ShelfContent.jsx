import React, { useState, useEffect } from "react";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Table,
  Flex,
  Spinner,
  Heading,
  DropdownMenu,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { refractor } from "../../../date";
import toast from "react-hot-toast";
import { AddModal, EditModal, RemoveModal } from "./Modals.";

const root = import.meta.env.VITE_ROOT;

const ShelfContent = () => {
  const [shelf, setShelf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedSearch, setFailedSearch] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // Tracks the active modal
  const [selectedItem, setSelectedItem] = useState(null); // Tracks the selected item

  const fetchShelf = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-gen-store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response?.data?.stores || response?.data?.parsedStores;

      {
        store.length === 0 ? setFailedSearch(true) : setShelf(store);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusColor = (string) => {
    switch (string) {
      case "Out of Stock":
        return "text-red-500";
      case "In Stock":
        return "text-green-500";
      case "Low Stock":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  const openModal = (modalType, item) => {
    setSelectedItem(item);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  return (
    <>
      <Heading>Shelf Content</Heading>
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>SHELF NAME</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {shelf.length === 0 ? (
            <>
              <div className="p-4">
                {failedSearch ? "No records found." : <Spinner />}
              </div>
            </>
          ) : (
            shelf.map((item) => (
              <Table.Row key={item.id} className="relative !overflow-visible">
                <Table.RowHeaderCell>
                  {refractor(item.createdAt)}
                </Table.RowHeaderCell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.thresholdValue}</Table.Cell>
                <Table.Cell>
                  <Flex gap={"1"} align={"center"}>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${statusColor(item.status)}`}
                    />
                    {item.status}
                  </Flex>
                </Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="mt-1">
                    <Button variant="soft">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => openModal("add", item)}>
                      Add
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => openModal("edit", item)}>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => openModal("remove", item)}
                    >
                      Remove
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      {activeModal === "add" && (
        <AddModal
          isOpen={!!activeModal}
          runFetch={fetchShelf}
          onClose={closeModal}
          item={selectedItem}
        />
      )}
      {activeModal === "edit" && (
        <EditModal
          isOpen={!!activeModal}
          runFetch={fetchShelf}
          onClose={closeModal}
          item={selectedItem}
        />
      )}
      {activeModal === "remove" && (
        <RemoveModal
          isOpen={!!activeModal}
          runFetch={fetchShelf}
          onClose={closeModal}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default ShelfContent;
