import React, { useState } from "react";
import { Card, Heading } from "@radix-ui/themes";
import { ExitIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Dialog to confirm log out
const LogoutDialog = ({ isOpen, onClose, handleLogout }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirmLogout = () => {
    setConfirmLoading(true);
    handleLogout();
    setConfirmLoading(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-black">
            Confirm Logout
          </Dialog.Title>
          <Heading className="mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            Are you sure you want to log out?
          </Heading>
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-800 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              disabled={confirmLoading}
              onClick={handleConfirmLogout}
              className="ml-4 bg-blue-500 text-white hover:bg-blue-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {confirmLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Logout = ({ openDialog }) => {
  const navigate = useNavigate();

  // State management for logout confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dropdownStates");
    navigate("/");
    toast.success("Logged out successfully!", {
      duration: 10000,
      style: {
        padding: "20px",
      },
    });
  };

  return (
    <>
      <div onClick={() => setConfirmDialog(true)}>
        <Card className="cursor-pointer" title="Logout">
          <ExitIcon color="red" />
        </Card>
      </div>
      {confirmDialog && (
        <LogoutDialog
          isOpen={confirmDialog}
          onClose={() => setConfirmDialog(false)}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Logout;
