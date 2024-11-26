import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Select,
  Button,
  TextField,
  Grid,
  Text,
  Card,
  Heading,
  Separator,
  Flex,
} from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;

const EditDialog = ({ selectedEditProduct, setEditDialogOpen }) => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState(selectedEditProduct.name);
  const [unit, setUnit] = useState(selectedEditProduct.price[0].unit);
  const [basePrice, setBasePrice] = useState(
    selectedEditProduct.price[0].amount
  );
  const [departmentId, setDepartmentId] = useState(
    selectedEditProduct.departmentId
  );
  const [productActive, setProductActive] = useState(
    selectedEditProduct.category !== "For Purchase"
  );
  const [pricePlans, setPricePlans] = useState(
    selectedEditProduct.pricePlan || []
  );

  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-department`);
      setDepartments(response.data.departments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      category: productActive ? "For Sale" : "For Purchase",
      price: [{ unit, amount: basePrice }],
      pricePlan: pricePlans,
    };
    console.log(body);
  };

  const handleAddPlan = () => {
    setPricePlans([...pricePlans, { category: "", amount: "" }]);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...pricePlans];
    updatedPlans[index][field] = value;
    setPricePlans(updatedPlans);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <Flex align={"center"} justify={"between"} gap={"2"}>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="cursor-pointer"
            onClick={() => setEditDialogOpen(false)}
          />
          <Heading>Edit {selectedEditProduct.name}</Heading>
        </div>
        <Select.Root
          defaultValue={
            selectedEditProduct.category === "For Purchase"
              ? "raw materials"
              : "products"
          }
          onValueChange={(value) => setProductActive(value === "products")}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="products">Products</Select.Item>
            <Select.Item value="raw materials">Raw Materials</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="w-full my-4" />

      <form onSubmit={handleEditSubmit}>
        <Grid columns={"2"} gapX={"5"} gapY={"2"}>
          <div className="w-full">
            <Text>Product Name</Text>
            <TextField.Root
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Product Unit</Text>
            <TextField.Root
              className="mt-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Base Price</Text>
            <TextField.Root
              className="mt-2"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Select Department</Text>
            <Select.Root
              defaultValue={departmentId}
              onValueChange={(value) => setDepartmentId(value)}
              disabled={departments.length === 0}
            >
              <Select.Trigger className="w-full mt-2" />
              <Select.Content>
                {departments.map((department) => (
                  <Select.Item key={department.id} value={department.id}>
                    {department.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Grid>

        <Card className="mt-4">
          <Heading>Pricing Plan</Heading>
          {pricePlans.map((plan, index) => (
            <Grid key={index} columns={"2"} gap={"3"} className="mt-4">
              <div className="w-full">
                <Text>Price Plan Name</Text>
                <TextField.Root
                  className="mt-2 w-full"
                  placeholder="Price Name"
                  value={plan.category}
                  onChange={(e) =>
                    handlePlanChange(index, "category", e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Text>Plan Discount</Text>
                <TextField.Root
                  className="mt-2 w-full"
                  placeholder="Enter Price Discount in Naira"
                  value={plan.amount}
                  onChange={(e) =>
                    handlePlanChange(index, "amount", e.target.value)
                  }
                />
              </div>
            </Grid>
          ))}
          <Button
            color="brown"
            className="mt-4"
            type="button"
            onClick={handleAddPlan}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Plan
          </Button>
        </Card>

        <Flex justify={"end"} gap={"4"} className="mt-6">
          <Button
            className="!bg-red-500 cursor-pointer"
            type="button"
            onClick={() => setEditDialogOpen(false)}
          >
            Discard Changes
          </Button>
          <Button type="submit">Edit {selectedEditProduct.name}</Button>
        </Flex>
      </form>
    </>
  );
};

export default EditDialog;
