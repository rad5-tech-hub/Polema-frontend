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
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DropDownIcon } from "../../../icons";
import { refractor } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import EditSuppliers from "./EditSuppliers";
import { usePagination } from "../../../../hooks/usePagination";

const root = import.meta.env.VITE_ROOT;

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
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
  } = usePagination(suppliers, 15);

  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setPageLoading(true);
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setPageLoading(false);
      setSuppliers(response.data.customers || []);
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
  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="bg-yellow-300">${match}</span>`
    );
  };

  // Filter and highlight suppliers based on the search term
  const filteredSuppliers = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    // Filter suppliers by name (case-insensitive)
    const filtered = suppliers.filter((supplier) =>
      `${supplier.firstname} ${supplier.lastname}`
        .toLowerCase()
        .includes(searchLower)
    );

    // Apply highlighting to matching names
    return filtered.map((supplier) => {
      const fullName = `${supplier.firstname} ${supplier.lastname}`;
      const highlightedName = highlightText(fullName, searchLower);
      return { ...supplier, highlightedName };
    });
  }, [searchTerm, suppliers]);

  return (
    <>
      <div>
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
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {pageLoading ? (
            <Spinner className="m-4" />
          ) : (
            <Table.Body>
              {filteredSuppliers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No Suppliers Found
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <Table.Row key={supplier.id}>
                    <Table.Cell>{refractor(supplier.createdAt)}</Table.Cell>
                    <Table.Cell>{supplier.supplierTag}</Table.Cell>
                    <Table.Cell>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: supplier.highlightedName,
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>{supplier.email}</Table.Cell>
                    <Table.Cell>{supplier.address}</Table.Cell>
                    <Table.Cell>{supplier.phoneNumber}</Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface">
                            <DropDownIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="solid">
                          <DropdownMenu.Item
                            onClick={() => console.log("Edit Supplier")}
                          >
                            Edit
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
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default AllSuppliers;
