import React, { useCallback } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Form, Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import { useState } from "react";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { useLocation, useNavigate } from "react-router-dom";
import PointOfSalesPage from "./Page/PointOfSalesPage";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createPOS,
  getApprovalList,
  getApprovalListDetail,
  getDetailPOS,
  getGlobalAccountNumber,
  getGlobalBillingCycle,
  getGlobalBillingItem,
  getGlobalBillingPeriod,
  getGlobalCurrency,
  getGlobalProductItem,
  getGlobalTermsOfPayment,
  getGlobalTermsOfPaymentData,
  getGlobalType,
  getMaterai,
  getRate,
  getRateTax,
  updatePOS,
} from "../../../../../redux/slices/rating_billing_invoice/PointOfSales";
import PointOfSalesPageAttachment from "./Page/PointOfSalesPageAttachment";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import PosConfirmation from "./PosConfirmation";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../utils";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { handleMandatory, isDateString, renderDate } from "../Utils";
import { showModalError } from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import BaseContainer from "../../../../../components/BaseContainer";
import { list } from "postcss";

const PosForm = ({ type }) => {
  const {
    data_globalType,
    data_globalBillingCycle,
    data_globalBillingPeriod,
    data_globalCurrency,
    data_approvalList,
    data_approvalListDetail,
    data_globalAccountNumber,
    data_globalTermsOfPayment,
    data_globalTermsOfPaymentValue,
    data_globalProduct,
    data_globalBilling,
    data_rate,
    data_detailPos,
    loading,
    loadingAccount,
    data_rate_tax,
    data_materai,
  } = useSelector((state) => state.pointOfSales);

  //declare
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const idUpdate = type === "create" ? undefined : location?.state?.id;
  const idPos = type === "create" ? undefined : location?.state?.idPos;

  //state
  const [data, setData] = useState([]);
  const [dataDynamic, setDataDynamic] = useState({});
  const [dataApproval, setDataApproval] = useState([]);
  const [dataAttachment, setDataAttachment] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [dataListDetailApproval, setDataListDetailApproval] = useState([]);
  const [dataSend, setDataSend] = useState({});
  const [accountNumber, setAccountNumber] = useState("");
  const [dataAccount, setDataAccount] = useState();
  const [valueDdl, setValueDdl] = useState({
    action: "changes",
    value: null,
  });
  const [ddlFinal, setDdlFinal] = useState("");

  const [modalBack, setModalBack] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalDailyRate, setModalDailyRate] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // state approval
  const [dataApprovalId, setDataApprovalId] = useState();
  const [invoiceDate, setInvoiceDate] = useState();
  const [dataMissing, setDataMissing] = useState([]);
  const [dataPriority, setDataPriority] = useState([]);

  //state dynamic
  const [dataBillingCycle, setDataBillingCycle] = useState();
  const [currency, setCurrency] = useState();
  const [dataTabs, setDataTabs] = useState([
    {
      value: "Point of Sales",
      paramValue: [
        "accountNumber",
        "billingCycle",
        "billingPeriod",
        "currency",
        "transactionDate",
        "invoiceDate",
        "termType",
        "termValue",
        "remark",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [tabHeader, setTabHeader] = useState(dataTabs[0].value);
  const [rangeDisableDate, setRangeDisableDate] = useState({});

  //useEffect
  useEffect(() => {
    if (data_rate === null || data_rate?.success === false) {
      setInvoiceDate(null);
      form.resetFields(["invoiceDate"]);
      setModalDailyRate(true);
    } else {
      setModalDailyRate(false);
    }
  }, [data_rate]);

  useEffect(() => {
    if (data && invoiceDate && currency && data.length < 1) {
      // console.log(`invoice date ${moment(invoiceDate).format(dateFormatting.dateFormal)} currency ${currency}}`)
      dispatch(
        getRateTax({
          invoiceDate: moment(invoiceDate).format(dateFormatting.dateFormal),
          currency,
        }),
      );
      dispatch(
        getRate({
          invoiceDate: moment(invoiceDate).format(dateFormatting.dateFormal),
          currency,
        }),
      );
    }
  }, [dispatch, invoiceDate, currency]);

  useEffect(() => {
    dispatch(getGlobalType());
    dispatch(getGlobalBillingCycle());
    dispatch(getGlobalCurrency());
    dispatch(getApprovalList());
    dispatch(getGlobalTermsOfPayment());
    dispatch(getGlobalAccountNumber());
    // dispatch(getGlobalTermsOfPaymentData());
    dispatch(getGlobalProductItem());
    dispatch(getGlobalBillingItem());
    // setDataApproval([]);
  }, [dispatch]);

  useEffect(() => {
    const newData = [
      {
        name: "Account Number",
        data: accountNumber,
      },
      {
        name: "Currency",
        data: currency,
      },
      {
        name: "Invoice Date",
        data: invoiceDate,
      },
    ];

    // Filter out data with undefined or empty values
    const missingData = newData.filter((data) => !data.data);

    // Set the state
    setDataMissing(missingData);
    setDataPriority(newData);
  }, [currency, accountNumber, invoiceDate]);

  useEffect(() => {
    if (type === "update") {
      //code
      dispatch(getDetailPOS(idUpdate));
    } else {
      setDataDynamic({
        totalAmountIdr: 0,
        totalAmountUsd: 0,
        amountIdr: 0,
        amountUsd: 0,
        discountAmountIdr: 0,
        discountAmountUsd: 0,
        // taxBasis: 0, // TODO delete
        taxBasisIdr: 0, //new
        taxBasisUsd: 0, //new
        taxBasisEqvIdr: 0,
        // vat: 0, //TODO delete
        vatIdr: 0, //new
        vatUsd: 0, //new
        vatEqvIdr: 0,
        withholdingTax: 0,
      });
    }
  }, [dispatch, type]);

  useEffect(() => {
    if (hasValue(accountNumber)) {
      const getAccountId = data_globalAccountNumber?.find(
        (item) => item?.accountNumber === accountNumber,
      )?.accountId;
      dispatch(getGlobalTermsOfPaymentData(getAccountId));
    }
  }, [accountNumber, data_globalAccountNumber, dispatch]);

  const handleSetFormUpdate = useCallback(
    (data_detailPos, data_globalCurrency) => {
      form.setFieldsValue({
        // termType: {
        //   termValueDdl: isDateString(data_detailPos?.termsOfPayment)
        //     ? "DATE"
        //     : "TOP",
        // },
        ...data_detailPos,
        currency: data_globalCurrency?.find(
          (item) => item.text === data_detailPos?.currency,
        )?.Id,
        apphierId: data_detailPos?.appHierId,
        transactionDate: moment(data_detailPos?.transactionDate),
        invoiceDate: moment(data_detailPos?.invoiceDate),
        // termType: {
        //   termValue: isDateString(data_detailPos?.termsOfPayment)
        //     ? moment(data_detailPos?.termsOfPayment || "")
        //     : data_detailPos?.termsOfPayment,
        // },
      });
    },
    [form],
  );

  useEffect(() => {
    if (
      type === "update" &&
      data_detailPos &&
      data_detailPos.id === idUpdate &&
      data_globalProduct &&
      data_globalCurrency &&
      data_globalBillingCycle
    ) {
      setValueDdl({
        action: "setData",
        value: isDateString(data_detailPos?.termsOfPayment) ? "DATE" : "TOP",
      });
      setDataApprovalId(data_detailPos?.appHierId);
      handleSetFormUpdate(data_detailPos, data_globalCurrency);
      setCurrency(
        data_globalCurrency?.find(
          (item) => item.text === data_detailPos?.currency,
        )?.Id,
      );
      setAccountNumber(data_detailPos?.accountNumber);
      setInvoiceDate(
        moment(data_detailPos?.invoiceDate),
        // .format(dateFormatting.dateFormal)
      );
      setDataBillingCycle(
        data_globalBillingCycle?.find(
          (item) => item.name === data_detailPos?.billingCycle,
        )?.id,
      );
      setDataDynamic({
        ...dataDynamic,
        rateType: data_detailPos.rateType || "",
        rate: data_detailPos.rate || "",
        rateDate: data_detailPos.taxRateDate || "",
        // rateValue: data_detailPos.rateValue,
        taxRate: data_detailPos.taxRateValue || "",
        taxRateDate: data_detailPos.taxRateDate || "",
        taxRateType: data_detailPos.taxRateType || "",
      });
      setData(
        data_detailPos?.mrbiPosDetails?.map((item, index) => {
          let temp = {
            ...item,
            // referenceName: item.referenceName,
            // referenceId: item?.reference,
            price: item?.price || 0,
            amount: item?.amount || 0,
            amountEqvUsd: Number(item?.amountEqvUsd.toFixed(2)) || 0,
            amountEqvIdr: item?.amountEqvIdr || 0,
            eqvIdr: item?.eqvIdr || 0,
            totalEqvIdr: item?.totalEqvIdr || 0,
            totalEqvUsd: Number(item?.totalEqvUsd.toFixed(2)) || 0,
            // lineNumber: index + 1,
          };
          // if (
          //   item?.item === "PPN" &&
          //   item?.item === "PPH" &&
          //   item?.item === "Meterai" &&
          //   item?.item === null || undefined
          // ) {
          //   temp = {
          //     ...temp,
          //     dataType: "exist",
          //   };
          // }
          return temp;
        }),
      );
      setDataAttachment(
        (data_detailPos?.mattachments || []).map((item) => ({
          ...item,
          dataType: "exist",
        })),
      );
    }
  }, [
    data_detailPos,
    data_globalProduct,
    type,
    data_globalCurrency,
    data_globalBillingCycle,
    handleSetFormUpdate,
  ]);

  useEffect(() => {
    if (data_rate && data_rate_tax) {
      setDataDynamic({
        ...dataDynamic,
        rateType: data_rate?.rateType,
        rate: data_rate?.rate,
        rateDate: data_rate.rateDate
          ? moment(data_rate?.rateDate).format(dateFormatting.date)
          : "",
        // rateValue: data_rate?.rateValue,
        taxRateType: data_rate_tax?.rateType,
        taxRate: data_rate_tax?.rate,
        taxRateDate: data_rate_tax?.rateDate
          ? moment(data_rate?.rateDate).format(dateFormatting.date)
          : "",
      });
    }
  }, [data_rate, data_rate_tax]);

  // console.log(data, "data");

  //calculating POS info
  useEffect(() => {
    if (data) {
      let dataMaterai =
        data.filter(
          (item) => item.item === "Meterai" || parseInt(item.itemId) === 297,
        )[0] || {};
      const newDataDynamic = data
        .filter(
          (item) => item.item !== "Meterai" || parseInt(item.itemId) !== 297,
        )
        .reduce(
          (sums, item) => {
            let tempSum = { ...sums };
            if (
              /* yang punya tax ( dari product )*/
              item.typeId === 2144 &&
              data.some(
                (dataItem) => dataItem.reference === parseInt(item.itemId),
              )
            ) {
              // tempSum.taxBasis += item.total || 0;
              tempSum.taxBasisEqvIdr += item.eqvIdr || 0;
              if (item.currency === "USD") {
                tempSum.taxBasisUsd += item.total || 0;
              } else if (item.currency === "IDR") {
                tempSum.taxBasisIdr += item.total || 0;
              }
            }
            if (
              item.typeId === 2342 ||
              item?.typeValueName?.toLowerCase()?.includes("ppn")
            ) {
              /* Tax PPN saja type Id*/
              // tempSum.vat += item.total || 0;
              tempSum.vatEqvIdr += item.eqvIdr || 0;
              if (item.currency === "USD") {
                tempSum.vatUsd += item.total || 0;
              } else if (item.currency === "IDR") {
                tempSum.vatIdr += item.total || 0;
              }
            }
            if (
              item.typeId === 2343 ||
              item?.typeValueName?.toLowerCase()?.includes("pph")
            ) {
              /*tax pph saja*/
              tempSum.withholdingTax += item.totalEqvIdr || 0;
            }
            //All others by currency
            // console.log(typeof item.total ,"type data total")
            // console.log(item, "item")
            if (item.currency === "USD") {
              tempSum.totalAmountUsd +=
                item.typeId !== 2343 ||
                !item?.typeValueName?.toLowerCase()?.includes("pph")
                  ? item.total || 0
                  : 0;
              tempSum.amountUsd +=
                item.typeId !== 2343 ||
                !item?.typeValueName?.toLowerCase()?.includes("pph")
                  ? item.amount || 0
                  : 0;
              tempSum.discountAmountUsd += item.discount || 0;
              //new Vat USD , tax basis USD
            } else if (item.currency === "IDR") {
              tempSum.totalAmountIdr +=
                item.typeId !== 2343 ||
                !item?.typeValueName?.toLowerCase()?.includes("pph")
                  ? item.total || 0
                  : 0;
              tempSum.amountIdr +=
                item.typeId !== 2343 ||
                !item?.typeValueName?.toLowerCase()?.includes("pph")
                  ? item.amount || 0
                  : 0;
              tempSum.discountAmountIdr += item.discount || 0;
              //new Vat IDR , tax basis IDR
            }
            //netral ( except pph )
            tempSum.totalEqvIdr +=
              item.typeId !== 2343 ||
              !item?.typeValueName?.toLowerCase()?.includes("pph")
                ? item.totalEqvIdr || 0
                : 0;
            tempSum.totalEqvUsd +=
              item.typeId !== 2343 ||
              !item?.typeValueName?.toLowerCase()?.includes("pph")
                ? item.totalEqvUsd || 0
                : 0;
            return tempSum;
          },
          {
            totalAmountIdr: 0,
            totalAmountUsd: 0,
            amountIdr: 0,
            amountUsd: 0,
            discountAmountIdr: 0,
            discountAmountUsd: 0,
            // taxBasis: 0, // TODO delete
            taxBasisIdr: 0, //new
            taxBasisUsd: 0, //new
            taxBasisEqvIdr: 0,
            // vat: 0, //TODO delete
            vatIdr: 0, //new
            vatUsd: 0, //new
            vatEqvIdr: 0,
            withholdingTax: 0,
            totalEqvIdr: 0, //for materai
            totalEqvUsd: 0,
          },
        );
      if (
        newDataDynamic.totalEqvIdr >= 5000000 &&
        !data.some(
          (item) => item.item === "Meterai" || parseInt(item.itemId) === 297,
        )
      ) {
        // console.log(newDataDynamic.totalEqvIdr, "totalEqvIdr");
        // console.log(data,"data")
        dispatch(
          getMaterai({
            transactionDate: moment(invoiceDate).format(
              dateFormatting.dateFormal,
            ),
          }),
        )
          .unwrap()
          .then((dataRes) => {
            // console.log(dataRes, "dataRes")
            dataMaterai = {
              typeId: dataRes?.type,
              type: dataRes?.typeName,
              itemId: parseInt(dataRes?.item),
              item: dataRes?.itemName,
              price: dataRes?.price,
              // referenceId: dataRes?.reference,
              // referenceName: dataRes?.referenceName,
              quantity: dataRes?.quantity,
              uom: dataRes?.uom,
              currency: dataRes?.currency,
              amount: dataRes?.amount,
              discount: dataRes?.discount || 0,
              amountEqvIdr: dataRes?.amountEqvIdr,
              amountEqvUsd: Number(dataRes?.amountEqvUsd.toFixed(2)),
              total: dataRes.total,
              eqvIdr: dataRes?.eqvIdr || 0,
              totalEqvUsd: Number(dataRes?.totalEqvUsd.toFixed(2)),
              totalEqvIdr: dataRes?.totalEqvIdr,
              remark: dataRes?.remark || "",
              // dataTypeExist: "exist",
            };
            const temp = [...data, dataMaterai || {}];
            setData(
              temp.map((items, index) => {
                return {
                  ...items,
                  lineNumber: index + 1,
                };
              }),
            );
          });
      } else if (
        newDataDynamic.totalEqvIdr < 5000000 &&
        data.some((item) => item.item === "Meterai" || item.itemId === 297)
      ) {
        // console.log(data,"data un materai")
        // console.log(newDataDynamic.totalEqvIdr, "totalEqvIdr");
        setData(
          data
            .filter(
              (item) =>
                item.item !== "Meterai" || parseInt(item.itemId) !== 297,
            )
            .map((items, index) => {
              return {
                ...items,
                lineNumber: index + 1,
              };
            }),
        );
      } else {
        // console.log(data,"data akhir")
        // console.log(dataMaterai, "dataMaterai")
        // console.log(newDataDynamic, "newDataDynamic")
        const dataCalculate = {
          totalAmountIdr:
            newDataDynamic.totalAmountIdr +
            (dataMaterai.totalEqvIdr ? parseInt(dataMaterai.totalEqvIdr) : 0),
          totalAmountUsd:
            newDataDynamic.totalAmountUsd +
            (dataMaterai.totalEqvUsd ? parseInt(dataMaterai.totalEqvUsd) : 0),
          amountIdr:
            newDataDynamic.amountIdr +
            (dataMaterai.currency === "IDR" ? parseInt(dataMaterai.amount) : 0),
          amountUsd:
            newDataDynamic.amountUsd +
            (dataMaterai.currency === "USD" ? parseInt(dataMaterai.amount) : 0),
          discountAmountIdr:
            newDataDynamic.discountAmountIdr +
            (dataMaterai.currency === "IDR"
              ? parseInt(dataMaterai.discount)
              : 0),
          discountAmountUsd:
            newDataDynamic.discountAmountUsd +
            (dataMaterai.currency === "USD"
              ? parseInt(dataMaterai.discount)
              : 0),
          // taxBasis: newDataDynamic.taxBasis,
          taxBasisUsd: newDataDynamic.taxBasisUsd,
          taxBasisIdr: newDataDynamic.taxBasisIdr,
          taxBasisEqvIdr: newDataDynamic.taxBasisEqvIdr,
          // +
          // (dataMaterai.totalEqvIdr ? parseInt(dataMaterai.totalEqvIdr) : 0),
          // vat: newDataDynamic.vat,
          vatUsd: newDataDynamic.vatUsd,
          vatIdr: newDataDynamic.vatIdr,
          vatEqvIdr: newDataDynamic.vatEqvIdr,
          withholdingTax: newDataDynamic.withholdingTax,
          totalEqvIdr:
            newDataDynamic.totalEqvIdr +
            (dataMaterai.totalEqvIdr ? parseInt(dataMaterai.totalEqvIdr) : 0),
          totalEqvUsd:
            newDataDynamic.totalEqvUsd +
            (dataMaterai.totalEqvUsd ? parseInt(dataMaterai.totalEqUsd) : 0),
          // Add other properties as needed
        };
        // console.log(dataCalculate, "dataCalculate")
        setDataDynamic({ ...dataDynamic, ...dataCalculate });
      }
    }
  }, [data]);

  useEffect(() => {
    if (dataBillingCycle && dataBillingCycle !== undefined) {
      dispatch(getGlobalBillingPeriod(dataBillingCycle));
    }
  }, [dispatch, dataBillingCycle]);

  useEffect(() => {
    if (dataApprovalId && dataApprovalId !== undefined) {
      dispatch(getApprovalListDetail(dataApprovalId));
    }
  }, [dispatch, dataApprovalId]);

  useEffect(() => {
    if (data_approvalList) {
      const tempAppHier = (data_approvalList || []).map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));

      setDataApproval(tempAppHier);
    }
  }, [data_approvalList]);

  useEffect(() => {
    if (data_approvalListDetail && data_approvalListDetail.length > 0) {
      const data = data_approvalListDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataListDetailApproval(data);
    } else {
      setDataListDetailApproval([]);
    }
  }, [data_approvalListDetail]);

  useEffect(() => {
    if (accountNumber) {
      setDataAccount(
        data_globalAccountNumber?.find(
          (item) => item.accountNumber === accountNumber,
        ),
      );
    }
  }, [accountNumber]);

  useEffect(() => {
    if (dataAccount) {
      form.setFieldsValue({
        ...dataAccount,
      });
    }
  }, [dataAccount]);

  const handleValueDdlSet = (value) => {
    if (!hasValue(value)) {
      return null;
    } else if (isDateString(value) || value === "DATE") {
      return "DATE";
    } else {
      return "TOP";
    }
  };

  const handleSetFormTypeValueDdl = useCallback(
    (value, data_detailPos) => {
      form.setFieldsValue({
        ...(value?.action === "setData"
          ? {
              termType: {
                termValueDdl: handleValueDdlSet(data_detailPos?.termsOfPayment),
              },
            }
          : {
              termType: {
                termValueDdl: handleValueDdlSet(value.value),
              },
            }),
      });
    },
    [form],
  );

  const handleValue = (e) => {
    //handling non moment to moment date ( error date.clone )
    return isDateString(e) ? moment(e) : e;
  };

  const handleSetFormTypeTOP = useCallback(
    (value, data_detailPos) => {
      // console.log(value, "value set TOP");
      if (value.action === "setData") {
        form.setFieldsValue({
          ...(value?.action === "setData"
            ? {
                termType: {
                  termValue: handleValue(data_detailPos?.termsOfPayment),
                },
              }
            : {
                termType: {
                  termValue: isDateString(value?.value)
                    ? moment(value?.value)
                    : value?.value,
                },
              }),
        });
      }
    },
    [form],
  );

  //handling non moment to moment date ( error date.clone )
  useEffect(() => {
    // console.log(valueDdl, "valueDdl");
    if (valueDdl) {
      form.resetFields(["termType", "termValue"]);
      handleSetFormTypeValueDdl(valueDdl, data_detailPos);
      setDdlFinal(valueDdl);
    }
  }, [valueDdl, handleSetFormTypeValueDdl]);

  useEffect(() => {
    // console.log(ddlFinal, "ddlFinal");
    if (hasValue(ddlFinal?.value)) {
      handleSetFormTypeTOP(ddlFinal, data_detailPos);
    }
    // form.setFieldsValue({
    //   termType: {
    //     termValueDdl: ddlFinal === "TOP" ? "TOP" : "DATE",
    //   },
    // });
  }, [ddlFinal, handleSetFormTypeTOP]);

  // useEffect(() => {
  //   form.resetFields(["billingPeriod"]);
  // }, [dataBillingCycle]);

  // change tabs
  const changeTabHeader = (e) => {
    setTabHeader(e.target.value);
  };

  // routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.POS_VIEW,
      breadcrumbName: "Point of Sales",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "create" ? "Create" : "Update"
      } Point of Sales`,
    },
  ];

  // check has overlapping data
  const checkOverlappingData = useCallback((formHeader, dataTable) => {
    const dataOverlap = [];
    // if (hasValue(formHeader?.endDate)) {
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

  //handleAction
  const onFinish = (e) => {
    let errorBody = {};
    if (dataAttachment.length === 0) {
      handleMandatory(setDataTabs, dataAttachment); // attachment mandatory onFinish
    } else {
      handleMandatory(setDataTabs, dataAttachment); // clearing all badge
      if (data.length === 0 && dataAttachment.length === 0) {
        errorBody = {
          title: "Failed",
          description: `Your data was not created. Point of Sales Item and Attachment are Mandatory. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else if (data.length === 0) {
        errorBody = {
          title: "Failed",
          description:
            "Your data was not created. Point of Sales Item is Mandatory. Please try again.",
        };
        dispatch(showModalError(errorBody));
      } else if (dataAttachment.length === 0) {
        errorBody = {
          title: "Failed",
          description: "Attachment Mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else {
        const findBillingCycle = data_globalBillingCycle?.find(
          (item) => item.id === e?.billingCycle,
        )?.name;

        const findBillingPeriod = data_globalBillingPeriod?.find(
          (item) => item.id === e?.billingPeriod,
        )?.name;

        setDataSend({
          ...e,
          billingCycle:
            findBillingCycle === undefined ? e?.billingCycle : findBillingCycle,
          billingPeriod:
            findBillingPeriod === undefined
              ? e?.billingPeriod
              : findBillingPeriod,
          currency: data_globalCurrency?.find((item) => item.Id === e?.currency)
            ?.text,
          transactionDate: moment(e?.transactionDate).format(
            dateFormatting.date,
          ),
          invoiceDate: moment(e?.invoiceDate).format(dateFormatting.date),
          termsOfPayment: moment.isMoment(e?.termType?.termValue)
            ? moment(e?.termType?.termValue).format(dateFormatting.date)
            : data_globalTermsOfPaymentValue?.find(
                (item) => item.Id === e?.termType?.termValue,
              )?.text,
          remark: e?.remark,
          submit: typeSubmit,
          topId: e.termType.termValueDdl,
        });
        setModalConfirm(true);
        setDataTabs([
          {
            value: "Point of Sales",
            paramValue: [
              "accountNumber",
              "billingCycle",
              "period",
              "currency",
              "transactionDate",
              "invoiceDate",
              "termType",
              "termValue",
              "remark",
            ],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      }
    }
  };

  // console.log(dataDynamic, "dataDynamic");
  const handleSendData = (e) => {
    setModalConfirm(false);
    // Summary Amount
    const calculateAmount = data.map((a) => a.amount);
    const sumAmount = calculateAmount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    // Summary Discount
    const calculateDiscount = data.map((a) => a.discount);
    const sumDiscount = calculateDiscount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    // Find topDataType
    const dataTypeTOP = data_globalTermsOfPaymentValue?.find(
      (item) => item.Id === e.termType.termValue,
    );

    // Check Date String
    const isDateString = moment(
      e?.termsOfPayment,
      dateFormatting.date,
      true,
    ).isValid();

    //code
    const body = {
      ...e,
      id: type === "create" ? undefined : idUpdate,
      posNumber: type === "create" ? undefined : idPos,
      costcenter: `${e?.costCenterCode || ""} - ${e?.costCenterName || ""}`,
      termsOfPayment:
        isDateString === true
          ? moment(e?.termsOfPayment).format(dateFormatting.dateFormal)
          : e?.termsOfPayment,
      ...dataDynamic,
      appHierId: dataApprovalId,
      rate: parseFloat(dataDynamic?.rate.replace(/,/g, "")) || 0,
      // rateType: dataDynamic?.rateType || null,
      rateDate: renderDate(dataDynamic?.rateDate) || null,
      amount: sumAmount,
      // taxBasisIdr: 0,
      // taxBasisUsd: 0,
      // taxBasisEqvUsd: 0,
      // vatIdr: 0,
      // vatUsd: 0,
      taxRate: parseFloat(dataDynamic?.taxRate.replace(/,/g, "")) || 0,
      taxRateDate: renderDate(dataDynamic?.taxRateDate) || null,
      // taxRateType: dataDynamic?.rateType || null,
      discountAmount: sumDiscount,
      topDataType: dataTypeTOP === undefined ? null : dataTypeTOP?.topDataType,
      mrbiPosDetails: data?.map((item) => {
        return {
          posDetailId: item?.posDetailId,
          posNumber: item?.posNumber,
          type: item?.typeId,
          item: item?.itemId,
          price: item?.price || 0,
          reference: item?.reference || null,
          quantity: item?.quantity,
          uom: item?.uom || null,
          currency: item?.currency || null,
          amount: item?.amount || 0,
          amountEqvIdr: item?.amountEqvIdr || 0,
          amountEqvUsd: item?.amountEqvUsd || 0,
          eqvIdr: item?.eqvIdr || 0,
          discount: item?.discount || 0,
          total: item?.total || 0,
          totalEqvUsd: item?.totalEqvUsd || 0,
          totalEqvIdr: item?.totalEqvIdr || 0,
          remark: item?.remark || null,
          lineNumber: item?.lineNumber || 0,
        };
      }),
    };

    delete body.costCenterCode;
    delete body.costCenterName;
    delete body.termType;
    delete body.apphierId;
    delete body.taxBasis;

    if (type === "create") {
      dispatch(createPOS(body))
        .unwrap()
        .then(async (data) => {
          const id = data?.id;
          setLoadingForm(true);
          for (let icon = 0; icon < dataAttachment.length; icon++) {
            const element = dataAttachment[icon];
            const body = {
              files: element.file,
              refId: id,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/pos/upload-attachment`,
              body,
            );
          }
          form.resetFields();
          setLoadingForm(false);
          setData([]);
          setDataDynamic({});
          setDataApprovalId();
          setDataAttachment([]);
          setAccountNumber();
          setCurrency();
          setInvoiceDate();
          setDdlFinal("DATE");
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error?.response &&
                error?.response?.data &&
                error?.response?.data?.message) ||
              error?.message ||
              error?.toString();
            setBodyError({ message, value: e });
            setModalError(true);
          }
        });
    } else {
      // console.log(body, "body");
      dispatch(updatePOS(body))
        .unwrap()
        .then(async (data) => {
          setLoadingForm(true);
          const id = idUpdate;
          const filterDataAttach = dataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              refId: id,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/pos/upload-attachment`,
              body,
            );
          }
          form.resetFields();
          setLoadingForm(false);
          setData([]);
          setDataDynamic({});
          setDataApprovalId();
          setDataAttachment([]);
          setAccountNumber();
          setCurrency();
          setInvoiceDate();
          setCurrency();
          setDdlFinal("DATE");
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error?.response &&
                error?.response?.data &&
                error?.response?.data?.message) ||
              error?.message ||
              error?.toString();
            setBodyError({ message, value: e });
            setModalError(true);
          }
        });
    }
  };

  const handleRetry = () => {
    handleSendData(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    // setDataTabs((prevState) => {
    //   const res = prevState.map((item) => {
    //     if (!item.paramValue || item.paramValue.length < 0) {
    //       return {
    //         value: item.value,
    //         paramValue: item.paramValue,
    //       };
    //     }
    //     const errorBadge = errorFields.reduce(
    //       (current, next) =>
    //         item.paramValue.includes(next.name[0]) ? current + 1 : current,
    //       0
    //     );
    //     return {
    //       value: item.value,
    //       paramValue: item.paramValue,
    //       errorBadge,
    //     };
    //   });
    //   return res;
    // });
    handleMandatory(setDataTabs, dataAttachment, errorFields);
  };

  const handleClearOrReset = () => {
    if (type === "update") {
      if (data_detailPos && type === "update") {
        setValueDdl({
          action: "setData",
          value: isDateString(data_detailPos?.termsOfPayment) ? "DATE" : "TOP",
        });
        handleSetFormUpdate(data_detailPos, data_globalCurrency);
        setData(
          data_detailPos?.mrbiPosDetails?.map((item, index) => {
            let temp = {
              ...item,
              // referenceName: item.referenceName,
              // referenceId: item?.reference,
              price: item?.price || 0,
              amount: item?.amount || 0,
              amountEqvUsd: Number(item?.amountEqvUsd.toFixed(2)) || 0,
              amountEqvIdr: item?.amountEqvIdr || 0,
              eqvIdr: item?.eqvIdr || 0,
              totalEqvIdr: item?.totalEqvIdr || 0,
              totalEqvUsd: Number(item?.totalEqvUsd.toFixed(2)) || 0,
              // lineNumber: index + 1,
            };
            // if (
            //   item?.item === "PPN" &&
            //   item?.item === "PPH" &&
            //   item?.item === "Meterai" &&
            //   item?.item === null || undefined
            // ) {
            //   temp = {
            //     ...temp,
            //     dataType: "exist",
            //   };
            // }
            return temp;
          }),
        );
        setCurrency(
          data_globalCurrency?.find(
            (item) => item.text === data_detailPos?.currency,
          )?.Id,
        );
        setAccountNumber(data_detailPos?.accountNumber);
        setInvoiceDate(
          moment(data_detailPos?.invoiceDate),
          // .format(dateFormatting.dateFormal)
        );
        setDataBillingCycle(
          data_globalBillingCycle?.find(
            (item) => item.name === data_detailPos?.billingCycle,
          )?.id,
        );
        setDataAttachment(
          (data_detailPos?.mattachments || []).map((item) => ({
            ...item,
            // createdDate: moment(item.createdDate).format("DD MMM YYYY"),
            // fileSize: bytesConverter(item.fileSize || 0),
            dataType: "exist",
          })),
        );
        setDataApprovalId(data_detailPos?.appHierId);
        // setDataApproval(data_detailPos?.appHierId);
      }
    } else {
      setRangeDisableDate({});
      form.resetFields();
      setData([]);
      setAccountNumber();
      setCurrency();
      setInvoiceDate();
      form.setFieldsValue({
        termType: {
          termValueDdl: "DATE",
        },
      });
      setValueDdl({
        action: "changes",
        value: null,
      });
      setDataAttachment([]);
      setDataApprovalId();
      setDataListDetailApproval([]);
      setDataBillingCycle();
    }
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingForm || loadingAccount}>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex flex-col"}>
          <div className={"w-full flex justify-start"}>
            <RadioTabs
              data={dataTabs}
              onChange={changeTabHeader}
              currentPosition={tabHeader}
            />
          </div>
        </div>
        <Form
          id={"form"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
          onFinishFailed={handleErrorSubmit}
          scrollToFirstError={true}
        >
          <div
            style={{
              display: tabHeader !== dataTabs[0].value ? "none" : undefined,
            }}
          >
            <PointOfSalesPage
              data_dynamic={dataDynamic}
              data={data}
              setData={setData}
              data_billingCycle={dataBillingCycle}
              data_globalBillingCycle={data_globalBillingCycle}
              setDataBillingCycle={setDataBillingCycle}
              data_globalBillingPeriod={data_globalBillingPeriod}
              data_globalCurrency={data_globalCurrency}
              data_globalType={data_globalType}
              setCurrency={setCurrency}
              data_accountNumber={data_globalAccountNumber}
              data_termsOfPayment={data_globalTermsOfPayment}
              setAccountNumber={setAccountNumber}
              dispatch={dispatch}
              valueDdl={ddlFinal}
              setValueDdl={setValueDdl}
              data_globalBilling={data_globalBilling}
              data_globalProduct={data_globalProduct}
              data_globalTermsOfPaymentValue={data_globalTermsOfPaymentValue}
              setTransactionDate={setInvoiceDate}
              dataMissing={dataMissing}
              dataPriority={dataPriority}
              accountNumber={accountNumber}
              currency={currency}
              transactionDate={invoiceDate}
              idPos={idPos}
              setRangeDisableDate={setRangeDisableDate}
              rangeDisableDate={rangeDisableDate}
            />
          </div>
          <div
            style={{
              display: tabHeader !== dataTabs[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={dataListDetailApproval}
                dataOption={dataApproval}
                selectedHierarchy={dataApprovalId}
                updateSelectedHierarchy={setDataApprovalId}
              />
            </BaseContainer>
          </div>
          <div
            style={{
              display: tabHeader !== dataTabs[2].value ? "none" : undefined,
            }}
          >
            <PointOfSalesPageAttachment
              dispatch={dispatch}
              dataAttachment={dataAttachment}
              setDataAttachment={setDataAttachment}
              type={type}
            />
          </div>
          <div className={"w-full flex justify-between mt-10"}>
            <div className=" flex">
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
              >
                Back
              </ButtonComponent>
            </div>

            <div className={"flex gap-5"}>
              <Form.Item>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={
                        type === "update"
                          ? `IconButtonReset`
                          : `IconButtonClear`
                      }
                      width={24}
                      color={"#FFFFFF"}
                    />
                  }
                  type="submit"
                  onClick={() => {
                    handleClearOrReset();
                  }}
                >
                  {type === "update" ? "Reset" : "Clear"}
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  form={"form"}
                  onClick={() => {
                    setTypeSubmit(false);
                  }}
                >
                  Save As Draft
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  form={"form"}
                  onClick={() => {
                    setTypeSubmit(true);
                  }}
                >
                  Save & Submit
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* modal confirm */}
        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header={`Confirmation`}
          width={900}
          handleCancel={() => {
            setModalConfirm(false);
          }}
          footer={
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  setModalConfirm(false);
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  handleSendData(dataSend);
                }}
                disabled={loading || loadingForm}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <PosConfirmation
            dataConfirm={dataSend}
            data_dynamic={dataDynamic}
            dataAttachment={dataAttachment}
            posDetail={data}
            dataApprovalTable={dataListDetailApproval}
            dataApproval={dataApprovalId}
            listApproval={dataApproval}
          />
        </ModalCustom>

        {/* Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              type === "create" ? "Created." : "Updated."
            } ${bodyError?.message}`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal Daily Rate is Null or Undefined */}
        <ModalError
          isOpen={modalDailyRate}
          handleOk={() => setModalDailyRate(false)}
          handleCancel={() => setModalDailyRate(false)}
          // customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Daily Rates not found. Please try again`}</p>
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
      </Spin>
    </LayoutMenu>
  );
};

export default PosForm;
