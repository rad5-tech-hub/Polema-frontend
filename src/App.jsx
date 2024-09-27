import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Charts from "./components/Charts";
import Manager from "./components/manager";
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute"; // Assume this is adjusted for React Router v6
import "@radix-ui/themes/styles.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:id" element={<AdminDashboard />} />
        <Route path="/md" element={<PrivateRoute component={Manager} />} />
        <Route path="/md/:id" element={<PrivateRoute component={Manager} />} />
        <Route path="/charts" element={<PrivateRoute component={Charts} />} />
      </Routes>
    </Router>
  );
}

export default App;
