import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  TextField,
  Text,
  Button,
  Flex,
  Card,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CollectFromGeneralStore = () => {
  const [toName, setToName] = useState(""); // Received by field
  const [comments, setComments] = useState(""); // Comments field
  const [departments, setDepartments] = useState([]); // Departments fetched from API
  const [items, setItems] = useState([
    { departmentId: "", quantityOrdered: "" },
  ]); // Items array

  // Fetch departments for Select dropdown
  const fetchGenStore = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-gen-store`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setDepartments(response.data.stores);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch general store details.");
    }
  };

  // Add a new empty item input field
  const addMoreItems = () => {
    setItems([...items, { departmentId: "", quantityOrdered: "" }]);
  };

  // Handle changes in the department and quantity fields for each item
  const handleItemChange = (index, field, value) => {
    // Update the specific item at the correct index
    setItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Remove empty or invalid entries before submission
  const sanitizeItems = (items) => {
    return items.reduce((acc, curr) => {
      if (curr.departmentId && curr.quantityOrdered) {
        acc[curr.departmentId] = Number(curr.quantityOrdered); // Add valid items to the object
      }
      return acc;
    }, {});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for if there token
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again.");
      return;
    }

    const sanitizedItems = sanitizeItems(items);

    // Check for duplicate department IDs within the items array
    const departmentIds = items.map((item) => item.departmentId); // Extract all department IDs
    const duplicateDepartment = departmentIds.some(
      (id, index) => departmentIds.indexOf(id) !== index
    );

    if (duplicateDepartment) {
      toast.error("Error: You cannot select the same department twice.");
      return;
    }

    if (Object.keys(sanitizedItems).length === 0) {
      toast.error("Please add at least one valid item.");
      return;
    }

    console.log(duplicateDepartment);

    const body = {
      receivedBy: toName,
      comments,
      item: sanitizedItems, // Final object of departmentId as keys and quantityOrdered as values
    };

    console.log(body);

    try {
      const response = await axios.post(
        `${root}/admin/raise-store-collection`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle response if needed
    } catch (e) {
      console.log(e);
      toast.error("An error occurred while submitting the form.");
    }
  };

  // Fetch departments on component mount
  useEffect(() => {
    fetchGenStore();
  }, []);

  return (
    <>
      <Heading>Collect from General Store</Heading>
      <Separator className="my-4 w-full" />
      <form onSubmit={handleSubmit}>
        {/* Received By Field */}
        <Flex gap={"4"}>
          <div className="w-full">
            <Text>
              Received By<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Name"
              required
              value={toName}
              onChange={(e) => setToName(e.target.value)}
            />
          </div>
        </Flex>

        {/* Dynamically rendered items */}
        <Card className="my-5">
          {items.map((item, index) => (
            <Flex key={index} gap={"5"} className="mb-3">
              {/* Department Select for Item Needed */}
              <div className="w-full">
                <Text>
                  Item Needed<span className="text-red-500">*</span>
                </Text>
                <Select.Root
                  value={item.departmentId}
                  onValueChange={(value) =>
                    handleItemChange(index, "departmentId", value)
                  }
                >
                  <Select.Trigger
                    placeholder="Select Store"
                    className="w-full mt-2"
                  />
                  <Select.Content>
                    {departments.map((dept) => (
                      <Select.Item key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              {/* Quantity Ordered Field */}
              <div className="w-full">
                <Text>
                  Quantity Ordered<span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Quantity"
                  type="number"
                  className="mt-2"
                  required
                  value={item.quantityOrdered}
                  onChange={(e) =>
                    handleItemChange(index, "quantityOrdered", e.target.value)
                  }
                />
              </div>
            </Flex>
          ))}

          {/* Add More Items Button */}
          <Flex justify={"end"}>
            <p
              className="underline text-sm mt-2 hover:text-red-500 cursor-pointer"
              onClick={addMoreItems}
            >
              Add more item
            </p>
          </Flex>
        </Card>

        {/* Comments Field */}
        <div className="w-full">
          <Text>Specifications and comments</Text>
          <TextField.Root
            placeholder="Enter Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Flex justify={"end"} className="mt-4">
          <Button className="!bg-theme" size={"3"}>
            Submit
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CollectFromGeneralStore;
