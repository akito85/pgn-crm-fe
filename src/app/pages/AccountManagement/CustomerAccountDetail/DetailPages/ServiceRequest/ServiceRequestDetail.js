import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import { Spin, Input, Form, Alert, Popover, Checkbox, Tooltip } from "antd";
import CardComponent from "../../../../../../components/Card/CardComponent";

const ServiceRequestDetail = (props) => {
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
    if (data_detail && data_detail.srId) {
      setData(data_detail);
    }
  }, [data_detail]);

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <CardComponent header={"CUSTOMER MANAGEMENT INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Service Request Id">{data?.srId}</DetailText>
          <DetailText label="Service Request Type">{data?.srType}</DetailText>
          <DetailText label="Category">{data?.category}</DetailText>
          <DetailText label="Status">{data?.status}</DetailText>
          <DetailText label="Description">{data?.description}</DetailText>
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
export default ServiceRequestDetail;
