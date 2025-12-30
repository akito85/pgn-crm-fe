import React from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const DetailSection = ({ dataContentManagement, dataHistory, dataCriteria }) => {
  const contentTemplate = dataContentManagement?.contentTemplate || {};
  
  return (
    <>
      {/* Content Template Information */}
      <BaseContainer header={"Content Template Information"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label={"Template Code"}>
            {contentTemplate?.templateCode || "-"}
          </DetailText>
          <DetailText label={"Template Name"}>
            {contentTemplate?.templateName || "-"}
          </DetailText>
          <DetailText label={"Format Type"}>
            {contentTemplate?.formatType || "-"}
          </DetailText>
          <DetailText label={"Category"}>
            {contentTemplate?.category || "-"}
          </DetailText>
          <DetailText label={"Media Channel"}>
            {contentTemplate?.mediaChannel || "-"}
          </DetailText>
          <DetailText label={"Start Date"}>
            {contentTemplate?.startDate
              ? moment(contentTemplate.startDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label={"End Date"}>
            {contentTemplate?.endDate
              ? moment(contentTemplate.endDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label={"Status"}>
            {contentTemplate?.status || "-"}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {contentTemplate?.statusApproval || "-"}
          </DetailText>
          <DetailText label={"Version"}>
            {contentTemplate?.version || "-"}
          </DetailText>
        </div>
        
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <DetailText label={"Description"}>
            {contentTemplate?.description || "-"}
          </DetailText>
          <DetailText label={"Content Subject"}>
            {contentTemplate?.contentSubject || "-"}
          </DetailText>
        </div>
        
        <div className="w-full grid grid-cols-1 gap-3 mt-3">
          <DetailText label={"Content Body"}>
            <div 
              className="border p-2 rounded"
              dangerouslySetInnerHTML={{ 
                __html: contentTemplate?.contentBody || "-" 
              }}
            />
          </DetailText>
        </div>
      </BaseContainer>

      {/* Criteria Information */}
      {dataCriteria && dataCriteria.length > 0 && (
        <BaseContainer header={"Criteria Information"} className="mt-4">
          {dataCriteria.map((criteria, index) => (
            <div key={criteria.id || index} className="w-full grid grid-cols-4 gap-3 mb-4">
              <DetailText label={"All Criteria"}>
                {criteria?.allCriteria === "Y" ? "Yes" : "No"}
              </DetailText>
              {criteria?.customer && (
                <DetailText label={"Customer"}>
                  {criteria.customer}
                </DetailText>
              )}
              {criteria?.budget && (
                <DetailText label={"Budget"}>
                  {criteria.budget}
                </DetailText>
              )}
              {criteria?.province && (
                <DetailText label={"Province"}>
                  {criteria.province}
                </DetailText>
              )}
              {criteria?.city && (
                <DetailText label={"City"}>
                  {criteria.city}
                </DetailText>
              )}
              {criteria?.district && (
                <DetailText label={"District"}>
                  {criteria.district}
                </DetailText>
              )}
              {criteria?.subDistrict && (
                <DetailText label={"Sub District"}>
                  {criteria.subDistrict}
                </DetailText>
              )}
              {criteria?.area && (
                <DetailText label={"Area"}>
                  {criteria.area}
                </DetailText>
              )}
              {criteria?.sor && (
                <DetailText label={"SOR"}>
                  {criteria.sor}
                </DetailText>
              )}
              {criteria?.industrialSector && (
                <DetailText label={"Industrial Sector"}>
                  {criteria.industrialSector}
                </DetailText>
              )}
              {criteria?.product && (
                <DetailText label={"Product"}>
                  {criteria.product}
                </DetailText>
              )}
              {criteria?.gsizes && (
                <DetailText label={"G Sizes"}>
                  {criteria.gsizes}
                </DetailText>
              )}
              {criteria?.customerSegment && (
                <DetailText label={"Customer Segment"}>
                  {criteria.customerSegment}
                </DetailText>
              )}
              {criteria?.accountGroupType && (
                <DetailText label={"Account Group Type"}>
                  {criteria.accountGroupType}
                </DetailText>
              )}
              {criteria?.accountClass && (
                <DetailText label={"Account Class"}>
                  {criteria.accountClass}
                </DetailText>
              )}
              {criteria?.accountCategory && (
                <DetailText label={"Account Category"}>
                  {criteria.accountCategory}
                </DetailText>
              )}
              {criteria?.serviceType && (
                <DetailText label={"Service Type"}>
                  {criteria.serviceType}
                </DetailText>
              )}
              {criteria?.startDate && (
                <DetailText label={"Start Date"}>
                  {moment(criteria.startDate).format(dateFormatting.date)}
                </DetailText>
              )}
              {criteria?.endDate && (
                <DetailText label={"End Date"}>
                  {moment(criteria.endDate).format(dateFormatting.date)}
                </DetailText>
              )}
            </div>
          ))}
        </BaseContainer>
      )}

      {/* History Log Information */}
      <BaseContainer header={"History Log Information"} className="mt-4">
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label={"Record ID"}>
            {dataHistory?.recordId || "-"}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataHistory?.createdBy || "-"}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataHistory?.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>
    </>
  );
};

export default DetailSection;