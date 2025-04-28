import React, { useState, useEffect } from "react";
import {
  Heading,
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
import { Modal, Button as AntButton, Select as AntSelect } from "antd";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const CashManagement = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isCashCollection, setIsCashCollection] = useState(true);
  const [dropdownBlur, setDropdownBlur] = useState(true);
  const [adminId, setAdminId] = useState(undefined); // Changed to undefined
  const [departmentId, setDepartmentId] = useState(undefined); // Changed to undefined
  const [cashAmount, setCashAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const showToast = useToast();

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

  const fetchDepartments = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      if (response.data.departments.length === 0) {
        toast.error("No departments found.");
      }
      setDepartments(response.data.departments);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch departments. Please try again.");
    }
  };

  const formatAmount = (value) => {
    const cleanedValue = value.replace(/,/g, "");
    if (cleanedValue === "") return "";
    return !isNaN(cleanedValue)
      ? parseFloat(cleanedValue).toLocaleString("en-US")
      : amount;
  };

  const parseNumber = (input) => {
    const cleanedInput = input.replace(/,/g, "");
    return parseFloat(cleanedInput) || "";
  };

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
        departmentId,
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
        
        showToast({
          message: response.data.message,
          type: "success",
          duration: 4000,
          })
        setAdminId(undefined); // Reset to undefined
        setDepartmentId(undefined); // Reset to undefined
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

  const handleCollectCash = () => {
    setIsCashCollection(true);
    setModalOpen(false);
  };

  const handleGiveCash = () => {
    setIsCashCollection(false);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchAdmins();
    fetchDepartments();
  }, []);

  return (
    <>
      <Modal
        open={modalOpen}
        footer={null}
        closable={false}
        onCancel={() => setModalOpen(false)}
      >
        <h1 className="font-space font-bold text-lg">
          What do you want to do?
        </h1>
        <div className="flex mt-4 justify-between">
          <AntButton
            className="bg-green-500 text-white"
            onClick={handleCollectCash}
          >
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
          {!modalOpen && (
            <AntSelect
              defaultValue={
                isCashCollection ? "Cash Collection" : "Cash Disbursement"
              }
              onChange={(value) =>
                setIsCashCollection(value === "Cash Collection")
              }
              style={{ width: 200 }}
              options={[
                { value: "Cash Collection", label: "Cash Collection" },
                { value: "Cash Disbursement", label: "Cash Disbursement" },
              ]}
            />
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
              <AntSelect
                value={adminId}
                onChange={(val) => setAdminId(val)}
                placeholder="Select Admin"
                disabled={dropdownBlur}
                style={{ width: "100%", marginTop: "8px" }}
                options={admins.map((admin) => ({
                  value: admin.role.id,
                  label: `${admin.firstname} ${admin.lastname}`,
                }))}
              />
            </div>
            <div>
              <Text>Department</Text>
              <AntSelect
                value={departmentId}
                onChange={(val) => setDepartmentId(val)}
                placeholder="Select Department"
                style={{ width: "100%", marginTop: "8px" }}
                options={departments.map((dept) => ({
                  value: dept.id,
                  label: dept.name,
                }))}
              />
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
