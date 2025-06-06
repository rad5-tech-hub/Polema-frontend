import React from "react";
import { useNavigate } from "react-router-dom";
import { refractor, formatMoney } from "../../../date";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";
import { Heading, Table, Spinner, Flex, Button } from "@radix-ui/themes";
import { DropdownMenu } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const ViewSupplierOrder = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = React.useState([]);
  const [raw, setRaw] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);
  const [dateRange, setDateRange] = React.useState(null);
  const [paginationUrls, setPaginationUrls] = React.useState([]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

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
      setSuppliers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "An error occurred, please try again later."
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
      setRaw(response.data.products || []);
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      toast.error("An error occurred while fetching raw materials.");
    }
  };

  // Function to fetch supplier orders
  const fetchSupplierOrders = async (
    startDate = null,
    endDate = null,
    pageUrl = null
  ) => {
    setLoading(true);
    setOrders([]);
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
      url = `${root}/customer/get-all-supplier-orders?startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `${root}/customer/get-all-supplier-orders`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      const output = response.data.data?.orders || response.data.data || [];

      if (output.length === 0) {
        setFailedSearch(true);
        setOrders([]);
      } else {
        setOrders(output);
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
      console.error("Error fetching supplier orders:", error);
      setLoading(false);
      toast.error("An error occurred, try again later", {
        style: { padding: "20px" },
        duration: 5000,
      });
      setFailedSearch(true);
    }
  };

  // Function to get productName by Id
  const getProductNamebyId = (id) => {
    const product = raw.find((product) => product.id === id);
    return product ? product.name : "Raw Material Not Found";
  };

  // Function to get supplierName by id
  const getSupplierNameById = (id) => {
    const supplierItem = suppliers.find((supplier) => supplier.id === id);
    return supplierItem
      ? supplierItem
      : { firstname: "Supplier", lastname: "Not Found" };
  };

  // Handle clear date range
  const handleClearDateRange = () => {
    setDateRange(null);
    setPaginationUrls([]);
    setCurrentPageIndex(0);
    fetchSupplierOrders();
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchSupplierOrders(null, null, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchSupplierOrders(null, null, paginationUrls[currentPageIndex]);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchSupplierOrders(null, null, paginationUrls[prevIndex]);
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchRaw();
    fetchSupplierOrders();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>View Orders</Heading>
        <div className="date-picker">
          <RangePicker
            value={dateRange}
            onCalendarChange={(dates) => {
              setDateRange(dates);
              if (dates && dates[0] && dates[1]) {
                setPaginationUrls([]);
                setCurrentPageIndex(0);
                fetchSupplierOrders(
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
      </Flex>

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
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan="7">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : orders.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="7">
                {failedSearch ? "No Records Found" : "No Data Available"}
              </Table.Cell>
            </Table.Row>
          ) : (
            orders.map((item) => (
              <Table.Row key={item.id} className="relative">
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {`${getSupplierNameById(item.supplierId).firstname} ${
                    getSupplierNameById(item.supplierId).lastname
                  }`}
                </Table.Cell>
                <Table.Cell>{getProductNamebyId(item.productId)}</Table.Cell>
                <Table.Cell>
                  {item.price === item.initialTotalPrice ? (
                    <span>{formatMoney(item.price)}</span>
                  ) : (
                    <>
                      <span className="text-[.7rem] line-through text-red-500">
                        {item.initialTotalPrice &&
                          formatMoney(item.initialTotalPrice)}
                      </span>{" "}
                      <br />
                      <span>{formatMoney(item.price)}</span>
                    </>
                  )}
                </Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.comments}</Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="right-0">
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

      <Toaster position="top-right" />
    </>
  );
};

export default ViewSupplierOrder;
