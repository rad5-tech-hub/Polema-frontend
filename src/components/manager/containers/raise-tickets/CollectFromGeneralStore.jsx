import React, { useState, useEffect } from "react";
import {
  Heading,
  Separator,
  TextField,
  Text,
  Button,
  Flex,
  Grid,
  Card,
  Select,
  Spinner,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CollectFromGeneralStore = () => {
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [toName, setToName] = useState("");
  const [comments, setComments] = useState("");
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([
    { departmentId: "", quantityOrdered: "" },
  ]); // Items array
  const [superAdmins, setSuperAdmins] = useState([]);
  const [superAdminId, setSuperAdminId] = useState("");
  const [ticketID, setTicketId] = useState("");

  // Function to fetch super ADmins
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred,try logging in again", {
        style: {
          padding: "20px",
        },
        duration: 5500,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuperAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
    }
  };

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

  // Function to clear the form
  const clearForm = () => {
    setToName("");
    setComments("");
    setItems([{ departmentId: "", quantityOrdered: "" }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set button to loading state
    setButtonLoading(true);

    // Check for token
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again.");
      setButtonLoading(false);
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
      setButtonLoading(false);
      return;
    }

    if (Object.keys(sanitizedItems).length === 0) {
      toast.error("Please add at least one valid item.");
      setButtonLoading(false);
      return;
    }

    const body = {
      recievedBy: toName,
      comments,
      items: sanitizedItems, // Final object of departmentId as keys and quantityOrdered as values
    };

    console.log(body);

    try {
      // First API request
      const response = await axios.post(
        `${root}/admin/raise-store-collection`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set ticket ID from response
      const ticketId = response.data.ticket.id;
      setTicketId(ticketId);

      // Validate superAdminId before the second request
      if (!superAdminId) {
        throw new Error("Super admin ID is required for the second request.");
      }

      // Second API request
      const secondRequest = await axios.post(
        `${root}/admin/send-store-auth/${ticketId}`,
        {
          adminIds: [superAdminId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success toast
      toast.success("Form submitted and sent successfully!", {
        duration: 10000,
        style: {
          padding: "20px",
        },
      });
      // Optionally clear form here
      clearForm();
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while submitting the form.");
    } finally {
      // Reset button loading state
      setButtonLoading(false);
    }
  };
  // Fetch departments on component mount
  useEffect(() => {
    fetchGenStore();
    fetchSuperAdmins();
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
              className="mt-2"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Send To</Text>
            <Select.Root
              onValueChange={(val) => {
                setSuperAdminId(val);
              }}
              required
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Admin"
              />
              <Select.Content position="popper">
                {superAdmins.map((admins) => {
                  return (
                    <Select.Item
                      key={admins.id}
                      value={admins.id}
                    >{`${admins.firstname} ${admins.lastname}`}</Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
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
                  <Select.Content position="popper">
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
        <div className="flex gap-4">
          <div className="w-[50%]">
            <Text>Specifications and comments</Text>
            <TextField.Root
              placeholder="Enter Comments"
              className="mt-2"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Flex justify={"end"} className="mt-4">
          <Button className="!bg-theme" size={"3"}>
            {buttonLoading ? <Spinner /> : "Submit"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CollectFromGeneralStore;
