import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Select, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../../components/BreadCrumb";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { hasValue } from "../../../../../utils";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import { getCriteria } from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import {
  getAvailableApproval,
  getSelectedApproval,
  getHolidayType,
  getAttachmentCategoryCalendar,
  getDetailCalendar,
  createCalendar,
  updateCalendar,
} from "../../../../../redux/slices/system_setup/master_data/calendar";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import FunctionalCriteriaBillingBucket from "../../../RatingBillingInvoice/MasterData/BillingBucket/Form/FunctionalCriteriaBillingBucket";
import CardContainer from "../../../../../components/CardContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import { configApp } from "../../../../../constants/configApp";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ConfirmationCalendar from "./Modal/ConfirmationCalendar";

const STEPS = [
  { title: "CALENDAR", value: "Calendar" },
  { title: "APPROVAL", value: "Approval" },
  { title: "ATTACHMENT", value: "Attachment" },
];

const CalendarForm = ({ type }) => {
  // Selector
  const {
    data_detail,
    data_holiday_type,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.calendar);

  const { data_criteria } = useSelector((state) => state.billing_bucket);

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
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [flag, setFlag] = useState(false);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});

  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Calendar",
      paramValue: ["name", "startDate", "holidayType", "criteria"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  // Steps configuration
  const steps = STEPS;

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current, steps]);

  const isLoading = loading || loadingForm;

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
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

  // Disable end date logic
  const isDisabledDate = useMemo(() => {
    if (
      hasValue(form?.getFieldsValue()?.endDate) === true &&
      listDataCriteria?.length > 0
    ) {
      return true;
    }
    return false;
  }, [form, listDataCriteria]);

  // Use Effect
  useEffect(() => {
    dispatch(getCriteria());
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval({ id: 0 }));
    dispatch(getHolidayType());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailCalendar(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (data_criteria) {
      const tempCriterias = (data_criteria || []).map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_criteria]);

  useEffect(() => {
    if (!id) return;

    const CRITERIA_FIELD_TO_ID = {
      costCenter: 16,
      subDistrict: 13,
      district: 14,
      city: 39,
      province: 15,
      sor: 11,
      customer: 12,
      industrialSector: 18,
      budget: 17,
      customerSegment: 19,
      accountGroup: 20,
      serviceType: 21,
      accountCategory: 22,
      gsizes: 23,
    };

    const mapAttachments = (list) =>
      (list || []).map((item, index) => ({
        key: index + 1,
        id: item.id,
        size: item.fileSize,
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
      }));

    const callendar = data_detail?.callendar || {};
    if (!callendar.calendarId) return;

    const criterias = Array.isArray(data_detail?.criterias)
      ? data_detail.criterias
      : [];

    const allCriteria = criterias.some((c) => c.allCriteria);
    const criteriaSelect = allCriteria
      ? [24]
      : Object.entries(CRITERIA_FIELD_TO_ID)
          .filter(([field]) =>
            criterias.some((row) => row[field]?.label != null),
          )
          .map(([, criteriaId]) => criteriaId);

    const dataCriteriaList = criterias
      .filter((item) => !item.allCriteria)
      .map((item, index) => ({
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
        accountCategory: item.accountCategory,
        serviceType: item.serviceType,
        customer: item.customer,
        startDate: item.startDate,
        endDate: item.endDate,
        key: index + 1,
        type: "exist",
      }));

    form.setFieldsValue({
      name: callendar.calendarName,
      startDate: callendar.startDate ? moment(callendar.startDate) : undefined,
      endDate: callendar.endDate ? moment(callendar.endDate) : undefined,
      holidayType: callendar.holidayType,
      criteria: criteriaSelect,
      description: callendar.description,
      apphierId: callendar.apphierId,
    });

    setStartDate(callendar.startDate ? moment(callendar.startDate) : undefined);
    setSelectedHierarchy(callendar.apphierId);
    setListDataAttachment(mapAttachments(data_detail?.attachments));
    setCriteriaValues(criteriaSelect || []);
    setListDataCriteria(dataCriteriaList);
  }, [id, type, form, data_detail]);

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
        employeeDetail: a.employeeDetail.map((b, idx) => ({
          ...b,
          key: idx + 1,
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
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_CALENDAR,
      breadcrumbName: "Calendar",
    },
    {
      path:
        type === "create"
          ? SYSTEM_SETUP_ROUTES.CREATE_CALENDAR
          : SYSTEM_SETUP_ROUTES.UPDATE_CALENDAR,
      breadcrumbName: type === "create" ? "Create Calendar" : "Update Calendar",
    },
  ];

  // Criteria dependency logic
  const handleSelectCriteria = (value) => {
    let res = [...criteriaValues, value];
    if (res.includes(13)) res.push(14);
    if (res.includes(14)) res.push(39);
    if (res.includes(39)) res.push(15);
    if (res.includes(20)) res.push(19);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleDeselectCriteria = (value) => {
    let res = criteriaValues.filter((item) => item !== value);
    if (!res.includes(15)) res = res.filter((item) => item !== 39);
    if (!res.includes(39)) res = res.filter((item) => item !== 14);
    if (!res.includes(14)) res = res.filter((item) => item !== 13);
    if (!res.includes(19)) res = res.filter((item) => item !== 20);
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    form.setFieldsValue({ criteria: outputArray });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
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

  const handleDisableEndDate = (current) => {
    if (startDate) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  // processData builds the save body
  const DATE_FORMAT = "DD MMM YYYY";
  const formatDate = (val) =>
    val ? moment(val).format(DATE_FORMAT).toUpperCase() : null;

  const processData = ({ bodyData, id, type, flag }) => {
    const criteriaData = listDataCriteria.map((item) => ({
      id: item?.id || null,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      customer: item.customer?.value || null,
      budget: item.budget?.value || null,
      subDistrict: item.subDistrict?.value || null,
      district: item.district?.value || null,
      city: item.city?.value || null,
      province: item.province?.value || null,
      area: item.area?.value || null,
      sor: item.sor?.value || null,
      industrialSector: item.industrialSector?.value || null,
      gSizes: item.gsizes?.value || null,
      customerSegment: item.customerSegment?.value || null,
      accountGroupType: item.accountGroup?.value || null,
      accountCategory: item.accountCategory?.value || null,
      serviceType: item.serviceType?.value || null,
      product: null,
      allCriteria: false,
    }));

    const includesAll = bodyData.criteria.includes(24);

    const body = {
      id: type === "create" ? undefined : id,
      name: bodyData.name,
      startDate: formatDate(bodyData.startDate),
      endDate: formatDate(bodyData.endDate),
      description: bodyData.description || null,
      holidayType: bodyData.holidayType || null,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
      criterias: includesAll ? [{ allCriteria: true }] : criteriaData,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/calendar/validate-create"
        : "/v1/dbs/api/calendar/validate-update";

    const body = processData({
      bodyData: formValue,
      id,
      type,
      flag,
    });

    try {
      await dispatch(
        validateCreateUpdate({
          body,
          services: ratingBillingHttpService,
          endPoint: url,
          type,
        }),
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const lowerCaseCheckedCriteria = (name) => {
    let nameChecked = `${name?.toString()?.toLowerCase()?.replace(/[-\s]/g, "")}`;
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
    }
    return true;
  };

  const validateCriteriaFields = (
    criteriaValues,
    dataCriteria,
    listDataCriteria = [],
  ) => {
    let missingColumn = [];
    const tempArray = criteriaValues.filter((item) =>
      dataCriteria?.includes(item.value),
    );
    const tempNameCriteria = tempArray.map((data) => data.name);
    listDataCriteria?.forEach((item) => {
      tempNameCriteria?.forEach((criteriaName) => {
        if (
          !item[lowerCaseCheckedCriteria(criteriaName)] ||
          !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)])
        ) {
          missingColumn.push(criteriaName);
        }
      });
    });
    const uniqueMissingColumn = missingColumn
      .filter((item, index) => missingColumn.indexOf(item) === index)
      .filter((item) => item !== "All");

    return uniqueMissingColumn.length > 0 || listDataCriteria.length < 1;
  };

  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const headerStart = formHeader?.startDate
      ? moment(formHeader.startDate).startOf("day")
      : null;
    const headerEnd = formHeader?.endDate
      ? moment(formHeader.endDate).startOf("day")
      : null;

    return dataTable?.some((item) => {
      const criteriaStart = item?.startDate
        ? moment(item.startDate).startOf("day")
        : null;
      const criteriaEnd = item?.endDate
        ? moment(item.endDate).startOf("day")
        : null;

      if (headerStart && criteriaStart && criteriaStart.isBefore(headerStart))
        return true;
      if (headerEnd && criteriaEnd && criteriaEnd.isAfter(headerEnd))
        return true;
      return false;
    });
  }, []);

  const handleMandatory = (
    setListSectionInfo,
    listDataAttachment,
    errorFields,
  ) => {
    setListSectionInfo((prevState) =>
      prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue?.includes(next.name[0])
                    ? current + 1
                    : current,
                0,
              )
            : listDataAttachment.length < 1
              ? 1
              : 0;
        return { ...item, errorBadge };
      }),
    );
  };

  const handleError = ({ errorFields }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);
  };

  const handleSubmit = () => {
    setFlag(true);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setFlag(false);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSave = async (formValue) => {
    const hasOverlapping = checkOverlappingData(
      { startDate: formValue?.startDate, endDate: formValue?.endDate },
      listDataCriteria,
    );

    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Criteria Mandatory. Please insert data.",
          }),
        );
      } else if (storedDataInline) {
        dispatch(
          showModalError({
            title: "Failed",
            description:
              "Please save data table inline before submit. Please try again.",
          }),
        );
      } else if (
        !formValue.criteria.includes(24) &&
        validateCriteriaFields(
          criteriaOptions,
          formValue?.criteria,
          listDataCriteria,
        )
      ) {
        dispatch(
          showModalError({
            title: "Failed",
            description:
              "There is missing values in table criteria. Please try again",
          }),
        );
      } else if (hasOverlapping) {
        dispatch(
          showModalError({
            title: "Failed",
            description:
              "You can't add Criteria. Start date and end date can't be overlap",
          }),
        );
      } else {
        const isDataValid = await checkDataValidity(formValue);
        if (isDataValid) {
          setBodyData({ ...formValue });
          setModalConfirm(true);
          setListSectionInfo([
            {
              value: "Calendar",
              paramValue: ["name", "startDate", "holidayType", "criteria"],
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

    const body = processData({ bodyData, id, type, flag });

    if (type === "create") {
      dispatch(createCalendar({ body }))
        .unwrap()
        .then(async (dataForm) => {
          const referenceId = dataForm?.calendarId;
          setLoadingForm(true);
          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];
            const formData = new FormData();
            formData.append("files", element.file);
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/calendar/create-attachment?categoryId=${element.fileCategoryId}&referenceId=${referenceId}`,
              formData,
              () => {},
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateCalendar({ body }))
        .unwrap()
        .then(async (dataForm) => {
          const referenceId = dataForm?.calendarId;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          setLoadingForm(true);
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const formData = new FormData();
            formData.append("files", element.file);
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/calendar/create-attachment?categoryId=${element.fileCategoryId}&referenceId=${referenceId}`,
              formData,
              () => {},
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              error?.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
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
      setListSectionInfo([
        {
          value: "Calendar",
          paramValue: ["name", "startDate", "holidayType", "criteria"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailCalendar(id));
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

  const handleBack = () => {
    setModalBack(true);
  };

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
          {/* Calendar Section */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <CardContainer header={"Calendar Information"}>
              <div className="w-full grid grid-cols-4 gap-3">
                <Form.Item
                  label={"Name"}
                  name={"name"}
                  rules={[
                    { required: true, message: "Please input your Name!" },
                  ]}
                >
                  <InputComponent
                    placeholder={"Input Holiday Name"}
                    disabled={
                      status !== "DRAFT" && type === "update" ? true : false
                    }
                    maxLength={100}
                  />
                </Form.Item>

                <Form.Item
                  label={"Start Date"}
                  name={"startDate"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Start Date!",
                    },
                  ]}
                >
                  <DateComponent
                    onChange={(e) => handleStartDate(e)}
                    disabled={
                      (status !== "DRAFT" && type === "update") ||
                      isDisabledDate
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={"End Date"}
                  name={"endDate"}
                  rules={[
                    {
                      validator: (_, value) =>
                        (value && moment(startDate) <= moment(value)) || !value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("End date must be after Start date"),
                            ),
                    },
                  ]}
                >
                  <DateComponent
                    onChange={(e) => handleEndDate(e)}
                    dateDisable={handleDisableEndDate}
                    disabled={isDisabledDate}
                  />
                </Form.Item>

                <Form.Item
                  label={"Holiday Type"}
                  name={"holidayType"}
                  rules={[
                    {
                      required: true,
                      message: "Please select Holiday Type!",
                    },
                  ]}
                >
                  <SelectComponent
                    placeholder={"Choose holiday type"}
                    disabled={
                      status !== "DRAFT" && type === "update" ? true : false
                    }
                  >
                    {(data_holiday_type || []).map((item, index) => (
                      <Select.Option key={index} value={item.code}>
                        {item.text}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>

                <div className="col-span-2">
                  <Form.Item
                    label={"Criteria"}
                    name={"criteria"}
                    rules={[
                      {
                        required: true,
                        message: "Please select Criteria!",
                      },
                    ]}
                  >
                    <SelectComponent
                      mode="multiple"
                      onSelect={handleSelectCriteria}
                      onDeselect={handleDeselectCriteria}
                      onClear={handleClearCriteria}
                      disabled={storedDataInline}
                    >
                      {(data_criteria || []).map((data, index) => (
                        <Select.Option value={data.id} key={index}>
                          {data.text}
                        </Select.Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>
                </div>

                <div className="col-span-2">
                  <Form.Item
                    label={"Description"}
                    name={"description"}
                    className={"w-full"}
                  >
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
              </div>
            </CardContainer>

            <CardContainer header={"Criteria Information"}>
              <FunctionalCriteriaBillingBucket
                type={type}
                data={listDataCriteria}
                dataCriteria={criteriaValues}
                updateData={setListDataCriteria}
                setStoredData={setStoredDataInline}
                storedData={storedDataInline}
                required={{ required: true, message: "Please input your" }}
                disableDate={true}
                status={status}
                statusApproval={statusApproval}
                validStartDate={startDate}
                validEndDate={endDate}
              />
            </CardContainer>
          </div>

          {/* Approval Section */}
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

          {/* Attachment Section */}
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
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategoryCalendar}
                typeSelector="calendar"
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
            disabled={storedDataInline}
          />
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationCalendar
          isOpen={modalConfirm}
          data={bodyData}
          selectedHierarchy={selectedHierarchy}
          apiHolidayType={data_holiday_type}
          apiCriteria={data_criteria}
          criteriaValues={criteriaValues}
          listDataAppHierDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          listDataCriteria={listDataCriteria}
          dataOption={appHierOptions}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
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
              flag ? "submitted" : "saved"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default CalendarForm;
