import React, { useState } from "react";
import axios from "axios";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

const AddProductModal = ({
  closeModal,
  product,

  runFetch,
  onAddProduct,
}) => {
  const [quantity, setQuantity] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const root = import.meta.env.VITE_ROOT;

  // Function to handle product addition submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    if (quantity < product.quantity) {
      toast.error("Add a value higher in quantity", {
        duration: 4500,
      });
      setButtonLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${root}/dept/edit-deptstore/${product.id}`,
        {
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product added successfully!");
      setButtonLoading(false);
      closeModal();
      runFetch();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("An error occurred, try again later.");
      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
        <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
          <b className="text-[20px]">Add Product</b>

          {/* Form for adding product details */}
          <form
            className="mt-8 flex flex-col gap-6"
            onSubmit={handleAddProduct}
          >
            {/* Product Name */}
            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                placeholder={product.product.name || "Show product name"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                readOnly
                disabled
              />
            </div>

            {/* Unit */}
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

            {/* Quantity */}
            <div className="quantity flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                required
              />
            </div>

            {/* Threshold Value */}
            <div className="thresholdValue flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="thresholdValue">Threshold Value</label>
              <input
                type="number"
                disabled
                placeholder={product.thresholdValue}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                required
              />
            </div>

            {/* Action Buttons */}
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
                {buttonLoading ? <LoaderIcon /> : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default AddProductModal;
