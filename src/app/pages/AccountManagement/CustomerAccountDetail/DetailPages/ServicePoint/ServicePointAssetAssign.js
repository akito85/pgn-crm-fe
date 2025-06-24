import React, { useEffect, useRef } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import {
  WarningOutlined,
  LeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Alert, Form, Select, Spin } from "antd";
import AssignPage from "./Asset/AssignPage";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import AssignChoosePage from "./Asset/AssignChoosePage";
import AssignPageConfirmation from "./Asset/AssignPageConfirmation";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../../components/Modal/ModalPopUp";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import HeaderDetail from "../../HeaderDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSerialAsset,
  createAsset,
  getDetailServicePoint,
  getGlobalListAnsi,
  getGlobalListGsize,
  getGlobalListProductName,
  getGlobalListServiceType,
  getGlobalTypeListAssetName,
  getGlobalTypeListBrand,
  getGlobalTypeListType,
} from "../../../../../../redux/slices/account_management/detailAccount/ServicePoint";
import moment from "moment";
import { validateCreateUpdate } from "../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import { dateFormatting } from "../../../../../../utils";

const ServicePointAssetAssign = ({ }) => {
  const dispatch = useDispatch();
  const {
    data_detailServicePoint,
    data_globalTypeAssetName,
    data_globalTypeListType,
    data_globalTypeListBrand,
    data_globalTypeListServiceType,
    data_globalTypeListGsize,
    data_globalTypeListProductName,
    data_globalTypeListAnsi,
    loading,
  } = useSelector((state) => state.servicePoint);

  //declare
  const [formPrimary] = Form.useForm();
  const [formCreate] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const typeAccount = location?.state?.type;

  // state
  const [modalChooseAsset, setModalChooseAsset] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isUpdated, setIsUpdate] = useState(false);
  const [dataAsset, setDataAsset] = useState({});
  const [type, setType] = useState(false);
  const [typeDuplicate, setTypeDuplicate] = useState(true); //true = check duplicate, false = new
  const [checkedCustody, setCheckedCustody] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataConfirm, setDataConfirm] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [isExist, setIsExist] = useState(false); //for serial and brand
  const [assetName, setAssetName] = useState();
  //useEffect
  useEffect(() => {
    if (id) {
      dispatch(getDetailServicePoint(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getGlobalListServiceType());
    dispatch(getGlobalListGsize());
    dispatch(getGlobalTypeListAssetName());
    dispatch(getGlobalTypeListBrand());
    dispatch(getGlobalTypeListType());
    dispatch(getGlobalListProductName());
    dispatch(getGlobalListAnsi());
  }, [dispatch]);

  useEffect(() => {
    if (
      data_detailServicePoint &&
      data_detailServicePoint.premiseAddressId &&
      data_detailServicePoint.servicePointId
    ) {
      formPrimary.setFieldsValue({
        premiseAddress: data_detailServicePoint.premiseAddress,
        servicePoint: data_detailServicePoint.servicePointName,
      });
    }
  }, [data_detailServicePoint, formPrimary]);

  //handle
  const handleResetFormPrimary = () => {
    formPrimary.setFieldsValue({
      premiseAddress: data_detailServicePoint.premiseAddress,
      servicePoint: data_detailServicePoint.servicePointName,
    });
  };

  const handleRetry = () => {
    if (isExist) {
      onFinishCreate(bodyError?.value);
    } else {
      handleSend(bodyError?.value);
    }
    setModalError(false);
    setBodyError({});
  };

  const onFinishPrimary = async (e) => {
    setDataAsset(prevState => ({
      ...prevState,
      installDate: e?.installDate,
      remark: e?.remarks,
      premiseAddress: e.premiseAddress,
      servicePoint: e.servicePoint,
    }))

    //code
    let url;
    const data = handleDataSend({
      ...dataAsset,
      installDate: e?.installDate,
      remark: e?.remarks,
      premiseAddress: e.premiseAddress,
      servicePoint: e.servicePoint,
    }, typeDuplicate);


    url = "/v1/dbs/api/premise/servicePoint/assets/validate-assign";
    await dispatch(validateCreateUpdate({ body: data, services: accountManagementService, endPoint: url, type }))?.unwrap();

    setType(false);
    setModalConfirm(true);
  };

  const onFinishCreate = (e) => {
    //code
    const body = {
      serialNumber: e?.serialNumber,
      brand: e?.brand,
    };
    dispatch(checkSerialAsset(body))
      .unwrap()
      .then((data) => {
        setIsUpdate(true);
        formPrimary.setFieldsValue({
          ...e,
        });
        setDataAsset({ ...e, assetId: null });
        setType(false);
        setModalChooseAsset(false);
        setIsExist(false);
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
          setIsExist(true);
          setModalError(true);
        }
      });
  };

  const handleModalChooseAsset = (value) => {
    setModalChooseAsset(value);
  };


  const handleChooseAsset = (value) => {
    setIsUpdate(false);
    setAssetName(value?.assetName);
    setDataAsset({
      assetId: value?.id,
      serialNumber: value?.serialNumber,
      assetName: value?.assetName,
      assetNameValue: value?.assetNameValue,
      type: value?.type,
      typeValue: value?.typeValue,
      serviceTypeValue: value?.serviceTypeValue,
      serviceType: value?.serviceType,
      productVersion: value?.productName, //
      productNameValue: value?.productNameValue,
      custodyTransfer: value?.custodyTransfer,
      brand: value?.brand,
      brandValue: value?.brandValue,
      year: moment(value?.year),
      inletDiameter: value?.inletDiameter,
      outletDiameter: value?.outletDiameter,
      maximumInletPressure: value?.maximumInletPressure,
      maximumOutletPressure: value?.maximumOutletPressure,
      minimumInletPressure: value?.minimumInletPressure,
      minimumOutletPressure: value?.minimumOutletPressure,
      maxFlowCapacityPerStream: value?.maxFlowCapacityPerStream,
      streamAmount: value?.streamAmount,
      gsize: value?.gsize,
      gSizeValue: value?.gsizeValue,
      settingPressure: value?.settingPressure,
      length: value?.length,
      boltHoleAmount: value?.boltHoleAmount,
      minimumCapacity: value?.minimumCapacity,
      maximumCapacity: value?.maximumCapacity,
      ansi: value?.ansi,
      ansiValue: value?.ansiValue,
      description: value?.description,
      entityId: value?.entityId,
    });
    setCheckedCustody(value?.custodyTransfer);
    setModalChooseAsset(false);

  };

  useEffect(() => {
    if (dataAsset && dataAsset !== undefined) {
      formPrimary.setFieldsValue({
        ...dataAsset,
      });
      if (dataAsset.assetId && dataAsset.assetId !== undefined) {
        setDataConfirm({
          ...dataAsset,
        });
      } else {
        setDataConfirm({
          gsizeValue: data_globalTypeListGsize?.find(
            (item) => item?.Id === dataAsset?.gsize
          )?.text,
          ansiValue: data_globalTypeListAnsi?.find(
            (item) => item?.id === dataAsset?.ansi
          )?.name,
          brandValue: data_globalTypeListBrand?.find(
            (item) => item?.glbTypeValId === dataAsset?.brand
          )?.name,
          typeValue: data_globalTypeListType?.find(
            (item) => item?.glbTypeValId === dataAsset?.type
          )?.name,
          productNameValue: data_globalTypeListProductName?.find(
            (item) => item?.id === dataAsset?.productVersion
          )?.productName,
          serviceTypeValue: data_globalTypeListServiceType?.find(
            (item) => item?.glbTypeValId === dataAsset?.serviceType
          )?.name,
          assetNameValue: data_globalTypeAssetName?.find(
            (item) => item?.glbTypeValId === dataAsset?.assetName
          )?.name,
          ...dataAsset,
        });
      }
    }
  }, [dataAsset, data_globalTypeAssetName, data_globalTypeListAnsi, data_globalTypeListBrand, data_globalTypeListGsize, data_globalTypeListProductName, data_globalTypeListServiceType, data_globalTypeListType, formPrimary]);

  const handleModalUpdateAsset = (value) => {
    // formCreate.setFieldsValue({
    //   dataAsset
    // })
    setModalChooseAsset(value);
    setType(value);
  };

  const handleCreateAsset = (value) => {
    formCreate.setFieldsValue({
      serviceType: 608,
    });
    setType(value);
  };

  const handleDataSend = (dataAsset, type) => {

    if (dataAsset.assetId && dataAsset.assetId !== undefined) {

      return {
        assetId: dataAsset.assetId,
        servicePointId: data_detailServicePoint.servicePointId,
        installDate: moment(dataAsset?.installDate).format("YYYY-MM-DD"),
        remark: dataAsset?.remark,
        isDuplicate: type,
      };
    } else {

      return {
        ...dataAsset,
        installDate: moment(dataAsset?.installDate).format("YYYY-MM-DD"),
        year: moment(dataAsset?.year).format("YYYY"),
        servicePointId: data_detailServicePoint.servicePointId,
        isDuplicate: type,
        custodyTransfer: checkedCustody,
      };
    }
  };

  const handleSend = (e) => {
    setIsExist(false);
    const data = handleDataSend(e, typeDuplicate);

    setModalConfirm(false);
    dispatch(createAsset({ ...data }))
      .unwrap()
      .then(async (data_create) => {
        // formCreate.resetFields();
        if (data_create?.message === "Confirmation") {
          setTypeDuplicate(false);
          setModalWarning(true);
          setModalConfirm(false);
        } else {
          setModalWarning(false);
          setTypeDuplicate(true);
          setModalSuccess(true);
          setAssetName();
          formCreate.resetFields();
          formPrimary.resetFields();
          handleResetFormPrimary();
          setDataAsset({});
          setModalConfirm(false);
        }
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
  };

  const onChangeCustody = (e) => {
    setCheckedCustody(e.target.checked);
  };

  const routes = (id, idAccount) => {
    return [
      {
        path: "",
        breadcrumbName: "Account",
      },
      {
        path:
          type === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
        breadcrumbName:
          type === "standard" ? "Account Standard" : "Account One Time",
      },
      {
        path:
          type === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
          idAccount: idAccount,
        }
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_SERVICE_POINT,
        breadcrumbName: "Detail Service Point",
        state: {
          id: id,
        }
      },
      {
        path: "",
        breadcrumbName: "Create Asset Assignment",
      },
    ];
  }


  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced routes={routes(id, idAccount)} />

        <div className="w-full mb-5">
          <HeaderDetail
            dispatch={dispatch}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={typeAccount}
          />
        </div>
        <Form
          id="formAssetPrimary"
          layout="vertical"
          form={formPrimary}
          onFinish={onFinishPrimary}
        >
          <BaseContainer header={"ASSET INFORMATION"}>
            <AssignPage
              type={true}
              handleModalChooseAsset={handleModalChooseAsset}
              handleModalUpdateAsset={handleModalUpdateAsset}
              isUpdated={isUpdated}
              checkedCustody={checkedCustody}
              isEnableCheckbox={true}
              onChangeCustody={onChangeCustody}
              optionsAssetName={data_globalTypeAssetName}
              optionsAssetType={data_globalTypeListType}
              optionsBrand={data_globalTypeListBrand}
              optionsServiceType={data_globalTypeListServiceType}
              optionsGsize={data_globalTypeListGsize}
              optionsProductName={data_globalTypeListProductName}
              optionsAnsi={data_globalTypeListAnsi}
              assetName={assetName}
              setAssetName={setAssetName}
            />
          </BaseContainer>
        </Form>

        <div className={"w-full flex justify-between my-5"}>
          <div className=" flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                // handleServicePointPage({ target: { value: "Asset Assignment" } });
                // navigate(-1);
                setModalBack(true);
              }}
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
                icon={<SVGIcon name="IconClear" width={24} color={"#FFFFFF"} />}
                type="submit"
                onClick={() => {
                  formPrimary.resetFields();
                  setCheckedCustody(false);
                  setDataAsset({});
                  setAssetName();
                  setIsUpdate(false);
                  handleResetFormPrimary();
                }}
              >
                Clear
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type="submit"
                htmlType={"submit"}
                form={"formAssetPrimary"}
              >
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>

        {/* choose account or create*/}
        <ModalCustom
          isOpen={modalChooseAsset}
          type={"confirmation"}
          header={type ? "CREATE NEW ASSET" : "CHOOSE ASSET"}
          width={1100}
          handleCancel={() => {
            setType(false);
            setModalChooseAsset(false);
            handleResetFormPrimary();
            if (dataAsset) {
              formCreate.setFieldsValue({
                ...(dataAsset || {}),
              });
            } else {
              formCreate.resetFields();
            }
          }}
          footer={
            type ? (
              <div className={"w-full flex justify-end gap-2"}>
                <Form.Item>
                  <ButtonComponent
                    type="default"
                    onClick={() => {
                      // formCreate.resetFields();
                      handleResetFormPrimary();
                      if (dataAsset) {
                        formCreate.setFieldsValue({
                          ...(dataAsset || {}),
                        });
                      } else {
                        formCreate.resetFields();
                      }

                      setType(false);
                    }}
                  >
                    Back
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    form={"formCreate"}
                  >
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            ) : (
              <div className={"w-full flex justify-end"}>
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    setType(false);
                    setModalChooseAsset(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
              </div>
            )
          }
        >
          <Form
            id="formCreate"
            layout="vertical"
            form={formCreate}
            onFinish={onFinishCreate}
          >
            {type ? (
              <AssignPage
                type={false}
                handleModalChooseAsset={handleModalChooseAsset}
                checkedCustody={checkedCustody}
                isEnableCheckbox={false}
                onChangeCustody={onChangeCustody}
                optionsAssetName={data_globalTypeAssetName}
                optionsAssetType={data_globalTypeListType}
                optionsBrand={data_globalTypeListBrand}
                optionsServiceType={data_globalTypeListServiceType}
                optionsGsize={data_globalTypeListGsize}
                optionsProductName={data_globalTypeListProductName}
                optionsAnsi={data_globalTypeListAnsi}
                assetName={assetName}
                setAssetName={setAssetName}
              />
            ) : (
              <AssignChoosePage
                dispatch={dispatch}
                handleCreateAsset={handleCreateAsset}
                handleChooseAsset={handleChooseAsset}
              />
            )}
          </Form>
        </ModalCustom>

        {/* Modal Confirmation */}
        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header={"CONFIRMATION"}
          width={1200}
          handleCancel={() => {
            setModalConfirm(false);
          }}
          footer={
            <div className={"w-full flex justify-end gap-2"}>
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
                  handleSend(dataAsset);
                }}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <AssignPageConfirmation data={dataConfirm} />
        </ModalCustom>

        {/* Modal Warning Same Asset */}
        <ModalConfirm
          isOpen={modalWarning}
          handleCancel={() => {
            setModalWarning(false);
            setTypeDuplicate(true);
          }}
          handleOk={() => handleSend(dataAsset)}
          width={500}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              Are you sure want to assign new asset ?
            </p>
          </div>
          <Alert
            message="
            Warning! There are assigned Asset with same Asset Name, you cannot
            assign 2 asset with same Asset Name. If you want to continue, the
            previous asset will be inactivated!"
            type={"error"}
          />
        </ModalConfirm>

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setIsExist(false);
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not created. ${bodyError?.message}`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        <ModalSuccess
          isOpen={modalSuccess}
          handleOk={() => {
            setModalSuccess(false);
            navigate(-1);
          }}
          handleCancel={() => {
            setModalSuccess(false);
            navigate(-1);
          }}
          width={400}
        >
          <div className="px-8 py-8 justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconSuccess" width={48} />
              <p className="text-[18px] font-bold">{"Successfull"}</p>
            </div>
            <p className="pl-[70px]">{"Your data has been created"}</p>
          </div>
        </ModalSuccess>

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

export default ServicePointAssetAssign;
