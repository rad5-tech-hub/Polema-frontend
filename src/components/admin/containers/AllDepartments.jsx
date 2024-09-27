import React, { useEffect } from "react";
import axios from "axios";
import UpdateURL from "./ChangeRoute";
import { Heading, Table, Spinner } from "@radix-ui/themes";
import { useState } from "react";

// All imports for the dropdown menu
import { DeleteIcon, DropDownIcon } from "../../icons";
import {
  DropdownMenu,
  Button,
  TextField,
  Select,
  Flex,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTags } from "@fortawesome/free-solid-svg-icons";
import { Suspend } from "../../icons";

//All imports for the Dialog Box
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

//Delete Dialog Box $//
const DeleteDialog = ({ isOpen, onClose, user, id }) => {
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

  // State management for deepartments
  const [departments, setDepartments] = useState([]);

  // State management for delete dialog
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Function for handling delete dialog
  const handleDeleteClick = (staff) => {
    setSelectedDepartment(staff);
  };

  const fetchDept = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
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

      {
        response.data.departments.length
          ? setDepartments(response.data.departments)
          : setDepartments([]);
      }
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

  return (
    <>
      <UpdateURL url={"/all-departments"} />
      <Heading>All Departments</Heading>
      <Table.Root variant="surface" className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DEPARTMENT NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PRODUCTS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CATEGORY</Table.ColumnHeaderCell>
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
                  <div className="absolute right-4 top-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" className="cursor-pointer">
                          <DropDownIcon />
                          {/* <DropdownMenu.TriggerIcon /> */}
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          shortcut={<FontAwesomeIcon icon={faPen} />}
                          onClick={() =>
                            console.log("handleDeleteClick(product)")
                          }
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
          isOpen={!!selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          id={selectedDepartment.id}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllDepartments;
