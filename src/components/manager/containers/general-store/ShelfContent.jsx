import React, { useState, useEffect } from "react";
import {
  faEllipsisV,
  faSquare,
  faPlus,
  faMinus,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  Button,
  Table,
  Flex,
  Spinner,
  Heading,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { refractor } from "../../../date";
import { toast } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

// Add Dialog Component
const AddDialog = ({ isOpen, onClose, itemId, runFetch }) => {
  const [loading, setLoading] = useState(false);

  const addItem = async () => {
    setLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      await axios.post(
        `${root}/path/to/add`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setLoading(false);
      onClose();
      toast.success("Item added successfully");
      runFetch();
    } catch (error) {
      setLoading(false);
      onClose();
      toast.error("Error adding item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px]">
        <Heading className="mb-4 text-center">Add to {itemId.name}</Heading>
        <p>Are you sure you want to add this item?</p>
        {console.log(itemId)}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
          <button
            onClick={addItem}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? <Spinner /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Dialog Component
const EditDialog = ({ isOpen, onClose, itemId, runFetch }) => {
  const [loading, setLoading] = useState(false);

  const editItem = async () => {
    setLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      await axios.patch(
        `${root}/path/to/edit/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setLoading(false);
      onClose();
      toast.success("Item edited successfully");
      runFetch();
    } catch (error) {
      setLoading(false);
      onClose();
      toast.error("Error editing item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px]">
        <Heading className="mb-4 text-center">Edit Item</Heading>

        <p>Are you sure you want to edit this item?</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
          <button
            onClick={editItem}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? <Spinner /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Remove Dialog Component
const RemoveDialog = ({ isOpen, onClose, itemId, runFetch }) => {
  const [loading, setLoading] = useState(false);

  const removeItem = async () => {
    setLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      await axios.delete(`${root}/path/to/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setLoading(false);
      onClose();
      toast.success("Item removed successfully");
      runFetch();
    } catch (error) {
      setLoading(false);
      onClose();
      toast.error("Error removing item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px]">
        <Heading className="mb-4 text-center">Remove Item</Heading>
        <p>Are you sure you want to remove this item?</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
          <button
            onClick={removeItem}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? <Spinner /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShelfContent = () => {
  const [shelf, setShelf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchShelf = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-gen-store`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setShelf(response.data.stores);
    } catch (error) {
      console.log(error);
    }
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
              <Table.Row key={index} className="relative !overflow-visible">
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
                      color={`${item.status !== "In Stock" ? "red" : "green"}`}
                    />
                    {item.status}
                  </Flex>
                </Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setSelectedItemId(item);
                        setAddDialogOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setSelectedItemId(item);
                        setEditDialogOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setSelectedItemId(item);
                        setRemoveDialogOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} /> Remove
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <AddDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
      <RemoveDialog
        isOpen={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
    </>
  );
};

export default ShelfContent;
