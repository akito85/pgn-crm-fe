import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailLateCharge } from "../../../../../redux/slices/account_management/MasterData/late_charges";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { columnsTableCriteria } from "./columnTableCriteria";
import { dateFormatting, hasValue } from "../../../../../utils";
import moment from "moment";
import LateChargeTableCriteria from "./LateChargeTableCriteria";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LateChargesRuleTable from "./LateChargesRule/LateChargesRuleTable";
import { getGrantedAccessAccount } from "../../../../../redux/slices/account_management/accountManagement";

const routes = [
  {
    path: "",
    breadcrumbName: "System Setup",
  },
  {
    path: "",
    breadcrumbName: "Master Data",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_LATE_CHARGES,
    breadcrumbName: "Late Charge",
  },
  {
    path: "",
    breadcrumbName: "Detail Late Charge",
  },
];

const DetailLateCharges = () => {
  const { data_detail, loading } = useSelector((state) => state.late_charge);
  const { access_account } = useSelector((state) => state.accountManagement);
  const filteredArray = {
    actionList: access_account?.actionList?.filter(action =>
      action.path.includes("/system-setup/late-charges-rule/") &&
      !action.path.includes("/system-setup/late-charges/")
    )
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location?.state || {};
  const [dataLateCharge, setDataLateCharge] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [dataListCriteria, setDataListCriteria] = useState([]);

  useEffect(() => {
    dispatch(getGrantedAccessAccount('/system-setup/late-charges-rule'))
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(getDetailLateCharge(id));
    }
  }, [id]);

  useEffect(() => {
    if (data_detail?.lateChargeId === id) {
      const dataIndexList = columnsTableCriteria().map(
        (item) => item.dataIndex
      );
      const criteriaData = (data_detail?.lateChargeCriterias || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item) => {
          let obj = {};
          for (const attr in item) {
            if (dataIndexList.includes(attr)) {
              if (attr === 'startDate' || attr === 'endDate') {
                obj[attr] = hasValue(item[attr]) ? moment(item[attr]).format(dateFormatting.date) : null
              } else if (attr === 'description') {
                obj[attr] = hasValue(item[attr]) ? item[attr] : null;
              } else {
                obj[attr] = {
                  label: item[attr]?.name,
                  value: item[attr]?.id,
                };
              }
            } else {
              obj[attr] = hasValue(item[attr]) ? item[attr] : null;
            }
          }
          return obj;
        });

      const obj = {
        lateChargeName: data_detail.lateChargeName,
        currency: data_detail.currency.name,
        description: data_detail.description,
        status: data_detail?.status,
        criteria: (data_detail.criteria || []).map((item) => item.value),
        criteriaName: (data_detail.criteria || []).reduce(
          (prev, current, index) =>
            prev + `${index === 0 ? current.label : ", " + current.label} `,
          ""
        ),
        isRuleActive: data_detail.isRuleActive,
        createdDate: data_detail.historyLogInformation.createdDate,
        createdBy: data_detail.historyLogInformation.createdBy,
        updatedDate: data_detail.historyLogInformation.updatedDate,
        updatedBy: data_detail.historyLogInformation.updatedBy,
      };
      setDataListCriteria(criteriaData);
      setCriteriaValues(obj.criteria);
      setDataLateCharge(obj);
    }
  }, [id, data_detail]);

  return (
    <Spin spinning={loading}>
      <BreadCrumb routes={routes} />
      <div className="flex flex-col">
        <BaseContainer header={"late charge information"}>
          <div className="grid grid-cols-3 gap-2">
            <DetailText label={"Late Charge Name"}>
              {dataLateCharge.lateChargeName}
            </DetailText>
            <DetailText label={"Currency"}>
              {dataLateCharge.currency}
            </DetailText>
            <DetailText label={"Status"} classTextAdditional="capitalize">
              {dataLateCharge?.status?.charAt(0).toUpperCase() + dataLateCharge?.status?.slice(1).toLowerCase()}
            </DetailText>
            <div className="col-span-3">
              <DetailText label={"Criteria"}>
                {dataLateCharge.criteriaName}
              </DetailText>
            </div>
            <div className="col-span-3">
              <DetailText label={"Description"}>
                {dataLateCharge.description}
              </DetailText>
            </div>
          </div>
        </BaseContainer>
        <BaseContainer header={"late charge criteria"}>
          <LateChargeTableCriteria
            type={"detail"}
            data={dataListCriteria}
            dataCriteria={criteriaValues}
            updateData={setDataListCriteria}
            dispatch={dispatch}
          />
        </BaseContainer>
        <BaseContainer header={"history log information"}>
          <div className="grid grid-cols-5 w-full">
            <DetailText label={'Record ID'}>{data_detail?.lateChargeId}</DetailText>
            <DetailText label={"Created Date"}>
              {dataLateCharge.createdDate}
            </DetailText>
            <DetailText label={"Created By"}>
              {dataLateCharge.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {dataLateCharge.updatedDate}
            </DetailText>
            <DetailText label={"Updated By"}>
              {dataLateCharge.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>
        {
          Array?.isArray(access_account?.actionList) &&
          <BaseContainer header={"late charge rule"}>
            <LateChargesRuleTable
              id={id}
              isRuleActive={dataLateCharge.isRuleActive}
              access={filteredArray}
            />
          </BaseContainer>
        }
      </div>
      <div className={`flex w-full align-middle my-3`}>
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_LATE_CHARGES)}
          icon={
            <LeftOutlined
              style={{
                color: "#fff",
                fontSize: 24,
                justifyItems: "center",
              }}
            />
          }
        >
          Back
        </ButtonComponent>
      </div>
    </Spin>
  );
};

export default DetailLateCharges;
