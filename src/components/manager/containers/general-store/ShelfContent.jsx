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
  TextField,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { refractor } from "../../../date";
import { toast } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

// Utility to handle API calls
const apiCall = async (url, method, data = null) => {
  const retrToken = localStorage.getItem("token");
  if (!retrToken) {
    toast.error("An error occurred. Try logging in again.");
    return null;
  }
  try {
    const config = {
      headers: { Authorization: `Bearer ${retrToken}` },
    };
    const response = await axios({
      url: `${root}${url}`,
      method: method,
      data: data,
      ...config,
    });
    return response.data;
  } catch (error) {
    toast.error(`Error: ${error.message}`);
    return null;
  }
};

// Dialog Component for Add, Edit, and Remove
const Dialog = ({ isOpen, onClose, type, itemId, runFetch }) => {
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(
    itemId ? itemId.thresholdValue : ""
  );

  const handleAction = async () => {
    setLoading(true);
    let response;

    switch (type) {
      case "add":
        response = await apiCall("/path/to/add", "POST", {
          shelfId: itemId.id,
          threshold,
        });
        break;
      case "edit":
        response = await apiCall(`/path/to/edit/${itemId.id}`, "PATCH", {
          threshold,
        });
        break;
      case "remove":
        response = await apiCall(`/path/to/remove/${itemId.id}`, "DELETE");
        break;
      default:
        toast.error("Unknown action");
        setLoading(false);
        return;
    }

    if (response) {
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successful`
      );
      runFetch(); // Refresh the shelf content
    }
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px]">
        <Heading className="mb-4 text-center">{`${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Item`}</Heading>
        {type !== "remove" ? (
          <>
            <TextField.Root className="w-full">
              <h1 className="w-full">Threshold Value</h1>
              <TextField.Root
                onChange={(e) => setThreshold(e.target.value)}
                value={threshold}
                placeholder="Enter Threshold Value"
              />
            </TextField.Root>
          </>
        ) : (
          <p>Are you sure you want to remove this item?</p>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
          <button
            onClick={handleAction}
            className={`${
              type === "add"
                ? "bg-green-500"
                : type === "edit"
                ? "bg-yellow-500"
                : "bg-red-500"
            } text-white px-4 py-2 rounded-md`}
          >
            {loading ? (
              <Spinner />
            ) : (
              type.charAt(0).toUpperCase() + type.slice(1)
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ShelfContent Component
const ShelfContent = () => {
  const [shelf, setShelf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchShelf = async () => {
    setLoading(true);
    const data = await apiCall("/dept/view-gen-store", "GET");
    if (data) setShelf(data.stores);
    setLoading(false);
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
          {loading ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : shelf.length === 0 ? (
            <div className="p-4">No items found</div>
          ) : (
            shelf.map((item) => (
              <Table.Row key={item.id} className="relative !overflow-visible">
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
                      color={item.status !== "In Stock" ? "red" : "green"}
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

      {/* Dialogs */}
      <Dialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        type="add"
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
      <Dialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        type="edit"
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
      <Dialog
        isOpen={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        type="remove"
        itemId={selectedItemId}
        runFetch={fetchShelf}
      />
    </>
  );
};

export default ShelfContent;
