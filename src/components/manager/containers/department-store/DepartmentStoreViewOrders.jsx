import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { refractor, formatMoney } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Spinner, Button } from "@radix-ui/themes";
const root = import.meta.env.VITE_ROOT;
import { Heading, Separator, Table, DropdownMenu } from "@radix-ui/themes";

const DepartmentStoreViewOrders = () => {
  const navigate = useNavigate();
  const [deptOrders, setDeptOrders] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [department, setDepartment] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState([]);

  // Fucntion to fetch department view orders
  const fetchDept = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured,try logging in again");
    }

    try {
      const response = await axios.get(`${root}/dept/view-deptstore-order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeptOrders(response.data.Orders);
    } catch (error) {
      console.log(error);

      setFailedSearch(true);
    }
  };

  // Function to fetch raw materials
  const fetchRaw = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured ,try logging in again");
    }

    try {
      const request = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartment(request.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch department details
  const fetchDeptDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured,try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartmentDetails(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get department name by id
  const getDeptName = (id) => {
    const department = departmentDetails.find((dept) => dept.id === id);
    return department ? department.name : "Department not found";
  };

  // Fucntion to get product name by id
  const getProductName = (id) => {
    const products = department.find((item) => item.id === id);
    return products ? products.name : "Product not found";
  };

  useEffect(() => {
    fetchRaw();
    fetchDeptDetails();
    fetchDept();
  }, []);

  return (
    <div>
      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RAW MATERIALS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EXPECTED DELIVERY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {deptOrders.length === 0 ? (
            <div className="p-4">
              {failedSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            deptOrders.map((item) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>{getProductName(item.productId)}</Table.Cell>
                  <Table.Cell>{getDeptName(item.departmentId)}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>
                    {refractor(item.expectedDeliveryDate)}
                  </Table.Cell>
                  <Table.Cell>
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
                              `/admin/raise-ticket/l.p.o/${formatMoney(
                                item.quantity
                              )}/${item.productId}`
                            );
                          }}
                        >
                          Raise LPO
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
    </div>
  );
};

export default DepartmentStoreViewOrders;
