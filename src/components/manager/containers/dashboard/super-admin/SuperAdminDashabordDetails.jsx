import React, { useState, useEffect } from "react";
import { Grid } from "@radix-ui/themes";
import mockData from "../mockData";

// import Dashboard Components
import CustomerPerformanceChart from "./CustomerPerformanceChart";
import DepartmentPerformanceChart from "./DepartmentPerformanceChart";
import SummaryBoxes from "./SummaryBoxes";
import BankSummaryCharts from "./BankSummaryCharts";
import SalesPerformance from "./SalesPerformance";

const SuperAdminDashboardDetails = () => {
  return (
    <>
      {/* Boxes showing customers ,suppliers , products , raw materials  */}
      <SummaryBoxes />

      {/* <div className="grid grid-cols-2 gap-5 mt-4"> */}

      <div className="shadow-lg p-4 mt-4 rounded">
        {/* Bar Chart Section */}
        <CustomerPerformanceChart />
      </div>

      <div className="shadow-lg p-4 mt-4 mb-4 rounded">
        {/* Department Performance  */}
        <DepartmentPerformanceChart />
      </div>
      {/* </div> */}

      <div className="shadow-lg p-4 mt-4 mb-4 rounded">
        {/* Bank Summary Charts  */}
        <BankSummaryCharts />
      </div>

      {/* Sales Performance  */}
      <div className="shadow-lg p-4 mt-4 mb-4 rounded">
      <SalesPerformance/>
</div>
    </>
  );
};

export default SuperAdminDashboardDetails;
