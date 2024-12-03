import axios from "axios";
import React from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;
const EditProductModal = ({ closeModal, product, runFetch }) => {
  const [quantity, setQuantity] = React.useState("");
  const [thresholdVal, setThresholdVal] = React.useState("");
  const [buttonLoading, setButtonLoading] = React.useState(false);

  // Function to submit form details
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);

    if (!token) {
      toast.error("An error occured,try logging again");
      return;
    }

    try {
      const response = await axios.patch(
        `${root}/dept/edit-deptstore/${product.id}`,
        {
          // quantity: quantity,
          thresholdValue: thresholdVal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Successfully edited", {
        duration: 4000,
      });
      setButtonLoading(false);
      closeModal();
      runFetch();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
        <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
          <b className="text-[20px]">Edit</b>

          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                disabled
                placeholder={product?.product.name || "Show product name"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="quantityRemoved">Quantity</label>
              <input
                type="text"
                // value={quantity}
                value={product.quantity}
                disabled
                required
                // onChange={(e) => {
                //   setQuantity(e.target.value);
                // }}
                placeholder={product?.quantity || "Enter Quantity"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
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
              <label htmlFor="quantityRemoved">Threshold Value</label>
              <input
                type="text"
                required
                placeholder={product?.thresholdValue || "Enter threshold value"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
                onChange={(e) => {
                  setThresholdVal(e.target.value);
                }}
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
                {buttonLoading ? <LoaderIcon /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default EditProductModal;
