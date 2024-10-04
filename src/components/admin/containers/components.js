import WelcomeComponent from "./WelcomeComponent";

import AddAdmin from "./admin/AddAdmin";
import AddDepartment from "./department/AddDepartment";
import AddCustomer from "./customer/AddCustomer";

import AddProducts from "./products/AddProducts";

import AllCustomers from "./customer/AllCustomers";
import AddSuppliers from "./suppliers/AddSuppliers";
import CreateRole from "./roles/CreateRole";
import AllAdmins from "./admin/AllAdmins"; // Make sure this import path is correct
import AllRoles from "./roles/AllRoles";
import AllSuspended from "./admin/AllSuspended";

const components = {
  "Add Admin": AddAdmin,
  "View Admins": AllAdmins,
  "Suspended Admins": AllSuspended,

  "Add Customer": AddCustomer,
  "Create Role": CreateRole,
  "View Roles": AllRoles,
  "Create Admin": AddAdmin,

  "Add Products": AddProducts,
};

export default components;
