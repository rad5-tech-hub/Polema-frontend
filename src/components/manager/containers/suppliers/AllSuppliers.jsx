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
  Select,
  Flex,
  Text,
} from "@radix-ui/themes";
import { isNegative, refractor, formatMoney } from "../../../date";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPen, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "react-hot-toast";
import EditSuppliers from "./EditSuppliers";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [viewStaff, setViewStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [arrangeType,setArrangeType] = useState(null)
  
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const navigate = useNavigate();

  const fetchSuppliers = async (pageUrl = null) => {
    setPageLoading(true);
    setSuppliers([]);
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again.", {
        duration: 6500,
        style: { padding: "30px" },
      });
      setPageLoading(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/customer/all-suppliers`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setSuppliers(response.data.suppliers || []);
      if (response.data.pagination?.nextPage && response.data.pagination.nextPage !== "/customer/all-suppliers") {
        setPaginationUrls((prev) => {
          const newUrls = [...prev];
          newUrls[currentPageIndex] = response.data.pagination.nextPage;
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load suppliers.", {
        duration: 6500,
        style: { padding: "30px" },
      });
    } finally {
      setPageLoading(false);
    }
  };

  const filterCustomers = (customers, searchTerm) => {
    if (!searchTerm.trim()) {
      return customers;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return customers.filter((customer) =>
      [
        customer.supplierTag,
        customer.firstname,
        customer.lastname, // Fixed typo: lastnmae -> lastname
        customer.email,
        customer.address,
        ...(customer.phoneNumber || []),
      ].some((field) => String(field || "").toLowerCase().includes(lowerCaseSearchTerm))
    );
  };

  const filteredCustomers = useMemo(() => filterCustomers(suppliers, searchTerm), [suppliers, searchTerm]);

  const handleNextPage = () => {
    if (currentPageIndex <= paginationUrls.length) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchSuppliers(paginationUrls[currentPageIndex] || null);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchSuppliers(prevIndex === 0 ? null : paginationUrls[prevIndex - 1]);
    }
  };

  const arrangeList = async () => {
      const retrToken = localStorage.getItem("token");
      if (!retrToken) {
        showToast({
          type: "error",
          message: "An error occurred. Try logging in again.",
        });
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${root}/customer/all-suppliers?sortByBalance=true&sortOrder=${arrangeType === "asc" ? "ASC" : "DESC"}`,{
          headers: {
            Authorization:`Bearer ${retrToken}`
          }
        })
        setSuppliers(response?.data?.suppliers || []);
      } catch (err) {
        showToast({
          type: "error",
          message:
            err?.response?.data?.message ||
            "An error occurred while fetching customers.",
        });
      }
    }
    useEffect(() => {
      if (arrangeType !== null) {
        arrangeList();
      }
    }, [arrangeType]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <>
      <div>
        <div className="flex w-full justify-between mb-4">
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
            <Select.Root size="2"  onValueChange={(val)=>{
                          setArrangeType(val)
                        }}>
              <Select.Trigger placeholder="Arrange List By:" />
              <Select.Content>
                <Select.Item value="asc">Lowest Indebted Supplier</Select.Item>
                <Select.Item value="desc">
                  Highest Indebted Supplier
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <Separator className="my-4 w-full" />
        <Table.Root
          className="mt-4 table-fixed w-full"
          variant="surface"
          size="2"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="text-left">
                DATE
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left">
                ID
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left">
                NAME
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left">
                EMAIL
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left">
                ADDRESS
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left">PHONE</Table.ColumnHeaderCell>
              {/* <Table.ColumnHeaderCell className="text-left">
                BALANCE(₦)
              </Table.ColumnHeaderCell> */}
              <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body aria-live="polite">
            {pageLoading ? (
              <Table.Row>
                <Table.Cell colSpan={8} className="text-center p-4">
                  <Spinner size="2" />
                </Table.Cell>
              </Table.Row>
            ) : filteredCustomers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8} className="text-center p-4">
                  No Suppliers Found
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredCustomers.map((supplier) => (
                <Table.Row
                  key={
                    supplier.id ||
                    `${supplier.supplierTag}-${supplier.createdAt}`
                  }
                >
                  <Table.Cell>
                    {refractor(supplier.createdAt) || "N/A"}
                  </Table.Cell>
                  <Table.Cell>{supplier.supplierTag || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {supplier.firstname || "N/A"} {supplier.lastname || "N/A"}
                  </Table.Cell>
                  <Table.Cell>{supplier.email || "N/A"}</Table.Cell>
                  <Table.Cell>{supplier.address || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {/* [].map((item, index) => (
                      <span key={index}>
                        {item || "N/A"} <br />
                      </span>
                    ))} */}
                    <Table.Cell>{supplier?.phoneNumber || "N/A"}</Table.Cell>
                  </Table.Cell>
                  {/* <Table.Cell
                    className={
                      isNegative(supplier?.latestBalance || 0)
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatMoney(supplier?.latestBalance || 0)}
                  </Table.Cell> */}
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" className="cursor-pointer">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content variant="solid">
                        <DropdownMenu.Item
                          shortcut={<FontAwesomeIcon icon={faPen} />}
                          onClick={() => setViewStaff(supplier)}
                        >
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          shortcut={<FontAwesomeIcon icon={faBook} />}
                          onClick={() =>
                            navigate(
                              `/admin/supplier/supplier-ledger/${supplier.id}`
                            )
                          }
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

        {(paginationUrls.length > 0 || currentPageIndex > 0) && (
          <Flex justify="center" className="mt-4">
            <Flex gap="2" align="center">
              <Button
                variant="soft"
                disabled={currentPageIndex === 0}
                onClick={handlePrevPage}
                className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
                aria-label="Previous page"
              >
                Previous
              </Button>
              <Text>Page {currentPageIndex + 1}</Text>
              <Button
                variant="soft"
                disabled={
                  currentPageIndex >= paginationUrls.length &&
                  !paginationUrls[currentPageIndex - 1]
                }
                onClick={handleNextPage}
                className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
                aria-label="Next page"
              >
                Next
              </Button>
            </Flex>
          </Flex>
        )}

        {viewStaff && (
          <EditSuppliers
            isOpen={!!viewStaff}
            onClose={() => {
              setViewStaff(null);
              setCurrentPageIndex(0);
              setPaginationUrls([]);
              fetchSuppliers();
            }}
            fetchSuppliers={() => {
              setCurrentPageIndex(0);
              setPaginationUrls([]);
              fetchSuppliers();
            }}
            id={viewStaff}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default AllSuppliers;