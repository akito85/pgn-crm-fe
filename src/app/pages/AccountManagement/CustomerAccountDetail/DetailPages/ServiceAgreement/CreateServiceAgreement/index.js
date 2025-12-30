import React, { useState, useRef, useEffect } from "react";
import { Form, Steps, Button, Spin, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { IconModal } from "../../../../../../../utils/Icon";
import accountManagementPromoHttpService from "../../../../../../../redux/services/account_management/accountManagementService";
import BaseContainer from "../../../../../../../components/BaseContainer";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import HeaderDetail from "../../../HeaderDetail";
import SaInformation from "./SaInformation";
import SaDetail from "./SaDetail";
import Attachment from "./Attachment";
import Approval from "./Approval";
import {
  getListTermOfPayment,
  getPjbg,
  getSaType,
  getServiceType,
  getListBillingCycle,
  getInvoiceTemplate,
  getApprovalList,
  getDetailApproval,
  getDetailProductSa,
  getDetailProductByVersion,
  createServiceAgreement,
  resetDataDetail,
  getPriceCode,
  getPriceRule,
  getListChooseTos,
  checkValidateCreateSa,
  getDetailServiceAgreement,
} from "../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import {
  ModalError,
} from "../../../../../../../components/Modal/ModalPopUp";
import ConfirmationSa from "./Modal/ConfirmationSa";
import { hasValue } from "../../../../../../../utils";

