import React from "react";
import { MaintenancePage } from "../../../../assets/img";

const MaintenanceModeNotFound = () => {
  return (
    <div
      className="col-span-12 flex bg-no-repeat bg-cover w-full justify-end items-center min-h-screen"
      style={{
        backgroundImage: `url(${MaintenancePage})`,
      }}
    />
  );
};

export default MaintenanceModeNotFound;
