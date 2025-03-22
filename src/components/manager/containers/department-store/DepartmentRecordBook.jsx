
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatMoney, refractor } from "../../../date"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Heading, Separator, Table, Spinner, Flex, Button } from "@radix-ui/themes"
import { Modal } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-solid-svg-icons'

const root = import.meta.env.VITE_ROOT

const DepartmentRecordBook = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [details, setDetails] = useState(null)
    const [recordBookDetails, setRecordBookDetails] = useState([])
    const [failedSearch, setFailedSearch] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
  const [nextPageClicked, setnextPageClicked] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalDetails,setModalDetails] = useState({})


    const pageParams = {
        lastCreatedAt: searchParams.get("lastCreatedAt"),
        lastId: searchParams.get("lastId"),
        limit: searchParams.get("limit"),
        sortBy: searchParams.get("sortBy"),
        sortOrder: searchParams.get("sortOrder")
    }

    // Function to get record book details
    const getRecordDetails = async () => {
        setTableLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
            toast.error("An error occurred, try logging in again", {
                style: { padding: "20px" },
                duration: 500
            })
            return
        }

        let url = `${root}/dept/deptstore-log`
        let nextPageURL = `${root}/dept/deptstore-log?lastCreatedAt=${pageParams.lastCreatedAt}&lastId=${pageParams.lastId}&limit=${pageParams.limit}&sortBy=${pageParams.sortBy}&sortOrder=${pageParams.sortOrder}`

        try {
            const response = await axios.get(!nextPageClicked ? url : nextPageURL, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.data.length === 0) {
                setFailedSearch(true)
            } else {
                setFailedSearch(false)
                setRecordBookDetails(response.data.data) // Replace existing data instead of appending
            }

            setDetails(response.data)
        } catch (error) {
            setFailedSearch(true)
            console.error(error)
        } finally {
            setTableLoading(false)
        }
    }

    const getSquareColor = (str) => {
        switch (str) {
            case "pending":
                return "text-yellow-500"
            case "received":
                return "text-green-500"
            case "rejected":
                return "text-red-500"
            default:
                return ""
        }
    }

    function parseUrlParams(url) {
        const [_, queryString] = url.split("?")
        if (!queryString) return {}

        return queryString.split("&").reduce((params, pair) => {
            const [key, value] = pair.split("=")
            params[decodeURIComponent(key)] = decodeURIComponent(value)
            return params
        }, {})
    }

    useEffect(() => {
        getRecordDetails()
    }, [])

  
  //Modal when you click on any item
  const DetailsModal = () => {
    return (
      <>
        <Modal
          open={modalOpened}
          title="Record Book Details"
          footer={null}
          onCancel={() => {
            setModalOpened(false);
          }}
        >
          <div>
            <div className="my-4">
              <p className="font-bold ">DATE</p>
              <p>{refractor(modalDetails.createdAt)}</p>
            </div>
            <div className="my-4">
              <p className="font-bold ">CUSTOMER NAME</p>
              <p>{modalDetails.name || ""}</p>
            </div>
            <div className="my-4">
              <p className="font-bold ">PRODUCT NAME</p>
              <p>{modalDetails.departmentStore?.product?.name || ""}</p>
            </div>
            {modalDetails.quantityRemoved > modalDetails.quantityAdded && (
              <div className="my-4">
                <p className="font-bold text-red-400">QUANTITY OUT</p>
                <p>
                  {" "}
                  {modalDetails.quantityRemoved > modalDetails.quantityAdded
                    ? modalDetails.quantityRemoved
                    : ""}
                </p>
              </div>
            )}
            {modalDetails.quantityAdded > modalDetails.quantityRemoved && (
              <div className="my-4">
                <p className="font-bold text-green-400">QUANTITY OUT</p>
                <p>
                  {" "}
                  {modalDetails.quantityAdded > modalDetails.quantityRemoved
                    ? modalDetails.quantityAdded
                    : ""}
                </p>
              </div>
            )}
            {modalDetails.comments && (
              <div className="my-4">
                <p className="font-bold ">COMMENTS</p>
                <p>{modalDetails.comments || ""}</p>
              </div>
            )}

            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </Modal>
      </>
    );
  }

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
              {/* <Table.ColumnHeaderCell>BATCH NO.</Table.ColumnHeaderCell> */}
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
                <Table.Row key={item.id} className='hover:bg-gray-400/10 cursor-pointer' onClick={()=>{
                  setModalOpened(true);
                  setModalDetails(item)
                  
                }}>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {item.departmentStore.product?.name || ""}
                  </Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>

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
                  `/admin/department-store/record-book?lastCreatedAt=${
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
          <DetailsModal />
        <Toaster position="top-right" />
      </>
    );
}

export default DepartmentRecordBook



////Use this component later
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { formatMoney, refractor } from '../../../date';
// import toast, { Toaster } from 'react-hot-toast';
// import axios from 'axios';
// import { Heading, Separator, Table, Spinner, Flex, Button } from '@radix-ui/themes';
// import { Modal } from 'antd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSquare } from '@fortawesome/free-solid-svg-icons';

// const root = import.meta.env.VITE_ROOT;

// const DepartmentRecordBook = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [details, setDetails] = useState(null);
//   const [recordBookDetails, setRecordBookDetails] = useState([]);
//   const [failedSearch, setFailedSearch] = useState(false);
//   const [tableLoading, setTableLoading] = useState(false);
//   const [nextPageClicked, setNextPageClicked] = useState(false);
//   const [modalOpened, setModalOpened] = useState(false);
//   const [modalDetails, setModalDetails] = useState({});

//   const pageParams = {
//     lastCreatedAt: searchParams.get('lastCreatedAt'),
//     lastId: searchParams.get('lastId'),
//     limit: searchParams.get('limit') || 10, // Default limit
//     sortBy: searchParams.get('sortBy') || 'createdAt', // Default sort field
//     sortOrder: searchParams.get('sortOrder') || 'desc', // Default sort order
//   };

//   // Fetch record book details
//   const getRecordDetails = useCallback(async () => {
//     setTableLoading(true);
//     const token = localStorage.getItem('token');

//     if (!token) {
//       toast.error('Please log in to continue', { style: { padding: '20px' }, duration: 2000 });
//       navigate('/login'); // Redirect to login
//       return;
//     }

//     const baseUrl = `${root}/dept/deptstore-log`;
//     const queryString = nextPageClicked && Object.keys(pageParams).every(key => pageParams[key])
//       ? `?${new URLSearchParams(pageParams).toString()}`
//       : '';
//     const url = `${baseUrl}${queryString}`;

//     try {
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = response.data.data || [];
//       setRecordBookDetails(data);
//       setFailedSearch(data.length === 0);
//       setDetails(response.data);
//     } catch (error) {
//       console.error('Error fetching record details:', error);
//       toast.error(error.response?.data?.message || 'Failed to load records', {
//         style: { padding: '20px' },
//         duration: 3000,
//       });
//       setFailedSearch(true);
//     } finally {
//       setTableLoading(false);
//     }
//   }, [nextPageClicked, navigate, pageParams]);

//   // Get status color for signature
//   const getSquareColor = (status) => {
//     return {
//       pending: 'text-yellow-500',
//       received: 'text-green-500',
//       rejected: 'text-red-500',
//     }[status] || 'text-gray-500';
//   };

//   // Handle row click to open modal
//   const handleRowClick = (item) => {
//     setModalDetails(item);
//     setModalOpened(true);
//   };

//   // Fetch data on mount and when search params change
//   useEffect(() => {
//     getRecordDetails();
//   }, [getRecordDetails, searchParams]);

//   // Modal component
//   const DetailsModal = () => (
//     <Modal
//       open={modalOpened}
//       title="Record Book Details"
//       footer={null}
//       onCancel={() => setModalOpened(false)}
//       width={400}
//     >
//       <div className="space-y-4 py-4">
//         <div>
//           <p className="font-bold text-gray-700">Date</p>
//           <p>{refractor(modalDetails.createdAt)}</p>
//         </div>
//         <div>
//           <p className="font-bold text-gray-700">Customer Name</p>
//           <p>{modalDetails.name || 'N/A'}</p>
//         </div>
//         <div>
//           <p className="font-bold text-gray-700">Product Name</p>
//           <p>{modalDetails.departmentStore?.product?.name || 'N/A'}</p>
//         </div>
//         {modalDetails.quantityRemoved > modalDetails.quantityAdded ? (
//           <div>
//             <p className="font-bold text-red-500">Quantity Out</p>
//             <p>{modalDetails.quantityRemoved}</p>
//           </div>
//         ) : modalDetails.quantityAdded > modalDetails.quantityRemoved ? (
//           <div>
//             <p className="font-bold text-green-500">Quantity In</p>
//             <p>{modalDetails.quantityAdded}</p>
//           </div>
//         ) : null}
//         {modalDetails.comments && (
//           <div>
//             <p className="font-bold text-gray-700">Comments</p>
//             <p>{modalDetails.comments}</p>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );

//   return (
//     <div className="p-6">
//       <Flex justify="between" align="center">
//         <Heading size="6">Record Book</Heading>
//         <Button variant="soft" onClick={() => navigate(-1)}>
//           Back
//         </Button>
//       </Flex>
//       <Separator className="my-4 w-full" />

//       <Table.Root className="mt-5" variant="surface">
//         <Table.Header>
//           <Table.Row>
//             <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Quant. Out</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Quant. In</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>Signed</Table.ColumnHeaderCell>
//           </Table.Row>
//         </Table.Header>

//         <Table.Body>
//           {tableLoading ? (
//             <Table.Row>
//               <Table.Cell colSpan={7} className="text-center py-4">
//                 <Spinner />
//               </Table.Cell>
//             </Table.Row>
//           ) : failedSearch || recordBookDetails.length === 0 ? (
//             <Table.Row>
//               <Table.Cell colSpan={7} className="text-center py-4">
//                 No records found
//               </Table.Cell>
//             </Table.Row>
//           ) : (
//             recordBookDetails.map((item) => (
//               <Table.Row
//                 key={item.id}
//                 className="hover:bg-gray-100 cursor-pointer transition-colors"
//                 onClick={() => handleRowClick(item)}
//               >
//                 <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
//                 <Table.Cell>{item.departmentStore?.product?.name || 'N/A'}</Table.Cell>
//                 <Table.Cell>{item.name || 'N/A'}</Table.Cell>
//                 <Table.Cell>{item.quantityRemoved > item.quantityAdded ? item.quantityRemoved : ''}</Table.Cell>
//                 <Table.Cell>{item.quantityAdded > item.quantityRemoved ? item.quantityAdded : ''}</Table.Cell>
//                 <Table.Cell>{formatMoney(item.amountRemaining)}</Table.Cell>
//                 <Table.Cell>
//                   <FontAwesomeIcon
//                     icon={faSquare}
//                     className={`mr-2 ${getSquareColor(item.signature ? 'received' : 'rejected')}`}
//                   />
//                   {item.signature ? 'Signed' : 'Not Signed'}
//                 </Table.Cell>
//               </Table.Row>
//             ))
//           )}
//         </Table.Body>
//       </Table.Root>

//       {details?.pagination?.nextPage && (
//         <Flex justify="end" className="my-6">
//           <Button
//             className="bg-theme cursor-pointer"
//             onClick={() => {
//               setNextPageClicked(true);
//               const nextParams = new URLSearchParams(details.pagination.nextPage.split('?')[1]);
//               navigate(`/admin/department-store/record-book?${nextParams.toString()}`);
//               getRecordDetails(); // Call immediately, remove delay
//             }}
//             disabled={tableLoading}
//           >
//             Next Page
//           </Button>
//         </Flex>
//       )}

//       <DetailsModal />
//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default DepartmentRecordBook;