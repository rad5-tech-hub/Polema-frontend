import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  Button,
  Heading,
  Flex,
  Spinner,
  Grid,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const CreateDispatchNote = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [superAdmins, setSuperAdmins] = useState([]);
  const [formData, setFormData] = useState({
    driverName: "",
    escortName: "",
    vehicleNumber: "",
    destination: "",
  });

  // Fetch super admins
  const fetchSuperAdmins = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuperAdmins(response.data.staffList || []);
    } catch (error) {
      console.error("Error fetching super admins:", error);
      toast.error(error.response?.data?.message || "Failed to load admins.");
    }
  };

  // Handle form input changes
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in again.", { style: { padding: "20px" }, duration: 10000 });
      setButtonLoading(false);
      return;
    }

    if (!adminId) {
      toast.error("Please select an admin to send to.", { style: { padding: "20px" }, duration: 10000 });
      setButtonLoading(false);
      return;
    }

    if (!formData.driverName) {
      toast.error("Driver's name is required.", { style: { padding: "20px" }, duration: 10000 });
      setButtonLoading(false);
      return;
    }

    const body = {
      driversName: formData.driverName,
      escortName: formData.escortName,
      vehicleNo: formData.vehicleNumber,
      destination: formData.destination,
    };

    try {
      // Create vehicle dispatch
      const createResponse = await axios.post(
        `${root}/customer/create-vehicle-dispatch`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dispatchId = createResponse.data.vehicle?.id;
      if (!dispatchId) {
        throw new Error("Failed to retrieve dispatch ID.");
      }

      // Send dispatch to admin
      await axios.post(
        `${root}/customer/send-vehicle/${dispatchId}`,
        { adminId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Dispatch note generated and sent to admin!", {
        style: { padding: "20px" },
        duration: 10000,
      });

      // Navigate to receipt page
      navigate(`/admin/receipt/receipt-dispatchnote/${dispatchId}`);
    } catch (error) {
      console.error("Error creating dispatch note:", error);
      toast.error(error.response?.data?.message || "Failed to create dispatch note.");
    } finally {
      setButtonLoading(false);
    }
  };

  // Fetch super admins on mount
  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  return (
    <Flex direction="column" gap="4" className="p-6">
      <Flex justify="between" align="center" className=" py-4 border-b border-gray-200">
        <Heading size="5">Create Vehicle Dispatch Note</Heading>
        <Button       
          variant="outline"
          className="px-8 p-5 border-theme text-theme"
          onClick={() => navigate("/admin/receipts/all-dispatchnote")}
        >
          View All
        </Button>
      </Flex>

      <form onSubmit={handleSubmit}>
        <Grid
          columns={{ initial: "1", sm: "2" }}
          gap="6"
          className=" pt-6"
        >
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              Driver's Name
            </Text>
            <TextField.Root
              size="3"
              placeholder="Enter Driver Name"
              value={formData.driverName}
              onChange={handleInputChange("driverName")}
              required
            />
          </Flex>
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              Escort's Name
            </Text>
            <TextField.Root
              size="3"
              placeholder="Enter Escort Name"
              value={formData.escortName}
              onChange={handleInputChange("escortName")}
            />
          </Flex>
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              Vehicle No
            </Text>
            <TextField.Root
              size="3"
              placeholder="Enter Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleInputChange("vehicleNumber")}
            />
          </Flex>
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              Destination
            </Text>
            <TextField.Root
              size="3"
              placeholder="Enter Destination"
              value={formData.destination}
              onChange={handleInputChange("destination")}
            />
          </Flex>
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium">
              Send To
            </Text>
            <Select.Root
              size="3"
              value={adminId}
              onValueChange={setAdminId}
              disabled={superAdmins.length === 0}
              required
            >
              <Select.Trigger placeholder="Select Admin" />
              <Select.Content position="popper">
                {superAdmins.map((admin) => (
                  <Select.Item key={admin.id} value={admin.id}>
                    {`${admin.firstname} ${admin.lastname}`}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Grid>
        <Flex justify="end" className="mt-8">
          <Button
            type="submit"
            size="3"
            disabled={buttonLoading}
            className="!bg-theme cursor-pointer"
          >
            {buttonLoading ? <Spinner size="2" /> : "Send"}
          </Button>
        </Flex>
      </form>

      <Toaster position="top-right" />
    </Flex>
  );
};

export default CreateDispatchNote;