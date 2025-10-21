import React from "react";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { dateFormat, hasValue, toTitleCase } from "../../../../utils";
import CardComponent from "../../../../components/Card/CardComponent";

const DetailMenuLayout = ({ data_detail }) => {
  const loopAction = (data) => {
    const dataAction = data?.map((item) => item?.name).join(", ");

    return dataAction;
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <CardComponent cols={3}>
        <DetailText label={"Menu Name"}>{data_detail?.data?.name}</DetailText>
        <DetailText label={"Type"}>{data_detail?.data?.type}</DetailText>
        <DetailText label={"Parent Menu"}>
          {hasValue(data_detail?.data?.parentName) &&
            data_detail?.data?.parentName}
        </DetailText>

        <DetailText label={"Path"}>{data_detail?.data?.path}</DetailText>
        <DetailText label={"Order"}>{data_detail?.data?.menuOrder}</DetailText>
        <DetailText label={"Action"}>
          {loopAction(data_detail?.data?.actions)}
        </DetailText>

        <DetailText label={"Status"}>
          {toTitleCase(data_detail?.data?.status)}
        </DetailText>
        <DetailText label={"Description"}>
          {data_detail?.data?.description}
        </DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label={"Record Id"}>{data_detail?.data?.menuId}</DetailText>
        <DetailText label={"Created Date"}>
          {hasValue(data_detail?.data?.createdDate) &&
            moment(data_detail?.data?.createdDate).format(
              "DD MMM YYYY HH:mm:ss",
            )}
        </DetailText>
        <DetailText label={"Created By"}>
          {data_detail?.data?.createdBy}
        </DetailText>
        <DetailText label={"Update Date"}>
          {hasValue(data_detail?.data?.updatedDate) &&
            moment(data_detail?.data?.updatedDate).format(
              "DD MMM YYYY HH:mm:ss",
            )}
        </DetailText>
        <DetailText label={"Updated By"}>
          {data_detail?.data?.updatedBy}
        </DetailText>
      </CardComponent>
    </div>
  );
};

export default DetailMenuLayout;
