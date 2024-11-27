import React from "react";
import { refractor } from "../../../date";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Heading, Table } from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;

const IndividualDepartmentLedger = () => {
  const { id, ledgerName } = useParams();

  const [ledger, setLedger] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);

  //   Fucntion to get a department ledger
  const getDeptLedger = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/department-ledger/${id}`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setLedger(response.data);
    } catch (error) {
      console.log(error);
      {
        error.response.status === 404 && setFailedSearch(true);
      }
    }
  };

  // Function to get products
  const getProducts = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }
  };

  React.useEffect(() => {
    getDeptLedger();
  }, []);

  return (
    <>
      <Heading>{ledgerName}</Heading>
      <p className="text-sm opacity-40">Department Ledger</p>

      {/* Table for ledger details */}
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SUPPLIER NAME</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>PRODUCTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNITS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(N)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(N)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              {failedSearch ? <p>No records found.</p> : <Spinner />}
            </div>
          ) : (
            ledger.map((item, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {item.credit > item.debit && item.name}
                  </Table.Cell>
                  <Table.Cell>
                    {item.debit > item.credit && item.name}
                  </Table.Cell>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell className="text-green-500 font-bold">
                    {item.credit > item.debit && item.credit}
                  </Table.Cell>
                  <Table.Cell className="text-red-500 font-bold">
                    {item.debit > item.credit && item.debit}
                  </Table.Cell>
                  <Table.Cell>{item.balance}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default IndividualDepartmentLedger;
