import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import moment from "moment";
import PDIProductDetail from "../../../../ProductAndPromo/Product/ProductDetail/SectionProductDetail/PDIProductDetail";
import { dateFormatting } from "../../../../../../utils";

const DistributionMediaDetail = ({ data_detail = {} }) => {
  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.date);
    } else {
      return "";
    }
  };

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <CardComponent header={"DISTRIBUTION MEDIA INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Start Date">
            {renderDate(data_detail?.startDate)}
          </DetailText>
          <DetailText label="End Date">
            {renderDate(data_detail?.endDate)}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <div className="col-span-3">
            <DetailText label="Remark">{data_detail?.remark}</DetailText>
          </div>
        </div>
      </CardComponent>
      <CardComponent header={"PRODUCT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Product Name">
            {data_detail?.productName}
          </DetailText>
          <DetailText label="Price Code">{data_detail?.priceCode}</DetailText>
          <DetailText label="Description">
            {data_detail?.description}
          </DetailText>
        </div>
      </CardComponent>

      <div className="text-primary text-xs font-semibold uppercase pb-[30px]">
        PRODUCT DETAIL
      </div>

      <div className="w-full mb-5">
        <PDIProductDetail data={data_detail?.detail} />
      </div>

      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{data_detail?.id}</DetailText>
          <DetailText label="Created Date">
            {moment(data_detail?.createdDate).format(dateFormatting.dateTime)}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {renderDate(data_detail?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
    // </Spin>
  );
};
export default DistributionMediaDetail;
