import React from "react";
import {
  Heading,
  Card,
  Separator,
  Flex,
  TextField,
  Text,
  Button,
} from "@radix-ui/themes";

const PharmacyPlaceOrder = () => {
  return (
    <div>
      <Heading>Place Order</Heading>
      <Separator className="w-full my-4" />
      <Card>
        <form action="">
          <Flex justify={"end"}>
            <button className="text-red-500">- Remove</button>
          </Flex>
          <div>
            <Flex className="w-full" gap={"7"}>
              <div className="w-full">
                <Text className="mb-4">Raw Material Needed</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Select Raw Material"
                ></TextField.Root>
              </div>
              <div className="w-full">
                <Text className="mb-4">Quantity </Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Quantity"
                ></TextField.Root>
              </div>
            </Flex>

            <Flex className="w-full mt-5" gap={"7"}>
              <div className="w-full">
                <Text className="mb-4">Unit</Text>
                <TextField.Root
                  className="mt-2"
                  placeholder="Enter Unit"
                ></TextField.Root>
              </div>
              <div className="w-full">
                <Text className="mb-4">Expected Delivery </Text>
                <TextField.Root
                  type="date"
                  className="mt-2"
                  placeholder="Enter Quantity"
                ></TextField.Root>
              </div>
            </Flex>
          </div>
        </form>
      </Card>
      <Button
        size={"3"}
        className="!bg-theme border-2 cursor-pointer  !border-theme mt-3"
      >
        Add Plan
      </Button>
    </div>
  );
};

export default PharmacyPlaceOrder;
