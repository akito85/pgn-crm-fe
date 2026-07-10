import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BaseContainer from "../../../../components/BaseContainer";
import { PricingAdjustPriceInfo } from "./PricingAdjustPriceInfo";
import PricingDetailTableDetail from "../Pricing/Form/PricingDetailTableDetail";
import RadioTabs from "../../../../components/RadioTabs";
import ApprovalSectionForm from "../Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import PricingAdjustSectionForm from "./PricingAdjustSectionForm";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ContentModalConfirmPriceAdjust from "./ContentModalConfirmPriceAdjust";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailPricing,
  getListCriteria,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  getAllPricingDetailActive,
  createPriceAdjustBody,
  getDetailPricingAdjustGeneral,
  getDetailDraftPricingAdjustGeneral,
  updatePriceAdjustBody,
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
  getAdjustmentTypeList,
} from "../../../../redux/slices/product_promo/pricingAdjust";
import {
  getDetailDraftPricingGeneral,
  getDetailPricingGeneral,
} from "../../../../redux/slices/product_promo/pricing";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../components/Modal/ModalBack";
import moment from "moment";
import { bytesConverter } from "../../../../utils/bytesConverter";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { applyLocationCriteriaCascade, applyDeselectLocationCriteriaCascade, getCriteriaIdByCode, handleCheckCriteriaMissingValidation } from "../UtilsProduct/UtilsAllProduct";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

const routes = (routeExt) => [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  ...routeExt,
];

