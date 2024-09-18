import React, { useEffect } from "react";

const UpdateURL = ({ url }) => {
  // Clean up the URL to remove leading/trailing slashes
  const cleanedUrl = url.replace(/^\/|\/$/g, "");

  // Set the base path to reset to (e.g., '/md')
  const basePath = "/md";

  // Construct the new URL using the base path and the cleaned URL
  const newUrl = `${basePath}/${cleanedUrl}`;

  console.log(newUrl);

  // Update the URL without reloading the page
  window.history.replaceState(null, "", newUrl);

  return null;
};

export default UpdateURL;
