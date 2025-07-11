import React from "react";
import { Flex } from "antd";
import { Button, TextField, Heading, Separator, Grid } from "@radix-ui/themes";

const Cheque = () => {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading>Cheques</Heading>
        <Button className="!bg-theme cursor-pointer">
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
            <label htmlFor="name" className="mb-4">
              Bank Name
            </label>
            <TextField.Root
              placeholder="Name"
              id="name"
              className="w-full mt-4"
            />
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
            <TextField.Root placeholder="Enter Description" id="description" className="w-full mt-4" />
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
