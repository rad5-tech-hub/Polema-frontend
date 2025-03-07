import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const SummaryBoxes = () => {
  const [customers, setCustomers] = useState(0);
  const [suppliers, setSuppliers] = useState(0);
  const [products, setProducts] = useState(0);
  const [rawMaterials, setRawMaterials] = useState(0);

  // Counter animation function
  const animateCounter = (setCount, targetValue, duration = 2000) => {
    let start = 0;
    const increment = targetValue / (duration / 50); // Calculate step
    if (targetValue == 0) {
      return;
    }
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);
  };

  // Function to get summary boxes
  const getSummaryBoxes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Insufficient Permissions to view dashboard");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const customerTarget = response.data?.totalCustomers || 0;
      const supplierTarget = response.data?.totalSuppliers || 0;
      const productTarget = response.data?.producedProducts || 0;
      const rawMaterialTarget = response.data?.rawMaterials || 0;

      animateCounter(setCustomers, customerTarget);
      animateCounter(setSuppliers, supplierTarget);
      animateCounter(setProducts, productTarget);
      animateCounter(setRawMaterials, rawMaterialTarget);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error, {
          style: {
            padding: "30px",
          },
          duration: 2000,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          style: {
            padding: "30px",
          },
          duration: 2000,
        });
      }
    }
  };

  useEffect(() => {
    getSummaryBoxes()
  }, []);
  return (
    <>
      {/* Data Summary Boxes with Animated Counters */}
      <div className="data-boxes flex gap-2 text-white mt-6">
        <div className="bg-[#e1e1e1] min-h-[150px] rounded p-5 w-full text-black">
          <h1 className="text-lg font-bold font-space">Customers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{customers}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Suppliers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{suppliers}</p>
        </div>
        <div className="bg-[#e1e1e1] min-h-[150px] rounded p-5 w-full text-black">
          <h1 className="text-lg font-bold font-space">Products</h1>
          <p className="text-center text-[3rem] font-amsterdam">{products}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Raw Materials</h1>
          <p className="text-center text-[3rem] font-amsterdam">
            {rawMaterials}
          </p>
        </div>
      </div>
    </>
  );
};

export default SummaryBoxes;
