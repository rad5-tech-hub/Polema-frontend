const TransactionTag = ({ entry }) => {
  return (
    <>
      {entry.unit === null
        ? ""
        : entry.unit === "" || entry.unit === "N/A"
        ? ""
        : " ordered"}
      {entry.order == null && entry.debit > entry.credit && " (extra)"}
      {entry.order == null && entry.credit > entry.debit && " (returned)"}
    </>
  );
};

export default TransactionTag;
