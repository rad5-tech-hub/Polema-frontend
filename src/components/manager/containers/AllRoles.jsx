import React, { useEffect, useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { DeleteIcon, DropDownIcon, Suspend } from "../../icons";
import { faClose, faPen } from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import { Heading, Spinner, Table, Button } from "@radix-ui/themes";
import UpdateURL from "./ChangeRoute";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const deleteRole = async (id) => {
  try {
    const response = axios.delete(`${root}/`);
  } catch (error) {}
};

const DeleteDialog = () => {
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
                // suspendAdmin(id);
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

const AllRoles = () => {
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRoles = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/get-roles`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      setLoading(false);
      setRolesList(response.data.roles);
      toast.success("Retrieved Successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred .Try again ");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <UpdateURL url={"/view-roles"} />
      <Heading className="mb-4">Roles</Heading>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PERMISSION</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Spinner />
        ) : (
          <Table.Body>
            {rolesList.length === 0 ? (
              "No Assigned Roles yet"
            ) : (
              <>
                {rolesList.map((role, name) => {
                  return (
                    <Table.Row className="relative">
                      <Table.RowHeaderCell>{role.name}</Table.RowHeaderCell>
                      <Table.RowHeaderCell>
                        {role.permissions.map((perm, index) => (
                          <span key={index}>
                            {perm.name}
                            <br />
                          </span>
                        ))}
                      </Table.RowHeaderCell>
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
                              shortcut={<DeleteIcon />}
                              onClick={() => setSuspendDialogOpen(true)}
                            >
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </div>
                    </Table.Row>
                  );
                })}
              </>
            )}
          </Table.Body>
        )}
      </Table.Root>
    </>
  );
};

export default AllRoles;
