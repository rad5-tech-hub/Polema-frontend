import React, { useState, useEffect } from "react";
import { formatMoney,refractor } from "../../../../date";
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
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const { RangePicker } = DatePicker;
const root = import.meta.env.VITE_ROOT;

// Color palette for departments (credit/debit pairs)
const COLORS = {
  credit: ["#8884d8", "#ff7300", "#00c49f", "#ffbb28", "#434343"],
  debit: ["#d1d1ff", "#ffaa66", "#66e6cc", "#ffe066", "#e1e1e1"],
};

const DepartmentPerformanceChart = () => {
  const [chartWidth, setChartWidth] = useState(850);
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [returnedDateRange, setReturnedDateRange] = useState({
    start: "",
    end: "",
  });
  const [departments, setDepartments] = useState([]); // Track unique departments

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
        ? `${root}/admin/dept-performance?startDate=${startDate}&endDate=${endDate}`
        : `${root}/admin/dept-performance`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("API Response:", response.data);

      const detailsArray = response.data?.data || [];
      setReturnedDateRange({
        start: response.data.startDate || "N/A",
        end: response.data.endDate || "N/A",
      });

      // Extract unique departments
      const uniqueDepartments = [
        ...new Set(
          detailsArray.map(
            (item) => item.departmentName || "Unknown Department"
          )
        ),
      ];
      setDepartments(uniqueDepartments);

      // Pivot data by transactionPeriod
      const periodMap = {};
      detailsArray.forEach((item) => {
        const period = item.transactionPeriod || "Unknown Period";
        const dept = item.departmentName || "Unknown Department";
        const totalCredit = parseFloat(item.totalCredit) || 0;
        const totalDebit = parseFloat(item.totalDebit) || 0;

        if (!periodMap[period]) {
          periodMap[period] = { period: period }; // Ensure period is defined as a key
        }
        // Aggregate credit and debit into a single value per department (stacked)
        periodMap[period][dept] =
          (periodMap[period][dept] || 0) + totalCredit + totalDebit; // Total height
        periodMap[period][`${dept}_credit`] = totalCredit; // For tooltip
        periodMap[period][`${dept}_debit`] = totalDebit; // For tooltip
      });

      // Format data for chart
      const formattedData = Object.values(periodMap).map((periodData) => {
        const dataPoint = { period: periodData.period }; // Explicitly set period
        uniqueDepartments.forEach((dept) => {
          dataPoint[dept] = periodData[dept] || 0; // Total for bar height
          dataPoint[`${dept}_credit`] = periodData[`${dept}_credit`] || 0; // For tooltip
          dataPoint[`${dept}_debit`] = periodData[`${dept}_debit`] || 0; // For tooltip
        });
        return dataPoint;
      });

      // console.log("Formatted Chart Data:", formattedData);
      setChartData(formattedData);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      toast.error(
        "Error fetching department performance data. Please try again."
      );
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
    // console.log("Date Range Changed:", dateRange);
    fetchChartData(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  return (
    <>
      <div className="department-stats mt-8 relative">
        <h1 className="font-bold font-amsterdam">Department Performance</h1>

        {chartData.length > 0 ? (
          <BarChart
            className="mt-4 mx-auto"
            width={chartWidth}
            height={500}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 9 }}
              tickFormatter={(value) => formatMoney(value)}
            />
            <Legend layout="horizontal" verticalAlign="top" align="right" />
            <Tooltip
              formatter={(value) => formatMoney(value)}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p>
                        <strong>Period:</strong> {data.period}
                      </p>
                      {departments.map((dept, index) => (
                        <div key={dept}>
                          <p>
                            <strong>{dept} Credit:</strong> ₦
                            {formatMoney(data[`${dept}_credit`])}
                          </p>
                          <p>
                            <strong>{dept} Debit:</strong> ₦
                            {formatMoney(data[`${dept}_debit`])}
                          </p>
                          {/* <p>
                            <strong>{dept} Total:</strong> ₦
                            {formatMoney(data[dept] || 0)}
                          </p> */}
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {departments.map((dept, index) => (
              <Bar
                key={dept}
                dataKey={dept}
                stackId="a" // All departments share a base stack for positioning
                fill={COLORS.credit[index % COLORS.credit.length]} // Base color (ignored due to inner stacking)
              >
                <Bar
                  dataKey={`${dept}_credit`}
                  stackId={dept} // Stack credit within each department
                  fill={COLORS.credit[index % COLORS.credit.length]}
                  name={`${dept} Credit`}
                />
                <Bar
                  dataKey={`${dept}_debit`}
                  stackId={dept} // Stack debit on top of credit
                  fill={COLORS.debit[index % COLORS.debit.length]}
                  name={`${dept} Debit`}
                />
              </Bar>
            ))}
          </BarChart>
        ) : (
          <div className="w-full h-[50vh] flex justify-center items-center">
            <p className="text-center mt-4 text-gray-500">
              No top performing department from <b>{refractor(returnedDateRange.start)}</b>{" "}
              to <b>{refractor(returnedDateRange.end)}</b>.
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
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default DepartmentPerformanceChart;
