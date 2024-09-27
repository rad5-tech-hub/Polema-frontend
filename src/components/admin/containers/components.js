import WelcomeComponent from "./WelcomeComponent";
import AddAdmin from "./AddAdmin";
import AddDepartment from "./AddDepartment";
import AddCustomer from "./AddCustomer";
import AddProducts from "./AddProducts";
import UsersList from "./UsersList";
import AllCustomers from "./AllCustomers";
import AddSuppliers from "./AddSuppliers";
import AllProducts from "./AllProducts"
import CreateRole from "./CreateRole";
import AllAdmins from "./AllAdmins"; // Make sure this import path is correct
import AllRoles from "./AllRoles";
import AllSuspended from "./AllSuspended";

const components = {
  "Add Admin": AddAdmin,
  "View Admins": AllAdmins,
  "Suspended Admins": AllSuspended,
 "Add Product":AddProducts,
 "View Products":AllProducts,
  "Add Customer": AddCustomer,
  "Create Role": CreateRole,
  "View Roles": AllRoles,
  "Create Admin": AddAdmin,

  "Add Products": AddProducts,
};

export default components;
