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
        return <InputNumber />;
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

const TableInlineCopied = (props) => {
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
        tableData?.map((row, index) => ({ ...row, key: index.toString() })),
      );
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
  };

  const columns = [
    ...cols,
    {
      title: "ACTIONS",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          <div className="flex w-full justify-center my-3 gap-2">
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
              <>
                <Popover
                  content={
                    <div>
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
                      <div className="flex justify-center">
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
                      </div>
                    </div>
                  }
                  trigger={"click"}
                  placement="bottomRight"
                >
                  <ButtonComponent
                    // onClick={() => handleEditRow(record)}
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
          </div>
        );
      },
    },
  ];

  return (
    <BaseContainer header={header}>
      <div className="w-full flex flex-col gap-4">
        <div className={"w-full flex justify-end"}>
          <ButtonComponent
            onClick={storedDate === false && addRow}
            type={"submit"}
            border={false}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create
          </ButtonComponent>
        </div>
        <Form form={form} component={false}>
          <Table
            dataSource={data}
            columns={columns.map((col) => ({
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
            }))}
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
          />
        </Form>
      </div>
    </BaseContainer>
  );
};

export default TableInlineCopied;
