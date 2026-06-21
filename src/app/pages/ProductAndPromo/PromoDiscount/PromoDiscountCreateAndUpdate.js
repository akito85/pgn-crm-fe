import { useState, useEffect, useCallback } from "react";
import { Button, Form, Spin } from "antd";
import { NxFormStepper } from "../../../../components/Nx/NxFormStepNavigation";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import Promo from "./Form/Promo";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { WarningOutlined, LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { getConfigFileMaster } from "../../../../redux/slices/attachmentSlice";
import BaseContainer from "../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import {
  createPromo,
  getAttachmentCategoryPromo,
  getAvailableApprovalPromo,
  getDetailPromo,
  getDetailPromoDraft,
  getListCriteriaPromo,
  getListPromoType,
  getListPromotionType,
  getSelectedApprovalPromo,
  updatePromo,
} from "../../../../redux/slices/product_promo/promoSlice";
import {
  showModalError,
  showModalSuccess,
  validateCreateUpdate,
} from "../../../../redux/slices/general_slice";
import { columnsTableCriteriaPromo } from "./Table/TableCriteriaPromo";
import { dateFormatting, hasValue } from "../../../../utils";
import NxModal from "../../../../components/Nx/NxModal";
import PromoDiscountConfirm from "./Pages/PromoDiscountConfirm";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import {
  getCriteriaIdByCode,
  handleDisabledEachColumnCriteria,
  handleMappingCriteriaGeneral,
} from "../UtilsProduct/UtilsAllProduct";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";

