import React, { useState } from "react";
import { Separator, Grid, Blockquote } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPills,
} from "@fortawesome/free-solid-svg-icons";

const ViewDepartmentStore = () => {
  const detailsArray = [
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Paracetamol",
      stockNumber: 350,
      stockAvailable: false,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 40,
      stockAvailable: false,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
    {
      name: "Septodont",
      stockNumber: 200,
      stockAvailable: true,
    },
  ];

  return (
    <div>
      <h1>View All</h1>
      <Separator className="my-2 w-full" />

      <div>
        <Grid columns={"6"} rows={"3"} gapX={"4"} gapY={"3"}>
          {detailsArray.map((item, index) => {
            return (
              <div
                className="p-5 shadow-xl max-w-[175px] max-h-[101px] rounded-lg relative"
                key={index}
              >
                <div className="absolute top-2 right-2 ">
                  <FontAwesomeIcon
                    icon={faPills}
                    width={"16px"}
                    className="opacity-40"
                    height={"16px"}
                  />
                </div>
                <Blockquote>
                  <p className="text-[0.6rem]">{item.name}</p>
                  <p className="text-3xl font-semibold font-amsterdam">
                    {item.stockNumber}
                  </p>
                  {item.stockAvailable ? (
                    <p className="text-green-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowUp} />
                      Currently in Stock
                    </p>
                  ) : (
                    <p className="text-red-500  flex gap-1 items-center text-[.5rem]">
                      <FontAwesomeIcon icon={faArrowDown} />
                      Currently out of Stock
                    </p>
                  )}
                </Blockquote>
              </div>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default ViewDepartmentStore;
