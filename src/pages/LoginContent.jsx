import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { adminState } from "../components/store/adminSlice/adminSlice";
import { useSelector, useDispatch } from "react-redux";

import { jwtDecode } from "jwt-decode";
import {
  Text,
  Flex,
  Heading,
  Card,
  TextField,
  Container,
  Button,
  Spinner,
} from "@radix-ui/themes";
import { LockClosedIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const root = import.meta.env.VITE_ROOT;

const LoginContent = () => {
  const [adminBoolean, setAdminBoolean] = useState();
  const [loading, setLoading] = useState(false); // Spinner state
  const navigate = useNavigate();

  // Fuction used to update value at store after successful login
  const dispatch = useDispatch();

  // Retrieving data from store
  const dataAtStore = useSelector((state) => state.admin.isAdmin);

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await axios.post(`${root}/admin/login`, {
        email: e.target[0].value,
        password: e.target[1].value,
      });

      localStorage.setItem("token", response.data.token);

      console.log(response);

      // Change the value of state on store
      dispatch(adminState(true));

      toast.success("Login Successful");
      {
        response.data.admin.isAdmin ? navigate("/md") : navigate("/admin");
      }
    } catch (error) {
      // Handle error
      if (error.response) {
        toast.error(error.response.data.error);
        console.log(error);
      } else if (error.request) {
        console.log("Error Request:", error.request);
        toast.error("Network Error");
      } else {
        console.log("Error Message:", error.message);
      }
    } finally {
      setLoading(false); // Remove spinner after request completes
    }
  };

  return (
    <>
      <div className="h-screen grid place-content-center">
        <div className="xs:w-[100%] sm:w-[450px]">
          <Card className=" p-4 ">
            <form onSubmit={handleLoginForm}>
              <div style={{ textAlign: "center" }}>
                <Heading mb="6">LOGIN</Heading>
              </div>
              <TextField.Root
                placeholder="Enter Email"
                className="mt-4"
                size={"3"}
              >
                <TextField.Slot>
                  <EnvelopeClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>

              <TextField.Root
                placeholder="Password"
                className="mt-4"
                type="password"
                size={"3"}
              >
                <TextField.Slot>
                  <LockClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>

              <p className="text-right mt-2 text-[.7rem] cursor-pointer underline">
                Forgot Password?
              </p>

              <Button
                type="submit"
                className="w-[100%] mt-4"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Submit"} {/* Spinner text */}
              </Button>
            </form>
          </Card>
        </div>
        <Toaster position="bottom-center" />
      </div>
    </>
  );
};

export default LoginContent;
