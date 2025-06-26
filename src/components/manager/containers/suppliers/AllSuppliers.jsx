import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import {
  Table,
  Spinner,
  Heading,
  Separator,
  Button,
  TextField,
  DropdownMenu,
  Select
} from "@radix-ui/themes";
import { isNegative } from "../../../date";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook,faPen } from "@fortawesome/free-solid-svg-icons";
import { DropDownIcon } from "../../../icons";
import { refractor, formatMoney } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import EditSuppliers from "./EditSuppliers";
import { usePagination } from "../../../../hooks/usePagination";
import { useNavigate } from "react-router-dom";


const root = import.meta.env.VITE_ROOT;

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate()
  const [pageLoading, setPageLoading] = useState(true);
  const [viewStaff, setViewStaff] = useState(null);

  // Initialize pagination hook with data and items per page
  const {
    currentData: paginatedSuppliers,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = usePagination(suppliers, 1);

  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setPageLoading(true);
    try {
      const response = await axios.get(`${root}/customer/all-suppliers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setPageLoading(false);
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      setPageLoading(false);
      setSuppliers([]);
      toast.error("Failed to load suppliers.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  // Function to highlight matching text
  const filterCustomers = (customers, searchTerm) => {
    if (!searchTerm.trim()) {
      return customers; // Return all customers if searchTerm is empty
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return customers.filter((customer) =>
      // Check each relevant field for a match
      [
        customer.customerTag, // ID
        customer.firstname, //First Name
        customer.lastnmae, //Last Name
        customer.email, // Email
        customer.address, // Address
        ...customer.phoneNumber, // Phone (spread for array fields)
      ].some((field) =>
        String(field).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  };

  // Use this function to derive the filtered customer data
  const filteredCustomers = filterCustomers(suppliers, searchTerm);
  const term = "Suppliers"

  return (
    <>
      <div>
        <div className="flex w-full justify-between">
          <div className="w-full">
            <Heading className="mb-3">All Suppliers</Heading>
            <TextField.Root
              placeholder="Search suppliers"
              className="mb-4 w-[60%]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div>
          <Select.Root size="2">
            <Select.Trigger placeholder={`Filter ${term}`} />
            <Select.Content>
              <Select.Item value="debt">{`${term} we owe`}</Select.Item>
                <Select.Item value="no-debt">{ `${term} we don't owe`}</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        </div>

       
        <Separator className="my-4 w-full" />
        <Table.Root size="3" variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>PHONE</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {pageLoading ? (
            <Spinner className="m-4" />
          ) : (
            <Table.Body>
              {filteredCustomers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No Suppliers Found
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredCustomers.map((supplier) => (
                  <Table.Row key={supplier.id}>
                    <Table.Cell>{refractor(supplier.createdAt)}</Table.Cell>
                    <Table.Cell>{supplier.supplierTag}</Table.Cell>
                    <Table.Cell>
                      {supplier.firstname} {supplier.lastname}
                    </Table.Cell>
                    <Table.Cell>{supplier.email}</Table.Cell>
                    <Table.Cell>{supplier.address}</Table.Cell>
                    <Table.Cell>{supplier.phoneNumber}</Table.Cell>
                    <Table.Cell
                      className={
                        isNegative(supplier.latestBalance)
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {formatMoney(supplier?.latestBalance || 0)}
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface">
                            <DropDownIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="solid">
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => {
                              setViewStaff(supplier);
                            }}
                          >
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faBook} />}
                            onClick={() => {
                              navigate(
                                `/admin/supplier/supplier-ledger/${supplier.id}`
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
          )}
        </Table.Root>

        {viewStaff && (
          <EditSuppliers
            isOpen={!!viewStaff}
            onClose={() => setViewStaff(null)}
            fetchSuppliers={fetchSuppliers}
            id={viewStaff}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default AllSuppliers;
