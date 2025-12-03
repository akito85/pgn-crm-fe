import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Form, Spin, Modal } from "antd";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import {
  convertToSnakeCase,
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderDateConverter,
  requiredMessage,
  toTitleCase,
} from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createLateCharge,
  getAccountGroupList,
  getAccountNumberList,
  getAccountSegment,
  getAccountTypeList,
  getCityList,
  getClassificationTypeList,
  getCostCenterList,
  getCountryList,
  getDetailLateCharge,
  getDistrictList,
  getProvinceList,
  getSATypeList,
  getSelectCriteria,
  getSelectCurrency,
  getSubDistrictList,
  updateLateCharge,
  getSorList,
  getAccountCategoryList,
} from "../../../../../redux/slices/account_management/MasterData/late_charges";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { LeftOutlined } from "@ant-design/icons";
import ModalBack from "../../../../../components/Modal/ModalBack";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ContentModalConfirmLateCharge from "./ContentModalConfirmLateCharge";
import moment from "moment";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import FunctionalCriteria from "../../../../../components/Criteria/FunctionalCriteria";
import { useCriteriaHooks } from "../../../../../components/Criteria/useCriteriaHooks";
import { constantKeys } from "../../../../../components/Criteria/constantCriteriaKey";
import { setStored } from "../../../../../redux/slices/criteria_slice";

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
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_LATE_CHARGES,
    breadcrumbName: "Late Charge",
  },
  {
    path: "",
    breadcrumbName: `${
      type === "update" ? "Update Late Charge" : "Create Late Charge"
    }`,
  },
];

