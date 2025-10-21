import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tooltip, Input, DatePicker, Spin } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../../components/BaseContainer";
import TablePagination from "../../../../../../../components/TablePagination";
import {
  getBusinessPurpose,
  getCity,
  getCountry,
  getDistrict,
  getPostalCode,
  getProvince,
  getSubDistrict,
  getType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const AddressOverview = ({
  addressTable = [],
  setAddressTable,
  form,
  type,
  setAddressObj,
  handleContactChangesByAddress = () => {},
}) => {
  // Selector
  const {
    loading,
    data_country,
    data_province,
    data_city,
    data_district,
    data_subDistrict,
    data_postalCode,
    data_type,
    data_businessPurpose,
  } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const dataSource = addressTable;
  const dispatch = useDispatch();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const [province, setProvince] = useState(0);
  const [city, setCity] = useState(0);
  const [district, setDistrict] = useState(0);
  const [subDistrict, setSubDistrict] = useState(0);
  const [postalCode, setPostalCode] = useState(0);
  const [dataPostalCode, setDataPostalCode] = useState([]);
  const [dataSubDistrict, setDataSubDistrict] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataRenderValue, setDataRenderValue] = useState([]);
  // console.log(subDistrict, "subDistrict");

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
      dataSource.map((item, index) => {
        dispatch(getProvince(item.countryId));
        dispatch(getCity(item.provinceId));
        dispatch(getDistrict(item.cityId));
        dispatch(getSubDistrict(item.districtId));
        dispatch(getPostalCode(item.subDistrictId));
      });
    }
  }, [dataSource]);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getType());
    dispatch(getBusinessPurpose());
    // dispatch(getCountry());
  }, []);

  // useEffect(() => {
  //   if (province !== 0) {
  //     dispatch(getProvince(province));
  //   }
  //   if (city !== 0) {
  //     dispatch(getCity(city));
  //   }
  //   if (district !== 0) {
  //     dispatch(getDistrict(district));
  //   }
  //   if (subDistrict !== 0) {
  //     dispatch(getSubDistrict(subDistrict));
  //   }
  //   if (postalCode !== 0) {
  //     dispatch(getPostalCode(postalCode));
  //   }
  // }, [dispatch, province, city, district, subDistrict, postalCode]);

  useEffect(() => {
    if (data_postalCode?.data?.length > 0) {
      setDataPostalCode((prevState) => {
        const newData = data_postalCode?.data || [];
        const uniqueIds = new Set(prevState.map((item) => item.id));

        const uniqueData = [
          ...prevState,
          ...newData.filter((item) => !uniqueIds.has(item.id)),
        ];

        return uniqueData;
      });
    }
    if (data_subDistrict?.data?.length > 0) {
      setDataSubDistrict((prevState) => {
        const newData = data_subDistrict?.data || [];
        const uniqueIds = new Set(prevState.map((item) => item.id));

        const uniqueData = [
          ...prevState,
          ...newData.filter((item) => !uniqueIds.has(item.id)),
        ];

        return uniqueData;
      });
    }
    if (data_district?.data?.length > 0) {
      setDataDistrict((prevState) => {
        const newData = data_district?.data || [];
        const uniqueIds = new Set(prevState.map((item) => item.id));

        const uniqueData = [
          ...prevState,
          ...newData.filter((item) => !uniqueIds.has(item.id)),
        ];

        return uniqueData;
      });
    }
    if (data_city?.data?.length > 0) {
      setDataCity((prevState) => {
        const newData = data_city?.data || [];
        const uniqueIds = new Set(prevState.map((item) => item.id));

        const uniqueData = [
          ...prevState,
          ...newData.filter((item) => !uniqueIds.has(item.id)),
        ];

        return uniqueData;
      });
    }
  }, [data_postalCode, data_subDistrict, data_district, data_city]);

  // Search Column
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
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    // {
    //   title: "OVERVIEW",
    //   dataIndex: "overview",
    //   sorter: true,
    //   ...getColumnSearchProps("overview"),
    //   render: (overview) => (
    //     <span className="uppercase">{overview}</span>
    //   ),
    // },
    {
      sorter: true,
      title: "FULL ADDRESS",
      dataIndex: "fullAddress",
      width: 700,
      ...getColumnSearchProps("fullAddress"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "fullAddress") {
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
      title: "TYPE",
      dataIndex: "typeId",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("typeId"),
      render: (typeId) => {
        if (typeof typeId !== "string") {
          const name = data_type
            ?.filter((a) => a.id === typeId)
            ?.find((b) => b.name)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{typeId}</span>;
        }
      },
    },
    {
      title: "ADDITIONAL NOTE",
      dataIndex: "additionalNote",
      sorter: true,
      ...getColumnSearchProps("additionalNote"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "additionalNote" ? (
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
      align: "left",
      ...getColumnSearchProps("houseNumber"),
    },
    {
      title: "RT",
      dataIndex: "rt",
      sorter: true,
      align: "right",
      ...getColumnSearchProps("rt"),
    },
    {
      title: "RW",
      dataIndex: "rw",
      sorter: true,
      align: "right",
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
      align: "right",
      ...getColumnSearchProps("floor"),
    },
    {
      title: "SUBDISTRICT",
      dataIndex: "subDistrictId",
      sorter: true,
      ...getColumnSearchProps("subDistrictId"),
      render: (v, r, i) => {
        if (typeof r.subDistrictId !== "string") {
          setPostalCode(r.subDistrictId);

          const name = dataSubDistrict
            ?.filter((a) => a.id === r.subDistrictId)
            ?.find((b) => b.id === r.subDistrictId)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{r.subDistrictId}</span>;
        }
      },
    },
    {
      title: "DISTRICT",
      dataIndex: "districtId",
      sorter: true,
      ...getColumnSearchProps("districtId"),
      ellipsis: {
        showTitle: false,
      },
      render: (v, r, i) => {
        let name;
        if (typeof r.districtId !== "string") {
          setDistrict(r.districtId);

          name = dataDistrict
            ?.filter((a) => a.id === r.districtId)
            ?.find((b) => b.id === r.districtId)?.name;
        }
        if (searchedColumn === "districtId") {
          return (
            <Tooltip placement="topLeft" title={name}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={name ? name.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (name) {
            return (
              <Tooltip placement="topLeft" title={name}>
                {name}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "CITY",
      dataIndex: "cityId",
      sorter: true,
      ...getColumnSearchProps("cityId"),
      render: (v, r, i) => {
        if (typeof r.cityId !== "string") {
          setDistrict(r.cityId);

          const name = dataCity
            ?.filter((a) => a.id === r.cityId)
            ?.find((b) => b.id === r.cityId)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{r.cityId}</span>;
        }
      },
    },
    {
      title: "PROVINCE",
      dataIndex: "provinceId",
      sorter: true,
      ...getColumnSearchProps("provinceId"),
      render: (provinceId) => {
        if (typeof provinceId !== "string") {
          setCity(provinceId);

          const name = data_province?.data
            ?.filter((a) => a.id === provinceId)
            ?.find((b) => b.name)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{provinceId}</span>;
        }
      },
    },
    {
      title: "POSTAL CODE",
      dataIndex: "postalCodeId",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("postalCodeId"),
      render: (v, r, i) => {
        if (typeof r.postalCodeId !== "string") {
          const name = dataPostalCode
            ?.filter((a) => a.id === r.postalCodeId)
            ?.find((b) => b.id === r.postalCodeId)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{r.postalCodeId}</span>;
        }
      },
    },
    {
      title: "COUNTRY",
      dataIndex: "countryId",
      sorter: true,
      ...getColumnSearchProps("countryId"),
      render: (countryId) => {
        if (typeof countryId !== "string") {
          setProvince(countryId);
          const name = data_country?.data
            ?.filter((a) => a.id === countryId)
            ?.find((b) => b.name)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          // console.log(typeof countryId, "tes2");
          return <span>{countryId}</span>;
        }
      },
    },
    {
      title: "BUSINESS PURPOSE",
      dataIndex: "businessPurpose",
      sorter: true,
      // align: "center",
      ...getColumnSearchProps("businessPurpose"),
      render: (businessPurpose) => {
        const matchedData = [];
        if (businessPurpose?.length > 0) {
          for (const id of businessPurpose) {
            const match = data_businessPurpose?.find((item) => item.id === id);
            if (match) {
              matchedData.push(match);
            }
          }
        }

        const matchedNames = matchedData
          ?.map((obj) => obj.name)
          ?.reduce((current, next) => current + `, ${next}`, "");

        return <span>{matchedNames?.slice(2) || ""}</span>;
      },
    },
    {
      title: "PREMISE",
      dataIndex: "premiseFlag",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("premiseFlag"),
      render: (premiseFlag) => (
        <span className="uppercase ">
          {premiseFlag === true ? "Yes" : "No"}
        </span>
      ),
    },
    {
      sorter: true,
      title: "DESCRIPTION",
      dataIndex: "desc",
      ...getColumnSearchProps("desc"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "desc" ? (
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
      title: "ACTION",
      align: "center",
      fixed: "right",
      dataIndex: "key",
      width: 100,
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => handleDelete(r)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = () => {
    let result = [...(dataSource || [])];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleDelete = useCallback(
    (r) => {
      handleContactChangesByAddress(
        r.key,
        addressTable.filter((e) => e.key !== r.key),
        (type = "delete"),
      );
      setAddressTable((prevState) => prevState.filter((e) => e.key !== r.key));
      const resetField = addressTable.filter((a) => a.key === r.key);

      for (let i = 1; i <= 4; i++) {
        if (resetField[0].key === i) {
          setAddressTable((prevState) => {
            let tempTable = prevState.filter((e) => e.key !== r.key);

            const updatedObj = {};

            tempTable.forEach((item, index) => {
              updatedObj[`premiseAddress${index + 1}`] = item.premiseFlag;
              updatedObj[`businessPurpose${index + 1}`] = [
                ...item.businessPurpose,
              ];
            });

            setAddressObj((prevState) => ({
              ...prevState,
              ...updatedObj,
              [`premiseAddress${tempTable.length + 1}`]: false,
              [`businessPurpose${tempTable.length + 1}`]: [],
            }));

            form.resetFields([
              `businessPurpose${tempTable.length + 1}`,
              `premiseAddress${tempTable.length + 1}`,
            ]);

            return tempTable.map((item, index) => {
              return {
                ...item,
                overview: `Address ${index + 1}`,
                tempId: item.tempId ? `TEMP${index + 1}` : null,
                key: index + 1,
              };
            });
          });
          break;
        }
      }
    },
    [addressTable],
  );

  return (
    <>
      {type === "confirmation" ? (
        <div className="w-full">
          <TablePagination
            dataSource={filterDataByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columns.filter((a) => a.dataIndex !== "key")}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 4800 }}
          />
        </div>
      ) : (
        <Spin spinning={loading}>
          <BaseContainer header={"Account Address Overview"}>
            <div className="w-full">
              <TablePagination
                dataSource={filterDataByPage()}
                totalData={totalElements}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                columns={columns}
                onSort={onSort}
                tableScrolled={{ y: 525, x: 4800 }}
              />
            </div>
          </BaseContainer>
        </Spin>
      )}
    </>
  );
};

export default AddressOverview;
