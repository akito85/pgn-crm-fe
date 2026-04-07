import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Form,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { columnsTableCriteria } from "./TableCriteriaPayment";
import {
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getCustomer,
  getCustomerSegment,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
} from "../../../../../../redux/slices/receipt_collection/bankSlice";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import Highlighter from "react-highlight-words";
import DateComponent from "../../../../../../components/DateComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import InputComponent from "../../../../../../components/InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  dependDataIndex,
  required,
  disableDate,
  dataEditRecord,
  formTableCriteria,
  endDateHeader,
  handleEditDataRecord = () => { },
  ...restProps
}) => {
  const dispatch = useDispatch();
  const key = record?.key || 0;

  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    return rules.length !== 0 ? rules : undefined;
  };

  //validasi endate
  const endDateValidator = (startDate) => (_, value) => {
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(value);

    if ((value && momentStartDate <= momentEndDate) || !value) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("End Date must be after Start Date"));
    }
  };
  const handleDisableDate = (current) => {
    if (dataIndex === "endDate") {
      return (
        current &&
        (current < moment(formTableCriteria.getFieldValue("startDate")) ||
          (endDateHeader
            ? current >= moment(endDateHeader).add(1, "days")
            : false))
      );
    } else {
      return current && current < moment().add(-1, "days");
    }
  };

  const handleDisableEndDate = (current) => {
    if (formTableCriteria.getFieldValue().startDate !== null) {
      return (
        moment(formTableCriteria.getFieldValue().startDate) > current ||
        moment(formTableCriteria.getFieldValue().startDate) > current
      );
    }
    return moment().add(-1, "days") >= current;
  };

  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            labelInValue
            disabled={dependDataIndex ? !dataDepend : false}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "date":
        return (
          <DatePicker
            format={"YYYY-MM-DD"}
            disabledDate={handleDisableDate}
            style={{ width: "100%" }}
          />
        );
      case "startDate":
        return <DateComponent />;
      case "endDate":
        return (
          <DateComponent
            disabled={formTableCriteria.getFieldValue().startDate === null}
            dateDisable={handleDisableEndDate}
          />
        );
      default:
        return <InputComponent />;
    }
  };

  const inputNode = getInputNode(inputType);

  if (
    dataIndex === "operation" ||
    dataIndex === "no" ||
    dataIndex === "status"
  ) {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          valuePropName={"value"}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
          rules={
            inputType !== "endDate"
              ? rules()
              : [
                {
                  validator: (_, value) =>
                    endDateValidator(
                      formTableCriteria.getFieldValue().startDate
                    )(_, value),
                },
              ]
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const FunctionalTableCriteriaPayment = ({
  type,
  data = [],
  dataCriteria = [],
  disableDate,
  updateData = () => { },
  storedData = false,
  setStoredData = () => { },
  endDateHeader,
  required,
  status,
  statusApproval,
  showAction,
  setIsEditing = () => { },
}) => {
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  // const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  // const [storedData, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const [search, setSearch] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [dataHistory, setDataHistory] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [totalData, setTotalData] = useState(0);

  // Selector
  const {
    data_budget,
    data_province,
    data_city,
    data_industrial_sector,
    data_district,
    data_sub_district,
    data_account_Category,
    data_service_type,
    data_account_group,
    data_sor,
    data_cost_center,
    data_Gsizes,
    data_customerSegment,
    data_customer,
  } = useSelector((state) => state.bank);

  // Declaration
  const dispatch = useDispatch();

  // Data Select Criteria
  const budget = (data_budget || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const province = (data_province || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const city = (data_city || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const industrialSector = (data_industrial_sector || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const district = (data_district || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const subDistrict = (data_sub_district || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const accountCategory = (data_account_Category || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const serviceType = (data_service_type || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const accountGroup = (data_account_group || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const sor = (data_sor || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });
  const costCenter = (data_cost_center || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });
  const gsizes = (data_Gsizes || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });
  const customerSegment = (data_customerSegment || []).map((item) => {
    return {
      value: item.Id,
      label: item.text,
    };
  });

  const customer = (data_customer || []).map((item) => {
    return {
      value: item.Id,
      label: item.name,
    };
  });

  const listOption = {
    budget,
    province,
    city,
    district,
    subDistrict,
    industrialSector,
    accountCategory,
    accountGroup,
    serviceType,
    sor,
    costCenter,
    gsizes,
    customerSegment,
    customer,
  };

  // useEffect
  useEffect(() => {
    if (type !== "detail") {
      dispatch(getBudgetList());
      dispatch(getProvinceList());
      dispatch(getIndustrialSectorList());
      dispatch(getAccountCategoryList());
      dispatch(getServiceTypeList());
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getGsizesList());
      dispatch(getCustomerSegment());
      dispatch(getCustomer());
    }
  }, [type]);

  useEffect(() => {
    if (data.length > 0) {
      setTotalElement(data.length);
    }
  }, [data]);

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: data,
      };
    });
    if (index === `province`) {
      dispatch(getCityList(data?.value));
      formTableCriteria.resetFields(["city", "district", "subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "city"]: undefined,
          [key + "district"]: undefined,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `city`) {
      dispatch(getDistrictList(data?.value));
      formTableCriteria.resetFields(["district", "subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "district"]: undefined,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `district`) {
      dispatch(getSubDistrictList(data?.value));
      formTableCriteria.resetFields(["subDistrict"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "subDistrict"]: undefined,
        };
      });
    }
    if (index === `customerSegment`) {
      dispatch(getAccountGroupList(data?.value));
      formTableCriteria.resetFields(["accountGroup"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroup"]: undefined,
        };
      });
    }
    return data;
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

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
    let result = [...data];
    const columnCriteria = columnsTableCriteria(
      listOption,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ).map((item) => item.dataIndex);
    if (searchedColumn) {
      const tempSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (columnCriteria.includes(searchedColumn)) {
          return item[searchedColumn]?.label
            .toLowerCase()
            .includes(tempSearchText);
        } else {
          switch (searchedColumn) {
            case "startDate":
            case "endDate":
              const date = item[searchedColumn]
                ? moment(item[searchedColumn]).format("DD MMM YYYY")
                : "";
              return date?.toLowerCase().includes(tempSearchText);
            default:
              return item[searchedColumn]
                ?.toLowerCase()
                .includes(tempSearchText);
          }
        }
      });
    }
    const handleDataSort = (obj) => {
      if (columnCriteria.includes(fieldSort)) {
        return obj[fieldSort]?.label.toLowerCase();
      } else {
        switch (fieldSort) {
          case "startDate":
          case "endDate":
            const date = obj[fieldSort]
              ? moment(obj[fieldSort]).format("DD MMM YYYY")
              : "";
            return date?.toLowerCase();
          default:
            return obj[fieldSort]?.toLowerCase();
        }
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

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    setIsEditing(true);
    formTableCriteria.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: record.endDate ? moment(record.endDate) : undefined,
    });
    const { key, ...extraProps } = record || {};
    const tempValue = { ...extraProps };
    for (const attribute in tempValue) {
      if (Object.hasOwnProperty.call(tempValue, attribute)) {
        const tempData = tempValue[attribute];
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [`${key}${attribute}`]: tempData,
          };
        });
      }
    }
    setEditingKey(record.key);
    if (record?.province && record?.province?.value) {
      dispatch(getCityList(record?.province?.value));
    }
    if (record?.city && record?.city?.value) {
      dispatch(getDistrictList(record?.city?.value));
    }
    if (record?.district && record?.district?.value) {
      dispatch(getSubDistrictList(record?.district?.value));
    }
    if (record?.customerSegment && record?.customerSegment?.value) {
      dispatch(getAccountGroupList(record?.customerSegment?.value));
    }
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
  };

  const save = async (key) => {
    try {
      const row = await formTableCriteria.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const dataExist = item?.type;
        let flag;
        if (dataExist !== "exist" && type === "update") {
          flag = 1;
        }
        if (dataExist === "exist" && type === "update") {
          flag = 2;
        }
        const updatedRow = { ...item, ...row, flag };
        newData.splice(index, 1, updatedRow);
        updateData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      setStatusAction("");
      formTableCriteria.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTableCriteria.resetFields();
    setStoredData(true);
    setIsEditing(true);
    setStatusAction("add");
    const newRow = {
      key: data
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    updateData((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  const renderDelete = (record) => {
    // return record.status === "ACTIVE" || record.status === "INACTIVE" ? (
    return record.id ? (
      <ButtonComponent
        disabled
        icon={<SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />}
        border={false}
      />
    ) : (
      <ButtonComponent
        onClick={() => deleteRow(record.key)}
        disabled={editingKey !== ""}
        icon={
          <SVGIcon name="IconDelete" width={24} />
          // <DeleteOutlined style={{ fontSize: "24px", color: "#c81912" }} />
        }
        border={false}
      />
    );
  };

  // Functional Handle Detail
  const handleDetail = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.id,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
    setDataHistory({});
  };

  const columns = () => {
    const temp = [
      {
        key: "no",
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },

      ...columnsTableCriteria(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      {
        key: "startDate",
        title: "START DATE",
        required: true,
        width: 240,
        align: "center",
        dataIndex: "startDate",
        sorter: true,
        inputType: "date",
        ...getColumnSearchProps(
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "startDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || "";
          }
        },
      },
      {
        key: "endDate",
        title: "END DATE",
        width: 240,
        align: "center",
        dataIndex: "endDate",
        sorter: true,
        inputType: "date",
        disableDate: true,
        ...getColumnSearchProps(
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "endDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || "";
          }
        },
      },
      {
        key: "operation",
        title: "ACTION",
        dataIndex: "operation",
        width: 240,
        align: "center",
        fixed: "right",
        render: (_, record) => {
          const editable = record.key === editingKey;
          const isDelete =
            (status === "DRAFT" && statusApproval === "DRAFT") ||
            record.type !== "exist";

          return (
            <Space className="my-3 gap-2">
              {editable ? (
                <>
                  <ButtonComponent
                    onClick={() => cancel(record)}
                    type="default"
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => save(record.key)}
                    type="submit"
                  >
                    Save
                  </ButtonComponent>
                </>
              ) : (
                <div className="flex w-full justify-center gap-4">
                  {showAction === "show" ? (
                    <Tooltip title="Detail">
                      <div className="pt-1">
                        <SVGIcon
                          name="IconDetail"
                          width={24}
                          onClick={() => handleDetail(record)}
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <div>
                          <SVGIcon
                            name="IconEdit"
                            color={editingKey ? "#8D91A0" : "#ACC424"}
                            className={
                              editingKey ? "cursor-not-allowed" : undefined
                            }
                            width={24}
                            onClick={
                              !editingKey ? () => edit(record) : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <div>
                          <SVGIcon
                            name="IconDelete"
                            color={
                              isDelete && !editingKey ? "#D90000" : "#8D91A0"
                            }
                            width={24}
                            className={
                              isDelete && !editingKey
                                ? undefined
                                : "disabled cursor-not-allowed"
                            }
                            onClick={
                              isDelete && !editingKey
                                ? () => deleteRow(record)
                                : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                    </>
                  )}
                </div>
              )}
            </Space>
          );
        },
      },
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol.filter((col) =>
      col.title !== "NO" &&
        col.title !== "ACTION" &&
        col.title !== "START DATE" &&
        col.title !== "END DATE"
        ? dataCriteria.some((v) => Number(v) === col.indexValue)
        : true
    );
  };
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  const numColumns = 16;
  const numRows = columns().length;

  const maxWidth = 10000;
  const maxHeight = 300;

  const x = numColumns * 10;
  const y = numRows * 150;

  const validatedX = Math.min(x, maxWidth);
  const validatedY = Math.min(y, maxHeight);

  const scroll = {
    x: validatedX,
    y: validatedY,
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  // const filteredData = () => {
  //   let result = [...data];
  //   const columnCriteria = columnsTableCriteria(
  //     listOption,
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch
  //   );
  //   if (searchedColumn) {
  //     const tempSearchText = searchText.toLowerCase();
  //     result = result.filter((item) => {
  //       if (columnCriteria.includes(searchedColumn)) {
  //         return item[searchedColumn]?.label
  //           .toLowerCase()
  //           .includes(tempSearchText);
  //       } else {
  //         switch (searchedColumn) {
  //           case "startDate":
  //           case "endDate":
  //             const date = item[searchedColumn]
  //               ? moment(item[searchedColumn]).format("DD MMM YYYY")
  //               : "";
  //             return date?.toLowerCase().includes(tempSearchText);
  //           default:
  //             return item[searchedColumn]
  //               ?.toLowerCase()
  //               .includes(tempSearchText);
  //         }
  //       }
  //     });
  //   }
  //   const handleDataSort = (obj) => {
  //     if (columnCriteria.includes(fieldSort)) {
  //       return obj[fieldSort]?.label.toLowerCase();
  //     } else {
  //       switch (fieldSort) {
  //         case "startDate":
  //         case "endDate":
  //           const date = obj[fieldSort]
  //             ? moment(obj[fieldSort]).format("DD MMM YYYY")
  //             : "";
  //           return date?.toLowerCase();
  //         default:
  //           return obj[fieldSort]?.toLowerCase();
  //       }
  //     }
  //   };
  //   if (fieldSort) {
  //     result.sort((a, b) => {
  //       let fa = handleDataSort(a);
  //       let fb = handleDataSort(b);
  //       if (fa < fb) {
  //         return orderSort === "asc" ? -1 : 1;
  //       }
  //       if (fa > fb) {
  //         return orderSort === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return result.slice((page - 1) * pageSize, page * pageSize);
  // };
  return dataCriteria && dataCriteria.length > 0 && Number(dataCriteria[0]) !== 24 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && type !== "preview" && type !== "show" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
            disabled={editingKey !== "" ? true : false}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <div className={"w-full flex justify-between"}>
        <Select
          mode="multiple"
          placeholder="Show All Column"
          className={"w-2/6"}
          maxTagCount={3}
          onChange={handleDisplayColumn}
        >
          {columns()
            .map((col) => (
              <Select.Option
                key={col.title}
                value={col.title}
                disabled={
                  optionSelectedCol.length > 3
                    ? optionSelectedCol.includes(col.title)
                      ? false
                      : true
                    : false
                }
              >
                {col.title}
              </Select.Option>
            ))
            .splice(1)}
        </Select>

        {/* <Pagination
          total={totalElements}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        /> */}
      </div>
      <Form form={formTableCriteria} component={false}>
        <div className="w-full">
          <Table
            bordered
            dataSource={filterDataByPage()}
            columns={filterColumn(
              columns().map((col) => ({
                ...col,
                onCell: (record) => ({
                  record,
                  inputType: col.inputType,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  editing: isEditing(record),
                  options: col.option,
                  indexValue: col.indexValue,
                  dependDataIndex: col.dependDataIndex,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  disableDate,
                  formTableCriteria: formTableCriteria,
                  endDateHeader: endDateHeader,
                  required: col.required,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChange,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scroll}
            onChange={onChange}
          />
        </div>
      </Form>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="CRITERIA INFORMATION"
        width={900}
        footer={
          <ButtonComponent type={"default"} onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistory.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
    </div>
  ) : null;
};

export default FunctionalTableCriteriaPayment;
