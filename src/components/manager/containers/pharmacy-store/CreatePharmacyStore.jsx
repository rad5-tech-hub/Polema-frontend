import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  TextField,
  Separator,
  Select,
  Flex,
  Text,
  Button,
  Spinner,
} from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const CreatePharmacyStore = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

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
      const result = await axios.post(
        "https://api.cloudinary.com/v1_1/da4yjuf39/image/upload",
        formData
      );
      console.log("Image uploaded to Cloudinary:", result.data);
      return result.data.secure_url; // Return the image URL from Cloudinary
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
      setImage(imageUrl);

      // Upload the image to Cloudinary
      const cloudinaryImageUrl = await uploadImageToCloudinary(file);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-products`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      response.data.length === 0
        ? setProducts([])
        : setProducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  });

  return (
    <div className="p-2">
      <Flex justify={"between"}>
        <Heading>Add New</Heading>
        <Select.Root defaultValue="products">
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Item value="raw-materials">Raw Materials</Select.Item>
              <Select.Item value="products">Products</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="w-full my-3" />
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
      <Flex className="mt-6" gap={"5"}>
        <Select.Root>
          <div className="w-full">
            <Text className="mb-4">Product</Text>
            <Select.Root
              value={selectedProductId}
              onValueChange={setSelectedProductId} // Update selected product ID
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Product"
              />
              <Select.Content position="popper">
                {products.map((product) => (
                  <Select.Item key={product.id} value={product.id}>
                    {product.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Select.Root>
        <Select.Root>
          <div className="w-full">
            <Text className="mb-4">Product ID</Text>
            <TextField.Root
              className="mt-2"
              placeholder="Enter Product ID"
            ></TextField.Root>
          </div>
        </Select.Root>
      </Flex>
      <Flex className="mt-4" gap={"5"}>
        <div className="w-full">
          <Text className="mb-4">Category </Text>
          <TextField.Root
            className="mt-2 "
            placeholder="Enter product category"
          ></TextField.Root>
        </div>

        <div className="w-full">
          <Text className="mb-4">Unit</Text>
          <TextField.Root
            className="mt-2"
            placeholder="Enter Product unit"
          ></TextField.Root>
        </div>
      </Flex>
      <Flex className="mt-4" gap={"5"} width={"50%"}>
        <div className="w-full">
          <Text className="mb-4">Threshold Value </Text>
          <TextField.Root
            className="mt-2 "
            placeholder="Enter threshold value"
          ></TextField.Root>
        </div>
      </Flex>

      <Flex justify={"end"} className="mt-6">
        <Button size={"3"}>{buttonLoading ? <Spinner /> : "Add"}</Button>
      </Flex>
    </div>
  );
};

export default CreatePharmacyStore;
