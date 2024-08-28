import React, { useState } from "react";
import axios from "axios";
import AllAdmins from "./AllAdmins";
import {
  Card,
  Select,
  Button,
  Heading,
  Separator,
  CheckboxGroup,
  TextField,
  Flex,
} from "@radix-ui/themes";
import { Phone } from "../../icons";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

const AddProduct = () => {
  const [value, setValue] = useState("admin");
  const [selectedItems, setSelectedItems] = useState([]);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const data = {
    admin: { label: "Admin", icon: <PersonIcon /> },
    admin1: { label: "Admin 1", icon: <PersonIcon /> },
    admin2: { label: "Admin 2", icon: <PersonIcon /> },
    admin3: { label: "Admin 3", icon: <PersonIcon /> },
    accountant: { label: "Accountant", icon: <PersonIcon /> },
    keeperGeneral: { label: "Storekeeper (General)", icon: <PersonIcon /> },
    keeperPharmacy: { label: "Storekeeper (Pharmacy)", icon: <PersonIcon /> },
  };

  const handleValueChange = (value) => {
    setValue(value);
  };

  const handleCheckboxChange = (selectedValue) => {
    if (selectedValue === "others") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setSelectedItems((prevItems) => {
        if (prevItems.includes(selectedValue)) {
          return prevItems.filter((item) => item !== selectedValue);
        } else {
          return [...prevItems, selectedValue];
        }
      });
    }
  };

  const handleOtherBlur = () => {
    if (otherValue.trim() !== "") {
      setSelectedItems((prevItems) => [...prevItems, otherValue]);
    }
    setOtherValue("");
    setShowOtherInput(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        uploadImageToCloudinary(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    await axios
      .post("https://api.cloudinary.com/v1_1/da4yjuf39/image/upload", formData)
      .then((result) => {
        setImageURL(result.data.secure_url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    console.log(selectedItems);
    const submitobject = {
      fullname: e.target[1].value,
      email: e.target[2].value,
      phoneNumber: e.target[3].value,
      department: "",
      profileURL: "",
      products: selectedItems,
      role: e.target[5].value,
      password: e.target[8].value,
    };
    console.log(submitobject);

    // Handle form submission, including the imageURL which is the Cloudinary URL

    // Add your form submission logic here
  };

  return (
    <div>
      <div className="flex justify-end my-4">
        <Button>
          <a href="/dashboard/md?action=view-products">View Products</a>
        </Button>
      </div>
      <Card className="w-full">
        <Heading className="text-left p-4">Add Product</Heading>
        <Separator className="w-full" />
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-between gap-8">
            <div className="left w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]  "
                  htmlFor="fullname"
                >
                  Product Name
                </label>
                <TextField.Root
                  placeholder="Enter Product name"
                  className=""
                  type="text"
                  id="fullname"
                  size={"3"}
                ></TextField.Root>
              </div>

              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]  "
                  htmlFor="price"
                >
                  Base Price
                </label>
                <TextField.Root
                  placeholder="Enter Base Price"
                  className=""
                  id="price"
                  type="number"
                  size={"3"}
                ></TextField.Root>
              </div>
            </div>

            <div className="right w-[50%]">
              <div className="input-field mt-3">
                <label
                  className="text-[15px]  font-medium leading-[35px]  "
                  htmlFor="number"
                >
                  Product Unit
                </label>
                <TextField.Root
                  placeholder="Specify Unit (kg,litres,bags ,others)"
                  className=""
                  id="number"
                  type="number"
                  size={"3"}
                ></TextField.Root>
              </div>
              <Flex justify={"end"} align={"end"} width={"100%"}>
                <Button className="mt-4 " size={3} type="submit">
                  Create
                </Button>
              </Flex>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
