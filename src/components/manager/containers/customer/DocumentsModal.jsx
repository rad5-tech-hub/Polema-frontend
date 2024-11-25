import React from "react";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;
import axios from "axios";
import {
  Flex,
  Text,
  Button,
  Separator,
  Spinner,
  Grid,
  TextField,
} from "@radix-ui/themes";

const DocumentsModal = ({ isOpen, onClose, customerName, id }) => {
  if (!isOpen) return null;
  const [entries, setEntries] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);

  // Function to generate invoice
  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging again.");
      return;
    }

    try {
      const response = await axios.post(
        `${root}/customer/create-invoice/${id}`,
        {
          body: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEntries(response.data.invoice.ledgerEntries);
    } catch (error) {
      console.log(error);
      setFailedSearch(true);
      setEntries([]);
    }
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
        <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[850px]">
          <Flex justify={"between"}>
            <div className="left">
              <p className="text-sm font-bold opacity-50">Customer Name:</p>
              <p className="textt-lg font-bold font-space">{customerName}</p>
            </div>
            <div className="right">
              <p className="text-sm font-bold opacity-50">Transaction ID:</p>
              <p className="textt-lg font-bold font-space">{id}</p>
            </div>
          </Flex>

          <Separator className="mt-4 w-full" />
          <div className="flex justify-between w-full">
            <div className="left w-[60%] border-black/30 p-4 border-r-2">
              <Flex justify={"between"} cl>
                <p className="text-green-500">Credit:</p>
                <p>Paid to:</p>
              </Flex>

              <p className=" opacity-40 text-sm mt-4">
                Ledger Transactions History
              </p>
              {/* Entries  */}
              {entries.length === 0 ? (
                <div className="p-4">
                  {failedSearch ? (
                    <p className="text-red-500">
                      An error occurred, try again.
                    </p>
                  ) : (
                    <Spinner />
                  )}
                </div>
              ) : (
                entries.map((entry) => {
                  return (
                    <p className="p-2">
                      {entry.quantity} {entry.unit}
                    </p>
                  );
                })
              )}

              <p className=" opacity-40 text-sm mt-4 mb-3">
                Additional Product
              </p>
              <Grid columns={"2"} gap={"3"}>
                <div>
                  <Text>Item Name</Text>
                  <TextField.Root placeholder="Input Name" />
                </div>
                <div>
                  <Text>Price</Text>
                  <TextField.Root placeholder="Enter Price" />
                </div>
                <div>
                  <Text>Quantity Ordered</Text>
                  <TextField.Root placeholder="Enter Quantity" />
                </div>
              </Grid>
            </div>
            <div className="right  p-4 w-[40%]">
              <Text className="font-bold font-amsterdam">
                Weigh Bridge Summary
              </Text>

              <div className="w-[80px] h-[80px] rounded-md bg-gray-400/40  mt-2 border-2"></div>
              <div className="weigh-details">
                <p className="p-2">Vehicle NO:</p>
                <p className="p-2">Driver's Name:</p>
                <p className="p-2">Tar Quantity:</p>
                <p className="p-2">Gross Quantity:</p>
                <p className="p-2">Net Quantity:</p>
              </div>
            </div>
          </div>

          <Flex justify="end">
            <Button size="3" variant="soft" color="brown" onClick={onClose}>
              Close
            </Button>
          </Flex>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default DocumentsModal;
