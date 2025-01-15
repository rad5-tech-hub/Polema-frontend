// import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { refractor } from "../../../date";
// import EditProductModal from "./EditProductModal";
// import AddProductModal from "./AddProductModal";
// import DeleteProductModal from "./DeleteProductModal";
// import {
//   Separator,
//   TextField,
//   Blockquote,
//   Table,
//   Button,
//   DropdownMenu,
//   Flex,
//   Select,
//   Heading,
//   Spinner,
// } from "@radix-ui/themes";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";

// import axios from "axios";

// const root = import.meta.env.VITE_ROOT;

// const ViewDepartmentStore = () => {
//   const [isProductActive, setIsProductActive] = useState(true);
//   const [failedSearch, setFailedSearch] = useState(false);
//   const [store, setStore] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // -----State management for the search functionality----------
//   const [searchCriteria, setSearchCriteria] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [failedToSelectCriteria, setFailedToSelectCriteria] = useState(false);

//   // Fetch store data
//   const fetchStore = async () => {
//     const retrToken = localStorage.getItem("token");
//     if (!retrToken) {
//       toast.error("An error occurred. Try logging in again");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${root}/dept/${
//           isProductActive ? "view-deptstore-prod" : "view-deptstore-raw"
//         }`,
//         {
//           headers: { Authorization: `Bearer ${retrToken}` },
//         }
//       );
//       setStore(response.data.stores);
//     } catch (error) {
//       console.error("Error fetching store data:", error);
//       toast.error("Failed to fetch store data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get the right status color based on status
//   const sqColor = (arg) => {
//     switch (arg) {
//       case "In Stock":
//         return "text-green-500";
//         break;
//       case "Out Stock":
//         return "text-red-500";
//         break;
//       case "Low Stock":
//         return "text-yellow-500";
//         break;

//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchStore();
//   }, [isProductActive]);

//   // Handle opening modals
//   const handleOpenModal = (type, product = null) => {
//     setSelectedProduct(product);
//     setOpenModal(type);
//   };

//   const closeModal = () => {
//     setOpenModal(null);
//     setSelectedProduct(null);
//   };

//   // Callback to delete product from store state and server
//   const handleDeleteProduct = async () => {
//     const retrToken = localStorage.getItem("token");
//     if (!retrToken) {
//       toast.error("An error occurred. Try logging in again");
//       return;
//     }

//     try {
//       await axios.delete(`${root}/deleteproduct/${selectedProduct.id}`, {
//         headers: { Authorization: `Bearer ${retrToken}` },
//       });

//       setStore((prevStore) =>
//         prevStore.filter((item) => item.id !== selectedProduct.id)
//       );
//       toast.success("Product deleted successfully");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       toast.error("Failed to delete product");
//     } finally {
//       closeModal();
//     }
//   };

//   // Callback to update product in store state
//   const handleEditProduct = (updatedProduct) => {
//     setStore((prevStore) =>
//       prevStore.map((item) =>
//         item.id === updatedProduct.id ? updatedProduct : item
//       )
//     );
//   };

//   // Callback to add a new product to store state
//   const handleAddProduct = (newProduct) => {
//     setStore((prevStore) => [...prevStore, newProduct]);
//   };

//   return (
//     <div>
//       <Flex justify={"between"} align="center">
//         <Heading>View Store</Heading>
//         <Select.Root
//           defaultValue="products"
//           onValueChange={(value) => setIsProductActive(value === "products")}
//         >
//           <Select.Trigger />
//           <Select.Content>
//             <Select.Item value="products">Products</Select.Item>
//             <Select.Item value="raw materials">Raw Materials</Select.Item>
//           </Select.Content>
//         </Select.Root>
//       </Flex>

//       {/* --------Search Bar----------- */}
//       <div className="flex items-center w-full gap-4">
//         <Select.Root
//           onValueChange={(val) => {
//             setSearchCriteria(val);
//           }}
//         >
//           <Select.Trigger placeholder="Filter By:" className="my-4" />
//           <Select.Content>
//             <Select.Item value="department">Department</Select.Item>
//             <Select.Item value="product">Product Name</Select.Item>
//           </Select.Content>
//         </Select.Root>

//         <TextField.Root
//           className="w-[70%]"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             if (searchCriteria === null) {
//               setFailedToSelectCriteria(true);
//             } else {
//               setFailedToSelectCriteria(true);
//             }
//           }}
//           placeholder={` ${
//             searchCriteria !== null
//               ? `Search by ${searchCriteria}`
//               : "Select Filter First"
//           }`}
//         />
//         {failedToSelectCriteria && (
//           <span className="text-red-500 text-xs m-0 p-0">
//             Select Filter First
//           </span>
//         )}
//       </div>

