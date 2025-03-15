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
  const [receiptImages, setReceiptImages] = useState({
    cashticket: null,
    invoice: null,
    gatepass: null,
    waybill: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    cashTicket: null,
    invoice: null,
    gatepass: null,
    waybill: null,
  });
  const [loading, setLoading] = useState(false);

  const divRef = useRef(null);
  const navigate = useNavigate();

  // Utility to get token with validation
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.");
      return null;
    }
    return token;
  };

  // Fetch ledger data including receipt images
  const fetchInvoice = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
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
      // Assuming the API returns receipt images in the response
      setReceiptImages({
        cashticket: data.ledger?.cashImage || null,
        invoice: data.ledger?.invoiceImg || null,
        gatepass: data.ledger?.gatepassImage || null,
        waybill: data.ledger?.wayBillImage || null,
        weigh: data.ledeger?.weighImage || null,
      });
      setFailedSearch(false);
    } catch (error) {
      setFailedSearch(true);
      toast.error("Failed to fetch invoice details.");
      console.error("Fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customerId) fetchInvoice();
  }, [isOpen, customerId]);

  // Handle fullscreen view
  const handleFullscreen = (type, imageUrl) => {
    const imageElement = document.getElementById(`image-${type}`);
    if (imageUrl && imageElement?.requestFullscreen) {
      imageElement.requestFullscreen();
    } else if (!imageUrl) {
      toast.error("No image available to view.");
    } else {
      toast.error("Fullscreen mode is not supported in this browser.");
    }
  };

  // Map receipt type to backend field
  const getReceiptBody = (receiptType, imageUrl) => {
    if (!imageUrl) return null;
    switch (receiptType.toLowerCase()) {
      case "cashticket":
        return { cashImage: imageUrl };
      case "invoice":
        return { invoiceImg: imageUrl };
      case "gatepass":
        return { gatepassImage: imageUrl };
      case "waybill":
        return { wayBillImage: imageUrl };
      case "weigh":
        return { weighImage: imageUrl };
      default:
        console.warn(`Unknown receipt type: ${receiptType}`);
        return null;
    }
  };

  // Upload file to backend
  const handleFileUpload = async (file, type) => {
    const token = getAuthToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    setLoading(true);
    try {
      // First request: Upload file
      const { data } = await axios.post(`${root}/dept/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = data.imageUrl; // Assuming the response contains the URL
      if (!imageUrl) throw new Error("No image URL returned from upload.");

      // Second request: Update ledger with image URL
      const body = getReceiptBody(type, imageUrl);
      if (body) {
        await axios.patch(
          `${root}/customer/ledgers-images/${customerId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [type.toLowerCase()]: {
          file,
          url: URL.createObjectURL(file),
          uploaded: true,
        },
      }));
      setReceiptImages((prev) => ({
        ...prev,
        [type.toLowerCase()]: imageUrl, // Update with the uploaded image URL
      }));
      toast.success(`${type} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
      console.error("Upload error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file, type);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  // Render receipt section (upload box or image)
  const renderReceiptSection = () => {
    const receiptTypes = ["CashTicket", "Invoice", "Gatepass", "Waybill"];
    return (
      <div className="flex gap-3">
        {receiptTypes.map((type) => {
          const typeKey = type.toLowerCase();
          const apiImageUrl = receiptImages[typeKey];

          const uploadedImageUrl = uploadedFiles[typeKey]?.url;

          // Use uploaded image if available, otherwise fall back to API image
          const displayImageUrl = uploadedImageUrl || apiImageUrl;

          return (
            <div key={type} className="text-center">
              {displayImageUrl ? (
                // Display the image if it exists
                <div>
                  <div
                    id={`image-${type}`}
                    className="rounded min-w-[70px] h-[70px] flex justify-center items-center overflow-hidden cursor-pointer"
                    style={{
                      backgroundImage: `url(${displayImageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <p
                    className="text-[.75rem] cursor-pointer font-bold hover:underline"
                    onClick={() => handleFullscreen(type, displayImageUrl)}>
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
              ) : (
                // Show upload box if no image exists
                <div>
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, type)}
                      disabled={loading}
                    />
                    <div
                      id={`image-${type}`}
                      className="bg-gray-300 rounded min-w-[70px] h-[70px] flex justify-center items-center overflow-hidden cursor-pointer">
                      <CameraFilled />
                    </div>
                  </label>
                  <p className="text-[.75rem] font-bold">
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[850px] relative max-h-[550px] overflow-y-scroll">
        <Toaster />
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
              {summary.bankName && <p>Paid to {summary.bankName}</p>}
            
            </Flex>
            <p className="text-lg font-bold mt-4">
              Ledger Transactions History
            </p>
            {loading ? (
              <Spinner />
            ) : entries.length === 0 ? (
              <p className="text-red-500 p-4">
                {failedSearch
                  ? "An error occurred. Try again."
                  : "No transactions found."}
              </p>
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
              <p className="text-lg font-bold mt-6 mb-2">Receipts</p>
              {renderReceiptSection()}
            </div>
          </div>
          <div className="w-2/5 p-4">
            <Text className="font-bold">Weigh Bridge Summary</Text>
            <div
              ref={divRef}
              className="w-20 h-20 mt-2 rounded-md bg-gray-400/40 border-2 cursor-pointer"
              onClick={() => handleFullscreen("weigh", entries[0]?.weighImage)}
              style={{
                backgroundImage: entries[0]?.weighImage
                  ? `url(${entries[0].weighImage})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
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
            {["invoice", "gatepass", "waybill-invoice"].map((route) => (
              <Button
                key={route}
                onClick={() =>
                  navigate(`/admin/receipt/create-${route}/${customerId}`)
                }
                variant="outline"
                disabled={loading}>
                Generate {route.replace(/-/g, " ")}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Button
          onClick={() => {
            onClose();
            setReceiptImages({
              cashticket: null,
              invoice: null,
              gatepass: null,
              waybill: null,
            });
          }}
          className="absolute top-2 right-2 bg-red-400"
          disabled={loading}>
          <FontAwesomeIcon icon={faClose} />
        </Button>
      </div>
    </div>
  );
};

export default DocumentsModal;
