import { Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import DistributionMediaForm from "../../Form/DistributionMedia/DistributionMediaForm";

const DistributionMedia = ({dataDM = []}) => {
  // Selector
  const { loading } = useSelector((state) => state.account);
  return (
    <Spin spinning={loading}>
      <div className="w-full p-5">
        <p className="text-primary uppercase font-bold">
          Distribution Media Information
        </p>

        <div className="pt-[30px]">
          <DistributionMediaForm type={"confirmation"} data={dataDM}/>
        </div>
      </div>
    </Spin>
  )
}

export default DistributionMedia