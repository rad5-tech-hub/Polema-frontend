import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";
import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import {
  Separator,
  Grid,
  Spinner,
  Heading,
  Flex,
  Table,
  Select,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faSquare,
  faPills,
} from "@fortawesome/free-solid-svg-icons";

const ViewDepartmentStore = () => {
  const [productIsActive, setProductIsActive] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [store, setStore] = useState([]);

  // State management for grid container loading
  const [loading, setLoading] = useState(false);

  // Function to fetch products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    setStore([]);

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(
        `${root}/dept/${
          productIsActive ? "view-deptstore-prod" : "view-deptstore-raw"
        }`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setStore(response.data.stores);
    } catch (error) {
      console.log(error);

      toast.error("error in fetching products.");
    }
  };

  // Function to fetch departments from db
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");
    setDepartments([]);

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

  // Function to get department based on the id
  const getDeptById = (id) => {
    const dept = departments.find((item) => item.id === id);
    return dept ? dept.name : "No department found.";
  };

  React.useEffect(() => {
    fetchProducts();
  }, [productIsActive]);
  React.useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <Flex justify={"between"}>
        <Heading>View All</Heading>
        <Select.Root
          defaultValue="Products"
          onValueChange={(value) => {
            value === "Raw Materials"
              ? setProductIsActive(false)
              : setProductIsActive(true);
          }}
        >
          <Select.Trigger placeholder="Type" />
          <Select.Content>
            <Select.Group>
              <Select.Item value="Products">Products</Select.Item>
              <Select.Item value="Raw Materials">Raw Materials</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="my-2 w-full" />

      <div>
        <Grid columns={"6"} rows={"3"} gap={"2"}>
          {store.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            store.map((item, index) => {
              const className = (status) => {
                switch (status) {
                  case "Low Stock":
                    return "text-yellow-500";
                    break;
                  case "In Stock":
                    return "text-green-500";
                    break;
                  default:
                    return "text-red-500";
                    break;
                }
              };
              return (
                <div
                  className="p-5 shadow-xl max-w-[175px] max-h-[101px] rounded-lg relative"
                  key={index}
                >
                  <div className="absolute top-2 right-2">
                    <FontAwesomeIcon
                      icon={faPills}
                      width={"16px"}
                      className="opacity-40"
                      height={"16px"}
                    />
                  </div>

                  <p className="text-[0.6rem]">{item.product.name}</p>
                  <p className="text-[2em]">{item.thresholdValue}</p>
                  <p
                    className={`${className(
                      item.status
                    )} flex gap-1 items-center text-[.6rem]`}
                  >
                    {item.status}
                  </p>
                </div>
              );
            })
          )}
        </Grid>
      </div>

      {/* Table to display store content */}
      <Table.Root variant="surface" className="mb-8">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {store.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            store.map((item) => {
              const className = (status) => {
                switch (status) {
                  case "Low Stock":
                    return "text-yellow-500";
                    break;
                  case "In Stock":
                    return "text-green-500";
                    break;
                  default:
                    return "text-red-500";
                    break;
                }
              };
              return (
                <Table.Row>
                  <Table.RowHeaderCell>
                    {refractor(item.createdAt)}
                  </Table.RowHeaderCell>
                  <Table.Cell>{item.product.name}</Table.Cell>
                  <Table.Cell>{getDeptById(item.departmentId)}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>{item.thresholdValue}</Table.Cell>
                  <Table.Cell>
                    <Flex gap={"2"} align={"center"}>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`${className(item.status)}`}
                      />

                      {item.status}
                    </Flex>
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

export default ViewDepartmentStore;
