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
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const ModalConfirmationCreateUpdateApprovalPaymentRelationInfo = ({
  data = {},
  handleChange = () => {},
  handleChangeSize = () => {},
  totalElement = 0,
  page = 1,
  pageSize = 10,
  searchText = "",
  searchedColumn = "",
  onSort = () => {},
  getColumnSearchProps = () => {},
  searchInput,
  handleSearch
}) => {
  // State
  const [dataDetail, setDataDetail] = useState({});
  const dispatch = useDispatch();
  const [SRStatus, setSRStatus] = useState(null);

  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
    );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  
  const isLoading = loading || loadingAccount;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  useEffect(() => {
    if (id) {
      dispatch(getCustomerDetail(id));
    }
  }, [dispatch, id]);

  const InfoDummy = {
    accountNumber: "2027635461",
    accountName: "PT XYZ",
    priority: "1",
    startDate: "22 Aug 2022",
    endDate: "22 Aug 2022",
    status: "Active",
    description: "Lorem ipsum dolor sit amet consectetur. Malesuada turpis arcu morbi elit sed lorem at adipiscing imperdiet. Aliquam quis tempus feugiat amet. Viverra metus tincidunt nibh mauris nisi. At et etiam non dignissim ultricies tellus in lacus fermentum. Sollicitudin purus viverra tincidunt proin."
  };

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        PAYMENT RELATION INFORMATION
      </div>
      <div className="w-full grid grid-cols-3 gap-x-5">
        <DetailText label="Account Numbe">{InfoDummy.customerNumber}</DetailText>
        <DetailText label="Account Name">{InfoDummy.identificationType}</DetailText>
        <DetailText label="Priority">{InfoDummy.customerIdentificationNumber}</DetailText>
        <DetailText label="Start Date">{renderDate(InfoDummy.startDate)}</DetailText>
        <DetailText label="End Date">{renderDate(InfoDummy.endDate)}</DetailText>
      </div>
      <div className="w-full">
        <DetailText label="Description">{InfoDummy.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default ModalConfirmationCreateUpdateApprovalPaymentRelationInfo;
