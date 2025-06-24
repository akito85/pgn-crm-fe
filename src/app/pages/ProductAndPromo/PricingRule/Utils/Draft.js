import React, { Fragment, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";
import RadioTabs from "../../../../../components/RadioTabs";
import Detail from "./Detail";
import Criteria from "./Criteria";

const Draft = ({ data }) => {
  // State
  const [valuePage, setValuePage] = useState("");

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Detail":
        return (
          <Detail
          // getAPI={getDetailPricingRulePaginate}
          // dataTable={data_detail?.result || []}
          // id={id}
          />
        );
      case "Criteria":
        return <Criteria apiHeader={data} data={data} />;
      default:
        return (
          <Detail
          // getAPI={getDetailPricingRulePaginate}
          // dataTable={data_detail?.result || []}
          // id={id}
          />
        );
    }
  };

  const tabPages = [{ value: "Detail" }, { value: "Criteria" }];
  return (
    <Fragment>
      <BaseContainer header={"pricing rule information"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Name">{data?.name}</DetailText>
          <DetailText label="Start Date">
            {data?.startDate
              ? moment(data.startDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="End Date">
            {data?.endDate
              ? moment(data.endDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="Status">{data?.status}</DetailText>
          <div className="col=span-2">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer
        header={"pricing rule detail"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPages}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
        }
      >
        {layout(valuePage)}
      </BaseContainer>

      <BaseContainer header={"history log information"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Created Date">
            {data?.createdDate
              ? moment(data.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
          <DetailText label="Updated Date">
            {data?.updatedDate
              ? moment(data.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default Draft;
