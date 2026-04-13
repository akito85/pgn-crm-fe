import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import ContentSectionForm from "./ContentSectionForm";
import { dateFormatting, hasValue } from "../../../../../utils";
import { showModalError } from "../../../../../redux/slices/general_slice";
import {
  getCriteria,
  getListFormat,
  getListCategory,
  getListMedia,
  createContentManagement,
  updateContentManagement,
  getAvailableApproval,
  getSelectedApproval,
  getAttachmentCategory,
  getDetailContentManagement,
  getDetailDraftContentManagement,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/contentManagement";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { configApp } from "../../../../../constants/configApp";
import { columnsTableCriteriaBillingBucket } from "./Table/TableCriteriaBillingBucket";
import { ModalConfirm, ModalError } from "../../../../../components/Modal/ModalPopUp";
import ConfirmationContentManagement from "./Modal/ConfirmationContentManagement";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const transformApiDataToForm = (apiData) => {
  if (!apiData) return null;

  const isFlat = !apiData.contentTemplate;
  const template = isFlat ? apiData : (apiData.contentTemplate || {});

  // Criteria list (display names): new = criteriaDtoList, old = contentCriteria
  const criteriaDtoList = apiData.criteriaDtoList || [];
  const contentCriteria = apiData.contentCriteria || [];

  // Criteria data rows: new = criteriaDataDtoList, old = contentCriteria (filtered)
  const criteriaDataDtoList = apiData.criteriaDataDtoList || [];

  // Attachments: new = attachmentDtoList, old = mattachmentLists
  const attachmentList = apiData.attachmentDtoList || apiData.mattachmentLists || [];

  // Build criteria array (for form field "criteria" = array of criteria IDs)
  const criteriaForForm = isFlat
    ? criteriaDtoList.map((item) => ({
        contentCriteriaId: item.id,
        criteria: item.criteria, // criteria ID number
      }))
    : contentCriteria.map((item) => ({
        contentCriteriaId: item.id,
        criteria: item.criteriaId || null,
      }));

  // Build criteria data rows
  const criteriaDataForForm = isFlat
    ? criteriaDataDtoList.filter((item) => !item.allCriteria)
    : contentCriteria.filter((item) => item.allCriteria !== "Y");

  return {
    information: {
      id: template?.id,
      name: template?.templateName,
      format: template?.formatType,
      category: template?.category,
      media: template?.mediaChannel,
      startDate: template?.startDate,
      endDate: template?.endDate,
      description: template?.description,
      apphierId: template?.approvalId,
      status: template?.status,
      statusApproval: template?.statusApproval,
    },
    content: {
      subject: template?.contentSubject,
      body: template?.contentBody,
    },
    criteria: criteriaForForm,
    criteriaData: criteriaDataForForm.map((item) => ({
      id: item.id,
      // New API: field values already in {label, value} object format
      // Old API: plain string values — wrap them
      budget: item.budget
        ? (typeof item.budget === "object" ? item.budget : { value: item.budget, label: item.budget })
        : null,
      subDistrict: item.subDistrict
        ? (typeof item.subDistrict === "object" ? item.subDistrict : { value: item.subDistrict, label: item.subDistrict })
        : null,
      district: item.district
        ? (typeof item.district === "object" ? item.district : { value: item.district, label: item.district })
        : null,
      city: item.city
        ? (typeof item.city === "object" ? item.city : { value: item.city, label: item.city })
        : null,
      province: item.province
        ? (typeof item.province === "object" ? item.province : { value: item.province, label: item.province })
        : null,
      area: item.area
        ? (typeof item.area === "object" ? item.area : { value: item.area, label: item.area })
        : null,
      costCenter: item.area
        ? (typeof item.area === "object" ? item.area : { value: item.area, label: item.area })
        : null,
      sor: item.sor
        ? (typeof item.sor === "object" ? item.sor : { value: item.sor, label: item.sor })
        : null,
      industrialSector: item.industrialSector
        ? (typeof item.industrialSector === "object" ? item.industrialSector : { value: item.industrialSector, label: item.industrialSector })
        : null,
      gsizes: item.gsizes
        ? (typeof item.gsizes === "object" ? item.gsizes : { value: item.gsizes, label: item.gsizes })
        : null,
      customerSegment: item.customerSegment
        ? (typeof item.customerSegment === "object" ? item.customerSegment : { value: item.customerSegment, label: item.customerSegment })
        : null,
      accountGroup: (item.accountGroup || item.accountGroupType)
        ? (typeof (item.accountGroup || item.accountGroupType) === "object"
            ? (item.accountGroup || item.accountGroupType)
            : { value: (item.accountGroup || item.accountGroupType), label: (item.accountGroup || item.accountGroupType) })
        : null,
      accountClass: item.accountClass
        ? (typeof item.accountClass === "object" ? item.accountClass : { value: item.accountClass, label: item.accountClass })
        : null,
      accountCategory: item.accountCategory
        ? (typeof item.accountCategory === "object" ? item.accountCategory : { value: item.accountCategory, label: item.accountCategory })
        : null,
      serviceType: item.serviceType
        ? (typeof item.serviceType === "object" ? item.serviceType : { value: item.serviceType, label: item.serviceType })
        : null,
      customer: item.customer
        ? (typeof item.customer === "object" ? item.customer : { value: item.customer, label: item.customer })
        : null,
      product: item.product
        ? (typeof item.product === "object" ? item.product : { value: item.product, label: item.product })
        : null,
      accountNumber: item.accountNumber
        ? (typeof item.accountNumber === "object" ? item.accountNumber : { value: item.accountNumber, label: item.accountNumber })
        : null,
      startDate: item.startDate,
      endDate: item.endDate,
      allCriteria: isFlat ? item.allCriteria : item.allCriteria === "Y",
    })),
    mattachmentLists: attachmentList,
    listCriteria: criteriaForForm,
  };
};

const ContentManagementForm = ({ type }) => {
  // Selector
  const {
    data_format,
    data_category,
    data_media,
    data_criteria,
    data_detail_draft,
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.contentManagement);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  // State untuk Stepper
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "CONTENT", value: "Content Information" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Content Information",
      paramValue: [
        "name",
        "format",
        "category",
        "media",
        "criteria",
        "startDate",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  // State lainnya
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [flag, setFlag] = useState(false);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [subjectValue, setSubjectValue] = useState("");
  const [bodyValue, setBodyValue] = useState("");

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

  const isLoading = loading || loadingForm;

  // Stepper navigation handlers
  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current === 0) {
            const formData = form.getFieldsValue();
            if (!subjectValue || subjectValue.trim() === "") {
              dispatch(showModalError({ title: "Failed", description: "Subject is required. Please input subject." }));
              return;
            }
            if (!bodyValue || bodyValue.trim() === "") {
              dispatch(showModalError({ title: "Failed", description: "Body content is required. Please input body." }));
              return;
            }
            if (listDataCriteria.length === 0 && !formData?.criteria?.includes(24)) {
              dispatch(showModalError({ title: "Failed", description: "Criteria Mandatory. Please insert data." }));
              return;
            }
          }
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  // Use Effect
  useEffect(() => {
    dispatch(getListFormat());
    dispatch(getListCategory());
    dispatch(getListMedia());
    dispatch(getCriteria());
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval());
    dispatch(getAttachmentCategory());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailContentManagement(id));
      dispatch(getDetailDraftContentManagement(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (data_criteria) {
      const tempCriterias = (data_criteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_criteria]);

  // ✅ useEffect untuk populate form
  useEffect(() => {
    const transformedDetail = data_detail ? transformApiDataToForm(data_detail) : null;
    const transformedDraft = data_detail_draft ? transformApiDataToForm(data_detail_draft) : null;

    if (
      id &&
      transformedDraft?.information?.id === id &&
      transformedDetail?.information?.id === id
    ) {
      const mappingCriteria = (transformedDraft?.criteria || []).map((a) => a.criteria);

      const dataDraftAttachment = (transformedDraft?.mattachmentLists || []).map((item) => ({
        id: item.id,
        size: item.fileSize,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile || "",
        urlFile1: `/v1/dbs/api/content/download-attachment/${item.id}`,
        urlFile2: `/v1/dbs/api/content/download-attachment/${item.id}`,
        uploadBy: item.createdBy,
        uploadDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
        dataType: "exist",
      }));

      // criteriaData sudah dalam format {value, label} dari transformApiDataToForm
      const dataDraftCriteriaList = (transformedDraft?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => ({
          ...item,
          key: index + 1,
          type: "exist",
        }));

      form.setFieldsValue({
        name: transformedDraft?.information?.name,
        format: transformedDraft?.information?.format,
        category: transformedDraft?.information?.category,
        media: transformedDraft?.information?.media,
        startDate: moment(transformedDraft?.information?.startDate),
        endDate: transformedDraft?.information?.endDate ? moment(transformedDraft?.information?.endDate) : undefined,
        criteria: mappingCriteria,
        description: transformedDraft?.information?.description,
        apphierId: transformedDraft?.information?.apphierId,
      });

      setStartDate(moment(transformedDraft?.information?.startDate));
      setSelectedHierarchy(transformedDraft?.information?.apphierId);
      setListDataAttachment(dataDraftAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataDraftCriteriaList);
      setSubjectValue(transformedDraft?.content?.subject || "");
      setBodyValue(transformedDraft?.content?.body || "");

    } else if (
      id &&
      !transformedDraft?.information?.id &&
      transformedDetail?.information?.id === id
    ) {
      const mappingCriteria = (transformedDetail?.criteria || []).map((a) => a.criteria);

      const dataAttachment = (transformedDetail?.mattachmentLists || []).map((item) => ({
        id: item.id,
        size: item.fileSize,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile || "",
        urlFile1: `/v1/dbs/api/content/download-attachment/${item.id}`,
        urlFile2: `/v1/dbs/api/content/download-attachment/${item.id}`,
        uploadBy: item.createdBy,
        uploadDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
        dataType: "exist",
      }));

      // criteriaData sudah dalam format {value, label} dari transformApiDataToForm
      const dataCriteriaList = (transformedDetail?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => ({
          ...item,
          key: index + 1,
          type: "exist",
        }));

      form.setFieldsValue({
        name: transformedDetail?.information?.name,
        format: transformedDetail?.information?.format,
        category: transformedDetail?.information?.category,
        media: transformedDetail?.information?.media,
        startDate: moment(transformedDetail?.information?.startDate),
        endDate: transformedDetail?.information?.endDate ? moment(transformedDetail?.information?.endDate) : undefined,
        criteria: mappingCriteria,
        description: transformedDetail?.information?.description,
        apphierId: transformedDetail?.information?.apphierId,
      });

      setStartDate(moment(transformedDetail?.information?.startDate));
      setSelectedHierarchy(transformedDetail?.information?.apphierId);
      setListDataAttachment(dataAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataCriteriaList);
      setSubjectValue(transformedDetail?.content?.subject || "");
      setBodyValue(transformedDetail?.content?.body || "");
    }
  }, [id, type, form, data_detail, data_detail_draft]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({ ...b, key: index + 1 })),
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
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RBI_ROUTES.CONTENT_MANAGEMENT, breadcrumbName: "Content Management" },
    {
      path: type === "create" ? RBI_ROUTES.CONTENT_MANAGEMENT_CREATE : RBI_ROUTES.CONTENT_MANAGEMENT_UPDATE,
      breadcrumbName: type === "create" ? "Create Content Management" : "Update Content Management",
    },
  ];

  const processData = ({ listDataCriteria, bodyData, id, type, dateFormatting, flag, data_detail, data_detail_draft, columnsTableCriteriaBillingBucket }) => {
    // Build mapping dari dataIndexForm ke indexValue (criteriaId)
    const columnDefs = columnsTableCriteriaBillingBucket();
    const fieldToCriteriaIdMap = {};
    columnDefs.forEach((col) => {
      if (col.dataIndexForm && col.indexValue) {
        fieldToCriteriaIdMap[col.dataIndexForm] = col.indexValue;
      }
    });

    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => {
        // Cari criteriaId berdasarkan field yang memiliki value
        let criteriaId = item?.criteriaId || null;
        if (!criteriaId) {
          for (const [field, idValue] of Object.entries(fieldToCriteriaIdMap)) {
            const val = item[field];
            if (val !== null && val !== undefined && val !== "") {
              const actualVal = typeof val === "object" ? val.value : val;
              if (actualVal !== null && actualVal !== undefined && actualVal !== "") {
                criteriaId = String(idValue);
                break;
              }
            }
          }
        }

        return {
          id: item?.id || null,
          criteriaId: criteriaId,
          startDate: item.startDate ? moment(item.startDate).format(dateFormatting.dateFormal) : null,
          endDate: item.endDate ? moment(item.endDate).format(dateFormatting.dateFormal) : null,
          customer: item.customer?.value || null,
          budget: item.budget?.value || null,
          subDistrict: item.subDistrict?.value || null,
          district: item.district?.value || null,
          city: item.city?.value || null,
          province: item.province?.value || null,
          area: item.area?.value || null,
          costCenter: item.area?.value || null,
          sor: item.sor?.value || null,
          industrialSector: item.industrialSector?.value || null,
          gsizes: item.gsizes?.value || null,
          customerSegment: item.customerSegment?.value || null,
          accountGroup: item.accountGroup?.value || null,
          accountClass: item.accountClass?.value || null,
          serviceType: item.serviceType?.value || null,
          accountCategory: item.accountCategory?.value || null,
          product: item.product?.value || null,
          accountNumber: item.accountNumber?.value || null,
          allCriteria: false,
        };
      });
    };

    const dataCriteriaObject = mapListDataCriteria(listDataCriteria, dateFormatting);
    const filteredCriteria = columnsTableCriteriaBillingBucket().filter(
      (item) => !bodyData.criteria.includes(item.indexValue) && bodyData.criteria.includes(item.indexValue) === 1
    );
    const updatedDataCriteriaObject = dataCriteriaObject.map((item) => {
      let obj = { ...item };
      filteredCriteria.forEach((criteria) => { obj[criteria.dataIndexForm] = null; });
      return obj;
    });

    const includesAll = bodyData.criteria.includes(24);

    return {
      id: type === "create" ? undefined : id,
      type: flag ? "SUBMIT" : "DRAFT",
      name: bodyData.name,
      format: bodyData.format,
      category: bodyData.category,
      media: bodyData.media,
      startDate: bodyData.startDate ? moment(bodyData?.startDate).format(dateFormatting.dateFormal) : null,
      endDate: bodyData.endDate ? moment(bodyData?.endDate).format(dateFormatting.dateFormal) : null,
      description: bodyData.description ? bodyData.description : null,
      content: {
        subject: bodyData.subject || "",
        body: bodyData.body || "",
      },
      criteriaData: includesAll ? [{ allCriteria: true }] : updatedDataCriteriaObject,
      apphierId: bodyData.apphierId,
    };
  };

  const lowerCaseCheckedCriteria = (name) => {
    let nameChecked = `${name?.toString()?.toLowerCase()?.replace(/[-\s]/g, "")}`;
    switch (nameChecked) {
      case "subdistrict": return "subDistrict";
      case "budgettype": return "budget";
      case "industrialsector": return "industrialSector";
      case "servicetype": return "serviceType";
      case "costcenter": return "area";
      case "customersegment": return "customerSegment";
      case "accountcategory": return "accountCategory";
      case "accountgrouptype": return "accountGroup";
      case "account": return "customer";
      case "gsizes": return "gsizes";
      default: return nameChecked;
    }
  };

  const hasValueCriteria = (value) => {
    if (value === "" || value === undefined || value === null || value === "-" || value === "Invalid date") {
      return false;
    } else if (typeof value === "object") {
      return value.hasOwnProperty("value") && value.value !== null && value.value !== undefined &&
        value.hasOwnProperty("label") && value.label !== null && value.label !== undefined;
    } else {
      return true;
    }
  };

  const validateCriteriaFields = (criteriaValues, dataCriteria, listDataCriteria = [], setMissingColumn = () => {}, minimumData = 0) => {
    let missingColumn = [];
    const tempArray = criteriaValues.filter((item) => dataCriteria?.includes(item.value));
    const tempNameCriteria = tempArray.map((data) => data.name);
    listDataCriteria?.map((item) => {
      tempNameCriteria?.forEach((criteriaName) => {
        if (!item[lowerCaseCheckedCriteria(criteriaName)] || !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)])) {
          missingColumn.push(criteriaName);
        }
      });
    });
    const uniqueMissingColumn = missingColumn
      .filter((item, index) => missingColumn.indexOf(item) === index)
      ?.filter((item) => item !== "All") || [];
    setMissingColumn(uniqueMissingColumn);
    return uniqueMissingColumn?.length > 0 || !((listDataCriteria?.length || 0) >= minimumData) ? true : false;
  };

  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const headerStart = formHeader?.startDate
      ? moment(formHeader.startDate).startOf("day")
      : null;
    const headerEnd = formHeader?.endDate
      ? moment(formHeader.endDate).startOf("day")
      : null;

    const dataOverlap = [];
    dataTable?.forEach((item) => {
      const itemStart = item?.startDate
        ? moment(item.startDate).startOf("day")
        : null;
      const itemEnd = item?.endDate
        ? moment(item.endDate).startOf("day")
        : null;

      // Criteria startDate harus >= header startDate
      const startOutOfRange =
        headerStart && itemStart && itemStart.isBefore(headerStart);

      // Criteria endDate harus <= header endDate
      // Hanya dicek jika header memiliki endDate (bukan open-ended)
      const endOutOfRange =
        headerEnd && itemEnd && itemEnd.isAfter(headerEnd);

      if (startOutOfRange || endOutOfRange) {
        dataOverlap.push(item);
      }
    });
    return dataOverlap?.length > 0;
  }, []);

  // ✅ FIXED: handleSave - subjectValue & bodyValue selalu tersedia
  // karena komponen tidak unmount (display:none)
  const handleSave = async (formValue) => {
    if (!subjectValue || subjectValue.trim() === "") {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "Subject is required. Please input subject." }));
      return;
    }

    if (!bodyValue || bodyValue.trim() === "") {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "Body content is required. Please input body." }));
      return;
    }

    if (listDataAttachment.length === 0) {
      setListSectionInfo((prev) =>
        prev.map((item) => item.value === "Attachment" ? { ...item, errorBadge: 1 } : { ...item, errorBadge: 0 })
      );
      setModalIncomplete({
        isOpen: true,
        stepName: steps[2].title,
        stepIndex: 2,
      });
      return;
    }

    if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "Criteria Mandatory. Please insert data." }));
      return;
    }

    if (storedDataInline) {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "Please save data table inline before submit. Please try again." }));
      return;
    }

    if (validateCriteriaFields(criteriaOptions, formValue?.criteria, listDataCriteria, () => {}, 0)) {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "There is missing values in table criteria. Please try again" }));
      return;
    }

    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria
    );

    if (hasOverlapping) {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "You can't add Criteria. Start date and end date can't be overlap" }));
      return;
    }

    // ✅ Semua validasi lolos - gunakan subjectValue & bodyValue dari state
    const finalBodyData = {
      ...formValue,
      subject: subjectValue,
      body: bodyValue,
    };

    setBodyData(finalBodyData);
    setModalConfirm(true);

    setListSectionInfo([
      { value: "Content Information", paramValue: ["name", "format", "category", "media", "criteria", "startDate"] },
      { value: "Approval", paramValue: ["apphierId"] },
      { value: "Attachment" },
    ]);
  };

  const handleConfirm = () => {
    setLoadingSave(true);
    setModalConfirm(false);

    const body = processData({
      listDataCriteria,
      bodyData,
      id,
      type,
      dateFormatting,
      flag,
      data_detail,
      data_detail_draft,
      columnsTableCriteriaBillingBucket,
    });

    if (type === "create") {
      dispatch(createContentManagement({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const templateId = dataForm?.createdId || dataForm?.data?.createdId;
          if (!templateId) {
            setModalError(true);
            setBodyError({ message: "Failed to get template ID from response" });
            setLoadingSave(false);
            return;
          }

          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            try {
              await ratingBillingHttpService.uploadAttachment(`/v1/dbs/api/content/create-attachment`, {
                files: element.file,
                categoryId: element.fileCategoryId,
                referenceId: templateId,
              });
            } catch (uploadError) {
              console.error(`Failed to upload attachment ${icon + 1}:`, uploadError);
            }
          }
          setLoadingForm(false);
          setLoadingSave(false);
          handleClear();
        })
        .catch((error) => {
          setLoadingSave(false);
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            setBodyError({ message: error.response?.data?.message || error.message || error.toString() });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateContentManagement({ body: body, id: id }))
        .unwrap()
        .then(async () => {
          const filterDataAttach = listDataAttachment.filter((item) => item.dataType !== "exist");
          setLoadingForm(true);
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            try {
              await ratingBillingHttpService.uploadAttachment(`/v1/dbs/api/content/create-attachment`, {
                files: element.file,
                categoryId: element.fileCategoryId,
                referenceId: id,
              });
            } catch (uploadError) {
              console.error(`Failed to upload attachment ${icon + 1}:`, uploadError);
            }
          }
          setLoadingForm(false);
          setLoadingSave(false);
          handleClear();
        })
        .catch((error) => {
          setLoadingSave(false);
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            setBodyError({ message: error.response?.data?.message || error.message || error.toString() });
            setModalError(true);
          }
        });
    }
  };

  const handleMandatory = (setListSectionInfo = () => {}, listDataAttachment, errorFields) => {
    setListSectionInfo((prevState) => {
      return prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) => item.paramValue?.includes(next.name[0]) ? current + 1 : current, 0
              )
            : listDataAttachment?.length < 1 ? 1 : 0;
        return { value: item.value, paramValue: item.paramValue, errorBadge };
      });
    });
  };

  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);

    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = listSectionInfo.findIndex((page) =>
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

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setBodyData({});
      setListDataCriteria([]);
      setCriteriaValues([]);
      setStoredDataInline(false);
      setSubjectValue("");
      setBodyValue("");
      setListSectionInfo([
        { value: "Content Information", paramValue: ["name", "format", "category", "media", "criteria", "startDate"] },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailContentManagement(id));
      dispatch(getDetailDraftContentManagement(id));
    }
    setCurrent(0);
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

  const handleBack = () => setModalBack(true);

  const handleSubmit = () => {
    setFlag(true);
    setTimeout(() => { form.submit(); }, 0);
  };

  const handleSaveDraft = () => {
    setFlag(false);
    setTimeout(() => { form.submit(); }, 0);
  };

  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />

        <Form layout="vertical" form={form} onFinish={handleSave} onFinishFailed={handleError}>

          {/* ✅ FIXED: Gunakan display:none seperti PosForm agar komponen tidak unmount
              sehingga state subjectValue & bodyValue tetap terjaga saat pindah step */}

          {/* Step 1: Content Information */}
          <div style={{ display: valuePage !== listSectionInfo[0].value ? "none" : undefined }}>
            <ContentSectionForm
              type={type}
              form={form}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              storedDataInline={storedDataInline}
              setStoredDataInline={setStoredDataInline}
              status={status}
              statusApproval={statusApproval}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              disabledDate={isDisabledDate}
              subjectValue={subjectValue}
              setSubjectValue={setSubjectValue}
              bodyValue={bodyValue}
              setBodyValue={setBodyValue}
            />
          </div>

          {/* Step 2: Approval */}
          <div style={{ display: valuePage !== listSectionInfo[1].value ? "none" : undefined }}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          {/* Step 3: Attachment */}
          <div style={{ display: valuePage !== listSectionInfo[2].value ? "none" : undefined }}>
            <BaseContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="contentManagement"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
            disabled={storedDataInline}
          />
        </Form>

        {/* Modal Confirmation */}
        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          header={"CONFIRMATION"}
          width={1200}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent onClick={() => setModalConfirm(false)} type="default">Cancel</ButtonComponent>
              <ButtonComponent
                className="!bg-[#28a745] !border-[#28a745] hover:!bg-[#218838]"
                isPrimary
                onClick={handleConfirm}
                loading={loadingSave}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmationContentManagement
            data={bodyData}
            selectedHierarchy={selectedHierarchy}
            apiFormat={data_format}
            apiCategory={data_category}
            apiMedia={data_media}
            apiCriteria={data_criteria}
            criteriaValues={criteriaValues}
            listDataAppHierDetail={appHierDataDetail}
            listDataCriteria={listDataCriteria}
            dataOption={appHierOptions}
          />
        </ModalCustom>

        {/* Modal Back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">Are you sure you want to back?</p>
          </div>
        </ModalConfirm>

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
            <p className="pl-[70px]">{`Your data was not ${flag ? "submitted" : "saved as draft"}. ${bodyError.message}.`}</p>
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

export default ContentManagementForm;