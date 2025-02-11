import React from 'react'
import { Heading, Separator, Table } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-solid-svg-icons'

const DepartmentRecordBook = () => {

    const getSquareColor = (str) => {
        switch (str) {
            case "pending":
                return "text-yellow-500"
                break;
            case "received":
                return "text-green-500"
                break;
            case "rejected":
                return "text-red-500"
                break;
            default:
                break;
        }
    }

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
                        <Table.ColumnHeaderCell>BATCH NO.</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>QUANT. OUT</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>BALANCED</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>SIGNED</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                {/* -------------Table Content--------------- */}
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>
                            <FontAwesomeIcon icon={faSquare} className={`mr-2 ${getSquareColor("rejected")}`} color='greem' />
                            Developer</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </>
    )
}

export default DepartmentRecordBook