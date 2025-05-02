import React from "react";
import Profile from "./Profile";
import FAQ from "./containers/FAQ/FAQ";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast,{Toaster} from "react-hot-toast";
const YT_LINK = import.meta.env.VITE_YT_LINK
import Notifications from "./containers/notifications/Notifications";
import useToast from "../../hooks/useToast";
import { use } from "react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {   
  const showToast  = useToast();  

  const getAdminName = () => {
    const name = localStorage.getItem("adminData");
    if (name) {
      const adminData = JSON.parse(name);
      return `${adminData.firstname} (${adminData.role})`;
    }
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
          <a href={YT_LINK} target="_blank">
            <FAQ />
          </a>
          <Notifications />
          

          {/* Logout Button */}
          {/* <Logout /> */}
          <Profile />
        </div>
      </div>
            <Toaster
        position="top-right"  
      />
      </header>
  );
};

export default Header;
