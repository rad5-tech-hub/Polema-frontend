import React, { useEffect, useState } from "react";
import { Heading, Spinner, Table } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";

const root = import.meta.env.VITE_ROOT;

const AllWayBill = () => {
  const [billDetails, setBillDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch all waybills
  const fetchWaybills = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", { duration: 5000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-waybill`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { waybills } = response.data;

      if (!waybills || waybills.length === 0) {
        setFailedText("No records found.");
        setFailedSearch(true);
        setBillDetails([]);
      } else {
        setFailedSearch(false);
        setBillDetails(waybills);
      }
    } catch (error) {
      console.error("Error fetching waybills:", error);
      toast.error("Failed to fetch waybills. Please try again.", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaybills();
  }, []);

  return (
    <>
      <Heading>View All Waybills</Heading>

      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TRANSPORT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center p-4">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center p-4">
                {failedText}
              </Table.Cell>
            </Table.Row>
          ) : (
            billDetails.map((item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>{refractor(item.createdAt)}</Table.RowHeaderCell>
                <Table.Cell>{item.to}</Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>{item.transport}</Table.Cell>
                <Table.Cell>{item.vehicleNo}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <Toaster position="top-right" />
    </>
  );
};

export default AllWayBill;
