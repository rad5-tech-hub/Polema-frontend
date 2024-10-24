import { refractor } from "../../../date";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Heading,
  Select,
  Flex,
  Grid,
  Separator,
  Table,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPills,
  faSquare,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

const ViewPharmacyStore = () => {
  const [isRawMaterials, setIsRawMaterials] = useState(false);
  const [gridLoading, setGridLoading] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState([]);

  // Function to fetch store data
  const fetchStore = async () => {
    let retrToken = localStorage.getItem("token");
    setGridLoading(true); // Start loading when fetching
    setFetchedProducts([]);

    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/${
          isRawMaterials ? "view-pharmstore-raw" : "view-pharmstore-prod"
        }`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );
      setFetchedProducts(response.data.parsedStores);
    } catch (error) {
      console.log(error);
    } finally {
      setGridLoading(false); // Stop loading once data is fetched
    }
  };

  // Function to toggle between raw materials and products
  const toggleToRaw = (arg) => {
    setIsRawMaterials(arg); // Update state and let useEffect handle fetching
  };

  // Fetch store whenever isRawMaterials changes
  useEffect(() => {
    fetchStore();
  }, [isRawMaterials]);

  return (
    <>
      <Flex justify={"between"} align={"center"}>
        <Heading>View All</Heading>
        <Select.Root
          value={isRawMaterials ? "raw-materials" : "products"}
          onValueChange={(value) => toggleToRaw(value === "raw-materials")}
        >
          <Select.Trigger placeholder="Type" />
          <Select.Content>
            <Select.Group>
              <Select.Item value="raw-materials">Raw Materials</Select.Item>
              <Select.Item value="products">Products</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="my-4 w-full" />

      <div className="overflow-auto max-h-[430px]">
        {" "}
        {/* Add a scrollable container */}
        <Grid columns={"6"} rows={"3"} gap={"2"} className="grid-container">
          {gridLoading ? (
            <div className="flex justify-center items-center">
              <LoaderIcon />
            </div>
          ) : (
            fetchedProducts.map((item) => {
              let statusColor;

              if (item.status === "Low Stock") {
                statusColor = "text-yellow-500";
              } else if (item.status === "In Stock") {
                statusColor = "text-green-500";
              } else if (item.status === "Out Stock") {
                statusColor = "text-red-500";
              }

              return (
                <div
                  className="shadow-xl p-3 rounded-[11px] relative"
                  key={item.productTag}
                >
                  <p>{item.product.name}</p>
                  <p className="text-[2em]">{item.quantity}</p>
                  <p className={`${statusColor} text-[.6rem]`}>{item.status}</p>
                  <FontAwesomeIcon
                    icon={faPills}
                    className="absolute top-[10px] right-[10px]"
                  />
                </div>
              );
            })
          )}
        </Grid>
      </div>

      <Table.Root className="mt-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-[#919191]">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              {isRawMaterials ? "RAW MATERIALS" : "PRODUCTS"} NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              {isRawMaterials ? "RAW MATERIALS" : "PRODUCTS"} ID
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              CATEGORY
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              UNIT
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              THRESHOLD VALUE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              STATUS
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gridLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <div className="flex justify-center items-center">
                  <LoaderIcon />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            fetchedProducts.map((item) => {
              let statusColor;

              if (item.status === "Low Stock") {
                statusColor = "text-yellow-500";
              } else if (item.status === "In Stock") {
                statusColor = "text-green-500";
              } else if (item.status === "Out Stock") {
                statusColor = "text-red-500";
              }

              return (
                <Table.Row key={item.productTag} className="relative">
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>{item.product.name}</Table.Cell>
                  <Table.Cell>{item.productTag}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>{item.thresholdValue}</Table.Cell>
                  <Table.Cell>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${statusColor} mr-2`}
                    />
                    {item.status}
                  </Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger />

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content>
                        <DropdownMenu.Label />
                        <DropdownMenu.Item />

                        <DropdownMenu.Group>
                          <DropdownMenu.Item />
                        </DropdownMenu.Group>

                        <DropdownMenu.CheckboxItem>
                          <DropdownMenu.ItemIndicator />
                        </DropdownMenu.CheckboxItem>

                        <DropdownMenu.RadioGroup>
                          <DropdownMenu.RadioItem>
                            <DropdownMenu.ItemIndicator />
                          </DropdownMenu.RadioItem>
                        </DropdownMenu.RadioGroup>

                        <DropdownMenu.Sub>
                          <DropdownMenu.SubTrigger />
                          <DropdownMenu.Portal>
                            <DropdownMenu.SubContent />
                          </DropdownMenu.Portal>
                        </DropdownMenu.Sub>

                        <DropdownMenu.Separator />
                        <DropdownMenu.Arrow />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default ViewPharmacyStore;
