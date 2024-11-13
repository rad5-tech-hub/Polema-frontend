import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import Charts from "./components/Charts";
import Manager from "./components/manager";
import DashBoardManager from "./components/manager/DashboardManager";

import {
  AddAdmin,
  WelcomeComponent,
  CashManagement,
  PharmacyPlaceOrder,
  CashManagementLedger,
  AuthorityToLoad,
  ViewPharmacyStore,
  LocalPurchaseOrder,
  ViewPharmacyOrder,
  GeneralStorePlaceOrder,
  AddProducts,
  CreateDepartmentStore,
  AddCustomer,
  CreateShelf,
  CustomerPlaceOrder,
  ShelfContent,
  CustomerLedger,
  AuthorityToWeigh,
  AllProducts,
  CreatePharmacyStore,
  CreateRole,
  ViewAccoountBook,
  AccountBook,
  ViewGeneralOrder,
  AddSuppliers,
  AllDepartments,
  AddDepartment,
  AllAdmins,
  AllRoles,
  AllSuspended,
  SupplierPlaceOrder,
  AllCustomers,
  AllSuppliers,
  NewWeigh,
  DepartementStorePlaceOrder,
  DepartmentStoreViewOrders,
  ViewDepartmentStore,
} from "./components/manager/containers";

import PrivateRoute from "./components/PrivateRoute"; // Assume this is adjusted for React Router v6
import "@radix-ui/themes/styles.css";
import "./index.css";

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
                    path="raise-ticket/l.p.o"
                    element={<LocalPurchaseOrder />}
                  />
                  <Route
                    path="raise-ticket/authority-to-weigh"
                    element={<AuthorityToWeigh />}
                  />
                  <Route
                    path="raise-ticket/authority-to-load"
                    element={<AuthorityToLoad />}
                  />

                  {/*  Routes for phamrcy store */}
                  <Route
                    path="/pharmacy-store/create-pharmacy-store"
                    element={<CreatePharmacyStore />}
                  />
                  <Route
                    path="/pharmacy-store/view-pharmacy"
                    element={<ViewPharmacyStore />}
                  />

                  <Route
                    path="/pharmacy-store/place-pharmacy-order"
                    element={<PharmacyPlaceOrder />}
                  />

                  <Route
                    path="/pharmacy-store/view-pharmacy-order"
                    element={<ViewPharmacyOrder />}
                  />

                  {/* Test Routes for general store */}
                  <Route
                    path="/general-store/create-shelf"
                    element={<CreateShelf />}
                  />
                  <Route
                    path="/general-store/view-shelf"
                    element={<ShelfContent />}
                  />
                  <Route
                    path="/general-store/raise-general-order"
                    element={<GeneralStorePlaceOrder />}
                  />
                  <Route
                    path="/general-store/view-general-order"
                    element={<ViewGeneralOrder />}
                  />

                  {/* Test Routes for department store */}
                  <Route
                    path="/department-store/create-department-store"
                    element={<CreateDepartmentStore />}
                  />
                  <Route
                    path="/department-store/view-dept-orders"
                    element={<DepartmentStoreViewOrders />}
                  />
                  <Route
                    path="/department-store/place-store-order"
                    element={<DepartementStorePlaceOrder />}
                  />
                  <Route
                    path="/department-store/department-store-products"
                    element={<ViewDepartmentStore />}
                  />

                  {/* Weighing operations routes     */}
                  <Route path="/weighing/new-weigh" element={<NewWeigh />} />

                  {/* Routes for cashier */}
                  <Route
                    path="/cash-management/cash-management"
                    element={<CashManagement />}
                  />
                  <Route
                    path="/cash-management/cash-ledger"
                    element={<CashManagementLedger />}
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