const listTypeSubmit = ["submit", "draft"];
const PricingAdjustForm = (props) => {
  const { type } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [listDataDetailPricingAdjust, setListDataDetailPricingAdjust] =
    useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [selectedData, setSelectedData] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(listTypeSubmit[0]);
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Price Adjustment",
      paramValue: ["adjustName", "criteria"],
    },
    { value: "Approval", paramValue: ["approvalHierarchy"] },
    { value: "Attachment" },
  ]);
  const [typePriceAdjustInfo, setTypePriceAdjustInfo] = useState(
    listSectionInfo[0].value
  );
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [bodyPricing, setBodyPricing] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [mPricingDetailsId, setMPricingDetailsId] = useState();
  const {
    dataListCriteria,
    dataDetailPricing,
    dataListAppHierId,
    dataListAppHierDetail,
    dataListPricingDetailActive,
    loadingPricingAdjust,
    dataDetailPricingAdjustGeneral = {},
    dataDetailDraftPricingAdjustGeneral = {},
  } = useSelector((state) => state.pricingAdjust);
  const {
    dataDetailPricingGeneral,
    dataDetailDraftPricingGeneral,
    loadingPricing,
  } = useSelector((state) => state.pricing);
  const {
    prevPage = "",
    id,
    statusPriceAdjust,
    statusApprovalPriceAdjust,
  } = location.state || {};

  const isLoading = loadingForm || loadingPricingAdjust || loadingPricing;

  useEffect(() => {
    if (
      (id && !prevPage) ||
      (prevPage !== "create-pricing" &&
        prevPage !== "detail-pricing" &&
        prevPage !== "update-pricing" &&
        prevPage !== "table-price-adjust")
    ) {
      navigate(-1);
    } else {
      dispatch(getListCriteria());
      if (id) {
        if (
          prevPage !== "detail-pricing" &&
          prevPage !== "table-price-adjust"
        ) {
          dispatch(getAllPricingDetailActive({ id }));
          if (prevPage === "create-pricing") {
            dispatch(getDetailPricingGeneral({ id }));
          } else {
            dispatch(getDetailDraftPricingGeneral({ id }));
          }
        } else {
          dispatch(getListAppHier());
          if (type === "create" && prevPage === "detail-pricing") {
            dispatch(getDetailPricing({ id }));
          } else {
            if (type === "update") {
              dispatch(getDetailPricingAdjustGeneral({ id }));
              dispatch(getDetailDraftPricingAdjustGeneral({ id }));
            }
          }
        }
      }
    }
  }, [
    dispatch,
    navigate,
    id,
    type,
    statusPriceAdjust,
    statusApprovalPriceAdjust,
    prevPage,
  ]);

  const asserData = useCallback(
    (dataDetailPricingAdjustGeneral) => {
      // console.log(dataDetailPricingAdjustGeneral);
      const criteria = applyLocationCriteriaCascade(
        (dataDetailPricingAdjustGeneral?.rcriteriaPricingAdjustments || []).map(
          (item) => item.criteria
        ),
        criteriaOptions
      );
      const appHier =
        dataDetailPricingAdjustGeneral?.apphierId ||
        dataDetailPricingAdjustGeneral?.appHierId ||
        1;
      const obj = {
        adjustName: dataDetailPricingAdjustGeneral?.name,
        priceAdjustDescription: dataDetailPricingAdjustGeneral?.description,
        criteria: criteria,
        approvalHierarchy: appHier,
      };
      form.setFieldsValue(obj);
      setMPricingDetailsId(dataDetailPricingAdjustGeneral?.mpricingDetailId);
      setCriteriaValues(criteria);
      setSelectedHierarchy(appHier);
      setListDataAttachment(
        (dataDetailPricingAdjustGeneral?.mattachments || []).map(
          (attachData) => ({
            ...attachData,
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        )
      );
      setListDataDetailPricingAdjust(
        (dataDetailPricingAdjustGeneral?.mpricingAdjustmentDetails || [])
          .filter((item) => !item?.allCriteria || !item?.allCriteria !== true)
          .map((adjustData, index) => {
            const listIndex = columnsTableCriteriaAll(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
            ).filter(
              (item) => !([1,2,3,4,5]).includes(item.indexValue)
            ).map(
              (item) => item.dataIndex
            );
            let obj = {
              adjustmentType: {
                label: adjustData.adjustmentTypeName || "",
                value: adjustData.adjustmentType,
              },
              adjustmentValue: adjustData.adjustmentValue?.toFixed(2),
              description: adjustData.description || undefined,
              startDate: adjustData.startDate
                ? moment(adjustData.startDate, "DD-MM-YYYY")
                : undefined,
              endDate: adjustData.endDate
                ? moment(adjustData.endDate, "DD-MM-YYYY")
                : undefined,
              key: index + 1,
              typeData: "exist",
            };
            listIndex.forEach((item) => {
              obj[item] = {
                label: adjustData[`${item}Name`],
                value: adjustData[`${item}`],
              };
            });
            return obj;
          })
      );
    },
    [form, criteriaOptions]
  );

  useEffect(() => {
    if (
      id &&
      type === "update" && 
      dataDetailPricingAdjustGeneral && 
      dataDetailDraftPricingAdjustGeneral?.id === id
    ) {
      asserData({
        ...dataDetailDraftPricingAdjustGeneral,
        mattachments: [
          ...(dataDetailPricingAdjustGeneral?.mattachments || []),
          ...(dataDetailDraftPricingAdjustGeneral?.mattachments || []),
        ],
      });
    } else if (
      id &&
      type === "update" &&
      !dataDetailDraftPricingAdjustGeneral?.id &&
      dataDetailPricingAdjustGeneral?.id === id
    ) {
      asserData(dataDetailPricingAdjustGeneral);
    }
  }, [
    id,
    type,
    dataDetailPricingAdjustGeneral,
    dataDetailDraftPricingAdjustGeneral,
    asserData,
  ]);

  useEffect(() => {
    if (dataListCriteria && dataListCriteria.length > 0) {
      const tempCriterias = dataListCriteria.map((criteria) => ({
        name: criteria.name,
        value: criteria.glbTypeValId,
        code:criteria?.glbValue,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [dataListCriteria]);

  useEffect(() => {
    if (
      (prevPage === "create-pricing" || prevPage === "update-pricing") &&
      dataDetailPricingGeneral &&
      dataDetailPricingGeneral.priceCode
    ) {
      setBodyPricing({
        priceCode: dataDetailPricingGeneral.priceCode,
        description: dataDetailPricingGeneral.priceDescription,
      });
      setSelectedHierarchy(dataDetailPricingGeneral.appHierId);
    }
  }, [prevPage, dataDetailPricingGeneral]);

  useEffect(() => {
    if (
      prevPage === "update-pricing" &&
      dataDetailDraftPricingGeneral &&
      dataDetailDraftPricingGeneral.priceCode
    ) {
      setBodyPricing({
        priceCode: dataDetailDraftPricingGeneral.priceCode,
        description: dataDetailDraftPricingGeneral.priceDescription,
      });
      setSelectedHierarchy(dataDetailDraftPricingGeneral.appHierId);
    }
  }, [prevPage, dataDetailDraftPricingGeneral]);

  useEffect(() => {
    if (mPricingDetailsId) {
      dispatch(getDetailPricing({ id: mPricingDetailsId }));
    }
  }, [dispatch, mPricingDetailsId]);

  useEffect(() => {
    if (dataDetailPricing && dataDetailPricing.priceCode) {
      setBodyPricing({
        priceCode: dataDetailPricing.priceCode,
        currency: dataDetailPricing.currency,
        value: dataDetailPricing.value,
        uom: dataDetailPricing.uom,
      });
    }
  }, [dataDetailPricing]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

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

  useEffect(() => {
    if (dataListPricingDetailActive && dataListPricingDetailActive.length) {
      setListDataDetail(
        (dataListPricingDetailActive || []).map((priceData) => ({
          ...priceData,
          currencyIds: priceData.currencyId,
          uomIds: priceData.uomId,
          startDate: moment(priceData.startDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          endDate: priceData.endDate
            ? moment(priceData.endDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            : undefined,
          type: "exist",
          uomId: undefined,
          currencyId: undefined,
        }))
      );
    }
  }, [dataListPricingDetailActive]);

  useEffect(() => {
    if (
      (prevPage === "create-pricing" || prevPage === "update-pricing") &&
      listDataDetail.length > 0 &&
      !selectedData?.id
    ) {
      setSelectedData(listDataDetail[0]);
    }
  }, [listDataDetail, prevPage]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  const defineRoute = () => {
    if (type === "create") {
      if (
        prevPage &&
        (prevPage === "create-pricing" ||
          prevPage === "detail-pricing" ||
          prevPage === "update-pricing")
      ) {
        let temp = [
          {
            path: PRODUCT_PROMO_ROUTES.VIEW_PRICING,
            breadcrumbName: "Pricing",
          },
        ];
        switch (prevPage) {
          case "create-pricing":
            temp.push({
              path: "",
              breadcrumbName: "Create Pricing",
            });
            break;
          case "update-pricing":
            temp.push({
              path: "",
              breadcrumbName: "Update Pricing",
            });
            break;
          case "detail-pricing":
            temp.push({
              path: "",
              breadcrumbName: "Detail Pricing",
            });
            break;
          default:
            break;
        }
        temp.push({
          path: "",
          breadcrumbName: "Create Price Adjustment",
        });
        return temp;
      }
      return [];
    } else {
      return [
        {
          path: "",
          breadcrumbName: "Price Adjustment",
        },
        {
          path: "",
          breadcrumbName: "Update Price Adjustment",
        },
      ];
    }
  };

  const handlePriceAdjustInfo = (e) => {
    if (!storedDataInline) {
      setTypePriceAdjustInfo(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  const handleSelectCriteria = (value) => {
    const outputArray = applyLocationCriteriaCascade(
      [...criteriaValues, value],
      criteriaOptions
    );
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const outputArray = applyDeselectLocationCriteriaCascade(
      criteriaValues,
      value,
      criteriaOptions
    );
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  const handleSubmitForm = useCallback(
    async (value) => {
      // console.log(value);
      try {
        let errorBody = {};
        if (
          type === "create" &&
          (prevPage === "create-pricing" || prevPage === "update-pricing") &&
          (!selectedData?.currency ||
            !selectedData?.value ||
            !selectedData?.uom)
        ) {
          errorBody = {
            title: "Failed",
            description: `Currency, UOM or value must be fill!. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else if (
          handleCheckCriteriaMissingValidation(
            criteriaOptions,
            formValue?.criteria,
            listDataDetailPricingAdjust,
            () => {}
          )
        ) {
          const errorBody = {
            title: "Failed",
            description: `There is missing values in table criteria. Please try again`,
          };
          dispatch(showModalError(errorBody));
        } else if (storedDataInline) {
          errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else {
          setListSectionInfo([
            {
              value: "Price Adjustment",
              paramValue: ["adjustName", "criteria", "description"],
            },
            { value: "Approval", paramValue: ["approvalHierarchy"] },
            { value: "Attachment" },
          ]);

          const mpricingDetailIdData = () => {
            let temp;
            if (
              prevPage === "create-pricing" ||
              prevPage === "update-pricing"
            ) {
              temp = selectedData.id;
            } else if (type === "create" && prevPage === "detail-pricing") {
              temp = id;
            } else {
              temp = mPricingDetailsId;
            }
            return temp;
          };
          const temprcriteriaPricingAdjustments = formValue.criteria.map(
            (item) => {
              let dataDefault = [];
              if (type === "update") {
                let tempData =
                  id && dataDetailDraftPricingAdjustGeneral?.id === id
                    ? dataDetailDraftPricingAdjustGeneral
                    : dataDetailPricingAdjustGeneral;
                dataDefault = (
                  tempData?.rcriteriaPricingAdjustments || []
                ).filter((data) => data.criteria === item);
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
                  statusPriceAdjust === "ACTIVE" ? itemName[0].name : undefined,
              };
            }
          );
          let mpricingAdjustmentDetails = listDataDetailPricingAdjust.map(
            (item) => {
              let obj = {};
              for (const attr in item) {
                if (
                  typeof item[attr] === "object" &&
                  item[attr] !== null &&
                  attr !== "startDate" &&
                  attr !== "endDate"
                ) {
                  obj[attr] = item[attr].value;
                  if (statusPriceAdjust === "ACTIVE") {
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
            }
          );

          const filteredCriteria = columnsTableCriteriaAll(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
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
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
            ).filter((item) =>
            [...formValue.criteria].includes(item.indexValue)
          ); // no need for startdate because already handled at body

          mpricingAdjustmentDetails = mpricingAdjustmentDetails.map((item) => {
            let obj = {
              id: item.id || undefined,
              pricingAdjustmentId: type === "update" ? id : null,
              adjustmentType: item.adjustmentType,
              adjustmentTypeName: item.adjustmentTypeName || undefined,
              adjustmentValue: item.adjustmentValue
                ? parseFloat(item.adjustmentValue)
                : 0,
              startDate: item.startDate
                ? moment(item.startDate).format("DD-MM-YYYY")
                : "",
              endDate: item.endDate
                ? moment(item.endDate).format("DD-MM-YYYY")
                : "",
              description: item.description,
            };
            filteredCriteria2.forEach((criteria2) => {
              obj[criteria2.dataIndex] = item[criteria2.dataIndex];
              if (statusPriceAdjust === "ACTIVE") {
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
          const payloadPriceAdjust = {
            id: type === "update" ? id : undefined,
            name: formValue?.adjustName,
            status:
              type !== "update"
                ? "DRAFT"
                : id && dataDetailDraftPricingAdjustGeneral?.id === id
                ? dataDetailDraftPricingAdjustGeneral.status
                : dataDetailPricingAdjustGeneral.status,
            description: formValue?.priceAdjustDescription || null,
            mpricingDetailId: mpricingDetailIdData(),
            appHierId: selectedHierarchy,
            submit: typeSubmit === listTypeSubmit[0],
            mpricingAdjustmentDetails: includesAll
              ? [{ allCriteria: true }]
              : mpricingAdjustmentDetails,
            rcriteriaPricingAdjustments: temprcriteriaPricingAdjustments,
            pricingAdjustmentId:
              type !== "update"
                ? undefined
                : id && dataDetailDraftPricingAdjustGeneral?.id === id
                ? dataDetailDraftPricingAdjustGeneral.pricingAdjustmentId
                : dataDetailPricingAdjustGeneral.pricingAdjustmentId,
          };

          const validateValueObj = {
            body: payloadPriceAdjust,
            services: productPromoHttpService,
            endPoint:
              type === "create"
                ? "/v1/dbs/api/price-adjustment/validate-create"
                : "/v1/dbs/api/price-adjustment/validate-update",
            type: type,
          };
          await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();

          setModalConfirm(true);
        }
      } catch (error) {
        console.log(error);
      }
      // form.resetFields();
    },
    [
      type,
      prevPage,
      selectedData,
      criteriaOptions,
      formValue,
      listDataDetailPricingAdjust,
      storedDataInline,
      dispatch,
      id,
      dataDetailDraftPricingAdjustGeneral,
      dataDetailPricingAdjustGeneral,
      selectedHierarchy,
      typeSubmit,
      mPricingDetailsId,
      statusPriceAdjust,
    ]
  );

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataDetailPricingAdjust([]);
      setListDataAttachment([]);
    } else {
      if (id && dataDetailDraftPricingAdjustGeneral?.id === id) {
        asserData({
          ...dataDetailDraftPricingAdjustGeneral,
          mattachments: [
            ...(dataDetailPricingAdjustGeneral?.mattachments || []),
            ...(dataDetailDraftPricingAdjustGeneral?.mattachments || []),
          ],
        });
      } else if (
        id &&
        !dataDetailDraftPricingAdjustGeneral?.id &&
        dataDetailPricingAdjustGeneral?.id === id
      ) {
        asserData(dataDetailPricingAdjustGeneral);
      }
    }
    setStoredDataInline(false);
  };
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };
  const handleProcessModalConfirm = () => {
    // console.log(listDataAttachment, listDataDetailPricingAdjust, formValue);
    const mpricingDetailIdData = () => {
      let temp;
      if (prevPage === "create-pricing" || prevPage === "update-pricing") {
        temp = selectedData.id;
      } else if (type === "create" && prevPage === "detail-pricing") {
        temp = id;
      } else {
        temp = mPricingDetailsId;
      }
      return temp;
    };
    const temprcriteriaPricingAdjustments = formValue.criteria.map((item) => {
      let dataDefault = [];
      if (type === "update") {
        let tempData =
          id && dataDetailDraftPricingAdjustGeneral?.id === id
            ? dataDetailDraftPricingAdjustGeneral
            : dataDetailPricingAdjustGeneral;
        dataDefault = (tempData?.rcriteriaPricingAdjustments || []).filter(
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
          statusPriceAdjust === "ACTIVE" ? itemName[0].name : undefined,
      };
    });
    let mpricingAdjustmentDetails = listDataDetailPricingAdjust.map((item) => {
      let obj = {};
      for (const attr in item) {
        if (
          typeof item[attr] === "object" &&
          item[attr] !== null &&
          attr !== "startDate" &&
          attr !== "endDate"
        ) {
          obj[attr] = item[attr].value;
          if (statusPriceAdjust === "ACTIVE") {
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
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
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
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
            ).filter((item) =>
      ([...formValue.criteria]).includes(item.indexValue)
    ); // no need for startdate because already handled at body

    mpricingAdjustmentDetails = mpricingAdjustmentDetails.map((item) => {
      let obj = {
        id: item.id || undefined,
        pricingAdjustmentId: type === "update" ? id : null,
        adjustmentType: item.adjustmentType,
        adjustmentTypeName: item.adjustmentTypeName || undefined,
        adjustmentValue: item.adjustmentValue ? parseFloat(item.adjustmentValue) : 0,
        startDate: item.startDate
          ? moment(item.startDate).format("DD-MM-YYYY")
          : "",
        endDate: item.endDate ? moment(item.endDate).format("DD-MM-YYYY") : "",
        description: item.description,
      };
      filteredCriteria2.forEach((criteria2) => {
        obj[criteria2.dataIndex] = item[criteria2.dataIndex];
        if (statusPriceAdjust === "ACTIVE") {
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
    const payloadPriceAdjust = {
      id: type === "update" ? id : undefined,
      name: formValue?.adjustName,
      status:
        type !== "update"
          ? "DRAFT"
          : id && dataDetailDraftPricingAdjustGeneral?.id === id
          ? dataDetailDraftPricingAdjustGeneral.status
          : dataDetailPricingAdjustGeneral.status,
      description: formValue?.priceAdjustDescription || null,
      mpricingDetailId: mpricingDetailIdData(),
      appHierId: selectedHierarchy,
      submit: typeSubmit === listTypeSubmit[0],
      mpricingAdjustmentDetails: includesAll
        ? [{ allCriteria: true }]
        : mpricingAdjustmentDetails,
      rcriteriaPricingAdjustments: temprcriteriaPricingAdjustments,
      pricingAdjustmentId:
        type !== "update"
          ? undefined
          : id && dataDetailDraftPricingAdjustGeneral?.id === id
          ? dataDetailDraftPricingAdjustGeneral.pricingAdjustmentId
          : dataDetailPricingAdjustGeneral.pricingAdjustmentId,
    };
    // console.log(payloadPriceAdjust);
    if (type === "create") {
      dispatch(createPriceAdjustBody(payloadPriceAdjust))
        .unwrap()
        .then(async (data) => {
          const idPriceAdjust = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/price-adjustment/uploadAttachment/${idPriceAdjust}`,
              body
            );
          }
          setLoadingForm(false);
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
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updatePriceAdjustBody(payloadPriceAdjust))
        .unwrap()
        .then(async () => {
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
              `/v1/dbs/api/price-adjustment/uploadAttachment/${id}`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataDetailPricingAdjust([]);
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
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  const selectedPriceCode = () => {
    if (selectedData?.currency && selectedData?.uom) {
      return `${selectedData.currency}/${selectedData.value}/${selectedData.uom}`;
    }
    return "-";
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

  const formatCriteria = (data = []) => {
    const tempArray = criteriaOptions.filter((item) =>
      data.includes(item.value)
    );
    return tempArray.map((data) => data.name);
  };

  const handleOkBack = () => {
    if (prevPage !== "update-pricing" && prevPage !== "create-pricing") {
      navigate(-1);
    } else {
      navigate(PRODUCT_PROMO_ROUTES.VIEW_PRICING);
    }
  };

  const handleCancelModalSuccess = () => {
    setModalSuccess(false);
    handleOkBack();
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
      <Spin spinning={isLoading} className={"w-full top-20"} tip={"Loading..."}>
        <BreadCrumb routes={routes(defineRoute())} />
        <Form
          id="priceAdjustForm"
          form={form}
          layout={"vertical"}
          onFinish={handleSubmitForm}
          onFinishFailed={
            !(type === "create" && prevPage === "create-pricing")
              ? handleErrorSubmit
              : undefined
          }
          scrollToFirstError={true}
        >
          <div className="flex flex-col gap-y-4">
            <NxCardContainer header={"PRICING INFORMATION"}>
              <PricingAdjustPriceInfo
                data={bodyPricing}
                type={type}
                prevPage={prevPage}
              />
            </NxCardContainer>
            {type === "create" &&
            (prevPage === "create-pricing" || prevPage === "update-pricing") ? (
              <>
                <NxCardContainer header={"PRICING DETAIL INFORMATION"}>
                  <PricingDetailTableDetail
                    type={"detail"}
                    data={listDataDetail}
                    priceCode={bodyPricing.priceCode || ""}
                    updateData={setListDataDetail}
                    selectPriceCodeAdjust={setSelectedData}
                    dispatch={dispatch}
                  />
                </NxCardContainer>
                <NxCardContainer header={"PRICE ADJUSTMENT INFORMATION"}>
                  <PricingAdjustSectionForm
                    criteriaOptions={criteriaOptions}
                    handleSelectCriteria={handleSelectCriteria}
                    handleDeselectCriteria={handleDeselectCriteria}
                    handleClearCriteria={handleClearCriteria}
                    type={type}
                    priceCode={selectedPriceCode()}
                  />
                </NxCardContainer>
              </>
            ) : (
              <>
                <div className="mt-[30px]">
                  <RadioTabs
                    data={listSectionInfo}
                    onChange={handlePriceAdjustInfo}
                    currentPosition={typePriceAdjustInfo}
                  />
                </div>
                <NxCardContainer header={`${typePriceAdjustInfo} INFORMATION`}>
                  <div
                    style={{
                      display:
                        typePriceAdjustInfo !== listSectionInfo[0].value
                          ? "none"
                          : undefined,
                    }}
                  >
                    <PricingAdjustSectionForm
                      criteriaOptions={criteriaOptions}
                      handleSelectCriteria={handleSelectCriteria}
                      handleDeselectCriteria={handleDeselectCriteria}
                      handleClearCriteria={handleClearCriteria}
                      type={type}
                      status={dataDetailPricingAdjustGeneral?.status}
                    />
                  </div>
                  <div
                    style={{
                      display:
                        typePriceAdjustInfo !== listSectionInfo[1].value
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
                        typePriceAdjustInfo !== listSectionInfo[2].value
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
                      typeSelector="pricingAdjust"
                    />
                  </div>
                </NxCardContainer>
              </>
            )}

            {typePriceAdjustInfo === listSectionInfo[0].value ? (
              <NxCardContainer header={"PRICE ADJUSTMENT DETAIL INFORMATION"}>
                {/* <PricingAdjustTableDetail
                  type={type}
                  data={listDataDetailPricingAdjust}
                  dataCriteria={criteriaValues}
                  updateData={setListDataDetailPricingAdjust}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                /> */}
                <FunctionalCriteriaProduct
                  type={type}
                  data={listDataDetailPricingAdjust || []} //data
                  dataCriteria={criteriaValues || []} //ddl
                  updateData={setListDataDetailPricingAdjust}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                  // startDate={startDate ? moment(startDate) : undefined}
                  selector="pricingAdjust"
                  idTable="price-adjust-form-criteria-table"
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
                    getAdjustmentTypeList,
                  }}
                  fixedColumn={["ADJUSTMENT TYPE", "ADJUSTMENT VALUE"]}
                  columnsTable={columnsTableCriteriaAll}
                  countryCriteriaId={getCriteriaIdByCode(criteriaOptions, "COUNTRY")}
                  checkStartDate={false}
                />
              </NxCardContainer>
            ) : null}
            <NxBaseContainer border>
              <div className="flex w-full justify-between align-middle my-3">
                <Button
                  onClick={() => setModalBack(true)}
                  type="menu"
                >
                  Back
                </Button>
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
                    // disabled={
                    //   listDataDetailPricingAdjust.length === 0 ||
                    //   listDataDetailPricingAdjust.every(
                    //     (item) =>
                    //       !item.adjustmentType ||
                    //       !item.adjustmentValue ||
                    //       !item.startDate
                    //   )
                    // }
                  >
                    Save as Draft
                  </ButtonComponent>
                  <ButtonComponent
                    htmlType="submit"
                    type="submit"
                    onClick={() => setTypeSubmit(listTypeSubmit[0])}
                    // disabled={
                    //   listDataDetailPricingAdjust.length === 0 ||
                    //   listDataDetailPricingAdjust.every(
                    //     (item) =>
                    //       !item.adjustmentType ||
                    //       !item.adjustmentValue ||
                    //       !item.startDate
                    //   )
                    // }
                  >
                    Save & Submit
                  </ButtonComponent>
                </div>
              </div>
            </NxBaseContainer>
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
                  disabled={isLoading}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  loading={isLoading}
                  onClick={handleProcessModalConfirm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <ContentModalConfirmPriceAdjust
              type={type}
              prevPage={prevPage}
              data={formValue}
              detailInfo={
                prevPage === "detail-pricing" ||
                prevPage === "table-price-adjust"
                  ? bodyPricing
                  : {
                      priceCode: bodyPricing.priceCode || "",
                      currency: selectedData.currency,
                      value: selectedData.value,
                      uom: selectedData.uom,
                    }
              }
              listSectionInfo={listSectionInfo}
              listDataAttachment={listDataAttachment}
              listDataDetail={listDataDetail}
              listDataCriteria={listDataDetailPricingAdjust}
              criteriaValues={criteriaValues}
              listDataAppHierDetail={dataListAppHierDetail}
              listCriteria={formatCriteria(formValue.criteria || [])}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              countryCriteriaId={getCriteriaIdByCode(criteriaOptions, "COUNTRY")}
            />
          </ModalCustom>
        ) : null}
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={handleOkBack}
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
              <ButtonComponent onClick={handleOkBack} type="submit">
                OK
              </ButtonComponent>
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

export default PricingAdjustForm;
