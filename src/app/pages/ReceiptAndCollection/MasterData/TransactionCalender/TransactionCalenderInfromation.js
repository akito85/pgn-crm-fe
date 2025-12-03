import { Form, Select } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  convertToSnakeCase,
  formMessageRequired,
  hasValue,
  requiredMessage,
  toTitleCase,
} from "../../../../../utils";
import FunctionalCriteria from "../../../../../components/Criteria/FunctionalCriteria";
import { useCriteriaHooks } from "../../../../../components/Criteria/useCriteriaHooks";
import {
  getAccount,
  getAccountCategory,
  getAccountGroupType,
  getBudget,
  getCity,
  getCostCenter,
  getCustomerSegment,
  getDistrict,
  getGsize,
  getIndustrialSector,
  getProvince,
  getServiceType,
  getSor,
  getSubDistrict,
} from "../../../../../redux/slices/criteria_slice";
import { params } from "./params_ddl";

const TransactionCalenderInfromation = ({
  listDataCriteria,
  setListDataCriteria,
  criteriaValues,
  setCriteriaValues,
  type,
  data_select_criteria,
  data_time_unit,
  formValue,
  form,
  endBeginDDL,
  storedData = false,
  setStoredData = () => {},
}) => {
  const {
    stored,
    loading_criteria,
    data_province,
    data_city,
    data_district,
    data_subdistrict,
    data_cost_center,
    data_sor,
    data_gsize,
    data_serivce_type,
    data_account_category,
    data_account,
    data_account_group_type,
    data_industrial_sector,
    data_budget,
    data_customer_segment,
  } = useSelector((state) => state?.criteria_slice);
  const dispatch = useDispatch();
  const [formCriteria] = Form.useForm();
  const dataString = useMemo(
    () => endBeginDDL?.map((index) => String(index)),
    [endBeginDDL],
  );
  const { setDataIndex } = useCriteriaHooks();
  const [columnCriteria, setColumnCriteria] = useState([]);
  const [editDataRecord, setEditDataRecord] = useState({});
  const [updateDate, setUpdateDate] = useState({
    startDate: moment(),
    endDate: moment(),
  });

  console.log(formValue);

  const sorterColumnOption = useMemo(() => {
    const orderedCodes = [
      "accountSegment",
      "accountGroupType",
      "province",
      "city",
      "district",
      "subDistrict",
    ];
    if (
      hasValue(data_select_criteria) &&
      Array?.isArray(data_select_criteria)
    ) {
      const mappingOption = data_select_criteria?.map((item) => ({
        ...item,
        code: setDataIndex(item?.code),
      }));
      return [...mappingOption].sort(
        (a, b) => orderedCodes.indexOf(a.code) - orderedCodes.indexOf(b.code),
      );
    } else {
      return [];
    }
  }, [data_select_criteria, setDataIndex]);

  const disabledDate = (current) => {
    return false;
  };

  const handleDisableEndDate = (current) => {
    if (updateDate?.startDate !== null) {
      return formValue?.startDate > current;
    }
    return moment().add(-1, "days") >= current;
  };

  //dependensi kriteria
  const handleSelectCriteria = useCallback(
    (value) => {
      let res = [...criteriaValues, value];
      if (res.includes(13)) {
        res.push(14);
      }
      if (res.includes(14)) {
        res.push(39);
      }
      if (res.includes(39)) {
        res.push(15);
      }
      if (res.includes(20)) {
        res.push(19);
      }
      let outputArray = res.filter(
        (item, index) => res.indexOf(item) === index,
      );
      outputArray = outputArray.includes(24) ? [24] : outputArray;
      setCriteriaValues(outputArray);
      form.setFieldsValue({
        criteria: outputArray,
      });
    },
    [criteriaValues, form, setCriteriaValues],
  );

  const handleDeselectCriteria = useCallback(
    (value) => {
      let res = criteriaValues.filter((item) => item !== value);
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
      let outputArray = res.filter(
        (item, index) => res.indexOf(item) === index,
      );
      outputArray = outputArray.includes(24) ? [24] : outputArray;
      setCriteriaValues(outputArray);
      form.setFieldsValue({
        criteria: outputArray,
      });
    },
    [criteriaValues, form, setCriteriaValues],
  );

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  // dependecies data
  const conditionalDependendData = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "city":
        return "province";
      case "district":
        return "city";
      case "subDistrict":
        return "district";
      case "accountGroupType":
        return "customerSegment";
      default:
        return null;
    }
  }, []);

  const conditionalOption = useCallback(
    (dataIndex) => {
      switch (dataIndex) {
        case "budget":
          return data_budget?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "province":
          return data_province?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "industrialSector":
          return data_industrial_sector?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "accountCategory":
          return data_account_category?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "serviceType":
          return data_serivce_type?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "sor":
          return data_sor?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "area":
          return data_cost_center?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "customerSegment":
          return data_customer_segment?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "customer":
          return data_account?.map((item) => ({
            value: item?.Id,
            label: item?.name,
          }));
        case "city":
          return data_city?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "subDistrict":
          return data_subdistrict?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "district":
          return data_district?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));
        case "accountGroupType":
          return data_account_group_type?.map((item) => ({
            value: item?.Id,
            label: item?.text,
          }));
        case "gsizes":
          return data_gsize?.map((item) => ({
            value: item?.id,
            label: item?.text,
          }));

        default:
          return [];
      }
    },
    [
      data_account,
      data_account_category,
      data_account_group_type,
      data_budget,
      data_city,
      data_cost_center,
      data_customer_segment,
      data_district,
      data_gsize,
      data_industrial_sector,
      data_province,
      data_serivce_type,
      data_sor,
      data_subdistrict,
    ],
  );

  const conditionalDispatcher = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "budget":
        return getBudget({
          services: params?.services,
          urls: params?.getBudgetList,
        });
      case "province":
        return getProvince({
          services: params?.services,
          urls: params?.getProvinceList,
        });
      case "industrialSector":
        return getIndustrialSector({
          services: params?.services,
          urls: params?.getIndustrialSectorList,
        });
      case "accountCategory":
        return getAccountCategory({
          services: params?.services,
          urls: params?.getAccountCategoryList,
        });
      case "serviceType":
        return getServiceType({
          services: params?.services,
          urls: params?.getServiceTypeList,
        });
      case "sor":
        return getSor({ services: params?.services, urls: params?.getSorList });
      case "area":
        return getCostCenter({
          services: params?.services,
          urls: params?.getCostCenterList,
        });
      case "gsizes":
        return getGsize({
          services: params?.services,
          urls: params?.getGsizesList,
        });
      case "customerSegment":
        return getCustomerSegment({
          services: params?.services,
          urls: params?.getCustomerSegment,
        });
      case "customer":
        return getAccount({
          services: params?.services,
          urls: params?.getCustomer,
        });
      default:
        return null;
    }
  }, []);

  const handleSetCriteria = useCallback(
    (dataCriteria) => {
      if (hasValue(dataCriteria) && Array?.isArray(dataCriteria)) {
        setColumnCriteria(
          dataCriteria?.map((item, index) => ({
            required: true,
            title: item?.text?.toUpperCase(),
            dataIndex: item?.code,
            indexValue: item?.id,
            inputType: "select",
            url: conditionalDispatcher(item?.code),
            dataIndexFrom: "data_" + convertToSnakeCase(item?.code),
            option: conditionalOption(item?.code),
            dependDataIndex: conditionalDependendData(item?.code),
            rules: formMessageRequired(toTitleCase(item?.text), true),
          })),
        );
      }
    },
    [conditionalDependendData, conditionalDispatcher, conditionalOption],
  );

  useEffect(() => {
    if (sorterColumnOption) {
      handleSetCriteria(sorterColumnOption);
    }
  }, [sorterColumnOption, handleSetCriteria]);

  const handleEditDataRecord = useCallback(
    (data, key, index, record) => {
      const keyName = key + index;
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [keyName]: data,
        };
      });

      if (index === `province` && record?.hasOwnProperty("city")) {
        dispatch(
          getCity({
            services: params?.services,
            urls: params?.getCityList,
            id: data,
          }),
        );
        formCriteria.resetFields(["city", "district", "subDistrict"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "city"]: undefined,
            [key + "district"]: undefined,
            [key + "subDistrict"]: undefined,
          };
        });
      }
      if (index === `city` && record?.hasOwnProperty("district")) {
        dispatch(
          getDistrict({
            services: params?.services,
            urls: params?.getDistrictList,
            id: data,
          }),
        );
        formCriteria.resetFields(["district", "subDistrict"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "district"]: undefined,
            [key + "subDistrict"]: undefined,
          };
        });
      }
      if (index === `district` && record?.hasOwnProperty("subDistrict")) {
        dispatch(
          getSubDistrict({
            services: params?.services,
            urls: params?.getSubDistrictList,
            id: data,
          }),
        );
        formCriteria.resetFields(["subDistrict"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "subDistrict"]: undefined,
          };
        });
      }
      if (
        index === `customerSegment` &&
        record?.hasOwnProperty("accountGroupType")
      ) {
        dispatch(
          getAccountGroupType({
            services: params?.services,
            urls: params?.getAccountGroupTypeList,
            id: data,
          }),
        );
        formCriteria.resetFields(["accountGroupType"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "accountGroupType"]: undefined,
          };
        });
      }
    },
    [dispatch, formCriteria],
  );

  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setUpdateDate((prev) => ({ ...prev, startDate: value }));
    return value;
  };

  const isDisabledDate = useMemo(() => {
    if (
      hasValue(form?.getFieldsValue()?.endDate) === true &&
      listDataCriteria?.map((item) => ({
        startDate: item?.startDate,
        endDate: item?.endDate,
      }))?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [form, listDataCriteria]);

  return (
    <div className="w-full">
      <BaseContainer header={"TRANSACTION CALENDAR INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <Form.Item
            label={"Begin Cycle"}
            name={"beginCycle"}
            rules={[
              {
                required: true,
                message: "Please input your Begin Cycle!",
              },
            ]}
          >
            <SelectComponent>
              {dataString?.map((index, data) => (
                <Select.Option key={index} value={index}>
                  {index}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"End Cycle"}
            name={"endCycle"}
            rules={[
              {
                required: true,
                message: "Please input your End Cycle!",
              },
            ]}
          >
            <SelectComponent>
              {dataString?.map((index) => (
                <Select.Option key={index} value={index}>
                  {index}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Time Unit"}
            name={"timeUnit"}
            rules={[
              {
                required: true,
                message: "Please input your Time Unit!",
              },
            ]}
          >
            <SelectComponent>
              {data_time_unit?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[
              {
                required: true,
                message: "Please input your Start Date!",
              },
            ]}
          >
            <DateComponent
              dateDisable={disabledDate}
              onChange={(e) => handleStartDate(e)}
              disabled={isDisabledDate ? true : false}
            />
          </Form.Item>

          <Form.Item
            label={"End Date"}
            name={"endDate"}
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(updateDate?.startDate) <= moment(value)) ||
                  !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("End date must before Start date"),
                      ),
              },
            ]}
          >
            <DateComponent
              disabled={isDisabledDate}
              dateDisable={handleDisableEndDate}
              onChange={(e) =>
                setUpdateDate((prev) => ({ ...prev, endDate: e }))
              }
            />
          </Form.Item>
        </div>
        <div className="col-span-3">
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
            >
              {data_select_criteria &&
                data_select_criteria?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>
          <div className="col-span-3 py-5 ">
            <Form.Item label={"Description"} name={"description"}>
              <InputComponent type="textarea" cols={4} />
            </Form.Item>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"criteria information"}>
        {/* <FunctionalTableCriteriaPayment
          type={type}
          data={listDataCriteria}
          dataCriteria={criteriaValues}
          updateData={setListDataCriteria}
          endDateHeader={form.getFieldValue("endDate")}
          storedData={storedData}
          setStoredData={setStoredData}
        /> */}
        <FunctionalCriteria
          columnCriteria={columnCriteria}
          dataCriteria={criteriaValues}
          dataTable={listDataCriteria}
          editDataRecord={editDataRecord}
          formCriteria={formCriteria}
          setUpdateDataTable={setListDataCriteria}
          type={type}
          startDateHeader={updateDate?.startDate}
          endDateHeader={updateDate?.endDate}
          handleEditDataRecord={handleEditDataRecord}
          setEditDataRecord={setEditDataRecord}
          conditionalDispatcher={() => {}}
          defaultColumn={["no", "startDate", "endDate", "action"]}
          checkStartDate
        />
      </BaseContainer>
    </div>
  );
};

export default TransactionCalenderInfromation;
