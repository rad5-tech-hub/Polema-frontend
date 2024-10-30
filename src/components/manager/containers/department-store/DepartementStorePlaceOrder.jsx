import React, { useState } from "react";
import {
  Heading,
  Separator,
  Text,
  Card,
  Flex,
  Select,
  Button,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const DepartementStorePlaceOrder = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [orderItems, setOrderItems] = useState([
    {
      rawMaterial: "",
      quantity: "",
      unit: "",
      expectedDeliveryDate: "",
    },
  ]);

  const fetchDept = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) return;
    try {
      const response = await axios.get(`${root}/dept/view-deptstore-raw`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setRawMaterials(response.data.stores);
    } catch (error) {
      setRawMaterials([]);
    }
  };

  React.useEffect(() => {
    fetchDept();
  }, []);

  const handleAddPlan = () => {
    setOrderItems([
      ...orderItems,
      {
        id: Date.now(),
        rawMaterial: "",
        quantity: "",
        unit: "",
        expectedDeliveryDate: "",
      },
    ]);
  };

  const handleRemovePlan = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { orders: orderItems };
    console.log(body);

    try {
      const retrToken = localStorage.getItem("token");
      await axios.post(`${root}/dept/create-dept-store`, body, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  return (
    <>
      <Flex justify={"between"}>
        <Heading>Place Order</Heading>
        <Button>View All</Button>
      </Flex>
      <Separator className="my-4 w-full" />

      <form onSubmit={handleSubmit}>
        {orderItems.map((item) => (
          <Card key={item.id} className="mt-3">
            <Flex justify={"end"}>
              <p
                onClick={() => handleRemovePlan(item.id)}
                className="text-red-500 cursor-pointer"
              >
                -Remove
              </p>
            </Flex>
            <Flex justify={"between"} gap={"4"}>
              <div className="w-full">
                <Text>Select Raw Material Needed</Text>
                <Select.Root
                  onValueChange={(value) =>
                    handleInputChange(item.id, "rawMaterial", value)
                  }
                >
                  <Select.Trigger
                    placeholder="Select raw materials"
                    disabled={rawMaterials.length === 0}
                    className="w-full mt-2"
                  />
                  <Select.Content>
                    {rawMaterials.map((rm) => (
                      <Select.Item value={rm.product.name} key={rm.id}>
                        {rm.product.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text>Quantity</Text>
                <TextField.Root
                  placeholder="Enter Quantity"
                  className="mt-2"
                  value={item.quantity}
                  onChange={(e) =>
                    handleInputChange(item.id, "quantity", e.target.value)
                  }
                />
              </div>
            </Flex>

            <Flex className="mt-4" gap={"4"}>
              <div className="w-full">
                <Text>Unit</Text>
                <TextField.Root
                  className="w-full mt-2"
                  placeholder="Set Unit"
                  value={item.unit}
                  onChange={(e) =>
                    handleInputChange(item.id, "unit", e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Text>Expected Delivery</Text>
                <TextField.Root
                  type="date"
                  className="w-full mt-2"
                  placeholder="Expected Delivery Date"
                  value={item.expectedDeliveryDate}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
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
          type="button"
          onClick={handleAddPlan}
          className="mt-3"
          size={"2"}
        >
          Add Plan
        </Button>

        <Flex justify={"end"}>
          <Button type="submit" className="mt-3 !bg-theme" size={"3"}>
            Submit Order
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default DepartementStorePlaceOrder;
