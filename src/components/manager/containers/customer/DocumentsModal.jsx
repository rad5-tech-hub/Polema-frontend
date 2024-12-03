import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Flex, Button, Separator, Spinner, Grid, Text } from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;

const DocumentsModal = ({ isOpen, onClose, customerName, customerId }) => {
  const [entries, setEntries] = useState([]);
  const [docOrders, setDocOrders] = useState({});
  const [summary, setSummary] = useState({});
  const [failedSearch, setFailedSearch] = useState(false);
  const divRef = useRef(null);
  const navigate = useNavigate();

  const handleFullscreen = () => {
    if (divRef.current?.requestFullscreen) {
      divRef.current.requestFullscreen();
    }
  };

  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred. Try logging in again.");
      return;
    }
    try {
      const { data } = await axios.get(
        `${root}/customer/get-summary/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEntries(data.ledgerSummary?.ledgerEntries || []);
      setSummary(data.ledgerSummary || {});
      setDocOrders(data.order || {});
      setFailedSearch(false);
    } catch {
      setFailedSearch(true);
    }
  };

  useEffect(() => {
    if (isOpen) fetchInvoice();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
        <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[850px] relative">
          <Flex justify="between" className="mb-4">
            <div>
              <p className="text-sm font-bold opacity-50">Customer Name:</p>
              <p className="text-lg font-bold">{customerName}</p>
            </div>
            <div>
              <p className="text-sm font-bold opacity-50">Customer ID:</p>
              <p className="text-lg font-bold">{customerId}</p>
            </div>
          </Flex>
          <Separator />
          <div className="flex">
            <div className="w-3/5 border-r-2 border-gray-300 p-4">
              <Flex justify="between">
                <p className="text-green-500">
                  Previous Credit: {summary.credit || "0.00"}
                </p>
                <p>Paid to:</p>
              </Flex>
              <p className="text-sm opacity-50 mt-4">
                Ledger Transactions History
              </p>
              {entries.length === 0 ? (
                <div className="p-4">
                  {failedSearch ? (
                    <p className="text-red-500">
                      An error occurred. Try again.
                    </p>
                  ) : (
                    <Spinner />
                  )}
                </div>
              ) : (
                entries.map((entry, idx) => (
                  <Grid key={idx} columns="3" className="p-1">
                    <p className="text-xs">
                      {entry.creditType === null &&
                        `${entry.quantity} ${entry.unit} of`}{" "}
                      {entry.product?.name}
                    </p>
                    <p className="text-xs">
                      {entry.creditType && `Paid with ${entry.creditType}`}
                    </p>
                    <p
                      className={`text-xs ${
                        entry.creditType ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {entry.debit}
                    </p>
                  </Grid>
                ))
              )}
            </div>
            <div className="w-2/5 p-4">
              <Text className="font-bold">Weigh Bridge Summary</Text>
              <div
                ref={divRef}
                className="w-20 h-20 mt-2 rounded-md bg-gray-400/40 border-2 cursor-pointer"
                onClick={entries[0]?.weighImage && handleFullscreen}
                style={{
                  backgroundImage: entries[0]?.weighImage
                    ? `url(${entries[0].weighImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              {docOrders.authToWeighTickets && (
                <div>
                  <p>Vehicle No: {docOrders.authToWeighTickets.vehicleNo}</p>
                  <p>Driver's Name: {docOrders.authToWeighTickets.driver}</p>
                  <p>Tar Quantity: {docOrders.weighBridge?.tar}</p>
                  <p>Gross Quantity: {docOrders.weighBridge?.gross}</p>
                  <p>Net Quantity: {docOrders.weighBridge?.net}</p>
                </div>
              )}
            </div>
          </div>
          <Flex justify="end" className="mt-5">
            <Flex gap="2">
              <button
                onClick={() =>
                  navigate(`/admin/receipt/create-invoice/${customerId}`)
                }
                className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Generate Invoice
              </button>
              <button
                onClick={() =>
                  navigate(`/admin/receipt/create-gatepass/${customerId}`)
                }
                className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Generate Gate Pass
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/admin/receipt/create-waybill-invoice/${customerId}`
                  )
                }
                className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Generate Waybill
              </button>
            </Flex>
          </Flex>
          <Button
            onClick={onClose}
            className="absolute top-2 right-2 bg-red-400"
          >
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default DocumentsModal;
