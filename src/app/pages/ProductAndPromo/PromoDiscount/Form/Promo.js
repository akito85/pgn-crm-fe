import React, { useState } from "react";
import { Form, Select } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import moment from "moment";
import SelectComponent from "../../../../../components/SelectComponent";
import RadioTabs from "../../../../../components/RadioTabs";
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
} from "../../../../../redux/slices/product_promo/promoSlice";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { formMessageRequired, requiredMessage } from "../../../../../utils";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "./ConditionsPromo";

const Promo = ({
  type,
  criteriaOptionsFix = [],
  promoTypeOptions = [],
  promoCategoryOptions = [],
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
  const [tabPagesDetail, setTabPagesDetail] = useState([
    { value: "Criteria" },
    { value: "Conditions" },
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
    <div>
      <BaseContainer header={"Promo Information"}>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item
            label={"Promo Name"}
            name={"name"}
            rules={formMessageRequired("Promo Name")}
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
          >
            <DateComponent
              dateDisable={handleDisableEndDate}
              onChange={(e) => handleEndDate(e)}
            />
          </Form.Item>
          <Form.Item
            label={"Category"}
            name={"promoCategory"}
            className={"w-full"}
            rules={formMessageRequired("Category")}
          >
            <SelectComponent
              disabled={status === "ACTIVE" && type === "update"}
            >
              {(promoCategoryOptions || [])?.map((data, index) => (
                <Select.Option value={data.id} key={index}>
                  {data.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Promo Type"}
            name={"promoType"}
            className={"w-full"}
            rules={formMessageRequired("Promo Type")}
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
        </div>
        <div className={"w-full mt-2"}>
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

        <div className="w-full mt-2">
          <Form.Item
            label={"Description"}
            name={"description"}
            className={"w-full"}
          >
            <InputComponent type="textarea" />
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer
        header={"promo detail information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPagesDetail}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
        }
      >
        <div className={`${valuePage !== "Criteria" ? "hidden" : ""}`}>
          <FunctionalCriteriaProduct
            type={type}
            data={listDataCriteria || []} //data
            dataCriteria={criteriaValues || []} //ddl
            updateData={setListDataCriteria}
            setStoredData={setStoredDataInline}
            storedData={storedDataInline}
            startDate={startDate}
            selector="promo"
            getApi={{
              getBudgetList,
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
            ]}
            endDate={endDate}
          />
        </div>
        <div className={`${valuePage !== "Conditions" ? "hidden" : ""}`}>
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
        </div>
      </BaseContainer>
    </div>
  );
};

export default Promo;
