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
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {
  MoreOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import SVGIcon from "../../../../../../assets/Icon/index";
import { dateFormatting, hasValue } from "../../../../../../utils";
import InputComponent from "../../../../../../components/InputComponent";

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
  onDropdownVisibleChange,
  onSearch,
  searchValue,
  selectLoading,
  onInput,
  maxLength,
  form,
  startDateLock,
  endDateLock,
  disabledColumns = [],
  ...restProps
}) => {
  const key = record?.key || 0;
  const encrypt = record?.encrypt;
  const rules = () => {
    let rules = [];
    if (required) {
      rules.push({
        required: required === undefined || required === false ? false : true,
        message: `Please input your ${title.toLowerCase()}!`,
      });
    }
    if (inputType === "input_regex") {
      rules.push(regex);
    }
    return rules.length !== 0 ? rules : undefined;
  };

  const handleDisableDate = (current) => {
    if (!current) return false;
    const currentStart = current.clone().startOf("day");

    if (dataIndex === "endDate") {
      const selectedStartDate = form.getFieldValue("startDate");
      const limitStart = hasValue(selectedStartDate)
        ? moment(selectedStartDate).startOf("day")
        : hasValue(startDateLock)
          ? moment(startDateLock).startOf("day")
          : null;

      const limitEnd = hasValue(endDateLock)
        ? moment(endDateLock).startOf("day")
        : null;

      if (limitStart && currentStart.isBefore(limitStart)) return true;
      if (limitEnd && currentStart.isAfter(limitEnd)) return true;
      return false;
    } else if (dataIndex === "startDate") {
      const limitStart = hasValue(startDateLock)
        ? moment(startDateLock).startOf("day")
        : null;
      const limitEnd = hasValue(endDateLock)
        ? moment(endDateLock).startOf("day")
        : null;

      if (limitStart && currentStart.isBefore(limitStart)) return true;
      if (limitEnd && currentStart.isAfter(limitEnd)) return true;
      return false;
    } else {
      return currentStart.isBefore(moment().startOf("day"));
    }
  };

  const handleDisabledColumn = (dataIndex, record = null) => {
    if (disabledColumns.includes(dataIndex)) return true;
    if (dataIndex === "categoryName" || dataIndex === "itemName") {
      return record?.dataType === "exist" ? true : false;
    } else {
      return false;
    }
  };

  const getInputNode = (inputType, options, searchValue) => {
    switch (inputType) {
      case "text":
        return <InputComponent />;
      case "input_regex":
        return (
          <Input
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
            disabled={handleDisabledColumn(dataIndex, record)}
            loading={selectLoading}
            onChange={(val) => onCellClicked && onCellClicked(val, form)}
            onDropdownVisibleChange={(open) =>
              onDropdownVisibleChange && onDropdownVisibleChange(open, form)
            }
            onSearch={(input) => onSearch && onSearch(input)}
            searchValue={searchValue}
            showSearch
            optionFilterProp="children"
            allowClear
            autoClearSearchValue={false}
            filterOption={
              onSearch
                ? false
                : (input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
            }
          >
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.label}>
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
            format={dateFormatting.date}
            disabledDate={handleDisableDate}
            onChange={(e) => {
              if (dataIndex === "startDate") {
                form.resetFields(["endDate"]);
              }
            }}
            style={{ width: "100%" }}
          />
        );
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} />;
      case "description_readonly":
        return (
          <Input.TextArea
            rows={1}
            disabled
            style={{
              backgroundColor: "#f5f5f5",
              color: "#595959",
              cursor: "not-allowed",
            }}
          />
        );
      default:
        return <InputComponent />;
    }
  };
  const inputNode = getInputNode(inputType, options, searchValue);

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
          rules={inputType !== "checkbox" ? rules() : undefined}
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

