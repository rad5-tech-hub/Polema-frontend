import React, { useEffect, useState } from "react";
import { refractor, formatMoney } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Table, Heading, Select, Flex } from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const ViewAccoountBook = () => {
  const [accountBook, setAccountBook] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerActive, setCustomerActive] = useState(true);
  const [department, setDepartments] = useState([]);
  const [accountRecepient, setAccountRecepient] = useState("customers");
  const [failedSearch, setFailedSearch] = useState(false);

  // Fetch Details of account book
  const fetchAccountBookDetails = async () => {
    setAccountBook([]);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    // Function check accountRecepient
    const changeURLByRecepient = (recepient) => {
      switch (recepient) {
        case "customers":
          return "get-accountbook";
          break;
        case "suppliers":
          return "get-supplier-accountbook";
          break;
        case "others":
          return "get-other-accountbook";
          break;

        default:
          break;
      }
    };

    try {
      const response = await axios.get(
        `${root}/customer/${changeURLByRecepient(accountRecepient)}`,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      // setAccountBook(response.data.acct);
      {
        response.data.acct.length === 0
          ? setFailedSearch(true)
          : setAccountBook(response.data.acct);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred,try again later", {
        style: {
          padding: "20px",
        },
        duration: 5000,
      });
      setFailedSearch(true);
    }
  };

  // Fetch Customer details form backend
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-customers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      toast.error(error.message || "An Error Occurred");
    }
  };

  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      response.data.length === 0
        ? setProducts([])
        : setProducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch Departments from db
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  //  Matching department name by id
  const matchDepartmentNameById = (id) => {
    const departments = department.find((item) => item.id === id);
    return departments ? departments.name : "";
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchDepartments();
    fetchAccountBookDetails();
  }, []);

  useEffect(() => {
    fetchAccountBookDetails();
  }, [accountRecepient]);

  return (
    <>
      <Flex justify={"between"}>
        <Heading className="mb-4">Account Book</Heading>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BANK NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RAW MATERIALS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-green-500">
              CREDIT(₦)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">
              DEBIT(₦)
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {accountBook.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="3">
                {failedSearch ? "No Records Found" : <Spinner />}
              </Table.Cell>
            </Table.Row>
          ) : (
            accountBook.map((details) => (
              <Table.Row key={details.id}>
                <Table.Cell>{refractor(details.createdAt)}</Table.Cell>
                <Table.Cell>
                  {details.other === null
                    ? details.credit > details.debit
                      ? `${details.theCustomer.firstname} ${details.theCustomer.lastname}`
                      : `${details.theSupplier.firstname} ${details.theSupplier.lastname}`
                    : details.other}
                </Table.Cell>
                <Table.Cell>{details.bankName}</Table.Cell>
                <Table.Cell>
                  {matchDepartmentNameById(details.departmentId)}
                </Table.Cell>{" "}
                <Table.Cell>
                  {details.other == null
                    ? details.credit < details.debit
                      ? ""
                      : details.theProduct.name
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  {details.other == null
                    ? details.credit < details.debit
                      ? details.theProduct.name
                      : ""
                    : ""}
                  {/* {details.debit > details.credit && "Raw Material Name"} */}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(
                    details.credit > details.debit ? details.credit : ""
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(
                    details.debit > details.credit ? details.debit : ""
                  )}
                  {/*  */}
                </Table.Cell>
                <Table.Cell>{details.amount}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Toaster position="top-right" />
    </>
  );
};

export default ViewAccoountBook;
