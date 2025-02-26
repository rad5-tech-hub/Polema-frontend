import React, { useState } from "react";
import { FAQData } from "./FAQData";
import { Modal } from "antd";
import { QuestionMarkIcon } from "@radix-ui/react-icons";

const FAQ = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

    // Function for the modal functionality
    const showLoading = () => {
      setModalOpen(true);
      setModalLoading(true);

      // Simple loading mock. You should add cleanup logic in real world.
      setTimeout(() => {
        setModalLoading(false);
      }, 2000);
    };

  return (
    <>
      <div
        className="cursor-pointer relative border-[1px] z-[999] border-[#000]/60 rounded-lg p-3"
        // onClick={showLoading}
      >
        <QuestionMarkIcon />
      </div>
      {/* <Modal
        open={modalOpen}
        loading={modalLoading}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="FAQ"
      >
        {FAQData.length === 0
          ? "No Video available yet"
          : FAQData.map((item) => {
              return (
                <div className="flex items-center gap-2">
                  <p>{item.videoTitle}</p>
                </div>
              );
            })}
      </Modal> */}
    </>
  );
};

export default FAQ;
// {
//   FAQData.map((item) => {
//     return (
//       <>
//         <p>{item.videoTitle}</p>
//       </>
//     );
//   });
// }
