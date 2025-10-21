import React from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import InvoiceTemplateInfo from "../Utils/InvoiceTemplateInfo";
import FunctionalCriteriaInvoiceTemplate from "../Form/FunctionalCriteriaInvoiceTemplate";

const DetailSection = ({
  dataInvoice,
  dataHistory = {},
  criteriaValues = [],
  dataCriteria = [],
}) => {
  return (
    <div>
      <BaseContainer header={"Invoice Template Information"}>
        <InvoiceTemplateInfo data={dataInvoice} preview="detail" />
      </BaseContainer>

      <BaseContainer header={"Criteria Information"}>
        <FunctionalCriteriaInvoiceTemplate
          data={dataCriteria}
          dataCriteria={criteriaValues}
          type={"show"}
          showAction={"show"}
        />
      </BaseContainer>

      <BaseContainer header={"history log information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">{dataHistory?.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};

export default DetailSection;
