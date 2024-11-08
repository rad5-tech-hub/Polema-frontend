import React, { useEffect, useState } from "react";
import {
  Heading,
  Text,
  Select,
  Flex,
  Separator,
  Card,
  TextField,
  Button,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const GeneralStorePlaceOrder = () => {
  // State to manage loader icon
  const [isLoading, setIsLoading] = useState(false);

  // State to manage fetched shelves
  const [shelves, setShelves] = useState([]);

  // State to track all the plans (cards)
  const [plans, setPlans] = useState([
    {
      productId: "",
      quantity: "",
      unit: "",
      expectedDeliveryDate: "",
    },
  ]);

  // Function to handle adding a new plan
  const handleAddPlan = () => {
    setPlans([
      ...plans,
      {
        productId: "",
        quantity: "",
        unit: "",
        expectedDeliveryDate: "",
      },
    ]);
  };

  // Function to handle removing a plan by id
  const handleRemovePlan = (id) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  // Function to handle input changes for each plan
  const handleInputChange = (id, field, value) => {
    setPlans(
      plans.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan))
    );
  };

  // Function to reset form
  const resetForm = () => {
    setPlans([
      {
        productId: "",
        quantity: "",
        unit: "",
        expectedDeliveryDate: "",
      },
    ]);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const body = {
      orders: plans,
    };

    const retrToken = localStorage.getItem("token");
    toast.loading("Submitting Order...", {
      style: {
        padding: "30px",
      },
      duration: 1500,
    });

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.post(
        `${root}/dept/create-genstore-order`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      console.log(response);
      setIsLoading(false);
      toast.success(response.data.message);
      resetForm();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("An error occured");
    }
  };

  // Function to view shelf
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
      setShelves(response.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  return (
    <>
      <Heading>Place Order</Heading>
      <Separator className="my-3 w-full" />

      <form onSubmit={handleSubmit}>
        {plans.map((plan) => (
          <Card className="mt-8" key={plan.id}>
            <Flex justify={"end"}>
              <Text
                className="text-red-500 cursor-pointer"
                onClick={() => handleRemovePlan(plan.id)}
              >
                - Remove
              </Text>
            </Flex>
            <Flex className="mt-4" gap={"5"}>
              <div className="w-full">
                <Text className="mb-4">Shelf Name</Text>
                <Select.Root
                  onValueChange={(value) =>
                    handleInputChange(plan.id, "productId", value)
                  }
                  required={true}
                >
                  <Select.Trigger
                    className="w-full mt-2"
                    placeholder="Select Shelf Name"
                  />
                  <Select.Content>
                    <Select.Group>
                      {shelves.map((item) => (
                        <Select.Item key={item.id} value={item.id}>
                          {item.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text className="mb-4">Quantity</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Quantity"
                  type="number"
                  value={plan.quantity}
                  required={true}
                  onChange={(e) =>
                    handleInputChange(plan.id, "quantity", e.target.value)
                  }
                />
              </div>
            </Flex>
            <Flex className="mt-4" gap={"5"}>
              <div className="w-full">
                <Text className="mb-4">Unit</Text>
                <TextField.Root
                  className="mt-2 cursor-not-allowed"
                  placeholder=" Unit"
                  disabled={true}
                  value={plan.unit}
                  onChange={(e) =>
                    handleInputChange(plan.id, "unit", e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Text className="mb-4">Expected Delivery</Text>
                <TextField.Root
                  className="mt-2"
                  required={true}
                  placeholder="Select Date"
                  type="date"
                  value={plan.expectedDeliveryDate}
                  onChange={(e) =>
                    handleInputChange(
                      plan.id,
                      "expectedDeliveryDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </Flex>
          </Card>
        ))}

        <Button
          className="mt-6 border-2 cursor-pointer"
          size={"2"}
          type="button"
          onClick={handleAddPlan}
        >
          Add Plan
        </Button>

        <Flex justify={"end"}>
          <Button
            className="mt-6 border-2 !bg-theme cursor-pointer"
            size={"3"}
            type="submit"
          >
            {isLoading ? <LoaderIcon /> : "Submit"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default GeneralStorePlaceOrder;
