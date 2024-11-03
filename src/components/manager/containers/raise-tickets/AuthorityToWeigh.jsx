import React from "react";
import axios from "axios";
import {
  Heading,
  Flex,
  Button,
  Separator,
  TextField,
  Grid,
  Select,
  Text,
  Table,
} from "@radix-ui/themes";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";

const AuthorityToWeigh = () => {
  // State management for fetched Customers
  const [customers, setCusomers] = React.useState([]);
  const [adminId, setAdminId] = React.useState("");
  const [vehicleNumber, setVehicleNumber] = React.useState("");
  const [driverName, setDriverName] = React.useState("");
  const [inputDisability, setInputDisability] = React.useState(true);

  // Function to fetch customers from db
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCusomers(response.data.customers);
      setInputDisability(false);
      setIn;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });

      return;
    }
    const body = {
      customerId: adminId,
      vehicleNumber: vehicleNumber,
      driverName: driverName,
    };
    toast.loading("Creating Ticket..", {
      style: {
        padding: "20px",
      },
      duration: 1000,
    });
    const resetForm = () => {
      setAdminId("");
      setDriverName("");
      setVehicleNumber("");
    };

    try {
      const response = await axios.post(
        `${root}/admin/raise-auth-weigh`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      toast.success(response.data.message, {
        style: {
          padding: "20px",
        },
        duration: 4500,
      });
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  const ViewAuthorityToWeigh = () => {
    const [details, setDetails] = React.useState([]);

    // Function to fetch details
    const fetchDetails = async () => {
      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again", {
          duration: 6500,
          style: {
            padding: "30px",
          },
        });

        return;
      }

      try {
        const response = await axios.get(`${root}`);
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <>
        <Flex align={"center"} gap={"3"}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <Heading>View Authority To Weigh</Heading>
        </Flex>
        <Separator className="w-full my-4" />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
          </Table.Header>
          <Table.Body>
            <Table.Row></Table.Row>
          </Table.Body>
        </Table.Root>
      </>
    );
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <>
      <Flex justify={"between"}>
        <Heading>Authority to Weigh</Heading>
        <Button size={"2"} className="cursor-pointer ">
          View All
        </Button>
      </Flex>
      <Separator className="my-5 w-full" />

      <form action="" onSubmit={handleSubmit}>
        <Grid columns={"2"} rows={"2"} gap={"4"}>
          <div className="w-full">
            <Text>Vehicle Number</Text>
            <TextField.Root
              placeholder="Enter Vehicle Number"
              onChange={(e) => setVehicleNumber(e.target.value)}
              value={vehicleNumber}
              className="mt-2"
            />
          </div>
          <div className="w-full">
            <Text>Customer Name</Text>
            <Select.Root
              disabled={inputDisability}
              onValueChange={(value) => {
                setAdminId(value);
              }}
            >
              <Select.Trigger
                placeholder="Select Customer"
                className="w-full mt-2"
              />
              <Select.Content>
                {customers.map((item) => {
                  return (
                    <Select.Item key={item.id} value={item.id}>
                      {item.firstname} {item.lastname}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text>Driver's Name</Text>
            <TextField.Root
              placeholder="Enter Driver's Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
        </Grid>

        <Flex justify={"end"}>
          <Button size={"3"} className="cursor-pointer mt-5 !bg-theme">
            Send
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
      <ViewAuthorityToWeigh />
    </>
  );
};

export default AuthorityToWeigh;
