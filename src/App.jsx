import { useEffect, useState } from "react";
import Login from "./pages/Login";

import { Theme, Button, Flex, Text, Container, Card } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  return (
    <>
      <Theme accentColor="iris" appearance={""} panelBackground="translucent">
        <Login />
        <ThemeSwitcher styling={"absolute right-[10px] top-[10px]"} />
      </Theme>
    </>
  );
}

export default App;
