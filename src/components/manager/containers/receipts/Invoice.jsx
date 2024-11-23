import React from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import polemaLogo from "../../../../static/image/polema-logo.png";
const Invoice = () => {
  return (
    <div className="p-4 sm:p-8">
      <div className="intro flex justify-between items-center pb-6 border-b border-[#919191]">
        <span className="text-sm sm:text-[20px] font-semibold">
          Approved Gate Pass Note
        </span>
        <button className="rounded-lg h-[40px] border-[1px] border-[#919191] px-4 sm:px-8 shadow-lg text-sm sm:text-base flex gap-2 items-center">
          <FontAwesomeIcon icon={faPrint} />
          Print
        </button>
      </div>
    </div>
  );
};

export default Invoice;
