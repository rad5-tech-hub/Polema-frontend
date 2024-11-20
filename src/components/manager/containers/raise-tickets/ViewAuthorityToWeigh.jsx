import React from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { refractor } from "../../../date";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Spinner,
  Table,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const ViewAuthorityToWeigh = () => {
  const navigate = useNavigate();

  const [weighDetails, setWeighDetails] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [failledSearch, setFailedSearch] = React.useState(false);

  // Function to fetch auth weigh details
  const fetchWeighDetails = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/view-all-auth-weigh`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      response.data.records.length === 0
        ? setFailedSearch(true)
        : setWeighDetails(response.data.records);
    } catch (error) {
      console.log(error);
      toast.error("An error occured");
    }
  };

  // Function to fetch customer details
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

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

  //Function to get customer name by id
  const matchCustomerNameByID = (id) => {
    const customer = customers.find((item) => item.id === id);
    return customer ? customer : "Customer Name not found";
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchWeighDetails();
  }, []);
  return (
    <>
      <Heading>Authority to Weigh</Heading>

      {/* Table to display auth to weigh details */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DRIVER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {weighDetails.length === 0 ? (
            <div className="p-4">
              {failledSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            weighDetails.map((item) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>{item.vehicleNo}</Table.Cell>
                  <Table.Cell>
                    {`${matchCustomerNameByID(item.customerId).firstname} ${
                      matchCustomerNameByID(item.customerId).lastname
                    }`}
                  </Table.Cell>
                  <Table.Cell>{item.driver}</Table.Cell>
                  <Table.Cell>{_.upperFirst(item.status)}</Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="mt-2">
                      <Button variant="soft">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => {
                          navigate(
                            `/admin/weighing-operations/new-weigh/${item.id}`
                          );
                        }}
                      >
                        New Weigh
                      </DropdownMenu.Item>
                      <DropdownMenu.Item>View Approved</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default ViewAuthorityToWeigh;