const CreateServiceAgreement = ({ saType }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const segmentElement = headerRef?.current?.querySelector("#segment");
  const segmentValue = segmentElement?.innerText;
  const [form] = Form.useForm();
  const formValue = form.getFieldValue();

  const [tabPagesSaDetail, setTabPagesSaDetail] = useState([
    { value: "Pricing", paramValue: ["priceCode"] },
    { value: "Calculation Rule", paramValue: ["calculationType"] },
    { value: "Term of Service" },
    { value: "Late Charge" },
    { value: "Tax Implication" },
  ]);

  const [valuePageSaDetail, setValuePageSaDetail] = useState(
    tabPagesSaDetail[0].value
  );
  const [modalSaDetail, setModalSaDetail] = useState(false);
  const [modalChooseProduct, setModalChooseProduct] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataFinal, setDataFinal] = useState({});
  const [productInfoObj, setProductInfoObj] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [data, setData] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [saInfoObj, setSaInfoObj] = useState({});
  const [saDetailObj, setSaDetailObj] = useState();
  const [saApprovalObj, setSaApprovalObj] = useState({});
  const [typeSubmit, setTypeSubmit] = useState("");
  const [dataListVersion, setDataListVersion] = useState([]);

  const [dataTableDetailProduct, setDataTableDetailProduct] = useState({});
  const [modalValidateSa, setModalValidateSa] = useState(false);
  const [messageValidateSa, setMessageValidateSa] = useState("");

  // For SA Information Date
  const [serviceAgreementDate, setServiceAgreementDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gasInPlanDate, setGasInPlanDate] = useState("");
  const [commitmentDate, setCommitmentDate] = useState("");

  // For approval
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [dataTableApproval, setDataTableApproval] = useState([]);

  // Table Data Product Detail
  const [dataTableProduct, setDataTableProduct] = useState([]);
  // Table Data Pricing Rule
  const [dataPricing, setDataPricing] = useState([]);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [ddlPriceCode, setDdlPriceCode] = useState([]);
  const [ddlPriceRule, setDdlPriceRule] = useState([]);
  // Table Data Calculation Rule
  const [dataTableCalcRule, setDataTableCalcRule] = useState([]);
  // Table Data TOS
  const [dataTermOfService, setDataTermOfService] = useState([]);
  // Table Data Late Charge
  const [dataTableLateCharge, setDataTableLateCharge] = useState([]);
  const [sendLateCharge, setSendLateCharge] = useState({});
  // Table Data Tax Implication
  const [dataTaxImplication, setDataTaxImplication] = useState([]);
  // Price Adjustment
  const [priceAdjustment, setPriceAdjustment] = useState("");
  const [priceAdjustmentSelect, setPriceAdjustmentSelect] = useState("");
  const [priceAdjustmentSelectId, setPriceAdjustmentSelectId] = useState(null);

  const [modalValidateAttachment, setModalValidateAttachment] = useState(false);

  // Selector Slice
  const {
    data_service_type,
    data_sa_type = [],
    data_pjbg = [],
    data_term_of_payment,
    data_billing_cycle,
    data_invoice_template,
    data_approval_list,
    data_approval_detail,
    data_product_detail,
    data_tax_implication,
    data_price_rule,
    data_price_code,
    data_pricing_rule_list,
    data_list_choose_tos,
    data_late_charge,
    data_detail,
    loading,
  } = useSelector((state) => state.accountServiceAgreement);

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const isLoading = loading || loadingForm;

  // set Reset if amandemen / addon
  const [isReset, setIsReset] = useState(false);

  // State Location
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type;
  const isMain = location?.state?.isMain;
  const saReferenceNumber = location?.state?.saReferenceNumber;
  const saRecordData = location?.state;
  const idSa = location?.state?.idSa;

  const stateSave = {
    idAccount: idAccount,
    idCustomer: idCustomer,
    type: type,
    isMain: true,
    typeSa: "main",
    productTypeId: 245,
  };
  // Use Effect
  useEffect(() => {
    dispatch(getServiceType());
    // dispatch(getSaType())
    dispatch(getPjbg());
    dispatch(getListTermOfPayment(idAccount));
    dispatch(getListBillingCycle());
    dispatch(getInvoiceTemplate(idAccount));
    dispatch(getApprovalList());
    setSaDetailObj({ createFrom: 1 });
    form.setFieldsValue({ createFrom: 1 });
    dispatch(resetDataDetail());
    setDataTableDetailProduct({});
  }, []);

  useEffect(() => {
    let typeSa = saRecordData?.typeSa === "main" ? "main" : "addon";
    if (saInfoObj.serviceType !== undefined) {
      dispatch(getSaType({ type: typeSa, id: saInfoObj.serviceType }));
    }
  }, [saRecordData?.typeSa, saInfoObj?.serviceType]);

  useEffect(() => {
    if (saReferenceNumber) {
      setSaInfoObj({
        ...saInfoObj,
        serviceAgreementReferenceNumber: saReferenceNumber,
        saReferenceNumber: saRecordData?.saReferenceNumber,
        serviceType: saRecordData?.serviceType,
        serviceAgreementType: saRecordData?.typeSa === "addon" ? 92 : 91,
        pjbgType: saRecordData?.pjbgType,
        billingCycle: saRecordData?.billingCycle,
        // startDate: moment(saRecordData?.startDate).clone(),
        // endDate: moment(saRecordData?.endDate).clone(),
        termOfPayment: saRecordData?.termOfPayment,
        invoiceTemplate: saRecordData?.invoiceTemplate,
        // serviceAgreementDate: moment(saRecordData?.saDate).clone()
      });
      form.setFieldsValue({
        serviceAgreementReferenceNumber: saReferenceNumber,
        saReferenceNumber: saRecordData?.saReferenceNumber,
        serviceType: saRecordData?.serviceType,
        serviceAgreementType: saRecordData?.typeSa === "addon" ? 92 : 91,
        pjbgType: saRecordData?.pjbgType,
        billingCycle: saRecordData?.billingCycle,
        // startDate: moment(saRecordData?.startDate).clone(),
        // endDate: moment(saRecordData?.endDate).clone(),
        termOfPayment: saRecordData?.termOfPayment,
        invoiceTemplate: saRecordData?.invoiceTemplate,
        // serviceAgreementDate: moment(saRecordData?.saDate).clone()
      });
    }
  }, [isReset]);

  useEffect(() => {
    if (data_approval_detail?.length > 0) {
      setDataTableApproval(data_approval_detail);
    }
  }, [data_approval_detail]);

  // get data for Create Amandemen
  useEffect(() => {
    if (idSa && saRecordData?.typeSa === "Amendment") {
      dispatch(getDetailServiceAgreement(idSa))
        .unwrap()
        .then((data) => {
          // Start DDL Product Selected
          const tempProductDetail = data?.saDetail;
          const paymentTypeId = 210;
          const chargingMethodId = 214;
          const hasIdpaymentTypeId = tempProductDetail.filter(
            (item) => item.nameId === paymentTypeId
          );
          const haschargingMethodId = tempProductDetail.filter(
            (item) => item.nameId === chargingMethodId
          );
          // End DDL Product Selected

          // Start Ddl Calc Rule - Calc Type
          const tempCalcRuleDetail = data?.saCalcRule;
          const calculationTypeId = 687;
          const hasIdCalcTypeId = tempCalcRuleDetail.filter(
            (item) => item.nameId === calculationTypeId
          );
          // End Ddl Calc Rule - Calc Type

          //Price Adjustment logic
          let cleanedString = "";
          const priceAdjustmentOne = data?.saInfo?.idrAdjustment ?? null;
          const priceAdjustmentTwo = data?.saInfo?.usdAdjustment ?? null;
          const mergeTextAdjustment = `${
            priceAdjustmentOne?.adjustmentText || ""
          } - ${priceAdjustmentTwo?.adjustmentText || ""}`.trim();
          cleanedString = mergeTextAdjustment.replace(/-+$/, "");

          const mergeIdAdjustment = [
            priceAdjustmentOne?.priceAdjustmentDetailId || null,
            priceAdjustmentTwo?.priceAdjustmentDetailId || null,
          ].filter(Boolean);

          setDataListVersion(data?.versionList || []);
          setSaDetailObj({
            createFrom: data?.saInfo?.productVersionId === null ? 2 : 1,
            pricingRule: data?.saInfo?.pricingRuleId,
            priceCodeText: data?.saInfo?.fullPriceCode,
            priceCode: data?.saInfo?.idMPricing,
            pricingRuleText: data?.saInfo?.pricingRuleName,
            productName: data?.saInfo?.productName,
            productType: data?.saInfo?.productType,
            serviceTypeProduct: data?.saInfo?.serviceType,
            productClass: data?.saInfo?.productClass,
            productVersionId: data?.saInfo?.productVersionId,
            productId: data?.saInfo?.productId,
            paymentType: hasIdpaymentTypeId[0].unitId,
            chargingMethod: haschargingMethodId[0].unitId,
            calculationType: parseInt(hasIdCalcTypeId[0].unitId),
            descriptionProduct: data?.product?.description || null,
            objPaymentType: {
              name: 210,
              unit: hasIdpaymentTypeId[0].uom,
              value: null,
              description: null,
              unitName: hasIdpaymentTypeId[0].unit,
            },
            objChargingMethod: {
              name: 214,
              unit: haschargingMethodId[0].uom,
              value: null,
              description: null,
              unitName: haschargingMethodId[0].unit,
            },
            priceAdjustmentId: mergeIdAdjustment,
            priceAdjustmentText: cleanedString,
          });
          form.setFieldsValue({
            createFrom: data?.saInfo?.productVersionId === null ? 2 : 1,
            productType: data?.saInfo?.productType,
            serviceTypeProduct: data?.saInfo?.serviceType,
            productClass: data?.saInfo?.productClass,
            productVersionId: data?.saInfo?.productVersionId,
            pricingRule: data?.saInfo?.pricingRuleId,
            priceCode: data?.saInfo?.idMPricing,
            paymentType: hasIdpaymentTypeId[0].unitId,
            chargingMethod: haschargingMethodId[0].unitId,
            calculationType: parseInt(hasIdCalcTypeId[0].unitId),
            priceAdjustment: cleanedString,
            descriptionProduct: data?.product?.description || null,
          });
          handleDetailApproval(data?.saInfo?.appHierId);

          // Define Data From API
          const dataDetailPricing = (data?.saPricing || []).map(
            (item, index) => {
              return {
                currency: item.currency,
                currencyId: item.currencyId,
                description: item.description ? item.description : null,
                flag: null,
                id: item.id,
                idPricing: item.id,
                key: index + 1,
                lineNumber: item.lineNumber,
                max: item.max,
                maximumName: null,
                min: item.min,
                priceCode: item.idMPricing,
                priceCodeName: item.priceCode,
                priceDetail: `${item.value}/${item.currency}/${item.uom}`,
                unlimited: item.isUnlim == "Y" ? true : false,
                uom: item.uomId,
                uomName: item.uom,
                value: item.value,
                adjustment: item?.adjustment?.adjustmentText,
                adjustmentId: item?.adjustment?.priceAdjustmentDetailId,
              };
            }
          );

          const calculationRule = (data?.saCalcRule || []).map((item) => {
            return {
              key: `${item?.id}`,
              id: item?.id,
              name: {
                value: item?.nameId,
                label: item?.name,
                key: `${item?.nameId}`,
              },
              value: item?.value,
              unit: {
                key: item.unitId !== null ? item?.unitId : null,
                value: item.Id !== null ? item?.unitId : null,
                label: item.unit !== null ? item?.unit : null,
              },
              description: item?.description ? item?.description : null,
            };
          });
          const excludedIds = [paymentTypeId, chargingMethodId];
          const tempProductWithoutTwoNameProduct = tempProductDetail.filter(
            (item) => !excludedIds.includes(item.nameId)
          );
          const productDetail = (tempProductWithoutTwoNameProduct || []).map(
            (item) => {
              return {
                key: item?.id,
                id: item?.id,
                name: {
                  value: item?.nameId,
                  label: item?.name,
                },
                value: item?.value,
                unit: {
                  key: item.unitId !== null ? item?.unitId : null,
                  value: item.unitId !== null ? item?.unitId : null,
                  label: item.unit !== null ? item?.unit : null,
                },
                description: item?.description,
              };
            }
          );

          if (data?.saLateCharge || data?.saLateCharge !== null) {
            const dataArrayLateCharge = Object.keys(data?.saLateCharge).map(
              (key) => data?.saLateCharge[key]
            );
            const filteredDataLateCharge = dataArrayLateCharge.filter(
              (item) => item !== null
            );
            setDataTableLateCharge(filteredDataLateCharge);
          } else {
            setDataTableLateCharge([]);
          }

          if (data?.saTaxImplication || data?.saTaxImplication !== null) {
            const dataArrayTaxImplication = Object.keys(
              data?.saTaxImplication
            ).map((key) => data?.saTaxImplication[key]);
            const filteredDataTaxImplication = dataArrayTaxImplication.filter(
              (item) => item !== null
            );
            setDataTaxImplication(filteredDataTaxImplication);
          } else {
            setDataTaxImplication([]);
          }
          setSendLateCharge(data?.saLateCharge);
          setDataTableProduct(productDetail);
          setDataPricing(dataDetailPricing);
          setDataTableCalcRule(calculationRule);
          const tempTos = (data?.saTOS || []).map((item, index) => {
            return {
              ...item,
              key: index + 1,
              tosDetail: item.tosDetail?.map((b, index) => ({
                ...b,
                attributeName: b?.attribute,
                key: index + 1,
              })),
            };
          });

          setDataTermOfService(tempTos);
          // setDataTaxImplication(data?.saTaxImplication);
          // setListDataAttachment(dataAttachment);
          let cstmTiering = {
            name: "Custom Tiering",
            pricingRuleId: -1,
          };
          if (data?.saInfo?.productVersionId === null) {
            dispatch(getPriceCode(idAccount))
              .unwrap()
              .then((data) => {
                if (data) {
                  setDdlPriceCode(data);
                }
              })
              .catch(() => {
                console.log("error");
              });
            dispatch(getPriceRule(idAccount))
              .unwrap()
              .then((data) => {
                if (data) {
                  setDdlPriceRule(data);
                }
              })
              .catch(() => {
                console.log("error");
              });
          } else {
            setDdlPriceCode(data?.product?.productPricing?.priceCodeList);
            setDdlPriceRule([
              ...data?.product?.productPricing?.priceRuleList,
              cstmTiering,
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [idSa, isReset]);

  // handle get detail approval
  const handleDetailApproval = (e) => {
    dispatch(getDetailApproval(e));
  };

  const routes = (item) => {
    return [
      {
        path: "",
        breadcrumbName: "Account Management",
        state: {
          idAccount: item.idAccount,
          idCustomer: item.idCustomer,
          type: item.type,
          isMain: true,
          typeSa: "main",
          productTypeId: 245,
        },
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
        breadcrumbName: "Account Standard",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
        breadcrumbName: "Detail Customer",
        state: {
          idAccount: item.idAccount,
        },
      },
      {
        path: "",
        breadcrumbName: "Create Service Agreement",
        state: {
          idAccount: item.idAccount,
          idCustomer: item.idCustomer,
          type: item.type,
          isMain: true,
          typeSa: "main",
          productTypeId: 245,
        },
      },
    ];
  };
  // HANDLE SA INFO OBJECT
  const handleSaInformationObj = (e, type) => {
    let result;
    switch (type) {
      case "serviceAgreementNumber":
      case "description":
        result = e.target.value;
        break;
      case "alreadyGasIn":
        result = e.target.checked;
        break;
      default:
        result = e;
        break;
    }
    setSaInfoObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  // HANDLE SA DETAIL OBJECT
  const handleSaDetailObj = (e, type) => {
    let result;
    switch (type) {
      case "productName":
      case "productType":
      case "serviceType":
      case "produtClass":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setSaDetailObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  // HANDLE SA DETAIL OBJECT
  const handleSaApprovalObj = (e, type) => {
    let result = e;
    setSaApprovalObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  // ========== Start Validation SA INFO ==========
  const segment = data_accountDetail?.accountInformation?.segment;
  const validateCommitmenDate = () => {
    let obj = saInfoObj.commitmentDate;
    if (segment === "KI") {
      if (obj !== undefined || obj !== null) return obj;
    } else {
      return true;
    }
  };
  const validatePjbgType = () => {
    let obj1 = saInfoObj.pjbgType;
    if (saInfoObj.serviceType === 1) {
      if (obj1 !== undefined || obj1 !== null) {
        return obj1;
      }
    } else {
      return true;
    }
  };
  const validateGasInPlanDate = () => {
    let obj2 = saInfoObj.gasInPlanDate;
    if (
      saInfoObj.serviceType === 608 &&
      (obj2 !== undefined || obj2 !== null) &&
      !saInfoObj.alreadyGasIn
    ) {
      return obj2;
    } else {
      return true;
    }
  };
  const allValidateSaInfo = () => {
    let validate =
      !validatePjbgType() ||
      !validateGasInPlanDate() ||
      !validateCommitmenDate() ||
      !saInfoObj.serviceType ||
      !saInfoObj.serviceAgreementNumber ||
      !saInfoObj.serviceAgreementType ||
      !saInfoObj.serviceAgreementDate ||
      !saInfoObj.startDate ||
      !saInfoObj.endDate ||
      !saInfoObj.billingCycle ||
      !saInfoObj.termOfPayment ||
      !saInfoObj.invoiceTemplate;

    let validate2 =
      !formValue.serviceAgreementNumber ||
      !formValue.serviceAgreementDate ||
      !formValue.startDate ||
      !validateGasInPlanDate() ||
      !formValue.endDate;

    return isMain ? validate : validate2;
  };

  const validateSaNumb = () => {
    const regex = /^[a-zA-Z0-9\-/\.]+$/;
    if (
      regex.test(saInfoObj.serviceAgreementNumber) ||
      saInfoObj.serviceAgreementNumber === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  // ========== End Validation SA INFO ==========

  // Clear Data
  const handleClear = () => {
    if (current === 0) {
      setSaInfoObj({});
      form.resetFields([
        "serviceType",
        "serviceAgreementReferenceNumber",
        "serviceAgreementNumber",
        "serviceAgreementType",
        "pjbgType",
        "serviceAgreementDate",
        "startDate",
        "endDate",
        "billingCycle",
        "termOfPayment",
        "invoiceTemplate",
        "gasInPlanDate",
        "commitmentDate",
        "description",
      ]);
    } else if (current === 1) {
      setDataTableProduct([]);
      setDataPricing([]);
      setDdlPriceCode([]);
      setDdlPriceRule([]);
      setDataTableCalcRule([]);
      setDataTermOfService([]);
      setDataTableLateCharge([]);
      form.resetFields([
        "createFrom",
        "productType",
        "productClass",
        "serviceTypeProduct",
        "productVersionId",
      ]);
      dispatch(resetDataDetail());
      setSaDetailObj({
        createFrom: 1,
      });

      form.setFieldsValue({
        createFrom: 1,
      });
    } else if (current === 2) {
      setSaApprovalObj({});
      form.resetFields(["appHierId"]);
      setAppHierDataDetail([]);
      setDataTableApproval([]);
    } else {
      setListDataAttachment([]);
    }
    // setAppHierDataDetail([])
    // setListDataAttachment([])
    // setDataTableApproval([])
    // setDataTableProduct([])
    // dispatch(resetDataDetail());
    // setDataTaxImplication([])
    // if(isMain){
    //   form.resetFields();
    // }else{
    //   setSaInfoObj({
    //     ...saInfoObj,
    //     endDate: null
    //   })
    //   form.resetFields(['endDate', 'startDate', 'serviceAgreementDate', 'serviceAgreementNumber'])
    // }
    // setTimeout(() => {
    //   setCurrent(0)
    // }, 500);
  };

  // Handle get detail Product By id
  const getProductDetailById = (id) => {
    const body = {
      accountId: idAccount,
      productId: id,
      saDate: moment(saInfoObj.serviceAgreementDate).format("YYYY-MM-DD"),
      // saDate: 2023-10-20"
    };
    dispatch(getDetailProductSa({ body: body }))
      .unwrap()
      .then((data) => {
        if (data.product !== null) {
          // Start DDL Product Selected
          const tempProductDetail = data?.product?.productDetail;
          const paymentTypeId = 210;
          const chargingMethodId = 214;
          const hasIdpaymentTypeId = tempProductDetail.filter(
            (item) => item.nameId === paymentTypeId
          );
          const haschargingMethodId = tempProductDetail.filter(
            (item) => item.nameId === chargingMethodId
          );
          // End DDL Product Selected

          // Start Ddl Calc Rule - Calc Type
          const tempCalcRuleDetail = data?.product?.productCalcRule;
          const calculationTypeId = 687;
          const hasIdCalcTypeId = tempCalcRuleDetail.filter(
            (item) => item.nameId === calculationTypeId
          );
          // End Ddl Calc Rule - Calc Type

          // Price Adustment logic
          const priceCodeTemp = data?.product?.productPricing?.priceCodeList;
          const priceAdjustmentTemp = priceCodeTemp?.map((item) => {
            return item?.mpricingDetail;
          });
          const adjustmentOne = priceAdjustmentTemp[0][0]?.adjustment;
          const adjustmentTwo = priceAdjustmentTemp[0][1]?.adjustment;
          const mergePriceAdjustmentId = [
            adjustmentOne?.priceAdjustmentDetailId || null,
            adjustmentTwo?.priceAdjustmentDetailId || null,
          ].filter(Boolean);
          let cleanedString = "";
          if (priceAdjustmentTemp) {
            const mergedAdjustmentText = `${
              adjustmentOne?.adjustmentText || ""
            } - ${adjustmentTwo?.adjustmentText || ""}`.trim();
            cleanedString = mergedAdjustmentText.replace(/-+$/, "");
            setPriceAdjustmentSelect(cleanedString);
            setPriceAdjustmentSelectId(
              mergePriceAdjustmentId.length > 0 ? mergePriceAdjustmentId : null
            );
          }

          setModalChooseProduct(false);
          setDataListVersion(data.versionList);
          setSaDetailObj({
            ...saDetailObj,
            productClass: data.product.productClass,
            serviceTypeProduct: data.product.serviceType,
            productType: data.product.productType,
            productVersionId: data.versionList[0].id,
            productId: id,
            productName: data.product.productName,
            description: data.product.description,
            priceCode:
              data.product.productPricing.priceCodeList.length > 0
                ? data.product.productPricing.priceCodeList[0].id
                : null,
            priceCodeText:
              data?.product?.productPricing.priceCodeList.length > 0
                ? data?.product?.productPricing.priceCodeList[0].priceCode
                : null,
            pricingRule:
              data.product.productPricing.priceRuleTiering.length > 0
                ? data.product.productPricing.priceRuleList[0].pricingRuleId
                : null,
            pricingRuleText:
              data?.product?.productPricing.priceRuleTiering.length > 0
                ? data?.product?.productPricing.priceRuleList[0].name
                : null,
            paymentType: parseInt(hasIdpaymentTypeId[0].uom),
            chargingMethod: parseInt(haschargingMethodId[0].uom),
            calculationType: parseInt(hasIdCalcTypeId[0].uom),
            descriptionProduct: data.product.description || null,
            objPaymentType: {
              name: 210,
              unit: parseInt(hasIdpaymentTypeId[0].uom),
              value: null,
              description: null,
              unitName: hasIdpaymentTypeId[0].unitName,
            },
            objChargingMethod: {
              name: 214,
              unit: parseInt(haschargingMethodId[0].uom),
              value: null,
              description: null,
              unitName: haschargingMethodId[0].unitName,
            },

            objCaclucationType: {
              name: 687,
              unit: parseInt(hasIdCalcTypeId[0].uom),
              value: null,
            },
            priceAdjustmentId:
              mergePriceAdjustmentId.length > 0 ? mergePriceAdjustmentId : null,
            priceAdjustmentText: cleanedString,
          });
          form.setFieldsValue({
            productClass: data.product.productClass,
            serviceTypeProduct: data.product.serviceType,
            productType: data.product.productType,
            productVersionId: data.versionList[0].id,
            productName: data.product.productName,
            priceCode:
              data.product.productPricing.priceCodeList.length > 0
                ? data.product.productPricing.priceCodeList[0].id
                : null,
            pricingRule:
              data.product.productPricing.priceRuleTiering.length > 0
                ? data.product.productPricing.priceRuleList[0].pricingRuleId
                : null,
            paymentType: parseInt(hasIdpaymentTypeId[0].uom),
            chargingMethod: parseInt(haschargingMethodId[0].uom),
            calculationType: parseInt(hasIdCalcTypeId[0].uom),
            priceAdjustment: cleanedString,
            descriptionProduct: data.product.description || null,
            chooseProduct: data.product.productName,
          });
          setDdlPriceCode(data?.product?.productPricing?.priceCodeList);
          let cstmTiering = {
            name: "Custom Tiering",
            pricingRuleId: -1,
          };
          setDdlPriceRule([
            ...data?.product?.productPricing?.priceRuleList,
            cstmTiering,
          ]);

          const excludedIds = [paymentTypeId, chargingMethodId];
          const tempProductWithoutTwoNameProduct = tempProductDetail.filter(
            (item) => !excludedIds.includes(item.nameId)
          );
          const productDetail = (tempProductWithoutTwoNameProduct || []).map(
            (item) => {
              return {
                key: item?.id,
                id: item?.id,
                name: {
                  value: item?.nameId,
                  label: item?.name,
                },
                value: item?.value,
                unit: {
                  key: item?.uom,
                  value: item?.uom !== null ? parseInt(item?.uom) : null,
                  label: item?.unitName,
                },
                description: item?.description,
              };
            }
          );

          const tempCalcRuleWithoutCalcType = tempCalcRuleDetail.filter(
            (item) => ![687].includes(item.nameId)
          );
          const calculationRule = (tempCalcRuleWithoutCalcType || []).map(
            (item) => {
              return {
                key: `${item?.id}`,
                id: item?.id,
                name: {
                  value: item?.nameId,
                  label: item?.name,
                  key: `${item?.nameId}`,
                },
                value: item?.value,
                unit: {
                  value: item?.uom !== null ? item?.uom : null,
                  key: item?.uom,
                  label: item?.uomName,
                },
                description: item?.description,
              };
            }
          );
          const dataDetailPricing = (
            data?.product?.productPricing?.priceRuleTiering || []
          ).map((item, index) => {
            return {
              currency: item.currency,
              currencyId: item.currency,
              description: item.description,
              flag: null,
              id: item.priceCodeId,
              idPricing: item.pricingRuleDetailId,
              key: index + 1,
              lineNumber: item.lineNumber,
              max: item.max,
              maximumName: null,
              min: item.min,
              priceCode: item.priceCodeId,
              priceCodeName: item.priceCode,
              priceDetail: `${item.value}/${item.currencyName}/${item.uomName}`,
              unlimited: item.isUnlim,
              uom: item.uom,
              uomName: item.uom,
              value: item.value,
              adjustment: item?.adjustment?.adjustmentText,
              adjustmentId: item?.adjustment?.priceAdjustmentDetailId,
            };
          });

          if (data?.product?.lateCharge !== null) {
            const dataArrayLateCharge = Object.keys(
              data?.product?.lateCharge
            ).map((key) => data?.product?.lateCharge[key]);
            const filteredDataLateCharge = dataArrayLateCharge.filter(
              (item) => item !== null
            );
            setDataTableLateCharge(filteredDataLateCharge);
          } else {
            setDataTableLateCharge([]);
          }
          setSendLateCharge(data?.product?.lateCharge);
          setDataTableCalcRule(calculationRule);
          setDataTableProduct(productDetail);
          setDataPricing(dataDetailPricing);
          const tempTos = (data?.product?.productTos || []).map(
            (item, index) => {
              return {
                ...item,
                key: index + 1,
                tosDetail: item.tosDetail?.map((b, index) => ({
                  ...b,
                  attributeName: b?.attributeName,
                  key: index + 1,
                })),
              };
            }
          );
          setDataTermOfService(
            data?.product?.productTos !== null ? tempTos : []
          );
        }
      })
      .catch(() => {
        console.log("error");
      });
  };

  // Handle get detail Product By id by version
  const getDetailProductByVersionId = (id) => {
    const body = {
      accountId: idAccount,
      id: id,
    };
    dispatch(getDetailProductByVersion({ body }))
      .unwrap()
      .then((data) => {
        if (data) {
          // Start DDL Product Selected
          const tempProductDetail = data?.productDetail;
          const paymentTypeId = 210;
          const chargingMethodId = 214;
          const hasIdpaymentTypeId = tempProductDetail.filter(
            (item) => item.nameId === paymentTypeId
          );
          const haschargingMethodId = tempProductDetail.filter(
            (item) => item.nameId === chargingMethodId
          );
          // End DDL Product Selected

          // Start Ddl Calc Rule - Calc Type
          const tempCalcRuleDetail = data?.productCalcRule;
          const calculationTypeId = 687;
          const hasIdCalcTypeId = tempCalcRuleDetail.filter(
            (item) => item.nameId === calculationTypeId
          );
          // End Ddl Calc Rule - Calc Type

          // Price Adustment logic
          const priceCodeTemp = data?.productPricing?.priceCodeList;
          const priceAdjustmentTemp = priceCodeTemp?.map((item) => {
            return item?.mpricingDetail;
          });
          const adjustmentOne = priceAdjustmentTemp[0][0]?.adjustment;
          const adjustmentTwo = priceAdjustmentTemp[0][1]?.adjustment;
          const mergePriceAdjustmentId = [
            adjustmentOne?.priceAdjustmentDetailId || null,
            adjustmentTwo?.priceAdjustmentDetailId || null,
          ].filter(Boolean);
          let cleanedString = "";
          if (priceAdjustmentTemp) {
            const mergedAdjustmentText = `${
              adjustmentOne?.adjustmentText || ""
            } - ${adjustmentTwo?.adjustmentText || ""}`.trim();
            cleanedString = mergedAdjustmentText.replace(/-+$/, "");
            setPriceAdjustmentSelect(cleanedString);
            setPriceAdjustmentSelectId(
              mergePriceAdjustmentId.length > 0 ? mergePriceAdjustmentId : null
            );
          }

          setModalChooseProduct(false);
          setSaDetailObj({
            ...saDetailObj,
            productClass: data?.productClass,
            serviceTypeProduct: data?.serviceType,
            productType: data?.productType,
            productName: data?.productName,
            description: data?.description,
            priceCode:
              data?.productPricing.priceCodeList.length > 0
                ? data?.productPricing.priceCodeList[0].id
                : null,
            priceCodeText:
              data?.productPricing.priceCodeList.length > 0
                ? data?.productPricing.priceCodeList[0].priceCode
                : null,
            pricingRule:
              data?.productPricing.priceRuleList.length > 0
                ? data?.productPricing.priceRuleList[0].pricingRuleId
                : null,
            pricingRuleText:
              data?.productPricing.priceRuleList.length > 0
                ? data?.productPricing.priceRuleList[0].name
                : null,
            paymentType: parseInt(hasIdpaymentTypeId[0].uom),
            chargingMethod: parseInt(haschargingMethodId[0].uom),
            calculationType: parseInt(hasIdCalcTypeId[0].uom),
            descriptionProduct: data.description || null,
            objPaymentType: {
              name: 210,
              unit: parseInt(hasIdpaymentTypeId[0].uom),
              unitName: hasIdpaymentTypeId[0].unitName,
              value: null,
              description: null,
            },
            objChargingMethod: {
              name: 214,
              unit: parseInt(haschargingMethodId[0].uom),
              unitName: haschargingMethodId[0].unitName,
              value: null,
              description: null,
            },
            priceAdjustmentId:
              mergePriceAdjustmentId.length > 0 ? mergePriceAdjustmentId : null,
            priceAdjustmentText: cleanedString,
          });
          form.setFieldsValue({
            productClass: data?.productClass,
            serviceTypeProduct: data?.serviceType,
            productType: data?.productType,
            productName: data?.productName,
            priceCode:
              data?.productPricing.priceCodeList.length > 0
                ? data?.productPricing.priceCodeList[0].id
                : null,
            pricingRule:
              data?.productPricing.priceRuleList.length > 0
                ? data?.productPricing.priceRuleList[0].pricingRuleId
                : null,
            paymentType: parseInt(hasIdpaymentTypeId[0].uom),
            chargingMethod: parseInt(haschargingMethodId[0].uom),
            calculationType: parseInt(hasIdCalcTypeId[0].uom),
            priceAdjustment: cleanedString,
            descriptionProduct: data.description || null,
          });
          setDdlPriceCode(data?.productPricing?.priceCodeList);
          let cstmTiering = {
            name: "Custom Tiering",
            pricingRuleId: -1,
          };
          setDdlPriceRule([
            ...data?.productPricing?.priceRuleList,
            cstmTiering,
          ]);

          const excludedIds = [paymentTypeId, chargingMethodId];
          const tempProductWithoutTwoNameProduct = tempProductDetail.filter(
            (item) => !excludedIds.includes(item.nameId)
          );
          const productDetail = (tempProductWithoutTwoNameProduct || []).map(
            (item) => {
              return {
                key: item?.id,
                id: item?.id,
                name: {
                  value: item?.nameId,
                  label: item?.name,
                },
                value: item?.value,
                unit: {
                  key: item?.uom !== null ? item?.uom : null,
                  value: item?.uom !== null ? parseInt(item?.uom) : null,
                  label: item?.unitName !== null ? item?.unitName : null,
                },
                description: item?.description,
              };
            }
          );

          const tempCalcRuleWithoutCalcType = tempCalcRuleDetail.filter(
            (item) => ![687].includes(item.nameId)
          );
          const calculationRule = (tempCalcRuleWithoutCalcType || []).map(
            (item) => {
              return {
                key: `${item?.id}`,
                id: item?.id,
                name: {
                  value: item?.nameId,
                  label: item?.name,
                  key: `${item?.nameId}`,
                },
                value: item?.value,
                unit: {
                  value: item?.uom !== null ? parseInt(item?.uom) : null,
                  key: item?.uom,
                  label: item?.uomName,
                },
                description: item?.description,
              };
            }
          );
          const dataDetailPricing = (
            data?.productPricing?.priceRuleTiering || []
          ).map((item, index) => {
            return {
              currency: item.currency,
              currencyId: item.currency,
              description: item.description,
              flag: null,
              id: item.priceCodeId,
              idPricing: item.pricingRuleDetailId,
              key: index + 1,
              lineNumber: item.lineNumber,
              max: item.max,
              maximumName: null,
              min: item.min,
              priceCode: item.priceCodeId,
              priceCodeName: item.priceCode,
              priceDetail: `${item.value}/${item.currencyName}/${item.uomName}`,
              unlimited: item.isUnlim,
              uom: item.uom,
              uomName: item.uom,
              value: item.value,
              adjustment: item?.adjustment?.adjustmentText,
              adjustmentId: item?.adjustment?.priceAdjustmentDetailId,
            };
          });

          if (data?.lateCharge !== null) {
            const dataArrayLateCharge = Object.keys(data?.lateCharge).map(
              (key) => data?.lateCharge[key]
            );
            const filteredDataLateCharge = dataArrayLateCharge.filter(
              (item) => item !== null
            );
            setDataTableLateCharge(filteredDataLateCharge);
          } else {
            setDataTableLateCharge([]);
          }
          setSendLateCharge(data?.lateCharge);
          setDataTableCalcRule(calculationRule);
          setDataTableProduct(productDetail);
          setDataPricing(dataDetailPricing);
          setDataTermOfService(data?.productTos || []);
        }
      })
      .catch(() => {
        console.log("error");
      });
  };

  // const checkArrayTiering = (arr) => {
  //   if (!Array.isArray(arr)) {
  //     return false;
  //   }
  //   if (arr.length === 0) {
  //     return true;
  //   }
  //   if (arr.length >= 2) {
  //     return true;
  //   }
  //   return false;
  // }
  const checkArrayTiering = (arr) => {
    if (
      saDetailObj.pricingRule === null ||
      (saDetailObj.pricingRule === undefined && arr.length === 0)
    ) {
      return true;
    } else {
      return Array.isArray(arr) && arr.length >= 2;
    }
  };

  // ===== STEPS SERVICE AGREEMENT =====
  const steps = [
    {
      title: "Service Agreement Information",
      content: (
        <SaInformation
          saType={saType}
          handleSaInformationObj={handleSaInformationObj}
          setStartDate={setStartDate}
          setServiceAgreementDate={setServiceAgreementDate}
          setEndDate={setEndDate}
          setGasInPlanDate={setGasInPlanDate}
          setCommitmentDate={setCommitmentDate}
          segment={segment}
          dataServiceType={data_service_type?.map((item) => {
            return { id: item.id, value: item.name };
          })}
          dataSaType={data_sa_type}
          dataPjbg={data_pjbg}
          dataTermOfPayment={data_term_of_payment}
          dataBillingCycle={data_billing_cycle}
          dataInvoiceTemplate={data_invoice_template}
          saInfoObj={saInfoObj}
          saReferenceNumber={saReferenceNumber}
          form={form}
          saRecordData={saRecordData}
          dispatch={dispatch}
          idAccount={idAccount}
          setDataTaxImplication={setDataTaxImplication}
          isMain={isMain}
          setSaInfoObj={setSaInfoObj}
        />
      ),
      disabled: false,
      // allValidateSaInfo() || !validateSaNumb(),
    },
    {
      title: "Service Agreement Detail",
      content: (
        <SaDetail
          handleSaDetailObj={handleSaDetailObj}
          saDetailObj={saDetailObj}
          saInfoObj={saInfoObj}
          form={form}
          getProductDetailById={getProductDetailById}
          dataDetailProduct={data_product_detail}
          dataTableDetailProduct={dataTableDetailProduct}
          setDataTableDetailProduct={setDataTableDetailProduct}
          modalChooseProduct={modalChooseProduct}
          setModalChooseProduct={setModalChooseProduct}
          dataTableProduct={dataTableProduct}
          setDataTableProduct={setDataTableProduct}
          dataPricing={dataPricing}
          setDataPricing={setDataPricing}
          valueOrUnlimited={valueOrUnlimited}
          setValueOrUnlimited={setValueOrUnlimited}
          dataTableCalcRule={dataTableCalcRule}
          setDataTableCalcRule={setDataTableCalcRule}
          dataTermOfService={dataTermOfService}
          setDataTermOfService={setDataTermOfService}
          dataTableLateCharge={dataTableLateCharge}
          setDataTableLateCharge={setDataTableLateCharge}
          dataTaxImplication={dataTaxImplication}
          setDataTaxImplication={setDataTaxImplication}
          getDetailProductByVersionId={getDetailProductByVersionId}
          idAccount={idAccount}
          getListChooseTos={getListChooseTos}
          dataListChooseTos={data_list_choose_tos}
          dataPriceRule={data_price_rule}
          dataPriceCode={data_price_code}
          dataPricingTable={data_pricing_rule_list}
          setSaDetailObj={setSaDetailObj}
          setDdlPriceCode={setDdlPriceCode}
          ddlPriceCode={ddlPriceCode}
          ddlPriceRule={ddlPriceRule}
          setDdlPriceRule={setDdlPriceRule}
          dataListVersion={dataListVersion}
          isMain={isMain}
          data_detail={data_detail}
          setDataListVersion={setDataListVersion}
          saRecordData={saRecordData}
          setSendLateCharge={setSendLateCharge}
          setPriceAdjustment={setPriceAdjustment}
          priceAdjustment={priceAdjustment}
          priceAdjustmentSelect={priceAdjustmentSelect}
          setPriceAdjustmentSelect={setPriceAdjustmentSelect}
          priceAdjustmentSelectId={priceAdjustmentSelectId}
          setPriceAdjustmentSelectId={setPriceAdjustmentSelectId}
          valuePage={valuePageSaDetail}
          setValuePage={setValuePageSaDetail}
          tabPagesSaDetail={tabPagesSaDetail}
          setTabPagesSaDetail={setTabPagesSaDetail}
        />
      ),
      // disabled: !saDetailObj.createFrom || (saDetailObj.createFrom === 1 && !saDetailObj.productName || !saDetailObj.productVersionId),
      disabled: false,
      // dataTableProduct.length === 0 ||
      // dataTableCalcRule.length === 0 ||
      // !saDetailObj.paymentType ||
      // !saDetailObj.chargingMethod ||
      // !saDetailObj.calculationType ||
      // !checkArrayTiering(dataPricing)
    },
    {
      title: "Approval",
      content: (
        <Approval
          dataApprovalList={data_approval_list}
          // dataDetailApproval={data_approval_detail}
          dataDetailApproval={dataTableApproval}
          setDataTableApproval={setDataTableApproval}
          handleDetailApproval={handleDetailApproval}
          appHierDataDetail={appHierDataDetail}
          setAppHierDataDetail={setAppHierDataDetail}
          handleSaApprovalObj={handleSaApprovalObj}
          loading={loading}
          saApprovalObj={saApprovalObj}
          form={form}
        />
      ),
      disabled: false,
      // !saApprovalObj.appHierId,
    },
    {
      title: "Attachment",
      content: (
        <Attachment
          type={"create"}
          data={listDataAttachment}
          updateData={setListDataAttachment}
        />
      ),
      disabled: false,
    },
  ];

  const navigate = useNavigate();
  const next = () => {
    if (current === 0 && saInfoObj.serviceType === 608 && isMain) {
      const body = {
        saId: idSa,
        accountId: idAccount,
        isMain: true,
        productId: null,
        startDate: null,
        endDate: null,
        saType: "main",
      };
      dispatch(checkValidateCreateSa({ body }))
        .unwrap()
        .then((data) => {
          if (data?.data?.isCreated === true) {
            setCurrent(current + 1);
          } else {
            setModalValidateSa(true);
            setMessageValidateSa(data?.message);
            setCurrent((current = 0));
          }
        })
        .catch((error) => {
          if (error?.data) {
            let message = error?.data?.message;
            if (error?.data?.data?.isCreated === false) {
              setModalValidateSa(true);
              setMessageValidateSa(message);
              setCurrent((current = 0));
            }
          }
        });
    } else if (saRecordData?.typeSa === "Amendment") {
      const body = {
        saId: idSa,
        accountId: idAccount,
        isMain: false,
        productId: null,
        startDate: moment(saInfoObj.startDate).format("YYYY-MM-DD"),
        endDate: moment(saInfoObj.endDate).format("YYYY-MM-DD"),
        saType: "Amendment",
        saReferenceNumber: saReferenceNumber,
      };
      dispatch(checkValidateCreateSa({ body }))
        .unwrap()
        .then((data) => {
          if (data?.data?.isCreated === true) {
            setCurrent(current + 1);
          } else {
            setModalValidateSa(true);
            setMessageValidateSa(data?.message);
            setCurrent((current = 0));
          }
        })
        .catch((error) => {
          if (error?.data) {
            let message = error?.data?.message;
            if (error?.data?.data?.isCreated === false) {
              setModalValidateSa(true);
              setMessageValidateSa(message);
              setCurrent((current = 0));
            }
          }
        });
    } else if (current === 1 && saRecordData?.typeSa === "addon") {
      const body = {
        saId: idSa,
        accountId: idAccount,
        isMain: false,
        productId: saDetailObj?.productId,
        startDate: moment(saInfoObj.startDate).format("YYYY-MM-DD"),
        endDate: moment(saInfoObj.endDate).format("YYYY-MM-DD"),
        saType: "addon",
        saReferenceNumber: saReferenceNumber,
      };
      dispatch(checkValidateCreateSa({ body }))
        .unwrap()
        .then((data) => {
          if (data?.data?.isCreated === true) {
            setCurrent(current + 1);
          } else {
            setModalValidateSa(true);
            setMessageValidateSa(data?.message);
            setCurrent((current = 1));
          }
        })
        .catch((error) => {
          if (error?.data) {
            let message = error?.data?.message;
            if (error?.data?.data?.isCreated === false) {
              setModalValidateSa(true);
              setMessageValidateSa(message);
              setCurrent((current = 1));
            }
          }
        });
    } else {
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const handleMandatory = (
    setTabPagesSaDetail = () => {},
    listDataAttachment,
    errorFields
  ) => {
    setTabPagesSaDetail((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value === "Calculation Rule" || item?.value === "Pricing"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item?.paramValue?.includes(next.name[0])
                    ? current + 1
                    : current,
                0
              )
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

  const functionCheckSaInformation = () => {
    form
      .validateFields()
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
  };

  const functionCheckApproval = () => {
    form
      .validateFields()
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
  };

  const funtionCheckSaDetail = () => {
    form
      .validateFields()
      .then((values) => {
        handleMandatory(setTabPagesSaDetail, listDataAttachment);
        console.log(saDetailObj?.pricingRule);

        if (dataPricing?.length < 2 && hasValue(saDetailObj?.pricingRule)) {
          setModalSaDetail(true);
        } else {
          next();
          scrollRightHandler();
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        handleMandatory(
          setTabPagesSaDetail,
          listDataAttachment,
          error.errorFields
        );
        // Handle the rejected result here
      });
  };

  const handleButtonNext = () => {
    switch (steps[current]?.title) {
      case "Service Agreement Information":
        functionCheckSaInformation();
        break;
      case "Service Agreement Detail":
        funtionCheckSaDetail();
        break;
      case "Approval":
        functionCheckApproval();
        break;
      default:
        next();
        scrollRightHandler();
        break;
    }
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  // Save/show to confirmation modal
  const handleSubmitForm = (formValue) => {
    if (listDataAttachment.length > 0) {
      const objPaymentType = {
        name: {
          label: null,
          value: 210,
        },
        unit: {
          label: null,
          value: saDetailObj.paymentType,
        },
        value: null,
        description: null,
      };
      const objChargingMethodType = {
        name: {
          label: null,
          value: 214,
        },
        unit: {
          label: null,
          value: saDetailObj.chargingMethod,
        },
        value: null,
        description: null,
      };
      const objCalcType = {
        name: {
          label: null,
          value: 687,
        },
        unit: {
          label: null,
          value: `${saDetailObj?.calculationType}`,
        },
        value: null,
      };

      const tempArrayProduct = [
        ...dataTableProduct,
        objPaymentType,
        objChargingMethodType,
      ];
      const tempArrayCalcRule = [...dataTableCalcRule, objCalcType];
      const body = {
        isDraft: typeSubmit === "draft" && true,
        saInfo: {
          saReferenceNumber: saReferenceNumber ? saReferenceNumber : null,
          accountId: idAccount,
          isMain: isMain,
          serviceType: saInfoObj.serviceType,
          saNumber: saInfoObj.serviceAgreementNumber,
          saType: saInfoObj.serviceAgreementType,
          pjbgType: saInfoObj.pjbgType,
          saDate: saInfoObj.serviceAgreementDate
            ? moment(saInfoObj.serviceAgreementDate).format("YYYY-MM-DD")
            : "",
          startDate: saInfoObj.startDate
            ? moment(saInfoObj.startDate).format("YYYY-MM-DD")
            : "",
          endDate: saInfoObj.endDate
            ? moment(saInfoObj.endDate).format("YYYY-MM-DD")
            : "",
          billingCycle: saInfoObj.billingCycle,
          termOfPayment: saInfoObj.termOfPayment,
          invoiceTemplate: saInfoObj.invoiceTemplate,
          gasInPlanDate: saInfoObj.gasInPlanDate
            ? moment(saInfoObj.gasInPlanDate).format("YYYY-MM-DD")
            : "",
          commitmentDate: saInfoObj.commitmentDate
            ? moment(saInfoObj.commitmentDate).format("YYYY-MM-DD")
            : "",
          description: saInfoObj.description || null,
          alreadyGasIn: hasValue(saInfoObj?.alreadyGasIn)
            ? saInfoObj?.alreadyGasIn
            : false,
        },
        saDetail: {
          productVersionId:
            saDetailObj.productVersionId !== undefined
              ? saDetailObj.productVersionId
              : null,
          isCustom: saDetailObj.createFrom === 1 ? "Y" : "N",
          productDetail: tempArrayProduct.map((item) => {
            return {
              name: item.name !== null ? item.name.value : null,
              unit:
                item.unit !== null && item.unit !== undefined
                  ? item.unit.value
                  : null,
              value: item.value !== null ? item.value : null,
              description:
                item.description !== null && item.description !== undefined
                  ? item.description
                  : null,
            };
          }),
          productPricing: {
            priceCodeId: saDetailObj.priceCode,
            priceRuleId: saDetailObj.pricingRule,
            priceAdjustment: saDetailObj.priceAdjustmentId || null,
            priceRuleTiering: dataPricing.map((item) => {
              return {
                line: item?.lineNumber,
                min: item?.min,
                max: item?.max,
                isUnlimited: item?.unlimited,
                priceId: item?.priceCode,
                priceAdjustment: item?.adjustmentId ? item?.adjustmentId : null,
              };
            }),
          },
          productCalcRule: tempArrayCalcRule.map((item) => {
            return {
              name: item.name !== undefined ? item.name.value : null,
              unit:
                item.unit !== null && item.unit !== undefined
                  ? `${item.unit.value}`
                  : null,
              value: item.value !== undefined ? item.value : null,
            };
          }),
          productTOS: (dataTermOfService || []).map((item) => {
            return {
              tosId: item.tosId !== undefined ? item.tosId : null,
              tosName: item.tosName !== undefined ? item.tosName : null,
              description:
                item.description !== undefined ? item.description : null,
              tosDetail:
                item.tosDetail !== undefined
                  ? item.tosDetail.map((itemDetail) => {
                      return {
                        attribute:
                          itemDetail.attribute !== undefined
                            ? parseInt(itemDetail.attribute)
                            : null,
                        unit:
                          itemDetail.unit !== undefined
                            ? itemDetail.unit
                            : null,
                        value:
                          itemDetail.value !== undefined
                            ? itemDetail.value
                            : null,
                        fromItem:
                          itemDetail.fromItem !== undefined
                            ? itemDetail.fromItem
                            : null,
                      };
                    })
                  : null,
            };
          }),
          lateChargeIDR: sendLateCharge?.lateChargeIDR?.lateChargeId || null,
          lateChargeUSD: sendLateCharge?.lateChargeUSD?.lateChargeId || null,
          taxImplicationPPN: dataTaxImplication[0]
            ? dataTaxImplication[0].taxImplicationId
            : null,
          taxImplicationPPh: dataTaxImplication[1]
            ? dataTaxImplication[1].taxImplicationId
            : null,
        },
        appHierId: saApprovalObj.appHierId,
      };
      setDataFinal(body);
      setModalConfirm(true);
    } else {
      setModalValidateAttachment(true);
    }
  };

  const handleConfirm = () => {
    // const getUniqueListBy = (arr) => {
    //   return [
    //     ...new Map(
    //       arr.map((item) => [`${item["priceId"]}~${item["min"]}`, item])
    //     ).values(),
    //   ];
    // };
    const transformArray = (array) => {
      const result = [];
      const tempObj = {};

      array.forEach((item) => {
        const key = `${item.min}_${item.max}_${item.priceId}`;
        if (tempObj[key]) {
          tempObj[key].priceAdjustment.push(item.priceAdjustment);
        } else {
          tempObj[key] = {
            ...item,
            priceAdjustment: item.priceAdjustment ? [item.priceAdjustment] : [],
          };
        }
      });

      for (const key in tempObj) {
        result.push(tempObj[key]);
      }

      return result;
    };

    const body = {
      ...dataFinal,
      saDetail: {
        ...dataFinal.saDetail,
        productPricing: {
          ...dataFinal.saDetail.productPricing,
          priceRuleTiering: transformArray(
            dataFinal.saDetail.productPricing.priceRuleTiering
          ),
        },
      },
    };

    dispatch(createServiceAgreement({ body: body }))
      .unwrap()
      .then(async (data) => {
        setLoadingForm(true);
        const idServiceagreement = data.saId;
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            category: element.categoryId,
            isUpdate: false,
          };
          await accountManagementPromoHttpService.uploadAttachment(
            `/v1/dbs/api/sa/uploadAttachment/${idServiceagreement}`,
            body
          );
        }
        setLoadingForm(false);
        setModalConfirm(false);
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
        setModalConfirm(false);
      });
    dispatch(resetDataDetail());
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

  // console.log(hasValue(saInfoObj?.alreadyGasIn));

  return (
    <div>
      <LayoutMenu>
        <Spin spinning={isLoading}>
          <BreadCrumbAdvanced routes={routes(stateSave)} />
          <div ref={headerRef}>
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={idAccount}
              idCustomer={idCustomer}
              type={type}
            />
          </div>
          <Form
            id="SaForm"
            form={form}
            layout={"vertical"}
            onFinish={handleSubmitForm}
            // onFinishFailed={handleErrorSubmit}
            scrollToFirstError={true}
          >
            {/* s Contents */}
            <BaseContainer>
              <div className="flex flex-row gap-x-6 justify-center">
                <span className="mt-[10px]">
                  <LeftCircleOutlined
                    style={{ fontSize: "24px", color: "#0075bf" }}
                    onClick={scrollLeftHandler}
                  />
                </span>
                <div
                  onScroll={handleScroll}
                  ref={containerRef}
                  className="overflow-x-scroll scrollStepsCstm"
                >
                  <Steps
                    current={current}
                    items={items}
                    labelPlacement="vertical"
                  />
                </div>
                <span className="mt-[10px]">
                  <RightCircleOutlined
                    style={{ fontSize: "24px", color: "#0075bf" }}
                    onClick={scrollRightHandler}
                  />
                </span>
              </div>
              <div className="steps-content my-6">{steps[current].content}</div>
            </BaseContainer>

            {/* Section Action Steps */}
            <div className="steps-action my-8 flex w-full justify-between gap-x-2">
              <ButtonComponent
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                onClick={() => {
                  setModalBack(true);
                }}
              >
                Back
              </ButtonComponent>
              <div className="flex w-full justify-end gap-x-4">
                <ButtonComponent
                  icon={
                    saRecordData?.typeSa === "main" ? (
                      <SVGIcon name={`IconButtonClear`} width={24} />
                    ) : (
                      <SVGIcon name={`IconButtonReset`} width={24} />
                    )
                  }
                  type="submit"
                  onClick={() =>
                    saRecordData?.typeSa === "main"
                      ? handleClear()
                      : setIsReset(!isReset)
                  }
                >
                  {saRecordData?.typeSa === "main" ? "Clear" : "Reset"}
                </ButtonComponent>
                {current > 0 && (
                  <ButtonComponent
                    onClick={() => {
                      prev();
                      scrollLeftHandler();
                    }}
                    type={"submit"}
                    icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                  >
                    Previous
                  </ButtonComponent>
                )}
                {current < steps.length - 1 && (
                  <Button
                    onClick={handleButtonNext}
                    type="primary"
                    className="ant-btn ant-btn-submit flex w-full justify-center"
                    disabled={steps[current].disabled}
                  >
                    <span className="p-1 text-[18px] text-center">Next</span>
                    <RightOutlined
                      style={{
                        justifyItems: "center",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    />
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <>
                    <ButtonComponent
                      htmlType="submit"
                      type="submit"
                      onClick={() => setTypeSubmit("draft")}
                    >
                      Save as Draft
                    </ButtonComponent>
                    <ButtonComponent
                      htmlType="submit"
                      type="submit"
                      onClick={() => setTypeSubmit("submit")}
                      // disabled={listDataAttachment.length === 0 && true}
                    >
                      Save & Submit
                    </ButtonComponent>
                  </>
                )}
              </div>
            </div>
          </Form>
        </Spin>
      </LayoutMenu>

      {/* Modal Back */}
      <Modal
        open={modalBack}
        onCancel={() => setModalBack(false)}
        className={"modal-custom"}
        centered={true}
        width={400}
        maskClosable={false}
        footer={[
          <div className={"w-full justify-end flex gap-[20px]"}>
            <ButtonComponent
              type={"default"}
              onClick={() => setModalBack(false)}
            >
              Cancel
            </ButtonComponent>
            <Link
              to={
                type === "standard"
                  ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                  : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
              }
              state={{
                section: "Service Agreement",
                idAccount: idAccount,
                idCustomer: idCustomer,
              }}
              // replace
            >
              <ButtonComponent type={"submit"}>Confirm</ButtonComponent>
            </Link>
          </div>,
        ]}
      >
        <div className="flex justify-center pt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </Modal>

      {/* Modal COnfirmation SA */}
      {modalConfirm ? (
        <ConfirmationSa
          isOpen={modalConfirm}
          setModalConfirm={setModalConfirm}
          dataFinal={dataFinal}
          handleConfirm={handleConfirm}
          listDataAttachment={listDataAttachment}
          saInfoObj={saInfoObj}
          saDetailObj={saDetailObj}
          saApprovalObj={saApprovalObj}
          dataTableApproval={dataTableApproval}
          appHierDataDetail={appHierDataDetail}
          dataTableProduct={dataTableProduct}
          dataPricing={dataPricing}
          dataTableCalcRule={dataTableCalcRule}
          dataTermOfService={dataTermOfService}
          dataTableLateCharge={dataTableLateCharge}
          dataTaxImplication={dataTaxImplication}
          dataListVersion={dataListVersion}
        />
      ) : null}

      {/** Modal Retry */}
      {modalError ? (
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
            <p className="pl-[70px]">{`Your data was not upload ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      ) : null}

      {/** Modal Validate Sa Create */}
      <ModalError
        isOpen={modalValidateSa}
        handleOk={() => setModalValidateSa(false)}
        handleCancel={() => setModalValidateSa(false)}
        customText={"Ok"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{messageValidateSa}</p>
        </div>
      </ModalError>

      {/* modal validate table at SA detail */}
      {modalSaDetail ? (
        <ModalError
          isOpen={modalSaDetail}
          handleOk={() => setModalSaDetail(false)}
          handleCancel={() => setModalSaDetail(false)}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              {IconModal["icon_error_default"]}
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">
              {`Please Input Pricing Rule, it must contain at least two tier!.`}
            </p>
          </div>
        </ModalError>
      ) : null}
      {/* modal validate attachment */}
      <ModalError
        isOpen={modalValidateAttachment}
        handleOk={() => setModalValidateAttachment(false)}
        handleCancel={() => setModalValidateAttachment(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {
              "Please Input at least one or more attachment in attachment section"
            }
          </p>
        </div>
      </ModalError>
    </div>
  );
};

export default CreateServiceAgreement;
