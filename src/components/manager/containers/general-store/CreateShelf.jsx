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
import useToast from "../../../../hooks/useToast";
const root = import.meta.env.VITE_ROOT;

const CreateShelf = () => {
  const [shelfName, setShelfName] = React.useState("");
  const showToast = useToast();

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
    showToast({
      message: "Creating shelf...",
      type: "loading",
      duration: 1500,
    })
    
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
      showToast({
        message: response.data.message,
        type: "success",
        duration: 5000,
      })
    
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast({
        message:
          error.response.data.message ||
          error.response.data.errors.join("\n") ||
          error.response.data.messages.join("\n") ||
          error.message ||
          "An error occured.",
        type: "error",
        duration: 5000,
      });
     
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
              className="mt-2 w-[48%] "
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
