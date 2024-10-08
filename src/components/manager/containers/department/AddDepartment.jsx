import {
  Button,
  Flex,
  Select,
  Heading,
  TextField,
  Card,
  Spinner,
  Separator,
} from "@radix-ui/themes";
import { BookmarkIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import UpdateURL from "../ChangeRoute";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");

  // State management for checking loading status
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([
    { category: "Product for Sale" },
    { category: "Product to be bought" },
  ]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    // Construct the final object
    const departmentData = {
      name: departmentName,
    };

    try {
      const response = await axios.post(
        `${root}/dept/create-department`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setLoading(false);
      setDepartmentName("");
      toast.success(response.data.message, {
        duration: 6000,
        style: {
          padding: "30px",
        },
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      {
        error.response.data.error
          ? toast.error(error.response.data.error)
          : toast.error(error.message);
      }
    }
  };
  return (
    <div>
      <Card>
        <Heading className="py-4">Create Department</Heading>
        <Separator className="w-full" />
        <form action="" onSubmit={handleSubmit} className="mt-4">
          {/* Input for department name */}
          <div>
            <label
              htmlFor="name"
              className="text-[15px]  font-medium leading-[35px]"
            >
              Department Name
            </label>
            <TextField.Root
              placeholder="Enter Department Name"
              className="mt-1 w-[50%] p-1"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            ></TextField.Root>
          </div>
          {/* Submit button */}
          <Flex className="mt-4" justify={"start"}>
            <Button size={"2"} disabled={loading}>
              {loading ? <Spinner /> : "Create Department"}
            </Button>
          </Flex>
        </form>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddDepartment;
