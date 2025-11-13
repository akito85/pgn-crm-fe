import {
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  columnsTableCriteria,
  getColumnSearchPropsCriteria,
} from "./columnTableCriteriaPriceAdjust";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountCategoryList,
  getAccountGroupList,
  getBudgetList,
  getCityList,
  getCostCenterList,
  getDistrictList,
  getGsizesList,
  getIndustrialSectorList,
  getProvinceList,
  getServiceTypeList,
  getSorList,
  getSubDistrictList,
  getCustomerSegmentList,
  // getAdjustmentType,
  getCustomerList,
  getAdjustmentTypeList,
} from "../../../../redux/slices/product_promo/pricingAdjust";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";
import InputComponent from "../../../../components/InputComponent";

const { TextArea } = Input;

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "adjustmentType":
      return record[dataIndex]?.label.toLowerCase().includes(fixSearchText);
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date?.toLowerCase().includes(fixSearchText);
    default:
      return record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(fixSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "adjustmentType":
        return obj[fieldSort]?.label.toLowerCase();
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date?.toLowerCase();
      default:
        return obj[fieldSort]?.toString().toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options = [],
  dependDataIndex,
  dataEditRecord,
  handleEditDataRecord = () => {},
  form,
  required,
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

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

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    if (dataIndex === "endDate") {
      return current && current < moment(form?.getFieldValue("startDate"));
    } else {
      return current && current < moment().add(-1, "days");
    }
  };

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={dependDataIndex ? !dataDepend : false}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "textarea":
        return <TextArea rows={1} maxLength={255} />;
      case "date":
        return (
          <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} />
        );
      case "number":
        return (
          <NumericFormat allowNegative={false} className="text-right w-full" />
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
            textAlign: "left",
          }}
          valuePropName={"value"}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
          }
          rules={rules()}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const PricingAdjustTableDetail = ({
  type,
  data = [],
  dataCriteria = [],
  updateData = () => {},
  forType = "priceAdjust",
  storedData = false,
  setStoredData = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [formTableCriteria] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  useEffect(() => {
    if (type !== "detail" && type !== "preview") {
      dispatch(getBudgetList());
      dispatch(getProvinceList());
      dispatch(getIndustrialSectorList());
      dispatch(getAccountCategoryList());
      dispatch(getServiceTypeList());
      dispatch(getSorList());
      dispatch(getCostCenterList());
      dispatch(getGsizesList());
      dispatch(getCustomerSegmentList());
      dispatch(getAdjustmentTypeList());
      dispatch(getCustomerList());
    }
  }, [dispatch, type]);

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
    data_customer_segment,
    data_customer,
    data_adjustment_type,
  } = useSelector((state) => state.pricingAdjust);

  const listOption = {
    budget: data_budget,
    province: data_province,
    city: data_city,
    district: data_district,
    subDistrict: data_sub_district,
    industrialSector: data_industrial_sector,
    accountCategory: data_account_Category,
    accountGroup: data_account_group,
    serviceType: data_service_type,
    sor: data_sor,
    costCenter: data_cost_center,
    gsizes: data_Gsizes,
    customerSegment: data_customer_segment,
    customer: data_customer,
  };

  const handleEditDataRecord = (data, key, index) => {
    const keyName = key + index;
    const value =
      index === "description" || index === "adjustmentValue"
        ? data.target.value
        : data;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === `provinceId`) {
      dispatch(getCityList(data?.value));
      formTableCriteria.resetFields(["cityId", "districtId", "subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "cityId"]: undefined,
          [key + "districtId"]: undefined,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `cityId`) {
      dispatch(getDistrictList(data?.value));
      formTableCriteria.resetFields(["districtId", "subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "districtId"]: undefined,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `districtId`) {
      dispatch(getSubDistrictList(data?.value));
      formTableCriteria.resetFields(["subDistrictId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "subDistrictId"]: undefined,
        };
      });
    }
    if (index === `customerSegmentId`) {
      dispatch(getAccountGroupList(data?.value));
      formTableCriteria.resetFields(["accountGroupId"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "accountGroupId"]: undefined,
        };
      });
    }
    return value;
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
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

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTableCriteria.setFieldsValue(record);
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
    if (record?.provinceId && record?.provinceId?.value) {
      dispatch(getCityList(record?.provinceId?.value));
    }
    if (record?.cityId && record?.cityId?.value) {
      dispatch(getDistrictList(record?.cityId?.value));
    }
    if (record?.districtId && record?.districtId?.value) {
      dispatch(getSubDistrictList(record?.districtId?.value));
    }
    if (record?.customerSegmentId && record?.customerSegmentId?.value) {
      dispatch(getAccountGroupList(record?.customerSegmentId?.value));
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
        const updatedRow = { ...item, ...row };
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

  const columns = () => {
    const criteriaField = [
      ...columnsTableCriteria(
        listOption,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    ];

    const temp = [
      {
        title: "NO",
        width: 50,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      ...(forType === "priceAdjust"
        ? criteriaField
        : [
            {
              title: "CRITERIA",
              children: criteriaField,
            },
          ]),
      {
        title: "ADJUSTMENT TYPE",
        width: 320,
        dataIndex: "adjustmentType",
        onFilter: (value, record) => onFilter("adjustmentType", value, record),
        sorter: (a, b) => sorter("adjustmentType", a, b),
        inputType: "select",
        require: true,
        option: data_adjustment_type,
        ...getColumnSearchPropsCriteria(
          "adjustmentType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "ADJUSTMENT VALUE",
        width: 320,
        dataIndex: "adjustmentValue",
        onFilter: (value, record) => onFilter("adjustmentValue", value, record),
        sorter: (a, b) => sorter("adjustmentValue", a, b),
        inputType: "number",
        align: "right",
        require: true,
        ...getColumnSearchPropsPaging(
          "adjustmentValue",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "START DATE",
        width: 240,
        align: "center",
        dataIndex: "startDate",
        onFilter: (value, record) => onFilter("startDate", value, record),
        sorter: (a, b) => sorter("startDate", a, b),
        inputType: "date",
        require: true,
        ...getColumnSearchPropsPaging(
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
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
            return text;
          }
        },
      },
      {
        title: "END DATE",
        width: 240,
        align: "center",
        dataIndex: "endDate",
        onFilter: (value, record) => onFilter("endDate", value, record),
        sorter: (a, b) => sorter("endDate", a, b),
        inputType: "date",
        ...getColumnSearchPropsPaging(
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
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
            return text;
          }
        },
      },
      {
        title: "DESCRIPTION",
        width: 240,
        inputType: "textarea",
        dataIndex: "description",
        onFilter: (value, record) => onFilter("description", value, record),
        sorter: (a, b) => sorter("description", a, b),
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        ellipsis: {
          showTitle: false,
        },
        render: (text) => {
          if (searchedColumn === "description") {
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
        title: "ACTION",
        fixed: "right",
        width: 240,
        dataIndex: "operation",
        render: (_, record) => {
          const editable = record.key === editingKey;
          return (
            <div className="flex w-full justify-center my-3 gap-2">
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
                <>
                  <Tooltip title="Edit">
                    <div
                      className={`flex justify-center${
                        editingKey ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      className={`flex justify-center${
                        record.typeData === "exist" ? " cursor-not-allowed" : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.typeData !== "exist" ? "#D90000" : "#8D91A0"
                        }
                        width={24}
                        className={
                          record.typeData === "exist" ? "disabled" : undefined
                        }
                        onClick={
                          record.typeData !== "exist"
                            ? () => deleteRow(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
      },
    ];
    const listWhitelistColumn = [
      "NO",
      "ADJUSTMENT TYPE",
      "ADJUSTMENT VALUE",
      "START DATE",
      "END DATE",
      "DESCRIPTION",
      "ACTION",
    ];
    const filterCol =
      type !== "detail" ? temp : temp.filter((col) => col.title !== "ACTION");
    return filterCol
      .filter((col) => {
        if (forType === "priceAdjust") {
          return !listWhitelistColumn.includes(col.title)
            ? dataCriteria.includes(col.indexValue)
            : true;
        } else {
          return true;
        }
      })
      .map((dataFix) => {
        if (forType === "priceAdjust") {
          return dataFix;
        } else {
          if (dataFix.title === "CRITERIA") {
            return {
              ...dataFix,
              children: dataFix.children?.filter((crit) =>
                dataCriteria.includes(crit.indexValue)
              ),
            };
          } else {
            return dataFix;
          }
        }
      });
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

  const filteredData = (typeData = "data") => {
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
        if (
          columnCriteria.includes(searchedColumn) ||
          searchedColumn === "adjustmentType"
        ) {
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
      if (
        columnCriteria.includes(fieldSort) ||
        searchedColumn === "adjustmentType"
      ) {
        return obj[fieldSort]?.label.toString().toLowerCase();
      } else {
        switch (fieldSort) {
          case "startDate":
          case "endDate":
            const date = obj[fieldSort]
              ? moment(obj[fieldSort]).format("DD MMM YYYY")
              : "";
            return date.toString().toLowerCase();
          default:
            return obj[fieldSort]?.toString().toLowerCase();
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
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length);
  };

  return dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24 ? (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <div className={"relative flex flex-col w-full"}>
        <div
          className={`${
            totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
          } w-1/4 flex`}
        >
          <Select
            mode="multiple"
            placeholder="Show All Column"
            className={"w-full"}
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
        </div>
        <Form form={formTableCriteria} component={false}>
          <Table
            dataSource={data}
            columns={filterColumn(
              columns().map((col) => ({
                ...col,
                onCell: (record) => ({
                  record,
                  required: col.require,
                  inputType: col.inputType,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  editing: isEditing(record),
                  options: col.option,
                  indexValue: col.indexValue,
                  dependDataIndex: col.dependDataIndex,
                  dataEditRecord: editDataRecord,
                  handleEditDataRecord: handleEditDataRecord,
                  form: formTableCriteria,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChangeSize,
              className: "pr-1 w-3/4",
              style: { marginLeft: "auto", marginRight: 0 },
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`,
            }}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            scroll={{ y: 300, x: 1500 }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            onChange={onChange}
          />
        </Form>
      </div>
    </div>
  ) : null;
};

export default PricingAdjustTableDetail;
