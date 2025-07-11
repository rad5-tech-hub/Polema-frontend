const TransactionTag = ({ entry }) => {
  return (
    <>
      {entry.unit === null
        ? ""
        : entry.unit === "" || entry.unit === "N/A"
        ? ""
        : " ordered"}
      {entry.order == null && entry.debit > entry.credit && " (excess)"}
      {entry.order == null && entry.credit > entry.debit && " (shortage)"}
    </>
  );
};

export default TransactionTag;
