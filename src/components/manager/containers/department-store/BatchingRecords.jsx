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
      const response = await axios.get(`${root}/batch/a-batch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBatchDetails(response.data.data);
    } catch (err) {
      showToast({
        type: "error",
        message: "An error occurred while trying to get bbatch summary",
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
        <p>
          <span className="font-bold">Status:</span>
          <span>
            {" "}
            {batchDetails !== null
              ? batchDetails.isActive
                ? "Open"
                : "Closed"
              : ""}
          </span>
        </p>
      </Flex>

      {loading && <Spinner size="3" className="mt-4" />}

      <div className="flex gap-4 !text-sm">

      <Table.Root
        className="mt-4 table-fixed w-full"
        variant="surface"
        size="2"
      >
        <Table.Header>
          <h1 className="font-bold !text-sm p-4">FINE VEGETABLE OIL SALES</h1>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              QUANTITY (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              UNIT PRICE (N)
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
     
        <Table.Root
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
