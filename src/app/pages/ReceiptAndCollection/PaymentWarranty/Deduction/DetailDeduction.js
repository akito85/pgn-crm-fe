import React from "react";
import DetailText from "../../../../../components/DetailText";
import GridLayout from "../../../../../components/GridLayout";

const DetailDeduction = ({ data_detail }) => {
  return (
      <GridLayout cols={3} gap={4}>
        <DetailText label={"Deduction Period"}>
          {data_detail?.deductionPeriod || ""}
        </DetailText>

        <DetailText label={"Type"}>
          {data_detail?.type || ""}
        </DetailText>

        <DetailText label={"Deduction Date"}>
          {data_detail?.deductionDate || ""}
        </DetailText>

        <DetailText label={"Description"}>
          {data_detail?.description || ""}
        </DetailText>
      </GridLayout>
  );
};

export default DetailDeduction;
