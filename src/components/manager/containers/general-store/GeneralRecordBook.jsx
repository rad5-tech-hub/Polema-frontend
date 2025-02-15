
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { refractor } from "../../../date"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Heading, Separator, Table, Spinner, Flex, Button } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-solid-svg-icons'

const root = import.meta.env.VITE_ROOT

const GeneralRecordBook = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [details, setDetails] = useState(null)
    const [recordBookDetails, setRecordBookDetails] = useState([])
    const [failedSearch, setFailedSearch] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [nextPageClicked,setnextPageClicked] = useState(false)


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

        let url = `${root}/dept/genstore-log`
        let nextPageURL = `${root}/dept/genstore-log?lastCreatedAt=${pageParams.lastCreatedAt}&lastId=${pageParams.lastId}&limit=${pageParams.limit}&sortBy=${pageParams.sortBy}&sortOrder=${pageParams.sortOrder}`

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

    return (
        <>
            <Heading>Record Book</Heading>
            <Separator className='my-4 w-full' />
            <Table.Root className='mt-5' variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>ITEM</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                        
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
                                <Table.Cell>{item.generalStore.name}</Table.Cell>
                                <Table.Cell>{item.name}</Table.Cell>
                                {/* <Table.Cell>{item.batchNo}</Table.Cell> */}
                                <Table.Cell>{item.quantityRemoved > item.quantityAdded ? item.quantityRemoved : ""}</Table.Cell>
                                <Table.Cell>{item.quantityRemoved < item.quantityAdded ? item.quantityAdded : ""}</Table.Cell>
                                <Table.Cell>{item.amountRemaining}</Table.Cell>
                                <Table.Cell>
                                    {item.signature ? (
                                        <>
                                            <FontAwesomeIcon icon={faSquare} className={`mr-2 ${getSquareColor("received")}`} /> Signed
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSquare} className={`mr-2 ${getSquareColor("rejected")}`} /> Not Signed
                                        </>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>

            {details?.pagination?.nextPage && (
                <Flex className='my-6' justify={"end"}>
                    <Button
                        className='bg-theme cursor-pointer'
                        onClick={() => {
                            setnextPageClicked(true)
                            navigate(
                                `/admin/general-store/record-book?lastCreatedAt=${parseUrlParams(details.pagination.nextPage)["lastCreatedAt"]}&lastId=${parseUrlParams(details.pagination.nextPage)["lastId"]}&limit=${parseUrlParams(details.pagination.nextPage)["limit"]}&sortBy=${parseUrlParams(details.pagination.nextPage)["sortBy"]}&sortOrder=${parseUrlParams(details.pagination.nextPage)["sortOrder"]}`
                            )

                            setTimeout(() => getRecordDetails(), 4000)
                        }}
                    >
                        Next Page
                    </Button>
                </Flex>
            )}

            <Toaster position='top-right' />
        </>
    )
}

export default GeneralRecordBook
