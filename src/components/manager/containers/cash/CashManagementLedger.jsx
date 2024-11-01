import React from "react";
import { refractor } from "../../../date";
import { Table, Select, Heading, Separator, Spinner } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const CashManagementLedger = () => {
  // State management for ledger
  const [ledger, setLedger] = React.useState([]);
  const [admins, setAdmins] = React.useState([]);

  // Function to fetch cash ledger
  const fetchCashManagementLedger = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setButtonLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/cashier-ledger`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setLedger(response.data.entries);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch the super admins
  const fetchSuperiorAdmims = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setButtonLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setAdmins(response.data.staffList);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Admins Name by Id
  const matchAdminNameById = (id) => {
    const adminName = admins.find((admin) => admin.id === id);
    return `${adminName.firstname} ${adminName.lastname}`;
  };

  React.useEffect(() => {
    fetchSuperiorAdmims();
    fetchCashManagementLedger();
  }, []);

  return (
    <>
      <Heading>Cash Ledger</Heading>

      {/* Table to show the  cash ledger details */}
      <Table.Root variant="surface" className="mt-3 mb-6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>COMMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RECEIVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GIVEN TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>APROVED BY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CREDIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEBIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BALANCE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ledger.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            ledger.map((entry, index) => {
              return (
                <>
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>
                      {refractor(entry.createdAt)}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>{entry.comment}</Table.RowHeaderCell>
                    <Table.RowHeaderCell>{entry.name}</Table.RowHeaderCell>
                    <Table.RowHeaderCell>{entry.name}</Table.RowHeaderCell>{" "}
                    <Table.RowHeaderCell>
                      {matchAdminNameById(entry.approvedByAdminId)}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell className="text-green-500">
                      {entry.credit}
                    </Table.RowHeaderCell>{" "}
                    <Table.RowHeaderCell className="text-red-500">
                      {entry.debit}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>{entry.balance}</Table.RowHeaderCell>
                  </Table.Row>
                </>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default CashManagementLedger;
