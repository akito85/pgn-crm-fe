import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const DetailPaymentChannel = ({ data_detail, data_req }) => {


  return (
    <div>
      {data_req?.isValidated &&
        data_req?.approvalType &&
        data_req?.approvalType === "INACTIVE_PAYMENT_CHANNEL" ? (
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">
                INACTIVE REQUEST INFORMATION
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-5 w-full gap-4">
            <DetailText label={"Requested Date"}>
              {data_req?.requestedDate
                ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_req?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"}>{data_req?.remarks}</DetailText>
          </div>
        </CardContainer>
      ) : null}
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              DELIVERY CHANNEL INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label="Delivery Channel Code">
            {data_detail?.ciCode}
          </DetailText>
          <DetailText label="Name">
            {data_detail?.name}
          </DetailText>
          <DetailText label="Category">
            {data_detail?.category}
          </DetailText>

          <DetailText label="Eff Start Date">
            {moment(data_detail?.effStartDate).format(dateFormatting.date)}
          </DetailText>
          <DetailText label="Eff End Date">
            {data_detail?.effEndDate
              ? moment(data_detail?.effEndDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">
            {data_detail?.status}
          </DetailText>
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] text-primary">
              HISTORY LOG INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-4">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate !== null
              ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : ""}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default DetailPaymentChannel;
