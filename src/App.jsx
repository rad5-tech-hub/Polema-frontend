import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Charts from "./components/Charts";
import Layout from "./components/DashboardLayout";
import Manager from "./components/manager";

import "@radix-ui/themes/styles.css";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import "./index.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/dashboard/md" element={<Manager />} />

          <Route path="/charts" element={<Charts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
