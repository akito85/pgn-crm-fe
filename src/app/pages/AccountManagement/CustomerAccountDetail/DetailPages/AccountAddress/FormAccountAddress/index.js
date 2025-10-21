import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../../../../components/BaseContainer";
import { Alert, Checkbox, Form, Input, Select, Spin } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import SelectComponent from "../../../../../../../components/SelectComponent";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ModalChooseAddress from "./ModalChooseAddress";
import ModalConfirmationAddress from "./ModalConfirmationAddress";
import ModalCreateNewAddress from "./ModalCreateNewAddress";
import HeaderDetail from "../../../HeaderDetail";
// import { Wrapper, GoogleMap, Marker, Map } from "@googlemaps/react-wrapper";
import { useJsApiLoader } from "@react-google-maps/api";
import GoogleMapsCustom from "../GoogleMapsCustom";

import {
  getListChooseAddress,
  getDetailAddressAfterChoose,
  getDetailAddress,
  getCountry,
  getProvince,
  getCity,
  getDistrict,
  getSubDistrict,
  getPostalCode,
  getBusinessPurpose,
  updateAccountAddress,
  getType,
  createAccountAddress,
} from "../../../../../../../redux/slices/account_management/detailAccount/accountAddressSlice";
import {
  hasValue,
  requiredMessage,
  toTitleCase,
} from "../../../../../../../utils";
import {
  ModalConfirm,
  ModalSuccess,
} from "../../../../../../../components/Modal/ModalPopUp";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import Maps from "../../../../../../../components/Maps";

