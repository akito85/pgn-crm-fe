import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Form,
  Select,
  Input,
  Checkbox,
  Button,
  DatePicker,
  Tooltip,
} from "antd";
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";
import { dateFormatting, hasValue } from "../../../../../../../utils";
import SelectComponent from "../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../../../assets/Icon/index";
import Highlighter from "react-highlight-words";
import TablePagination from "../../../../../../../components/TablePagination";
import {
  getAllAddressPaginate,
  getBusinessPurpose,
  getCity,
  getCountry,
  getDistrict,
  getPostalCode,
  getProvince,
  getSubDistrict,
  getType,
  checkIsPremiseAlready
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import GoogleMapsCustom from "../../../../CustomerAccountDetail/DetailPages/AccountAddress/GoogleMapsCustom";
import { onInputUpperCase } from "../../../../Utils";
import Maps from "../../../../../../../components/Maps";

const AddressForm = ({
  addressTable = [],
  setAddressTable,
  addressObj = {},
  dispatch = () => { },
  handleAddressObj = () => { },
  customerId,
  form,
  handleContactChangesByAddress =()=>{},
  setAddressObj,
  setTiObj,
  tiObj
}) => {
  // Selector
  const {
    loading,
    data_address,
    data_country,
    data_province,
    data_city,
    data_district,
    data_subDistrict,
    data_postalCode,
    data_type,
    data_businessPurpose,
    isPremiseAlready
  } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const [formAddress] = Form.useForm();
  const dataSource = data_address?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const [description, setDescription] = useState("");
  const [modalChooseAddress, setModalChooseAddress] = useState(false);
  const [modalCreateAddress, setModalCreateAddress] = useState(false);
  const [keyModal, setKeyModal] = useState();
  const [combinedText, setCombinedText] = useState("");
  const [inputAddress, setInputAddress] = useState({
    countryId: null,
    provinceId: null,
    cityId: null,
    districtId: null,
    subDistrictId: null,
    postalCodeId: null,
  })
  const [selectedLocationCreateNew, setSelectedLocationCreateNew] = useState({
    lat: -6.184395,
    lng: 106.844298,
  });
const [selectedMaps, setSelectedMaps] = useState('');

  const formAddressValues = formAddress.getFieldsValue();

  const {
    countryId,
    provinceId,
    cityId,
    districtId,
    subDistrictId,
    building,
    floor,
    houseName,
    streetName,
    block,
    houseNumber,
    rt,
    rw,
    postalCodeId,
    additionalNote,
  } = formAddressValues;

  const formValue = formAddress.getFieldsValue();

  const replaceStreetName = useCallback(
    (val) => {
      if (val) {
        const result = val.replace(
          /JALAN|JALAN.|jLN|JL|JL.|JL.|JLN.|JL/gi,
          function (x) {
            return (x = "");
          }
        );
        return result;
      }
      return "";
    },
    [formValue]
  );
  const fullAddress = `
  ${building ? `GEDUNG ${building}, ` : ""}
  ${floor ? `LANTAI ${floor}, ` : ""}
  ${houseName ? houseName + ", " : ""}
    ${streetName ? `JL. ${replaceStreetName(streetName)}` + "," : ""}
  ${block ? `BLOCK ${block}, ` : ""}
  ${houseNumber ? "No. " + houseNumber + ", " : ""}
  ${rt ? "RT. " + rt + ", " : ""}
  ${rw ? "RW. " + rw + ", " : ""}
  ${additionalNote ? additionalNote + ", " : ""}
  ${postalCodeId
      ? data_postalCode?.data
        ?.filter((a) => a.id === postalCodeId)
        ?.find((b) => b.name)?.name
      : ""
    }
  ${subDistrictId
      ? ", " +
      data_subDistrict?.data
        ?.filter((a) => a.id === subDistrictId)
        ?.find((b) => b.name)?.name +
      ", "
      : ""
    }
  ${districtId
      ? data_district?.data
        ?.filter((a) => a.id === districtId)
        ?.find((b) => b.name)?.name + ", "
      : ""
    }
  ${cityId
      ? data_city?.data?.filter((a) => a.id === cityId)?.find((b) => b.name)
        ?.name + ", "
      : ""
    }
  ${provinceId
      ? data_province?.data
        ?.filter((a) => a.id === provinceId)
        ?.find((b) => b.name)?.name + ", "
      : ""
    }
  ${countryId
      ? data_country?.data
        ?.filter((a) => a.id === countryId)
        ?.find((b) => b.name)?.name
      : ""
    }
    `.trim();

  const [dataBusinessPurpose, setDataBusinessPurpose] = useState([]);

  // Use Effect
  useEffect(() => {
    dispatch(getCountry());
    dispatch(getType());
    dispatch(getBusinessPurpose());
  }, []);

  useEffect(() => {
    setDataBusinessPurpose(
      data_businessPurpose?.filter((item) => item.id !== 162)
    );
  }, [data_businessPurpose]);

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllAddressPaginate({
        customerId,
        search: tempSearch,
        page,
        pageSize,
        sort,
      })
    );
  }, [customerId, search, page, pageSize, sort]);

  const validateBusinessPurpose = (index) => {
    if (
      addressTable[index] 
      // &&
      // addressObj[`businessPurpose${index + 1}`]?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Validation Address Information
  const validateAddress = (index) => {

    if ( index === 1 && addressTable.length >= 1) {
      return validateBusinessPurpose(0);
    }
    if (index === 2 && addressTable.length >= 2) {
      return validateBusinessPurpose(1);
    }
    if (index === 3 && addressTable.length >= 3) {
      return validateBusinessPurpose(2);
    }
    if (index === 4 && addressTable.length >= 4) {
      return validateBusinessPurpose(3);
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (
      selectedLocationCreateNew.lat != "-6.184395" ||
      selectedLocationCreateNew.lng != "106.844298"
    ) {
      formAddress.setFieldsValue({
        latitude: selectedLocationCreateNew?.lat.toString(),
        longitude: selectedLocationCreateNew?.lng.toString(),
      });
    }
  }, [selectedLocationCreateNew, formAddress]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      let result =
        type === "date"
          ? moment(record[dataIndex])
            .format(dateFormatting.dateFormal)
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
          : record[dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
      return result;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      sorter: true,
      title: "ADDRESS",
      dataIndex: "fullAddress",
      width: 700,
      ...getColumnSearchProps("fullAddress"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "fullAddress" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ADDITIONAL NOTE",
      dataIndex: "additionalNote",
      sorter: true,
      ...getColumnSearchProps("additionalNote"),
    },
    {
      title: "HOUSE NAME",
      dataIndex: "houseName",
      sorter: true,
      ...getColumnSearchProps("houseName"),
    },
    {
      title: "STREET NAME",
      dataIndex: "streetName",
      sorter: true,
      ...getColumnSearchProps("streetName"),
    },
    {
      title: "HOUSE NUMBER",
      dataIndex: "houseNumber",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("houseNumber"),
    },
    {
      title: "RT",
      dataIndex: "rt",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("rt"),
    },
    {
      title: "RW",
      dataIndex: "rw",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("rw"),
    },
    {
      title: "BUILDING",
      dataIndex: "building",
      sorter: true,
      ...getColumnSearchProps("building"),
    },
    {
      title: "FLOOR",
      dataIndex: "floor",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("floor"),
    },
    {
      title: "POSTAL CODE",
      dataIndex: "postalCode",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("postalCode"),
    },
    {
      title: "SUB DISTRICT",
      dataIndex: "subDistrict",
      sorter: true,
      ...getColumnSearchProps("subDistrict"),
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      sorter: true,
      ...getColumnSearchProps("district"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "district") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "CITY",
      dataIndex: "city",
      sorter: true,
      ...getColumnSearchProps("city"),
    },
    {
      title: "PROVINCE",
      dataIndex: "province",
      sorter: true,
      ...getColumnSearchProps("province"),
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      sorter: true,
      ...getColumnSearchProps("country"),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("source"),
    },
    {
      sorter: true,
      title: "DESCRIPTION",
      dataIndex: "description",
      ...getColumnSearchProps("description"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("source"),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "addressId",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined
                onClick={
                  !disabledPlus(r) ? () => {
                    handleChooseAddress(r)
                    businessPurposeReset()
                  } : undefined
                }
                style={{
                  color: !disabledPlus(r) ? "#0075BF" : "#8D91A0",
                  cursor: !disabledPlus(r) ? "pointer" : "not-allowed",
                }}
                disabled={!disabledPlus(r) ? false : true}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const disabledPlus = (r) => {
    const temp = addressTable.filter((item) => item.addressId === r.addressId);
    if (temp.length === 0) {
      return false;
    }
    return true;
  };

  const handleOnChangeCountry = (e) => {
    formAddress.resetFields([
      "provinceId",
      "cityId",
      "districtId",
      "subDistrictId",
      "postalCodeId",
    ]);
    if (e !== undefined) {
      setInputAddress({
        ...inputAddress,
        countryId: e,
        provinceId: null,
        cityId: null,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
      dispatch(getProvince(e));
      return e;
    } else {
      setInputAddress({
        countryId: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
    }
  };

  const handleOnChangeProvince = (e) => {
    formAddress.resetFields([
      "cityId",
      "districtId",
      "subDistrictId",
      "postalCodeId",
    ]);
    if (e !== undefined) {
      setInputAddress({
        ...inputAddress,
        provinceId: e,
        cityId: null,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
      dispatch(getCity(e));
      return e;
    } else {
      setInputAddress({
        ...inputAddress,
        provinceId: null,
        cityId: null,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
    }
  };

  const handleOnChangeCity = (e) => {
    formAddress.resetFields(["districtId", "subDistrictId", "postalCodeId"]);
    if (e !== undefined) {
      setInputAddress({
        ...inputAddress,
        cityId: e,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
      dispatch(getDistrict(e));
      return e;
    } else {
      setInputAddress({
        ...inputAddress,
        cityId: null,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
    }
  };

  const handleOnChangeDistrict = (e) => {
    formAddress.resetFields(["subDistrictId", "postalCodeId"]);
    if (e !== undefined) {
      setInputAddress({
        ...inputAddress,
        districtId: e,
        subDistrictId: null,
        postalCodeId: null,
      })
      dispatch(getSubDistrict(e));
      return e;
    } else {
      setInputAddress({
        ...inputAddress,
        districtId: null,
        subDistrictId: null,
        postalCodeId: null,
      })
    }
  };

  const handleOnChangeSubDistrict = (e) => {
    formAddress.resetFields(["postalCodeId"]);
    if (e !== undefined) {
      setInputAddress({
        ...inputAddress,
        subDistrictId: e,
        postalCodeId: null,
      })
      dispatch(getPostalCode(e));
      return e;
    }else {
      setInputAddress({
        ...inputAddress,
        subDistrictId: null,
        postalCodeId: null,
      })
    }
  };

  const handleCancelModalChooseAddress = () => {
    setModalChooseAddress(false);
    setInputAddress({
      countryId: null,
      provinceId: null,
      cityId: null,
      districtId: null,
      subDistrictId: null,
      postalCodeId: null,
    })
  };

  const handleChooseAddress = (record) => {
    const newData = [...addressTable];

    const dataValue = {
      ...record,
      countryId: record.countryId,
      provinceId: record.provinceId,
      cityId: record.cityId,
      districtId: record.districtId,
      subDistrictId: record.subDistrictId,
      postalCodeId: record.postalCodeId,
      typeId: record.typeId,
      tempId: null,
      key: keyModal,
      overview: `Address ${keyModal}`,
      primaryFlag: keyModal === 1 ? true : false,
    };

    // replace if value undefined to be null
    const outputObject = {};
    for (const key in dataValue) {
      if (dataValue.hasOwnProperty(key)) {
        if (typeof dataValue[key] === "undefined") {
          outputObject[key] = null;
        } else {
          outputObject[key] = dataValue[key];
        }
      }
    }

    newData[keyModal - 1] = outputObject;
    handleContactChangesByAddress(keyModal, newData)
    setAddressTable(newData);
    setModalChooseAddress(false);
  };

  // const businessPurposeReset = () => {
  //   if (keyModal === 1) {
  //     setAddressObj({
  //       ...addressObj,
  //       businessPurpose1: null,
  //       premiseAddress1: false
  //     })
  //   } else if (keyModal === 2) {
  //     setAddressObj({
  //       ...addressObj,
  //       businessPurpose2: null,
  //       premiseAddress2: false
  //     })
  //   } else if (keyModal === 3) {
  //     setAddressObj({
  //       ...addressObj,
  //       businessPurpose3: null,
  //       premiseAddress3: false
  //     })
  //   } else{
  //     setAddressObj({
  //       ...addressObj,
  //       businessPurpose4: null,
  //       premiseAddress4: false
  //     })
  //   }
  // } 
  const businessPurposeReset = () => {
    setTiObj({
      ...tiObj,
      taxAddress: null
    })
    const key = `businessPurpose${keyModal}`;
    const premiseKey = `premiseAddress${keyModal}`;
  
    setAddressObj({
      ...addressObj,
      [key]: null,
      [premiseKey]: false
    });
  }
  
  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    const newData = [...addressTable];

    const dataValue = {
      ...formValue,
      tempId: `TEMP${keyModal}`,
      addressId: null,
      fullAddress: fullAddress.toUpperCase(),
      key: keyModal,
      overview: `Address ${keyModal}`,
      primaryFlag: keyModal === 1 ? true : false,
    };

    // replace if value undefined to be null
    const outputObject = {};
    for (const key in dataValue) {
      if (dataValue.hasOwnProperty(key)) {
        if (typeof dataValue[key] === "undefined") {
          outputObject[key] = null;
        } else {
          outputObject[key] = dataValue[key];
        }
      }
    }

    newData[keyModal - 1] = outputObject;
    handleContactChangesByAddress(keyModal, newData)
    setAddressTable(newData);
    setModalCreateAddress(false);
    setInputAddress({
      countryId: null,
      provinceId: null,
      cityId: null,
      districtId: null,
      subDistrictId: null,
      postalCodeId: null,
    })
    formAddress.resetFields();
    setTiObj({
      taxAddress: null
    })
  };

  // Handle Function Maps
  const onMapClick = useCallback(
    (event) => {
      setSelectedLocationCreateNew({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    },
    [selectedLocationCreateNew]
  );

  const handleInputChange = (value, name) => {
    setCombinedText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const checkAlreadyPremise = (id) => {
  //   const premiseKey = `premiseAddress${id}`;
  //   const businessPurposeKey = `businessPurpose${id}`;
  //   const addressIndex = id - 1;
  //   if (id >= 1 && id <= 4) {
  //     if (addressObj[premiseKey] === null || addressObj[premiseKey] === false) {
  //       dispatch(checkIsPremiseAlready({
  //         premiseFlag: true,
  //         addressId: addressTable[addressIndex].addressId
  //       }))
  //         .unwrap()
  //         .then(async (data) => {
  //           const updatedKey = `premiseAddress${id}`;
  //           if(data.success === true){
  //             setAddressObj({
  //               ...addressObj,
  //               [updatedKey]: true,
  //               [businessPurposeKey]: [...addressObj?.businessPurposeKey, 166]
  //             });
  //           }else{
  //             setAddressObj({
  //               ...addressObj,
  //               [updatedKey]: false,
  //             });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     } else {
  //       const updatedKey = `premiseAddress${id}`;
  //       setAddressObj({
  //         ...addressObj,
  //         [updatedKey]: false
  //       });
  //     }
  //   }
  // };

  const RenderMaps = useMemo(() => {
    if (hasValue(selectedMaps)) {
      if (selectedMaps?.toLowerCase() === 'google maps') {
        return <Maps keyword={fullAddress} setSelectedLocationFront={setSelectedLocationCreateNew} />
      }
    } else {
      return <></>
    }
  }, [fullAddress, selectedMaps]);

  return (
    <div>
      <span className="text-primary uppercase font-bold mt-[60px]">
        ADDRESS 1 (PRIMARY ADDRESS)
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Address 1"}
          name={"address1"}
          getValueFromEvent={(e) => handleAddressObj(e, "address1")}
          rules={[
            {
              required: true,
              message: "Please input your Address!",
            },
          ]}
          valuePropName={addressTable?.map((a) => a.fullAddress)[0]}
        >
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                disabled={true}
                value={addressTable?.map((a) => a.fullAddress)[0]}
              />
              <Button
                type="primary"
                onClick={() => {
                  setKeyModal(1);
                  setModalChooseAddress(true);
                }}
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>
        <Form.Item
          label={"Business Purpose"}
          name={"businessPurpose1"}
          getValueFromEvent={(e) => handleAddressObj(e, "businessPurpose1")}
          rules={[
            {
              required: true,
              message: "Please input your Business Purpose!",
            },
          ]}
        >
          <SelectComponent
            mode="multiple"
            disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
          >
            {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Premise Address"}
          name={"premiseAddress1"}
          valuePropName={addressObj?.premiseAddress1}
          getValueFromEvent={(e) => handleAddressObj(e, "premiseAddress1")}
        >
          <Checkbox
            // onChange={()=>checkAlreadyPremise(1)}
            checked={addressObj?.premiseAddress1}
            disabled={!addressTable?.map((a) => a.overview)[0] ? true : false}
          >
            Check premise address if this address will be the place where the
            product is installed/applied
          </Checkbox>
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        ADDRESS 2
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Address 2"}
          name={"address2"}
          getValueFromEvent={(e) => handleAddressObj(e, "address2")}
          valuePropName={addressTable?.map((a) => a.fullAddress)[1]}
        >
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                value={addressTable?.map((a) => a.fullAddress)[1]}
                // disabled={
                //   !addressTable?.map((a) => a.overview)[0] ? true : false
                // }
                disabled={true}
              />
              <Button
                type="primary"
                onClick={() => {
                  setKeyModal(2);
                  setModalChooseAddress(true);
                }}
                disabled={
                  !addressTable?.map((a) => a.overview)[0] ? true : false
                }
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>
        <Form.Item
          label={"Business Purpose"}
          name={"businessPurpose2"}
          getValueFromEvent={(e) => handleAddressObj(e, "businessPurpose2")}
          rules={[
            {
              required: validateAddress(2),
              message: "Please input your Business Purpose!",
            },
          ]}
        >
          <SelectComponent
            mode="multiple"
            disabled={!addressTable?.map((a) => a.overview)[1] ? true : false}
          >
            {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Premise Address"}
          name={"premiseAddress2"}
          getValueFromEvent={(e) => handleAddressObj(e, "premiseAddress2")}
          valuePropName={addressObj?.premiseAddress2}
        >
          <Checkbox
            // onChange={()=>checkAlreadyPremise(2)}
            checked={addressObj?.premiseAddress2}
            disabled={!addressTable?.map((a) => a.overview)[1] ? true : false}
          >
            Check premise address if this address will be the place where the
            product is installed/applied
          </Checkbox>
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        ADDRESS 3
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Address 3"}
          name={"address3"}
          getValueFromEvent={(e) => handleAddressObj(e, "address3")}
          valuePropName={addressTable?.map((a) => a.fullAddress)[2]}
        >
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                value={addressTable?.map((a) => a.fullAddress)[2]}
                // disabled={
                //   !addressTable?.map((a) => a.overview)[1] ? true : false
                // }
                disabled={true}
              />
              <Button
                type="primary"
                onClick={() => {
                  setKeyModal(3);
                  setModalChooseAddress(true);
                }}
                disabled={
                  !addressTable?.map((a) => a.overview)[1] ? true : false
                }
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>
        <Form.Item
          label={"Business Purpose"}
          name={"businessPurpose3"}
          getValueFromEvent={(e) => handleAddressObj(e, "businessPurpose3")}
          rules={[
            {
              required: validateAddress(3),
              message: "Please input your Business Purpose!",
            },
          ]}
        >
          <SelectComponent
            mode="multiple"
            disabled={!addressTable?.map((a) => a.overview)[2] ? true : false}
          >
            {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Premise Address"}
          name={"premiseAddress3"}
          getValueFromEvent={(e) => handleAddressObj(e, "premiseAddress3")}
          valuePropName={addressObj?.premiseAddress3}
        >
          <Checkbox
            // onChange={()=>checkAlreadyPremise(3)}
            checked={addressObj?.premiseAddress3}
            disabled={!addressTable?.map((a) => a.overview)[2] ? true : false}
          >
            Check premise address if this address will be the place where the
            product is installed/applied
          </Checkbox>
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold mt-[60px]">
        ADDRESS 4
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Address 4"}
          name={"address4"}
          getValueFromEvent={(e) => handleAddressObj(e, "address4")}
          valuePropName={addressTable?.map((a) => a.fullAddress)[3]}
        >
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                value={addressTable?.map((a) => a.fullAddress)[3]}
                // disabled={
                //   !addressTable?.map((a) => a.overview)[2] ? true : false
                // }
                disabled={true}
              />
              <Button
                type="primary"
                onClick={() => {
                  setKeyModal(4);
                  setModalChooseAddress(true);
                }}
                disabled={
                  !addressTable?.map((a) => a.overview)[2] ? true : false
                }
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>
        <Form.Item
          label={"Business Purpose"}
          name={"businessPurpose4"}
          getValueFromEvent={(e) => handleAddressObj(e, "businessPurpose4")}
          rules={[
            {
              required: validateAddress(4),
              message: "Please input your Business Purpose!",
            },
          ]}
        >
          <SelectComponent
            mode="multiple"
            disabled={!addressTable?.map((a) => a.overview)[3] ? true : false}
          >
            {dataBusinessPurpose &&
              dataBusinessPurpose?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Premise Address"}
          name={"premiseAddress4"}
          getValueFromEvent={(e) => handleAddressObj(e, "premiseAddress4")}
          valuePropName={addressObj?.premiseAddress4}
        >
          <Checkbox
            // onChange={()=>checkAlreadyPremise(4)}
            checked={addressObj?.premiseAddress4}
            disabled={!addressTable?.map((a) => a.overview)[3] ? true : false}
          >
            Check premise address if this address will be the place where the
            product is installed/applied
          </Checkbox>
        </Form.Item>
      </div>

      {/* Modal Choose Address */}
      {modalChooseAddress ? 
        <ModalCustom
          isOpen={modalChooseAddress}
          type="confirmation"
          header={"Choose Address"}
          width={1200}
          handleCancel={handleCancelModalChooseAddress}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={handleCancelModalChooseAddress}
              >
                Cancel
              </ButtonComponent>
            </div>
          }
        >
          <span className="text-primary uppercase font-bold">
            ADDRESS INFORMATION
          </span>

          <div className="w-full flex justify-end my-[30px]">
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                setModalChooseAddress(false);
                setModalCreateAddress(true);
              }}
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
            >
              Create
            </ButtonComponent>
          </div>

          <div className="w-full">
            <TablePagination
              loading={loading}
              dataSource={dataSource}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSort}
              totalData={data_address?.page?.totalElements}
              tableScrolled={{
                x: 4000,
                y: 300,
              }}
            />
          </div>
        </ModalCustom> : 
        null
      }

      {/* Modal Create Address */}
      {modalCreateAddress ? 
        <ModalCustom
          isOpen={modalCreateAddress}
          type="confirmation"
          header="CREATE ADDRESS"
          width={1000}
          handleOk={() => handleAdd()}
          handleCancel={() => {
            formAddress.resetFields();
            setModalCreateAddress(false);
            setModalChooseAddress(true);
            setInputAddress({
              countryId: null,
              provinceId: null,
              cityId: null,
              districtId: null,
              subDistrictId: null,
              postalCodeId: null,
            })
          }}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    formAddress.resetFields();
                    setModalCreateAddress(false);
                    setModalChooseAddress(true);
                    setInputAddress({
                      countryId: null,
                      provinceId: null,
                      cityId: null,
                      districtId: null,
                      subDistrictId: null,
                      postalCodeId: null,
                    })
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  form={"formAddress"}
                >
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          }
        >
          <Form
            layout="vertical"
            form={formAddress}
            onFinish={handleAdd}
            id={"formAddress"}
            onValuesChange={(changedValues, allValues) => {
              formAddress.setFieldsValue(changedValues);
            }}
          >
            <span className="text-primary uppercase font-bold">
              ADDRESS INFORMATION
            </span>

            <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
              <Form.Item
                label="Country"
                name="countryId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Country!",
                  },
                ]}
                getValueFromEvent={handleOnChangeCountry}
              >
                <SelectComponent>
                  {data_country?.data &&
                    data_country?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="Province"
                name="provinceId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Province!",
                  },
                ]}
                getValueFromEvent={handleOnChangeProvince}
              >
                <SelectComponent
                  disabled={!inputAddress?.countryId ? true : false}
                >
                  {data_province?.data &&
                    data_province?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="City"
                name="cityId"
                rules={[
                  {
                    required: true,
                    message: "Please input your City!",
                  },
                ]}
                getValueFromEvent={handleOnChangeCity}
              >
                <SelectComponent
                  disabled={
                    !inputAddress?.provinceId ? true : false
                  }
                >
                  {data_city?.data &&
                    data_city?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="District"
                name="districtId"
                rules={[
                  {
                    required: true,
                    message: "Please input your District!",
                  },
                ]}
                getValueFromEvent={handleOnChangeDistrict}
              >
                <SelectComponent
                  disabled={!inputAddress?.cityId  ? true : false}
                >
                  {data_district?.data &&
                    data_district?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="Sub District"
                name="subDistrictId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sub District!",
                  },
                ]}
                getValueFromEvent={handleOnChangeSubDistrict}
              >
                <SelectComponent
                  disabled={
                    !inputAddress?.districtId ? true : false
                  }
                >
                  {data_subDistrict?.data &&
                    data_subDistrict?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="Postal Code"
                name="postalCodeId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Postal Code!",
                  },
                ]}
              >
                <SelectComponent
                  disabled={
                    !inputAddress?.subDistrictId ? true : false
                  }
                >
                  {data_postalCode?.data &&
                    data_postalCode?.data?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item label="Building" name="building">
                <InputComponent
                  onChange={(e) => handleInputChange(e.target.value, "building")}
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item label="Floor" name="floor">
                <InputComponent
                  onChange={(e) => handleInputChange(e.target.value, "floor")}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                />
              </Form.Item>
              <Form.Item label="House Name" name="houseName">
                <InputComponent
                  onChange={(e) =>
                    handleInputChange(e.target.value, "houseNumber")
                  }
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item
                label="Street Name"
                name="streetName"
                rules={[
                  {
                    required: true,
                    message: "Please input your Street Name!",
                  },
                ]}
              >
                <InputComponent
                  onChange={(e) =>
                    handleInputChange(e.target.value, "streetName")
                  }
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item label="Block" name="block">
                <InputComponent
                  onChange={(e) => handleInputChange(e.target.value, "block")}
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item label="House Number" name="houseNumber">
                <InputComponent
                  onChange={(e) =>
                    handleInputChange(e.target.value, "houseNumber")
                  }
                  onInput={onInputUpperCase}
                />
              </Form.Item>
              <Form.Item label="RT" name="rt">
                <InputComponent
                  maxLength={3}
                  onChange={(e) => handleInputChange(e.target.value, "rt")}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                />
              </Form.Item>
              <Form.Item label="RW" name="rw">
                <InputComponent
                  maxLength={3}
                  onChange={(e) => handleInputChange(e.target.value, "rw")}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                />
              </Form.Item>
              <Form.Item
                label="Type"
                name="typeId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Type!",
                  },
                ]}
              >
                <SelectComponent>
                  {data_type &&
                    data_type?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item label="Additional Note" name="additionalNote">
                <InputComponent
                  onChange={(e) =>
                    handleInputChange(e.target.value, "additionalNote")
                  }
                  onInput={onInputUpperCase}
                />
              </Form.Item>

              <div className="col-span-3">
                <Form.Item
                  label={"Description"}
                  name={"desc"}
                  className={"w-full"}
                >
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>

              <div className="col-span-3">
                <p>
                  Address <span className="font-bold text-red-600">*</span>
                </p>
                <p>{(fullAddress || "").toUpperCase()}</p>
              </div>
            </div>

            <span className="text-primary uppercase font-bold">
              ADDRESS COORDINATE
            </span>

            <div className="w-full grid grid-cols-4 gap-2 pt-[30px]">
              <Form.Item
                label="Source"
                name="source"
                rules={[
                  {
                    required: true,
                    message: "Please input your Source",
                  },
                ]}
              >
                <SelectComponent onChange={e => setSelectedMaps(e)}>
                  {/* {data_productName &&
                    data_productName?.map((data) => (
                      <Select.Option key={data.id} value={data.id}>
                        {data.name}
                      </Select.Option>
                    ))} */}
                  <Select.Option key={1} value={"Google Maps"}>
                    Google Maps
                  </Select.Option>
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label="longitude"
                name="longitude"
                rules={[
                  {
                    required: true,
                    message: "Please input longitude on maps!",
                  },
                ]}
              >
                <InputComponent disabled />
              </Form.Item>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  {
                    required: true,
                    message: "Please input latitude on maps!",
                  },
                ]}
              >
                <InputComponent disabled />
              </Form.Item>
              <Form.Item label="Altitude" name="altitude">
                <InputComponent disabled />
              </Form.Item>
            </div>
            <div className={"w-full grid grid-cols-1 gap-2"}>
              <span className="text-primary">Pinpoint address coordinate</span>
              <div className="w-full">
                {RenderMaps}
              </div>
            </div>

{/*             
            <div className={"w-full grid grid-cols-1 gap-2"}>
              <span className="text-primary">Pinpoint address coordinate</span>
              <div className="w-full">
                <GoogleMapsCustom
                  zoom={13}
                  selectedLocation={selectedLocationCreateNew}
                  onMapClick={onMapClick}
                />
              </div>
            </div> */}
          </Form>
        </ModalCustom> : 
        null
      }
    </div>
  );
};

export default AddressForm;
