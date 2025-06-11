import {
  Table,
  Tabs,
  Heading,
  Spinner,
  Button,
  Flex,
  Text,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";
import { refractor, formatMoney } from "../../../date";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import useToast from "../../../../hooks/useToast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const CashTickets = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [ticketsDetails, setTicketDetails] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState("customer");
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchTicketsBooks = async (type = "customer", pageUrl = null) => {
    setIsFetching(true);
    setTicketDetails([]);
    setFetchError(false);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again",
      });
      setIsFetching(false);
      return;
    }
    try {
      let url;
      if (pageUrl) {
        url = `${root}${pageUrl}`;
      } else {
        url = `${root}/admin/view-cash-ticket?type=${encodeURIComponent(type)}`;
      }
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTicketDetails(data.data || []);
      setFetchError(data.data.length === 0);
      if (data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = data.pagination.nextPage;
          if (!prev.includes(newUrl)) {
            return pageUrl && currentPageIndex >= prev.length - 1
              ? [...prev, newUrl]
              : [newUrl];
          }
          return prev;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data?.message || "An error occurred, try again later.",
      });
      setFetchError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const colorCode = (str) => {
    switch (str) {
      case "completed":
        return "text-black";
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      default:
        return "";
    }
  };

  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      showToast({
        type: "error",
        message: "An error occurred. Try logging in again",
      });
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setSuppliers(response.data.customers || []);
    } catch (error) {
      setSuppliers([]);
      showToast({
        type: "error",
        message: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const getSupplierNameById = (id) => {
    const supplier = suppliers.find((item) => item.id === id);
    return supplier
      ? `${supplier.firstname || ""} ${supplier.lastname || ""}`.trim() || "Name not found"
      : "Name not found";
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFetchError(false);
    setCurrentPageIndex(0);
    setPaginationUrls([]);
    fetchTicketsBooks(value);
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchTicketsBooks(activeTab, paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchTicketsBooks(activeTab, paginationUrls[currentPageIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchTicketsBooks(activeTab, paginationUrls[prevIndex]);
    }
  };

  const getFilteredTickets = () => {
    switch (activeTab) {
      case "customer":
        return ticketsDetails.filter(
          (item) => item?.customer?.firstname || item?.customer?.lastname
        );
      case "supplier":
        return ticketsDetails.filter((item) => item?.supplierId);
      case "staff":
        return ticketsDetails.filter((item) => item?.staffName);
      default:
        return ticketsDetails;
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case "customer":
        return ["DATE", "CUSTOMER NAME", "PRODUCT", "AMOUNT(₦)", "STATUS"];
      case "supplier":
        return ["DATE", "SUPPLIER NAME", "PRODUCT", "AMOUNT(₦)", "STATUS"];
      case "staff":
        return ["DATE", "STAFF NAME", "ITEM", "AMOUNT(₦)", "STATUS"];
      default:
        return ["DATE", "PRODUCT", "ITEM", "AMOUNT(₦)", "STATUS"];
    }
  };

  const getTableCells = (item) => {
    const baseCells = [
      <Table.Cell key="amount">{formatMoney(item.amount)}</Table.Cell>,
      <Table.Cell key="status" className={colorCode(item.status)}>
        <FontAwesomeIcon icon={ faSquare} className={`mr-2 ${colorCode(item?.status || "")}`} />
        {upperFirst(item?.status) || ""}
      </Table.Cell>,
    ];
    switch (activeTab) {
      case "customer":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="customer">{`${item?.customer?.firstname || ""} ${item?.customer?.lastname || ""}`}</Table.Cell>,
          <Table.Cell key="product">{item?.product?.name || "N/A"}</Table.Cell>,
          ...baseCells,
        ];
      case "supplier":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="supplier">{getSupplierNameById(item.supplierId)}</Table.Cell>,
          <Table.Cell key="product">{item?.product?.name || "N/A"}</Table.Cell>,
          ...baseCells,
        ];
      case "staff":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="staff">{item?.staffName || "N/A"}</Table.Cell>,
          <Table.Cell key="item">{item?.item || "N/A"}</Table.Cell>,
          ...baseCells,
        ];
      default:
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="product">{item?.product?.name || "N/A"}</Table.Cell>,
          <Table.Cell key="item">{item?.item || "N/A"}</Table.Cell>,
          ...baseCells,
        ];
    }
  };

  const getColSpan = () => getTableHeaders().length;

  useEffect(() => {
    fetchSuppliers();
    fetchTicketsBooks();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Heading>Cash Tickets</Heading>
        <Button
          onClick={() => navigate("/admin/raise-ticket/cash-ticket")}
          className="cursor-pointer"
        >
          Create Cash Ticket
        </Button>
      </div>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-center mb-4">
          <Tabs.List className="flex gap-3">
            <Tabs.Trigger value="customer">Customer</Tabs.Trigger>
            <Tabs.Trigger value="supplier">Supplier</Tabs.Trigger>
            <Tabs.Trigger value="staff">Staff</Tabs.Trigger>
          </Tabs.List>
        </div>
      </Tabs.Root>
      <Table.Root className="mt-4 table-fixed w-full" variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            {getTableHeaders().map((header) => (
              <Table.ColumnHeaderCell key={header} className="text-left">
                {header}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isFetching ? (
            <Table.Row>
              <Table.Cell colSpan={getColSpan()} className="text-center p-4">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : fetchError || getFilteredTickets().length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={getColSpan()} className="p-4 text-center">
                No Records Found
              </Table.Cell>
            </Table.Row>
          ) : (
            getFilteredTickets().map((item) => (
              <Table.Row key={item.id || item.createdAt}>
                {getTableCells(item)}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      {paginationUrls.length > 0 && (
        <Flex justify="center" className="mt-4">
          <Flex gap="2" align="center">
            <Button
              variant="soft"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
            >
              Previous
            </Button>
            <Text>Page {currentPageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={currentPageIndex >= paginationUrls.length}
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CashTickets;