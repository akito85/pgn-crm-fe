import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";

const ContentDetailSection = ({
  dataContentManagement,
  dataHistory,
  dataCriteria,
}) => {
  const [valuePage, setValuePage] = useState("Content");
  const [tabPages] = useState([
    { value: "Content" },
    { value: "Criteria" },
  ]);

  const contentTemplate = dataContentManagement?.contentTemplate || {};

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const labelStatus = (index) => {
    let text;
    switch (index) {
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };

  // Render Content Tab
  const renderContentTab = () => {
    return (
      <div className="space-y-6">
        {/* Content Information - Display with proper HTML rendering */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase text-sm">
            Content Information
          </h3>
          
          {/* Subject */}
          <div className="mb-6">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Subject</span>
            </div>
            <div 
              className="bg-white border border-gray-300 rounded p-3 min-h-[50px]"
              style={{ 
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {contentTemplate.contentSubject || "-"}
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Body</span>
            </div>
            <div 
              className="bg-white border border-gray-300 rounded p-4 min-h-[300px]"
              style={{
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: contentTemplate.contentBody || "-" 
                }}
                style={{
                  wordBreak: 'break-word'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Criteria Tab
  const renderCriteriaTab = () => {
    if (!dataCriteria || dataCriteria.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No criteria data available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {dataCriteria.map((criteria, index) => (
          <div key={criteria.id || index} className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-3 text-gray-700">
              Criteria {index + 1}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {criteria.customer && (
                <DetailText label="Customer">{criteria.customer}</DetailText>
              )}
              {criteria.budget && (
                <DetailText label="Budget">{criteria.budget}</DetailText>
              )}
              {criteria.province && (
                <DetailText label="Province">{criteria.province}</DetailText>
              )}
              {criteria.city && (
                <DetailText label="City">{criteria.city}</DetailText>
              )}
              {criteria.district && (
                <DetailText label="District">{criteria.district}</DetailText>
              )}
              {criteria.subDistrict && (
                <DetailText label="Sub District">{criteria.subDistrict}</DetailText>
              )}
              {criteria.area && (
                <DetailText label="Area">{criteria.area}</DetailText>
              )}
              {criteria.sor && (
                <DetailText label="SOR">{criteria.sor}</DetailText>
              )}
              {criteria.industrialSector && (
                <DetailText label="Industrial Sector">{criteria.industrialSector}</DetailText>
              )}
              {criteria.product && (
                <DetailText label="Product">{criteria.product}</DetailText>
              )}
              {criteria.gsizes && (
                <DetailText label="G-Sizes">{criteria.gsizes}</DetailText>
              )}
              {criteria.customerSegment && (
                <DetailText label="Customer Segment">{criteria.customerSegment}</DetailText>
              )}
              {criteria.accountGroupType && (
                <DetailText label="Account Group Type">{criteria.accountGroupType}</DetailText>
              )}
              {criteria.accountClass && (
                <DetailText label="Account Class">{criteria.accountClass}</DetailText>
              )}
              {criteria.accountCategory && (
                <DetailText label="Account Category">{criteria.accountCategory}</DetailText>
              )}
              {criteria.serviceType && (
                <DetailText label="Service Type">{criteria.serviceType}</DetailText>
              )}
              {criteria.startDate && (
                <DetailText label="Start Date">
                  {moment(criteria.startDate).format(dateFormatting.date)}
                </DetailText>
              )}
              {criteria.endDate && (
                <DetailText label="End Date">
                  {moment(criteria.endDate).format(dateFormatting.date)}
                </DetailText>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Container 1: Content Setup Information */}
      <BaseContainer header={"Content Setup Information"}>
        <div className="grid grid-cols-3 gap-4">
          <DetailText label="Name">
            {contentTemplate.templateName || "-"}
          </DetailText>
          <DetailText label="Format">
            {contentTemplate.formatType || "-"}
          </DetailText>
          <DetailText label="Category">
            {contentTemplate.category || "-"}
          </DetailText>
          <DetailText label="Media">
            {contentTemplate.mediaChannel || "-"}
          </DetailText>
          <DetailText label="Start Date">
            {contentTemplate.startDate
              ? moment(contentTemplate.startDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="End Date">
            {contentTemplate.endDate
              ? moment(contentTemplate.endDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="Status">
            {labelStatus(contentTemplate.status)}
          </DetailText>
          <DetailText label="Status Approval">
            {labelStatus(contentTemplate.statusApproval)}
          </DetailText>
          <div className="col-span-3">
            <DetailText label="Criteria">
              {dataCriteria && dataCriteria.length > 0
                ? dataCriteria
                    .map((item) => {
                      const parts = [];
                      if (item.customerSegment) parts.push(item.customerSegment);
                      if (item.accountGroupType) parts.push(item.accountGroupType);
                      return parts.join(", ");
                    })
                    .filter(Boolean)
                    .join("; ") || "All Criteria"
                : "All Criteria"}
            </DetailText>
          </div>
          <div className="col-span-3">
            <DetailText label="Description">
              {contentTemplate.description || "-"}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      {/* Container 2: Content Detail Information with Tabs */}
      <BaseContainer
        header={"Content Detail Information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPages}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Content" && renderContentTab()}
        {valuePage === "Criteria" && renderCriteriaTab()}
      </BaseContainer>

      {/* Container 3: History Log Information */}
      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">
            {dataHistory.recordId || "-"}
          </DetailText>
          <DetailText label="Created Date">
            {dataHistory.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Created By">
            {dataHistory.createdBy || "-"}
          </DetailText>
          <DetailText label="Updated Date">
            {dataHistory.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Updated By">
            {dataHistory.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>

      <style jsx>{`
        :global(.prose) {
          max-width: none;
        }
        :global(.prose p) {
          margin: 0.5em 0;
        }
        :global(.prose ul) {
          list-style: disc;
          padding-left: 2em;
          margin: 0.5em 0;
        }
        :global(.prose ol) {
          list-style: decimal;
          padding-left: 2em;
          margin: 0.5em 0;
        }
        :global(.prose li) {
          margin: 0.25em 0;
        }
        :global(.prose a) {
          color: #1890ff;
          text-decoration: underline;
        }
        :global(.prose strong) {
          font-weight: bold;
        }
        :global(.prose em) {
          font-style: italic;
        }
        :global(.prose u) {
          text-decoration: underline;
        }
        :global(.prose s) {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default ContentDetailSection;