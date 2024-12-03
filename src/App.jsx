import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import Charts from "./components/Charts";
import Manager from "./components/manager";
import DashBoardManager from "./components/manager/DashboardManager";
import NewPassword from "./pages/NewPassword";

import {
  AddAdmin,
  ViewSupplierOrder,
  WelcomeComponent,
  CashManagement,
  PharmacyPlaceOrder,
  CashManagementLedger,
  InvoiceAuthorityToWeigh,
  AuthorityToLoad,
  EditDialog,
  AllReceipts,
  ViewPharmacyStore,
  LocalPurchaseOrder,
  BlankLPO,
  AuthorityToGiveCash,
  AllWeigh,
  EditRole,
  ViewPharmacyOrder,
  GeneralStorePlaceOrder,
  SupplierLedger,
  AddProducts,
  CreateDepartmentStore,
  GeneralSupplierLedger,
  AddCustomer,
  IndividualCustomerLedger,
  CreateShelf,
  CustomerPlaceOrder,
  ShelfContent,
  CustomerLedger,
  AllWayBill,
  AuthorityToWeigh,
  AllProducts,
  CreatePharmacyStore,
  IndividualDepartmentLedger,
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
  ViewCustomerOrders,
  DepartementStorePlaceOrder,
  DepartmentStoreViewOrders,
  AllDispatchNote,
  AllGatePass,
  AllInvoice,
  CreateDispatchNote,
  CreateGatepass,
  CreateInvoice,
  GatepassReceipt,
  Invoice,
  OfficialReceipt,
  Onboarding,
  WaybillCreateInvoice,
  WaybillInvoice,
  ViewAuthorityToWeigh,
  ViewLocalPurchaseOrder,
  // EditDialog,
  CollectFromGeneralStore,
  ViewDepartmentStore,
  DepartmentLedger,
} from "./components/manager/containers";

import PrivateRoute from "./components/PrivateRoute";
import "@radix-ui/themes/styles.css";
import "./index.css";
import ConfirmEmail from "./pages/ConfirmEmail";
import OfficialReceiptInvoice from "./components/manager/containers/receipts/OfficeReceiptInvoice";
import OfficialLPO from "./components/manager/containers/raise-tickets/OfficialLPO";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* confirm email */}
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        {/* Create new password */}
        <Route path="/create-new-password" element={<NewPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashBoardManager>
                <Onboarding />
              </DashBoardManager>
            </PrivateRoute>
          }
        />

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
                  <Route
                    path="customers/order"
                    element={<ViewCustomerOrders />}
                  />

                  {/* Authority to weigh route */}
                  <Route
                    path="customers/authority-to-weigh/:customerId/:orderId"
                    element={<AuthorityToWeigh />}
                  />

                  {/* Customer Ledger Route */}
                  <Route
                    path="customers/customer-ledger/:id"
                    element={<IndividualCustomerLedger />}
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
                  <Route
                    path="suppliers/view-order"
                    element={<ViewSupplierOrder />}
                  />
                  <Route
                    path="suppliers/supplier-ledger"
                    element={<GeneralSupplierLedger />}
                  />
                  {/* Individual Supplier Ledger */}
                  <Route
                    path="supplier/supplier-ledger/:id"
                    element={<SupplierLedger />}
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
                  <Route
                    path="products/edit-product/:id"
                    element={<EditDialog />}
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
                  <Route path="admins/edit-role/:id" element={<EditRole />} />

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
                    element={<ViewLocalPurchaseOrder />}
                  />
                  <Route
                    path="raise-ticket/l.p.o/:id/:rawId"
                    element={<BlankLPO />}
                  />

                  <Route
                    path="raise-ticket/authority-to-load"
                    element={<AuthorityToLoad />}
                  />

                  <Route
                    path="raise-ticket/cash-authority"
                    element={<AuthorityToGiveCash />}
                  />

                  <Route
                    path="raise-ticket/store-authority"
                    element={<CollectFromGeneralStore />}
                  />
                  <Route
                    path="raise-ticket/authority-to-weigh"
                    element={<ViewAuthorityToWeigh />}
                  />
                  <Route
                    path="raise-ticket/officialLPO"
                    element={<OfficialLPO />}
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
                  <Route
                    path="/weighing-operations/new-weigh/:id"
                    element={<NewWeigh />}
                  />
                  <Route path="/weighing-operations/" element={<AllWeigh />} />

                  {/* Routes for cashier */}
                  <Route
                    path="/cash-management/cash-management"
                    element={<CashManagement />}
                  />
                  <Route
                    path="/cash-management/cash-ledger"
                    element={<CashManagementLedger />}
                  />

                  {/* Department Ledger */}
                  <Route
                    path="/department-ledger"
                    element={<DepartmentLedger />}
                  />
                  <Route
                    path="/department-ledger/:ledgerName/:id"
                    element={<IndividualDepartmentLedger />}
                  />

                  {/* Receipts Route */}
                  <Route
                    path="/receipts/gate-pass-note"
                    element={<AllGatePass />}
                  />
                  <Route
                    path="/receipts/vehicle-dispatch-note"
                    element={<CreateDispatchNote />}
                  />
                  <Route path="/receipts/invoice" element={<AllInvoice />} />
                  <Route path="/receipts/invoice/:id" element={<Invoice />} />
                  <Route path="/receipts/waybill" element={<AllWayBill />} />
                  <Route
                    path="/receipts/official-receipt"
                    element={<AllReceipts />}
                  />

                  <Route
                    path="/receipt/create-gatepass/:id"
                    element={<CreateGatepass />}
                  />

                  <Route
                    path="/receipt/create-invoice/:id"
                    element={<CreateInvoice />}
                  />
                  <Route
                    path="/receipt/view-gatepass/:id"
                    element={<GatepassReceipt />}
                  />
                  {/* <Route path="/receipt/invoices" element={<Invoice />} /> */}
                  <Route
                    path="/receipt/generate-receipt/:id"
                    element={<OfficialReceiptInvoice />}
                  />
                  <Route
                    path="/receipt/official-receipt/:id"
                    element={<OfficialReceipt />}
                  />

                  <Route
                    path="/receipt/create-waybill-invoice/:id"
                    element={<WaybillCreateInvoice />}
                  />
                  <Route
                    path="/receipt/waybill-invoice"
                    element={<WaybillInvoice />}
                  />

                  {/* Invoice for Authority to weigh */}
                  <Route
                    path="/tickets/view-auth-to-weigh/:id"
                    element={<InvoiceAuthorityToWeigh />}
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
