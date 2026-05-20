import React from "react";
import CardContainer from "../../../../../../components/CardContainer";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const GLAccountSection = ({ dataDetailGLAccount = {}, dataHistory = {} }) => {
  return (
    <div className="-mt-6">
      {/* GL Account Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">GL ACCOUNT INFORMATION</p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
          <DetailText label={"GL Account Number"}>
            {dataDetailGLAccount?.glAccount || " "}
          </DetailText>
          <DetailText label={"GL Account Description"}>
            {dataDetailGLAccount?.glAccountDesc || " "}
          </DetailText>
          <DetailText label={"Description"}>
            {dataDetailGLAccount?.remark || " "}
          </DetailText>
        </div>
      </CardContainer>

      {/* History Log Information */}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">HISTORY LOG INFORMATION</p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2">
          <DetailText label={"Record ID"}>
            {dataHistory?.recordId || " "}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : " "}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataHistory?.createdBy || " "}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : " "}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataHistory?.updatedBy || " "}
          </DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default GLAccountSection;