import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import heic2any from "heic2any";
import Webcam from "react-webcam";
import Cropper from "react-easy-crop";
import {
  Heading,
  Separator,
  Grid,
  TextField,
  Text,
  Flex,
  Button,
  Spinner,
} from "@radix-ui/themes";
import { ArrowLeftIcon, UploadIcon, CameraIcon } from "@radix-ui/react-icons";
import { formatMoney } from "../../../date";
import SignatureCanvas from "../../../signature-pad/SignatureCanvas";

const root = import.meta.env.VITE_ROOT;

// Custom Dialog Component
const CustomDialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

const NewWeigh = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [isSupplier, setIsSupplier] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [tar, setTar] = useState("");
  const [saveAuthId, setSaveAuthId] = useState("");
  const [gross, setGross] = useState("");
  const [quantityNet, setQuantityNet] = useState("");
  const [initialQuantity, setInitialQuantity] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [supervisorNameWeighIn, setSupervisorNameWeighIn] = useState("");
  const [supervisorNameWeighOut, setSupervisorNameWeighOut] = useState("");
  const [signatureWeighIn, setSignatureWeighIn] = useState("");
  const [signatureWeighOut, setSignatureWeighOut] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingSaving, setButtonLoadingSaving] = useState(false);
  const [canvasVisibleWeighIn, setCanvasVisibleWeighIn] = useState(false);
  const [canvasVisibleWeighOut, setCanvasVisibleWeighOut] = useState(false);
  const [isTarDisabled, setIsTarDisabled] = useState(false);
  const [isGrossDisabled, setIsGrossDisabled] = useState(false);
  const [isSupervisorWeighInDisabled, setIsSupervisorWeighInDisabled] = useState(false);
  const [isSupervisorWeighOutDisabled, setIsSupervisorWeighOutDisabled] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  const fetchSavedWeigh = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const endpoint = `/customer/view-a-saved/${id}`;
      const request = await axios.get(`${root}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ticket = request.data.data;

      setIsSupplier(!!ticket.supplierId && !ticket.customerId);
      setFullName(
        ticket.supplierId && ticket.supplier
          ? `${ticket.supplier.firstname} ${ticket.supplier.lastname}`
          : ticket.customerId && ticket.customer
          ? `${ticket.customer.firstname} ${ticket.customer.lastname}`
          : "Name not available"
      );
      setVehicleNumber(ticket.vehicleNo || "");
      setSaveAuthId(ticket.authToWeighId || '');
      setTar(ticket.tar || "");
      setIsTarDisabled(!!ticket.tar);
      setGross(ticket.gross || "");
      setIsGrossDisabled(!!ticket.gross);
      setQuantityNet(ticket.net || "");
      setInitialQuantity(
        ticket.transaction?.quantity
          ? parseFloat(ticket.transaction.quantity)
          : 0
      );
      setImageURL(ticket.image || "");
      setImagePreview(ticket.image || null);
      setSupervisorNameWeighIn(ticket.signInSupervisor || "");
      setIsSupervisorWeighInDisabled(!!ticket.signInSupervisor);
      setSupervisorNameWeighOut(ticket.signOutSupervisor || "");
      setIsSupervisorWeighOutDisabled(!!ticket.signOutSupervisor);
      setSignatureWeighIn(ticket.signIn || "");
      setSignatureWeighOut(ticket.signOut || "");
    } catch (error) {
      console.error("Fetch saved weigh error:", error);
      toast.error("Failed to fetch saved weigh details", {
        style: { padding: "20px" },
        duration: 3000,
      });
    }
  };

  const fetchIndividualWeigh = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const endpoint = `/admin/view-auth-weigh/${id}`;
      const request = await axios.get(`${root}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ticket = request.data.ticket;

      setIsSupplier(!!ticket.supplierId && !ticket.customerId);
      setFullName(
        ticket.supplierId && ticket.supplier
          ? `${ticket.supplier.firstname} ${ticket.supplier.lastname}`
          : ticket.customerId && ticket.transactions?.corder
          ? `${ticket.transactions.corder.firstname} ${ticket.transactions.corder.lastname}`
          : "Name not available"
      );
      setVehicleNumber(ticket.vehicleNo || "");
      setTar(ticket.tar || "");
      setIsTarDisabled(!!ticket.tar);
      setGross(ticket.gross || "");
      setIsGrossDisabled(!!ticket.gross);
      setQuantityNet(ticket.net || "");
      setInitialQuantity(
        ticket.transactions?.quantity
          ? parseFloat(ticket.transactions.quantity)
          : 0
      );
      setImageURL(ticket.image || "");
      setImagePreview(ticket.image || null);
      setSupervisorNameWeighIn("");
      setIsSupervisorWeighInDisabled(false);
      setSupervisorNameWeighOut("");
      setIsSupervisorWeighOutDisabled(false);
      setSignatureWeighIn("");
      setSignatureWeighOut("");
    } catch (error) {
      console.error("Fetch weigh error:", error);
      toast.error("Failed to fetch weigh details", {
        style: { padding: "20px" },
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/admin/weighing-operations/finish-weigh")) {
      fetchSavedWeigh();
    } else {
      fetchIndividualWeigh();
    }
  }, [location.pathname]);

  const convertToJpeg = (input, filename = "image.jpg") => {
    return new Promise((resolve, reject) => {
      if (
        input instanceof File &&
        (input.type === "image/heic" ||
          input.type === "image/heif" ||
          input.name.toLowerCase().endsWith(".heic"))
      ) {
        heic2any({
          blob: input,
          toType: "image/jpeg",
          quality: 0.8,
        })
          .then((jpegBlob) => {
            resolve(new File([jpegBlob], filename, { type: "image/jpeg" }));
          })
          .catch((error) => {
            console.error("HEIC conversion failed:", error);
            reject(error);
          });
        return;
      }

      const img = new Image();
      img.src = input instanceof File ? URL.createObjectURL(input) : input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const jpegFile = new File([blob], filename, { type: "image/jpeg" });
              if (input instanceof File) URL.revokeObjectURL(img.src);
              resolve(jpegFile);
            } else {
              if (input instanceof File) URL.revokeObjectURL(img.src);
              reject(new Error("Failed to create JPEG blob"));
            }
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => {
        if (input instanceof File) URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load image"));
      };
    });
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
            } else {
              reject(new Error("Failed to create cropped image"));
            }
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => reject(new Error("Failed to load image for cropping"));
    });
  };

  const handleImageChange = async (file, previewUrl) => {
    setIsImageUploading(true);
    setImagePreview(previewUrl);

    try {
      const jpegFile = await convertToJpeg(file, file.name || "captured.jpg");
      const formData = new FormData();
      formData.append("file", jpegFile);
      const request = await axios.post(`${root}/dept/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageURL(request.data.imageUrl);
      setIsImageUploading(false);
      toast.success("Image Uploaded Successfully", {
        style: { padding: "20px" },
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setImagePreview(null);
      setImageURL(null);
      setIsImageUploading(false);
      URL.revokeObjectURL(previewUrl);
      toast.error("Failed to upload image.", {
        style: { padding: "20px" },
        duration: 3000,
      });
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
      "image/heic",
      "image/heif",
    ];
    const isImage =
      validImageTypes.includes(file.type) ||
      /\.(jpe?g|png|gif|bmp|webp|svg|tiff?|heic)$/i.test(file.name);
    if (!isImage) {
      toast.error("Please upload a valid image file", {
        style: { padding: "20px" },
        duration: 3000,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    await handleImageChange(file, previewUrl);
  };

  const handleFileSelectClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleCameraClick = (e) => {
    e.preventDefault();
    setIsCameraModalOpen(true);
    setWebcamError(null);
  };

  const handleSnap = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    } else {
      toast.error("Failed to capture photo. Please ensure webcam access is granted.", {
        style: { padding: "20px" },
        duration: 3000,
      });
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCroppedImage = async () => {
    if (!capturedImage || !croppedAreaPixels) {
      toast.error("No image to save", {
        style: { padding: "20px" },
        duration: 3000,
      });
      return;
    }

    try {
      const croppedFile = await getCroppedImg(capturedImage, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedFile);
      await handleImageChange(croppedFile, previewUrl);
      setIsCameraModalOpen(false);
      setCapturedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Save cropped image failed:", error);
      toast.error("Failed to save cropped image", {
        style: { padding: "20px" },
        duration: 3000,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const resetForm = () => {
    setFullName("");
    setVehicleNumber("");
    setTar("");
    setGross("");
    setQuantityNet("");
    setInitialQuantity(0);
    setImageURL("");
    setImagePreview(null);
    setSupervisorNameWeighIn("");
    setSupervisorNameWeighOut("");
    setSignatureWeighIn("");
    setSignatureWeighOut("");
    setCanvasVisibleWeighIn(false);
    setCanvasVisibleWeighOut(false);
    setIsTarDisabled(false);
    setIsGrossDisabled(false);
    setIsSupervisorWeighInDisabled(false);
    setIsSupervisorWeighOutDisabled(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setButtonLoadingSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.", {
        style: { padding: "20px" },
        duration: 3000,
      });
      setButtonLoadingSaving(false);
      return;
    }

    const body = {};
    if (supervisorNameWeighIn) body.signInSupervisor = supervisorNameWeighIn;
    if (supervisorNameWeighOut) body.signOutSupervisor = supervisorNameWeighOut;
    if (signatureWeighIn) body.signIn = signatureWeighIn;
    if (signatureWeighOut) body.signOut = signatureWeighOut;
    if (tar) body.tar = parseFloat(tar);
    if (gross) body.gross = parseFloat(gross);
    if (quantityNet) body.net = parseFloat(quantityNet);
    if (quantityNet && initialQuantity !== null) {
      body.extra = parseFloat(quantityNet) - initialQuantity;
    }
    if (imageURL) body.image = imageURL;

    try {
      const endpoint = `/customer/save-weigh/${id}`;
      await axios.post(`${root}${endpoint}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Weigh Draft Saved Successfully", {
        style: { padding: "20px" },
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save draft",
        {
          style: { padding: "20px" },
          duration: 2500,
        }
      );
    } finally {
      setButtonLoadingSaving(false);
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    if (
      !supervisorNameWeighIn ||
      !supervisorNameWeighOut ||
      !signatureWeighIn ||
      !signatureWeighOut ||
      !tar ||
      !gross ||
      !quantityNet ||
      !imageURL
    ) {
      toast.error("Please fill all required fields", {
        style: { padding: "20px" },
        duration: 5000,
      });
      setButtonLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      setButtonLoading(false);
      return;
    }

    let weighId;
    if (location.pathname.startsWith("/admin/weighing-operations/finish-weigh")) {
      weighId = saveAuthId;
    } else {
      weighId = id;
    }

    if (!weighId) {
      toast.error("Invalid weigh ID. Please try again.", {
        style: { padding: "20px" },
        duration: 3000,
      });
      setButtonLoadingSaving(false);
      return;
    }

    const body = {
      signInSupervisor: supervisorNameWeighIn,
      signOutSupervisor: supervisorNameWeighOut,
      signIn: signatureWeighIn,
      signOut: signatureWeighOut,
      tar: parseFloat(tar),
      gross: parseFloat(gross),
      image: imageURL,
    };

    try {
      const endpoint = `/customer/create-weigh/${weighId}`;
      await axios.post(`${root}${endpoint}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("New Weigh Successful", {
        style: { padding: "20px" },
      });
      setButtonLoading(false);
      resetForm();
      navigate("/admin/raise-ticket/authority-to-weigh");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An error occurred",
        {
          style: { padding: "20px" },
          duration: 2500,
        }
      );
      setButtonLoading(false);
    }
  };

  const handleSignatureWeighInSave = (dataUrl) => {
    setSignatureWeighIn(dataUrl);
    setCanvasVisibleWeighIn(false);
  };

  const handleSignatureWeighOutSave = (dataUrl) => {
    setSignatureWeighOut(dataUrl);
    setCanvasVisibleWeighOut(false);
  };

  const handleWebcamError = (error) => {
    console.error("Webcam error:", error);
    setWebcamError(error.message || "Failed to access webcam");
    toast.error("Webcam access denied or unavailable. Please check permissions.", {
      style: { padding: "20px" },
      duration: 3000,
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <Heading className="flex justify-between items-center py-5">
        <span>New Weigh</span>      
      </Heading>
      <Separator className="w-full mt-3" />

      <form onKeyDown={handleKeyDown}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex my-4">
          <div
            className={`relative w-[100px] h-[100px] border-2 border-dashed rounded-lg bg-gray-500/30 flex justify-center items-center cursor-pointer overflow-hidden ${
              isImageUploading ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              touchAction: "manipulation",
            }}
          >
            {/* Spinner overlay */}
            {isImageUploading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-30">
                <Spinner />
              </div>
            )}

           
            {/* Camera icon - centered */}
            {!imagePreview && !isImageUploading && (
              <button
                type="button"
                onClick={handleCameraClick}
                disabled={buttonLoading || buttonLoadingSaving || isImageUploading}
                className="absolute inset-0 flex justify-center items-center bg-transparent z-10"
              >
                <Flex direction="column" align="center" gap="1">
                  <CameraIcon className="w-6 h-6" />
                  <span className="text-[0.7rem]">Take Photo</span>
                </Flex>
              </button>
            )}
          </div>
           {/* Upload icon - top left */}
           <button
              type="button"
              title="Upload Image"
              onClick={handleFileSelectClick}
              disabled={buttonLoading || buttonLoadingSaving || isImageUploading}
              className="p-2 bg-gray-200 h-fit rounded-md flex items-center justify-start"
            >
              <UploadIcon className="w-5 h-5" />
          </button>
        </div>


        <CustomDialog
          isOpen={isCameraModalOpen}
          onClose={() => {
            setIsCameraModalOpen(false);
            setCapturedImage(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setWebcamError(null);
          }}
          title="Capture Photo"
        >
          {webcamError ? (
            <div className="text-red-500">
              {webcamError}. Please check webcam permissions or try another device.
            </div>
          ) : !capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                height="auto"
                videoConstraints={{ facingMode: "environment" }}
                onUserMediaError={handleWebcamError}
              />
              <Flex justify="center" gap="3" className="mt-4">
                <Button type="button" onClick={handleSnap}>
                  Snap
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCameraModalOpen(false);
                    setWebcamError(null);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <div className="relative w-full" style={{ height: "300px" }}>
                <Cropper
                  image={capturedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <Flex justify="center" gap="3" className="mt-4">
                <Button type="button" onClick={handleSaveCroppedImage}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCapturedImage(null)}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCameraModalOpen(false);
                    setCapturedImage(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setCroppedAreaPixels(null);
                    setWebcamError(null);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </>
          )}
        </CustomDialog>

        <Grid columns={{ initial: "1", md: "2" }} gap="4" className="mt-4">
          <div className="w-full">
            <Text>{isSupplier ? "Supplier Name" : "Customer Name"}</Text>
            <TextField.Root className="mt-2" disabled value={fullName} />
          </div>
          <div className="w-full">
            <Text>Vehicle No.</Text>
            <TextField.Root
              placeholder="Input Vehicle No."
              className="mt-2"
              value={vehicleNumber}
              disabled
            />
          </div>
          <div className="w-full">
            <Text>Quantity (Tar)</Text>
            <TextField.Root
              placeholder="Input Tar"
              type="number"
              className="mt-2"
              value={tar}
              onChange={(e) => {
                const value = e.target.value;
                setTar(value);
                const tarVal = parseFloat(value) || 0;
                const grossVal = parseFloat(gross) || 0;
                setQuantityNet((grossVal - tarVal).toFixed(4));
              }}
              disabled={isTarDisabled}
            />
          </div>
          <div className="w-full">
            <Text>Quantity (Gross)</Text>
            <TextField.Root
              placeholder="Input Gross"
              type="number"
              className="mt-2"
              value={gross}
              onChange={(e) => {
                const value = e.target.value;
                setGross(value);
                const grossVal = parseFloat(value) || 0;
                const tarVal = parseFloat(tar) || 0;
                setQuantityNet((grossVal - tarVal).toFixed(4));
              }}
              disabled={isGrossDisabled}
            />
          </div>
          <div className="w-full">
            <Text>Supervisor's Name (Weigh In)</Text>
            <TextField.Root
              placeholder="Input Supervisor Name"
              className="mt-2"
              value={supervisorNameWeighIn}
              onChange={(e) => setSupervisorNameWeighIn(e.target.value)}
              disabled={isSupervisorWeighInDisabled}
            />
          </div>
          <div className="w-full">
            <Text>Supervisor's Signature (Weigh In)</Text>
            <Flex
              className="w-full"
              onClick={() =>
                !signatureWeighIn && setCanvasVisibleWeighIn(!canvasVisibleWeighIn)
              }
            >
              <TextField.Root
                placeholder={signatureWeighIn ? "Signed" : "Sign Here"}
                value=""
                disabled
                className="w-[70%] mt-2"
              />
              <Button
                className="w-[30%] bg-theme mt-2"
                type="button"
                disabled={!!signatureWeighIn}
              >
                Sign
              </Button>
            </Flex>
            {canvasVisibleWeighIn && (
              <div className="mt-2">
                <SignatureCanvas onSave={handleSignatureWeighInSave} />
              </div>
            )}
          </div>
          <div className="w-full">
            <Text>Supervisor's Name (Weigh Out)</Text>
            <TextField.Root
              placeholder="Input Supervisor Name"
              className="mt-2"
              value={supervisorNameWeighOut}
              onChange={(e) => setSupervisorNameWeighOut(e.target.value)}
              disabled={isSupervisorWeighOutDisabled}
            />
          </div>
          <div className="w-full">
            <Text>Supervisor's Signature (Weigh Out)</Text>
            <Flex
              className="w-full"
              onClick={() =>
                !signatureWeighOut && setCanvasVisibleWeighOut(!canvasVisibleWeighOut)
              }
            >
              <TextField.Root
                placeholder={signatureWeighOut ? "Signed" : "Sign Here"}
                value=""
                disabled
                className="w-[70%] mt-2"
              />
              <Button
                className="w-[30%] bg-theme mt-2"
                type="button"
                disabled={!!signatureWeighOut}
              >
                Sign
              </Button>
            </Flex>
            {canvasVisibleWeighOut && (
              <div className="mt-2">
                <SignatureCanvas onSave={handleSignatureWeighOutSave} />
              </div>
            )}
          </div>
          <div className="w-full">
            <Text>Quantity (Net)</Text>
            <TextField.Root
              placeholder="Show Net"
              type="number"
              className="mt-2"
              value={quantityNet}
              disabled
            />
          </div>
          <div className="w-full">
            <Text>Initial Quantity Ordered</Text>
            <TextField.Root
              placeholder="Input Initial Quantity"
              className="mt-2"
              value={formatMoney(initialQuantity)}
              disabled
            />
          </div>
          <div className="w-full">
            <Text>Extra</Text>
            <TextField.Root
              placeholder="Show Extra"
              type="number"
              className="mt-2"
              value={
                quantityNet
                  ? (parseFloat(quantityNet) - initialQuantity).toFixed(4)
                  : ""
              }
              disabled
            />
          </div>
        </Grid>

        <Flex justify="end" gap="3" className="mt-4">
          <Button
            size="3"
            className="!bg-theme cursor-pointer"
            type="button"
            onClick={handleSave}
            disabled={buttonLoadingSaving || buttonLoading}
          >
            {buttonLoadingSaving ? <Spinner /> : "Save"}
          </Button>
          <Button
            size="3"
            className="!bg-theme cursor-pointer"
            type="button"
            onClick={handleFinish}
            disabled={buttonLoading || buttonLoadingSaving}
          >
            {buttonLoading ? <Spinner /> : "Finish"}
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default NewWeigh;