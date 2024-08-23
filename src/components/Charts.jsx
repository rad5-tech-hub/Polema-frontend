import React from "react";
import { Card, Theme } from "@radix-ui/themes";
import Cloudinary from "./cloudinary";
// import DropDown from "./DropDown";
import {
  BarChart,
  Bar,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from "recharts";
import ThemeSwitcher from "./ThemeSwitcher";
import { Heading } from "@radix-ui/themes";

const Charts = () => {
  const data = [
    { name: "Feb", product1: 2500, product2: 3000 },
    { name: "Mar", product1: 1200, product2: 3200 },
    { name: "Apr", product1: 3500, product2: 4500 },
    { name: "May", product1: 2000, product2: 7000 },
    { name: "Jun", product1: 4000, product2: 8000 },
    { name: "Jul", product1: 5000, product2: 9000 },
  ];
  return (
    <Theme>
      <ThemeSwitcher />
      <Card>
        <Heading>Area Charts</Heading>
        <AreaChart width={480} height={480} data={data}>
          <Tooltip />
          <Legend />
          <XAxis dataKey={"name"} />
          <YAxis />
          <CartesianGrid />
          <Area
            dataKey="product1"
            fill="#756aaa"
            stroke="#5698ab"
            type="monotone"
            stackId={1}
          />
          <Area
            dataKey="product2"
            fill="#244abb"
            stroke="#5698ab"
            type="monotone"
            stackId={1}
          />
        </AreaChart>
      </Card>

      {/* ------------- */}
      <Card>
        <Heading>Bar Charts</Heading>
        <BarChart width={480} height={480} data={data}>
          <Tooltip />
          <Legend />
          <XAxis dataKey={"name"} />
          <YAxis />
          <CartesianGrid />
          <Bar
            dataKey="product1"
            fill="#756aaa"
            stroke="#5698ab"
            type="monotone"
            stackId={1}
          />
          <Bar
            dataKey="product2"
            fill="#244abb"
            stroke="#5698ab"
            type="monotone"
            stackId={"1"}
          />
        </BarChart>
      </Card>

      <Cloudinary />
    </Theme>
  );
};

export default Charts;
