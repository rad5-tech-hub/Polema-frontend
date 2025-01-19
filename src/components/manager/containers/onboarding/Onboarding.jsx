import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Area,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  AreaChart,
} from "recharts";
import { Card } from "@radix-ui/themes";

const Onboarding = () => {
  const mockData = [
    {
      name: "Jan",
      product1: 450,
      product2: 50,
    },
    {
      name: "Feb",
      product1: 250,
      product2: 400,
    },
    {
      name: "Mar",
      product1: 200,
      product2: 450,
    },
    {
      name: "Apr",
      product1: 800,
      product2: 450,
    },
    {
      name: "May",
      product1: 800,
      product2: 450,
    },
    {
      name: "Jun",
      product1: 800,
      product2: 450,
    },
    {
      name: "Jul",
      product1: 800,
      product2: 450,
    },
    {
      name: "Aug",
      product1: 800,
      product2: 450,
    },
  ];

  return (
    <>
      <Card>
        <p className="p-4">Current Inventory Level</p>
        <BarChart width={750} height={450} data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: "Months", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "Units Sold", angle: -90, position: "insideLeft" }}
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
          <AreaChart width={600} height={250} data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: "Months", position: "insideBottom", offset: -10 }}
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
    </>
  );
};

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
