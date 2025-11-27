import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from "antd";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { CloseOutlined, PauseCircleOutlined, PlayCircleOutlined, LockOutlined, PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";

const CustomerServiceRequestDetailInfo = ({
  data = [],
  dataDetail = {},
}) => {
  // State
  const dispatch = useDispatch();

  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
    );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  
  const isLoading = loading || loadingAccount;

  //declare
  const location = useLocation();
  const id = location?.state?.id;

  useEffect(() => {
    if (id) {
      dispatch(getCustomerDetail(id));
    }
  }, [dispatch, id]);


  const log = []

  const HistoryLogDummy = {
    recordId: "491",
    createdDate: "21 Dec 2021 23:11:09",
    createdBy: "Annisa",
    updatedDate: "28 Dec 2021 23:11:09",
    updatedBy: "Annisa"
  };

  return (
    <Fragment>
      <BaseContainer header={"PAYMENT RELATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Payment Relation Information */}
          <DetailText label="Account Number">{dataDetail?.accountNumber}</DetailText>
          <DetailText label="Account Name">{dataDetail?.accountName}</DetailText>
          <DetailText label="Cost Center">{dataDetail?.priority}</DetailText>
          <DetailText label="Type">{dataDetail?.startDate}</DetailText>
          <DetailText label="Category">{dataDetail?.endDate}</DetailText>
          <DetailText label="Sub Category">{dataDetail?.status}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{dataDetail?.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          {/* History Log Information */}
          <DetailText label="Record Id">{log?.recordId || HistoryLogDummy.recordId}</DetailText>
          <DetailText label="Created Date">{log?.createdDate || HistoryLogDummy.createdDate}</DetailText>
          <DetailText label="Created By">{log?.createdBy || HistoryLogDummy.createdBy}</DetailText>
          <DetailText label="Updated Date">{log?.updatedDate || HistoryLogDummy.updatedDate}</DetailText>
          <DetailText label="Updated By">{log?.updatedBy || HistoryLogDummy.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
