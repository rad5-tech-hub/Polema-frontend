import axios from "axios";
import { Select as AntSelect } from "antd";
import toast, { Toaster } from "react-hot-toast";
import SignatureCanvas from "../../../signature-pad/SignatureCanvas";
import React, { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Spinner,
  Flex,
  Select,
  Separator,
  TextField,
  Grid,
  Text,
} from "@radix-ui/themes";
import _ from "lodash";
import { Modal, Button as AntButton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const root = import.meta.env.VITE_ROOT;

const ManageDeptStore = () => {
  const [storeAction, setStoreAction] = useState("add");
  const [suppliers, setSuppliers] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [initialScreenOpen, setInitialScreenOpen] = useState(true);

  //State management for the form details
  const [itemId, setItemID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supplierId, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [quantityOut, setQuantityOut] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const [productActive, setProductActive] = useState(true);
  const [modalClicked,setModalClicked] = useState(false)

  //State management for the dialog box
  const [questionDialogOpen, setQuestionDialogOpen] = React.useState(true);

  // Function to fetch suppliers details
  const fetchSuppliers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred , try logging in again", {
        style: {
          padding: "30px",
        },
        duration: 5500,
      });
      return;
    }

    //Fetch Functionality below
    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data.customers);
    } catch (e) {
      console.log(e);
      toast.error(
        e.message || "An error occurred , check your details and try again."
      );
    }
  };

  // Function to fetch products/raw materials
  const fetchItems = async () => {
    setStoreItems([]);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred , try logging in again.", {
        style: {
          padding: "30px",
        },
        duration: 5500,
      });
      return;
    }

    // Fetch functionality here:
    //
    try {
      const response = await axios.get(
        `${root}/dept/${
          productActive ? "view-deptstore-prod" : "view-deptstore-raw"
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStoreItems(response.data.parsedStores || response.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  //Function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred , try logging in again");
      setLoading(false);
      return;
    }

    // Function to reset form
    const resetForm = () => {
      setItemID(null);
      setBatchNumber("");
      setQuantityOut("");
      setSupplierName("");
      setCanvasVisible(false);
    };

    if (typeof Number(quantityOut) !== "number") {
      toast.error("Quantity must be a number.", {
        style: {
          padding: "30px",
        },
        duration: 5500,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${root}/dept/${
          storeAction === "add" ? "add-quantity-dept" : "remove-quantity-dept"
        }`,
        {
          item: itemId,
          // batchNo: batchNumber,
          name: supplierName,
          quantity: quantityOut,
          signature: signatureImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      resetForm();
      toast.success(response.data.message, {
        style: {
          padding: "30px",
        },
        duration: 6000,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred, check your details and try again later"
      );
    }
  };

  // Initial Screen showing two buttons
  const InitialScreen = () => {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <div>
            <h1 className="font-bold font-space text-center">Do you want to</h1>
            <br />
            <Flex gap={"3"} align={"center"}>
              <Button
                className="!bg-transparent  !border-2 cursor-pointer"
                style={{
                  border: "2px solid #434343",
                  color: "#434343",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setStoreAction("add");
                  setInitialScreenOpen(false);
                }}
                size={"3"}
              >
                Add to Store
              </Button>
              or
              <Button
                className="bg-theme cursor-pointer"
                size={"3"}
                onClick={(e) => {
                  e.preventDefault();
                  setStoreAction("remove");
                  setInitialScreenOpen(false);
                }}
              >
                Remove from Store
              </Button>
            </Flex>
          </div>
        </div>
      </>
    );
  };

  // Question Componenet asking whether they want to add product or raw materials
  const QuestionComponent = () => {
    return (
      <>
        <Modal open={questionDialogOpen} footer={null} closable={false}>
          <h1 className="text-[1.5rem] font-space font-bold">
            What do you want ?
          </h1>
          <div className="mt-2 flex gap-2 justify-between">
            <AntButton
              color="red"
              size="large"
              className="bg-red-400 text-white cursor-pointer"
              onClick={() => {
                setProductActive(true);

                setQuestionDialogOpen(false);
                setModalClicked(true)
              }}
            >
              Product
            </AntButton>
            <AntButton
              onClick={() => {
                setProductActive(false);
                setQuestionDialogOpen(false)
                setModalClicked(true)

              }}
              size="large"
              className="bg-blue-400 text-white cursor-pointer"
            >
              Raw Material
            </AntButton>
          </div>
        </Modal>
      </>
    );
  };

  // Run functions when page is loaded
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Run function if the page loads and if the value of "productActive" changes
  useEffect(() => {
    fetchItems();
  }, [productActive]);

  return (
    <>
      {initialScreenOpen && <InitialScreen />}
      {initialScreenOpen === false && (
        <>
          <QuestionComponent />
          <Flex justify={"between"}>
            {/* <Heading>{_.upperFirst(storeAction)} Store</Heading> */}
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="cursor-pointer"
                onClick={() => {
                  setInitialScreenOpen(true);
                  setQuestionDialogOpen(true)
                }}
              />
              <Heading>
                {" "}
                {storeAction === "add"
                  ? "Add to Store"
                  : "Remove from Store"}{" "}
              </Heading>
            </div>
           {modalClicked &&  <Select.Root
              defaultValue={productActive ? "products" : "raw-materials"}
              onValueChange={(val) => {
                setProductActive(val === "products");
              }}
            >
              <Select.Trigger />
              <Select.Content position="popper">
                <Select.Group>
                  <Select.Item value="raw-materials">Raw Materials</Select.Item>
                  <Select.Item value="products">Products</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>}
          </Flex>
          <Separator className="my-4 w-full" />

          <form action="" onSubmit={handleSubmit}>
            <Grid columns={"2"} gap={"6"}>
              <div>
                <Text>Select Item</Text>
                <AntSelect
                  placeholder={
                    productActive ? "Select Product" : "Select Raw Material"
                  }
                  onChange={(val) => {
                    setItemID(val);
                  }}
                  value={itemId}
                  style={{ width: "100%" }}
                >
                  {storeItems.map((item) => {
                    return (
                      <AntSelect.Option value={item.id}>
                        {item.product.name}
                      </AntSelect.Option>
                    );
                  })}
                </AntSelect>
              </div>
              <div>
                <Text>
                  {storeAction === "add" ? "Supplier Name " : "Customer Name"}
                </Text>
                <TextField.Root
                  placeholder={
                    storeAction === "add"
                      ? "Enter Supplier Name"
                      : "Enter Customer Name"
                  }
                  value={supplierName}
                  onChange={(e) => {
                    setSupplierName(e.target.value);
                  }}
                ></TextField.Root>
              </div>
              <div>
                <Text>
                  {storeAction === "add"
                    ? "Quantity Added "
                    : "Quantity Removed"}
                </Text>
                <TextField.Root
                  placeholder={
                    storeAction === "add"
                      ? "Enter Quantity Added"
                      : "Enter Quantity Removed"
                  }
                  value={quantityOut}
                  onChange={(e) => {
                    setQuantityOut(e.target.value);
                  }}
                ></TextField.Root>
              </div>
              <div>
                <Text>Siganture</Text>
                <Flex
                  className="w-full"
                  onClick={() => {
                    setCanvasVisible(!canvasVisible);
                  }}
                >
                  <TextField.Root
                    placeholder="Sign Here"
                    value={""}
                    disabled
                    className="w-[70%]"
                  ></TextField.Root>
                  <Button className="w-[30%] bg-theme" type="button">
                    Sign{" "}
                  </Button>
                </Flex>
              </div>
            </Grid>
            {canvasVisible && <SignatureCanvas onSave={setSignatureImage} />}
            <Flex justify={"end"}>
              <Button
                size={"3"}
                className="bg-theme mt-12 cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner /> : _.upperFirst(storeAction)}
              </Button>
            </Flex>
          </form>
          <Toaster position="top-right" />
        </>
      )}
    </>
  );
};

export default ManageDeptStore;
