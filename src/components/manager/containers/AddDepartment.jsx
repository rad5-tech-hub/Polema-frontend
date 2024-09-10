import { Heading, TextField } from "@radix-ui/themes";
import React from "react";

const AddDepartment = () => {
  return (
    <div>
      <Heading className="py-4">Create Department</Heading>

      {/* Input for department name */}
      <div>
        <label
          htmlFor="name"
          className="text-[15px]  font-medium leading-[35px]   "
        >
          Department Name
        </label>
        <TextField.Root
          placeholder="Enter Department Name "
          color=""
          className="mt-1 w-[50%] p-1"
        ></TextField.Root>
      </div>
    </div>
  );
};

export default AddDepartment;
