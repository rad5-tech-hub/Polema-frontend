import {
  Heading,
  Flex,
  Button,
  Table,
  Text,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
import { useParams } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import React from "react";
const root = import.meta.env.VITE_ROOT;

const BatchingRecords = () => {
  const { id } = useParams();
  const showToast = useToast();
  const [loading, setLoading] = React.useState(true);
  const [batchDetails, setBatchDetails] = React.useState(null);
  const CPKO

  const getBatchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });

      return;
    }
    try {
      const {data} = await axios.get(`${root}/batch/all-batch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let info = data.data.filter((item) => item.id === id);
      setBatchDetails(info);



    } catch (err) {
      console.log(err);
      
      showToast({
        type: "error",
        message: "An error occurred while trying to get batch summary",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getBatchDetails();
  }, [id]);
  return (
    <>
      <Flex justify="between" align={"center"}>
        <Heading>Batch Summary</Heading>
        {batchDetails !== null && console.log(batchDetails)}
        <p>
          <span className="font-bold">Status:</span>
          <span>
            {" "}
            {batchDetails !== null
              ? batchDetails[0].isActive
                ? "Open"
                : "Closed"
              : ""}
          </span>
        </p>
      </Flex>

      {loading && <Spinner size="3" className="mt-4" />}

      <div className="flex gap-4 !text-sm">
      <Table.Root className="mt-4 table-fixed w-full" variant="surface" size="2">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell colSpan={2} className="font-bold text-sm p-4 text-center">
        FINE VEGETABLE OIL SALES
      </Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell colSpan={2} className="font-bold text-sm p-4 text-center">
        CPKO BOUGHT
      </Table.ColumnHeaderCell>
    </Table.Row>
    <Table.Row>
      <Table.ColumnHeaderCell className="text-left p-4">
        QUANTITY (TONS)
      </Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell className="text-left p-4">
        UNIT PRICE (₦)
      </Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell className="text-left p-4">
        QUANTITY (TONS)
      </Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell className="text-left p-4">
        UNIT PRICE (₦)
      </Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>
</Table.Root>

        {/* <Table.Root
        className="mt-4 table-fixed w-full"
        variant="surface"
        size="2"
      >
        <Table.Header>
          <h1 className="font-bold !text-sm p-4">CPKO BOUGHT</h1>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              QUANTITY (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              UNIT PRICE (N)
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root> */}
      </div>
    </>
  );
};

export default BatchingRecords;
