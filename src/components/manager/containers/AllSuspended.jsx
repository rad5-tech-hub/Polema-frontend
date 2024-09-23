import { Heading, Table, Spinner, Button } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { upperFirst } from "lodash";
import { DropdownMenu } from "@radix-ui/themes";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { DropDownIcon, DeleteIcon } from "../../icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UpdateURL from "./ChangeRoute";
import toast, { Toaster } from "react-hot-toast";
const root = import.meta.env.VITE_ROOT;

const AllSuspended = () => {
  const [suspended, setSuspended] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuspended = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
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
      console.log(response);
      setSuspended(response.data.suspendedStaffList);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.success("An error occurred in fetching suspended staff ");
    }
  };

  useEffect(() => {
    fetchSuspended();
  }, []);
  return (
    <>
      <UpdateURL url={"/suspended-admins"} />
      <Heading className="mb-4">Suspended Admins</Heading>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Spinner />
        ) : (
          <Table.Body>
            {suspended.length === 0 ? (
              "No Assigned Roles yet"
            ) : (
              <>
                {suspended.map((staff, name) => {
                  return (
                    <Table.Row className="relative">
                      <Table.RowHeaderCell>
                        {upperFirst(staff.firstname)}{" "}
                        {upperFirst(staff.lastname)}
                      </Table.RowHeaderCell>
                      <Table.RowHeaderCell>{staff.email}</Table.RowHeaderCell>
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
                              color="green"
                              shortcut={<FontAwesomeIcon icon={faRedoAlt} />}
                              onClick={() => console.log("Cliced")}
                            >
                              Restore
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
      <Toaster position="bottom-center" />
    </>
  );
};

export default AllSuspended;
