import React from "react";

const EditModal = ({ closeModal, product }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]">
      <div className="relative lg:w-[40%] w-fit h-[90%] bg-white rounded-lg p-8">
        <b className="text-[20px]">Edit</b>
        <div className="imgEdit flex items-center mt-4 gap-8">
          <div className="imgContainer w-[81px] h-[81px] border-2 border-dashed border-[#9D9D9D] rounded-[10px]"></div>
          <div className="text w-fit text-center">
            <span className="text-[#919191]">Drag image here</span>
            <br />
            <span className="text-[#919191]">or</span>
            <br />
            <span>Browse image</span>
          </div>
        </div>

        <form className="mt-8 flex flex-col gap-6">
          <div className="productName flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              placeholder={product?.product.name || "Enter product name"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
            />
          </div>

          <div className="productId flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="productName">Product ID</label>
            <input
              type="text"
              placeholder={product?.product.id || "Enter Product ID"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
            />
          </div>

          <div className="category flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="productName">Category</label>
            <input
              type="text"
              placeholder={product?.product.id || "Select product category"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
            />
          </div>

          <div className="unit flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              placeholder={product?.unit || "Enter product unit"}
              className="border h-[44px] px-4 lg:w-[273px] rounded-lg"
              readOnly
              disabled
            />
          </div>

          <div className="threshhold-value flex max-sm:flex-col max-sm:items-start justify-between items-center">
            <label htmlFor="">Threshold Value</label>
            <input
              type="text"
              placeholder={product?.thresholdValue || "Enter threshold value"}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
