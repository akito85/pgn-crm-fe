import React, { useEffect, useState } from "react";
import { Empty, Form, Select } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import moment from "moment";
import SelectComponent from "../../../../../components/SelectComponent";
import NxTabs from "../../../../../components/Nx/NxTabs";
import {
  getAccountCategoryList,
  getBudgetList,
  getCostCenterList,
  getCustomerList,
  getCustomerSegmentList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getServiceTypeList,
  getSorList,
  getCityList,
  getSubDistrictList,
  getAccountGroupList,
  getDistrictList,
  getConditionName,
  getConditionOperator,
  getConditionType,
  getAdjustmentTypeList,
  getFromItemList,
  getTieringList,
  getUomList,
  getProductList,
  getCountryList,
  getProductVersionList,
} from "../../../../../redux/slices/product_promo/promoSlice";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { formMessageRequired, requiredMessage } from "../../../../../utils";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "./ConditionsPromo";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";

const Promo = ({
  type,
  criteriaOptionsFix = [],
  promoTypeOptions = [],
  promotionTypeOptions = [],
  handleSelectCriteria,
  handleDeselectCriteria,
  handleClearCriteria,
  handleStartDate,
  startDate,
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  storedDataInline,
  setStoredDataInline,
  listDataCondition,
  setListDataCondition,
  status,
  statusApproval,
  endDate,
  handleEndDate = () => {},
}) => {
  // State
  const [valuePage, setValuePage] = useState("Criteria");
  const [tabPagesDetail] = useState([
    { key: "Criteria", label: "Criteria" },
    { key: "Conditions", label: "Conditions" },
  ]);

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledDate = (current) => {
    return false;
  };

  return (
    <>
      <NxCardContainer header={"Promo Information"}>
        <NxBaseContainer border>
          <div className="w-full grid grid-cols-3 gap-4">
            <Form.Item
              label={"Promo Name"}
              name={"name"}
              rules={formMessageRequired("Promo Name")}
              className="no-margin-form"
            >
              <InputComponent
              maxLength={100}
                disabled={status === "ACTIVE" && type === "update"}
              />
            </Form.Item>
            <Form.Item
              label={"Start Date"}
              name={"startDate"}
              rules={formMessageRequired("Start Date")}
              className="no-margin-form"
            >
              <DateComponent
                disabled={
                  (status === "ACTIVE" && type === "update") ||
                  listDataCriteria?.length > 0 ||
                  storedDataInline
                }
                dateDisable={disabledDate}
                onChange={(e) => handleStartDate(e)}
              />
            </Form.Item>
            <Form.Item
              label={"End Date"}
              name={"endDate"}
              rules={[
                {
                  validator: (_, value) =>
                    (value && moment(startDate) <= moment(value)) || !value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "The end date must be greater than or equal to the start date!"
                          )
                        ),
                },
                // { message: requiredMessage("End Date"), required: true },
              ]}
              className="no-margin-form"
            >
              <DateComponent
                dateDisable={handleDisableEndDate}
                onChange={(e) => handleEndDate(e)}
              />
            </Form.Item>
            <Form.Item
              label={"Type"}
              name={"promoType"}
              className={"w-full no-margin-form"}
              rules={formMessageRequired("Type")}
            >
              <SelectComponent
                disabled={status === "ACTIVE" && type === "update"}
              >
                {(promoTypeOptions || [])?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label={"Promotion Type"}
              name={"promotionType"}
              className={"w-full no-margin-form"}
              rules={formMessageRequired("Promotion Type")}
            >
              <SelectComponent
                disabled={status === "ACTIVE" && type === "update"}
              >
                {(promotionTypeOptions || [])?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>
          <div className={"w-full"}>
            <Form.Item
              name={"criteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
              className={"w-full no-margin-form"}
              label={"Criteria"}
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
                disabled={status === "ACTIVE" && type === "update"}
              >
                {(criteriaOptionsFix || [])?.map((data, index) => (
                  <Select.Option key={index} value={data.value}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              label={"Description"}
              name={"description"}
              className={"w-full"}
            >
              <InputComponent type="textarea" />
            </Form.Item>
          </div>
        </NxBaseContainer>
      </NxCardContainer>

      <NxCardContainer
        header={"Promo Detail"}
        type={"tabs"}
        withoutPadding
      >
        <NxTabs
          items={tabPagesDetail}
          activeKey={valuePage}
          onChange={setValuePage}
        />
        <div className="p-4">
          <NxBaseContainer border>
            {valuePage == "Criteria" ? (
              criteriaValues.length
               ? (
                <FunctionalCriteriaProduct
                  type={type}
                  data={listDataCriteria || []} //data
                  dataCriteria={criteriaValues || []} //ddl
                  updateData={(updater) => {
                    setListDataCriteria((prev) => {
                      const next = typeof updater === "function" ? updater(prev) : updater;
                      return next.map((row) =>
                        row.status === undefined ? { ...row, status: "DRAFT" } : row
                      );
                    });
                  }}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                  startDate={startDate}
                  selector="promo"
                  idTable="promo-form-criteria-table"
                  getApi={{
                    getBudgetList,
                    getCountryList,
                    getProvinceList,
                    getIndustrialSectorList,
                    getAccountCategoryList,
                    getServiceTypeList,
                    getSorList,
                    getCostCenterList,
                    getGsizesList,
                    getCustomerSegmentList,
                    getCustomerList,
                    getCityList,
                    getSubDistrictList,
                    getAccountGroupList,
                    getDistrictList,
                    getAdjustmentTypeList,
                    getUomList,
                    getFromItemList,
                    getTieringList,
                    getProductList,
                    getProductVersionList,
                  }}
                  columnsTable={columnsTableCriteriaPromo}
                  fixedColumn={[
                    "ADJUSTMENT TYPE",
                    "ADJUSTMENT VALUE",
                    "UOM",
                    "DESCRIPTION",
                    "MAX VALUE UOM",
                    "FROM ITEM",
                    "TIERING",
                    "STATUS",
                  ]}
                  endDate={endDate}
                  showInactivate={type !== "detail" && type !== "preview"}
                />
              )
               : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select at least one criteria" />
            ) : valuePage == "Conditions" ? (
              <ConditionPromo
                type={type}
                header={"Promo"}
                data={listDataCondition || []}
                updateData={setListDataCondition}
                status={status}
                statusApproval={statusApproval}
                selector="promo"
                getApi={{
                  getConditionName,
                  getConditionOperator,
                  getConditionType,
                }}
                setStoredData={setStoredDataInline}
                storedData={storedDataInline}
              />
            ): <></>}
          </NxBaseContainer>
        </div>
      </NxCardContainer>
    </>
  );
};

export default Promo;
