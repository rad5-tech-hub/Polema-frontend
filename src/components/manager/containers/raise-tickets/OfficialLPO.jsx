import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Heading,
  Separator,
  Button,
  TextField,
  Select,
  Text,
  Flex,
  Grid,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
import toast from "react-hot-toast";
import { refractor, formatMoney } from "../../../date";
import useToast from "../../../../hooks/useToast";
const root = import.meta.env.VITE_ROOT;

const OfficialLPO = () => {
  const { id } = useParams();
  const showToast = useToast();
  const [suppliers, setSuppliers] = React.useState([]);
  const [raw, setRaw] = React.useState([]);
  const [lpoDetails, setLpoDetails] = useState("");

  // State management for form details
  const [receiver, setReceiver] = React.useState("");
  const [chequeNumber, setChequeNumber] = React.useState("");
  const [voucherNumber, setVoucherNumber] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");
  const [rawMaterialId, setRawMaterialId] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [quantityOrdered, setQuantityOrdered] = React.useState("");
  const [expiration, setExpiration] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [period, setPeriod] = React.useState("");
  const [admins, setAdmins] = React.useState([]);
  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/customer/get-suppliers`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setSuppliers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch raw materials
  const fetchRaw = async () => {
    const retrToken = localStorage.getItem("token");

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-raw-materials`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });
      setRaw(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get LPO details
  const getLPODetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/admin/view-approved-lpo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLpoDetails(response.data.record);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to send LPO to print queue
  const handleSendToPrint = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${root}/batch/add-lpo-to-print/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast({
        type: "success",
        message: "LPO successfully added to print queue.",
      });
    } catch (error) {
      console.error("Error sending LPO to print:", error);
      showToast({
        message: "Failed to add LPO to print queue. Please try again.",
        type: "error",
      });
    }
  };

  // Function to print the page
  const handlePrintPage = () => {
    window.print();
  };

  // Function to get details of all admins
  const getAdmins = async () => {
    const retrToken = localStorage.getItem("token");

    // Check if the token is available
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");

      return;
    }
    try {
      const response = await axios.get(`${root}/admin/all-admin`, {
        headers: {
          Authorization: `Bearer ${retrToken}`,
        },
      });

      setAdmins(response.data.staffList);
    } catch (error) {
      console.error(error);
      {
        error.message
          ? toast.error(error.message)
          : toast.error("An Error Occured");
      }
    } finally {
      console.log("Fetch function complete");
    }
  };

  const getAdminNameByID = (id) => {
    const admin = admins.find((admin) => admin.id === id);
    return admin ? admin : null
  }

  React.useEffect(() => {
    getLPODetails();
    getAdmins();
  }, []);

  return (
    <>
      {typeof lpoDetails === "string" ? (
        <div className="loader h-screen flex bg-black/50 justify-center items-center">
          <Spinner size="3" />
        </div>
      ) : (
        <div className="official-lpo">
          <style>
            {`
              * {
                box-shadow: none !important;
              }
              /* Ensure borders are visible */
              table, th, td {
                border: 1px solid black !important;
                padding: 8px !important;
              }
              table th {
                background-color: #E1E1E1 !important;
              }
            `}
          </style>
          {/* Print Section */}
          <div className="flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-lg font-semibold text-[#434343]">
              Approved Local Purchase Order
            </span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  color="brown"
                  className="rounded-lg h-[40px] border-[1px] border-[#919191] sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center"
                >
                  Print
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={handleSendToPrint}>
                  Send to Print
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handlePrintPage}>
                  Print
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>

          <div className="address flex gap-8 mt-16 lg:px-16">
            <div className="left border-r-2 border-b-2 border-[#4343434D] p-4">
              <h1 className="lg:text-[37px] text-[22px] font-serif">
                POLEMA <br /> INDUSTRIES LIMITED
              </h1>
              <p className="rc relative bottom-20 text-[22px] italic lg:left-72 left-32 text-[#919191] w-fit">
                Rc131127
              </p>
              <p className="text-[20px] mt-[-35px]">
                Manufacturers & Exporters of Palm Kernel Oil, Palm <br /> Kernel
                Cakes and Pharmaceuticals
              </p>
            </div>

            <div className="right flex flex-col gap-4">
              <h1 className="text-[20px]">
                <span className="font-bold">FACTORY/OFFICE:</span> Osisioma ind.
                Layout, Osisioma <br /> L.G.A, Abia State. <br />
                Tel: 08182518832 <br /> Email: polema_@yahoo.com
              </h1>
            </div>
          </div>

          <Heading className="text-center mt-8">Local Purchase Order</Heading>
          <form action="" className="px-16">
            <Flex gap="5" className="mt-4">
              <div className="w-full">
                <Text>Delivered To</Text>
                <TextField.Root
                  value={lpoDetails.deliveredTo}
                  placeholder="Enter Receiver"
                  className="mt-2"
                  required
                  disabled
                />
              </div>
              <div className="w-full">
                <Text>Cheque No.</Text>
                <TextField.Root
                  value={lpoDetails.chequeNo}
                  className="mt-2"
                  disabled
                />
              </div>
            </Flex>

            <Flex gap="5" className="mt-4 w-full">
              <div className="w-full">
                <Text>Seal No.</Text>
                <TextField.Root
                  value={lpoDetails.chequeVoucherNo}
                  className="mt-2"
                  disabled
                />
              </div>
              <div className="w-full">
                <Text>Date</Text>
                <TextField.Root
                  placeholder="Enter Date"
                  className="mt-2"
                  disabled
                  value={refractor(lpoDetails.createdAt)}
                />
              </div>
            </Flex>

            <Flex gap="5" className="mt-4">
              <div className="w-full">
                <Text>Name of Supplier</Text>
                <TextField.Root
                  disabled
                  value={`${lpoDetails.supplier.firstname} ${lpoDetails.supplier.lastname}`}
                />
              </div>

              <div className="w-full">
                <Text>
                  Comment <span className=""></span>
                </Text>
                <TextField.Root disabled value={lpoDetails?.comments || ""} />
              </div>
            </Flex>

            <Flex gap="5" className="mt-4">
              <div className="w-full">
                <Text>
                  LPO Expires <span className=""></span>
                </Text>
                <TextField.Root disabled value={lpoDetails?.expires || ""} />
              </div>
              <div className="w-full">
                <Text>Period</Text>
                <TextField.Root disabled value={lpoDetails?.period || ""} />
              </div>
            </Flex>

            <Separator className="my-6 w-full" />

            {/* Table for displaying raw materials */}
            {lpoDetails?.items && (
              <table className="w-full mt-8">
                <thead>
                  <tr>
                    <th className="text-left">Raw Material</th>
                    <th className="text-left">Unit Price</th>
                    <th className="text-left">Quantity Ordered</th>
                    <th className="text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lpoDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.rawMaterial || ""}</td>
                      <td>₦{item?.unitPrice?.toLocaleString() || ""}</td>
                      <td>{item?.quantity ?? ""}</td>
                      <td>₦{item?.totalPrice?.toLocaleString() || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p className="mt-4">
              <span className="font-bold">Specifications & Comments:</span>{" "}
              {lpoDetails?.specifications || ""}
            </p>
            <div className="flex justify-end mt-4">
              <p>
                <span className="font-bold">Total Amount:</span> ₦
                {lpoDetails?.unitPrice
                  ? formatMoney(lpoDetails?.unitPrice)
                  : ""}
              </p>
            </div>
            <Separator className="my-6 w-full" />
            <p className="my-4 mx-4 text-center">
              Goods supplied must meet with the Company’s requirement and part
              be properly signed. Goods not delivered with L.P.O. Period will
              not be accepted by the Company. Our payment will be made as
              signed.
            </p>

            <div className="signature-section flex  mt-6 justify-between">
              <div>
                {/* <p className="text-center">For Polema Industries Ltd</p> */}
                
                <img
                  src={lpoDetails.role?.admins[0].signature || ""}
                  width={"100px"}
                />

                <p className="text-center font-bold">
                  {`${lpoDetails.role?.admins[0].firstname || ""} ${
                    lpoDetails.role?.admins[0].lastname || ""
                  }`}
                </p>

                <p className="text-center">Prepared by Sales Clerk</p>
              </div>
              <div>

                <p className="text-center font-bold">
                  {`${
                    getAdminNameByID(lpoDetails.approvedBySuperAdminId)
                      ?.firstname || ""
                  }
                      ${
                        getAdminNameByID(lpoDetails.approvedBySuperAdminId)
                          ?.lastname || ""
                      }`}
                </p>
                <p className="text-center">Approved By</p>
              </div>
              <div>
                {/* <p className="text-center">For Polema Industries Ltd</p> */}
                <p className="text-center">_________________________</p>
                <p className="text-center">Authorised by CEO/GM</p>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default OfficialLPO;
