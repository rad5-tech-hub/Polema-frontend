import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { refractor, formatMoney } from "../../../date";
import { useParams } from "react-router-dom";
import {
  Heading,
  Table,
  Skeleton,
  Spinner,
  Flex,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const SupplierLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = React.useState([]);
  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [ledger, setLedger] = React.useState([]);
  const [emptyLedger, setEmptyLedger] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredSuppliers, setFilteredSuppliers] = React.useState([]);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuppliers(response.data.customers);
      setFilteredSuppliers(response.data.customers); // Set filtered suppliers initially
    } catch (error) {
      console.log(error);
    }
  };

  // Function to match user details with id
  const getSupplierDetailsByID = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier : "Supplier Not Found";
  };

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter suppliers based on firstname and lastname
    const filtered = suppliers.filter((supplier) =>
      `${supplier.firstname} ${supplier.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  // Function to highlight matching text
  const highlightText = (fullText, searchTerm) => {
    if (!searchTerm) return fullText;

    const parts = fullText.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Fetch ledger details
  const fetchLedger = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-supplier-ledger/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      response.data.ledgerEntries.length === 0
        ? setEmptyLedger(true)
        : setLedger(response.data.ledgerEntries);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.log("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRawMaterials(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get product details by their id
  const fetchProductByID = (id) => {
    const material = rawMaterials.find((item) => item.id === id);
    return material ? material : "Raw Material not found";
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchRaw();
    if (id) {
      fetchLedger();
    }
  }, [id]);

  return (
    <>
      <Flex justify={"between"}>
        <div className="w-full">
          {suppliers.length === 0 ? (
            <Skeleton className="p-4 w-[150px] " />
          ) : (
            <Heading className="font-amsterdam">{`${
              getSupplierDetailsByID(id).firstname
            } ${getSupplierDetailsByID(id).lastname}`}</Heading>
          )}
          {suppliers.length === 0 ? (
            <Skeleton className="p-1 w-[150px] mt-4 h-[15px] rounded-full" />
          ) : (
            <p>{`${getSupplierDetailsByID(id).supplierTag} `}</p>
          )}
        </div>
        <div className="w-[70%]">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <TextField.Root
              placeholder="Enter Supplier Name"
              size={"3"}
              className="t mx-auto"
              disabled={suppliers.length === 0}
              value={searchInput}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root>

            {/* Dropdown for search results */}
            {searchInput && filteredSuppliers.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                {filteredSuppliers.map((supplier) => (
                  <li
                    key={supplier.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchInput(
                        `${supplier.firstname} ${supplier.lastname}`
                      );
                      setFilteredSuppliers([]);
                      navigate(
                        `/admin/supplier/supplier-ledger/${supplier.id}`
                      );
                    }}
                  >
                    {highlightText(
                      `${supplier.firstname} ${supplier.lastname}`,
                      searchInput
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {searchInput && filteredSuppliers.length === 0 && (
              <p className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full p-2 text-gray-500">
                No results found
              </p>
            )}
          </div>
        </div>
      </Flex>

      {/* Table to show supplier ledger details */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>PRODUCT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>UNIT PRICE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-green-500">
            CREDIT(₦)
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-red-500">
            DEBIT(₦)
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>BALANCE(₦)</Table.ColumnHeaderCell>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              {emptyLedger ? "No records found" : <Spinner />}
            </div>
          ) : (
            ledger.map((entry) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(entry.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {fetchProductByID(entry.productId).name}
                  </Table.Cell>
                  <Table.Cell>{entry.unit}</Table.Cell>
                  <Table.Cell>{entry.quantity}</Table.Cell>
                  <Table.Cell>
                    {entry.unitPrice ? formatMoney(entry.unitPrice) : ""}
                  </Table.Cell>
                  <Table.Cell className="text-green-500">
                    {formatMoney(
                      entry.credit > entry.debit ? entry.credit : ""
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-red-500">
                    {formatMoney(entry.debit > entry.credit ? entry.debit : "")}
                  </Table.Cell>
                  <Table.Cell>{formatMoney(entry.balance)}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default SupplierLedger;
