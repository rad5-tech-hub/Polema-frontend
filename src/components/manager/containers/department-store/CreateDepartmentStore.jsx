import React, { useRef, useState } from "react";

import { Heading, Separator, Select, Flex } from "@radix-ui/themes";
import axios from "axios";

const CreateDepartmentStore = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);

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
  return (
    <>
      <Flex justify={"between"} align={"center"}>
        <Heading>Add New</Heading>
        <Select.Root defaultValue="apple">
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              <Select.Item value="orange">Orange</Select.Item>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="grape" disabled>
                Grape
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>Vegetables</Select.Label>
              <Select.Item value="carrot">Carrot</Select.Item>
              <Select.Item value="potato">Potato</Select.Item>
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
    </>
  );
};

export default CreateDepartmentStore;
