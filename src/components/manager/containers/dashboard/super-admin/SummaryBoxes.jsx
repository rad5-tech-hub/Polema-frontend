import React,{useState,useEffect} from "react";

const SummaryBoxes = () => {
  const [customers, setCustomers] = useState(0);
  const [suppliers, setSuppliers] = useState(0);
  const [products, setProducts] = useState(0);
  const [rawMaterials, setRawMaterials] = useState(0);

  const customerTarget = 78;
  const supplierTarget = 45;
  const productTarget = 67;
  const rawMaterialTarget = 32;

  // Counter animation function
  const animateCounter = (setCount, targetValue, duration = 2000) => {
    let start = 0;
    const increment = targetValue / (duration / 50); // Calculate step
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);
  };

  useEffect(() => {
    animateCounter(setCustomers, customerTarget);
    animateCounter(setSuppliers, supplierTarget);
    animateCounter(setProducts, productTarget);
    animateCounter(setRawMaterials, rawMaterialTarget);
  }, []);
  return (
    <>
      {/* Data Summary Boxes with Animated Counters */}
      <div className="data-boxes flex gap-2 text-white mt-6">
        <div className="bg-[#2563eb] min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Customers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{customers}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Suppliers</h1>
          <p className="text-center text-[3rem] font-amsterdam">{suppliers}</p>
        </div>
        <div className="bg-[#2563eb] min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Products</h1>
          <p className="text-center text-[3rem] font-amsterdam">{products}</p>
        </div>
        <div className="bg-theme min-h-[150px] rounded p-5 w-full">
          <h1 className="text-lg font-bold font-space">Raw Materials</h1>
          <p className="text-center text-[3rem] font-amsterdam">
            {rawMaterials}
          </p>
        </div>
      </div>
    </>
  );
};

export default SummaryBoxes;
