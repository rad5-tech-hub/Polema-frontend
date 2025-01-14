import React, { useRef, useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

import {
  Heading,
  Separator,
  Select,
  Flex,
  Grid,
  TextField,
  Text,
  Button,
  Spinner,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
const cloudinaryRoot = import.meta.env.VITE_CLOUD_ROOT;

const CreateDepartmentStore = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);

  const [isProductActive, setIsProductActive] = useState(true);

  // State management for form details
  const [threshHoldVal, setThresholdVal] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dept, setDept] = useState([]);
  const [deptDisabled, setDeptDisabled] = useState(true);
  const [productDisabled, setProductDiabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [selectedUnit, setSelcetedUnit] = useState("");

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
      console.log("Image uploaded to Cloudinary:", result.data);
      setImage(result.data.imageUrl);
      return result.data.imageUrl; // Return the image URL from Cloudinary
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // Reset the uploading status
    }
  };

  // Function to handle the file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for previewing the selected image
      const imageUrl = URL.createObjectURL(file);

      // Upload the image to Cloudinary
      const cloudinaryImageUrl = await uploadImageToCloudinary(file);
    }
  };

  // Function to fetch raw materials
  const fetchRawMaterials = async (id) => {
    setProducts([]);
    setProductDiabled(true);
    let retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/${
          isProductActive ? `get-dept-product/${id}` : `get-dept-raw/${id}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setProducts(response.data.products);
      setProductDiabled(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch department
  const fetchDept = async () => {
    let retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDept(response.data.departments);
      setDeptDisabled(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    setButtonLoading(true);

    const resetForm = () => {
      setThresholdVal(""), setSelcetedUnit("");
      setImage(null);
    };

    const body = {
      thresholdValue: threshHoldVal,
      productId: productId,
      departmentId: deptId,
      ...(image && { image }),
      unit: selectedUnit,
    };

    try {
      const response = await axios.post(
        `${root}/dept/create-dept-store`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setButtonLoading(false);
      toast.success("Created successfully", {
        style: {
          padding: "25px",
        },
        duration: 5000,
      });
      resetForm();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const getMatchingProductNameById = (id) => {
    const product = products.find((product) => product.id === id);
    console.log(product);

    if (product) {
      setSelcetedUnit(product.price[0].unit);
    } else {
      setSelcetedUnit("");
    }
  };

  React.useEffect(() => {
    fetchDept();
  }, []);

  return (
    <>
      <Flex justify={"between"} align={"center"}>
        <Heading>Add New</Heading>
        <Select.Root
          defaultValue="product"
          onValueChange={(value) => {
            value === "product"
              ? setIsProductActive(true)
              : setIsProductActive(false);
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Item value="product">Product </Select.Item>
              <Select.Item value="raw materials">Raw Materials</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="my-3 w-full" />
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
            {isUploading && <p className="text-xs text-center">Uploading...</p>}
          </div>
        </div>
        <div className="cursor-pointer" onClick={handleBrowseClick}>
          <p className="font-amsterdam underline">Browse Image</p>
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

      {/* form details */}

      <form action="" onSubmit={handleSubmit}>
        <Grid columns={"2"} rows={"2"} className="mt-4" gap={"3"}>
          <div className="w-full">
            <Text>
              Select Department <span className="text-red-500">*</span>
            </Text>
            <Select.Root
              onValueChange={(value) => {
                setProducts([]);
                setDeptId(value);
                fetchRawMaterials(value);
              }}
            >
              <Select.Trigger
                disabled={deptDisabled}
                className="w-full mt-2"
                placeholder="Select Departmemt"
              />
              <Select.Content>
                {dept.map((item) => {
                  return <Select.Item value={item.id}>{item.name}</Select.Item>;
                })}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text>
              {isProductActive ? "Product" : "Raw Material"} Name
              <span className="text-red-500">*</span>
            </Text>
            <Select.Root
              disabled={products.length === 0}
              onValueChange={(value) => {
                setProductId(value);
                getMatchingProductNameById(value);
              }}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder={"Select a Department First"}
                disabled={productDisabled}
              />
              <Select.Content>
                {products.map((item) => {
                  return <Select.Item value={item.id}>{item.name}</Select.Item>;
                })}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text>
              {" "}
              Unit <span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              className="mt-2 w-full"
              value={selectedUnit}
              placeholder="Enter product unit"
              disabled
            />
          </div>
          <div className="w-full">
            <Text>
              {" "}
              Threshold Value <span className="text-red-500">*</span>{" "}
            </Text>
            <TextField.Root
              value={threshHoldVal}
              className="mt-2 w-full"
              placeholder="Enter threshold value"
              onChange={(e) => setThresholdVal(e.target.value)}
            />
          </div>
        </Grid>

        <Flex className="mt-4" justify={"end"}>
          <Button className="!bg-theme" size={"3"}>
            {buttonLoading ? <Spinner /> : "Add"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default CreateDepartmentStore;
