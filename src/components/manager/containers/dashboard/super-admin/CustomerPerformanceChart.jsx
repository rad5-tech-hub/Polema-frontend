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
import mockData from "../mockData";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;
const CustomerPerformanceChart = () => {
  const [chartWidth, setChartWidth] = useState(850);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(500, Math.min(window.innerWidth - 50, 850));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <div className="customer-stats mt-8">
        <h1 className="font-bold font-amsterdam">Customer Performance</h1>
        <BarChart
          className="w-full"
          width={chartWidth}
          height={500}
          data={mockData}>
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
          <Bar dataKey="product1" fill="#434343" />
          <Bar dataKey="product2" fill="#e1e1e1" />
        </BarChart>
        {/* Date Picker  */}
        <div className="date-picker">
          <RangePicker />
        </div>
      </div>
    </>
  );
};

export default CustomerPerformanceChart;
