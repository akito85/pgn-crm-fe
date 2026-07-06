import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { Form, Spin } from "antd";
import PricingRule from "./Form/PricingRule";
import Approval from "./Form/Approval";
import RadioTabs from "../../../../components/RadioTabs";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import { WarningOutlined, LeftOutlined } from "@ant-design/icons";
import ConfirmationLayout from "./Modal/ConfirmationLayout";
import {
  createPricingRule,
  getSelectCriteria,
  getAllApprovalList,
  getListApprovalById,
  getSelectCategory,
} from "../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import BaseContainer from "../../../../components/BaseContainer";
import { getCriteriaIdByCode, handleCheckCriteriaMissingValidation, handleMappingCriteriaGeneral } from "../UtilsProduct/UtilsAllProduct";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";

const PricingRuleCreate = () => {
  // Selector
  const { loading, data_select_criteria, data_approval, data_approval_list } =
    useSelector((state) => state.pricingRule);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // State
  const [valuePage, setValuePage] = useState("Pricing Rule");
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [boolean, setBoolean] = useState(false);
  const [flag, setFlag] = useState(0);
  const [bodyData, setBodyData] = useState({});
  const [data, setData] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [tabPagesEmployee, setTabPagesEmployee] = useState([
    {
      value: "Pricing Rule",
      paramValue: ["name", "rPricingRuleCriterias", "startDate"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const isLoading = loading || loadingForm;

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  // Use Effect
  useEffect(() => {
    dispatch(getSelectCriteria());
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(bodyData).length === 0) {
    } else {
      dispatch(getListApprovalById(bodyData?.apphierId));
    }
  }, [dispatch, bodyData]);

  useEffect(() => {
    if (
      data_select_criteria &&
      data_select_criteria &&
      data_select_criteria?.length > 0
    ) {
      const tempCriterias = (data_select_criteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
        code: criteria?.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_select_criteria]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRICING_RULE,
      breadcrumbName: "Pricing Rule",
    },
    {
      path: PRODUCT_PROMO_ROUTES.CREATE_PRICING_RULE,
      breadcrumbName: "Create Pricing Rule",
    },
  ];

  // Handle Change Radio Tabs
  const onChange = (e) => {
    if (!storedDataInline) {
      setValuePage(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  // Handle Save for Modal Confirmation
  const handleSave = useCallback(
    async (formValue) => {
      try{
        let errorBody = {};
        if (data.length === 0) {
          errorBody = {
            title: "Failed",
            description: `Pricing Rule Detail Mandatory. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else if (storedDataInline) {
          errorBody = {
            title: "Failed",
            description: `Please save data table inline before submit. Please try again.`,
          };
          dispatch(showModalError(errorBody));
        } else if (
          handleCheckCriteriaMissingValidation(
            criteriaOptions,
            formValue?.rPricingRuleCriterias,
            listDataCriteria,
            () => {}
          )
        ) {
          const errorBody = {
            title: "Failed",
            description: `There is missing values in table criteria. Please try again`,
          };
          dispatch(showModalError(errorBody));
        } else {
          const modifiedArray = data.map((obj) => {
            const { key, ...rest } = obj;
            return rest;
          });
  
          const criteriaArrayObject = formValue.rPricingRuleCriterias.map(
            (item) => {
              return {
                criteria: item,
              };
            }
          );
  
          let dataCriteriaObject = listDataCriteria.map(
            (item, index) =>
              handleMappingCriteriaGeneral({
                item: item,
                index: index,
                columnsTable: columnsTableCriteriaAll(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  getCriteriaIdByCode(data_select_criteria, "COUNTRY", "id")
                ),
                criteriaValues: criteriaValues,
                dataListCriteria: data_select_criteria?.map((item) => {
                  return {
                    ...item,
                    id: item.Id,
                    name: item.text,
                  };
                }),
              })
  
            // return {
            //   budget: item.budget?.value || null,
            //   subDistrict: item.subDistrict?.value || null,
            //   district: item.district?.value || null,
            //   city: item.city?.value || null,
            //   province: item.province?.value || null,
            //   area: item.area?.value || null,
            //   sor: item.sor?.value || null,
            //   industrialSector: item.industrialSector?.value || null,
            //   product: item.product?.value || null,
            //   gsizes: item.gsizes?.value || null,
            //   customerSegment: item.customerSegment?.value || null,
            //   accountGroup: item.accountGroup?.value || null,
            //   accountClass: item.accountClass?.value || null,
            //   accountCategory: item.accountCategory?.value || null,
            //   serviceType: item.serviceType?.value || null,
            //   customer: item.customer?.value || null,
            // };
          );
  
          // const filteredCriteria = columnsTableCriteria().filter(
          //   (item) => !formValue.rPricingRuleCriterias.includes(item.indexValue)
          // );
  
          // dataCriteriaObject = dataCriteriaObject?.map((item) => {
          //   let obj = { ...item };
          //   filteredCriteria.forEach((criteria) => {
          //     obj[criteria.dataIndexForm] = null;
          //   });
          //   return obj;
          // });
  
          const includesAll = formValue.rPricingRuleCriterias.includes(24);
  
          const dataValue = {
            name: formValue.name,
            description: formValue.description,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            flag: flag,
            apphierId: formValue.apphierId,
            mPricingRuleDetails: modifiedArray,
            rPricingRuleCriterias: criteriaArrayObject,
            rPricingRuleCriteriaDatas: includesAll
              ? [{ allCriteria: true }]
              : dataCriteriaObject,
          };
  
          setBodyData(dataValue);
          setTabPagesEmployee([
            {
              value: "Pricing Rule",
              paramValue: ["name", "rPricingRuleCriterias"],
            },
            { value: "Approval", paramValue: ["apphierId"] },
            { value: "Attachment" },
          ]);
  
          const validateValueObj = {
            body: dataValue,
            services: productPromoHttpService,
            endPoint: "/v1/dbs/api/pricingRule/validate-create",
            type: "create",
          };
          await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
  
          setModalConfirm(true);
      }
      }  catch (error) {
        console.log(error);
      }
    },
    [
      criteriaOptions,
      criteriaValues,
      data,
      data_select_criteria,
      dispatch,
      flag,
      listDataCriteria,
      storedDataInline,
    ]
  );

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      form.resetFields();
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // Handle Confirm
  const handleConfirm = () => {
    bodyData?.mPricingRuleDetails?.map((e) => {
      return {
        id: delete e.id,
        currency: delete e.currency,
        idPricing: delete e.idPricing,
        uom: delete e.uom,
        value: delete e.value,
        priceCodeName: delete e.priceCodeName,
        maximumName: delete e.maximumName,
        priceDetail: delete e.priceDetail,
      };
    });

    const getUniqueListBy = (arr) => {
      return [
        ...new Map(
          arr.map((item) => [`${item["priceCode"]}~${item["min"]}`, item])
        ).values(),
      ];
    };

    const body = {
      ...bodyData,
      mPricingRuleDetails: getUniqueListBy(bodyData.mPricingRuleDetails),
    };

    dispatch(createPricingRule({ body: body }))
      .unwrap()
      .then(async (data) => {
        setLoadingForm(true);
        const idPricingRule = data.pricingRuleId;
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            category: element.fileCategoryId,
          };
          await productPromoHttpService.uploadAttachment(
            `/v1/dbs/api/pricingRule/uploadAttachment/${idPricingRule}`,
            body
          );
        }
        setLoadingForm(false);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setModalConfirm(false);
          setBodyError({ message });
          setModalError(true);
        }
        setModalConfirm(false);
      });
    // console.log({ bodyData: bodyData }, listDataAttachment);
  };

  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabPagesEmployee((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  const handleClear = () => {
    form.resetFields();
    setListDataAttachment([]);
    setListDataCriteria([]);
    setCriteriaValues([]);
    setData([]);
    setDataTable([]);
    setBoolean(false);
    setStoredDataInline(false);
    setStartDate(undefined);
    setCriteriaOptions([]);
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

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <div className="flex flex-col gap-y-4">
          <RadioTabs
            data={tabPagesEmployee}
            onChange={onChange}
            currentPosition={valuePage}
          />
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            onFinishFailed={handleError}
          >
            <div className={`${valuePage !== "Pricing Rule" ? "hidden" : ""}`}>
              <PricingRule
                form={form}
                type={"create"}
                setData={setData}
                data={data}
                setValueOrUnlimited={setValueOrUnlimited}
                valueOrUnlimited={valueOrUnlimited}
                listDataCriteria={listDataCriteria}
                setListDataCriteria={setListDataCriteria}
                criteriaValues={criteriaValues}
                setCriteriaValues={setCriteriaValues}
                setStoredData={setStoredDataInline}
                storedData={storedDataInline}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>

            <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
              <Approval
                type={"create"}
                apiApproval={data_approval}
                apiApprovalList={data_approval_list}
                dataTable={dataTable}
                setDataTable={setDataTable}
                boolean={boolean}
                setBoolean={setBoolean}
              />
            </div>

            <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
              {/* <Attachment
                type={"create"}
                data={listDataAttachment}
                updateData={setListDataAttachment}
              /> */}
              <NxCardContainer header={"Attachment Information"}>
                <AttachmentSectionForm
                  type={"create"}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  typeSelector={"pricingRule"}
                  getAPICategory={getSelectCategory}
                />
              </NxCardContainer>
            </div>

            <div className="mt-[30px] flex">
              <ButtonComponent
                type={"submit"}
                onClick={handleBack}
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

              <div className={"w-full flex justify-end gap-5"}>
                <Form.Item>
                  <ButtonComponent
                    icon={<SVGIcon name="IconButtonClear" width={24} />}
                    type="submit"
                    onClick={() => {
                      handleClear();
                    }}
                    disabled={storedDataInline}
                  >
                    Clear
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    onClick={() => setFlag(1)}
                    disabled={storedDataInline}
                  >
                    Save as Draft
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    onClick={() => setFlag(2)}
                    disabled={storedDataInline}
                  >
                    Save & Submit
                  </ButtonComponent>
                </Form.Item>
              </div>
            </div>
          </Form>

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

          {/* Modal Confirmation*/}
          <ConfirmationLayout
            data={bodyData}
            openModal={modalConfirm}
            closeModal={() => setModalConfirm(false)}
            handleConfirm={() => handleConfirm()}
            tabsPricingRule={tabPagesEmployee}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            dataAttachment={listDataAttachment}
            apiCriteria={data_select_criteria}
            apiApproval={data_approval}
            apiApprovalList={data_approval_list}
            loading={isLoading}
          />

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
                flag === 1 ? "created" : "submitted"
              }. ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        </div>
      </Spin>
    </>
  );
};

export default PricingRuleCreate;
