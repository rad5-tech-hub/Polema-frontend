import { refractor } from "../../../date";
import {
  Heading,
  Select,
  Flex,
  Grid,
  DropdownMenu,
  Separator,
  Table,
  Button,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPills,
  faArrowLeft,
  faArrowRight,
  faSquare,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { LoaderIcon } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// import TopUpModal from "./TopUpModal";
import RemoveModal from "./RemoveModal";

import AddModal from "./AddModal";
import EditModal from "./EditModal";

const root = import.meta.env.VITE_ROOT;

const ViewPharmacyStore = () => {
  const [isRawMaterials, setIsRawMaterials] = useState(false);
  const [gridLoading, setGridLoading] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [failedSearch, setFailedSearch] = useState(false);
  const itemsPerPage = 10;

  const fetchStore = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    setGridLoading(true);
    setFetchedProducts([]);

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
      const store = isRawMaterials
        ? response?.data?.store || response?.data?.parsedStores
        : response?.data?.parsedStores || response?.data?.parsedStores;

      {
        store.length === 0 ? setFailedSearch(true) : setFetchedProducts(store);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setGridLoading(false);
    }
  };

  const toggleToRaw = (arg) => setIsRawMaterials(arg);

  useEffect(() => {
    fetchStore();
  }, [isRawMaterials]);

  const totalPages = Math.ceil(fetchedProducts.length / itemsPerPage);

  const currentItems = fetchedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (action, item) => {
    setModalAction(action);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalAction(null);
  };

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
        <Grid columns={"6"} rows={"3"} gap={"2"} className="grid-container">
          {gridLoading ? (
            <div className="flex justify-center items-center">
              <LoaderIcon />
            </div>
          ) : (
            currentItems.map((item) => {
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
            {!isRawMaterials && (
              <>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  {isRawMaterials ? "RAW MATERIALS" : "PRODUCTS"} ID
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#919191]">
                  CATEGORY
                </Table.ColumnHeaderCell>
              </>
            )}
            <Table.ColumnHeaderCell className="text-[#919191]">
              UNIT
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              QUANTITY
            </Table.ColumnHeaderCell>

            <Table.ColumnHeaderCell className="text-[#919191]">
              THRESHOLD VALUE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gridLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <div className="flex justify-center items-center">
                  {failedSearch ? "No records found." : <LoaderIcon />}
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            currentItems.map((item) => {
              let statusColor;
              if (item.status === "Low Stock") {
                statusColor = "text-yellow-500";
              } else if (item.status === "In Stock") {
                statusColor = "text-green-500";
              } else if (item.status === "Out Stock") {
                statusColor = "text-red-500";
              }

              return (
                <Table.Row key={item.productTag}>
                  <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                  <Table.Cell>{item.product.name}</Table.Cell>
                  {!isRawMaterials && (
                    <>
                      <Table.Cell>{item.productTag}</Table.Cell>
                      <Table.Cell>{item.category}</Table.Cell>
                    </>
                  )}
                  <Table.Cell>{item.unit}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.thresholdValue}</Table.Cell>

                  <Table.Cell>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className={`${statusColor} text-[.8em] mr-2`}
                    />
                    {item.status}
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="soft">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          className="hover:bg-theme hover:text-white"
                          onClick={() => openModal("Top Up", item)}
                        >
                          Top Up
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="hover:bg-theme hover:text-white"
                          onClick={() => openModal("Remove", item)}
                        >
                          Remove
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="hover:bg-theme hover:text-white"
                          onClick={() => openModal("Edit", item)}
                        >
                          Edit
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>

      <Flex justify={"center"} align={"center"} className="mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="mr-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </Flex>

      {isModalOpen && modalAction === "Top Up" && (
        <AddModal
          item={selectedItem}
          runFetch={fetchStore}
          closeModal={closeModal}
          product={selectedItem}
        />
      )}
      {isModalOpen && modalAction === "Remove" && (
        <RemoveModal
          product={selectedItem}
          closeModal={closeModal}
          runFetch={fetchStore}
        />
      )}
      {isModalOpen && modalAction === "Edit" && (
        <EditModal
          product={selectedItem}
          closeModal={closeModal}
          runFetch={fetchStore}
        />
      )}
    </>
  );
};

export default ViewPharmacyStore;
