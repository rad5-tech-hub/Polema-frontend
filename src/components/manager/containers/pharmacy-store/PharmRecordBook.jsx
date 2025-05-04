import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { refractor } from "../../../date";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Heading,
  Separator,
  Table,
  Spinner,
  Flex,
  Button,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

const root = import.meta.env.VITE_ROOT;

const PharmRecordBook = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [recordBookDetails, setRecordBookDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [nextPageClicked, setnextPageClicked] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  const filterBoxRef = useRef(null);
  const pageParams = {
    lastCreatedAt: searchParams.get("lastCreatedAt"),
    lastId: searchParams.get("lastId"),
    limit: searchParams.get("limit"),
    sortBy: searchParams.get("sortBy"),
    sortOrder: searchParams.get("sortOrder"),
  };

  // Function to get record book details
  const getRecordDetails = async (start = "", end = "") => {
     setTableLoading(true);
     const token = localStorage.getItem("token");
 
     if (!token) {
       toast.error("An error occurred, try logging in again", {
         style: { padding: "20px" },
         duration: 500,
       });
       return;
     }
 
     let url = `${root}/dept/pharm-log`;
     // let nextPageURL = `${root}/dept/deptstore-log?lastCreatedAt=${pageParams.lastCreatedAt}&lastId=${pageParams.lastId}&limit=${pageParams.limit}&sortBy=${pageParams.sortBy}&sortOrder=${pageParams.sortOrder}`;
      if (start && end) {
        url += `?startDate=${start}&endDate=${end}`;
      }
 
     try {
       const response = await axios.get(!nextPageClicked ? url : nextPageURL, {
         headers: { Authorization: `Bearer ${token}` },
       });
 
       if (response.data.data.length === 0) {
         setFailedSearch(true);
       } else {
         setFailedSearch(false);
         setRecordBookDetails(response.data.data); // Replace existing data instead of appending
       }
 
       setDetails(response.data);
     } catch (error) {
       setFailedSearch(true);
       console.error(error);
     } finally {
       setTableLoading(false);
     }
   };
 

  const getSquareColor = (str) => {
    switch (str) {
      case "pending":
        return "text-yellow-500";
      case "received":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  function parseUrlParams(url) {
    const [_, queryString] = url.split("?");
    if (!queryString) return {};

    return queryString.split("&").reduce((params, pair) => {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value);
      return params;
    }, {});
  }

  const handleFilterSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    setFilterLoading(true);
    try {
      await getRecordDetails(startDate, endDate);
      showToast({
        message: "Records filtered successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        message: "Failed to filter records",
        type: "error",
      });
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    getRecordDetails();
  }, []);

  // Close filter box when clicking outside
  useEffect(() => {
    if (!filterOpen) return;
    function handleClickOutside(event) {
      if (
        filterBoxRef.current &&
        !filterBoxRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>Record Book</Heading>
        <div className="relative mb-4">
          <Button
            className="bg-theme cursor-pointer"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter by Date
          </Button>
          {filterOpen && (
            <div
              ref={filterBoxRef}
              className="absolute right-0 mt-2 p-4 border rounded bg-gray-50 shadow-lg z-10"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  className="bg-white rounded !text-black text-base"
                  onClick={getRecordDetails}
                >
                  Back
                </Button>
                <Button
                  className="bg-theme cursor-pointer"
                  onClick={handleFilterSubmit}
                  disabled={filterLoading}
                >
                  {filterLoading ? <Spinner size="3" /> : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator className="my-4 w-full" />
      <Table.Root className="mt-5" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ITEM</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BATCH NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANT. OUT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANT. ADD</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SIGNED</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableLoading ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : failedSearch || recordBookDetails.length === 0 ? (
            <div className="p-4">No records found</div>
          ) : (
            recordBookDetails.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  {item.pharmacyStore?.product?.name || ""}
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.batchNo}</Table.Cell>
                <Table.Cell>
                  {item.quantityRemoved > item.quantityAdded
                    ? item.quantityRemoved
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  {item.quantityRemoved < item.quantityAdded
                    ? item.quantityAdded
                    : ""}
                </Table.Cell>
                <Table.Cell>{item.amountRemaining}</Table.Cell>
                <Table.Cell>
                  {item.signature ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`mr-2 ${getSquareColor("received")}`}
                      />{" "}
                      Signed
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`mr-2 ${getSquareColor("rejected")}`}
                      />{" "}
                      Not Signed
                    </>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {details?.pagination?.nextPage && (
        <Flex className="my-6" justify={"end"}>
          <Button
            className="bg-theme cursor-pointer"
            onClick={() => {
              setnextPageClicked(true);
              navigate(
                `/admin/pharmacy-store/record-book?lastCreatedAt=${
                  parseUrlParams(details.pagination.nextPage)["lastCreatedAt"]
                }&lastId=${
                  parseUrlParams(details.pagination.nextPage)["lastId"]
                }&limit=${
                  parseUrlParams(details.pagination.nextPage)["limit"]
                }&sortBy=${
                  parseUrlParams(details.pagination.nextPage)["sortBy"]
                }&sortOrder=${
                  parseUrlParams(details.pagination.nextPage)["sortOrder"]
                }`
              );

              setTimeout(() => getRecordDetails(), 4000);
            }}
          >
            Next Page
          </Button>
        </Flex>
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default PharmRecordBook;
