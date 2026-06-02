import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Spin } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardContainer from "../../../../../components/CardContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import {
  getAccountCategory,
  getAccountGroup,
  getBudget,
  getCity,
  getCostCenter,
  getCustomerCA,
  getCustomerSegment,
  getDistrict,
  getGsizes,
  getIndustrialSector,
  getListApprovalHierarchyCriteriaCA,
  getListApprovalHierarchyDetailCA,
  getListCategoryCA,
  getProvince,
  getServiceType,
  getSor,
  getSubDistrict,
  submitApprovalCriteriaCA,
} from "../../../../../redux/slices/debt_and_collection/collectionActivities";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { configApp } from "../../../../../constants/configApp";

const COLLECTION_ACTIVITY_CRITERIA_CONFIG = {
  11: { id: 11, field: "sor", label: "SOR", aliases: ["sor"] },
  12: {
    id: 12,
    field: "customer",
    label: "ACCOUNT",
    aliases: ["account", "customer", "cust"],
  },
  13: {
    id: 13,
    field: "subDistrict",
    label: "SUB-DISTRICT",
    aliases: ["subdistrict", "sub-district"],
  },
  14: { id: 14, field: "district", label: "DISTRICT", aliases: ["district"] },
  15: { id: 15, field: "province", label: "PROVINCE", aliases: ["province"] },
  16: {
    id: 16,
    field: "area",
    label: "COST CENTER",
    aliases: ["costcenter", "cost center", "area"],
  },
  17: {
    id: 17,
    field: "budget",
    label: "BUDGET",
    aliases: ["budget", "budgettype", "budget type"],
  },
  18: {
    id: 18,
    field: "industrialSector",
    label: "INDUSTRIAL SECTOR",
    aliases: ["industrialsector", "industrial sector"],
  },
  19: {
    id: 19,
    field: "customerSegment",
    label: "CUSTOMER SEGMENT",
    aliases: ["customersegment", "customer segment"],
  },
  20: {
    id: 20,
    field: "accountGroup",
    label: "ACCOUNT GROUP",
    aliases: ["accountgroup", "account group", "accountgrouptype"],
  },
  21: {
    id: 21,
    field: "serviceType",
    label: "SERVICE TYPE",
    aliases: ["servicetype", "service type"],
  },
  22: {
    id: 22,
    field: "accountCategory",
    label: "ACCOUNT CATEGORY",
    aliases: ["accountcategory", "account category"],
  },
  23: {
    id: 23,
    field: "gsizes",
    label: "G-SIZES",
    aliases: ["gsizes", "gsize", "g-sizes", "g sizes"],
  },
  24: {
    id: 24,
    field: null,
    label: "ALL",
    aliases: ["all", "allcriteria", "all criteria"],
  },
  39: { id: 39, field: "city", label: "CITY", aliases: ["city"] },
};

const COLLECTION_ACTIVITY_CRITERIA_LIST = Object.values(
  COLLECTION_ACTIVITY_CRITERIA_CONFIG
);

// Preferred display order — ensures dependent fields follow their parent
// (e.g. province must appear before city/district/subDistrict)
const CRITERIA_PREFERRED_FIELDS = [
  "province",
  "city",
  "district",
  "subDistrict",
  "sor",
  "customer",
  "area",
  "budget",
  "industrialSector",
  "customerSegment",
  "accountGroup",
  "serviceType",
  "accountCategory",
  "gsizes",
];

const CRITERIA_FIELD_LOADERS = {
  customerSegment: getCustomerSegment,
  accountCategory: getAccountCategory,
  serviceType: getServiceType,
  industrialSector: getIndustrialSector,
  budget: getBudget,
  sor: getSor,
  area: getCostCenter,
  province: getProvince,
  customer: getCustomerCA,
  gsizes: getGsizes,
};

const STEP_ITEMS = [
  { title: "Criteria Information" },
  { title: "Approval Information" },
  { title: "Attachment Information" },
];

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
  const normalizedValue = Number(value);
  return Number.isNaN(normalizedValue) ? value : normalizedValue;
};

const formatCollectionCriteriaDate = (value) => {
  if (!value) {
    return null;
  }
  if (moment.isMoment(value)) {
    return value.format("DD MMM YYYY");
  }
  const formatted = moment(value);
  return formatted.isValid() ? formatted.format("DD MMM YYYY") : value;
};

const getCollectionCriteriaConfigById = (criteriaId) =>
  COLLECTION_ACTIVITY_CRITERIA_CONFIG[
    normalizeCollectionCriteriaValue(criteriaId)
  ];

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

