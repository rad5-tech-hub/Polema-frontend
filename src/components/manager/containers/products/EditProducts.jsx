import React, { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import * as Switch from "@radix-ui/react-switch";
import {
  Card,
  Button,
  Heading,
  Separator,
  TextField,
  Select,
  Flex,
  Spinner,
} from "@radix-ui/themes";

import toast, { Toaster } from "react-hot-toast";

const root = import.meta.env.VITE_ROOT;

const EditProducts = () => {
  //State management for form
  const [productName, setProductName] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [deptID, setDeptId] = React.useState("");
  const [department, setDepartment] = React.useState([]);

  //   Function to fetch departmemts
  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("An error occurred , try logging in again.", {
        duration: 10000,
        style: {
          padding: "20px",
        },
      });
      return;
    }
    try {
      const request = await axios.get(`${root}/dept/get-department`);
      setDepartment(request.data.departments);
    } catch (error) {
      toast.error("An error occurred, try again later", {
        duration: 8000,
        style: {
          padding: "20px",
        },
      });
      throw new Error("An Error Occurred");
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <Flex justify={"between"} align={"center"}>
        <div className="flex items-center gap-3">
          <div className="cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <Heading className="text-left py-4">Edit Product</Heading>
        </div>
        <Select.Root defaultValue="products">
          <Select.Trigger placeholder="Select" />
          <Select.Content>
            <Select.Group>
              <Select.Item value="raw-materials">Raw Materials</Select.Item>
              <Select.Item value="products">Products</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator className="w-full" />
      <form action="">
        <div className="flex w-full justify-between gap-8">
          <div className="left w-[50%]">
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="product-name"
              >
                Product Name
              </label>
              <TextField.Root
                placeholder="Enter Product name"
                type="text"
                required={true}
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                id="product-name"
                size={"3"}
              />
            </div>

            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="price"
              >
                Base Price
              </label>
              <TextField.Root
                placeholder="Enter Base Price"
                id="price"
                required={true}
                type="text"
                // value={formatNumber(basePrice)}
                // onChange={handleBasePriceChange}
              />
            </div>
          </div>

          <div className="right w-[50%]">
            <div className="input-field mt-3">
              <label
                className="text-[15px] font-medium leading-[35px]"
                htmlFor="unit"
              >
                Product Unit
              </label>
              <TextField.Root
                placeholder="Specify Unit (kg, litres, bags, others)"
                id="unit"
                type="text"
                required={true}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                size={"3"}
              />
            </div>

            <div className="w-full mt-3">
              <label className="text-[15px] font-medium leading-[35px]">
                Department
              </label>

              <Select.Root
                value={deptID}
                onValueChange={(val) => setDeptId(val)}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select Department"
                />
                <Select.Content position="popper">
                  {department.map((dept) => (
                    <Select.Item key={dept.id} value={dept.id}>
                      {dept.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>
      </form>

      {/* ------------Switch Button------------- */}
      <div className="input-field mt-3 flex justify-end">
        <div>
          <label
            className="text-[15px] leading-none pr-[15px]"
            htmlFor="pricePlan"
          >
            Price Plan
          </label>
          {/* 
          <Switch.Root
            className={` w-[32px] h-[15px] bg-black-600 rounded-full relative shadow-[0_2px_10px] border-2 border-black shadow-black/25  data-[state=checked]:bg-green outline-none cursor-default`}
            id="pricePlan"
            //   checked={pricePlan}
            //   onCheckedChange={handleSwitchChange}
          >
            <Switch.Thumb className="block w-[11px] h-[11px] bg-white rounded-full shadow-[0_2px_2px] shadow-black transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root> */}
          <Switch.Root
            className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
            id="airplane-mode"
            style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" }}
          >
            <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default EditProducts;
