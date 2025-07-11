import React from "react";
import { Flex ,Select as AntSelect} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import { Button, TextField, Heading, Separator, Grid ,Text} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const root =  import.meta.env.VITE_ROOT

const Cheque = () => {
  const showToast = useToast();
  const navigate = useNavigate()
  const [bankDetails, setBankDetails] = useState([]);
  const [bankId, setBankId] = useState("");


  //Function to fetch bank details
  const fetchBankDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast({
        message: "An error occurred, try logging in again",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.get(`${root}/admin/get-banks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBankDetails(response.data.banks || []);
    } catch (error) {
      console.log(error);
      showToast({
        message: "Error in getting bank details",
        type: "error",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);
  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading>Cheques</Heading>
        <Button className="!bg-theme cursor-pointer" onClick={()=>{
          navigate("/admin/receipts/all-cheques")
        }}>
          View Cheque Records
        </Button>
      </Flex>
      <Separator className="w-full mt-4" />
      <form>
        <Grid columns={"2"} gap={"4"} className="mt-4">
          <div className="w-full">
            <label htmlFor="name" className="mb-4">
              Name
            </label>
            <TextField.Root
              placeholder="Name"
              id="name"
              className="w-full mt-4"
            />
          </div>
          <div className="w-full">
            <Text>
              Bank Name <span className="text-red-500">*</span>
            </Text>

            <AntSelect
              showSearch
              className="mt-4"
              placeholder={"Select Bank"}
              value={bankId || ""}
              style={{ width: "100%" }}
              onChange={(value) => {
                setBankId(value);
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {bankDetails.map((bank) => (
                <Option key={bank.id} value={bank.id}>
                  {bank.name}
                </Option>
              ))}
            </AntSelect>
          </div>{" "}
          <div className="w-full">
            <label htmlFor="cheque" className="mb-4">
              Cheque No.
            </label>
            <TextField.Root
              placeholder="Enter Cheque Number"
              id="cheque"
              className="w-full mt-4"
            />
          </div>{" "}
          <div className="w-full">
            <label htmlFor="amount" className="mb-4">
              Amount
            </label>
            <TextField.Root
              placeholder="Enter Amount"
              id="amount"
              className="w-full mt-4"
            />
          </div>
          <div className="w-full">
            <label htmlFor="description" className="mb-4">
              Description
            </label>
            <TextField.Root
              placeholder="Enter Description"
              id="description"
              className="w-full mt-4"
            />
          </div>
        </Grid>
        <Flex justify={"end"} align={"end"} width={"100%"}>
          <Button
            className="mt-4 bg-theme hover:bg-theme/85"
            size={"4"}
            type="submit"
            // disabled={isLoading}
          >
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Cheque;