//       <Separator className="my-3 w-full" />

//       <Table.Root className="mt-6 mb-4" variant="surface">
//         <Table.Header>
//           <Table.Row>
//             <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>
//               {isProductActive ? "PRODUCT" : "RAW MATERIAL"} NAME
//             </Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
//             <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>

//             <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
//           </Table.Row>
//         </Table.Header>

//         {loading ? (
//           <Table.Body>
//             <Table.Row>
//               <Table.Cell colSpan={7}>
//                 <Flex
//                   justify="center"
//                   align="center"
//                   style={{ height: "100px" }}
//                 >
//                   {failedSearch ? "No records found" : <Spinner size="2" />}
//                 </Flex>
//               </Table.Cell>
//             </Table.Row>
//           </Table.Body>
//         ) : (
//           <Table.Body>
//             {store.map((storeItem) => (
//               <Table.Row key={storeItem.id} className="relative">
//                 <Table.RowHeaderCell>
//                   {refractor(storeItem.createdAt)}
//                 </Table.RowHeaderCell>
//                 <Table.RowHeaderCell>
//                   {storeItem.product.name}
//                 </Table.RowHeaderCell>
//                 <Table.RowHeaderCell>
//                   {storeItem.product.department.name}
//                 </Table.RowHeaderCell>
//                 <Table.RowHeaderCell>{storeItem.unit}</Table.RowHeaderCell>
//                 <Table.RowHeaderCell>{storeItem.quantity}</Table.RowHeaderCell>
//                 <Table.RowHeaderCell>
//                   {storeItem.thresholdValue}
//                 </Table.RowHeaderCell>
//                 <Table.RowHeaderCell>
//                   <FontAwesomeIcon
//                     icon={faSquare}
//                     className={`mr-1 ${sqColor(storeItem.status)}`}
//                   />
//                   {storeItem.status}
//                 </Table.RowHeaderCell>
//                 <div className="mt-2 mr-1 top-1 right-1">
//                   <DropdownMenu.Root>
//                     <DropdownMenu.Trigger>
//                       <Button variant="surface">
//                         <FontAwesomeIcon icon={faEllipsisV} />
//                       </Button>
//                     </DropdownMenu.Trigger>
//                     <DropdownMenu.Content>
//                       <DropdownMenu.Group>
//                         <DropdownMenu.Item
//                           onClick={() => handleOpenModal("add", storeItem)}
//                         >
//                           Add
//                         </DropdownMenu.Item>
//                         <DropdownMenu.Item
//                           onClick={() => handleOpenModal("edit", storeItem)}
//                         >
//                           Edit
//                         </DropdownMenu.Item>
//                         <DropdownMenu.Item
//                           onClick={() => handleOpenModal("delete", storeItem)}
//                         >
//                           Remove
//                         </DropdownMenu.Item>
//                       </DropdownMenu.Group>
//                     </DropdownMenu.Content>
//                   </DropdownMenu.Root>
//                 </div>
//               </Table.Row>
//             ))}
//           </Table.Body>
//         )}
//       </Table.Root>

//       {openModal === "add" && (
//         <AddProductModal
//           product={selectedProduct}
//           closeModal={closeModal}
//           runFetch={fetchStore}
//           onAddProduct={handleAddProduct}
//         />
//       )}
//       {openModal === "edit" && (
//         <EditProductModal
//           product={selectedProduct}
//           closeModal={closeModal}
//           runFetch={fetchStore}
//           onEditProduct={handleEditProduct}
//         />
//       )}
//       {openModal === "delete" && (
//         <DeleteProductModal
//           product={selectedProduct}
//           runFetch={fetchStore}
//           closeModal={closeModal}
//           onDeleteProduct={handleDeleteProduct}
//         />
//       )}

//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default ViewDepartmentStore;

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { refractor } from "../../../date";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import {
  Separator,
  TextField,
  Blockquote,
  Table,
  Button,
  DropdownMenu,
  Flex,
  Select,
  Heading,
  Spinner,
} from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSquare } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const root = import.meta.env.VITE_ROOT;

