import React, { useCallback, useEffect, useState } from "react";
import { Form, Modal, Spin } from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import PricingSectionForm from "./Form/PricingSectionForm";
import ApprovalSectionForm from "./Form/ApprovalSectionForm";
import AttachmentSectionForm from "./Form/AttachmentSectionForm";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import PricingDetailTableDetail from "./Form/PricingDetailTableDetail";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { LeftOutlined } from "@ant-design/icons";
import RadioTabs from "../../../../components/RadioTabs";
import { useDispatch, useSelector } from "react-redux";
import {
  createPricingBody,
  getDetailDraftPricingGeneral,
  getDetailPricingGeneral,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  getListCriteria,
  updatePricingBody,
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
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
} from "../../../../redux/slices/product_promo/pricing";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ContentModalConfirmPricing from "./Form/ContentModalConfirmPricing";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import moment, { isMoment } from "moment";
import { bytesConverter } from "../../../../utils/bytesConverter";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../components/Modal/ModalBack";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { handleMandatory } from "../Product/utils";
import { handleCheckCriteriaMissingValidation, handleDisabledEachColumnCriteria } from "../UtilsProduct/UtilsAllProduct";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";
import { dateFormatting, hasValue } from "../../../../utils";

const routes = (type) => [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRICING,
    breadcrumbName: "Pricing",
  },
  {
    path: "",
    breadcrumbName: `${
      type === "update" ? "Update Pricing" : "Create Pricing"
    }`,
  },
];

