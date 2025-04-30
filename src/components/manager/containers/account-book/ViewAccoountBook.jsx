import React, { useEffect, useState } from "react";
import { refractor, formatMoney } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Table, Heading, Select, Flex } from "@radix-ui/themes";
import axios from "axios";
import { Modal } from "antd";

const root = import.meta.env.VITE_ROOT;

const ViewAccountBook = () => {
  const [accountBook, setAccountBook] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerActive, setCustomerActive] = useState(true);
  const [department, setDepartments] = useState([]);
  const [accountRecepient, setAccountRecepient] = useState("customers");
  const [failedSearch, setFailedSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedRow, setSelectedRow] = useState(null); // Selected row data

  // Fetch Details of account book
  const fetchAccountBookDetails = async () => {
    setAccountBook([]);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const changeURLByRecepient = (recepient) => {
      switch (recepient) {
        case "customers": return "get-accountbook";
        case "suppliers": return "get-supplier-accountbook";
        case "others": return "get-other-accountbook";
        default: return "";
      }
    };

    try {
      const response = await axios.get(
        `${root}/customer/${changeURLByRecepient(accountRecepient)}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );
      response.data.acct.length === 0
        ? setFailedSearch(true)
        : setAccountBook(response.data.acct);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occurred, try again later", {
        style: { padding: "20px" },
        duration: 5000,
      });
      setFailedSearch(true);
    }
  };

  // Fetch Customer details from backend
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
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setProducts(response.data.length === 0 ? [] : response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  const matchDepartmentNameById = (id) => {
    const dept = department.find((item) => item.id === id);
    return dept ? dept.name : "";
  };

  // Handle row click to open modal
  const handleRowClick = (details) => {
    setSelectedRow(details);
    setIsModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
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
            <Table.ColumnHeaderCell className="text-green-500">CREDIT(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-red-500">DEBIT(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell >BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {accountBook.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="8">
                {failedSearch ? "No Records Found" : <Spinner />}
              </Table.Cell>
            </Table.Row>
          ) : (
            accountBook.map((details) => (
              <Table.Row
                key={details.id}
                className="hover:bg-gray-600/10"
                onClick={() => handleRowClick(details)} // Add click handler
                style={{ cursor: "pointer" }} // Indicate clickable row
              >
                <Table.Cell>{refractor(details.createdAt)}</Table.Cell>
                <Table.Cell>
                  {details.other === null
                    ? details.credit > details.debit
                      ? `${details.theCustomer.firstname} ${details.theCustomer.lastname}`
                      : `${details.theSupplier.firstname} ${details.theSupplier.lastname}`
                    : details.other}
                </Table.Cell>
                <Table.Cell>{details.bank?.name || "No bank provided"}</Table.Cell>
                <Table.Cell>{matchDepartmentNameById(details.departmentId)}</Table.Cell>
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
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(details.credit > details.debit ? details.credit : "")}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(details.debit > details.credit ? details.debit : "")}
                </Table.Cell>
                <Table.Cell>
                  {formatMoney(details.debit > details.credit ? details.debit : "")}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Modal for showing credit/debit details */}
      <Modal
        title="Transaction Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRow && (
         <div>
         <p style={{ padding: "8px 0" }}><strong>Date:</strong> {refractor(selectedRow.createdAt)}</p>
         <p style={{ padding: "8px 0" }}><strong>Name:</strong> 
           {selectedRow.other === null
             ? selectedRow.credit > selectedRow.debit
               ? `${selectedRow.theCustomer.firstname} ${selectedRow.theCustomer.lastname}`
               : `${selectedRow.theSupplier.firstname} ${selectedRow.theSupplier.lastname}`
             : selectedRow.other}
         </p>
         <p style={{ padding: "8px 0" }}><strong>Bank Name:</strong> {selectedRow.bank?.name || "No bank provided"}</p>
         <p style={{ padding: "8px 0" }}><strong>Department:</strong> {matchDepartmentNameById(selectedRow.departmentId)}</p>
         <p style={{ padding: "8px 0" }}><strong>Credit (₦):</strong> {formatMoney(selectedRow.credit > selectedRow.debit ? selectedRow.credit : 0)}</p>
         <p style={{ padding: "8px 0" }}><strong>Debit (₦):</strong> {formatMoney(selectedRow.debit > selectedRow.credit ? selectedRow.debit : 0)}</p>
         <p style={{ padding: "8px 0" }}><strong>Comment:</strong> {selectedRow.comments}</p>
       </div>
        )}
      </Modal>

      <Toaster position="top-right" />
    </>
  );
};

export default ViewAccountBook;