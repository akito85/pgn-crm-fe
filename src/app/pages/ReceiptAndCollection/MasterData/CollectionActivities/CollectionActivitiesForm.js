import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import CollectionActivitiesSectionForm from "./Form/CollectionActivitiesSectionForm";
import {
  showModalError,
} from "../../../../../redux/slices/general_slice";
import {
  createCollectionActivity,
  updateCollectionActivity,
  getDetailCollectionActivity,
  getListApprovalHierarchyCA,
  getListApprovalHierarchyDetailCA,
  getMedia,
  getCategory,
  getCriteria,
  getListCategoryCA,
} from "../../../../../redux/slices/debt_and_collection/collectionActivities";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ConfirmationCollectionActivities from "./Modal/ConfirmationCollectionActivities";

const COLLECTION_ACTIVITY_CRITERIA_CONFIG = {
  11: { field: "sor", label: "SOR", aliases: ["sor"] },
  12: {
    field: "customer",
    label: "ACCOUNT",
    aliases: ["account", "customer", "cust"],
  },
  13: {
    field: "subDistrict",
    label: "SUB-DISTRICT",
    aliases: ["subdistrict", "sub-district"],
  },
  14: { field: "district", label: "DISTRICT", aliases: ["district"] },
  15: { field: "province", label: "PROVINCE", aliases: ["province"] },
  16: {
    field: "area",
    label: "COST CENTER",
    aliases: ["costcenter", "cost center", "area"],
  },
  17: {
    field: "budget",
    label: "BUDGET",
    aliases: ["budget", "budgettype", "budget type"],
  },
  18: {
    field: "industrialSector",
    label: "INDUSTRIAL SECTOR",
    aliases: ["industrialsector", "industrial sector"],
  },
  19: {
    field: "customerSegment",
    label: "CUSTOMER SEGMENT",
    aliases: ["customersegment", "customer segment"],
  },
  20: {
    field: "accountGroup",
    label: "ACCOUNT GROUP",
    aliases: ["accountgroup", "account group", "accountgrouptype"],
  },
  21: {
    field: "serviceType",
    label: "SERVICE TYPE",
    aliases: ["servicetype", "service type"],
  },
  22: {
    field: "accountCategory",
    label: "ACCOUNT CATEGORY",
    aliases: ["accountcategory", "account category"],
  },
  23: {
    field: "gsizes",
    label: "G-SIZES",
    aliases: ["gsizes", "gsize", "g-sizes", "g sizes"],
  },
  24: {
    field: null,
    label: "ALL",
    aliases: ["all", "allcriteria", "all criteria"],
  },
  39: { field: "city", label: "CITY", aliases: ["city"] },
};

const COLLECTION_ACTIVITY_CRITERIA_LIST = Object.entries(
  COLLECTION_ACTIVITY_CRITERIA_CONFIG
).map(([id, config]) => ({ id: Number(id), ...config }));

const normalizeCollectionCriteriaLabel = (value = "") =>
  value.toString().toLowerCase().replace(/[^a-z0-9]/g, "");

const getFirstCollectionCriteriaValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toCollectionCriteriaNumber = (value) => {
  const normalizedValue = Number(value);
  return Number.isNaN(normalizedValue) ? null : normalizedValue;
};

const toCollectionCriteriaText = (value) =>
  value === undefined || value === null || value === ""
    ? null
    : value.toString();

const normalizeCollectionCriteriaValue = (value) => {
  const rawValue =
    value && typeof value === "object"
      ? value.criteriaValueId ??
        value.criteriaId ??
        value.value ??
        value.id ??
        value.Id ??
        value.glbTypeValId ??
        null
      : value;
  const normalizedValue = Number(rawValue);
  return Number.isNaN(normalizedValue) ? rawValue : normalizedValue;
};

const normalizeCollectionCriteriaValues = (values = []) => {
  const normalizedValues = (Array.isArray(values) ? values : [values]).map(
    normalizeCollectionCriteriaValue
  );
  const filteredValues = normalizedValues.filter(
    (value) => value !== undefined && value !== null && value !== ""
  );
  const uniqueValues = filteredValues.filter(
    (value, index) => filteredValues.indexOf(value) === index
  );
  return uniqueValues.includes(24) ? [24] : uniqueValues;
};

