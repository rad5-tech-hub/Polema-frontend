import React, { useState, useEffect } from "react";
import {
  Heading,
  Select,
  Flex,
  Button,
  Separator,
  Grid,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Modal, Button as AntButton } from "antd";

const root = import.meta.env.VITE_ROOT;

const CashManagement = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isCashCollection, setIsCashCollection] = useState(true);
  const [dropdownBlur, setDropdownBlur] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(true); // Modal opens on mount
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch Admins
  const fetchAdmins = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      if (response.data.staffList.length === 0) {
        toast.error("No admins found.");
      }
      setAdmins(response.data.staffList);
      setDropdownBlur(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch admins. Please try again.");
    }
  };

  // Format Amount
  const formatAmount = (value) => {
    const cleanedValue = value.replace(/,/g, "");
    if (cleanedValue === "") return "";
    return !isNaN(cleanedValue)
      ? parseFloat(cleanedValue).toLocaleString("en-US")
      : amount;
  };

  // Parse Input Amount to a Number
  const parseNumber = (input) => {
    const cleanedInput = input.replace(/,/g, "");
    return parseFloat(cleanedInput) || "";
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    if (confirm("Are you sure you want to continue?")) {
      e.preventDefault();
      setButtonLoading(true);
      const retrToken = localStorage.getItem("token");
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");
        setButtonLoading(false);
        return;
      }

      if (!name || !cashAmount || !adminId || !comment) {
        toast.error("Please fill all required fields.");
        setButtonLoading(false);
        return;
      }

      const body = {
        name,
        comment,
        approvedByAdminId: adminId,
        [isCashCollection ? "credit" : "debit"]: cashAmount,
      };

      try {
        const response = await axios.post(
          `${root}/admin/create-cashier-book`,
          body,
          {
            headers: { Authorization: `Bearer ${retrToken}` },
          }
        );
        toast.success(response.data.message, {
          style: { padding: "30px" },
          duration: 5500,
        });

        // Clear form fields
        setAdminId("");
        setCashAmount("");
        setName("");
        setComment("");
        setAmount("");
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit. Please try again.");
      } finally {
        setButtonLoading(false);
      }
    } else {
      e.preventDefault();
    }
  };

  // Handle modal button clicks
  const handleCollectCash = () => {
    console.log("Collect Cash clicked, closing modal");
    setIsCashCollection(true);
    setModalOpen(false);
  };

  const handleGiveCash = () => {
    console.log("Give Cash clicked, closing modal");
    setIsCashCollection(false);
    setModalOpen(false);
  };

  // Debug modal state changes
  useEffect(() => {
    console.log("modalOpen state changed to:", modalOpen);
  }, [modalOpen]);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <>
      {/* Modal integrated directly into the component */}
      <Modal
        open={modalOpen}
        footer={null}
        closable={false}
        onCancel={() => setModalOpen(false)} // Optional: allow manual closing for testing
      >
        <h1 className="font-space font-bold text-lg">What do you want to do?</h1>
        <div className="flex mt-4 justify-between">
          <AntButton className="bg-green-500 text-white" onClick={handleCollectCash}>
            Collect Cash
          </AntButton>
          <AntButton className="bg-red-500 text-white" onClick={handleGiveCash}>
            Give Cash
          </AntButton>
        </div>
      </Modal>

      <div>
        <Flex justify={"between"}>
          <Heading>Cash Management</Heading>
          {!modalOpen && ( // Only show Select when modal is closed
            <Select.Root
              defaultValue={isCashCollection ? "Cash Collection" : "Cash Disbursement"}
              onValueChange={(value) => setIsCashCollection(value === "Cash Collection")}
            >
              <Select.Trigger placeholder="Transaction Type" />
              <Select.Content>
                <Select.Item value="Cash Disbursement">Cash Disbursement</Select.Item>
                <Select.Item value="Cash Collection">Cash Collection</Select.Item>
              </Select.Content>
            </Select.Root>
          )}
        </Flex>
        <Separator className="my-4 w-full" />

        <form onSubmit={handleSubmit}>
          <Grid columns={"2"} rows={"2"} gap={"5"}>
            <div>
              <Text>{isCashCollection ? "Received From" : "Given To"}</Text>
              <TextField.Root
                placeholder="Input Name"
                className="mt-2"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Text>Amount</Text>
              <TextField.Root
                placeholder="Enter Amount"
                className="mt-2"
                required
                value={amount}
                onChange={(e) => {
                  setCashAmount(parseNumber(e.target.value));
                  setAmount(formatAmount(e.target.value));
                }}
              >
                <TextField.Slot>₦</TextField.Slot>
              </TextField.Root>
            </div>
            <div>
              <Text>Approved by:</Text>
              <Select.Root
                value={adminId}
                required
                onValueChange={(val) => setAdminId(val)}
              >
                <Select.Trigger
                  disabled={dropdownBlur}
                  className="w-full mt-2"
                  placeholder="Select Admin"
                />
                <Select.Content position="popper">
                  {admins.map((admin) => (
                    <Select.Item key={admin.id} value={admin.id}>
                      {admin.firstname} {admin.lastname}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <Text>Comment/Description</Text>
              <TextField.Root
                placeholder="Add your comment"
                required
                className="mt-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </Grid>

          <Flex justify={"end"} className="mt-4">
            <Button className="!bg-theme cursor-pointer" type="submit" size="3">
              {buttonLoading ? <Spinner /> : "Submit"}
            </Button>
          </Flex>
        </form>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default CashManagement;