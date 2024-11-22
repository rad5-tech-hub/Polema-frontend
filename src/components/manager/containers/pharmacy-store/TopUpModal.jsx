import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TopUpModal = ({ closeModal, product, departmentId, onAddProduct }) => {
  const [quantity, setQuantity] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const root = import.meta.env.VITE_ROOT;

  // Function to handle product addition submission
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!quantity || !thresholdValue) {
      toast.error("Please enter both quantity and threshold value.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // API call to add product with productId in the payload
      const response = await axios.patch(
        `${root}/dept/edit-deptstore`,
        {
          productId: product?.productId, // Ensure productId is passed correctly
          departmentId, // Pass departmentId directly from props
          quantity,
          thresholdValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update product list using callback function from the parent component
      onAddProduct(response.data.product);
      toast.success("Product added successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Unable to add product. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
      <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
        <b className="text-[20px]">Top up</b>

        {/* Image Upload Section */}
        <div className="imgEdit flex items-center mt-4 gap-8">
          <div className="imgContainer w-[81px] h-[81px] border-2 border-dashed border-[#9D9D9D] rounded-[10px]"></div>
        </div>

        {/* Form for adding product details */}
        <form className="mt-8 flex flex-col gap-6" onSubmit={handleAddProduct}>
          {/* Product Name */}
          <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              placeholder={product?.name || "Show product name"}
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpModal;
