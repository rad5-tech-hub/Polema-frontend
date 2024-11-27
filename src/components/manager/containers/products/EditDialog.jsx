import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Switch from "@radix-ui/react-switch";
import {
  Card,
  Button,
  Heading,
  TextField,
  Select,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditDialog = () => {
  const [isloading, setIsLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("products");
  const [selectedDept, setSelectedDept] = useState("");
  const [department, setDepartment] = useState([]);
  const [pricePlan, setPricePlan] = useState(false);
  const [plans, setPlans] = useState([{ name: "", discount: "" }]);

  const { productId } = useParams(); // Assuming you're passing the product ID via URL params
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchDepartments = async () => {
    let retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDepartment(response.data.departments);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchProductDetails = async (id) => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-product/${id}`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      const { product } = response.data;
      setProductName(product.name);
      setBasePrice(product.price[0].amount);
      setUnit(product.price[0].unit);
      setSelectedCategory(
        product.category === "For Sale" ? "products" : "raw-materials"
      );
      setSelectedDept(product.departmentId);
      // Assuming you need to handle price plans if present
      if (product.pricePlan && product.pricePlan.length > 0) {
        setPricePlan(true);
        setPlans(
          product.pricePlan.map((plan) => ({
            name: plan.category,
            discount: plan.amount,
          }))
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product details");
    }
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
      name: productName,
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

    try {
      const response = await axios.put(
        `${root}/admin/edit-product/${productId}`,
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

      navigate(`/products/${productId}`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Error updating product");
    }
  };

  const handleSwitchChange = (checked) => {
    setPricePlan(checked);
  };

  return (
    <div>
      <Heading className="text-left py-4">Edit Product</Heading>

      <form onSubmit={handleSubmit}>
        <div className="flex w-full justify-between gap-8">
          <div className="left w-[50%]">
            <div className="input-field mt-3">
              <label htmlFor="product-name" className="text-[15px] font-medium">
                Product Name
              </label>
              <TextField.Root
                placeholder="Enter Product Name"
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                id="product-name"
              />
            </div>

            <div className="input-field mt-3">
              <label htmlFor="base-price" className="text-[15px] font-medium">
                Base Price
              </label>
              <TextField.Root
                placeholder="Enter Base Price"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                id="base-price"
              />
            </div>
          </div>

          <div className="right w-[50%]">
            <div className="input-field mt-3">
              <label htmlFor="unit" className="text-[15px] font-medium">
                Product Unit
              </label>
              <TextField.Root
                placeholder="Specify Unit"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                id="unit"
              />
            </div>

            <div className="w-full mt-3">
              <label className="text-[15px] font-medium">Department</label>
              <Select.Root
                value={selectedDept}
                onValueChange={(value) => setSelectedDept(value)}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select Department"
                >
                  {department.find((dept) => dept.id === selectedDept)?.name ||
                    "Select Department"}
                </Select.Trigger>
                <Select.Content>
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
              <label htmlFor="pricePlan" className="text-[15px] font-medium">
                Price Plan
              </label>

              <Switch.Root
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
                id="pricePlan"
              >
                <Switch.Thumb />
              </Switch.Root>
            </div>
          </div>
        )}

        {pricePlan && (
          <>
            <Heading className="py-4">Pricing Plan</Heading>
            {plans.map((plan, index) => (
              <Flex key={index} gap={"4"} className="mb-2">
                <div className="w-full">
                  <TextField.Root
                    placeholder="Enter Plan Name"
                    value={plan.name}
                    onChange={(e) =>
                      setPlans((prevPlans) => {
                        const newPlans = [...prevPlans];
                        newPlans[index].name = e.target.value;
                        return newPlans;
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <TextField.Root
                    placeholder="Enter Price Discount"
                    value={plan.discount}
                    onChange={(e) =>
                      setPlans((prevPlans) => {
                        const newPlans = [...prevPlans];
                        newPlans[index].discount = e.target.value;
                        return newPlans;
                      })
                    }
                  />
                </div>
              </Flex>
            ))}
            <Button
              onClick={() => setPlans([...plans, { name: "", discount: "" }])}
            >
              <PlusIcon />
              Add Plan
            </Button>
          </>
        )}

        <Flex justify="end" className="w-full">
          <Button type="submit" disabled={isloading}>
            {isloading ? <Spinner /> : "Update"}
          </Button>
        </Flex>
      </form>

      <Toaster />
    </div>
  );
};

export default EditDialog;
