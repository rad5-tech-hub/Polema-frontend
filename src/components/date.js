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
function formatMoney(value, separator) {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new Error("Value must be a number or a string.");
  }

  const [integerPart, decimalPart] = value.toString().split(".");
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

export { refractor, refractorToTime, formatMoney };
