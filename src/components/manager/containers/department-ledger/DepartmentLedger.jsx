import React from "react";
import { useNavigate } from "react-router-dom";
import { Select as AntSelect } from "antd";
import {
  TextField,
  Select,
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

const DepartmentLedger = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredDepartments, setFilteredDepartments] = React.useState([]);

  // Function to fetch departments
  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      console.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    // Filter departments based on name
    const filtered = departments.filter((department) =>
      department.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDepartments(filtered);
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
      <Heading>Department Ledger</Heading>

      <Separator className="my-4 w-full" />

      <div className="min-h-[70vh] justify-center items-center flex">
        <div className="flex flex-col justify-center items-center gap-3">
          <Text size={"4"} className="font-amsterdam">
            Select department below to view the department's ledger
          </Text>
          <p>
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </p>

          {/* Search Input */}
          <div className="relative w-full max-w-md">
            {/* <TextField.Root
              placeholder="Enter Department Name"
              size={"3"}
              className="search-input mx-auto"
              value={searchInput}
              // disabled={departments.length === 0}
              onChange={handleSearchInput}
            >
              <TextField.Slot>
                <FontAwesomeIcon icon={faSearch} />
              </TextField.Slot>
            </TextField.Root> */}

            {/* Dropdown for search results */}
            {/* {searchInput && filteredDepartments.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto w-full">
                {filteredDepartments.map((department) => (
                  <li
                    key={department.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchInput(department.name);
                      setFilteredDepartments([]);
                      navigate(
                        `/admin/department-ledger/${department.name}/${department.id}`
                      );
                    }}
                  >
                    {highlightText(department.name, searchInput)}
                  </li>
                ))}
              </ul>
            )} */}

            {/* <Select.Root>
              <Select.Trigger
                placeholder="Select Department"
                className="w-full"
              />
              <Select.Content position="popper">
                <Select.Group>
                  {departments.map((dept, idx) => {
                    return (
                      <Select.Item
                        key={idx}
                        value={dept.name}
                        onClick={() => {
                          navigate(
                            `/admin/department-ledger/${department.name}/${department.id}`
                          );
                        }}
                      >
                        {dept.name}
                      </Select.Item>
                    );
                  })}
                </Select.Group>
              </Select.Content>
            </Select.Root> */}

            <AntSelect
              // defaultValue="Option1"
              placeholder="Select Department"
              size="large"
              style={{ width: "100%" }}
              dropdownRender={(menu) => (
                <div>
                  {departments.map((option) => (
                    <li
                      key={option.name}
                      // className="hover:bg-black"
                      onClick={() => {
                        navigate(
                          `/admin/department-ledger/${option.name}/${option.id}`
                        );
                      }}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        background: "#fff",
                      }}
                    >
                      {option.name}
                    </li>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentLedger;