const listTypeSubmit = ["submit", "draft"];
const listSectionPricingDetail = [{ value: "Detail" }, { value: "Criteria" }];
const PricingForm = (props) => {
  const dispatch = useDispatch();
  const { type } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, statusPricing, statusApprovalPricing } = location?.state || {};
  const {
    dataDetailPricingGeneral,
    dataDetailDraftPricingGeneral,
    loadingPricing,
    dataListCriteria,
    dataListAppHierId,
    dataListAppHierDetail,
    dataListUom,
    dataListCurrency,
  } = useSelector((state) => state.pricing);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Pricing", paramValue: ["priceCode", "criteria"] },
    { value: "Approval", paramValue: ["approvalHierarchy"] },
    { value: "Attachment" },
  ]);
  const formValue = form.getFieldsValue();
  const [typePricingInfo, setTypePricingInfo] = useState(
    listSectionInfo[0].value
  );
  const [typePricingDetail, setTypePricingDetail] = useState(
    listSectionPricingDetail[0].value
  );
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [priceCode, setPriceCode] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [typeSubmit, setTypeSubmit] = useState(listTypeSubmit[0]);
  const [idPricing, setIdPricing] = useState();
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [storedDataInline, setStoredDataInline] = useState(false);

  const isLoading = loadingPricing || loadingForm;
  // const disableSubmit = useMemo(
  //   () => listDataDetail.length === 0,
  //   [listDataDetail]
  // );

  useEffect(() => {
    dispatch(getListCriteria());
    dispatch(getListAppHier());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailPricingGeneral({ id }));
      dispatch(getDetailDraftPricingGeneral({ id }));
    }
  }, [dispatch, id, type, statusPricing, statusApprovalPricing]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const getCriteriaIdByCode = useCallback(
    (code) => criteriaOptions.find((option) => option.code === code)?.value,
    [criteriaOptions]
  );

  const applySelectCriteriaCascade = useCallback(
    (values) => {
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
    },
    [getCriteriaIdByCode]
  );

  const applyDeselectCriteriaCascade = useCallback(
    (values, deselectedValue) => {
      const countryId = getCriteriaIdByCode("COUNTRY");
      let res = values.filter((item) => item !== deselectedValue);
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
      return outputArray;
    },
    [getCriteriaIdByCode]
  );

  const asserData = useCallback(
    (dataDetailPricingGeneral) => {
      const criteria = applySelectCriteriaCascade(
        (dataDetailPricingGeneral?.rPricingCriterias || []).map(
          (item) => item.criteria
        )
      );
      const appHier = dataDetailPricingGeneral?.appHierId || 1;
      const obj = {
        priceCode: dataDetailPricingGeneral?.priceCode,
        priceDescription: dataDetailPricingGeneral?.priceDescription,
        criteria: criteria,
        approvalHierarchy: appHier,
      };
      form.setFieldsValue(obj);
      setPriceCode(dataDetailPricingGeneral?.priceCode);
      setCriteriaValues(criteria);
      setSelectedHierarchy(appHier);
      setListDataAttachment(
        (dataDetailPricingGeneral?.mAttachments || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
      
      setListDataDetail(
        (dataDetailPricingGeneral?.mPricingDetails || []).map(
          (priceData, index) => ({
            ...priceData,
            key: index + 1,
            currency: priceData?.currencyId?.label,
            uom: priceData?.uomId?.label,
            currencyIds: priceData?.currencyId?.value,
            uomIds: priceData?.uomId?.value,
            startDate: priceData?.startDate ? moment(priceData.startDate, "DD-MMM-YYYY").format("YYYY-MM-DD") : undefined,
            endDate: priceData?.endDate
              ? moment(priceData.endDate, "DD-MMM-YYYY").format("YYYY-MM-DD")
              : undefined,
            type: "exist",
            uomId: undefined,
            currencyId: undefined,
          })
        )
      );

      const dataCriteriaList = (dataDetailPricingGeneral.criteriasValue || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          let obj = { key: index + 1 };
          for (const attr in item) {
            if (
              hasValue(item[attr]) && 
              typeof item[`${attr}`] === "object" &&
              item[attr] !== null &&
              !attr?.toLowerCase()?.includes("date")
            ) {
              obj[`${attr?.replace(/Id/, '')}`] = {
                label: item[attr]?.label || item[attr]?.name,
                value: item[attr]?.value,
              };
            } else {
              obj[attr] = item[attr];
            }
          }
          Object.keys(obj).forEach(key => {
            if (key.includes('Id')) {
              delete obj[key];
            }
          });
          
          return obj;
        });
        // console.log(dataCriteriaList,"test biasa");
        
      setListDataCriteria(
        handleDisabledEachColumnCriteria({
          dataDetail: dataCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          dataCompare: [],
          idName: "idPricing",
          idCompare: "idPricing",
          status: dataDetailPricingGeneral?.status,
          statusApproval: dataDetailPricingGeneral?.statusApproval,
          columnsTable: columnsTableCriteriaAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode("COUNTRY")
          ),
          dataListCriteria: dataListCriteria?.map((item) =>{
            return {
              ...item,
              id: item.glbTypeValId,
              name: item.name,
            }
          }),
        })
      );
    },
    [form, applySelectCriteriaCascade]
  );

  const asserDataDraft = useCallback(
    (dataDetailPricingGeneral, dataDetailDraftPricingGeneral) => {
      const criteria = applySelectCriteriaCascade(
        (dataDetailDraftPricingGeneral?.rPricingCriterias || []).map(
          (item) => item.criteria
        )
      );
      const appHier = dataDetailDraftPricingGeneral?.appHierId || 1;
      const obj = {
        priceCode: dataDetailDraftPricingGeneral?.priceCode,
        priceDescription: dataDetailDraftPricingGeneral?.priceDescription,
        criteria: criteria,
        approvalHierarchy: appHier,
      };
      form.setFieldsValue(obj);
      setPriceCode(dataDetailDraftPricingGeneral?.priceCode);
      setCriteriaValues(criteria);
      setSelectedHierarchy(appHier);
      setListDataAttachment(
        (dataDetailDraftPricingGeneral?.mAttachments || []).map(
          (attachData) => ({
            ...attachData,
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        )
      );
      setListDataDetail(
        (dataDetailDraftPricingGeneral?.mPricingDetails || []).map(
          (priceData, index) => {
            let obj = {
              ...priceData,
              key: index + 1,
              startDate: priceData?.startDate ? moment(priceData.startDate, "DD-MMM-YYYY").format("YYYY-MM-DD") : undefined,
              endDate: priceData.endDate
                ? moment(priceData.endDate, "DD-MMM-YYYY").format("YYYY-MM-DD")
                : undefined,
              type: "exist",
            };
            obj.currencyIds = parseInt(priceData?.currency);
            obj.uomIds = parseInt(priceData?.uom);
            obj.currency = priceData?.currencyName;
            obj.uom = priceData?.uomName;
            delete obj.uomName;
            delete obj.currencyName;
            return obj;
          }
        )
      );

      const dataCriteriaList = (dataDetailPricingGeneral.criteriasValue || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          let obj = { key: index + 1 };
          for (const attr in item) {
            if (
              hasValue(item[attr]) && 
              typeof item[attr] === "object" &&
              item[attr] !== null &&
              !attr?.toLowerCase()?.includes("date")
            ) {
              obj[`${attr?.replace(/Id/, '')}`] = {
                label: item[attr]?.label || item[attr]?.name,
                value: item[attr]?.value,
              }
            } else {
              obj[attr] = item[attr];
            }
          }
          Object.keys(obj).forEach(key => {
            if (key.includes('Id')) {
              delete obj[key];
            }
          });

          return obj;
        });

      const dataDraftCriteriaList = (
        dataDetailDraftPricingGeneral.criteriasValue || []
      )
        .filter((item) => item?.allCriteria !== true)
        .map((item, index) => {
          let obj = { key: index + 1 };
          for (const attr in item) {
            if (
              hasValue(item[attr]) && 
              typeof item[attr] === "object" &&
              attr !== "id" &&
              attr !== "idPricing" &&
              !attr?.toLowerCase()?.includes("date")
            ) {
              obj[`${attr}`] = {
                label: item[`${attr}`]?.label,
                value: item[attr]?.value,
              };
            } else {
              obj[attr] = item[attr];
            }
          }
          return obj;
        });
        // console.log(dataCriteriaList,"test draft");
      setListDataCriteria(
        handleDisabledEachColumnCriteria({
          dataDetail: dataDraftCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          dataCompare: dataCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          idName: "idPricing",
          idCompare: "idPricing",
          status: dataDetailPricingGeneral?.status,
          statusApproval: dataDetailPricingGeneral?.statusApproval,
          columnsTable: columnsTableCriteriaAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode("COUNTRY")
          ),
          dataListCriteria: dataListCriteria?.map((item) =>{
            return {
              ...item,
              id: item.glbTypeValId,
              name: item.name,
            }
          }),
        })
      );
    },
    [form, applySelectCriteriaCascade]
  );

  useEffect(() => {
    if (id && type === "update" && dataDetailPricingGeneral && dataDetailDraftPricingGeneral?.id === id) {
      asserDataDraft( dataDetailPricingGeneral, {
        ...dataDetailDraftPricingGeneral,
        mAttachments: [
          ...(dataDetailDraftPricingGeneral?.mAttachments || []),
          ...(dataDetailPricingGeneral?.mAttachments || []),
        ],
      });
    } else if (
      id &&
      type === "update" &&
      !dataDetailDraftPricingGeneral?.id &&
      dataDetailPricingGeneral?.id === id
    ) {
      asserData(dataDetailPricingGeneral, {});
    }
  }, [
    id,
    type,
    dataDetailPricingGeneral,
    dataDetailDraftPricingGeneral,
    asserData,
    asserDataDraft,
  ]);

  useEffect(() => {
    if (dataListCriteria && dataListCriteria.length > 0) {
      const tempCriterias = dataListCriteria.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
        code: criteria?.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [dataListCriteria]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  const handleSelectCriteria = (value) => {
    const outputArray = applySelectCriteriaCascade([...criteriaValues, value]);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const outputArray = applyDeselectCriteriaCascade(criteriaValues, value);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  const handlePriceCode = (e) => {
    setPriceCode(e.target.value);
  };
  const handlePricingInfo = (e) => {
    if (!storedDataInline) {
      setTypePricingInfo(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };
  const handlePricingDetail = (e) => {
    if (!storedDataInline) {
      setTypePricingDetail(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  const handleSubmitForm = useCallback(
    async (value) => {
      // console.log(value);
      try {
        let errorBody = {};
        if (listDataAttachment.length === 0) {
          handleMandatory(setListSectionInfo, listDataAttachment); // attachment mandatory onFinish
        } else {
          handleMandatory(setListSectionInfo, listDataAttachment); // clearing all badge
          if (listDataDetail.length === 0) {
            errorBody = {
              title: "Failed",
              description: `Pricing Detail Mandatory. Please try again.`,
            };
            dispatch(showModalError(errorBody));
          } else if (storedDataInline) {
            errorBody = {
              title: "Failed",
              description: `Please save data table inline before submit. Please try again.`,
            };
            dispatch(showModalError(errorBody));
          } else if (
            handleCheckCriteriaMissingValidation(
              criteriaOptions,
              formValue?.criteria,
              listDataCriteria,
              () => {}
            )
          ) {
            const errorBody = {
              title: "Failed",
              description: `There is missing values in table criteria. Please try again`,
            };
            dispatch(showModalError(errorBody));
          } else {
            setListSectionInfo([
              { value: "Pricing", paramValue: ["priceCode", "criteria"] },
              { value: "Approval", paramValue: ["approvalHierarchy"] },
              { value: "Attachment" },
            ]);

            const tempMpricingDetails = listDataDetail.map((item) => {
              let obj = {
                ...item,
                value: item.value,
                startDate: moment(item.startDate).format(dateFormatting.date),
                endDate: item.endDate
                  ? moment(item.endDate).format(dateFormatting.date)
                  : undefined,
              };
              delete obj.key;
              delete obj.type;
              if (
                type === "create" ||
                (type === "update" && statusPricing === "DRAFT")
              ) {
                obj.currency = item.currencyIds;
                obj.uom = item.uomIds;
                delete obj.uomIds;
                delete obj.currencyIds;
              } else {
                obj.currencyName = item.currency;
                obj.uomName = item.uom;
                obj.currency = item.currencyIds;
                obj.uom = item.uomIds;
                delete obj.uomIds;
                delete obj.currencyIds;
              }
              delete obj.createdDate;
              delete obj.createdBy;
              delete obj.updatedDate;
              delete obj.updatedBy;
              return obj;
            });
            const tempRpricingCriterias = formValue.criteria.map((item) => {
              let dataDefault = [];
              if (type === "update") {
                let tempData =
                  id && dataDetailDraftPricingGeneral?.id === id
                    ? dataDetailDraftPricingGeneral
                    : dataDetailPricingGeneral;
                dataDefault = (tempData?.rPricingCriterias || []).filter(
                  (data) => data.criteria === item
                );
              }
              const itemName = criteriaOptions.filter(
                (criteria) => criteria.value === item
              );
              return {
                idPricing:
                  dataDefault.length > 0 ? dataDefault[0].idPricing : undefined,
                id: dataDefault.length > 0 ? dataDefault[0].id : undefined,
                criteria: item,
                criteriaName:
                  statusPricing === "ACTIVE" ? itemName[0]?.name : undefined,
              };
            });
            let tempCriteriasValue = listDataCriteria.map((item) => {
              let obj = {};
              for (const attr in item) {
                if (typeof item[attr] === "object" && item[attr] !== null) {
                  obj[attr] = isMoment(item[attr])
                    ? moment(item[attr]).format(dateFormatting.date)
                    : item[attr].value;
                  if (statusPricing === "ACTIVE") {
                    obj[`${attr}Name`] = item[attr].label;
                  }
                } else {
                  obj[attr] = item[attr];
                }
              }
              delete obj.updatedBy;
              delete obj.updatedDate;
              delete obj.createdBy;
              delete obj.createdDate;
              delete obj.dataType;
              return obj;
            });

            const filteredCriteria = columnsTableCriteriaAll(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              getCriteriaIdByCode("COUNTRY")
            ).filter(
              (item) =>
                !([...formValue.criteria, 1, 2, 3, 4, 5] || []).includes(
                  item.indexValue
                )
            );

            const filteredCriteria2 = columnsTableCriteriaAll(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              getCriteriaIdByCode("COUNTRY")
            ).filter((item) =>
              [...formValue.criteria, 1].includes(item.indexValue)
            );

            tempCriteriasValue = tempCriteriasValue.map((item) => {
              let obj = {
                id: item.id || undefined,
                idPricing: type === "update" ? id : null,
              };
              filteredCriteria2.forEach((criteria2) => {
                obj[criteria2.dataIndex] = item[criteria2.dataIndex];
                if (
                  statusPricing === "ACTIVE" &&
                  !criteria2?.dataIndex
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes("date")
                ) {
                  obj[`${criteria2.dataIndex}Name`] =
                    item[`${criteria2.dataIndex}Name`];
                }
              });
              filteredCriteria.forEach((criteria) => {
                obj[criteria.dataIndex] = null;
              });
              delete obj.key;
              return obj;
            });
            const includesAll = formValue.criteria.includes(24);
            const body = {
              id: type === "update" ? id : undefined,
              priceCode: formValue.priceCode,
              status:
                type !== "update"
                  ? "DRAFT"
                  : id && dataDetailDraftPricingGeneral?.id === id
                  ? dataDetailDraftPricingGeneral.status
                  : dataDetailPricingGeneral.status,
              priceDescription: formValue.priceDescription || null,
              // ccid: null,
              criteriasValue: includesAll
                ? [{ allCriteria: true }]
                : tempCriteriasValue,
              appHierId: formValue.approvalHierarchy,
              submit: typeSubmit === listTypeSubmit[0],
              mPricingDetails: tempMpricingDetails,
              rPricingCriterias: tempRpricingCriterias,
            };

            const validateValueObj = {
              body: body,
              services: productPromoHttpService,
              endPoint:
                type === "create"
                  ? "/v1/dbs/api/maintain-pricing/validate-create"
                  : "/v1/dbs/api/maintain-pricing/validate-update",
              type: type,
            };
            await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();

            setModalConfirm(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      criteriaOptions,
      dataDetailDraftPricingGeneral,
      dataDetailPricingGeneral,
      dispatch,
      formValue,
      id,
      listDataAttachment,
      listDataCriteria,
      listDataDetail,
      statusPricing,
      storedDataInline,
      type,
      typeSubmit,
    ]
  );
  
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataCriteria([]);
      setListDataDetail([]);
      setListDataAttachment([]);
    } else {
      if (id && dataDetailPricingGeneral && dataDetailDraftPricingGeneral?.id === id) {
        asserDataDraft(dataDetailPricingGeneral,{
          ...dataDetailDraftPricingGeneral,
          mAttachments: [
            ...(dataDetailDraftPricingGeneral?.mAttachments || []),
            ...(dataDetailPricingGeneral?.mAttachments || []),
          ],
        });
      } else if (
        id &&
        !dataDetailDraftPricingGeneral?.id &&
        dataDetailPricingGeneral?.id === id
      ) {
        asserData(dataDetailPricingGeneral, {});
      }
    }
    setStoredDataInline(false);
  };
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };
  const handleCancelModalSuccess = () => {
    setModalSuccess(false);
    navigate(-1);
  };
  const handleProcessModalConfirm = async () => {
    const tempMpricingDetails = listDataDetail.map((item) => {
      let obj = {
        ...item,
        value: item.value,
        startDate: moment(item.startDate).format(dateFormatting.date),
        endDate: item.endDate
          ? moment(item.endDate).format(dateFormatting.date)
          : undefined,
      };
      delete obj.key;
      delete obj.type;
      if (
        type === "create" ||
        (type === "update" && statusPricing === "DRAFT")
      ) {
        obj.currency = item.currencyIds;
        obj.uom = item.uomIds;
        delete obj.uomIds;
        delete obj.currencyIds;
      } else {
        obj.currencyName = item.currency;
        obj.uomName = item.uom;
        obj.currency = item.currencyIds;
        obj.uom = item.uomIds;
        delete obj.uomIds;
        delete obj.currencyIds;
      }
      delete obj.createdDate;
      delete obj.createdBy;
      delete obj.updatedDate;
      delete obj.updatedBy;
      return obj;
    });
    const tempRpricingCriterias = formValue.criteria.map((item) => {
      let dataDefault = [];
      if (type === "update") {
        let tempData =
          id && dataDetailDraftPricingGeneral?.id === id
            ? dataDetailDraftPricingGeneral
            : dataDetailPricingGeneral;
        dataDefault = (tempData?.rPricingCriterias || []).filter(
          (data) => data.criteria === item
        );
      }
      const itemName = criteriaOptions.filter(
        (criteria) => criteria.value === item
      );
      return {
        idPricing:
          dataDefault.length > 0 ? dataDefault[0].idPricing : undefined,
        id: dataDefault.length > 0 ? dataDefault[0].id : undefined,
        criteria: item,
        criteriaName: statusPricing === "ACTIVE" ? itemName[0].name : undefined,
      };
    });
    let tempCriteriasValue = listDataCriteria.map((item) => {
      let obj = {};
      for (const attr in item) {
        if (typeof item[attr] === "object" && item[attr] !== null) {
          obj[attr] = isMoment(item[attr])
          ? moment(item[attr]).format(dateFormatting.date)
          : item[attr].value;
          if (statusPricing === "ACTIVE") {
            obj[`${attr}Name`] = item[attr].label;
          }
        } else {
          obj[attr] = item[attr];
        }
      }
      delete obj.updatedBy;
      delete obj.updatedDate;
      delete obj.createdBy;
      delete obj.createdDate;
      delete obj.dataType;
      return obj;
    });

    const filteredCriteria = columnsTableCriteriaAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      getCriteriaIdByCode("COUNTRY")
    ).filter(
      (item) => !([...formValue.criteria, 1,2,3,4,5] || []).includes(item.indexValue)
    );

    const filteredCriteria2 = columnsTableCriteriaAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      getCriteriaIdByCode("COUNTRY")
    ).filter((item) =>
      ([...formValue.criteria, 1]).includes(item.indexValue)
    );

    tempCriteriasValue = tempCriteriasValue.map((item) => {
      let obj = {
        id: item.id || undefined,
        idPricing: type === "update" ? id : null,
      };
      filteredCriteria2.forEach((criteria2) => {
        obj[criteria2.dataIndex] = item[criteria2.dataIndex];
        if (
          statusPricing === "ACTIVE" &&
          !criteria2?.dataIndex
            ?.toString()
            ?.toLowerCase()
            ?.includes("date")
        ) {
          obj[`${criteria2.dataIndex}Name`] =
            item[`${criteria2.dataIndex}Name`];
        }
      });
      filteredCriteria.forEach((criteria) => {
        obj[criteria.dataIndex] = null;
      });
      delete obj.key;
      return obj;
    });
    const includesAll = formValue.criteria.includes(24);
    const body = {
      id: type === "update" ? id : undefined,
      priceCode: formValue.priceCode,
      status:
        type !== "update"
          ? "DRAFT"
          : id && dataDetailDraftPricingGeneral?.id === id
          ? dataDetailDraftPricingGeneral.status
          : dataDetailPricingGeneral.status,
      priceDescription: formValue.priceDescription || null,
      // ccid: null,
      criteriasValue: includesAll
        ? [{ allCriteria: true }]
        : tempCriteriasValue,
      appHierId: formValue.approvalHierarchy,
      submit: typeSubmit === listTypeSubmit[0],
      mPricingDetails: tempMpricingDetails,
      // mattachments: null,
      rPricingCriterias: tempRpricingCriterias,
      // createdDate:
      //   statusPricing === "ACTIVE"
      //     ? statusApprovalPricing === "APPROVED"
      //       ? dataDetailPricingGeneral.createdDate
      //       : dataDetailDraftPricingGeneral.createdDate
      //     : undefined,
      // createdBy:
      //   statusPricing === "ACTIVE"
      //     ? statusApprovalPricing === "APPROVED"
      //       ? dataDetailPricingGeneral.createdBy
      //       : dataDetailDraftPricingGeneral.createdBy
      //     : undefined,
    };
    // console.log(body);
    if (type === "create") {
      dispatch(createPricingBody(body))
        .unwrap()
        .then(async (data) => {
          const idPricing = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/maintain-pricing/uploadAttachment/${idPricing}`,
              body
            );
          }
          setLoadingForm(false);
          setIdPricing(idPricing);
          handleCancelModalConfirm();
          handleClear();
          setModalSuccess(true);
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updatePricingBody(body))
        .unwrap()
        .then(async (data) => {
          const idPricing = data.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/maintain-pricing/uploadAttachment/${idPricing}`,
              body
            );
          }
          setLoadingForm(false);
          setIdPricing(idPricing);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataCriteria([]);
          setListDataDetail([]);
          setListDataAttachment([]);
          setModalSuccess(true);
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };
  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    // setListSectionInfo((prevState) => {
    //   const res = prevState.map((item) => {
    //     if (!item.paramValue || item.paramValue.length < 0) {
    //       return {
    //         value: item.value,
    //         paramValue: item.paramValue,
    //       };
    //     }
    //     const errorBadge = errorFields.reduce(
    //       (current, next) =>
    //         item.paramValue.includes(next.name[0]) ? current + 1 : current,
    //       0
    //     );
    //     return {
    //       value: item.value,
    //       paramValue: item.paramValue,
    //       errorBadge,
    //     };
    //   });
    //   return res;
    // });
    handleMandatory( setListSectionInfo, listDataAttachment, errorFields );
  };
  const formatCriteria = (data = []) => {
    const tempArray = criteriaOptions.filter((item) =>
      data.includes(item.value)
    );
    return tempArray.map((data) => data.name);
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

  const wordSuccess = () => {
    if (type === "update") {
      return typeSubmit === listTypeSubmit[1] ? "updated" : "submitted";
    } else {
      return typeSubmit === listTypeSubmit[1] ? "created" : "submitted";
    }
  };
  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes(type)} />
        <RadioTabs
          data={listSectionInfo}
          onChange={handlePricingInfo}
          currentPosition={typePricingInfo}
        />
        <Form
          id="pricingForm"
          form={form}
          layout={"vertical"}
          onFinish={handleSubmitForm}
          onFinishFailed={handleErrorSubmit}
          scrollToFirstError={true}
        >
          <BaseContainer header={`${typePricingInfo} INFORMATION`}>
            <div
              style={{
                display:
                  typePricingInfo !== listSectionInfo[0].value
                    ? "none"
                    : undefined,
              }}
            >
              <PricingSectionForm
                criteriaOptions={criteriaOptions}
                handlePriceCode={handlePriceCode}
                handleSelectCriteria={handleSelectCriteria}
                handleDeselectCriteria={handleDeselectCriteria}
                handleClearCriteria={handleClearCriteria}
                type={type}
                status={dataDetailPricingGeneral?.status}
              />
            </div>
            <div
              style={{
                display:
                  typePricingInfo !== listSectionInfo[1].value
                    ? "none"
                    : undefined,
              }}
            >
              <ApprovalSectionForm
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </div>
            <div
              style={{
                display:
                  typePricingInfo !== listSectionInfo[2].value
                    ? "none"
                    : undefined,
              }}
            >
              <AttachmentSectionForm
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                mandatory={true}
              />
            </div>
          </BaseContainer>
          {typePricingInfo === listSectionInfo[0].value ? (
            <BaseContainer
              header={"PRICING DETAIL INFORMATION"}
              type="tabs"
              element={
                <RadioTabs
                  data={listSectionPricingDetail}
                  onChange={handlePricingDetail}
                  currentPosition={typePricingDetail}
                />
              }
            >
              {typePricingDetail === listSectionPricingDetail[0].value ? (
                <PricingDetailTableDetail
                  type={type}
                  data={listDataDetail}
                  priceCode={priceCode}
                  updateData={setListDataDetail}
                  dispatch={dispatch}
                  status={statusPricing}
                />
              ) : (
                <FunctionalCriteriaProduct
                type={type}
                data={listDataCriteria || []} //data
                dataCriteria={criteriaValues || []} //ddl
                updateData={setListDataCriteria}
                setStoredData={setStoredDataInline}
                storedData={storedDataInline}
                // startDate={startDate ? moment(startDate) : undefined}
                selector="pricing"
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
                checkStartDate={false}
              />
                // <PricingDetailTableCriteria
                //   type={type}
                //   data={listDataCriteria}
                //   dataCriteria={criteriaValues}
                //   updateData={setListDataCriteria}
                //   dispatch={dispatch}
                //   setStoredData={setStoredDataInline}
                //   storedData={storedDataInline}
                // />
              )}
            </BaseContainer>
          ) : null}
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
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setTypeSubmit(listTypeSubmit[1])}
                // disabled={disableSubmit}
              >
                Save as Draft
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setTypeSubmit(listTypeSubmit[0])}
                // disabled={disableSubmit}
              >
                Save & Submit
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
            <ContentModalConfirmPricing
              data={formValue}
              listSectionInfo={listSectionInfo}
              listSectionPricingDetail={listSectionPricingDetail}
              listDataAttachment={listDataAttachment}
              listDataDetail={listDataDetail}
              listDataCriteria={listDataCriteria}
              listDataAppHierDetail={appHierDataDetail}
              criteriaValues={criteriaValues}
              listCriteria={formatCriteria(formValue.criteria || [])}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              countryCriteriaId={getCriteriaIdByCode("COUNTRY")}
            />
          </ModalCustom>
        ) : null}
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/** Modal Success */}
        <Modal
          open={modalSuccess}
          onCancel={handleCancelModalSuccess}
          className={"modal-custom"}
          centered={true}
          width={500}
          maskClosable={false}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent
                onClick={handleCancelModalSuccess}
                type="default"
              >
                OK
              </ButtonComponent>
              <Link
                to={PRODUCT_PROMO_ROUTES.CREATE_PRICING_ADJUSTMENT}
                state={{
                  id: idPricing,
                  prevPage: `${
                    type === "update" ? "update" : "create"
                  }-pricing`,
                }}
              >
                <ButtonComponent type="submit">
                  Create Price Adjustment
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
              <p className="pl-[70px]">{`Your data has been ${wordSuccess()}.`}</p>
            </div>
          </div>
        </Modal>

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
            <p className="pl-[70px]">{`Your data was not ${wordSuccess()}. ${
              bodyError.message
            }.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default PricingForm;
