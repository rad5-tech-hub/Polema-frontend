import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refractor } from "../../../date";
import {
  Table,
  Select,
  Heading,
  DropdownMenu,
  Separator,
  Spinner,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisV,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
const root = import.meta.env.VITE_ROOT;

const CashManagementLedger = () => {
  const navigate = useNavigate();
  const [ledger, setLedger] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 17; // Limit items per page to 17

  const fetchCashManagementLedger = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/cashier-ledger`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setLedger(response.data.entries);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuperiorAdmins = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
    }
  };

  const matchAdminNameById = (id) => {
    const admin = admins.find((admin) => admin.id === id);
    return admin ? `${admin.firstname} ${admin.lastname}` : "Unknown";
  };

  useEffect(() => {
    fetchSuperiorAdmins();
    fetchCashManagementLedger();
  }, []);

  // Pagination helpers
  const totalPages = Math.ceil(ledger.length / itemsPerPage);

  const currentPageData = ledger.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Heading>Cash Ledger</Heading>

      <Separator className="my-4 w-full" />

      <Table.Root variant="surface" className="mt-3 mb-6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GIVEN TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>APPROVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CREDIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEBIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentPageData.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            currentPageData.map((entry, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>
                  {refractor(entry.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{entry.comment}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.credit > entry.debit && entry.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.debit > entry.credit && entry.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {matchAdminNameById(entry.approvedByAdminId)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell className="text-green-500">
                  {entry.credit}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell className="text-red-500">
                  {entry.debit}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{entry.balance}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {entry.credit > entry.debit && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => {
                            navigate(
                              `/admin/receipt/official-receipt/${entry.id}`
                            );
                          }}
                        >
                          Generate Receipt
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  )}
                </Table.RowHeaderCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </>
  );
};

export default CashManagementLedger;
