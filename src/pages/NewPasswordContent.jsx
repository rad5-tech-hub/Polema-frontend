import React, { useState } from "react";
import Image from "../static/image/login-bg.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Heading, Card, Button } from "@radix-ui/themes";
import {
  LockClosedIcon,
  EnvelopeClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons"; // Add icons for eye open and closed

const root = import.meta.env.VITE_ROOT;

const NewPasswordContent = () => {
  const [loading, setLoading] = useState(false); // Spinner state
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state
  const navigate = useNavigate();

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await axios.post(`${root}/admin/login`, {
        email: e.target[0].value,
        password: e.target[1].value,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminFirstName", response.data.admin.firstname);

      toast.success("Login Successful", {
        style: {
          padding: "30px",
        },
        duration: 6000,
      });
      navigate("/admin");
    } catch (error) {
      // Handle error
      if (error.response) {
        toast.error(error.response.data.error, {
          style: {
            padding: "30px",
          },
          duration: 7500,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          style: {
            padding: "30px",
          },
          duration: 7500,
        });
      }
    } finally {
      setLoading(false); // Remove spinner after request completes
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div
        className="h-screen grid place-content-center"
        style={{
          backgroundImage: `
          linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(41, 41, 41, 0.85) 50%, rgba(0, 0, 0, 0.95) 100%),
          url(${Image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="xs:w-[100%] sm:w-[450px]">
          <div style={{ textAlign: "center", color: "#f1f1f1" }}>
            <Heading mb="6">POLEMA</Heading>
          </div>
          <Card className="p-10 h-[50vh] bg-[#F1F1F1D4] relative">
            <form
              onSubmit={handleLoginForm}
              className="flex flex-col justify-between h-full"
            >
              <div>
                <div style={{ textAlign: "center" }}>
                  <Heading mb="6" className="text-[#434343]">
                    CHANGE PASSWORD
                  </Heading>
                </div>
                <div className="flex flex-col gap-4">
                  <TextField.Root
                    placeholder="Enter New Password"
                    className="mt-4"
                    size={"3"}
                  >
                    <TextField.Slot>
                      <EnvelopeClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <TextField.Root
                    placeholder="Confirm New Password"
                    className="mt-4"
                    size={"3"}
                  >
                    <TextField.Slot>
                      <EnvelopeClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </div>
              </div>

              <div className="btn w-full">
                <Button
                  type="submit"
                  className="w-[100%] bg-theme hover:bg-theme/85 h-[40px]"
                  disabled={loading}
                >
                  {loading ? (
                    <p className="text-white">Please Wait...</p>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default NewPasswordContent;