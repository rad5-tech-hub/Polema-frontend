import React from "react";
import DashBoardManager from "./DashboardManager";
import { useParams } from "react-router-dom";

const Manager = () => {
  const { id } = useParams();

  return (
    <>
      <DashBoardManager route={id}></DashBoardManager>
    </>
  );
};

export default Manager;
