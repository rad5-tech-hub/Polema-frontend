import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { refractor } from "../../../date";
import {
  faClose,
  faArrowCircleLeft,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { DropDownIcon, Suspend } from "../../../icons";

import {
  DropdownMenu,
  Button,
  Spinner,
  Table,
  Heading,
  Flex,
  Separator,
  Select,
  TextField,
  Grid,
} from "@radix-ui/themes";
import { upperFirst } from "lodash";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useToast from "../../../../hooks/useToast";
const root = import.meta.env.VITE_ROOT;

const SuspendDialog = ({ isOpen, onClose, runFetch, id }) => {
  const [suspendLoading, setSuspendLoading] = useState(false);
  const showToast = useToast()

  const suspendAdmin = async (id) => {
    setSuspendLoading(true);
    const retrToken = localStorage.getItem("token");

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
      onClose();
      showToast({
        message: "Admin Suspended successfully",
        type: "success",
        duration: 3500,
      })
      runFetch();
    } catch (error) {
      setSuspendLoading(false);
      onClose();
      toast.error(error.response?.data.error || error.message, {
        duration: 6500,
        style: {
          padding: "30px",
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[101]">
      <div className="relative w-[90vw] max-w-[450px] bg-white rounded-[6px] p-[25px] shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-[17px] font-medium text-black">Suspend User</h2>
          <button onClick={onClose} className="focus:outline-none">
            <FontAwesomeIcon icon={faClose} color="black" />
          </button>
        </div>

        <p className="mt-[10px] mb-5 text-center text-[15px] text-black leading-normal">
          {`Are you sure you want to suspend this user?`}
        </p>

        <div className="flex justify-end mt-[25px]">
          <button
            onClick={onClose}
            className="bg-blue-700 text-white px-[15px] h-[35px] rounded-[4px] font-medium focus:outline-none"
          >
            No
          </button>
          <button
            onClick={() => suspendAdmin(id)}
            className="ml-4 bg-red-500 text-white hover:bg-red-600 px-[15px] h-[35px] rounded-[4px] font-medium focus:outline-none"
          >
            {suspendLoading ? <LoaderIcon /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};
const AllAdmins = () => {
  const [staffList, setStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State management for the suspend dialog boxes
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  // State management for the selected staff for suspend dialog
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [adminForEdit, setAdminForEdit] = useState("");

  //State management fot the edit dialog boxes
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

      setStaffList(response.data.staffList);
    } catch (error) {
      console.error(error);
      {
        error.message
          ? toast.error(error.message)
          : toast.error("An Error Occured");
      }
    } finally {
      setLoading(false);
    }
  };

  // Find role name by matching role ID
  const getRoleNameById = (roleId) => {
    const role = rolesList.find((role) => role.id === roleId);
    return role ? role.name : "No Role Assigned";
  };

  // Handle opening the suspend dialog for a specific staff
  const handleSuspendClick = (staff) => {
    setSelectedStaff(staff);
  };

  const handleEditClick = (admin) => {
    setEditDialogOpen(true);
    setAdminForEdit(admin);
  };

  useEffect(() => {
    fetchRoles();
    fetchStaffData();
  }, []);

  // --------------------
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

  // Filter and highlight staff list by name
  const filteredStaff = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return staffList
      .filter((staff) =>
        `${staff.firstname.toLowerCase()} ${staff.lastname.toLowerCase()}`.includes(
          searchLower
        )
      )
      .map((staff) => ({
        ...staff,
        highlightedName: highlightText(
          `${staff.firstname} ${staff.lastname}`,
          searchLower
        ),
      }));
  }, [searchTerm, staffList]);

  return (
    <>
      {editDialogOpen ? (
        <EditDialog />
      ) : (
        <div>
          <Heading>Admins</Heading>
          <TextField.Root
            placeholder="Search admins"
            className="my-4 w-[60%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>

          <Table.Root variant="surface" size={"3"} className="mt-4">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>NAME</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>EMAIL</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>ROLE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>SIGNATURE</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            {loading ? (
              <Spinner size={"2"} className="my-4 ml-4" />
            ) : filteredStaff.length === 0 ? (
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No Admins Yet
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ) : (
              <Table.Body>
                {filteredStaff.map((staff, index) => (
                  <Table.Row key={index} className="relative">
                    <Table.Cell>{refractor(staff.createdAt)}</Table.Cell>
                    <Table.RowHeaderCell>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: staff.highlightedName,
                        }}
                      />
                    </Table.RowHeaderCell>
                    <Table.Cell>{staff.email}</Table.Cell>
                    <Table.Cell>{getRoleNameById(staff.roleId)}</Table.Cell>
                    <Table.Cell
                      className={`${
                        staff.signature ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {staff.signature ? "Signed" : "Pending"}
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface" className="cursor-pointer">
                            <DropDownIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            shortcut={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => {
                              navigate(`/admin/admins/edit-admin/${staff.id}`);
                            }}
                          >
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            color="red"
                            shortcut={<Suspend />}
                            onClick={() => handleSuspendClick(staff)}
                          >
                            Suspend
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table.Root>

          {/* Suspend Dialog */}
          {selectedStaff && (
            <SuspendDialog
              isOpen={!!selectedStaff}
              onClose={() => setSelectedStaff(null)}
              user={selectedStaff.firstname}
              runFetch={fetchStaffData}
              id={selectedStaff.id}
            />
          )}

          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
};

export default AllAdmins;
