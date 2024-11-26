import React from "react";
import { Spinner } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const RemoveModal = ({ closeModal, product, runFetch }) => {
  const [quantity, setQuantity] = React.useState("");
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        style: {
          padding: "20px",
        },
        duration: 6000,
      });
      return;
    }

    try {
      const response = await axios.patch(
        `${root}/dept/remove-quantity-pharm/${product.id}`,
        {
          amount: quantity,
        }
      );

      setTimeout(() => {
        closeModal();
      }, 2500);

      runFetch();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      toast.error(
        error.response?.data?.message || "An error occured ,try again later",
        {
          style: {
            padding: "20px",
          },
          duration: 5000,
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
      <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
        <b className="text-[20px]">Remove</b>

        <form
          className="mt-8 flex flex-col gap-6"
          onSubmit={handleDeleteSubmit}
        >
          <div className="productName flex gap-4 max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              placeholder={product?.product.name || "Show product name"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              readOnly
              disabled
            />
          </div>

          <div className="unit flex  gap-4  max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              placeholder={product?.unit || "Show Unit"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              readOnly
              disabled
            />
          </div>

          <div className="productName  gap-4  flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="quantityRemoved">Quantity </label>
            <input
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              type="text"
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
              {buttonLoading ? <Spinner /> : "Remove"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default RemoveModal;
