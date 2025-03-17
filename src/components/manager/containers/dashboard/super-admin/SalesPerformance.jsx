import React, { useState, useEffect } from "react";
import { formatMoney } from "../../../../date"; // Assuming refractor is elsewhere or a typo
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import mockData from "../mockData"; // Unused in this snippet—remove if not needed
import { DatePicker } from "antd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

const SalesPerformance = () => {
  const [chartWidth, setChartWidth] = useState(850);
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [returnedDateRange, setReturnedDateRange] = useState({
    start: "",
    end: "",
  });

  // Fetch chart data
  const fetchChartData = async (startDate, endDate) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You have invalid permissions to view this dashboard", {
        style: { padding: "20px" },
        duration: 3500,
      });
      return;
    }

    let url =
      startDate && endDate
        ? `${root}/admin/sales-performance?startDate=${startDate}&endDate=${endDate}`
        : `${root}/admin/sales-performance`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Debug API response

      const detailsArray = response.data?.data || [];
      setReturnedDateRange({
        start: response.data.startDate || "N/A",
        end: response.data.endDate || "N/A", // Fixed typo: was startDate twice
      });

      const formattedData = detailsArray.map((customer) => ({
        date: customer.date,
        totalSales: parseFloat(customer.totalSales) || 0,
      }));

      console.log("Formatted Chart Data:", formattedData); // Debug chart data
      setChartData(formattedData);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      toast.error("Error fetching department performance data. Please try again.");
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(500, Math.min(window.innerWidth - 50, 850));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data on date range change
  useEffect(() => {
    console.log("Date Range Changed:", dateRange); // Debug date range
    fetchChartData(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  return (
    <>
      <div className="department-stats mt-8 relative">
        <h1 className="font-bold font-amsterdam">Sales Performance</h1>

        {chartData.length > 0 ? (
          <BarChart
            className="mt-4 mx-auto"
            width={chartWidth}
            height={500}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 9 }}
              tickFormatter={(value) => formatMoney(value)} // Applied to Y-axis too
            />
            <Legend layout="horizontal" verticalAlign="top" align="right" />
            <Tooltip
              formatter={(value) => formatMoney(value)} // Format tooltip values
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p><strong>Date:</strong> {data.date}</p>
                      <p><strong>Total Sales:</strong> ₦{formatMoney(data.totalSales)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="totalSales" fill="#434343" barSize={45} />
          </BarChart>
        ) : (
          <div className="w-full h-[50vh] flex justify-center items-center">
            <p className="text-center mt-4 text-gray-500">
              No top performing department from{" "}
              <b>{returnedDateRange.start}</b> to <b>{returnedDateRange.end}</b>.
            </p>
          </div>
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
              } else {
                setDateRange({ startDate: "", endDate: "" });
              }
            }}
          />
        </div>
      </div>
      <Toaster position="top-right" /> {/* Added Toaster */}
    </>
  );
};

export default SalesPerformance;