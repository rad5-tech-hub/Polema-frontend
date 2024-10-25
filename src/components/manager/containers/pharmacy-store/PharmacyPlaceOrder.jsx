import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { LoaderIcon } from "react-hot-toast";
import {
  Heading,
  Card,
  Separator,
  Flex,
  TextField,
  Text,
  Button,
  Select,
} from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const PharmacyPlaceOrder = () => {
  // State management for button loader
  const [isLoading, setIsLoading] = React.useState();

  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [plans, setPlans] = React.useState([
    {
      rawMaterial: "",
      quantity: "",
      unit: "",
      expectedDeliveryDate: "",
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
      setRawMaterials(response.data.parsedStores);
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

    setIsLoading(true);
    toast.loading("Submitting Form", {
      style: {
        padding: "30px",
      },
      duration: 1000,
    });
    const body = {
      orders: plans,
    };
    console.log(body);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.post(
        `${root}/dept/raise-pharm-order`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      console.log(response);
      setIsLoading(false);
      toast.success(response.data.message, {
        style: {
          padding: "30px",
        },
        duration: 3500,
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error();
    }
  };

  React.useEffect(() => {
    fetchRawMaterials();
  }, []);

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

                  <Select.Root
                    onValueChange={(value) =>
                      handleInputChange(index, "rawMaterial", value)
                    }
                  >
                    <Select.Trigger
                      className="mt-2 w-full"
                      placeholder="Select Raw Material"
                    />
                    <Select.Content>
                      <Select.Group>
                        {rawMaterials.map((item) => (
                          <Select.Item
                            key={item.id}
                            value={item.productId} // Set item.id as the value
                          >
                            {item.product.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
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
                        "expectedDeliveryDate",
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
            {isLoading ? <LoaderIcon /> : "Submit Order"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default PharmacyPlaceOrder;
