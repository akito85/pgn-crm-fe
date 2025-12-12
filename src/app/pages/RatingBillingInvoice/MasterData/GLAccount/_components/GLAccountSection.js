import React from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const GLAccountSection = ({ dataDetailGLAccount = {}, dataHistory = {} }) => {
  return (
    <>
      {/* GL Account Information */}
      <BaseContainer header={"GL Account Information"}>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex w-full gap-3 justify-between">
            <DetailText label={"GL Account Number"}>
              {dataDetailGLAccount?.glAccount || "-"}
            </DetailText>

            <DetailText label={"GL Account Description"}>
              {dataDetailGLAccount?.glAccountDesc || "-"}
            </DetailText>

            <DetailText label={"Special GL"}>
              {dataDetailGLAccount?.specialGlName || "-"}
            </DetailText>
          </div>

          <div className="flex w-full gap-3">
            <DetailText label={"Reference"}>
              {dataDetailGLAccount?.reference || "-"}
            </DetailText>

            <DetailText label={"Status"}>
              {dataDetailGLAccount?.status || "-"}
            </DetailText>

            <DetailText label={"Status Approval"}>
              {dataDetailGLAccount?.statusApproval || "-"}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
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

export default GLAccountSection;
