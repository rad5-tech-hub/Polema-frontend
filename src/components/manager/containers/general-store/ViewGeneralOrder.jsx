import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Table, DropdownMenu } from "@radix-ui/themes";
import axios from "axios";
import { refractor } from "../../../date";
import { Spinner } from "@radix-ui/themes";
import { Heading, Separator } from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;

const ViewGeneralOrder = () => {
  const [orders, setOrders] = React.useState([]);
  const [shelf, setShelf] = React.useState([]);

  // Function to fetch Proucts from db
  const fetchShelf = async () => {
    let retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-gen-store`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setShelf(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGeneralOrder = async () => {
    let retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-gen-order`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
      setOrders(response.data.Orders);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  React.useEffect(() => {
    fetchShelf();
    fetchGeneralOrder();
  }, []);

  return (
    <>
      <Heading>View Orders</Heading>
      <Separator className="w-full my-4" />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SHELF NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EXPECTED DELIVERY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {orders.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            orders.map((item, index) => {
              return (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>
                    {refractor(item.createdAt)}
                  </Table.RowHeaderCell>
                  <Table.Cell>{getProductNameById()}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>
                    {refractor(item.expectedDeliveryDate)}
                  </Table.Cell>
                  <Table.Cell>{item.status}</Table.Cell>
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

export default ViewGeneralOrder;
