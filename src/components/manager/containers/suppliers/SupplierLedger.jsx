import React from "react";
import { refractor } from "../../../date";
import { useParams } from "react-router-dom";
import { Heading, Table, Skeleton, Spinner } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const SupplierLedger = () => {
  const { id } = useParams();
  const [suppliers, setSuppliers] = React.useState([]);
  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [ledger, setLedger] = React.useState([]);
  const [emptyLedger, setEmptyLedger] = React.useState(false);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuppliers(response.data.customers);
    } catch (error) {
      console.log();
    }
  };

  // Function to match user details with id
  const getSupplierDetailsByID = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier : "Supplier Not Found";
  };

  // Function to fetch a supplier ledger details
  const fetchLedger = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-supplier-ledger/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      response.data.ledgerEntries.length === 0
        ? setEmptyLedger(true)
        : setLedger(response.data.ledgerEntries);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch raw Materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");
    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRawMaterials(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get product details by their id
  const fetchProductByID = (id) => {
    const material = rawMaterials.find((item) => item.id === id);
    return material ? material : "Raw Material not found";
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchRaw();
    fetchLedger();
  }, []);
  return (
    <>
      {suppliers.length === 0 ? (
        <Skeleton className="p-4 w-[150px] " />
      ) : (
        <Heading className="font-amsterdam">{`${
          getSupplierDetailsByID(id).firstname
        } ${getSupplierDetailsByID(id).lastname}`}</Heading>
      )}
      {suppliers.length === 0 ? (
        <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
      ) : (
        <p>{`${getSupplierDetailsByID(id).supplierTag} `}</p>
      )}{" "}
      {/* Table to show a supplier ledger details */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>QUANTIY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-green-500">
            CREDIT
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-red-500">
            DEBIT
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              {emptyLedger ? "No records found" : <Spinner />}
            </div>
          ) : (
            ledger.map((entry) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {fetchProductByID(entry.productId).name}
                  </Table.Cell>
                  <Table.Cell>{entry.unit}</Table.Cell>
                  <Table.Cell>{entry.quantity}</Table.Cell>
                  <Table.Cell className="text-green-500">
                    {entry.credit > entry.debit && entry.credit}
                  </Table.Cell>
                  <Table.Cell className="text-red-500">
                    {entry.debit > entry.credit && entry.debit}
                  </Table.Cell>
                  <Table.Cell className="text-red-500">
                    {entry.balance}
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default SupplierLedger;
