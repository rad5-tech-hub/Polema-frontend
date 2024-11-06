import React from "react";
import {
  Heading,
  Separator,
  Button,
  TextField,
  Text,
  Flex,
  Grid,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const LocalPurchaseOrder = () => {
  const [suppliers, setSuppliers] = React.useState([]);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/customers/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
  }, []);
  return (
    <>
      <Heading>Local Purchase Order</Heading>
      <Separator className="my-4 w-full" />
      <Flex gap={"5"} className="mt-4">
        <div className="w-full">
          <Text>Delivered To</Text>
          <TextField.Root placeholder="Enter Receiver" className="mt-2" />
        </div>
        <div className="w-full">
          <Text>Cheque No.</Text>
          <TextField.Root placeholder="Enter Cheque No." className="mt-2" />
        </div>
      </Flex>
      <Flex gap={"5"} className="mt-4">
        <div className="w-full">
          <Text>Cheque Voucher No.</Text>
          <TextField.Root placeholder="Enter Reveiver" className="mt-2" />
        </div>
        <div className="w-full">
          <Text>Date</Text>
          <TextField.Root
            placeholder="Enter Date"
            type="date"
            className="mt-2"
          />
        </div>
      </Flex>

      <Separator className="my-10 w-full" />
      <Flex gap={"5"} className="mt-4">
        <div className="w-full">
          <Text>Name of Supplier</Text>
          <TextField.Root placeholder="Enter Supplier Name" className="mt-2" />
        </div>
        <div className="w-full">
          <Text>Raw Materials Needed</Text>
          <TextField.Root className="mt-2" />
        </div>
      </Flex>
      <Flex gap={"5"} className="mt-4">
        <div className="w-full">
          <Text>Unit Price</Text>
          <TextField.Root placeholder="Enter Unit Price" className="mt-2">
            <TextField.Slot>N</TextField.Slot>
          </TextField.Root>
        </div>
        <div className="w-full">
          <Text>Quantity Ordered</Text>
          <TextField.Root placeholder="Enter Date" className="mt-2" />
        </div>
      </Flex>
      <Flex gap={"5"} className="mt-4">
        <div className="w-full">
          <Text>L.P.O Expires</Text>
          <TextField.Root
            placeholder="Enter Reveiver"
            className="mt-2"
            type="date"
          />
        </div>
        <div className="w-full">
          <Text>Period</Text>
          <TextField.Root
            placeholder="Enter Date"
            type="date"
            className="mt-2"
          />
        </div>
      </Flex>
      <Grid gap={"5"} columns={"2"} className="mt-4">
        <div className="w-full">
          <Text>Specifications and comments</Text>
          <TextField.Root
            placeholder="Add any comment"
            className="mt-2"
            type="date"
          />
        </div>
      </Grid>
      <Flex className="mt-4" justify={"end"}>
        <Button className="!bg-theme" size={"3"}>
          Send
        </Button>
      </Flex>
    </>
  );
};

export default LocalPurchaseOrder;
