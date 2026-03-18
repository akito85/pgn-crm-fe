import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Spin, Modal } from "antd";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { convertToSnakeCase, dateFormatting, formMessageRequired, hasValue, renderDateConverter, requiredMessage, toTitleCase } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createTaxImplication,
  getDetailTaxImplication,
  getSelectCriteria,
  getCategoryList,
  getServiceTypeList,
  updateTaxImplication,
} from "../../../../../redux/slices/account_management/MasterData/tax_implication";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { LeftOutlined } from "@ant-design/icons";
import ModalBack from "../../../../../components/Modal/ModalBack";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { showModalError, validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ContentModalConfirmTaxImplication from "./ContentModalConfirmTaxImplication";
import moment from "moment";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { useCriteriaHooks } from "../../../../../components/Criteria/useCriteriaHooks";
import { getAccountCategory, getAccountGroupType, getAccountNumber, getAccountSegment, getAccountType, getCity, getClassificationType, getCostCenter, getCountry, getDistrict, getProvince, getSAType, getSor, getSubDistrict, resetAllStateCriteria, setStored } from "../../../../../redux/slices/criteria_slice";
import { params } from "./params_ddl";
import FunctionalCriteria from "../../../../../components/Criteria/FunctionalCriteria";
import { constantKeys } from "../../../../../components/Criteria/constantCriteriaKey";

const routes = (type) => [
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
    breadcrumbName: `${type === "update" ? "Update Tax Implication" : "Create Tax Implication"
      }`,
  },
];

