import React from "react";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import CardComponent from "../../../../components/Card/CardComponent";
import { dateFormatting } from "../../../../utils";

const DetailCostCenterLayout = ({ detatilCostCenter }) => {
  console.log(detatilCostCenter, " dettati");
  return (
    <div>
      <CardComponent>
        <div className="w-full grid grid-cols-2">
          <DetailText label={"Parent"}>{detatilCostCenter?.parent}</DetailText>
          <div className="row-span-3">
            <DetailText label={"Siblings"}>
              {detatilCostCenter?.sibling?.join(", ")}
            </DetailText>
          </div>
          <DetailText label={"Cost Center"}>
            {detatilCostCenter?.costCenter}
          </DetailText>
          <DetailText label={"Description"}>
            {detatilCostCenter?.description}
          </DetailText>
        </div>
      </CardComponent>
      <CardComponent header={"history log information"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record Id"}>{detatilCostCenter?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {detatilCostCenter?.createdDate &&
              moment(detatilCostCenter?.createdDate).format(
                dateFormatting.dateTime,
              )}
          </DetailText>
          <DetailText label={"Created By"}>
            {detatilCostCenter?.createdBy}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {detatilCostCenter?.updatedDate &&
              moment(detatilCostCenter?.updatedDate).format(
                dateFormatting.dateTime,
              )}
          </DetailText>
          <DetailText label={"Updated By"}>
            {detatilCostCenter?.updatedBy}
          </DetailText>
        </div>
      </CardComponent>
    </div>
  );
};

export default DetailCostCenterLayout;
