import { Heading, Table, Spinner, Button } from "@radix-ui/themes";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { upperFirst } from "lodash";
import { DropdownMenu } from "@radix-ui/themes";
import { faRedoAlt, faClose } from "@fortawesome/free-solid-svg-icons";

import { DropDownIcon, DeleteIcon } from "../../../icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { refractor } from "../../../date";
import UpdateURL from "../ChangeRoute";
import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

// Restore Dialog
const RestoreDialog = ({ isOpen, onClose, runfetch, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);

  const restoreAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.patch(
        `${root}/admin/restore-staff/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setSuspendLoading(false);
      console.log(response);
      toast.success("Admin Restored successfully", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
      onClose();
      runfetch();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      console.log(error);
      toast.error("Error in restoring staff", {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-black">
            Suspend User
          </Dialog.Title>
          <Heading className="mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to restore this user as an admin ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="bg-blue-700 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              onClick={() => restoreAdmin(id)}
              className="ml-4 bg-red-500 text-white hover:bg-red-600 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
            >
              {suspendLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

//Delete Dialog
const DeleteDialog = ({ isOpen, onClose, runfetch, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);

  const deleteAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }
    try {
      const response = await axios.delete(`${root}/admin/delete-staff/${id}`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuspendLoading(false);
      console.log(response);
      onClose();
      toast.success("Admin Deleted successfully");
      runfetch();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      console.log(error);
      toast.error("Error in deleting staff");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium text-black">
            Delete User
          </Dialog.Title>
          <Heading className="mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
            {`Are you sure you want to permanently remove this user as an admin ?`}
          </Heading>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="bg-blue-700 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              >
                No
              </button>
            </Dialog.Close>
            <button
              onClick={() => deleteAdmin(id)}
              className="ml-4 bg-red-500 text-white hover:bg-red-600 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
            >
              {suspendLoading ? <LoaderIcon /> : "Yes"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AllSuspended = () => {
  const [suspended, setSuspended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [dialogType, setDialogType] = useState(null);

  const fetchSuspended = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/suspended-staff`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setLoading(false);
      console.log(response.data);

      setSuspended(response.data.suspendedStaffList);
      toast.success(response.data.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };

  useEffect(() => {
    fetchSuspended();
  }, []);

  return (
    <>
      <Heading className="mb-4">Suspended Admins</Heading>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>SUSPEND DATE</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Spinner />
        ) : (
          <Table.Body>
            {suspended.length === 0 ? (
              <Table.Row className="relative">
                <Table.Cell colSpan={4} className="text-center">
                  No Admins suspeneded.
                </Table.Cell>
              </Table.Row>
            ) : (
              suspended.map((staff) => (
                <Table.Row key={staff.id} className="relative">
                  <Table.RowHeaderCell>
                    {upperFirst(staff.firstname)} {upperFirst(staff.lastname)}
                  </Table.RowHeaderCell>
                  <Table.RowHeaderCell>{staff.email}</Table.RowHeaderCell>
                  <Table.RowHeaderCell>
                    {refractor(staff.updatedAt)}
                  </Table.RowHeaderCell>

                  <div className="absolute right-4 top-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" className="cursor-pointer">
                          <DropDownIcon />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          color="green"
                          shortcut={<FontAwesomeIcon icon={faRedoAlt} />}
                          onClick={() => {
                            setDialogType("restore");
                            setSelectedStaffId(staff.id);
                          }}
                        >
                          Restore
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          shortcut={<DeleteIcon />}
                          onClick={() => {
                            setDialogType("delete");
                            setSelectedStaffId(staff.id);
                          }}
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

      {/* Render dialogs conditionally based on dialog type */}
      {dialogType === "restore" && (
        <RestoreDialog
          isOpen={!!selectedStaffId}
          onClose={() => setDialogType(null)}
          runfetch={fetchSuspended}
          id={selectedStaffId}
        />
      )}
      {dialogType === "delete" && (
        <DeleteDialog
          isOpen={!!selectedStaffId}
          onClose={() => setDialogType(null)}
          runfetch={fetchSuspended}
          id={selectedStaffId}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AllSuspended;
