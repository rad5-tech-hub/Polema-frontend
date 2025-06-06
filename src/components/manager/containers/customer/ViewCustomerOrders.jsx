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
import { faEllipsisV, faFilter, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import FilterModal from "./FilterModal";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

const ViewCustomerOrders = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (startDate = null, endDate = null, pageUrl = null) => {
    setLoading(true);
    setStore([]);
    setFailedSearch(false);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setLoading(false);
      return;
    }

    let url;
    if (pageUrl) {
      url = `${root}${pageUrl}`;
    } else if (startDate && endDate) {
      url = `${root}/customer/get-all-orders?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/customer/get-all-orders`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      const output = response.data.data || response.data.orders || [];

      if (output.length === 0) {
        setFailedSearch(true);
        setStore([]);
      } else {
        setStore(output);
        setFailedSearch(false);
      }

      if (response.data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = response.data.pagination.nextPage;
          if (!prev.includes(newUrl)) {
            if (!pageUrl || currentPageIndex >= prev.length - 1) {
              return pageUrl && currentPageIndex >= prev.length - 1
                ? [...prev, newUrl]
                : [newUrl];
            }
            return prev;
          }
          return prev;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
      toast.error("An error occurred, try again later", {
        style: { padding: "20px" },
        duration: 5000,
      });
      setFailedSearch(error.response?.status === 404);
    }
  };

  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    fetchOrders();
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchOrders(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchOrders(null, null, paginationUrls[currentPageIndex]);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchOrders(null, null, paginationUrls[prevIndex]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <style>
        {`
          .pagination-fixed {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 10px 0;
            z-index: 10;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          .dark .pagination-fixed {
            background: #1a1a1a;
            border-top: #fff;
            background: #333;
          }
        `}
      </style>
      <Flex justify="between" align="center" className="gap-4">
        <Heading>View Orders</Heading>
        <div className="flex gap-4">
          <div className="date-picker">
            <RangePicker
              value={dateRange}
              onCalendarChange={(dates) => {
                setDateRange(dates);
                if (dates && dates[0] && dates[1]) {
                  setPaginationUrls([]);
                  setCurrentPageIndex(0);
                  fetchOrders(
                    dates[0].format("YYYY-MM-DD"),
                    dates[1].format("YYYY-MM-DD")
                  );
                }
              }}
            />
            {dateRange !== null && (
              <FontAwesomeIcon
                icon={faRedoAlt}
                className="ml-2 cursor-pointer"
                onClick={handleClearDateRange}
              />
            )}
          </div>
          {/* <Button
            size="3"
            color="brown"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </Button> */}
        </div>
      </Flex>
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
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="7">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : store.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="7">
                {failedSearch ? "No Records Found" : "No Data Available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            store.map((item) => (
              <Table.Row
                key={item.id}
                className="relative"
                onClick={() => {
                  // Add modal functionality here if needed
                }}
              >
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {`${item.corder.firstname} ${item.corder.lastname}`}
                </Table.Cell>
                <Table.Cell>{item.porders.name || "-"}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>
                  {item.price === item.basePrice ? (
                    <span>{formatMoney(item.price)}</span>
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
                <Table.Cell>
                  <div className="right-[3px]">
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
                              `/admin/customers/customer-ledger/${item.customerId}`
                            )
                          }
                        >
                          View Ledger
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() =>
                            navigate(
                              `/admin/customers/authority-to-weigh/${item.customerId}/${item.id}`
                            )
                          }
                        >
                          New Authority
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {paginationUrls.length > 0 && (
        <div className="pagination-fixed">
          <Flex justify="center" gap="2">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPageIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPageIndex >= paginationUrls.length}
            >
              Next
            </Button>
          </Flex>
        </div>
      )}

      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      /> */}
      {/* <Toaster position="top-right" /> */}
    </>
  );
};

export default ViewCustomerOrders;