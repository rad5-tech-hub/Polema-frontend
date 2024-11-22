import React from "react";
import { Text, TextField } from "@radix-ui/themes";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;
import toast, { Toaster, LoaderIcon } from "react-hot-toast";

const AddModal = ({ isOpen, onClose, item, runFetch }) => {
  if (!isOpen) return null;
  const [addQuantity, setAddQuantity] = React.useState("");
  const [butonLoading, setButtonLoading] = React.useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setButtonLoading(true);

    if (!token) {
      toast.error("An error occured,try logging again");
      return;
    }

    try {
      const response = await axios.patch(
        `${root}/dept/add-quantity-gen/${item.id}`,
        {
          amount: addQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setButtonLoading(false);
      toast.success("Added successfully", {
        style: {
          padding: "20px",
        },
      });
      setTimeout(() => {
        onClose();
      }, 2000);
      runFetch();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
      toast.error("An error occured,try again");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
        <div className="bg-white p-6 relative rounded-lg w-[550px] h-[70vh]">
          <h2 className="text-xl font-bold mb-4">Add Item</h2>

          <form action="" onSubmit={handleAdd}>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Shelf Name</Text>
              <TextField.Root
                disabled
                type="text"
                className="w-full p-2 mb-4"
                placeholder={item.name}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Unit</Text>
              <TextField.Root
                type="text"
                disabled
                className="w-full p-2 mb-4"
                placeholder={item?.unit || ""}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Threshold Value</Text>
              <TextField.Root
                type="text"
                disabled
                className="w-full p-2 mb-4"
                placeholder={item?.thresholdValue || ""}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Quantity</Text>
              <TextField.Root
                type="number"
                onChange={(e) => {
                  setAddQuantity(e.target.value);
                }}
                className="w-full p-2 mb-4"
                placeholder={item.quantity || ""}
              />
            </div>
            <div className="btns flex gap-4 absolute bottom-8 right-8">
              <button
                onClick={onClose}
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-8 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Discard
              </button>
              <button
                type="submit"
                className="rounded-xl shadow-md h-[40px] px-8 bg-[#444242] hover:bg-[#444242]/85 text-white"
              >
                {butonLoading ? <LoaderIcon /> : "Add"}
              </button>
            </div>
          </form>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
};

const EditModal = ({ isOpen, onClose, item, runFetch }) => {
  if (!isOpen) return null;

  const [buttonLoading, setButtonLoading] = React.useState(false);
  // State management for form details
  const [shelfName, setShelfName] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [threshold, setThreshold] = React.useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occured, try logging in again");
      return;
    }

    try {
      const response = await axios.patch(
        `${root}/dept/edit-genstore/${item.id}`,
        {
          name: shelfName,
          unit,
          thresholdValue: threshold,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Shelf details updated");
      setButtonLoading(false);
      setTimeout(() => {
        onClose();
      }, 2000);
      runFetch();
    } catch (error) {
      console.log(error);
      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
        <div className="bg-white p-6 relative rounded-lg w-[550px] h-[70vh]">
          <h2 className="text-xl font-bold mb-4">Edit Item</h2>

          <form action="" onSubmit={handleEdit}>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Shelf Name</Text>
              <TextField.Root
                type="text"
                className="w-full p-2 mb-4"
                value={shelfName}
                onChange={(e) => {
                  setShelfName(e.target.value);
                }}
                placeholder={item.name}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Unit</Text>
              <TextField.Root
                type="text"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
                className="w-full p-2 mb-4"
                placeholder={item?.unit || ""}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Threshold Value</Text>
              <TextField.Root
                type="text"
                value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                }}
                className="w-full p-2 mb-4"
                placeholder={item?.thresholdValue || ""}
              />
            </div>

            <div className="btns flex gap-4 absolute bottom-8 right-8">
              <button
                onClick={onClose}
                type="button"
                className="border-[1px] rounded-xl shadow-md h-[40px] px-8 border-[#919191] bg-white hover:bg-gray-50 text-[#919191]"
              >
                Discard
              </button>
              <button
                type="submit"
                className="rounded-xl shadow-md h-[40px] px-8 bg-[#444242] hover:bg-[#444242]/85 text-white"
              >
                {buttonLoading ? <LoaderIcon /> : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

const RemoveModal = ({ isOpen, onClose, item }) => {
  if (!isOpen) return null;

  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState("");

  const handleRemove = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred,try logging agaain");
      return;
    }
    try {
      const response = await axios.patch(
        `${root}/dept/remove-quantity-gen/${item.id}`,
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
      toast.success("Removed Succesfully");
      setTimeout(() => {
        onClose();
      }, 2000);
      runFetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred,try again"
      );

      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]">
        <div className="bg-white p-6 relative rounded-lg w-[550px] h-[70vh]">
          <h2 className="text-xl font-bold mb-4">Remove Item</h2>

          <form action="" onSubmit={handleRemove}>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Shelf Name</Text>
              <TextField.Root
                disabled
                type="text"
                className="w-full p-2 mb-4"
                placeholder={item.name}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Unit</Text>
              <TextField.Root
                type="text"
                disabled
                className="w-full p-2 mb-4"
                placeholder={item?.unit || ""}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Threshold Value</Text>
              <TextField.Root
                type="text"
                disabled
                className="w-full p-2 mb-4"
                placeholder={item?.thresholdValue || ""}
              />
            </div>
            <div className="flex mt-2 items-center w-full">
              <Text className="w-full">Quantity</Text>
              <TextField.Root
                type="number"
                className="w-full p-2 mb-4"
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                placeholder={item.quantity || ""}
              />
            </div>
            <div className="btns flex gap-4 absolute bottom-8 right-8">
              <button
                onClick={onClose}
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

export { AddModal, EditModal, RemoveModal };
