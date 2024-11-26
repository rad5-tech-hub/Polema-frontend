import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;
import axios from "axios";
import { faClose } from "@fortawesome/free-solid-svg-icons";
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
  const navigate = useNavigate();
  const [entries, setEntries] = React.useState([]);
  const [failedSearch, setFailedSearch] = React.useState(false);
  const [docOrders, setDocOrders] = React.useState("");

  // Function to generate invoice
  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging again.");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/customer/get-summary/${id}`,
        {
          body: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEntries(response.data.ledgerSummary.ledgerEntries);
      setDocOrders(response.data.order);
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
        <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[850px] relative">
          <Flex justify={"between"} className="mt-8">
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
            </div>
            <div className="right  p-4 w-[40%]">
              <Text className="font-bold font-amsterdam">
                Weigh Bridge Summary
              </Text>

              <div className="w-[80px] h-[80px] rounded-md bg-gray-400/40  mt-2 border-2"></div>
              <div className="weigh-details">
                {docOrders && (
                  <p className="p-2">
                    Vehicle NO:{docOrders.authToWeighTickets.vehicleNo}
                  </p>
                )}

                {docOrders && (
                  <p className="p-2">
                    Driver's Name:{docOrders.authToWeighTickets.driver}
                  </p>
                )}
                {docOrders && (
                  <p className="p-2">
                    Tar Quantity:{docOrders.weighBridge.tar}
                  </p>
                )}
                {docOrders && (
                  <p className="p-2">
                    Gross Quantity:{docOrders.weighBridge.gross}
                  </p>
                )}
                {docOrders && (
                  <p className="p-2">
                    Net Quantity:{docOrders.weighBridge.net}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Flex justify={"end"} className="mt-5">
            <Flex gap={"2"}>
              <button
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-2 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Generate Invoice
              </button>
              <button
                onClick={() => {
                  navigate(`/admin/receipt/create-gatepass/${id}`);
                }}
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-2 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Generate Gate Pass
              </button>
              <button
                onClick={() => {
                  navigate(`/admin/receipt/create-waybill-invoice/${id}`);
                }}
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-2 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Generate Waybill
              </button>
            </Flex>
          </Flex>

          <Flex justify="end" className="absolute  right-[10px] top-[10px]">
            <Button
              size="3"
              variant="soft"
              color="brown"
              className="cursor-pointer"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faClose} />
            </Button>
          </Flex>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default DocumentsModal;
