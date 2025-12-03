import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
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
  getAllApprovalListReceipt,
  getBankDDL,
  getCollectionAgentDDL,
  getConvertedCurrency,
  getCurrencyDDL,
  getCusNumberDDL,
  getListApprovalByIdReceipt,
  getListCategoryReceipt,
  getPayDeliverDDL,
  getPayGetwayDDL,
  getPayMethodDDL,
  getPayTypeDDL,
  getRateTypeDDL,
  getReceiptChanelDDL,
  resetConvertedAmount,
  resetDataAccountNumber,
} from "../../../../../redux/slices/receipt_collection/receipt";
import ModalConfirmManualReceipt from "./ModalConfirmManualReceipt";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  countBadgeFieldsErrorMandatory,
  dateFormatting,
  hasValue,
} from "../../../../../utils";
import moment from "moment";

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
  const [isMisc, setIsMisc] = useState(false);

  const isLoading = loading || loadingForm;

  //useEffect DDL form
  useEffect(() => {
    dispatch(resetDataAccountNumber());
    dispatch(getAllApprovalListReceipt());
    dispatch(getRateTypeDDL());
    dispatch(getPayDeliverDDL());
    dispatch(getPayGetwayDDL());
    dispatch(getBankDDL());
    dispatch(getCollectionAgentDDL());
    dispatch(getCusNumberDDL());
    dispatch(getCurrencyDDL());
    dispatch(getPayTypeDDL());
    dispatch(getPayMethodDDL());
    dispatch(getReceiptChanelDDL());
  }, [dispatch]);

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

  // useEffect(() => {
  //   if (id && data_detail && data_detail?.paymentItem) {
  //     setIsMisc(data_detail?.paymentItem?.isBankMethod);
  //   } else {
  //     setIsMisc(false);
  //   }
  // }, [data_detail]);

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
      const accountNumbers =
        dataAccountNumber ||
        []?.map((a) => {
          return {
            idArea: a?.areaId,
            area: a?.area,
            customerId: a?.customerId,
            customerName: a?.customerName,
            segment: a?.segment,
            segmentId: a?.segmentId,
          };
        });

      // set default value
      if (rateTypeDDL?.data?.length > 0) {
        const rateType = rateTypeDDL?.data?.filter(
          (item) => item?.name === "M",
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
          cusName: accountNumbers?.data?.customerName,
          area: accountNumbers?.data?.area,
          segment: accountNumbers?.data?.segment,
        });
      }
    }
  }, [accNumb, dataAccountNumber, form, rateTypeDDL?.data, type]);

  // use effect to get converted rate
  const handleChangeRequestConverted = useCallback(
    (changedValues, allValues) => {
      // checking value
      setAllValues(allValues);
      // const fieldsToCheck = ["rateDate", "rateType", "fromCurrency", "toCurrency"];
      // const allFieldsHaveValues = fieldsToCheck.every(field => formValue[field]);

      // if (allFieldsHaveValues) {
      //   const requestBody = {
      //     rateType: rateTypeDDL?.data?.filter(item => item?.id === formValue?.rateType)[0]?.name,
      //     rateDate: moment(formValue?.rateDate)?.format(dateFormatting?.date),
      //     fromCurrency: formValue?.fromCurrency,
      //     toCurrency: formValue?.toCurrency
      //   };
      //   dispatch(getConvertedCurrency(requestBody));
      // } else {
      //   return formValue;
      // }
    },
    [],
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

  const convertToInteger = (amount) => {
    return parseInt(amount.replace(/\./g, "").replace(",", "."));
  };

  // console.log(formValue, "formValue");

  console.log(
    hasValue(formValue?.convertedCurrency) &&
      hasValue(formValue?.currency) &&
      hasValue(formValue?.rateAmount),
    "validasi",
  );

  useEffect(() => {
    if (
      hasValue(data_converted_currency) &&
      Object?.keys(data_converted_currency)?.length !== 0
    ) {
      const convertedAmount = hasValue(formValue?.amount)
        ? formValue?.amount
        : 0;

      if (
        hasValue(formValue?.convertedCurrency) &&
        hasValue(formValue?.currency) &&
        hasValue(formValue?.rateAmount)
      ) {
        if (formValue?.currency === 243) {
          const eqAmountValue =
            data_converted_currency?.convertedRate *
            convertToInteger(convertedAmount);

          form.setFieldsValue({
            rateAmount: data_converted_currency?.convertedRate?.toLocaleString(
              "en-US",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            ),
            eqAmount:
              eqAmountValue.toLocaleString("id-ID", {
                minimumFractionDigits: 2, // Tambahkan dua angka desimal
                maximumFractionDigits: 2,
              }) || "0",
          });
        } else if (formValue?.currency === 244) {
          const convertValue = convertToInteger(convertedAmount);
          const eqAmountValue = roundToOneDecimal(
            convertValue / data_converted_currency?.convertedRate,
          );

          form.setFieldsValue({
            rateAmount: data_converted_currency?.convertedRate?.toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            ),
            eqAmount: eqAmountValue,
          });
        }
      } else {
        form.setFieldsValue({
          rateAmount: data_converted_currency?.convertedRate?.toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 },
          ),
          eqAmount: 0,
        });
      }
    }
  }, [data_converted_currency, form, amount]);

  //   if (
  //     hasValue(data_converted_currency) &&
  //     Object.keys(data_converted_currency).length !== 0
  //   ) {
  //     const convertedAmount = hasValue(formValue?.amount)
  //       ? formValue?.amount
  //       : 0;

  //     let eqAmount = 0;
  //     if (
  //       hasValue(formValue?.convertedCurrency) &&
  //       hasValue(formValue?.currency) &&
  //       hasValue(formValue?.rateAmount)
  //     ) {
  //       if (formValue?.currency === 243) {
  //         // USD to IDR
  //         eqAmount = data_converted_currency?.convertedRate * convertedAmount;
  //         form.setFieldsValue({
  //           rateAmount: data_converted_currency?.convertedRate?.toLocaleString(
  //             "en-US",
  //             { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  //           ),
  //           eqAmount: eqAmount.toLocaleString("id-ID", {
  //             style: "currency",
  //             currency: "IDR",
  //           }),
  //         });
  //       } else if (formValue?.currency === 244) {
  //         // IDR to USD
  //         eqAmount = convertedAmount / data_converted_currency?.convertedRate;
  //         form.setFieldsValue({
  //           rateAmount: data_converted_currency?.convertedRate?.toLocaleString(
  //             "en-US",
  //             { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  //           ),
  //           eqAmount: eqAmount.toLocaleString("en-US", {
  //             style: "currency",
  //             currency: "USD",
  //           }),
  //         });
  //       }
  //     }
  //   }
  // }, [data_converted_currency, form, formValue?.amount]);

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

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
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
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const onChange = (e) => {
    if (storedData) {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    } else {
      setValuePage(e.target.value);
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    countBadgeFieldsErrorMandatory(setTabData, listDataAttachment, errorFields);
  };

  // Validation Button Back
  const handleBack = () => {
    // form.resetFields();
    // dispatch(resetDataAccountNumber());
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
    // return Math.floor(integerNumber / 100);
    return floatNumber;
  };

  const handleSubmitForm = (formValue) => {
    if (dataTable?.length === 0) {
      const errorBody = {
        title: "Failed",
        description: `Please input allocation information!`,
      };
      dispatch(showModalError(errorBody));
    } else if (listDataAttachment?.length === 0) {
      countBadgeFieldsErrorMandatory(setTabData, listDataAttachment);
    } else {
      countBadgeFieldsErrorMandatory(setTabData, listDataAttachment);
      setModalConfirm(true);
      const dataValue = {
        // receiptId: ,
        appHierId: selectedHierarchy,
        areaId: formValue?.area,
        customerId: formValue?.cusNumber,
        accountId: formValue?.accNumber,
        customerName: formValue?.cusName,
        segmentId: formValue?.segment,
        receiptDate: moment(formValue?.receiptDate).format(
          dateFormatting.dateTime,
        ),
        currencyId: formValue?.currency,
        amount: formValue?.amount,
        paymentTypeId: formValue?.paymentType,
        paymentMethodId: formValue?.method,
        receiptChannelId: formValue?.receiptChannel,
        bankId: formValue?.bank,
        collectingAgentId: formValue?.collectingAgent,
        deliveryChannelId: formValue?.deliveryChannel,
        rateTypeId: formValue?.rateType,
        rateDate: moment(formValue?.rateDate).format(dateFormatting.date),
        rateAmount: convertAndTrimString(formValue?.rateAmount),
        convertedCurrency: currencyDDL?.data?.filter(
          (item) => item?.id === formValue?.convertedCurrency,
        )[0]?.name,
        equivalentAmount: formValue?.eqAmount || 0,
        referenceNumber: formValue?.reference,
        paymentGatewayId: formValue?.paymentGateway,
        allocationDtoList: dataTable?.map((item) => ({
          id: item?.id,
          allocationAmount: item?.allocationAmount,
        })),
        description: formValue?.description,
        receiptCode: formValue?.receiptCode,
        isMisc: isMisc,
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
    }
  };

  // handle confirm
  const handleProcessModalConfirm = () => {
    const modifiedBody = {
      ...bodyData,
      areaId: dataAccountNumber?.data?.areaId,
      segmentId: dataAccountNumber?.data?.segmentId,
    };
    dispatch(createReceipt(modifiedBody))
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
            body,
          );
        }
        setLoadingForm(false);
        setModalConfirm(false);
        handleClear();
      })
      .catch((error) => {
        dispatch(
          validateError({
            error: error,
            actions: "UPLOAD_ATTACHMENT",
            back: false,
          }),
        );
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
    setIsMisc();
    setTabData(
      tabData?.map((item) => {
        const { errorBadge, ...keys } = item;
        return keys;
      }),
    );
  };

  // handle confirm
  const handleConfirm = () => {
    if (bodyData) {
      // handleSave();
    } else {
      // dispatch(getDetailLocation({ id: location?.state?.id, locationType: location?.state?.locationType }));
    }
  };
  // handle retry
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      {/* <Spin spinning={loadingForm}> */}
      <RadioTabs
        data={tabData}
        onChange={onChange}
        currentPosition={valuePage}
      />
      <Spin spinning={isLoading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          // onFinishFailed={handleError}
          onFinishFailed={handleError}
          onValuesChange={handleChangeRequestConverted}
        >
          <div className={`${valuePage !== "Receipt" ? "hidden" : ""}`}>
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
              isMisc={isMisc}
              setIsMisc={setIsMisc}
            />
          </div>
          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategoryReceipt}
                typeSelector="receipt"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                //  getAPIGuard={getConfigFileR}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          </div>
          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
              disabled={storedData}
            >
              Back
            </ButtonComponent>
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleClear}
                disabled={storedData}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent
                  htmlType="submit"
                  type="submit"
                  onClick={() => setFlag(1)}
                  // disabled={disableSubmit}
                  disabled={storedData || totalAllocationAmount > amount}
                >
                  Save & Submit
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
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
          isMisc={isMisc}
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
            {bodyError?.response?.data?.message?.toString()}
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
      {/* </Spin> */}
    </LayoutMenu>
  );
};

export default ListRececiptForm;
