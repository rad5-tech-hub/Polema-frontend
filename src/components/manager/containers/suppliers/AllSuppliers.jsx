import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Spinner,
  Heading,
  Separator,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
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

  return (
    <>
      <div>
        <Heading className="mb-3">All Suppliers</Heading>
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
              {paginatedSuppliers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No Suppliers Yet
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <Table.Row key={supplier.id}>
                    <Table.Cell>{refractor(supplier.createdAt)}</Table.Cell>
                    <Table.Cell>{supplier.supplierTag}</Table.Cell>
                    <Table.Cell>{`${supplier.firstname} ${supplier.lastname}`}</Table.Cell>
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
                            onClick={() => setViewStaff(supplier)}
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

        {/* Pagination Controls */}
        <div className="flex justify-center  items-center mt-4">
          <div className="flex gap-2 items-center">
            <Button disabled={currentPage === 1} onClick={goToPreviousPage}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {viewStaff && (
        <EditSuppliers
          isOpen={!!viewStaff}
          onClose={() => setViewStaff(null)}
          fetchSuppliers={fetchSuppliers}
          id={viewStaff}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllSuppliers;
