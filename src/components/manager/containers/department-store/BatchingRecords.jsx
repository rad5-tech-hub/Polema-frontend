import {
  Heading,
  Flex,
  Button,
  Table,
  Text,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import axios from "axios";
import { useParams } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import React, { useState } from "react";
const root = import.meta.env.VITE_ROOT;

const BatchingRecords = () => {
  const { id } = useParams();
  const showToast = useToast();
  const [loading, setLoading] = React.useState(true);
  const [batchDetails, setBatchDetails] = React.useState(null);
  const [CPKODetails, setCPKODetails] = React.useState([]);
  const [FVODetails, setFVODetails] = React.useState([]);
  const [sludgeDetails, setSludgeDetails] = React.useState([]);

  const [fattyAcidDetails, setFaatyAcidDetails] = React.useState([]);

  const [fetchComplete, setFetchComplete] = useState(false);
  const sludgeRegex = /^slu/i;
  const fattyAcidRegex = /^fat/i;

  const getBatchDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });
      return;
    }
    try {
      const { data } = await axios.get(`${root}/batch/all-batch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFetchComplete(true);

      let info = data.data.filter((item) => item.id === id);
      setBatchDetails(info);

      const cpko =
        info[0]["raw-material"].length > 0 &&
        info[0]["raw-material"].filter(
          (item) => item.rawName.toLowerCase() === "cpko"
        );

      const fvo = info[0].products.length > 0 && info[0].products.filter(
        (item) => item.otherProduct.toLowerCase() === "fvo"
      )

      const sludge = info[0].products > 0 && info[0].products.filter((item) =>
        sludgeRegex.test(item.otherProduct)
      );

      const fattyAcid = info[0].products && info[0].products.filter((item) =>
        fattyAcidRegex.test(item.otherProduct)
      );

      setCPKODetails(cpko || []);
      setFVODetails(fvo || []);
      setSludgeDetails(sludge || []);
      setFaatyAcidDetails(fattyAcid || []);
    } catch (err) {
      console.log(err);
      showToast({
        type: "error",
        message: "An error occurred while trying to get batch summary",
      });
    } finally {
      // setLoading(false);
    }
  };

  const InfoBox = ({ message, unitPrice, quantity }) => {
    return (
      <>
        <div className="mb-4">
          <h1 className="text-center font-bold">{message}</h1>
          <div className="flex gap-4">
            <div className="w-fit p-4 border-theme rounded border-2  justify-center items-center">
              <span className="text-[1.7rem] font-bold">{quantity}</span>
              <p className="text-sm opacity-40">Quantity</p>
            </div>

            <div className="w-[120px] p-4 border-theme rounded border-2  justify-center items-center">
              <span className="text-[1.7rem] font-bold">{unitPrice}</span>
              <p className="text-sm opacity-40">Total Price</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  React.useEffect(() => {
    getBatchDetails();
  }, [id]);

  return (
    <>
      <Flex justify="between" align={"center"}>
        <Heading>Batch Summary</Heading>
        <p>
          <span className="font-bold">Status:</span>
          <span>
            {" "}
            {batchDetails !== null
              ? batchDetails[0].isActive
                ? "Open"
                : "Closed"
              : ""}
          </span>
        </p>
      </Flex>

      <div className="flex gap-4 !text-sm ">
        <Table.Root
          className="mt-4 table-fixed w-full place-items-start"
          variant="surface"
          size="2"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell
                colSpan={2}
                className="font-bold text-sm p-4 text-center"
              >
                FINE VEGETABLE OIL SALES
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell
                colSpan={2}
                className="font-bold text-sm p-4 text-center"
              >
                CPKO BOUGHT
              </Table.ColumnHeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.ColumnHeaderCell className="text-left p-4">
                QUANTITY (TONS)
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left p-4">
                UNIT PRICE (₦)
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left p-4">
                QUANTITY (TONS)
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-left p-4">
                UNIT PRICE (₦)
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          {!fetchComplete && (
            <p className="p-4">
              <Spinner />
            </p>
          )}
          {fetchComplete && (
            <Table.Body>
              {Array.from({
                length: Math.max(CPKODetails.length, FVODetails.length),
              }).map((_, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{FVODetails[index]?.quantity || "-"}</Table.Cell>
                  <Table.Cell>{FVODetails[index]?.price || "-"}</Table.Cell>
                  <Table.Cell>{CPKODetails[index]?.quantity || "-"}</Table.Cell>
                  <Table.Cell>{CPKODetails[index]?.price || "-"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          )}
        </Table.Root>

        {/* Information boxes  */}
        {fetchComplete && (
          <div className="info-boxes p-4">
            {FVODetails.length !== 0 && (
              <InfoBox
                message={"TOTAL FOR FVO"}
                unitPrice={2000}
                quantity={50}
              />
            )}
            {CPKODetails.length !== 0 && (
              <InfoBox
                message={"TOTAL FOR CPKO"}
                unitPrice={CPKODetails[0]?.price || 0}
                quantity={CPKODetails[0]?.quantity || 0}
              />
            )}

            {fattyAcidDetails.length !== 0 && (
              <InfoBox
                message={"TOTAL FOR FATTY ACID"}
                unitPrice={2000}
                quantity={50}
              />
            )}

            {sludgeDetails.length !== 0 && (
              <InfoBox
                message={"TOTAL FOR SLUDGE"}
                unitPrice={2000}
                quantity={50}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BatchingRecords;
