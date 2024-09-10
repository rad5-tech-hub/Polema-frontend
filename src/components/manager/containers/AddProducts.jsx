import React, { useState } from "react";
import axios from "axios";
import * as Switch from "@radix-ui/react-switch";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Flex,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const AddProducts = () => {
  const [pricePlan, setPricePlan] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [plans, setPlans] = useState([{ name: "", discount: "" }]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

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

  // Add new plan fields
  const handleAddPlan = () => {
    setPlans([...plans, { name: "", discount: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the Plans object from the plans array
    const plansObject = plans.reduce((acc, plan) => {
      if (plan.name && plan.discount) {
        acc[plan.name] = plan.discount;
      }
      return acc;
    }, {});

    const submitObject = {
      productName: e.target[1].value,
      basePrice: basePrice, // Submit raw base price without commas
      productUnit: e.target[3].value,
      plans: plansObject, // Plans as an object
    };

    console.log(submitObject);

    // Add your form submission logic here
  };

  return (
    <div>
      <Card className="w-full">
        <Heading className="text-left py-4">Add Product</Heading>
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
                  size={"3"}
                />
              </div>
            </div>
          </div>

          <div className="input-field mt-3 flex justify-end">
            <div>
              <label
                className="text-[15px] leading-none pr-[15px]"
                htmlFor="pricePlan"
              >
                Price Plan
              </label>
              <Switch.Root
                className={`
                ${pricePlan ? "bg-green-500" : "bg-gray-500"}
                w-[32px] h-[15px] bg-black-600 rounded-full relative shadow-[0_2px_10px] border-2 border-black shadow-black/25  data-[state=checked]:bg-green outline-none cursor-default`}
                id="pricePlan"
                checked={pricePlan}
                onCheckedChange={handleSwitchChange}
              >
                <Switch.Thumb className="block w-[11px] h-[11px] bg-white rounded-full shadow-[0_2px_2px] shadow-black transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>
          </div>

          {pricePlan && (
            <Card className="mt-4">
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
              >
                <PlusIcon width={"20px"} height={"20px"} />
                Add Plan
              </Button>
            </Card>
          )}

          <Flex justify={"end"} align={"end"} width={"100%"}>
            <Button className="mt-4" size={3} type="submit">
              Create
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
};

export default AddProducts;
