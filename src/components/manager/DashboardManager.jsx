import React, { useState, useEffect, useRef } from "react";
import { Text } from "@radix-ui/themes";
import { TokensIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";
import {
  AddAdmin,
  WelcomeComponent,
  AllAdmins,
  AddProduct,
  AddCustomer,
} from "./comps";

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
import AllProducts from "./comps/AllProducts";

const DashBoardManager = ({ user, role, image, text }) => {
  const [params] = useSearchParams();
  const query = params.get("action");

  const [selectedChild, setSelectedChild] = useState(<WelcomeComponent />);

  // States for each dropdown
  const [openDropdown1, setOpenDropdown1] = useState(false);
  const [openDropdown2, setOpenDropdown2] = useState(false);
  const [openDropdown3, setOpenDropdown3] = useState(false);
  const [openDropdown4, setOpenDropdown4] = useState(false);
  const [openDropdown5, setOpenDropdown5] = useState(false);

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

  return (
    <Theme>
      <div className="dark:bg-boxdark-2 dark:text-bodydark ">
        <div className="flex h-screen overflow-hidden">
          <aside
            ref={sidebar}
            className={`absolute left-0 font-space top-0 z-[9999] flex border-r-[1px] border-white shadow-2xl h-screen max-w-[17.125rem] flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
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
                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => {
                        setSelectedChild(<WelcomeComponent />);
                      }}
                    >
                      <TokensIcon width={20} height={20} />
                      <p className="p-2">Dashboard</p>
                    </p>

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => handleToggle(1)}
                    >
                      <ClipboardCopyIcon width={18} height={18} />
                      <p className="p-2">Overview</p>
                      {openDropdown1 ? <CaretUpIcon /> : <CaretDownIcon />}
                    </p>
                    {openDropdown1 && (
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
                          Customers
                        </li>
                        <li
                          className="p-2 cursor-pointer dash-list"
                          onClick={() => setSelectedChild(<AddAdmin />)}
                        >
                          Suppliers
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
                          Inventory
                        </li>
                      </ul>
                    )}

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => handleToggle(2)}
                    >
                      <ClipboardCopyIcon width={18} height={18} />
                      <p className="p-2">Management</p>
                      {openDropdown2 ? <CaretUpIcon /> : <CaretDownIcon />}
                    </p>
                    {openDropdown2 && (
                      <ul className="ml-[25px] px-4 text-current">
                        <li
                          className="p-2 cursor-pointer dash-list"
                          onClick={() =>
                            setSelectedChild(
                              <AddAdmin
                                setChild={setSelectedChild}
                                child={selectedChild}
                              />
                            )
                          }
                        >
                          Staff Account
                        </li>
                        <li
                          className="p-2 cursor-pointer dash-list"
                          onClick={() => setSelectedChild(<AddProduct />)}
                        >
                          Product
                        </li>
                        <li className="p-2 cursor-pointer dash-list">
                          Account book
                        </li>
                      </ul>
                    )}

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => handleToggle(3)}
                    >
                      <ClipboardCopyIcon width={18} height={18} />
                      <p className="p-2"> Analysis</p>
                      {openDropdown3 ? <CaretUpIcon /> : <CaretDownIcon />}
                    </p>
                    {openDropdown3 && (
                      <ul className="ml-[25px] px-4 text-current">
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
                          Production
                        </li>
                        <li
                          className="p-2 cursor-pointer dash-list"
                          onClick={() => setSelectedChild(<AddAdmin />)}
                        >
                          Inventory
                        </li>
                      </ul>
                    )}

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => handleToggle(4)}
                    >
                      <ClipboardCopyIcon width={18} height={18} />
                      <p className="p-2">Tickets</p>
                      {openDropdown4 ? <CaretUpIcon /> : <CaretDownIcon />}
                    </p>
                    {openDropdown4 && (
                      <ul className="ml-[25px] px-4 text-current">
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

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => {
                        setSelectedChild(<WelcomeComponent />);
                      }}
                    >
                      <Notifications width={20} height={20} />
                      <p className="p-2">Notifications</p>
                    </p>

                    <p
                      className="flex gap-3 items-center px-4 cursor-pointer"
                      onClick={() => {
                        setSelectedChild(<WelcomeComponent />);
                      }}
                    >
                      <Settings width={20} height={20} />
                      <p className="p-2">Settings</p>
                    </p>
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
