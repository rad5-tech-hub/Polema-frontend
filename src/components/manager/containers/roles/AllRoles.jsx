import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Heading, Spinner, Table } from "@radix-ui/themes";
import { DropDownIcon } from "../../../icons";
import { DropdownMenu } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axios from "axios";
import EditRole from "./EditRole";

const AllRoles = () => {
  const navigate = useNavigate();
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const root = import.meta.env.VITE_ROOT;

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${root}/admin/get-roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRolesList(response.data.roles || []);
      toast.success("Roles fetched successfully");
    } catch (err) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      {editDialogOpen ? (
        <EditRole
          selectedRole={selectedRole}
          setEditDialogOpen={setEditDialogOpen}
        />
      ) : (
        <div>
          <Heading className="mb-4">Roles</Heading>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PERMISSION</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            {loading ? (
              <div className="p-4">
                <Spinner />
              </div>
            ) : (
              <Table.Body>
                {rolesList.length === 0
                  ? "No roles assigned yet"
                  : rolesList.map((role) => (
                      <Table.Row key={role.id}>
                        <Table.RowHeaderCell>{role.name}</Table.RowHeaderCell>
                        <Table.RowHeaderCell>
                          {role.nav.map((perm) => perm.name).join(", ")}
                        </Table.RowHeaderCell>
                        <Table.RowHeaderCell>
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="cursor-pointer">
                              <Button variant="surface">
                                <DropDownIcon />
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item
                                shortcut={<FontAwesomeIcon icon={faPen} />}
                                onClick={() =>
                                  navigate(`/admin/admins/edit-role/${role.id}`)
                                }
                              >
                                Edit
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </Table.RowHeaderCell>
                      </Table.Row>
                    ))}
              </Table.Body>
            )}
          </Table.Root>
        </div>
      )}
    </>
  );
};

export default AllRoles;
