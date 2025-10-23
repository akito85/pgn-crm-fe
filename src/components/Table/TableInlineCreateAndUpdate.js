import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  InputNumber,
  Form,
  Select,
  Checkbox,
  Tooltip,
  DatePicker,
  Popover,
  Pagination,
  Space,
} from "antd";
import BaseContainer from "../BaseContainer";
import ButtonComponent from "../ButtonComponent";
import {
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../assets/Icon/index";
import moment from "moment";
import InputComponent from "../InputComponent";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  showPassword,
  handlePassword,
  regex,
  required,
  disableDate,
  ...restProps
}) => {
  const key = record?.key || 0;
  const encrypt = record?.encrypt;
  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        ...required,
        message: `${required.message} ${dataIndex}!`,
      });
    }
    if (inputType === "input_regex") {
      rules.push(regex);
    }
    if (inputType === "input_with_regex") {
      rules.push(regex);
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const handleDisableDate = (current) => {
    if (disableDate) {
      return disableDate(current);
    }
    return moment().add(-1, "days") >= current;
  };
  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "text":
        return (
          <Input
            style={{
              width: "100%",
            }}
          />
        );
      case "input_regex":
        return (
          <Input
            style={{
              width: "100%",
            }}
            suffix={
              <Tooltip
                title={
                  <span className={"w-1/2"}>
                    Your key must contain at least:
                    <br />
                    - No Space
                    <br />
                    - Upper case letter
                    <br />- Non-alphanumeric characters, such as !, @, #, $, %,
                    ^, &, *, etc.
                  </span>
                }
              >
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
          />
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
      case "select":
        return (
          <Select
            style={{
              width: "100%",
            }}
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "checkbox":
        return (
          <Checkbox
            className="action-checkbox"
            value={encrypt || false}
            onChange={(e) => {
              const data = {
                [key]: e.target.checked,
              };
              handlePassword(data);
            }}
          />
        );
      case "date":
        return (
          <DatePicker
            style={{
              width: "100%",
            }}
            format={"YYYY-MM-DD"}
            disabledDate={handleDisableDate}
          />
        );
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      case "input_with_regex":
        return <InputComponent />;
      default:
        return (
          <Input
            style={{
              width: "100%",
            }}
          />
        );
    }
  };
  const inputNode = getInputNode(inputType, options);

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
          valuePropName={inputType === "checkbox" ? "checked" : "value"}
          rules={inputType !== "checkbox" ? rules() : undefined}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableInlineCreateAndUpdate = (props) => {
  const {
    onDataChange,
    cols,
    tableData,
    mode,
    regex,
    required,
    useSelect = true,
    usePagination = true,
    showCreateButton = true,
    scrollTable = {},
    disableDate
  } = props;

  // Declaration
  const searchInput = useRef(null);

  // State
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [currentLog, setCurrentLog] = useState(1);
  const [sizeLog, setSizeLog] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Use Effect
  useEffect(() => {
    if (mode === "update") {
      setData(
        tableData?.map((row, index) => ({ ...row, key: index.toString() }))
      );
    }
    setData(tableData)
  }, [mode, tableData]);

  const edit = (record, field) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleVisiblePassword = (data) => {
    setVisiblePassword((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedRow = { ...item, ...row };
        newData.splice(index, 1, updatedRow);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      setStoredData(false);
      onDataChange([...newData]);
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    form.resetFields();
    setStoredData(true);
    setIsInsert(true);
    const newRow = {
      key: (data.length + 1).toString(),
    };
    setData((prevData) => [...prevData, newRow]);
    setEditingKey(newRow.key);
  };

  const deleteRow = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    onDataChange(newData);
    setStoredData(false);
  };

  const columns = [
    ...cols,
    {
      title: "ACTIONS",
      dataIndex: "operation",
      width: "12%",
      align: "center",
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          <Space className="my-3 gap-2">
            {editable ? (
              <>
                <ButtonComponent onClick={cancel} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <div className="flex w-full justify-center gap-6">
                <Tooltip title="Edit">
                  <span className="flex justify-center">
                    <SVGIcon
                      name="IconEdit"
                      width={24}
                      onClick={() => edit(record)}
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <span
                    className={`flex justify-center${
                      record.typeData === "exist" ? " cursor-not-allowed" : ""
                    }`}
                  >
                    <SVGIcon
                      name="IconDelete"
                      width={24}
                      className={
                        record.typeData === "exist" ? "disabled" : undefined
                      }
                      onClick={
                        record.typeData !== "exist"
                          ? () => deleteRow(record.key)
                          : undefined
                      }
                    />
                  </span>
                </Tooltip>
              </div>
            )}
          </Space>
        );
      },
    },
  ];

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange = (currentLog, sizeLog) => {
    setCurrentLog(currentLog);
    setSizeLog(sizeLog);
  };

  const updatePagination = (page, pageSize) => {
    return data?.slice((page - 1) * pageSize, page * pageSize);
  };

  return (
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"w-full flex justify-end"}>
        {showCreateButton && (
          <ButtonComponent
            onClick={storedDate === false && addRow}
            type={"submit"}
            border={false}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create
          </ButtonComponent>
        )}
      </div>
      {useSelect || usePagination ? (
        <div className={"w-full flex gap-2 justify-between"}>
          {useSelect ? (
            <Select
              mode="multiple"
              placeholder="Show All Column"
              className={"w-2/6"}
              maxTagCount={3}
              onChange={handleDisplayColumn}
            >
              {columns
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
          ) : null}
          {usePagination ? (
            <Pagination
              total={data?.length}
              className={"pr-1"}
              showSizeChanger
              current={currentLog}
              pageSize={sizeLog}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              showTotal={(total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} records`
              }
            />
          ) : null}
        </div>
      ) : null}
      <Form form={form} component={false}>
        <Table
          dataSource={updatePagination(currentLog, sizeLog)}
          columns={filterColumn(
            columns.map((col) => ({
              ...col,
              onCell: (record) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                options: col.options,
                showPassword: visiblePassword,
                handlePassword: handleVisiblePassword,
                regex: regex,
                required: required,
                disableDate
              }),
            }))
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          scroll={scrollTable}
          tableLayout="auto"
          bordered
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default TableInlineCreateAndUpdate;
