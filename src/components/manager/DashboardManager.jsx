import React, { useState, useEffect, useRef } from "react";
import { Text } from "@radix-ui/themes";
import { TokensIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";
import {
  AddAdmin,
  WelcomeComponent,
  AddProducts,
  AddCustomer,
  AllProducts,
  UsersList,
  CreateRole,
  AddSuppliers,
  AllDepartments,
  AddDepartment,
  AllAdmins,
  AllRoles,
  AllSuspended,
  AllCustomers,
  AllSuppliers,
} from "./containers";

import {
  ClipboardCopyIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";
import { NavLink } from "react-router-dom";

import Header from "./Header";
import { Theme } from "@radix-ui/themes";
import { Notifications, Settings } from "../icons";
import Charts from "../Charts";

const DashBoardManager = ({ route }) => {
  const [selectedChild, setSelectedChild] = useState(<WelcomeComponent />);

  // State to check for light or dark mode
  const [isDark, setIsDark] = useState(true);

  // States for each dropdown
  const [openDropdown1, setOpenDropdown1] = useState(false);
  const [openDropdown2, setOpenDropdown2] = useState(false);
  const [openDropdown3, setOpenDropdown3] = useState(false);
  const [openDropdown4, setOpenDropdown4] = useState(false);
  const [openDropdown5, setOpenDropdown5] = useState(false);
  const [openDropdown6, setOpenDropdown6] = useState(false);
  const [openDropdown7, setOpenDropdown7] = useState(false);
  const [openDropdown8, setOpenDropdown8] = useState(false);
  const [openDropdown9, setOpenDropdown9] = useState(false);
  const [openDropdown10, setOpenDropdown10] = useState(false);
  const [openDropdown11, setOpenDropdown11] = useState(false);
  const [openDropdown12, setOpenDropdown12] = useState(false);
  const [openDropdown13, setOpenDropdown13] = useState(false);
  const [openDropdown14, setOpenDropdown14] = useState(false);
  const [openDropdown15, setOpenDropdown15] = useState(false);
  const [openDropdown16, setOpenDropdown16] = useState(false);
  const [openDropdown17, setOpenDropdown17] = useState(false);

  const handleToggle = (dropdownNumber) => {
    switch (dropdownNumber) {
      case 1:
        setOpenDropdown1(!openDropdown1);
        break;
      case 2:
        setOpenDropdown2(!openDropdown2);
        break;
      case 3:
        setOpenDropdown3(!openDropdown3);
        break;
      case 4:
        setOpenDropdown4(!openDropdown4);
        break;
      case 5:
        setOpenDropdown5(!openDropdown5);
        break;
      case 6:
        setOpenDropdown6(!openDropdown6);
        break;
      case 7:
        setOpenDropdown7(!openDropdown7);
        break;
      case 8:
        setOpenDropdown8(!openDropdown8);
        break;
      case 9:
        setOpenDropdown9(!openDropdown9);
        break;
      case 10:
        setOpenDropdown10(!openDropdown10);
        break;
      case 11:
        setOpenDropdown11(!openDropdown11);
        break;
      case 12:
        setOpenDropdown12(!openDropdown12);
        break;
      case 13:
        setOpenDropdown13(!openDropdown13);
        break;
      case 14:
        setOpenDropdown14(!openDropdown14);
        break;
      case 15:
        setOpenDropdown15(!openDropdown15);
        break;
      case 16:
        setOpenDropdown16(!openDropdown16);
        break;
      case 17:
        setOpenDropdown17(!openDropdown17);
        break;
      default:
        break;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // To check for theme of the page
  useEffect(() => {
    const theme = localStorage.getItem("polemaTheme");

    {
      theme === "dark" ? setIsDark(true) : setIsDark(false);
    }
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // Setting the value of selectedChild by routing
  useEffect(() => {
    const handleRoute = (param) => {
      switch (param) {
        case "create-role":
          setSelectedChild(<CreateRole />);
          break;
        case "add-products":
          setSelectedChild(<AddProducts />);
          break;
        case "create-admin":
          setSelectedChild(<AddAdmin />);
          break;
        case "add-department":
          setSelectedChild(<AddDepartment />);

          break;
        case "all-departments":
          setSelectedChild(<AllDepartments />);

          break;
        case "all-products":
          setSelectedChild(<AllProducts />);

          break;
        case "view-admins":
          setSelectedChild(<AllAdmins />);
          break;
        case "view-roles":
          setSelectedChild(<AllRoles />);
          break;
        case "suspended-admins":
          setSelectedChild(<AllSuspended />);
          break;
        case "add-customer":
          setSelectedChild(<AddCustomer />);
          break;

        case "all-customers":
          setSelectedChild(<AllCustomers />);
          break;
        case "add-supplier":
          setSelectedChild(<AddSuppliers />);
          break;
        case "all-suppliers":
          setSelectedChild(<AllSuppliers />);
          break;
      }
    };

    handleRoute(route);
  }, []);

  return (
    <Theme>
      <div className="dark:bg-boxdark-2 dark:text-bodydark ">
        <div className="flex h-screen overflow-hidden ">
          <aside
            ref={sidebar}
            className={`absolute left-0 font-space top-0 z-[9999] 
              
              sidebar-container flex border-r-[1px] border-white shadow-2xl h-screen max-w-[18.0rem] flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between gap-2 px-6 py-[1.375rem] lg:py-[1.625rem]">
              <NavLink to="/">
                <Text size={"6"} className="font-extrabold">
                  POLEMA
                </Text>
              </NavLink>

              <button
                ref={trigger}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                className="block lg:hidden"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>

            <div className="no-scrollbar h-screen flex flex-col overflow-y-auto duration-300 ease-linear">
              <nav className="py-1 px-2 lg:px-4">
                <div>
                  <ul className="mb-6 flex flex-col gap-1.5">
                    {/* Dashboard Link */}
                    <div className=" text-current rounded-sm">
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => {
                          setSelectedChild(<WelcomeComponent />);
                        }}
                      >
                        <TokensIcon width={20} height={20} />
                        <p className="p-2">Dashboard</p>
                      </p>
                    </div>

                    {/* Customers */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(1)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Customers</p>
                        {openDropdown1 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown1 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() => setSelectedChild(<AddCustomer />)}
                          >
                            Add
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllCustomers />)}
                          >
                            View All
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() =>
                              setSelectedChild(<UsersList page={"customers"} />)
                            }
                          >
                            Ledger
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Suppliers */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(2)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Suppliers</p>
                        {openDropdown2 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown2 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() => setSelectedChild(<AddSuppliers />)}
                          >
                            Add
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllSuppliers />)}
                          >
                            View All
                          </li>
                          <li className="p-2 cursor-pointer dash-list">
                            Ledger
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Products */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(3)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Products</p>
                        {openDropdown3 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown3 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() => setSelectedChild(<AddProducts />)}
                          >
                            Add
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllProducts />)}
                          >
                            View All
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Pharmacy Store */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(4)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Pharmacy </p>
                        {openDropdown4 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown4 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() =>
                              setSelectedChild(
                                <AddCustomer
                                  setChild={setSelectedChild}
                                  child={selectedChild}
                                  buttonValue={true}
                                />
                              )
                            }
                          >
                            Raw Materials
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Production
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Place Order
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* General Store */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(5)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">General Store </p>
                        {openDropdown5 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown5 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() =>
                              setSelectedChild(
                                <AddCustomer
                                  setChild={setSelectedChild}
                                  child={selectedChild}
                                  buttonValue={true}
                                />
                              )
                            }
                          >
                            Materials
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Place Order
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Department Store */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(6)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Department Store</p>
                        {openDropdown6 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown6 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() => setSelectedChild(<AddCustomer />)}
                          >
                            Raw Materials
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Production
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Place Order
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Department Ledger */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(7)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Ledger</p>
                        {openDropdown7 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown7 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() =>
                              setSelectedChild(
                                <AddCustomer
                                  setChild={setSelectedChild}
                                  child={selectedChild}
                                  buttonValue={true}
                                />
                              )
                            }
                          >
                            Raw Materials
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Production
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Place Order
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Orders */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(8)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Orders</p>
                        {openDropdown8 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown8 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list "
                            onClick={() =>
                              setSelectedChild(
                                <AddCustomer
                                  setChild={setSelectedChild}
                                  child={selectedChild}
                                  buttonValue={true}
                                />
                              )
                            }
                          >
                            Customer
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Department
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Raise Tickets */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(9)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Raise Tickets</p>
                        {openDropdown9 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown9 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            L.P.O
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Tickets */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(10)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Tickets</p>
                        {openDropdown10 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown10 && (
                        <ul className="ml-[30px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            L.P.O
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Auth. to weigh
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Admins */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(11)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Admins</p>
                        {openDropdown11 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown11 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<CreateRole />)}
                          >
                            Create Role
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllRoles />)}
                          >
                            View Role
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Create Admin
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllAdmins />)}
                          >
                            View Admin
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllSuspended />)}
                          >
                            Suspended Admins
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(12)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2"> Departments</p>
                        {openDropdown12 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown12 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddDepartment />)}
                          >
                            Add
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AllDepartments />)}
                          >
                            View All
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Cash Management */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(13)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Cash</p>
                        {openDropdown13 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown13 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Cash Collection
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Cash Disbursement
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Impress
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Receipt
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Accounting */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(14)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Accounting</p>
                        {openDropdown14 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown14 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Add Sales
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Add Expenses
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            View Sales
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            View Expenses
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Reconcile Acccount
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Weighing Operations */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(15)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Weighing</p>
                        {openDropdown15 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown15 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            New Weighing
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Products Weights
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Update Weights
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Weigh Hstory
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Finance
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Weigh
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Report */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(16)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Report</p>
                        {openDropdown16 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown16 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Inventory
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Production
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Department
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Cash
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Finance
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Weigh Bridge
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Notification */}
                    <div>
                      <p
                        className="flex gap-3 items-center px-4 cursor-pointer"
                        onClick={() => handleToggle(17)}
                      >
                        <ClipboardCopyIcon width={18} height={18} />
                        <p className="p-2">Notifications</p>
                        {openDropdown17 ? <CaretUpIcon /> : <CaretDownIcon />}
                      </p>
                      {openDropdown17 && (
                        <ul className="ml-[25px] px-4 text-current">
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Low Stock Alert
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            New Inventory
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Pending Orders
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Inventory
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            New Weigh Request
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Pending Weights
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Purchase Order
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            Low Cash Balance
                          </li>
                          <li
                            className="p-2 cursor-pointer dash-list"
                            onClick={() => setSelectedChild(<AddAdmin />)}
                          >
                            New Role/Permissions
                          </li>
                        </ul>
                      )}
                    </div>
                  </ul>
                </div>
              </nav>
            </div>
          </aside>

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={"user"}
              role={"role"}
              text={"text"}
              image={"image"}
            />
            <main>
              <div className="mx-auto max-w-screen-xl z-[1] p-4 md:p-6 xl:p-10">
                {selectedChild}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default DashBoardManager;
