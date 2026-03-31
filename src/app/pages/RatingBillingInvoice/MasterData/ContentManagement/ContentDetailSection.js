import React from "react";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";

const ContentDetailSection = ({
  dataContentManagement,
  dataCriteria,
  criteriaList,
}) => {
  const contentTemplate = dataContentManagement?.contentTemplate || {};

  return (
    <CollapsibleContainer header={"CONTENT SETUP INFORMATION"} border={true} defaultOpen={true}>
      <div className="grid grid-cols-5 gap-4">
        <DetailText label="Name">
          {contentTemplate.templateName || "-"}
        </DetailText>
        <DetailText label="Format">
          {contentTemplate.formatType || "-"}
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
        <div className="col-span-5">
          <DetailText label="Criteria">
            {criteriaList && criteriaList.length > 0
              ? criteriaList.map((item) => item.criteriaName).join(", ")
              : dataCriteria && dataCriteria.some((item) => item.allCriteria)
                ? "All Criteria"
                : "-"}
          </DetailText>
        </div>
        <div className="col-span-5">
          <DetailText label="Description">
            {contentTemplate.description || "-"}
          </DetailText>
        </div>
      </div>
    </CollapsibleContainer>
  );
};

export default ContentDetailSection;