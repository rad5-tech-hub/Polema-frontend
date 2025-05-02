import React, { useEffect, useRef, useState } from "react";
import { Select as AntSelect,Modal as AntModal,Button as AntButton } from "antd";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import {
  Heading,
  TextField,
  Separator,
  Select,
  Grid,
  Flex,
  Text,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const CreatePharmacyStore = () => {
  const showToast = useToast();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(" ");
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [modalSelected, setModalSelected] = useState(false);
  

  // State management for Pharmacy ID
  const [pharmId, setPharmId] = React.useState("");

  // State management to check if pharm Details request is complete
  const [completeRequest, setCompleteRequest] = React.useState(false);

  // State management to toggle between raw materials and products;
  const [rawMaterialsActive, setRawMaterialsActive] = useState(false);

  // State management for input boxes
  const [productID, setProductID] = useState("");
  const [thresholdValue, setThresholdVal] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");

  // Function to handle the click on the "Browse Image" text
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to upload images to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const result = await axios.post(`${root}/dept/upload`, formData);
      setUploadedImage(result.data.imageUrl);
      return result.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle the file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      await uploadImageToCloudinary(file);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/${
          rawMaterialsActive
            ? `get-dept-raw/${pharmId}`
            : `get-dept-product/${pharmId}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setProducts(response.data.products);
    } catch (error) {
      // toast.error(error.message);
      console.log(error);

      if (error.status === 404) {
        toast.error("No products in pharmacy", {
          style: {
            padding: "20px",
          },
          duration: 5500,
        });
      }
    }
  };

  // Function to add item to the pharm store
  const addItem = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    toast.loading("Adding item....", { duration: 1500 });

    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setButtonLoading(true);

    // Build the body conditionally
    const body = {
      productId: selectedProductId,
      unit,
      thresholdValue,
      ...(productID.trim() && { productTag: productID }),
      ...(category.trim() && { category }),
      ...(uploadedImage.trim() && { image: uploadedImage }),
    };

    try {
      const response = await axios.post(
        `${root}/dept/create-pharmstore`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      //localhost:5173/src/components/manager/containers/products/EditProducts.jsx?t=1738027508364
      http: setButtonLoading(false);
      showToast({
        message:response.data.message,
        type: "success",
        
      })
      

      // Reset form fields
      setProductID("");
      setCategory("");
      setUnit("");
      setSelectedProductId("");
      setThresholdVal("");
      setUploadedImage("");
      setImage(null);
    } catch (error) {
      setButtonLoading(false);
      toast.error(error.message);
    }
  };

  // Function to get pharmacy id used in makinga another request laterOn
  const fetchPharmDetails = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-pharm-dept`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setPharmId(response.data.department[0].id);
      setCompleteRequest(true);
    } catch (error) {
      console.log(error);
    }
  };


  // Initial Dialog containing information
  const InitialDialog = () => {
    return (
      <AntModal
        open={modalOpen}
        footer={null}
        centered
        closable={false}
        onClose={() => {
          setModalOpen(false);
          // console.log("Closing Modal");
        }}
      >
        <h1 className="font-space text-lg font-bold">
          What do you want to add?
        </h1>

        <div className="flex w-full justify-between mt-3">
          <AntButton
            className="bg-red-500 text-white"
            onClick={() => {
              setTimeout(setModalSelected(true), 2000);
              setRawMaterialsActive(false);
              setModalOpen(false);
            }}
          >
            Product
          </AntButton>
          <AntButton
            className="bg-blue-500 text-white"
            onClick={() => {
              setTimeout(setModalSelected(true), 2000);
              setRawMaterialsActive(true);
              setModalOpen(false);
            }}
          >
            Raw Material
          </AntButton>
        </div>
      </AntModal>
    );
  }

  useEffect(() => {
    fetchPharmDetails();
  }, [rawMaterialsActive]);

  useEffect(() => {
    if (pharmId) {
      fetchProducts();
    }
  }, [pharmId, rawMaterialsActive]);

  return (
    <>
      <InitialDialog/>
      <div className="p-2">
        <Flex justify={"between"}>
          <Heading>Add New</Heading>
          {modalSelected && (
            <Select.Root
              defaultValue={rawMaterialsActive ? "raw-materials" : "products"}
              onValueChange={(value) => {
                if (value === "raw-materials") {
                  setRawMaterialsActive(true);
                } else {
                  setRawMaterialsActive(false);
                }
              }}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Item value="raw-materials">Raw Materials</Select.Item>
                  <Select.Item value="products">Products</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          )}
        </Flex>

        <Separator className="w-full my-3" />

        <form onSubmit={addItem}>
          <Flex align={"center"} gap={"4"}>
            <div className="image-container">
              <div
                className={`w-[90px] h-[90px] rounded-lg cursor-pointer bg-[#f4f4f4] border-dashed border-[2px] ${
                  image ? "" : "border-[#9D9D9D]"
                }`}
                onClick={handleBrowseClick}
                style={{
                  backgroundImage: image ? `url(${image})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {isUploading && (
                  <p className="text-xs text-center">Uploading...</p>
                )}
              </div>
            </div>
            <div className="cursor-pointer" onClick={handleBrowseClick}>
              <p className="font-amsterdam underline">Select Image</p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </Flex>

          <Grid columns={"2"} gap={"4"} className="mt-6">
            <div className="w-full">
              <Text className="">
                {rawMaterialsActive ? "Raw Material" : " Product"}
              </Text>

              <AntSelect
                className="mt-2"
                placeholder="Select Products"
                style={{ width: "100%" }}
                optionFilterProp="children"
                {...(selectedProductId.length > 0 && {
                  value: selectedProductId,
                })}
                onChange={(value) => {
                  const product = products.find((item)=> item.id === value);
                  setUnit(product.price[0].unit)
                  
                  setSelectedProductId(value);
                }}
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </AntSelect>
            </div>

            {!rawMaterialsActive && (
              <>
                <div className="w-full">
                  <Text className="mb-4">
                    Product ID <span className="text-red-500">*</span>
                  </Text>
                  <TextField.Root
                    value={productID}
                    onChange={(e) => setProductID(e.target.value)}
                    placeholder="Enter Product ID"
                    required
                  />
                </div>
                <div className="w-full">
                  <Text className="mb-4">
                    Category<span className="text-red-500">*</span>
                  </Text>
                  <TextField.Root
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter product category"
                    required
                    // className="mt-4"
                  />
                </div>
              </>
            )}

            <div className="w-full">
              <Text className="mb-4">
                Unit
              </Text>
              <TextField.Root
              disabled
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Enter Product unit"
                required
              />
            </div>
            <div className="w-full">
              <Text className="mb-4">
                Threshold Value<span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                value={thresholdValue}
                onChange={(e) => setThresholdVal(e.target.value)}
                placeholder="Enter threshold value"
                required
              />
            </div>
          </Grid>

          <Flex justify={"end"} className="mt-6">
            <Button size={"3"} disabled={buttonLoading} className="!bg-theme">
              {buttonLoading ? <LoaderIcon /> : "Add"}
            </Button>
          </Flex>
        </form>
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default CreatePharmacyStore;
