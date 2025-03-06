// Filename - App.js

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, YAxis, CartesianGrid } from "recharts";

const App = () => {
  const [chartWidth, setChartWidth] = useState(950);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.max(500, Math.min(window.innerWidth - 50, 850));
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Sample data
  const data = [
    { name: "A", x: 12, y: 23, z: 122 },
    { name: "B", x: 22, y: 3, z: 73 },
    { name: "C", x: 13, y: 15, z: 32 },
    { name: "D", x: 44, y: 35, z: 23 },
    { name: "E", x: 35, y: 45, z: 20 },
    { name: "F", x: 62, y: 25, z: 29 },
    { name: "G", x: 37, y: 17, z: 61 },
    { name: "H", x: 28, y: 32, z: 45 },
    { name: "I", x: 19, y: 43, z: 93 },
  ];

  return (
    <>
      <div>
        <h1 className="font-bold font-amsterdam">Bank  Summary</h1>

        <BarChart width={chartWidth} height={500} data={data} className="mt-4">
          {/* <CartesianGrid />  */}
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="x" stackId="a" fill="#8884d8" />
          <Bar dataKey="y" stackId="a" fill="#82ca9d" />
        </BarChart>
      </div>
    </>
  );
};

export default App;
