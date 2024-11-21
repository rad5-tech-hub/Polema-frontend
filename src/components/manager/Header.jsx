import React from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logout from "../Logout";
import Notifications from "./containers/notifications/Notifications";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const getAdminName = () => {
    const name = localStorage.getItem("adminFirstName");
    return name || "Admin";
  };

  return (
    <header className="top-0 z-10 font-amsterdam flex w-full shadow-md dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-[99999] block rounded-sm border border-stroke bg-white py-1.5 px-4 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="text-[25px]" />
          </button>
        </div>

        {/* Welcome Message */}
        <div className="hidden sm:block">
          <h1 className="text-[2.0rem] z-0">Welcome {getAdminName()}</h1>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Notifications */}
          <Notifications />

          {/* Logout Button */}
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
