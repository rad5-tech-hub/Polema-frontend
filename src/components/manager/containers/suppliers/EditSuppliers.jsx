import React, { useState } from "react";
import useToast from "../../../../hooks/useToast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditSuppliers = ({ isOpen, onClose, fetchSuppliers, id }) => {
  const showToast = useToast()
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangedLastName] = useState(id.lastname);
  const [changedEmail, setChangedEmail] = useState(id.email);
  const [changedPhone, setChangedPhone] = useState(
    Array.isArray(id.phoneNumber)
      ? id.phoneNumber.length > 0
        ? id.phoneNumber
        : [""]
      : id.phoneNumber
      ? [String(id.phoneNumber)]
      : [""]
  );
  const [changedAddress, setChangedAddress] = useState(id.address);

  const handleAddNumber = () => {
    setChangedPhone([...(changedPhone || []), ""]);
  };

  const handleRemoveNumber = (index) => {
    if (!Array.isArray(changedPhone) || changedPhone.length === 1) return;
    const next = changedPhone.filter((_, i) => i !== index);
    setChangedPhone(next.length ? next : [""]);
  };

  const handleNumberChange = (value, index) => {
    const next = [...changedPhone];
    next[index] = value;
    setChangedPhone(next);
  };

  const EditSupplier = async () => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    const body = {
      firstname: changedFirstName,
      lastname: changedLastName,
      phoneNumber: (Array.isArray(changedPhone) ? changedPhone : [changedPhone]).filter(
        (n) => String(n).trim() !== ""
      ),
      ...(changedEmail && { email: changedEmail }),
      address: changedAddress,
    };

    try {
      await axios.patch(`${root}/customer/edit-supplier/${id.id}`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      showToast({
        message:"Supplier Details Edited Successfully",
        duration:5000,
        type:"success"
      })
      
      fetchSuppliers();
      onClose();
    } catch (error) {
      showToast({
        message:
          error.response?.data?.error ||
          error.message ||
          "An error occurred while editing supplier details",
        type:"error",
        duration:5000,
      });
      
    } finally {
      setSuspendLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="bg-white p-6 max-w-lg w-full rounded shadow-lg relative">
        <h1 className="text-xl font-semibold mb-4">Edit Supplier</h1>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-black"
            >
              First Name
            </label>
            <input
              id="firstname"
              type="text"
              placeholder="Enter First Name"
              defaultValue={id.firstname}
              onChange={(e) => setChangedFirstName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-black"
            >
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              placeholder="Enter Last Name"
              defaultValue={id.lastname}
              onChange={(e) => setChangedLastName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email Address
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={id.email}
              onChange={(e) => setChangedEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-black"
            >
              Phone Numbers
            </label>
            {(changedPhone || [""]).map((num, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Enter Phone Number"
                  value={num}
                  onChange={(e) => handleNumberChange(e.target.value, idx)}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNumber(idx)}
                  disabled={(changedPhone || [""]).length === 1}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white !px-3 !py-2 rounded"
                  aria-label="Remove phone number"
                >
                  ×
                </button>
                {idx === (changedPhone || [""]).length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddNumber}
                    className="bg-blue-500 hover:bg-blue-600 text-white !px-3 !py-2 rounded"
                    aria-label="Add phone number"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-black"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Enter Address"
              defaultValue={id.address}
              onChange={(e) => setChangedAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          >
            No
          </button>
          <button
            onClick={EditSupplier}
            disabled={suspendLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {suspendLoading ? <LoaderIcon /> : "Yes"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

export default EditSuppliers;
