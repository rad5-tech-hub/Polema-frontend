import { Link } from "react-router-dom";
import { BellIcon } from "@radix-ui/react-icons";
import { Card } from "@radix-ui/themes";
import Logout from "../Logout";
import ThemeSwitcher from "../ThemeSwitcher";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const LogoIcon = "";

const Header = ({ sidebarOpen, setSidebarOpen, user, role, image, text }) => {
  const getAdminName = () => {
    const name = localStorage.getItem("adminFirstName");
    return name;
  };

  return (
    <header className=" top-0 z-0 font-amsterdam flex w-full  shadow-md dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4  md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
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
          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="hidden sm:block">
          <h1 className="text-[2.0rem] z-0">Welcome {getAdminName()}</h1>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4"></ul>

          {/* <ThemeSwitcher /> */}
          <Card className="cursor-pointer">
            <BellIcon />
          </Card>
          <Logout />

          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
