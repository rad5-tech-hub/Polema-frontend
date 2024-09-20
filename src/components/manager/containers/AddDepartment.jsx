import { Button, Flex, Select, Heading, TextField } from "@radix-ui/themes";
import { BookmarkIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import UpdateURL from "./ChangeRoute";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([
    { category: "Product for Sale" },
    { category: "Product to be bought" },
  ]);

  const [productCategoryPairs, setProductCategoryPairs] = useState([
    { productValue: "", categoryValue: "" }, // Initial pair
  ]);

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${root}/admin/get-products`);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductChange = (index, value) => {
    const newPairs = [...productCategoryPairs];
    newPairs[index].productValue = value;
    setProductCategoryPairs(newPairs);
  };

  const handleCategoryChange = (index, value) => {
    const newPairs = [...productCategoryPairs];
    newPairs[index].categoryValue = value;
    setProductCategoryPairs(newPairs);
  };

  const addNewProductCategoryPair = () => {
    setProductCategoryPairs([
      ...productCategoryPairs,
      { productValue: "", categoryValue: "" },
    ]);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    // Construct the final object
    const departmentData = {
      name: departmentName,
      product: productCategoryPairs.map((pair) => ({
        assignedProduct: pair.productValue,
        productCategory: pair.categoryValue,
      })),
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
      toast.success(response.data.message);
    } catch (error) {
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
      <UpdateURL url={"/add-department"} />
      <Heading className="py-4">Create Department</Heading>

      <form action="" onSubmit={handleSubmit}>
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
            onChange={(e) => setDepartmentName(e.target.value)}
          ></TextField.Root>
        </div>

        {/* Dynamic input boxes for products and categories */}
        {productCategoryPairs.map((pair, index) => (
          <Flex key={index} gap={"4"} className="mt-4">
            <div className="w-full">
              <label className="text-[15px]  font-medium leading-[35px]">
                Choose Product
              </label>
              <Select.Root
                value={pair.productValue}
                onValueChange={(value) => handleProductChange(index, value)}
              >
                <Select.Trigger className="w-full" placeholder="Select Product">
                  <Flex as="span" align="center" gap="2">
                    <FontAwesomeIcon icon={faBoxArchive} />
                    {pair.productValue}
                  </Flex>
                </Select.Trigger>
                <Select.Content position="popper">
                  {products.map((product) => (
                    <Select.Item key={product.id} value={product.name}>
                      {product.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <div className="w-full">
              <label className="text-[15px]  font-medium leading-[35px]">
                Select Category
              </label>
              <Select.Root
                value={pair.categoryValue}
                onValueChange={(value) => handleCategoryChange(index, value)}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select Category"
                >
                  <Flex as="span" align="center" gap="2">
                    <BookmarkIcon />
                    {pair.categoryValue}
                  </Flex>
                </Select.Trigger>
                <Select.Content position="popper">
                  {category.map((cat, idx) => (
                    <Select.Item key={idx} value={cat.category}>
                      {cat.category}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </Flex>
        ))}

        <Button
          type="button"
          color="green"
          className="mt-3"
          onClick={addNewProductCategoryPair}
        >
          <PlusIcon />
          Add Product
        </Button>

        {/* Submit button */}
        <Flex className="mt-4" justify={"end"}>
          <Button size={"3"}>Create Department</Button>
        </Flex>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default AddDepartment;
