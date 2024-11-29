import React from "react";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster, LoaderIcon } from "react-hot-toast";

const DeleteProductModal = ({ closeModal, product, runFetch }) => {
  // State management for form details
  const [quantity, setQuantity] = React.useState("");
  const [buttonLoading, setButtonLoading] = React.useState(false);

  // Function to delete prodduct
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);

    if (!token) {
      toast.error("An error occured, try logging in again", {
        style: {
          padding: "20px",
        },
        duration: 5500,
      });
    }

    // if (quantity > product.quantity) {
    //   toast.error("Add a value lesser in quantity", {
    //     duration: 4500,
    //   });
    //   setButtonLoading(false);
    //   return;
    // }

    try {
      const response = await axios.patch(
        `${root}/dept/remove-quantity-dept/${product.id}`,
        {
          amount: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setButtonLoading(false);
      closeModal();
      runFetch();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      if (error.status === 400) {
        toast.error(
          "Insufficient quantity in the store to remove this amount",
          {
            style: {
              padding: "20px",
            },
            duration: 5000,
          }
        );
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
        <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
          <b className="text-[20px]">Remove</b>

          <form
            className="mt-8 flex flex-col gap-6"
            onSubmit={handleDeleteSubmit}
          >
            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                placeholder={product?.product.name || "Show product name"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                readOnly
                disabled
              />
            </div>

            <div className="unit flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                placeholder={product?.unit || "Show Unit"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                readOnly
                disabled
              />
            </div>

            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="quantityRemoved">Quantity Removed</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                placeholder="Enter Quantity"
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="btns flex gap-4 absolute bottom-8 right-8">
              <button
                onClick={closeModal}
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-8 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Discard
              </button>
              <button
                type="submit"
                className="rounded-xl shadow-md h-[40px] px-8 bg-[#444242] hover:bg-[#444242]/85 text-white"
              >
                {buttonLoading ? <LoaderIcon /> : "Remove"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default DeleteProductModal;
