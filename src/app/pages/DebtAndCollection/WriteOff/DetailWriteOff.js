import moment from "moment";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";

const DetailWriteOff = ({ data_detail }) => {
  return (
    <div>
      <BaseContainer header={"WRITE OFF INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label={"Write Off Period"}>
            {data_detail?.writeOffPeriod}
          </DetailText>

          <DetailText label={"Type"}>
            {data_detail?.type}
          </DetailText>

          <DetailText label={"Write Off Date"}>
            {data_detail?.writeOffDate}
          </DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {data_detail?.createdDate ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-"}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy || "-"}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy || "-"}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};

export default DetailWriteOff;
