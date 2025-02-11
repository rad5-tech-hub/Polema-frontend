 import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import React, { useState, useEffect } from "react"
import { Button,Heading,Spinner, Flex, Select, Separator, TextField, Grid, Text } from "@radix-ui/themes"
import _ from "lodash"
const root = import.meta.env.VITE_ROOT

const ManagePharmacyStore = () => {
    const [storeAction, setStoreAction] = useState("add")
    const [suppliers, setSuppliers] = useState([])
    const [storeItems, setStoreItems] = useState([]);
    const [initialScreenOpen,setInitialScreenOpen] = useState(true)

    //State management for the form details
    const [itemId, setItemID] = useState("");
    const [loading,setLoading] = useState(false)
    const [supplierId, setSupplierID] = useState("");
    const [supplierName,setSupplierName] = useState("")
    const [batchNumber, setBatchNumber] = useState("");
    const [quantityOut, setQuantityOut] = useState("");
    const [productActive,setProductActive] = useState(true)
    

    // Function to fetch suppliers details
    const fetchSuppliers = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("An error occurred , try logging in again", {
                style: {
                    padding: "30px"
                }, duration: 5500
            })
            return
        }


        //Fetch Functionality below
        try {
            const response = await axios.get(`${root}/customer/get-suppliers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setSuppliers(response.data.customers)
        } catch (e) {
            console.log(e);
            toast.error(e.message || "An error occurred , check your details and try again.")
        }
    }


    // Function to fetch products/raw materials
    const fetchItems = async () => {
        setStoreItems([])
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("An error occurred , try logging in again.", {
                style: {
                    padding:"30px"
                },duration:5500
            })
            return
        }

        // Fetch functionality here:
        //
        try {
            const response = await axios.get(`${root}/dept/${productActive ? "view-pharmstore-prod" : "view-pharmstore-raw"}`, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
            setStoreItems(response.data.parsedStores || response.data.stores)
            
            
        } catch (error) {
            console.log(error);
            
        }
    }


    //Function to submit form 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("An error occurred , try logging in again");
            return;
        }
            
        try {
            const response = await axios.post(`${root}/dept/${storeAction === "add" ? "add-quantity-pharm":"remove-quantity-pharm"}`, {
                item: itemId,
                batchNo: batchNumber,
                name: supplierName,
                quantity:quantityOut
            }, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
            toast.error(error.message || "An error occurred, check your details and try again later")
            
        }
    }


    // Initial Screen showing two buttons
    const InitialScreen = () => {
        return (
            <>
                <div className="h-screen flex justify-center items-center">
                    <div>
                        <h1 className="font-bold font-space text-center">Do you want to</h1>
                        <br />
                        <Flex gap={"3"} align={"center"}>
                            <Button className="!bg-transparent  !border-2 cursor-pointer" style={{
                                border: "2px solid #434343",
                                color:"#434343"
                            }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setStoreAction("add")
                                    setInitialScreenOpen(false)
                                }}
                                size={"3"}>Add to Store</Button>
                            or
                            <Button className="bg-theme cursor-pointer" size={"3"} onClick={(e) => {
                                e.preventDefault();
                                setStoreAction("remove");
                                setInitialScreenOpen(false)
                            }} >Remove from Store</Button>
                        </Flex>
                  </div>
            </div>
            </>
        )
    }
        

    // Run functions when page is loaded
    useEffect(() => {
        fetchSuppliers()
    }, [])

    // Run function if the page loads and if the value of "productActive" changes
    useEffect(() => {
        fetchItems()
    },[productActive])

    return (<>
        {initialScreenOpen && <InitialScreen />}
        {initialScreenOpen === false && <>
            <Flex justify={"between"}>
                {/* <Heading>{_.upperFirst(storeAction)} Store</Heading> */}
                <Heading> {storeAction === "add" ? "Add to Store" : "Remove from Store"}   </Heading>
                <Select.Root defaultValue="products" onValueChange={(val) => {
                    setProductActive(val === "products")
                }}>
                    <Select.Trigger />
                    <Select.Content position="popper">
                        <Select.Group>

                            <Select.Item value="raw-materials">Raw Materials</Select.Item>
                            <Select.Item value="products">Products</Select.Item>

                        </Select.Group>


                    </Select.Content>
                </Select.Root>

            </Flex>
            <Separator className="my-4 w-full" />


            <form action="" onSubmit={handleSubmit}>

                <Grid columns={"2"} gap={"6"}>
                    <div>
                        <Text>Select Item</Text>
                        <Select.Root onValueChange={(val) => {
                            setItemID(val)
                        }}>
                            <Select.Trigger className="w-full" placeholder={productActive ? "Select Product" : "Select Raw Material"} disabled={storeItems.length === 0} />
                            <Select.Content position="popper">
                                <Select.Group>
                                    {storeItems.map((item) => {
                                        return <Select.Item value={item.id}>{item.product.name}</Select.Item>
                                    })}

                                </Select.Group>


                            </Select.Content>
                        </Select.Root>
                    </div>
                    <div>
                        <Text>Supplier Name</Text>
                        {/* <Select.Root onValueChange={(val) => {
                            setSupplierID(val)
                        }} >
                            <Select.Trigger className="w-full" placeholder="Enter Supplier Name" disabled={suppliers.length === 0} />
                            <Select.Content position="popper">
                                <Select.Group>
                                    {suppliers.map((supplier) => {
                                        return <Select.Item value={`${supplier.id}`}>{`${supplier.firstname} ${supplier.lastname}`}</Select.Item>
                                    })}

                                </Select.Group>
                            </Select.Content>
                        </Select.Root> */}
                        <TextField.Root
                        placeholder="Enter Supplier Name"
                            value={supplierName} onChange={(e) => {
                            setSupplierName(e.target.value)
                        }}></TextField.Root>
                    </div>
                    <div>
                        <Text>Batch Number</Text>
                        <TextField.Root placeholder="Enter Batch Number"
                            value={batchNumber}
                            onChange={(e) => {
                                setBatchNumber(e.target.value)
                            }}
                        ></TextField.Root>
                    </div>
                    <div>
                        <Text>Quantity Removed</Text>
                        <TextField.Root placeholder="Enter Quantity Removed"
                            value={quantityOut}
                            onChange={(e) => {
                                setQuantityOut(e.target.value)
                            }}

                        ></TextField.Root>
                    </div>
                    <div>
                        <Text>Siganture</Text>
                        <Flex className="w-full">
                            <TextField.Root placeholder="Sign Here"
                                value={""}
                                className="w-[70%]"
                            ></TextField.Root>
                            <Button className="w-[30%] bg-theme">Sign </Button>
                        </Flex>
                    </div>
                </Grid>

                <Flex justify={"end"}>
                    <Button size={"3"} className="bg-theme mt-12" type="submit" disabled={loading}>
                        {loading ? <Spinner /> :  _.upperFirst(storeAction) }
                    </Button>
                </Flex>
            </form>
            <Toaster position="top-right" />
        </>}
        
       
    </>
    )
}

export default ManagePharmacyStore