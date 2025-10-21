import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  Pagination,
  Table,
} from "antd";
import SelectComponent from "../../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { hasValue } from "../../../../../../../../utils";

import RadioTabs from "../../../../../../../../components/RadioTabs";
import TableLateCharge from "./TableLateCharge";
import TableTaxImplication from "./TableTaxImplication";

import TablePricing from "./TablePricing";
import TableCalcRule from "./TableCalcRule";
import TableProduct from "./TableProductDetail";
import TableTos from "./TableTos";
import ModalForm from "./TableTos/ModalForm";
import ModalChooseTos from "./TableTos/ModalChooseTos";
import {
  getDetailProductSa,
  getListPriceRuleById,
  getListLateCharge,
  getListProduct,
  getPriceCode,
  getPriceRule,
  resetDataDetail,
} from "../../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import ModalChooseProduct from "./ModalChoose";

const SaDetail = ({
  modalChooseProduct,
  setModalChooseProduct,
  type,
  handleSaDetailObj,
  saDetailObj,
  saInfoObj,
  form,
  getProductDetailById,
  dataDetailProduct = {}, //data detail product from API
  dataTableDetailProduct, //state for prepare reset data detail
  setDataTableDetailProduct, //set state for prepare reset data detail
  // data table from send
  dataTableProduct,
  setDataTableProduct,
  dataPricing,
  setDataPricing,
  valueOrUnlimited,
  setValueOrUnlimited,
  dataTableCalcRule,
  setDataTableCalcRule,
  dataTermOfService,
  setDataTermOfService,
  dataTableLateCharge,
  setDataTableLateCharge,
  dataTaxImplication,
  setDataTaxImplication,
  getDetailProductByVersionId,
  idAccount,
  getListChooseTos,
  dataListChooseTos,
  dataPriceRule,
  dataPriceCode = [],
  dataPricingTable = [], //from api
  setSaDetailObj,
  setDdlPriceCode,
  ddlPriceCode,
  ddlPriceRule,
  setDdlPriceRule,
  dataListVersion,
  isMain,
  data_detail = {},
  setDataListVersion,
  saRecordData,
  setSendLateCharge,
  setPriceAdjustment,
  priceAdjustment,
  priceAdjustmentSelect = "",
  setPriceAdjustmentSelect,
  priceAdjustmentSelectId,
  setPriceAdjustmentSelectId,
  valuePage,
  setValuePage,
  tabPagesSaDetail,
  setTabPagesSaDetail,
}) => {
  const dispatch = useDispatch();
  const { data_product, data_price_code, data_price_rule, loading } =
    useSelector((state) => state.accountServiceAgreement);

  const [isIdChoose, setIsIdChoose] = useState([]);

  useEffect(() => {
    if (isMain) {
      if (Object.keys(dataDetailProduct).length !== 0) {
        setDataTableDetailProduct(dataDetailProduct);
      }
    } else {
      if (Object.keys(data_detail).length !== 0) {
        setDataTableDetailProduct(data_detail);
      }
    }
  }, [dataDetailProduct, data_detail]);

  const termOfServiceFromProductVersion =
    dataTableDetailProduct?.product?.productTos;

  // Tabs Use State
  const [isCustomTiering, setIsCustomTiering] = useState(false);
  // const [valuePage, setValuePage] = useState("Pricing");
  // const [tabPagesSaDetail, setTabPagesSaDetail] = useState([
  //   { value: "Pricing", paramValue: ["priceCode"] },
  //   { value: "Calculation Rule", paramValue: ["calculationType"] },
  //   { value: "Term of Service" },
  //   { value: "Late Charge" },
  //   { value: "Tax Implication" },
  // ]);

  const [idProduct, setIdProduct] = useState("");
  const [idCreateFrom, setIdCreateFrom] = useState(1);

  const [modalFormTos, setModalFormTos] = useState(false);
  const [dataFormTosModal, setDataFormTosModal] = useState({});
  const [tempDataUpdateTos, setTempDataUpdateTos] = useState({});
  const [dataTableTos, setDataTableTos] = useState([]);
  const [modalChooseTos, setModalChooseTos] = useState(false);
  const priceAdjustmentData = priceAdjustment;
  useEffect(() => {
    saDetailObj.pricingRule === -1
      ? setIsCustomTiering(true)
      : setIsCustomTiering(false);
  }, [saDetailObj.pricingRule]);

  useEffect(() => {
    // if (saDetailObj.createFrom === 2) {
    const selectedPriceCode = data_price_code?.filter(
      (item) => item.id === saDetailObj?.priceCode,
    )[0];
    const selectedPriceRule = data_price_rule?.filter(
      (item) => item.pricingRuleId === saDetailObj?.pricingRule,
    )[0];

    setSaDetailObj((prevState) => ({
      ...prevState,
      priceCodeText: `${
        selectedPriceCode?.priceCode
      }${selectedPriceCode?.mpricingDetail
        ?.map((item) => `/${item.currency}/${item.value}/${item.uomName}`)
        .join("")}`.replace(/\n/g, ""),
      pricingRuleText: hasValue(selectedPriceRule)
        ? selectedPriceRule?.name
        : "Custom Tiering",
    }));
    // }
  }, [
    data_price_code,
    data_price_rule,
    saDetailObj.createFrom,
    saDetailObj?.priceCode,
    saDetailObj?.pricingRule,
    setSaDetailObj,
  ]);

  // Handle Change Radio Tabs
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  // Handle Tos
  const closeModalFormTos = () => {
    setModalFormTos(false);
    setDataFormTosModal({});
    setTempDataUpdateTos({});
  };
  const openModalFormTos = (e) => {
    setDataFormTosModal(e);
    setModalFormTos(true);
    setTempDataUpdateTos(e);
  };
  const resetTableTosUpdate = () => {
    setDataFormTosModal(tempDataUpdateTos);
    setDataTableTos(dataFormTosModal?.tosDetail);
  };

  const handleShowHideTable = (e) => {
    setIdCreateFrom(e);
    form.resetFields([
      "productType",
      "serviceTypeProduct",
      "productClass",
      "productVersionId",
      "paymentType",
      "chargingMethod",
      "calculationType",
      "priceCode",
      "pricingRule",
      "priceAdjustment",
      "chooseProduct",
    ]);
    setDataListVersion([]);
    setDataTableDetailProduct({});
    setDataTableProduct([]);
    setDataPricing([]);
    setDataTableCalcRule([]);
    setDdlPriceCode([]);
    setDdlPriceRule([]);
    setDataTermOfService([]);
    setDataTableLateCharge([]);
    dispatch(resetDataDetail());
    setTabPagesSaDetail([
      { value: "Pricing", paramValue: ["priceCode"] },
      { value: "Calculation Rule", paramValue: ["calculationType"] },
      { value: "Term of Service" },
      { value: "Late Charge" },
      { value: "Tax Implication" },
    ]);
    if (e === 2) {
      form.resetFields(["priceCode", "pricingRule"]);

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
            let cstmTiering = {
              name: "Custom Tiering",
              pricingRuleId: -1,
            };
            setDdlPriceRule([...data, cstmTiering]);
            // setDdlPriceRule(data)
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  };

  // Show Hide Section Detial By Create From Id (1 or 2)
  const isCreateFromTwo = saDetailObj.createFrom === 2;
  const isCreateFromOneWithData =
    saDetailObj.createFrom === 1 && Object.keys(dataDetailProduct).length !== 0;
  const isDataAddon = saRecordData?.typeSa === "Amendment";

  const getLateCharge = (priceCodeId) => {
    const body = {
      accountId: idAccount,
      productVersionId:
        Object.keys(dataDetailProduct).length > 0
          ? saDetailObj.productVersionId
          : null,
      priceCode: [priceCodeId],
    };
    if (priceCodeId !== 0) {
      dispatch(getListLateCharge({ body }))
        .unwrap()
        .then((data) => {
          if (data) {
            const dataArrayLateCharge = Object.keys(data).map(
              (key) => data[key],
            );
            const filteredDataLateCharge = dataArrayLateCharge.filter(
              (item) => item !== null,
            );
            setDataTableLateCharge(filteredDataLateCharge);
            setSendLateCharge(data);
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  };

  // Select TOS
  const handleSelectTos = (e) => {
    const lastKey =
      dataTermOfService.length > 0
        ? dataTermOfService[dataTermOfService.length - 1].key
        : 0;
    const newData = {
      tosName: e.name,
      tosId: e.id,
      description: e.description,
      key: lastKey + 1,
      tosDetail: e.rtosAttributes.map((item, idx) => {
        return {
          attribute: item.attributeId,
          attributeName: item.attributeName,
          value: null,
          key: idx + 1,
        };
      }),
    };
    setDataTermOfService([...dataTermOfService, newData]);
    setIsIdChoose([...isIdChoose, newData.tosId]);
    setModalChooseTos(false);
  };

  const handleGetDetailPricing = (id) => {
    if (id !== -1) {
      dispatch(getListPriceRuleById(id))
        .unwrap()
        .then((data) => {
          if (data) {
            const res = data.map((item, index) => {
              return {
                currency: item.currency ? item.currency : "",
                currencyId: `${item.currency}`,
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
                uom: item.uom ? item.uom : "",
                uomName: item.uom ? item.uom : "",
                value: item.value ? item.value : "",
              };
            });
            setDataPricing(res);
            let arrPriceId = data.map((item) => item.priceCodeId);
            const body = {
              accountId: idAccount,
              productVersionId:
                Object.keys(dataDetailProduct).length > 0
                  ? saDetailObj.productVersionId
                  : null,
              priceCode: arrPriceId,
            };
            dispatch(getListLateCharge({ body }))
              .unwrap()
              .then((data) => {
                if (data) {
                  const resultArray = Object.values(data).map((item) => ({
                    createdDate: item.createdDate,
                    createdBy: item.createdBy,
                    updatedDate: item.updatedDate,
                    updatedBy: item.updatedBy,
                    status: item.status,
                    lateChargeId: item.latechargeId,
                    lateChargeName: item.latechargeName,
                    currency: item.currency,
                    maxAmount: item.maxAmount,
                    formula: item.formula,
                    description: item.description,
                  }));
                  setDataTableLateCharge(resultArray);
                }
              })
              .catch(() => {
                console.log("error");
              });
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  };

  useEffect(() => {
    const findPriceDetail = ddlPriceCode
      ?.filter((a) => a.id === priceAdjustment)?.[0]
      ?.mpricingDetail?.map((item) => item);
    if (findPriceDetail) {
      const adjustmentOne = findPriceDetail[0]?.adjustment;
      const adjustmentTwo = findPriceDetail[1]?.adjustment;
      const mergedAdjustmentText = `${adjustmentOne?.adjustmentText || ""} - ${
        adjustmentTwo?.adjustmentText || ""
      }`.trim();
      const cleanedString = mergedAdjustmentText.replace(/-+$/, "");
      setPriceAdjustmentSelect(cleanedString);

      const mergePriceAdjustmentId = [
        adjustmentOne?.priceAdjustmentDetailId || null,
        adjustmentTwo?.priceAdjustmentDetailId || null,
      ].filter(Boolean);
      setPriceAdjustmentSelectId(mergePriceAdjustmentId);
    }
  }, [priceAdjustment]);

  const handleLabelAdjustment = (e) => {
    setPriceAdjustment(e);
  };
  return (
    <div>
      {/* Start Section Create Form & Choose Product */}
      <div className="pt-8 pb-4">
        <h3 className="text-primary text-xs font-bold uppercase">
          SERVICE AGREEMENT DETAIL
        </h3>
      </div>
      <div className={"grid grid-cols-2 w-full gap-x-6"}>
        <Form.Item
          name={"createFrom"}
          label={"Create From"}
          getValueFromEvent={(e) => {
            handleSaDetailObj(e, "createFrom");
            handleLabelAdjustment(e);
          }}
          rules={[
            {
              message: "Please input your Create From",
              required: true,
            },
          ]}
        >
          <SelectComponent
            onChange={(e) => {
              handleShowHideTable(e);
              setSaDetailObj({ createFrom: e });
              form.setFieldsValue({ createFrom: e });
            }}
            disabled={saRecordData.typeSa === "Amendment"}
          >
            <Select.Option key={1} value={1}>
              PRODUCT
            </Select.Option>
            <Select.Option key={2} value={2}>
              CUSTOM
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        {saDetailObj.createFrom === 1 && (
          <Form.Item
            label={
              <>
                Choose Product{" "}
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              </>
            }
          >
            <div className="flex flex-row">
              <Input.Group compact>
                <Form.Item
                  name={"chooseProduct"}
                  rules={[
                    {
                      message: "Please input your Choose Product",
                      required: true,
                    },
                  ]}
                  noStyle
                  getValueFromEvent={() =>
                    handleSaDetailObj(idProduct, "chooseProduct")
                  }
                >
                  <Input value={saDetailObj.productName} disabled={true} />
                </Form.Item>
                {saRecordData.typeSa !== "Amendment" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setModalChooseProduct(true);
                    }}
                  >
                    Choose
                  </Button>
                )}
              </Input.Group>
            </div>
          </Form.Item>
        )}
      </div>

      {/* Start Section Product Type */}
      {saDetailObj.createFrom === 1 && (
        <div>
          <div className={"grid grid-cols-4 w-full gap-x-6"}>
            <Form.Item
              name={"productType"}
              label={"Product Type"}
              getValueFromEvent={(e) => handleSaDetailObj(e, "productType")}
            >
              <InputComponent disabled={true} />
            </Form.Item>
            <Form.Item
              name={"serviceTypeProduct"}
              label={"Service Type"}
              getValueFromEvent={(e) =>
                handleSaDetailObj(e, "serviceTypeProduct")
              }
            >
              <InputComponent disabled={true} />
            </Form.Item>
            <Form.Item
              name={"productClass"}
              label={"Product Class"}
              getValueFromEvent={(e) => handleSaDetailObj(e, "productClass")}
            >
              <InputComponent disabled={true} />
            </Form.Item>
            <Form.Item
              name={"productVersionId"}
              label={"Product Version"}
              getValueFromEvent={(e) =>
                handleSaDetailObj(e, "productVersionId")
              }
              rules={[
                {
                  message: "Please input your Product Version",
                  required: true,
                },
              ]}
            >
              <SelectComponent
                onChange={(e) => getDetailProductByVersionId(e)}
                disabled={saRecordData.typeSa === "Amendment"}
              >
                {dataListVersion?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item?.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
            {/* Description      */}
            {/* {dataTableDetailProduct?.product?.description && ( */}
            {/* )} */}
          </div>
          <div className={"grid grid-cols-1 w-full gap-x-6"}>
            {/* <p>Description</p>
            <p>{dataTableDetailProduct?.product?.description}</p> */}
            <Form.Item
              name={"descriptionProduct"}
              label={"Description"}
              getValueFromEvent={(e) =>
                handleSaDetailObj(e, "descriptionProduct")
              }
            >
              <InputComponent type="textarea" disabled={true} />
            </Form.Item>
          </div>
        </div>
      )}

      {(isCreateFromTwo || isCreateFromOneWithData || isDataAddon) && (
        <>
          {/* Table Product Detail */}
          <TableProduct
            dispatch={dispatch}
            dataTableProduct={dataTableProduct}
            setDataTableProduct={setDataTableProduct}
            isProduct={saDetailObj.createFrom}
            // dataFromProductVersion={productDetail}
            dataTableDetailProduct={dataTableDetailProduct}
            handleSaDetailObj={handleSaDetailObj}
            setSaDetailObj={setSaDetailObj}
            saDetailObj={saDetailObj}
          />

          {/* Section Table Service Agreement Detail */}
          <div className="pt-8 pb-4">
            {/* ==== Tabs ==== */}
            <div>
              <RadioTabs
                data={tabPagesSaDetail}
                onChange={onChange}
                currentPosition={valuePage}
              />

              <div className="py-8">
                {/* Tab Pricing */}
                <div className={`${valuePage !== "Pricing" ? "hidden" : ""}`}>
                  <div className={"grid grid-cols-2 w-full gap-x-6"}>
                    {/* DDL PRICE CODE */}
                    <div>
                      <p className="text-primary text-xs font-bold uppercase py-b">
                        PRICE CODE
                      </p>
                      <Form.Item
                        name={"priceCode"}
                        label={"Price Code"}
                        rules={[
                          {
                            message: "Please input your Price Code",
                            required: true,
                          },
                        ]}
                        getValueFromEvent={(e) =>
                          handleSaDetailObj(e, "priceCode")
                        }
                      >
                        <SelectComponent
                          onChange={(e) => {
                            {
                              e !== undefined && getLateCharge(e);
                            }
                            handleLabelAdjustment(e);
                          }}
                        >
                          {ddlPriceCode?.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.priceCode}
                              {item?.mpricingDetail?.map((val) => (
                                <>
                                  <span>
                                    /{val.currency}/{val.value}/{val.uomName}
                                  </span>
                                </>
                              ))}
                            </Select.Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                    </div>

                    {/* LABEL PRICE ADJUSTMENT */}
                    <div>
                      <p className="text-primary text-xs font-bold uppercase py-b">
                        PRICE ADJUSTMENT
                      </p>
                      {/* <span>
                        {priceAdjustmentSelect}
                      </span> */}
                      <Form.Item
                        name={"priceAdjustment"}
                        label={"Price Adjustment"}
                        getValueFromEvent={(e) =>
                          handleSaDetailObj(e, "priceAdjustment")
                        }
                      >
                        <InputComponent disabled={true} />
                      </Form.Item>
                    </div>
                  </div>

                  <div className={"grid grid-cols-1 w-full gap-x-6"}>
                    {/* DDL PRICE RULE */}
                    <div>
                      <p className="text-primary text-xs font-bold uppercase py-b">
                        PRICING RULE
                      </p>
                      <Form.Item
                        name={"pricingRule"}
                        label={"Pricing Rule"}
                        // rules={[
                        //   {
                        //     message: "Please input your",
                        //     required: true,
                        //   },
                        // ]}
                        getValueFromEvent={(e) =>
                          handleSaDetailObj(e, "pricingRule")
                        }
                      >
                        <SelectComponent
                          onChange={(e) => {
                            if (e !== undefined) {
                              handleGetDetailPricing(e);
                              setIsCustomTiering(e === -1 ? true : false);
                            } else {
                              setDataPricing([]);
                            }
                          }}
                        >
                          {ddlPriceRule?.map((item) => (
                            <Select.Option
                              key={item.pricingRuleId}
                              value={item.pricingRuleId}
                            >
                              {item.name}
                            </Select.Option>
                          ))}
                        </SelectComponent>
                      </Form.Item>
                    </div>
                  </div>

                  <TablePricing
                    setData={setDataPricing}
                    data={dataPricing}
                    setValueOrUnlimited={setValueOrUnlimited}
                    valueOrUnlimited={valueOrUnlimited}
                    type={type}
                    isProduct={saDetailObj.createFrom}
                    dataFromApi={dataPricingTable}
                    ddlPriceCode={ddlPriceCode}
                    // dataMapPricing={dataDetailPricing}
                    isCustomTiering={isCustomTiering}
                    idCreateFrom={idCreateFrom}
                  />
                </div>

                {/* Calculation Rule */}
                <div
                  className={`${
                    valuePage !== "Calculation Rule" ? "hidden" : ""
                  }`}
                >
                  <TableCalcRule
                    dispatch={dispatch}
                    dataTable={dataTableCalcRule}
                    updateTable={setDataTableCalcRule}
                    isProduct={saDetailObj.createFrom}
                    handleSaDetailObj={handleSaDetailObj}
                    setSaDetailObj={setSaDetailObj}
                    saDetailObj={saDetailObj}
                    // data={calculationRule}
                  />
                </div>

                {/* Term Of Service */}
                <div
                  className={`${
                    valuePage !== "Term of Service" ? "hidden" : ""
                  }`}
                >
                  <TableTos
                    isProduct={saDetailObj.createFrom}
                    dataTermOfService={dataTermOfService}
                    setDataTermOfService={setDataTermOfService}
                    setModalFormTos={setModalFormTos}
                    openModalFormTos={openModalFormTos}
                    setModalChooseTos={setModalChooseTos}
                    dataTableDetailProduct={dataTableDetailProduct}
                  />
                </div>

                {/* Late Charge */}
                <div
                  className={`${valuePage !== "Late Charge" ? "hidden" : ""}`}
                >
                  <TableLateCharge
                    dataTableLateCharge={dataTableLateCharge}
                    setDataTableLateCharge={setDataTableLateCharge}
                  />
                </div>

                {/* Tax Implication */}
                <div
                  className={`${
                    valuePage !== "Tax Implication" ? "hidden" : ""
                  }`}
                >
                  <TableTaxImplication
                    dataTaxImplication={dataTaxImplication}
                    setDataTaxImplication={setDataTaxImplication}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Choose Product */}
      {modalChooseProduct ? (
        <ModalChooseProduct
          modalChooseProduct={modalChooseProduct}
          setModalChooseProduct={setModalChooseProduct}
          dataProduct={data_product}
          getProductDetailById={getProductDetailById}
          getListProduct={getListProduct}
          idAccount={idAccount}
          serviceType={saInfoObj.serviceType}
          dispatch={dispatch}
          isMain={isMain}
          saRecordData={saRecordData}
        />
      ) : null}

      {/* Modal TOS Form */}
      {modalFormTos ? (
        <ModalForm
          modalFormTos={modalFormTos}
          closeModalFormTos={closeModalFormTos}
          dataFormTosModal={dataFormTosModal}
          dataTermOfService={dataTermOfService}
          setDataTermOfService={setDataTermOfService}
          tempDataUpdateTos={tempDataUpdateTos}
          resetTableTosUpdate={resetTableTosUpdate}
          dataTableTos={dataTableTos}
          setDataTableTos={setDataTableTos}
          setModalFormTos={setModalFormTos}
        />
      ) : null}

      {modalChooseTos ? (
        <ModalChooseTos
          idAccount={idAccount}
          isOpen={modalChooseTos}
          setModalChooseTos={setModalChooseTos}
          getListChooseTos={getListChooseTos}
          dispatch={dispatch}
          dataListChooseTos={dataListChooseTos}
          handleSelectTos={handleSelectTos}
          isIdChoose={isIdChoose}
        />
      ) : null}
    </div>
  );
};

export default SaDetail;