const FormLateCharges = ({ type }) => {
  const [form] = Form.useForm();
  const [formCriteria] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location?.state || {};
  const {
    data_detail = {},
    dataListCriteriaOpt = [],
    dataListCurrency = [],
    loading = false,
    accountCategoryList = [],
    saTypeList = [],
    accountTypeList = [],
    accountSegmentList = [],
    accountGroupTypeList = [],
    accountNumberList = [],
    classificationTypeList = [],
    sorList = [],
    costCenterList = [],
    premiseCountryList = [],
    premiseProvinceList = [],
    premiseCityList = [],
    premiseDistrictList = [],
    premiseSubdistrictList = [],
  } = useSelector((state) => state.late_charge);

  const { stored } = useSelector((state) => state?.criteria_slice);
  const { isLoading } = useSelector((state) => state?.general);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [description, setDescription] = useState("");
  const [dataListCriteria, setDataListCriteria] = useState([]);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [modalSuccessCreate, setModalSuccessCreate] = useState(false);
  const [payload, setPayload] = useState(true);
  const [idCreateRule, setIdCreateRule] = useState(null);
  const [columnCriteria, setColumnCriteria] = useState([]);
  const { setDataIndex } = useCriteriaHooks();
  const [dataTable, setDataTable] = useState([]);
  const [editDataRecord, setEditDataRecord] = useState({});
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
      const mappingOption = dataListCriteriaOpt?.map((item) => ({
        ...item,
        code: setDataIndex(item?.code),
      }));
      return [...mappingOption].sort(
        (a, b) => orderedCodes.indexOf(a.code) - orderedCodes.indexOf(b.code),
      );
    } else {
      return [];
    }
  }, [dataListCriteriaOpt, setDataIndex]);

  // console.log(sorList, ' sor lis');
  // console.log(costCenterList, ' sor lis');

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getDetailLateCharge(id));
    }
  }, [type, id]);

  useEffect(() => {
    if (type === "update" && data_detail?.lateChargeId === id) {
      const dataIndexList = dataListCriteriaOpt?.map((item) =>
        setDataIndex(item?.code),
      );
      const criteriaData = (data_detail?.lateChargeCriterias || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          let obj = { typeData: "exist", key: index + 1 };
          for (const attr in item) {
            if (dataIndexList.includes(attr)) {
              if (attr === "startDate" || attr === "endDate") {
                obj[attr] = hasValue(item[attr])
                  ? moment(item[attr]).format(dateFormatting.date)
                  : null;
              } else if (attr === "description") {
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
        currency: data_detail.currency.id || 0,
        description: data_detail.description,
        criteria: (data_detail.criteria || []).map((item) => item.value),
      };
      setDataTable(criteriaData);
      setDataListCriteria(criteriaData);
      setDescription(obj.description);
      setCriteriaValues(obj.criteria);
      form.setFieldsValue(obj);
    }
  }, [type, id, data_detail, form, dataListCriteriaOpt, setDataIndex]);

  useEffect(() => {
    dispatch(setStored(false));
    dispatch(getSelectCriteria());
    dispatch(getSelectCurrency());
  }, []);

  const reorderedDTO = useCallback(
    (dataTable) => {
      if (hasValue(dataTable) && Array?.isArray(dataTable)) {
        const filteredSelectCriteria = dataListCriteriaOpt
          ?.filter((item) => criteriaValues?.includes(item?.value))
          ?.map((item) => ({ code: item?.code }));
        const reorderedDataDTO = dataTable.map((dto) => {
          let orderedDTO = {
            id: hasValue(dto?.id) ? dto?.id : null,
            startDate: hasValue(dto.startDate)
              ? renderDateConverter(dto?.startDate, "date")
              : null,
            endDate: hasValue(dto.endDate)
              ? renderDateConverter(dto?.endDate, "date")
              : null,
            description: hasValue(dto.description) ? dto?.description : null,
          };
          dataListCriteriaOpt.forEach(({ code }) => {
            const prop = constantKeys[code];
            const isCriteriaSelected = filteredSelectCriteria.some(
              (item) => constantKeys[item.code] === prop,
            );
            if (!isCriteriaSelected || hasValue(dto[prop]) === false) {
              orderedDTO[prop] = null;
            } else if (typeof dto[prop] === "object" && hasValue(dto[prop])) {
              orderedDTO[prop] = dto[prop]?.value;
            } else {
              orderedDTO[prop] = dto[prop];
            }
          });
          return orderedDTO;
        });
        return reorderedDataDTO;
      } else {
        return [];
      }
    },
    [criteriaValues, dataListCriteriaOpt],
  );

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
          description: `List Data Late Charge Criteria at least 1 data . Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        let validateValueObj;
        const includesAll = formValue.criteria.includes(24);
        const lateChargeCriterias = formValue.criteria.map((item) => {
          let dataDefault = [];
          if (type === "update") {
            let tempData = data_detail?.criteria || [];
            dataDefault = tempData.filter((data) => data.value === item);
          }
          const itemName = dataListCriteriaOpt.filter(
            (criteria) => criteria.value === item,
          );
          return {
            id: dataDefault.length > 0 ? dataDefault[0].id : null,
            value: item,
            label: itemName[0].code || null,
            name: itemName[0].label || null,
          };
        });

        const body = {
          lateChargeId: type === "update" ? id : undefined,
          lateChargeName: valueForm.lateChargeName,
          currency: formValue.currency,
          description: formValue.description,
          criteria: lateChargeCriterias,
          lateChargeCriteriaDatas: includesAll
            ? [{ allCriteria: true }]
            : reorderedDTO(dataTable),
        };
        setPayload(body);
        if (type === "update") {
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/master/late-charge/validate-update-header",
            type,
          };
        } else {
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/master/late-charge/validate-create-master",
            type,
          };
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
      dispatch(getDetailLateCharge(id));
    }
  };

  const handleProcessModalConfirm = async () => {
    if (type !== "update") {
      dispatch(createLateCharge({ body: payload }))
        ?.unwrap()
        ?.then((data) => {
          handleCancelModalConfirm();
          handleClear();
          if (data) {
            setIdCreateRule(data?.masterLateCharge?.id);
            setModalSuccessCreate(true);
          }
        })
        ?.catch((error) => {
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
      dispatch(updateLateCharge({ body: payload }))
        ?.unwrap()
        ?.then(() => {
          handleCancelModalConfirm();
          form.resetFields();
          setCriteriaValues([]);
          setDescription(undefined);
          setDataListCriteria([]);
        })
        ?.catch((error) => {
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
    setDataTable([]);
  };

  const formatCriteria = (data) => {
    const tempArray = dataListCriteriaOpt.filter((item) =>
      data.includes(item.value),
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

  // conditional dispatcher
  const conditionalDispatcher = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "premiseCountry":
        return getCountryList();
      case "costCenter":
        return getCostCenterList();
      case "accountNumber":
        return getAccountNumberList();
      case "classificationType":
        return getClassificationTypeList();
      case "accountSegment":
        return getAccountSegment();
      case "saType":
        return getSATypeList();
      case "accountType":
        return getAccountTypeList();
      case "sor":
        return getSorList();
      case "accountCategory":
        return getAccountCategoryList();
      default:
        return null;
    }
  }, []);

  // conditional depend column
  const conditionalDependendData = useCallback((dataIndex) => {
    switch (dataIndex) {
      case "premiseProvince":
        return "premiseCountry";
      case "premiseCity":
        return "premiseProvince";
      case "accountGroupType":
        return "accountSegment";
      case "premiseDistrict":
        return "premiseCity";
      case "premiseSubdistrict":
        return "premiseDistrict";
      default:
        return null;
    }
  }, []);

  // conditional option
  const conditionalOption = useCallback(
    (dataIndex) => {
      switch (dataIndex) {
        case "saType":
          return saTypeList;
        case "wapuFlag":
          return [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ];
        case "accountNumber":
          return accountNumberList;
        case "costCenter":
          return costCenterList?.map((item) => ({
            value: item?.id,
            label: item?.text,
            key: item?.code,
          }));
        case "premiseProvince":
          return premiseProvinceList;
        case "accountSegment":
          return accountSegmentList;
        case "premiseCity":
          return premiseCityList;
        case "premiseCountry":
          return premiseCountryList;
        case "corporateFlag":
          return [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ];
        case "accountType":
          return accountTypeList;
        case "accountGroupType":
          return accountGroupTypeList;
        case "premiseSubdistrict":
          return premiseSubdistrictList;
        case "premiseDistrict":
          return premiseDistrictList;
        case "sor":
          return sorList?.map((item) => ({
            value: item?.id,
            label: item?.text,
            key: item?.code,
          }));
        case "accountCategory":
          return accountCategoryList?.map((item) => ({
            value: item?.id,
            label: item?.text,
            key: item?.code,
          }));
        case "classificationType":
          return classificationTypeList;

        default:
          return null;
      }
    },
    [
      accountCategoryList,
      accountGroupTypeList,
      accountNumberList,
      accountSegmentList,
      accountTypeList,
      classificationTypeList,
      costCenterList,
      premiseCityList,
      premiseCountryList,
      premiseDistrictList,
      premiseProvinceList,
      premiseSubdistrictList,
      saTypeList,
      sorList,
    ],
  );
  // console.log(accountCategoryList);

  const conditionalDispatch = useCallback(
    (record) => {
      if (record?.premiseCountry && record?.premiseCountry?.value) {
        dispatch(getProvinceList(record?.premiseCountry?.value));
      }
      if (record?.premiseProvince && record?.premiseProvince?.value) {
        dispatch(getCityList(record?.premiseProvince?.value));
      }
      if (record?.premiseCity && record?.premiseCity?.value) {
        dispatch(getDistrictList(record?.premiseCity?.value));
      }
      if (record?.premiseDistrict && record?.premiseDistrict?.value) {
        dispatch(getSubDistrictList(record?.premiseDistrict?.value));
      }
      if (record?.accountSegment && record?.accountSegment?.value) {
        dispatch(getAccountGroupList(record?.accountSegment?.value));
      }
    },
    [dispatch],
  );

  const handleEditDataRecord = useCallback(
    (data, key, index) => {
      const keyName = key + index;
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [keyName]: data,
        };
      });
      if (index === "premiseCountry") {
        dispatch(getProvinceList(data));
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
      if (index === `premiseProvince`) {
        dispatch(getCityList(data));
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
      if (index === `premiseCity`) {
        dispatch(getDistrictList(data));
        formCriteria.resetFields(["premiseDistrict", "premiseSubdistrict"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "premiseDistrict"]: undefined,
            [key + "premiseSubdistrict"]: undefined,
          };
        });
      }
      if (index === `premiseDistrict`) {
        dispatch(getSubDistrictList(data));
        formCriteria.resetFields(["premiseSubdistrict"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "premiseSubdistrict"]: undefined,
          };
        });
      }
      if (index === `accountSegment`) {
        dispatch(getAccountGroupList(data));
        formCriteria.resetFields(["accountGroupType"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "accountGroupType"]: undefined,
          };
        });
      }
    },
    [dispatch, formCriteria, setEditDataRecord],
  );

  const handleSetCriteria = useCallback(
    (dataCriteria) => {
      if (hasValue(dataCriteria) && Array?.isArray(dataCriteria)) {
        setColumnCriteria(
          dataCriteria?.map((item, index) => ({
            required: true,
            title: item?.label?.toUpperCase(),
            dataIndex: item?.code,
            indexValue: item?.value,
            inputType: "select",
            url: conditionalDispatcher(item?.code),
            dataIndexFrom: "data_" + convertToSnakeCase(item?.code),
            option: conditionalOption(item?.code),
            dependDataIndex: conditionalDependendData(item?.code),
            rules: formMessageRequired(toTitleCase(item?.label), true),
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

  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes(type)} />
        <Form
          id="lateChargeForm"
          form={form}
          layout={"vertical"}
          onFinish={storedDataInline ? undefined : handleSubmitForm}
          scrollToFirstError={true}
        >
          <BaseContainer header={"late charge information"}>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                name={"lateChargeName"}
                rules={[{ message: requiredMessage("Name"), required: true }]}
                className={"w-full no-margin-form"}
                required
                label={"Name"}
              >
                <InputComponent type="text" disabled={type === "update"} />
              </Form.Item>
              <Form.Item
                name={"currency"}
                rules={[
                  { message: requiredMessage("Currency"), required: true },
                ]}
                className="no-margin-form w-full"
                label={"Currency"}
                required
              >
                <SelectComponent
                  disabled={type === "update"}
                  options={dataListCurrency}
                />
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
          <BaseContainer header={"late charge criteria"}>
            <FunctionalCriteria
              formCriteria={formCriteria}
              columnCriteria={columnCriteria}
              dataCriteria={criteriaValues}
              dataTable={dataTable}
              setUpdateDataTable={setDataTable}
              type={type}
              startDateHeader={moment()}
              defaultColumn={[
                "no",
                "startDate",
                "endDate",
                "description",
                "action",
              ]}
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
              onClick={storedDataInline ? undefined : () => setModalBack(true)}
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
              <ButtonComponent
                disabled={stored}
                htmlType="submit"
                type="submit"
              >
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
            <ContentModalConfirmLateCharge
              data={formValue}
              listDataCriteria={dataTable}
              criteriaValues={criteriaValues}
              listCriteria={formatCriteria(formValue.criteria || [])}
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
            <p className="pl-[70px]">{`Your data was not ${
              type === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal Success create late charge */}
        {modalSuccessCreate ? (
          <Modal
            open={modalSuccessCreate}
            onCancel={() => {
              setModalSuccessCreate(false);
              navigate(-1);
            }}
            className={"modal-custom"}
            centered={true}
            width={500}
            maskClosable={false}
            footer={
              <div className="w-full flex justify-end gap-5 p-4">
                <ButtonComponent
                  onClick={() => {
                    setModalSuccessCreate(false);
                    navigate(-1);
                  }}
                  type="default"
                >
                  NO
                </ButtonComponent>
                <Link
                  to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_LATE_CHARGES_RULE}
                  state={{
                    lateChargeId: idCreateRule,
                  }}
                >
                  <ButtonComponent type="submit">YES</ButtonComponent>
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
                <p className="pl-[70px]">{`Late Charge has been created, do you want to create late charge rule for this data?`}</p>
              </div>
            </div>
          </Modal>
        ) : null}
      </Spin>
    </LayoutMenu>
  );
};

export default FormLateCharges;
