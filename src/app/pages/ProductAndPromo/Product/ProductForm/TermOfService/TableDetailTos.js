import { Form, Input, InputNumber, Select, Table, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { getColumnSearchPropsCriteria } from "../../columnTableCriteria";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import InputComponent from "../../../../../../components/InputComponent";

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "attribute":
    case "unit":
    case "fromItem":
      return record[dataIndex]?.label.toLowerCase().includes(tempSearchText);
    default:
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(tempSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "attribute":
      case "unit":
      case "fromItem":
        return obj[fieldSort]?.label.toString().toLowerCase();
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
  required,
  disabled,
  dependDataIndex,
  dataEditRecord,
  urlIndex,
  handleEditDataRecord = () => {},
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord[key + dependDataIndex]
    : "";

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

  const defaultDisable = disabled || false;

  const filterOption = (input, option) =>
    option.props.children.toLowerCase().includes(input.toLowerCase());

  const getInputNode = (inputType) => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            labelInValue
            disabled={dependDataIndex ? !dataDepend : defaultDisable}
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
          <InputNumber
            type={"number"}
            controls={false}
            style={{
              width: "100%",
            }}
          />
        );
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
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
          rules={rules()}
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
const TableDetailTos = ({
  type,
  dispatch = () => {},
  dataTable = [],
  updateTable = () => {},
  storedData = false,
  setStoredData = () => {},
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
  const {
    dataListTosAttribute = [],
    dataListUnitTos = [],
    dataListFromItem = [],
  } = useSelector((state) => state.product);

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
    const keyName = key + index;
    const value = index === "description" ? data.target.value : data;
    setEditDataRecord((prevState) => {
      return {
        ...prevState,
        [keyName]: value,
      };
    });
    return value;
  };
  const edit = (record, field) => {
    setStoredData(true);
    setStatusAction("edit");
    formTable.setFieldsValue(record);
    setEditingKey(record.key);
  };
  const cancel = (record) => {
    setStoredData(false);
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
  };

  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...dataTable];
      const index = newData.findIndex((item) => key === item.key);
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
      setStatusAction("");
      setStoredData(false);
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRow = (record) => {
    updateTable((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
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
        title: "ATTRIBUTE",
        width: 240,
        dataIndex: "attribute",
        onFilter: (value, record) => onFilter("attribute", value, record),
        sorter: (a, b) => sorter("attribute", a, b),
        options: dataListTosAttribute,
        inputType: "select",
        disabled: true,
        required: { required: true, message: "Please input your" },
        ...getColumnSearchPropsCriteria(
          "attribute",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "VALUE",
        width: 240,
        dataIndex: "value",
        onFilter: (value, record) => onFilter("value", value, record),
        sorter: (a, b) => sorter("value", a, b),
        inputType: "number",
        align: "right",
        ...getColumnSearchPropsPaging(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          searchedColumn === "value" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text === 0 ? text.toString() : text || ""}
            />
          ) : (
            text
          ),
      },
      {
        title: "UNIT",
        width: 240,
        dataIndex: "unit",
        onFilter: (value, record) => onFilter("unit", value, record),
        sorter: (a, b) => sorter("unit", a, b),
        options: dataListUnitTos,
        inputType: "select",
        dependDataIndex: "attribute",
        ...getColumnSearchPropsCriteria(
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "FROM ITEM",
        width: 240,
        dataIndex: "fromItem",
        onFilter: (value, record) => onFilter("fromItem", value, record),
        sorter: (a, b) => sorter("fromItem", a, b),
        options: dataListFromItem,
        inputType: "select",
        ...getColumnSearchPropsCriteria(
          "fromItem",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
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
                  {/* <Tooltip title="Delete">
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
                  </Tooltip> */}
                </>
              )}
            </div>
          );
        },
      },
    ];
    return type !== "preview"
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
                indexValue: col.indexValue,
                dependDataIndex: col.dependDataIndex,
                urlIndex: col.url,
                options: col.options,
                required: col.required,
                dataEditRecord: editDataRecord,
                disabled: col.disabled,
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
            x: 1500,
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
  );
};

export default TableDetailTos;
