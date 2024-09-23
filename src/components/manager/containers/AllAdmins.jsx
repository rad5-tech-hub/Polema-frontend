import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { DeleteIcon, DropDownIcon, Suspend } from "../../icons";

import {
  DropdownMenu,
  Button,
  Spinner,
  Table,
  Heading,
  Flex,
  Card,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";

import UpdateURL from "./ChangeRoute";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const root = import.meta.env.VITE_ROOT;

// Suspend Dialog
const SuspendDialog = ({ isOpen, onClose, user, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);

  const suspendAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.patch(
        `${root}/admin/suspend-staff/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setSuspendLoading(false);
      console.log(response);
      onClose();
      toast.success("Admin Suspended successfully");
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      console.log(error);
      toast.error("Error in suspending staff");
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] font-medium text-black">
            Suspend User
          </Dialog.Title>
          <Heading className=" mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to suspend ${user} ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-blue-700 focus:shadow-red7 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                suspendAdmin(id);
              }}
              className=" ml-4 bg-red-500 text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              {suspendLoading ? <LoaderIcon /> : "Yes"}
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

// Edit Dialog

const AllAdmins = () => {
  const [staffList, setStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State management for the dialog boxes
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  // Fetch all roles from db and match with that of the staff data
  const fetchRoles = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-rolePerm`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setRolesList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data from db
  const fetchStaffData = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get(`${root}/admin/all-staff`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      toast.success("Successful Retrieval");
      console.log(response);

      setStaffList(response.data.staffList);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error fetching data");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Find role name by matching role ID
  const getRoleNameById = (roleId) => {
    const role = rolesList.find((role) => role.id === roleId);
    return role ? role.name : "No Role Assigned";
  };

  const handleSuspendClick = () => {
    // Open the suspend dialog
    console.log("Clciked Suspend button");
  };

  useEffect(() => {
    fetchRoles();
    fetchStaffData();
  }, []);

  return (
    <>
      <UpdateURL url={"/view-admins"} />
      <Heading>Admins</Heading>
      <Table.Root variant="surface" size={"3"} className="mt-4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Spinner size={"2"} className="my-4 ml-4" />
        ) : (
          <Table.Body>
            {staffList.length === 0
              ? "No Admins yet"
              : staffList.map((staff, index) => (
                  <>
                    <Table.Row key={index} className="relative">
                      <Table.RowHeaderCell
                        className={`${staff.active ? "" : "text-red-400"}`}
                      >{`${upperFirst(staff.firstname)} ${
                        staff.lastname
                      }`}</Table.RowHeaderCell>
                      <Table.Cell
                        className={`${staff.active ? "" : "text-red-400"}`}
                      >
                        {staff.email}
                      </Table.Cell>
                      <Table.Cell>{getRoleNameById(staff.roleId)}</Table.Cell>
                      <div className="absolute right-4 top-2">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button
                              variant="surface"
                              className="cursor-pointer"
                            >
                              <DropDownIcon />
                              {/* <DropdownMenu.TriggerIcon /> */}
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              shortcut={<FontAwesomeIcon icon={faPen} />}
                              onClick={() => console.log("Cliced")}
                            >
                              Edit
                            </DropdownMenu.Item>
                            {}
                            <DropdownMenu.Item
                              color="red"
                              shortcut={<Suspend />}
                              onClick={() => setSuspendDialogOpen(true)}
                            >
                              Suspend
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </div>
                    </Table.Row>
                    {suspendDialogOpen && (
                      <SuspendDialog
                        isOpen={suspendDialogOpen}
                        onClose={() => setSuspendDialogOpen(false)}
                        user={staff.firstname}
                        id={staff.id}
                      />
                    )}
                  </>
                ))}
          </Table.Body>
        )}
      </Table.Root>
      {/* Suspend Dialog */}

      <Toaster position="bottom-center" />
    </>
  );
};

export default AllAdmins;
