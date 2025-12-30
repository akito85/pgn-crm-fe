import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import RadioTabs from "../../../../../components/RadioTabs";
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
import ModalBack from "../../../../../components/Modal/ModalBack";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ConfirmationContentManagement from "./Modal/ConfirmationContentManagement";

// ✅ Helper function untuk transform data dari API ke format form
const transformApiDataToForm = (apiData) => {
  if (!apiData) return null;

  const contentTemplate = apiData.contentTemplate;
  const contentCriteria = apiData.contentCriteria || [];
  
  return {
    information: {
      id: contentTemplate?.id,
      name: contentTemplate?.templateName,
      format: contentTemplate?.formatType,
      category: contentTemplate?.category,
      media: contentTemplate?.mediaChannel,
      startDate: contentTemplate?.startDate,
      endDate: contentTemplate?.endDate,
      description: contentTemplate?.description,
      apphierId: contentTemplate?.approvalId,
      status: contentTemplate?.status,
      statusApproval: contentTemplate?.statusApproval,
    },
    content: {
      subject: contentTemplate?.contentSubject,
      body: contentTemplate?.contentBody,
    },
    criteria: contentCriteria.map(item => ({
      contentCriteriaId: item.id,
      criteria: item.criteriaId || null,
    })),
    criteriaData: contentCriteria
      .filter(item => item.allCriteria !== 'Y')
      .map(item => ({
        id: item.id,
        budget: item.budget,
        subDistrict: item.subDistrict,
        district: item.district,
        city: item.city,
        province: item.province,
        area: item.area,
        costCenter: item.area,
        sor: item.sor,
        industrialSector: item.industrialSector,
        gsizes: item.gsizes,
        customerSegment: item.customerSegment,
        accountGroup: item.accountGroupType,
        accountClass: item.accountClass,
        accountCategory: item.accountCategory,
        serviceType: item.serviceType,
        customer: item.customer,
        product: item.product,
        accountNumber: item.accountNumber,
        startDate: item.startDate,
        endDate: item.endDate,
        allCriteria: item.allCriteria === 'Y',
      })),
    mattachmentLists: apiData.mattachmentLists || [],
    listCriteria: contentCriteria.map(item => ({
      contentCriteriaId: item.id,
      criteria: item.criteriaId || null,
    })),
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

  // State
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
  const [valuePage, setValuePage] = useState("Content Information");
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
        "subject",
        "body",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [storedDataInline, setStoredDataInline] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
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

  // ✅ useEffect untuk populate form - DENGAN TRANSFORM
  useEffect(() => {
    // Transform data dari API
    const transformedDetail = data_detail ? transformApiDataToForm(data_detail) : null;
    const transformedDraft = data_detail_draft ? transformApiDataToForm(data_detail_draft) : null;

    if (
      id &&
      transformedDraft?.information?.id === id &&
      transformedDetail?.information?.id === id
    ) {
      // ✅ SKENARIO: Ada draft dan detail
      const criteriaSelect = transformedDraft?.criteria?.map((item) => ({
        contentCriteriaId: item.contentCriteriaId,
        criteria: item.criteria,
      }));

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      const dataDraftAttachment = (transformedDetail?.mattachmentLists || []).map(
        (item) => ({
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
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
        })
      );

      const dataDraftCriteriaList = (transformedDraft?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => ({
          id: item.id,
          budget: item.budget ? { value: item.budget, label: item.budget } : null,
          subDistrict: item.subDistrict ? { value: item.subDistrict, label: item.subDistrict } : null,
          district: item.district ? { value: item.district, label: item.district } : null,
          city: item.city ? { value: item.city, label: item.city } : null,
          province: item.province ? { value: item.province, label: item.province } : null,
          area: item.area ? { value: item.area, label: item.area } : null,
          sor: item.sor ? { value: item.sor, label: item.sor } : null,
          industrialSector: item.industrialSector ? { value: item.industrialSector, label: item.industrialSector } : null,
          gsizes: item.gsizes ? { value: item.gsizes, label: item.gsizes } : null,
          customerSegment: item.customerSegment ? { value: item.customerSegment, label: item.customerSegment } : null,
          accountGroup: item.accountGroup ? { value: item.accountGroup, label: item.accountGroup } : null,
          accountClass: item.accountClass ? { value: item.accountClass, label: item.accountClass } : null,
          accountCategory: item.accountCategory ? { value: item.accountCategory, label: item.accountCategory } : null,
          serviceType: item.serviceType ? { value: item.serviceType, label: item.serviceType } : null,
          customer: item.customer ? { value: item.customer, label: item.customer } : null,
          product: item.product ? { value: item.product, label: item.product } : null,
          accountNumber: item.accountNumber ? { value: item.accountNumber, label: item.accountNumber } : null,
          startDate: item.startDate,
          endDate: item.endDate,
          key: index + 1,
          type: "exist",
        }));

      form.setFieldsValue({
        name: transformedDraft?.information?.name,
        format: transformedDraft?.information?.format,
        category: transformedDraft?.information?.category,
        media: transformedDraft?.information?.media,
        startDate: moment(transformedDraft?.information?.startDate),
        endDate: transformedDraft?.information?.endDate
          ? moment(transformedDraft?.information?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: transformedDraft?.information?.description,
        subject: transformedDraft?.content?.subject,
        body: transformedDraft?.content?.body,
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
      // ✅ SKENARIO: Hanya ada detail (tidak ada draft)
      const criteriaSelect = transformedDetail?.criteria?.map((item) => ({
        contentCriteriaId: item.contentCriteriaId,
        criteria: item.criteria,
      }));

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      const dataAttachment = (transformedDetail?.mattachmentLists || []).map(
        (item) => ({
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
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
        })
      );

      const dataCriteriaList = (transformedDetail?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => ({
          id: item.id,
          budget: item.budget ? { value: item.budget, label: item.budget } : null,
          subDistrict: item.subDistrict ? { value: item.subDistrict, label: item.subDistrict } : null,
          district: item.district ? { value: item.district, label: item.district } : null,
          city: item.city ? { value: item.city, label: item.city } : null,
          province: item.province ? { value: item.province, label: item.province } : null,
          area: item.area ? { value: item.area, label: item.area } : null,
          sor: item.sor ? { value: item.sor, label: item.sor } : null,
          industrialSector: item.industrialSector ? { value: item.industrialSector, label: item.industrialSector } : null,
          product: item.product ? { value: item.product, label: item.product } : null,
          gsizes: item.gsizes ? { value: item.gsizes, label: item.gsizes } : null,
          customerSegment: item.customerSegment ? { value: item.customerSegment, label: item.customerSegment } : null,
          accountGroup: item.accountGroup ? { value: item.accountGroup, label: item.accountGroup } : null,
          accountClass: item.accountClass ? { value: item.accountClass, label: item.accountClass } : null,
          accountCategory: item.accountCategory ? { value: item.accountCategory, label: item.accountCategory } : null,
          serviceType: item.serviceType ? { value: item.serviceType, label: item.serviceType } : null,
          customer: item.customer ? { value: item.customer, label: item.customer } : null,
          accountNumber: item.accountNumber ? { value: item.accountNumber, label: item.accountNumber } : null,
          startDate: item.startDate,
          endDate: item.endDate,
          key: index + 1,
          type: "exist",
        }));

      form.setFieldsValue({
        name: transformedDetail?.information?.name,
        format: transformedDetail?.information?.format,
        category: transformedDetail?.information?.category,
        media: transformedDetail?.information?.media,
        startDate: moment(transformedDetail?.information?.startDate),
        endDate: transformedDetail?.information?.endDate
          ? moment(transformedDetail?.information?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: transformedDetail?.information?.description,
        subject: transformedDetail?.content?.subject,
        body: transformedDetail?.content?.body,
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
      path: RBI_ROUTES.CONTENT_MANAGEMENT_VIEW,
      breadcrumbName: "Content Management",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.CONTENT_MANAGEMENT_CREATE
          : RBI_ROUTES.CONTENT_MANAGEMENT_UPDATE,
      breadcrumbName:
        type === "create"
          ? "Create Content Management"
          : "Update Content Management",
    },
  ];

  const processData = ({
    listDataCriteria,
    bodyData,
    id,
    type,
    dateFormatting,
    flag,
    data_detail,
    data_detail_draft,
    columnsTableCriteriaBillingBucket,
  }) => {
    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => ({
        id: item?.id || null,
        startDate: item.startDate
          ? moment(item.startDate).format(dateFormatting.dateFormal)
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format(dateFormatting.dateFormal)
          : null,
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
      }));
    };

    const dataCriteriaObject = mapListDataCriteria(
      listDataCriteria,
      dateFormatting
    );

    const filteredCriteria = columnsTableCriteriaBillingBucket().filter(
      (item) =>
        !bodyData.criteria.includes(item.indexValue) &&
        bodyData.criteria.includes(item.indexValue) === 1
    );

    const updatedDataCriteriaObject = dataCriteriaObject.map((item) => {
      let obj = { ...item };
      filteredCriteria.forEach((criteria) => {
        obj[criteria.dataIndexForm] = null;
      });
      return obj;
    });

    const includesAll = bodyData.criteria.includes(24);

    const body = {
      id: type === "create" ? undefined : id,
      type: flag ? "SUBMIT" : "DRAFT",
      name: bodyData.name,
      format: bodyData.format,
      category: bodyData.category,
      media: bodyData.media,
      startDate: bodyData.startDate
        ? moment(bodyData?.startDate).format(dateFormatting.dateFormal)
        : null,
      endDate: bodyData.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.dateFormal)
        : null,
      description: bodyData.description ? bodyData.description : null,
      content: {
        subject: bodyData.subject || "",
        body: bodyData.body || "",
      },
      criteriaData: includesAll
        ? [{ allCriteria: true }]
        : updatedDataCriteriaObject,
      apphierId: bodyData.apphierId,
    };

    return body;
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
      case "gsizes":
        return "gsizes";
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
          !item[lowerCaseCheckedCriteria(criteriaName)] ||
          !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)])
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

  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      if (
        moment(item?.startDate) < moment(formHeader?.startDate) ||
        moment(item?.endDate) > moment(formHeader?.endDate)
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
    console.log("Form Values:", formValue);
    console.log("Subject:", formValue.subject);
    console.log("Body:", formValue.body);
    let errorBody = {};
    
    if (!subjectValue || subjectValue.trim() === "") {
      errorBody = {
        title: "Failed",
        description: "Subject is required. Please input subject.",
      };
      dispatch(showModalError(errorBody));
      return;
    }

    if (!bodyValue || bodyValue.trim() === "") {
      errorBody = {
        title: "Failed",
        description: "Body content is required. Please input body.",
      };
      dispatch(showModalError(errorBody));
      return;
    }
    
    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria
    );

    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      handleMandatory(setListSectionInfo, setListSectionInfo);
      if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
        errorBody = {
          title: "Failed",
          description: "Criteria Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (storedDataInline) {
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
        const errorBody = {
          title: "Failed",
          description: `There is missing values in table criteria. Please try again`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlapping) {
        const errorBody = {
          title: "Failed",
          description: `You can't add Criteria. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else {
        setBodyData({
          ...formValue,
          subject: subjectValue,
          body: bodyValue,
        });
        setModalConfirm(true);
        setListSectionInfo([
          {
            value: "Content Information",
            paramValue: [
              "name",
              "format",
              "category",
              "media",
              "criteria",
              "startDate",
              "subject",
              "body",
            ],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      }
    }
  };

  // ✅ handleConfirm untuk CREATE dan UPDATE
  const handleConfirm = () => {
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
            console.error("Created ID not found in response:", dataForm);
            setModalError(true);
            setBodyError({
              message: "Failed to get template ID from response",
            });
            return;
          }

          console.log("Template created with ID:", templateId);

          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];

            const attachmentBody = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: templateId,
            };

            try {
              await ratingBillingHttpService.uploadAttachment(
                `/v1/dbs/api/content/create-attachment`,
                attachmentBody
              );
              console.log(`Attachment ${icon + 1} uploaded successfully`);
            } catch (uploadError) {
              console.error(
                `Failed to upload attachment ${icon + 1}:`,
                uploadError
              );
            }
          }

          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          console.log(error);
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
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
      // ✅ UPDATE - Pass ID ke action
      dispatch(updateContentManagement({ body: body, id: id }))
        .unwrap()
        .then(async (dataForm) => {
          const templateId = id; // ✅ Gunakan ID dari state

          console.log("Template updated with ID:", templateId);

          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );

          console.log("New attachments to upload:", filterDataAttach.length);

          setLoadingForm(true);
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];

            const attachmentBody = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: templateId,
            };

            try {
              await ratingBillingHttpService.uploadAttachment(
                `/v1/dbs/api/content/create-attachment`,
                attachmentBody
              );
              console.log(`Attachment ${icon + 1} uploaded successfully`);
            } catch (uploadError) {
              console.error(
                `Failed to upload attachment ${icon + 1}:`,
                uploadError
              );
            }
          }

          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
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
                  item.paramValue?.includes(next.name[0])
                    ? current + 1
                    : current,
                0
              )
            : listDataAttachment?.length < 1
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
    handleMandatory(setListSectionInfo, [], errorFields);
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
        {
          value: "Content Information",
          paramValue: [
            "name",
            "format",
            "category",
            "media",
            "criteria",
            "startDate",
            "subject",
            "body",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailContentManagement(id));
      dispatch(getDetailDraftContentManagement(id));
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
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <RadioTabs
          data={listSectionInfo}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          {/* Content Information Section */}
          <div
            className={`${valuePage !== "Content Information" ? "hidden" : ""}`}
          >
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

          <div className={valuePage !== "Approval" ? "hidden" : ""}>
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

          <div className={valuePage !== "Attachment" ? "hidden" : ""}>
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

          <div className="mt-[30px] flex">
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
              disabled={storedDataInline}
            >
              Back
            </ButtonComponent>

            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                disabled={storedDataInline ? true : false}
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? "IconButtonReset" : "IconButtonClear"
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={() => {
                  handleClear();
                }}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setFlag(false)}
                disabled={storedDataInline}
              >
                Save as Draft
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setFlag(true)}
                disabled={storedDataInline}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationContentManagement
          isOpen={modalConfirm}
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
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
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
              flag === 1 ? "created" : "submitted"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default ContentManagementForm;