import {
  Form,
  Input,
  InputNumber,
  Pagination,
  Select,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getColumnSearchProps } from "../../../../../../../utils/getColumnSearchProps";
import { getColumnSearchPropsCriteria } from "../../../../../ProductAndPromo/Pricing/columnTableCriteria";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { useSelector } from "react-redux";
import InputComponent from "../../../../../../../components/InputComponent";

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
  editDetail = true,
  type,
  dataTable = [],
  updateTable = () => {},
}) => {
  const searchInput = useRef(null);
  const [formTable] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [editingKey, setEditingKey] = useState("");

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [editDataRecord, setEditDataRecord] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const {
    dataListTosAttribute = [],
    dataListUnitTos = [],
    dataListFromItem = [],
  } = useSelector((state) => state.tosSubmission);
  useEffect(() => {
    if (dataTable.length > 0) {
      setTotalElement(dataTable.length);
    }
  }, [dataTable]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
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
  const filteredData = () => {
    let result = [...dataTable];
    if (searchedColumn) {
      const tempSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        switch (searchedColumn) {
          case "attribute":
          case "unit":
          case "fromItem":
            return item[searchedColumn]?.label
              .toLowerCase()
              .includes(tempSearchText);
          default:
            return item[searchedColumn]
              ?.toString()
              .toLowerCase()
              .includes(tempSearchText);
        }
      });
    }
    const handleSort = (obj) => {
      switch (fieldSort) {
        case "attribute":
        case "unit":
        case "fromItem":
          return obj[fieldSort]?.label.toString().toLowerCase();
        default:
          return obj[fieldSort]?.toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleSort(a);
        let fb = handleSort(b);

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
    setStatusAction("edit");
    formTable.setFieldsValue(record);
    setEditingKey(record.key);
  };
  const cancel = (record) => {
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
      formTable.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRow = (record) => {
    updateTable((prevState) =>
      prevState.filter((item) => item.key !== record.key),
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
        sorter: true,
        dataIndex: "attribute",
        options: [],
        inputType: "select",
        disabled: true,
        required: { required: true, message: "Please input your" },
        ...getColumnSearchPropsCriteria(
          "attribute",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "VALUE",
        width: 240,
        sorter: true,
        dataIndex: "value",
        inputType: "number",
        align: "right",
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) => <span>{text?.toString()}</span>,
      },
      {
        title: "UNIT",
        width: 240,
        sorter: true,
        dataIndex: "unit",
        options: dataListUnitTos,
        inputType: "select",
        dependDataIndex: "attribute",
        ...getColumnSearchPropsCriteria(
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "FROM ITEM",
        width: 240,
        sorter: true,
        dataIndex: "fromItem",
        options: dataListFromItem,
        inputType: "select",
        ...getColumnSearchPropsCriteria(
          "fromItem",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
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
                <Tooltip title="Edit">
                  <span
                    className={`flex justify-center${
                      !editDetail
                        ? record?.attribute?.label === "Configurable"
                          ? " cursor-not-allowed"
                          : ""
                        : ""
                    }`}
                    onClick={
                      editDetail
                        ? record?.attribute?.label !== "Configurable"
                          ? () => edit(record)
                          : undefined
                        : undefined
                    }
                  >
                    <SVGIcon
                      name="IconEdit"
                      color={
                        editDetail
                          ? record?.attribute?.label !== "Configurable"
                            ? "#ACC424"
                            : "#8D91A0"
                          : "#8D91A0"
                      }
                      width={24}
                    />
                  </span>
                </Tooltip>
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

  return (
    <div className="flex flex-col w-full gap-4">
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

        <Pagination
          total={totalElements}
          className={"pr-1"}
          showSizeChanger
          current={page}
          pageSize={pageSize}
          onChange={handleChangeSize}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`
          }
        />
      </div>
      <Form form={formTable} component={false}>
        <Table
          dataSource={filteredData()}
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
            })),
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          scroll={{
            x: 1500,
            y: 300,
          }}
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={onSort}
        />
      </Form>
    </div>
  );
};

export default TableDetailTos;
