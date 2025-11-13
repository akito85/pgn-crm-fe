import { Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import TableCriteriaDetail from "../Table/TableCriteriaDetail";

const Criteria = ({ apiHeader, data = [] }) => {
  const { loading } = useSelector((state) => state.pricingRule);

  const criteria = apiHeader?.rpricingRuleCriterias?.map(
    (item) => item.criteria
  );

  return (
    <Spin spinning={loading}>
      <div className="w-full">
        <TableCriteriaDetail
          type={"detail"}
          dataCriteria={criteria}
          listCriteria={data}
        />
      </div>
    </Spin>
  );
};

export default Criteria;
