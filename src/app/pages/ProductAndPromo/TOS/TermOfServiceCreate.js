import React, { useState, useEffect, useCallback } from "react";
import { Form, Spin, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BaseContainer from "../../../../components/BaseContainer";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { getSelectCriteria } from "../../../../redux/slices/product_promo/tos";
import {
  getTosAttribute,
  createTOS,
} from "../../../../redux/slices/product_promo/tos";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import TermOfServiceConfirmation from "./Modal/TermOfServiceConfirmation";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";
import {
  getBudgetList,
  getProvinceList,
  getIndustrialSectorList,
  getAccountCategoryList,
  getServiceTypeList,
  getSorList,
  getCostCenterList,
  getGsizesList,
  getCustomerSegmentList,
  getCustomerList,
  getCityList,
  getSubDistrictList,
  getAccountGroupList,
  getDistrictList,
  getProvinceListByCountry,
  getCountryList,
} from "../../../../redux/slices/product_promo/tos";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import {
  handleCheckCriteriaMissingValidation,
  handleMappingCriteriaGeneral,
  getCriteriaIdByCode,
  applyLocationCriteriaCascade,
  applyDeselectLocationCriteriaCascade,
} from "../UtilsProduct/UtilsAllProduct";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";

const TermOfServiceCreate = () => {
  // Selector
  const { loading, data_attribute, data_criteria } = useSelector(
    (state) => state.tos
  );

  // Declaration
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dataAttribute = data_attribute?.data;
  const formValue = form.getFieldsValue();

  // State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [data, setData] = useState({});
  const [description, setDescription] = useState("");
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [criteriaOptions, setCriteriaOptions] = useState([]);

  // Use Effect
  useEffect(() => {
    dispatch(getSelectCriteria());
    dispatch(getTosAttribute());
  }, [dispatch]);

  useEffect(() => {
    if (
      data_criteria &&
      data_criteria &&
      data_criteria?.length > 0
    ) {
      const tempCriterias = (data_criteria || [])?.map((criteria) => ({
        name: criteria.text,
        value: criteria.id,
        code: criteria?.code,
      }));
      setCriteriaOptions(tempCriterias);
    }
  }, [data_criteria]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_TERM_OF_SERVICE,
      breadcrumbName: "Terms Of Service",
    },
    {
      path: PRODUCT_PROMO_ROUTES.CREATE_TERM_OF_SERVICE,
      breadcrumbName: "Create Terms Of Service",
    },
  ];

  // Dependency Criteria
  const handleCriteria = (value) => {
    let res = [...value];
    if (res.includes(26)) {
      res.push(27);
    }
    if (res.includes(27)) {
      res.push(139);
    }
    if (res.includes(139)) {
      res.push(28);
    }
    if (res.includes(33)) {
      res.push(32);
    }
    let outputArray = res.filter((item, index) => res.indexOf(item) === index);
    outputArray = outputArray.includes(24) ? [24] : outputArray;
    setCriteriaValues(outputArray);
    return outputArray;
  };

  const handleSelectCriteria = (value) => {
    const outputArray = applyLocationCriteriaCascade(
      [...criteriaValues, value],
      criteriaOptions
    );
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      rPricingRuleCriterias: outputArray,
    });
  };

  const handleDeselectCriteria = (value) => {
    const outputArray = applyDeselectLocationCriteriaCascade(
      criteriaValues,
      value,
      criteriaOptions
    );
    setCriteriaValues(outputArray);
    form.setFieldsValue({
      rPricingRuleCriterias: outputArray,
    });
  };

  const handleClearCriteria = () => {
    setCriteriaValues([]);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  // Handle Confirmation
  const handleSave = useCallback( async (formValue) => {
    try{
      let errorBody = {};
      if (
        !formValue.rPricingRuleCriterias.includes(24) &&
        listDataCriteria.length === 0
      ) {
        errorBody = {
          title: "Failed",
          description: `Term of Service Detail Mandatory. Please try again.`,
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
        const dataValue = { ...formValue };
        setData(dataValue);
  
        let dataCriteriaObject = listDataCriteria.map(
          (item, index) =>
            // {
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
                getCriteriaIdByCode(criteriaOptions, "COUNTRY")
              ),
              criteriaValues: criteriaValues,
              dataListCriteria: (data_criteria || [])?.map((item) => {
                return {
                  ...item,
                  id: item.id,
                  name: item.text,
                };
              }),
            })
        );
    
        // Attribute
        const attributeArrayObject = dataValue.attribute.map((item) => {
          return {
            id: null,
            idTos: null,
            idAttr: item,
          };
        });
    
        // Criteria
        const criteriaArrayObject = dataValue.rPricingRuleCriterias.map((item) => {
          return {
            id: null,
            idTos: null,
            idCri: item,
          };
        });
    
        const includesAll = dataValue.rPricingRuleCriterias.includes(24);
        const body = {
          name: dataValue.name,
          description: dataValue.description,
          tosAttrDtos: attributeArrayObject,
          tosCrtDtos: criteriaArrayObject,
          tosMCriteriaDtos: includesAll
            ? [{ allCriteria: true }]
            : dataCriteriaObject,
        };

        const validateValueObj = {
          body: body,
          services: productPromoHttpService,
          endPoint: "/v1/dbs/api/tos/validate-create",
          type: "create",
        };
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
  
        setModalConfirm(true);
      }
    } catch (error) {
      console.log(error);
    }
  },[dispatch, showModalError, storedDataInline, criteriaOptions, listDataCriteria]);

  // Handle Confirm
  const handleConfirm = () => {
    let dataCriteriaObject = listDataCriteria.map(
      (item, index) =>
        // {
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
                getCriteriaIdByCode(criteriaOptions, "COUNTRY")
              ),
          criteriaValues: criteriaValues,
          dataListCriteria: (data_criteria || [])?.map((item) => {
            return {
              ...item,
              id: item.id,
              name: item.text,
            };
          }),
        })
      // return {
      //   referenceId: null,
      //   customer: item.customer?.value || null,
      //   budget: item.budget?.value || null,
      //   subDistrict: item.subDistrict?.value || null,
      //   district: item.district?.value || null,
      //   city: item.city?.value || null,
      //   province: item.province?.value || null,
      //   area: item.area?.value || null,
      //   sor: item.sor?.value || null,
      //   industrialSector: item.industrialSector?.value || null,
      //   gsizes: item.gsizes?.value || null,
      //   customerSegment: item.customerSegment?.value || null,
      //   accountGroup: item.accountGroup?.value || null,
      //   serviceType: item.serviceType?.value || null,
      //   accountCategory: item.accountCategory?.value || null,
      // };
      // }
    );

    // Attribute
    const attributeArrayObject = formValue.attribute.map((item) => {
      return {
        id: null,
        idTos: null,
        idAttr: item,
      };
    });

    // Criteria
    const criteriaArrayObject = formValue.rPricingRuleCriterias.map((item) => {
      return {
        id: null,
        idTos: null,
        idCri: item,
      };
    });

    // const filteredCriteria = columnsTableCriteriaAll().filter(
    //   (item) => !([...formValue.rPricingRuleCriterias, 1]).includes(item.indexValue)
    // );

    // dataCriteriaObject = dataCriteriaObject.map((item) => {
    //   let obj = { ...item };
    //   filteredCriteria.forEach((criteria) => {
    //     obj[criteria.dataIndexForm] = null;
    //   });
    //   return obj;
    // });

    const includesAll = formValue.rPricingRuleCriterias.includes(24);
    const body = {
      name: formValue.name,
      description: formValue.description,
      tosAttrDtos: attributeArrayObject,
      tosCrtDtos: criteriaArrayObject,
      tosMCriteriaDtos: includesAll
        ? [{ allCriteria: true }]
        : dataCriteriaObject,
    };

    dispatch(createTOS({ body: body }))
      .unwrap()
      .catch((error) => {
        if (Math.floor((error?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setModalConfirm(false);
          setBodyError({ message });
          setModalError(true);
        }
      });

    // console.log({ body: body });
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
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="flex flex-col gap-y-4">

            <NxCardContainer header={"TERMS OF SERVICE INFORMATION"}>
              <div className="w-full grid grid-cols-2 gap-2">
                <Form.Item
                  label={"Name"}
                  name={"name"}
                  rules={[{ required: true, message: "Please input your Name!" }]}
                >
                  <InputComponent maxLength={100}/>
                </Form.Item>
                <div className="col-span-2">
                  <Form.Item
                    label={"Attribute"}
                    name={"attribute"}
                    className={"w-full"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Attribute!",
                      },
                    ]}
                  >
                    <SelectComponent mode="multiple">
                      {dataAttribute &&
                        dataAttribute?.map((data, index) => (
                          <Select.Option value={data.glbTypeValId} key={index}>
                            {data.name}
                          </Select.Option>
                        ))}
                    </SelectComponent>
                  </Form.Item>
                </div>
                <div className="col-span-2">
                  <Form.Item
                    label={"Criteria"}
                    name={"rPricingRuleCriterias"}
                    className={"w-full"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Criteria!",
                      },
                    ]}
                  >
                    <SelectComponent
                      mode="multiple"
                      onSelect={handleSelectCriteria}
                      onDeselect={handleDeselectCriteria}
                      onClear={handleClearCriteria}
                    >
                      {data_criteria &&
                        data_criteria
                          ?.filter((item) => item?.id !== 38)
                          ?.map((data, index) => (
                            <Select.Option value={data.id} key={index}>
                              {data.text}
                            </Select.Option>
                          ))}
                    </SelectComponent>
                  </Form.Item>
                </div>
                <div className="col-span-2">
                  <Form.Item
                    label={"Description"}
                    name={"description"}
                    className={"w-full"}
                  >
                    <InputComponent
                      type="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
            </NxCardContainer>

            <NxCardContainer header={"criteria information"}>
              <div className="w-full">
                {/* <FunctionalTableCriteriaTOS
                  type={"create"}
                  data={listDataCriteria}
                  dataCriteria={criteriaValues}
                  updateData={setListDataCriteria}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                /> */}
                <FunctionalCriteriaProduct
                  type={"create"}
                  data={listDataCriteria || []} //data
                  dataCriteria={criteriaValues || []} //ddl
                  updateData={setListDataCriteria}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                  startDate={undefined}
                  selector="tos"
                  idTable="tos-create-criteria-table"
                  getApi={{
                    getBudgetList,
                    getProvinceList,
                    getIndustrialSectorList,
                    getAccountCategoryList,
                    getServiceTypeList,
                    getSorList,
                    getCostCenterList,
                    getGsizesList,
                    getCustomerSegmentList,
                    getCustomerList,
                    getCityList,
                    getSubDistrictList,
                    getAccountGroupList,
                    getDistrictList,
                    getProvinceListByCountry,
                    getCountryList,
                  }}
                  countryCriteriaId={getCriteriaIdByCode(criteriaOptions, "COUNTRY")}
                  columnsTable={columnsTableCriteriaAll}
                  checkStartDate={false}
                />
              </div>
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
                    form.resetFields();
                    setListDataCriteria([]);
                    setCriteriaValues([]);
                    setStoredDataInline(false);
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
                  disabled={storedDataInline}
                >
                  Save
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
        {modalConfirm ? (
          <TermOfServiceConfirmation
            data={data}
            openModal={modalConfirm}
            closeModal={() => setModalConfirm(false)}
            handleConfirm={() => handleConfirm()}
            listDataCriteria={listDataCriteria}
            criteriaValues={criteriaValues}
            apiAttribute={dataAttribute}
            apiCriteria={data_criteria}
            countryCriteriaId={getCriteriaIdByCode(criteriaOptions, "COUNTRY")}
            loading={loading}
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
              <p className="pl-[70px]">{`Your data was not created. ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}
      </Spin>
    </>
  );
};

export default TermOfServiceCreate;