const FormTaxImplication = ({ type }) => {
  const [form] = Form.useForm();
  const [formCriteria] = Form.useForm()
  const formValue = form.getFieldsValue();
  const formValueCriteria = formCriteria.getFieldsValue();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location?.state || {};
  const {
    data_detail = {},
    dataListCriteriaOpt = [],
    loading = false,
    categoryList = [],
    serviceTypeList = []
  } = useSelector((state) => state.tax_implication);
  const {
    stored,
    loading_criteria,
    data_country,
    data_province,
    data_city,
    data_district,
    data_subdistrict,
    data_cost_center,
    data_sor,
    data_account_category,
    data_account_group_type,
    data_sa_type,
    data_account_number,
    data_account_segment,
    data_account_type,
    data_classification_type,
  } = useSelector(state => state?.criteria_slice)


  const { isLoading } = useSelector(state => state?.general)
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [description, setDescription] = useState("");
  const [dataListCriteria, setDataListCriteria] = useState([]);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [modalSuccessCreate, setModalSuccessCreate] = useState(false);
  const [payload, setPayload] = useState({});
  const [idCreateRule, setIdCreateRule] = useState(null);
  const [columnCriteria, setColumnCriteria] = useState([])
  const { setDataIndex } = useCriteriaHooks()
  const [dataTable, setDataTable] = useState([]);
  const [editDataRecord, setEditDataRecord] = useState({});


  useEffect(() => {
    dispatch(setStored(false))
    dispatch(getSelectCriteria());
    dispatch(getCategoryList());
    dispatch(getServiceTypeList());
  }, []);

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getDetailTaxImplication(id));
    }
  }, [type, id, dispatch]);


  // sorter column
  const sorterColumnOption = useMemo(() => {
    const orderedCodes = [
      "saType",
      "wapuFlag",
      "classificationType",
      "accountType",
      "corporateFlag",
      "accountCategory",
      "accountSegment",
      "accountGroupType",
      "sor",
      "costCenter",
      "premiseCountry",
      "premiseProvince",
      "premiseCity",
      "premiseDistrict",
      "premiseSubdistrict",
      "accountNumber",
    ];
    if (hasValue(dataListCriteriaOpt) && Array?.isArray(dataListCriteriaOpt)) {
      const mappingOption = dataListCriteriaOpt?.map(item => ({ ...item, code: setDataIndex(item?.code) }))
      return [...mappingOption].sort((a, b) => orderedCodes.indexOf(a.code) - orderedCodes.indexOf(b.code));
    } else {
      return []
    }
  }, [dataListCriteriaOpt, setDataIndex])
  // conditional depend column
  const conditionalDependendData = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "premiseProvince":
        return "premiseCountry"
      case "premiseCity":
        return "premiseProvince"
      case "accountGroupType":
        return "accountSegment"
      case "premiseDistrict":
        return "premiseCity";
      case "premiseSubdistrict":
        return "premiseDistrict";
      default:
        return null
    }
  }, []);

  // conditional option
  const conditionalOption = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "saType":
        return data_sa_type?.map(item => ({ value: item?.id, label: item?.text }));
      case "wapuFlag":
        return [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ];
      case "accountNumber":
        return data_account_number?.map(item => ({ label: item?.name, value: item?.id }));
      case "costCenter":
        return data_cost_center?.map(item => ({ value: item?.id, label: item?.text }));
      case "premiseProvince":
        return data_province?.map(item => ({ value: item?.id, label: item?.text }));
      case "accountSegment":
        return data_account_segment?.map(item => ({ value: item?.id, label: item?.text }));
      case "premiseCity":
        return data_city?.map(item => ({ value: item?.id, label: item?.text }));
      case "premiseCountry":
        return data_country?.map(item => ({ value: item?.id, label: item?.text }));
      case "corporateFlag":
        return [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ];
      case "accountType":
        return data_account_type?.map(item => ({ value: item?.id, label: item?.text }));
      case "accountGroupType":
        return data_account_group_type?.map(item => ({ value: item?.id, label: item?.name }));
      case "premiseSubdistrict":
        return data_subdistrict?.map(item => ({ value: item?.id, label: item?.text }));
      case "premiseDistrict":
        return data_district?.map(item => ({ value: item?.id, label: item?.text }));
      case "sor":
        return data_sor?.map(item => ({ value: item?.id, label: item?.text }));
      case "accountCategory":
        return data_account_category?.map(item => ({ value: item?.Id, label: item?.text }));
      case "classificationType":
        return data_classification_type?.map(item => ({ value: item?.id, label: item?.name }));

      default:
        return null
    }
  }, [data_account_category, data_account_group_type, data_account_number, data_account_segment, data_account_type, data_city, data_classification_type, data_cost_center, data_country, data_district, data_province, data_sa_type, data_sor, data_subdistrict]);

  const conditionalDispatcher = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "premiseCountry":
        return getCountry({ services: params?.services, urls: params?.getCountry })
      case "costCenter":
        return getCostCenter({ services: params?.services, urls: params?.getCostCenterList })
      case "accountNumber":
        return getAccountNumber({ services: params?.services, urls: params?.getAccountNumberList })
      case "classificationType":
        return getClassificationType({ services: params?.services, urls: params?.getClassificationTypeList })
      case "accountSegment":
        return getAccountSegment({ services: params?.services, urls: params?.getAccountSegment })
      case "saType":
        return getSAType({ services: params?.services, urls: params?.getSATypeList })
      case "accountType":
        return getAccountType({ services: params?.services, urls: params?.getAccountTypeList });
      case "sor":
        return getSor({ services: params?.services, urls: params?.getSor });
      case "accountCategory":
        return getAccountCategory({ services: params?.services, urls: params?.getAccountCategory });
      default:
        return null
    }
  }, [])

  const handleSetCriteria = useCallback((dataCriteria) => {
    if (hasValue(dataCriteria) && Array?.isArray(dataCriteria)) {
      setColumnCriteria(dataCriteria?.map((item, index) => (
        {
          required: true,
          title: item?.label?.toUpperCase(),
          dataIndex: item?.code,
          indexValue: item?.value,
          inputType: 'select',
          url: conditionalDispatcher(item?.code),
          dataIndexFrom: 'data_' + convertToSnakeCase(item?.code),
          option: conditionalOption(item?.code),
          dependDataIndex: conditionalDependendData(item?.code),
          rules: formMessageRequired(toTitleCase(item?.label), true),
        }
      )))
    }
  }, [conditionalDependendData, conditionalDispatcher, conditionalOption]);

  useEffect(() => {
    if (sorterColumnOption) {
      handleSetCriteria(sorterColumnOption)
    }

  }, [sorterColumnOption, handleSetCriteria]);


  useEffect(() => {
    if (type === "update" && data_detail?.taxImplicationId === id) {
      const dataIndexList = dataListCriteriaOpt.map(
        (item) => setDataIndex(item?.code)
      );
      const criteriaData = (data_detail?.taxImplicationCriterias || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          let obj = { typeData: "exist", key: index + 1 };
          for (const attr in item) {
            if (dataIndexList.includes(attr)) {
              if (attr === 'startDate' || attr === 'endDate') {
                obj[attr] = hasValue(item[attr]) ? moment(item[attr]).format(dateFormatting.date) : null;
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
        taxImplicationName: data_detail.name,
        category: data_detail.category.id || 0,
        serviceType: data_detail.serviceType.id || 0,
        description: data_detail.description,
        criteria: (data_detail.criteria || []).map((item) => item.value),
      };
      setDataTable(criteriaData)
      setDataListCriteria(criteriaData);
      setDescription(obj.description);
      setCriteriaValues(obj.criteria);
      form.setFieldsValue(obj);
    }
  }, [type, id, data_detail, form, dataListCriteriaOpt, setDataIndex]);


  const reorderedDTO = useCallback((dataTable) => {
    if (hasValue(dataTable) && Array?.isArray(dataTable)) {
      const filteredSelectCriteria = dataListCriteriaOpt?.filter(item => criteriaValues?.includes(item?.value))?.map(item => ({ code: item?.code }))
      const reorderedDataDTO = dataTable.map(dto => {
        let orderedDTO = {
          id: hasValue(dto?.id) ? dto?.id : null,
          startDate: hasValue(dto.startDate) ? renderDateConverter(dto?.startDate, 'date') : null,
          endDate: hasValue(dto.endDate) ? renderDateConverter(dto?.endDate, 'date') : null,
          description: hasValue(dto.description) ? dto?.description : null
        };
        dataListCriteriaOpt.forEach(({ code }) => {
          const prop = constantKeys[code];
          const isCriteriaSelected = filteredSelectCriteria.some(item => constantKeys[item.code] === prop);
          if (!isCriteriaSelected || hasValue(dto[prop]) === false) {
            orderedDTO[prop] = null;
          } else if (typeof dto[prop] === 'object' && hasValue(dto[prop])) {
            orderedDTO[prop] = dto[prop]?.value;
          } else {
            orderedDTO[prop] = dto[prop];
          }
        });
        return orderedDTO;
      });
      return reorderedDataDTO
    } else {
      return [];
    }
  }, [criteriaValues, dataListCriteriaOpt]);


  const handleSelectCriteria = (value) => {
    let res = [...criteriaValues, value];
    if (res.includes(260)) {
      res.push(258);
    }
    if (res.includes(258)) {
      res.push(256);
    }
    if (res.includes(256)) {
      res.push(259);
    }
    if (res.includes(259)) {
      res.push(257);
    }
    if (res.includes(248)) {
      res.push(250);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(255) ? [255] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValues.filter((item) => item !== value);
    if (!res.includes(257)) {
      res = res.filter((item) => item !== 259);
    }
    if (!res.includes(259)) {
      res = res.filter((item) => item !== 256);
    }
    if (!res.includes(256)) {
      res = res.filter((item) => item !== 258);
    }
    if (!res.includes(258)) {
      res = res.filter((item) => item !== 260);
    }
    if (!res.includes(250)) {
      res = res.filter((item) => item !== 248);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(255) ? [255] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  const handleSubmitForm = async (valueForm) => {
    try {
      if (storedDataInline) {
        const errorBody = {
          title: "Failed",
          description: `Please save data table inline before submit. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else if (dataTable.length === 0 && !criteriaValues.includes(255)) {
        const errorBody = {
          title: "Failed",
          description: `List Data Tax Implication Criteria at least 1 data . Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        let validateValueObj;
        const includesAll = formValue.criteria.includes(24);
        const taxImplicationCriterias = formValue.criteria.map((item) => {
          let dataDefault = [];
          if (type === "update") {
            let tempData = data_detail?.criteria || [];
            dataDefault = tempData.filter((data) => data.value === item);
          }
          const itemName = dataListCriteriaOpt.filter(
            (criteria) => criteria.value === item
          );
          return {
            id: dataDefault.length > 0 ? dataDefault[0].id : null,
            value: item,
            label: itemName[0].code || null,
            name: itemName[0].label || null,
          };
        });
        const body = {
          taxImplicationId: type === "update" ? id : undefined,
          taxImplicationName: valueForm.taxImplicationName,
          category: formValue.category,
          serviceType: formValue.serviceType,
          description: formValue.description,
          criteria: taxImplicationCriterias,
          taxImplicationCriterias: includesAll
            ? [{ allCriteria: true }]
            : reorderedDTO(dataTable),
        };

        setPayload(body)
        if (type === 'update') {
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: '/v1/dbs/api/tax-implication/validate-update-taximplication',
            type
          }
        } else {
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: '/v1/dbs/api/tax-implication/validate-create-taximplication',
            type
          }
        }
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setModalConfirm(true);
      }
    } catch (error) {
      setModalConfirm(false);

    }
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setCriteriaValues([]);
      setDescription(undefined);
      setDataListCriteria([]);
    } else {
      form.resetFields();
      setCriteriaValues([]);
      setDescription(undefined);
      setDataListCriteria([]);
      dispatch(getDetailTaxImplication(id));
    }
  };

  const handleProcessModalConfirm = async () => {
    if (type !== "update") {
      dispatch(createTaxImplication({ body: payload }))
        .unwrap()
        .then((data) => {
          dispatch(resetAllStateCriteria())
          handleCancelModalConfirm();
          handleClear();
          if (data) {
            setIdCreateRule(data?.id)
            setModalSuccessCreate(true)
          }
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateTaxImplication({ body: payload }))
        .unwrap()
        .then(() => {
          dispatch(resetAllStateCriteria())
          handleCancelModalConfirm();
          form.resetFields();
          setCriteriaValues([]);
          setDescription(undefined);
          setDataListCriteria([]);
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const formatCriteria = (data) => {
    const tempArray = dataListCriteriaOpt.filter((item) =>
      data.includes(item.value)
    );
    return tempArray.map((data) => data.label);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleProcessModalConfirm();
    setModalError(false);
    setBodyError({});
  };
  const conditionalDispatch = useCallback((record) => {
    if (record?.premiseCountry && record?.premiseCountry?.value && record?.hasOwnProperty('premiseProvince')) {
      dispatch(getProvince({ services: params?.services, urls: params?.getProvinceList, id: record?.premiseCountry?.value }));
    }
    if (record?.premiseProvince && record?.premiseProvince?.value && record?.hasOwnProperty('premiseCity')) {
      dispatch(getCity({ services: params?.services, urls: params?.getCityList, id: record?.premiseProvince?.value }));
    }
    if (record?.premiseCity && record?.premiseCity?.value && record?.hasOwnProperty('premiseDistrict')) {
      dispatch(getDistrict({ services: params?.services, urls: params?.getDistrictList, id: record?.premiseCity?.value }));
    }
    if (record?.premiseDistrict && record?.premiseDistrict?.value && record?.hasOwnProperty('premiseSubdistrict')) {
      dispatch(getSubDistrict({ services: params?.services, urls: params?.getSubDistrictList, id: record?.premiseDistrict?.value }));
    }
    if (record?.accountSegment && record?.accountSegment?.value && record?.hasOwnProperty('accountGroupType')) {
      dispatch(getAccountGroupType({ services: params?.services, urls: params?.getAccountGroupList, id: record?.accountSegment?.value }));
    }
  }, [dispatch]);


  const handleEditDataRecord = useCallback((data, key, index, record) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    if (index === "premiseCountry" && record?.hasOwnProperty('premiseProvince')) {
      dispatch(getProvince({ services: params?.services, urls: params?.getProvinceList, id: data }));
      formCriteria.resetFields([
        "premiseProvince",
        "premiseCity",
        "premiseDistrict",
        "premiseSubdistrict",
      ]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseProvince"]: undefined,
          [key + "premiseCity"]: undefined,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseProvince` && record?.hasOwnProperty('premiseCity')) {
      dispatch(getCity({ services: params?.services, urls: params?.getCityList, id: data }));
      formCriteria.resetFields([
        "premiseCity",
        "premiseDistrict",
        "premiseSubdistrict",
      ]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseCity"]: undefined,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseCity` && record?.hasOwnProperty('premiseDistrict')) {
      dispatch(getDistrict({ services: params?.services, urls: params?.getDistrictList, id: data }));
      formCriteria.resetFields([
        "premiseDistrict",
        "premiseSubdistrict",]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseDistrict"]: undefined,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `premiseDistrict` && record?.hasOwnProperty('premiseSubdistrict')) {
      dispatch(getSubDistrict({ services: params?.services, urls: params?.getSubDistrictList, id: data }));
      formCriteria.resetFields(["premiseSubdistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "premiseSubdistrict"]: undefined,
        };
      });
    }
    if (index === `accountSegment` && record?.hasOwnProperty('accountGroupType')) {
      dispatch(getAccountGroupType({ services: params?.services, urls: params?.getAccountGroupList, id: data }));
      formCriteria.resetFields(["accountGroupType"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroupType"]: undefined,
        };
      });
    }
  }, [dispatch, formCriteria]);


  return (
    <LayoutMenu>
      <BreadCrumb routes={routes(type)} />
      <Spin spinning={loading || isLoading || loading_criteria}>
        <Form
          id="taxImplicationForm"
          form={form}
          layout={"vertical"}
          onFinish={storedDataInline ? undefined : handleSubmitForm}
          scrollToFirstError={true}
        >

          {/* Form Tax Implication Name */}
          <BaseContainer header={"tax implication information"}>
            <div className="grid grid-cols-3 gap-2">
              <Form.Item
                name={"taxImplicationName"}
                rules={[{ message: requiredMessage("Name"), required: true }]}
                className={"w-full no-margin-form"}
                required
                label={"Tax Implication Name"}
              >
                <InputComponent type="text"  disabled={type === 'update'}/>
              </Form.Item>
              <Form.Item
                name={"category"}
                rules={[
                  { message: requiredMessage("Category"), required: true },
                ]}
                className="no-margin-form w-full"
                label={"Category"}
                required
              >
                <SelectComponent options={categoryList} disabled={type === 'update'} />
              </Form.Item>
              <Form.Item
                name={"serviceType"}
                rules={[
                  { message: requiredMessage("Service Type"), required: true },
                ]}
                className="no-margin-form w-full"
                label={"Service Type"}
                required
              >
                <SelectComponent options={serviceTypeList} disabled={type === 'update'} />
              </Form.Item>

              <div className="col-span-3">
                <Form.Item
                  name={"criteria"}
                  rules={[
                    { message: requiredMessage("Criteria"), required: true },
                  ]}
                  className={"w-full no-margin-form"}
                  label={"Criteria"}
                >
                  <SelectComponent
                    disabled={stored}
                    mode="multiple"
                    onSelect={handleSelectCriteria}
                    onDeselect={handleDeselectCriteria}
                    onClear={handleClearCriteria}
                    options={dataListCriteriaOpt}
                  />
                </Form.Item>
              </div>

              <div className="col-span-3">
                <Form.Item
                  name={"description"}
                  className="w-full"
                  label={"Description"}
                >
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </BaseContainer>

          {/* Table Tax Implication Criteria */}
          <BaseContainer header={"tax implication criteria"}>
            {/* <TaxImplicationTableCriteria
              type={type}
              data={dataListCriteria}
              dataCriteria={criteriaValues}
              updateData={setDataListCriteria}
              dispatch={dispatch}
              setStoredData={setStoredDataInline}
              storedData={storedDataInline}
            /> */}
            <FunctionalCriteria
              formCriteria={formCriteria}
              columnCriteria={columnCriteria}
              dataCriteria={criteriaValues}
              dataTable={dataTable}
              setUpdateDataTable={setDataTable}
              type={type}
              startDateHeader={moment()}
              defaultColumn={['no', 'startDate', 'endDate', 'description', 'action']}
              handleEditDataRecord={handleEditDataRecord}
              setEditDataRecord={setEditDataRecord}
              editDataRecord={editDataRecord}
              conditionalDispatcher={conditionalDispatch}
              checkStartDate={false}
            />
          </BaseContainer>

          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
              disabled={stored}
            >
              Back
            </ButtonComponent>
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                disabled={stored}
                onClick={storedDataInline ? undefined : handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent disabled={stored} htmlType="submit" type="submit">
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>

        {/** Modal Confirm */}
        {modalConfirm ? (
          <ModalCustom
            isOpen={modalConfirm}
            handleCancel={handleCancelModalConfirm}
            header={"Confirmation"}
            width={1000}
            type={"confirmation"}
            footer={
              <div className="w-full flex justify-end gap-5 p-4">
                <ButtonComponent
                  onClick={handleCancelModalConfirm}
                  type="default"
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  onClick={handleProcessModalConfirm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <ContentModalConfirmTaxImplication
              data={formValue}
              listDataCriteria={dataTable}
              criteriaValues={criteriaValues}
              listCriteria={formatCriteria(formValue?.criteria || [])}
            />
          </ModalCustom>
        ) : null}

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${type === "update" ? "updated" : "created"
              }. ${bodyError?.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal Success create tax implication */}
        {modalSuccessCreate ?
          <Modal
            open={modalSuccessCreate}
            onCancel={() => {
              setModalSuccessCreate(false)
              navigate(-1)
            }}
            className={"modal-custom"}
            centered={true}
            width={500}
            maskClosable={false}
            footer={
              <div className="w-full flex justify-end gap-5 p-4">
                <ButtonComponent
                  onClick={() => {
                    setModalSuccessCreate(false)
                    navigate(-1)
                  }}
                  type="default"
                >
                  NO
                </ButtonComponent>
                <Link
                  to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_TAX_IMPLICATION_RULE}
                  state={{
                    taxImplicationId: idCreateRule,
                  }}

                >
                  <ButtonComponent type="submit">
                    YES
                  </ButtonComponent>
                </Link>
              </div>
            }
          >
            <div className={"flex flex-col w-full"}>
              <div className="px-5 pt-5 pb-[10px] justify-center">
                <div className="w-full flex gap-[20px]">
                  <SVGIcon name="IconSuccess" width={48} />
                  <p className="text-[18px] font-bold">Successful</p>
                </div>
                <p className="pl-[70px]">{`Tax Implication has been created, do you want to create tax implication rule for this data?`}</p>
              </div>
            </div>
          </Modal>
          : null}

      </Spin>
    </LayoutMenu>
  )
};

export default FormTaxImplication;