const getCollectionCriteriaConfigById = (criteriaId) =>
  COLLECTION_ACTIVITY_CRITERIA_CONFIG[
    normalizeCollectionCriteriaValue(criteriaId)
  ];

const getCollectionCriteriaOptionById = (criteriaId, criteriaOptions = []) => {
  const normalizedCriteriaId = normalizeCollectionCriteriaValue(criteriaId);
  return criteriaOptions.find(
    (option) =>
      normalizeCollectionCriteriaValue(
        option.id ?? option.value ?? option.Id ?? option.glbTypeValId
      ) ===
      normalizedCriteriaId
  );
};

const getCollectionCriteriaConfigByType = (criteriaType = "") => {
  const normalizedType = normalizeCollectionCriteriaLabel(criteriaType);
  return COLLECTION_ACTIVITY_CRITERIA_LIST.find(
    (config) =>
      normalizeCollectionCriteriaLabel(config.label) === normalizedType ||
      config.aliases.some(
        (alias) => normalizeCollectionCriteriaLabel(alias) === normalizedType
      )
  );
};

const getCollectionCriteriaLabelById = (criteriaId, criteriaOptions = []) => {
  const criteriaOption = getCollectionCriteriaOptionById(criteriaId, criteriaOptions);
  return (
    criteriaOption?.text ||
    criteriaOption?.label ||
    criteriaOption?.name ||
    getCollectionCriteriaConfigById(criteriaId)?.label ||
    criteriaId
  );
};

const getCollectionCriteriaCodeById = (criteriaId, criteriaOptions = []) => {
  const criteriaOption = getCollectionCriteriaOptionById(criteriaId, criteriaOptions);
  return (
    criteriaOption?.code ||
    getCollectionCriteriaConfigById(criteriaId)?.code ||
    getCollectionCriteriaLabelById(criteriaId, criteriaOptions)
  );
};

const formatCollectionCriteriaDate = (value) =>
  value ? moment(value).format("DD MMM YYYY") : null;

const getCollectionCriteriaOptionObject = (criteriaItem = {}) => {
  const rawValue = getFirstCollectionCriteriaValue(
    criteriaItem.value,
    criteriaItem.criteriaValueNumber,
    criteriaItem.id,
    criteriaItem.customerNumber,
    criteriaItem.code,
    criteriaItem.criteriaValueText,
    criteriaItem.criteriaValueDisplay,
    criteriaItem.criteriaValueId
  );
  const criteriaValueText = toCollectionCriteriaText(
    getFirstCollectionCriteriaValue(
      criteriaItem.criteriaValueText,
      criteriaItem.code,
      criteriaItem.customerNumber,
      criteriaItem.text,
      criteriaItem.label,
      criteriaItem.name,
      criteriaItem.criteriaValueDisplay,
      rawValue
    )
  );
  const criteriaValueDisplay = toCollectionCriteriaText(
    getFirstCollectionCriteriaValue(
      criteriaItem.criteriaValueDisplay,
      criteriaItem.label,
      criteriaItem.text,
      criteriaItem.name,
      criteriaItem.customerNumber,
      criteriaItem.code,
      criteriaItem.criteriaValueText,
      rawValue
    )
  );
  const criteriaValueNumber = toCollectionCriteriaNumber(
    getFirstCollectionCriteriaValue(
      criteriaItem.criteriaValueNumber,
      criteriaItem.id,
      criteriaItem.value
    )
  );

  if (
    rawValue === undefined &&
    criteriaValueText === null &&
    criteriaValueDisplay === null &&
    criteriaValueNumber === null
  ) {
    return undefined;
  }

  return {
    value: rawValue,
    label: criteriaValueDisplay || toCollectionCriteriaText(rawValue),
    criteriaValueText,
    criteriaValueNumber,
    criteriaValueDisplay: criteriaValueDisplay || toCollectionCriteriaText(rawValue),
  };
};

