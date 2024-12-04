import React from "react";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "@radix-ui/themes";

const EditModal = ({ closeModal, product, runFetch }) => {
  const [category, setCategory] = React.useState("");
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [productTag, setProductTag] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [threshold, setThreshold] = React.useState("");

  // Function to submit form details
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);
    if (!token) {
      toast.error("An error occurred , try logging in again", {
        style: {
          padding: "20px",
        },
        duration: 5500,
      });
    }

    const body = {
      ...(category && { category }),
      ...(unit && { unit }),
      // ...(threshold && { thresholdValue: threshold }),
      ...(productTag && { productTag: productTag }),
    };

    try {
      const response = await axios.patch(
        `${root}/dept/edit-pharmstore/${product.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setButtonLoading(true);

      toast.success("Edited Successfully", {
        style: {
          padding: "20px",
        },
        duration: 6000,
      });

      setTimeout(() => {
        closeModal();
      }, 3000);

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
          {/* <div className="imgEdit flex items-center mt-4 gap-8">
          <div className="imgContainer w-[81px] h-[81px] border-2 border-dashed border-[#9D9D9D] rounded-[10px]"></div>
          <div className="text w-fit text-center">
            <span className="text-[#919191]">Drag image here</span>
            <br />
            <span className="text-[#919191]">or</span>
            <br />
            <span>Browse image</span>
          </div>
        </div> */}

          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                disabled
                placeholder={product?.product.name || "Enter product name"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="productId flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Product ID</label>
              <input
                type="text"
                value={productTag}
                onChange={(e) => {
                  setProductTag(e.target.value);
                }}
                placeholder={product?.productTag || "Enter Product ID"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="category flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="productName">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                placeholder={product?.category || "Enter product category"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="unit flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(E) => {
                  setUnit(E.target.value);
                }}
                placeholder={product?.unit || "Enter product unit"}
                className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              />
            </div>

            <div className="threshhold-value flex max-sm:flex-col max-sm:items-start justify-between items-center">
              <label htmlFor="">Threshold Value</label>
              <input
                type="text"
                // value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                }}
                disabled
                value={product?.thresholdValue || "Enter threshold value"}
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
                {buttonLoading ? <Spinner /> : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default EditModal;
