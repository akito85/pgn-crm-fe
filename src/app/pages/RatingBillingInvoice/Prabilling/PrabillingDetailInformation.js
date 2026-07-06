import React from "react";
import moment from "moment";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import DetailText from "../../../../components/DetailText";

const PrabillingDetailInformation = ({ data, tabHeader }) => {

  const prabillData = data?.prabillInitPopulate || {};
  const detailsData = data?.details || [];

  const renderStatus = (status) => {
    switch (status) {
      case 0: return "Open";
      case 1: return "In Progress";
      case 2: return "Success";
      case 3: return "Failed";
      default: return status || "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
        {/* Prabilling Information - CollapsibleContainer */}
        <CollapsibleContainer header={"Prabilling Information"} border className="mt-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-4">
            <DetailText label={"Init Code"}>
              {prabillData?.initCode || ""}
            </DetailText>
            <DetailText label={"Process Name"}>
              {prabillData?.processName || ""}
            </DetailText>
            <DetailText label={"Billing Cycle"}>
              {prabillData?.billingCycle || ""}
            </DetailText>
            <DetailText label={"Billing Period"}>
              {prabillData?.billPeriod || ""}
            </DetailText>
            <DetailText label={"SOR"}>
              {prabillData?.sor || ""}
            </DetailText>
            <DetailText label={"Schedule Type"}>
              {prabillData?.shceduleType || ""}
            </DetailText>
            <DetailText label={"Total Account"}>
              {prabillData?.totalCustomer || 0}
            </DetailText>
            <DetailText label={"Status"}>
              {renderStatus(prabillData?.status)}
            </DetailText>
            <DetailText label={"Message"}>
              {prabillData?.message || ""}
            </DetailText>

            {detailsData && detailsData.length > 0 &&
              detailsData.map((detail, index) => (
                <React.Fragment key={index}>
                  <DetailText label={"Cost Center"}>
                    {detail.costCenterName || detail.costCenter || ""}
                  </DetailText>
                  <DetailText label={"Meter Reading Code"}>
                    {detail.meterReadingCodeName || detail.meterReadingCode || ""}
                  </DetailText>
                  <DetailText label={"Account Segment"}>
                    {detail.accountSegmentName || detail.accountSegment || ""}
                  </DetailText>
                  <DetailText label={"Account Group Type"}>
                    {detail.accountGroupTypeName || detail.accountGroupType || ""}
                  </DetailText>
                  <DetailText label={"Specific Customer Account"}>
                    {detail.accounts}
                  </DetailText>
                  <DetailText label={"Prabill Component"}>
                    {detail.prabillComponent}
                  </DetailText>
                  <DetailText label={"Completion Date"}>
                    {prabillData?.updateDtm
                       ? moment(prabillData.updateDtm).format("DD MMM YYYY HH:mm:ss")
                       : ""}
                  </DetailText>
                </React.Fragment>
              ))}

            <DetailText label={"Remark"} className="col-span-full">
              {prabillData?.remark || ""}
            </DetailText>
          </div>
        </CollapsibleContainer>
    </div>
  );
};

export default PrabillingDetailInformation;