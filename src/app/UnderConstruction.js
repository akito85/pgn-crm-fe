import React from "react";
import { pgnLogo } from "../assets/img";

const UnderConstruction = () => {
  return (
    <div className="w-screen h-screen bg-dg-blue-light2 flex flex-col items-center justify-center">
      <img
        className="mx-auto mt-7 h-1/6 w-auto mb-8"
        src={pgnLogo}
        alt="Your Company"
      />
      <span className="text-center text-xl font-bold p-8">
        {" "}
        Under Maintenance
      </span>
      <span className="w-80 opacity-50 text-center text-sm font-bold">
        {" "}
        The page you’re looking for is currently under maintenance and will be
        back soon.
      </span>
    </div>
  );
};

export default UnderConstruction;
