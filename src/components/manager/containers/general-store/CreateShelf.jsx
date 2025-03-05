import React from "react";
import {
  Heading,
  TextField,
  Text,
  Spinner,
  Flex,
  Separator,
  Button,
} from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const CreateShelf = () => {
  const [shelfName, setShelfName] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [thresholdVal, setThresholdVal] = React.useState([]);

  // State managemnt for loadin spinner on button
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    const body = {
      name: shelfName,
      unit: unit,
      thresholdValue: thresholdVal,
    };
    toast.loading("Adding item to shelf", {
      duration: 1500,
    });
    try {
      const response = await axios.post(`${root}/dept/create-gen-store`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
      setIsLoading(false);
      setShelfName("");
      setThresholdVal("");
      setUnit("");

      toast.success(response.data.message, {
        style: {
          padding: "30px",
        },
        duration: 10000,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response.data.message || error.message ||"An error occured.");
    }

    // console.log(body);
  };
  return (
    <>
      <Heading>Create Shelf</Heading>
      <Separator className="my-3 w-full" />

      <form action="" onSubmit={handleSubmit}>
        <Flex gap={"5"}>
          <div className="w-full">
            <Text className="mb-4">Shelf Name </Text>
            <TextField.Root
              className="mt-2 "
              onChange={(e) => setShelfName(e.target.value)}
              value={shelfName}
              placeholder="Input Shelf Name"
              required={true}
            ></TextField.Root>
          </div>
          <div className="w-full">
            <Text className="mb-4">Unit</Text>
            <TextField.Root
              className="mt-2 "
              onChange={(e) => setUnit(e.target.value)}
              value={unit}
              placeholder="Input Unit"
              required={true}
            ></TextField.Root>
          </div>
        </Flex>

        <Flex gap={"5"} className="mt-6">
          <div className="w-full">
            <Text className="mb-4">Threshold Value </Text>
            <TextField.Root
              className="mt-2 "
              required={true}
              onChange={(e) => setThresholdVal(e.target.value)}
              value={thresholdVal}
              placeholder="Input a Threshold Value"
            ></TextField.Root>
          </div>
        </Flex>

        <Flex className="mt-4" justify={"end"}>
          <Button
            className="!bg-theme cursor-pointer"
            size={"3"}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Create"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CreateShelf;
