// DynamicIcon.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

// Create a mapping of icon names to FontAwesomeIcon components
const iconMapping = {
  "fa-heart": solidIcons.faHeart,
  "fa-user": solidIcons.faUsers,
  "fa-coffee": solidIcons.faCoffee,
  "fa-truck-loading": solidIcons.faTruckLoading,
  "fa-box-open": solidIcons.faBoxOpen,
  "fa-pills": solidIcons.faPills,
  "fa-store": solidIcons.faStore,
  "fa-store-alt": solidIcons.faStoreAlt,
  "fa-book": solidIcons.faBook,
  "fa-shopping-cart": solidIcons.faShoppingCart,
  "fa-ticket-alt": solidIcons.faTicketAlt,
  "fa-tags": solidIcons.faTags,
  "fa-user-shield": solidIcons.faUserShield,
  "fa-building": solidIcons.faBuilding,
  "fa-money-bill-wave": solidIcons.faMoneyBillWave,
  "fa-calculator": solidIcons.faCalculator,
  "fa-balance-scale": solidIcons.faBalanceScale,
  "fa-file-alt": solidIcons.faFileAlt,
  "fa-bell": solidIcons.faBell,
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
