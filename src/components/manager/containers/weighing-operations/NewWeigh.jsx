import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  Heading,
  Separator,
  Grid,
  TextField,
  Text,
  Flex,
  Button,
  Spinner,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import { initial } from "lodash";

const root = import.meta.env.VITE_ROOT;

const NewWeigh = () => {
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [customerId, setCustomerID] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [tar, setTar] = useState("");
  const [gross, setGross] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [quantityNet, setQuantityNet] = useState("");
  const [intialQuantity, setInitialQuantity] = useState(0);
  const [extraNet, setExtraNet] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await axios.get(`${root}/customer/get-customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(data.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    try {
      const request = await axios.post(`${root}/dept/upload`, formData);
      setImageURL(request.data.imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      // alert("Failed to upload image.");
    }
  };

  // Function to handle form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);

    const body = {
      tar,
      gross,
      image: imageURL,
    };
    if (imageURL.length === 0) {
      toast.error("Select an Image", {
        style: {
          padding: "20px",
        },
        duration: 5000,
      });
      setButtonLoading(false);
      return;
    }

    try {
      const request = await axios.post(
        `${root}/customer/create-weigh/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("New Weigh Successful");
      setButtonLoading(false);
      setFullName("");
      setQuantityNet("");
      setInitialQuantity("");
      setVehicleNumber("");
      setExtraNet("");
      setTar("");
      setGross("");
      setImageURL("");
    } catch (error) {
      console.error("Submission failed:", error);
      setButtonLoading(false);
    }
  };

  // Function to fetch individual weigh
  const fetchIndividualWeigh = async () => {
    const token = localStorage.getItem("token");

    try {
      const request = await axios.get(`${root}/admin/view-auth-weigh/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialQuantity(request.data.ticket.transactions.quantity);
      setFullName(
        `${request.data.ticket.transactions.corder.firstname} ${request.data.ticket.transactions.corder.lastname}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchIndividualWeigh();
  }, []);

  return (
    <>
      <Heading>New Weigh</Heading>
      <Separator className="w-full mt-3" />

      <form action="" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="flex items-center gap-4 my-4">
          <div
            className="relative w-[100px] h-[100px] border-2 border-dashed rounded-lg bg-gray-500/30 flex justify-center items-center cursor-pointer"
            style={{
              backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            {!imagePreview && (
              <span className="text-[.7rem]">Select Image</span>
            )}
          </div>
        </div>

        <Grid columns={"2"} gap={"4"} className="mt-4">
          <div className="w-full">
            <Text>Customer Name</Text>
            <TextField.Root className="mt-2" disabled value={fullName} />
          </div>
          <div className="w-full">
            <Text>Vehicle No.</Text>
            <TextField.Root
              placeholder="Input Vehicle No."
              className="mt-2"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Quantity (Tar)</Text>
            <TextField.Root
              placeholder="Input Tar"
              type="number"
              className="mt-2"
              value={tar}
              onChange={(e) => setTar(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>Quantity (Gross)</Text>
            <TextField.Root
              placeholder="Input Gross"
              className="mt-2"
              value={gross}
              type="number"
              onChange={(e) => setGross(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuantityNet(gross - tar);
                }
              }}
            />
          </div>
          <div className="w-full">
            <Text>Quantity (Net)</Text>
            <TextField.Root
              placeholder="Show Net"
              value={quantityNet}
              type="number"
              className="mt-2"
              disabled
            />
          </div>
          <div className="w-full">
            <Text>Initial Quantity Ordered</Text>
            <TextField.Root
              placeholder="Input Initial Quantity"
              className="mt-2"
              value={intialQuantity}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setExtraNet(quantityNet - intialQuantity);
                }
              }}
            />
          </div>
          <div className="w-full">
            <Text>Extra (Net)</Text>
            <TextField.Root
              placeholder="Show Net"
              className="mt-2"
              disabled
              value={quantityNet - intialQuantity}
            />
          </div>
        </Grid>

        <Flex justify={"end"}>
          <Button size={"3"} className="!bg-theme cursor-pointer" type="submit">
            {buttonLoading ? <Spinner /> : "Add"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default NewWeigh;
