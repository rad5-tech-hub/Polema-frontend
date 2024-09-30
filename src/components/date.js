const refractor = (ISO_DATE) => {
  const date = new Date(ISO_DATE);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formattedDate;
};

export { refractor };
