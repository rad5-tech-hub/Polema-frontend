import React, { useState } from "react";
import useToast from "../../../../hooks/useToast";
import axios from "axios";
import { Spinner } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const root = import.meta.env.VITE_ROOT;

const DeleteDialog = ({ isOpen, onClose, runFetch, id }) => {
  const showToast = useToast()
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteProduct = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setDeleteLoading(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${root}/admin/delete-product/${id}`,
        { headers: { Authorization: `Bearer ${retrToken}` } }
      );

      setDeleteLoading(false);
      showToast({
        type:"success",
        message:"Deleted Successfully"
      })
     
      onClose();
      runFetch();
    } catch (error) {
      setDeleteLoading(false);
      showToast({
        message: error.message || "An error occurred",
        type:"error"
      })
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[101]">
      <div className="relative bg-white p-6 rounded-md shadow-md w-[90vw] max-w-[450px]">
        <h2 className="text-[17px] font-medium text-black">Delete Product</h2>
        <p className="mt-4 text-center text-[15px] text-black">
          Are you sure you want to delete this product?
        </p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium"
          >
            No
          </button>
          <button
            disabled={deleteLoading}
            onClick={() => deleteProduct(id)}
            className={`ml-4 bg-blue-500 text-white px-4 py-2 rounded-md font-medium ${
              deleteLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {deleteLoading ? <Spinner /> : "Yes"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

export default DeleteDialog;
