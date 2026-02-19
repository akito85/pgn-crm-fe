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
  onInput,
  maxLength,
  form,
  startDateLock,
  endDateLock,
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
    if (dataIndex === "endDate") {
      if (
        hasValue(startDateLock) &&
        hasValue(endDateLock) &&
        hasValue(form.getFieldValue("startDate")) === false
      ) {
        return (
          current < moment(startDateLock) ||
          current > moment(endDateLock).add(1, "days")
        );
      } else if (
        hasValue(form.getFieldValue("startDate")) &&
        hasValue(endDateLock)
      ) {
        return (
          current &&
          (moment(form.getFieldValue("startDate")) > current ||
            current > moment(endDateLock).add(1, "days"))
        );
      } else if (hasValue(form.getFieldValue("startDate"))) {
        return moment(form.getFieldValue().startDate) > current;
      } else {
        return null;
      }
    } else if (dataIndex === "startDate") {
      if (hasValue(endDateLock)) {
        return (
          moment(startDateLock) >= current ||
          current > moment(endDateLock).add(1, "days")
        );
      } else {
        return moment(startDateLock) > current;
      }
    } else {
      return moment().add(-1, "days") >= current;
    }
  };

  const handleDisabledColumn = (dataIndex, record = null) => {
    if (dataIndex === "categoryName" || dataIndex === "itemName") {
      return record?.dataType === "exist" ? true : false;
    } else {
      return false;
    }
  };

  const getInputNode = (inputType, options) => {
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
  // required,
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
  setInserted = () => {},
  isDynamicEditable = false, // for dependency action
  unFilterUpdatedlist = () => {},
  startDateLock = null,
  endDateLock = null,
  setModalRequired = () => {},
  handleValidateUpdate = () => {},
}) => {
  const [form] = Form.useForm();
  // const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const isEditing = (record) => record.key === editingKey;
  const [statusAction, setStatusAction] = useState("");
  const [isSame, setIsSame] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // useEffect(() => {
  //   if (mode === "update") {
  //     setData(
  //       tableData?.map((row, index) => ({ ...row, key: index.toString() }))
  //     );
  //   } else {
  //     setData(tableData);
  //   }
  // }, [mode, tableData]);

  useEffect(() => {
    if (isInsert === true) {
      setInserted(true);
    } else {
      setInserted(false);
    }
  }, [isInsert, setInserted]);

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

  const save = async (key) => {
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
        // else if (
        //   newData.filter((item) => item[checkInputBy] === row[checkInputBy])
        //     .length > 0 &&
        //   statusAction === "add"
        // ) {
        //   // setIsSame(true);
        // }
        // else {
        //   //new data
        //   if (index > -1) {
        //     const item = newData[index];
        //     const updatedRow = { ...item, ...row };
        //     newData.splice(index, 1, updatedRow);
        //     // setData(newData);
        //     setEditingKey("");
        //     onDataChange(newData, row);
        //   } else {
        //     //update
        //     newData.push(row);
        //     // setData(newData);
        //     onDataChange(newData, row);
        //     setEditingKey("");
        //   }
        //   setStoredData(false);
        //   // onDataChange([...newData]);
        //   form.resetFields();
        //   setStatusAction("");
        //   setIsSame(false);
        //   setIsValid(true);
        // }
        setIsInsert(false);
      }
      // else {
      //   setIsValid(false);
      // }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const addRow = () => {
    console.log("🔵 addRow called");
    console.log("📊 Current tableData:", tableData);
    console.log("📝 Header:", header);
    console.log("🔒 storedDate:", storedDate);
    console.log("📅 startDateLock:", startDateLock);

    form.resetFields();
    setStoredData(true);
    setIsInsert(true);
    setStatusAction("add");
    const newRow = {
      key: (tableData.length + 1).toString(),
      ...(header.includes("DETAIL")
        ? { rMappingId: null }
        : { rCategoryId: null }),
      // status: "ACTIVE",
    };

    console.log("✨ New row created:", newRow);
    const newData = [...tableData, newRow];
    console.log("📤 Calling onDataChange with:", newData);

    onDataChange(newData, newRow);
    setEditingKey(newRow.key);

    console.log("✅ addRow completed");
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
    // onDataChange(newData);
    onDataChange(newData);
    setStoredData(false);
    setIsInsert(false);
  };
  const renderDelete = (record) => {
    // return record.status === "ACTIVE" || record.status === "INACTIVE" ? (
    return record.id ? (
      <ButtonComponent
        disabled
        icon={<SVGIcon name="IconDelete" width={24} color={"#C0BEC6"} />}
        border={false}
      />
    ) : (
      <Tooltip title="Delete">
        <div
          className={`flex justify-center${
            editingKey !== "" ||
            isDynamicEditable ||
            record?.dataType === "exist"
              ? " cursor-not-allowed"
              : ""
          }`}
        >
          <SVGIcon
            name="IconDelete"
            color={
              editingKey !== "" ||
              isDynamicEditable ||
              record?.dataType === "exist"
                ? "#8D91A0"
                : "#D90000"
            }
            width={24}
            className={
              editingKey !== "" ||
              isDynamicEditable ||
              record?.dataType === "exist"
                ? "disabled"
                : undefined
            }
            onClick={
              (editingKey === "" || !isDynamicEditable) &&
              record?.dataType !== "exist"
                ? () => deleteRow(record.key)
                : undefined
            }
          />
        </div>
      </Tooltip>
      // <ButtonComponent
      //   onClick={() => deleteRow(record.key)}
      //   disabled={editingKey !== "" || isDynamicEditable}
      //   icon={
      //     <SVGIcon
      //       name="IconDelete"
      //       width={24}
      //       color={
      //         editingKey !== "" || isDynamicEditable ? "#8D91A0" : "#D90000"
      //       }
      //     />
      //     // <DeleteOutlined style={{ fontSize: "24px", color: "#c81912" }} />
      //   }
      //   border={false}
      // />
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
                      className={`flex justify-center${
                        editingKey !== "" || isDynamicEditable
                          ? // || record?.dataType === "exist"
                            " cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SVGIcon
                        name="IconEdit"
                        color={
                          editingKey !== "" || isDynamicEditable
                            ? // ||record?.dataType === "exist"
                              "#8D91A0"
                            : "#ACC424"
                        }
                        className={
                          editingKey !== "" || isDynamicEditable
                            ? // ||record?.dataType === "exist"
                              "disabled"
                            : undefined
                        }
                        width={24}
                        onClick={
                          editingKey === "" || !isDynamicEditable
                            ? // (editingKey === "" || !isDynamicEditable)
                              // && record?.dataType !== "exist"
                              () => edit(record)
                            : undefined
                        }
                      />
                    </div>
                  </Tooltip>
                  // <ButtonComponent
                  //   onClick={() => edit(record)}
                  //   disabled={editingKey !== "" || isDynamicEditable}
                  //   icon={
                  //     <SVGIcon
                  //       name="IconEdit"
                  //       width={24}
                  //       color={
                  //         editingKey !== "" || isDynamicEditable
                  //           ? "#8D91A0"
                  //           : "#ACC424"
                  //       }
                  //     />
                  //   }
                  //   border={false}
                  // />
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

                {/* create detail */}
                {actionButton?.includes("create") && (
                  <Tooltip title="Create Detail">
                    <div
                      className={`flex justify-center${
                        editingKey !== "" || isDynamicEditable
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
                  // <ButtonComponent
                  //   onClick={() => onCreate(record)}
                  //   icon={
                  //     <SVGIcon
                  //       name="IconActionCreate"
                  //       color={
                  //         editingKey !== "" || isDynamicEditable
                  //           ? "#8D91A0"
                  //           : "#0075bf"
                  //       }
                  //       width={24}
                  //     />
                  //   }
                  //   border={false}
                  //   disabled={editingKey !== "" || isDynamicEditable}
                  // />
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
    // <BaseContainer header={header} subHeader={subHeader}>
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"w-full flex justify-end"}>
        {showCreateButton && (
          <ButtonComponent
            onClick={() => {
              console.log("🎯 Create button clicked!");
              console.log("📅 startDateLock:", startDateLock);
              console.log("🔒 storedDate:", storedDate);
              console.log("🚫 isDynamicEditable:", isDynamicEditable);

              if (!startDateLock) {
                console.log("❌ No startDateLock - showing modal");
                setModalRequired(true);
              } else if (storedDate === false) {
                console.log("✅ Conditions met - calling addRow");
                addRow();
              } else {
                console.log("⚠️ storedDate is true - cannot add row");
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
          {/* {usePagination ? (
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
            ) : null} */}
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
          // onChange={onSort}
          // pagination={false}
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
    // </BaseContainer>
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
