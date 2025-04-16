import React from "react";
import { refractor } from "../../../date";
import axios from "axios";
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
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const NewAuthorityToWeigh = () => {
  // State management
  const [suppliers, setSuppliers] = React.useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState(""); // For filtering suppliers
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false); // Toggle dropdown
  const [vehicleNumber, setVehicleNumber] = React.useState("");
  const [driverName, setDriverName] = React.useState("");
  const [transportedBy, setTransportedBy] = React.useState("");
  const [admins, setAdmins] = React.useState([]);
  const [chiefAdminId, setChiefAdminId] = React.useState("");
  const [adminDropdownDisabled, setAdminDropdownDisabled] = React.useState(true);
  const [ticketId, setTicketId] = React.useState("");
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [isFetchingSuppliers, setIsFetchingSuppliers] = React.useState(true);


  const inputRef = React.useRef(null); // Ref for focusing input
  const navigate = useNavigate();

  // Fetch all suppliers from db
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: { padding: "30px" },
      });
      setIsFetchingSuppliers(false);
      return;
    }

    try {
      setIsFetchingSuppliers(true);
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      console.log("Suppliers response:", response.data);
      const suppliersData = response.data.customers || [];
      setSuppliers(suppliersData);
      console.log("Suppliers set to:", suppliersData);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
      toast.error("Failed to fetch suppliers", {
        style: { padding: "20px" },
      });
    } finally {
      setIsFetchingSuppliers(false);
    }
  };

  // Fetch chief admins from db
  const fetchSuperAdmins = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: { padding: "30px" },
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setAdmins(response.data.staffList || []);
      setAdminDropdownDisabled(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    }
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    const name = supplier.firstname && supplier.lastname
      ? `${supplier.firstname} ${supplier.lastname}`
      : supplier.name || "Unnamed Supplier";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle supplier selection
  const handleSelectSupplier = (supplier) => {
    setSelectedSupplierId(supplier.id);
    setSearchTerm(
      supplier.firstname && supplier.lastname
        ? `${supplier.firstname} ${supplier.lastname}`
        : supplier.name || "Unnamed Supplier"
    );
    setIsDropdownOpen(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again", {
        duration: 6500,
        style: { padding: "30px" },
      });
      return;
    }

    const resetForm = () => {
      setSelectedSupplierId("");
      setSearchTerm("");
      setDriverName("");
      setChiefAdminId("");
      setVehicleNumber("");
      setTransportedBy("");
    };

    const body = {
      supplierId: selectedSupplierId,
      vehicleNo: vehicleNumber,
      driver: driverName,
      transportedBy,
    };
    setBtnLoading(true);

    try {
      const ticketResponse = await axios.post(
        `${root}/admin/sup-auth-weigh`,
        body,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );

      const ticketId = ticketResponse.data.data.id;
      setTicketId(ticketId);

      await axios.post(
        `${root}/admin/send-weigh-auth/${ticketId}`,
        { adminIds: [chiefAdminId] },
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setBtnLoading(false);

      toast.success("Ticket successfully sent!", {
        style: { padding: "20px" },
        duration: 5000,
      });

      resetForm();
    } catch (error) {
      setBtnLoading(false);
      console.error("Submission error:", error);
      toast.error(
        error.response?.message || error.response?.error || "An error occurred. Please try again later.",
        {
          style: { padding: "20px" },
        }
      );
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
    fetchSuperAdmins();
  }, []);

  return (
    <>
      <Heading className="py-4 flex justify-between items-center"><span>New Authority to Weigh</span>  
        <Button size={"3"}
            className="cursor-pointer  bg-gray-200 text-black"
            onClick={() => navigate('/admin/raise-ticket/authority-to-weigh')}
            disabled={btnLoading}
          >
            <ArrowLeftIcon/> Back
        </Button>
      </Heading>
      <Separator className="my-5 w-full" />

      <form action="" onSubmit={handleSubmit}>
        <Grid columns={"2"} gap={"4"}>
          <div className="w-full">
            <Text>
              Vehicle Number<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Vehicle Number"
              onChange={(e) => setVehicleNumber(e.target.value)}
              value={vehicleNumber}
              className="mt-2"
            />
          </div>
          <div className="w-full relative">
            <Text>
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
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  zIndex: 10,
                }}
              >
                {filteredSuppliers.map((supplier) => (
                  <Box
                    key={supplier.id}
                    onClick={() => handleSelectSupplier(supplier)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      background:
                        selectedSupplierId === supplier.id ? "#e0e0e0" : "white",
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  >
                    {supplier.firstname && supplier.lastname
                      ? `${supplier.firstname} ${supplier.lastname}`
                      : supplier.name || "Unnamed Supplier"}
                  </Box>
                ))}
              </Box>
            )}
          </div>
          <div className="w-full">
            <Text>
              Driver's Name<span className="text-red-500">*</span>
            </Text>
            <TextField.Root
              placeholder="Enter Driver's Name"
              value={driverName}
              className="mt-2"
              required
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Text>
              Transport Carried Out By<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              required
              value={transportedBy}
              onValueChange={(value) => setTransportedBy(value)}
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
          </div>
          <div className="w-full">
            <Text>
              Send To<span className="text-red-500">*</span>
            </Text>
            <Select.Root
              required
              disabled={adminDropdownDisabled}
              value={chiefAdminId}
              onValueChange={(value) => setChiefAdminId(value)}
            >
              <Select.Trigger
                placeholder="Select Admin"
                className="w-full mt-2"
              />
              <Select.Content position="popper">
                {admins.map((item) => (
                  <Select.Item key={item.role?.id} value={item.role?.id || " "}>
                    {item.firstname} {item.lastname}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Grid>

        <Flex justify={"end"}>
          <Button
            size={"3"}
            className="cursor-pointer mt-5 px-5 !bg-theme"
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