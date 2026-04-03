import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import {
  clearBodyMessage,
  showModalError,
  validateError,
} from "../../../../../redux/slices/general_slice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import CreateReceiptForm from "./CreateReceiptForm";
import {
  createReceipt,
  updateReceipt,
  getReceiptForUpdate,
  getAllApprovalListReceipt,
  getBankDDL,
  getConvertedCurrency,
  getCurrencyDDL,
  getCusNumberDDL,
  getListApprovalByIdReceipt,
  getListCategoryReceipt,
  getReceiptChanelDDL,
  resetConvertedAmount,
  resetDataAccountNumber,
  getAccountTypeDDL,
  getAllAccountNumberDDL,
  getRateTypeDDL,
  getPayTypeDDL,
  getPayGetwayDDL,
  getCollectionAgentDDL,
  getPayDeliverDDL,
  getPayMethodDDL,
} from "../../../../../redux/slices/receipt_collection/receipt";
import ModalConfirmManualReceipt from "./ModalConfirmManualReceipt";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { countBadgeFieldsErrorMandatory, dateFormatting, hasValue } from "../../../../../utils";
import moment from "moment";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";

const ListRececiptForm = ({ type }) => {
  const {
    colAgentDDL,
    cusNumberDDL,
    payGatewayDDL,
    payTypeDDL,
    payDeliveryDDL,
    currencyDDL,
    bankDDL,
    rateTypeDDL,
    payMethodDDL,
    dataReceiptChannelDDL,
    dataAccountNumber,
    dataAccNumber,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    data_converted_currency,
    accountTypeDDL,
    allPosRegistrationNumbersDDL,
    data_detail,
  } = useSelector((state) => state.receipt);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const id = location?.state?.id;
  const [cusNumb, setCusNumb] = useState();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [storedData, setStoredData] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalAllocationAmount, setTotalAllocationAmount] = useState(0);
  const [amount, setAmount] = useState(null);
  const [accNumb, setAccNumb] = useState();
  const [bodyData, setBodyData] = useState();
  const [flag, setFlag] = useState(0);
  const [modalError, setModalError] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [requestBodyConvertedRate, setRequestBodyConvertedRate] = useState({});
  const [allValues, setAllValues] = useState(null);

  // Stepper State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isLoading = loading || loadingForm;

  // Step Configuration
  const steps = [
    { title: 'RECEIPT' },
    { title: 'APPROVAL' },
    { title: 'ATTACHMENT' }
  ];

  // Tab Data for Validation Logic
  const [tabData, setTabData] = useState([
    {
      value: "Receipt",
      paramValue: [
        "miscellaneous",
        "accNumber",
        "cusNumber",
        "cusName",
        "accountName",
        "segment",
        "accountGroupType",
        "accountType",
        "sor",
        "costCenterCode",
        "costCenterName",
        "receiptCode",
        "receiptChannel",
        "paymentType",
        "paymentGateway",
        "collectingAgent",
        "deliveryChannel",
        "method",
        "bank",
        "receiptDate",
        "currency",
        "amount",
        "rateType",
        "rateDate",
        "rateAmount",
        "convertedCurrency",
        "eqAmount",
        "description",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  //useEffect DDL form
  useEffect(() => {
    dispatch(resetDataAccountNumber());
    dispatch(getAllApprovalListReceipt());
    dispatch(getRateTypeDDL());
    dispatch(getCusNumberDDL());
    dispatch(getCurrencyDDL());
    dispatch(getReceiptChanelDDL());
    dispatch(getAccountTypeDDL());
    dispatch(getAllAccountNumberDDL());
    // Dispatched directly to populate dropdown defaults
    dispatch(getPayTypeDDL());
    dispatch(getPayGetwayDDL());
    dispatch(getCollectionAgentDDL());
    dispatch(getPayDeliverDDL());
    dispatch(getPayMethodDDL());
    const method = form.getFieldValue("method");
    if (method) {
        dispatch(getBankDDL(method));
    }

  }, [form, dispatch, setAccNumb]);

  // Fetch detail for update
  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getReceiptForUpdate(id));
    }
  }, [dispatch, type, id]);

  // APPROVAL HIERARCHY
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalByIdReceipt({ id: selectedHierarchy }));
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

  // Populate form for update
  useEffect(() => {
    if (type === "update" && data_detail && data_detail.id) {
      const receipt = data_detail;
      
      // Map basic fields
      form.setFieldsValue({
        miscellaneous: receipt.isMisc ? "Yes" : "No",
        custType: receipt.registrationNumber ? "Prospective" : "Customer",
        registrationNumber: receipt.registrationNumber,
        accNumber: receipt.accountId,
        cusNumber: receipt.customerId,
        cusName: receipt.customerName,
        accountName: receipt.accountName,
        area: receipt.area,
        segment: receipt.segment,
        accountType: receipt.accountType,
        accountGroupType: receipt.accountGroupType,
        classificationType: receipt.classificationType,
        meterReadingCode: receipt.meterReadingCode,
        sor: receipt.sor,
        costCenterCode: receipt.costCenterCode,
        
        method: receipt.paymentMethodId,
        receiptCode: receipt.receiptCode,
        receiptDate: receipt.receiptDate ? moment(receipt.receiptDate, "DD MMM YYYY HH:mm:ss") : null,
        receiptChannel: receipt.receiptChannelId,
        paymentType: receipt.paymentTypeId,
        paymentGateway: receipt.paymentGatewayId,
        collectingAgent: receipt.collectingAgentId,
        deliveryChannel: receipt.deliveryChannelId,
        bank: receipt.bankId,
        remark: receipt.remark || receipt.description,
        
        currency: receipt.currencyId,
        amount: receipt.amount?.toLocaleString("id-ID") || "0",
        convertedCurrency: receipt.convertedCurrency ? currencyDDL?.data?.find(c => c.name === receipt.convertedCurrency)?.id : null,
        rateType: receipt.rateTypeId,
        rateDate: receipt.rateDate ? moment(receipt.rateDate, "DD MMM YYYY") : null,
        rateAmount: receipt.rateAmount?.toLocaleString("id-ID", { minimumFractionDigits: 2 }) || "0",
        eqAmount: receipt.equivalentAmount?.toLocaleString("id-ID", { minimumFractionDigits: 2 }) || "0",
        description: receipt.description,
      });

      // Set internal states
      setAmount(receipt.amount);
      setAccNumb({ id: receipt.accountId, name: receipt.accountName });
      setCusNumb({ id: receipt.customerId, name: receipt.customerName });
      setSelectedHierarchy(receipt.appHierId);
      
      if (receipt.allocationDtoList) {
        setDataTable(receipt.allocationDtoList.map(item => ({
          ...item,
          id: item.id,
          allocationAmount: item.allocationAmount,
        })));
        const total = receipt.allocationDtoList.reduce((sum, item) => sum + (item.allocationAmount || 0), 0);
        setTotalAllocationAmount(total);
      }
    }
  }, [type, data_detail, form, currencyDDL, setAmount, setAccNumb, setCusNumb, setSelectedHierarchy, setDataTable, setTotalAllocationAmount]);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  useEffect(() => {
    if (accNumb !== "" && type !== "update") {
      // set default value
      if (rateTypeDDL?.data?.length > 0) {
        const rateType = rateTypeDDL?.data?.filter(
          (item) => item?.name === "M"
        )[0]?.id;
        form.setFieldsValue({
          rateType: rateType,
        });
        setRequestBodyConvertedRate((prevState) => ({
          ...prevState,
          rateType: rateType,
        }));
      }

      if (hasValue(accNumb)) {
        form.setFieldsValue({
          cusName: dataAccountNumber?.data?.customerName,
          area: dataAccountNumber?.data?.area,
          segment: dataAccountNumber?.data?.segment,
          accountType: dataAccountNumber?.data?.accountType,
          accountGroupType: dataAccountNumber?.data?.accountGroupType,
          classificationType: dataAccountNumber?.data?.classificationType,
          meterReadingCode: dataAccountNumber?.data?.meterReadingCode,
          accountName: dataAccountNumber?.data?.accountName,
          sor: dataAccountNumber?.data?.sor,
          cusNumber: dataAccountNumber?.data?.customerNumber,
          costCenterCode: dataAccountNumber?.data?.area,
          costCenterName: dataAccountNumber?.data?.area,
        });
      }
    }
  }, [accNumb, dataAccountNumber, form, rateTypeDDL?.data, type]);

  // use effect to get converted rate
  const handleChangeRequestConverted = useCallback(
    (changedValues, allValues) => {
      setAllValues(allValues);
    },
    []
  );

  // use effect if requestBodyConvertedRate changed
  useEffect(() => {
    const { fromCurrency, toCurrency, rateType, rateDate } =
      requestBodyConvertedRate;
    if (fromCurrency && toCurrency && rateType && rateDate) {
      const body = {
        ...requestBodyConvertedRate,
        rateType: rateTypeDDL?.data?.filter((item) => item?.id === rateType)[0]
          ?.name,
      };
      dispatch(getConvertedCurrency(body));
    }
  }, [dispatch, requestBodyConvertedRate]);

  const roundToOneDecimal = (value) => {
    return Math.round(value * 10) / 10;
  };

  const convertToFloat = (amount) => {
    if (!amount) return 0;
    return parseFloat(amount?.toString()?.replace(/\./g, "").replace(",", "."));
  };

  useEffect(() => {
    if (
      hasValue(data_converted_currency) &&
      Object?.keys(data_converted_currency)?.length !== 0
    ) {
      const convertedAmount = hasValue(formValue?.amount)
        ? formValue?.amount
        : 0;

      const rateAmountValue = data_converted_currency?.convertedRate?.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      );

      if (
        hasValue(formValue?.convertedCurrency) &&
        hasValue(formValue?.currency)
      ) {
        if (formValue?.currency === 243) {
          const eqAmountValue = data_converted_currency?.convertedRate * convertToFloat(convertedAmount);

          form.setFieldsValue({
            rateAmount: rateAmountValue,
            eqAmount: eqAmountValue.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "0"
          });
        } else if (formValue?.currency === 244) {
          const convertValue = convertToFloat(convertedAmount)
          const eqAmountValue = roundToOneDecimal(convertValue / data_converted_currency?.convertedRate)

          form.setFieldsValue({
            rateAmount: rateAmountValue,
            eqAmount: eqAmountValue
          });
        }
      } else {
        form.setFieldsValue({
          rateAmount: rateAmountValue,
          eqAmount: 0,
        });
      }
    }
  }, [data_converted_currency, form, amount, formValue?.amount, formValue?.convertedCurrency, formValue?.currency]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_RECEIPT,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  // Navigation Logic
  const handleNext = () => {
    const fieldsToValidate = tabData[currentStepIndex]?.paramValue;

    if (fieldsToValidate) {
        form
        .validateFields(fieldsToValidate)
        .then(() => {
            if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            }
        })
        .catch((error) => {
            // Validation failed, handle errors if needed
            handleError({ errorFields: error.errorFields });
        });
    } else {
        // No fields to validate for this step (e.g. Attachment)
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    countBadgeFieldsErrorMandatory(setTabData, listDataAttachment, errorFields);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0 ||
      Object.keys(form.getFieldValue()).length === 3
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  // // Fungsi utilitas untuk mengubah string menjadi integer
  const convertAndTrimString = (str) => {
    const cleanedString = str.replace(/[,]/g, "");
    const floatNumber = parseFloat(cleanedString);
    return floatNumber;
  };

  // Helper to parse ID format "1.234,56" -> 1234.56
  const parseMonetaryValue = (value) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    // Remove dots (thousands separator) and replace comma with dot (decimal separator)
    const cleaned = value?.toString()?.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned);
  };

  const handleSaveSubmit = async () => {
    setFlag(1);
    try {
      const values = await form.validateFields();
      
      handleSubmitForm(values);
    } catch (errorInfo) {
      handleError({ errorFields: errorInfo.errorFields });
      
      const errorBody = {
        title: "Validation Failed",
        description: "Please check all required fields in the tabs.",
      };
      dispatch(showModalError(errorBody));
    }
  };

  const handleSubmitForm = (formValue) => {
    // 1. Validasi Allocation Table
    // if (dataTable?.length === 0 && formValue?.custType !== "Prospective") {
    //   const errorBody = {
    //     title: "Alert",
    //     description: `Please input allocation information!`,
    //   };
    //   dispatch(showModalError(errorBody));
    //   return; // Stop eksekusi
    // } 
    
    // 2. Validasi Approval Hierarchy
    if (!selectedHierarchy) {
      const errorBody = {
        title: "Validation Failed",
        description: `Please select Approval Information!`,
      };
      dispatch(showModalError(errorBody));
      // Biar badge merahnya tetep update
      countBadgeFieldsErrorMandatory(setTabData, listDataAttachment);
      return; // Stop eksekusi
    }

    // 3. Validasi Attachment
    if (listDataAttachment?.length === 0) {
      const errorBody = {
        title: "Validation Failed",
        description: `Please upload at least one mandatory attachment!`,
      };
      dispatch(showModalError(errorBody));
      // Biar badge merahnya tetep update
      countBadgeFieldsErrorMandatory(setTabData, listDataAttachment);
      return; // Stop eksekusi
    }

    // Kalau lolos semua validasi di atas:
    countBadgeFieldsErrorMandatory(setTabData, listDataAttachment);
    setModalConfirm(true);
    
    const dataValue = {
      // receiptId: ,
      appHierId: selectedHierarchy,
      areaId: dataAccountNumber?.data?.areaId || data_detail?.areaId,
      customerId: dataAccountNumber?.data?.customerId || data_detail?.customerId,
      accountId: formValue?.accNumber,
      customerName: formValue?.cusName,
      segmentId: dataAccountNumber?.data?.segmentId || data_detail?.segmentId,
      accountType: formValue?.accountType,
      accountName: formValue?.accountName,
      customerNumber: formValue?.cusNumber,
      sor: formValue?.sor,
      area: formValue?.area,
      segment: formValue?.segment,
      receiptDate: moment(formValue?.receiptDate).format(
        dateFormatting.dateTime
      ),
      currencyId: formValue?.currency,
      amount: parseMonetaryValue(formValue?.amount),
      paymentTypeId: formValue?.paymentType,
      paymentMethodId: formValue?.method,
      receiptChannelId: formValue?.receiptChannel,
      bankId: formValue?.bank,
      collectingAgentId: formValue?.collectingAgent,
      deliveryChannelId: formValue?.deliveryChannel,
      rateTypeId: formValue?.rateType,
      rateDate: moment(formValue?.rateDate).format(dateFormatting.date),
      rateAmount: parseMonetaryValue(formValue?.rateAmount),
      convertedCurrency: currencyDDL?.data?.filter(
        (item) => item?.id === formValue?.convertedCurrency
      )[0]?.name,
      equivalentAmount: parseMonetaryValue(formValue?.eqAmount),
      referenceNumber: formValue?.reference,
      paymentGatewayId: formValue?.paymentGateway,
      allocationDtoList: dataTable?.map((item) => ({
        id: item?.id,
        allocationAmount: item?.allocationAmount,
      })),
      description: formValue?.description,
      remark: formValue?.remark,
      receiptCode: formValue?.receiptCode,
      isMisc: formValue?.miscellaneous === "Yes",
      miscellaneous: formValue?.miscellaneous,
      customerType: formValue?.custType,
      registrationNumber: formValue?.registrationNumber,
      accountGroupType: formValue?.accountGroupType,
      classificationType: formValue?.classificationType,
      meterReadingCode: formValue?.meterReadingCode,
      unappliedAmount: parseMonetaryValue(formValue?.unappliedAmount),
      appliedAmount: parseMonetaryValue(formValue?.appliedAmount),
      appliedEqvAmount: parseMonetaryValue(formValue?.appliedEqvAmount),
      unappliedEqvAmount: parseMonetaryValue(formValue?.unappliedEqvAmount),
      unidentifiedAmount: parseMonetaryValue(formValue?.unidentifiedAmount),
      holdAmount: parseMonetaryValue(formValue?.holdAmount),
      refundAmount: parseMonetaryValue(formValue?.refundAmount),
      transferAmount: parseMonetaryValue(formValue?.transferAmount),
    };

    setBodyData(dataValue);
    setTabData([
      {
        value: "Receipt",
        paramValue: [
          "cusNumber",
          "accNumber",
          "cusName",
          "area",
          "segment",
          "receiptChannel",
          "paymentGateway",
          "collectingAgent",
          "deliveryChannel",
          "method",
          "receiptDate",
          "paymentType",
          "bank",
          "currency",
          "amount",
          "rateType",
          "rateDate",
          "rateAmount",
          "convertedCurrency",
          "eqAmount",
        ],
      },
      { value: "Approval", paramValue: ["apphierId"] },
      { value: "Attachment" },
    ]);
  };

  // handle confirm
  const handleProcessModalConfirm = () => {
    const modifiedBody = {
      ...bodyData,
      areaId: dataAccountNumber?.data?.areaId,
      segmentId: dataAccountNumber?.data?.segmentId,
    };
    const actionThunk = type === "update" ? updateReceipt({ id, body: modifiedBody }) : createReceipt(modifiedBody);
    
    dispatch(actionThunk)
      .unwrap()
      .then(async (dataForm) => {
        const billingBucketCode = dataForm?.id;
        setLoadingForm(true);
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            category: element.fileCategoryId,
            refId: billingBucketCode,
          };
          await receiptCollectionHttpService.uploadImage(
            `/v1/dbs/api/receipt/upload-attachment-receipt`,
            body
          );
        }
        setLoadingForm(false);
        setModalConfirm(false);
        handleClear();
      })
      .catch((error) => {
        // Only dispatch UPLOAD_ATTACHMENT error if it explicitly failed during upload
        // (if create/update fails, the thunk already dispatches the correct error)
        if (error?.config?.url?.includes("upload-attachment")) {
          dispatch(
            validateError({
              error: error,
              actions: "UPLOAD_ATTACHMENT",
              back: false,
            })
          );
        }
      });
  };

  // handle clear form
  const handleClear = () => {
    setTotalAllocationAmount(0);
    form.resetFields();
    setAmount(0);
    setDataTable([]);
    dispatch(resetConvertedAmount());
    setRequestBodyConvertedRate({});
    setListDataAttachment([]);
    setAppHierDataDetail([]);
    // Reset Stepper
    setCurrentStepIndex(0);
    setTabData(
      tabData?.map((item) => {
        const { errorBadge, ...keys } = item;
        return keys;
      })
    );
  };

  // handle retry
  const handleRetry = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // Helper untuk Header CardContainer
  const renderHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary">
        {title.toUpperCase()}
      </p>
    </div>
  );

  return (
    <>
      <BreadCrumb routes={routes} />
      
      {/* Step Indicator with FormStepper */}
      <div className="mb-3">
        <FormStepper
          steps={steps}
          current={currentStepIndex}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      <Spin spinning={isLoading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
          onValuesChange={handleChangeRequestConverted}
        >
          {/* Section 1: Create Receipt Form */}
          <div className={`${currentStepIndex !== 0 ? "hidden" : ""}`}>
            <CreateReceiptForm
              cusNumb={cusNumb}
              setCusNumb={setCusNumb}
              setStoredData={setStoredData}
              storedData={storedData}
              dataTable={dataTable}
              setDataTable={setDataTable}
              colAgentDDL={colAgentDDL}
              cusNumberDDL={cusNumberDDL}
              payGatewayDDL={payGatewayDDL}
              payTypeDDL={payTypeDDL}
              payDeliveryDDL={payDeliveryDDL}
              currencyDDL={currencyDDL}
              bankDDL={bankDDL}
              rateTypeDDL={rateTypeDDL}
              payMethodDDL={payMethodDDL}
              totalAllocationAmount={totalAllocationAmount}
              setTotalAllocationAmount={setTotalAllocationAmount}
              amount={amount}
              setAmount={setAmount}
              dataReceiptChannelDDL={dataReceiptChannelDDL}
              dataAccountNumber={dataAccountNumber}
              accNumb={accNumb}
              setAccNumb={setAccNumb}
              dataAccNumber={dataAccNumber}
              form={form}
              setRequestBodyConverted={setRequestBodyConvertedRate}
              rateAmountValues={data_converted_currency?.convertedRate}
              formValues={allValues}
              accountTypeDDL={accountTypeDDL}
              allPosRegistrationNumbersDDL={allPosRegistrationNumbersDDL}
            />
          </div>

          {/* Section 2: Approval */}
          <div className={`${currentStepIndex !== 1 ? "hidden" : ""}`}>
            <CardContainer header={renderHeader("Approval Information")}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          {/* Section 3: Attachment */}
          <div className={`${currentStepIndex !== 2 ? "hidden" : ""}`}>
            <CardContainer header={renderHeader("Attachment Information")}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategoryReceipt}
                typeSelector="receipt"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          {/* Standardized Form Footer */}
          <FormFooter
            current={currentStepIndex}
            totalSteps={steps.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onCancel={handleBack}
            onClear={handleClear}
            onSubmit={handleSaveSubmit} 
            type={type}
            disableSubmit={storedData || totalAllocationAmount > amount}
          />
        </Form>
      </Spin>

      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleProcessModalConfirm}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <ModalConfirmManualReceipt
          data={bodyData}
          tabData={tabData}
          listDataAttachment={listDataAttachment}
          listDataAppHierDetail={appHierDataDetail}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          setStoredData={setStoredData}
          storedData={storedData}
          dataTable={dataTable}
          setDataTable={setDataTable}
          totalAllocationAmount={totalAllocationAmount}
          setTotalAllocationAmount={setTotalAllocationAmount}
          amount={amount}
          setAmount={setAmount}
          colAgentDDL={colAgentDDL}
          cusNumberDDL={cusNumberDDL}
          payGatewayDDL={payGatewayDDL}
          payTypeDDL={payTypeDDL}
          payDeliveryDDL={payDeliveryDDL}
          currencyDDL={currencyDDL}
          bankDDL={bankDDL}
          rateTypeDDL={rateTypeDDL}
          payMethodDDL={payMethodDDL}
          dataReceiptChannelDDL={dataReceiptChannelDDL}
          dataAccNumber={dataAccNumber}
          rateString={formValue?.rateAmount}
        />
      </ModalCustom>

      {/* modal error */}
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
          <p className="pl-[70px]">
            {bodyError?.response?.data?.message?.toString ? bodyError?.response?.data?.message?.toString() : ""}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      {/* Modal Back*/}
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
    </>
  );
};

export default ListRececiptForm;