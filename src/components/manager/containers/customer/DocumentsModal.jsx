import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { formatMoney } from "../../../date";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { CameraFilled } from "@ant-design/icons";
import { Flex, Button, Separator, Spinner, Grid, Text } from "@radix-ui/themes";

const root = import.meta.env.VITE_ROOT;

const DocumentsModal = ({ isOpen, onClose, customerName, customerId }) => {
  const [entries, setEntries] = useState([]);
  const [docOrders, setDocOrders] = useState({});
  const [summary, setSummary] = useState({});
  const [failedSearch, setFailedSearch] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    cashTicket: null,
    invoice: null,
    gatepass: null,
  });

  const divRef = useRef(null);
  const navigate = useNavigate();

  const handleFullscreen = (type) => {
    if (uploadedFiles[type]?.url) {
      const imageElement = document.getElementById(`image-${type}`);
      if (imageElement?.requestFullscreen) {
        imageElement.requestFullscreen();
      }
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
    } catch (error) {
      setFailedSearch(true);
      toast.error("Failed to fetch invoice details.");
    }
  };

  useEffect(() => {
    if (isOpen && customerId) fetchInvoice();
  }, [isOpen, customerId]);

  const handleFileUpload = async (file, type) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await axios.post(`${root}/dept/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: { ...prev[type], uploaded: true },
        }));

        // Function to change body based on file type
        const changeBodyFunction = (receiptType, imageUrl) => {
          if (!imageUrl) {
            console.error("Invalid image URL");
            return null;
          }

          switch (receiptType) {
            case "CashTicket":
              return { cashImage: imageUrl };

            case "Invoice":
              return { invoiceImg: imageUrl };

            case "Gatepass":
              return { gatepassImage: imageUrl };

            case "Waybill":
              return { wayBillImage: imageUrl };

            default:
              console.warn(`Unknown receipt type: ${receiptType}`);
              return null;
          }
        };

        //Second Request to Upload Cloudinary Link from backend

        try {
          const response = await axios.patch(
            `${root}/customer/ledgers-images/${customerId}`,
            changeBodyFunction()
          );
          setImageUploaded(true);
        } catch (error) {
          // setImageUploaded()
          console.log(error);
        }
      } else {
        toast.error(`Upload failed for ${type}.`);
      }
    } catch (error) {
      toast.error("Upload error. Please try again.");
    }
  };

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: { file, url: URL.createObjectURL(file), uploaded: false },
      }));
      await handleFileUpload(file, type);
    } else {
      toast.error("Invalid file type. Please upload an image.");
    }
  };

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
              <p className="text-sm font-bold opacity-50">Tranx ID:</p>
              <p className="text-lg font-bold">{customerId}</p>
            </div>
          </Flex>
          <Separator />
          <div className="flex">
            <div className="w-3/5 border-r-2 border-gray-300 p-4">
              <Flex justify="between">
                <p className="text-green-500 text-sm">
                  Previous Credit: ₦{formatMoney(summary.credit) || "0.00"}
                </p>
              </Flex>
              <p className="text-lg font-bold mt-4">
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
                  <Grid key={idx} columns="3" gap="2" className="p-1">
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
                      }`}>
                      ₦ {entry.debit}
                    </p>
                  </Grid>
                ))
              )}

              <div>
                <p className="text-lg font-bold opacity mt-6 mb-2">Receipts</p>
                <div className="flex gap-3">
                  {["CashTicket", "Invoice", "Gatepass", "Waybill"].map(
                    (type, idx) => (
                      <div key={idx} className="text-center">
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, type)}
                          />
                          <div
                            id={`image-${type}`}
                            className="bg-gray-300 rounded min-w-[70px] h-[70px] flex justify-center items-center overflow-hidden cursor-pointer"
                            style={{
                              backgroundImage: uploadedFiles[type]?.url
                                ? `url(${uploadedFiles[type].url})`
                                : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}>
                            {!uploadedFiles[type]?.url && <CameraFilled />}
                          </div>
                        </label>
                        <p
                          className="text-[.75rem] cursor-pointer font-bold hover:underline"
                          onClick={() => handleFullscreen(type)}>
                          {type.replace(/([A-Z])/g, " $1")}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
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
                }}></div>
              {docOrders.authToWeighTickets && (
                <div>
                  <p className="py-2">
                    Vehicle No: {docOrders.authToWeighTickets.vehicleNo}
                  </p>
                  <p className="py-2">
                    Driver's Name: {docOrders.authToWeighTickets.driver}
                  </p>
                  <p className="py-2">
                    Tar Quantity: {docOrders.weighBridge?.tar}
                  </p>
                  <p className="py-2">
                    Gross Quantity: {docOrders.weighBridge?.gross}
                  </p>
                  <p className="py-2">
                    Net Quantity: {docOrders.weighBridge?.net}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Flex justify="end" className="mt-5">
            <Flex gap="2">
              {["invoice", "gatepass", "waybill-invoice"].map((route, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    navigate(`/admin/receipt/create-${route}/${customerId}`)
                  }
                  className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Generate {route.replace(/-/g, " ")}
                </button>
              ))}
            </Flex>
          </Flex>
          <Button
            onClick={onClose}
            className="absolute top-2 right-2 bg-red-400">
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default DocumentsModal;
