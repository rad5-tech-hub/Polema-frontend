import React from "react";
import UpdateURL from "./ChangeRoute";
const AllDepartments = () => {
  return (
    <>
      <UpdateURL url={"/all-departments"} />
      <div>All Departments</div>
    </>
  );
};

export default AllDepartments;
