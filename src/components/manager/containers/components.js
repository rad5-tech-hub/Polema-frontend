import WelcomeComponent from "./WelcomeComponent";
import AddAdmin from "./AddAdmin";
import AddDepartment from "./AddDepartment";
import AddCustomer from "./AddCustomer";
import AddProducts from "./AddProducts";
import UsersList from "./UsersList";
import AllCustomers from "./AllCustomers";
import AddSuppliers from "./AddSuppliers";
import CreateRole from "./CreateRole";
import AllAdmins from "./AllAdmins";
1;
import AllRoles from "./AllRoles";
import AllSuspended from "./AllSuspended";

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
