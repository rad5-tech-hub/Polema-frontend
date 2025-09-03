import React, { useState, useEffect, useRef } from "react";
import useToast from "../../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Heading,
  Flex,
  Button,
  Separator,
  TextField,
  Grid,
  Select,
  Spinner,
  Text,
  Box,
} from "@radix-ui/themes";

// Constants
const API_ROOT = import.meta.env.VITE_ROOT;


// Utility Functions
const getAuthToken = () => localStorage.getItem("token");

const getSupplierName = (supplier) =>
  supplier.firstname && supplier.lastname
    ? `${supplier.firstname} ${supplier.lastname}`
    : supplier.name || "Unnamed Supplier";

// Main Component
const NewAuthorityToWeigh = () => {
  // State Management
  const showToast = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [transportedBy, setTransportedBy] = useState("");
  const [admins, setAdmins] = useState([]);
  const [chiefAdminId, setChiefAdminId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isFetchingSuppliers, setIsFetchingSuppliers] = useState(true);
  const [adminDropdownDisabled, setAdminDropdownDisabled] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // API Calls
  const fetchSuppliers = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Session expired. Please log in again.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 6500,
      });
      setIsFetchingSuppliers(false);
      return;
    }

    try {
      setIsFetchingSuppliers(true);
      const response = await axios.get(`${API_ROOT}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
      toast.error("Failed to fetch suppliers.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
    } finally {
      setIsFetchingSuppliers(false);
    }
  };

  const fetchSuperAdmins = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Session expired. Please log in again.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 6500,
      });
      return;
    }

    try {
      const response = await axios.get(`${API_ROOT}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.staffList || []);
      setAdminDropdownDisabled(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
      toast.error("Failed to fetch admins.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
    }
  };

  const fetchProducts = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Session expired. Please log in again.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 6500,
      });
      return;
    }

    try {
      const response = await axios.get(`${API_ROOT}/admin/get-raw-materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
    }
  };

  // Form Handlers
  const handleSelectSupplier = (supplier) => {
    setSelectedSupplierId(supplier.id);
    setSearchTerm(getSupplierName(supplier));
    setIsDropdownOpen(false);
  };

  const resetForm = () => {
    setSelectedSupplierId("");
    setSearchTerm("");
    setDriverName("");
    setChiefAdminId("");
    setVehicleNumber("");
    setTransportedBy("");
    setSelectedProductId("");
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      toast.error("Session expired. Please log in again.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 6500,
      });
      setBtnLoading(false);
      return;
    }

    if (
      !selectedSupplierId ||
      !vehicleNumber ||
      !driverName ||
      !transportedBy ||
      !chiefAdminId ||
      !selectedProductId
    ) {
      toast.error("Please fill all required fields.", {
        style: { background: "#fef2f2", color: "#b91c1c", padding: "16px" },
        duration: 5000,
      });
      setBtnLoading(false);
      return;
    }

    setBtnLoading(true);
    try {
      const ticketResponse = await axios.post(
        `${API_ROOT}/admin/sup-auth-weigh`,
        {
          supplierId: selectedSupplierId,
          vehicleNo: vehicleNumber,
          driver: driverName,
          transportedBy,
          productId: selectedProductId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ticketId = ticketResponse.data.data.id;
      await axios.post(
        `${API_ROOT}/admin/send-weigh-auth/${ticketId}`,
        { adminIds: [chiefAdminId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast({
        message:"Ticket sent successfully",
        type: "success",
        duration:5000
      })
 
      resetForm();


      navigate("/admin/raise-ticket/authority-to-weigh")
    } catch (error) {
      console.error("Submission error:", error);
      showToast({
        message:  error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred. Please try again.",
          type:"error",
          duration:5000
      })
      
    } finally {
      setBtnLoading(false);
    }
  };

  // Computed Values
  const filteredSuppliers = suppliers.filter((supplier) =>
    getSupplierName(supplier).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchSuppliers();
    fetchSuperAdmins();
    fetchProducts();
  }, []);

  return (
    <>
      <Heading size="6" className="py-4">
        New Authority to Weigh
      </Heading>
      <Separator size="4" className="my-5" />

      <form onSubmit={handleSubmit}>
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          {/* Vehicle Number */}
          <Box>
            <Text as="label" size="2" weight="medium">
              Vehicle Number<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="mt-2"
              required
            />
          </Box>

          {/* Supplier Name */}
          <Box className="relative">
            <Text as="label" size="2" weight="medium">
              Supplier Name<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              ref={inputRef}
              placeholder={
                isFetchingSuppliers
                  ? "Loading..."
                  : suppliers.length === 0
                  ? "No suppliers available"
                  : "Search suppliers..."
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="mt-2"
              disabled={isFetchingSuppliers || suppliers.length === 0}
              required
            />
            {isDropdownOpen && filteredSuppliers.length > 0 && (
              <Box className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md z-10">
                {filteredSuppliers.map((supplier) => (
                  <Box
                    key={supplier.id}
                    onClick={() => handleSelectSupplier(supplier)}
                    className={`p-2 cursor-pointer ${
                      selectedSupplierId === supplier.id
                        ? "bg-gray-100"
                        : "bg-white"
                    } hover:bg-gray-100`}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {getSupplierName(supplier)}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Driver's Name */}
          <Box>
            <Text as="label" size="2" weight="medium">
              Driver's Name<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Driver's Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="mt-2"
              required
            />
          </Box>

          {/* Raw Material */}
          <Box>
            <Text as="label" size="2" weight="medium">
              Raw Material<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              value={selectedProductId || ""}
              onValueChange={(value) => setSelectedProductId(value)}
              disabled={products.length === 0}
              required
            >
              <Select.Trigger
                placeholder="Select Raw Material"
                className="w-full mt-2"
              />
              <Select.Content position="popper">
                {products.map((product) => (
                  <Select.Item key={product.id} value={product.id}>
                    {product.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Transport Carried Out By */}
          <Box>
            <Text as="label" size="2" weight="medium">
              Transport Carried Out By<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              value={transportedBy}
              onValueChange={(value) => setTransportedBy(value)}
              required
            >
              <Select.Trigger
                placeholder="Select Transport Option"
                className="w-full mt-2"
              />
              <Select.Content position="popper">
                <Select.Item value="Company">Company</Select.Item>
                <Select.Item value="Supplier">Supplier</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Send To */}
          <Box>
            <Text as="label" size="2" weight="medium">
              Send To<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              value={chiefAdminId}
              onValueChange={(value) => setChiefAdminId(value)}
              disabled={adminDropdownDisabled}
              required
            >
              <Select.Trigger
                placeholder="Select Admin"
                className="w-full mt-2"
              />
              <Select.Content position="popper">
                {admins.map((admin) => (
                  <Select.Item
                    key={admin.role?.id || admin.id}
                    value={admin.role?.id || admin.id}
                  >
                    {`${admin?.role?.name || ""} (${admin.firstname} ${
                      admin.lastname
                    }) `}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
        </Grid>

        {/* Submit Button */}
        <Flex justify="end" className="mt-5">
          <Button
            size="3"
            type="submit"
            className="cursor-pointer px-5 mt-5 !bg-theme !text-white"
            disabled={btnLoading}
          >
            {btnLoading ? <Spinner /> : "Send"}
          </Button>
        </Flex>
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default NewAuthorityToWeigh;