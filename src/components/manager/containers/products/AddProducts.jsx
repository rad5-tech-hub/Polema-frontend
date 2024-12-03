import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faBriefcase,
  faSitemap,
  faBuilding,
  faStore,
  faTags,
  faCommentsDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { LoaderIcon } from "react-hot-toast";
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
import UpdateURL from "../ChangeRoute";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const AddProducts = () => {
  const [isloading, setIsLoading] = useState(false);
  const [pricePlan, setPricePlan] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState("");
  const [plans, setPlans] = useState([{ name: "", discount: "" }]);

  // State management for product name
  const [productName, setProductName] = useState("");

  // State management for selected category
  const [selectedCategory, setSelectedCategory] = useState("products");

  // State management for selected department
  const [selectedDept, setSelectedDept] = useState("");

  // State management for fetched departments
  const [department, setDepartment] = useState([]);

  const handleSwitchChange = (checked) => {
    setPricePlan(checked);
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
    setPlans([...plans, { name: "", discount: "" }]);
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
      .filter((plan) => plan.name && plan.discount) // Filter out empty plans
      .map((plan) => ({
        category: plan.name,
        amount: plan.discount,
      }));

    const submitObject = {
      name: e.target[0].value,
      category: selectedCategory === "products" ? "For Sale" : "For Purchase",
      departmentId: selectedDept,
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
      departmentId: selectedDept,
      price: [
        {
          unit: unit,
          amount: Number(basePrice),
        },
      ],
    };

    console.log(pricePlan ? submitObject : submitWithoutPlans);
    try {
      const response = await axios.post(
        `${root}/admin/add-product`,
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
      setPlans([{ name: "", discount: "" }]);
      setSelectedDept("");
      setSelectedCategory("products");
      setPricePlan(false);

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Flex justify={"between"} align={"center"}>
        <Heading className="text-left py-4">Create Product</Heading>

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
                type="text" // Use text type to enable formatting
                value={formatNumber(basePrice)} // Display formatted number
                onChange={handleBasePriceChange} // Update raw value without commas
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

            {/* Conditionally render Departments Dropdown */}

            <div className="w-full mt-3">
              <label className="text-[15px]  font-medium leading-[35px]">
                Department
              </label>
              <Select.Root
                value={selectedDept}
                onValueChange={(value) => setSelectedDept(value)} // Initial value
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select Department"
                >
                  <Flex as="span" align="center" gap="2">
                    <FontAwesomeIcon icon={faBriefcase} />
                    {department.find((dept) => dept.id === selectedDept)
                      ?.name || "Select Department"}
                  </Flex>
                </Select.Trigger>
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

        {selectedCategory !== "raw-materials" && (
          <div className="input-field mt-3 flex justify-end">
            <div>
              <label
                className="text-[15px] leading-none pr-[15px]"
                htmlFor="pricePlan"
              >
                Price Plan
              </label>

              <Switch.Root
                className={`${
                  pricePlan ? "bg-green-500" : "bg-gray-500"
                } w-[32px] h-[15px] bg-black-600 rounded-full relative shadow-[0_2px_10px] border-2 border-black shadow-black/25  data-[state=checked]:bg-green outline-none cursor-default`}
                id="pricePlan"
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
              >
                <Switch.Thumb className="block w-[11px] h-[11px] bg-white rounded-full shadow-[0_2px_2px] shadow-black transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>
          </div>
        )}

        {pricePlan && (
          <>
            <Heading className="py-4">Pricing Plan</Heading>
            <Separator className="w-full mb-4" />

            {plans.map((plan, index) => (
              <Flex key={index} gap={"4"} className="mb-2">
                <div className="w-full">
                  <label htmlFor={`plan-name-${index}`}>
                    Pricing Plan Name
                  </label>
                  <TextField.Root
                    type="text"
                    placeholder="Enter Plan Name"
                    className="mt-1"
                    value={plan.name}
                    onChange={(e) =>
                      handlePlanChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <label htmlFor={`plan-discount-${index}`}>
                    Plan Discount
                  </label>
                  <TextField.Root
                    type="text" // Use text type to enable formatting
                    placeholder="Enter Price Discount (in Naira)"
                    className="mt-1"
                    value={formatNumber(plan.discount)}
                    onChange={(e) =>
                      handlePlanChange(
                        index,
                        "discount",
                        e.target.value.replace(/,/g, "")
                      )
                    }
                  />
                </div>
              </Flex>
            ))}

            <Button
              className="mt-3"
              color="brown"
              radius="medium"
              onClick={handleAddPlan}
              type="button"
            >
              <PlusIcon width={"20px"} height={"20px"} />
              Add Plan
            </Button>
          </>
        )}

        <Flex justify={"end"} align={"end"} width={"100%"}>
          <Button
            className="mt-4  bg-theme hover:bg-theme/85"
            size={3}
            type="submit"
            disabled={isloading}
          >
            {isloading ? <LoaderIcon /> : "Create"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" containerStyle={{ padding: "30px" }} />
    </div>
  );
};

export default AddProducts;
