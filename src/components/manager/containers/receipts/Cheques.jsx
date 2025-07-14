import React, { useState, useEffect } from "react";
import { Flex, Select as AntSelect } from "antd";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import {
  Button,
  TextField,
  Heading,
  Separator,
  Grid,
  Text,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const Cheque = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    bankId: "",
    chequeNo: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch bank details
  const fetchBankDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-banks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBankDetails(response.data.banks || []);
    } catch (error) {
      console.log(error);
      showToast({
        message: "Error in getting bank details",
        type: "error",
        duration: 4000,
      });
    }
  };

  // Format number with commas
  const formatNumber = (value) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "amount" ? formatNumber(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle amount input change (only numbers)
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      handleInputChange("amount", value);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.bankId) newErrors.bankId = "Bank selection is required";
    if (!formData.chequeNo.trim())
      newErrors.chequeNo = "Cheque number is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast({
        message: "Please fill in all required fields",
        type: "error",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${root}/admin/create-cheque`,
        {
          name: formData.name,
          bankId: formData.bankId,
          chequeNo: formData.chequeNo,
          amount: Number(formData.amount.replace(/,/g, "")), // Remove commas for API
          purpose: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast({
        message: "Cheque added successfully",
        type: "success",
        duration: 4000,
      });

      // Reset form
      setFormData({
        name: "",
        bankId: "",
        chequeNo: "",
        amount: "",
        description: "",
      });
      setTimeout(() => {
        navigate("/admin/receipts/all-cheques");
      }, 3000);
    } catch (error) {
      showToast({
        message: error?.response?.data?.message || "Error adding cheque",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading>Add Cheque</Heading>
        <Button
          className="!bg-theme cursor-pointer"
          onClick={() => {
            navigate("/admin/receipts/all-cheques");
          }}
        >
          Cheque Records
        </Button>
      </Flex>
      <Separator className="w-full mt-4" />
      <form onSubmit={handleSubmit}>
        <Grid columns={"2"} gap={"4"} className="mt-4">
          <div className="w-full">
            <label htmlFor="name" className="mb-4">
              Name <span className="text-red-500">*</span>
            </label>
            <TextField.Root
              placeholder="Name"
              id="name"
              className="w-full mt-4"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <Text color="red" size="2">
                {errors.name}
              </Text>
            )}
          </div>
          <div className="w-full">
            <Text>
              Bank Name <span className="text-red-500">*</span>
            </Text>
            <AntSelect
              showSearch
              className="mt-4"
              placeholder={"Select Bank"}
              value={formData.bankId || ""}
              style={{ width: "100%" }}
              onChange={(value) => handleInputChange("bankId", value)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {bankDetails.map((bank) => (
                <AntSelect.Option key={bank.id} value={bank.id}>
                  {bank.name}
                </AntSelect.Option>
              ))}
            </AntSelect>
            {errors.bankId && (
              <Text color="red" size="2">
                {errors.bankId}
              </Text>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="cheque" className="mb-4">
              Cheque No. <span className="text-red-500">*</span>
            </label>
            <TextField.Root
              placeholder="Enter Cheque Number"
              id="cheque"
              className="w-full mt-4"
              value={formData.chequeNo}
              onChange={(e) => handleInputChange("chequeNo", e.target.value)}
            />
            {errors.chequeNo && (
              <Text color="red" size="2">
                {errors.chequeNo}
              </Text>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="amount" className="mb-4">
              Amount <span className="text-red-500">*</span>
            </label>
            <TextField.Root
              placeholder="Enter Amount"
              id="amount"
              className="w-full mt-4"
              value={formData.amount}
              onChange={handleAmountChange}
            >
              <TextField.Slot>
                <Text>₦</Text>
              </TextField.Slot>
            </TextField.Root>
            {errors.amount && (
              <Text color="red" size="2">
                {errors.amount}
              </Text>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="description" className="mb-4">
              Description <span className="text-red-500">*</span>
            </label>
            <TextField.Root
              placeholder="Enter Description"
              id="description"
              className="w-full mt-4"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {errors.description && (
              <Text color="red" size="2">
                {errors.description}
              </Text>
            )}
          </div>
        </Grid>
        <Flex justify={"end"} align={"end"} width={"100%"}>
          <Button
            className="mt-4 bg-theme hover:bg-theme/85"
            size={"4"}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Cheque;
