import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Badge,
  Button,
  Form,
  Input,
  Select,
} from "antd";
import SelectComponent from "../../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../../components/InputComponent";
import { hasValue } from "../../../../../../../../utils";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";

import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import TableLateCharge from "./TableLateCharge";
import TableTaxImplication from "./TableTaxImplication";

import TablePricing from "./TablePricing";
import TableCalcRule from "./TableCalcRule";
import TableProduct from "./TableProductDetail";
import TableTos from "./TableTos";
import ModalForm from "./TableTos/ModalForm";
import ModalChooseTos from "./TableTos/ModalChooseTos";
import {
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
  loadingChooseProduct,
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
  dataSaChildType = []
}) => {
  const dispatch = useDispatch();
  const { data_product, data_price_code, data_price_rule, data_sa_child_type, loading } =
    useSelector((state) => state.accountServiceAgreement);

  /**
   * Helper: Determine Create From value based on SA Type (for Child SA only)
   * Returns: 1 (Product) for ADDON, 2 (Others) for OTHERS, null otherwise
   */
  const getCreateFromValue = () => {
    // Only for Child SA (addon)
    if (saRecordData?.typeSa !== "addon") {
      return null;
    }

    // Get SA Type VALUE (string like "ADDON" or "OTHERS")
    const saTypeValue = saInfoObj?.serviceAgreementTypeValue;

    // Map SA Type to Create From value
    if (saTypeValue === "ADDON") {
      return 1; // Lock to Product
    } else if (saTypeValue === "OTHERS") {
      return 2; // Lock to Others/Custom
    }

    return null;
  };

  /**
   * Helper: Check if Create From should be locked/disabled
   * Locked for Child SA (addon), enabled for Main and Amendment
   */
  const isCreateFromLocked = () => {
    return saRecordData?.typeSa === "addon";
  };

  /**
   * Render SA Child Type field dynamically based on SA Type
   * Only for Child SA (typeSa === "addon")
   */
  const renderSaChildTypeField = () => {
    // Only for Child SA, not for Main or Amendment
    if (saRecordData?.typeSa !== "addon") {
      return null;
    }

    // Get SA Type VALUE (string like "ADDON" or "OTHERS")
    const saTypeValue = saInfoObj?.serviceAgreementTypeValue;
    // console.log("saTypeValue", saTypeValue);
    // Case 1: SA Type = ADDON → Input (disabled, auto-filled from product)
    if (saTypeValue === "ADDON") {
      return (
        <Form.Item
          label="Service Agreement Child Type"
          name="serviceAgreementChildType"
          tooltip="Auto-populated from selected product"
        >
          <InputComponent
            disabled={true}
            value={saDetailObj?.productName || ""}
            placeholder="Select product to auto-populate"
            style={{ backgroundColor: "#f5f5f5" }}
            rules={[
              {
                message: "Please select product",
                required: true,
              },
            ]}
          />
        </Form.Item>
      );
    }

    // Case 2: SA Type = OTHERS → Dropdown (enabled, manual select)
    if (saTypeValue === "OTHERS") {
      return (
        <Form.Item
          label="Service Agreement Child Type"
          name="serviceAgreementChildType"
          getValueFromEvent={(e) => handleSaDetailObj(e, "serviceAgreementChildType")}
          rules={[
            {
              required: true,
              message: "Please select Service Agreement Child Type"
            }
          ]}
        >
          <SelectComponent
            placeholder="Select SA Child Type"
            onChange={(e) => handleSaDetailObj(e, "serviceAgreementChildType")}
          >
            {(dataSaChildType || data_sa_child_type)?.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      );
    }

    // Case 3: SA Type not selected yet → Show placeholder
    return (
      <Form.Item
        label="Service Agreement Child Type"
        name="serviceAgreementChildType"
      >
        <InputComponent
          disabled={true}
          placeholder="Select Service Agreement Type first"
          style={{ backgroundColor: "#f5f5f5" }}
        />
      </Form.Item>
    );
  };

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
    if (saDetailObj) {
      saDetailObj.pricingRule === -1
        ? setIsCustomTiering(true)
        : setIsCustomTiering(false);
    }
  }, [saDetailObj?.pricingRule]);

  useEffect(() => {
    if (saDetailObj.createFrom === 2) {
    const selectedPriceCode = data_price_code?.filter(
      (item) => item.id === saDetailObj?.priceCode
    )[0];
    const selectedPriceRule = data_price_rule?.filter(
      (item) => item.pricingRuleId === saDetailObj?.pricingRule
    )[0];

    setSaDetailObj((prevState) => ({
      ...prevState,
      priceCodeText: selectedPriceCode
        ? `${selectedPriceCode.priceCode || ""}${selectedPriceCode.mpricingDetail
          ?.map((item) => `/${item.currency}/${item.value}/${item.uomName}`)
          .join("") || ""
          }`.replace(/\n/g, "")
        : "",
      pricingRuleText: selectedPriceRule && selectedPriceRule.name
        ? selectedPriceRule.name
        : "Custom Tiering",
    }));
    }
  }, [
    data_price_code,
    data_price_rule,
    saDetailObj?.createFrom,
    saDetailObj?.priceCode,
    saDetailObj?.pricingRule,
    setSaDetailObj,
  ]);

  // Auto-set Create From when SA Type changes (for Child SA only)
  useEffect(() => {
    if (saInfoObj?.serviceAgreementType && saRecordData?.typeSa === "addon") {
      const createFromValue = getCreateFromValue();

      // Only update if the value needs to change (not on initial load if already set correctly)
      if (createFromValue && createFromValue !== saDetailObj?.createFrom) {
        // Update form field
        form.setFieldsValue({
          createFrom: createFromValue
        });

        // Update state
        handleSaDetailObj(createFromValue, "createFrom");
        setSaDetailObj(prev => ({
          ...prev,
          createFrom: createFromValue
        }));
      }
    }
  }, [saInfoObj?.serviceAgreementType]);

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
      "chooseProduct"
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
  const isCreateFromTwo = saDetailObj?.createFrom === 2;
  const isCreateFromOneWithData =
    saDetailObj?.createFrom === 1 && Object.keys(dataDetailProduct).length !== 0;
  const isDataAddon = saRecordData?.typeSa === "Amendment";

  const getLateCharge = (priceCodeId) => {
    const body = {
      accountId: idAccount,
      productVersionId:
        Object.keys(dataDetailProduct).length > 0
          ? saDetailObj?.productVersionId
          : null,
      priceCode: [priceCodeId],
    };
    if (priceCodeId !== 0) {
      dispatch(getListLateCharge({ body }))
        .unwrap()
        .then((data) => {
          if (data) {
            const dataArrayLateCharge = Object.keys(data).map(
              (key) => data[key]
            );
            const filteredDataLateCharge = dataArrayLateCharge.filter(
              (item) => item !== null
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
    // Clear table first before fetching
    setDataPricing([]);
    setDataTableLateCharge([]);
    setSendLateCharge({});

    if (id !== -1) {
      dispatch(getListPriceRuleById(id))
        .unwrap()
        .then((data) => {
          if (data) {
            const res = data.filter(Boolean).map((item, index) => {
              return {
                currency: item?.currency,
                currencyId: item?.currency,
                description: item?.description,
                flag: null,
                id: item?.priceCodeId,
                idPricing: item?.pricingRuleDetailId,
                key: `${item?.priceCodeId ?? 'pc'}-${item?.min ?? 0}-${item?.max ?? 'unlim'}-${index}`,
                lineNumber: item?.lineNumber,
                max: item?.max,
                maximumName: null,
                min: item?.min,
                priceCode: item?.priceCodeId,
                priceCodeName: item?.priceCode,
                priceDetail: `${item?.value}/${item?.currencyName}/${item?.uomName}`,
                unlimited: item?.isUnlim,
                uom: item?.uom,
                uomName: item?.uom,
                value: item?.value,
                adjustment: item?.adjustment?.adjustmentText,
                adjustmentId: item?.adjustment?.priceAdjustmentDetailId,
              };
            });
            setDataPricing(res);
            let arrPriceId = data.map((item) => item?.priceCodeId).filter(Boolean);
            const body = {
              accountId: idAccount,
              productVersionId:
                Object.keys(dataDetailProduct).length > 0
                  ? saDetailObj?.productVersionId
                  : null,
              priceCode: arrPriceId,
            };
            dispatch(getListLateCharge({ body }))
              .unwrap()
              .then((data) => {
                if (data) {
                  const resultArray = Object.values(data ?? {})
                      .filter(Boolean)
                      .map(({
                        createdDate,
                        createdBy,
                        updatedDate,
                        updatedBy,
                        status,
                        lateChargeId,
                        lateChargeName,
                        currency,
                        maxAmount,
                        formula,
                        description,
                      }) => ({
                        createdDate,
                        createdBy,
                        updatedDate,
                        updatedBy,
                        status,
                        lateChargeId,
                        lateChargeName,
                        currency,
                        maxAmount,
                        formula,
                        description,
                      }));
                  setDataTableLateCharge(resultArray);
                  setSendLateCharge(data);
                }
              })
              .catch((e) => {
                console.log("error", e);
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
      const mergedAdjustmentText = `${adjustmentOne?.adjustmentText || ""} - ${adjustmentTwo?.adjustmentText || ""
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

  // Helper function to get badge count for a specific tab
  const getBadgeCount = (value) => {
    if (!tabPagesSaDetail) return 0;
    const tabObj = tabPagesSaDetail.find((item) => item.value === value);
    return tabObj ? tabObj.errorBadge : 0;
  };

  const BadgeLabel = ({ label, count }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {label}
      {count > 0 && (
        <span
          style={{
            marginLeft: 8,
            backgroundColor: '#ff4d4f',
            color: 'white',
            borderRadius: '10px',
            padding: '0 6px',
            fontSize: '10px',
            lineHeight: '16px',
            height: '16px',
            minWidth: '16px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          {count}
        </span>
      )}
    </div>
  );

  return (
    <Fragment>
      <NxCardContainer header={"SERVICE AGREEMENT DETAIL"}>
        <div className="flex flex-col gap-y-4">
          {/* Start Section Create Form & Choose Product */}
          <NxBaseContainer border header={"CREATE FROM"}>
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
                  disabled={isCreateFromLocked()}
                >
                  <Select.Option key={1} value={1}>
                    PRODUCT
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    CUSTOM
                  </Select.Option>
                </SelectComponent>
              </Form.Item>
              {/* SA Child Type field - dynamic rendering based on SA Type */}
              {renderSaChildTypeField()}
              {saDetailObj?.createFrom === 1 && (
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
                            message: "Please Choose Product",
                            required: true,
                          },
                        ]}
                        noStyle
                        getValueFromEvent={() =>
                          handleSaDetailObj(idProduct, "chooseProduct")
                        }
                      >
                        <Input value={saDetailObj?.productName} disabled={true} />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          setModalChooseProduct(true);
                        }}
                        loading={loadingChooseProduct}
                      >
                        Choose
                      </Button>
                    </Input.Group>
                  </div>
                </Form.Item>
              )}
            </div>
          </NxBaseContainer>

          {/* Start Section Product Type */}
          {saDetailObj?.createFrom === 1 && (
            <NxBaseContainer border header={"PRODUCT INFORMATION"}>
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
                      message: "Please input Product Version",
                      required: true,
                    },
                  ]}
                >
                  <SelectComponent
                    onChange={(e) => getDetailProductByVersionId(e)}
                    disabled={false}
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
            </NxBaseContainer>
          )}

          {(isCreateFromTwo || isCreateFromOneWithData || isDataAddon) && (
            <>
              <NxBaseContainer border header={"Payment Information"}>

                {/* Table Product Detail */}
                <TableProduct
                  dispatch={dispatch}
                  dataTableProduct={dataTableProduct}
                  setDataTableProduct={setDataTableProduct}
                  isProduct={saDetailObj?.createFrom}
                  // dataFromProductVersion={productDetail}
                  dataTableDetailProduct={dataTableDetailProduct}
                  handleSaDetailObj={handleSaDetailObj}
                  setSaDetailObj={setSaDetailObj}
                  saDetailObj={saDetailObj}
                />

              </NxBaseContainer>
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
      </NxCardContainer >



      {
        (isCreateFromTwo || isCreateFromOneWithData || isDataAddon) && (
          <>
            <div className="flex flex-col gap-y-4 py-4">
              <NxCardContainer
                header={"Pricing Information"}
                type="tabs"
                element={
                  <div className="py-4">
                    <NxTabs
                      items={[
                        {
                          key: "pricing",
                          label: <BadgeLabel label="Pricing" count={getBadgeCount("Pricing")} />,
                          children: (
                            <NxBaseContainer border>
                              <div className={"grid grid-cols-3 w-full gap-x-6"}>
                                {/* DDL PRICE CODE */}
                                <div>
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
                                        if (e !== undefined) {
                                          getLateCharge(e);
                                          const selectedOption = ddlPriceCode?.find(
                                            (item) => item.id === e
                                          );
                                          const fullPriceCodeText = selectedOption
                                            ? `${selectedOption.priceCode || ""}${selectedOption?.mpricingDetail
                                                ?.map((item) => `/${item.currency}/${item.value}/${item.uomName}`)
                                                .join("") || ""}`.replace(/\n/g, "")
                                            : "";
                                          setSaDetailObj((prev) => ({
                                            ...prev,
                                            priceCode: e,
                                            priceCodeText: fullPriceCodeText,
                                          }));
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

                                <div>
                                  <Form.Item
                                    name={"pricingRule"}
                                    label={"Pricing Rule"}
                                    getValueFromEvent={(e) =>
                                      handleSaDetailObj(e, "pricingRule")
                                    }
                                  >
                                    <SelectComponent
                                      onChange={(e) => {
                                        if (e !== undefined) {
                                          const isCustom = e === -1;
                                          setIsCustomTiering(isCustom);
                                          const selectedRule = ddlPriceRule?.find(
                                            (item) => item.pricingRuleId === e
                                          );

                                          // Always clear table data first
                                          // setDataPricing([]);
                                          // setDataTableLateCharge([]);
                                          // setSendLateCharge({});

                                          // Sync saDetailObj 1:1
                                          setSaDetailObj((prev) => ({
                                            ...prev,
                                            pricingRule: e,
                                            pricingRuleText: isCustom ? "Custom Tiering" : (selectedRule?.name || ""),
                                          }));

                                          if (!isCustom) {
                                            // Non-custom: fetch from API, data populated on response
                                            handleGetDetailPricing(e);
                                          }
                                        } else {
                                          // Cleared: reset everything
                                          setDataPricing([]);
                                          setDataTableLateCharge([]);
                                          setSendLateCharge({});
                                          setIsCustomTiering(false);
                                          setSaDetailObj((prev) => ({
                                            ...prev,
                                            pricingRule: null,
                                            pricingRuleText: null,
                                          }));
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
                                isProduct={saDetailObj?.createFrom}
                                dataFromApi={dataPricingTable}
                                ddlPriceCode={ddlPriceCode}
                                isCustomTiering={isCustomTiering}
                                idCreateFrom={idCreateFrom}
                              />
                            </NxBaseContainer>
                          ),
                        },
                        {
                          key: "calculationRule",
                          label: <BadgeLabel label="Calculation Rule" count={getBadgeCount("Calculation Rule")} />,
                          children: (
                            <NxBaseContainer border>
                              <TableCalcRule
                                dispatch={dispatch}
                                dataTable={dataTableCalcRule}
                                updateTable={setDataTableCalcRule}
                                isProduct={saDetailObj?.createFrom}
                                handleSaDetailObj={handleSaDetailObj}
                                setSaDetailObj={setSaDetailObj}
                                saDetailObj={saDetailObj}
                              />
                            </NxBaseContainer>
                          ),
                        },
                        {
                          key: "termOfService",
                          label: <BadgeLabel label="Term of Service" count={getBadgeCount("Term of Service")} />,
                          children: (
                            <NxBaseContainer border>
                              <TableTos
                                isProduct={saDetailObj?.createFrom}
                                dataTermOfService={dataTermOfService}
                                setDataTermOfService={setDataTermOfService}
                                setModalFormTos={setModalFormTos}
                                openModalFormTos={openModalFormTos}
                                setModalChooseTos={setModalChooseTos}
                                dataTableDetailProduct={dataTableDetailProduct}
                              />
                            </NxBaseContainer>
                          ),
                        },
                        {
                          key: "lateCharge",
                          label: <BadgeLabel label="Late Charge" count={getBadgeCount("Late Charge")} />,
                          children: (
                            <NxBaseContainer border>
                              <TableLateCharge
                                dataTableLateCharge={dataTableLateCharge}
                                setDataTableLateCharge={setDataTableLateCharge}
                              />
                            </NxBaseContainer>
                          ),
                        },
                        {
                          key: "taxImplication",
                          label: <BadgeLabel label="Tax Implication" count={getBadgeCount("Tax Implication")} />,
                          children: (
                            <NxBaseContainer border>
                              <TableTaxImplication
                                dataTaxImplication={dataTaxImplication}
                                setDataTaxImplication={setDataTaxImplication}
                              />
                            </NxBaseContainer>
                          ),
                        },
                      ]}
                      activeKey={valuePage}
                      onChange={(key) => setValuePage(key)}
                    />
                  </div>
                }
                hideChildren
                withoutPadding
              />
            </div>
          </>
        )
      }
    </Fragment >
  );
};

export default SaDetail;
