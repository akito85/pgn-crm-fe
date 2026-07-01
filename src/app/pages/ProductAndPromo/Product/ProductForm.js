import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Spin, Steps } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import ApprovalSectionForm from "../Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import RadioTabs from "../../../../components/RadioTabs";
import ProductSectionForm from "./ProductForm/ProductSectionForm";
import {
  createProductBody,
  createProductVersionBody,
  getDetailProduct,
  getDetailProductVersion,
  getListAppHier,
  getListAppHierDetail,
  getListCategory,
  getPricingDetailList,
  getPricingRuleDetail,
  updateProductBody,
  updateProductVersionBody,
} from "../../../../redux/slices/product_promo/product";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  LeftCircleOutlined,
  LeftOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import PDIProductDetailForm from "./ProductForm/ProductDetail/PDIProductDetailForm";
import PDICalculationRuleForm from "./ProductForm/CalculationRule/PDICalculationRuleForm";
import PDITargetAccountSellingForm from "./ProductForm/TargetAccountSelling/PDITargetAccountSellingForm";
import PDIPricingForm from "./ProductForm/Pricing/PDIPricingForm";
import PDITosForm from "./ProductForm/TermOfService/PDITosForm";
import PDIProductBundlingForm from "./ProductForm/ProductBundling/PDIProductBundlingForm";
import PDIEligibilityProductForm from "./ProductForm/EligibilityProduct/PDIEligibilityProductForm";
import { columnsTableCriteria } from "./columnTableCriteria";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ContentModalConfirmation from "./ProductForm/ContentModalConfirmation";
import ModalBack from "../../../../components/Modal/ModalBack";
import moment from "moment";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { bytesConverter } from "../../../../utils/bytesConverter";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { handleMandatory } from "./utils";
import { applyLocationCriteriaCascade, handleCheckCriteriaMissingValidation, getCriteriaIdByCode } from "../UtilsProduct/UtilsAllProduct";

const routes = (type) => [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT,
    breadcrumbName: "Product",
  },
  {
    path: "",
    breadcrumbName: `${
      type === "update" ? "Update Product" : "Create Product"
    }`,
  },
];

const listTypeSubmit = ["submit", "draft"];

