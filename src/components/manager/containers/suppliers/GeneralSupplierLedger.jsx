import React from "react";
import { useNavigate } from "react-router-dom";
import { TokensIcon } from "@radix-ui/react-icons";
import {
  TextField,
  Heading,
  Flex,
  Text,
  Button,
  Separator,
} from "@radix-ui/themes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const root = import.meta.env.VITE_ROOT;

const GeneralSupplierLedger = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredCustomers, setFilteredCustomers] = React.useState([]);

  // Function to fetch Customers
  const fetchCustomers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setCustomers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter customers based on firstname and lastname
    const filtered = customers.filter((customer) =>
      `${customer.firstname} ${customer.lastname}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
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

  return (
    <>
      <Heading>Supplier Ledger</Heading>

      <Separator className="my-4 w-full" />

      <div className="min-h-[70vh] justify-center items-center flex">
        <div className="flex flex-col justify-center items-center gap-3">
          <Text size={"4"} className="font-amsterdam">
            Please click the search button below to view an individual's ledger
          </Text>
          <p>
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </p>

          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <TextField.Root
              placeholder="Enter Supplier Name"
              size={"3"}
              className="search-input mx-auto"
              disabled={customers.length === 0}
              value={searchInput}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root>

            {/* Dropdown for search results */}
            {searchInput && filteredCustomers.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchInput(
                        `${customer.firstname} ${customer.lastname}`
                      );
                      setFilteredCustomers([]);
                      navigate(
                        `/admin/supplier/supplier-ledger/${customer.id}`
                      );
                    }}
                  >
                    {highlightText(
                      `${customer.firstname} ${customer.lastname}`,
                      searchInput
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {searchInput && filteredCustomers.length === 0 && (
              <p className="absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full p-2 text-gray-500">
                No results found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralSupplierLedger;
