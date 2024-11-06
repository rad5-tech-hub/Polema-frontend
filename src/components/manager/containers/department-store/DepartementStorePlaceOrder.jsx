import React, { useState, useEffect } from "react";
import {
  Heading,
  Card,
  TextField,
  Grid,
  Text,
  Button,
  Flex,
  Spinner,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";

const DepartementStorePlaceOrder = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dept, setDept] = useState([]);
  const [plans, setPlans] = useState([
    {
      id: Date.now(),
      departmentId: "",
      productId: "",
      quantity: "",
      unit: "",
      expectedDeliveryDate: "",
    },
  ]);

  // Fetch raw materials only when a department is selected
  const fetchRawMaterials = async (departmentId) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken || !departmentId) return;

    try {
      const response = await axios.get(
        `${root}/dept/get-dept-raw/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setRawMaterials(response.data.products);
    } catch (error) {
      console.log(error);
      setRawMaterials([]);
    }
  };

  // Fetch departments
  const fetchDept = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) return;

    try {
      const response = await axios.get(`${root}/dept/get-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDept(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDept();
  }, []);

  // Handle input change for each plan
  const handleInputChange = (id, field, value) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    );
  };

  // Add new plan card
  const addPlan = () => {
    setPlans([
      ...plans,
      {
        id: Date.now(),
        departmentId: "",
        productId: "",
        quantity: "",
        unit: "",
        expectedDeliveryDate: "",
      },
    ]);
  };

  // Remove plan card by id
  const removePlan = (id) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  // Submit orders
  const placeOrder = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    let retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const orders = plans.map((plan) => ({
      departmentId: plan.departmentId,
      productId: plan.productId,
      quantity: plan.quantity,
      unit: plan.unit,
      expectedDeliveryDate: plan.expectedDeliveryDate,
    }));
    console.log(orders);

    try {
      const response = await axios.post(
        `${root}/dept/create-deptstore-order`,
        {
          orders,
        },
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setBtnLoading(false);
      toast.success("Order placed successfully");
    } catch (error) {
      console.error("Failed to place order:", error);
      setBtnLoading(false);
    }
  };

  return (
    <div>
      <Heading>Place Order</Heading>
      <form action="" onSubmit={placeOrder}>
        {plans.map((plan) => (
          <Card key={plan.id} className="mt-5">
            <Flex justify={"end"}>
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removePlan(plan.id)}
              >
                - Remove
              </span>
            </Flex>
            <Grid columns={"2"} rows={"2"} gap={"4"}>
              <div className="w-full">
                <Text>Select Department</Text>
                <Select.Root
                  required={true}
                  onValueChange={(val) => {
                    handleInputChange(plan.id, "departmentId", val);
                    fetchRawMaterials(val); // Fetch raw materials when department is selected
                  }}
                >
                  <Select.Trigger
                    className="mt-2 w-full"
                    placeholder="Select Department"
                  />
                  <Select.Content>
                    {dept.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text>Raw Material Needed</Text>
                <Select.Root
                  required={true}
                  disabled={rawMaterials.length === 0}
                  onValueChange={(val) => {
                    handleInputChange(plan.id, "productId", val);
                    const product = rawMaterials.find(
                      (item) => item.id === val
                    );
                    handleInputChange(
                      plan.id,
                      "unit",
                      product ? product.price[0].unit : ""
                    );
                  }}
                >
                  <Select.Trigger
                    className="mt-2 w-full"
                    placeholder="Select Raw Material"
                  />
                  <Select.Content>
                    {rawMaterials.map((material) => (
                      <Select.Item key={material.id} value={material.id}>
                        {material.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className="w-full">
                <Text>Quantity</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter quantity"
                  value={plan.quantity}
                  required={true}
                  onChange={(e) =>
                    handleInputChange(plan.id, "quantity", e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Text>Unit</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Unit"
                  value={plan.unit}
                  disabled
                />
              </div>
              <div className="w-full">
                <Text>Expected Delivery</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Expected Delivery"
                  required={true}
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
            </Grid>
          </Card>
        ))}
        <Button className="mt-4" onClick={addPlan}>
          Add Plan
        </Button>

        <Flex className="mt-4" justify={"end"}>
          <Button className="bg-theme" size={"3"} type="submit">
            {btnLoading ? <Spinner /> : "Place Order"}
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default DepartementStorePlaceOrder;
