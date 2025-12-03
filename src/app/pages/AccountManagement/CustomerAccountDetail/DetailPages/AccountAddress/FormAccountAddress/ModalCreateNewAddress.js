import React, { useEffect, useState, useCallback, useMemo } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { Form, Select } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { hasValue, requiredMessage } from "../../../../../../../utils";
import { onInputUpperCase } from "../../../../Utils";
import Maps from "../../../../../../../components/Maps";

const ModalCreateNewAddress = ({
  isOpen,
  closeModalCreateNew = () => {},
  modalChooseAddress = () => {},
  dispatch,
  dataCountry,
  dataProvince,
  dataCity,
  dataDistrict,
  dataSubdistrict,
  dataPostalcode,
  dataType,
  getProvince,
  getCity,
  getDistrict,
  getSubdistrict,
  getPostalCode,
  setDataCreatenew,
  // setFullAddressMain,
}) => {
  const [combinedText, setCombinedText] = useState("");
  const [selectedLocationCreateNew, setSelectedLocationCreateNew] = useState({
    lat: -6.184395,
    lng: 106.844298,
  });
  const [showTextFullAddress, setShowTextFullAddress] = useState("");
  const [selectedMaps, setSelectedMaps] = useState("");
  const [formModal] = Form.useForm();
  const formValue = formModal.getFieldsValue();

  // prepared for check id & name to confirmation ui <<<<<<<<
  const getCountryName = useCallback(
    (val) => {
      const countryName = dataCountry?.data?.filter((item) => item?.id === val);
      if (countryName === undefined) {
        return "";
      }
      if (countryName.length !== 0) {
        return countryName[0].name;
      }
    },
    [dataCountry?.data],
  );
  const getProvinceName = useCallback(
    (val) => {
      const provinceName = dataProvince?.data?.filter(
        (item) => item?.id === val,
      );
      if (provinceName === undefined) {
        return "";
      }
      if (provinceName.length !== 0) {
        return provinceName[0].name;
      }
    },
    [dataProvince?.data],
  );

  const getCityName = useCallback(
    (val) => {
      const cityName = dataCity?.data?.filter((item) => item?.id === val);
      if (cityName === undefined) {
        return "";
      }
      if (cityName.length !== 0) {
        return cityName[0].name;
      }
    },
    [dataCity?.data],
  );

  const getDistrictName = useCallback(
    (val) => {
      const districtName = dataDistrict?.data?.filter(
        (item) => item?.id === val,
      );
      if (districtName === undefined) {
        return "";
      }
      if (districtName.length !== 0) {
        return districtName[0].name;
      }
    },
    [dataDistrict?.data],
  );

  const getSubDistrictName = useCallback(
    (val) => {
      const subDistrictName = dataSubdistrict?.data?.filter(
        (item) => item?.id === val,
      );
      if (subDistrictName === undefined) {
        return "";
      }
      if (subDistrictName.length !== 0) {
        return subDistrictName[0].name;
      }
    },
    [dataSubdistrict?.data],
  );

  const getPostalCodeName = useCallback(
    (val) => {
      const postalCodeName = dataPostalcode?.data?.filter(
        (item) => item?.id === val,
      );
      if (postalCodeName === undefined) {
        return "";
      }
      if (postalCodeName.length !== 0) {
        return postalCodeName[0].name;
      }
    },
    [dataPostalcode?.data],
  );

  const getTypeName = (val) => {
    const typeName = dataType?.filter((item) => item?.id === val);
    if (typeName === undefined) {
      return "";
    }
    if (typeName.length !== 0) {
      return typeName[0].name;
    }
  };

  const replaceStreetName = useCallback((val) => {
    if (val) {
      const result = val.replace(
        // /Jalan|Jalan.|jln|jl|Jl.|jl.|jln.|Jl/gi,
        /JL\.|JLN\.|JLN|JALAN\.|JALAN|JL|Jaln/gi,
        "",
        // function (x) {
        //   return (x = "JL. ");
        // }
      );
      return result;
    }
    return "";
  }, []);

  // Use Effect
  useEffect(() => {
    if (formValue) {
      let textFull = `${hasValue(formValue.building) ? `GEDUNG ${formValue?.building}` : ""}, ${hasValue(formValue?.floor) ? `LANTAI ${formValue.floor}` : ""}, ${formValue.houseName}, ${hasValue(formValue.streetName) ? "JL." : ""} ${replaceStreetName(formValue.streetName)}, ${hasValue(formValue.block) ? `BLOCK ${formValue?.block}` : ""}, ${formValue.houseNumber && `NO. ${formValue.houseNumber}`}, ${formValue.rt && `RT. ${formValue.rt}`}, ${formValue.rw && `RW. ${formValue.rw}`}, ${hasValue(formValue?.additionalInfo) ? `${formValue?.additionalInfo},  ` : ", "}, ${getSubDistrictName(formValue.subdistrict)}, ${getDistrictName(formValue.district)}, ${getCityName(formValue.city)}, ${getProvinceName(formValue.province)}, ${getCountryName(formValue?.country)}, ${getPostalCodeName(formValue.postalCode)}`;

      let cleanedText = textFull
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item && item !== "undefined")
        .join(", ");
      setShowTextFullAddress(cleanedText);
      // setFullAddressMain(cleanedText);
    }
  }, [
    formValue,
    getCityName,
    getCountryName,
    getDistrictName,
    getPostalCodeName,
    getProvinceName,
    getSubDistrictName,
    replaceStreetName,
  ]);

  useEffect(() => {
    if (
      selectedLocationCreateNew.lat !== "-6.184395" ||
      selectedLocationCreateNew.lng !== "106.844298"
    ) {
      formModal.setFieldsValue({
        latitude: selectedLocationCreateNew?.lat,
        longitude: selectedLocationCreateNew?.lng,
      });
    }
  }, [selectedLocationCreateNew, formModal]);

  // Handle Combine text Address
  const handleInputChange = (value, name) => {
    setCombinedText((prevState) => ({
      ...prevState,
    }));
  };

  const handleCloseModalCreateNew = () => {
    setShowTextFullAddress("");
    formModal.resetFields();
    closeModalCreateNew(false);
    setSelectedMaps("");
  };
  const handleOpenModalChooseAddress = () => {
    modalChooseAddress(true);
  };

  const handleToMainForm = (e) => {
    if (e) {
      setDataCreatenew({
        ...e,
        fullAddress: showTextFullAddress,
        countryName: getCountryName(e.country),
        provinceName: getProvinceName(e.province),
        cityName: getCityName(e.city),
        districtName: getDistrictName(e.district),
        subDistrictName: getSubDistrictName(e.subdistrict),
        postalCodeName: getPostalCodeName(e.postalCode),
        typeName: getTypeName(e.type),
      });
      setShowTextFullAddress("");
      formModal.resetFields();
      handleCloseModalCreateNew();
      modalChooseAddress(false);
      setSelectedMaps("");
    }
  };

  // ===== Function Create New Address ===== //

  const handleOnChangeCountry = (e) => {
    if (e !== undefined) {
      dispatch(getProvince(e));
      formModal.resetFields([
        "province",
        "city",
        "district",
        "subdistrict",
        "postalCode",
      ]);
      return e;
    } else {
      formModal.resetFields([
        "province",
        "city",
        "district",
        "subdistrict",
        "postalCode",
      ]);
    }
  };
  const handleOnChangeProvince = (e) => {
    if (e !== undefined) {
      dispatch(getCity(e));
      formModal.resetFields(["city", "district", "subdistrict", "postalCode"]);
      return e;
    } else {
      formModal.resetFields(["city", "district", "subdistrict", "postalCode"]);
    }
  };
  const handleOnChangeCity = (e) => {
    if (e !== undefined) {
      dispatch(getDistrict(e));
      formModal.resetFields(["district", "subdistrict", "postalCode"]);
      return e;
    } else {
      formModal.resetFields(["district", "subdistrict", "postalCode"]);
    }
  };
  const handleOnChangeDistrict = (e) => {
    if (e !== undefined) {
      dispatch(getSubdistrict(e));
      formModal.resetFields(["subdistrict", "postalCode"]);
      return e;
    } else {
      formModal.resetFields(["subdistrict", "postalCode"]);
    }
  };
  const handleOnChangeSubdistrict = (e) => {
    if (e !== undefined) {
      dispatch(getPostalCode(e));
      formModal.resetFields(["postalCode"]);
      return e;
    } else {
      formModal.resetFields(["postalCode"]);
    }
  };

  // ======= Start Function Google Maps API ======= //

  const onMapClick = useCallback((event) => {
    setSelectedLocationCreateNew({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  // ======= End Function Google Maps API ======= //

  const RenderMaps = useMemo(() => {
    if (hasValue(selectedMaps)) {
      if (selectedMaps?.toLowerCase() === "google maps") {
        return (
          <Maps
            keyword={showTextFullAddress}
            setSelectedLocationFront={setSelectedLocationCreateNew}
          />
        );
      }
    } else {
      return <></>;
    }
  }, [showTextFullAddress, selectedMaps]);

  return (
    <div>
      {isOpen ? (
        <ModalCustom
          header={"CREATE NEW ADDRESS"}
          isOpen={isOpen}
          type={"confirmation"}
          handleCancel={() => {
            handleCloseModalCreateNew();
            handleOpenModalChooseAddress();
          }}
          width={1000}
        >
          <Form layout="vertical" form={formModal} onFinish={handleToMainForm}>
            {/* Address Information */}
            <div className={"grid grid-cols-3 w-full gap-x-6"}>
              <Form.Item
                name={"country"}
                label={"Country"}
                rules={[
                  {
                    message: "Please input your Country!",
                    required: true,
                  },
                ]}
                getValueFromEvent={handleOnChangeCountry}
              >
                <SelectComponent
                  onChange={(e) => handleInputChange(e, "country")}
                >
                  {dataCountry?.data &&
                    dataCountry?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name={"province"}
                label={"Province"}
                rules={[
                  {
                    message: "Please input your Province!",
                    required: true,
                  },
                ]}
                getValueFromEvent={handleOnChangeProvince}
              >
                <SelectComponent
                  disabled={!formModal.getFieldValue().country ? true : false}
                  onChange={(e) => handleInputChange(e, "province")}
                >
                  {dataProvince?.data &&
                    dataProvince?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name={"city"}
                label={"City"}
                rules={[
                  {
                    message: "Please input your City!",
                    required: true,
                  },
                ]}
                getValueFromEvent={handleOnChangeCity}
              >
                <SelectComponent
                  disabled={!formModal.getFieldValue().province ? true : false}
                  onChange={(e) => handleInputChange(e, "city")}
                >
                  {dataCity?.data &&
                    dataCity?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name={"district"}
                label={"District"}
                rules={[
                  {
                    message: "Please input your District!",
                    required: true,
                  },
                ]}
                getValueFromEvent={handleOnChangeDistrict}
              >
                <SelectComponent
                  disabled={!formModal.getFieldValue().city ? true : false}
                  onChange={(e) => handleInputChange(e, "district")}
                >
                  {dataDistrict?.data &&
                    dataDistrict?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name={"subdistrict"}
                label={"Sub District"}
                rules={[
                  {
                    message: "Please input your Subdistrict!",
                    required: true,
                  },
                ]}
                getValueFromEvent={handleOnChangeSubdistrict}
              >
                <SelectComponent
                  disabled={!formModal.getFieldValue().district ? true : false}
                  onChange={(e) => handleInputChange(e, "subdistrict")}
                >
                  {dataSubdistrict?.data &&
                    dataSubdistrict?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                name={"postalCode"}
                label={"Postal Code"}
                rules={[
                  {
                    message: "Please input your Postal Code!",
                    required: true,
                  },
                ]}
              >
                <SelectComponent
                  disabled={
                    !formModal.getFieldValue().subdistrict ? true : false
                  }
                  onChange={(e) => handleInputChange(e, "postalCode")}
                >
                  {dataPostalcode?.data &&
                    dataPostalcode?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item name={"building"} label={"Building"}>
                <InputComponent
                  onInput={onInputUpperCase}
                  type="text"
                  onChange={(e) =>
                    handleInputChange(e.target.value, "building")
                  }
                />
              </Form.Item>
              <Form.Item name={"floor"} label={"Floor"}>
                <InputComponent
                  type="text"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  onChange={(e) => handleInputChange(e.target.value, "floor")}
                />
              </Form.Item>
              <Form.Item name={"houseName"} label={"House Name"}>
                <InputComponent
                  type="text"
                  onInput={onInputUpperCase}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "houseName")
                  }
                />
              </Form.Item>
              <Form.Item
                name={"streetName"}
                label={"Street Name"}
                rules={[
                  {
                    message: "Please input your Street Name!",
                    required: true,
                  },
                ]}
              >
                <InputComponent
                  type="text"
                  onChange={(e) =>
                    handleInputChange(e.target.value, "streetName")
                  }
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item name={"block"} label={"Block"}>
                <InputComponent
                  type="text"
                  onInput={onInputUpperCase}
                  onChange={(e) => handleInputChange(e.target.value, "block")}
                />
              </Form.Item>
              <Form.Item name={"houseNumber"} label={"House Number"}>
                <InputComponent
                  type="text"
                  onInput={onInputUpperCase}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "houseNumber")
                  }
                />
              </Form.Item>
              <Form.Item name={"rt"} label={"RT"}>
                <InputComponent
                  type="text"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  onChange={(e) => handleInputChange(e.target.value, "rt")}
                />
              </Form.Item>
              <Form.Item name={"rw"} label={"RW"}>
                <InputComponent
                  type="text"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  onChange={(e) => handleInputChange(e.target.value, "rw")}
                />
              </Form.Item>
              <Form.Item
                name={"type"}
                label={"Type"}
                rules={[
                  {
                    message: "Please input your Type!",
                    required: true,
                  },
                ]}
              >
                <SelectComponent>
                  {dataType &&
                    dataType?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item name={"additionalInfo"} label={"Additional Note"}>
                <InputComponent
                  onInput={onInputUpperCase}
                  onChange={(e) => handleInputChange(e.target.value, "type")}
                  type="text"
                />
              </Form.Item>
            </div>
            {/* Description Address Information */}
            <div className="grid w-full gap-x-6">
              <Form.Item name={"descAddress"}>
                <InputComponent
                  label={"Description"}
                  type="textarea"
                  value={"description"}
                />
              </Form.Item>
              <div>
                <p>
                  Address <span className="font-bold text-red-600">*</span>
                </p>
                <p>{showTextFullAddress.toUpperCase()}</p>
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
                  label="Source"
                  name="source"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Source",
                    },
                  ]}
                  // initialValue={'Google Maps'}
                >
                  <SelectComponent onChange={(e) => setSelectedMaps(e)}>
                    <Select.Option key={1} value={"Google Maps"}>
                      Google Maps
                    </Select.Option>
                  </SelectComponent>
                </Form.Item>
                <Form.Item
                  name={"latitude"}
                  label={"Latitude"}
                  rules={[
                    {
                      message: requiredMessage("latitude on maps"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent disabled={true} type="text" />
                </Form.Item>
                <Form.Item
                  name={"longitude"}
                  label={"Longitude"}
                  rules={[
                    {
                      message: requiredMessage("longitude on maps"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent disabled={true} type="text" />
                </Form.Item>
                <Form.Item name={"altitude"} label={"Altitude"}>
                  <InputComponent disabled={true} type="text" />
                </Form.Item>
              </div>
              <div className={"w-full grid grid-cols-1 gap-2"}>
                <span className="text-primary">
                  Pinpoint address coordinate
                </span>
                <div className="w-full">
                  {selectedMaps !== "" && RenderMaps}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px] pt-4">
              <ButtonComponent
                onClick={() => {
                  handleCloseModalCreateNew();
                  handleOpenModalChooseAddress();
                }}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent type="submit" htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </Form>
        </ModalCustom>
      ) : null}
    </div>
  );
};

export default ModalCreateNewAddress;
