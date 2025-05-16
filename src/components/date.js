const refractor = (ISO_DATE) => {
  const date = new Date(ISO_DATE);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formattedDate;
};

const refractorToTime = (ISO_DATE) => {
  const date = new Date(ISO_DATE);
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedTime;
};

// Funciton to format money
function formatMoney(value) {
  // Check for null or undefined
  if (value === null || value === undefined) {
    return "";
  }

  // Convert to a number if it's a string
  value = typeof value === "string" ? parseFloat(value) : value;

  // Return an empty string if the value is not a valid number
  if (isNaN(value)) {
    return "";
  }

  // Format the number: whole numbers without decimals, others with two decimal places
  const formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(2);

  // Split integer and decimal parts
  const [integerPart, decimalPart] = formattedValue.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return formatted string with decimal part if it exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
// function to check if a number is negative
function isNegative(value) {
    // Convert to number if string
    const num = Number(value);
    // Check if it's a valid number and negative
    return !isNaN(num) && num < 0;
}

export { refractor, refractorToTime, formatMoney,isNegative };
