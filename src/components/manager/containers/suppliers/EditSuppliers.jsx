import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditSuppliers = ({ isOpen, onClose, fetchSuppliers, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState(id.firstname);
  const [changedLastName, setChangedLastName] = useState(id.lastname);
  const [changedEmail, setChangedEmail] = useState(id.email);
  const [changedPhone, setChangedPhone] = useState(id.phoneNumber);
  const [changedAddress, setChangedAddress] = useState(id.address);

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
      phoneNumber: changedPhone,
      ...(changedEmail && { email: changedEmail }),
      address: changedAddress,
    };

    try {
      await axios.patch(`${root}/customer/edit-supplier/${id.id}`, body, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      toast.success("Supplier edited successfully", {
        duration: 6500,
        style: { padding: "30px" },
      });
      fetchSuppliers();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
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
              htmlFor="phone"
              className="block text-sm font-medium text-black"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="number"
              placeholder="Enter Phone Number"
              defaultValue={id.phoneNumber}
              onChange={(e) => setChangedPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
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
