import React from "react";
import {
  Heading,
  Separator,
  Button,
  Spinner,
  TextField,
  Select,
  Box,
  Text,
  Flex,
  Grid,
} from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { Select as AntSelect } from "antd";
const { Option } = AntSelect;
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;
import useToast from "../../../../hooks/useToast";

const LocalPurchaseOrder = () => {
  const [suppliers, setSuppliers] = React.useState([]);
  const [raw, setRaw] = React.useState([]);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [selectedPrice, setSelectedPrice] = React.useState("");
  const showToast = useToast();

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
const [history,setHistory] = React.useState("");
  const [superAdmins, setSuperAdmins] = React.useState([]);
  const [adminId, setAdminId] = React.useState("");
  const [ticketId, setTicketId] = React.useState("");

  // State for multiple supplier details
  const [supplierDetails, setSupplierDetails] = React.useState([
    {
      id: Date.now(),
      supplierId: "",
      rawMaterialId: "",
      unitPrice: "",
      quantityOrdered: "",
    },
  ]);

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

  // Function to fetch to all super admins
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");

    try {
      const request = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuperAdmins(request.data.staffList);
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

  // Handle changes for supplier details
  const handleSupplierDetailChange = (id, field, value) => {
    setSupplierDetails((prev) =>
      prev.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );
  };

  // Add new supplier detail box
  const addSupplierDetail = () => {
    setSupplierDetails((prev) => [
      ...prev,
      {
        id: Date.now(),
        supplierId: "",
        rawMaterialId: "",
        unitPrice: "",
        quantityOrdered: "",
      },
    ]);
  };

  // Remove supplier detail box
  const removeSupplierDetail = (id) => {
    if (supplierDetails.length > 1) {
      setSupplierDetails((prev) => prev.filter((detail) => detail.id !== id));
    } else {
      showToast({
        message: "At least one supplier detail is required",
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resetForm = () => {
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
      setSupplierDetails([
        {
          id: Date.now(),
          supplierId: "",
          rawMaterialId: "",
          unitPrice: "",
          quantityOrdered: "",
        },
      ]);
    };

    setButtonLoading(true); // Start loading state
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setButtonLoading(false);
      return;
    }

    const body = {
      deliveredTo: receiver,
      chequeNo: chequeNumber,
      chequeVoucherNo: voucherNumber,
      supplierDetails: supplierDetails.map((detail) => ({
        supplierId: detail.supplierId,
        rawMaterial: detail.rawMaterialId,
        unitPrice: detail.unitPrice,
        quantOrdered: detail.quantityOrdered,
      })),
      expires: expiration,
      period: period,
      comments: comment,
    };

    try {
      // FIRST API REQUEST
      const response = await axios.post(`${root}/admin/raise-lpo`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      const ticketId = response.data.ticket.id; // Get ticket ID
      setTicketId(ticketId);

      // SECOND API REQUEST
      const secondResponse = await axios.post(
        `${root}/admin/send-lpo/${ticketId}`,
        { adminIds: [adminId] },
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      // Success feedback and reset form
      showToast({
        message: "LPO raised and sent successfully",
        type: "success",
        duration: 5000,
      });
      resetForm();
    } catch (error) {
      console.error("Error occurred during submission:", error);
      showToast({
        message: "Failed to submit form, please try again.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setButtonLoading(false); // Reset loading state
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchSuperAdmins();
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
              className="mt-2 "
              onChange={(e) => {
                setVoucherNumber(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Text>Comments</Text>
            <TextField.Root
              placeholder="Enter Comments"
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
              className="mt-2"
              asChild
            ></TextField.Root>
          </div>
        </Flex>

        <Box width="100%">
          <Grid gap={"5"} columns={"2"} className="mt-4">
            {supplierDetails.map((detail) => (
              <Box key={detail.id} className="p-4 border rounded">
                <Flex gap={"5"} direction="column">
                  <div className="w-full">
                    <Text>
                      Name of Supplier <span className="text-red-500">*</span>
                    </Text>
                    <AntSelect
                      showSearch
                      className="mt-2"
                      placeholder={"Select Supplier"}
                      value={detail.supplierId}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleSupplierDetailChange(
                          detail.id,
                          "supplierId",
                          value
                        )
                      }
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {suppliers.map((customer) => (
                        <Option key={customer.id} value={customer.id}>
                          {`${customer.firstname} ${customer.lastname}`}
                        </Option>
                      ))}
                    </AntSelect>
                  </div>
                  <div className="w-full">
                    <Text>
                      Raw Materials Needed{" "}
                      <span className="text-red-500">*</span>
                    </Text>
                    <Select.Root
                      disabled={raw.length === 0}
                      required
                      value={detail.rawMaterialId}
                      onValueChange={(value) => {
                        handleSupplierDetailChange(
                          detail.id,
                          "rawMaterialId",
                          value
                        );
                        const selectedRaw = raw.find(
                          (item) => item.id === value
                        );
                        handleSupplierDetailChange(
                          detail.id,
                          "unitPrice",
                          selectedRaw ? selectedRaw.price[0].amount : ""
                        );
                      }}
                    >
                      <Select.Trigger
                        className="w-full mt-2"
                        placeholder="Select Raw Material"
                      />
                      <Select.Content>
                        {raw.map((item) => (
                          <Select.Item key={item.id} value={item.id}>
                            {item.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>
                  <Flex gap={"5"}>
                    <div className="w-full">
                      <Text>
                        Unit Price <span className="text-red-500">*</span>
                      </Text>
                      <TextField.Root
                        placeholder="Enter Unit Price"
                        className="mt-2"
                        required
                        type="text"
                        value={detail.unitPrice}
                        onChange={(e) =>
                          handleSupplierDetailChange(
                            detail.id,
                            "unitPrice",
                            e.target.value
                          )
                        }
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
                        value={detail.quantityOrdered}
                        onChange={(e) =>
                          handleSupplierDetailChange(
                            detail.id,
                            "quantityOrdered",
                            e.target.value
                          )
                        }
                        placeholder="Enter Quantity Ordered"
                        className="mt-2"
                      />
                    </div>
                  </Flex>
                  {supplierDetails.length > 1 && (
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => removeSupplierDetail(detail.id)}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  )}
                </Flex>
              </Box>
            ))}
          </Grid>
          <Button
            variant="outline"
            className="mt-4"
            onClick={addSupplierDetail}
          >
            Add Supplier
          </Button>
        </Box>

        <div className="w-full">
          <Text className="block mt-4">
            Send To <span className="text-red-500">*</span>{" "}
          </Text>
          <Select.Root
            disabled={superAdmins.length === 0}
            required
            onValueChange={(value) => {
              setAdminId(value);
            }}
          >
            <Select.Trigger className=" mt-2 w-[49%]" placeholder="Send to " />
            <Select.Content>
              {superAdmins.map((admin) => {
                return (
                  <Select.Item
                    key={admin.role?.id}
                    value={admin.role?.id || " "}
                  >{`${admin.firstname} ${admin.lastname}`}</Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
        </div>
        <Flex justify={"end"}>
          <Button
            variant="solid"
            className="mt-4 !bg-theme cursor-pointer"
            size="3"
          >
            {buttonLoading ? <LoaderIcon /> : "Send"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </>
  );
};

export default LocalPurchaseOrder;