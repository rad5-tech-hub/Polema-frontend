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
} from "@radix-ui/themes";
import axios from "axios";
import toast from "react-hot-toast";
import { refractor } from "../../../date";
const root = import.meta.env.VITE_ROOT;

const OfficialLPO = () => {
  const { id } = useParams();
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

  //   Function to get lpo details
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

  React.useEffect(() => {
    getLPODetails();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {typeof lpoDetails === "string" ? (
        <div className="loader h-screen flex bg-black/50 justify-center items-center">
          <Spinner size={"3"} />
        </div>
      ) : (
        <div className="official-lpo">
          {/* Print Section */}
          <div className="flex justify-between items-center pb-6 border-b border-[#919191]">
            <span className="text-sm sm:text-lg font-semibold text-[#434343]">
              Approved Local Purchase Order
            </span>
            <button
              className="rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center"
              onClick={handlePrint}
            >
              Print
            </button>
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
            <Flex gap={"5"} className="mt-4">
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
                  placeholder="Enter Cheque No."
                  className="mt-2"
                  disabled
                />
              </div>
            </Flex>

            <Flex gap={"5"} className="mt-4 w-full">
              <div className="w-full">
                <Text>Cheque Voucher No.</Text>
                <TextField.Root
                  value={lpoDetails.chequeVoucherNo}
                  placeholder="Enter Cheque Voucher Number"
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

            <Separator className="my-10 w-full" />
            <Flex gap={"5"} className="mt-4">
              <div className="w-full">
                <Text>
                  Name of Supplier <span className="">*</span>
                </Text>
                <TextField.Root
                  disabled
                  value={`${lpoDetails.supplier.firstname} ${lpoDetails.supplier.lastname}`}
                />
              </div>
              <div className="w-full">
                <Text>
                  Raw Materials Needed <span className="text-red-500">*</span>
                </Text>
                <TextField.Root disabled value={`${lpoDetails.product.name}`} />
              </div>
            </Flex>

            <Flex gap={"5"} className="mt-4">
              <div className="w-full">
                <Text>
                  Unit Price <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  placeholder="Enter Unit Price"
                  className="mt-2"
                  required
                  value={lpoDetails.unitPrice && lpoDetails.unitPrice}
                  disabled
                >
                  <TextField.Slot>₦</TextField.Slot>
                </TextField.Root>
              </div>
              <div className="w-full">
                <Text>
                  Quantity Ordered <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  required
                  value={lpoDetails.quantOrdered && lpoDetails.quantOrdered}
                  placeholder="Enter Quantity Ordered"
                  className="mt-2"
                  disabled
                />
              </div>
            </Flex>

            <Flex gap={"5"} className="mt-4">
              <div className="w-full">
                <Text>L.P.O Expires</Text>
                <TextField.Root
                  placeholder="Enter Date"
                  value={lpoDetails.expires && lpoDetails.expires}
                  className="mt-2"
                  disabled
                  //   onChange={(e) => setExpiration(e.target.value)}
                />
              </div>
              {/* <div className="w-full">
                <Text>Period</Text>
                <TextField.Root
                  type="date"
                  value={period}
                  className="mt-2"
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div> */}
            </Flex>

            {/* <Grid gap={"5"} columns={"2"} className="mt-4">
              <div className="w-full">
                <Text>Specifications and Comments</Text>
                <TextField.Root
                  placeholder="Enter Comments"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  className="mt-2"
                />
              </div>
            </Grid> */}
          </form>
        </div>
      )}
    </>
  );
};

export default OfficialLPO;
