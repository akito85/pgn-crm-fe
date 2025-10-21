import React, { useMemo, useState } from "react";
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
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  DeleteColumnOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useEffect } from "react";
import SVGIcon from "../../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../../utils";
import {
  createPeriodInformation,
  getBillingPeriodList,
  getInfoDetail,
  updatePeriodInformation,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import useGrantAccessHooks from "../../../../../../components/useGrantAccessHooks";
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
  disabled,
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

  // const handleDisableDate = (current) => {
  //   if (dataIndex === "endDate") {
  //     return current && current < moment(form.getFieldValue("startDate"));
  //   } else {
  //     return current && current < moment().add(-1, "days");
  //   }
  // };

  const handleDisableDate = (current) => {
    // Get the selected period from the form
    const period = form.getFieldValue("period");
    if (!period) {
      return true; // Disable all dates if no period is selected
    }

    // Define the start date of the selected period
    const startDate = moment(period).startOf("month");

    // Ensure the current date is within the selected period starting from the start date
    return current && current < startDate;
  };

  const getInputNode = (inputType, options) => {
    switch (inputType) {
      case "text":
        return <Input disabled={disabled} />;
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
            format={"DD MMM YYYY"}
            disabledDate={handleDisableDate}
            style={{ width: "100%" }}
          />
        );
      case "datePeriod":
        return <DatePicker picker="month" format={"MMM YYYY"} />;
      case "input_password":
        return <Input type={showPassword[key] ? "password" : "text"} />;
      case "description":
        return <Input.TextArea rows={1} maxLength={255} autoSize allowClear />;
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

const DynamicTableInlineBillingCycle = ({
  id,
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
  required,
  useDynamicAction = false,
  action,
  useSelect = false,
  usePagination = false,
  onChangePage = () => {},
  onSizeChanger = () => {},
  pageSize,
  current,
  sort,
  search,
  totalData,
  showCreateButton,
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
  onOpen,
  onClose,
  dispatch,
  setPage = () => {},
  setInserted = () => {},
}) => {
  const [form] = Form.useForm();
  const isEditing = (record) => record.key === editingKey;
  const access = useGrantAccessHooks();
  const actionsFilter = access?.actions?.slice(1);
  const permissionList = ["view", "update", "open"];

  const lowerCaseAccessList = useMemo(
    () => actionsFilter?.map((item) => item?.toLowerCase()),
    [actionsFilter],
  );

  const lowerCasePermissionList = useMemo(
    () => permissionList.map((item) => item?.toLowerCase()),
    [permissionList],
  );

  const arrayActions = useMemo(
    () =>
      lowerCaseAccessList?.filter((item) =>
        lowerCasePermissionList?.includes(item),
      ),
    [lowerCaseAccessList, lowerCasePermissionList],
  );

  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [storedDate, setStoredData] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const [statusAction, setStatusAction] = useState("");
  const [isSame, setIsSame] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [body, setBody] = useState([]);
  const [type, setType] = useState("");

  const [modalError, setModalError] = useState(false);
  const [bodyData, setBodyData] = useState({});
  const [bodyError, setBodyError] = useState({});

  useEffect(() => {
    if (mode === "update") {
      setData(
        tableData?.map((row, index) => ({ ...row, key: index.toString() })),
      );
    } else {
      setData(tableData);
    }
  }, [mode, tableData]);

  useEffect(() => {
    if (isInsert === true) {
      setInserted(true);
    } else {
      setInserted(false);
    }
  }, [isInsert, setInserted]);

  const edit = (record, field) => {
    // console.log(record);
    // form.setFieldsValue(record);
    form.setFieldsValue({
      ...record,
      startDate: record?.startDate
        ? moment(record?.startDate).format(dateFormatting.dateTime)
        : null,
      endDate: record?.endDate
        ? moment(record.endDate).format(dateFormatting.dateTime)
        : null,
    });
    setEditingKey(record.key);
    setStoredData(true);
    setStatusAction("edit");
    setIsInsert(true);
  };
  const cancel = (key) => {
    if (
      parseInt(editingKey) > 10 &&
      editingKey?.[editingKey?.length - 1] === "1"
    ) {
      setPage(parseInt(editingKey?.[0]));
    }
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
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      let dataValid = true;
      if (handleValidate) {
        dataValid = handleValidate(row, statusAction);
      }
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
      let body = {
        period: moment(row.period).format(dateFormatting.datePeriod),
        invoiceDate: row.invoiceDate
          ? moment(row.invoiceDate).format(dateFormatting.dateFormal)
          : "",
        description: row.description,
        ...(statusAction === "edit"
          ? { id: data[index].id }
          : { billingCycleId: id }),
      };
      setStoredData(false);
      onDataChange([...newData]);
      form.resetFields();
      setStatusAction("");
      if (statusAction === "edit") {
        dispatch(
          updatePeriodInformation({
            body: body,
            api: getBillingPeriodList({
              id: id,
              search: encodeURIComponent(JSON.stringify(search)),
              sort: sort,
              page: current,
              pageSize: pageSize,
            }),
          }),
        )
          .unwrap()
          .then(() => {
            dispatch(
              getBillingPeriodList({
                id: id,
                search: encodeURIComponent(JSON.stringify(search)),
                sort: sort,
                page: current,
                pageSize: pageSize,
              }),
            );
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              setBodyError({ message });
              setModalError(true);
            }
          });
      } else {
        dispatch(
          createPeriodInformation({
            body: body,
            api: getBillingPeriodList({
              id: id,
              search: encodeURIComponent(JSON.stringify(search)),
              sort: sort,
              page: current,
              pageSize: pageSize,
            }),
          }),
        )
          .unwrap()
          .then(() => {
            dispatch(
              getBillingPeriodList({
                id: id,
                search: encodeURIComponent(JSON.stringify(search)),
                sort: sort,
                page: current,
                pageSize: pageSize,
              }),
            );
          })
          .catch((error) => {
            console.log(error.response, "error");
            if (
              parseInt(editingKey) > 10 &&
              editingKey?.[editingKey?.length - 1] === "1"
            ) {
              setPage(parseInt(editingKey?.[0]));
              tableData.pop();
            }
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              setBodyError({ message });
              setModalError(true);
            }
          });
      }
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
      key: (tableData.length + 1).toString(),
      // status: "CLOSE",
    };
    onDataChange((prevData) => [...prevData, newRow]);
    if (
      parseInt(newRow["key"]) > 10 &&
      newRow["key"]?.[newRow["key"]?.length - 1] === "1"
    ) {
      console.log(tableData, "tableData");
      console.log(
        parseInt(newRow["key"]?.[0]) + 1,
        "parseInt(newRow['key']?.[0]) + 1",
      );

      setPage(parseInt(newRow["key"]?.[0]) + 1);
    }
    setEditingKey(newRow.key);
  };

  const deleteRow = (key) => {
    const newData = tableData.filter((item) => item.key !== key);
    onDataChange(newData);
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
  };

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <ButtonComponent
          onClick={storedDate === false && addRow}
          type={"submit"}
          border={false}
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
        >
          Create
        </ButtonComponent>
      ),
    },
  ];

  const columns = [
    ...cols,
    {
      title: "ACTION",
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
                {actionButton?.includes("updateOnClose") && (
                  <div className="flex w-full justify-center gap-4">
                    {arrayActions?.includes("view") && (
                      <Tooltip title="Detail">
                        <div>
                          <SVGIcon
                            name="IconDetail"
                            color={editingKey ? "#8D91A0" : "#0075BF"}
                            width={24}
                            onClick={
                              !editingKey
                                ? () => onDetail(record?.id)
                                : undefined
                            }
                            className={
                              editingKey ? "cursor-not-allowed" : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                    )}

                    {arrayActions?.includes("update") && (
                      <Tooltip title="Update">
                        <div>
                          <SVGIcon
                            name="IconEdit"
                            width={24}
                            color={
                              editingKey || record.status === "CLOSE"
                                ? "#8D91A0"
                                : "#ACC424"
                            }
                            onClick={
                              !editingKey && record.status !== "CLOSE"
                                ? () => edit(record)
                                : undefined
                            }
                            className={
                              record.status === "CLOSE" || editingKey
                                ? "cursor-not-allowed"
                                : undefined
                            }
                          />
                        </div>
                      </Tooltip>
                    )}

                    {arrayActions?.includes("open") &&
                      (record.status === "OPEN" ? (
                        <Tooltip title="Close">
                          <div
                            className={
                              editingKey ? "cursor-not-allowed" : undefined
                            }
                          >
                            <SVGIcon
                              name="IconPaymentClose"
                              color={editingKey ? "#8D91A0" : "#D90000"}
                              width={24}
                              onClick={
                                !editingKey
                                  ? () => onClose(record, "Close", false)
                                  : undefined
                              }
                              className={
                                editingKey ? "cursor-not-allowed" : undefined
                              }
                            />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Open">
                          <div>
                            <SVGIcon
                              name="IconPaymentOpen"
                              color={editingKey ? "#8D91A0" : "#0075BF"}
                              width={24}
                              onClick={
                                !editingKey
                                  ? () => onOpen(record, "Open", true)
                                  : undefined
                              }
                              className={
                                editingKey ? "cursor-not-allowed" : undefined
                              }
                            />
                          </div>
                        </Tooltip>
                      ))}
                  </div>
                )}
                {/* {actionButton?.includes("detail") && (
                  <ButtonComponent
                    icon={<SVGIcon name="IconDetail" width={24} />}
                    border={false}
                    onClick={() => onDetail(record?.id)}
                  />
                )} */}
                {actionButton?.includes("update") && (
                  <ButtonComponent
                    onClick={() => edit(record)}
                    disabled={editingKey !== ""}
                    icon={<SVGIcon name="IconEdit" width={24} />}
                    border={false}
                  />
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
                  <ButtonComponent
                    onClick={() => onCreate(record)}
                    icon={
                      <SVGIcon
                        name="IconActionCreate"
                        color={"#0075bf"}
                        width={24}
                      />
                    }
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

  const handleRetry = () => {
    if (statusAction === "edit") {
      dispatch(
        updatePeriodInformation({
          body: body,
          api: getBillingPeriodList({
            id: id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort: sort,
            page: current,
            pageSize: pageSize,
          }),
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(
            getBillingPeriodList({
              id: id,
              search: encodeURIComponent(JSON.stringify(search)),
              sort: sort,
              page: current,
              pageSize: pageSize,
            }),
          );
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(
        createPeriodInformation({
          body: body,
          api: getBillingPeriodList({
            id: id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort: sort,
            page: current,
            pageSize: pageSize,
          }),
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(
            getBillingPeriodList({
              id: id,
              search: encodeURIComponent(JSON.stringify(search)),
              sort: sort,
              page: current,
              pageSize: pageSize,
            }),
          );
        })
        .catch((error) => {
          console.log(error.response, "error");
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }

    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  return useContainer === true ? (
    <BaseContainer header={header} subHeader={subHeader}>
      <div className={"w-full flex flex-col gap-4"}>
        <div className={"w-full flex justify-end"}>
          {showCreateButton && <Toolbar items={itemGrantAccess} />}
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
                    disabled: col.disabled || false,
                  }),
                };
              }),
            )}
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
            rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={scrollTable}
            tableLayout="fixed"
            bordered
            // onChange={onChangePage}
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

      {/* Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            statusAction === "add" ? "created" : "updated"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </BaseContainer>
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

export default DynamicTableInlineBillingCycle;