const getCollectionCriteriaPayloadValues = (criteriaValue) => {
  if (criteriaValue && typeof criteriaValue === "object") {
    return {
      criteriaValueText: toCollectionCriteriaText(
        getFirstCollectionCriteriaValue(
          criteriaValue.criteriaValueText,
          criteriaValue.code,
          criteriaValue.customerNumber,
          criteriaValue.text,
          criteriaValue.label,
          criteriaValue.name,
          criteriaValue.criteriaValueDisplay,
          criteriaValue.value
        )
      ),
      criteriaValueNumber: toCollectionCriteriaNumber(
        getFirstCollectionCriteriaValue(
          criteriaValue.criteriaValueNumber,
          criteriaValue.id,
          criteriaValue.value
        )
      ),
      criteriaValueDisplay: toCollectionCriteriaText(
        getFirstCollectionCriteriaValue(
          criteriaValue.criteriaValueDisplay,
          criteriaValue.label,
          criteriaValue.text,
          criteriaValue.name,
          criteriaValue.customerNumber,
          criteriaValue.code,
          criteriaValue.criteriaValueText,
          criteriaValue.value
        )
      ),
    };
  }

  const normalizedText = toCollectionCriteriaText(criteriaValue);

  return {
    criteriaValueText: normalizedText,
    criteriaValueNumber: toCollectionCriteriaNumber(criteriaValue),
    criteriaValueDisplay: normalizedText,
  };
};

const rebuildCollectionActivityCriteria = (criteriaData = []) => {
  const groupedCriteria = new Map();
  const selectedCriteriaIds = [];

  criteriaData.forEach((criteriaItem, index) => {
    const criteriaConfig =
      getCollectionCriteriaConfigById(criteriaItem.criteriaValueId) ||
      getCollectionCriteriaConfigByType(criteriaItem.criteriaType);
    const criteriaGroupId = criteriaItem.criteriaGroupId || index + 1;
    const groupKey = criteriaGroupId.toString();

    if (!groupedCriteria.has(groupKey)) {
      groupedCriteria.set(groupKey, {
        key: groupKey,
        criteriaGroupId,
        startDate: criteriaItem.startDate || null,
        endDate: criteriaItem.endDate || null,
        description: criteriaItem.description || null,
        type: "exist",
        criteriaItemIds: {},
      });
    }

    const criteriaRow = groupedCriteria.get(groupKey);

    if (!criteriaRow.startDate && criteriaItem.startDate) {
      criteriaRow.startDate = criteriaItem.startDate;
    }

    if (!criteriaRow.endDate && criteriaItem.endDate) {
      criteriaRow.endDate = criteriaItem.endDate;
    }

    if (!criteriaConfig) {
      return;
    }

    selectedCriteriaIds.push(criteriaConfig.id);

    if (criteriaConfig.field) {
      const optionObject = getCollectionCriteriaOptionObject(criteriaItem);
      if (optionObject) {
        criteriaRow[criteriaConfig.field] = optionObject;
      }
      criteriaRow.criteriaItemIds = {
        ...criteriaRow.criteriaItemIds,
        [criteriaConfig.field]: criteriaItem.id,
      };
      return;
    }

    criteriaRow.criteriaItemIds = {
      ...criteriaRow.criteriaItemIds,
      allCriteria: criteriaItem.id,
    };
  });

  return {
    criteriaValues: normalizeCollectionCriteriaValues(selectedCriteriaIds),
    listDataCriteria: Array.from(groupedCriteria.values()),
  };
};

const mapCollectionActivityCriteriaRow = (
  criteriaRow,
  selectedCriteriaIds,
  criteriaOptions,
  defaultGroupId
) => {
  const normalizedCriteriaIds = normalizeCollectionCriteriaValues(
    selectedCriteriaIds
  );
  const criteriaGroupId = defaultGroupId;
  const startDate = formatCollectionCriteriaDate(criteriaRow?.startDate);
  const endDate = formatCollectionCriteriaDate(criteriaRow?.endDate);

  if (normalizedCriteriaIds.includes(24)) {
    return [
      {
        id: criteriaRow?.criteriaItemIds?.allCriteria || null,
        criteriaType: getCollectionCriteriaCodeById(24, criteriaOptions),
        criteriaValueId: 24,
        criteriaValueText: null,
        criteriaValueNumber: null,
        criteriaValueDisplay: null,
        criteriaGroupId,
        startDate,
        endDate,
        description: criteriaRow?.description || null,
      },
    ];
  }

  return normalizedCriteriaIds
    .filter((criteriaId) => criteriaId !== 24)
    .map((criteriaId) => {
      const criteriaConfig = getCollectionCriteriaConfigById(criteriaId);
      const criteriaValue = criteriaConfig?.field
        ? criteriaRow?.[criteriaConfig.field]
        : null;
      const payloadValue = getCollectionCriteriaPayloadValues(criteriaValue);

      return {
        id: criteriaRow?.criteriaItemIds?.[criteriaConfig?.field] || null,
        criteriaType: getCollectionCriteriaCodeById(criteriaId, criteriaOptions),
        criteriaValueId: normalizeCollectionCriteriaValue(criteriaId),
        criteriaValueText: payloadValue.criteriaValueText,
        criteriaValueNumber: payloadValue.criteriaValueNumber,
        criteriaValueDisplay: payloadValue.criteriaValueDisplay,
        criteriaGroupId,
        startDate,
        endDate,
        description: criteriaRow?.description || null,
      };
    });
};

