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

// import Dashboard Components 
import CustomerPerformanceChart from "./CustomerPerformanceChart";
import DepartmentPerformanceChart from "./DepartmentPerformanceChart";
import SummaryBoxes from "./SummaryBoxes";
import BankSummaryCharts from "./BankSummaryCharts";

const SuperAdminDashboardDetails = () => {
  

  return (
    <>
      {/* Boxes showing customers ,suppliers , products , raw materials  */}
      <SummaryBoxes/>
     

      {/* Bar Chart Section */}
      <CustomerPerformanceChart />

      {/* Department Performance  */}
      <DepartmentPerformanceChart/>

      {/* Bank Summary Charts  */}
      <BankSummaryCharts/>
    </>
  );
};

export default SuperAdminDashboardDetails;
