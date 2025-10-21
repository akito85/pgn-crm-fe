import { Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCriteriaDetail from "../Table/TableCriteriaDetail";
import { getHeaderPricingRule } from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";

const Criteria = ({ apiHeader, data = [] }) => {
  const { loading } = useSelector((state) => state.pricingRule);

  const criteria = apiHeader?.rpricingRuleCriterias?.map(
    (item) => item.criteria,
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
