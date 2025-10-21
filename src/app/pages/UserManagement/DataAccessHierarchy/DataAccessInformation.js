import React from "react";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../utils";

const DataAccessInformation = (props) => {
  const { data } = props;
  return (
    <BaseContainer header={"DATA ACCESS HIERARCHY INFORMATION"}>
      <div className={"w-full grid grid-cols-4"}>
        <DetailText label={"Hierarchy Name"}>{data?.name}</DetailText>
        <DetailText label={"Status"}>{toTitleCase(data?.status)}</DetailText>
        <DetailText label={"Start Date"}>
          {data?.startDate &&
            moment(data?.startDate).format(dateFormatting.dateCapital)}
        </DetailText>
        <DetailText label={"End Date"}>
          {data?.endDate &&
            moment(data?.endDate).format(dateFormatting.dateCapital)}
        </DetailText>
        <DetailText label={"Description"}>{data?.description}</DetailText>
      </div>
    </BaseContainer>
  );
};

export default DataAccessInformation;
