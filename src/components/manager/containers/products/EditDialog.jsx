import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Switch from "@radix-ui/react-switch";
import {
  Card,
  Button,
  Heading,
  DropdownMenu,
  Separator,
  TextField,
  Select,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditDialog = ({ product, onClose }) => {
  const [isloading, setIsLoading] = useState(false);
  const [pricePlan, setPricePlan] = useState(Array.isArray(product.pricePlan));
  const [basePrice, setBasePrice] = useState(product.price[0].amount);
  const [unit, setUnit] = useState(product.price[0].unit);
  const [plans, setPlans] = useState(
    product.pricePlan || [{ category: "", amount: "" }]
  );

  // State management for product name
  const [productName, setProductName] = useState(product.name);

  // State management for selected category
  const [selectedCategory, setSelectedCategory] = useState("products");

  // State management for selected department
  const [selectedDept, setSelectedDept] = useState("");

  // State management for fetched departments
  const [department, setDepartment] = useState([]);
  const [deptID, setDeptId] = useState("");

  const handleSwitchChange = (checked) => {
    setPricePlan(checked);
    if (!checked) setPlans([]); // Reset plans when switched off
  };

  // Function to format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle base price input change
  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, ""); // Remove commas from the input value
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue); // Update state with raw number (without commas)
    }
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value,
    };
    setPlans(updatedPlans);
  };

  // Add new plan fields
  const handleAddPlan = () => {
    setPlans([...plans, { category: "", amount: "" }]);
  };

  // Fetch departments from db
  const fetchDepartments = async () => {
    let retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-department`);

      setDepartment(response.data.departments);
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  // Function to get default department for products
  const getDepartment = () => {
    const defaultDeptId = product.departmentId;
    const departments = department.find((dpt) => dpt.id === defaultDeptId);
    return departments ? departments.name : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Create the Plans object from the plans array
    const plansArray = plans
      .filter((plan) => plan.category && plan.amount) // Filter out empty plans
      .map((plan) => ({
        category: plan.category,
        amount: plan.amount,
      }));

    const submitObject = {
      name: e.target[0].value,
      category: selectedCategory === "products" ? "For Sale" : "For Purchase",
      departmentId: product.departmentId ? product.departmentId : deptID,
      price: [
        {
          unit: unit,
          amount: Number(basePrice),
        },
      ],
      pricePlan: plansArray,
    };

    const submitWithoutPlans = {
      name: productName,
      category: selectedCategory === "products" ? "For Sale" : "For Purchase",
      departmentId: product.departmentId ? product.departmentId : deptID,
      price: [
        {
          unit: unit,
          amount: Number(basePrice),
        },
      ],
    };

    console.log(pricePlan ? submitObject : submitWithoutPlans);
    try {
      const response = await axios.patch(
        `${root}/admin/edit-product/${product.id}`,
        pricePlan ? submitObject : submitWithoutPlans,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setIsLoading(false);
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      // Reset form fields after successful submission
      setProductName("");
      setBasePrice("");
      setUnit("");
      setPlans([{ category: "", amount: "" }]);
      setSelectedDept("");
      setSelectedCategory("products");
      setPricePlan(false);

      setTimeout(() => {
        onClose();
      }, 3000);

      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      {
        error.response.data.error
          ? toast.error(error.response.data.error)
          : toast.error(error.response.data.message);
      }
    }
  };

  // Function that fetch details of a product
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Flex justify={"between"} align={"center"}>
        <Flex align={"center"} gap={"3"}>
          <div
            className="cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <Heading className="text-left py-4">Edit Product</Heading>
        </Flex>

        <Select.Root
          defaultValue="products"
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            if (value === "products") {
              setSelectedCategory("products");
            }
          }}
        >
          <Select.Trigger placeholder="Select" />
          <Select.Content>
            <Select.Group>
              <Select.Item value="raw-materials">Raw Materials</Select.Item>
              <Select.Item value="products">Products</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="w-full" />
      <form onSubmit={handleSubmit}>
        <div className="flex w-full justify-between gap-8">
          <div className="left w-[50%]">
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="product-name"
              >
                Product Name
              </label>
              <TextField.Root
                placeholder="Enter Product name"
                type="text"
                required={true}
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                id="product-name"
                size={"3"}
              />
            </div>

            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="price"
              >
                Base Price
              </label>
              <TextField.Root
                placeholder="Enter Base Price"
                id="price"
                required={true}
                type="text"
                value={formatNumber(basePrice)}
                onChange={handleBasePriceChange}
              />
            </div>
          </div>

          <div className="right w-[50%]">
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="unit"
              >
                Product Unit
              </label>
              <TextField.Root
                placeholder="Specify Unit (kg, litres, bags, others)"
                id="unit"
                type="text"
                required={true}
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
                size={"3"}
              />
            </div>

            <div className="w-full mt-3">
              <label className="text-[15px]  font-medium leading-[35px]">
                Department
              </label>

              <Select.Root
                defaultValue={product.departmentId}
                onValueChange={(val) => setDeptId(val)}
              >
                <Select.Trigger
                  placeholder="Select Department"
                  className="w-full mt-1"
                />

                <Select.Content position="popper">
                  {department.map((dept) => {
                    return (
                      <Select.Item key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Item>
                    );
                  })}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-3 flex justify-between">
            <label
              className="text-[15px] font-medium leading-[35px]"
              htmlFor="switch"
            >
              Price Plan
            </label>
            {/* <Switch.Root
                id="switch"
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
              /> */}
          </div>

          {pricePlan && (
            <>
              <div className="flex w-full">
                {plans.map((plan, index) => (
                  <div key={index}>
                    <TextField.Root
                      placeholder="Category"
                      className="w-full"
                      value={plan.category}
                      onChange={(e) =>
                        handlePlanChange(index, "category", e.target.value)
                      }
                    />
                    <TextField.Root
                      placeholder="Amount"
                      value={plan.amount}
                      className="w-full"
                      onChange={(e) =>
                        handlePlanChange(index, "amount", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" onClick={handleAddPlan} className="mt-2">
                Add Plan
              </Button>
            </>
          )}
        </div>
        <div className="w-full mt-4">
          <Button type="submit" disabled={isloading}>
            {isloading ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDialog;
