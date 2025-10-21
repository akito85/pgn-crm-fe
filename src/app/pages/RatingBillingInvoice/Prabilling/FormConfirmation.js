import React from "react";
import { useSelector } from "react-redux";

import DetailText from "../../../../components/DetailText";

const FormConfirmation = ({ data }) => {
  const {
    loading,
    list_sor,
    list_account_group,
    list_customer_segment,
    list_cost_center,
    list_meter_reading_code,
    list_specific_customer,
    list_billing_cycle,
    list_billing_period,
  } = useSelector((state) => state.rbi_calculation);

  const getPeriodName = (val) => {
    const periodName =
      list_billing_period?.data &&
      list_billing_period?.data?.filter((item) => item?.id === val);
    if (periodName === undefined) {
      return "";
    }
    if (periodName.length !== 0) {
      return periodName[0].name;
    }
  };
  const getBillingCycleName = (val) => {
    const billingCycleName =
      list_billing_cycle?.data &&
      list_billing_cycle?.data?.filter((item) => item?.id === val);
    if (billingCycleName === undefined) {
      return "";
    }
    if (billingCycleName.length !== 0) {
      return billingCycleName[0].name;
    }
  };

  const getGroupTypeName = (val) => {
    let mergeGroupTypeDto = list_account_group?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      []
    );
    const groupTypeName =
      mergeGroupTypeDto &&
      mergeGroupTypeDto?.filter((item) => item?.id === val);
    if (groupTypeName === undefined) {
      return "";
    }
    if (groupTypeName.length !== 0) {
      return groupTypeName[0].name;
    }
  };

  const getCustomerName = (val) => {
    const customerName =
      list_specific_customer &&
      list_specific_customer?.filter((item) => item?.code === val);
    if (customerName === undefined) {
      return "";
    }
    if (customerName.length !== 0) {
      return customerName[0].name;
    }
  };
  const getCostCenterName = (val) => {
    const costCenterName =
      list_cost_center?.data &&
      list_cost_center?.data?.filter((item) => item?.id === val);
    if (costCenterName === undefined) {
      return "";
    }
    if (costCenterName.length !== 0) {
      return costCenterName[0].name;
    }
  };
  const getMrcName = (val) => {
    let mergeMrcDto = list_meter_reading_code?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      []
    );
    const mrcName =
      mergeMrcDto && mergeMrcDto?.filter((item) => item?.id === val);
    if (mrcName === undefined) {
      return "";
    }
    if (mrcName.length !== 0) {
      return mrcName[0].name;
    }
  };
  const getAccSegmentName = (val) => {
    const accSegmentName =
      list_customer_segment?.Data &&
      list_customer_segment?.Data?.filter((item) => item?.id === val);
    if (accSegmentName === undefined) {
      return "";
    }
    if (accSegmentName.length !== 0) {
      return accSegmentName[0].name;
    }
  };
  const getSorName = (val) => {
    const sorName =
      list_sor?.data && list_sor?.data?.filter((item) => item?.id === val);
    if (sorName === undefined) {
      return "";
    }
    if (sorName.length !== 0) {
      return sorName[0].name;
    }
  };

  return (
    <div className={"w-full"}>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"ACCOUNT TAX RELATION CONFIRMATION"}
      </div>
      <div className={"pl-5 w-full grid grid-cols-2"}>
        <DetailText label={"Billing Cycle"}>
          {getBillingCycleName(data?.billingCycle)}
        </DetailText>
        <DetailText label={"Billing Period"}>
          {getPeriodName(data?.billingPeriod)}
        </DetailText>
      </div>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"INPUT PARAMETER INFORMATION"}
      </div>
      <div className={"pl-5 w-full grid grid-cols-2"}>
        <DetailText label={"Sor"}>{getSorName(data?.sor)}</DetailText>
        <DetailText label={"Cost Center"}>
          {data?.rRbiCalculationCostCenter?.map((item, index, array) => (
            <span key={index + 1}>
              {getCostCenterName(item.costCenter)}
              {index < array.length - 1 && ", "}
            </span>
          ))}
        </DetailText>
        <DetailText label={"Meter Reading Code"}>
          {data?.rRbiCalculationMeterReadingCode?.map((item, index, array) => (
            <span key={index + 1}>
              {getMrcName(item.mreadingCode)}
              {index < array.length - 1 && ", "}
            </span>
          ))}
        </DetailText>
        <DetailText label={"Account Segment"}>
          {data?.rRbiCalculationAccountSegment?.map((item, index, array) => (
            <span key={index + 1}>
              {getAccSegmentName(item.accSegment)}
              {index < array.length - 1 && ", "}
            </span>
          ))}
        </DetailText>
        <DetailText label={"Account Group Type"}>
          {data?.rRbiCalculationAccountGroupType?.map((item, index, array) => (
            <span key={index + 1}>
              {getGroupTypeName(item.accGroupType)}
              {index < array.length - 1 && ", "}
            </span>
          ))}
        </DetailText>
        <DetailText label={"Specific Customer Account"}>
          {data?.rRbiCalculationSpecificCustomer?.map((item, index, array) => (
            <span key={index + 1}>
              {getCustomerName(item.custNumb)}
              {index < array.length - 1 && ", "}
            </span>
          ))}
        </DetailText>
      </div>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"SCHEDULE INFORMATION"}
      </div>
      <div className={"pl-5 w-full grid grid-cols-2"}>
        <DetailText label={"Remark"}>{data?.remark}</DetailText>
      </div>
    </div>
  );
};

export default FormConfirmation;
