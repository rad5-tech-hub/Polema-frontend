import { Card } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeSwitcher = ({ styling }) => {
  // Retrieve theme from localStorage or default to "light"
  const retrieveTheme = () => {
    return localStorage.getItem("polemaTheme") || "light";
  };

  const [theme, setTheme] = useState(retrieveTheme());
  const [themeIcon, setThemeIcon] = useState(
    theme === "light" ? <SunIcon /> : <MoonIcon />
  );
  const [isLightTheme, setIsLightTheme] = useState(theme === "light");

  // This function applies the saved theme to the page
  const loadTheme = () => {
    const currentTheme = retrieveTheme();
    setTheme(currentTheme);
    setThemeIcon(currentTheme === "light" ? <SunIcon /> : <MoonIcon />);
    setIsLightTheme(currentTheme === "light");
  };

  // This function changes the theme and updates state and localStorage
  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemeIcon(newTheme === "light" ? <SunIcon /> : <MoonIcon />);
    setIsLightTheme(newTheme === "light");
    saveTheme(newTheme);

    const themeElement = document.querySelector("div.radix-themes");
    if (themeElement) {
      themeElement.classList.replace(theme, newTheme);
    }
  };

  // Save the theme to localStorage
  const saveTheme = (value) => {
    localStorage.setItem("polemaTheme", value);
  };

  useEffect(() => {
    loadTheme();

    const themeElement = document.querySelector("div.radix-themes");
    if (themeElement) {
      if (themeElement.classList.length > 1) {
        const currentClass = themeElement.classList[1];
        themeElement.classList.remove(currentClass);
      }
      themeElement.classList.add(theme);
    }
  }, [theme]); // Add `theme` as a dependency to re-run effect when theme changes

  return (
    <>
      <Card className={` ${styling}`}>
        <h1 onClick={changeTheme} className="cursor-pointer">
          {themeIcon}
        </h1>
      </Card>
    </>
  );
};

export default ThemeSwitcher;
