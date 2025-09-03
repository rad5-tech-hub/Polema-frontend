import React, { useRef, useEffect } from "react";
import toast,{Toaster} from "react-hot-toast"
import SignaturePad from "signature_pad";
import useToast from "../../hooks/useToast";

const SignatureCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const showToast = useToast();
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "white", // Background color
        penColor: "black",// Pen color
      });
    }
  }, []);

  // ✅ Clear signature
  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  // ✅ Save signature as an image
  const saveSignature = () => {
    if (!signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL("image/webp",0.7);
      onSave(dataUrl);
      showToast({
        message: "Signature saved successfully!",
        type: "success",
        duration: 4000,
      });
    } else {
      showToast({
        message: "Please provide a signature first",
        type:"error",
        duration:5000
      })
   
    }
  };

  return (
    <>
      <div className="mt-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={250}
          style={{
            border: "2px solid black",
            borderRadius: "5px",
            background: "white",
          }}
        />
        <div style={{ marginTop: "10px" }}>
          <button onClick={clearSignature} type="button" className="underline"> Clear</button>
          <button onClick={saveSignature} style={{ marginLeft: "10px" }} type="button" className="underline">
            Save Signature
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default SignatureCanvas;
