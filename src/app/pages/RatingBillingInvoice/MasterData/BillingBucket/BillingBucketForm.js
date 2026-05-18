import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import BillingBucketSectionForm from "./Form/BillingBucketSectionForm";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { dateFormatting, hasValue } from "../../../../../utils";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import {
  getCriteria,
  getListPriorityPeriod,
  createBillingBucket,
  updateBillingBucket,
  getAvailableApproval,
  getSelectedApproval,
  getAttachmentCategory,
  getDetailBillingBucket,
  getDetailDraftBillingBucket,
  getBillingBucketCurrency,
  getBillingBucketCategory,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { columnsTableCriteriaBillingBucket } from "./Table/TableCriteriaBillingBucket";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { configApp } from "../../../../../constants/configApp";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ConfirmationBillingBucket from "./Modal/ConfirmationBillingBucket";
import CardContainer from "../../../../../components/CardContainer";

const BillingBucketForm = ({ type }) => {
  // Selector
  const {
    data_priority_period,
    data_criteria,
    data_detail_draft,
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.billing_bucket);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  // State
  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [listDataBI, setListDataBI] = useState([]);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [flag, setFlag] = useState(false);
  const isSubmitRef = useRef(false);
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Billing Bucket",
      paramValue: [
        "billingBucketCode",
        "name",
        "priorityPeriod",
        "currency",
        "category",
        "criteria",
        "startDate",
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
  const [priority, setPriority] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });

  // Steps configuration
  const steps = [
    { title: "BILLING BUCKET", value: "Billing Bucket" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current === 0) {
            const formData = form.getFieldsValue();
            if (
              listDataCriteria.length === 0 &&
              !formData?.criteria?.includes(24)
            ) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description: "Criteria Mandatory. Please insert data.",
                }),
              );
              return;
            }
            if (listDataBI.length === 0) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description:
                    "Billing Item Detail Mandatory. Please insert data.",
                }),
              );
              return;
            }
          }
          if (current < steps.length - 1) {
            setCurrent(current + 1);
            window.scrollTo(0, 0);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
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

  const isDisabledDate = useMemo(() => {
    return listDataCriteria?.length > 0;
  }, [listDataCriteria]);

  const handleUpdateAttachment = useCallback((updater) => {
    setListDataAttachment((prevState) => {
      const newState =
        typeof updater === "function" ? updater(prevState) : updater;
      const removedItems = prevState.filter(
        (item) => !newState.some((newItem) => newItem.key === item.key),
      );
      const removedExistingIds = removedItems
        .filter((item) => item.dataType === "exist" && item.id)
        .map((item) => item.id);
      if (removedExistingIds.length > 0) {
        setDeletedAttachmentIds((prev) => [...prev, ...removedExistingIds]);
      }
      return newState;
    });
  }, []);

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getListPriorityPeriod());
    dispatch(getCriteria());
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval());
    dispatch(getListPriorityPeriod());
    dispatch(getBillingBucketCurrency());
    dispatch(getBillingBucketCategory());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailBillingBucket(id));
      dispatch(getDetailDraftBillingBucket(id));
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
    if (
      id &&
      data_detail_draft?.information?.id === id &&
      data_detail?.information?.id === id
    ) {
      // Data Draft Billing Item Detail
      const dataDetailDraft = (
        data_detail_draft?.billingBucketDetail || []
      ).map((item, index) => {
        return {
          id: item.id,
          key: index + 1,
          billingItem: item.billingItem?.value,
          groups: item.groups,
          groupSequence: item.groupSequence,
          sequence: item.sequence,
          startDate: moment(item.startDate).format(dateFormatting.date),
          endDate: item.endDate
            ? moment(item.endDate).format(dateFormatting.date)
            : null,
          type: "exist",
        };
      });

      // Data Criteria Select
      const criteriaSelect = data_detail_draft?.criteria?.map((item) => {
        return {
          billingBucketCriteriaId: item.billingBucketCriteriaId,
          criteria: item.criteria,
        };
      });

      // mapping for get data Criteria
      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Draft Attachment Information
      const dataDraftAttachment = (data_detail?.mattachmentLists || []).map(
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
        },
      );

      // Data Criteria Information
      const dataDraftCriteriaList = (data_detail_draft?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.costCenter,
            sor: item.sor,
            industrialSector: item.industrialSector,
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
        billingBucketCode: data_detail_draft?.information?.billingBucketCode,
        name: data_detail_draft?.information?.name,
        priorityPeriod: data_detail_draft?.information?.priorityPeriod?.value,
        currency: data_detail_draft?.information?.currency,
        category: data_detail_draft?.information?.category,
        startDate: moment(data_detail_draft?.information?.startDate),
        endDate: data_detail_draft?.information?.endDate
          ? moment(data_detail_draft?.information?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail_draft?.information?.description,
        apphierId: data_detail_draft?.information?.apphierId,
      });

      setStartDate(moment(data_detail_draft?.information?.startDate));
      setEndDate(
        data_detail_draft?.information?.endDate
          ? moment(data_detail_draft?.information?.endDate)
          : undefined,
      );
      setSelectedHierarchy(data_detail_draft?.information?.apphierId);
      setListDataAttachment(dataDraftAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataDraftCriteriaList);
      setListDataBI(dataDetailDraft);
    } else if (
      id &&
      !data_detail_draft?.information?.id &&
      data_detail?.information?.id === id
    ) {
      // Data Billing Item Detail
      const dataDetail = (data_detail?.billingBucketDetail || []).map(
        (item, index) => {
          return {
            id: item.id,
            key: index + 1,
            billingItem: item.billingItem?.value,
            groups: item.groups,
            groupSequence: item.groupSequence,
            sequence: item.sequence,
            startDate: moment(item.startDate).format(dateFormatting.date),
            endDate: item.endDate
              ? moment(item.endDate).format(dateFormatting.date)
              : null,
            type: "exist",
          };
        },
      );

      // Data Criteria Select
      const criteriaSelect = data_detail?.criteria?.map((item) => {
        return {
          billingBucketCriteriaId: item.billingBucketCriteriaId,
          criteria: item.criteria,
        };
      });

      // mapping for get data Criteria
      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      const dataAttachment = (data_detail?.mattachmentLists || []).map(
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
        },
      );

      // Data Criteria Information
      const dataCriteriaList = (data_detail?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.costCenter,
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
        billingBucketCode: data_detail?.information?.billingBucketCode,
        name: data_detail?.information?.name,
        priorityPeriod: data_detail?.information?.priorityPeriod?.value,
        currency: data_detail?.information?.currency,
        category: data_detail?.information?.category,
        startDate: moment(data_detail?.information?.startDate),
        endDate: data_detail?.information?.endDate
          ? moment(data_detail?.information?.endDate)
          : undefined,
        criteria: mappingCriteria,
        description: data_detail?.information?.description,
        apphierId: data_detail?.information?.apphierId,
      });

      setStartDate(moment(data_detail?.information?.startDate));
      setEndDate(
        data_detail?.information?.endDate
          ? moment(data_detail?.information?.endDate)
          : undefined,
      );
      setSelectedHierarchy(data_detail?.information?.apphierId);
      setListDataAttachment(dataAttachment);
      setCriteriaValues(mappingCriteria);
      setListDataCriteria(dataCriteriaList);
      setListDataBI(dataDetail);
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
      path: RBI_ROUTES.BILLING_BUCKET_VIEW,
      breadcrumbName: "Billing Bucket",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.BILLING_BUCKET_CREATE
          : RBI_ROUTES.BILLING_BUCKET_UPDATE,
      breadcrumbName:
        type === "create" ? "Create Billing Bucket" : "Update Billing Bucket",
    },
  ];

  const processData = ({
    listDataCriteria,
    listDataBI,
    bodyData,
    id,
    type,
    dateFormatting,
    flag,
    data_detail,
    data_detail_draft,
    columnsTableCriteriaBillingBucket,
  }) => {
    // Helper function to map listDataCriteria
    const mapListDataCriteria = (listDataCriteria, dateFormatting) => {
      return listDataCriteria?.map((item) => ({
        id: item?.id || null,
        startDate: item.startDate
          ? moment(item.startDate).format("DD MMM YYYY")
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format("DD MMM YYYY")
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

    // Helper function to map listDataBI
    const mapListDataBI = (listDataBI) => {
      return listDataBI?.map((item) => ({
        id: item.id || null,
        billingItem: item.billingItem,
        sequence: item.sequence,
        groups: item.groups || item.group || null,
        groupSequence: item.groupSequence || null,
        startDate: item.startDate
          ? moment(item.startDate).format("DD MMM YYYY")
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format("DD MMM YYYY")
          : null,
      }));
    };

    // Helper function to map bodyData.criteria
    const mapCriteriaArrayObject = (
      bodyData,
      id,
      data_detail,
      data_detail_draft,
    ) => {
      return (bodyData?.criteria || []).map((item) => {
        const tempData =
          id && data_detail_draft?.information?.id === id
            ? data_detail_draft?.listCriteria || []
            : data_detail?.listCriteria || [];
        const temp = tempData.filter((a) => item === a.criteria);
        return {
          billingBucketCriteriaId: temp[0]?.billingBucketCriteriaId || null,
          criteria: item,
        };
      });
    };

    // Helper function to filter criteria
    const getFilteredCriteria = (
      bodyData,
      columnsTableCriteriaBillingBucket,
    ) => {
      return columnsTableCriteriaBillingBucket().filter(
        (item) =>
          !(bodyData.criteria || []).includes(item.indexValue) &&
          (bodyData.criteria || []).includes(item.indexValue) === 1,
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
      dateFormatting,
    );

    const dataListBI = mapListDataBI(listDataBI);

    const criteriaArrayObject = mapCriteriaArrayObject(
      bodyData,
      id,
      data_detail,
      data_detail_draft,
    );

    const filteredCriteria = getFilteredCriteria(
      bodyData,
      columnsTableCriteriaBillingBucket,
    );

    const updatedDataCriteriaObject = updateDataCriteriaObject(
      dataCriteriaObject,
      filteredCriteria,
    );

    const includesAll = (bodyData.criteria || []).includes(24);

    // listDetail already mapped with correct fields in mapListDataBI

    const body = {
      id: type === "create" ? undefined : id,
      billingBucketCode: bodyData.billingBucketCode,
      name: bodyData.name,
      priorityPeriod: bodyData.priorityPeriod,
      currency: bodyData.currency,
      category: bodyData.category,
      startDate: bodyData.startDate
        ? moment(bodyData?.startDate).format("DD MMM YYYY")
        : null,
      endDate: bodyData.endDate
        ? moment(bodyData?.endDate).format("DD MMM YYYY")
        : null,
      description: bodyData.description ? bodyData.description : null,
      apphierId: bodyData.apphierId,
      listDetail: dataListBI,
      listCriteria: criteriaArrayObject,
      listCriteriaData: includesAll
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
        ? "/v1/dbs/api/rbi/billing-bucket/validate-create"
        : "/v1/dbs/api/rbi/billing-bucket/validate-update";

    const body = processData({
      listDataCriteria,
      listDataBI,
      bodyData: formValue,
      id,
      type,
      dateFormatting,
      flag,
      data_detail,
      data_detail_draft,
      columnsTableCriteriaBillingBucket,
    });

    try {
      await dispatch(
        validateCreateUpdate({
          body: body,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        }),
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
    minimumData = 0,
  ) => {
    let missingColumn = [];
    const tempArray = criteriaValues.filter((item) =>
      dataCriteria?.includes(item.value),
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

  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    dataTable?.forEach((item) => {
      let isOverlap = false;

      if (
        moment(item?.startDate).startOf("day") <
        moment(formHeader?.startDate).startOf("day")
      ) {
        isOverlap = true;
      }

      if (formHeader?.endDate) {
        if (
          !item?.endDate ||
          moment(item?.endDate).startOf("day") >
            moment(formHeader?.endDate).startOf("day")
        ) {
          isOverlap = true;
        }
      }

      if (isOverlap) {
        dataOverlap?.push(item);
      }
    });

    if (dataOverlap?.length > 0) {
      return true;
    } else {
      return false;
    }
  }, []);

  const handleSubmit = () => {
    isSubmitRef.current = true;
    setFlag(true);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    isSubmitRef.current = false;
    setFlag(false);
    setTimeout(() => {
      const formValue = form.getFieldsValue();
      handleSave(formValue);
    }, 0);
  };

  // Handle Save Form
  const handleSave = async (formValue) => {
    // Save as draft: skip all mandatory validations
    if (!isSubmitRef.current) {
      setBodyData({ ...formValue });
      setModalConfirm(true);
      setListSectionInfo([
        {
          value: "Billing Bucket",
          paramValue: [
            "billingBucketCode",
            "name",
            "priorityPeriod",
            "currency",
            "category",
            "criteria",
            "startDate",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
      return;
    }

    let errorBody = {};
    const hasOverlappingCriteria = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria,
    );
    const hasOverlappingBI = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataBI,
    );
    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
      setModalIncomplete({
        isOpen: true,
        stepName: "ATTACHMENT",
        stepIndex: 2,
      });
    } else {
      handleMandatory(setListSectionInfo, listDataAttachment);
      if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: "Criteria Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (listDataBI.length === 0) {
        setCurrent(0);
        errorBody = {
          title: "Failed",
          description: "Billing Item Detail Mandatory. Please insert data.",
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
          0,
        )
      ) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `There is missing values in table criteria. Please try again`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlappingCriteria) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `You can't add Criteria. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlappingBI) {
        setCurrent(0);
        const errorBody = {
          title: "Failed",
          description: `You can't add Billing Item Detail. Start date and end date can't be overlap`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const isDataValid = isSubmitRef.current
          ? await checkDataValidity(formValue)
          : true;

        if (isDataValid) {
          setBodyData({
            ...formValue,
          });
          setModalConfirm(true);
          setListSectionInfo([
            {
              value: "Billing Bucket",
              paramValue: [
                "billingBucketCode",
                "name",
                "priorityPeriod",
                "currency",
                "category",
                "criteria",
                "startDate",
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
      listDataBI,
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
      dispatch(createBillingBucket({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const billingBucketCode = dataForm?.billingBucketCode;
          setLoadingForm(true);
          if (deletedAttachmentIds.length > 0) {
            await ratingBillingHttpService.deleteDataWithBody(
              `/v1/dbs/api/attachment/delete-attachment`,
              { fileId: deletedAttachmentIds },
            );
          }
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
              referenceId: billingBucketCode,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/billing-bucket/create-attachment`,
              body,
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          console.log(error);
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
      dispatch(updateBillingBucket({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const billingBucketCode = dataForm.billingBucketCode;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          setLoadingForm(true);
          if (deletedAttachmentIds.length > 0) {
            await ratingBillingHttpService.deleteDataWithBody(
              `/v1/dbs/api/attachment/delete-attachment`,
              { fileId: deletedAttachmentIds },
            );
          }
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
              referenceId: billingBucketCode,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/billing-bucket/create-attachment`,
              body,
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
    errorFields,
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
                0,
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
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);

    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = listSectionInfo.findIndex((page) =>
        page.paramValue?.includes(firstError),
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
    setCurrent(0);
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setDeletedAttachmentIds([]);
      setBodyData({});
      setListDataCriteria([]);
      setCriteriaValues([]);
      setStoredDataInline(false);
      setListDataBI([]);
      setListSectionInfo([
        {
          value: "Billing Bucket",
          paramValue: [
            "billingBucketCode",
            "name",
            "priorityPeriod",
            "currency",
            "category",
            "criteria",
            "startDate",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailBillingBucket(id));
      dispatch(getDetailDraftBillingBucket(id));
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

    // Auto adjust details start date
    if (value) {
      const newHeaderStart = moment(value);
      const formattedValue = newHeaderStart.format(dateFormatting.dateFormal);

      if (listDataCriteria?.length > 0) {
        const adjustedCriteria = listDataCriteria.map((item) => {
          let newStartDate = item.startDate;
          if (item.startDate && moment(item.startDate) < newHeaderStart) {
            newStartDate = formattedValue;
          }
          return { ...item, startDate: newStartDate };
        });
        setListDataCriteria(adjustedCriteria);
      }

      if (listDataBI?.length > 0) {
        const adjustedBI = listDataBI.map((item) => {
          let newStartDate = item.startDate;
          if (item.startDate && moment(item.startDate) < newHeaderStart) {
            newStartDate = formattedValue;
          }
          return { ...item, startDate: newStartDate };
        });
        setListDataBI(adjustedBI);
      }
    }

    return value;
  };

  // Function Get Data EndDate
  const handleEndDate = (value) => {
    setEndDate(value);

    // Auto adjust details end date
    if (value) {
      const newHeaderEnd = moment(value);
      const formattedValue = newHeaderEnd.format(dateFormatting.dateFormal);

      if (listDataCriteria?.length > 0) {
        const adjustedCriteria = listDataCriteria.map((item) => {
          let newEndDate = item.endDate;
          if (!item.endDate || moment(item.endDate) > newHeaderEnd) {
            newEndDate = formattedValue;
          }
          return { ...item, endDate: newEndDate };
        });
        setListDataCriteria(adjustedCriteria);
      }

      if (listDataBI?.length > 0) {
        const adjustedBI = listDataBI.map((item) => {
          let newEndDate = item.endDate;
          if (!item.endDate || moment(item.endDate) > newHeaderEnd) {
            newEndDate = formattedValue;
          }
          return { ...item, endDate: newEndDate };
        });
        setListDataBI(adjustedBI);
      }
    }

    return value;
  };

  const handleBack = () => {
    setModalBack(true);
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        {/* FormStepper menggantikan RadioTabs */}
        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
          disabled={storedDataInline}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          {/* Billing Bucket Section */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <BillingBucketSectionForm
              type={type}
              form={form}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              storedDataInline={storedDataInline}
              setStoredDataInline={setStoredDataInline}
              listDataBI={listDataBI}
              setListDataBI={setListDataBI}
              priority={priority}
              setPriority={setPriority}
              status={status}
              statusApproval={statusApproval}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              disabledDate={isDisabledDate}
            />
          </div>

          <div
            style={{
              display:
                valuePage !== listSectionInfo[1].value ? "none" : undefined,
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
                valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={handleUpdateAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="billing_bucket"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          {/* FormFooter menggantikan manual footer buttons */}
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
            isLoading={loadingForm}
          />
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationBillingBucket
          isOpen={modalConfirm}
          data={bodyData}
          selectedHierarchy={selectedHierarchy}
          apiPriorityPeriod={data_priority_period}
          apiCriteria={data_criteria}
          criteriaValues={criteriaValues}
          listDataAppHierDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          listDataCriteria={listDataCriteria}
          listDataBI={listDataBI}
          dataOption={appHierOptions}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          isLoading={loadingForm}
        />

        {/* Modal Back */}
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

        {/* Modal Incomplete */}
        <ModalError
          isOpen={modalIncomplete.isOpen}
          handleOk={() => {
            setCurrent(modalIncomplete.stepIndex);
            setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 });
          }}
          handleCancel={() =>
            setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 })
          }
          customText="Go to Step"
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Incomplete Data"}</p>
            </div>
            <p className="pl-[70px]">
              Please complete the mandatory fields in the{" "}
              <b>{modalIncomplete.stepName}</b> section before proceeding.
            </p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default BillingBucketForm;
