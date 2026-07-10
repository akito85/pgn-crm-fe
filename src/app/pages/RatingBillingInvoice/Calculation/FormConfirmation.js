import React from "react";
import { useSelector } from "react-redux";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";

const FormConfirmation = ({ data }) => {
  const {
    loading,
    list_sor,
    list_service_type,
    list_account_group,
    list_customer_segment,
    list_calculation_type,
    list_scheduler_type,
    list_cost_center,
    list_meter_reading_code,
    list_specific_customer,
    list_billing_cycle,
    list_billing_period,
  } = useSelector((state) => state.rbi_calculation);

  // const getPeriodName = (val) => {
  //   const periodName =
  //     list_billing_period?.data &&
  //     list_billing_period?.data?.filter((item) => item?.id === val);

  //   if (periodName === undefined) {
  //     return "";
  //   }
  //   if (periodName.length !== 0) {
  //     return periodName[0].name;
  //   }
  //   return "";
  // };

  const getBillingCycleName = (val) => {
    const billingCycleName =
      list_billing_cycle &&
      list_billing_cycle?.filter((item) => item?.id === val);
    if (billingCycleName === undefined) {
      return "";
    }
    if (billingCycleName.length !== 0) {
      return billingCycleName[0].name;
    }
    return "";
  };

  const getCalculationTypeName = (val) => {
    const calculationTypeName =
      list_calculation_type &&
      list_calculation_type?.filter((item) => item?.id === val);
    if (calculationTypeName === undefined) {
      return "";
    }
    if (calculationTypeName.length !== 0) {
      return calculationTypeName[0].name;
    }
    return "";
  };

  const getGroupTypeName = (val) => {
    const groupTypeName = list_account_group?.find(
      (item) => item?.glbTypeValId === val,
    );

    if (groupTypeName) {
      return groupTypeName.glbValue || groupTypeName.name || "";
    }
    return "";
  };

  const getCustomerName = (val) => {
    const customerName =
      list_specific_customer &&
      list_specific_customer?.filter(
        (item) => item?.code === val || item?.accountNumber === val,
      );
    if (customerName === undefined) {
      return "";
    }
    if (customerName.length !== 0) {
      return customerName[0].name || customerName[0].accountName;
    }
    return "";
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
    return "";
  };

  const getMrcName = (val) => {
    let mergeMrcDto = list_meter_reading_code?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      [],
    );
    const mrcName =
      mergeMrcDto && mergeMrcDto?.filter((item) => item?.id === val);
    if (mrcName === undefined) {
      return "";
    }
    if (mrcName.length !== 0) {
      return mrcName[0].name;
    }
    return "";
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
    return "";
  };

  const getServicecTypeName = (val) => {
    const serviceTypeName =
      list_service_type &&
      list_service_type?.filter((item) => item?.id === val);
    if (serviceTypeName === undefined) {
      return "";
    }
    if (serviceTypeName.length !== 0) {
      return serviceTypeName[0].name;
    }
    return "";
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
    return "";
  };

  const getScheduleTypeName = (val) => {
    const scheduleTypeName =
      list_scheduler_type &&
      list_scheduler_type?.filter((item) => item?.id === val);
    if (scheduleTypeName === undefined) {
      return "";
    }
    if (scheduleTypeName.length !== 0) {
      return scheduleTypeName[0].name;
    }
    return "";
  };

  console.log("data: ", data);

  return (
    <div className="w-full space-y-4">
      {/* Billing Cycle Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary text-xs uppercase">
              Billing Cycle Informationn
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
          <DetailText label="Billing Cycle">
            {getBillingCycleName(data?.billingCycle)}
          </DetailText>
          <DetailText label="Billing Period">
            {data?.billingPeriodName || ""}
          </DetailText>
        </div>
      </CardContainer>

      {/* Input Parameter Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary text-xs uppercase">
              Input Parameter Information
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
          <DetailText label="Calculation Type">
            {getCalculationTypeName(data?.calculationType)}
          </DetailText>
          <DetailText label="Service Type">
            {getServicecTypeName(data?.serviceType)}
          </DetailText>
          <DetailText label="SOR">{getSorName(data?.sor)}</DetailText>
          <DetailText label="Cost Center">
            {data?.rRbiCalculationCostCenter?.length > 0
              ? data.rRbiCalculationCostCenter.map((item, index, array) => (
                  <span key={index + 1}>
                    {getCostCenterName(item.costCenter)}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {data?.rRbiCalculationMeterReadingCode?.length > 0
              ? data.rRbiCalculationMeterReadingCode.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getMrcName(item.mreadingCode)}
                      {index < array.length - 1 && ", "}
                    </span>
                  ),
                )
              : ""}
          </DetailText>
          <DetailText label="Account Segment">
            {data?.rRbiCalculationAccountSegment?.length > 0
              ? data.rRbiCalculationAccountSegment.map((item, index, array) => (
                  <span key={index + 1}>
                    {getAccSegmentName(item.accSegment)}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
          </DetailText>
          <DetailText label="Account Group Type">
            {data?.rRbiCalculationAccountGroupType?.length > 0
              ? data.rRbiCalculationAccountGroupType.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getGroupTypeName(item.accGroupType)}
                      {index < array.length - 1 && ", "}
                    </span>
                  ),
                )
              : ""}
          </DetailText>
          <DetailText label="Specific Customer Account">
            {data?.rRbiCalculationSpecificCustomer?.length > 0
              ? data.rRbiCalculationSpecificCustomer.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getCustomerName(item.custNumb)}
                      {index < array.length - 1 && ", "}
                    </span>
                  ),
                )
              : ""}
          </DetailText>
        </div>
      </CardContainer>

      {/* Schedule Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary text-xs uppercase">
              Schedule Information
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
          <DetailText label="Type">
            {getScheduleTypeName(data?.scheduleType)}
          </DetailText>

          {data?.schedulerTime && (
            <DetailText label="Schedule Date Time">
              {data?.schedulerTime}
            </DetailText>
          )}

          <div className="col-span-2">
            <DetailText label="Remark">{data?.remark || ""}</DetailText>
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default FormConfirmation;
