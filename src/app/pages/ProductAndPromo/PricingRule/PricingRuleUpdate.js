import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Spin, Form } from "antd";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import RadioTabs from "../../../../components/RadioTabs";
import {
  getHeaderPricingRule,
  getSelectCriteria,
  getAllApprovalList,
  updatePricingRule,
  getDetailPricingRule,
  getSelectCategory,
} from "../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import PricingRule from "./Form/PricingRule";
import moment, { isMoment } from "moment";
import Approval from "./Form/Approval";
import ButtonComponent from "../../../../components/ButtonComponent";
import { WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import ConfirmationLayout from "./Modal/ConfirmationLayout";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import BaseContainer from "../../../../components/BaseContainer";
import { applyLocationCriteriaCascade, getCriteriaIdByCode, handleCheckCriteriaMissingValidation, handleDisabledEachColumnCriteria } from "../UtilsProduct/UtilsAllProduct";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import { dateFormatting, hasValue } from "../../../../utils";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

const PricingRuleUpdate = () => {
  // Selector
  const {
    loading,
    data_header,
    data_select_criteria,
    data_approval,
    data_approval_list,
    data_detail_draft,
  } = useSelector((state) => state.pricingRule);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id, statusPricingRule, statusApprovalPricingRule } =
    location?.state || {};

  // State
  const [valuePage, setValuePage] = useState("Pricing Rule");
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [boolean, setBoolean] = useState(false);
  const [flag, setFlag] = useState(0);
  const [bodyData, setBodyData] = useState({});
  const [data, setData] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataApphierId, setDataApphierId] = useState("");
  const [tabPagesPricingRule, setTabPagesPricingRule] = useState([
    {
      value: "Pricing Rule",
      paramValue: ["name", "rPricingRuleCriterias", "startDate"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const isLoading = loading || loadingForm;
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  
  // Use Effect
  useEffect(() => {
    dispatch(getSelectCriteria());
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDetailPricingRule(id));
    dispatch(getHeaderPricingRule(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (
      data_select_criteria &&
      data_select_criteria?.length > 0
    ) {
      const tempCriterias = (data_select_criteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
        code: criteria?.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_select_criteria]);

  useEffect(() => {
    if (id && data_header && data_detail_draft?.pricingRuleId === id) {
      // Data Criteria Select
      const criteriaSelect = (
        data_detail_draft?.rPricingRuleCriterias || []
      ).map((item) => {
        return {
          id: item.criteria,
          pricingRuleCriteriaId: item.pricingRuleCriteriaId,
        };
      });

      const mappingCriteria = applyLocationCriteriaCascade(
        criteriaSelect?.map((a) => a.id),
        data_select_criteria,
        "id"
      );

      // Data Detail Pricing Rule
      const dataDetailDraftPricingRule = (
        data_detail_draft?.mPricingRuleDetails || []
      )?.map((item) => {
        return {
          pricingRuleDetailId: item.pricingRuleDetailId,
          lineNumber: item.lineNumber,
          priceCode: item.priceCode,
          priceCodeName: item.priceCodeName,
          min: item.min,
          max: parseInt(item.max),
          maximumName: item.unlimited === true || item?.max?.toString() === "0" ? "Unlimited" : item.max,
          description: item.description,
          unlimited: item.unlimited,
          value: item.value,
          uom: item.uom,
          currency: item.currency,
          type: "exist",
        };
      });

      // Data Attachment Pricing Rule
      const dataDraftAttachment = (
        data_detail_draft?.mAttachmentLists || []
      ).map((item) => {
        return {
          ...item,
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          category: item.fileCategoryName,
          categoryName: item.categoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          dataType: "exist",
        };
      });
      setEndDate(data_header?.endDate ? moment(data_header?.endDate) : null)
      // Data Criteria List Pricing Rule
      const dataDraftCriteriaList = (
        data_detail_draft?.rPricingRuleCriteriaDatas || []
      ).map((item, index) => {
        let obj = { key: index + 1 };
        for (const attr in item) {
          if ( hasValue(item[attr]) && 
            typeof item[attr] === "object" &&
            attr !== "id" &&
            attr !== "idPricingRule" &&
            !attr?.toLowerCase()?.includes("date")
          ) {
            obj[`${attr}`] = {
              value: item[attr]?.value,
              label: item[`${attr}`]?.label,
            };
          } else {
            obj[attr] = item[attr];
          }
        }
        return obj;
      });

      const dataCriteriaList = (
        data_header?.rpricingRuleCriteriaDatas || []
      ).map((item, index) => {
        return {
          id: item.id,
          idPricingRule: item.idPricingRule,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          country: item.country,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          serviceType: item.serviceType,
          customer: item.customer,
          startDate: item?.startDate ? item?.startDate : null,
          endDate : item?.endDate ? item?.endDate : null,
          key: index + 1,
        };
      });

      form.setFieldsValue({
        name: data_detail_draft?.name,
        startDate: moment(data_detail_draft?.startDate),
        endDate: data_detail_draft?.endDate
          ? moment(data_detail_draft?.endDate)
          : undefined,
        rPricingRuleCriterias: mappingCriteria,
        description: data_detail_draft?.description,
        apphierId: data_detail_draft?.apphierId,
      });
      setStartDate(data_detail_draft?.startDate);
      setDataApphierId(data_detail_draft?.apphierId);
      setData(dataDetailDraftPricingRule);
      setListDataAttachment([
        ...(data_header?.mattachmentLists || []).map((item) => {
          return {
            ...item,
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            category: item.fileCategoryName,
            categoryName: item.categoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            dataType: "exist",
          };
        }),
        ...(dataDraftAttachment || []),
      ]);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(
        handleDisabledEachColumnCriteria({
          dataDetail: dataDraftCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          dataCompare: dataCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          idName: "id",
          idCompare: "id",
          status: data_header?.status,
          statusApproval: data_header?.approvalStatus,
          columnsTable: columnsTableCriteriaAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode(data_select_criteria, "COUNTRY", "id")
          ),
          dataListCriteria: data_select_criteria?.map((item) =>{
            return {
              ...item,
              id: item.id,
              name: item.text,
            }
          }),
        }));
    } else if (
      id &&
      !data_detail_draft?.id &&
      data_header?.pricingRuleId === id
    ) {
      // Data Criteria Select
      const criteriaSelect = data_header?.rpricingRuleCriterias?.map((item) => {
        return {
          id: item.criteria,
          pricingRuleCriteriaId: item.pricingRuleCriteriaId,
        };
      });

      const mappingCriteria = applyLocationCriteriaCascade(
        criteriaSelect?.map((a) => a.id),
        data_select_criteria,
        "id"
      );

      // Data Detail Pricing Rule
      const dataDetailPricingRule = (
        data_header?.mpricingRuleDetails || []
      ).map((item) => {
        return {
          pricingRuleDetailId: item.pricingRuleDetailId,
          lineNumber: item.lineNumber,
          priceCode: item.priceCodeId,
          priceCodeName: item.priceCode,
          min: item.min,
          max: parseInt(item.max),
          maximumName: item.unlimited === true || item?.max?.toString() === "0" ?  "Unlimited" : item.max,
          description: item.description,
          unlimited: item.unlimited,
          value: item.value,
          uom: item.uom,
          currency: item.currency,
          type: "exist",
        };
      });

      // Data Attachment Pricing Rule
      const dataAttachment = (data_header?.mattachmentLists || []).map(
        (item) => {
          return {
            ...item,
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            category: item.fileCategoryName,
            categoryName: item.categoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            dataType: "exist",
          };
        }
      );

      setEndDate(data_header?.endDate ? moment(data_header?.endDate) : null)
      // Data Criteria List Pricing Rule
      const dataCriteriaList = (
        data_header?.rpricingRuleCriteriaDatas || []
      ).map((item, index) => {
        return {
          id: item.id,
          idPricingRule: item.idPricingRule,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          country: item.country,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          serviceType: item.serviceType,
          customer: item.customer,
          startDate: item?.startDate ? item?.startDate : null,
          endDate : item?.endDate ? item?.endDate : null,
          key: index + 1,
        };
      });
      form.setFieldsValue({
        name: data_header?.name,
        startDate: moment(data_header?.startDate),
        endDate: data_header?.endDate
          ? moment(data_header?.endDate)
          : undefined,
        rPricingRuleCriterias: mappingCriteria,
        description: data_header?.description,
        apphierId: data_header?.apphierId,
      });
      setStartDate(data_header?.startDate);
      setDataApphierId(data_header?.apphierId);
      setData(dataDetailPricingRule);
      setListDataAttachment(dataAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(
        handleDisabledEachColumnCriteria({
          dataDetail: dataCriteriaList.filter(
            (data) => data?.allCriteria !== true
          ),
          dataCompare: [],
          idName: "id",
          idCompare: "id",
          status: data_header?.status,
          statusApproval: data_header?.approvalStatus,
          columnsTable: columnsTableCriteriaAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode(data_select_criteria, "COUNTRY", "id")
          ),
          dataListCriteria: data_select_criteria?.map((item) =>{
            return {
              ...item,
              id: item.Id,
              name: item.text,
            }
          }),
        })
      );
    }
  }, [id, form, data_header, data_detail_draft]);
  // console.log(listDataCriteria, "dataCrtieria");
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRICING_RULE,
      breadcrumbName: "Pricing Rule",
    },
    {
      path: PRODUCT_PROMO_ROUTES.UPDATE_PRICING_RULE,
      breadcrumbName: "Update Pricing Rule",
    },
  ];

  // Handle Change Radio Tabs
  const onChange = (e) => {
    if (!storedDataInline) {
      setValuePage(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  // Handle Save for Modal Confirmation
  const handleSave = useCallback(
    async (formValue) => {
      try {
        let errorBody = {};
        if (data.length === 0) {
          errorBody = {
            title: "Failed",
            description: `Pricing Rule Detail Mandatory. Please try again.`,
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
            formValue?.rPricingRuleCriterias,
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
          let modifiedArray = data.map((obj) => {
            const { key, type, ...rest } = obj;
            return rest;
          });

          let criteriaArrayObject = formValue.rPricingRuleCriterias.map(
            (item) => {
              let tempData =
                id && data_detail_draft?.pricingRuleId === id
                  ? data_detail_draft?.rPricingRuleCriterias || []
                  : data_header?.rpricingRuleCriterias || [];
              const temp = tempData?.filter((a) => item === a.criteria);
              const itemName = data_select_criteria.filter(
                (criteria) => criteria.id === item
              );
              return {
                id: temp[0]?.id || null,
                criteria: item,
                pricingRuleCriteriaId: temp[0]?.pricingRuleCriteriaId || null,
                criteriaName:
                  statusPricingRule === "ACTIVE"
                    ? itemName[0]?.text
                    : undefined,
              };
            }
          );

          let dataCriteriaObject = listDataCriteria.map((item) => {
            let obj = {};
            for (const attr in item) {
              if (typeof item[attr] === "object" && item[attr] !== null) {
                obj[attr] = isMoment(item[attr])
                  ? moment(item[attr]).format(dateFormatting.date)
                  : item[attr].value;
                if (statusPricingRule === "ACTIVE") {
                  obj[`${attr}Name`] = item[attr]?.label;
                }
              } else {
                obj[attr] = item[attr] || null;
              }
            }
            delete obj.updatedBy;
            delete obj.updatedDate;
            delete obj.createdBy;
            delete obj.createdDate;
            delete obj.type;
            delete obj.flag;
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
            getCriteriaIdByCode(data_select_criteria, "COUNTRY", "id")
          ).filter(
            (item) =>
              !(
                [...formValue.rPricingRuleCriterias, 1, 2, 3, 4, 5] || []
              ).includes(item.indexValue)
          );
          // console.log(filteredCriteria, "filteredCriteria");
          const filteredCriteria2 = columnsTableCriteriaAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode(data_select_criteria, "COUNTRY", "id")
          ).filter((item) =>
            ([...formValue.rPricingRuleCriterias, 1] || []).includes(
              item.indexValue
            )
          );
          // console.log(filteredCriteria2, "filteredCriteria2");
          dataCriteriaObject = dataCriteriaObject.map((item) => {
            let obj = {
              id: item.id || undefined,
              idPricingRule: id,
            };
            filteredCriteria2.forEach((criteria2) => {
              obj[criteria2.dataIndex] = item[criteria2.dataIndex];
              if (
                statusPricingRule === "ACTIVE" &&
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

          const includesAll = formValue.rPricingRuleCriterias.includes(24);

          const dataValue = {
            pricingRuleId: id,
            name: formValue.name,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            rPricingRuleCriterias: criteriaArrayObject,
            description: formValue.description,
            appHierId: formValue.apphierId,
            mPricingRuleDetails: modifiedArray,
            rPricingRuleCriteriaDatas: includesAll
              ? [{ allCriteria: true }]
              : dataCriteriaObject,
            // mAttachment: listDataAttachment,
            status:
              statusPricingRule === "ACTIVE"
                ? id && data_detail_draft?.pricingRuleId === id
                  ? data_detail_draft.status
                  : data_header.status
                : undefined,
            flag: flag,
          };

          // console.log(dataValue);
          setBodyData(dataValue);
          setTabPagesPricingRule([
            {
              value: "Pricing Rule",
              paramValue: ["name", "rPricingRuleCriterias"],
            },
            { value: "Approval", paramValue: ["apphierId"] },
            { value: "Attachment" },
          ]);

          const validateValueObj = {
            body: dataValue,
            services: productPromoHttpService,
            endPoint: "/v1/dbs/api/pricingRule/validate-update",
            type: "update",
          };
          await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();

          setModalConfirm(true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      criteriaOptions,
      criteriaValues,
      data,
      data_select_criteria,
      dispatch,
      flag,
      listDataCriteria,
      storedDataInline,
      id,
    ]
  );

  // Handle Error Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabPagesPricingRule((prevState) => {
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

  // Handle Reset
  const handleReset = () => {
    dispatch(getHeaderPricingRule(id));
    dispatch(getDetailPricingRule(id));
    setStoredDataInline(false);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    )
      navigate(-1);
    else {
      setModalBack(true);
    }
  };

  // Handle Confirm
  const handleConfirm = () => {
    if (statusPricingRule === "DRAFT") {
      bodyData?.mPricingRuleDetails?.map((e) => {
        return {
          id: delete e.id,
          currency: delete e.currency,
          idPricing: delete e.idPricing,
          uom: delete e.uom,
          value: delete e.value,
          priceCodeName: delete e.priceCodeName,
          maximumName: delete e.maximumName,
          priceDetail: delete e.priceDetail,
        };
      });
    }

    const getUniqueListBy = (arr) => {
      return [
        ...new Map(
          arr.map((item) => [`${item["priceCode"]}~${item["min"]}`, item])
        ).values(),
      ];
    };

    const tempBody = {
      ...bodyData,
      mPricingRuleDetails:
        bodyData.status === "ACTIVE" && bodyData.flag === 1
          ? bodyData.mPricingRuleDetails
          : getUniqueListBy(bodyData.mPricingRuleDetails),
    };

    // console.log(tempBody, "tempBody");

    dispatch(updatePricingRule({ body: tempBody }))
      .unwrap()
      .then(async (data) => {
        setLoadingForm(true);
        const idPricingRule = data.pricingRuleId;
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        for (let icon = 0; icon < filterDataAttach.length; icon++) {
          const element = filterDataAttach[icon];
          const body = {
            files: element.file,
            category: element.fileCategoryId,
          };
          await productPromoHttpService.uploadAttachment(
            `/v1/dbs/api/pricingRule/uploadAttachment/${idPricingRule}`,
            body
          );
        }
        setLoadingForm(false);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setModalConfirm(false);
          setBodyError({ message });
          setModalError(true);
        }
        setModalConfirm(false);
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    setBodyError({});
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col gap-y-4">

          <RadioTabs
            data={tabPagesPricingRule}
            onChange={onChange}
            currentPosition={valuePage}
          />

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            onFinishFailed={handleError}
          >
            <div className={`${valuePage !== "Pricing Rule" ? "hidden" : ""}`}>
              <PricingRule
                form={form}
                type={"update"}
                setData={setData}
                data={data}
                status={statusPricingRule}
                setValueOrUnlimited={setValueOrUnlimited}
                valueOrUnlimited={valueOrUnlimited}
                listDataCriteria={listDataCriteria}
                setListDataCriteria={setListDataCriteria}
                criteriaValues={criteriaValues}
                setCriteriaValues={setCriteriaValues}
                setStoredData={setStoredDataInline}
                storedData={storedDataInline}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>

            <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
              <Approval
                idUpdate={dataApphierId}
                type={"update"}
                apiApproval={data_approval}
                apiApprovalList={data_approval_list}
                dataTable={dataTable}
                setDataTable={setDataTable}
              />
            </div>

            <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
              {/* <Attachment
                type={"update"}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                boolean={boolean}
                setBoolean={setBoolean}
              /> */}
              <NxCardContainer header={"Attachment Information"}>
                <AttachmentSectionForm
                  type={"update"}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  typeSelector={"pricingRule"}
                  getAPICategory={getSelectCategory}
                />
              </NxCardContainer>
            </div>

            <NxBaseContainer border className="mt-4">
              <div className="flex items-center">
                <Button
                  onClick={handleBack}
                  type="menu"
                >
                  Back
                </Button>

                <div className={"w-full flex justify-end items-center gap-5"}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <ButtonComponent
                      icon={<SVGIcon name="IconButtonReset" width={24} />}
                      type="submit"
                      onClick={handleReset}
                      disabled={storedDataInline}
                    >
                      Reset
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                      onClick={() => setFlag(1)}
                      disabled={storedDataInline}
                    >
                      Save as Draft
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <ButtonComponent
                      type="submit"
                      htmlType={"submit"}
                      onClick={() => setFlag(2)}
                      disabled={storedDataInline}
                    >
                      Save & Submit
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </div>
            </NxBaseContainer>
          </Form>

          {/* Modal Back*/}
          <ModalConfirm
            isOpen={modalBack}
            handleCancel={() => setModalBack(false)}
            handleOk={() => navigate(-1)}
            width={400}
          >
            <div className="flex justify-center mt-5 gap-[20px]">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
              <p className="text-[18px] font-bold">
                Are you sure you want to back?
              </p>
            </div>
          </ModalConfirm>

          {/* Modal Confirmation*/}
          <ConfirmationLayout
            data={bodyData}
            openModal={modalConfirm}
            closeModal={() => setModalConfirm(false)}
            handleConfirm={() => handleConfirm()}
            tabsPricingRule={tabPagesPricingRule}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            dataAttachment={listDataAttachment}
            apiCriteria={data_select_criteria}
            apiApproval={data_approval}
            apiApprovalList={data_approval_list}
            loading={isLoading}
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
                flag === 1 ? "updated" : "submitted"
              }. ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        </div>
      </Spin>
    </>
  );
};

export default PricingRuleUpdate;
