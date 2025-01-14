import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { Button, Heading, Spinner, Table } from "@radix-ui/themes";
import { DropDownIcon } from "../../../icons";
import { DropdownMenu, TextField } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axios from "axios";
import EditRole from "./EditRole";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

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

  const [searchTerm, setSearchTerm] = useState("");

  // Function to highlight matching text
  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="bg-yellow-200">${match}</span>`
    );
  };

  // Filter and highlight roles by name
  const filteredRoles = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return rolesList
      .filter((role) => role.name.toLowerCase().includes(searchLower))
      .map((role) => ({
        ...role,
        highlightedName: highlightText(role.name, searchLower),
      }));
  }, [searchTerm, rolesList]);

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
          <TextField.Root
            placeholder="Search roles"
            className="mb-4 w-[60%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>

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
                {filteredRoles.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={3} className="text-center">
                      No roles assigned yet
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredRoles.map((role) => (
                    <Table.Row key={role.id}>
                      <Table.RowHeaderCell
                        dangerouslySetInnerHTML={{
                          __html: role.highlightedName,
                        }}
                      />
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
                  ))
                )}
              </Table.Body>
            )}
          </Table.Root>
        </div>
      )}
    </>
  );
};

export default AllRoles;
