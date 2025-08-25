import React from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import AddressOverview from "../../Form/Address/AddressOverview";

const Address = ({ data = [] }) => {
  // Selector
  const { loading } = useSelector((state) => state.account);
  return (
    <Spin spinning={loading}>
      <div className="w-full p-5">
        <p className="text-primary uppercase font-bold">
          Account Address Information
        </p>

        <div className="pt-[30px]">
          <AddressOverview type={"confirmation"} addressTable={data} />
        </div>
      </div>
    </Spin>
  );
};

export default Address;
