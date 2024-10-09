// import React, { useState } from "react";
// import Image from "../static/image/login-bg.png";
// import toast, { Toaster } from "react-hot-toast";
// import { useSelector, useDispatch } from "react-redux";

// import { jwtDecode } from "jwt-decode";
// import {
//   Text,
//   Flex,
//   Heading,
//   Card,
//   TextField,
//   Container,
//   Button,
//   Spinner,
// } from "@radix-ui/themes";
// import { LockClosedIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const root = import.meta.env.VITE_ROOT;

// const LoginContent = () => {
//   const [adminBoolean, setAdminBoolean] = useState();
//   const [loading, setLoading] = useState(false); // Spinner state
//   const navigate = useNavigate();

//   const handleLoginForm = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Show spinner

//     try {
//       const response = await axios.post(`${root}/admin/login`, {
//         email: e.target[0].value,
//         password: e.target[1].value,
//       });

//       localStorage.setItem("token", response.data.token);

//       console.log(response);

//       toast.success("Login Successful", {
//         style: {
//           padding: "30px",
//         },
//         duration: 6500,
//       });
//       navigate("/admin");
//     } catch (error) {
//       // Handle error
//       if (error.response) {
//         toast.error(error.response.data.error, {
//           style: {
//             padding: "30px",
//           },
//           duration: 6500,
//         });
//         console.log(error);
//       } else if (error.request) {
//         console.log("Error Request:", error.request);
//         toast.error("Network Error", {
//           style: {
//             padding: "30px",
//           },
//           duration: 6500,
//         });
//       } else {
//         console.log("Error Message:", error.message);
//       }
//     } finally {
//       setLoading(false); // Remove spinner after request completes
//     }
//   };

//   return (
//     <>
//       <div
//         className="h-screen grid place-content-center"
//         style={{
//           backgroundImage: `linear-gradient(180deg, rgba(41, 41, 41, 0.91) 10.42%, rgba(255, 255, 255, 0.03) 100%,rgba(41, 41, 41, 0.91)),url(${Image})`,
//         }}
//       >
//         <div className="xs:w-[100%] sm:w-[450px]">
//           {/* <Heading className="text-center">POLEMA</Heading>  */}
//           <Card className=" p-4 ">
//             <form onSubmit={handleLoginForm}>
//               <div style={{ textAlign: "center" }}>
//                 <Heading mb="6">USER LOGIN</Heading>
//               </div>
//               <TextField.Root
//                 placeholder="Enter Email"
//                 className="mt-4"
//                 size={"3"}
//               >
//                 <TextField.Slot>
//                   <EnvelopeClosedIcon height="16" width="16" />
//                 </TextField.Slot>
//               </TextField.Root>

//               <TextField.Root
//                 placeholder="Password"
//                 className="mt-4"
//                 type="password"
//                 size={"3"}
//               >
//                 <TextField.Slot>
//                   <LockClosedIcon height="16" width="16" />
//                 </TextField.Slot>
//               </TextField.Root>

//               <p className="text-right mt-2 text-[.7rem] cursor-pointer underline">
//                 Forgot Password?
//               </p>

//               <Button
//                 type="submit"
//                 className="w-[100%] mt-4 bg-[#444242]"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <p className="text-white">Please Wait...</p>
//                 ) : (
//                   "Submit"
//                 )}{" "}
//                 {/* Spinner text */}
//               </Button>
//             </form>
//           </Card>
//         </div>
//         <Toaster position="top-right" />
//       </div>
//     </>
//   );
// };

// export default LoginContent;

import React, { useState } from "react";
import Image from "../static/image/login-bg.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Heading, Card, Button } from "@radix-ui/themes";
import { LockClosedIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

const root = import.meta.env.VITE_ROOT;

const LoginContent = () => {
  const [loading, setLoading] = useState(false); // Spinner state
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

  return (
    <>
      <div
        className="h-screen grid place-content-center"
        style={{
          backgroundImage: `
          linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(41, 41, 41, 0.85) 50%, rgba(0, 0, 0, 0.95) 100%),
          url(${Image})`,
          backgroundSize: "cover", // Ensures the image covers the entire background
          backgroundPosition: "center", // Centers the background image
          backgroundBlendMode: "overlay", // Blends the gradient with the image
        }}
      >
        <div className="xs:w-[100%] sm:w-[450px]">
          <div style={{ textAlign: "center", color: "#f1f1f1" }}>
            <Heading mb="6">POLEMA</Heading>
          </div>
          <Card className=" p-4 ">
            <form onSubmit={handleLoginForm}>
              <div style={{ textAlign: "center" }}>
                <Heading mb="6">USER LOGIN</Heading>
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
                className="w-[100%] mt-4 bg-[#444242]"
                disabled={loading}
              >
                {loading ? (
                  <p className="text-white">Please Wait...</p>
                ) : (
                  "Submit"
                )}{" "}
                {/* Spinner text */}
              </Button>
            </form>
          </Card>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default LoginContent;
