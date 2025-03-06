import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import mockData from "./mockData";

const SuperAdminDashboardDetails = () => {
  const [chartWidth, setChartWidth] = useState(850);
  const [customers, setCustomers] = useState(0);
  const [suppliers, setSuppliers] = useState(0);
  const [products, setProducts] = useState(0);
  const [rawMaterials, setRawMaterials] = useState(0);

  const customerTarget = 78;
  const supplierTarget = 45;
  const productTarget = 67;
  const rawMaterialTarget = 32;

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(500, Math.min(window.innerWidth - 50, 850));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Counter animation function
  const animateCounter = (setCount, targetValue, duration = 2000) => {
    let start = 0;
    const increment = targetValue / (duration / 50); // Calculate step
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

  useEffect(() => {
    animateCounter(setCustomers, customerTarget);
    animateCounter(setSuppliers, supplierTarget);
    animateCounter(setProducts, productTarget);
    animateCounter(setRawMaterials, rawMaterialTarget);
  }, []);

  return (
    <>
      {/* Data Summary Boxes with Animated Counters */}
      <div className="data-boxes flex gap-2 text-white mt-6">
        <div className="bg-[#2563eb] min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Customers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{customers}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Suppliers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{suppliers}</p>
        </div>
        <div className="bg-[#2563eb] min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Products</h1>
          <p className="text-center text-[3rem] font-amsterdam">{products}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Raw Materials</h1>
          <p className="text-center text-[3rem] font-amsterdam">{rawMaterials}</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="customer-stats mt-8">
        <h1 className="font-bold font-amsterdam">Customer Performance</h1>
        <BarChart
          className="w-full"
          width={chartWidth}
          height={500}
          data={mockData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: "Months", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "Units Sold", angle: -90, position: "insideLeft" }}
          />
          <Legend layout="horizontal" verticalAlign="top" align="right" />
          <Tooltip />
          <Bar dataKey="product1" stroke="#cad000" fill="#2563eb" />
          <Bar dataKey="product2" fill="#8b5cf6" />
        </BarChart>
      </div>
    </>
  );
};

export default SuperAdminDashboardDetails;
