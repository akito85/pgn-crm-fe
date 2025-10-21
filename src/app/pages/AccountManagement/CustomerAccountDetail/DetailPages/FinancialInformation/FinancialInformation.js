import React, { useEffect, useRef } from "react";
import {
  DownloadOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  EditOutlined,
  WarningOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  CheckSquareFilled,
} from "@ant-design/icons";
import { Collapse, Space } from "antd";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { Fragment } from "react";
import MiniBaseContainer from "../../../../../../components/MiniBaseContainer";
import HeaderDetail from "../../HeaderDetail";
import WitholdingTax from "./WitholdingTax/WitholdingTax";
import PaymentChannel from "./Payment Channel/PaymentChannel";
import TaxIdentifierAndRelation from "./TaxIdentifier/TaxIdentifierAndRelation";
import AccountingRule from "./AccountingRule/AccountingRule";
import TaxImplication from "./TaxImplication/TaxImplication";
import BillingBucket from "./BillingBucket/BillingBucket";
import useGrantAccessHooks from "../../../../../../components/useGrantAccessHooks";
import { useDispatch, useSelector } from "react-redux";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";

const { Panel } = Collapse;

const FinancialInformation = ({ id = 0 }) => {
  //   // const dispatch = useDispatch();
  //   const { data, data_detail, loading } = useSelector((state) => state.tos);
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState();
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const location = useLocation();

  const { access_account } = useSelector((state) => state.accountManagement);

  // Use Effect
  useEffect(() => {
    if (location?.pathname.includes("account-standard")) {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-standard/financial-information",
        ),
      );
    } else {
      dispatch(
        getGrantedAccessAccount(
          "/account-management/account-onetime/financial-information",
        ),
      );
    }
  }, [dispatch]);

  const financialList = [
    // {
    //   header: "Insurance",
    //   children: <p>Insurance</p>,
    // },
    {
      header: "Payment Channel",
      children: <PaymentChannel access={access_account} id={id} />,
    },
    {
      header: "Tax Identifier",
      children: <TaxIdentifierAndRelation access={access_account} id={id} />,
    },
    {
      header: "Witholding tax",
      children: <WitholdingTax access={access_account} id={id} />,
    },
    {
      header: "Accounting Rule",
      children: <AccountingRule id={id} />,
    },
    // {
    //   header: "Payment Relation",
    //   children: <p>Payment Relation</p>,
    // },
    {
      header: "Billing Bucket",
      children: <BillingBucket id={id} />,
    },
    {
      header: "Tax Implication",
      children: <TaxImplication id={id} />,
    },
  ];

  // useEffect(() => {
  //   dispatch(getAllTosPaginate({ page, pageSize }));
  // }, [dispatch, page, pageSize]);
  // const handleDetail = (id) => {
  //   setModalDetail(true);
  //   dispatch(getTosDetail(id));
  // };

  //   const handleOk = () => {
  //     dispatch(inactiveMenu(id))
  //     dispatch(getAllTosNewsPaginate({page, pageSize}))
  //     setModalInactive(false);
  // };

  const handleCollapse = (e, index) => {
    if (index !== current) {
      setCurrent(index);
    } else {
      setCurrent(undefined);
    }
  };

  return (
    <Fragment>
      <MiniBaseContainer>
        {/* template collapse */}
        <Space direction="vertical" style={{ width: "100%" }}>
          {financialList.map((elm, index) => (
            <Collapse
              key={index}
              activeKey={index === current ? [0] : undefined}
              onChange={(e) => handleCollapse(e, index)}
              style={{ borderRadius: "8px", backgroundColor: "#E6F1F9" }}
            >
              <Collapse.Panel header={elm.header}>
                {elm.children}
              </Collapse.Panel>
            </Collapse>
          ))}
        </Space>
      </MiniBaseContainer>
    </Fragment>
  );
};

export default FinancialInformation;
