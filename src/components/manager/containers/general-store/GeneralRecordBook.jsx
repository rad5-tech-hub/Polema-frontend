import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { refractor, formatMoney } from "../../../date";
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
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faClose } from "@fortawesome/free-solid-svg-icons";
import useToast from "../../../../hooks/useToast";
import { Grid } from "antd";
const root = import.meta.env.VITE_ROOT;

const GeneralRecordBook = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [details, setDetails] = useState(null);
  const [recordBookDetails, setRecordBookDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [previousPageUrl, setPreviousPageUrl] = useState(null); // Store previous page endpoint

  // Ref for filter box
  const filterBoxRef = useRef(null);

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

  const pageParams = {
    lastCreatedAt: searchParams.get("lastCreatedAt"),
    lastId: searchParams.get("lastId"),
    limit: searchParams.get("limit"),
    sortBy: searchParams.get("sortBy"),
    sortOrder: searchParams.get("sortOrder"),
  };

  // Fetch record book details
  const getRecordDetails = async (start = "", end = "") => {
    setTableLoading(true);
    setPreviousPageUrl(null); // Reset previous page on new fetch or filter
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: { padding: "20px" },
        duration: 500,
      });
      return;
    }
    let url = `${root}/dept/genstore-log`;
    if (start && end) {
      url += `?startDate=${start}&endDate=${end}`;
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.data.length === 0) {
        setFailedSearch(true);
        setRecordBookDetails([]);
      } else {
        setFailedSearch(false);
        setRecordBookDetails(response.data.data);
      }
      setDetails(response.data);
    } catch (error) {
      setFailedSearch(true);
      console.error(error);
      toast.error("Failed to load records.");
    } finally {
      setTableLoading(false);
    }
  };

  // Handle pagination navigation
  const handlePageNavigation = async (pageUrl, direction) => {
    if (!pageUrl || isNavigating) return;
    setIsNavigating(true);
    setTableLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("An error occurred, try logging in again", {
          style: { padding: "20px" },
          duration: 500,
        });
        return;
      }

      // Before navigating to next page, save current page as previous
      if (direction === "next") {
        const currentParams = searchParams.toString();
        setPreviousPageUrl(
          currentParams
            ? `/dept/genstore-log?${currentParams}`
            : "/dept/genstore-log"
        );
      }

      const response = await axios.get(`${root}${pageUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data.length === 0) {
        setFailedSearch(true);
        setRecordBookDetails([]);
      } else {
        setFailedSearch(false);
        setRecordBookDetails(response.data.data);
        setDetails(response.data);
        showToast({
          message: `Navigated to ${direction} page successfully.`,
          type: "success",
        });

        // Update URL with new pagination parameters
        const params = new URLSearchParams(pageUrl.split("?")[1] || "");
        navigate(`/admin/general-store/record-book?${params.toString()}`);

        // Clear previousPageUrl when returning to first page
        if (direction === "previous" && !params.toString()) {
          setPreviousPageUrl(null);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${direction} page:`, error);
      toast.error(`Failed to load ${direction} page.`);
      setFailedSearch(true);
    } finally {
      setTableLoading(false);
      setIsNavigating(false);
    }
  };

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
      toast.error("Failed to filter records.");
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    getRecordDetails();
    // eslint-disable-next-line
  }, []);

  // Show Previous button if previousPageUrl exists
  const showPreviousButton = !!previousPageUrl;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>Record Book</Heading>
        {/* Filter Section */}
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
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANT. OUT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANT. ADD</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SIGNED</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableLoading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch || recordBookDetails.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="p-4 text-center">
                No records found
              </Table.Cell>
            </Table.Row>
          ) : (
            recordBookDetails.map((item) => (
              <Table.Row
                key={item.id}
                className="hover:bg-theme/10 cursor-pointer"
                onClick={() => {
                  setModalDetails(item);
                  setModalOpen(true);
                }}
              >
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>{item.generalStore.name}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.department?.name || item.other}</Table.Cell>
                <Table.Cell>
                  {item.quantityRemoved > item.quantityAdded
                    ? `${formatMoney(item.quantityRemoved)}`
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  {item.quantityRemoved < item.quantityAdded
                    ? `${formatMoney(item.quantityAdded)}`
                    : ""}
                </Table.Cell>
                <Table.Cell>{`${item.amountRemaining}`}</Table.Cell>
                <Table.Cell>
                  {item.signature ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`mr-2 text-green-500`}
                      />{" "}
                      Signed
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faSquare}
                        className={`mr-2 text-red-500`}
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

      <Modal open={modalOpen} footer={null} centered closable={false}>
        <p
          className="absolute top-[10px] right-[20px] cursor-pointer"
          onClick={() => setModalOpen(false)}
        >
          <FontAwesomeIcon icon={faClose} />
        </p>
        <div>
          <div className="mb-3 mt-3">
            <h1 className="font-bold font-inter font-lg ">NAME</h1>
            <p>{modalDetails.name} </p>
          </div>
          <div className="mb-3">
            <h1 className="font-bold font-inter font-lg">ITEM</h1>
            <p>{modalDetails.generalStore?.name || ""} </p>
          </div>
          <div className="mb-3">
            <h1 className="font-bold font-inter font-lg">DEPARTMENT</h1>
            <p>{modalDetails.department?.name || modalDetails.other} </p>
          </div>
          {modalDetails.quantityRemoved < modalDetails.quantityAdded && (
            <div className="mb-3">
              <h1 className="font-bold font-inter font-lg text-green-400">
                QUANTITY ADDED
              </h1>
              <p>{modalDetails.quantityAdded} </p>
            </div>
          )}
          {modalDetails.quantityRemoved > modalDetails.quantityAdded && (
            <div className="mb-3">
              <h1 className="font-bold font-inter font-lg text-red-500">
                QUANTITY REMOVED
              </h1>
              <p>{modalDetails.quantityRemoved} </p>
            </div>
          )}
          <div className="mb-3">
            <h1 className="font-bold font-inter font-lg">BALANCE</h1>
            <p>{`${modalDetails.amountRemaining}`} </p>
          </div>
          <div className="mb-3">
            <h1 className="font-bold font-inter font-lg">COMMENTS</h1>
            <p>{modalDetails.comments} </p>
          </div>
        </div>
      </Modal>

      {(showPreviousButton || details?.pagination?.nextPage) && (
        <Flex className="my-6" justify={"between"} gap="3">
          
          {showPreviousButton && (
            <Button
              className="bg-theme cursor-pointer"
              disabled={isNavigating || tableLoading}
              onClick={() => handlePageNavigation(previousPageUrl, "previous")}
            >
              {isNavigating && !details?.pagination?.nextPage ? (
                <Spinner size="2" />
              ) : (
                "Previous Page"
              )}
            </Button>
          )}
          {details?.pagination?.nextPage && (
            <Button
              className="bg-theme cursor-pointer"
              disabled={isNavigating || tableLoading}
              onClick={() =>
                handlePageNavigation(details.pagination.nextPage, "next")
              }
            >
              {isNavigating && details?.pagination?.nextPage ? (
                <Spinner size="2" />
              ) : (
                "Next Page"
              )}
            </Button>
          )}
        </Flex>
      )}

      <Toaster position="top-right" />
    </>
  );
};

export default GeneralRecordBook;
