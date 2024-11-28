import { useState } from "react";

export const usePagination = (data = [], number) => {
  const itemsPerPage = number; // Fixed number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page) =>
    setCurrentPage(() => Math.min(Math.max(page, 1), totalPages));

  return {
    currentData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};
