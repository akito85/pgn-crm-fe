import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Pagination,
  Popover,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import moment from "moment";
import InputComponent from "../../../../../components/InputComponent";
import { InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setDataAllocation } from "../../../../../redux/slices/receipt_collection/receipt";
import { showModalError } from "../../../../../redux/slices/general_slice";
import { hasValue } from "../../../../../utils";

// render component input table inline
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
  onInput = () => { },
  maxLength,
  form,
  rules = [],
  ...restProps
}) => {
  const key = record?.key || 0;
  const encrypt = record?.encrypt;

  // handle disable date
  const handleDisableDate = (current) => {
    if (dataIndex === "endDate") {
      return current && current < moment(form.getFieldValue("startDate"));
    } else {
      return current && current < moment().add(-1, "days");
    }
  };

  // render component input
  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "text":
        return <InputComponent onInput={onInput} maxLength={maxLength} />;
      case "input_regex":
        return (
          <InputComponent
            onInput={onInput}
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
            style={{ width: "100%" }}
            controls={false}
          />
        );
      case "select":
        return (
          <Select
            onChange={onCellClicked}
            showSearch
            optionFilterProp="children"
            allowClear
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
      case "checkbox_default":
        return <Checkbox defaultChecked={false} />;
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
            format={"YYYY-MM-DD"}
            disabledDate={handleDisableDate}
            style={{ width: "100%" }}
          />
        );
      case "input_password":
        return (
          <InputComponent
            type={showPassword[key] === true ? "password" : "text"}
            onInput={onInput}
            maxLength={maxLength}
          />
        );
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
    dataIndex === "status" ||
    dataIndex !== "allocationAmount"
  ) {
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    );
  }
  const initValue = (type) => {
    if (type === "checkbox") {
      return false;
    } else {
      return "";
    }
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          valuePropName={inputType === "checkbox" ? "checked" : "value"}
          rules={inputType !== "checkbox" ? rules : undefined}
          initialValue={initValue(inputType)}
          className={"w-full"}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableInlineAllocation = ({
  onDataChange,
  cols,
  tableData,
  mode,
  onDetail,
  onInactive,
  header,
  regex,
  // required,
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
  setOpenModal,
  actionButton,
  onSort = () => { },
  useContainer = true,
  checkInputBy,
  checkNameColumn,
  handleValidate,
  messageValidate,
  actionFix,
  setInserted = () => { },
  setRule = () => { },
  setMaxLenght = () => { },
  setUpdateSelectDataTable = () => { },
  setUpdateSelectRowKeys = () => { },
  setUpdateTotalAmount = () => { },
  rateAmount,
  type = "create",
  currency,
  onReverse = () => { },
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // use state
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [statusAction, setStatusAction] = useState("");
  const [isSame, setIsSame] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // use effect
  useEffect(() => {
    if (isInsert === true) {
      setInserted(true);
    } else {
      setInserted(false);
    }
  }, [isInsert, setInserted]);

  // useEffect(() => {
  //   if (type === "create") {
  //     if ((currency = 243)) {
  //       const totalAmount = tableData.reduce(
  //         (total, row) => total + row.allocationAmount,
  //         0
  //       );
  //       setUpdateTotalAmount(totalAmount);
  //     } else {
  //       const totalAmount = tableData.reduce(
  //         (total, row) => total + row.equivalentAmount,
  //         0
  //       );
  //       setUpdateTotalAmount(totalAmount);
  //     }
  //   } else {
  //     const totalAmount = tableData
  //       ?.filter((item) => hasValue(item?.allocationNumber) === false)
  //       .reduce((total, row) => total + row.allocationAmount, 0);
  //     setUpdateTotalAmount(totalAmount);
  //   }
  // }, [tableData, setUpdateTotalAmount, type]);

  useEffect(() => {
    if (type === "create") {
      if (currency === 244) {
        const totalAmount = tableData.reduce(
          (total, row) => total + row.allocationAmount,
          0
        );
        setUpdateTotalAmount(totalAmount);
      } else {
        const totalAmount = tableData.reduce(
          (total, row) => total + row.equivalentAmount,
          0
        );
        setUpdateTotalAmount(totalAmount);
      }
    } else {
      const totalAmount = tableData
        ?.filter((item) => hasValue(item?.allocationNumber) === false)
        .reduce((total, row) => {
          if (currency === 243) {
            return total + row.allocationAmount;
          } else {
            return total + row.equivalentAmount;
          }
        }, 0);
      setUpdateTotalAmount(totalAmount);
    }
  }, [tableData, setUpdateTotalAmount, type, currency]);

  // edit table inline
  const edit = (record, field) => {
    handleVisiblePassword(record?.encrypt);
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setStoredData(true);
    setStatusAction("edit");
    setIsInsert(true);
    setRule(record?.dataType);
    setVisiblePassword({ [record?.key]: record?.encrypt });
    if (record?.dataType === "BOOL") {
      setMaxLenght(1);
    } else {
      setMaxLenght(255);
    }
  };

  // cancel edit table inline
  const cancel = (key) => {
    if (statusAction === "add") {
      const newData = tableData.filter((item) => item.key !== key);
      onDataChange(newData);
      onDataChange(newData);
    }
    setEditingKey("");
    setStoredData(false);
    setStatusAction("");
    setIsInsert(false);
    setVisiblePassword({});
  };

  // handle save row
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      const item = newData[index];

      if (index > -1) {
        const updatedRow = {
          ...item,
          ...row,
          //   currency: item?.convertedCurrency === "USD" ? "USD" : "IDR",
          billingItemBalance: item?.billingItemAmount - row?.allocationAmount,
          allocationStatus:
            item?.billingItemAmount - row?.allocationAmount === 0
              ? "Paid"
              : "Partially Paid",
          //   equivalentAmount: row?.allocationAmount * rateAmount,
          equivalentAmount:
            item?.convertedCurrency === "USD"
              ? row?.allocationAmount / rateAmount
              : row?.allocationAmount * rateAmount,
        };
        if (updatedRow["billingItemBalance"] < 0) {
          const errorBody = {
            title: "Failed",
            description: `Allocation amount exced!`,
          };
          dispatch(showModalError(errorBody));
        } else {
          newData.splice(index, 1, updatedRow);
          onDataChange(newData);
          setEditingKey("");
          dispatch(setDataAllocation(newData));
        }
      } else {
        newData.push(row);
        onDataChange(newData);
        dispatch(setDataAllocation(newData));
        setEditingKey("");
      }
      setStoredData(false);
      form.resetFields();
      setStatusAction("");
      setIsSame(false);
      setIsValid(true);

      setIsInsert(false);
      setVisiblePassword({});
      setRule("");
      setMaxLenght(255);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // handle delete row
  const deleteRow = (key) => {
    const newData = tableData.filter((item) => item.key !== key);
    onDataChange(newData);
    onDataChange(newData);
    setUpdateSelectDataTable(newData);
    setUpdateSelectRowKeys(newData?.map((item) => item?.key));
    setStoredData(false);
    setIsInsert(false);
  };

  // handle password
  const handleVisiblePassword = (data) => {
    setVisiblePassword((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  // render button delete & update table inline
  const renderDelete = (record) => {
    return record.allocationNumber ? (
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
    // return (
    //     <ButtonComponent
    //         onClick={() => deleteRow(record.key)}
    //         disabled={editingKey !== ""}
    //         icon={
    //             <SVGIcon name="IconDelete" width={24} />
    //             // <DeleteOutlined style={{ fontSize: "24px", color: "#c81912" }} />
    //         }
    //         border={false}
    //     />
    // )
  };
  const renderUpdate = (record) => {
    // return record.status === "ACTIVE" || record.status === "INACTIVE" ? (
    return record.allocationNumber ? (
      <ButtonComponent
        disabled
        icon={<SVGIcon name="IconEdit" width={24} color={"#C0BEC6"} />}
        border={false}
      />
    ) : (
      <ButtonComponent
        onClick={() => edit(record)}
        disabled={editingKey !== ""}
        icon={<SVGIcon name="IconEdit" width={24} />}
        border={false}
      />
    );
  };
  const renderReverse = (record) => {
    return record.allocationNumber ? (
      <ButtonComponent
        onClick={() => onReverse(record)}
        disabled={editingKey !== ""}
        icon={<SVGIcon name="IconRevers" width={24} />}
        border={false}
      />
    ) : null;
  };

  // render column table inline
  const columns = [
    ...cols,
    {
      title: "ACTIONS",
      dataIndex: "operation",
      ...(actionFix ? { fixed: "right" } : {}),
      align: "center",
      render: (_, record) => {
        const editable = record.key === editingKey;
        return (
          // rendering button
          <Space className="my-2 gap-2">
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
            ) : actionButton?.length >= 4 ? (
              <>
                <Popover
                  content={
                    <Space direction="vertical">
                      {record?.id ? (
                        <ButtonComponent
                          icon={<SVGIcon name="IconDetail" width={24} />}
                          border={false}
                          onClick={() => onDetail(record?.id)}
                        >
                          <span className={"text-black"}> Detail</span>
                        </ButtonComponent>
                      ) : (
                        <ButtonComponent
                          disabled
                          icon={
                            <SVGIcon
                              name="IconDetail"
                              color={"#C0BEC6"}
                              width={24}
                            />
                          }
                          border={false}
                        // onClick={() => onDetail(record?.id)}
                        >
                          <span className={"text-[#C0BEC6]"}> Detail</span>
                        </ButtonComponent>
                      )}
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
                          onClick={() => onInactive(record)}
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
                {/* {record.status === "ACTIVE" || record.status === "INACTIVE" ? ( */}
                {record.id ? (
                  <ButtonComponent
                    disabled
                    icon={
                      <SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />
                    }
                    border={false}
                  />
                ) : (
                  <ButtonComponent
                    onClick={() => deleteRow(record.key)}
                    disabled={editingKey !== ""}
                    icon={<SVGIcon name="IconDelete" width={24} />}
                    border={false}
                  />
                )}
              </>
            ) : (
              <>
                {actionButton?.includes("detail") && (
                  <ButtonComponent
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={() => onDetail(record?.id)}
                  />
                )}
                {
                  renderUpdate(record)
                  /* (
                                        <ButtonComponent
                                            onClick={() => edit(record)}
                                            disabled={editingKey !== ""}
                                            icon={<SVGIcon name="IconEdit" width={24} />}
                                            border={false}
                                        />
                                    ) */
                }

                {actionButton?.includes("inactive") && (
                  <ButtonComponent
                    border={false}
                    disabled={record?.status !== "ACTIVE"}
                  >
                    <Checkbox
                      onClick={
                        record?.status === "ACTIVE"
                          ? () => onInactive(record?.id)
                          : undefined
                      }
                      checked={record?.status === "ACTIVE"}
                    />
                  </ButtonComponent>
                )}
                {renderReverse(record)}
                {renderDelete(record)}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  // display column
  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  // filter column
  const filterColumn = (dataColumn) => {
    return dataColumn.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  // pagination
  const paginationTable = (page, pageSize) => {
    return tableData?.slice((page - 1) * pageSize, page * pageSize);
  };

  return (
    <div>
      <div className={"w-full flex mb-5 gap-2 justify-between"}>
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
      </div>
      <Form form={form} component={false}>
        <Table
          dataSource={paginationTable(current, pageSize)}
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
                  required: col.required,
                  disableDate,
                  form: form,
                  onInput: col.onInput,
                  maxLength: col.maxLength,
                  // form : form,
                  rules: col.rules,
                }),
              };
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
          onChange={onSort}
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default TableInlineAllocation;