const CollectionActivitiesForm = ({ type }) => {
  // Selector
  const {
    loading,
    data_media,
    data_category,
    data_criteria,
  } = useSelector((state) => state.collectionActivities);

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
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [flag, setFlag] = useState(false);
  const isSubmitRef = useRef(false);
  const listSectionInfo = [
    {
      value: "CREATE",
      paramValue: [
        "activitiesName",
        "media",
        "category",
        "startDate",
        "endDate",
        "criteria",
        "description",
      ],
    },
    { value: "APPROVAL", paramValue: ["apphierId"] },
    { value: "ATTACHMENT" },
  ];

  const [storedDataInline, setStoredDataInline] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });

  // Steps configuration
  const steps = useMemo(
    () => [
      { title: "CREATE", value: "CREATE" },
      { title: "APPROVAL", value: "APPROVAL" },
      { title: "ATTACHMENT", value: "ATTACHMENT" },
    ],
    []
  );

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current, steps]);

  const hydrateCollectionActivityDetail = useCallback((detailResponse = {}) => {
    const criteriaData = Array.isArray(detailResponse.criteriaData)
      ? detailResponse.criteriaData
      : Array.isArray(detailResponse.criteria)
        ? detailResponse.criteria
        : [];
    const rebuiltCriteria = rebuildCollectionActivityCriteria(criteriaData);
    const normalizedCriteriaValues =
      rebuiltCriteria.criteriaValues.length > 0
        ? rebuiltCriteria.criteriaValues
        : normalizeCollectionCriteriaValues(criteriaData);
    const activityName =
      detailResponse.activityName || detailResponse.activitiesName;

    form.setFieldsValue({
      activitiesName: activityName,
      media: detailResponse.media,
      category: detailResponse.category,
      startDate: detailResponse.startDate
        ? moment(detailResponse.startDate)
        : undefined,
      endDate: detailResponse.endDate
        ? moment(detailResponse.endDate)
        : undefined,
      criteria: normalizedCriteriaValues,
      description: detailResponse.description,
      apphierId: detailResponse.apphierId,
    });

    setStartDate(
      detailResponse.startDate ? moment(detailResponse.startDate) : undefined
    );
    setEndDate(
      detailResponse.endDate ? moment(detailResponse.endDate) : undefined
    );
    setSelectedHierarchy(detailResponse.apphierId);
    setCriteriaValues(normalizedCriteriaValues);
    setListDataCriteria(rebuiltCriteria.listDataCriteria);
    setStoredDataInline(false);

    const attachments = (detailResponse.mattachmentLists || []).map(
      (item, index) => ({
        ...item,
        key: index + 1,
        dataType: "exist",
      })
    );
    setListDataAttachment(attachments);
  }, [form]);

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current === 0) {
            const formData = form.getFieldsValue();
            const selectedCriteriaValues = normalizeCollectionCriteriaValues(
              formData?.criteria || []
            );
            if (
              listDataCriteria.length === 0 &&
              !selectedCriteriaValues.includes(24)
            ) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description: "Criteria Mandatory. Please insert data.",
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

  const isLoading = loading || loadingForm;

  // Initial Fetch Options
  useEffect(() => {
    dispatch(getMedia());
    dispatch(getCategory());
    dispatch(getCriteria());
  }, [dispatch]);

  // Fetch Hierarchy Options (Mocking call to get available hierarchy)
  useEffect(() => {
    dispatch(getListApprovalHierarchyCA())
      .unwrap()
      .then((res) => {
        if (res && res.length > 0) {
          const tempAppHier = res.map((appHier) => ({
            name: appHier.approvalName || appHier.name,
            value: appHier.appHierId || appHier.id,
          }));
          setAppHierOptions(tempAppHier);
        }
      })
      .catch(() => {});
  }, [dispatch]);

  // Handle selected hierarchy changes
  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalHierarchyDetailCA({ id: selectedHierarchy }))
        .unwrap()
        .then((res) => {
          if (res && res.length > 0) {
            const data = res.map((a, index) => ({
              ...a,
              key: index + 1,
              employeeDetail: (a.employeeDetail || []).map((b, idx) => ({
                ...b,
                key: idx + 1,
              })),
            }));
            setAppHierDataDetail(data);
          } else {
            setAppHierDataDetail([]);
          }
        })
        .catch(() => {
          setAppHierDataDetail([]);
        });
    } else {
      setAppHierDataDetail([]);
    }
  }, [dispatch, selectedHierarchy]);

  // Handle Detail Update
  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailCollectionActivity(id))
        .unwrap()
        .then((dataDetail) => {
          if (dataDetail) {
            hydrateCollectionActivityDetail(dataDetail);
          }
        })
        .catch(() => {});
    }
  }, [dispatch, id, type, hydrateCollectionActivityDetail]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Payment & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTION_ACTIVITIES,
      breadcrumbName: "Activities",
    },
    {
      path:
        type === "create"
          ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_COLLECTION_ACTIVITIES
          : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_COLLECTION_ACTIVITIES,
      breadcrumbName:
        type === "create" ? "Create" : "Update",
    },
  ];

  const processData = (formValue) => {
    const normalizedCriteriaValues = normalizeCollectionCriteriaValues(
      formValue.criteria || []
    );
    const criteriaRows =
      listDataCriteria.length > 0
        ? listDataCriteria
        : normalizedCriteriaValues.includes(24)
          ? [
              {
                criteriaGroupId: 1,
                startDate: formValue.startDate,
                endDate: formValue.endDate,
                criteriaItemIds: {},
              },
            ]
          : [];
    const dataCriteriaObject = criteriaRows.flatMap((item, index) =>
      mapCollectionActivityCriteriaRow(
        item,
        normalizedCriteriaValues,
        data_criteria,
        index + 1
      )
    );

    const body = {
      id: type === "create" ? undefined : id,
      activitiesName: formValue.activitiesName,
      media: formValue.media,
      category: formValue.category,
      startDate: formValue.startDate
        ? moment(formValue.startDate).format("DD MMM YYYY")
        : null,
      endDate: formValue.endDate
        ? moment(formValue.endDate).format("DD MMM YYYY")
        : null,
      criteria: normalizedCriteriaValues,
      description: formValue.description,
      apphierId: formValue.apphierId,
      listCriteriaData: dataCriteriaObject,
      isSubmit: flag,
    };

    return body;
  };

  const handleSubmit = () => {
    isSubmitRef.current = true;
    setFlag(true);
    setTimeout(() => { form.submit(); }, 0);
  };

  const handleSaveDraft = () => {
    isSubmitRef.current = false;
    setFlag(false);
    setTimeout(() => { form.submit(); }, 0);
  };

  const handleClear = () => {
    setCurrent(0);
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setBodyData({});
      setListDataCriteria([]);
      setCriteriaValues([]);
      setStoredDataInline(false);
    } else {
      dispatch(getDetailCollectionActivity(id))
        .unwrap()
        .then((detailResponse) => {
          if (detailResponse) {
            hydrateCollectionActivityDetail(detailResponse);
          }
        })
        .catch(() => {});
    }
  };

  const handleBack = () => { setModalBack(true); };

  const handleError = ({ errorFields }) => {
    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = listSectionInfo.findIndex((page) =>
        page.paramValue?.includes(firstError)
      );
      if (stepIndex !== -1) {
        setModalIncomplete({
          isOpen: true,
          stepName: steps[stepIndex].title,
          stepIndex,
        });
      }
    }
  };

  // onFinish = form submission handler
  const handleSave = async (formValue) => {
    if (!isSubmitRef.current) {
      // Save as draft: show confirmation directly
      setBodyData({
        ...formValue,
        criteria: normalizeCollectionCriteriaValues(formValue.criteria || []),
      });
      setModalConfirm(true);
      return;
    }
    // Submit: extra validations
    const selectedCriteriaValues = normalizeCollectionCriteriaValues(
      form.getFieldValue("criteria") || []
    );
    if (
      listDataCriteria.length === 0 &&
      !selectedCriteriaValues.includes(24)
    ) {
      setCurrent(0);
      dispatch(showModalError({ title: "Failed", description: "Criteria Mandatory. Please insert data." }));
      return;
    }
    if (storedDataInline) {
      dispatch(showModalError({ title: "Failed", description: "Please save data table inline before submit." }));
      return;
    }
    if (listDataAttachment.length === 0) {
      setCurrent(2);
      dispatch(showModalError({ title: "Failed", description: "Attachment Mandatory. Please insert at least one attachment." }));
      return;
    }
    setBodyData({
      ...formValue,
      criteria: normalizeCollectionCriteriaValues(formValue.criteria || []),
    });
    setModalConfirm(true);
  };

  const onConfirm = async () => {
    setLoadingForm(true);
    setModalConfirm(false);

    const body = processData(bodyData);
    const action = type === "create" ? createCollectionActivity : updateCollectionActivity;

    dispatch(action(body))
      .unwrap()
      .then(async (savedEntity) => {
        const savedId = savedEntity?.id || id;
        const newFiles = listDataAttachment.filter((f) => f.dataType === "new" && f.file);
        if (newFiles.length > 0 && savedId) {
          const byCategory = {};
          newFiles.forEach((file) => {
            const cat = file.fileCategoryId || 0;
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(file.file);
          });
          for (const [cat, files] of Object.entries(byCategory)) {
            const uploadData = new FormData();
            files.forEach((f) => uploadData.append("files", f));
            uploadData.append("category", cat);
            uploadData.append("collectionActivityId", savedId);
            await debtAndCollectionHttpService.upload(
              `/v1/dbs/api/collection-activities/create-attachment`,
              uploadData
            );
          }
        }
        setLoadingForm(false);
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTION_ACTIVITIES, {
          replace: true,
        });
      })
      .catch((error) => {
        setLoadingForm(false);
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          setBodyError({ message: error?.response?.data?.message || "Internal Server Error" });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => { setModalError(false); onConfirm(); };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

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
          <div
            style={{
              display: valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <CollectionActivitiesSectionForm
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
              handleStartDate={(val) => setStartDate(val)}
              handleEndDate={(val) => setEndDate(val)}
              status={status}
              statusApproval={statusApproval}
              disabledDate={isDisabledDate}
            />
          </div>

          <div
            style={{
              display: valuePage !== listSectionInfo[1].value ? "none" : undefined,
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
              display: valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="collectionActivities"
                dispatch={dispatch}
                getAPICategory={getListCategoryCA}
                service={debtAndCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
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
            disabled={storedDataInline}
            isLoading={loadingForm}
          />
        </Form>
      </Spin>

      {/* Confirmation Modal */}
      <ModalCustom
        isOpen={modalConfirm}
        header="CONFIRMATION"
        width={1000}
        type="confirmation"
        handleCancel={() => setModalConfirm(false)}
        loading={loadingForm}
        footer={
          <div className="flex w-full justify-end gap-2 mb-5">
            <ButtonComponent
              onClick={() => setModalConfirm(false)}
              disabled={loadingForm}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={onConfirm}
              loading={loadingForm}
              disabled={loadingForm}
            >
              {isSubmitRef.current ? "Submit" : "Save as Draft"}
            </ButtonComponent>
          </div>
        }
      >
        <ConfirmationCollectionActivities
          bodyData={bodyData}
          appHierDataDetail={appHierDataDetail}
          appHierOptions={appHierOptions}
          listDataAttachment={listDataAttachment}
          listDataCriteria={listDataCriteria}
          criteriaValues={criteriaValues}
          data_media={data_media}
          data_category={data_category}
        />
      </ModalCustom>

      {/* Back Modal */}
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

      {/* Error Modal */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={() => { setModalError(false); setBodyError({}); }}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${flag ? "submitted" : "saved"}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      {/* Incomplete Step Modal */}
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
    </>
  );
};

export default CollectionActivitiesForm;