const ProductForm = (props) => {
  const { type } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const { id, idParent, prevPage } = location?.state || {};
  const [current, setCurrent] = useState(0);
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Product",
      paramValue: [
        "productName",
        "productType",
        "productClass",
        "serviceType",
        "startDate",
      ],
    },
    { value: "Approval", paramValue: ["approvalHierarchy"] },
    { value: "Attachment" },
  ]);
  const [typeProductDetail, setTypeProductDetail] = useState(245);
  const [typeProductInfo, setTypeProductInfo] = useState(
    listSectionInfo[0].value
  );
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [productInfoObj, setProductInfoObj] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(listTypeSubmit[0]);
  const [dataTablePDIProductDetail, setDataTablePDIProductDetail] = useState(
    []
  );
  const [dataTablePDICalculationRule, setDataTablePDICalculationRule] =
    useState([]);
  const [
    dataTablePDITargetAccountSelling,
    setDataTablePDITargetAccountSelling,
  ] = useState([]);
  const [dataTablePDITermOfService, setDataTablePDITermOfService] = useState(
    []
  );
  const [dataTablePDIProductBundling, setDataTablePDIProductBundling] =
    useState([]);
  const [dataTablePDIEligibilityProduct, setDataTablePDIEligibilityProduct] =
    useState([]);
  const [bodyPriceCode, setBodyPriceCode] = useState({});
  const [bodyPricingRule, setBodyPricingRule] = useState({});
  const [dataFilterTAS, setDataFilterTAS] = useState([]);
  const [modalBack, setModalBack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [storedData, setStoredData] = useState(false);
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const {
    dataListSelectCriteria,
    loadingProduct,
    dataListAppHierIdForm = [],
    dataListAppHierDetailForm = [],
    dataListPricingRule = [],
    dataListPriceCode = [],
    dataListProductType = [],
    dataListProductClass = [],
    dataListServiceType = [],
    dataListPaymentType = [],
    dataListChargeMethod = [],
    dataListCalculationType = [],
    dataPricingRuleDetail = {},
    dataDetailProduct = {},
    dataDetailProductVersion = {},
    dataListPricingDetail = [],
  } = useSelector((state) => state.product);
  const [versionUpdate, setVersionUpdate] = useState();
  const isLoading = loadingProduct || loadingForm;


  useEffect(() => {
    if (
      dataListSelectCriteria &&
      dataListSelectCriteria &&
      dataListSelectCriteria?.length > 0
    ) {
      const tempCriterias = (dataListSelectCriteria || [])?.map((criteria) => ({
        name: criteria.label,
        value: criteria.value,
        code: criteria?.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [dataListSelectCriteria]);

  useEffect(() => {
    if (bodyPricingRule?.pricingRuleId) {
      dispatch(getPricingRuleDetail({ id: bodyPricingRule.pricingRuleId }));
    }
  }, [dispatch, bodyPricingRule]);

  useEffect(() => {
    const arrayKey = columnsTableCriteria().map((item) => item.dataIndex);
    const tasCriteria = productInfoObj.tasCriteria || [];
    if (tasCriteria.includes(24)) {
      setDataFilterTAS([]);
    } else {
      setDataFilterTAS(
        dataTablePDITargetAccountSelling.map((criteria) => {
          let obj = {};
          arrayKey.forEach((item) => {
            obj[item] = criteria[item]?.value || null;
          });
          return obj;
        })
      );
    }
    // form.resetFields(["pricingPriceCode", "pricingPricingRule"]);
    // setBodyPricingRule({});
    // setBodyPriceCode({});
    // setDataTablePDITermOfService([]);
  }, [form, dataTablePDITargetAccountSelling, productInfoObj]);

  useEffect(() => {
    if (prevPage === "detail-product" && idParent) {
      dispatch(getDetailProduct({ id: idParent }));
    }
  }, [dispatch, prevPage, idParent]);

  useEffect(() => {
    if (dataDetailProduct?.id && prevPage === "detail-product") {
      const idChild = dataDetailProduct?.currentProductVersion?.id;
      const tempId = type === "create" ? idChild : id;
      dispatch(getDetailProductVersion({ id: tempId }));
    }
  }, [dispatch, dataDetailProduct, id, idParent, prevPage, type]);

  useEffect(() => {
    setBodyPriceCode((prevState) => ({
      ...prevState,
      mpricingDetails: dataListPricingDetail,
    }));
  }, [dataListPricingDetail]);

  const asserData = useCallback(
    (dataDetailProduct, dataDetailProductVersion) => {
      const version = dataDetailProductVersion.version;
      if (type !== "create" || prevPage !== "detail-product") {
        setVersionUpdate(version);
      }
      const approvalHierarchy = dataDetailProductVersion.apphierId || 0;
      const arrayProductDetailPaymentObj = (
        dataDetailProductVersion.mproductDetail || []
      ).filter((item) => item.nameId === 210);
      const arrayProductDetailChargObj = (
        dataDetailProductVersion.mproductDetail || []
      ).filter((item) => item.nameId === 214);
      const arrayProductDetailNew = (
        dataDetailProductVersion.mproductDetail || []
      )
        .filter((item) => item.nameId !== 214 && item.nameId !== 210)
        .map((productDetail, index) => {
          const name =
            productDetail.name && productDetail.nameId
              ? {
                  label: productDetail.name,
                  value: productDetail.nameId,
                }
              : null;
          const unit =
            productDetail.uom && productDetail.unitName
              ? {
                  label: productDetail.unitName,
                  value: parseInt(productDetail.uom),
                }
              : null;
          return {
            key: index + 1,
            id: productDetail.id,
            name,
            value: productDetail.value,
            unit,
            description: productDetail.description,
            typeData: version !== 1 ? "exist" : undefined,
          };
        });
      const arrayCalculationRuleObj = (
        dataDetailProductVersion.mproductCalculationRule || []
      ).filter((item) => item.nameId === 687);
      const arrayCalculationRuleNew = (
        dataDetailProductVersion.mproductCalculationRule || []
      )
        .filter((item) => item.nameId !== 687)
        .map((calculationRule, index) => {
          const name =
            calculationRule.name && calculationRule.nameId
              ? {
                  label: calculationRule.name,
                  value: calculationRule.nameId,
                }
              : null;
          const unit =
            calculationRule.uom && calculationRule.uomName
              ? {
                  label: calculationRule.uomName,
                  value: parseInt(calculationRule.uom) || calculationRule.uom,
                }
              : null;
          return {
            key: index + 1,
            id: calculationRule.id,
            name,
            value: calculationRule.value,
            unit,
            description: calculationRule.description,
            typeData: version !== 1 ? "exist" : undefined,
          };
        });
      setDataTablePDIProductDetail(arrayProductDetailNew);
      setDataTablePDICalculationRule(arrayCalculationRuleNew);
      const criteria = applyLocationCriteriaCascade(
        (
          dataDetailProductVersion?.mproductTargetAccountSelling
            ?.mProductTargetAccountSellingCriteria || []
        ).map((crit) => (crit.criteria ? parseInt(crit.criteria) : 0)),
        criteriaOptions
      );
      const criteriaData = (
        dataDetailProductVersion?.mproductTargetAccountSelling?.criterias || []
      )
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            ...item,
            key: index + 1,
            startDate: item.startDate ? moment(item.startDate) : "",
            endDate: item.endDate ? moment(item.endDate) : "",
            typeData: version !== 1 ? "exist" : undefined,
          };
        });
      setDataTablePDITargetAccountSelling(criteriaData);
      const tempBodyPriceCode = {
        id: dataDetailProductVersion?.mproductPricing?.priceCodeId || 0,
        priceCode: dataDetailProductVersion?.mproductPricing?.priceCode || "",
        priceDescription:
          dataDetailProductVersion?.mproductPricing?.pricingDescription || "",
      };
      const tempBodyPricingRule = {
        pricingRuleId:
          dataDetailProductVersion?.mproductPricing?.pricingRuleId || 0,
        description:
          dataDetailProductVersion?.mproductPricing?.pricingRuleDescription ||
          "",
          name: dataDetailProductVersion?.mproductPricing?.pricingRuleName
      };
      dispatch(getPricingDetailList({ id: tempBodyPriceCode.id }));
      setBodyPriceCode(tempBodyPriceCode);
      setBodyPricingRule(tempBodyPricingRule);
      const tempDataTos = (
        dataDetailProductVersion?.mproductTermOfService || []
      ).map((item, index) => {
        return {
          key: index + 1,
          id: item.id,
          tosName:
            item.tosName && item.tosId
              ? {
                  label: item.tosName,
                  value: item.tosId,
                }
              : null,
          description: item.description,
          productTosDetailDtos: (item?.productTosDetailDtos || []).map(
            (itemDetail, indexDetail) => {
              return {
                key: indexDetail + 1,
                id: itemDetail.id,
                attribute:
                  itemDetail.attribute && itemDetail.attributeName
                    ? {
                        label: itemDetail.attributeName,
                        value: parseInt(itemDetail.attribute) + "",
                      }
                    : null,
                value: itemDetail.value,
                unit: null,
                fromItem: null,
                typeData: version !== 1 ? "exist" : undefined,
              };
            }
          ),
          typeData: version !== 1 ? "exist" : undefined,
        };
      });
      setDataTablePDITermOfService(tempDataTos);
      setDataTablePDIProductBundling(
        (dataDetailProductVersion?.rproductBundling || []).map(
          (item, index) => {
            return {
              key: index + 1,
              id: item.id,
              productId: item.productId,
              productName: item.productName,
              startDate: item.startDate
                ? moment(item.startDate).format("DD MMM YYYY")
                : "",
              endDate: item.endDate
                ? moment(item.endDate).format("DD MMM YYYY")
                : "",
              description: item.description,
              discountAmount: item.discountAmount,
              discountType: item.discountType ? parseInt(item.discountType) : 0,
              discountTypeName: item.discountTypeName,
              typeData: version !== 1 ? "exist" : undefined,
            };
          }
        )
      );
      setDataTablePDIEligibilityProduct(
        (dataDetailProductVersion?.religibilityProduct || []).map(
          (item, index) => {
            return {
              key: index + 1,
              id: item.id,
              productId: item.productId,
              productName: item.productName,
              startDate: item.startDate
                ? moment(item.startDate).format("DD MMM YYYY")
                : "",
              endDate: item.endDate
                ? moment(item.endDate).format("DD MMM YYYY")
                : "",
              description: item.description,
              typeData: version !== 1 ? "exist" : undefined,
            };
          }
        )
      );
      const obj = {
        productName: dataDetailProduct.productName,
        productType: dataDetailProduct.productType,
        productClass: dataDetailProduct.productClass,
        serviceType: dataDetailProduct.serviceType,
        startDate: dataDetailProductVersion.startDate
          ? moment(dataDetailProductVersion.startDate)
          : "",
        endDate: dataDetailProductVersion.endDate
          ? moment(dataDetailProductVersion.endDate)
          : "",
        productDescription: dataDetailProductVersion.description,
        approvalHierarchy,
        paymentType:
          arrayProductDetailPaymentObj.length !== 0
            ? arrayProductDetailPaymentObj[0].uom
              ? parseInt(arrayProductDetailPaymentObj[0].uom)
              : undefined
            : undefined,
        chargingMethod:
          arrayProductDetailChargObj.length !== 0
            ? arrayProductDetailChargObj[0].uom
              ? parseInt(arrayProductDetailChargObj[0].uom)
              : undefined
            : undefined,
        calculationType:
          arrayCalculationRuleObj.length !== 0
            ? arrayCalculationRuleObj[0].uom
              ? parseInt(arrayCalculationRuleObj[0].uom)
              : undefined
            : undefined,
        tasName:
          dataDetailProductVersion?.mproductTargetAccountSelling?.name || "",
        tasCriteria: criteria,
        tasDescription:
          dataDetailProductVersion?.mproductTargetAccountSelling?.description ||
          "",
        pricingPriceCode: tempBodyPriceCode.id,
        pricingPricingRule: tempBodyPricingRule.pricingRuleId,
      };
      setProductInfoObj(obj);
      form.setFieldsValue({ ...obj });
      setSelectedHierarchy(obj.approvalHierarchy);
      setTypeProductDetail(obj.productType);
      setListDataAttachment(
        (dataDetailProductVersion?.mAttachments || []).map(
          (attachData, index) => ({
            ...attachData,
            key: index + 1,
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        )
      );
    },
    [dispatch, form, type, prevPage]
  );

  useEffect(() => {
    if (
      dataDetailProduct &&
      dataDetailProduct.id &&
      dataDetailProductVersion &&
      dataDetailProductVersion.id &&
      prevPage === "detail-product"
    ) {
      asserData(dataDetailProduct, dataDetailProductVersion);
    }
  }, [asserData, dataDetailProduct, dataDetailProductVersion, type, prevPage]);

  useEffect(() => {
    dispatch(getListAppHier());
  }, [dispatch]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  const handleProductInfoObj = (e, type) => {
    let result;
    switch (type) {
      case "productName":
      case "productDescription":
      case "tasName":
      case "tasDescription":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    switch (type) {
      case "pricingPricingRule":
        const obj1 = (dataListPricingRule || []).filter(
          (item) => item.pricingRuleId === result
        );
        setBodyPricingRule(obj1[0] || {});
        break;
      case "pricingPriceCode":
        const obj2 = (dataListPriceCode || []).filter(
          (item) => item.id === result
        );
        setBodyPriceCode(obj2[0] || {});
        break;
      case "productType":
        if ((result === 245 || result === 246) && current > 4) {
          setCurrent(4);
        }
        setTypeProductDetail(result);
        break;
      case "startDate":
        form.resetFields(["endDate"])
      default:
        break;
    }
    setProductInfoObj((prevState) => ({
      ...prevState,
      [type]: result,
      ...(type === "startDate" ? {["endDate"]: null} : {})
    }));
    return result;
  };

  const steps = () => {
    let data = [
      {
        title: "Product Detail",
        content: (
          <PDIProductDetailForm
            type={type}
            dataTable={dataTablePDIProductDetail}
            dispatch={dispatch}
            updateBody={handleProductInfoObj}
            updateTable={setDataTablePDIProductDetail}
            storedData={storedData}
            setStoredData={setStoredData}
          />
        ),
        disabled: false,
          // !productInfoObj.paymentType ||
          // !productInfoObj.chargingMethod ||
          // dataTablePDIProductDetail.length === 0 ||
          // dataTablePDIProductDetail.some((item) => !item?.name) ||
          // storedData,
      },
      {
        title: "Calculation Rule",
        content: (
          <PDICalculationRuleForm
            type={type}
            dataTable={dataTablePDICalculationRule}
            dispatch={dispatch}
            updateBody={handleProductInfoObj}
            updateTable={setDataTablePDICalculationRule}
            storedData={storedData}
            setStoredData={setStoredData}
          />
        ),
        disabled: false,
          // !productInfoObj.calculationType ||
          // dataTablePDICalculationRule.length === 0 ||
          // dataTablePDICalculationRule.some((item) => !item?.name) ||
          // storedData,
      },
      {
        title: "Target Account Selling",
        content: (
          <PDITargetAccountSellingForm
            form={form}
            data={dataTablePDITargetAccountSelling}
            dispatch={dispatch}
            handleProductObj={handleProductInfoObj}
            productObj={productInfoObj}
            type="form"
            updateData={setDataTablePDITargetAccountSelling}
            storedData={storedData}
            setStoredData={setStoredData}
            startDate={productInfoObj.startDate}
            endDate={productInfoObj.endDate}
          />
        ),
        disabled: false,
          // !productInfoObj.tasName ||
          // !productInfoObj.tasCriteria ||
          // (!(productInfoObj.tasCriteria || []).includes(24) &&
          //   dataTablePDITargetAccountSelling.length === 0) ||
          // (!(productInfoObj.tasCriteria || []).includes(24) &&
          //   dataTablePDITargetAccountSelling.every(
          //     (item) => !item.startDate
          //   )) ||
          // storedData, 
      },
      {
        title: "Pricing",
        content: (
          <PDIPricingForm
            dispatch={dispatch}
            handleProductObj={handleProductInfoObj}
            productObj={productInfoObj}
            priceCodeObj={bodyPriceCode}
            pricingRuleObj={bodyPricingRule}
            dataArrayFilter={dataFilterTAS}
          />
        ),
        disabled: false,
        // !productInfoObj.pricingPriceCode,
      },
      {
        title: "Term Of Service",
        content: (
          <PDITosForm
            dispatch={dispatch}
            productObj={productInfoObj}
            type={"form"}
            data={dataTablePDITermOfService}
            updateData={setDataTablePDITermOfService}
            dataArrayFilter={dataFilterTAS}
          />
        ),
        disabled: false,
      },
    ];

    /** Type Product */
    if (typeProductDetail === 245) {
      return data;
    }
    /** Type Service */
    if (typeProductDetail === 246) {
      return data;
    }
    data = [
      ...data,
      {
        title:
          typeProductDetail === 286
            ? "Product Bundling"
            : "Eligibility Product",
        content:
          typeProductDetail === 286 ? (
            <PDIProductBundlingForm
              type={type}
              data={dataTablePDIProductBundling}
              productObj={productInfoObj}
              updateData={setDataTablePDIProductBundling}
              prevPage={prevPage}
              idParent={idParent}
            />
          ) : (
            <PDIEligibilityProductForm
              type={type}
              data={dataTablePDIEligibilityProduct}
              productObj={productInfoObj}
              updateData={setDataTablePDIEligibilityProduct}
              prevPage={prevPage}
              idParent={idParent}
            />
          ),
        disabled: false,
          // typeProductDetail === 286
          //   ? dataTablePDIProductBundling.length === 0
          //   : dataTablePDIEligibilityProduct.length === 0,
      },
    ];
    return data;
  };

  const handleProductInfo = (e) => {
    if (!storedData) {
      setTypeProductInfo(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleProcessModalConfirm = () => {
    setLoadingForm(true);
    let body = {
      productDescription: productInfoObj.productDescription || null,
      save: typeSubmit.toUpperCase(),
      startDate: productInfoObj.startDate
        ? productInfoObj.startDate.format("DD MMM YYYY")
        : null,
      endDate: productInfoObj.endDate
        ? productInfoObj.endDate.format("DD MMM YYYY")
        : null,
      appHierId: selectedHierarchy,
      productName: productInfoObj.productName,
      productType: productInfoObj.productType,
      serviceType: productInfoObj.serviceType,
      productClass: productInfoObj.productClass,
    };
    if (type === "create" && prevPage === "detail-product") {
      body = {
        ...body,
        id: idParent,
      };
    }
    for (let index = 0; index < steps().length; index++) {
      const element = steps()[index];
      switch (element.title) {
        case "Product Detail":
          let arrayProductDetailObj = [];
          if (prevPage === "detail-product") {
            arrayProductDetailObj = (
              dataDetailProductVersion.mproductDetail || []
            ).slice(0, 2);
          }
          const labelPaymentType = (dataListPaymentType || []).filter(
            (item) => item.value === productInfoObj.paymentType
          );
          const labelChargingMethod = (dataListChargeMethod || []).filter(
            (item) => item.value === productInfoObj.chargingMethod
          );
          const tempDataProduct = [
            {
              id:
                arrayProductDetailObj.length !== 0
                  ? arrayProductDetailObj[0]?.id
                  : undefined,
              name: {
                label: "Payment Type",
                value: 210,
              },
              value: undefined,
              unit: {
                value: productInfoObj.paymentType,
                label:
                  labelPaymentType.length > 0 ? labelPaymentType[0].label : "",
              },
              description: undefined,
            },
            {
              id:
                arrayProductDetailObj.length !== 0
                  ? arrayProductDetailObj[1]?.id
                  : undefined,
              name: {
                label: "Charging Method",
                value: 214,
              },
              value: undefined,
              unit: {
                value: productInfoObj.chargingMethod,
                label:
                  labelChargingMethod.length > 0
                    ? labelChargingMethod[0].label
                    : "",
              },
              description: undefined,
            },
            ...dataTablePDIProductDetail,
          ];
          body = {
            ...body,
            productDetailDtos: tempDataProduct.map((item) => ({
              name: item?.name?.label || null,
              nameId: item?.name?.value || null,
              uomId: item?.unit?.label || null,
              uom: item?.unit?.value || null,
              value: item?.value === 0 ? item.value : item?.value || null,
              description: item?.description || null,
            })),
          };
          break;
        case "Calculation Rule":
          let arrayCalculationRuleObj = [];
          if (prevPage === "detail-product") {
            arrayCalculationRuleObj = (
              dataDetailProductVersion.mproductCalculationRule || []
            ).slice(0, 1);
          }
          const labelCalculationType = (dataListCalculationType || []).filter(
            (item) => item.value === productInfoObj.calculationType
          );
          const tempDataCalculation = [
            {
              id:
                arrayCalculationRuleObj.length !== 0
                  ? arrayCalculationRuleObj[0]?.id
                  : undefined,
              name: {
                label: "Calculation Type",
                value: 687,
              },
              value: undefined,
              unit: {
                value: productInfoObj.calculationType,
                label:
                  labelCalculationType.length > 0
                    ? labelCalculationType[0].label
                    : "",
              },
              description: undefined,
            },
            ...dataTablePDICalculationRule,
          ];
          body = {
            ...body,
            calculationRuleDtos: tempDataCalculation.map((item) => ({
              name: item?.name?.label || null,
              nameId: item?.name?.value || null,
              uomId: item?.unit?.label || null,
              uom: item?.unit?.value || null,
              value: item?.value === 0 ? item.value : item?.value || null,
              description: item?.description || null,
            })),
          };
          break;
        case "Target Account Selling":
          const productTasDtos = {
            id:
              prevPage === "detail-product"
                ? dataDetailProductVersion?.mproductTargetAccountSelling?.id
                : undefined,
            name: productInfoObj.tasName,
            description: productInfoObj.tasDescription,
          };
          const productTasCriteriaDtos = (productInfoObj.tasCriteria || []).map(
            (item) => {
              let dataDefault = [];
              if (prevPage === "detail-product") {
                dataDefault = (
                  dataDetailProductVersion?.mproductTargetAccountSelling
                    ?.mProductTargetAccountSellingCriteria || []
                ).filter((data) => data.criteria === item);
              }
              // console.log(dataDefault);
              return {
                id: dataDefault.length > 0 ? dataDefault[0].id : undefined,
                criteria: item,
              };
            }
          );
          let productTasCriteriaDataDto = dataTablePDITargetAccountSelling.map(
            (item) => {
              let obj = {};
              for (const attr in item) {
                if (
                  typeof item[attr] === "object" &&
                  item[attr] !== null &&
                  attr !== "startDate" &&
                  attr !== "endDate"
                ) {
                  obj[attr] = item[attr].value;
                  obj[`${attr}Name`] = item[attr].label;
                } else {
                  obj[attr] = item[attr];
                }
              }
              delete obj.updatedBy;
              delete obj.updatedDate;
              delete obj.createdBy;
              delete obj.createdDate;
              delete obj.dataType;
              return obj;
            }
          );
          const filteredCriteria = columnsTableCriteria().filter(
            (item) =>
              !(productInfoObj.tasCriteria || []).includes(item.indexValue)
          );

          const filteredCriteria2 = columnsTableCriteria().filter((item) =>
            (productInfoObj.tasCriteria || []).includes(item.indexValue)
          );

          productTasCriteriaDataDto = productTasCriteriaDataDto.map((item) => {
            let obj = {
              id: item.id || undefined,
              description: item?.description || null,
              startDate: item.startDate
                ? item.startDate.format("DD MMM YYYY")
                : null,
              endDate: item.endDate ? item.endDate.format("DD MMM YYYY") : null,
            };
            filteredCriteria2.forEach((criteria2) => {
              obj[criteria2.dataIndex] = item[criteria2.dataIndex];
              obj[`${criteria2.dataIndex}Name`] =
                item[`${criteria2.dataIndex}Name`];
            });
            const countryCriteriaId = getCriteriaIdByCode(criteriaOptions, "COUNTRY");
            if (countryCriteriaId && (productInfoObj.tasCriteria || []).includes(countryCriteriaId)) {
              obj.country = item.country;
              obj.countryName = item.countryName;
            }
            filteredCriteria.forEach((criteria) => {
              obj[criteria.dataIndex] = null;
            });
            delete obj.key;
            return obj;
          });
          const includesAll = (productInfoObj.tasCriteria || []).includes(24);
          body = {
            ...body,
            productTasDtos,
            productTasCriteriaDtos,
            productTasCriteriaDataDto: includesAll
              ? [{ allCriteria: true }]
              : productTasCriteriaDataDto,
          };
          break;
        case "Pricing":
          body = {
            ...body,
            productPricingDtos: {
              id:
                prevPage === "detail-product"
                  ? dataDetailProductVersion?.mproductPricing?.id
                  : undefined,
              priceCodeId: bodyPriceCode.id || null,
              priceCode: bodyPriceCode.priceCode || null,
              pricingRuleId: bodyPricingRule.pricingRuleId || null,
            },
          };
          break;
        case "Term Of Service":
          body = {
            ...body,
            productTosDtos: (dataTablePDITermOfService || []).map((tos) => ({
              id: tos.id || undefined,
              tosId: tos.tosName?.value || null,
              tosName: tos.tosName?.label || null,
              description: tos.description || null,
              productTosDetailDtos: (tos.productTosDetailDtos || []).map(
                (detailTos) => {
                  return {
                    id: detailTos.id || undefined,
                    attribute: detailTos.attribute?.value || null,
                    value:
                      detailTos.value === 0
                        ? detailTos.value
                        : detailTos?.value || null,
                    unit: detailTos.unit?.label || null,
                    unitId: detailTos.unit?.value || null,
                    fromItem: detailTos.fromItem?.label || null,
                    fromItemId: detailTos.fromItem?.value || null,
                  };
                }
              ),
            })),
          };
          break;
        case "Product Bundling":
          body = {
            ...body,
            productBundlingDtos: dataTablePDIProductBundling.map((item) => {
              return {
                id: item.id || undefined,
                productId: item.productId || null, //Product id
                productName: item.productName || null,
                productIdGenerate: item.productIdGenerate || null,
                discountType: item.discountType || null,
                discountTypeName: item.discountTypeName || null,
                discountAmount:
                  item.discountAmount === 0
                    ? item.discountAmount
                    : item?.discountAmount || null,
                startDate: item.startDate
                  ? moment(item.startDate, "DD MMM YYYY").format("YYYY-MM-DD")
                  : null,
                endDate: item.endDate
                  ? moment(item.endDate, "DD MMM YYYY").format("YYYY-MM-DD")
                  : null,
                description: item.description || null,
              };
            }),
          };
          break;
        case "Eligibility Product":
          body = {
            ...body,
            productEligibilityDtos: dataTablePDIEligibilityProduct.map(
              (item) => {
                return {
                  id: item.id || undefined,
                  productId: item.productId || null, //Product id
                  productName: item.productName || null,
                  productIdGenerate: item.productIdGenerate || null,
                  startDate: item.startDate
                    ? moment(item.startDate, "DD MMM YYYY").format("YYYY-MM-DD")
                    : null,
                  endDate: item.endDate
                    ? moment(item.endDate, "DD MMM YYYY").format("YYYY-MM-DD")
                    : null,
                  description: item.description || null,
                };
              }
            ),
          };
          break;
        default:
          break;
      }
    }
    // console.log(body);
    if (type === "create" && prevPage === "table-product") {
      dispatch(createProductBody(body))
        .unwrap()
        .then(async (data) => {
          const idProduct = data?.currentProductVersion?.id || 0;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/product/uploadAttachment/${idProduct}`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
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
            setLoadingForm(false);
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
    if (type === "create" && prevPage === "detail-product") {
      dispatch(createProductVersionBody(body))
        .unwrap()
        .then(async (data) => {
          const idProduct = data?.idVersion || 0;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/product/uploadAttachment/${idProduct}`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
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
            setLoadingForm(false);
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
    if (type === "update" && versionUpdate === 1) {
      dispatch(updateProductBody({ body, id: idParent }))
        .unwrap()
        .then(async (data) => {
          const idProduct = data?.currentProductVersion?.id || 0;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/product/uploadAttachment/${idProduct}`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
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
            setLoadingForm(false);
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
    if (type === "update" && versionUpdate !== 1) {
      dispatch(updateProductVersionBody({ body, id }))
        .unwrap()
        .then(async (data) => {
          const idProduct = id || 0;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            const response = await productPromoHttpService.uploadAttachment(
              `/v1/dbs/api/product/uploadAttachment/${idProduct}`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
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
            setLoadingForm(false);
            handleCancelModalConfirm();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const handleEndpointValidation = useCallback( (type, prevPage, versionUpdate) => {
    if(type === "create" && prevPage === "table-product"){
      return "/v1/dbs/api/product/validate-create"
    } else if(type === "create" && prevPage === "detail-product"){
      return "/v1/dbs/api/product/validate-create-product-version"
    } else if(type === "update" && versionUpdate === 1){
      return `/v1/dbs/api/product/validate-update/${idParent}`
    } else {
      return `/v1/dbs/api/product/validate-update-product-version/${id}`
    }
  },[id, idParent])

  const handleSubmitForm = useCallback(
    async (value) => {
      // console.log("masuk");
      if (listDataAttachment.length === 0) {
        handleMandatory(setListSectionInfo, listDataAttachment); // attachment mandatory onFinish
      } else {
        handleMandatory(setListSectionInfo, listDataAttachment);
        if (storedData) {
          const errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else if (
          dataTablePDIProductDetail?.length < 1 ||
          dataTablePDICalculationRule?.length < 1 ||
          (!(productInfoObj?.tasCriteria?.includes(24)) && dataTablePDITargetAccountSelling?.length < 1) ||
          (productInfoObj?.productType === 287 && dataTablePDIEligibilityProduct?.length < 1  ) ||
          (productInfoObj?.productType === 286 && dataTablePDIProductBundling?.length < 1  )
        ) {
          const errorBody = {
            title: "Failed",
            description: `Detail data is Mandatory. Please try again.`,
            return: false,
          };
          dispatch(showModalError(errorBody))
        } else if (
          handleCheckCriteriaMissingValidation(
            criteriaOptions,
            productInfoObj?.criteria,
            dataTablePDICalculationRule,
            () => {}
          )
        ) {
          const errorBody = {
            title: "Failed",
            description: `There is missing values in table criteria. Please try again`,
          };
          dispatch(showModalError(errorBody));
        } else {
          let tempAttachment = [...listDataAttachment];
          if (type === "create" && prevPage === "detail-product") {
            tempAttachment = tempAttachment.filter(
              (item) => item.dataType !== "exist"
            );
          }
          if (tempAttachment.length === 0) {
            const errorBody = {
              title: "Failed",
              description: `Your data was not created. Please insert attachment.`,
              return: false,
            };
            dispatch(showModalError(errorBody));
          } else {
            setListSectionInfo([
              {
                value: "Product",
                paramValue: [
                  "productName",
                  "productType",
                  "productClass",
                  "startDate",
                ],
              },
              { value: "Approval", paramValue: ["approvalHierarchy"] },
              { value: "Attachment" },
            ]);

            let body = {
              productDescription: productInfoObj.productDescription || null,
              save: typeSubmit.toUpperCase(),
              startDate: productInfoObj.startDate
                ? productInfoObj.startDate.format("DD MMM YYYY")
                : null,
              endDate: productInfoObj.endDate
                ? productInfoObj.endDate.format("DD MMM YYYY")
                : null,
              appHierId: selectedHierarchy,
              productName: productInfoObj.productName,
              productType: productInfoObj.productType,
              serviceType: productInfoObj.serviceType,
              productClass: productInfoObj.productClass,
            };
            if (type === "create" && prevPage === "detail-product") {
              body = {
                ...body,
                id: idParent,
              };
            }
            for (let index = 0; index < steps().length; index++) {
              const element = steps()[index];
              switch (element.title) {
                case "Product Detail":
                  let arrayProductDetailObj = [];
                  if (prevPage === "detail-product") {
                    arrayProductDetailObj = (
                      dataDetailProductVersion.mproductDetail || []
                    ).slice(0, 2);
                  }
                  const labelPaymentType = (dataListPaymentType || []).filter(
                    (item) => item.value === productInfoObj.paymentType
                  );
                  const labelChargingMethod = (
                    dataListChargeMethod || []
                  ).filter(
                    (item) => item.value === productInfoObj.chargingMethod
                  );
                  const tempDataProduct = [
                    {
                      id:
                        arrayProductDetailObj.length !== 0
                          ? arrayProductDetailObj[0]?.id
                          : undefined,
                      name: {
                        label: "Payment Type",
                        value: 210,
                      },
                      value: undefined,
                      unit: {
                        value: productInfoObj.paymentType,
                        label:
                          labelPaymentType.length > 0
                            ? labelPaymentType[0].label
                            : "",
                      },
                      description: undefined,
                    },
                    {
                      id:
                        arrayProductDetailObj.length !== 0
                          ? arrayProductDetailObj[1]?.id
                          : undefined,
                      name: {
                        label: "Charging Method",
                        value: 214,
                      },
                      value: undefined,
                      unit: {
                        value: productInfoObj.chargingMethod,
                        label:
                          labelChargingMethod.length > 0
                            ? labelChargingMethod[0].label
                            : "",
                      },
                      description: undefined,
                    },
                    ...dataTablePDIProductDetail,
                  ];
                  body = {
                    ...body,
                    productDetailDtos: tempDataProduct.map((item) => ({
                      name: item?.name?.label || null,
                      nameId: item?.name?.value || null,
                      uomId: item?.unit?.label || null,
                      uom: item?.unit?.value || null,
                      value:
                        item?.value === 0 ? item.value : item?.value || null,
                      description: item?.description || null,
                    })),
                  };
                  break;
                case "Calculation Rule":
                  let arrayCalculationRuleObj = [];
                  if (prevPage === "detail-product") {
                    arrayCalculationRuleObj = (
                      dataDetailProductVersion.mproductCalculationRule || []
                    ).slice(0, 1);
                  }
                  const labelCalculationType = (
                    dataListCalculationType || []
                  ).filter(
                    (item) => item.value === productInfoObj.calculationType
                  );
                  const tempDataCalculation = [
                    {
                      id:
                        arrayCalculationRuleObj.length !== 0
                          ? arrayCalculationRuleObj[0]?.id
                          : undefined,
                      name: {
                        label: "Calculation Type",
                        value: 687,
                      },
                      value: undefined,
                      unit: {
                        value: productInfoObj.calculationType,
                        label:
                          labelCalculationType.length > 0
                            ? labelCalculationType[0].label
                            : "",
                      },
                      description: undefined,
                    },
                    ...dataTablePDICalculationRule,
                  ];
                  body = {
                    ...body,
                    calculationRuleDtos: tempDataCalculation.map((item) => ({
                      name: item?.name?.label || null,
                      nameId: item?.name?.value || null,
                      uomId: item?.unit?.label || null,
                      uom: item?.unit?.value || null,
                      value:
                        item?.value === 0 ? item.value : item?.value || null,
                      description: item?.description || null,
                    })),
                  };
                  break;
                case "Target Account Selling":
                  const productTasDtos = {
                    id:
                      prevPage === "detail-product"
                        ? dataDetailProductVersion?.mproductTargetAccountSelling
                            ?.id
                        : undefined,
                    name: productInfoObj.tasName,
                    description: productInfoObj.tasDescription,
                  };
                  const productTasCriteriaDtos = (
                    productInfoObj.tasCriteria || []
                  ).map((item) => {
                    let dataDefault = [];
                    if (prevPage === "detail-product") {
                      dataDefault = (
                        dataDetailProductVersion?.mproductTargetAccountSelling
                          ?.mProductTargetAccountSellingCriteria || []
                      ).filter((data) => data.criteria === item);
                    }
                    // console.log(dataDefault);
                    return {
                      id:
                        dataDefault.length > 0 ? dataDefault[0].id : undefined,
                      criteria: item,
                    };
                  });
                  let productTasCriteriaDataDto =
                    dataTablePDITargetAccountSelling.map((item) => {
                      let obj = {};
                      for (const attr in item) {
                        if (
                          typeof item[attr] === "object" &&
                          item[attr] !== null &&
                          attr !== "startDate" &&
                          attr !== "endDate"
                        ) {
                          obj[attr] = item[attr].value;
                          obj[`${attr}Name`] = item[attr].label;
                        } else {
                          obj[attr] = item[attr];
                        }
                      }
                      delete obj.updatedBy;
                      delete obj.updatedDate;
                      delete obj.createdBy;
                      delete obj.createdDate;
                      delete obj.dataType;
                      return obj;
                    });
                  const filteredCriteria = columnsTableCriteria().filter(
                    (item) =>
                      !(productInfoObj.tasCriteria || []).includes(
                        item.indexValue
                      )
                  );

                  const filteredCriteria2 = columnsTableCriteria().filter(
                    (item) =>
                      (productInfoObj.tasCriteria || []).includes(
                        item.indexValue
                      )
                  );

                  productTasCriteriaDataDto = productTasCriteriaDataDto.map(
                    (item) => {
                      let obj = {
                        id: item.id || undefined,
                        description: item?.description || null,
                        startDate: item.startDate
                          ? item.startDate.format("DD MMM YYYY")
                          : null,
                        endDate: item.endDate
                          ? item.endDate.format("DD MMM YYYY")
                          : null,
                      };
                      filteredCriteria2.forEach((criteria2) => {
                        obj[criteria2.dataIndex] = item[criteria2.dataIndex];
                        obj[`${criteria2.dataIndex}Name`] =
                          item[`${criteria2.dataIndex}Name`];
                      });
                      const countryCriteriaId = getCriteriaIdByCode(criteriaOptions, "COUNTRY");
                      if (countryCriteriaId && (productInfoObj.tasCriteria || []).includes(countryCriteriaId)) {
                        obj.country = item.country;
                        obj.countryName = item.countryName;
                      }
                      filteredCriteria.forEach((criteria) => {
                        obj[criteria.dataIndex] = null;
                      });
                      delete obj.key;
                      return obj;
                    }
                  );
                  const includesAll = (
                    productInfoObj.tasCriteria || []
                  ).includes(24);
                  body = {
                    ...body,
                    productTasDtos,
                    productTasCriteriaDtos,
                    productTasCriteriaDataDto: includesAll
                      ? [{ allCriteria: true }]
                      : productTasCriteriaDataDto,
                  };
                  break;
                case "Pricing":
                  body = {
                    ...body,
                    productPricingDtos: {
                      id:
                        prevPage === "detail-product"
                          ? dataDetailProductVersion?.mproductPricing?.id
                          : undefined,
                      priceCodeId: bodyPriceCode.id || null,
                      priceCode: bodyPriceCode.priceCode || null,
                      pricingRuleId: bodyPricingRule.pricingRuleId || null,
                    },
                  };
                  break;
                case "Term Of Service":
                  body = {
                    ...body,
                    productTosDtos: (dataTablePDITermOfService || []).map(
                      (tos) => ({
                        id: tos.id || undefined,
                        tosId: tos.tosName?.value || null,
                        tosName: tos.tosName?.label || null,
                        description: tos.description || null,
                        productTosDetailDtos: (
                          tos.productTosDetailDtos || []
                        ).map((detailTos) => {
                          return {
                            id: detailTos.id || undefined,
                            attribute: detailTos.attribute?.value || null,
                            value:
                              detailTos.value === 0
                                ? detailTos.value
                                : detailTos?.value || null,
                            unit: detailTos.unit?.label || null,
                            unitId: detailTos.unit?.value || null,
                            fromItem: detailTos.fromItem?.label || null,
                            fromItemId: detailTos.fromItem?.value || null,
                          };
                        }),
                      })
                    ),
                  };
                  break;
                case "Product Bundling":
                  body = {
                    ...body,
                    productBundlingDtos: dataTablePDIProductBundling.map(
                      (item) => {
                        return {
                          id: item.id || undefined,
                          productId: item.productId || null, //Product id
                          productName: item.productName || null,
                          productIdGenerate: item.productIdGenerate || null,
                          discountType: item.discountType || null,
                          discountTypeName: item.discountTypeName || null,
                          discountAmount:
                            item.discountAmount === 0
                              ? item.discountAmount
                              : item?.discountAmount || null,
                          startDate: item.startDate
                            ? moment(item.startDate, "DD MMM YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : null,
                          endDate: item.endDate
                            ? moment(item.endDate, "DD MMM YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : null,
                          description: item.description || null,
                        };
                      }
                    ),
                  };
                  break;
                case "Eligibility Product":
                  body = {
                    ...body,
                    productEligibilityDtos: dataTablePDIEligibilityProduct.map(
                      (item) => {
                        return {
                          id: item.id || undefined,
                          productId: item.productId || null, //Product id
                          productName: item.productName || null,
                          productIdGenerate: item.productIdGenerate || null,
                          startDate: item.startDate
                            ? moment(item.startDate, "DD MMM YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : null,
                          endDate: item.endDate
                            ? moment(item.endDate, "DD MMM YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : null,
                          description: item.description || null,
                        };
                      }
                    ),
                  };
                  break;
                default:
                  break;
              }
            }

            const validateValueObj = {
              body: body,
              services: productPromoHttpService,
              endPoint: handleEndpointValidation(type, prevPage, versionUpdate),
              type: type,
            };
            await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
            setModalConfirm(true);
          }
        }
      }
    },
    [
      listDataAttachment,
      storedData,
      criteriaOptions,
      productInfoObj,
      dataTablePDICalculationRule,
      dispatch,
      type,
      prevPage,
      typeSubmit,
      selectedHierarchy,
      handleEndpointValidation,
      versionUpdate,
      idParent,
      steps,
      dataListPaymentType,
      dataListChargeMethod,
      dataTablePDIProductDetail,
      dataListCalculationType,
      dataDetailProductVersion,
      dataTablePDITargetAccountSelling,
      bodyPriceCode,
      dataTablePDITermOfService,
      dataTablePDIProductBundling,
      dataTablePDIEligibilityProduct,
      bodyPricingRule
    ]
  );

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    // setListSectionInfo((prevState) => {
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
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields)
  };
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setProductInfoObj({});
      setBodyPricingRule({});
      setBodyPriceCode({});
      setListDataAttachment([]);
      setDataTablePDIProductDetail([]);
      setDataTablePDITargetAccountSelling([]);
      setDataTablePDICalculationRule([]);
      setSelectedHierarchy(undefined);
      setTypeProductDetail(245);
    } else {
      asserData(dataDetailProduct, dataDetailProductVersion);
    }
    // setCurrent(0)
    setStoredData(false);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };
  const handleButtonPrev = () => {
    if (current === 2) {
      if (
        handleCheckCriteriaMissingValidation(
          criteriaOptions,
          productInfoObj.tasCriteria,
          dataTablePDITargetAccountSelling,
          () => {},
        )
      ) {
        const errorBody = {
          title: "Failed",
          description: `There is missing values in table criteria. Please try again`,
        };
        dispatch(showModalError(errorBody));
      } else {
        prev();
        scrollLeftHandler();
      }
    } else {
      prev();
      scrollLeftHandler();
    }
  };

      const checkOverlappingData = useCallback((formHeader, dataTable) => {
        const dataOverlap = [];
        
        // if (hasValue(formHeader?.endDate)) {
        dataTable?.forEach((item) => {
          if (
            moment(item?.startDate).startOf("day") <
              moment(formHeader?.startDate).startOf("day") ||
            moment(item?.endDate).startOf("day") >
              moment(formHeader?.endDate).startOf("day")
          ) {
            dataOverlap?.push(item);
          }
        });

        if (dataOverlap?.length > 0) {
          return true;
        } else {
          return false;
        }
        // }
      }, []);

  const handleButtonNext = () => {
    if(current === 0){
      form.validateFields(["paymentType","chargingMethod"])
      .then((values) => {
        if(storedData) {
          const errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        }
        else if(dataTablePDIProductDetail?.length < 1 || dataTablePDIProductDetail.some((item) => !item?.name)){
          const errorBody = {
            title: "Failed",
            description: `Please input at least 1 or more product detail. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else {
          next();
          scrollRightHandler();
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
    } else if (current === 1){
      form.validateFields(["calculationType"])
      .then((values) => {
        if(storedData) {
          const errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        }
        else if(dataTablePDICalculationRule?.length < 1 || dataTablePDICalculationRule.some((item) => !item?.name)){
          const errorBody = {
            title: "Failed",
            description: `Please input at least 1 or more pricing rule. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else {
          next();
          scrollRightHandler();
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
    }
    else if (current === 2) { //target account selling
      form.validateFields(["tasName","tasCriteria"])
      .then((values) => {
        if(storedData) {
          const errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        }
        else if(!(productInfoObj?.tasCriteria || [])?.includes(24)){ //not all
          if(dataTablePDITargetAccountSelling?.length < 1){
            const errorBody = {
              title: "Failed",
              description: `Please input at least 1 or more criteria. Please try again.`,
            };
            dispatch(showModalError(errorBody));
          }
          else if (
            handleCheckCriteriaMissingValidation(
              criteriaOptions,
              productInfoObj.tasCriteria,
              dataTablePDITargetAccountSelling,
              () => {},
            )
          ) {
            const errorBody = {
              title: "Failed",
              description: `There is missing values in table criteria. Please try again`,
            };
            dispatch(showModalError(errorBody));
          } else if (
            checkOverlappingData(
              { startDate: productInfoObj?.startDate , endDate: productInfoObj?.endDate },
              dataTablePDITargetAccountSelling
            )
          ) {
            const errorBody = {
              title: "Failed",
              description: `Please input Start date and End date can't be overlap at criteria.`,
            };
            dispatch(showModalError(errorBody));
          } else {
            next();
            scrollRightHandler();
          }
        } else {
          next();
          scrollRightHandler();
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
    } else if (current === 3) {
      form.validateFields(["pricingPriceCode"])
      .then((values) => {
          next();
          scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        // Handle the rejected result here
      });
    } else {
      next();
      scrollRightHandler();
    }
  };

  const preventSubmit = () => {
    let count = 0;
    const length = steps().length;
    steps().forEach((item) => {
      if (!item.disabled) {
        count++;
      }
    });
    return count !== length;
  };

  const tempProductType = (dataListProductType || []).filter(
    (item) => item.value === (productInfoObj.productType || 0)
  );
  const tempProductClass = (dataListProductClass || []).filter(
    (item) => item.value === (productInfoObj.productClass || 0)
  );
  const tempServiceType = (dataListServiceType || []).filter(
    (item) => item.value === (productInfoObj.serviceType || 0)
  );

  const dataDetailProductInfo = {
    productName: productInfoObj.productName,
    productType: tempProductType.length > 0 ? tempProductType[0].label : "",
    productClass: tempProductClass.length > 0 ? tempProductClass[0].label : "",
    serviceType: tempServiceType.length > 0 ? tempServiceType[0].label : "",
    startDate: productInfoObj.startDate || "",
    endDate: productInfoObj.endDate || "",
    productDescription: productInfoObj.productDescription || "",
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleProcessModalConfirm();
    setModalError(false);
    setBodyError({});
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes(type)} />
        <RadioTabs
          data={listSectionInfo}
          onChange={handleProductInfo}
          currentPosition={typeProductInfo}
        />
        <Form
          id="productForm"
          form={form}
          layout={"vertical"}
          onFinish={handleSubmitForm}
          onFinishFailed={handleErrorSubmit}
          scrollToFirstError={true}
        >
          <BaseContainer header={`${typeProductInfo} INFORMATION`}>
            <div
              style={{
                display:
                  typeProductInfo !== listSectionInfo[0].value
                    ? "none"
                    : undefined,
              }}
            >
              <ProductSectionForm
                type={
                  type === "create" && prevPage !== "detail-product"
                    ? "create"
                    : versionUpdate === 1
                    ? "create"
                    : "update"
                }
                dispatch={dispatch}
                handleProductObj={handleProductInfoObj}
                productObj={productInfoObj}
                status={dataDetailProductVersion?.status}
              />
            </div>
            <div
              style={{
                display:
                  typeProductInfo !== listSectionInfo[1].value
                    ? "none"
                    : undefined,
              }}
            >
              <ApprovalSectionForm
                dataTable={dataListAppHierDetailForm}
                dataOption={dataListAppHierIdForm}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </div>
            <div
              style={{
                display:
                  typeProductInfo !== listSectionInfo[2].value
                    ? "none"
                    : undefined,
              }}
            >
              <AttachmentSectionForm
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="product"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                mandatory={true}
              />
            </div>
          </BaseContainer>
          {typeProductInfo === listSectionInfo[0].value ? (
            <BaseContainer header={"PRODUCT DETAIL INFORMATION"}>
              <div className="flex flex-col w-full gap-3">
                <div className="grid grid-cols-10 gap-4 w-full">
                  <span className="mt-[10px]">
                    <LeftCircleOutlined
                      style={{ fontSize: "24px", color: "#0075bf" }}
                      onClick={scrollLeftHandler}
                    />
                  </span>
                  <div
                    ref={containerRef}
                    className="overflow-x-scroll scrollStepsCstm col-span-8"
                  >
                    <Steps
                      current={current}
                      items={steps()}
                      labelPlacement="vertical"
                    />
                  </div>
                  <span className="mt-[10px] flex justify-end">
                    <RightCircleOutlined
                      style={{ fontSize: "24px", color: "#0075bf" }}
                      onClick={scrollRightHandler}
                    />
                  </span>
                </div>
                {steps()[current].content}
                <div className="flex w-full justify-end gap-x-4">
                  {current > 0 && (
                    <ButtonComponent
                      onClick={handleButtonPrev}
                      type={"submit"}
                      disabled={storedData}
                    >
                      <LeftOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: 18,
                          color: "#fff",
                        }}
                      />
                      Previous
                    </ButtonComponent>
                  )}
                  {current < steps().length - 1 && (
                    <ButtonComponent
                      onClick={handleButtonNext}
                      disabled={steps()[current].disabled}
                      type={"submit"}
                    >
                      Next
                      <RightOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: 18,
                          color: "#fff",
                        }}
                      />
                    </ButtonComponent>
                  )}
                </div>
              </div>
            </BaseContainer>
          ) : null}
          <div className="flex w-full justify-between align-middle my-3">
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
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                disabled={preventSubmit()}
                form="productForm"
                htmlType="submit"
                type="submit"
                onClick={() => setTypeSubmit(listTypeSubmit[1])}
              >
                Save as Draft
              </ButtonComponent>
              <ButtonComponent
                disabled={preventSubmit()}
                form="productForm"
                htmlType="submit"
                type="submit"
                onClick={() => setTypeSubmit(listTypeSubmit[0])}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/** Modal Confirm */}
        {modalConfirm ? (
          <ModalCustom
            isOpen={modalConfirm}
            handleCancel={handleCancelModalConfirm}
            header={"Confirmation"}
            width={1000}
            type={"confirmation"}
            footer={
              <div className="w-full flex justify-end gap-5 p-4">
                <ButtonComponent
                  onClick={handleCancelModalConfirm}
                  type="default"
                  disabled={isLoading}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  loading={isLoading}
                  onClick={handleProcessModalConfirm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <ContentModalConfirmation
              listSectionInfo={listSectionInfo}
              listSectionProductDetail={steps().map((item) => ({
                value: item.title,
              }))}
              productInfoObj={dataDetailProductInfo}
              productObj={productInfoObj}
              priceCodeObj={bodyPriceCode}
              pricingRuleObj={bodyPricingRule}
              dataTablePDIProductDetail={dataTablePDIProductDetail}
              dataTablePDICalculationRule={dataTablePDICalculationRule}
              dataTablePDITargetAccountSelling={
                dataTablePDITargetAccountSelling
              }
              dataTablePDITermOfService={dataTablePDITermOfService}
              dataTablePDIProductBundling={dataTablePDIProductBundling}
              dataTablePDIEligibilityProduct={dataTablePDIEligibilityProduct}
              selectedHierarchy={selectedHierarchy}
              listDataAppHierDetail={dataListAppHierDetailForm}
              listDataAttachment={listDataAttachment}
              dataOption={dataListAppHierIdForm}
            />
          </ModalCustom>
        ) : null}

        {/** Modal Retry */}
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
              type === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default ProductForm;
