import React, { useState } from "react";
// import "../Dashboard.module.css";
import Header from "./Header";
import { Theme } from "@radix-ui/themes";
import Sidebar from "./SideBar";
import ThemeSwitcher from "./ThemeSwitcher";

const Layout = ({ children, user, role, image, text }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Theme>
      <div className="dark:bg-boxdark-2 dark:text-bodydark xl:mx-[12%]">
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex h-screen overflow-hidden">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* <!-- ===== Header Start ===== --> */}
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={"user"}
              role={"role"}
              text={"text"}
              image={"image"}
            />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto max-w-screen-xl z-[1] p-4 md:p-6 xl:p-10">
                {children}
                Hello World
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </div>
    </Theme>
  );
};

export default Layout;
