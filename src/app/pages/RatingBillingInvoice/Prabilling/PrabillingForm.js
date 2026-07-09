import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Modal, Spin, Select, DatePicker, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import FormConfirmation from "./FormConfirmation";
import SelectComponent from "../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import {
  getListAccountGroup,
  getListBillingCycle,
  getListBillingPeriod,
  getListCostCenter,
  getListCustomerSegment,
  getListMeterReadingCode,
  getListSchedulerType,
  getListSor,
  getListSpecificCustomer,
  getListComponentPrabilling,
  createPrabilling,
  getUserDetailCalculation,
  getUserProfile,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { IconModal } from "../../../../utils/Icon";
import CardContainer from "../../../../components/CardContainer";
import { FormFooter } from "../../../../components/FormStepNavigation";

const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LENGTH = 50;

const PrabillingForm = ({ type }) => {
  const {
    loading,
    list_sor,
    list_account_group,
    list_customer_segment,
    list_cost_center,
    list_meter_reading_code,
    list_scheduler_type,
    list_specific_customer,
    loading_specific_customer,
    specific_customer_message,
    list_billing_cycle,
    list_billing_period,
    list_component_prabilling,
    data_user_calculation,
    user_profile,
    loadingCreate,
  } = useSelector((state) => state.rbi_prabilling);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openBack, setOpenBack] = useState(false);
  const [billingCycle, setBillingCycle] = useState();
  const [selectedScheduleType, setSelectedScheduleType] = useState(null);
  const [form] = Form.useForm();

  const [dataSpecificCustomer, setDataSpecificCustomer] = useState({
    sorId: null,
    costCenterId: [],
    meterReadingCodeId: [],
    accountSegmentId: [],
    accountGroupTypeId: [],
    search: "",
    limit: DEFAULT_SEARCH_LIMIT,
    billingPeriod: null,
  });

  const [remark, setRemark] = useState("");
  const [mergedArrayMrc, setMergedArrayMrc] = useState([]);
  const [dataFinal, setDataFinal] = useState({});
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [defaultData, setDefaultData] = useState({});

  const [searchCustomerValue, setSearchCustomerValue] = useState("");
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const searchTimeoutRef = useRef(null);
  const [selectedCustomersMap, setSelectedCustomersMap] = useState({});

  const [openWarningPopulate, setOpenWarningPopulate] = useState(false);
  const [pendingDataFinal, setPendingDataFinal] = useState(null);

  useEffect(() => {
    dispatch(getListSor());
    dispatch(getListCustomerSegment());
    dispatch(getListSchedulerType());
    dispatch(getListCostCenter());
    dispatch(getListBillingCycle());
    dispatch(getListComponentPrabilling());
    dispatch(getUserDetailCalculation());
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const tempBody = {
      sor: data_user_calculation.sorId || null,
      costCenter:
        data_user_calculation.ccId && data_user_calculation.ccId !== null
          ? typeof data_user_calculation.ccId === "number"
            ? [data_user_calculation.ccId]
            : data_user_calculation.ccId
          : [],
    };
    setDefaultData(tempBody);
    form.setFieldsValue(tempBody);
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        sorId: data_user_calculation.sorId || null,
        costCenterId: data_user_calculation.ccId || null,
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    if (tempBody.costCenter) {
      const body = {
        ccIds: (tempBody.costCenter || []).map((data) => {
          return {
            ccId: data,
          };
        }),
      };
      dispatch(getListMeterReadingCode(body));
    }
  }, [data_user_calculation, dispatch, form]);

  useEffect(() => {
    if (
      dataSpecificCustomer?.sorId &&
      dataSpecificCustomer?.search &&
      dataSpecificCustomer.search.length >= 3
    ) {
      dispatch(getListSpecificCustomer(dataSpecificCustomer));
    }
  }, [
    dispatch,
    dataSpecificCustomer.sorId,
    dataSpecificCustomer.costCenterId,
    dataSpecificCustomer.meterReadingCodeId,
    dataSpecificCustomer.accountSegmentId,
    dataSpecificCustomer.accountGroupTypeId,
    dataSpecificCustomer.search,
    dataSpecificCustomer.limit,
    dataSpecificCustomer.billingPeriod,
  ]);

  useEffect(() => {
    if (searchCustomerValue.length >= 3 && list_specific_customer) {
      setFilteredCustomerList(list_specific_customer);
    } else {
      setFilteredCustomerList([]);
    }
  }, [list_specific_customer, searchCustomerValue]);

  useEffect(() => {
    let dataMrc = list_meter_reading_code?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      [],
    );
    setMergedArrayMrc(dataMrc);
  }, [dispatch, list_meter_reading_code]);

  const handleSearchCustomer = useCallback((value) => {
    const trimmedValue = value.slice(0, MAX_SEARCH_LENGTH);

    setSearchCustomerValue(trimmedValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (trimmedValue && trimmedValue.length >= 3) {
        setDataSpecificCustomer((prevState) => ({
          ...prevState,
          search: trimmedValue,
          limit: DEFAULT_SEARCH_LIMIT,
        }));
      } else {
        setDataSpecificCustomer((prevState) => ({
          ...prevState,
          search: "",
          limit: DEFAULT_SEARCH_LIMIT,
        }));
        setFilteredCustomerList([]);
      }
    }, 500);
  }, []);

  const handleSelectCustomer = useCallback(
    (value, option) => {
      const customerData = filteredCustomerList.find(
        (item) => item.accountNumber === value,
      );

      if (customerData) {
        setSelectedCustomersMap((prev) => ({
          ...prev,
          [value]: {
            accountName: customerData.accountName,
            accountNumber: customerData.accountNumber,
          },
        }));
      }

      setSearchCustomerValue("");
      setFilteredCustomerList([]);
      setDataSpecificCustomer((prevState) => ({
        ...prevState,
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      }));
    },
    [filteredCustomerList],
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    let tempData = [
      "billing_cycle",
      "billing_period",
      "calculation_type",
      "serviceType",
      "sor",
      "costCenter",
      "meterReading",
      "accountSegment",
      "accountGroupType",
      "specificCustomer",
      "specificComponentPrabilling",
      "type",
      "scheduleDateTime",
      "remark",
    ];

    if (defaultData?.costCenter?.length > 0) {
      tempData = tempData.filter((item) => item !== "costCenter");
    }
    if (defaultData?.sor) {
      tempData = tempData.filter((item) => item !== "sor");
    }

    form.resetFields(tempData);

    setSelectedScheduleType(null);
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    setBillingCycle(null);

    setDataSpecificCustomer({
      sorId: defaultData?.sor || null,
      costCenterId: defaultData?.costCenter || [],
      meterReadingCodeId: [],
      accountSegmentId: [],
      accountGroupTypeId: [],
      search: "",
      limit: DEFAULT_SEARCH_LIMIT,
      billingPeriod: null,
    });
    setSelectedCustomersMap({});
  };

  const onFinish = async (formValue) => {
    const tempDataFinal = {
      billingCycle: formValue?.billing_cycle,
      billingPeriod: formValue?.billing_period,
      serviceType: formValue?.serviceType,
      sor: formValue?.sor,
      scheduleType: formValue?.type,
      scheduleDateTime: formValue?.scheduleDateTime
        ? moment(formValue.scheduleDateTime).format("YYYY-MM-DD HH:mm:ss")
        : null,
      calculationType: formValue?.calculation_type,
      remark: formValue?.remark,
      specificComponentPrabilling: formValue?.specificComponentPrabilling || [],
      rRbiCalculationCostCenter: (formValue?.costCenter || []).map((id) => {
        return {
          id: null,
          calCode: null,
          costCenter: id,
        };
      }),
      rRbiCalculationMeterReadingCode: (formValue?.meterReading || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            mreadingCode: id,
          };
        },
      ),
      rRbiCalculationAccountSegment: (formValue?.accountSegment || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            accSegment: id,
          };
        },
      ),
      rRbiCalculationAccountGroupType: (formValue?.accountGroupType || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            accGroupType: id,
          };
        },
      ),
      rRbiCalculationSpecificCustomer: (formValue?.specificCustomer || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            custNumb: id,
          };
        },
      ),
    };

    const hasSpecificCustomer = (formValue?.specificCustomer || []).length > 0;

    if (!hasSpecificCustomer) {
      setPendingDataFinal(tempDataFinal);
      setOpenWarningPopulate(true);
    } else {
      setDataFinal(tempDataFinal);
      setOpenModal(true);
    }
  };

  const handleConfirmPopulateAll = () => {
    setOpenWarningPopulate(false);
    setDataFinal(pendingDataFinal);
    setOpenModal(true);
  };

  const handleCancelPopulateAll = () => {
    setOpenWarningPopulate(false);
    setPendingDataFinal(null);
  };

  const handleSave = async () => {
    const selectedBillingCycle = (list_billing_cycle || []).find(
      (item) => item.id === dataFinal?.billingCycle,
    );

    const selectedBillingPeriod = list_billing_period?.data?.find(
      (item) => item.id === dataFinal?.billingPeriod,
    );

    const selectedSor = list_sor?.data?.find(
      (item) => item.id === dataFinal?.sor,
    );

    const selectedSchedulerType = list_scheduler_type?.find(
      (item) => item.id === dataFinal?.scheduleType,
    );

    if (!user_profile) {
      setBodyError({
        message: "User profile is not loaded. Please refresh the page.",
      });
      setModalError(true);
      return;
    }

    const finalSpecificAccounts = (
      dataFinal?.rRbiCalculationSpecificCustomer || []
    )
      .filter((item) => item.custNumb)
      .map((item) => item.custNumb);

    const tempBody = {
      billingCycle:
        selectedBillingCycle?.name || selectedBillingCycle?.code || "",
      billPeriod:
        selectedBillingPeriod?.name || selectedBillingPeriod?.code || "",
      sor: selectedSor?.name || "",
      costCenter: (dataFinal?.rRbiCalculationCostCenter || []).map(
        (item) => item.costCenter,
      ),
      meterReadingCode: (dataFinal?.rRbiCalculationMeterReadingCode || []).map(
        (item) => item.mreadingCode,
      ),
      accountSegment: (dataFinal?.rRbiCalculationAccountSegment || []).map(
        (item) => item.accSegment,
      ),
      accountGroupType: (dataFinal?.rRbiCalculationAccountGroupType || []).map(
        (item) => item.accGroupType,
      ),

      billingCycleId: dataFinal?.billingCycle,
      billPeriodId: dataFinal?.billingPeriod,

      scheduleType: selectedSchedulerType?.name || "",
      specificAccount: finalSpecificAccounts,
      schedulerTime: dataFinal?.scheduleDateTime || "",

      serviceTypeId: dataFinal?.serviceType,
      sorId: dataFinal?.sor,
      calculationTypeId: dataFinal?.calculationType,
      remark: dataFinal?.remark,
      runDtl: dataFinal?.specificComponentPrabilling || [],
      createdBy: user_profile.username || "",
    };

    dispatch(createPrabilling({ body: tempBody }))
      .unwrap()
      .then((data) => {
        if (data) {
          setModalSuccess(true);
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          error?.toString() ||
          "An error occurred. Please try again.";
        setBodyError({ message });
        setModalError(true);
      });
  };

  const handleBackPage = () => {
    const currentValues = form.getFieldsValue();
    const hasFilledValue = Object.values(currentValues).some(
      (v) => v !== undefined && v !== null && v !== ""
    );
    if (hasFilledValue) {
      setOpenBack(true);
    } else {
      navigate(-1);
    }
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.PRABILLING_VIEW,
      breadcrumbName: "Prabilling",
    },
    {
      path: "",
      breadcrumbName: "Create Prabilling",
    },
  ];

  const handleChangeBillingCycle = (e) => {
    setBillingCycle(e);
    dispatch(getListBillingPeriod(e));
  };

  const handleChangeBillingPeriod = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        billingPeriod: e,
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    form.resetFields(["specificCustomer"]);
  };

  const handleChangeSOR = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        sorId: e,
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    form.resetFields(["specificCustomer"]);
  };

  const handleChangeCostCenter = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        costCenterId: e || [],
        meterReadingCodeId: [],
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);

    const body = {
      ccIds: (e || []).map((data) => {
        return {
          ccId: data,
        };
      }),
    };
    dispatch(getListMeterReadingCode(body));
    form.resetFields(["meterReading", "specificCustomer"]);
  };

  const handleMeterReadingRoute = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        meterReadingCodeId: e || [],
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    form.resetFields(["specificCustomer"]);
  };

  const handleAccountGroup = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        accountGroupTypeId: e || [],
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    form.resetFields(["specificCustomer"]);
  };

  const handleAccountSegment = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        accountSegmentId: e || [],
        accountGroupTypeId: [],
        search: "",
        limit: DEFAULT_SEARCH_LIMIT,
      };
    });
    setSearchCustomerValue("");
    setFilteredCustomerList([]);

    if (e && e.length > 0) {
      dispatch(getListAccountGroup(e));
    }

    form.resetFields(["accountGroupType", "specificCustomer"]);
  };

  const handleScheduleTypeChange = (value) => {
    setSelectedScheduleType(value);
    const selectedType = list_scheduler_type?.find((item) => item.id === value);
    if (selectedType?.name?.toLowerCase() !== "scheduler") {
      form.setFieldValue("scheduleDateTime", null);
    }
  };

  const handleCreateNew = () => {
    let tempData = [
      "costCenter",
      "meterReading",
      "accountSegment",
      "accountGroupType",
      "specificCustomer",
      "specificComponentPrabilling",
      "type",
      "scheduleDateTime",
      "remark",
    ];
    if (defaultData?.costCenter) {
      tempData = tempData.filter((item) => item !== "costCenter");
    }
    form.resetFields(tempData);
    setSelectedScheduleType(null);
    setSearchCustomerValue("");
    setFilteredCustomerList([]);
    setModalSuccess(false);
    setOpenModal(false);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  const sharedTagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tooltip title={label} placement="top">
        <span
          className="ant-select-selection-item"
          style={{ display: "inline-flex", alignItems: "center", maxWidth: 200 }}
        >
          <span
            className="ant-select-selection-item-content"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 170,
            }}
          >
            {label}
          </span>
          {closable && (
            <span
              className="ant-select-selection-item-remove"
              onClick={onClose}
              style={{ cursor: "pointer", flexShrink: 0 }}
            >
              ×
            </span>
          )}
        </span>
      </Tooltip>
    );
  };

  const sharedMaxTagPlaceholder = (omittedValues) => {
    const tooltipContent = (
      <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
        {omittedValues.map((val) => (
          <div
            key={val.value}
            style={{ padding: "2px 0", fontSize: 12, whiteSpace: "nowrap" }}
          >
            {val.label}
          </div>
        ))}
      </div>
    );
    return (
      <Tooltip title={tooltipContent} overlayStyle={{ maxWidth: 420 }} placement="topLeft">
        <span
          style={{
            cursor: "pointer",
            color: "#ffffff",
            fontWeight: 500,
            fontSize: 12,
          }}
        >
          +{omittedValues.length} more
        </span>
      </Tooltip>
    );
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary">
                  Billing Cycle Information
                </p>
              </div>
            }
          >
            <div className={"w-full grid grid-cols-2 gap-2"}>
              <Form.Item
                label={"Billing Cycle"}
                name={"billing_cycle"}
                rules={formMessageRequired("Billing Cycle")}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={handleChangeBillingCycle}
                  options={(list_billing_cycle || []).map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item
                label={"Billing Period"}
                name={"billing_period"}
                rules={formMessageRequired("Billing Period")}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  disabled={!billingCycle}
                  onChange={handleChangeBillingPeriod}
                  options={
                    billingCycle
                      ? list_billing_period?.data?.map((item) => {
                          return {
                            label: item?.name,
                            value: item?.id,
                          };
                        })
                      : []
                  }
                />
              </Form.Item>
            </div>
          </CardContainer>
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary">
                  INPUT PARAMETER INFORMATION
                </p>
              </div>
            }
          >
            <div className={"w-full grid grid-cols-5 gap-2"}>
              <Form.Item
                label={"SOR"}
                name={"sor"}
                rules={formMessageRequired("SOR")}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={handleChangeSOR}
                  options={list_sor?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                  disabled={defaultData?.sor}
                />
              </Form.Item>

              <Form.Item
                label={"Cost Center"}
                name={"costCenter"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleChangeCostCenter}
                  disabled={defaultData?.costCenter?.length !== 0}
                  tagRender={sharedTagRender}
                  maxTagPlaceholder={sharedMaxTagPlaceholder}
                  options={list_cost_center?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item
                label={"Meter Reading Code"}
                name={"meterReading"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleMeterReadingRoute}
                  disabled={
                    !dataSpecificCustomer?.costCenterId ||
                    dataSpecificCustomer?.costCenterId?.length === 0
                  }
                  tagRender={sharedTagRender}
                  maxTagPlaceholder={sharedMaxTagPlaceholder}
                  options={mergedArrayMrc?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item
                label={"Account Segment"}
                name={"accountSegment"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleAccountSegment}
                  tagRender={sharedTagRender}
                  maxTagPlaceholder={sharedMaxTagPlaceholder}
                  options={(list_customer_segment?.Data || []).map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item
                label={"Account Group Type"}
                name={"accountGroupType"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleAccountGroup}
                  disabled={
                    !dataSpecificCustomer?.accountSegmentId ||
                    dataSpecificCustomer?.accountSegmentId?.length === 0
                  }
                  tagRender={sharedTagRender}
                  maxTagPlaceholder={sharedMaxTagPlaceholder}
                  options={(list_account_group || [])?.map((item) => {
                    return {
                      label: item?.glbValue || item?.name,
                      value: item?.glbTypeValId,
                    };
                  })}
                />
              </Form.Item>

              <div>
                <Form.Item
                  label={"Specific Customer Account"}
                  name={"specificCustomer"}
                  style={{ marginBottom: 0 }}
                  help={
                    specific_customer_message && (
                      <span className="text-blue-600 text-xs">
                        {specific_customer_message}
                      </span>
                    )
                  }
                >
                  <Select
                    mode={"multiple"}
                    disabled={!dataSpecificCustomer?.sorId}
                    loading={loading_specific_customer}
                    showSearch
                    filterOption={false}
                    onSearch={handleSearchCustomer}
                    searchValue={searchCustomerValue}
                    maxLength={MAX_SEARCH_LENGTH}
                    onSelect={handleSelectCustomer}
                    onDeselect={(value) => {
                      setSearchCustomerValue("");
                      setFilteredCustomerList([]);
                      setSelectedCustomersMap((prev) => {
                        const newMap = { ...prev };
                        delete newMap[value];
                        return newMap;
                      });
                    }}
                    onClear={() => {
                      setSearchCustomerValue("");
                      setFilteredCustomerList([]);
                      setSelectedCustomersMap({});
                      setDataSpecificCustomer((prevState) => ({
                        ...prevState,
                        search: "",
                        limit: DEFAULT_SEARCH_LIMIT,
                      }));
                    }}
                    allowClear
                    maxTagCount="responsive"
                    maxTagPlaceholder={(omittedValues) => {
                      const tooltipContent = (
                        <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
                          {omittedValues.map((val) => {
                            const customerData = selectedCustomersMap[val.value];
                            const displayText = customerData
                              ? `${customerData.accountName} - ${customerData.accountNumber}`
                              : val.value;
                            return (
                              <div
                                key={val.value}
                                style={{
                                  padding: "2px 0",
                                  fontSize: 12,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {displayText}
                              </div>
                            );
                          })}
                        </div>
                      );
                      return (
                        <Tooltip
                          title={tooltipContent}
                          overlayStyle={{ maxWidth: 420 }}
                          placement="topLeft"
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#ffffff",
                              fontWeight: 500,
                              fontSize: 12,
                            }}
                          >
                            +{omittedValues.length} more
                          </span>
                        </Tooltip>
                      );
                    }}
                    placeholder={`Type at least 3 characters to search (max ${MAX_SEARCH_LENGTH} chars)...`}
                    tagRender={(props) => {
                      const { value, closable, onClose } = props;
                      const customerData = selectedCustomersMap[value];

                      const displayText = customerData
                        ? `${customerData.accountName} - ${customerData.accountNumber}`
                        : value;

                      return (
                        <Tooltip title={displayText} placement="top">
                          <span
                            className="ant-select-selection-item"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              maxWidth: 200,
                            }}
                          >
                            <span
                              className="ant-select-selection-item-content"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 170,
                              }}
                            >
                              {displayText}
                            </span>
                            {closable && (
                              <span
                                className="ant-select-selection-item-remove"
                                onClick={onClose}
                                style={{ cursor: "pointer", flexShrink: 0 }}
                              >
                                ×
                              </span>
                            )}
                          </span>
                        </Tooltip>
                      );
                    }}
                    notFoundContent={
                      loading_specific_customer ? (
                        <div className="flex justify-center py-4">
                          <Spin size="small" />
                        </div>
                      ) : searchCustomerValue.length > 0 &&
                        searchCustomerValue.length < 3 ? (
                        <div className="text-center py-4 text-gray-500">
                          Please enter at least 3 characters
                        </div>
                      ) : (
                        "No data"
                      )
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        {specific_customer_message && (
                          <div className="px-2 py-2 border-t text-xs text-gray-500">
                            {specific_customer_message}
                          </div>
                        )}
                        {searchCustomerValue.length > 0 && (
                          <div className="px-2 py-1 border-t text-xs text-right">
                            <span
                              className={
                                searchCustomerValue.length >= MAX_SEARCH_LENGTH
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }
                            >
                              {searchCustomerValue.length}/{MAX_SEARCH_LENGTH}{" "}
                              characters
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  >
                    {(filteredCustomerList || []).map((item) => (
                      <Select.Option
                        key={item.accountNumber}
                        value={item.accountNumber}
                      >
                        {item.accountName} - {item.accountNumber}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label={"Specific Component Prabilling"}
                name={"specificComponentPrabilling"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  mode={"multiple"}
                  tagRender={sharedTagRender}
                  maxTagPlaceholder={sharedMaxTagPlaceholder}
                  options={(list_component_prabilling || []).map((item) => {
                    return {
                      label: item?.componentName,
                      value: item?.componenetCode,
                    };
                  })}
                  placeholder={"Choose Multiple..."}
                />
              </Form.Item>
            </div>
          </CardContainer>
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary">SCHEDULER INFORMATION</p>
              </div>
            }
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex w-1/2 gap-3">
                <Form.Item
                  label={"Type"}
                  name={"type"}
                  rules={formMessageRequired("Type")}
                  style={{ marginBottom: 0 }}
                >
                  <SelectComponent
                    onChange={handleScheduleTypeChange}
                    placeholder={"Choose Type..."}
                    options={(list_scheduler_type || []).map((item) => {
                      return {
                        label: item?.name,
                        value: item?.id,
                      };
                    })}
                  />
                </Form.Item>

                {selectedScheduleType &&
                  list_scheduler_type
                    ?.find((item) => item.id === selectedScheduleType)
                    ?.name?.toLowerCase() === "scheduler" && (
                    <Form.Item
                      label={"Schedule"}
                      name={"scheduleDateTime"}
                      style={{ marginBottom: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Please select schedule date and time",
                        },
                      ]}
                    >
                      <DatePicker
                        showTime
                        format="DD MMM YYYY HH:mm:ss"
                        placeholder="Select date and time"
                        className="w-full"
                        disabledDate={(current) => {
                          return current && current < moment().startOf("day");
                        }}
                      />
                    </Form.Item>
                  )}
              </div>
              <div className="w-full">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent
                    type="textarea"
                    value={remark}
                    style={{ marginBottom: 4 }}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </CardContainer>

          <FormFooter
            onCancel={handleBackPage}
            onClear={handleReset}
            onSaveDraft={() => form.submit()}
            type={type}
            useNavigation={false}
            saveDraftLabel="Save"
            saveDraftStyle={{
              backgroundColor: "#0075BF",
              borderColor: "#0075BF",
              color: "#fff",
            }}
          />
        </Form>
      </Spin>

      <ModalConfirm
        isOpen={openBack}
        handleCancel={() => setOpenBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px]">Are you sure you want to back?</p>
        </div>
      </ModalConfirm>

      <ModalConfirm
        isOpen={openWarningPopulate}
        handleCancel={handleCancelPopulateAll}
        handleOk={handleConfirmPopulateAll}
        width={700}
      >
        <div className="flex flex-col justify-center mt-5 gap-[20px] px-4">
          <div className="flex items-start gap-[20px]">
            <WarningOutlined
              style={{
                fontSize: "32px",
                color: "#FF9800",
                marginTop: "4px",
              }}
            />
            <div className="flex-1">
              <p className="text-[18px] text-gray-800">
                No Specific Customer Selected
              </p>
              <p className="text-[14px] text-gray-600 mt-3">
                You have not selected any specific customer account.
              </p>
              <div className="mt-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-[14px] text-orange-800">
                  The system will process{" "}
                  <span className="text-[16px]">ALL customers</span> that match
                  your filter criteria
                </p>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 max-h-[300px] overflow-y-auto">
                <p className="text-[13px] text-gray-700 mb-3">
                  Current Filter Criteria:
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 pb-2 border-b border-gray-200">
                    <span className="text-[13px] text-gray-700 min-w-[140px]">
                      SOR:
                    </span>
                    <span className="text-[13px] text-gray-600">
                      {list_sor?.data?.find(
                        (item) => item.id === pendingDataFinal?.sor,
                      )?.name || "All"}
                    </span>
                  </div>

                  {pendingDataFinal?.rRbiCalculationCostCenter?.length > 0 && (
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-200">
                      <span className="text-[13px] text-gray-700 min-w-[140px]">
                        Cost Center:
                      </span>
                      <div className="flex-1">
                        <span className="text-[12px] text-blue-600 font-medium">
                          {pendingDataFinal.rRbiCalculationCostCenter.length}{" "}
                          selected
                        </span>
                      </div>
                    </div>
                  )}

                  {pendingDataFinal?.rRbiCalculationMeterReadingCode?.length >
                    0 && (
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-200">
                      <span className="text-[13px] text-gray-700 min-w-[140px]">
                        Meter Reading Code:
                      </span>
                      <div className="flex-1">
                        <span className="text-[12px] text-blue-600 font-medium">
                          {
                            pendingDataFinal.rRbiCalculationMeterReadingCode
                              .length
                          }{" "}
                          selected
                        </span>
                      </div>
                    </div>
                  )}

                  {pendingDataFinal?.rRbiCalculationAccountSegment?.length >
                    0 && (
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-200">
                      <span className="text-[13px] text-gray-700 min-w-[140px]">
                        Account Segment:
                      </span>
                      <div className="flex-1">
                        <span className="text-[12px] text-blue-600 font-medium">
                          {
                            pendingDataFinal.rRbiCalculationAccountSegment
                              .length
                          }{" "}
                          selected
                        </span>
                      </div>
                    </div>
                  )}

                  {pendingDataFinal?.rRbiCalculationAccountGroupType?.length >
                    0 && (
                    <div className="flex items-start gap-2 pb-2">
                      <span className="text-[13px] text-gray-700 min-w-[140px]">
                        Account Group Type:
                      </span>
                      <div className="flex-1">
                        <span className="text-[12px] text-blue-600 font-medium">
                          {
                            pendingDataFinal.rRbiCalculationAccountGroupType
                              .length
                          }{" "}
                          selected
                        </span>
                      </div>
                    </div>
                  )}

                  {!pendingDataFinal?.rRbiCalculationCostCenter?.length &&
                    !pendingDataFinal?.rRbiCalculationMeterReadingCode
                      ?.length &&
                    !pendingDataFinal?.rRbiCalculationAccountSegment?.length &&
                    !pendingDataFinal?.rRbiCalculationAccountGroupType
                      ?.length && (
                      <div className="text-[13px] text-gray-500 italic">
                        No additional filters applied - will process all
                        customers for selected SOR
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-[13px] text-blue-800">
                  <strong>Note:</strong> The backend will automatically populate
                  all customers matching these criteria for processing.
                </p>
              </div>

              <p className="text-[14px] text-gray-700 font-medium mt-4">
                Do you want to continue?
              </p>
            </div>
          </div>
        </div>
      </ModalConfirm>

      <ModalCustom
        isOpen={openModal}
        handleCancel={() => setOpenModal(false)}
        header={"CONFIRMATION"}
        width={900}
        type={"confirmation"}
        loading={loadingCreate}
        footer={
          <div className={"flex w-full justify-end gap-2 mb-5"}>
            <ButtonComponent
              onClick={() => setOpenModal(false)}
              disabled={loadingCreate}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              onClick={handleSave}
              isLoading={loadingCreate}
              disabled={loadingCreate}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <FormConfirmation data={dataFinal} />
      </ModalCustom>

      <Modal
        open={modalSuccess}
        onOk={() => navigate(-1)}
        onCancel={() => navigate(-1)}
        footer={
          <div className="flex justify-end gap-4">
            <ButtonComponent
              type={"submit"}
              onClick={handleCreateNew}
              border={false}
            >
              Create New
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              border={false}
            >
              OK
            </ButtonComponent>
          </div>
        }
        className={"modal-custom"}
        centered={true}
        width={500}
        maskClosable={false}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success_default"]}
            <p className="text-[18px]">{"Successful"}</p>
          </div>
          <p className="pl-[70px]">{"Your data has been created."}</p>
        </div>
      </Modal>

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px]">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not created. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default PrabillingForm;