// DynamicIcon.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const DynamicIcon = ({ iconName }) => {
  // Dynamically map the iconName to the actual icon from the free-solid-icons library
  const icon = Icons[iconName];

  // Check if the icon exists
  if (!icon) {
    return <FontAwesomeIcon icon={faStar} />; // Or return a default/fallback icon
  }

  return <FontAwesomeIcon icon={icon} />;
};

export default DynamicIcon;
