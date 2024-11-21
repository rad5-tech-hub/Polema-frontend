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
      return str.slice(0, length) + "...";
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
    <Theme className="bg-gray-50">
      <div className="dark:bg-boxdark-2 dark:text-bodydark ">
        <div className="flex h-screen overflow-hidden ">
          <aside
            ref={sidebar}
            className={`absolute left-0 font-space top-0 z-[100] 
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
                    <ul className="mb-6 flex flex-col gap-1.5 max-w-[2000px]">
                      {navigation.map((nav, index) => {
                        return (
                          <div>
                            <p
                              className="flex gap-3 items-center justify-between px-4 w-full cursor-pointer "
                              onClick={() => handleToggle(index)}
                            >
                              <div className="flex items-center">
                                <DynamicIcon
                                  iconName={_.camelCase(nav.navParentIcon)}
                                />
                                <p className="p-2" title={nav.navParentName}>
                                  {trimString(nav.navParentName, 12)}
                                </p>
                              </div>
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
                                        <span
                                          title={item.name}
                                          className="text-[15px]"
                                        >
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
