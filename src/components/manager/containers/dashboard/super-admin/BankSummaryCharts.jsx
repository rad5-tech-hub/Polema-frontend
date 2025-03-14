// Filename - App.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BarChart, Bar, XAxis, Tooltip, YAxis, CartesianGrid } from "recharts";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
const API_ROOT = import.meta.env.VITE_ROOT;

const App = () => {
  const [chartWidth, setChartWidth] = useState(950);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [returnedDateRange, setReturnedDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState([]);

  // Adjust chart width on window resize
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(Math.max(500, Math.min(window.innerWidth - 50, 850)));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to fetch bank summary data
  const fetchBankSummary = useCallback(async (startDate, endDate) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred. Try logging in again.");
      return;
    }

    let url = `${API_ROOT}/admin/bank-performance`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const detailsArray = response.data?.data || [];
      setReturnedDateRange({
        start: response.data.startDate || "N/A",
        end: response.data.endDate || "N/A",
      });

      const formattedData = detailsArray.map((item) => ({
        name: item.bankName,
        totalCredit: parseFloat(item.totalCredit) || 0,
        totalDebit: parseFloat(item.totalDebit) || 0,
      }));

      setChartData(formattedData);
    } catch (error) {
      toast.error("Error fetching bank summary data. Please try again.");
    }
  }, []);

  // Fetch data when date range changes
  useEffect(() => {
    fetchBankSummary(dateRange.startDate, dateRange.endDate);
  }, [dateRange, fetchBankSummary]);

  return (
    <>
      <div className="relative mt-4">
        <h1 className="font-bold font-amsterdam">Bank Summary</h1>

        {/* Chart Component */}
        <BarChart width={chartWidth} height={500} data={chartData} className="mt-4">
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="name" />
          <YAxis
            domain={[0, "auto"]}
            tick={{ fontSize: 9 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Bar dataKey="totalCredit" stackId="a" fill="#8884d8" />
          <Bar dataKey="totalDebit" stackId="a" fill="#82ca9d" />
        </BarChart>

        {/* Date Picker */}
        <div className="date-picker absolute right-0 top-0">
          <RangePicker
            onCalendarChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange({
                  startDate: dates[0].format("YYYY-MM-DD"),
                  endDate: dates[1].format("YYYY-MM-DD"),
                });
              }
            }}
          />
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
