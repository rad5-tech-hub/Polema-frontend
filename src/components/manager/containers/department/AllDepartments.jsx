import React, { useEffect } from "react";
import { refractor } from "../../../date";
import axios from "axios";
import UpdateURL from "../ChangeRoute";
import { Heading, Table, Spinner } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../../icons";
import {
  DropdownMenu,
  Button,
  Card,
  Separator,
  TextField,
  Select,
  Flex,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTags } from "@fortawesome/free-solid-svg-icons";
import { Suspend } from "../../../icons";

//All imports for the Dialog Box
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

//Delete Dialog Box $//
const DeleteDialog = ({ isOpen, onClose, runfetch, id }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteDept = async (id) => {
    setDeleteLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }

    try {
      const response = await axios.delete(
        `${root}/dept/delete-department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      console.log(response);
      setDeleteLoading(false);
      toast.success(response.data.message);
      onClose();
      runfetch();
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      toast.error(error.message);
      onClose();
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Delete Department
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to delete this Department ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-blue-500 hover:bg-blue-800 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              disabled={deleteLoading}
              onClick={() => {
                deleteDept(id);
              }}
              className=" ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {deleteLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AllDepartments = () => {
  const [loading, setLoading] = useState(true);

  // Add a separate state to manage the delete dialog visibility
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // State for managing edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Track selected department for editing
  const [departmentName, setDepartmentName] = useState(""); // Track department name input

  // State management for all departments
  const [departments, setDepartments] = useState([]);

  // Function for handling delete dialog
  const handleDeleteClick = (staff) => {
    setSelectedDepartment(staff);
    setIsDeleteOpen(true); // Open the delete dialog
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setSelectedDepartment(null);
    setIsDeleteOpen(false);
  };

  const handleEditClick = (dept) => {
    setSelectedDepartment(dept); // Store the selected department's details
    setDepartmentName(dept.name); // Set the department name in the state
    setIsEditOpen(true); // Open the edit dialog
  };

  const fetchDept = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      onClose();
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/view-department`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });
      setLoading(false);
      response.data.departments.length
        ? setDepartments(response.data.departments)
        : setDepartments([]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDept();
  }, []);

  // Edit Dialog Component
  const EditDialog = () => {
    const editDept = async (e) => {
      setLoading(true);
      console.log(e);

      e.preventDefault();
      const retrToken = localStorage.getItem("token");

      // Check if the token is available
      if (!retrToken) {
        toast.error("An error occurred. Try logging in again");

        return;
      }

      try {
        const response = await axios.patch(
          `${root}/dept/edit-department/${selectedDepartment.id}`,
          {
            name: e.target[0].value,
          },
          {
            headers: {
              Authorization: `Bearer ${retrToken}`,
            },
          }
        );
        setLoading(false);
        toast.success(response.data.message, {
          duration: 6500,
          style: {
            padding: "30px",
          },
        });
        setTimeout(() => {
          setIsEditOpen(false);
        }, 1500);
        fetchDept();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    return (
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Card className="p-4">
          <Heading>Edit Department</Heading>
          <form action="" onSubmit={editDept} className="mt-4">
            {/* Input for department name */}
            <div>
              <label
                htmlFor="name"
                className="block text-smfont-medium leading-6"
              >
                Department Name
              </label>
              <TextField.Root
                defaultValue={departmentName}
                placeholder="Enter Department Name"
                className="mt-1  p-1 w-[50%]"
                // Update state on change
              />
            </div>
            <Flex className="mt-6" justify={"end"} gap={"3"}>
              <Button
                color="red"
                onClick={() => setIsEditOpen(false)}
                className="cursor-pointer"
              >
                Discard Changes
              </Button>
              <Button
                size={"2"}
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? <Spinner /> : "Save Changes"}
              </Button>
            </Flex>
          </form>
          {/* </Card> */}
        </Card>
        <Toaster position="top-right" />
      </Dialog.Root>
    );
  };

  return (
    <>
      {isEditOpen ? (
        <EditDialog />
      ) : (
        <div>
          <TextField.Root
            placeholder="Search department.."
            className="w-[55%] mb-5"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height={"16"} width={"16"} />
            </TextField.Slot>
          </TextField.Root>

          <Heading>All Departments</Heading>
          <Table.Root className="mt-4">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  DEPARTMENT NAME
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  PRODUCTS
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  CATEGORY
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  DATE
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            {loading ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              <Table.Body>
                {departments.length === 0 ? (
                  <Table.Row className="relative">
                    <Table.Cell colSpan={4} className="text-center">
                      No Departments Yet
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  departments.map((dept) => (
                    <Table.Row key={dept.id} className="relative">
                      <Table.RowHeaderCell>{dept.name}</Table.RowHeaderCell>
                      <Table.RowHeaderCell>
                        {dept.products.length === 0
                          ? "No Product Assigned yet"
                          : dept.products.map((product, index) => (
                              <span key={index}>
                                {product.name}
                                <br />
                              </span>
                            ))}
                      </Table.RowHeaderCell>
                      <Table.RowHeaderCell>
                        {dept.products.length === 0
                          ? "No Category Assigned yet"
                          : dept.products.map((product, index) => (
                              <span key={index}>
                                {product.category}
                                <br />
                              </span>
                            ))}
                      </Table.RowHeaderCell>
                      <Table.RowHeaderCell>
                        {refractor(dept.createdAt)}
                      </Table.RowHeaderCell>
                      <div className="absolute right-4 top-2">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button
                              variant="surface"
                              className="cursor-pointer"
                            >
                              <DropDownIcon />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              shortcut={<FontAwesomeIcon icon={faPen} />}
                              onClick={() => handleEditClick(dept)}
                            >
                              Edit
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              color="red"
                              shortcut={<DeleteIcon />}
                              onClick={() => handleDeleteClick(dept)}
                            >
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </div>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            )}
          </Table.Root>
          {selectedDepartment && (
            <DeleteDialog
              isOpen={isDeleteOpen} // Use the new delete state
              onClose={closeDeleteDialog} // Pass the close function
              id={selectedDepartment.id}
              runfetch={fetchDept}
            />
          )}

          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
};

export default AllDepartments;
