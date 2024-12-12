import React, { useState, useEffect } from "react";
import { Heading } from "@radix-ui/themes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AllDispatchNote = () => {
  const [dispatchNotes, setDispatchNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks the active dropdown
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(5); // Number of items per page
  const navigate = useNavigate();

  // Fetch dispatch notes from API
  const fetchDispatchNotes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      toast.error("Unauthorized: No token provided.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://polema.bookbank.com.ng/customer/get-all-vehicle-dispatch",
        {
          headers: { Authorization: `Bearer ${token}` }, // Attach token in Authorization header
        }
      );
      setDispatchNotes(response.data.vehicles);
      toast.success("Dispatch notes retrieved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dispatch notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchNotes();
  }, []);

  // Calculate the current page's data to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dispatchNotes.slice(indexOfFirstItem, indexOfLastItem);

  // Handle navigation to view dispatch receipt
  const handleViewDispatch = (dispatchId) => {
    navigate(`/admin/receipt/receipt-dispatchnote/${dispatchId}`);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(dispatchNotes.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Heading className="flex justify-between items-center border-b border-gray-400 py-6">
        View All Vehicle Dispatch Note
        <button
          onClick={() => navigate("/admin/receipts/vehicle-dispatch-note")}
          className="border border-gray-400 px-8 py-2 rounded-lg shadow-lg text-gray-600 bg-white text-[15px]"
        >
          Create New
        </button>
      </Heading>

      {/* Table to display dispatch notes */}
      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <table className="table-auto w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 w-1/6 whitespace-nowrap">
                DATE
              </th>
              <th className="text-left px-4 py-2 w-1/5 whitespace-nowrap">
                DRIVER'S NAME
              </th>
              <th className="text-left px-4 py-2 w-1/5 whitespace-nowrap">
                ESCORT'S NAME
              </th>
              <th className="text-left px-4 py-2 w-1/6 whitespace-nowrap">
                VEHICLE NO
              </th>
              <th className="text-left px-4 py-2 w-1/4 whitespace-normal">
                DESTINATION
              </th>
              <th className="text-left px-4 py-2 w-1/12">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((note) => (
              <tr
                key={note.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{note.driversName}</td>
                <td className="px-4 py-2">{note.escortName}</td>
                <td className="px-4 py-2">{note.vehicleNo}</td>
                <td className="px-4 py-2 break-words">{note.destination}</td>
                <td className="relative px-4 py-2">
                  {/* Three-dot menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      setActiveDropdown((prev) =>
                        prev === note.id ? null : note.id
                      );
                    }}
                    className="text-gray-500 hover:text-black focus:outline-none"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>

                  {/* Dropdown Popover */}
                  {activeDropdown === note.id && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-50 w-24 px-4 py-2 dropdown-container flex justify-center items-center">
                      <button
                        onClick={() => handleViewDispatch(note.id)}
                        className="px-4 py-2 text-[15px] hover:bg-theme/75 hover:text-white text-gray-600 flex justify-center items-center rounded-lg"
                      >
                        View
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loading && dispatchNotes.length > 0 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-2">
            <button
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`px-4 py-2 text-sm rounded-lg ${
                  currentPage === number
                    ? "bg-theme text-white"
                    : "bg-gray-200 text-gray-600"
                } hover:bg-theme/75`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            <button
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default AllDispatchNote;
