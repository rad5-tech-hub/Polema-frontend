import React, { useEffect, useState } from "react";
import { Heading, Spinner, Table } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";
import { refractor } from "../../../date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare ,faPen,faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu , Button} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const root = import.meta.env.VITE_ROOT;

const AllWayBill = () => {
  const [billDetails, setBillDetails] = useState([]);
  const [failedSearch, setFailedSearch] = useState(false);
  const [failedText, setFailedText] = useState("");
  const [loading, setLoading] = useState(true);

const navigate = useNavigate()

  // Function to fetch all waybills
  const fetchWaybills = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred, try logging in again", {
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-all-waybill`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { waybills } = response.data;

      if (!waybills || waybills.length === 0) {
        setFailedText("No records found.");
        setFailedSearch(true);
        setBillDetails([]);
      } else {
        setFailedSearch(false);
        setBillDetails(waybills);
      }
    } catch (error) {
      console.error("Error fetching waybills:", error);
      toast.error("Failed to fetch waybills. Please try again.", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get matching color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    fetchWaybills();
  }, []);

  return (
    <>
      <Heading>View All Waybills</Heading>

      <Table.Root variant="surface" className="mt-3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BAGS(PKC)</Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell>TO</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ADDRESS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              TRANSPORT CARRIED OUT BY
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>VEHICLE NO.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center p-4">
                <Spinner />
              </Table.Cell>
            </Table.Row>
          ) : failedSearch ? (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center p-4">
                {failedText}
              </Table.Cell>
            </Table.Row>
          ) : (
            billDetails.map((item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>
                  {refractor(item.createdAt)}
                </Table.RowHeaderCell>

                <Table.Cell>{item.bags ? `${item.bags} bags` : ""}</Table.Cell>
                <Table.Cell>{`${item?.transaction.corder?.firstname || ""} ${
                  item?.transaction.corder?.lastname || ""
                }`}</Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>{item.transportedBy || ""}</Table.Cell>
                <Table.Cell>{item.invoice?.vehicleNo || ""}</Table.Cell>

                <Table.Cell>
                  <>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${getStatusColor(item.status)}`}
                    />{" "}
                    {_.upperFirst(item.status) || ""}
                  </>
                </Table.Cell>
                <Table.Cell>
                  {item.status === "approved" && (
                    <div className="r">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface" className="cursor-pointer">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="solid">
                          <DropdownMenu.Item
                            // shortcut={<FontAwesomeIcon icon={faPen} />} 
                            onClick={() => 
                              navigate(`/admin/receipts/waybill-invoice/${item.id}`)
                            }
                          >
                            View Approved Waybill
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
          .
        </Table.Body>
      </Table.Root>

      <Toaster position="top-right" />
    </>
  );
};

export default AllWayBill;
