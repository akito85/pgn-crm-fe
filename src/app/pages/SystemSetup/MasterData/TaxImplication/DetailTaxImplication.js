import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LeftOutlined } from '@ant-design/icons';

import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import BreadCrumb from "../../../../../components/BreadCrumb";
import DetailText from '../../../../../components/DetailText';
import BaseContainer from '../../../../../components/BaseContainer';
import ButtonComponent from '../../../../../components/ButtonComponent';
import TaxImplicationTableCriteria from './TaxImplicationTableCriteria'
import TaxImplicationRuleTable from './TaxImplicationRule/TaxImplicationRuleTable'
import { columnsTableCriteria } from "./columnTableCriteria";
import { getDetailTaxImplication } from '../../../../../redux/slices/account_management/MasterData/tax_implication';
import { dateFormatting, hasValue } from '../../../../../utils';
import moment from 'moment';
import { getGrantedAccessAccount } from '../../../../../redux/slices/account_management/accountManagement';

// Routes
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
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_TAX_IMPLICATION,
    breadcrumbName: "Tax Implication",
  },
  {
    path: "",
    breadcrumbName: "Detail Tax Implication",
  },
];

const DetailTaxImplication = () => {
  const { data_detail, loading } = useSelector((state) => state.tax_implication);
  const { access_account } = useSelector((state) => state.accountManagement);
  const filteredArray = {
    actionList: access_account?.actionList?.filter(action =>
      action.path.includes("/system-setup/tax-implication-rule/") &&
      !action.path.includes("/system-setup/tax-implication/")
    )
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location?.state || {};
  const [dataTaxImplication, setDataTaxImplication] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [dataListCriteria, setDataListCriteria] = useState([]);
  // console.log(id, "id");
  
  useEffect(() => {
    dispatch(getGrantedAccessAccount('/system-setup/tax-implication-rule'))
  }, [dispatch])

  // Fetch Data Detail
  useEffect(() => {
    if (id) {
      dispatch(getDetailTaxImplication(id));
    }
  }, [id]);

  useEffect(() => {
    if (data_detail?.taxImplicationId === id) {
      const dataIndexList = columnsTableCriteria().map(
        (item) => item.dataIndex
      );
      const criteriaData = (data_detail?.taxImplicationCriterias || [])
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
        taxImplicationName: data_detail?.name,
        category: data_detail?.category.name,
        serviceType: data_detail?.serviceType.name,
        description: data_detail?.description,
        status: data_detail?.status,
        criteria: (data_detail?.criteria || []).map((item) => item.value),
        criteriaName: (data_detail?.criteria || []).reduce(
          (prev, current, index) =>
            prev + `${index === 0 ? current.label : ", " + current.label} `,
          ""
        ),
        isRuleActive: data_detail?.isRuleActive,
        createdDate: data_detail?.historyLog.createdDate,
        createdBy: data_detail?.historyLog.createdBy,
        updatedDate: data_detail?.historyLog.updatedDate,
        updatedBy: data_detail?.historyLog.updatedBy,
      };
      setDataListCriteria(criteriaData);
      setCriteriaValues(obj.criteria);
      setDataTaxImplication(obj);
    }
  }, [id, data_detail]);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col">

          {/* TAX IMPLICATION INFORMATION */}
          <BaseContainer header={"tax implication information"}>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Tax Implication Name"}>
                {dataTaxImplication?.taxImplicationName}
              </DetailText>
              <DetailText label={"Category"}>
                {dataTaxImplication?.category}
              </DetailText>
              <DetailText label={"Service Type"}>
                {dataTaxImplication?.serviceType}
              </DetailText>
              <DetailText label={"Status"}>
                {dataTaxImplication?.status?.charAt(0).toUpperCase() + dataTaxImplication?.status?.slice(1).toLowerCase()}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Criteria"}>
                  {dataTaxImplication?.criteriaName}
                </DetailText>
              </div>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataTaxImplication?.description}
                </DetailText>
              </div>
            </div>
          </BaseContainer>

          {/* TAX IMPLICATION TABLE CRITERIA */}
          <BaseContainer header={'tax implication criteria'}>
            <TaxImplicationTableCriteria
              type={"detail"}
              data={dataListCriteria}
              dataCriteria={criteriaValues}
              updateData={setDataListCriteria}
              dispatch={dispatch}
            />
          </BaseContainer>

          {/* HISTORY LOG INFORMATION */}
          <BaseContainer header={"history log information"}>
            <div className="grid grid-cols-5 w-full">
              <DetailText label={'Record ID'}>{data_detail?.taxImplicationId}</DetailText>
              <DetailText label={"Created Date"}>
                {dataTaxImplication.createdDate ? moment(dataTaxImplication.createdDate).format(dateFormatting.dateTime) : ''}
              </DetailText>
              <DetailText label={"Created By"}>
                {dataTaxImplication.createdBy}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {dataTaxImplication.updatedDate ? moment(dataTaxImplication.updatedDate).format(dateFormatting.dateTime) : ''}
              </DetailText>
              <DetailText label={"Updated By"}>
                {dataTaxImplication.updatedBy}
              </DetailText>
            </div>
          </BaseContainer>

          {/* TAX IMPLICATION RULE TABLE */}
          {Array?.isArray(access_account?.actionList) &&
            <BaseContainer header={'tax implication rule'}>
              <TaxImplicationRuleTable
                id={id}
                isRuleActive={dataTaxImplication.isRuleActive}
                access={filteredArray}
              />
            </BaseContainer>

          }

        </div>

        <div className={`flex w-full align-middle my-6`}>
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_TAX_IMPLICATION)}
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
    </>
  )
}

export default DetailTaxImplication
