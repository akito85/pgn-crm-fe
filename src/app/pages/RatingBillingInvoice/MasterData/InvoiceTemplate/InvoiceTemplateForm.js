import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import InvoiceTemplateSectionForm from "./Form/InvoiceTemplateSectionForm";
import CardContainer from "../../../../../components/CardContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import ModalConfirmationInvoiceTemplate from "./Modal/ModalConfirmationInvoiceTemplate";
import { columnsTableCriteriaInvoiceTemplate } from "./Table/TableCriteriaInvoiceTemplate";
import { dateFormatting, hasValue } from "../../../../../utils";
import {
  createInvoiceTemplate,
  getCriteria,
  getDetailDraftInvoiceTemplate,
  getDetailInvoiceTemplate,
  getInvoiceType,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  getListCategory,
  getMeterai,
  getSignature,
  getTemplate,
  updateInvoiceTemplate,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/invoiceTemplate";
import { ModalError, ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../../components/Modal/ModalBack";

const InvoiceTemplateForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierDetail,
    dataListAppHierId,
    data_invoiceType,
    data_meterai,
    data_signature,
    data_template,
    data_criteria,
    data_detail,
    data_detail_draft,
  } = useSelector((state) => state.invoice_template);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [dataApphierId, setDataApphierId] = useState("");
  const flagRef = React.useRef(false);
  const [current, setCurrent] = useState(0);
  const [valuePage, setValuePage] = useState("Invoice Template");
  const [tabPages, setTabPages] = useState([
    {
      value: "Invoice Template",
      paramValue: [
        "invoiceName",
        "invoiceType",
        "meterai",
        "signature",
        "template",
        "startDate",
        "criteria",
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
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });
  const [bodyData, setBodyData] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const isLoading = loading || loadingForm;

  const steps = [
    { title: "INVOICE TEMPLATE", value: "Invoice Template" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = tabPages[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {});
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

  const handleSubmit = () => {
    flagRef.current = true;
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    flagRef.current = false;
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleBack = () => {
    setModalBack(true);
  };

  // Use Effect
  useEffect(() => {
    dispatch(getListApprovalHierarchy());
    dispatch(getListApprovalHierarchyDetail());
    dispatch(getInvoiceType());
    dispatch(getMeterai());
    dispatch(getSignature());
    dispatch(getTemplate());
    dispatch(getCriteria());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailInvoiceTemplate(id));
      dispatch(getDetailDraftInvoiceTemplate(id));
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

  useEffect(() => {
    if (id && data_detail_draft?.id === id && data_detail?.id === id) {
      // Data Criteria Select
      const criteriaSelect = data_detail_draft?.criteriaDtoList?.map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
          invoiceTemplateId: item.invoiceTemplateId,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Draft Information
      const dataDraftAttachment = (data_detail?.attachmentDtoList || []).map(
        (item, index) => {
          return {
            key: index + 1,
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
          };
        }
      );

      // Data Criteria Draft Information
      const dataDraftCriteriaList = (
        data_detail_draft?.criteriaDataDtoList || []
      )
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            invoiceTemplateId: item.invoiceTemplateId,
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
        invoiceName: data_detail_draft?.invoiceName,
        invoiceType: data_detail_draft?.invoiceType?.id,
        meterai: data_detail_draft?.meterai?.id,
        signature: data_detail_draft?.signature?.id,
        template: data_detail_draft?.template?.id,
        startDate: moment(data_detail_draft?.startDate),
        endDate: data_detail_draft?.endDate
          ? moment(data_detail_draft?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail_draft?.description,
        apphierId: data_detail_draft?.apphierId,
      });

      setStartDate(moment(data_detail_draft?.startDate));
      setSelectedHierarchy(data_detail_draft?.apphierId);
      setListDataAttachment(dataDraftAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataDraftCriteriaList);
    } else if (id && !data_detail_draft?.id && data_detail?.id === id) {
      // Data Criteria Select
      const criteriaSelect = data_detail?.criteriaDtoList?.map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
          invoiceTemplateId: item.invoiceTemplateId,
        };
      });

      // mapping for get data Criteria
      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item, index) => {
          return {
            key: index + 1,
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
          };
        }
      );

      // Data Criteria Information
      const dataCriteriaList = (data_detail?.criteriaDataDtoList || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            invoiceTemplateId: item.invoiceTemplateId,
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
        invoiceName: data_detail?.invoiceName,
        invoiceType: data_detail?.invoiceType?.id,
        meterai: data_detail?.meterai?.id,
        signature: data_detail?.signature?.id,
        template: data_detail?.template?.id,
        startDate: moment(data_detail?.startDate),
        endDate: data_detail?.endDate
          ? moment(data_detail?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail?.description,
        apphierId: data_detail?.apphierId,
      });

      setStartDate(moment(data_detail?.startDate));
      setSelectedHierarchy(data_detail?.apphierId);
      setListDataAttachment(dataAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataCriteriaList);
    }
  }, [id, type, form, data_detail, data_detail_draft]);

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
      path: RBI_ROUTES.INVOICE_TEMPLATE_VIEW,
      breadcrumbName: "Invoice Template",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.INVOICE_TEMPLATE_CREATE
          : RBI_ROUTES.INVOICE_TEMPLATE_UPDATE,
      breadcrumbName:
        type === "create"
          ? "Create Invoice Template"
          : "Update Invoice Template",
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
    columnsTableCriteriaInvoiceTemplate,
  }) => {
    // Helper function to map listDataCriteria
    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => ({
        id: item?.id || null,
        invoiceTemplateId: item?.invoiceTemplateId || null,
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
        sor: item.sor?.value || null,
        industrialSector: item.industrialSector?.value || null,
        gsizes: item.gsizes?.value || null,
        customerSegment: item.customerSegment?.value || null,
        accountGroup: item.accountGroup?.value || null,
        serviceType: item.serviceType?.value || null,
        accountCategory: item.accountCategory?.value || null,
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
            ? data_detail_draft?.criteriaDtoList || []
            : data_detail?.criteriaDtoList || [];
        const temp = tempData.filter((a) => item === a.criteria);
        return {
          id: temp[0]?.id || null,
          criteria: item,
          invoiceTemplateId: temp[0]?.invoiceTemplateId || null,
        };
      });
    };

    // Helper function to filter criteria
    const getFilteredCriteria = (
      bodyData,
      columnsTableCriteriaInvoiceTemplate
    ) => {
      return columnsTableCriteriaInvoiceTemplate().filter(
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
    const criteriaArrayObject = mapCriteriaArrayObject(
      bodyData,
      id,
      data_detail,
      data_detail_draft
    );
    const filteredCriteria = getFilteredCriteria(
      bodyData,
      columnsTableCriteriaInvoiceTemplate
    );
    const updatedDataCriteriaObject = updateDataCriteriaObject(
      dataCriteriaObject,
      filteredCriteria
    );

    const includesAll = bodyData.criteria.includes(24);

    const body = {
      id: type === "update" ? id : undefined,
      apphierId: bodyData.apphierId,
      invoiceName: bodyData.invoiceName,
      invoiceType: bodyData.invoiceType,
      meterai: bodyData.meterai,
      signature: bodyData.signature,
      template: bodyData.template,
      startDate: moment(bodyData?.startDate).format(dateFormatting.date),
      endDate: bodyData?.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.date)
        : null,
      description: bodyData.description || null,
      criteriaDtoList: criteriaArrayObject,
      criteriaDataDtoList: includesAll
        ? [{ allCriteria: true }]
        : updatedDataCriteriaObject,
      isSubmit: flag,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/invoice-template/validate-create"
        : "/v1/dbs/api/invoice-template/validate-update";

    const body = processData({
      listDataCriteria,
      bodyData: formValue,
      id,
      type,
      dateFormatting,
      flag: flagRef.current,
      data_detail,
      data_detail_draft,
      columnsTableCriteriaInvoiceTemplate,
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

  // Handle Save Form
  const handleSave = async (formValue) => {
    let errorBody = {};

    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria
    );

    if (listDataAttachment.length === 0) {
      handleMandatory(setTabPages, listDataAttachment);
      setModalIncomplete({
        isOpen: true,
        stepName: steps[2].title,
        stepIndex: 2,
      });
    } else {
      handleMandatory(setTabPages, listDataAttachment);
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
        const isDataValid = await checkDataValidity(formValue);

        if (isDataValid) {
          setBodyData({
            ...formValue,
          });
          setModalConfirm(true);
          setTabPages([
            {
              value: "Invoice Template",
              paramValue: [
                "invoiceName",
                "invoiceType",
                "meterai",
                "signature",
                "template",
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

  // Handle Clear
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
      setCurrent(0);
      setTabPages([
        {
          value: "Invoice Template",
          paramValue: [
            "invoiceName",
            "invoiceType",
            "meterai",
            "signature",
            "template",
            "startDate",
            "criteria",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailInvoiceTemplate(id));
      dispatch(getDetailDraftInvoiceTemplate(id));
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const body = processData({
      listDataCriteria,
      bodyData,
      id,
      type,
      dateFormatting,
      flag: flagRef.current,
      data_detail,
      data_detail_draft,
      columnsTableCriteriaInvoiceTemplate,
    });

    if (type === "create") {
      dispatch(createInvoiceTemplate({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const idInvoiceTemplate = dataForm.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referenceId: idInvoiceTemplate,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/invoice-template/attachment-upload`,
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
      dispatch(updateInvoiceTemplate({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const idInvoiceTemplate = dataForm.id;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referenceId: idInvoiceTemplate,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/invoice-template/attachment-upload`,
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

  // Function Get Data EndDate
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
        >
          <div
            style={{
              display:
                valuePage !== tabPages[0].value ? "none" : undefined,
            }}
          >
            <InvoiceTemplateSectionForm
              type={type}
              form={form}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              storedDataInline={storedDataInline}
              setStoredDataInline={setStoredDataInline}
              startDate={startDate}
              endDate={endDate}
              status={status}
              statusApproval={statusApproval}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              disableDateProps={isDisabledDate}
            />
          </div>

          <div
            style={{
              display:
                valuePage !== tabPages[1].value ? "none" : undefined,
            }}
          >
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

          <div
            style={{
              display:
                valuePage !== tabPages[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="invoice_template"
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
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
          />
        </Form>

        {/* Modal Confirmation */}
        <ModalConfirmationInvoiceTemplate
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          data={bodyData}
          listDataAppHierDetail={appHierDataDetail}
          apiApproval={dataListAppHierId}
          listDataAttachment={listDataAttachment}
          listDataCriteria={listDataCriteria}
          setListDataCriteria={setListDataCriteria}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          criteriaValues={criteriaValues}
          apiInvoiceType={data_invoiceType}
          apiMeterai={data_meterai}
          apiSignature={data_signature}
          apiTemplate={data_template}
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

export default InvoiceTemplateForm;
