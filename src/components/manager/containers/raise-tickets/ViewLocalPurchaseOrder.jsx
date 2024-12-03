import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { refractor } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import LocalPurchaseOrder from "./LocalPurchaseOrder";

import {
  Heading,
  Table,
  Separator,
  Button,
  Flex,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const ViewLocalPurchaseOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [errorMessageFromSearch, setErrorMessageFromSearch] =
    React.useState(false);
  const [showCreateLPO, setShowCreateLPO] = React.useState(false); // State to toggle components

  // Function to fetch LPO orders
  const fetchLPOOrders = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: { padding: "30px" },
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/view-lpo`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      response.data.records.length === 0
        ? setErrorMessageFromSearch(true)
        : setOrders(response.data.records);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch LPO orders. Please try again.");
    }
  };

  React.useEffect(() => {
    fetchLPOOrders();
  }, []);

  // Function to handle "Raise LPO" button click
  const handleRaiseLPO = () => {
    setShowCreateLPO(true); // Show the LocalPurchaseOrder component
  };
  // Function to check status
  const checkStatus = (arg) => {
    switch (arg) {
      case "pending":
        return "text-yellow-500";
        break;
      case "approved":
        return "text-green-500";
        break;
      case "rejected":
        return "text-red-500";
        break;

      default:
        break;
    }
  };

  // If the user clicks "Raise LPO", show LocalPurchaseOrder
  if (showCreateLPO) {
    return <LocalPurchaseOrder />;
  }

  return (
    <>
      <Flex justify={"between"}>
        <Heading>View Local Purchase Order</Heading>
        <Button
          className="!bg-theme cursor-pointer"
          size={"2"}
          onClick={handleRaiseLPO}
        >
          Raise LPO
        </Button>
      </Flex>
      <Separator className="my-4 w-full" />

      {/* Table for viewing local purchase order */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>LPO ID</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell>DELIVERED TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>LPO EXPIRES</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>TICKET STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.length === 0 ? (
            <div className="p-4">
              {errorMessageFromSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>{refractor(order.createdAt)}</Table.Cell>
                {/* <Table.Cell>{order.lpoId}</Table.Cell> */}
                <Table.Cell>{order.deliveredTo}</Table.Cell>
                <Table.Cell>{refractor(order.expires)}</Table.Cell>

                <Table.Cell>
                  {" "}
                  <FontAwesomeIcon
                    icon={faSquare}
                    className={`${checkStatus(order.status)}`}
                  />{" "}
                  {_.upperFirst(order.status)}
                </Table.Cell>
                <Table.Cell>
                  {order.status === "approved" && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => {
                            navigate(
                              `/admin/raise-ticket/officialLPO/${order.id}`
                            );
                          }}
                        >
                          View Approved LPO
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <Toaster position="top-right" />
    </>
  );
};

export default ViewLocalPurchaseOrder;
