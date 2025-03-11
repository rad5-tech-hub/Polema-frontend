import React, { useState, useEffect } from "react";
import { refractor } from "../../../../date";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import { DatePicker } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const { RangePicker } = DatePicker;

const CustomerPerformanceChart = () => {
  const [chartWidth, setChartWidth] = useState(850);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [returnedDateRange, setReturnedDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState([]);

  // Fetch customerPerformance
  const fetchCustomerPerformance = async (startDate, endDate) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You have invalid permissions to view this dashboard", {
        style: { padding: "20px" },
        duration: 3500,
      });
      return;
    }

    let url = startDate && endDate
      ? `${root}/admin/top-customers?startDate=${startDate}&endDate=${endDate}`
      : `${root}/admin/top-customers`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response);
      
      const detailsArray = response.data.data || [];

      // Update returned date range
      setReturnedDateRange({ start: response.data.startDate || "N/A", end: response.data.endDate || "N/A" });

      // Transform the API response to match the chart format
      const formattedData = detailsArray.map((customer) => ({
        name: `${customer.firstName} ${customer.lastName}`,
        totalCredit: parseFloat(customer.totalCredit),
        totalDebit: parseFloat(customer.totalDebit),
      }));

      setChartData(formattedData);
    } catch (error) {
      console.log(error);
      
      toast.error("Error fetching data. Please try again.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(500, Math.min(window.innerWidth - 50, 850));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCustomerPerformance(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  return (
    <div className="customer-stats mt-8 relative">
      <h1 className="font-bold font-amsterdam">Customer Performance</h1>

      {chartData.length > 0 ? (
        <BarChart className="mt-4 mx-auto" width={chartWidth} height={500} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, "auto"]} tick={{ fontSize: 9 }} tickFormatter={(value) => value.toLocaleString()} />
          <Legend layout="horizontal" verticalAlign="top" align="right" />
          <Tooltip />
          <Bar dataKey="totalCredit" fill="#434343" barSize={45} />
          <Bar dataKey="totalDebit" fill="#e1e1e1" barSize={45} />
        </BarChart>
      ) : (
      <>
      <div className="w-full h-[50vh] flex justify-center items-center">
         
        <p className="text-center mt-4 text-gray-500">
          No top customers from <b>{refractor(returnedDateRange.start)}</b> to <b>{refractor(returnedDateRange.end)}</b>.
        </p>
      </div>
      </>
      )}

      {/* Date Picker */}
      <div className="date-picker absolute right-0 top-0">
        <RangePicker
          onCalendarChange={(e) => {
            if (e && e[0] && e[1]) {
              setDateRange({
                startDate: e[0].format("YYYY-MM-DD"),
                endDate: e[1].format("YYYY-MM-DD"),
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default CustomerPerformanceChart;
