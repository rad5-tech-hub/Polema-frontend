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
import React from "react";
  const root = import.meta.env.VITE_ROOT
  

const BatchingRecords = () => {
    const { id } = useParams();
    const showToast = useToast()
    const [loading,setLoading] = React.useState(true)
    

    const getBatchDetails = async () => {
        const token = localStorage.getItem("token");


        if (!token) {
          showToast({
            type: "error",
            message: "An error occurred, try logging in again.",
          });
          
          return;
        }


        try{
            const response = await axios.get(`${root}/batch/a-batch/${id}`, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
        } catch (err) {
            showToast({
                type: "error",
                message: "An error occurred while trying to get bbatch summary",
              });
        } finally {
            setLoading(false)
        }
    }
    

    React.useEffect(() => {
        getBatchDetails()
    },[id])
  return (
    <>
      <Flex justify="between" align={"center"}>
        <Heading>Batch Summary</Heading>
        <p>
          <span className="font-bold">Status:</span>
        </p>
      </Flex>

      {loading && <Spinner size="3" className="mt-4" />}
    </>
  );
}

export default BatchingRecords