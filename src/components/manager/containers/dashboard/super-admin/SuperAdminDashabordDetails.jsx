import React, { useState, useEffect } from "react";
import {Grid} from "@radix-ui/themes"
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
     
     {/* <div className="grid grid-cols-2 gap-5 mt-4"> */}

      <div className="shadow-md p-4 mt-4">
        
      {/* Bar Chart Section */}
      <CustomerPerformanceChart />
      </div>

      {/* Department Performance  */}
      <DepartmentPerformanceChart/>

     {/* </div> */}

      {/* Bank Summary Charts  */}
      <BankSummaryCharts/>
    </>
  );
};

export default SuperAdminDashboardDetails;
