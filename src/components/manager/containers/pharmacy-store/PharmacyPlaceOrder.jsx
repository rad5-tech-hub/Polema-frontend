import React from "react";
import {
  Heading,
  Card,
  Separator,
  Flex,
  TextField,
  Text,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { toast } from "react-hot-toast"; // Assuming you're using this for notifications

const root = import.meta.env.VITE_ROOT;

const PharmacyPlaceOrder = () => {
  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [plans, setPlans] = React.useState([
    {
      rawMaterial: "",
      quantity: "",
      unit: "",
      expectedDelivery: "",
    },
  ]);

  // Function to fetch raw materials from the database
  const fetchRawMaterials = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-pharmstore-raw`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new plan (card)
  const addPlan = () => {
    setPlans([
      ...plans,
      { rawMaterial: "", quantity: "", unit: "", expectedDelivery: "" },
    ]);
  };

  // Remove a specific plan (card)
  const removePlan = (index) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
  };

  // Handle change in form fields
  const handleInputChange = (index, field, value) => {
    const updatedPlans = plans.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan
    );
    setPlans(updatedPlans);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      orders: plans,
    };

    try {
      const retrToken = localStorage.getItem("token");
      const response = await axios.post(`${root}/submit-order`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to place order.");
    }
  };

  React.useEffect(() => {
    fetchRawMaterials();
  }, []); // Fetch raw materials once on component mount

  return (
    <div>
      <Heading>Place Order</Heading>
      <Separator className="w-full my-4" />

      <form onSubmit={handleSubmit}>
        {plans.map((plan, index) => (
          <Card key={index} className="mb-4">
            <Flex justify={"end"}>
              <button
                type="button"
                className="text-red-500"
                onClick={() => removePlan(index)}
              >
                - Remove
              </button>
            </Flex>
            <div>
              <Flex className="w-full" gap={"7"}>
                <div className="w-full">
                  <Text className="mb-4">Raw Material Needed</Text>
                  <TextField.Root
                    className="mt-2"
                    placeholder="Select Raw Material"
                    value={plan.rawMaterial}
                    onChange={(e) =>
                      handleInputChange(index, "rawMaterial", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <Text className="mb-4">Quantity </Text>
                  <TextField.Root
                    className="mt-2"
                    placeholder="Enter Quantity"
                    value={plan.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
              </Flex>

              <Flex className="w-full mt-5" gap={"7"}>
                <div className="w-full">
                  <Text className="mb-4">Unit</Text>
                  <TextField.Root
                    className="mt-2"
                    placeholder="Enter Unit"
                    value={plan.unit}
                    onChange={(e) =>
                      handleInputChange(index, "unit", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <Text className="mb-4">Expected Delivery </Text>
                  <TextField.Root
                    type="date"
                    className="mt-2"
                    value={plan.expectedDelivery}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "expectedDelivery",
                        e.target.value
                      )
                    }
                  />
                </div>
              </Flex>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addPlan}
          size={"3"}
          className=" border-2 cursor-pointer  !border-theme mt-3"
        >
          Add Plan
        </Button>

        <Flex justify={"end"}>
          <Button
            type="submit"
            size={"3"}
            className="!bg-theme border-2 cursor-pointer  !border-theme mt-3"
          >
            Submit Order
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default PharmacyPlaceOrder;
