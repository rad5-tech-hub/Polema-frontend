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
import mockData from "../mockData";
import { DatePicker, Space } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const { RangePicker } = DatePicker;
const CustomerPerformanceChart = () => {
  const [chartWidth, setChartWidth] = useState(850);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [chartData, setChartData] = useState([
    { name: "Benson", totalCredit: 10, totalDebit: 200 },
  ]);

  // Function to fetch customerPerformance
  const fetchCustomerPerformance = async (startDate, endDate) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You have invalid permissions to view this dashbaord", {
        style: {
          padding: "20px",
        },
        duration: 3500,
      });
      return;
    }
    let url = "";

    if (!startDate && !endDate) {
      url = `${root}/admin/top-customers`;
    } else {
      url = `${root}/admin/top-customers?startDate=${startDate}&endDate=${endDate}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const detailsArray = response.data?.topCustomers || [];

      // Transform the API response to match the chart format
      const formattedData = detailsArray.map((customer) => ({
        name: `${customer.customer.firstName} ${customer.customer.lastName}`,
        totalCredit: parseFloat(customer.totalCredit), // Convert to number
        totalDebit: parseFloat(customer.totalDebit), // Convert to number
      }));

      setChartData(formattedData);
    } catch (error) {}
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
    if (!dateRange.startDate && !dateRange.endDate) {
      fetchCustomerPerformance();
      return;
    }

    fetchCustomerPerformance(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  return (
    <>
      <div className="customer-stats mt-8 relative ">
        <h1 className="font-bold font-amsterdam">Customer Performance</h1>
        <BarChart
          className=" mt-4 mx-auto"
          width={chartWidth}
          height={500}
          data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            // label={{ value: "Months", position: "insideBottom", offset: -10 }}
          />

          <YAxis
            domain={[0, "auto"]}
            tick={{ fontSize: 9 }}
            tickFormatter={(value) => value.toLocaleString()}
          />

          <Legend layout="horizontal" verticalAlign="top" align="right" />
          <Tooltip />
          <Bar dataKey="totalCredit" fill="#434343" barSize={45} />
          <Bar dataKey="totalDebit" fill="#e1e1e1" barSize={45} />
        </BarChart>
        {/* Date Picker  */}
        <div className="date-picker absolute right-0 top-0 ">
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
    </>
  );
};

export default CustomerPerformanceChart;
