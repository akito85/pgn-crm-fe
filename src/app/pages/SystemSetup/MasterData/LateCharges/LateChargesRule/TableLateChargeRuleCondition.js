import { Form, Input, message, Select, Table, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDataTypeConditionList,
  getOperatorConditionList,
  getVariableNameList,
} from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { NumericFormat } from "react-number-format";
import InputComponent from "../../../../../../components/InputComponent";
import { formMessageRequired } from "../../../../../../utils";

export const getColumnSearchPropsCriteria = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (data) => {
      const label = data?.label || "";
      if (searchedColumn === dataIndex) {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={label ? label.toString() : ""}
          />
        );
      } else {
        return label || "";
      }
    },
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "name":
    case "operator":
    case "dataType":
      return record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
    default:
      return record[dataIndex]?.toLowerCase().includes(tempSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "name":
      case "operator":
      case "dataType":
        return obj[fieldSort]?.label?.toLowerCase();
      default:
        return obj[fieldSort]?.toLowerCase();
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
  required,
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  dataRules,
  onInput,
  handleEditDataRecord = () => { },
  isDoubleValues,
  dataTable,
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

  const checkDuplicate = (isDuplicate) => (_, value) => {
    if (isDuplicate) {
      return Promise?.reject(new Error(`Name and Operator can't be same`))
    } else {
      return Promise?.resolve()
    }
  }

  const rules = () => {
    let rule = [];
    if (required) {
      // Check if dataIndex is either 'name' or 'operator'
      if (dataIndex === 'name' || dataIndex === 'operator') {
        rule.push({
          ...required,
          message: `${required.message} ${title}!`,
          validator: (field, value) => {
            checkDuplicate(isDoubleValues)(field, value)
          }
        });
      } else {
        rule.push({
          ...required,
          message: `${required.message} ${title}!`,
        });
      }
    }
    return rule;
  };


  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  // const fixOptions =
  //   dataIndex === "operator" &&
  //   [2, 4].includes(dataEditRecord[key + "dataType"]?.value)
  //     ? options.filter((item) => item.value === 269)
  //     : options;

  // const dependentData = () => {
  //   if (fixOptions.length === 0) {
  //     return true;
  //   }
  //   return !dataDepend;
  // };


  let maxLength =
    dataIndex === "value" && dataEditRecord[key + "dataType"]?.value === 4
      ? 1
      : 255;

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
          // disabled={dependDataIndex ? dependentData() : false}
          >
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputComponent
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
          />
        );
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      case "input_value":
        if (dataEditRecord[key + "name"]?.value == 1169 || dataEditRecord[key + "name"]?.value == 200) {
          return (
            <InputComponent type="number" />
          );
        } else {
          return (
            <InputComponent
              decimalScale={4}
              thousandSeparator={","}
              decimalSeparator={"."}
              type="numeric"
              disabled={
                dataIndex === "value" &&
                (dataEditRecord[key + "type"]?.label || "") === "VARIABLE"
              }
            />
          );
        }
      // <InputComponent
      //   onInput={(e) =>
      //     onInput(dataEditRecord[key + "dataType"]?.value || 2, e)
      //   }
      //   maxLength={maxLength}
      //   disabled={dependDataIndex ? !dataDepend : false}
      // />

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
          rules={dataRules}
          getValueFromEvent={(value) =>
            handleEditDataRecord(value, key, dataIndex)
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

const renderRules = (rule) => {
  if (rule === 3) {
    return [
      { pattern: /^\d+$/, message: "value only number" },
      {
        max: 255,
        message: `Your input not valid. Max length 255`,
      },
    ];
  } else if (rule === 4) {
    return [
      { pattern: /[YyNn]/, message: "Please enter with Y/N" },
      {
        max: 1,
        message: `Your input not valid. Max length 1`,
      },
    ];
  } else {
    return [
      { pattern: /^[^\s]+$/, message: "Username contains space" },
      {
        max: 255,
        message: `Your input not valid. Max length 255`,
      },
    ];
  }
};

const renderOnInput = (type, e) => {
  if (type === 3) {
    return (e.target.value = e.target.value.replace(/\D/g, ""));
  } else if (type === 4) {
    return (e.target.value = e.target.value.replace(/[^YyNn]/g, ""));
  } else {
    return e.target.value;
  }
};

const TableLateChargeRuleCondition = ({
  dataTable = [],
  updateTable = () => { },
  dataLateChargeRule = {},
  storedData = false,
  setStoredData = () => { },
  type = "detail",
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [totalData, setTotalData] = useState(0);
  const [isDoubleValues, setisDoubleValues] = useState(false);
  const {
    variableNameList = [],
    operationConditionList = [],
    dataTypeConditionList = [],
  } = useSelector((state) => state.late_charge);
  const stateFormTable = useMemo(
    () =>
      (type === "update" && dataLateChargeRule.status === "ACTIVE") ||
      type === "detail" ||
      type === "preview",
    [type, dataLateChargeRule]
  );


  useEffect(() => {
    setTotalData(dataTable.length);
  }, [dataTable]);

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
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleEditDataRecord = (data, key, index) => {
    const tempNameSelect = editDataRecord[key + "name"]?.value || '';
    const keyName = key + index;
    let value = index === "value" ? data.floatValue : data;
    if (
      index == "value" && (
        tempNameSelect == 1169 ||
        tempNameSelect == 200
      )
    ) {
      value = data.target.value;
    } else if (
      index == "value" && (
        tempNameSelect === 215 ||
        tempNameSelect === 216 ||
        tempNameSelect === 217 ||
        tempNameSelect === 218 ||
        tempNameSelect === 219
      )
    ) {
      value = data.floatValue;
    }
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === `name`) {
      formTable.resetFields(["value"]);
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "value"]: undefined,
        };
      });
    }
    return value;
  };

  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTable.setFieldsValue(record);
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
  };

  const deleteRow = (record) => {
    updateTable((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
    setStoredData(false);
  };

  const cancel = (record) => {
    setisDoubleValues(false)
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };

  const checkDuplicateData = useCallback((dataTable, row) => {
    if (dataTable?.filter(item => item?.name?.value === row?.name?.value && item?.operator?.value === row?.operator?.value)?.length > 0) {
      setisDoubleValues(true)
      return true
    } else {
      setisDoubleValues(false)
      return false
    }
  }, [])


  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...dataTable];
      const duplicated = checkDuplicateData(newData, row)
      const index = newData.findIndex((item) => key === item.key);
      if (duplicated === false) {
        if (index > -1) {
          const item = newData[index];
          const updatedRow = {
            ...item,
            ...row,
          };
          newData.splice(index, 1, updatedRow);
          updateTable(newData);
          setEditingKey("");
        }
        setStoredData(false);
        setStatusAction("");
        formTable.resetFields();
      } else {
        formTable.setFields([
          {
            name: 'name',
            errors: [`Duplicate data found. Name and Operator can't be same`],
          },
          {
            name: 'operator',
            errors: [`Duplicate data found. Name and Operator can't be same`],
          },
        ]);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    setisDoubleValues(false)
    formTable.resetFields();
    setStoredData(true);
    setStatusAction("add");
    const newRow = {
      key: dataTable
        .reduce((current, next) => {
          const nextKey = next.key || 0;
          return current > nextKey
            ? parseInt(current) + 1
            : parseInt(nextKey) + 1;
        }, 1)
        .toString(),
    };
    updateTable((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NAME",
        width: 240,
        dataIndex: "name",
        onFilter: (value, record) => onFilter("name", value, record),
        sorter: (a, b) => sorter("name", a, b),
        options: variableNameList,
        inputType: "select",
        // required: { required: true, message: "Please input your" },
        rules: [
          {
            message: isDoubleValues ? `Name and Operator can't be same` : `Please input your Name!`,
            required: true,
          },
        ],
        ...getColumnSearchPropsCriteria(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      // {
      //   title: "DATA TYPE",
      //   width: 240,
      //   dataIndex: "dataType",
      //   onFilter: (value, record) => onFilter("dataType", value, record),
      //   sorter: (a, b) => sorter("dataType", a, b),
      //   options: dataTypeConditionList,
      //   inputType: "select",
      //   required: { required: true, message: "Please input your" },
      //   ...getColumnSearchPropsCriteria(
      //     "dataType",
      //     searchInput,
      //     searchedColumn,
      //     searchText,
      //     handleSearch
      //   ),
      // },
      {
        title: "OPERATOR",
        width: 240,
        dataIndex: "operator",
        onFilter: (value, record) => onFilter("operator", value, record),
        sorter: (a, b) => sorter("operator", a, b),
        options: operationConditionList,
        inputType: "select",
        rules: [
          {
            message: `Please input your Operator!`,
            required: true,
          },
        ],

        // required: { required: true, message: "Please input your" },
        // dependDataIndex: "dataType",
        ...getColumnSearchPropsCriteria(
          "operator",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "VALUE",
        width: 300,
        dataIndex: "value",
        onFilter: (value, record) => onFilter("value", value, record),
        sorter: (a, b) => sorter("value", a, b),
        inputType: "input_value",
        align: "right",
        // onInput: renderOnInput,
        // rules: renderRules,
        rules: [
          {
            message: `Please input your Value!`,
            required: true,
          },
        ],
        dependDataIndex: "name",
        ...getColumnSearchPropsPaging(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (value, record) => {
          const valueCheck = typeof value === "string" ? value : parseFloat(value)
          const formating = (val) => {
            return val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            });
          }
          return (
            <span>{value ? formating(valueCheck) : ''}</span>
          )
        }
      },
      {
        title: "ACTION",
        width: 240,
        fixed: "right",
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
                      className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                        }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={editingKey ? "#8D91A0" : "#ACC424"}
                        width={24}
                        onClick={!editingKey ? () => edit(record) : undefined}
                        className={editingKey ? " disabled " : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      className={`flex justify-center${record.typeData === "exist" || editingKey ? " cursor-not-allowed" : ""
                        }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.typeData !== "exist" ? "#D90000" : "#8D91A0"
                        }
                        width={24}
                        className={
                          record.typeData === "exist" || editingKey ? " disabled " : undefined
                        }
                        onClick={
                          record.typeData !== "exist" || !editingKey
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
    return !stateFormTable
      ? temp
      : temp.filter((col) => col.title !== "ACTION");
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

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full justify-end">
        {!stateFormTable ? (
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        ) : null}
      </div>
      <div className={"relative flex flex-col w-full"}>
        <div
          className={`${totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
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
        <Form form={formTable} component={false}>
          <Table
            dataSource={dataTable}
            columns={filterColumn(
              columns().map((col) => ({
                ...col,
                onCell: (record) => ({
                  record,
                  inputType: col.inputType,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  editing: isEditing(record),
                  dependDataIndex: col.dependDataIndex,
                  urlIndex: col.url,
                  options: col.options,
                  required: col.required,
                  dataEditRecord: editDataRecord,
                  dataRules: col.rules,
                  onInput: col.onInput,
                  handleEditDataRecord: handleEditDataRecord,
                  isDoubleValues: isDoubleValues,
                  dataTable: dataTable
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
            scroll={{
              // x: 1500,
              y: 300,
            }}
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
  );
};

export default TableLateChargeRuleCondition;
