import {
  Heading,
  Flex,
  Button,
  Table,
  Text,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { formatMoney } from "../../../date";
import { useParams } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import React, { useState, useEffect } from "react";

const root = import.meta.env.VITE_ROOT;

const BatchingRecords = ({ data, setSelectedRecord }) => {
  const { id } = useParams();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [batchDetails, setBatchDetails] = useState(null);
  const [CPKODetails, setCPKODetails] = useState([]);
  const [FVODetails, setFVODetails] = useState([]);
  const [sludgeDetails, setSludgeDetails] = useState([]);
  const [fattyAcidDetails, setFattyAcidDetails] = useState([]); // Fixed typo
  const [fetchComplete, setFetchComplete] = useState(false);

  const sludgeRegex = /^slu/i;
  const fattyAcidRegex = /^fat/i;

  const getBatchDetails = () => {
    setFetchComplete(false);
    setLoading(true);

    try {
      // Ensure data has expected structure
      if (!data || !data["raw-material"] || !data.products) {
        console.error("Invalid data structure:", data);
        showToast({
          type: "error",
          message: "Invalid batch data structure.",
        });
        setLoading(false);
        setFetchComplete(true);
        return;
      }

      const cpko = data["raw-material"].filter(
        (item) => item.rawName.toLowerCase() === "cpko"
      );

      // Filter FVO from raw-material, aligning with Batching.jsx
      const fvo = data["raw-material"].filter(
        (item) => item.rawName.toLowerCase() === "fvo"
      );

      const sludge = data.products.filter((item) =>
        sludgeRegex.test(item.otherProduct)
      );

      const fattyAcid = data.products.filter((item) =>
        fattyAcidRegex.test(item.otherProduct)
      );

      
      setCPKODetails([...(cpko || [])]);
      setFVODetails([...(fvo || [])]);
      setSludgeDetails([...(sludge || [])]);
      setFattyAcidDetails([...(fattyAcid || [])]);
      setBatchDetails(data);
    } catch (err) {
      console.error("Error in getBatchDetails:", err);
      showToast({
        type: "error",
        message: "Failed to process batch details.",
      });
    } finally {
      setLoading(false);
      setFetchComplete(true);
    }
  };

  const InfoBox = ({ message, unitPrice, quantity }) => {
    return (
      <div className="mb-4">
        <h1 className="text-center font-bold">{message}</h1>
        <div className="flex gap-4">
          <div className="w-fit p-4 border-theme rounded border-2 justify-center items-center">
            <span className="text-[1.7rem] font-bold">{quantity}</span>
            <p className="text-sm opacity-40">Quantity</p>
          </div>
          <div className="w-[120px] p-4 border-theme rounded border-2 justify-center items-center">
            <span className="text-[1.7rem] font-bold">{unitPrice}</span>
            <p className="text-sm opacity-40">Total Price</p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getBatchDetails();
  }, [data]); // Added data as dependency

  return (
    <>
      {loading && <Spinner size="3" className="mt-4" />}
      {fetchComplete && (
        <>
          <Flex justify="between" align="center">
            <Flex align="center" gap="3">
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faArrowLeft}
                onClick={() => setSelectedRecord({})}
              />
              <Heading>Batch Summary</Heading>
            </Flex>
            <p>
              <span className="font-bold">Status:</span>
              <span> {data.isActive ? "Open" : "Closed"}</span>
            </p>
          </Flex>

          <div className="flex gap-4 !text-sm">
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
              <Table.Body>
                {fetchComplete &&
                  Array.from({
                    length: Math.max(CPKODetails.length, FVODetails.length),
                  }).map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {FVODetails[index]?.quantity || "-"}
                      </Table.Cell>
                      <Table.Cell>
                        {formatMoney(FVODetails[index]?.price) || "-"}
                      </Table.Cell>
                      <Table.Cell>
                        {CPKODetails[index]?.quantity || "-"}
                      </Table.Cell>
                      <Table.Cell>
                        {formatMoney(CPKODetails[index]?.price) || "-"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table.Root>

            {!data.isActive && (
              <div className="info-boxes p-4">
                {FVODetails.length > 0 && (
                  <InfoBox
                    message="TOTAL FOR FVO"
                    unitPrice={formatMoney(
                      FVODetails.reduce(
                        (sum, item) => sum + (item.totalAmount || 0),
                        0
                      )
                    )}
                    quantity={formatMoney(
                      FVODetails.reduce(
                        (sum, item) => sum + (item.totalQuantity || 0),
                        0
                      )
                    )}
                  />
                )}
                {CPKODetails.length > 0 && (
                  <InfoBox
                    message="TOTAL FOR CPKO"
                    unitPrice={formatMoney(
                      CPKODetails.reduce(
                        (sum, item) => sum + (item.totalAmount || 0),
                        0
                      )
                    )}
                    quantity={formatMoney(
                      CPKODetails.reduce(
                        (sum, item) => sum + (item.totalQuantity || 0),
                        0
                      )
                    )}
                  />
                )}
                {fattyAcidDetails.length > 0 && (
                  <InfoBox
                    message="TOTAL FOR FATTY ACID"
                    unitPrice={formatMoney(
                      fattyAcidDetails.reduce(
                        (sum, item) => sum + (item.totalAmount || 0),
                        0
                      )
                    )}
                    quantity={formatMoney(
                      fattyAcidDetails.reduce(
                        (sum, item) => sum + (item.totalQuantity || 0),
                        0
                      )
                    )}
                  />
                )}
                
                {sludgeDetails.length > 0 && (
                  <InfoBox
                    message="TOTAL FOR SLUDGE"
                    unitPrice={sludgeDetails[0].price}
                    quantity={formatMoney(
                      sludgeDetails.reduce(
                        (sum, item) => sum + (item.totalQuantity || 0),
                        0
                      )
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default BatchingRecords;