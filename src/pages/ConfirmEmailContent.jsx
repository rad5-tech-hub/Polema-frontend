import React, { useState } from "react";
import Image from "../static/image/login-bg.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Heading, Card, Button } from "@radix-ui/themes";
import useToast from "../hooks/useToast";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

const root = import.meta.env.VITE_ROOT;

const ConfirmEmailContent = () => {
  const showToast = useToast()
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${root}/admin/forgot`, {
        email,
      });
      showToast({
        message: "Password reset link sent to your email.",
        type: "success",
        duration:4000
      });
      
      setLoading(false);
      setEmail("");
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        setErrorMessage("Email Not Found");
      }
      if (error.message.status === 429) {
        setErrorMessage("Too many requests.Try again in 15 minutes");
      }
      if (error.message.status === 500) {
        setErrorMessage("An error occurred,try again later");
      }
    }
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
          <Card className="p-10 h-[35vh] bg-[#F1F1F1D4] relative">
            <form
              onSubmit={handleLoginForm}
              className="flex flex-col justify-between h-full"
            >
              <div>
                <div style={{ textAlign: "center" }}>
                  <Heading mb="6" className="text-[#434343]">
                    ENTER EMAIL
                  </Heading>
                </div>
                <TextField.Root
                  placeholder="Enter Email"
                  required
                  className="mt-4"
                  size={"3"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
                <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
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

export default ConfirmEmailContent;
