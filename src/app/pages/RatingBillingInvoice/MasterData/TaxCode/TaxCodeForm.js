import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TaxCodeSectionForm from "./Form/TaxCodeSectionForm";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
  createTaxCode,
  getCategory,
  getConditionName,
  getConditionOperator,
  getConditionType,
  getCriteria,
  getDetailDraftTaxCode,
  getDetailTaxCode,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  getListCategory,
  updateTaxCode,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/taxCode";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import ModalBack from "../../../../../components/Modal/ModalBack";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import ModalConfirmationTaxCode from "./Modal/ModalConfirmationTaxCode";
import { columnsTableCriteriaTaxCode } from "./Table/TableCriteriaTaxCode";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";

const TaxCodeForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierDetail,
    dataListAppHierId,
    data_category,
    data_detail,
    data_detail_draft,
    data_criteria,
  } = useSelector((state) => state.tax_code);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  // Use State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [listDataDetail, setListDataDetail] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);

  const [bodyData, setBodyData] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [dataApphierId, setDataApphierId] = useState("");
  const flagRef = useRef(false);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });
  const [current, setCurrent] = useState(0);
  const [tabPages, setTabPages] = useState([
    {
      value: "Tax Code",
      paramValue: [
        "taxCode",
        "taxCodeName",
        "taxRate",
        "category",
        // "glAccount",
        "startDate",
        "criteria",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const steps = [
    { title: "TAX CODE", value: "Tax Code" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const valuePage = steps[current]?.value;

  const next = () => {
    const fieldsToValidate = tabPages[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current === 0) {
            const formData = form.getFieldsValue();
            if (listDataCriteria.length === 0 && !formData?.criteria?.includes(24)) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description: "Criteria Mandatory. Please insert data.",
                })
              );
              return;
            }
            if (listDataDetail.length === 0) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description: "Condition Mandatory. Please insert data.",
                })
              );
              return;
            }
          }
          if (current < steps.length - 1) {
            setCurrent(current + 1);
            window.scrollTo(0, 0);
          }
        })
        .catch(() => {});
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo(0, 0);
    }
  };

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getListApprovalHierarchy());
    dispatch(getListApprovalHierarchyDetail());
    dispatch(getCategory());
    dispatch(getCriteria());
    dispatch(getConditionName());
    dispatch(getConditionOperator());
    dispatch(getConditionType());
  }, [dispatch]);

  useEffect(() => {
    if (data_criteria) {
      const tempCriterias = (data_criteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_criteria]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailTaxCode(id));
      dispatch(getDetailDraftTaxCode(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      data_detail_draft?.taxCodeId === id &&
      data_detail?.taxCodeId === id
    ) {
      // Data Condition Draft
      const dataConditionDraft = (
        data_detail_draft?.taxCodeConditionDtos || []
      ).map((item, index) => {
        return {
          key: index + 1,
          id: item.id,
          taxCodeId: item.taxCodeId,
          name: item.name,
          operator: item.operator,
          dataType: item.dataType,
          value: item.conditionValue,
          startDate: moment(item.startDate).format(dateFormatting.dateFormal),
          endDate: item.endDate
            ? moment(item.endDate).format(dateFormatting.dateFormal)
            : undefined,
          description: item.description,
          type: "exist",
        };
      });

      // Data Criteria Select Draft
      const criteriaSelect = data_detail_draft?.taxCodeCriteriaDtos?.map(
        (item) => {
          return {
            id: item.id,
            taxCodeId: item.taxCodeId,
            criteria: item.criteria,
          };
        }
      );

      // Mapping for get data Select Criteria Draft
      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Draft Information
      const dataAttachmentDraft = (data_detail?.taxCodeAttDtos || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.type,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            uploadBy: item.createdBy,
            uploadDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );

      // Data Criteria Draft Information
      const dataCriteriaDraftList = (
        data_detail_draft?.taxCodeCriteriaDataDtos || []
      )
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            taxCodeId: item.taxCodeId,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
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
            startDate: item.startDate,
            endDate: item.endDate,
            key: index + 1,
            type: "exist",
          };
        });

      form.setFieldsValue({
        taxCode: data_detail_draft?.taxCode,
        taxCodeName: data_detail_draft?.taxCodeName,
        taxRate: data_detail_draft?.taxRate,
        category: data_detail_draft?.category,
        glAccount: data_detail_draft?.glAccount,
        startDate: moment(data_detail_draft?.startDate),
        endDate: data_detail_draft?.endDate
          ? moment(data_detail_draft?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail_draft?.description,
        apphierId: data_detail_draft?.appHierId,
      });

      setStartDate(moment(data_detail_draft?.startDate));
      setEndDate(data_detail_draft?.endDate ? moment(data_detail_draft?.endDate) : undefined);
      setSelectedHierarchy(data_detail_draft?.appHierId);
      setListDataAttachment(dataAttachmentDraft);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataCriteriaDraftList);
      setListDataDetail(dataConditionDraft);
    } else if (
      id &&
      !data_detail_draft?.taxCodeId &&
      data_detail?.taxCodeId === id
    ) {
      // Data Condition
      const dataCondition = (data_detail?.taxCodeConditionDtos || []).map(
        (item, index) => {
          return {
            key: index + 1,
            id: item.id,
            taxCodeId: item.taxCodeId,
            name: item.name,
            operator: item.operator,
            dataType: item.dataType,
            value: item.conditionValue,
            startDate: moment(item.startDate).format(dateFormatting.dateFormal),
            endDate: item.endDate
              ? moment(item.endDate).format(dateFormatting.dateFormal)
              : null,
            description: item.description,
            type: "exist",
          };
        }
      );

      // Data Criteria Select
      const criteriaSelect = data_detail?.taxCodeCriteriaDtos?.map((item) => {
        return {
          id: item.id,
          taxCodeId: item.taxCodeId,
          criteria: item.criteria,
        };
      });

      // Mapping for get data Select Criteria
      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      const dataAttachment = (data_detail?.taxCodeAttDtos || []).map((item) => {
        return {
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.type,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          uploadBy: item.createdBy,
          uploadDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });

      // Data Criteria Information
      const dataCriteriaList = (data_detail?.taxCodeCriteriaDataDtos || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            taxCodeId: item.taxCodeId,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
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
            startDate: item.startDate,
            endDate: item.endDate,
            key: index + 1,
            type: "exist",
          };
        });

      form.setFieldsValue({
        taxCode: data_detail?.taxCode,
        taxCodeName: data_detail?.taxCodeName,
        taxRate: data_detail?.taxRate,
        category: data_detail?.category,
        glAccount: data_detail?.glAccount,
        startDate: moment(data_detail?.startDate),
        endDate: data_detail?.endDate
          ? moment(data_detail?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail?.description,
        apphierId: data_detail?.appHierId,
      });

      setStartDate(moment(data_detail?.startDate));
      setEndDate(data_detail?.endDate ? moment(data_detail?.endDate) : undefined);
      setSelectedHierarchy(data_detail?.appHierId);
      setListDataAttachment(dataAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataCriteriaList);
      setListDataDetail(dataCondition);
    }
  }, [dispatch, id, type, data_detail, data_detail_draft]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalHierarchyDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataApphierId && dataApphierId !== 0) {
      dispatch(getListApprovalHierarchyDetail({ id: dataApphierId }));
    }
  }, [dispatch, dataApphierId]);

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
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.TAX_CODE_VIEW,
      breadcrumbName: "Tax Code",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.INVOICE_TEMPLATE_CREATE
          : RBI_ROUTES.INVOICE_TEMPLATE_UPDATE,
      breadcrumbName: type === "create" ? "Create Tax Code" : "Update Tax Code",
    },
  ];

  const processData = ({
    listDataCriteria,
    listDataDetail,
    bodyData,
    id,
    type,
    dateFormatting,
    flag,
    data_detail,
    data_detail_draft,
    columnsTableCriteriaTaxCode,
  }) => {
    // Helper function to map listDataCriteria
    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => ({
        id: item?.id || null,
        taxCodeId: item?.taxCodeId || null,
        startDate: item.startDate
          ? moment(item.startDate).format(dateFormatting.date)
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format(dateFormatting.date)
          : null,
        customer: item.customer?.value || null,
        budget: item.budget?.value || null,
        subDistrict: item.subDistrict?.value || null,
        district: item.district?.value || null,
        city: item.city?.value || null,
        province: item.province?.value || null,
        area: item.area?.value || null,
        sor: item.sor?.value || null,
        industrialSector: item.industrialSector?.value || null,
        gsizes: item.gsizes?.value || null,
        customerSegment: item.customerSegment?.value || null,
        accountGroup: item.accountGroup?.value || null,
        serviceType: item.serviceType?.value || null,
        accountCategory: item.accountCategory?.value || null,
      }));
    };

    // Helper function to map listDataDetail
    const mapListDataDetail = (listDataDetail, dateFormatting) => {
      return listDataDetail?.map((item) => ({
        id: item.id || null,
        taxCodeId: item.taxCodeId || null,
        name: item.name || null,
        operator: item.operator || null,
        dataType: item.dataType || null,
        conditionValue: item.value || null,
        startDate: item?.startDate
          ? moment(item.startDate).format(dateFormatting.date)
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format(dateFormatting.date)
          : null,
        description: item.description || null,
      }));
    };

    // Helper function to map bodyData.criteria
    const mapCriteriaArrayObject = (
      bodyData,
      id,
      data_detail,
      data_detail_draft
    ) => {
      return bodyData?.criteria.map((item) => {
        const tempData =
          id && data_detail_draft?.id === id
            ? data_detail_draft?.taxCodeCriteriaDtos || []
            : data_detail?.taxCodeCriteriaDtos || [];
        const temp = tempData.filter((a) => item === a.criteria);
        return {
          id: temp[0]?.id || null,
          criteria: item,
          taxCodeId: temp[0]?.taxCodeId || null,
        };
      });
    };

    // Helper function to filter criteria
    const getFilteredCriteria = (bodyData, columnsTableCriteriaTaxCode) => {
      return columnsTableCriteriaTaxCode().filter(
        (item) =>
          !bodyData.criteria.includes(item.indexValue) &&
          bodyData.criteria.includes(item.indexValue) === 1
      );
    };

    // Helper function to update dataCriteriaObject with filtered criteria
    const updateDataCriteriaObject = (dataCriteriaObject, filteredCriteria) => {
      return dataCriteriaObject.map((item) => {
        let obj = { ...item };
        filteredCriteria.forEach((criteria) => {
          obj[criteria.dataIndexForm] = null;
        });
        return obj;
      });
    };

    const dataCriteriaObject = mapListDataCriteria(
      listDataCriteria,
      dateFormatting
    );

    const dataCondition = mapListDataDetail(listDataDetail, dateFormatting);

    const criteriaArrayObject = mapCriteriaArrayObject(
      bodyData,
      id,
      data_detail,
      data_detail_draft
    );

    const filteredCriteria = getFilteredCriteria(
      bodyData,
      columnsTableCriteriaTaxCode
    );

    const updatedDataCriteriaObject = updateDataCriteriaObject(
      dataCriteriaObject,
      filteredCriteria
    );

    const includesAll = bodyData.criteria.includes(24);

    const body = {
      taxCodeId: type === "update" ? id : null,
      apphierId: bodyData.apphierId,
      taxCodeName: bodyData.taxCodeName,
      taxCode: bodyData.taxCode,
      taxRate: bodyData.taxRate.toString(),
      category: bodyData.category,
      glAccount: bodyData.glAccount || null,
      startDate: moment(bodyData?.startDate).format(dateFormatting.date),
      endDate: bodyData?.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.date)
        : null,
      description: bodyData.description ? bodyData.description : null,
      taxCodeConditionDtos: dataCondition ? dataCondition : [],
      taxCodeCriteriaDtos: criteriaArrayObject,
      taxCodeCriteriaDataDtos: includesAll
        ? [{ allCriteria: true }]
        : updatedDataCriteriaObject,
      action: flag,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/tax-code/validate-create"
        : "/v1/dbs/api/tax-code/validate-update";

    const body = processData({
      listDataCriteria,
      listDataDetail,
      bodyData: formValue,
      id,
      type,
      dateFormatting,
      flag: flagRef.current ? "SUBMIT" : "DRAFT",
      data_detail,
      data_detail_draft,
      columnsTableCriteriaTaxCode,
    });

    try {
      await dispatch(
        validateCreateUpdate({
          body: body,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const lowerCaseCheckedCriteria = (name) => {
    let nameChecked = `${name
      ?.toString()
      ?.toLowerCase()
      ?.replace(/[-\s]/g, "")}`;
    switch (nameChecked) {
      case "subdistrict":
        return "subDistrict";
      case "budgettype":
        return "budget";
      case "industrialsector":
        return "industrialSector";
      case "servicetype":
        return "serviceType";
      case "costcenter":
        return "area";
      case "customersegment":
        return "customerSegment";
      case "accountcategory":
        return "accountCategory";
      case "accountgrouptype":
        return "accountGroup";
      case "account":
        return "customer";
      default:
        return nameChecked;
    }
  };

  const hasValueCriteria = (value) => {
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      value === "-" ||
      value === "Invalid date"
    ) {
      return false;
    } else if (typeof value === "object") {
      return (
        value.hasOwnProperty("value") &&
        value.value !== null &&
        value.value !== undefined &&
        value.hasOwnProperty("label") &&
        value.label !== null &&
        value.label !== undefined
      );
    } else {
      return true;
    }
  };

  const validateCriteriaFields = (
    criteriaValues,
    dataCriteria,
    listDataCriteria = [],
    setMissingColumn = () => {},
    minimumData = 0
  ) => {
    let missingColumn = [];
    const tempArray = criteriaValues.filter((item) =>
      dataCriteria?.includes(item.value)
    );
    const tempNameCriteria = tempArray.map((data) => data.name);
    listDataCriteria?.map((item) => {
      tempNameCriteria?.forEach((criteriaName) => {
        if (
          !item[lowerCaseCheckedCriteria(criteriaName)] || //no column
          !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)]) //no value at object
        ) {
          missingColumn.push(criteriaName);
        }
      });
    });
    const uniqueMissingColumn =
      missingColumn
        .filter((item, index) => {
          return missingColumn.indexOf(item) === index;
        })
        ?.filter((item) => item !== "All") || [];
    setMissingColumn(uniqueMissingColumn);
    return uniqueMissingColumn?.length > 0 ||
      !((listDataCriteria?.length || 0) >= minimumData)
      ? true
      : false;
  };

  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      if (
        moment(item?.startDate) < moment(formHeader?.startDate) ||
        moment(item?.endDate) > moment(formHeader?.endDate)?.add(1, "days")
      ) {
        dataOverlap?.push(item);
      }
    });

    if (dataOverlap?.length > 0) {
      return true;
    } else {
      return false;
    }
  }, []);
  const handleSave = async (formValue) => {
    let errorBody = {};
    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria
    );
    const hasOverlappingCondition = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataDetail
    );
    if (listDataAttachment.length === 0) {
      handleMandatory(setTabPages, listDataAttachment);
      setModalIncomplete({
        isOpen: true,
        stepName: "ATTACHMENT",
        stepIndex: 2,
      });
    } else {
      handleMandatory(setTabPages, listDataAttachment);
      if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: "Criteria Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (listDataDetail.length === 0) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: "Condition Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (storedDataInline) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: `Please save data table inline before submit. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else if (
        validateCriteriaFields(
          criteriaOptions,
          formValue?.criteria,
          listDataCriteria,
          () => {},
          0
        )
      ) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `There is missing values in table criteria. Please try again`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlapping) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `You can't add Criteria. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlappingCondition) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `You can't add Condition. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const isDataValid = await checkDataValidity(formValue);

        if (isDataValid) {
          setBodyData({
            ...formValue,
          });
          setModalConfirm(true);
          setTabPages([
            {
              value: "Tax Code",
              paramValue: [
                "taxCode",
                "taxCodeName",
                "taxRate",
                "category",
                // "glAccount",
                "startDate",
                "criteria",
              ],
            },
            { value: "Approval", paramValue: ["apphierId"] },
            { value: "Attachment" },
          ]);
        } else {
          setModalConfirm(false);
        }
      }
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const body = processData({
      listDataCriteria,
      listDataDetail,
      bodyData,
      id,
      type,
      dateFormatting,
      flag: flagRef.current ? "SUBMIT" : "DRAFT",
      data_detail,
      data_detail_draft,
      columnsTableCriteriaTaxCode,
    });

    if (type === "create") {
      dispatch(createTaxCode({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const taxCodeId = dataForm?.taxCodeId;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/tax-code/upload-attachment/${taxCodeId}`,
              body
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
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
      dispatch(updateTaxCode({ body: body }))
        .unwrap()
        .then(async () => {
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/tax-code/upload-attachment/${id}`,
              body
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
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

  const handleMandatory = (
    setListSectionInfo = () => {},
    listDataAttachment,
    errorFields
  ) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0
              )
            : listDataAttachment.length < 1
            ? 1
            : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  // Handle Error Tab Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabPages, listDataAttachment, errorFields);

    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = tabPages.findIndex((page) =>
        page.paramValue?.includes(firstError)
      );

      if (stepIndex !== -1) {
        setModalIncomplete({
          isOpen: true,
          stepName: steps[stepIndex].title,
          stepIndex: stepIndex,
        });
      }
    }
  };

  const handleSubmit = () => {
    flagRef.current = true;
    setTimeout(() => form.submit(), 0);
  };

  const handleSaveDraft = () => {
    flagRef.current = false;
    setTimeout(() => form.submit(), 0);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setListDataDetail([]);
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setBodyData({});
      setListDataCriteria([]);
      setCriteriaValues([]);
      setStoredDataInline(false);
      setCurrent(0);
      setTabPages([
        {
          value: "Tax Code",
          paramValue: [
            "taxCode",
            "taxCodeName",
            "taxRate",
            "category",
            // "glAccount",
            "startDate",
            "criteria",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailTaxCode(id));
      dispatch(getDetailDraftTaxCode(id));
    }
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

  // Function Get Data StartDate
  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  // Function Get Data End Date
  const handleEndDate = (value) => {
    setEndDate(value);
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
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
          scrollToFirstError={true}
        >
          <div style={{ display: valuePage !== "Tax Code" ? "none" : undefined }}>
            <TaxCodeSectionForm
              type={type}
              form={form}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              listDataDetail={listDataDetail}
              setListDataDetail={setListDataDetail}
              storedDataInline={storedDataInline}
              setStoredDataInline={setStoredDataInline}
              startDate={startDate}
              endDate={endDate}
              status={status}
              statusApproval={statusApproval}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              disabledDate={isDisabledDate}
            />
          </div>

          <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
            <CardContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
            <CardContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="tax_code"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={() => setModalBack(true)}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
          />
        </Form>

        {/* Modal Confirmation */}
        <ModalConfirmationTaxCode
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          data={bodyData}
          listDataAppHierDetail={appHierDataDetail}
          apiApproval={dataListAppHierId}
          listDataAttachment={listDataAttachment}
          listDataCriteria={listDataCriteria}
          setListDataCriteria={setListDataCriteria}
          listDataDetail={listDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          criteriaValues={criteriaValues}
          dataCategory={data_category}
          apiCriteria={data_criteria}
        />

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* Modal Retry */}
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
              flagRef.current ? "submitted" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal Incomplete */}
        <ModalError
          isOpen={modalIncomplete.isOpen}
          handleOk={() => {
            setCurrent(modalIncomplete.stepIndex);
            setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 });
          }}
          handleCancel={() => setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 })}
          customText="Go to Step"
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Incomplete Data"}</p>
            </div>
            <p className="pl-[70px]">Please complete the mandatory fields in the <b>{modalIncomplete.stepName}</b> section before proceeding.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};
export default TaxCodeForm;

