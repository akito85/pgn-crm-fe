import React, { useCallback } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Form, Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useState } from "react";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { useLocation, useNavigate } from "react-router-dom";
import PointOfSalesPage from "./Page/PointOfSalesPage";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { WarningOutlined } from "@ant-design/icons";
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
  getAccountSegmentList,
  getAccountGroupTypeList,
  getMeterReadingCodeList,
  getUserDetailForPOS,
  getSorList,
  getCostCenterList,
  getUomCodes,
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
import { handleMandatory, isDateString } from "../Utils";
import { showModalError } from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import BaseContainer from "../../../../../components/BaseContainer";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";

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
    data_account_segment,
    data_account_group_type,
    data_meter_reading_code,
    data_user_detail,
    data_sor_list,
    data_cost_center_list,
    data_uom_codes,
  } = useSelector((state) => state.pointOfSales);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const idUpdate = type === "create" ? undefined : location?.state?.id;
  const idPos = type === "create" ? undefined : location?.state?.idPos;
  const customerTypeFromNav = location?.state?.customerType;

  const [selectedTransactionDate, setSelectedTransactionDate] = useState(null);
  const [selectedInvoiceDate, setSelectedInvoiceDate] = useState(null);

  const [customerType, setCustomerType] = useState(customerTypeFromNav || null);
  const [defaultData, setDefaultData] = useState({});
  const [mergedArrayMrc, setMergedArrayMrc] = useState([]);
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState([]);
  const [dataDynamic, setDataDynamic] = useState({});
  const [dataApproval, setDataApproval] = useState([]);
  const [dataAttachment, setDataAttachment] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [dataListDetailApproval, setDataListDetailApproval] = useState([]);
  const [isCostCenterFilled, setIsCostCenterFilled] = useState(false);
  const [isAccountSegmentFilled, setIsAccountSegmentFilled] = useState(false);
  const [dataSend, setDataSend] = useState({});
  const [accountNumber, setAccountNumber] = useState("");
  const [dataAccount, setDataAccount] = useState();
  const [valueDdl, setValueDdl] = useState({ action: "changes", value: null });
  const [ddlFinal, setDdlFinal] = useState("");
  const [modalBack, setModalBack] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalDailyRate, setModalDailyRate] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalId, setDataApprovalId] = useState();
  const [invoiceDate, setInvoiceDate] = useState();
  const [dataMissing, setDataMissing] = useState([]);
  const [dataPriority, setDataPriority] = useState([]);
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
  const [valuePage, setValuePage] = useState("Point of Sales");
  const [rangeDisableDate, setRangeDisableDate] = useState({});

  const getCustomerTypeNumber = (type) => {
    return type === "prospective" ? 2 : 1;
  };

  const getCustomerTypeString = (typeNumber) => {
    return typeNumber === 2 ? "prospective" : "customer";
  };

  const steps = [
    { title: "POINT OF SALES", value: "Point of Sales" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.POS_VIEW, breadcrumbName: "Point of Sales" },
    {
      path: "",
      breadcrumbName: `${type === "create" ? "Create" : "Update"} Point of Sales`,
    },
  ];

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = dataTabs[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          // Validation failed
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

  const handleAccountSegmentChange = (selectedSegmentId) => {
    form.resetFields(["accountGroupType"]);
    setIsAccountSegmentFilled(!!selectedSegmentId);

    if (selectedSegmentId) {
      dispatch(getAccountGroupTypeList([selectedSegmentId]));
    }
  };

  const handleMeterReadingCodeChange = () => {};

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
        costCenter: dataAccount.costcenter || dataAccount.costCenter,
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
    return isDateString(e) ? moment(e) : e;
  };

  const handleSetFormTypeTOP = useCallback(
    (value, data_detailPos) => {
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

  const handleSetFormUpdate = useCallback(
    (data_detailPos, data_globalCurrency) => {
      const costCenterValue =
        data_detailPos?.costcenter || data_detailPos?.costCenter || "";

      form.setFieldsValue({
        ...data_detailPos,
        currency: data_globalCurrency?.find(
          (item) => item.text === data_detailPos?.currency,
        )?.Id,
        apphierId: data_detailPos?.appHierId,
        transactionDate: moment(data_detailPos?.transactionDate),
        invoiceDate: moment(data_detailPos?.invoiceDate),
        costcenter: costCenterValue,
      });
    },
    [form],
  );

  // Detect customer type from API response
  useEffect(() => {
    if (type === "update" && data_detailPos && data_detailPos.id === idUpdate) {
      if (!customerTypeFromNav && !customerType) {
        const detectedCustomerType = getCustomerTypeString(
          data_detailPos.customerType,
        );
        setCustomerType(detectedCustomerType);
      }
    }
  }, [data_detailPos, type, idUpdate, customerTypeFromNav, customerType]);

  // Load prospective customer data
  useEffect(() => {
    if (customerType === "prospective") {
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getAccountSegmentList());

      if (type === "create") {
        dispatch(getUserDetailForPOS());
      }
    }
  }, [dispatch, type, customerType]);

  // Set default data for prospective customer (CREATE)
  useEffect(() => {
    if (
      type === "create" &&
      customerType === "prospective" &&
      data_user_detail
    ) {
      const defaultSor = data_user_detail?.sorId || null;
      const defaultCostCenter = data_user_detail?.ccId || null;

      const tempDefaultData = {
        sor: defaultSor,
        costcenter:
          defaultCostCenter && defaultCostCenter !== null
            ? typeof defaultCostCenter === "number"
              ? [defaultCostCenter]
              : defaultCostCenter
            : [],
      };

      setDefaultData(tempDefaultData);

      form.setFieldsValue({
        sor: defaultSor,
        costcenter: tempDefaultData.costcenter,
      });

      if (tempDefaultData.costcenter && tempDefaultData.costcenter.length > 0) {
        const body = {
          ccIds: tempDefaultData.costcenter.map((id) => ({ ccId: id })),
        };
        dispatch(getMeterReadingCodeList(body));
      }
    }
  }, [type, customerType, data_user_detail, form, dispatch]);

  // Merge meter reading code data
  useEffect(() => {
    let dataMrc = data_meter_reading_code?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      [],
    );
    setMergedArrayMrc(dataMrc);
  }, [data_meter_reading_code]);

  // Convert MRC name to ID for UPDATE prospective
  useEffect(() => {
    if (
      type === "update" &&
      customerType === "prospective" &&
      data_detailPos &&
      mergedArrayMrc &&
      mergedArrayMrc.length > 0 &&
      data_detailPos.id === idUpdate
    ) {
      const mrcId = mergedArrayMrc?.find(
        (item) => item.name === data_detailPos?.meterReadingCode,
      )?.id;

      if (mrcId) {
        form.setFieldsValue({
          meterReadingCode: mrcId,
        });
      }
    }
  }, [type, customerType, data_detailPos, mergedArrayMrc, form, idUpdate]);

  // Handle daily rate validation
  useEffect(() => {
    if (data_rate === null || data_rate?.success === false) {
      setInvoiceDate(null);
      form.resetFields(["invoiceDate"]);
      setModalDailyRate(true);
    } else {
      setModalDailyRate(false);
    }
  }, [data_rate, form]);

  // Fetch rates when invoice date and currency are set
  useEffect(() => {
    if (data && invoiceDate && currency && data.length < 1) {
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
  }, [dispatch, invoiceDate, currency, data]);

  // Load global data
  useEffect(() => {
    dispatch(getGlobalType());
    dispatch(getGlobalBillingCycle());
    dispatch(getGlobalCurrency());
    dispatch(getApprovalList());
    dispatch(getGlobalTermsOfPayment());
    dispatch(getGlobalAccountNumber());
    dispatch(getGlobalProductItem());
    dispatch(getGlobalBillingItem());
    dispatch(getUomCodes());
  }, [dispatch]);

  // Track missing priority data
  useEffect(() => {
    const newData = [
      { name: "Account Number", data: accountNumber },
      { name: "Currency", data: currency },
      { name: "Invoice Date", data: invoiceDate },
    ];

    const missingData = newData.filter((data) => !data.data);
    setDataMissing(missingData);
    setDataPriority(newData);
  }, [currency, accountNumber, invoiceDate]);

  // Initialize data for create/update
  useEffect(() => {
    if (type === "update") {
      dispatch(getDetailPOS(idUpdate));
    } else {
      setDataDynamic({
        totalAmountIdr: 0,
        totalAmountUsd: 0,
        amountIdr: 0,
        amountUsd: 0,
        discountAmountIdr: 0,
        discountAmountUsd: 0,
        taxBasisIdr: 0,
        taxBasisUsd: 0,
        taxBasisEqvIdr: 0,
        vatIdr: 0,
        vatUsd: 0,
        vatEqvIdr: 0,
        withholdingTax: 0,
      });
    }
  }, [dispatch, type, idUpdate]);

  // Fetch terms of payment data (customer)
  useEffect(() => {
    if (customerType === "customer" && hasValue(accountNumber)) {
      const getAccountId = data_globalAccountNumber?.find(
        (item) => item?.accountNumber === accountNumber,
      )?.accountId;

      if (getAccountId) {
        dispatch(getGlobalTermsOfPaymentData(getAccountId));
      }
    }
  }, [customerType, accountNumber, data_globalAccountNumber, dispatch]);

  // Fetch terms of payment data (prospective) once on type change
  useEffect(() => {
    if (customerType === "prospective") {
      dispatch(getGlobalTermsOfPaymentData(null));
    }
  }, [customerType, dispatch]);

  // Populate form for UPDATE mode
  useEffect(() => {
    if (
      type === "update" &&
      data_detailPos &&
      data_detailPos.id === idUpdate &&
      data_globalProduct &&
      data_globalCurrency &&
      data_globalBillingCycle
    ) {
      const isProspective = data_detailPos.customerType === 2;

      const transDate = moment(data_detailPos?.transactionDate);
      const invDate = moment(data_detailPos?.invoiceDate);

      setSelectedTransactionDate(transDate);
      setSelectedInvoiceDate(invDate);

      setValueDdl({
        action: "setData",
        value: isDateString(data_detailPos?.termsOfPayment) ? "DATE" : "TOP",
      });
      setDataApprovalId(data_detailPos?.appHierId);

      if (isProspective) {
        const sorId = data_sor_list?.find(
          (item) => item.name === data_detailPos?.sor,
        )?.id;

        const costCenterString = data_detailPos?.costcenter || "";

        const costCenterCode = costCenterString.split(" - ")[0]?.trim();

        const ccId = data_cost_center_list?.find(
          (item) =>
            item.code === costCenterCode ||
            item.name === costCenterCode ||
            costCenterString.includes(item.name),
        )?.id;

        const costCenterNames = costCenterString
          ? costCenterString.split(",").map((name) => name.trim())
          : [];

        const costCenterIds =
          costCenterNames.length > 0
            ? data_cost_center_list
                ?.filter((cc) => {
                  return costCenterNames.some((name) => {
                    const code = name.split(" - ")[0]?.trim();
                    return (
                      cc.code === code ||
                      cc.name === code ||
                      name.includes(cc.name)
                    );
                  });
                })
                .map((cc) => cc.id)
            : [];

        const accountSegmentId = data_account_segment?.find(
          (item) => item.name === data_detailPos?.accountSegment,
        )?.id;

        const accountGroupTypeId = data_account_group_type?.find(
          (item) =>
            (item.glbValue || item.name) === data_detailPos?.accountGroupType,
        )?.glbTypeValId;

        setDefaultData({
          sor: sorId,
          costcenter:
            costCenterIds.length > 0 ? costCenterIds : ccId ? [ccId] : [],
        });

        form.setFieldsValue({
          customerName: data_detailPos?.customerName,
          registrationNumber: data_detailPos?.registrationNumber,
          accountName: data_detailPos?.accountName,
          currency: data_globalCurrency?.find(
            (item) => item.text === data_detailPos?.currency,
          )?.Id,
          apphierId: data_detailPos?.appHierId,
          transactionDate: moment(data_detailPos?.transactionDate),
          invoiceDate: moment(data_detailPos?.invoiceDate),
          email: data_detailPos?.email,
          address: data_detailPos?.address,
          billingCycle: data_globalBillingCycle?.find(
            (item) => item.name === data_detailPos?.billingCycle,
          )?.id,
          billingPeriod: data_detailPos?.billingPeriod,
          remark: data_detailPos?.remark,
          sor: sorId,
          costcenter: ccId,
          accountSegment: accountSegmentId,
          accountGroupType: accountGroupTypeId,
        });

        setAccountNumber(data_detailPos?.registrationNumber);

        if (ccId) {
          const body = {
            ccIds: [{ ccId: ccId }],
          };
          dispatch(getMeterReadingCodeList(body));
          setIsCostCenterFilled(true);
        } else if (costCenterIds && costCenterIds.length > 0) {
          const body = {
            ccIds: costCenterIds.map((id) => ({ ccId: id })),
          };
          dispatch(getMeterReadingCodeList(body));
          setIsCostCenterFilled(true);
        }

        if (accountSegmentId) {
          setIsAccountSegmentFilled(true);
          dispatch(getAccountGroupTypeList([accountSegmentId]));
        }
      } else {
        handleSetFormUpdate(data_detailPos, data_globalCurrency);
        setAccountNumber(data_detailPos?.accountNumber);
      }
      setCurrency(
        data_globalCurrency?.find(
          (item) => item.text === data_detailPos?.currency,
        )?.Id,
      );
      setInvoiceDate(moment(data_detailPos?.invoiceDate));
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
        taxRate: data_detailPos.taxRateValue || "",
        taxRateDate: data_detailPos.taxRateDate || "",
        taxRateType: data_detailPos.taxRateType || "",
      });
      setData(
        data_detailPos?.mrbiPosDetails?.map((item) => {
          let temp = {
            ...item,
            price: item?.price || 0,
            amount: item?.amount || 0,
            amountEqvUsd: Number(item?.amountEqvUsd.toFixed(2)) || 0,
            amountEqvIdr: item?.amountEqvIdr || 0,
            eqvIdr: item?.eqvIdr || 0,
            totalEqvIdr: item?.totalEqvIdr || 0,
            totalEqvUsd: Number(item?.totalEqvUsd.toFixed(2)) || 0,
          };
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
    idUpdate,
    data_sor_list,
    data_cost_center_list,
    data_account_segment,
    data_account_group_type,
    form,
    dispatch,
  ]);

  // Set rate data from API
  useEffect(() => {
    if (data_rate && data_rate_tax) {
      setDataDynamic({
        ...dataDynamic,
        rateType: data_rate?.rateType,
        rate: data_rate?.rate,
        rateDate: data_rate.rateDate
          ? moment(data_rate?.rateDate).format(dateFormatting.date)
          : "",
        taxRateType: data_rate_tax?.rateType,
        taxRate: data_rate_tax?.rate,
        taxRateDate: data_rate_tax?.rateDate
          ? moment(data_rate?.rateDate).format(dateFormatting.date)
          : "",
      });
    }
  }, [data_rate, data_rate_tax]);

  // Calculate POS totals and materai
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
              item.typeId === 2144 &&
              data.some(
                (dataItem) => dataItem.reference === parseInt(item.itemId),
              )
            ) {
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
              tempSum.withholdingTax += item.totalEqvIdr || 0;
            }
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
            }
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
            taxBasisIdr: 0,
            taxBasisUsd: 0,
            taxBasisEqvIdr: 0,
            vatIdr: 0,
            vatUsd: 0,
            vatEqvIdr: 0,
            withholdingTax: 0,
            totalEqvIdr: 0,
            totalEqvUsd: 0,
          },
        );
      if (
        newDataDynamic.totalEqvIdr >= 5000000 &&
        !data.some(
          (item) => item.item === "Meterai" || parseInt(item.itemId) === 297,
        )
      ) {
        dispatch(
          getMaterai({
            transactionDate: moment(invoiceDate).format(
              dateFormatting.dateFormal,
            ),
          }),
        )
          .unwrap()
          .then((dataRes) => {
            dataMaterai = {
              typeId: dataRes?.type,
              type: dataRes?.typeName,
              itemId: parseInt(dataRes?.item),
              item: dataRes?.itemName,
              price: dataRes?.price,
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
          taxBasisUsd: newDataDynamic.taxBasisUsd,
          taxBasisIdr: newDataDynamic.taxBasisIdr,
          taxBasisEqvIdr: newDataDynamic.taxBasisEqvIdr,
          vatUsd: newDataDynamic.vatUsd,
          vatIdr: newDataDynamic.vatIdr,
          vatEqvIdr: newDataDynamic.vatEqvIdr,
          withholdingTax: newDataDynamic.withholdingTax,
          totalEqvIdr:
            newDataDynamic.totalEqvIdr +
            (dataMaterai.totalEqvIdr ? parseInt(dataMaterai.totalEqvIdr) : 0),
          totalEqvUsd:
            newDataDynamic.totalEqvUsd +
            (dataMaterai.totalEqvUsd ? parseInt(dataMaterai.totalEqvUsd) : 0),
        };
        setDataDynamic({ ...dataDynamic, ...dataCalculate });
      }
    }
  }, [data, dispatch, invoiceDate]);

  // Fetch billing period data
  useEffect(() => {
    if (dataBillingCycle && dataBillingCycle !== undefined) {
      dispatch(getGlobalBillingPeriod(dataBillingCycle));
    }
  }, [dispatch, dataBillingCycle]);

  // Fetch approval detail
  useEffect(() => {
    if (dataApprovalId && dataApprovalId !== undefined) {
      dispatch(getApprovalListDetail(dataApprovalId));
    }
  }, [dispatch, dataApprovalId]);

  // Transform approval list data
  useEffect(() => {
    if (data_approvalList) {
      const tempAppHier = (data_approvalList || []).map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));

      setDataApproval(tempAppHier);
    }
  }, [data_approvalList]);

  // Transform approval detail data
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

  // Set account data for customer
  useEffect(() => {
    if (accountNumber && customerType === "customer") {
      setDataAccount(
        data_globalAccountNumber?.find(
          (item) => item.accountNumber === accountNumber,
        ),
      );
    }
  }, [accountNumber, customerType, data_globalAccountNumber]);

  // Populate form with account data
  useEffect(() => {
    if (dataAccount && customerType === "customer") {
      form.setFieldsValue({
        ...dataAccount,
      });
    }
  }, [dataAccount, customerType, form]);

  // Handle terms of payment DDL changes
  useEffect(() => {
    if (valueDdl) {
      form.resetFields(["termType", "termValue"]);
      handleSetFormTypeValueDdl(valueDdl, data_detailPos);
      setDdlFinal(valueDdl);
    }
  }, [valueDdl, handleSetFormTypeValueDdl, data_detailPos, form]);

  // Set terms of payment value
  useEffect(() => {
    if (hasValue(ddlFinal?.value)) {
      handleSetFormTypeTOP(ddlFinal, data_detailPos);
    }
  }, [ddlFinal, handleSetFormTypeTOP, data_detailPos]);

  // Update value page based on current step
  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const handleSubmit = () => {
    setTypeSubmit(true);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setTypeSubmit(false);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const onFinish = (e) => {
    let errorBody = {};
    if (dataAttachment.length === 0) {
      handleMandatory(setDataTabs, dataAttachment);
    } else {
      handleMandatory(setDataTabs, dataAttachment);
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

  const handleSendData = (e) => {
    setModalConfirm(false);

    const calculateAmount = data.map((a) => a.amount);
    const sumAmount = calculateAmount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    const calculateDiscount = data.map((a) => a.discount);
    const sumDiscount = calculateDiscount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    const dataTypeTOP = data_globalTermsOfPaymentValue?.find(
      (item) => item.Id === e.termType.termValue,
    );

    const billingCycleId =
      typeof e?.billingCycle === "number"
        ? e?.billingCycle
        : data_globalBillingCycle?.find((item) => item.name === e?.billingCycle)
            ?.id;

    // Helper functions to convert ID to NAME or return existing NAME
    const getSorName = () => {
      if (customerType === "prospective" && e?.sor) {
        if (typeof e.sor === "string") {
          return e.sor;
        } else {
          const sorItem = data_sor_list?.find((item) => item.id === e.sor);
          return sorItem ? sorItem.name : "";
        }
      }
      return e?.sor || "";
    };

    const getMrcName = () => {
      if (customerType === "prospective" && e?.meterReadingCode) {
        if (typeof e.meterReadingCode === "string") {
          return e.meterReadingCode;
        } else {
          const mrc = mergedArrayMrc?.find(
            (item) => item.id === e.meterReadingCode,
          );
          return mrc ? mrc.name : "";
        }
      }
      return e?.meterReadingCode || "";
    };

    const getAccountSegmentName = () => {
      if (customerType === "prospective" && e?.accountSegment) {
        if (typeof e.accountSegment === "string") {
          return e.accountSegment;
        } else {
          const segment = data_account_segment?.find(
            (item) => item.id === e.accountSegment,
          );
          return segment ? segment.name : "";
        }
      }
      return e?.accountSegment || "";
    };

    const getAccountGroupTypeName = () => {
      if (customerType === "prospective" && e?.accountGroupType) {
        if (typeof e.accountGroupType === "string") {
          return e.accountGroupType;
        } else {
          const groupType = data_account_group_type?.find(
            (item) => item.glbTypeValId === e.accountGroupType,
          );
          return groupType ? groupType.glbValue || groupType.name : "";
        }
      }
      return e?.accountGroupType || "";
    };

    const getCostCenterName = () => {
      if (customerType === "prospective" && e?.costcenter) {
        if (typeof e.costcenter === "string") {
          return e.costcenter;
        } else {
          const cc = data_cost_center_list?.find(
            (item) => item.id === e.costcenter,
          );
          return cc ? cc.name : "";
        }
      }
      return e?.costcenter || e?.costCenter || "";
    };

    let body = {
      id: type === "create" ? undefined : idUpdate,
      posNumber: type === "create" ? undefined : idPos,
      customerType: getCustomerTypeNumber(customerType),
      customerName: e?.customerName,
      accountName: e?.accountName,

      ...(customerType === "customer" && {
        customerNumber: e?.customerNumber,
        accountNumber: e?.accountNumber,
        registrationNumber: null,
        email: null,
        address: null,
      }),

      ...(customerType === "prospective" && {
        registrationNumber: e?.registrationNumber,
        accountNumber: null,
        email: e?.email || "",
        address: e?.address || "",
        customerNumber: null,
      }),

      sor: getSorName(),
      costcenter: getCostCenterName(),
      meterReadingCode: getMrcName(),
      accountSegment: getAccountSegmentName(),
      accountGroupType: getAccountGroupTypeName(),
      billingCycleId: billingCycleId,
      billingCycle:
        data_globalBillingCycle?.find((item) => item.id === e?.billingCycle)
          ?.name || e?.billingCycle,
      billingPeriod:
        data_globalBillingPeriod?.find((item) => item.id === e?.billingPeriod)
          ?.name || e?.billingPeriod,
      currency:
        data_globalCurrency?.find((item) => item.Id === e?.currency)?.text ||
        e?.currency,
      transactionDate: moment(e?.transactionDate).format("DD MMM YYYY"),
      invoiceDate: moment(e?.invoiceDate).format("DD MMM YYYY"),
      termsOfPayment: moment.isMoment(e?.termType?.termValue)
        ? moment(e?.termType?.termValue).format(dateFormatting.date)
        : data_globalTermsOfPaymentValue?.find(
            (item) => item.Id === e?.termType?.termValue,
          )?.text || e?.termType?.termValue,
      remark: e?.remark,

      appHierId: dataApprovalId,
      submit: typeSubmit,
      topDataType: dataTypeTOP === undefined ? null : dataTypeTOP?.topDataType,
      topId: e.termType.termValueDdl,

      rate: parseFloat(dataDynamic?.rate.replace(/,/g, "")) || 0,
      rateDate: dataDynamic?.rateDate
        ? moment(dataDynamic.rateDate, dateFormatting.date).format(
            "DD MMM YYYY",
          )
        : null,
      rateType: dataDynamic?.rateType || null,
      taxRate: parseFloat(dataDynamic?.taxRate.replace(/,/g, "")) || 0,
      taxRateDate: dataDynamic?.taxRateDate
        ? moment(dataDynamic.taxRateDate, dateFormatting.date).format(
            "DD MMM YYYY",
          )
        : null,
      taxRateType: dataDynamic?.taxRateType || null,

      amount: sumAmount,
      discountAmount: sumDiscount,
      totalAmountIdr: dataDynamic?.totalAmountIdr || 0,
      totalAmountUsd: dataDynamic?.totalAmountUsd || 0,
      amountIdr: dataDynamic?.amountIdr || 0,
      amountUsd: dataDynamic?.amountUsd || 0,
      discountAmountIdr: dataDynamic?.discountAmountIdr || 0,
      discountAmountUsd: dataDynamic?.discountAmountUsd || 0,
      taxBasisIdr: dataDynamic?.taxBasisIdr || 0,
      taxBasisUsd: dataDynamic?.taxBasisUsd || 0,
      taxBasisEqvIdr: dataDynamic?.taxBasisEqvIdr || 0,
      vatIdr: dataDynamic?.vatIdr || 0,
      vatUsd: dataDynamic?.vatUsd || 0,
      vatEqvIdr: dataDynamic?.vatEqvIdr || 0,
      withholdingTax: dataDynamic?.withholdingTax || 0,
      totalEqvIdr: dataDynamic?.totalEqvIdr || 0,
      totalEqvUsd: dataDynamic?.totalEqvUsd || 0,

      mrbiPosDetails: data?.map((item) => ({
        posDetailId: item?.posDetailId,
        posNumber: item?.posNumber,
        lineNumber: item?.lineNumber || 0,
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
      })),
    };

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
            const attachBody = {
              files: element.file,
              refId: id,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/pos/upload-attachment`,
              attachBody,
            );
          }

          navigate(RBI_ROUTES.POS_VIEW, { replace: true });

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
            const attachBody = {
              files: element.file,
              refId: id,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/pos/upload-attachment`,
              attachBody,
            );
          }

          navigate(RBI_ROUTES.POS_VIEW, { replace: true });

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
    }
  };

  const handleRetry = () => {
    handleSendData(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setDataTabs, dataAttachment, errorFields);
  };

  const handleChangeSOR = (selectedSorId) => {
    form.resetFields([
      "costcenter",
      "meterReadingCode",
      "accountSegment",
      "accountGroupType",
    ]);
  };

  const handleChangeCostCenter = (selectedCostCenterId) => {
    form.resetFields(["meterReadingCode"]);
    setIsCostCenterFilled(!!selectedCostCenterId);

    if (selectedCostCenterId) {
      const body = { ccIds: [{ ccId: selectedCostCenterId }] };
      dispatch(getMeterReadingCodeList(body));
    }
  };

  const handleClearOrReset = () => {
    if (type === "update") {
      if (data_detailPos && type === "update") {
        const isProspective = data_detailPos.customerType === 2;

        setValueDdl({
          action: "setData",
          value: isDateString(data_detailPos?.termsOfPayment) ? "DATE" : "TOP",
        });

        if (isProspective) {
          const sorId = data_sor_list?.find(
            (item) => item.name === data_detailPos?.sor,
          )?.id;

          const costCenterNames = data_detailPos?.costcenter
            ? data_detailPos.costcenter.split(",").map((name) => name.trim())
            : [];

          const costCenterIds =
            costCenterNames.length > 0
              ? data_cost_center_list
                  ?.filter((cc) => costCenterNames.includes(cc.name))
                  .map((cc) => cc.id)
              : [];

          const accountSegmentId = data_account_segment?.find(
            (item) => item.name === data_detailPos?.accountSegment,
          )?.id;

          const accountGroupTypeId = data_account_group_type?.find(
            (item) =>
              (item.glbValue || item.name) === data_detailPos?.accountGroupType,
          )?.glbTypeValId;

          form.setFieldsValue({
            customerName: data_detailPos?.customerName,
            registrationNumber: data_detailPos?.registrationNumber,
            accountName: data_detailPos?.accountName,
            currency: data_globalCurrency?.find(
              (item) => item.text === data_detailPos?.currency,
            )?.Id,
            apphierId: data_detailPos?.appHierId,
            transactionDate: moment(data_detailPos?.transactionDate),
            invoiceDate: moment(data_detailPos?.invoiceDate),
            email: data_detailPos?.email,
            address: data_detailPos?.address,
            billingCycle: data_globalBillingCycle?.find(
              (item) => item.name === data_detailPos?.billingCycle,
            )?.id,
            billingPeriod: data_detailPos?.billingPeriod,
            remark: data_detailPos?.remark,
            sor: sorId,
            costcenter: costCenterIds.length > 0 ? costCenterIds[0] : undefined,
            accountSegment: accountSegmentId,
            accountGroupType: accountGroupTypeId,
          });

          setAccountNumber(data_detailPos?.registrationNumber);
        } else {
          handleSetFormUpdate(data_detailPos, data_globalCurrency);
          setAccountNumber(data_detailPos?.accountNumber);
        }

        setData(
          data_detailPos?.mrbiPosDetails?.map((item) => {
            let temp = {
              ...item,
              price: item?.price || 0,
              amount: item?.amount || 0,
              amountEqvUsd: Number(item?.amountEqvUsd.toFixed(2)) || 0,
              amountEqvIdr: item?.amountEqvIdr || 0,
              eqvIdr: item?.eqvIdr || 0,
              totalEqvIdr: item?.totalEqvIdr || 0,
              totalEqvUsd: Number(item?.totalEqvUsd.toFixed(2)) || 0,
            };
            return temp;
          }),
        );
        setCurrency(
          data_globalCurrency?.find(
            (item) => item.text === data_detailPos?.currency,
          )?.Id,
        );
        setInvoiceDate(moment(data_detailPos?.invoiceDate));
        setDataBillingCycle(
          data_globalBillingCycle?.find(
            (item) => item.name === data_detailPos?.billingCycle,
          )?.id,
        );
        setDataAttachment(
          (data_detailPos?.mattachments || []).map((item) => ({
            ...item,
            dataType: "exist",
          })),
        );
        setDataApprovalId(data_detailPos?.appHierId);
      }
    } else {
      setRangeDisableDate({});
      form.resetFields();
      setData([]);
      setAccountNumber();
      setIsCostCenterFilled(false);
      setIsAccountSegmentFilled(false);
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

  const handleBack = () => {
    setModalBack(true);
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingForm || loadingAccount}>
        <BreadCrumb routes={routes} />

        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />

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
              display: valuePage !== dataTabs[0].value ? "none" : undefined,
            }}
          >
            <PointOfSalesPage
              form={form}
              isCostCenterFilled={isCostCenterFilled}
              isAccountSegmentFilled={isAccountSegmentFilled}
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
              customerType={customerType}
              defaultData={defaultData}
              onSorChange={handleChangeSOR}
              onCostCenterChange={handleChangeCostCenter}
              onMeterReadingCodeChange={handleMeterReadingCodeChange}
              onAccountSegmentChange={handleAccountSegmentChange}
              data_account_segment={data_account_segment}
              data_account_group_type={data_account_group_type}
              data_meter_reading_code_list={data_meter_reading_code}
              data_sor_list={data_sor_list}
              data_cost_center_list={data_cost_center_list}
              data_uom_codes={data_uom_codes}
              mergedArrayMrc={mergedArrayMrc}
              selectedTransactionDate={selectedTransactionDate}
              setSelectedTransactionDate={setSelectedTransactionDate}
              selectedInvoiceDate={selectedInvoiceDate}
              setSelectedInvoiceDate={setSelectedInvoiceDate}
            />
          </div>

          <div
            style={{
              display: valuePage !== dataTabs[1].value ? "none" : undefined,
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
              display: valuePage !== dataTabs[2].value ? "none" : undefined,
            }}
          >
            <PointOfSalesPageAttachment
              dispatch={dispatch}
              dataAttachment={dataAttachment}
              setDataAttachment={setDataAttachment}
              type={type}
            />
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClearOrReset}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
          />
        </Form>

        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header={`Confirmation`}
          width={900}
          handleCancel={() => setModalConfirm(false)}
          footer={
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                type={"default"}
                onClick={() => setModalConfirm(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={() => handleSendData(dataSend)}
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

        <ModalError
          isOpen={modalDailyRate}
          handleOk={() => setModalDailyRate(false)}
          handleCancel={() => setModalDailyRate(false)}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Daily Rates not found. Please try again`}</p>
          </div>
        </ModalError>

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
