import React, { useState } from "react";
import axios from "axios";

const Cloudinary = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const uploadImage = () => {
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "ml_default");
    axios
      .post("https://api.cloudinary.com/v1_1/da4yjuf39/image/upload", formData)
      .then((result) => {
        console.log(result);
      });
  };
  return (
    <div>
      <input
        type="file"
        name=""
        onChange={(e) => {
          setSelectedImage(e.target.files[0]);
        }}
      />
      <button onClick={uploadImage}>Submit Image</button>
    </div>
  );
};

export default Cloudinary;
