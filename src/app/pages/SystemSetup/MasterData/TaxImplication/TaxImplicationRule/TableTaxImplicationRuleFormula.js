import { Form, Input, Select, Table, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";

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
      const label = typeof data === "string" ? data : data?.label || "";
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
    case "operation":
    case "type":
      return record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
    case "operator":
      let value;
      if (typeof record[dataIndex] === "number") {
        value = record[dataIndex]?.toLowerCase().includes(tempSearchText);
      } else {
        value = record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
      }
      return value;
    default:
      return record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(tempSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "operation":
      case "type":
        return obj[fieldSort]?.label?.toLowerCase();
      case "operator":
        let value;
        if (typeof obj[fieldSort] === "number") {
          value = obj[fieldSort]?.toLowerCase();
        } else {
          value = obj[fieldSort]?.label?.toLowerCase();
        }
        return value;
      default:
        return obj[fieldSort]?.toString()?.toLowerCase();
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
  children,
  options = [],
  required,
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  handleEditDataRecord = () => { },
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";
  // const typeInput =
  //   dataIndex === "operator" &&
  //   (dataEditRecord[key + "conditionName"]?.label || "") === "CONSTANT"
  //     ? "-"
  //     : inputType;
  // console.log((dataEditRecord[key + "conditionName"]?.value)), "apaaannn";
  const rules = () => {
    let rule = [];
    if (required) {
      rule.push({
        ...required,
        message: `${required.message} ${title}!`,
      });
    }
    return rule.length !== 0 ? rule : undefined;
  };

  const rulesFix = rules();

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const dependentData = () => {
    if (options.length === 0) {
      return true;
    }
    return !dataDepend;
  };
  const getInputNode = (type) => {
    switch (type) {
      case "select":
        let disable = dependDataIndex ? dependentData() : false;
        // if (dataIndex === "operation" && key === "1") {
        //   disable = true;
        // }
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={
              dataIndex === "operator" &&
              ((dataEditRecord[key + "conditionName"]?.value || "") === 2245 || (dataEditRecord[key + "conditionName"]?.value || "") === 2248)
            }
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
            disabled={
              dataIndex === "value" &&
              (dataEditRecord[key + "type"]?.label || "") === "VARIABLE"
            }
          />
        );

      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;

      case "dynamic":
        if (dataEditRecord[key + "conditionName"]?.value == 2246) {
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
        } else if (dataEditRecord[key + "conditionName"]?.value == 2245) {
          return (
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              labelInValue
              align="left"
            // disabled={disable}
            >
              {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          );
        } else if (dataEditRecord[key + "conditionName"]?.value == 2248) {
          let optionDay = [];
          for (let i = 1; i <= 31; i++) {
            optionDay.push({
              value: String(i),
              label: String(i)
            });
          }
          return (
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              labelInValue
            >
              {optionDay.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )
        } else {
          return (
            <InputComponent
              decimalScale={2}
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

      default:
        return <InputComponent />;
    }
  };
  const inputNode = getInputNode(inputType);

  if (dataIndex === "action" || dataIndex === "no" || dataIndex === "status") {
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
          rules={rulesFix}
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


const TableTaxImplicationRuleFormula = ({
  dataTable = [],
  updateTable = () => { },
  dataTaxImplicationRule = {},
  storedData = false,
  setStoredData = () => { },
  type = "detail",
  dataTransactionCode = [],
  setListDataDetailOverride = () => { },
  modalFormTaxImpliRule = false,
  setModalFormTaxImpliRule = () => { },
  handleAddItemOverride = () => { },
  formInfo,
  listDataDetailOverride,
  isUpdateTable
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
  const [dataFilterImplicationType, setdataFilterImplicationType] = useState([]);
  const [dataFilterTransCode, setdataFilterTransCode] = useState([]);
  const [selectType, setSelectType] = useState(null);
  const [ddlModalTransCode, setDdlModalTransCode] = useState([]);

  const { operationConditionList = [], conditionNameList = [], dataImplicationType = [] } = useSelector(
    (state) => state.tax_implication
  );
  const stateFormTable = useMemo(
    () =>
      (type === "update" && dataTaxImplicationRule.status === "ACTIVE") ||
      type === "detail" ||
      type === "preview",
    [type, dataTaxImplicationRule]
  );
  const tempListDataDetailOverride = listDataDetailOverride.map(item => {
    return {
      implicationTypeId: item.implicationTypeId,
      transactionCode: item.transactionCode
    }
  })

  
  useEffect(() => {
    setTotalData(dataTable.length);
  }, [dataTable]);

  useEffect(() => {
    const tempDdlImpliType = dataImplicationType.filter((data) => data?.value !== dataTaxImplicationRule.implicationType)
    setdataFilterImplicationType(tempDdlImpliType)
  }, [dataTaxImplicationRule.implicationType])

  useEffect(() => {
    const tempDdlImpliCode = dataTransactionCode.filter((data) => data?.value !== dataTaxImplicationRule.transactionCode)
    setdataFilterTransCode(tempDdlImpliCode)
  }, [dataTaxImplicationRule.transactionCode])


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
    const tempConditionSelect = editDataRecord[key + "conditionName"]?.value || '';
    const keyName = key + index;
    let value = index === "value" ? data.floatValue : data;

    if ((index === "value" && tempConditionSelect === 2245) || (index === "value" && tempConditionSelect === 2248)) {
      value = data?.value;
    } else if (
      (index === "value" && tempConditionSelect === 2246) ||
      (index === "value" && tempConditionSelect === 2247) ||
      (index === "value" && tempConditionSelect === 2249)
    ) {
      value = data?.formattedValue;
    }
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    if (index === `conditionName`) {
      formTable.resetFields(["operator", "value"]);
      if (data.value === 2245 || data.value === 2248) {
        formTable.setFieldsValue({
          operator: {
            disabled: true,
            key: "269",
            label: "EQUALS",
            title: '',
            value: 269
          }
        })
      }
      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [key + "operator"]: undefined,
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
    updateTable((prevState) => {
      return prevState.filter((item) => item.key !== record.key);
    });
    setStoredData(false);
  };

  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };
  const checkDuplicateData = useCallback((dataTable, row) => {
    if (dataTable?.filter(item => item?.name?.value === row?.name?.value && item?.operator?.value === row?.operator?.value)?.length > 0) {
      // setisDoubleValues(true)
      return true
    } else {
      // setisDoubleValues(false)
      return false
    }
  }, []);

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
            name: 'conditionName',
            errors: [`Duplicate data found. Condition Name and Operator can't be same`],
          },
          {
            name: 'operator',
            errors: [`Duplicate data found. Condition Name and Operator can't be same`],
          },
        ]);
      }

    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };


  const addRow = () => {
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



  let optionBool = [
    {
      value: "Yes",
      label: "Yes"
    },
    {
      value: "No",
      label: "No"
    }
  ];

  const columns = () => {
    const temp = [
      {
        title: "NO",
        width: 90,
        dataIndex: "no",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CONDITION NAME",
        width: 240,
        dataIndex: "conditionName",
        onFilter: (value, record) => onFilter("conditionName", value, record),
        sorter: (a, b) => sorter("conditionName", a, b),
        options: conditionNameList,
        inputType: "select",
        required: { required: true, message: "Please input your" },
        ...getColumnSearchPropsCriteria(
          "conditionName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "OPERATOR",
        width: 210,
        dataIndex: "operator",
        onFilter: (value, record) => onFilter("operator", value, record),
        sorter: (a, b) => sorter("operator", a, b),
        options: operationConditionList,
        inputType: "select",
        dependDataIndex: "conditionName",
        required: { required: true, message: "Please input your" },
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
        width: 180,
        dataIndex: "value",
        onFilter: (value, record) => onFilter("value", value, record),
        sorter: (a, b) => sorter("value", a, b),
        inputType: "dynamic",
        align: "right",
        options: optionBool,
        required: { required: true, message: "Please input your" },
        dependDataIndex: "operator",
        ...getColumnSearchPropsPaging(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (value, r) => {
          return <div className={r?.conditionName?.value === 2245 ? 'text-left' : 'text-right'}>{value}</div>
        }
      },
      {
        title: "ACTION",
        width: 200,
        fixed: "right",
        dataIndex: "action",
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
                        className={editingKey ? " cursor-not-allowed" : undefined}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      className={`flex justify-center${record.typeData === "exist" || editingKey
                        ? " cursor-not-allowed"
                        : ""
                        }`}
                    >
                      <SVGIcon
                        name="IconDelete"
                        color={
                          record.typeData === "exist" || editingKey
                            ? "#8D91A0"
                            : "#D90000"
                        }
                        width={24}
                        className={
                          record.typeData === "exist" || editingKey
                            ? "disabled"
                            : undefined
                        }
                        onClick={
                          record.typeData === "exist" || editingKey
                            ? undefined
                            : () => deleteRow(record)
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

  useEffect(() => {
    const tempItem = tempListDataDetailOverride
      .filter((item) => item.implicationTypeId === selectType)

    const temp = dataFilterTransCode
      .filter((data) => !tempItem.some((item) => item.transactionCode === data.value))
    if (isUpdateTable.type) {
      setDdlModalTransCode([
        ...temp,
        ...tempItem
          ?.filter((data) => data?.transactionCode === isUpdateTable?.item?.transactionCode)
      ]);
    } else {
      setDdlModalTransCode(temp)
    }
  }, [selectType, tempListDataDetailOverride])


  return (
    <ModalCustom
      isOpen={modalFormTaxImpliRule}
      handleCancel={() => {
        setModalFormTaxImpliRule(false)
        updateTable([])
        formInfo.resetFields()
      }}
      header={"Create Tax Implication Rule Override"}
      width={1000}
      type={"confirmation"}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent
            onClick={() => !storedData && (
              setModalFormTaxImpliRule(false),
              updateTable([]),
              formInfo.resetFields()
            )}

            type="default"
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            htmlType={"submit"}
            form={"formInfo"}
          >
            Save
          </ButtonComponent>
        </div>
      }
    >
      <div className="flex flex-col w-full gap-4">
        <div className="text-primary text-xs font-bold uppercase">TAX IMPLICATION RULE OVERRIDE INFORMATION</div>
        <div>
          <Form onFinish={!storedData && handleAddItemOverride} form={formInfo} id="formInfo" layout="vertical">
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label={"Implication Type"}
                name={"implicationTypeOverride"}
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name",
                  },
                ]}
              >
                <SelectComponent onChange={setSelectType} options={dataFilterImplicationType} />
              </Form.Item>
              <Form.Item
                label={"Transaction Code"}
                name={"transactionCodeOverride"}
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name",
                  },
                ]}
              >
                <SelectComponent options={ddlModalTransCode} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Form.Item
                name={"descriptionOverride"}
                className="w-full"
                label={"Description"}
              >
                <InputComponent
                  type="textarea"
                // value={dataTaxImplicationRule.description}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
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
                    handleEditDataRecord: handleEditDataRecord,
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
    </ModalCustom>
  )
}

export default TableTaxImplicationRuleFormula