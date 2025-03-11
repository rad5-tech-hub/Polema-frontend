import React, { useState, useEffect } from "react";
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
import {Modal} from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare,faClose } from "@fortawesome/free-solid-svg-icons";

const root = import.meta.env.VITE_ROOT;

const GeneralRecordBook = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [recordBookDetails, setRecordBookDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [nextPageClicked, setnextPageClicked] = useState(false);
  const [modalOpen,setModalOpen] = useState(false);
  const [modalDetails,setModalDetails] = useState({})

  const pageParams = {
    lastCreatedAt: searchParams.get("lastCreatedAt"),
    lastId: searchParams.get("lastId"),
    limit: searchParams.get("limit"),
    sortBy: searchParams.get("sortBy"),
    sortOrder: searchParams.get("sortOrder"),
  };

  // Function to get record book details
  const getRecordDetails = async () => {
    setTableLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: { padding: "20px" },
        duration: 500,
      });
      return;
    }

    let url = `${root}/dept/genstore-log`;
    let nextPageURL = `${root}/dept/genstore-log?lastCreatedAt=${pageParams.lastCreatedAt}&lastId=${pageParams.lastId}&limit=${pageParams.limit}&sortBy=${pageParams.sortBy}&sortOrder=${pageParams.sortOrder}`;

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

  useEffect(() => {
    getRecordDetails();
  }, []);

  return (
    <>
      <Heading>Record Book</Heading>
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
            <div className="p-4">
              <Spinner />
            </div>
          ) : failedSearch || recordBookDetails.length === 0 ? (
            <div className="p-4">No records found</div>
          ) : (
            recordBookDetails.map((item) => (
              <Table.Row key={item.id} className="hover:bg-theme/10 cursor-pointer" onClick={()=>{
                setModalDetails(item)
                setModalOpen(true)
              }}>
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>{item.generalStore.name}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.department?.name || item.other}</Table.Cell>
                {/* <Table.Cell>{item.batchNo}</Table.Cell> */}
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
      
      {/* Modal Opens when you click on an item in history  */}
      <Modal  open={modalOpen}
          footer={null}
          centered
          closable={false}
           >
            <p className="absolute top-[10px] right-[20px] cursor-pointer" onClick={()=>{
              setModalOpen(false)
            }}><FontAwesomeIcon icon={faClose}/></p>
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
           <p>{modalDetails.department?.name} </p>
           </div>
           {modalDetails.quantityRemoved < modalDetails.quantityAdded &&  <div className="mb-3">
           <h1 className="font-bold font-inter font-lg text-green-400">QUANTITY ADDED</h1>
           <p>{modalDetails.quantityAdded} </p>
           </div>}
           {modalDetails.quantityRemoved > modalDetails.quantityAdded && <div className="mb-3">
           <h1 className="font-bold font-inter font-lg text-red-500">QUANTITY REMOVED</h1>
           <p>{modalDetails.quantityRemoved} </p>
           </div>}
           
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


      {details?.pagination?.nextPage && (
        <Flex className="my-6" justify={"end"}>
          <Button
            className="bg-theme cursor-pointer"
            onClick={() => {
              setnextPageClicked(true);
              navigate(
                `/admin/general-store/record-book?lastCreatedAt=${
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

export default GeneralRecordBook;
