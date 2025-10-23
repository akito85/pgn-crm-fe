import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import { Spin, Input, Form, Alert, Popover, Checkbox, Tooltip } from "antd";
import CardComponent from "../../../../../../components/Card/CardComponent";

const RelationshipDetail = (props) => {
  const { data_detail } = props;
  // const { data_detail, loading} = useSelector(
  //   (state) => state.tos
  // );
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState();

  // const dispatch = useDispatch()

  useEffect(() => {
    if (data_detail) {
      setData(data_detail);
    }
  }, [data_detail]);

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <CardComponent header={"RELATIONSHIP INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Object Table">{data?.objectTable}</DetailText>
          <DetailText label="Object Id">{data?.objectId}</DetailText>
          <DetailText label="Relation Code">{data?.relationCode}</DetailText>
          <DetailText label="Direction Flag">{data?.directionFlag}</DetailText>
        </div>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-5">
          <DetailText label="Created Date">{data?.createdDate}</DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Updated Date">{data?.updatedDate}</DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
    // </Spin>
  );
};
export default RelationshipDetail;
