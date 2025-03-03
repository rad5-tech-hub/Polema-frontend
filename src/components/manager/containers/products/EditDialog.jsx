import React, { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import * as Switch from "@radix-ui/react-switch";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Select,
  Flex,
  Spinner,
} from "@radix-ui/themes";

import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditDialog = ({ product, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [pricePlan, setPricePlan] = useState(
  //   typeof product.pricePlan === "string"
  //     ? Array.isArray(JSON.parse(product.pricePlan))
  //       ? true
  //       : false
  //     : false
  // );

  const [pricePlan, setPricePlan] = useState(
    // typeof product.pricePlan === "string" ? false : true
    Array.isArray(product.pricePlan)
  );
  const [basePrice, setBasePrice] = useState(product.price[0].amount || "");
  const [unit, setUnit] = useState(product.price[0].unit || "");
  // const [plans, setPlans] = useState([{ name: "", discount: "" }]);

  // console.log(typeof product.pricePlan);

  // const [plans, setPlans] = useState(
  //   pricePlan
  //     ? JSON.parse(product.pricePlan).map((plan) => ({
  //         name: plan.category || "",
  //         discount: plan.amount || "",
  //       }))
  //     : [{ name: "", discount: "" }]
  // );

  const [plans, setPlans] = useState(() => {
    try {
      if (pricePlan && product?.pricePlan) {
        // const parsedPlans = JSON.parse(product.pricePlan);
        // console.log(parsedPlans);

        if (Array.isArray(product.pricePlan)) {
          return product.pricePlan.map((plan) => ({
            name: plan.category || "",
            discount: plan.amount || "",
          }));
        } else {
          return [];
        }
      }
    } catch (error) {
      console.error("Error parsing pricePlan:", error);
    }
    return [{ name: "", discount: "" }];
  });

  const [productName, setProductName] = useState(product.name);
  const [selectedCategory, setSelectedCategory] = useState("products");
  const [selectedDept, setSelectedDept] = useState("");
  const [department, setDepartment] = useState([]);
  const [deptID, setDeptId] = useState(product.departmentId || "");

  const handleSwitchChange = (checked) => {
    setPricePlan(checked);
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBasePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "");
    if (!isNaN(inputValue)) {
      setBasePrice(inputValue);
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

  const handleAddPlan = () => {
    setPlans([...plans, { name: "", discount: "" }]);
  };

  const handleRemovePlan = (index) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
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
      console.log(error);
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
      name: productName,
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

      setProductName("");
      setBasePrice("");
      setUnit("");
      setPlans([{ name: "", discount: "" }]);
      setSelectedDept("");
      setSelectedCategory("products");
      setPricePlan(false);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Flex justify={"between"} align={"center"}>
        <div className="flex items-center gap-3">
          <div
            className="cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <Heading className="text-left py-4">Edit Product</Heading>
        </div>

        <Select.Root
          defaultValue="products"
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
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
                onChange={(e) => setUnit(e.target.value)}
                size={"3"}
              />
            </div>

            <div className="w-full mt-3">
              <label className="text-[15px] font-medium leading-[35px]">
                Department
              </label>

              <Select.Root
                value={deptID}
                onValueChange={(val) => setDeptId(val)}
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
            <div>
              {plans.map((plan, index) => (
                <div className="flex flex-col mt-4">
                  <div
                    key={index}
                    className="input-field grid grid-cols-2 items-center justify-center gap-4 mt-2"
                  >
                    <div className="plan-field">
                      <label
                        className="text-[15px] font-medium leading-[35px]"
                        htmlFor={`plan-name-${index}`}
                      >
                        Plan Name
                      </label>
                      <TextField.Root
                        id={`plan-name-${index}`}
                        type="text"
                        value={plan.name}
                        className="mt-5"
                        onChange={(e) =>
                          handlePlanChange(index, "name", e.target.value)
                        }
                        required={true}
                        placeholder="Plan Name"
                      />
                    </div>

                    <div className="plan-field">
                      <label
                        className="text-[15px] font-medium leading-[35px] flex justify-between"
                        htmlFor={`plan-discount-${index}`}
                      >
                        Discount{" "}
                        <Button
                          type="button"
                          className="bg-red-500 text-white h-[40px] px-8 text-[20px] mb-4"
                          onClick={() => handleRemovePlan(index)}
                        >
                          -
                        </Button>
                      </label>
                      <TextField.Root
                        id={`plan-discount-${index}`}
                        type="text"
                        value={plan.discount}
                        onChange={(e) =>
                          handlePlanChange(index, "discount", e.target.value)
                        }
                        required={true}
                        placeholder="Plan Discount"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  onClick={handleAddPlan}
                  className="bg-theme hover:bg-theme/75 px-8 h-[40px]"
                >
                  +
                </Button>
              </div>
            </div>
          </>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-[50%] h-[40px] mx-auto mt-6 bg-theme hover:bg-theme/75 text-white text-md font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Spinner className="w-5 h-5 inline-block mr-3" /> Processing...
            </>
          ) : (
            "Update Product"
          )}
        </Button>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default EditDialog;
