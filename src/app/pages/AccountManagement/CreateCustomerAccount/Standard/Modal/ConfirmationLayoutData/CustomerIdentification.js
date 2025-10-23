import { Spin } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import DetailText from "../../../../../../../components/DetailText";
import {
  getCustomerType,
  getIdentificationType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const CustomerIdentification = ({ data, dispatch = () => {} }) => {
  // Selector
  const { data_customerType, data_identificationType, loading } = useSelector(
    (state) => state.account
  );

  // Use Effect
  useEffect(() => {
    dispatch(getCustomerType());
    dispatch(getIdentificationType());
  }, []);

  const labelCT = data_customerType
    ?.filter((a) => a.id === data?.customerType)
    ?.find((b) => b.name)?.name;

  const labelIT = data_identificationType
    ?.filter((a) => a.id === data?.identificationType)
    ?.find((b) => b.name)?.name;

  return (
    <Spin spinning={loading}>
      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold">
          customer identification
        </span>

        <div className="w-full grid grid-cols-3 gap-4 pt-[30px]">
          <DetailText label={"Customer Type"}>{labelCT}</DetailText>
          <DetailText label={"Identification Type"}>{labelIT}</DetailText>
          <DetailText label={"Customer Identification Number"}>
            {data?.customerIdentificationNumber}
          </DetailText>
        </div>
      </div>
    </Spin>
  );
};

export default CustomerIdentification;
