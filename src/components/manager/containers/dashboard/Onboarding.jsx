import React from "react";
import { Progress } from "antd";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Area,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  AreaChart,
} from "recharts";
import { Card } from "@radix-ui/themes";
import mockData from "./mockData";

import SuperAdminDashboardDetails from "./super-admin/SuperAdminDashabordDetails";
const MockDashboard = () => {
  
  const CircularProgress = ({ progress }) => {
    // Clamp the progress value between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    // Calculate if progress is more than half
    const isMoreThanHalf = clampedProgress > 50;

    // Determine the rotation angle
    const rotationAngle = (clampedProgress / 100) * 360;

    return (
      <div className="relative w-[120px] h-[120px]">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

        {/* Left Half Arc */}
        <div
          className={`absolute inset-0 rounded-full border-8 border-transparent ${
            isMoreThanHalf ? "border-blue-500" : "border-gray-200"
          }`}
          style={{
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
            transform: isMoreThanHalf
              ? "rotate(180deg)"
              : `rotate(${rotationAngle}deg)`,
          }}
        ></div>

        {/* Right Half Arc */}
        <div
          className="absolute inset-0 rounded-full border-8 border-blue-500"
          style={{
            clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
            transform: `rotate(${Math.min(rotationAngle, 180)}deg)`,
          }}
        ></div>

        {/* Inner Text */}
        <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">
          {clampedProgress}%
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-5">
        <div className="!w-[75%]">
          <Card>
            <p className="p-4">Current Inventory Level</p>
            <BarChart width={400} height={400} data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Months",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                label={{
                  value: "Units Sold",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              {/* Adjusting the Legend position */}
              <Legend layout="horizontal" verticalAlign="top" align="right" />
              <Tooltip />
              <Bar dataKey="product1" stroke="#cad000" fill="#2563eb" />
              <Bar dataKey="product2" fill="#8b5cf6" />
            </BarChart>
          </Card>
          {/* -------------------------Area Chart-------------- */}
          <Card className="mt-4 flex gap-5">
            <div>
              <p className="p-4">Current Inventory Level</p>
              <AreaChart width={400} height={250} data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Months",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Units Sold",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                {/* Adjusting the Legend position */}
                <Legend layout="horizontal" verticalAlign="top" align="right" />
                <Tooltip />
                <Area
                  dataKey="product1"
                  stroke="#cad000"
                  type={"monotone"}
                  fill="#2563eb"
                />
                <Area dataKey="product2" fill="#8b5cf6" type={"monotone"} />
              </AreaChart>
            </div>

            <div className="drug-details w-full">
              <p className="mb-6 font-bold">Low Stock Alert</p>
              <div className="drug-item mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Abendozole</span>
                  <p className="text-sm">70%</p>
                </div>
                <div className="bg-slate-300 w-full h-[15px] rounded-[999px]">
                  <div className=" bg-neutral-700 rounded-[999px] w-[70%] h-[15px]"></div>
                </div>
              </div>
              <div className="drug-item mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Abendozole</span>
                  <p className="text-sm">70%</p>
                </div>
                <div className="bg-slate-300 w-full h-[15px] rounded-[999px]">
                  <div className=" bg-neutral-700 rounded-[999px] w-[70%] h-[15px]"></div>
                </div>
              </div>
              <div className="drug-item mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Abendozole</span>
                  <p className="text-sm">70%</p>
                </div>
                <div className="bg-slate-300 w-full h-[15px] rounded-[999px]">
                  <div className=" bg-neutral-700 rounded-[999px] w-[70%] h-[15px]"></div>
                </div>
              </div>
              <div className="drug-item mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Abendozole</span>
                  <p className="text-sm">85%</p>
                </div>
                <div className="bg-slate-300 w-full h-[15px] rounded-[999px]">
                  <div className=" bg-neutral-700 rounded-[999px] w-[85%] h-[15px]"></div>
                </div>
              </div>
              <div className="drug-item mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Abendozole</span>
                  <p className="text-sm">60%</p>
                </div>
                <div className="bg-slate-300 w-full h-[15px] rounded-[999px]">
                  <div className=" bg-neutral-700 rounded-[999px] w-[60%] h-[15px]"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="percent-boxes !w-[25%]">
          <Card className="p-4 mb-4">
            <div className="raw-box">
              <p className="font-medium">% of Raw Materials in stock</p>
              <br />
              <Progress type="circle" percent={75} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="raw-box">
              <span className="font-medium">% of Products in stock</span>
              <Progress type="circle" percent={49} strokeColor={"#78a"} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

const Onboarding = () =>{
  return (
    <>
    {/* <MockDashboard/> */}
    <SuperAdminDashboardDetails/>
    </>
  )
}

export default Onboarding;

// {/* <Card className="p-6 shadow-lg border rounded-md bg-white">
//   <Heading size="3" className="mb-4 text-center">
//     Polema Dashboard
//   </Heading>
//   <Text size="2" className="text-gray-600 text-center">
//     Manage your tasks seamlessly and stay organized. Use the navigation
//     menu to explore action tabs tailored to your role and
//     responsibilities. Each action tab is designed to streamline your
//     workflow and enhance productivity.
//   </Text>
// </Card> */}
