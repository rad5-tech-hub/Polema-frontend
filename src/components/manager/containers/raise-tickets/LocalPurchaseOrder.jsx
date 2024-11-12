import React from "react";
import {
  Heading,
  Separator,
  Button,
  Spinner,
  TextField,
  Select,
  Text,
  Flex,
  Grid,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const LocalPurchaseOrder = () => {
  const [suppliers, setSuppliers] = React.useState([]);
  const [raw, setRaw] = React.useState([]);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [selectedPrice, setSelectedPrice] = React.useState("");

  // State management for form details
  const [receiver, setReceiver] = React.useState("");
  const [chequeNumber, setChequeNumber] = React.useState("");
  const [voucherNumber, setVoucherNumber] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");
  const [rawMaterialId, setRawMaterialId] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [quantityOrdered, setQuantityOrdered] = React.useState("");
  const [expiration, setExpiration] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [period, setPeriod] = React.useState("");

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuppliers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRaw(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Format unitPrice with commas
  const handleUnitPriceChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(value)) {
      setUnitPrice(
        parseInt(value, 10).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      deliveredTo: receiver,
      chequeNo: chequeNumber,
      chequeVoucherNo: voucherNumber,
      supplierId: supplierId,
      rawMaterial: rawMaterialId,
      unitPrice: selectedPrice,
      quantOrdered: quantityOrdered,
      expires: expiration,
      period: period,
      comments: comment,
    };

    try {
      const response = await axios.post(`${root}/admin/raise-lpo`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setButtonLoading(false);
      toast.success(response.data.message, {
        style: {
          padding: "20px",
        },
        duration: 4500,
      });

      // Reset form fields after successful post
      setReceiver("");
      setChequeNumber("");
      setVoucherNumber("");
      setSupplierId("");
      setRawMaterialId("");
      setSelectedPrice("");
      setUnitPrice("");
      setQuantityOrdered("");
      setExpiration("");
      setComment("");
      setPeriod("");
    } catch (err) {
      console.log(err);
      setButtonLoading(false);
      toast.error("An error occurred, try again later", {
        style: {
          padding: "20px",
        },
        duration: 4500,
      });
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchRaw();
  }, []);

  return (
    <>
      <Heading>Local Purchase Order</Heading>
      <Separator className="my-4 w-full" />
      <form action="" onSubmit={handleSubmit}>
        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>
              Delivered To <span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              value={receiver}
              placeholder="Enter Receiver"
              className="mt-2"
              required
              onChange={(e) => {
                setReceiver(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Text>Cheque No.</Text>
            <TextField.Root
              value={chequeNumber}
              placeholder="Enter Cheque No."
              className="mt-2"
              onChange={(e) => {
                setChequeNumber(e.target.value);
              }}
            />
          </div>
        </Flex>
        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>Cheque Voucher No.</Text>
            <TextField.Root
              value={voucherNumber}
              placeholder="Enter Cheque voucher number"
              className="mt-2 w-[49%]"
              onChange={(e) => {
                setVoucherNumber(e.target.value);
              }}
            />
          </div>
        </Flex>

        <Separator className="my-10 w-full" />
        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>
              Name of Supplier <span className="text-red-500">*</span>
            </Text>
            <Select.Root
              disabled={suppliers.length === 0}
              required
              onValueChange={(value) => {
                setSupplierId(value);
              }}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Supplier"
              />
              <Select.Content>
                {suppliers.map((supplier) => {
                  return (
                    <Select.Item
                      value={supplier.id}
                    >{`${supplier.firstname} ${supplier.lastname}`}</Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="w-full">
            <Text>
              Raw Materials Needed <span className="text-red-500">*</span>
            </Text>
            <Select.Root
              disabled={raw.length === 0}
              required
              onValueChange={(value) => {
                setRawMaterialId(value);
                const selectedRaw = raw.find((item) => item.id === value);
                setSelectedPrice(
                  selectedRaw ? selectedRaw.price[0].amount : ""
                );
              }}
            >
              <Select.Trigger
                className="w-full mt-2"
                placeholder="Select Raw Material"
              />
              <Select.Content>
                {raw.map((item) => {
                  return <Select.Item value={item.id}>{item.name}</Select.Item>;
                })}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>
        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>
              Unit Price <span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Unit Price"
              className="mt-2"
              required
              type="text"
              value={selectedPrice}
              disabled
            >
              <TextField.Slot>₦</TextField.Slot>
            </TextField.Root>
          </div>
          <div className="w-full">
            <Text>
              Quantity Ordered <span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              required
              onChange={(e) => {
                setQuantityOrdered(e.target.value);
              }}
              value={quantityOrdered}
              placeholder="Enter Quantity Ordered"
              className="mt-2"
            />
          </div>
        </Flex>
        <Flex gap={"5"} className="mt-4">
          <div className="w-full">
            <Text>L.P.O Expires</Text>
            <TextField.Root
              placeholder="Enter Reveiver"
              className="mt-2"
              type="date"
              value={expiration}
              onChange={(e) => {
                setExpiration(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Text>Period</Text>
            <TextField.Root
              placeholder="Enter Date"
              type="date"
              value={period}
              className="mt-2"
              onChange={(e) => {
                setPeriod(e.target.value);
              }}
            />
          </div>
        </Flex>
        <Grid gap={"5"} columns={"2"} className="mt-4">
          <div className="w-full">
            <Text>Specifications and comments</Text>
            <TextField.Root
              placeholder="Enter Comments"
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
              className="mt-2"
              asChild
            >
              <textarea rows={5} />
            </TextField.Root>
          </div>
        </Grid>
        <Flex justify={"end"}>
          <Button variant="solid" className="mt-4 !bg-theme" size="3">
            {buttonLoading ? <LoaderIcon /> : "Send"}
          </Button>
        </Flex>
      </form>
      <Toaster />
    </>
  );
};

export default LocalPurchaseOrder;
