import React from "react";
import LoginContent from "./LoginContent";
import { Theme } from "@radix-ui/themes";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Login = () => {
  return (
    <>
      <Theme accentColor="blue" appearance={""} panelBackground="translucent">
        <LoginContent />
      </Theme>
    </>
  );
};

export default Login;
