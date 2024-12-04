import React, { useEffect, useState } from "react";
import { Heading, Spinner, Table } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AllWayBill = () => {
  const [billDetails, setBillDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");

  // Function to fetch all waybills
  const fetchWaybills = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 10000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-waybill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { waybills } = response.data;

      if (!waybills || waybills.length === 0) {
        setFailedText("No records");
        setFailedSearch(true);
        setBillDetails([]);
      } else {
        setFailedSearch(false);
        setBillDetails(waybills);
      }
    } catch (error) {
      console.error("Error fetching waybills:", error);
      toast.error("Failed to fetch waybills. Please try again.", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchWaybills();
  }, []);

  return (
    <>
      <Heading>View All Waybill</Heading>

      {/* Table to show Waybill Detials */}
      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TRANSPORT </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {billDetails.length === 0 ? (
            <div className="p-4">{failedSearch ? failedText : <Spinner />}</div>
          ) : (
            "Found"
          )}
        </Table.Body>
      </Table.Root>

      <Toaster position="top-right" />
    </>
  );
};

export default AllWayBill;
