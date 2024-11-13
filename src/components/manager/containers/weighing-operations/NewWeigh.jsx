import React from "react";
import {
  Heading,
  Separator,
  Grid,
  TextField,
  Text,
  Flex,
  Button,
  Select,
} from "@radix-ui/themes";
import { useState } from "react";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const NewWeigh = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerID] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [tar, setTar] = useState("");
  const [gross, setGross] = useState("");
  const [net, setNet] = useState(Number(gross) - Number(tar));

  // Function to fetch customer details
  const fetchCustomerDetails = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) return;

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchCustomerDetails();
  }, []);
  return (
    <>
      <Heading>New Weigh</Heading>
      <Separator className="w-full mt-3" />

      <Grid columns={"2"} gap={"4"} className="mt-4">
        <div className="w-full">
          <Text>Select Customer</Text>
          <Select.Root
            onValueChange={(value) => {
              setCustomerID(value);
            }}
          >
            <Select.Trigger
              className="w-full mt-2"
              placeholder="Select Customer"
            />
            <Select.Content>
              {customers.map((customer) => {
                return (
                  <Select.Item
                    value={customer.id}
                  >{`${customer.firstname} ${customer.lastname}`}</Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="w-full">
          <Text>Vehicle No.</Text>
          <TextField.Root placeholder="Input Vehicle No." className="mt-2" />
        </div>
        <div className="w-full">
          <Text>Quantity (Tar)</Text>
          <TextField.Root
            placeholder="Input Tar"
            className="mt-2"
            value={tar}
            onChange={(e) => {
              setTar(e.target.value);
            }}
          />
        </div>
        <div className="w-full">
          <Text>Quantity (Gross)</Text>
          <TextField.Root
            placeholder="Input Gross"
            className="mt-2"
            value={gross}
            onChange={(e) => {
              setGross(e.target.value);
            }}
          />
        </div>

        <div className="w-full">
          <Text>Quantity (Net)</Text>
          <TextField.Root
            placeholder="Show Net"
            className="mt-2"
            disabled
            value={gross - tar}
          />
        </div>
      </Grid>

      <Flex justify={"end"}>
        <Button size={"3"} className="!bg-theme">
          Add
        </Button>
      </Flex>
    </>
  );
};

export default NewWeigh;
