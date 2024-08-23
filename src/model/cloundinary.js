import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import cloudinary from "cloudinary";
const app = cloudinary.v2;

app.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// app.uploader
//   .upload("https://chuxdennis-shorty.vercel.app/assets/link-mAwprXNS.png")
//   .then((result) => {
//     console.log(result);
//   });

// app.uploader.upload_stream()

const uploadImage = () => {
  const formData = new FormData();
};
