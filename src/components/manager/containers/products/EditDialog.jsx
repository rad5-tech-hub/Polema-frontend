import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import UpdateURL from "../ChangeRoute";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditDialog = ({ product, onClose }) => {
  const [isloading, setIsLoading] = useState(false);
  const [pricePlan, setPricePlan] = useState(false);
  const [basePrice, setBasePrice] = useState(product.price[0].amount);
  const [unit, setUnit] = useState(product.price[0].unit);
  const [plans, setPlans] = useState([{ name: "", discount: "" }]);

  const [productName, setProductName] = useState(product.name);
  const [selectedCategory, setSelectedCategory] = useState("products");
  const [selectedDept, setSelectedDept] = useState("");
  const [department, setDepartment] = useState([]);
  const [deptID, setDeptId] = useState("");

  const handleSwitchChange = (checked) => {
    setPricePlan(checked);
  };

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "");
    if (!isNaN(inputValue)) setBasePrice(inputValue);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setPlans(updatedPlans);
  };

  const handleAddPlan = () => {
    setPlans([...plans, { name: "", discount: "" }]);
  };

  const fetchDepartments = async () => {
    let retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-department`);
      setDepartment(response.data.departments);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };

  const getDepartment = () => {
    const defaultDeptId = product.departmentId;
    const departments = department.find((dpt) => dpt.id === defaultDeptId);
    return departments ? departments.name : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const plansArray = plans
      .filter((plan) => plan.name && plan.discount)
      .map((plan) => ({
        category: plan.name,
        amount: plan.discount,
      }));

    const submitObject = {
      name: e.target[0].value,
      category: selectedCategory === "products" ? "For Sale" : "For Purchase",
      departmentId: product.departmentId ? product.departmentId : deptID,
      price: [{ unit, amount: Number(basePrice) }],
      pricePlan: plansArray,
    };

    const submitWithoutPlans = {
      name: productName,
      category: selectedCategory === "products" ? "For Sale" : "For Purchase",
      departmentId: product.departmentId ? product.departmentId : deptID,
      price: [{ unit, amount: Number(basePrice) }],
    };

    try {
      const response = await axios.patch(
        `${root}/admin/edit-product/${product.id}`,
        pricePlan ? submitObject : submitWithoutPlans,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setIsLoading(false);
      toast.success(response.data.message);
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Flex justify={"between"} align={"center"}>
        <Heading className="text-left py-4">Edit Product</Heading>
        <Select.Root
          value={selectedCategory}
          onValueChange={setSelectedCategory}
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
              <label htmlFor="product-name">Product Name</label>
              <TextField.Root
                placeholder="Enter Product name"
                type="text"
                required
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                id="product-name"
                size={"3"}
              />
            </div>
            <div className="input-field mt-3">
              <label htmlFor="price">Base Price</label>
              <TextField.Root
                placeholder="Enter Base Price"
                id="price"
                required
                type="text"
                value={formatNumber(basePrice)}
                onChange={handleBasePriceChange}
              />
            </div>
          </div>
          <div className="right w-[50%]">
            <div className="input-field mt-3">
              <label htmlFor="unit">Product Unit</label>
              <TextField.Root
                placeholder="Specify Unit (kg, litres, bags, others)"
                id="unit"
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                size={"3"}
              />
            </div>
            <div className="w-full mt-3">
              <label>Department</label>
              <Select.Root
                defaultValue={product.departmentId}
                onValueChange={setDeptId}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select Department"
                />
                <Select.Content position="popper">
                  {department.map((dept) => (
                    <Select.Item key={dept.id} value={dept.id}>
                      {dept.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {selectedCategory !== "raw-materials" && (
          <div className="input-field mt-3 flex justify-end">
            <div>
              <label htmlFor="pricePlan">Price Plan</label>
              <Switch.Root
                className={`${
                  pricePlan ? "bg-green-500" : "bg-gray-500"
                } w-[32px] h-[15px] rounded-full`}
                id="pricePlan"
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
              >
                <Switch.Thumb className="block w-[11px] h-[11px] bg-white rounded-full" />
              </Switch.Root>
            </div>
          </div>
        )}

        {pricePlan && (
          <>
            <div className="text-center py-4">
              <h3>Price Plans</h3>
            </div>
            {plans.map((plan, index) => (
              <div className="mt-4" key={index}>
                <div className="input-field">
                  <label htmlFor={`plan-name-${index}`}>Plan Name</label>
                  <TextField.Root
                    id={`plan-name-${index}`}
                    type="text"
                    value={plan.name}
                    onChange={(e) =>
                      handlePlanChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="input-field">
                  <label htmlFor={`plan-discount-${index}`}>Discount (%)</label>
                  <TextField.Root
                    id={`plan-discount-${index}`}
                    type="text"
                    value={plan.discount}
                    onChange={(e) =>
                      handlePlanChange(index, "discount", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-3">
              <Button
                variant="outline"
                onClick={handleAddPlan}
                icon={<PlusIcon />}
              >
                Add Plan
              </Button>
            </div>
          </>
        )}

        <Flex justify={"between"} align={"center"} className="py-4">
          <Button
            onClick={onClose}
            variant="outline"
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="solid"
            disabled={isloading}
            icon={isloading ? <Spinner /> : null}
          >
            {isloading ? "Saving..." : "Save Changes"}
          </Button>
        </Flex>
      </form>
      <Toaster />
    </div>
  );
};

export default EditDialog;
