import React, { useState, useEffect } from "react"
import { LoaderIcon } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { TextField, Heading, Grid, Button, Spinner } from "@radix-ui/themes"
import useToast from "../../../../hooks/useToast";
const root = import.meta.env.VITE_ROOT
const ChangePassword = () => {
    const showToast = useToast()
    // State management for the input values
    const [oldPassword, setOldPassword] = useState("");
    const [oldPassIsText, setOldPassIsText] = useState(false);
    const [newPassword, setNewPassword] = useState("")
    const [newPassIsText, setNewPassIsText] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");
    const [confirmPassIsText, setConfirmPassIsText] = useState(false);
    const [buttonLoading,setButtonLoading] = useState(false)


    // Function to get user ID
    const getUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("An error occurred, try logging in again.");
            return;
        }
        const decryptrdToken = jwtDecode(token);
        return decryptrdToken

    }

    // Function to resetForm
    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPass("")
    }


    // Function to submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true)
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("An error occurred,try logging in again.");
            return
        }


        try {
            const response = await axios.patch(`${root}/admin/change-password/${getUserId().id}`, {
                password: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPass
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setButtonLoading(false);
            showToast({
                message:"Password Changed Successfully",
                type: "success",
                duration: 4000
            })
            
            resetForm()
        } catch (error) {
            setButtonLoading(false)
            console.log(error);
            if (Array.isArray(error.response.data.error)) {
                error.response.data.error.forEach(errMsg => {
                    toast.error(errMsg, {
                        style: { padding: "20px" },
                        duration: 6000
                    });
                });
            } else {
                toast.error(error.response.data.error, {
                    style: { padding: "20px" },
                    duration: 6000
                });
            }


        }
    }

    return (
        <>
            <Heading>Change Password</Heading>

            {/* ----Form is from below here--------- */}
            <form action="" className="mt-4" onSubmit={handleSubmit}>
                <Grid columns={"2"} gap={"4"}>
                    <div className="relative">
                        <label htmlFor="">Old Password</label>
                        <TextField.Root className="" placeholder="Enter Old Password"
                            type={`${oldPassIsText ? "text" : "password"}`}
                            value={oldPassword}
                            onChange={(e) => {
                                setOldPassword(e.target.value)
                            }} />
                        <div className="absolute right-[15px] top-[30px] cursor-pointer" onClick={() => {
                            setOldPassIsText(!oldPassIsText)
                        }}>
                            {oldPassIsText ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </div>
                    </div>
                    <div className="relative">
                        <label htmlFor="">New Password</label>
                        <TextField.Root className="" placeholder="Enter New Password"
                            type={`${newPassIsText ? "text" : "password"}`}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                            }} />
                        <div className="absolute right-[15px] top-[30px] cursor-pointer" onClick={() => {
                            setNewPassIsText(!newPassIsText)
                        }}>
                            {newPassIsText ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </div>
                    </div>
                    <div className="relative">
                        <label htmlFor="">Confirm New Password</label>
                        <TextField.Root className="" placeholder="Re-enter New Password"
                            type={`${confirmPassIsText ? "text" : "password"}`}
                            value={confirmPass}
                            onChange={(e) => {
                                setConfirmPass(e.target.value)
                            }} />
                        <div className="absolute right-[15px] top-[30px] cursor-pointer" onClick={() => {
                            setConfirmPassIsText(!confirmPassIsText)
                        }}>
                            {confirmPassIsText ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </div>
                    </div>
                </Grid>
                <div className="flex justify-end mt-5">
                    <Button type="submit" className="bg-theme cursor-pointer" size={"3"} disabled={buttonLoading}>
                        {buttonLoading ? <LoaderIcon/> :"Submit"}
                    </Button>
                    </div>
            </form>
            <Toaster position="top-right" />
        </>
    )
}

export default ChangePassword