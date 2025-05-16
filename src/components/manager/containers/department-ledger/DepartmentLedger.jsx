import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Select as AntSelect, Spin } from "antd";
import { Heading, Flex, Text, Separator } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const DepartmentLedger = () => {
  const navigate = useNavigate();
  const showToast = useToast()
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
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
        setDepartments(response.data.departments);
      } catch (error) {
        showToast({
          message:"Failed to fetch departments",
          type:"error"
        })
        
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const getUserDetails = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred, try logging in again");
      return null;
    }
    return jwtDecode(token);
  };

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails?.departmentId?.length === 1) {
      const departmentId = userDetails.departmentId[0];
      const department = departments.find((dept) => dept.id === departmentId);

      if (department) {
        navigate(`/admin/department-ledger/${department.name}/${departmentId}`);
      }
    }
  }, [departments]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Heading>Department Ledger</Heading>
      <Separator className="my-4 w-full" />

      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-3">
          <Text size={"4"} className="font-amsterdam">
            Select department below to view the department's ledger
          </Text>
          <FontAwesomeIcon icon={faArrowDown} size="lg" />

          <div className="relative w-full max-w-md">
            <AntSelect
              placeholder="Select Department"
              
              size="large"
              style={{ width: "100%" }}
              onChange={(value) => navigate(`/admin/department-ledger/${value}`)}
            >
              {departments.map((option) => (
                <AntSelect.Option key={option.id} value={`${option.name}/${option.id}`}>
                  {option.name}
                </AntSelect.Option>
              ))}
            </AntSelect>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default DepartmentLedger;
