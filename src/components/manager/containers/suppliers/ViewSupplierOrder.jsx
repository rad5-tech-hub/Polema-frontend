import React from "react";
import { useNavigate } from "react-router-dom";
import { refractor, formatMoney } from "../../../date";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";
import { Heading, Table, Spinner } from "@radix-ui/themes";
import { DropdownMenu, Button } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const ViewSupplierOrder = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = React.useState([]);
  const [raw, setRaw] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

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
      console.log(error);
      toast.error(
        error.response?.error?.message ||
          "An error occurred , please try again later."
      );
    }
  };

  // Function to get raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");

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
      setRaw(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Funciton to fetch supplier order
  const fetchSupplierOrders = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-all-supplier-orders`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      response.data.orders.length === 0
        ? setFailedSearch(true)
        : setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
      setFailedSearch(true);
    }
  };

  // Function to get productName by Id
  const getProductNamebyId = (id) => {
    const product = raw.find((product) => product.id === id);
    return product ? product.name : "Raw Materialnot Found.";
  };

  // Function to get supplierName by id
  const getSupplierNameById = (id) => {
    const supplierItem = suppliers.find((supplier) => supplier.id === id);
    return supplierItem ? supplierItem : "Supplier Not Found";
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchRaw();
    fetchSupplierOrders();
  }, []);
  return (
    <>
      <Heading>View Orders</Heading>
      <Table.Root variant="surface" className="mt-5">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SUPPLIER</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RAW MATERIAL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRICE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {failedSearch ? <>
          <p className="p-4">No records found</p>
          </> :   orders.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            orders.map((item) => {
              return (
                <Table.Row className="relative">
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {`${getSupplierNameById(item.supplierId).firstname} ${
                      getSupplierNameById(item.supplierId).lastname
                    }`}
                  </Table.Cell>
                  <Table.Cell>{getProductNamebyId(item.productId)}</Table.Cell>
                  <Table.Cell>{formatMoney(item.price)}</Table.Cell>
                  <Table.Cell>{formatMoney(item.quantity)}</Table.Cell>
                  <Table.Cell>{item.comments}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="  right-0">
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => {
                            navigate(
                              `/admin/supplier/supplier-ledger/${
                                getSupplierNameById(item.supplierId).id
                              }`
                            );
                          }}
                        >
                          View Ledger
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
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

export default ViewSupplierOrder;
