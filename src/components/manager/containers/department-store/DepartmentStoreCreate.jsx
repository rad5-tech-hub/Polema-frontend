import {
  Heading,
  Spinner,
  Separator,
  Select,
  Button,
  Text,
  Flex,
  TextField,
} from "@radix-ui/themes";
import React, { useState, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const DepartmentStoreCreate = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const fileInputRef = useRef(null);
  const [thresholdValue, setThresholdValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [quantity, setQuantity] = useState("");

  const [matchedProducts, setMatchedProducts] = useState([]);

  // State for management between products and raw
  const [productIsActive, setProductIsActive] = useState(true);

  // State management for product Id and department id
  const [productId, setProductId] = useState("");
  const [deptId, setDeptId] = useState("");

  // Function to upload images to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!image) return; // Only upload if an image is selected
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");

    try {
      const result = await axios.post(
        "https://api.cloudinary.com/v1_1/da4yjuf39/image/upload",
        formData
      );
      setUploadedImage(result.data.secure_url);
      return result.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle the click on the "Browse Image" text
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Handle file change and set the preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to fetch departments
  const fetchDept = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch departments.");
    }
  };

  // Function to fetch products
  const fetchProductsInADept = async (id) => {
    setMatchedProducts([]);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/get-dept-${productIsActive ? "product" : "raw"}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      console.log(response);
      setMatchedProducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error("No products/raw-materials found.", {
        duration: 5000,
      });
      setMatchedProducts([]);
    }
  };

  // Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToCloudinary();
      }

      const body = {
        productId: productId,
        departmentId: deptId,
        unit: selectedUnit,
        quantity: quantity,
        thresholdValue: thresholdValue,
        ...(imageUrl && { image: imageUrl }),
      };

      // Post the data to your backend
      const response = await axios.post(
        `${root}/dept/create-dept-store`,
        body,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      toast.success("Department store created successfully!", {
        style: {
          padding: "30px",
        },
        duration: 6500,
      });
      // Clear the form after a successful response
      setImage(null);
      setImagePreview(null);
      setUploadedImage("");
      setThresholdValue("");
      setSelectedUnit("");
      setQuantity("");
      setProductId("");
      setDeptId("");
      setMatchedProducts([]);
    } catch (error) {
      toast.error(error.response.data.message, {
        style: {
          padding: "30px",
        },
        duration: 4500,
      });
    } finally {
      setButtonLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDept();
  }, []);

  return (
    <>
      <Flex justify={"between"}>
        <Heading>Create Store</Heading>
        <Select.Root
          defaultValue="Products"
          onValueChange={(value) => {
            value === "Raw Materials"
              ? setProductIsActive(false)
              : setProductIsActive(true);
          }}
        >
          <Select.Trigger placeholder="Type" />
          <Select.Content>
            <Select.Group>
              <Select.Item value="Products">Products</Select.Item>
              <Select.Item value="Raw Materials">Raw Materials</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="my-4 w-full" />
      <form onSubmit={handleSubmit}>
        <Flex align={"center"} gap={"3"} className="mt-4">
          <div
            className={`w-[90px] h-[90px] rounded-lg cursor-pointer bg-[#f4f4f4] border-dashed border-2 flex items-center justify-center`}
            onClick={handleBrowseClick}
            style={{
              backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!imagePreview && (
              <p className="text-xs text-center">Upload Image</p>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </Flex>

        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>Select Department</Text>
            <Select.Root
              onValueChange={(value) => {
                const department = departments.find(
                  (item) => item.name === value
                );
                console.log(department);
                // setMatchedProducts(department.products);
                setDeptId(department.id);
                fetchProductsInADept(department.id);
              }}
            >
              <Select.Trigger
                placeholder={"Select Department"}
                className="w-full mt-2"
              />
              <Select.Content>
                {departments.map((item, index) => (
                  <Select.Item value={item.name} key={index}>
                    {item.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text>Select {productIsActive ? "Product" : "Raw Material"}</Text>
            <Select.Root
              disabled={matchedProducts.length === 0}
              onValueChange={(value) => {
                const product = products.find((item) => item.name === value);
                setSelectedUnit(product ? product.price[0].unit : "");
                setProductId(product.id);
              }}
            >
              <Select.Trigger
                placeholder={`Select ${
                  productIsActive ? "Product" : "Raw Materials"
                }`}
                className="w-full mt-2"
              />
              <Select.Content>
                {matchedProducts.map((item, index) => (
                  <Select.Item value={item.name} key={index}>
                    {item.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>

        <Flex className="mt-6" gap={"5"}>
          <div className="w-full">
            <Text>Set Unit</Text>
            <TextField.Root
              disabled={true}
              className="w-full !cursor-not-allowed mt-2"
              placeholder="Unit"
              value={selectedUnit}
            />
          </div>
          <div className="w-full">
            <Text>Set Quantity</Text>
            <TextField.Root
              required={true}
              className="w-full mt-2"
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </Flex>

        <div className="w-[50%] mt-4">
          <Text>Threshold Value</Text>
          <TextField.Root
            className="w-full mt-2"
            placeholder="Set Threshold Value"
            required={true}
            onChange={(e) => setThresholdValue(e.target.value)}
            type="number"
          />
        </div>

        <Flex justify={"end"} className="mt-4">
          <Button
            className="!bg-theme cursor-pointer disabled:cursor-not-allowed"
            disabled={buttonLoading}
            size={"3"}
          >
            {buttonLoading ? <Spinner /> : "Submit"}
          </Button>
        </Flex>
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default DepartmentStoreCreate;
