// DynamicIcon.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

// Create a mapping of icon names to FontAwesomeIcon components
const iconMapping = {
  "fa-heart": solidIcons.faHeart,
  "fa-user": solidIcons.faUser,
  "fa-coffee": solidIcons.faCoffee,
  // Add other icon mappings here
};

const DynamicIcon = ({ iconName, ...props }) => {
  const icon = iconMapping[iconName];

  if (!icon) {
    return <span>Icon not found</span>; // Or return a default icon
  }

  return <FontAwesomeIcon icon={icon} {...props} />;
};

export default DynamicIcon;
