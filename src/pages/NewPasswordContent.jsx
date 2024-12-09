import React, { useState } from "react";
import Image from "../static/image/login-bg.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Heading, Card, Button, Spinner } from "@radix-ui/themes";
import {
  LockClosedIcon,
  EnvelopeClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const NewPasswordContent = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginForm = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${root}/admin/reset-password?token=${id}`,
        {
          password,
          confirmPassword,
        }
      );

      // Handle success, navigate to login or show success message
      toast.success("Password successfully updated!", {
        style: {
          padding: "20px",
        },
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 6000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update password, please try again.");
    } finally {
      setLoading(false);
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-4"
                    size="3"
                    type={"text"} // Toggle password visibility
                  >
                    <TextField.Slot>
                      <LockClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <TextField.Root
                    placeholder="Confirm New Password"
                    className="mt-4"
                    size="3"
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="text"
                  >
                    <TextField.Slot>
                      <LockClosedIcon height="16" width="16" />
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
                  {loading ? <Spinner /> : "Submit"}
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