const ViewDepartmentStore = () => {
  const [isProductActive, setIsProductActive] = useState(true);
  const [failedSearch, setFailedSearch] = useState(false);
  const [store, setStore] = useState([]);
  const [filteredStore, setFilteredStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search state
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [failedToSelectCriteria, setFailedToSelectCriteria] = useState(false);

  // Fetch store data
  const fetchStore = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(
        `${root}/dept/${
          isProductActive ? "view-deptstore-prod" : "view-deptstore-raw"
        }`,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setStore(response.data.stores);
      setFilteredStore(response.data.stores); // Initially show all items
    } catch (error) {
      console.error("Error fetching store data:", error);
      toast.error("Failed to fetch store data");
    } finally {
      setLoading(false);
    }
  };

  // Function to get the right status color based on status
  const sqColor = (arg) => {
    switch (arg) {
      case "In Stock":
        return "text-green-500";
      case "Out Stock":
        return "text-red-500";
      case "Low Stock":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  // Filter and highlight matching text
  useEffect(() => {
    if (!searchTerm || !searchCriteria) {
      setFilteredStore(store);
      return;
    }

    const filtered = store.filter((item) => {
      if (searchCriteria === "department") {
        return item.product.department.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchCriteria === "product") {
        return item.product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return false;
    });

    setFailedSearch(filtered.length === 0);
    setFilteredStore(filtered);
  }, [searchTerm, searchCriteria, store]);

  const highlightText = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(
      regex,
      (match) => `<mark class="bg-yellow-200">${match}</mark>`
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchStore();
  }, [isProductActive]);

  // Handle opening modals
  const handleOpenModal = (type, product = null) => {
    setSelectedProduct(product);
    setOpenModal(type);
  };

  const closeModal = () => {
    setOpenModal(null);
    setSelectedProduct(null);
  };

  // Callback to update product in store state
  const handleEditProduct = (updatedProduct) => {
    setStore((prevStore) =>
      prevStore.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
  };

  // Callback to add a new product to store state
  const handleAddProduct = (newProduct) => {
    setStore((prevStore) => [...prevStore, newProduct]);
  };

  const handleDeleteProduct = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      await axios.delete(`${root}/deleteproduct/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      setStore((prevStore) =>
        prevStore.filter((item) => item.id !== selectedProduct.id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      <Flex justify={"between"} align="center">
        <Heading>View Store</Heading>
        <Select.Root
          defaultValue="products"
          onValueChange={(value) => setIsProductActive(value === "products")}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="products">Products</Select.Item>
            <Select.Item value="raw materials">Raw Materials</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* --------Search Bar----------- */}
      <div className="flex items-center w-full gap-4">
        <TextField.Root
          className="w-[70%] my-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!searchCriteria) {
              setFailedToSelectCriteria(true);
            } else {
              setFailedToSelectCriteria(false);
            }
          }}
          placeholder="Search Store"
        >
          <TextField.Slot>
            <MagnifyingGlassIcon width={"16px"} height={"16px"} />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <Separator className="my-3 w-full" />

      <Table.Root className="mt-6 mb-4" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {isProductActive ? "PRODUCT" : "RAW MATERIAL"} NAME
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>DEPARTMENT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>UNIT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>QUANTITY</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>THRESHOLD VALUE</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Flex
                  justify="center"
                  align="center"
                  style={{ height: "100px" }}
                >
                  {failedSearch ? "No records found" : <Spinner size="2" />}
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body>
            {filteredStore.map((storeItem) => (
              <Table.Row key={storeItem.id}>
                <Table.RowHeaderCell>
                  {refractor(storeItem.createdAt)}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell
                  dangerouslySetInnerHTML={{
                    __html: highlightText(storeItem.product.name, searchTerm),
                  }}
                />
                <Table.RowHeaderCell
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      storeItem.product.department.name,
                      searchTerm
                    ),
                  }}
                />
                <Table.RowHeaderCell>{storeItem.unit}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{storeItem.quantity}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {storeItem.thresholdValue}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <FontAwesomeIcon
                    icon={faSquare}
                    className={`mr-1 ${sqColor(storeItem.status)}`}
                  />
                  {storeItem.status}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <div className="mt-2 mr-1 top-1 right-1">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content>
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            onClick={() => handleOpenModal("add", storeItem)}
                          >
                            Add
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => handleOpenModal("edit", storeItem)}
                          >
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => handleOpenModal("delete", storeItem)}
                          >
                            Remove
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                </Table.RowHeaderCell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table.Root>
      {openModal === "add" && (
        <AddProductModal
          product={selectedProduct}
          closeModal={closeModal}
          runFetch={fetchStore}
          onAddProduct={handleAddProduct}
        />
      )}
      {openModal === "edit" && (
        <EditProductModal
          product={selectedProduct}
          closeModal={closeModal}
          runFetch={fetchStore}
          onEditProduct={handleEditProduct}
        />
      )}
      {openModal === "delete" && (
        <DeleteProductModal
          product={selectedProduct}
          runFetch={fetchStore}
          closeModal={closeModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default ViewDepartmentStore;
