import React from "react";
import { refractor } from "../../../date";
import { Heading, Table, Separator, Spinner } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const AllWeigh = () => {
  const [weighDetails, setWeighDetails] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);

  // Function to fetch all weigh details
  const fetchWeighDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${root}/customer/view-weighs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWeighDetails(response.data.data);
    } catch (error) {
      console.log(error);
      {
        error.response.status === 404 && setFailedSearch(true);
      }
    }
  };

  React.useEffect(() => {
    fetchWeighDetails();
  }, []);

  return (
    <>
      <Heading>View Weighs</Heading>
      <Separator className="my-4 w-full" />

      {/* Table to show detials */}
      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>CUSTOMER NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>GROSS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>TAR</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>NET</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EXTRA</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>VEHICLE NUMBER</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {weighDetails.length === 0 ? (
            <div className="p-4">
              {failedSearch ? "No records found" : <Spinner />}
            </div>
          ) : (
            weighDetails.map((item) => {
              return (
                <Table.Row>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>

                  <Table.Cell>{`${item.customer.firstname} ${item.customer.lastname}`}</Table.Cell>
                  <Table.Cell>{item.transactions.quantity}</Table.Cell>
                  <Table.Cell>{item.gross}</Table.Cell>
                  <Table.Cell>{item.tar}</Table.Cell>
                  <Table.Cell>{item.net}</Table.Cell>
                  <Table.Cell>{item.extra || 0}</Table.Cell>

                  <Table.Cell>{item.vehicleNo}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default AllWeigh;
