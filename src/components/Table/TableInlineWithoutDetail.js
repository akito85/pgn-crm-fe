import React, { useState } from "react";
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
import moment from "moment";
import BaseContainer from "../BaseContainer";
import ButtonComponent from "../ButtonComponent";
import {
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import SVGIcon from "../../assets/Icon/index";
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
  ...restProps
}) => {
  // const [form] = Form.useForm();
  // const [visiblePassword, setVisiblePassword] = useState(false);
  const key = record?.key || 0;
  const encrypt = record?.encrypt;
  const defaultRule = required
    ? [
        {
          ...required,
          message: `${required.message} ${dataIndex}!`,
        },
      ]
    : undefined;
  const validationForm =
    inputType === "input_regex"
      ? [
          {
            ...required,
            message: `${required.message} ${dataIndex}!`,
          },
          regex,
        ]
      : defaultRule;
  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "text":
        return <InputComponent />;
      case "input_regex":
        return (
          <Input
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
        return <InputNumber type={"number"} />;
      case "select":
        return (
          <Select>
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
        return <DatePicker format={"YYYY-MM-DD"} />;
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      default:
        return <InputComponent />;
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
          rules={inputType !== "checkbox" ? validationForm : undefined}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableInlineWithoutDetail = (props) => {
  const {
    onDataChange,
    cols,
    tableData,
    mode,
    onDetail,
    onInactive,
    header,
    regex,
    required,
    useDynamicAction = false,
    action,
    useSelect = false,
    usePagination = false,
    onChangePage = () => {},
    onSizeChanger = () => {},
    pageSize,
    current,
    totalData,
    showCreateButton = true,
    scrollTable = {},
  } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [statusAction, setStatusAction] = useState("");

  useEffect(() => {
    if (mode === "update") {
      setData(
        tableData?.map((row, index) => ({ ...row, key: index.toString() })),
      );
    }
  }, [mode, tableData]);
  const edit = (record, field) => {
    setStatusAction("edit");
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = (key) => {
    if (statusAction === "add") {
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      onDataChange(newData);
    }
    setEditingKey("");
    setStoredData(false);
    setStatusAction("");
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
    setStatusAction("add");
    const newRow = {
      key: (data.length + 1).toString(),
      status: "ACTIVE",
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
      align: "center",
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          <div className="w-full flex justify-center gap-4 mt-1 items-start">
            {useDynamicAction ? (
              action(record, editable)
            ) : editable ? (
              <>
                <ButtonComponent
                  onClick={() => cancel(record.key)}
                  type="default"
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <>
                <Tooltip title={"Update"}>
                  <div
                    onClick={() => edit(record)}
                    disabled={editingKey !== ""}
                  >
                    <SVGIcon name="IconEdit" width={24} />
                  </div>
                </Tooltip>
                <Tooltip
                  title={
                    record?.status === "ACTIVE" ? "Inactivate" : "Activate"
                  }
                >
                  <div border={false} onClick={() => onInactive(record)}>
                    <Checkbox
                      className="action-checkbox"
                      checked={record.status === "ACTIVE" ? true : false}
                    />
                  </div>
                </Tooltip>
                {/* {record.status === "ACTIVE" || record.status === "INACTIVE" ? ( */}
                <Tooltip title={"Delete"}>
                  {record.id ? (
                    <div disabled border={false}>
                      <SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />
                    </div>
                  ) : (
                    <div
                      onClick={() => deleteRow(record.key)}
                      disabled={editingKey !== ""}
                      border={false}
                    >
                      <SVGIcon name="IconDelete" width={24} />
                    </div>
                  )}
                </Tooltip>
              </>
            )}
          </div>
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

  return (
    <BaseContainer header={header}>
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
          <div className={"w-full flex mb-5 gap-2 justify-between"}>
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
                total={totalData}
                className={"pr-1"}
                showSizeChanger
                current={current}
                pageSize={pageSize}
                onChange={onChangePage}
                onShowSizeChange={onSizeChanger}
                showTotal={(total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} records`
                }
              />
            ) : null}
          </div>
        ) : null}
        <Form form={form} component={false}>
          <Table
            dataSource={data}
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
                }),
              })),
            )}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scrollTable}
            pagination={false}
          />
        </Form>
      </div>
    </BaseContainer>
  );
};

export default TableInlineWithoutDetail;
