import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";

const FormConfirmation = ({ data }) => {
  const {
    list_sor,
    list_account_group,
    list_customer_segment,
    list_cost_center,
    list_meter_reading_code,
    list_specific_customer,
    list_billing_cycle,
    list_billing_period,
    list_scheduler_type,
  } = useSelector((state) => state.rbi_prabilling);

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
    return "";
  };

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

  const getGroupTypeName = (val) => {
    const groupTypeName = list_account_group?.find(
      (item) => item?.glbTypeValId === val 
    );

    if (groupTypeName) {
      return groupTypeName.glbValue || groupTypeName.name || ""; 
    }
    return "";
  };

  const getCustomerName = (val) => {
    const customerName = list_specific_customer?.find(
      (item) => item?.accountNumber === val
    );
    if (customerName) {
      return `${customerName.accountName} - ${customerName.accountNumber}`;
    }
    return val || "";
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

  const mergeMrcDto = useMemo(
    () =>
      (list_meter_reading_code ?? []).reduce(
        (acc, cur) => acc.concat(cur?.dtoList ?? []),
        []
      ),
    [list_meter_reading_code]
  );

  const getMrcName = (val) => {
    const found = mergeMrcDto.find((item) => item?.id === val);
    return found?.name ?? "";
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
    const scheduleType = list_scheduler_type?.find((item) => item?.id === val);
    if (scheduleType) {
      return scheduleType.name;
    }
    return "";
  };

  const renderSpecificCustomer = () => {
    const specificCustomers = data?.rRbiCalculationSpecificCustomer || [];

    if (specificCustomers.length === 0) {
      return (
        <div className="flex items-start gap-2">
          <span className="font-medium">
            All customers matching filter criteria
          </span>
        </div>
      );
    }

    const MAX_DISPLAY = 5;
    const displayCustomers = specificCustomers.slice(0, MAX_DISPLAY);
    const remainingCount = specificCustomers.length - MAX_DISPLAY;

    return (
      <div className="space-y-1">
        {displayCustomers.map((item, index) => (
          <div key={index} className="text-[13px]">
            {getCustomerName(item.custNumb)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-[13px] text-blue-600 font-medium mt-2">
            + {remainingCount} more customer{remainingCount > 1 ? "s" : ""}
          </div>
        )}
        <div className="text-[12px] text-gray-500 mt-2 pt-2 border-t border-gray-200">
          Total:{" "}
          <span className="font-semibold">{specificCustomers.length}</span>{" "}
          customer
          {specificCustomers.length > 1 ? "s" : ""} selected
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Billing Cycle Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary text-xs uppercase">
              Billing Cycle Information
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
          <DetailText label="Billing Cycle">
            {getBillingCycleName(data?.billingCycle)}
          </DetailText>
          <DetailText label="Billing Period">
            {getPeriodName(data?.billingPeriod)}
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
          <DetailText label="SOR">{getSorName(data?.sor)}</DetailText>

          <DetailText label="Cost Center">
            {data?.rRbiCalculationCostCenter?.length > 0
              ? data?.rRbiCalculationCostCenter?.map((item, index, array) => (
                  <span key={index + 1}>
                    {getCostCenterName(item.costCenter)}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
          </DetailText>

          <DetailText label="Meter Reading Code">
            {data?.rRbiCalculationMeterReadingCode?.length > 0
              ? data?.rRbiCalculationMeterReadingCode?.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getMrcName(item.mreadingCode)}
                      {index < array.length - 1 && ", "}
                    </span>
                  )
                )
              : ""}
          </DetailText>

          <DetailText label="Account Segment">
            {data?.rRbiCalculationAccountSegment?.length > 0
              ? data?.rRbiCalculationAccountSegment?.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getAccSegmentName(item.accSegment)}
                      {index < array.length - 1 && ", "}
                    </span>
                  )
                )
              : ""}
          </DetailText>

          <DetailText label="Account Group Type">
            {data?.rRbiCalculationAccountGroupType?.length > 0
              ? data?.rRbiCalculationAccountGroupType?.map(
                  (item, index, array) => (
                    <span key={index + 1}>
                      {getGroupTypeName(item.accGroupType)}
                      {index < array.length - 1 && ", "}
                    </span>
                  )
                )
              : ""}
          </DetailText>

          <DetailText label="Specific Customer Account">
            {renderSpecificCustomer()}
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

          {data?.scheduleDateTime && (
            <DetailText label="Schedule Date Time">
              {data?.scheduleDateTime}
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