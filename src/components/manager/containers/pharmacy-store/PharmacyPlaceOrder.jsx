import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { LoaderIcon } from "react-hot-toast";
import {
  Heading,
  Card,
  Separator,
  Flex,
  TextField,
  Text,
  Button,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useToast from "../../../../hooks/useToast";

const root = import.meta.env.VITE_ROOT;

const PharmacyPlaceOrder = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const showToast = useToast()
  const [rawMaterials, setRawMaterials] = React.useState([]);
  const [plans, setPlans] = React.useState([
    {
      rawMaterial: "",
      quantity: "",
      unit: "",
      expectedDeliveryDate: "",
    },
  ]);

  const fetchRawMaterials = async () => {
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      return;
    }

    try {
      const response = await axios.get(`${root}/dept/get-pharm-dept`, {
        headers: { Authorization: `Bearer ${retrToken}` },
      });

      const deptId = response.data.department[0].id;

      const secondRequest = await axios.get(
        `${root}/dept/get-dept-raw/${deptId}`,
        {
          headers: {
            Authorization: `Bearer ${retrToken}`,
          },
        }
      );

      setRawMaterials(secondRequest.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addPlan = () => {
    setPlans([
      ...plans,
      { rawMaterial: "", quantity: "", unit: "", expectedDeliveryDate: "" },
    ]);
  };

  const removePlan = (index) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
  };

  const handleRawMaterialChange = (index, selectedMaterialId) => {
    const selectedMaterial = rawMaterials.find(
      (item) => item.id === selectedMaterialId
    );
    const updatedPlans = plans.map((plan, i) =>
      i === index
        ? {
            ...plan,
            rawMaterial: selectedMaterialId,
            unit: selectedMaterial ? selectedMaterial.price[0].unit : "",
          }
        : plan
    );
    setPlans(updatedPlans);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPlans = plans.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan
    );
    setPlans(updatedPlans);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("Submitting Form", {
      style: { padding: "30px" },
      duration: 1000,
    });

    const body = { orders: plans };
    const retrToken = localStorage.getItem("token");
    if (!retrToken) {
      toast.error("An error occurred. Try logging in again");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${root}/dept/raise-pharm-order`,
        body,
        {
          headers: { Authorization: `Bearer ${retrToken}` },
        }
      );
      setIsLoading(false);
      showToast({
        message: response.data.message,
        duration:4500
      })

      // Clear form after successful submission
      setPlans([
        { rawMaterial: "", quantity: "", unit: "", expectedDeliveryDate: "" },
      ]);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      showToast({
        message: err.response.data.message ||" An error occurred",
        type: "error"
      })
    }
  };

  React.useEffect(() => {
    fetchRawMaterials();
  }, []);

  return (
    <div>
      <Heading>Place Order</Heading>
      <Separator className="w-full my-4" />

      <form onSubmit={handleSubmit}>
        {plans.map((plan, index) => (
          <Card key={index} className="mb-4">
            {plans.length > 1 && (
              <Flex justify={"end"}>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removePlan(index)}
                >
                  - Remove
                </button>
              </Flex>
            )}

            <div>
              <Flex className="w-full" gap={"7"}>
                <div className="w-full">
                  <Text className="mb-4">
                    Raw Material Needed <span className="text-red-500">*</span>
                  </Text>
                  <Select.Root
                    disabled={rawMaterials.length === 0}
                    onValueChange={(value) =>
                      handleRawMaterialChange(index, value)
                    }
                  >
                    <Select.Trigger
                      className="mt-2 w-full"
                      placeholder="Select Raw Material"
                    />
                    <Select.Content position="popper">
                      <Select.Group>
                        {rawMaterials.map((item) => (
                          <Select.Item key={item.id} value={item.id}>
                            {item.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </div>
                <div className="w-full">
                  <Text className="mb-4">
                    Quantity<span className="text-red-500">*</span>
                  </Text>
                  <TextField.Root
                    className="mt-2"
                    placeholder="Enter Quantity"
                    value={plan.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
              </Flex>

              <Flex className="w-full mt-5" gap={"7"}>
                <div className="w-full">
                  <Text className="mb-4">Unit</Text>
                  <TextField.Root
                    className="mt-2"
                    disabled
                    placeholder="Unit"
                    value={plan.unit}
                  />
                </div>
                <div className="w-full">
                  <Text className="mb-4">
                    Expected Delivery<span className="text-red-500">*</span>
                  </Text>
                  <TextField.Root
                    type="date"
                    className="mt-2"
                    value={plan.expectedDeliveryDate}
                    required
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "expectedDeliveryDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </Flex>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addPlan}
          size={"3"}
          className="border-2 cursor-pointer !border-theme mt-3"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <Flex justify={"end"}>
          <Button
            type="submit"
            size={"3"}
            className="!bg-theme border-2 cursor-pointer !border-theme mt-3"
          >
            {isLoading ? <LoaderIcon /> : "Submit Order"}
          </Button>
        </Flex>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default PharmacyPlaceOrder;
