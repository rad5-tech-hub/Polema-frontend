import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  TextField,
  Text,
  Button,
  Flex,
  Card,
} from "@radix-ui/themes";
import axios from "axios";
import toast from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CollectFromGeneralStore = () => {
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [comments, setComments] = useState("");

  // Initialize items as an empty array to manage multiple items
  const [items, setItems] = useState([
    { itemNeeded: "", quantityOrdered: "" }, // Start with one empty field set
  ]);

  // Fetch details from the general store
  const fetchGenStore = async () => {
    const retrToken = localStorage.getItem("token");
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new item input field
  const addMoreItems = () => {
    setItems([
      ...items,
      { itemNeeded: "", quantityOrdered: "" }, // Add an empty object for the new item
    ]);
  };

  // Handle changes in the input fields for items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value; // Update the field of the correct item
    setItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsObject = items.reduce((acc, curr) => {
      if (curr.itemNeeded && curr.quantityOrdered) {
        acc[curr.itemNeeded] = curr.quantityOrdered; // Add item as key-value pair
      }
      return acc;
    }, {});
    console.log("Submitted items:", itemsObject); // For now, this just logs the items object
    // You can replace this with an API call to save the items
  };

  useEffect(() => {}, []);

  return (
    <>
      <Heading>Collect from general store</Heading>
      <Separator className="my-4 w-full" />
      <form onSubmit={handleSubmit}>
        <Flex gap={"4"}>
          <div className="w-full">
            <Text>
              Received By<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              className=""
              placeholder="Enter Name"
              required
              value={toName}
              onChange={(e) => setToName(e.target.value)}
            />
          </div>
        </Flex>

        <Card className="my-5">
          {/* Render item inputs dynamically */}
          {items.map((item, index) => (
            <Flex key={index} gap={"5"} className="mb-3">
              <div className="w-full">
                <Text>
                  Item Needed<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Item"
                  required
                  value={item.itemNeeded}
                  onChange={(e) =>
                    handleItemChange(index, "itemNeeded", e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Text>
                  Quantity Ordered<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Quantity"
                  type="number"
                  required
                  value={item.quantityOrdered}
                  onChange={(e) =>
                    handleItemChange(index, "quantityOrdered", e.target.value)
                  }
                />
              </div>
            </Flex>
          ))}

          <Flex justify={"end"}>
            <p
              className="underline text-sm mt-2 hover:text-red-500 cursor-pointer"
              onClick={addMoreItems}
            >
              Add more item
            </p>
          </Flex>
        </Card>

        <div className="w-full">
          <Text>Specifications and comments</Text>
          <TextField.Root
            className=""
            placeholder="Enter Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <Flex justify={"end"} className="mt-4">
          <Button className="!bg-theme" size={"3"}>
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default CollectFromGeneralStore;
