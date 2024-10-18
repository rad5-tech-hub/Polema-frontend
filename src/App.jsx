import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import Charts from "./components/Charts";
import Manager from "./components/manager";
import DashBoardManager from "./components/manager/DashboardManager";

import {
  AddAdmin,
  WelcomeComponent,
  ViewPharmacy,
  AddProducts,
  AddCustomer,
  CustomerPlaceOrder,
  CustomerLedger,
  AuthorityToGiveCash,
  AllProducts,
  CreatePharmacyStore,
  CreateRole,
  ViewAccoountBook,
  AccountBook,
  AddSuppliers,
  AllDepartments,
  AddDepartment,
  AllAdmins,
  AllRoles,
  AllSuspended,
  SupplierPlaceOrder,
  AllCustomers,
  AllSuppliers,
} from "./components/manager/containers";

import PrivateRoute from "./components/PrivateRoute"; // Assume this is adjusted for React Router v6
import "@radix-ui/themes/styles.css";
import "./index.css";

const route = "/admin";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<DashBoardManager />} />

        {/* Dashboard Layout - Wrap all private routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <DashBoardManager>
                <Routes>
                  {/* Customer routes */}
                  <Route
                    path="customers/add-customer"
                    element={<AddCustomer />}
                  />
                  <Route
                    path="customers/view-customers"
                    element={<AllCustomers />}
                  />
                  <Route
                    path="customers/customer-ledger"
                    element={<CustomerLedger />}
                  />
                  <Route
                    path="customers/place-order"
                    element={<CustomerPlaceOrder />}
                  />

                  {/* Account Book Routes */}
                  <Route path="account-book/add" element={<AccountBook />} />
                  <Route
                    path="account-book/view-all"
                    element={<ViewAccoountBook />}
                  />

                  {/* Suppliers Routes */}
                  <Route
                    path="suppliers/add-supplier"
                    element={<AddSuppliers />}
                  />
                  <Route
                    path="suppliers/view-suppliers"
                    element={<AllSuppliers />}
                  />
                  <Route
                    path="suppliers/place-supplier-order"
                    element={<SupplierPlaceOrder />}
                  />

                  {/* Product Routes */}
                  <Route
                    path="products/add-product"
                    element={<AddProducts />}
                  />
                  <Route
                    path="products/view-products"
                    element={<AllProducts />}
                  />

                  {/* Admin Routes */}
                  <Route path="admins/create-role" element={<CreateRole />} />
                  <Route path="admins/create-admin" element={<AddAdmin />} />
                  <Route path="admins/view-admins" element={<AllAdmins />} />
                  <Route path="admins/view-roles" element={<AllRoles />} />
                  <Route
                    path="admins/suspended-admins"
                    element={<AllSuspended />}
                  />

                  {/* Department Routes */}
                  <Route
                    path="department/add-department"
                    element={<AddDepartment />}
                  />

                  <Route
                    path="department/view-departments"
                    element={<AllDepartments />}
                  />

                  {/*Raise Tickets Routes*/}
                  <Route
                    path="raise-tickets/authority-to-give-cash"
                    element={<AuthorityToGiveCash />}
                  />

                  {/* Test Routes for phamrcy store */}
                  <Route
                    path="/pharmacy-store"
                    element={<CreatePharmacyStore />}
                  />
                  <Route
                    path="/pharmacy-store/view-store"
                    element={<ViewPharmacy />}
                  />
                </Routes>
              </DashBoardManager>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