const FormAccountAddress = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state?.accountId;
  const idUpdate = location?.state;
  const accountAddressId = location?.state?.accountAddressId;
  const idCustomer = location?.state?.idCustomer;
  const typeAccount = location?.state?.type;

  const dispatch = useDispatch();
  const {
    data,
    data_choose_address,
    data_detail,
    data_country,
    data_province,
    data_city,
    data_district,
    data_subdistrict,
    data_postalcode,
    data_business_purpose,
    data_type,
    loading,
  } = useSelector((state) => state.accountAddress);

  const [modalChooseAddress, setModalChooseAddress] = useState(false);
  const [modalConfirmationAddress, setModalConfirmationAddress] =
    useState(false);
  const [modalCreateNewAddress, setModalCreateNewAddress] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [dataToSend, setDataToSend] = useState({});
  const [isCheckPremise, setIsCheckPremise] = useState(false);
  const [checkedPrimary, setCheckedPrimary] = useState(false);
  const [dataCreatenew, setDataCreatenew] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const formValue = form.getFieldValue();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [fullAddressMain, setFullAddressMain] = useState("");
  const [isIdChoose, setIsIdChoose] = useState("");
  const [dataDetail, setDataDetail] = useState({});

  const [modalValidate, setModalValidate] = useState(false);
  const [modalCheckPrimaryExist, setModalCheckPrimaryExist] = useState(false);
  const [typeValidation, setTypeValidation] = useState(true);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [selectedMaps, setSelectedMaps] = useState("");

  const routes = (id) => {
    return [
      {
        path: "",
        breadcrumbName: "Account",
      },
      {
        path:
          typeAccount === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
        breadcrumbName:
          typeAccount === "standard"
            ? "Account - Standard"
            : "Account - One Time",
      },
      {
        path:
          typeAccount === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
          idAccount: id,
        },
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ADDRESS,
        breadcrumbName: "Create Address",
      },
    ];
  };

  // Use Effect
  useEffect(() => {
    dispatch(getBusinessPurpose());
    dispatch(getCountry());
    dispatch(getType());
    if (type === "update") {
      const fetchDetail = async () => {
        await dispatch(getDetailAddress(accountAddressId))
          .unwrap()
          .then((data) => {
            if (data) {
              dispatch(getCountry());
              dispatch(getBusinessPurpose());
              if (data?.data?.country !== null)
                dispatch(getProvince(data?.data?.country?.id));
              if (data?.data?.country !== null)
                dispatch(getCity(data?.data?.province?.id));
              if (data?.data?.city !== null)
                dispatch(getDistrict(data?.data?.city?.id));
              if (data?.data?.district !== null)
                dispatch(getSubDistrict(data?.data?.district?.id));
              if (data?.data?.subDistrict !== null)
                dispatch(getPostalCode(data?.data?.subDistrict?.id));
              setSelectedLocation({
                lat: parseFloat(data?.data?.latitude),
                lng: parseFloat(data?.data?.longitude),
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      fetchDetail();
    } else {
      form.resetFields();
    }
  }, [dispatch, type]);

  useEffect(() => {
    if (id) {
      dispatch(
        getListChooseAddress({ id: idCustomer, search, sort, page, pageSize }),
      );
    }
  }, [dispatch, id, search, sort, page, pageSize, idCustomer]);

  //useEffect update set to dataDetail
  useEffect(() => {
    if (data_detail && data_detail.data) {
      if (type === "update") {
        setDataDetail({
          ...data_detail?.data,
          businessPurpose: data_detail?.data?.businessPurpose,
          additionalInfo: data_detail?.data?.additionalNote,
        });
        setIsCheckPremise(data_detail?.data?.premiseFlag);
        setCheckedPrimary(data_detail?.data?.primaryFlag);
      } else if (type === "create" && isIdChoose !== "") {
        setDataDetail({
          ...data_detail?.data,
          businessPurpose: data_detail?.data?.businessPurpose?.map(
            (item) => item.id,
          ),
        });
        setIsCheckPremise(false);
        setCheckedPrimary(false);
        form.resetFields(["businessPurpose", "premiseFlag", "primaryFlag"]);
      } else {
        setDataDetail({});
        setSelectedLocation({
          lat: dataCreatenew.latitude,
          lng: dataCreatenew.longitude,
        });
      }
    }
  }, [data_detail, type]);

  // For replace data from choose existing address // update
  useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        countryId: dataDetail?.country?.name,
        provinceId: dataDetail?.province?.name,
        cityId: dataDetail?.city?.name,
        districtId: dataDetail?.district?.name,
        subDistrictId: dataDetail?.subDistrict?.name,
        postalCodeId: dataDetail?.postalCode?.name,
        building: dataDetail?.building,
        floor: dataDetail?.floor,
        houseName: dataDetail?.houseName,
        streetName: dataDetail?.streetName,
        block: dataDetail?.block,
        houseNumber: dataDetail?.houseNumber,
        rt: dataDetail?.rt,
        rw: dataDetail?.rw,
        typeId: dataDetail?.typeId,
        additionalInfo: dataDetail?.additionalInfo,
        primary: dataDetail?.primary?.bool,
        premise: dataDetail?.premise?.bool,
        businessPurpose: dataDetail?.businessPurpose,
        latitude: dataDetail?.latitude,
        longitude: dataDetail?.longitude,
        source: dataDetail?.source,
        descAddress: dataDetail?.descAddress,
        descAccountAddress: dataDetail?.descAccountAddress,
      });
      setIsCheckPremise(
        dataDetail?.premiseFlag ? dataDetail?.premiseFlag : isCheckPremise,
      );
      setCheckedPrimary(
        dataDetail?.primaryFlag ? dataDetail?.primaryFlag : checkedPrimary,
      );
      setFullAddressMain(dataDetail?.fullAddress);
      setSelectedLocation({
        lat: parseFloat(dataDetail?.latitude),
        lng: parseFloat(dataDetail?.longitude),
      });
      setSelectedMaps(dataDetail?.source);
    }
  }, [dataDetail]);

  const handleSave = async (formValue) => {
    let url;
    let bodyRequest;
    if (idUpdate?.addressId) {
      const bodyUpdate = {
        ...formValue,
        addressId: accountAddressId,
        address: dataDetail?.fullAddress,
        countryId: dataDetail?.country?.id,
        provinceId: dataDetail?.province?.id,
        cityId: dataDetail?.city?.id,
        districtId: dataDetail?.district?.id,
        subDistrictId: dataDetail?.subDistrict?.id,
        postalCodeId: dataDetail?.postalCode?.id,
        typeId: dataDetail?.typeId,
        altitude: dataDetail?.altitude || 0,
        premiseFlag: isCheckPremise || false,
        primaryFlag: checkedPrimary || false,
        descAccountAddress: formValue?.descAccountAddress,
        descAddress: dataDetail?.descAddress,
        additionalNote: formValue?.additionalInfo,
      };

      setDataToSend(bodyUpdate);
      bodyRequest = {
        ...bodyUpdate,
        primaryFlag: formValue?.primaryFlag,
        needValidation: formValue?.primaryFlag,
      };
      url = "/v1/dbs/api/account/address/validate-update";
    } else {
      const body = {
        ...formValue,
        accountId: id,
        addressId: dataDetail.addressId || null,
        address: dataDetail?.fullAddress,
        countryId: dataDetail?.country?.id,
        provinceId: dataDetail?.province?.id,
        cityId: dataDetail?.city?.id,
        districtId: dataDetail?.district?.id,
        subDistrictId: dataDetail?.subDistrict?.id,
        postalCodeId: dataDetail?.postalCode?.id,
        typeId: dataDetail?.typeId,
        altitude: dataDetail?.altitude || 0,
        premiseFlag: isCheckPremise || false,
        primaryFlag: checkedPrimary || false,
        descAccountAddress: formValue?.descAccountAddress,
        descAddress: dataDetail?.descAddress,
        additionalNote: formValue?.additionalInfo,
      };

      // replace if value undefined tobe null
      const outputObject = {};
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          if (typeof body[key] === "undefined") {
            outputObject[key] = null;
          } else {
            outputObject[key] = body[key];
          }
        }
      }
      setDataToSend(outputObject);
      bodyRequest = {
        ...outputObject,
        primaryFlag: formValue?.primaryFlag,
        needValidation: formValue?.primaryFlag,
      };
      url = "/v1/dbs/api/account/address/validate-create";
    }
    try {
      const res = await dispatch(
        validateCreateUpdate({
          body: bodyRequest,
          services: accountManagementService,
          endPoint: url,
          type,
        }),
      )?.unwrap();
      if (res.success === false) {
        setModalCheckPrimaryExist(true);
        setTypeValidation(false);
      } else {
        setTypeValidation(false);
        setModalCheckPrimaryExist(false);
        setModalConfirmationAddress(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmation = async () => {
    if (!idUpdate?.isCreate) {
      const bodyDataUpdate = {
        addressId: accountAddressId,
        descriptionAddress: hasValue(dataToSend?.descAddress)
          ? dataToSend?.descAddress
          : null,
        description: hasValue(dataToSend?.descAccountAddress)
          ? dataToSend?.descAccountAddress
          : null,
        primaryFlag: dataToSend?.primaryFlag,
        needValidation: typeValidation,
      };
      await dispatch(updateAccountAddress({ body: bodyDataUpdate }))
        .unwrap()
        .then((data) => {
          setModalCheckPrimaryExist(false);
          setModalSuccess(true);
          form.resetFields();
          setModalConfirmationAddress(false);
        })
        .catch(() => {
          setTypeValidation(true);
          setModalConfirmationAddress(false);
        });
    } else {
      delete dataToSend.desc1;
      const body = {
        ...dataToSend,
        needValidation: typeValidation,
      };
      await dispatch(createAccountAddress({ body }))
        .unwrap()
        .then((data) => {
          setModalCheckPrimaryExist(false);
          setModalSuccess(true);
          form.resetFields();
          setModalConfirmationAddress(false);
        })
        .catch(() => {
          setTypeValidation(true);
          setModalConfirmationAddress(false);
        });
    }
  };

  const handleReset = () => {
    if (type === "update") {
      form.setFieldsValue({
        desc: dataDetail?.description_accountAddress,
      });
      setCheckedPrimary(data_detail?.data?.primaryFlag);
      setFullAddressMain("");
      setTimeout(() => {
        window.scrollBy({ top: -1000, behavior: "smooth" });
      }, 300);
    } else {
      form.resetFields();
      setIsCheckPremise(false);
      setCheckedPrimary(false);
      setFullAddressMain("");
      setTimeout(() => {
        window.scrollBy({ top: -1000, behavior: "smooth" });
      }, 300);
    }
  };

  const getDetailAddressById = async (addressId) => {
    await dispatch(getDetailAddressAfterChoose(addressId))
      .unwrap()
      .then((data) => {
        if (data?.data !== null) {
          dispatch(getProvince(data?.data?.country?.id));
          dispatch(getCity(data?.data?.province?.id));
          dispatch(getDistrict(data?.data?.city?.id));
          dispatch(getSubDistrict(data?.data?.district?.id));
          dispatch(getPostalCode(data?.data?.subDistrict?.id));
          setModalChooseAddress(false);
        }
      })
      .catch(() => {
        setModalChooseAddress(false);
      });
  };

  const checkPremise = (arr) => {
    arr.includes(166) ? setIsCheckPremise(true) : setIsCheckPremise(false);
  };

  // useEffect(() => {
  //   form.setFieldsValue({
  //     premiseFlag: isCheckPremise,
  //     primaryFlag: checkedPrimary,
  //   });
  // }, [isCheckPremise, checkedPrimary]);

  // Logic "checkbox" if checked true premise, then select business purpose "SHIP TO"
  const setShipTo = (e) => {
    let dataBusinessPurpose = form.getFieldValue("businessPurpose");
    dataBusinessPurpose === undefined
      ? (dataBusinessPurpose = [])
      : (dataBusinessPurpose = dataBusinessPurpose);
    if (isCheckPremise === false) {
      form.setFieldsValue({
        businessPurpose: [...dataBusinessPurpose, 166],
      });
    } else {
      form.setFieldsValue({
        businessPurpose: dataBusinessPurpose.filter((item) => item !== 166),
      });
    }
  };

  // Populate data form main if create new
  useEffect(() => {
    if (dataCreatenew?.fullAddress !== undefined) {
      setDataDetail({
        ...dataCreatenew,
        country: {
          id: dataCreatenew?.country,
          name: dataCreatenew?.countryName,
        },
        province: {
          id: dataCreatenew?.province,
          name: dataCreatenew?.provinceName,
        },
        city: {
          id: dataCreatenew?.city,
          name: dataCreatenew?.cityName,
        },
        district: {
          id: dataCreatenew?.district,
          name: dataCreatenew?.districtName,
        },
        subDistrict: {
          id: dataCreatenew?.subdistrict,
          name: dataCreatenew?.subDistrictName,
        },
        postalCode: {
          id: dataCreatenew?.postalCode,
          name: dataCreatenew?.postalCodeName,
        },
        typeId: dataCreatenew?.type,
        description_mAddress: dataCreatenew?.descAddress,
      });
      setFullAddressMain(dataCreatenew?.fullAddress);
      setSelectedLocation({
        lat: parseFloat(dataCreatenew?.latitude),
        lng: parseFloat(dataCreatenew?.longitude),
      });
    }
  }, [dataCreatenew]);

  const RenderMaps = useMemo(() => {
    if (hasValue(selectedMaps)) {
      if (selectedMaps?.toLowerCase() === "google maps") {
        return (
          <Maps
            keyword={fullAddressMain}
            setSelectedLocationFront={setSelectedLocation}
          />
        );
      }
    } else {
      return <></>;
    }
  }, [fullAddressMain]);

  return (
    <div>
      <LayoutMenu>
        <Spin spinning={loading}>
          <BreadCrumbAdvanced routes={routes(id)} />

          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={id}
            idCustomer={idCustomer}
            type={typeAccount}
          />

          <Form id={"form"} layout="vertical" form={form} onFinish={handleSave}>
            <BaseContainer header={"ADDRESS INFORMATION"}>
              {type === "create" && (
                <div className="flex w-full justify-end gap-x-2 pb-6">
                  <ButtonComponent
                    type="submit"
                    onClick={() => {
                      setModalChooseAddress(true);
                    }}
                  >
                    Choose Address
                  </ButtonComponent>
                </div>
              )}

              {/* Address Information */}
              <div className={"grid grid-cols-3 w-full gap-x-6"}>
                <Form.Item
                  name={"countryId"}
                  label={"Country"}
                  rules={[
                    {
                      message: requiredMessage("Country!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name={"provinceId"}
                  label={"Province"}
                  rules={[
                    {
                      message: requiredMessage("Province!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name={"cityId"}
                  label={"City"}
                  rules={[
                    {
                      message: requiredMessage("City!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name={"districtId"}
                  label={"District"}
                  rules={[
                    {
                      message: requiredMessage("District!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name={"subDistrictId"}
                  label={"Sub District"}
                  rules={[
                    {
                      message: requiredMessage("Sub District!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name={"postalCodeId"}
                  label={"Postal Code"}
                  rules={[
                    {
                      message: requiredMessage("Postal Code!"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent
                    disabled
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name={"building"} label={"Building"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"floor"} label={"Floor"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"houseName"} label={"House Name"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item
                  name={"streetName"}
                  label={"Street Name"}
                  rules={[
                    {
                      message: requiredMessage("street name"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"block"} label={"Block"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"houseNumber"} label={"House Number"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"rt"} label={"RT"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item name={"rw"} label={"RW"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
                <Form.Item
                  name={"typeId"}
                  label={"Type"}
                  rules={[
                    {
                      message: requiredMessage("Type!"),
                      required: true,
                    },
                  ]}
                >
                  <SelectComponent disabled={true}>
                    {data_type &&
                      data_type?.map((data) => (
                        <Select.Option key={data.id} value={data.id}>
                          {data.name}
                        </Select.Option>
                      ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item name={"additionalInfo"} label={"Additional Note"}>
                  <InputComponent type="text" disabled={true} />
                </Form.Item>
              </div>

              {/* Description Address Information */}
              <div className="grid w-full gap-x-6">
                <Form.Item name={"descAddress"} label={"Description"}>
                  <InputComponent
                    type="textarea"
                    value={"description"}
                    disabled={true}
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <div>
                  <p>
                    Address <span className="font-bold text-red-600">*</span>
                  </p>
                  <p>{`${(fullAddressMain || "-").toUpperCase()}`}</p>
                </div>
              </div>

              {/* Section Coordinate */}
              <div>
                <div className="pt-8 pb-4">
                  <h1 className="text-primary text-xs font-bold uppercase">
                    ADDRESS COORDINATE
                  </h1>
                </div>
                <div className={"grid grid-cols-4 w-full gap-x-6"}>
                  <Form.Item
                    name={"source"}
                    label={"Source"}
                    rules={[
                      {
                        message: requiredMessage("source"),
                        required: true,
                      },
                    ]}
                  >
                    <SelectComponent disabled={true}>
                      <Select.Option key={"DIGIO"} value={"DIGIO"}>
                        Digio
                      </Select.Option>
                      <Select.Option
                        key={toTitleCase("google maps")}
                        value={toTitleCase("Google Maps")}
                      >
                        Google Maps
                      </Select.Option>
                    </SelectComponent>
                  </Form.Item>

                  <Form.Item
                    name={"latitude"}
                    label={"Latitude"}
                    rules={[
                      {
                        message: requiredMessage("latitude"),
                        required: true,
                      },
                    ]}
                  >
                    <InputComponent type="text" disabled={true} />
                  </Form.Item>
                  <Form.Item
                    name={"longitude"}
                    label={"Longitude"}
                    rules={[
                      {
                        message: requiredMessage("longtitude"),
                        required: true,
                      },
                    ]}
                  >
                    <InputComponent type="text" disabled={true} />
                  </Form.Item>
                  <Form.Item
                    name={"altitude"}
                    label={"Altitude"}
                    // rules={[
                    //   {
                    //     message: "This field is required",
                    //     required: true,
                    //   },
                    // ]}
                  >
                    <InputComponent type="text" disabled={true} />
                  </Form.Item>
                </div>
                <div className={"w-full grid grid-cols-1 gap-2"}>
                  <span className="text-primary">
                    Pinpoint address coordinate
                  </span>
                  <div className="w-full">{RenderMaps}</div>
                </div>
                {/* <div className="pt-8 pb-4">
                  <h1 className="text-xs">Pinpoint address coordinate</h1>
                </div>
                <div className={"grid grid-cols-1 w-full gap-x-6"}>
                  <GoogleMapsCustom
                    zoom={13}
                    selectedLocation={selectedLocation}
                  // apiKey={isApiKeyMain ? "AIzaSyBVDgjodTBNFqVy176Dhh6Ca4Xego1_wMM" : ""}
                  />
                </div> */}
              </div>

              {/* Section Address Purpose Information */}
              <div>
                <div className="pt-8 pb-4">
                  <h1 className="text-primary text-xs font-bold uppercase">
                    ADDRESS PURPOSE INFORMATION
                  </h1>
                </div>
                <div className={"grid grid-cols-3 w-full gap-x-6 pb-8"}>
                  <Form.Item
                    name={"businessPurpose"}
                    label={"Busines Purposes"}
                    rules={[
                      {
                        message: requiredMessage("Business Purpose"),
                        required: true,
                      },
                    ]}
                  >
                    <SelectComponent
                      onChange={(e) => checkPremise(e)}
                      disabled={type === "update"}
                      mode={"multiple"}
                    >
                      {data_business_purpose &&
                        data_business_purpose?.map((item) => (
                          <Select.Option value={item.id} key={item.id}>
                            {item.text}
                          </Select.Option>
                        ))}
                    </SelectComponent>
                  </Form.Item>
                  <Form.Item
                    name="premiseFlag"
                    label={"Premise Address"}
                    initialValue={isCheckPremise}
                    valuePropName="checked"
                    noStyle
                  >
                    <div className="flex flex-col">
                      <Checkbox
                        disabled={type === "update"}
                        checked={isCheckPremise}
                        onChange={(e) => {
                          setIsCheckPremise(e.target.checked);
                          setShipTo(e);
                        }}
                      >
                        Premise Address
                      </Checkbox>
                      <span className="pl-[26px] text-[10px]">
                        Check premise address if this address will be the place
                        where the product is installed/applied
                      </span>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="primaryFlag"
                    label={"Primary Address"}
                    initialValue={checkedPrimary}
                    valuePropName="checked"
                    noStyle
                  >
                    <div className="flex flex-col">
                      <Checkbox
                        disabled={
                          type === "update" &&
                          data_detail?.data?.primaryFlag === true
                        }
                        checked={checkedPrimary}
                        onChange={(e) => setCheckedPrimary(e.target.checked)}
                      >
                        Primary Address
                      </Checkbox>
                      <span className="pl-[26px] text-[10px]">
                        Check primary address if this address is primary addres
                      </span>
                    </div>
                  </Form.Item>
                </div>
              </div>

              {/* Description Address Purpose Information */}
              <div className="grid w-full gap-x-6">
                <Form.Item name={"descAccountAddress"}>
                  <InputComponent
                    label={"Remark"}
                    type="textarea"
                    value={"description"}
                    // onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </BaseContainer>
          </Form>

          <div className={"w-full my-5 flex"}>
            <Link
              to={
                typeAccount === "standard"
                  ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                  : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
              }
              state={{
                section: "Account Address",
                idAccount: id,
                idCustomer: idCustomer,
              }}
            >
              <ButtonComponent
                icon={
                  <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
                }
                type="submit"
                // onClick={() => setModalBack(true)}
                // onClick={() => navigate(-1)}
              >
                Back
              </ButtonComponent>
            </Link>
            <div className={"w-full flex justify-end gap-5"}>
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
              <ButtonComponent type="submit" htmlType={"submit"} form={"form"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Spin>
      </LayoutMenu>

      <ModalChooseAddress
        dataTable={data_choose_address}
        page={page}
        pageSize={pageSize}
        isOpen={modalChooseAddress}
        closeModal={setModalChooseAddress}
        modalCreateNewAddress={setModalCreateNewAddress}
        getDetailAddressById={getDetailAddressById}
        idAccount={id}
        getListChooseAddress={getListChooseAddress}
        dispatch={dispatch}
        setPageSize={setPageSize}
        setPage={setPage}
        sort={sort}
        setSort={setSort}
        setSearchText={setSearchText}
        setSearchedColumn={setSearchedColumn}
        setSearch={setSearch}
        isIdChoose={isIdChoose}
        setIsIdChoose={setIsIdChoose}
        loading={loading}
      />

      <ModalConfirmationAddress
        isOpen={modalConfirmationAddress}
        closeModal={setModalConfirmationAddress}
        dataToSend={dataToSend}
        handleConfirmation={handleConfirmation}
        dataCountry={data_country}
        dataProvince={data_province}
        dataCity={data_city}
        dataDistrict={data_district}
        dataSubdistrict={data_subdistrict}
        dataPostalcode={data_postalcode}
        dataBusiness={data_business_purpose}
        dataType={data_type}
        setModalCheckPrimaryExist={setModalCheckPrimaryExist}
        setTypeValidation={setTypeValidation}
      />

      <ModalCreateNewAddress
        modalChooseAddress={setModalChooseAddress}
        isOpen={modalCreateNewAddress}
        closeModalCreateNew={setModalCreateNewAddress}
        dataCountry={data_country}
        dataProvince={data_province}
        dataCity={data_city}
        dataDistrict={data_district}
        dataSubdistrict={data_subdistrict}
        dataPostalcode={data_postalcode}
        dataType={data_type}
        dispatch={dispatch}
        getCountry={getCountry}
        getProvince={getProvince}
        getCity={getCity}
        getDistrict={getDistrict}
        getSubdistrict={getSubDistrict}
        getPostalCode={getPostalCode}
        getType={getType}
        setDataCreatenew={setDataCreatenew}
        // setFullAddressMain={setFullAddressMain}
      />

      {modalCheckPrimaryExist ? (
        <ModalConfirm
          isOpen={modalCheckPrimaryExist}
          handleCancel={() => {
            setModalCheckPrimaryExist(false);
            setTypeValidation(true);
          }}
          handleOk={() => {
            setModalConfirmationAddress(true);
            setModalCheckPrimaryExist(false);
            setTypeValidation(false);
            // handleConfirmation();
          }}
          width={700}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              {`Are you sure want to ${
                type === "create" ? "create" : "update"
              } new primary address ?`}
            </p>
          </div>
          <Alert
            message="
            Warning! You have active primary address, if you want to continue, the existing primary address will be inactivated!"
            type={"error"}
          />
        </ModalConfirm>
      ) : null}

      {modalSuccess ? (
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
            <p className="pl-[70px]">{`Your data has been ${type === "create" ? "created" : "updated"}`}</p>
          </div>
        </ModalSuccess>
      ) : null}
    </div>
  );
};

export default FormAccountAddress;
