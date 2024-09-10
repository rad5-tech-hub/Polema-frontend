import React, { useState } from "react";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Flex,
} from "@radix-ui/themes";

const AddProduct = () => {
  const [price, setPrice] = useState(""); // For the raw price value
  const [formattedPrice, setFormattedPrice] = useState(""); // For displaying formatted price

  // Function to format number with commas (e.g., 20000 -> 20,000)
  const formatWithCommas = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to format number with spaces (e.g., 20000 -> 20 000)
  const formatWithSpaces = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, "").replace(/ /g, ""); // Remove commas and spaces
    if (!isNaN(inputValue)) {
      setPrice(inputValue); // Set raw price
      // Change format function as needed (with commas or spaces)
      // For comma-separated
      setFormattedPrice(formatWithCommas(inputValue));

      // For space-separated
      // setFormattedPrice(formatWithSpaces(inputValue));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Raw price:", price); // This will log the raw price without commas/spaces
    // Add your form submission logic here, using the `price` for calculations.
  };

  return (
    <div>
      <Card className="w-full">
        <Heading className="text-left p-4">Add Product</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="fullname"
                >
                  Product Name
                </label>
                <TextField.Root
                  placeholder="Enter Product name"
                  className=""
                  type="text"
                  id="fullname"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="price"
                >
                  Base Price
                </label>
                <TextField.Root
                  placeholder="Enter Base Price (in Naira)"
                  className=""
                  id="price"
                  value={formattedPrice} // Display formatted price
                  onChange={handlePriceChange}
                  type="text" // Keep it text to avoid default number validation interference
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>

            <div className="right w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px] font-medium leading-[35px]"
                  htmlFor="number"
                >
                  Product Unit
                </label>
                <TextField.Root
                  placeholder="Specify Unit (kg, litres, bags, others)"
                  className=""
                  id="number"
                  type="Text"
                  size={"3"}
                ></TextField.Root>
              </div>
              <Flex justify={"end"} align={"end"} width={"100%"}>
                <Button className="mt-4" size={3} type="submit">
                  Create
                </Button>
              </Flex>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
