import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { Checkbox, DatePicker, Form, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  createAssets,
  getDetailAssets,
  getListAnsi,
  getListAssetBrand,
  getListAssetName,
  getListAssetType,
  getListGsize,
  getListProductName,
  getListServicePointName,
  updateAsstes,
} from "../../../../../redux/slices/account_management/MasterData/assets_slice";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
} from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import ModalBack from "../../../../../components/Modal/ModalBack";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";

const FormAssets = ({ type }) => {
  const {
    loading,
    data_asset_name,
    data_asset_type,
    data_brand_type,
    data_service_type,
    data_product_name,
    data_gsize,
    data_ansi,
    data_detail,
  } = useSelector((state) => state.assets);
  const { bodyError, isLoading } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  // use state
  const [modalBack, setModalBack] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [body, setBody] = useState({});
  const [checkCustody, setCheckCustody] = useState(false);
  const [getAssetName, setGetAssetName] = useState("");
  const [getAssetType, setGetAssetType] = useState("");
  const [getBrandType, setGetBrandType] = useState("");
  const [getProductName, setGetProductName] = useState("");
  const [getGSize, setGetGSize] = useState("");
  const [getServiceTypeName, setGetServiceTypeName] = useState("");
  const [getAnsiName, setGetAnsiName] = useState("");
  const [mandatoryGsize, setMandatoryGsize] = useState(false);

  // assert data
  const assert = useCallback(
    (data) => {
      if (data) {
        form.setFieldsValue({
          serialNumber:
            data?.informationDto?.serialNumber?.replace(/\s+/g, " ").trim() +
            " ",
          assetName: data?.informationDto?.assetNameId,
          type: data?.informationDto?.assetTypeId,
          serviceType: data?.informationDto?.serviceTypeId,
          productVersion: data?.informationDto?.productInformation?.value
            ? data?.informationDto?.productInformation?.value
            : null,
          custodyTransfer: data?.informationDto?.custodyTransfer,
          brand: data?.informationDto?.brandId,
          year: moment(data?.informationDto?.year, dateFormatting.year_only),
          inletDiameter: data?.attribute?.inletDiameter,
          outletDiameter: data?.attribute?.outletDiameter,
          maximumInletPressure: data?.attribute?.maxInletPressure,
          maximumOutletPressure: data?.attribute?.maxOutletPressure,
          minimumInletPressure: data?.attribute?.minInletPressure,
          minimumOutletPressure: data?.attribute?.minimumOutletPressure,
          maxFlowCapacityPerStream: data?.attribute?.maxFlowCapacityPerStream,
          streamAmount: data?.attribute?.streamAmount,
          gSize: data?.attribute?.gsizeId,
          settingPressure: data?.attribute?.settingPressure,
          length: data?.attribute?.length,
          boltHoleAmount: data?.attribute?.boltHoleAmount,
          minimumCapacity: data?.attribute?.minCapacity,
          maximumCapacity: data?.attribute?.maxCapacity,
          ansi: data?.attribute?.ansiId,
          description: data?.attribute?.description,
        });
        setCheckCustody(data?.informationDto?.custodyTransfer);
      }
    },
    [form],
  );

  // use effect
  useEffect(() => {
    if (location?.state?.id && type === "update") {
      dispatch(getDetailAssets(location?.state?.id));
    }
    dispatch(getListAssetType());
    dispatch(getListServicePointName());
    dispatch(getListProductName());
    dispatch(getListAssetBrand());
    dispatch(getListGsize());
    dispatch(getListAnsi());
    dispatch(getListAssetName());
    dispatch(getListAnsi());
  }, [dispatch, location, type]);

  useEffect(() => {
    if (location?.state?.id && type === "update") {
      assert(data_detail);
    } else {
      form.setFieldsValue({
        serviceType: data_service_type?.filter(
          (item) => item?.glbTypeValId === 608,
        )[0]?.glbTypeValId,
      });
    }
  }, [assert, data_detail, location?.state?.id, type, data_service_type, form]);

  // use memo ddl
  const assetName = useMemo(
    () =>
      data_asset_name?.map((item) => ({
        name: item?.text,
        value: item?.id,
        id: item?.id,
      })),
    [data_asset_name],
  );
  const assetType = useMemo(
    () =>
      data_asset_type?.map((item) => ({
        name: item?.text,
        value: item?.id,
        id: item?.id,
      })),
    [data_asset_type],
  );
  const brandType = useMemo(
    () =>
      data_brand_type?.map((item) => ({
        name: item?.text,
        value: item?.id,
        id: item?.id,
      })),
    [data_brand_type],
  );
  const productName = useMemo(
    () =>
      data_product_name?.map((item) => ({
        name: item?.productName,
        value: item?.id,
        id: item?.id,
      })),
    [data_product_name],
  );
  const gSize = useMemo(
    () =>
      data_gsize?.map((item) => ({
        name: item?.text,
        value: item?.id,
        id: item?.id,
      })),
    [data_gsize],
  );
  const serviceTypeName = useMemo(
    () =>
      data_service_type?.map((item) => ({
        name: item?.name,
        value: item?.glbTypeValId,
        id: item?.id,
      })),
    [data_service_type],
  );
  const ansiName = useMemo(
    () =>
      data_ansi?.map((item) => ({
        name: item?.text,
        value: item?.id,
        id: item?.id,
      })),
    [data_ansi],
  );

  // handle cancel
  const handleCancel = () => {
    setOpenConfirmation(false);
    setModalBack(false);
  };

  // handle confirmation
  const handleFinish = useCallback(
    async (formValue) => {
      try {
        let body;
        let validateValueObj;
        const intParsedValue = {
          productVersion: hasValue(formValue?.productVersion)
            ? formValue?.productVersion
            : null,
          inletDiameter: hasValue(formValue?.inletDiameter)
            ? parseFloat(formValue?.inletDiameter)
            : null,
          outletDiameter: hasValue(formValue?.outletDiameter)
            ? parseFloat(formValue?.outletDiameter)
            : null,
          maximumInletPressure: hasValue(formValue?.maximumInletPressure)
            ? parseFloat(formValue?.maximumInletPressure)
            : null,
          maximumOutletPressure: hasValue(formValue?.maximumOutletPressure)
            ? parseFloat(formValue?.maximumOutletPressure)
            : null,
          minimumInletPressure: hasValue(formValue?.minimumInletPressure)
            ? parseFloat(formValue?.minimumInletPressure)
            : null,
          minimumOutletPressure: hasValue(formValue?.minimumOutletPressure)
            ? parseFloat(formValue?.minimumOutletPressure)
            : null,
          streamAmount: hasValue(formValue?.streamAmount)
            ? parseFloat(formValue?.streamAmount)
            : null,
          settingPressure: hasValue(formValue?.settingPressure)
            ? parseFloat(formValue?.settingPressure)
            : null,
          length: hasValue(formValue?.length)
            ? parseFloat(formValue?.length)
            : null,
          boltHoleAmount: hasValue(formValue?.boltHoleAmount)
            ? parseInt(formValue?.boltHoleAmount)
            : null,
          minimumCapacity: hasValue(formValue?.minimumCapacity)
            ? parseFloat(formValue?.minimumCapacity)
            : null,
          maximumCapacity: hasValue(formValue?.maximumCapacity)
            ? parseFloat(formValue?.maximumCapacity)
            : null,
          maxFlowCapacityPerStream: hasValue(
            formValue?.maxFlowCapacityPerStream,
          )
            ? parseFloat(formValue?.maxFlowCapacityPerStream)
            : null,
          custodyTransfer: checkCustody,
          year: hasValue(formValue?.year)
            ? parseInt(moment(formValue?.year).format(dateFormatting.year_only))
            : null,
          serialNumber: formValue?.serialNumber?.replace(/\s+/g, " ").trim(),
        };
        if (type === "update") {
          body = {
            ...formValue,
            id: location?.state?.id,
            ...intParsedValue,
          };
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/master/assets/validate-update-asset",
            type,
          };
        } else {
          body = {
            ...formValue,
            ...intParsedValue,
          };
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: "/v1/dbs/api/master/assets/validate-create",
            type,
          };
        }

        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setOpenConfirmation(true);
        setBody({
          body: body,
          validateValue: validateValueObj,
        });
        setGetAssetName(
          assetName?.filter((item) => item?.value === formValue?.assetName)[0]
            ?.name,
        );
        setGetAssetType(
          assetType?.filter((item) => item?.value === formValue?.type)[0]?.name,
        );
        setGetBrandType(
          brandType?.filter((item) => item?.value === formValue?.brand)[0]
            ?.name,
        );
        setGetProductName(
          productName?.filter(
            (item) => item?.value === formValue?.productVersion,
          )[0]?.name,
        );
        setGetGSize(
          gSize?.filter((item) => item?.value === formValue?.gSize)[0]?.name,
        );
        setGetServiceTypeName(
          serviceTypeName?.filter(
            (item) => item?.value === formValue?.serviceType,
          )[0]?.name,
        );
        setGetAnsiName(
          ansiName?.filter((item) => item?.value === formValue?.ansi)[0]?.name,
        );
      } catch (error) {}
    },
    [
      ansiName,
      assetName,
      assetType,
      brandType,
      checkCustody,
      gSize,
      location?.state?.id,
      productName,
      serviceTypeName,
      type,
      dispatch,
    ],
  );

  // handle save
  const handleSave = async () => {
    setOpenConfirmation(false);
    if (type === "create") {
      await dispatch(createAssets(body?.body))?.unwrap();
    } else {
      await dispatch(updateAsstes(body?.body))?.unwrap();
    }
  };

  // handle reset
  const handleReset = () => {
    if (type === "create") {
      form.resetFields();
      setGetAssetName("");
      setGetAssetType("");
      setGetProductName("");
      setGetGSize("");
      setGetBrandType("");
      setGetServiceTypeName("");
      setGetAnsiName("");
      setCheckCustody(false);
    } else {
      assert(data_detail);
    }
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_MASTER_ASSETS,
      breadcrumbName: "Assets",
    },
    {
      path: "",
      breadcrumbName: type === "update" ? "Update Assets" : "Create Assets",
    },
  ];

  const onChangeCustody = (e) => setCheckCustody(e.target.checked);
  // handle asset name
  const handleAssetName = (e) => {
    if (e === 155) {
      setMandatoryGsize(true);
    } else {
      setMandatoryGsize(false);
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "GET_DETAIL_ASSETS") {
      dispatch(getDetailAssets(location?.state?.id));
    } else if (bodyError?.action === "CREATE_ASSETS") {
      dispatch(createAssets(body?.body));
    } else if (bodyError?.action === "UPDATE_ASSETS") {
      dispatch(updateAsstes(body?.body));
    } else {
      dispatch(validateCreateUpdate(body?.validateValue));
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form form={form} layout={"vertical"} onFinish={handleFinish}>
          <BaseContainer header={"asset information"}>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Product Name"}
                name={"productVersion"}
                // rules={formMessageRequired('Product Name')}
              >
                <SelectComponent disabled={type === "update"}>
                  {productName?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Service Type"}
                name={"serviceType"}
                rules={formMessageRequired("Service Type")}
              >
                <SelectComponent disabled={true}>
                  {serviceTypeName?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Asset Name"}
                name={"assetName"}
                rules={formMessageRequired("Asset Name")}
              >
                <SelectComponent
                  disabled={type === "update"}
                  onChange={handleAssetName}
                >
                  {assetName?.map((key, item) => (
                    <Select.Option key={key} value={key?.value}>
                      {key?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Asset Type"}
                name={"type"}
                rules={formMessageRequired("ASset Type")}
              >
                <SelectComponent disabled={type === "update"}>
                  {assetType?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Serial Number"}
                name={"serialNumber"}
                rules={formMessageRequired("Serial Number")}
              >
                <InputComponent disabled={type === "update"} />
              </Form.Item>
              <Form.Item
                label={"Brand"}
                name={"brand"}
                rules={formMessageRequired("Brand")}
              >
                <SelectComponent disabled={type === "update"}>
                  {brandType?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Year"}
                name={"year"}
                rules={formMessageRequired("Year")}
              >
                <DatePicker
                  picker="year"
                  className="w-full"
                  disabled={type === "update"}
                />
              </Form.Item>
              <Form.Item
                name={"custodyTransfer"}
                valuePropName={"checked"}
                className="flex flex-col h-full align-middle justify-center"
              >
                <Checkbox
                  checked={checkCustody}
                  disabled={type === "update"}
                  onChange={onChangeCustody}
                >
                  Custody Transfer
                </Checkbox>
                <p className="text-gray-400 font-light m-0">
                  Check if this asset is custody transfer
                </p>
              </Form.Item>
            </div>
            <div className="text-primary text-xs font-bold uppercase py-4">
              asset attribute
            </div>
            <div className="w-full grid grid-cols-3 gap-5   ">
              <Form.Item
                label={"Inlet Diameter"}
                name={"inletDiameter"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Outlet Diameter"}
                name={"outletDiameter"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Minimum Inlet Pressure"}
                name={"minimumInletPressure"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Maximum Inlet Pressure"}
                name={"maximumInletPressure"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Minimum Outlet Pressure"}
                name={"minimumOutletPressure"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Maximum Outlet Pressure"}
                name={"maximumOutletPressure"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Max Flow Capacity Per Stream"}
                name={"maxFlowCapacityPerStream"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Stream Amount"}
                name={"streamAmount"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"G Size"}
                name={"gSize"}
                rules={mandatoryGsize === true && formMessageRequired("G Size")}
              >
                <SelectComponent>
                  {gSize?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Setting Pressure"}
                name={"settingPressure"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Length"}
                name={"length"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Bolt Hole Amount"}
                name={"boltHoleAmount"}
                // getValueFromEvent={(e) => parseInt(e.value?.toString().replace(/[^\d]/g, ''))}
              >
                <InputComponent
                  type="number"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^\d]/g, ""))
                  }
                />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Minimum Capacity"}
                name={"minimumCapacity"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item
                label={"Maximum Capacity"}
                name={"maximumCapacity"}
                getValueFromEvent={(e) => e.floatValue}
              >
                <InputComponent
                  decimalScale={4}
                  type="numeric"
                  numericFormatType={"text"}
                  thousandSeparator={false}
                  decimalSeparator={"."}
                />
              </Form.Item>
              <Form.Item label={"Class/ANSI"} name={"ansi"}>
                <SelectComponent>
                  {ansiName?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            <div className="w-full gap-5">
              <Form.Item label={"Description"} name={"description"}>
                <InputComponent type={"textarea"} />
              </Form.Item>
            </div>
          </BaseContainer>
          <div className="w-full my-5 flex gap-5">
            <ButtonComponent
              icon={
                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              type="submit"
              onClick={() => setModalBack(true)}
            >
              Back
            </ButtonComponent>
            <div className={"w-full flex justify-end gap-2"}>
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
                onClick={handleReset}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>
      <ModalCustom
        isOpen={openConfirmation}
        handleCancel={handleCancel}
        type={"confirmation"}
        width={900}
        header={"confirmation"}
        footer={[
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCancel} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={handleSave} type={"submit"}>
              Confirm
            </ButtonComponent>
          </div>,
        ]}
      >
        <div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            asset information
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Product Name"}>{getProductName}</DetailText>
            <DetailText label={"Service Type"}>{getServiceTypeName}</DetailText>
            <DetailText label={"Asset Name"}>{getAssetName}</DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Asset Type"}>{getAssetType}</DetailText>
            <DetailText label={"Serial Number"}>
              {body?.body?.serialNumber?.replace(/\s+/g, " ").trim() + " "}
            </DetailText>
            <DetailText label={"Brand"}>{getBrandType}</DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Year"}>{body?.body?.year}</DetailText>
            <DetailText label={"Custody Transfer"}>
              {body?.body?.custodyTransfer === true ? "Yes" : "No"}
            </DetailText>
          </div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            asset attribute
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Inlet Diameter"}>
              {body?.body?.inletDiameter}
            </DetailText>
            <DetailText label={"Outlet Diameter"}>
              {body?.body?.outletDiameter}
            </DetailText>
            <DetailText label={"Minimum Inlet Pressure"}>
              {body?.body?.minimumInletPressure}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Maximum Inlet Pressure"}>
              {body?.body?.maximumInletPressure}
            </DetailText>
            <DetailText label={"Minimum Outlet Pressure"}>
              {body?.body?.minimumOutletPressure}
            </DetailText>
            <DetailText label={"Maximum Outlet Pressure"}>
              {body?.body?.maximumOutletPressure}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Max Flow Capacity per Stream"}>
              {body?.body?.maxFlowCapacityPerStream}
            </DetailText>
            <DetailText label={"Stream Amount"}>
              {body?.body?.streamAmount}
            </DetailText>
            <DetailText label={"G Size"}>{getGSize}</DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Setting Pressure"}>
              {body?.body?.settingPressure}
            </DetailText>
            <DetailText label={"Length"}>{body?.body?.length}</DetailText>
            <DetailText label={"Bolt Hole Amount"}>
              {body?.body?.boltHoleAmount}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Minimum Capacity"}>
              {body?.body?.minimumCapacity}
            </DetailText>
            <DetailText label={"Maximum Capacity"}>
              {body?.body?.maximumCapacity}
            </DetailText>
            <DetailText label={"Class/ANSI"}>{getAnsiName}</DetailText>
          </div>
          <div className="w-full grid">
            <DetailText label={"Description"}>
              {body?.body?.description}
            </DetailText>
          </div>
        </div>
      </ModalCustom>
      {/* Modal Back */}
      <ModalBack
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
      />
      {/* modal retry */}
      {renderModal()};
    </LayoutMenu>
  );
};

export default FormAssets;
