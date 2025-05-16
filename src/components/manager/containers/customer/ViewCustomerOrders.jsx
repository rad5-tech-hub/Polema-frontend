import React, { useEffect, useState } from "react";
import { refractor, formatMoney } from "../../../date";
import {
  Spinner,
  Flex,
  Heading,
  Separator,
  Table,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilter } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FilterModal from "./FilterModal";

const root = import.meta.env.VITE_ROOT;

const ViewCustomerOrders = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const fetchOrders = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      {
        response.data?.orders?.length === 0 || response.data.length === 0
          ? setFailedSearch(true)
          : setStore(response.data);
      }
    } catch (error) {
      console.log(error);
      error.status === 404 && setFailedSearch(true);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      {/* <Flex justify={"between"} align={"center"}>
        
        <Button
          size={"3"}
          color="brown"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FontAwesomeIcon icon={faFilter} />
          Filter
        </Button>
      </Flex> */}

      <Heading>View Orders</Heading>
      <Separator className="my-4 w-full" />

      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>            
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRICE(₦)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {store.length === 0 ? (
            <div className="p-4">
              {failedSearch ? "No Records Found" : <Spinner />}
            </div>
          ) : (
            store.map((item, index) => (
              <Table.Row
                key={item.id}
                className="relative"
                onClick={() => {
                  //add modal functionaity function here
                }}
              >
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {`${item.corder.firstname} ${item.corder.lastname}`}                
                </Table.Cell>
                <Table.Cell>
                  {item.porders.name || '-'}
                </Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>
                  {item.price === item.basePrice ? (
                    <>
                      <span className="text-">{formatMoney(item.price)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[.7rem] line-through text-red-500">
                        {item.basePrice && formatMoney(item.basePrice)}
                      </span>{" "}
                      <br />
                      <span>{formatMoney(item.price)}</span>
                    </>
                  )}
                </Table.Cell>
                <div className=" right-[3px] mt-1">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="soft">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() =>
                          navigate(
                            `/admin/customers/customer-ledger/${
                              item.customerId
                            }`
                          )
                        }
                      >
                        View Ledger
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() =>
                          navigate(
                            `/admin/customers/authority-to-weigh/${
                              item.customerId
                            }/${item.id}`
                          )
                        }
                      >
                        New Authority
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default ViewCustomerOrders;
