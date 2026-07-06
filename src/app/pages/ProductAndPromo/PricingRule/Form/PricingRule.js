import { Form, Select } from "antd";
import React, { useState, useEffect } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getCountryList,
  getCustomerList,
  getCustomerSegmentList,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getProvinceListByCountry,
  getSelectCriteria,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
} from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import RadioTabs from "../../../../../components/RadioTabs";
import Detail from "./Detail";
import moment from "moment";
import { showModalError } from "../../../../../redux/slices/general_slice";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import { hasValue } from "../../../../../utils";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";

const PricingRule = ({
  form,
  data,
  setData,
  valueOrUnlimited,
  setValueOrUnlimited,
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  setCriteriaValues,
  type,
  status = "",
  storedData = false,
  setStoredData = () => { },
  startDate,
  setStartDate = () => { },
  endDate,
  setEndDate = () => {},
}) => {
  // Selector
  const { data_select_criteria } = useSelector((state) => state.pricingRule);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [valuePage, setValuePage] = useState("Detail");
  const [tabPagesEmployee, setTabPagesEmployee] = useState([
    { value: "Detail", paramValue: ["priceCode"] },
    { value: "Criteria" },
  ]);


  // Use Effect
  useEffect(() => {
    dispatch(getSelectCriteria());
  }, [dispatch]);

  // Handle Change Radio Tabs
  const onChange = (e) => {
    if (!storedData) {
      setValuePage(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  // Dependency Criteria
  const getCriteriaIdByCode = (code) =>
    (data_select_criteria || []).find((option) => option.code === code)?.id;

  const applySelectCriteriaCascade = (values) => {
    const countryId = getCriteriaIdByCode("COUNTRY");
    let res = [...values];
    if (res.includes(13)) {
      res.push(14);
    }
    if (res.includes(14)) {
      res.push(39);
    }
    if (res.includes(39)) {
      res.push(15);
    }
    if (res.includes(15) && hasValue(countryId)) {
      res.push(countryId);
    }
    if (res.includes(20)) {
      res.push(19);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    return outputArray;
  };

  const handleSelectCriteria = (value) => {
    const outputArray = applySelectCriteriaCascade([...criteriaValues, value]);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      rPricingRuleCriterias: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const countryId = getCriteriaIdByCode("COUNTRY");
    let res = criteriaValues.filter((item) => item !== value);
    if (hasValue(countryId) && !res.includes(countryId)) {
      res = res.filter((item) => item !== 15);
    }
    if (!res.includes(15)) {
      res = res.filter((item) => item !== 39);
    }
    if (!res.includes(39)) {
      res = res.filter((item) => item !== 14);
    }
    if (!res.includes(14)) {
      res = res.filter((item) => item !== 13);
    }
    if (!res.includes(19)) {
      res = res.filter((item) => item !== 20);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      rPricingRuleCriterias: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  // Validation Handle Start Date
  const handleStartDate = (value) => {
    form.resetFields(["endDate"])
    setStartDate(value);
    return value;
  };

  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledDate = (current) => {
    return false;
  };

  // const handleChange = (value) => {
  //   listDataCriteria?.filter((item) => item == value);
  // };

  return (
    <div className="flex flex-col gap-y-4">
      <NxCardContainer header={"pricing rule information"}>
        <div className="w-full grid grid-cols-3 gap-2">
          <Form.Item
            label={"Pricing Rule"}
            name={"name"}
            rules={[
              { required: true, message: "Please input your Pricing Rule!" },
            ]}
          >
            <InputComponent disabled={(type === "update" && status === "ACTIVE")} maxLength={100}/>
          </Form.Item>
          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[
              { required: true, message: "Please input your Start Date!" },
            ]}
            getValueFromEvent={handleStartDate}
          >
            <DateComponent
              mandatory
              dateDisable={disabledDate}
              disabled={
                (type === "update" && status === "ACTIVE")
              }
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
                      new Error("End date must before Start date")
                    ),
              },
            ]}
            getValueFromEvent={handleEndDate}
          >
            <DateComponent
              // disabled={startDate === null}
              dateDisable={handleDisableEndDate}
            />
          </Form.Item>

          <div className="col-span-3">
            <Form.Item
              label={"Criteria"}
              name={"rPricingRuleCriterias"}
              className={"w-full"}
              rules={[
                {
                  required: true,
                  message: "Please input your Criteria!",
                },
              ]}
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
              >
                {data_select_criteria &&
                  data_select_criteria?.map((data, index) => (
                    <Select.Option value={data.id} key={index}>
                      {data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>

          <div className="col-span-3">
            <Form.Item
              label={"Description"}
              name={"description"}
              className={"w-full"}
            >
              <InputComponent
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </div>
        </div>
      </NxCardContainer>

      <NxCardContainer
        header={"pricing rule detail"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPagesEmployee}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Detail" ? (
          <Detail
            setData={setData}
            data={data}
            setValueOrUnlimited={setValueOrUnlimited}
            valueOrUnlimited={valueOrUnlimited}
            type={type}
          />
        ) : (
          <>
            <FunctionalCriteriaProduct
              type={type}
              data={listDataCriteria || []} //data
              dataCriteria={criteriaValues || []} //ddl
              updateData={setListDataCriteria}
              setStoredData={setStoredData}
              storedData={storedData}
              startDate={startDate ? moment(startDate) : undefined}
              selector="pricingRule"
              idTable="pricing-rule-form-criteria-table"
              getApi={{
                getBudgetList,
                getProvinceList,
                getProvinceListByCountry,
                getCountryList,
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
              }}
              columnsTable={columnsTableCriteriaAll}
              countryCriteriaId={getCriteriaIdByCode("COUNTRY")}
              endDate={endDate}
            />
          </>
          // <Criteria
          //   type={type}
          //   listDataCriteria={listDataCriteria}
          //   criteriaValues={criteriaValues}
          //   setListDataCriteria={setListDataCriteria}
          //   storedData={storedData}
          //   setStoredData={setStoredData}
          // />
        )}
      </NxCardContainer>
    </div>
  );
};

export default PricingRule;