const DynamicTableInlineBilling = ({
  onDataChange,
  cols,
  tableData,
  mode,
  onDetail,
  onInactive,
  onCreate,
  subHeader,
  header,
  regex,
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
  onSort,
  useContainer = true,
  checkInputBy,
  checkNameColumn,
  handleValidate,
  messageValidate,
  actionFix,
  setInserted = () => { },
  isDynamicEditable = false,
  unFilterUpdatedlist = () => { },
  startDateLock = null,
  endDateLock = null,
  setModalRequired = () => { },
  handleValidateUpdate = () => { },
  onCancelEdit = null,
  defaultNewRowValues = {},
  disabledColumns = [],
  allowDeleteExisting = false,
  glAccountSearchValue = "",
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [statusAction, setStatusAction] = useState("");
  const [isSame, setIsSame] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (isInsert === true) {
      setInserted(true);
    } else {
      setInserted(false);
    }
  }, [isInsert, setInserted]);

  useEffect(() => {
    if (onCancelEdit) {
      onCancelEdit(() => {
        if (editingKey !== "") {
          cancel(editingKey);
        }
      });
    }
  }, [editingKey, statusAction]);

  const edit = (record, field) => {
    unFilterUpdatedlist(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    });
    setEditingKey(record.key);
    setStoredData(true);
    setStatusAction("edit");
    setIsInsert(true);
  };

  const cancel = (key) => {
    if (statusAction === "add") {
      const newData = tableData.filter((item) => item.key !== key);
      onDataChange(newData);
    }
    setEditingKey("");
    setStoredData(false);
    setStatusAction("");
    setIsInsert(false);
  };

  const handleVisiblePassword = (data) => {
    setVisiblePassword((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const executeSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      let dataValid = true;
      if (handleValidate) {
        dataValid = handleValidate(row, statusAction);
      }
      if (dataValid) {
        if (
          checkInputBy === undefined &&
          handleValidateUpdate(
            [...tableData],
            { ...row, key: key },
            statusAction,
            header?.includes("DETAIL"),
          )
        ) {
          const item = newData[index];
          const updatedRow = {
            ...item,
            ...{
              ...row,
              startDate: hasValue(row?.startDate)
                ? moment(row.startDate).format(dateFormatting.date)
                : "",
              endDate: hasValue(row?.endDate)
                ? moment(row.endDate).format(dateFormatting.date)
                : "",
            },
          };
          newData.splice(index, 1, updatedRow);
          setEditingKey("");
          onDataChange(newData, row);
          setStoredData(false);
          setStatusAction("");
          form.resetFields();
          setIsValid(true);
        }
        setIsInsert(false);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const save = async (key) => {
    const requiredHiddenCols = cols.filter(
      (col) => col.required === true && optionSelectedCol.includes(col.title),
    );

    if (requiredHiddenCols.length > 0) {
      setOptionSelectedCol((prev) =>
        prev.filter(
          (title) => !requiredHiddenCols.some((col) => col.title === title),
        ),
      );
      setTimeout(() => {
        executeSave(key);
      }, 50);
    } else {
      executeSave(key);
    }
  };

  const addRow = () => {
    form.resetFields();
    if (Object.keys(defaultNewRowValues).length > 0) {
      form.setFieldsValue(defaultNewRowValues);
    }
    setStoredData(true);
    setIsInsert(true);
    setStatusAction("add");
    const newRow = {
      key: (tableData.length + 1).toString(),
      ...(header.includes("DETAIL")
        ? { rMappingId: null }
        : { rCategoryId: null }),
    };
    const newData = [...tableData, newRow];
    onDataChange(newData, newRow);
    setEditingKey(newRow.key);
  };

  const deleteRow = (key) => {
    const newData = tableData
      .filter((item) => item.key !== key)
      ?.map((item, index) => {
        return {
          ...item,
          key: (index + 1).toString(),
        };
      });
    onDataChange(newData);
    setStoredData(false);
    setIsInsert(false);
  };

  const renderDelete = (record) => {
    return record.id ? (
      <ButtonComponent
        disabled
        icon={<SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />}
        border={false}
      />
    ) : (
      <Tooltip title="Delete">
        <div
          className={`flex justify-center${editingKey !== "" ||
            isDynamicEditable ||
            (!allowDeleteExisting && record?.dataType === "exist")
            ? " cursor-not-allowed"
            : ""
            }`}
        >
          <SVGIcon
            name="IconDelete"
            color={
              editingKey !== "" ||
                isDynamicEditable ||
                (!allowDeleteExisting && record?.dataType === "exist")
                ? "#8D91A0"
                : "#D90000"
            }
            className={
              editingKey !== "" ||
                isDynamicEditable ||
                (!allowDeleteExisting && record?.dataType === "exist")
                ? "disabled"
                : undefined
            }
            width={24}
            onClick={
              (editingKey === "" || !isDynamicEditable) &&
                (allowDeleteExisting || record?.dataType !== "exist")
                ? () => deleteRow(record.key)
                : undefined
            }
          />
        </div>
      </Tooltip>
    );
  };

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
              <div className="flex w-full justify-center gap-6">
                {actionButton?.includes("detail") && (
                  <ButtonComponent
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={() => onDetail(record?.id)}
                  />
                )}
                {actionButton?.includes("update") && (
                  <Tooltip title="Update">
                    <div
                      className={`flex justify-center${editingKey !== "" || isDynamicEditable
                        ? " cursor-not-allowed"
                        : ""
                        }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={
                          editingKey !== "" || isDynamicEditable
                            ? "#8D91A0"
                            : "#ACC424"
                        }
                        className={
                          editingKey !== "" || isDynamicEditable
                            ? "disabled"
                            : undefined
                        }
                        width={24}
                        onClick={
                          editingKey === "" || !isDynamicEditable
                            ? () => edit(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                )}

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

                {actionButton?.includes("delete") && renderDelete(record)}

                {actionButton?.includes("create") && (
                  <Tooltip title="Create Detail">
                    <div
                      className={`flex justify-center${editingKey !== "" || isDynamicEditable
                        ? " cursor-not-allowed"
                        : ""
                        }`}
                    >
                      <SVGIcon
                        name="IconActionCreate"
                        color={
                          editingKey !== "" || isDynamicEditable
                            ? "#8D91A0"
                            : "#0075bf"
                        }
                        width={24}
                        onClick={
                          editingKey === "" && !isDynamicEditable
                            ? () => onCreate(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                )}
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

  const paginationTable = (page, pageSize) => {
    return tableData?.slice((page - 1) * pageSize, page * pageSize);
  };

  return useContainer === true ? (
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"w-full flex justify-end"}>
        {showCreateButton && (
          <ButtonComponent
            onClick={() => {
              if (!startDateLock) {
                setModalRequired(true);
              } else if (storedDate === false) {
                addRow();
              }
            }}
            type={"submit"}
            border={false}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            disabled={isDynamicEditable || storedDate}
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
        </div>
      ) : null}
      <Form form={form} component={false}>
        <Table
          dataSource={tableData}
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
                  onDropdownVisibleChange: col.onDropdownVisibleChange,
                  onSearch: col.onSearch,
                  searchValue: col.searchValue,
                  selectLoading: col.loading,
                  showPassword: visiblePassword,
                  handlePassword: handleVisiblePassword,
                  regex: regex,
                  required: col.required,
                  disableDate,
                  form: form,
                  onInput: col.onInput,
                  maxLength: col.maxLength,
                  startDateLock,
                  endDateLock,
                  disabledColumns,
                }),
              };
            }),
          )}
          rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={{
            position: ["topRight"],
            current: current,
            pageSize: pageSize,
            onChange: onChangePage,
            className: "pr-1 w-3/4",
            style: { marginLeft: "auto", marginRight: 0 },
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} records`,
          }}
          scroll={scrollTable}
          tableLayout="fixed"
          bordered
        />
      </Form>
      {isSame && (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          <span className="font-bold text-red-700">
            {checkNameColumn} is exist
          </span>
        </div>
      )}
      {!isValid ? (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          <span className="font-bold text-red-700">
            {messageValidate || "data cannot save"}
          </span>
        </div>
      ) : null}
    </div>
  ) : (
    <>
      {useSelect || usePagination ? (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          {useSelect ? (
            <div className={"w-2/5"}>
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
            </div>
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
                  startDateLock,
                  disabledColumns,
                }),
              };
            }),
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
      {isSame && (
        <div className={"w-full flex mb-5 gap-2 justify-between"}>
          <span className="font-bold text-red-700">
            {checkNameColumn} is exist
          </span>
        </div>
      )}
    </>
  );
};

export default DynamicTableInlineBilling;
