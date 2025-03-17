import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { formatMoney } from "../../../../date";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
const API_ROOT = import.meta.env.VITE_ROOT;

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ff4560", "#00c49f", "#ffbb28", "#ff8042"];

const App = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [returnedDateRange, setReturnedDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState([]);
  const [bankNames, setBankNames] = useState([]);

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
    // console.log("Fetching from URL:", url);

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("API Response:", response.data);

      const detailsArray = response.data?.data || [];
      const apiStartDate = response.data.startDate || "N/A";
      const apiEndDate = response.data.endDate || "N/A";
      setReturnedDateRange({ start: apiStartDate, end: apiEndDate });

      const hasValidPeriods = detailsArray.some(
        (item) => item.transactionPeriod && item.transactionPeriod.trim() !== ""
      );
      // console.log("Has Valid Periods:", hasValidPeriods); // Debug period check

      let formattedData;
      if (hasValidPeriods) {
        const periodMap = {};
        detailsArray.forEach((item) => {
          const period = item.transactionPeriod || null;
          if (period) {
            const bank = item.bankName || "Unknown Bank";
            const totalAmount = parseFloat(item.totalAmount) || 0;

            if (!periodMap[period]) {
              periodMap[period] = { period };
            }
            periodMap[period][bank] = totalAmount;
          }
        });

        const uniqueBanks = [...new Set(detailsArray.map((item) => item.bankName || "Unknown Bank"))];
        setBankNames(uniqueBanks);
        // console.log("Unique Banks (with periods):", uniqueBanks);

        formattedData = Object.values(periodMap).map((periodData) => {
          const dataPoint = { period: periodData.period };
          uniqueBanks.forEach((bank) => {
            dataPoint[bank] = periodData[bank] || 0;
          });
          return dataPoint;
        });
      } else {
        const singlePeriod = `${apiStartDate.split(" ")[0]} to ${apiEndDate.split(" ")[0]}`;
        const periodMap = { [singlePeriod]: { period: singlePeriod } };

        const uniqueBanks = [...new Set(detailsArray.map((item) => item.bankName || "Unknown Bank"))];
        setBankNames(uniqueBanks);
        // console.log("Unique Banks (no periods):", uniqueBanks);

        detailsArray.forEach((item) => {
          const bank = item.bankName || "Unknown Bank";
          const totalAmount = parseFloat(item.totalAmount) || 0;
          periodMap[singlePeriod][bank] = (periodMap[singlePeriod][bank] || 0) + totalAmount;
        });

        formattedData = Object.values(periodMap).map((periodData) => {
          const dataPoint = { period: periodData.period };
          uniqueBanks.forEach((bank) => {
            dataPoint[bank] = periodData[bank] || 0;
          });
          return dataPoint;
        });
      }

      console.log("Formatted Chart Data:", formattedData);
      if (formattedData.length === 0 || formattedData.every((d) => Object.values(d).slice(1).every((v) => v === 0))) {
        // console.log("No meaningful data to display.");
        toast.error("No meaningful data to display.");
        setChartData([]);
      } else {
        setChartData(formattedData);
      }
    } catch (error) {
      // console.error("Fetch Error:", error.response?.data || error.message);
      toast.error("Error fetching bank summary data. Please try again.");
    }
  }, []);

  useEffect(() => {
    console.log("Date Range Changed:", dateRange);
    fetchBankSummary(dateRange.startDate, dateRange.endDate); // Fixed typo
  }, [dateRange, fetchBankSummary]);

  // Log chartData updates
  useEffect(() => {
    // console.log("Chart Data Updated:", chartData);
    // console.log("Bank Names Updated:", bankNames);
  }, [chartData, bankNames]);

  return (
    <>
      <div className="relative mt-4">
        <h1 className="font-bold font-amsterdam">Bank Summary</h1>

        <div className="mb-4">
          <p>
            {/* Showing data from {returnedDateRange.start} to {returnedDateRange.end} */}
          </p>
        </div>

        <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                domain={[0, "auto"]}
                tick={{ fontSize: 9 }}
                tickFormatter={(value) => formatMoney(value)}
              />
              <Tooltip
                formatter={(value) => formatMoney(value)}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p><strong>Period:</strong> {data.period}</p>
                        {bankNames.map((bank) => (
                          <p key={bank}>
                            <strong>{bank}:</strong> ₦{formatMoney(data[bank])}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {bankNames.map((bank, index) => (
                <Bar
                  key={bank}
                  dataKey={bank}
                  fill={COLORS[index % COLORS.length]}
                  name={bank}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="date-picker absolute right-0 top-0">
          <RangePicker
            onCalendarChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                const newRange = {
                  startDate: dates[0].format("YYYY-MM-DD"),
                  endDate: dates[1].format("YYYY-MM-DD"),
                };
                setDateRange(newRange);
              } else {
                setDateRange({ startDate: "", endDate: "" });
              }
            }}
            allowClear
          />
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default App;