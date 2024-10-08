import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Flex, Spinner, Text } from "@radix-ui/themes";
import { TokensIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

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
import DynamicIcon from "../DynamicIcon";
import toast from "react-hot-toast";
import _ from "lodash";
const root = import.meta.env.VITE_ROOT;

const DashBoardManager = ({ children }) => {
  // State management for spinner at the navbar
  const [loading, setLoading] = useState(true);

  const route = "/admin";

  const navigate = useNavigate();

  const [navigation, setNavigation] = useState([]);

  // Function to trim string length
  function trimString(str, length) {
    if (str.length > 10) {
      return str.slice(0, length  ) + "...";
    }
    return str;
  }

  // State to check for light or dark mode
  const [isDark, setIsDark] = useState(true);

  // States for each dropdown
  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const savedState = localStorage.getItem("dropdownStates");
    return savedState ? JSON.parse(savedState) : {};
  });

  // Toggle dropdown state and persist it to localStorage
  const handleToggle = (dropdownNumber) => {
    setOpenDropdowns((prev) => {
      const newDropdownState = {
        ...prev,
        [dropdownNumber]: !prev[dropdownNumber],
      };
      localStorage.setItem("dropdownStates", JSON.stringify(newDropdownState));
      return newDropdownState;
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

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

  const fetchNav = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-nav`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      console.log(response);
      setNavigation(response.data.navParentsWithPermissions);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.message?.data || "An error occured.");
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  return (
    <Theme>
      <div className="dark:bg-boxdark-2 dark:text-bodydark ">
        <div className="flex h-screen overflow-hidden ">
          <aside
            ref={sidebar}
            className={`absolute left-0 font-space top-0 z-[9999] 
              bg-[#434343]
              sidebar-container flex border-r-[1px] border-white !text-white shadow-2xl h-screen max-w-[18.0rem] flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
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
                  {loading ? (
                    <div className="h-screen flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <ul className="mb-6 flex flex-col gap-1.5">
                      {navigation.map((nav, index) => {
                        return (
                          <div>
                            <p
                              className="flex gap-3 items-center px-4 cursor-pointer"
                              onClick={() => handleToggle(index)}
                            >
                              <DynamicIcon
                                iconName={_.camelCase(nav.navParentIcon)}
                              />
                              <p className="p-2" title={nav.navParentName}>
                                {trimString(nav.navParentName, 12)}
                              </p>
                              {openDropdowns[index] ? (
                                <CaretUpIcon />
                              ) : (
                                <CaretDownIcon />
                              )}
                            </p>
                            {openDropdowns[index] && (
                              <ul className="ml-[20px] px-4 text-current">
                                {nav.permissions.map((item) => {
                                  return (
                                    <li
                                      className={`p-2 cursor-pointer mb-1 ${
                                        window.location.pathname ===
                                        `${route}/${nav.navParentSlug}/${item.slug}`
                                          ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        navigate(
                                          `${route}/${nav.navParentSlug}/${item.slug}`
                                        )
                                      }
                                    >
                                      <Flex gap={"2"} align={"center"}>
                                        <CircleIcon />
                                        <span title={item.name}>
                                          {" "}
                                          {trimString(item.name, 14)}
                                        </span>
                                      </Flex>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </ul>
                  )}
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
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default DashBoardManager;

// <div>
// <ul className="mb-6 flex flex-col gap-1.5">
//   {/* Dashboard Link */}
//   <div className=" text-current rounded-sm">
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => {
//         setSelectedChild(<WelcomeComponent />);
//       }}
//     >
//       <TokensIcon width={20} height={20} />
//       <p className="p-2">Dashboard</p>
//     </p>
//   </div>

//   {/* Account Book */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(18)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Account Book</p>
//       {openDropdowns[18] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[18] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list "
//           onClick={() => setSelectedChild(<AccountBook />)}
//         >
//           Add
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AllSuppliers />)}
//         >
//           View All
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Customers */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(1)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Customers</p>
//       {openDropdowns[1] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[1] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/customers/add-customer`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/customers/add-customer`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {"Add"}
//           </Flex>
//         </li>

//         <li
//           className={`p-2 cursor-pointer mb-1  ${
//             window.location.pathname ===
//             `${route}/customers/view-customers`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[30px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/customers/view-customers`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {"View"}
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1  ${
//             window.location.pathname ===
//             `${route}/customers/customer-ledger`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/customers/customer-ledger`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {"Ledger"}
//           </Flex>
//         </li>
//         <li className={`p-2 cursor-pointer mb-1`}>
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Place Order
//           </Flex>
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Suppliers */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(2)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Suppliers</p>
//       {openDropdowns[2] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[2] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/suppliers/add-supplier`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/suppliers/add-supplier`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {"Add"}
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/suppliers/view-suppliers`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/suppliers/view-suppliers`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {"View All"}
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-`}
//           onClick={() =>
//             navigate(`${route}/suppliers/view-suppliers`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Ledger
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-`}
//           onClick={() => setSelectedChild(<CustomerLedger />)}
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Place Orders
//           </Flex>
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Products */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(3)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Products</p>
//       {openDropdowns[3] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[3] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/products/add-product`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/products/add-product`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Add
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/products/view-products`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/products/view-products`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             View All
//           </Flex>
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Pharmacy Store */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(4)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Pharmacy Store </p>
//       {openDropdowns[4] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[4] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Add Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Remove Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Add Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Remove Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Place Order
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* General Store */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(5)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">General Store </p>
//       {openDropdowns[5] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[5] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list "
//           onClick={() => setSelectedChild(<AddCustomer />)}
//         >
//           Add Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Remove Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Place Order
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Department Store */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(6)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Department Store</p>
//       {openDropdowns[6] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[6] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Add Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Remove Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Raw Materials Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Add Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Remove Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Production Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Place Order
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Department Ledger */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(7)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2" title="Department Ledger">
//         Dept. Ledger
//       </p>
//       {openDropdowns[7] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[7] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list "
//           onClick={() => setSelectedChild(<AddCustomer />)}
//         >
//           Refinery
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Plastics
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Lubricants
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Pharmacy
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Raise Tickets */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(9)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Raise Tickets</p>
//       {openDropdowns[9] ? <CaretUpIcon /> : <CaretDownIcon />}
//     </p>
//     {openDropdowns[9] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           L.P.O
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Approved L.P.O
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/raise-tickets/authority-to-give-casht`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(
//               `${route}/raise-tickets/authority-to-give-cash`
//             )
//           }
//           title="Authority to give cash"
//         >
//           <Flex align={"center"} gap={"2"}>
//             <CircleIcon />
//             {trimString("Authority to give cash")}
//           </Flex>
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View approved authority to give cash
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Authority to collect from General Store
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Approved Authority to collect from General
//           Store
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Authority to weigh
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Approved Authority to weigh
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Authority to collect from General Store
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Authority to load
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Approved Authority to load
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Tickets */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(10)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Tickets</p>
//       {openDropdowns[10] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[10] && (
//       <ul className="ml-[30px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           L.P.O
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Auth. to weigh
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Auth. to weigh
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Auth. to weigh
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Auth. to weigh
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Admins */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(11)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Admins</p>
//       {openDropdowns[11] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[11] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/admins/create-role`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/admins/create-role`)
//           }
//           title="Create Role"
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Create Role
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/admins/view-roles`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/admins/view-roles`)
//           }
//           title="View Roles"
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             View Roles
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/admins/create-admin`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/admins/create-admin`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Create Admin
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/admins/view-admins`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/admins/view-admins`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             View Admins
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/admins/suspended-admins`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/admins/suspended-admins`)
//           }
//           title="Suspended Admins"
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             {trimString("Suspended Admins")}
//           </Flex>
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Department */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(12)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2"> Departments</p>
//       {openDropdowns[12] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[12] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/departments/add-department`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/departments/add-department`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             Add
//           </Flex>
//         </li>
//         <li
//           className={`p-2 cursor-pointer mb-1 ${
//             window.location.pathname ===
//             `${route}/departments/view-departments`
//               ? "bg-[#f4f4f4] rounded-lg shadow-2xl !text-black min-w-[50px]"
//               : ""
//           }`}
//           onClick={() =>
//             navigate(`${route}/departments/view-departments`)
//           }
//         >
//           <Flex gap={"3"} align={"center"}>
//             <CircleIcon />
//             View All
//           </Flex>
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Cash Management */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(13)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Cash</p>
//       {openDropdowns[13] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[13] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AccountBook />)}
//         >
//           Account Book
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Cash Collection
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Cash Disbursement
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Impress
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Receipt
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Accounting */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(14)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Accounting</p>
//       {openDropdowns[14] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[14] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Sales
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           View Expenses
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Reconcile Acccount
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Weighing Operations */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(15)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Weighing</p>
//       {openDropdowns[15] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[15] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           New Weighing
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Products Weights
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Update Weights
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Weigh Hstory
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Report */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(16)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Report</p>
//       {openDropdowns[16] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[16] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Production
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Department
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Cash
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Finance
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Weigh Bridge
//         </li>
//       </ul>
//     )}
//   </div>

//   {/* Notification */}
//   <div>
//     <p
//       className="flex gap-3 items-center px-4 cursor-pointer"
//       onClick={() => handleToggle(17)}
//     >
//       <ClipboardCopyIcon width={18} height={18} />
//       <p className="p-2">Notifications</p>
//       {openDropdowns[17] ? (
//         <CaretUpIcon />
//       ) : (
//         <CaretDownIcon />
//       )}
//     </p>
//     {openDropdowns[17] && (
//       <ul className="ml-[25px] px-4 text-current">
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Low Stock Alert
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           New Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Pending Orders
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Inventory
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           New Weigh Request
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Pending Weights
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Purchase Order
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           Low Cash Balance
//         </li>
//         <li
//           className="p-2 cursor-pointer dash-list"
//           onClick={() => setSelectedChild(<AddAdmin />)}
//         >
//           New Role/Permissions
//         </li>
//       </ul>
//     )}
//   </div>
// </ul>
// </div>