const getCollectionCriteriaOptionObject = (criteriaItem = {}) => {
  const rawValue = getFirstCollectionCriteriaValue(
    criteriaItem.value,
    criteriaItem.criteriaValueNumber,
    criteriaItem.id,
    criteriaItem.customerNumber,
    criteriaItem.code,
    criteriaItem.criteriaValueText,
    criteriaItem.criteriaValueDisplay,
    criteriaItem.criteriaValueId,
    criteriaItem.Id
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
      criteriaItem.value,
      criteriaItem.Id
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
          criteriaValue.value,
          criteriaValue.Id
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

const mapCriteriaDefinitions = (criteriaData = []) => {
  const seenCriteria = new Set();

  return criteriaData.reduce((result, item) => {
    const criteriaConfig =
      getCollectionCriteriaConfigById(item.criteriaValueId) ||
      getCollectionCriteriaConfigByType(item.criteriaType);

    if (!criteriaConfig) {
      return result;
    }

    if (seenCriteria.has(criteriaConfig.id)) {
      return result;
    }

    seenCriteria.add(criteriaConfig.id);
    result.push({
      criteriaId: criteriaConfig.id,
      criteriaType:
        item.criteriaType ||
        criteriaConfig.label.toString().replace(/[^A-Z0-9]+/g, "_").toUpperCase(),
      field: criteriaConfig.field,
      label: criteriaConfig.label,
    });
    return result;
  }, []);
};

const mapApprovalOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map((item) => ({
    value:
      item?.value ??
      item?.appHierId ??
      item?.apphierId ??
      item?.id,
    name:
      item?.name ??
      item?.approvalName ??
      item?.text ??
      item?.label ??
      item?.appHierName ??
      item?.approvalHierarchyName,
  }));

const uploadCriteriaAttachments = async (activityId, attachments = []) => {
  const newFiles = attachments.filter((file) => file.dataType === "new" && file.file);
  if (newFiles.length === 0 || !activityId) {
    return;
  }

  const groupedFiles = {};
  newFiles.forEach((file) => {
    const category = file.fileCategoryId || 0;
    if (!groupedFiles[category]) {
      groupedFiles[category] = [];
    }
    groupedFiles[category].push(file.file);
  });

  for (const [category, files] of Object.entries(groupedFiles)) {
    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("files", file));
    uploadData.append("category", category);
    uploadData.append("collectionActivityId", activityId);
    await debtAndCollectionHttpService.upload(
      `/v1/dbs/api/collection-activities/create-attachment`,
      uploadData
    );
  }
};

const CollectionActivitiesCriteriaModal = ({
  isOpen,
  onClose = () => {},
  detailData = {},
  dispatch,
  onSubmitted = () => {},
}) => {
  const [form] = Form.useForm();
  const {
    data_customer_segment,
    data_account_group,
    data_account_category,
    data_service_type,
    data_industrial_sector,
    data_budget,
    data_sor,
    data_cost_center,
    data_gsizes,
    data_province,
    data_city,
    data_district,
    data_sub_district,
    data_customer_ca,
  } = useSelector((state) => state.collectionActivities);

  const [currentStep, setCurrentStep] = useState(0);
  const [approvalOptions, setApprovalOptions] = useState([]);
  const [approvalDetail, setApprovalDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loadingApprovalOptions, setLoadingApprovalOptions] = useState(false);
  const [loadingApprovalDetail, setLoadingApprovalDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startDate = Form.useWatch("startDate", form);

  const criteriaDefinitions = useMemo(
    () => mapCriteriaDefinitions(detailData?.criteriaData || []),
    [detailData]
  );

  const criteriaOptionsMap = useMemo(
    () => ({
      customerSegment: (data_customer_segment || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      accountGroup: (data_account_group || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      accountCategory: (data_account_category || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      serviceType: (data_service_type || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      industrialSector: (data_industrial_sector || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      budget: (data_budget || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      sor: (data_sor || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      area: (data_cost_center || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      province: (data_province || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      city: (data_city || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      district: (data_district || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      subDistrict: (data_sub_district || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      customer: (data_customer_ca || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
      gsizes: (data_gsizes || [])
        .map((item) => getCollectionCriteriaOptionObject(item))
        .filter(Boolean),
    }),
    [
      data_account_category,
      data_account_group,
      data_budget,
      data_city,
      data_cost_center,
      data_customer_ca,
      data_customer_segment,
      data_district,
      data_gsizes,
      data_industrial_sector,
      data_province,
      data_service_type,
      data_sor,
      data_sub_district,
    ]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCurrentStep(0);
    setApprovalOptions([]);
    setApprovalDetail([]);
    setSelectedHierarchy("");
    setAttachments([]);
    form.resetFields();

    criteriaDefinitions.forEach((definition) => {
      if (definition.field && CRITERIA_FIELD_LOADERS[definition.field]) {
        dispatch(CRITERIA_FIELD_LOADERS[definition.field]());
      }
    });

    setLoadingApprovalOptions(true);
    dispatch(getListApprovalHierarchyCriteriaCA())
      .unwrap()
      .then((response) => {
        setApprovalOptions(mapApprovalOptions(response || []));
      })
      .catch(() => {
        setApprovalOptions([]);
      })
      .finally(() => {
        setLoadingApprovalOptions(false);
      });
  }, [criteriaDefinitions, dispatch, form, isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedHierarchy) {
      setApprovalDetail([]);
      return;
    }

    setLoadingApprovalDetail(true);
    dispatch(getListApprovalHierarchyDetailCA({ id: selectedHierarchy }))
      .unwrap()
      .then((response) => {
        setApprovalDetail(response || []);
      })
      .catch(() => {
        setApprovalDetail([]);
      })
      .finally(() => {
        setLoadingApprovalDetail(false);
      });
  }, [dispatch, isOpen, selectedHierarchy]);

  const getSelectedCriteriaOption = (field, value) =>
    (criteriaOptionsMap[field] || []).find((option) => option.value === value);

  const handleCriteriaValueChange = (field, value) => {
    if (field === "customerSegment") {
      form.setFieldsValue({ accountGroup: undefined });
      if (value !== undefined && value !== null && value !== "") {
        dispatch(getAccountGroup(value));
      }
      return value;
    }

    if (field === "province") {
      form.setFieldsValue({ city: undefined, district: undefined, subDistrict: undefined });
      if (value !== undefined && value !== null && value !== "") {
        dispatch(getCity(value));
      }
      return value;
    }

    if (field === "city") {
      form.setFieldsValue({ district: undefined, subDistrict: undefined });
      if (value !== undefined && value !== null && value !== "") {
        dispatch(getDistrict(value));
      }
      return value;
    }

    if (field === "district") {
      form.setFieldsValue({ subDistrict: undefined });
      if (value !== undefined && value !== null && value !== "") {
        dispatch(getSubDistrict(value));
      }
      return value;
    }

    return value;
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          ...criteriaDefinitions
            .filter((definition) => definition.field)
            .map((definition) => definition.field),
          "startDate",
        ]);
      }

      if (currentStep === 1) {
        await form.validateFields(["apphierId"]);
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      return error;
    }
    return null;
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const buildRequestBody = () => {
    const formValues = form.getFieldsValue(true);
    const existingCriteria = (detailData?.criteriaData || []).map((criteriaItem) => ({
      id: criteriaItem.id || null,
      criteriaType: criteriaItem.criteriaType,
      criteriaValueId: normalizeCollectionCriteriaValue(criteriaItem.criteriaValueId),
      criteriaValueText: toCollectionCriteriaText(criteriaItem.criteriaValueText),
      criteriaValueNumber: toCollectionCriteriaNumber(criteriaItem.criteriaValueNumber),
      criteriaValueDisplay: toCollectionCriteriaText(criteriaItem.criteriaValueDisplay),
      criteriaGroupId: criteriaItem.criteriaGroupId,
      startDate: formatCollectionCriteriaDate(criteriaItem.startDate),
      endDate: formatCollectionCriteriaDate(criteriaItem.endDate),
      description: criteriaItem.description || null,
    }));

    const nextCriteriaGroupId =
      Math.max(
        0,
        ...(detailData?.criteriaData || []).map((criteriaItem) =>
          Number(criteriaItem.criteriaGroupId || 0)
        )
      ) + 1;

    const newCriteria = criteriaDefinitions.map((definition) => {
      const selectedValue = definition.field
        ? getSelectedCriteriaOption(definition.field, formValues[definition.field])
        : null;
      const payloadValues = getCollectionCriteriaPayloadValues(selectedValue);

      return {
        id: null,
        criteriaType: definition.criteriaType,
        criteriaValueId: definition.criteriaId,
        criteriaValueText: payloadValues.criteriaValueText,
        criteriaValueNumber: payloadValues.criteriaValueNumber,
        criteriaValueDisplay: payloadValues.criteriaValueDisplay,
        criteriaGroupId: nextCriteriaGroupId,
        startDate: formatCollectionCriteriaDate(formValues.startDate),
        endDate: formatCollectionCriteriaDate(formValues.endDate),
        description: formValues.description || null,
      };
    });

    return {
      id: detailData?.id,
      apphierId: formValues.apphierId,
      listCriteriaData: [...existingCriteria, ...newCriteria],
    };
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields([
        ...criteriaDefinitions
          .filter((definition) => definition.field)
          .map((definition) => definition.field),
        "startDate",
        "apphierId",
      ]);
    } catch (error) {
      return error;
    }

    setSubmitting(true);

    try {
      const body = buildRequestBody();
      const response = await dispatch(submitApprovalCriteriaCA(body)).unwrap();
      const savedId = response?.collectionActivityId || detailData?.id;
      try {
        await uploadCriteriaAttachments(savedId, attachments);
      } catch {
        dispatch(
          showModalError({
            title: "Failed",
            description:
              "Criteria approval was submitted, but attachment upload failed.",
          })
        );
        onClose();
        onSubmitted();
        return null;
      }
      dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been submitted.",
          return: false,
        })
      );
      onClose();
      onSubmitted();
    } catch (error) {
      if (!error?.response) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Your data was not submitted.",
          })
        );
      }
    } finally {
      setSubmitting(false);
    }

    return null;
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={submitting ? undefined : onClose}
      header={"Create Criteria Information"}
      width={1280}
      loading={submitting}
      footer={null}
    >
      <Spin spinning={submitting}>
        <Form form={form} layout="vertical">
          <FormStepper
            steps={STEP_ITEMS}
            current={currentStep}
            onPrev={handlePrevious}
            onNext={handleNext}
            disabled={submitting}
          />

          <div style={{ display: currentStep === 0 ? undefined : "none" }}>
            <CardContainer header={"Criteria Information"}>
              {criteriaDefinitions.filter((definition) => definition.field).length === 0 ? (
                <div className="text-sm text-[#6B7280] mb-4">
                  No dynamic criteria dropdown is required for this activity.
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {criteriaDefinitions
                  .filter((definition) => definition.field)
                  .sort((a, b) => {
                    const ai = CRITERIA_PREFERRED_FIELDS.indexOf(a.field);
                    const bi = CRITERIA_PREFERRED_FIELDS.indexOf(b.field);
                    return (ai === -1 ? CRITERIA_PREFERRED_FIELDS.length : ai) -
                           (bi === -1 ? CRITERIA_PREFERRED_FIELDS.length : bi);
                  })
                  .map((definition) => (
                    <Form.Item
                      key={definition.criteriaId}
                      name={definition.field}
                      rules={[
                        {
                          required: true,
                          message: `Please select ${definition.label}.`,
                        },
                      ]}
                      getValueFromEvent={(value) =>
                        handleCriteriaValueChange(definition.field, value)
                      }
                      className="mb-0"
                    >
                      <SelectComponent
                        label={definition.label}
                        mandatory
                        placeholder={`Select ${definition.label}`}
                        options={criteriaOptionsMap[definition.field] || []}
                        optionFilterProp="label"
                      />
                    </Form.Item>
                  ))}

                <Form.Item
                  name={"startDate"}
                  rules={[
                    { required: true, message: "Please select Start Date." },
                  ]}
                  className="mb-0"
                >
                  <DateComponent
                    label={"Start Date"}
                    mandatory
                    placeholder={"Select Start Date"}
                    format={"DD MMM YYYY"}
                  />
                </Form.Item>

                <Form.Item name={"endDate"} className="mb-0">
                  <DateComponent
                    label={"End Date"}
                    placeholder={"Select End Date"}
                    format={"DD MMM YYYY"}
                    dateDisable={(current) => {
                      const isBeforeToday =
                        current && current < moment().startOf("day");
                      const isBeforeStartDate =
                        startDate &&
                        current &&
                        current < moment(startDate).startOf("day");
                      return Boolean(isBeforeToday || isBeforeStartDate);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="mt-4">
                <Form.Item name={"description"} className="mb-0">
                  <InputComponent
                    label={"Description"}
                    type={"textarea"}
                    placeholder={"Input Description"}
                    rows={4}
                  />
                </Form.Item>
              </div>
            </CardContainer>
          </div>

          <div style={{ display: currentStep === 1 ? undefined : "none" }}>
            <CardContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                dataTable={approvalDetail}
                dataOption={approvalOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
                loading={loadingApprovalOptions || loadingApprovalDetail}
              />
            </CardContainer>
          </div>

          <div style={{ display: currentStep === 2 ? undefined : "none" }}>
            <CardContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={"create"}
                data={attachments}
                updateData={setAttachments}
                typeSelector={"collectionActivities"}
                dispatch={dispatch}
                getAPICategory={getListCategoryCA}
                service={debtAndCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
              />
            </CardContainer>
          </div>

          <div className="bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
            <div className="flex w-full justify-between items-center gap-3">
              <Button
                onClick={onClose}
                disabled={submitting}
                style={{
                  borderColor: "#0075BF",
                  color: "#0075BF",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || submitting}
                  style={{
                    borderRadius: "6px",
                  }}
                >
                  Previous
                </Button>

                {currentStep < STEP_ITEMS.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    disabled={submitting}
                    style={{
                      backgroundColor: "#0075BF",
                      borderColor: "#0075BF",
                      borderRadius: "6px",
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                    style={{
                      backgroundColor: "#0075BF",
                      borderColor: "#0075BF",
                      borderRadius: "6px",
                    }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Form>
      </Spin>
    </ModalCustom>
  );
};

export default CollectionActivitiesCriteriaModal;