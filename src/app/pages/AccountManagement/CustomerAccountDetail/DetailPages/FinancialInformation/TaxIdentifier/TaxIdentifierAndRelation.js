import React, { useEffect, useRef } from "react";
import { Spin } from "antd";
import { Fragment } from "react";
import TaxIdentifier from "./TaxIdentifierHeader/TaxIdentifier";
import { useSelector } from "react-redux";
import TaxRelationView from "./TaxRelation/TaxRelationView";

const TaxIdentifierAndRelation = ({ access, id = 0 }) => {
  const { loading } = useSelector((state) => state.financialInformation);

  return (
    <Fragment>
      <Spin spinning={loading}>
        <div className="mt-5">
          <TaxIdentifier access={access} id={id} />
          <TaxRelationView access={access} id={id} />
        </div>
      </Spin>
    </Fragment>
  );
};

export default TaxIdentifierAndRelation;
