import React from "react";
import { NavLink } from "react-router-dom";

import {
  ClipboardCopyIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
const DropDown = ({ label, loopData }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleToggle = () => {
    setOpenDropdown(!openDropdown);
  };
  return (
    <>
      <p
        className="flex gap-3 items-center px-4 cursor-pointer"
        onClick={handleToggle}
      >
        <ClipboardCopyIcon width={18} height={18} />
        <p>{label}</p>
        {openDropdown ? <CaretUpIcon /> : <CaretDownIcon />}
      </p>

      <ul className="ml-[35px] list-disc px-4 text-current ">
        <li className="p-2 ">{data.title}</li>
      </ul>
    </>
  );
};

export default DropDown;