const PromoDiscountCreateAndUpdate = ({ type }) => {
  // Selector
  const {
    dataListCriteria,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    loading_createUpdatePromo,
    data_promo_type,
    data_promotion_type,
    data_promoDiscountDetail,
    data_promoDiscountDetailDraft,
    data_listAttachment,
    data_from_item,
  } = useSelector((state) => state.promo);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id; //id

  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "Promo Information" },
    { title: "Approval" },
    { title: "Attachment" },
  ];

  const formFields = [
    ["name", "startDate", "endDate", "promoType", "promotionType", "criteria"],
    ["apphierId"],
    [],
  ];

  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);

  // State
  const [flag, setFlag] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});

  //approval
  const [dataListDetailApproval, setDataListDetailApproval] = useState([]);
  const [dataApprovalId, setDataApprovalId] = useState();
  const [dataApproval, setDataApproval] = useState([]);

  const [listDataAttachment, setListDataAttachment] = useState([]);
  //criteria
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [missingColumn, setMissingColumn] = useState();

  //condition
  const [listDataCondition, setListDataCondition] = useState([]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PROMO_DISCOUNT,
      breadcrumbName: "Promo Discount",
    },
    {
      path:
        type === "create"
          ? PRODUCT_PROMO_ROUTES.CREATE_PROMO_DISCOUNT
          : PRODUCT_PROMO_ROUTES.UPDATE_PROMO_DISCOUNT,
      breadcrumbName:
        type === "create" ? "Create Promo Discount" : "Update Promo Discount",
    },
  ];

  //useEffect
  useEffect(() => {
    dispatch(getListCriteriaPromo());
    dispatch(getListPromoType());
    dispatch(getListPromotionType());
    dispatch(getAvailableApprovalPromo());
  }, [dispatch]);

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getDetailPromo(id));
      dispatch(getDetailPromoDraft(id));
    }
  }, [dispatch, type, id]);

  // Dependency Criteria
  const applySelectCriteriaCascadePromo = (values) => {
    const countryId = getCriteriaIdByCode(criteriaOptions, "COUNTRY");
    let res = [...values];
    if (res.includes(26)) {
      //13
      res.push(27);
    }
    if (res.includes(27)) {
      //14
      res.push(139); //39
    }
    if (res.includes(139)) {
      res.push(28); //15
    }
    if (res.includes(28) && hasValue(countryId)) {
      res.push(countryId);
    }
    if (res.includes(33)) {
      //20
      res.push(32); //19
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(37) ? [37] : outputArray.includes(25) ? [25] : outputArray;
    return outputArray;
  };

  const handleAssertData = useCallback(
    (dataDetail, dataCompare = [], dataListCriteria = []) => {
      const tempCriteriaValues = applySelectCriteriaCascadePromo(
        dataDetail?.productPromoCriteriaDtos
          ?.map((item) => {
            return {
              id: item?.id || null,
              idCriteria: item?.idCriteria,
              idPromo: item?.idPromo || null,
            };
          })
          ?.map((item) => item.idCriteria) || []
      );

      // console.log(tempDataCriteriaList,"data") //
      setStartDate(moment(dataDetail?.startDate));
      setDataApprovalId(dataDetail?.appHierId);
      setListDataAttachment(
        (dataDetail?.attachmentListDto || [])?.map((item) => {
          return {
            ...item,
            createdDate: moment(item.createdDate).format(dateFormatting.date),
            // fileSize: bytesConverter(item.fileSize || 0),
            // urlFile1: `${urlLink(item?.id)}`,
            dataType: "exist",
          };
        })
      );

      form.setFieldsValue({
        name: dataDetail?.name,
        promoType: dataDetail?.type,
        promotionType: dataDetail?.promotionType,
        startDate: dataDetail?.startDate
          ? moment(dataDetail?.startDate)
          : moment(),
        endDate: dataDetail?.endDate ? moment(dataDetail?.endDate) : null,
        criteria: tempCriteriaValues,
        description: dataDetail?.description,
        apphierId: dataDetail?.appHierId,
      });
      setCriteriaValues(tempCriteriaValues);
      setListDataCriteria(
        handleDisabledEachColumnCriteria({
          dataDetail: dataDetail?.productPromoCriteriaDataDtos.filter(
            (data) => data?.allCriteria !== true
          ),
          dataCompare: dataCompare,
          idName: "id",
          idCompare: "id",
          status: dataDetail?.status,
          statusApproval: dataDetail?.statusApproval,
          columnsTable: columnsTableCriteriaPromo(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode(criteriaOptions, "COUNTRY")
          ),
          dataListCriteria: dataListCriteria,
        })
      );
      setListDataCondition(
        dataDetail?.productPromoConditionDtos?.map((item) => {
          return {
            ...item,
            value: item?.adjustmentValue,
          };
        })
      );
    },
    [form, criteriaOptions]
  );

  useEffect(() => {
    if (
      type === "update" &&
      id &&
      data_promoDiscountDetail &&
      data_promoDiscountDetail?.id === id &&
      dataListCriteria &&
      dataListCriteria?.length > 0
    ) {
      if (
        //draft
        data_promoDiscountDetailDraft &&
        data_promoDiscountDetailDraft?.id === id
      ) {
        const body = {
          ...data_promoDiscountDetailDraft,
          attachmentListDto: data_promoDiscountDetail?.attachmentListDto || [],
          status: data_promoDiscountDetail?.status,
          statusApproval: data_promoDiscountDetail?.statusApproval,
        };

        handleAssertData(
          body,
          data_promoDiscountDetail?.productPromoCriteriaDataDtos || [],
          dataListCriteria
        );
      } else {
        handleAssertData(data_promoDiscountDetail, [], dataListCriteria);
      }
    }
  }, [
    data_promoDiscountDetail,
    data_promoDiscountDetailDraft,
    handleAssertData,
    dataListCriteria,
    type,
    id,
  ]);

  useEffect(() => {
    if (dataListCriteria && dataListCriteria?.length > 0) {
      const tempCriterias = (dataListCriteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
        code: criteria.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [dataListCriteria]);

  useEffect(() => {
    //ddl approval
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));

      setDataApproval(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    //get table
    if (dataApprovalId && dataApprovalId !== undefined) {
      dispatch(getSelectedApprovalPromo(dataApprovalId));
    }
  }, [dispatch, dataApprovalId]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a?.employeeDetail
          ? a.employeeDetail.map((b, index) => ({
              ...b,
              key: index + 1,
            }))
          : [],
      }));
      setDataListDetailApproval(data);
    } else {
      setDataListDetailApproval([]);
    }
  }, [dataListAppHierDetail]);

  const handleSelectCriteria = (value) => {
    const outputArray = applySelectCriteriaCascadePromo([...criteriaValues, value]);
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const countryId = getCriteriaIdByCode(criteriaOptions, "COUNTRY");
    let res = criteriaValues.filter((item) => item !== value);
    if (hasValue(countryId) && !res.includes(countryId)) {
      res = res.filter((item) => item !== 28);
    }
    if (!res.includes(28)) {
      //15
      res = res.filter((item) => item !== 139); //39
    }
    if (!res.includes(139)) {
      // 39
      res = res.filter((item) => item !== 27); //14
    }
    if (!res.includes(27)) {
      //14
      res = res.filter((item) => item !== 26); //13
    }
    if (!res.includes(32)) {
      //19
      res = res.filter((item) => item !== 33); //20
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(37) ? [37] : outputArray.includes(25) ? [25] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      criteria: outputArray,
    });
    if (outputArray?.length > 0 && (outputArray.includes(37) || outputArray.includes(25))) {
      setListDataCriteria([]);
    }
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  const handleStartDate = (e) => {
    form.resetFields(["endDate"]);
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  const next = async () => {
    try {
      if (current === 0) {
        await form.validateFields(formFields[0]);
        if (listDataCriteria.length === 0 && !form.getFieldValue("criteria")?.includes(37)) {
          dispatch(showModalError({ title: "Failed", description: "Criteria Mandatory. Please insert data." }));
          return;
        }
        if (storedDataInline) {
          dispatch(showModalError({ title: "Failed", description: "Please save data table inline before submit. Please try again." }));
          return;
        }
      } else if (current === 1) {
        await form.validateFields(formFields[1]);
      }
    } catch (err) {
      return;
    }
    setCurrent((prev) => prev + 1);
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const formatCriteria = (data = []) => {
    const tempArray = criteriaOptions.filter((item) =>
      data.includes(item.value)
    );
    return tempArray
      .map((data) => data.name)
      .reduce((current, next) => current + `, ${next}`, "")
      .slice(1);
  };

  const handleDescriptionSuccess = useCallback(
    (data, type) => {
      let text = "";
      switch (type) {
        case "create":
          text = `Your data has been ${
            data.action !== "DRAFT" ? "submitted" : "created"
          }.`;
          break;
        case "update":
          text = `Your data has been ${
            data.action !== "DRAFT" ? "submitted" : "updated"
          }.`;
          break;
        default:
      }
      const successMessage = {
        title: "Successful",
        description: text,
      };
      dispatch(showModalSuccess(successMessage));
    },
    [dispatch]
  );

  const handleBodyConfirm = useCallback(
    (bodyData, submitFlag = flag) => {
      let dataCriteriaObject = listDataCriteria.map((item, index) => ({
          ...handleMappingCriteriaGeneral({
            item: item,
            index: index,
            columnsTable: columnsTableCriteriaPromo(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              getCriteriaIdByCode(criteriaOptions, "COUNTRY")
            ),
            criteriaValues: criteriaValues,
            dataListCriteria: dataListCriteria,
          }),
          fromItemSource: data_from_item.find((fromItem) => fromItem.value === item.fromItem?.value)?.source,
        })
      );

      let criteriaArrayObject = bodyData.criteria.map((item) => {
        let tempData =
          id && data_promoDiscountDetailDraft?.id === id
            ? data_promoDiscountDetailDraft?.productPromoCriteriaDtos || []
            : data_promoDiscountDetail?.productPromoCriteriaDtos || [];
        const temp = tempData?.filter((a) => item === a.criteria);
        return {
          id: temp[0]?.id || null,
          idCriteria: item,
          idPromo: temp[0]?.idPromo || null,
        };
      });

      // const includesAll = bodyData.criteria.includes(24);

      return {
        id: type === "update" ? id : undefined,
        name: bodyData.name,
        description: bodyData.description ? bodyData.description : null,
        type: bodyData.promoType,
        typeName: bodyData?.typeName,
        promotionType: bodyData.promotionType,
        promotionTypeName: bodyData?.promotionTypeName,
        startDate: moment(bodyData?.startDate).format(dateFormatting.date),
        endDate: bodyData?.endDate
          ? moment(bodyData?.endDate).format(dateFormatting.date)
          : null,
        apphierId: bodyData.apphierId,
        action: submitFlag !== undefined ? (submitFlag ? "SUBMIT" : "DRAFT") : (flag ? "SUBMIT" : "DRAFT"),
        productPromoConditionDtos: (listDataCondition || [])?.map((item) => {
          return {
            id: item?.id || null,
            name: item?.name,
            operator: item?.operator,
            dataType: item?.dataType,
            adjustmentValue: item?.value,
            startDate: moment(item?.startDate).format(dateFormatting.date),
            endDate: item?.endDate
              ? moment(item?.endDate).format(dateFormatting.date)
              : null,
          };
        }),
        productPromoCriteriaDtos: criteriaArrayObject,
        productPromoCriteriaDataDtos: dataCriteriaObject,
        // description: bodyData.description || null,
      };
    },
    [
      criteriaValues,
      dataListCriteria,
      data_promoDiscountDetail,
      data_promoDiscountDetailDraft,
      flag,
      id,
      listDataCondition,
      listDataCriteria,
      data_from_item,
      type,
    ]
  );

  // Handle Save
  const handleSave = useCallback(
    async (submitFlag) => {
      try {
        if (listDataAttachment.length === 0) {
          dispatch(showModalError({ title: "Failed", description: "Attachment is required. Please upload at least one file." }));
          return;
        }
        const formValue = form.getFieldsValue(true);
        setBodyData({
          ...formValue,
          typeName: data_promo_type?.find(
            (item) => item?.id === formValue?.promoType
          )?.text,
          promotionTypeName: data_promotion_type?.find(
            (item) => item?.id === formValue?.promotionType
          )?.text,
          status:
            type === "update"
              ? data_promoDiscountDetail?.status
              : undefined,
        });

        const validateValueObj = {
          body: handleBodyConfirm({
            ...formValue,
            typeName: data_promo_type?.find(
              (item) => item?.id === formValue?.promoType
            )?.text,
            promotionTypeName: data_promotion_type?.find(
              (item) => item?.id === formValue?.promotionType
            )?.text,
          }, submitFlag),
          services: productPromoHttpService,
          endPoint:
            type === "create"
              ? "/v1/dbs/api/product-promo/validate-create"
              : "/v1/dbs/api/product-promo/validate-update",
          type: type,
        };
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();

        setFlag(submitFlag);
        setModalConfirm(true);
      } catch (error) {
        console.log(error);
      }
    },
    [
      listDataAttachment,
      form,
      dispatch,
      data_promo_type,
      data_promotion_type,
      data_promoDiscountDetail,
      handleBodyConfirm,
      type,
    ]
  );

  const handleConfirm = () => {
    let dataCriteriaObject = listDataCriteria.map((item, index) => ({
        ...handleMappingCriteriaGeneral({
          item: item,
          index: index,
          columnsTable: columnsTableCriteriaPromo(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            getCriteriaIdByCode(criteriaOptions, "COUNTRY")
          ),
          criteriaValues: criteriaValues,
          dataListCriteria: dataListCriteria,
        }),
        fromItemSource: data_from_item.find((fromItem) => fromItem.value === item.fromItem?.value)?.source,
      })
    );

    let criteriaArrayObject = bodyData.criteria.map((item) => {
      let tempData =
        id && data_promoDiscountDetailDraft?.id === id
          ? data_promoDiscountDetailDraft?.productPromoCriteriaDtos || []
          : data_promoDiscountDetail?.productPromoCriteriaDtos || [];
      const temp = tempData?.filter((a) => item === a.criteria);
      return {
        id: temp[0]?.id || null,
        idCriteria: item,
        idPromo: temp[0]?.idPromo || null,
      };
    });

    // const includesAll = bodyData.criteria.includes(24);

    const body = {
      id: type === "update" ? id : undefined,
      name: bodyData.name,
      description: bodyData.description ? bodyData.description : null,
      type: bodyData.promoType,
      typeName: bodyData?.typeName,
      promotionType: bodyData.promotionType,
      promotionTypeName: bodyData?.promotionTypeName,
      startDate: moment(bodyData?.startDate).format(dateFormatting.date),
      endDate: bodyData?.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.date)
        : null,
      apphierId: bodyData.apphierId,
      action: flag ? "SUBMIT" : "DRAFT",
      status: bodyData?.status || undefined,
      productPromoConditionDtos: (listDataCondition || [])?.map((item) => {
        return {
          id: item?.id || null,
          name: item?.name,
          operator: item?.operator,
          dataType: item?.dataType,
          adjustmentValue: item?.value,
          startDate: moment(item?.startDate).format(dateFormatting.date),
          endDate: item?.endDate
            ? moment(item?.endDate).format(dateFormatting.date)
            : null,
        };
      }),
      productPromoCriteriaDtos: criteriaArrayObject,
      productPromoCriteriaDataDtos: dataCriteriaObject,
      // description: bodyData.description || null,
    };
    // console.log(body, "body");
    dispatch(type === "create" ? createPromo(body) : updatePromo(body))
      .unwrap()
      .then(async (dataForm) => {
        const idData = dataForm?.id;
        setModalConfirm(false);
        setLoadingForm(true);
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        for (let icon = 0; icon < filterDataAttach.length; icon++) {
          const element = filterDataAttach[icon];
          const body = {
            files: element.file,
            category: element.fileCategoryId,
            refId: hasValue(idData) ? idData : id,
          };
          await productPromoHttpService.uploadAttachment(
            `/v1/dbs/api/product-promo/upload-attachment`,
            body
          );
        }
        setLoadingForm(false);
        handleDescriptionSuccess(body, type);
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
  };

  const handleRetry = () => {
    handleSave(flag);
    setModalError(false);
  };

  const handleClear = (type) => {
    if (type === "create") {
      form.resetFields();
      setCriteriaValues([]);
      setCriteriaOptions([]);
      setListDataCriteria([]);
      setStoredDataInline(false);
      setStartDate();
      setListDataAttachment([]);
      setDataApprovalId();
      setDataListDetailApproval([]);
      setBodyData({});
      setBodyError({});
      setListDataCondition([]);
    } else {
      setListDataAttachment(
        (data_listAttachment || [])?.map((item) => {
          return {
            ...item,
            createdDate: moment(item.createdDate).format(dateFormatting.date),
            // fileSize: bytesConverter(item.fileSize || 0),
            // urlFile1: `${urlLink(item?.id)}`,
            dataType: "exist",
          };
        })
      );
      if (
        //draft
        data_promoDiscountDetailDraft &&
        data_promoDiscountDetailDraft?.id === id
      ) {
        const body = {
          ...data_promoDiscountDetailDraft,
          status: data_promoDiscountDetail?.status,
          statusApproval: data_promoDiscountDetail?.statusApproval,
        };

        handleAssertData(
          body,
          data_promoDiscountDetail?.productPromoCriteriaDataDtos || [],
          dataListCriteria
        );
      } else {
        handleAssertData(data_promoDiscountDetail, [], dataListCriteria);
      }
    }
  };

  return (
    <>
      <Spin spinning={loading || loadingForm || loading_createUpdatePromo}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <NxFormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
          <Form
            id="form"
            layout="vertical"
            form={form}
          >
            <div className={`flex flex-col gap-y-4 ${current !== 0 ? "hidden" : ""}`}>
              <Promo
                type={type}
                criteriaOptionsFix={criteriaOptions}
                promoTypeOptions={data_promo_type || []}
                promotionTypeOptions={data_promotion_type || []}
                handleSelectCriteria={handleSelectCriteria}
                handleDeselectCriteria={handleDeselectCriteria}
                handleClearCriteria={handleClearCriteria}
                handleStartDate={handleStartDate}
                startDate={startDate}
                listDataCriteria={listDataCriteria}
                setListDataCriteria={setListDataCriteria}
                criteriaValues={criteriaValues}
                storedDataInline={storedDataInline}
                setStoredDataInline={setStoredDataInline}
                status={data_promoDiscountDetail?.status}
                statusApproval={data_promoDiscountDetail?.statusApproval}
                listDataCondition={listDataCondition}
                setListDataCondition={setListDataCondition}
                endDate={endDate}
                handleEndDate={handleEndDate}
              />
            </div>

            <div className={`flex flex-col gap-y-4 ${current !== 1 ? "hidden" : ""}`}>
              <NxCardContainer header={"APPROVAL INFORMATION"}>
                <ApprovalComponentGeneral
                  dataTable={dataListDetailApproval}
                  dataOption={dataApproval}
                  selectedHierarchy={dataApprovalId}
                  updateSelectedHierarchy={setDataApprovalId}
                />
              </NxCardContainer>
            </div>

            <div className={`flex flex-col gap-y-4 ${current !== 2 ? "hidden" : ""}`}>
              <NxCardContainer header={"Attachment Information"}>
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  getAPICategory={getAttachmentCategoryPromo}
                  getAPIGuard={getConfigFileMaster}
                  typeSelector={"promo"}
                  mandatory={true}
                />
              </NxCardContainer>
            </div>
          </Form>
          <NxBaseContainer border>
            <div className="flex justify-between">
              <Button
                onClick={() => setModalBack(true)}
                type="menu"
              >
                Back
              </Button>
              <div className="flex gap-x-2">
                <Button
                  icon={<SVGIcon name="IconButtonClear" width={14} />}
                  onClick={() => handleClear(type)}
                  disabled={storedDataInline}
                  type="reject"
                >
                  {type === "create" ? "Clear" : "Reset"}
                </Button>
                <Button
                  onClick={() => handleSave(false)}
                  disabled={storedDataInline || current !== steps.length - 1}
                  type="secondary"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={prev}
                  disabled={current < 1}
                  type="menu"
                >
                  Previous
                </Button>
                {current < steps.length - 1 && (
                  <Button
                    onClick={next}
                    disabled={steps[current]?.disabled}
                    type="submit"
                  >
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    onClick={() => handleSave(true)}
                    disabled={storedDataInline}
                    type="approve"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </NxBaseContainer>
        </div>

        <NxModal
          isOpen={modalConfirm}
          handleCancel={() => { setActiveTab(0); setModalConfirm(false); }}
          title={"CONFIRMATION"}
          width={1200}
          footer={[
            <div className="flex justify-between" key="footer">
              <Button type="menu" disabled={loading_createUpdatePromo} onClick={() => { setActiveTab(0); setModalConfirm(false); }}>
                Cancel
              </Button>
              <div className="flex">
                <Button type="menu" disabled={activeTab < 1 || loading_createUpdatePromo} onClick={() => setActiveTab(prev => prev - 1)}>
                  Previous
                </Button>
                {activeTab < 2 && (
                  <Button type="submit" disabled={loading_createUpdatePromo} onClick={() => setActiveTab(prev => prev + 1)}>
                    Next
                  </Button>
                )}
                {activeTab === 2 && (
                  <Button type="submit" onClick={handleConfirm} loading={loading_createUpdatePromo} disabled={loading_createUpdatePromo}>
                    Confirm
                  </Button>
                )}
              </div>
            </div>
          ]}
        >
          <PromoDiscountConfirm
            listAttachment={listDataAttachment}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            listCriteria={formatCriteria(bodyData?.criteria || [])}
            listDataCondition={listDataCondition}
            dataConfirm={bodyData}
            dataApproval={dataApprovalId}
            dataApprovalTable={dataListDetailApproval}
            listApproval={dataApproval}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </NxModal>

        {modalError ? (
          <ModalError
            isOpen={modalError}
            handleOk={handleRetry}
            handleCancel={() => {
              setModalError(false);
            }}
            customText={"Try Again"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{`Your data was not ${
                type === "create" ? "Created." : "Updated."
              } ${bodyError?.message}`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}

        {modalBack ? (
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
        ) : null}
      </Spin>
    </>
  );
};

export default PromoDiscountCreateAndUpdate;
