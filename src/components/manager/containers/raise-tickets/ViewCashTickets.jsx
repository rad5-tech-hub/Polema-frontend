import { Table, Tabs, Heading, Spinner,Button } from "@radix-ui/themes";
import { refractor, formatMoney } from "../../../date";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const CashTickets = () => {
  const navigate = useNavigate()
  const showToast = useToast();
  const [ticketsDetails, setTicketDetails] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState("customer");

  const fetchTicketsBooks = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(`${root}/admin/view-cash-ticket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFetching(false);
      setTicketDetails(data.records);
      data.records.length === 0 && setFetchError(true);
    } catch (err) {
      showToast({
        type: "error",
        message: err?.message || "An error occurred, try again later.",
      });
      setFetchError(true);
      setIsFetching(false);
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
        message: error.message || "An error occurred",
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
  };

  const getFilteredTickets = () => {
    switch (activeTab) {
      case "customer":
        return ticketsDetails.filter((item) => item?.customer?.firstname || item?.customer?.lastname);
      case "supplier":
        return ticketsDetails.filter((item) => item?.supplierId);
      case "staff":
        return ticketsDetails.filter((item) => item?.staffName);
      default:
        return ticketsDetails;
    }
  };

  const getTableHeaders = () => {
    const baseHeaders = ["DATE", "PRODUCT", "ITEM", "AMOUNT(₦)"];
    switch (activeTab) {
      case "customer":
        return ["DATE", "CUSTOMER NAME", "PRODUCT", "AMOUNT(₦)"];
      case "supplier":
        return ["DATE", "SUPPLIER NAME", "PRODUCT", "AMOUNT(₦)"];
      case "staff":
        return ["DATE", "STAFF NAME",  "ITEM", "AMOUNT(₦)"];
      default:
        return baseHeaders;
    }
  };

  const getTableCells = (item) => {
    const baseCells = [
      <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
      // <Table.Cell key="product">{item?.product?.name || ""}</Table.Cell>,
      
      <Table.Cell key="amount">{formatMoney(item.amount)}</Table.Cell>,
    ];
    switch (activeTab) {
      case "customer":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="customer">{`${item?.customer?.firstname || ""} ${
            item?.customer?.lastname || ""
          }`}</Table.Cell>,
          <Table.Cell key="product">{item?.product?.name || ""}</Table.Cell>,
          ...baseCells.slice(1),
        ];
      case "supplier":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="supplier">{getSupplierNameById(item.supplierId)}</Table.Cell>,
          <Table.Cell key="product">{item?.product?.name || ""}</Table.Cell>,
          ...baseCells.slice(1),
        ];
      case "staff":
        return [
          <Table.Cell key="date">{refractor(item.createdAt)}</Table.Cell>,
          <Table.Cell key="staff">{item?.staffName || ""}</Table.Cell>,
          <Table.Cell key="item">{item?.item || ""}</Table.Cell>,
          ...baseCells.slice(1),
        ];
      default:
        return baseCells;
    }
  };

  const getColSpan = () => getTableHeaders().length;

  useEffect(() => {
    fetchSuppliers();
    fetchTicketsBooks();
  }, []);

  return (
    <>
      <div className="flex justify-between">

      <Heading>Cash Tickets</Heading>

        <Button onClick={()=>{
          navigate("/admin/raise-ticket/cash-authority")
        }}>Create Cash Ticket </Button>
      </div>
      <Tabs.Root defaultValue="customer" onValueChange={handleTabChange}>
        <div className="flex justify-center mb-0">
          <Tabs.List className="flex gap-2">
            <Tabs.Trigger value="customer">Customer</Tabs.Trigger>
            <Tabs.Trigger value="supplier">Supplier</Tabs.Trigger>
            <Tabs.Trigger value="staff">Staff</Tabs.Trigger>
          </Tabs.List>
        </div>
      </Tabs.Root>
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            {getTableHeaders().map((header) => (
              <Table.ColumnHeaderCell key={header}>{header}</Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isFetching ? (
            fetchError ? (
              <Table.Row>
                <Table.Cell colSpan={getColSpan()} className="p-4 text-center">
                  No Records Found
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell colSpan={getColSpan()} className="text-center p-4">
                  <Spinner />
                </Table.Cell>
              </Table.Row>
            )
          ) : getFilteredTickets().length === 0 ? (
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
    </>
  );
};

export default CashTickets;