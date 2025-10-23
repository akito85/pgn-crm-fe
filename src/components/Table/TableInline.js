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
  disableDate,
  onCellClicked,
  ...restProps
}) => {
  // const [form] = Form.useForm();
  // const [visiblePassword, setVisiblePassword] = useState(false);
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
        return <InputNumber type={"number"} style={{ width: "100%" }} controls={false} />;
      case "select":
        return (
          <Select onChange={onCellClicked}>
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
          <DatePicker format={"YYYY-MM-DD"} disabledDate={handleDisableDate} style={{ width: "100%" }} />
        );
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
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
          rules={inputType !== "checkbox" ? rules() : undefined}
          className={'w-full'}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableInline = (props) => {
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
    onChangePage = () => { },
    onSizeChanger = () => { },
    pageSize,
    current,
    totalData,
    showCreateButton = true,
    scrollTable = {},
    disableDate,
  } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  useEffect(() => {
    if (mode === "update") {
      setData(
        tableData?.map((row, index) => ({ ...row, key: index.toString() }))
      );
    } else {
      setData(tableData)
    }
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
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          <Space>
            {useDynamicAction ? (
              action(record, editable)
            ) : editable ? (
              <>
                <ButtonComponent onClick={cancel} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <>
                <Popover
                  content={
                    <Space direction="vertical">
                      <ButtonComponent
                        icon={<SVGIcon name="IconDetail" width={24} />}
                        border={false}
                        onClick={() => onDetail(record?.id)}
                      >
                        <span className={"text-black"}> Detail</span>
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => edit(record)}
                        disabled={editingKey !== ""}
                        icon={<SVGIcon name="IconEdit" width={24} />}
                        border={false}
                      >
                        <span className={"text-black"}> Update</span>
                      </ButtonComponent>
                      <ButtonComponent border={false}>
                        <Checkbox
                          onClick={() => onInactive(record?.id)}
                          checked={record.status === "ACTIVE" ? true : false}
                        >
                          <span
                            className={"text-black normal-case text-[18px]"}
                          >
                            {record?.status}
                          </span>
                        </Checkbox>
                      </ButtonComponent>
                    </Space>
                  }
                  trigger={"click"}
                  placement="bottomRight"
                >
                  <ButtonComponent
                    icon={<MoreOutlined style={{ fontSize: "24px" }} />}
                    border={false}
                  />
                </Popover>
                {record.status === "ACTIVE" || record.status === "INACTIVE" ? (
                  <ButtonComponent
                    disabled
                    icon={
                      <DeleteOutlined
                        style={{ fontSize: "24px", color: "#8D91A0" }}
                      />
                    }
                    border={false}
                  />
                ) : (
                  <ButtonComponent
                    onClick={() => deleteRow(record.key)}
                    disabled={editingKey !== ""}
                    icon={<DeleteOutlined style={{ fontSize: "24px" }} />}
                    border={false}
                  />
                )}
              </>
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
              columns.map((col) => {
                return {
                  ...col,
                  onCell: (record) => ({
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    options: col.options,
                    onCellClicked: col.onClick,
                    showPassword: visiblePassword,
                    handlePassword: handleVisiblePassword,
                    regex: regex,
                    required: required,
                    disableDate,
                  }),
                }
              })
            )}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scrollTable}
            tableLayout="fixed"
            bordered

          />
        </Form>
      </div>
    </BaseContainer>
  );
};

export default TableInline;
