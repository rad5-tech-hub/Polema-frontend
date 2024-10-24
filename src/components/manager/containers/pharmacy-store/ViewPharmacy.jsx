import React, { useState, useRef, useEffect } from "react";
import { refractor } from "../../../date";
import { DropdownMenu, TextField } from "@radix-ui/themes";
import {
  Blockquote,
  Separator,
  Flex,
  Grid,
  Spinner,
  Table,
  Button,
  Heading,
  Select,
} from "@radix-ui/themes";

import { DropDownIcon, DeleteIcon } from "../../../icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import {
  faPills,
  faPlus,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faClose,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
const root = import.meta.env.VITE_ROOT;

// Add dialog box
const AddDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow backdrop-blur-sm fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] min-h-[75vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" mb-4 text-[17px] font-medium text-black">
            Add
          </Dialog.Title>
          <div className="w-[90px] h-[90px] rounded-lg cursor-pointer bg-[#f4f4f4] border-dashed border-[2px]"></div>
          <form action="" className="mt-8">
            <Flex justify={"between"}>
              <p className="p-1 font-bold">Product Name</p>
              <TextField.Root className="p-1" disabled></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Unit</p>
              <TextField.Root className="p-1" disabled></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Quantity</p>
              <TextField.Root className="p-1" disabled></TextField.Root>
            </Flex>
          </form>
          <div className="mt-[25px] flex absolute bottom-[20px] right-[20px] justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-transparent focus:shadow-red7 border-theme border-[1px] inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Discard
              </button>
            </Dialog.Close>
            <button className=" ml-4 bg-theme text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Yes
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Edit Dialog Box
const EditDialog = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  // Function to handle the click on the "Browse Image" text
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to upload images to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const result = await axios.post(
        "https://api.cloudinary.com/v1_1/da4yjuf39/image/upload",
        formData
      );
      console.log("Image uploaded to Cloudinary:", result.data);
      return result.data.secure_url; // Return the image URL from Cloudinary
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Reset the uploading status
    }
  };

  // Function to handle the file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for previewing the selected image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Upload the image to Cloudinary
      const cloudinaryImageUrl = await uploadImageToCloudinary(file);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow backdrop-blur-sm fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] min-h-[75vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" mb-4 text-[17px] font-medium text-black">
            Edit
          </Dialog.Title>
          <div align={"center"} className="flex items-center gap-4" gap={"4"}>
            <div className="w-[90px] h-[90px] rounded-lg cursor-pointer bg-[#f4f4f4] border-dashed border-[2px]"></div>
            <div className="cursor-pointer" onClick={handleBrowseClick}>
              <p className="font-amsterdam underline">Browse Image</p>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <form action="" className="mt-8">
            <Flex justify={"between"}>
              <p className="p-1 font-bold">Product Name</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Product ID</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Category</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Unit</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Threshold Value</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
          </form>
          <div className="mt-[25px] flex absolute bottom-[20px] right-[20px] justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-transparent focus:shadow-red7 border-theme border-[1px] inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Discard
              </button>
            </Dialog.Close>
            <button className=" ml-4 bg-theme text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Yes
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Remove Dialog Box
const RemoveDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow backdrop-blur-sm fixed inset-0" />

        <Dialog.Content className=" fixed top-[50%] left-[50%] min-h-[75vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" mb-4 text-[17px] font-medium text-black">
            Remove
          </Dialog.Title>
          <div className="w-[90px] h-[90px] rounded-lg cursor-pointer bg-[#f4f4f4] border-dashed border-[2px]"></div>
          <form action="" className="mt-8">
            <Flex justify={"between"}>
              <p className="p-1 font-bold">Product Name</p>
              <TextField.Root className="p-1" disabled></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Quantity</p>
              <TextField.Root className="p-1"></TextField.Root>
            </Flex>
            <Flex justify={"between"} className="mt-3">
              <p className="p-1 font-bold">Unit</p>
              <TextField.Root className="p-1" disabled></TextField.Root>
            </Flex>
          </form>
          <div className="mt-[25px] flex absolute bottom-[20px] right-[20px] justify-end">
            <Dialog.Close asChild>
              <button
                onClick={() => onClose()}
                className="bg-transparent focus:shadow-red7 border-theme border-[1px] inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Discard
              </button>
            </Dialog.Close>
            <button className=" ml-4 bg-theme text-white hover:bg-red-600 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Yes
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} color="black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const ViewPharmacy = () => {
  const [selectedAddItem, setSelectedAddItem] = useState(null);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [selectedRemoveItem, setSelectedRemoveItem] = useState(null);

  // Function to handle the add dialog visibility
  const handleAddClick = () => {
    setSelectedAddItem(true);
  };

  // function to handle edit dialog visibilty
  const handleEditClick = () => {
    setSelectedEditItem(true);
  };

  // Function to handle remove dialog visibility
  const handleRemoveClick = () => {
    setSelectedRemoveItem(true);
  };

  return (
    <>
      <Flex justify={"between"}>
        <Heading>View All</Heading>
        <Select.Root defaultValue="products">
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Item value="raw-materials">Raw Materials</Select.Item>
              <Select.Item value="products">Products</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Separator className="w-full my-3" />

      {/* Section showing availability status for various items */}
      <div>
        {/* <Grid columns={"5"} rows={"3"} gapX={"4"} gapY={"3"}>
          {detailsArray.map((item, index) => {
            return (
              <div
                className="p-5 shadow-xl max-w-[175px] max-h-[101px] rounded-lg relative"
                key={index}
              >
                <div className="absolute top-2 right-2 ">
                  <FontAwesomeIcon
                    icon={faPills}
                    width={"16px"}
                    className="opacity-40"
                    height={"16px"}
                  />
                </div>
                <Blockquote>
                  <p className="text-[0.6rem]">{item.name}</p>
                  <p className="text-3xl font-semibold font-amsterdam">
                    {item.stockNumber}
                  </p>
                  {item.stockAvailable ? (
                    <p className="text-green-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowUp} />
                      Currently in Stock
                    </p>
                  ) : (
                    <p className="text-red-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowDown} />
                      Currently out of Stock
                    </p>
                  )}
                </Blockquote>
              </div>
            );
          })}
        </Grid> */}
      </div>

      {/* Table showing products  and their availability */}
      <Table.Root className="my-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-[#919191]">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              PRODUCT NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#919191]">
              PRODUCT ID
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
          {currentProducts.length === 0 ? (
            <div className="p-4">
              <Spinner />
            </div>
          ) : (
            currentProducts.map((list) => (
              <Table.Row key={list.id}>
                <Table.RowHeaderCell>
                  {refractor(list.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <Flex gap={"2"} align={"center"}>
                    <FontAwesomeIcon icon={faPills} />
                    {getProductNameById(list.id)}
                  </Flex>
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>{list.id}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{list.category}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{list.unit}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{list.thresholdValue}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <Flex align={"center"} gap={"2"}>
                    <FontAwesomeIcon
                      icon={faSquare}
                      color={list.stockStatus ? "rgba(74,222,128)" : "red"}
                    />
                    {list.status}
                  </Flex>
                </Table.RowHeaderCell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="mt-1">
                    <Button variant="surface" className="cursor-pointer">
                      <DropDownIcon />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      shortcut={<FontAwesomeIcon icon={faPlus} />}
                      onClick={() => handleAddClick(list)}
                    >
                      Add
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      shortcut={<DeleteIcon />}
                      onClick={() => handleRemoveClick(list)}
                    >
                      Remove
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      shortcut={<FontAwesomeIcon icon={faPen} />}
                      onClick={() => handleEditClick(list)}
                    >
                      Edit
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      {/* Pagination buttons */}

      {/* <Flex justify={"center"} align={"center"} my={"3"}>
        <div className="pagination-controls flex gap-2 items-center">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>

          <span>{`Page ${currentPage} of ${totalPages}`}</span>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            className="cursor-pointer disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </Flex> */}

      {selectedAddItem && (
        <AddDialog
          isOpen={!!selectedAddItem}
          onClose={() => setSelectedAddItem(null)}
        />
      )}
      {selectedEditItem && (
        <EditDialog
          isOpen={!!selectedEditItem}
          onClose={() => setSelectedEditItem(null)}
        />
      )}
      {selectedRemoveItem && (
        <RemoveDialog
          isOpen={!!selectedRemoveItem}
          onClose={() => setSelectedRemoveItem(null)}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default ViewPharmacy;

// Functionality for accordion below here
// const ITEMS_PER_PAGE = 10;

// const [currentPage, setCurrentPage] = useState(1);

// Calculate total pages
// const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

// Get the items for the current page
// const currentProducts = products.slice(
//   (currentPage - 1) * ITEMS_PER_PAGE,
//   currentPage * ITEMS_PER_PAGE
// );

// Handle page change
// const handlePageChange = (newPage) => {
//   if (newPage > 0 && newPage <= totalPages) {
//     setCurrentPage(newPage);
//   }
// };

// Functionlaity for pagination above here
