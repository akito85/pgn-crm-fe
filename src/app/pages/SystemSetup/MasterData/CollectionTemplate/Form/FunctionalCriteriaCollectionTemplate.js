import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Form, Select, Space, Table, Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import {
  getCustomerSegment,
  getAccountGroup,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import { hasValue } from "../../../../../../utils";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  options,
  required,
  formTable,
  validateStartDate,
  validateEndDate,
  dependDataIndex,
  dataEditRecord,
  handleEditDataRecord,
  ...restProps
}) => {
  const key = record?.key || 0;
  const dataDepend = dependDataIndex
    ? dataEditRecord?.[key + dependDataIndex]
    : undefined;

  const endDateValidator = (startDate) => (_, value) => {
    const momentStart = moment(startDate);
    const momentEnd = moment(value);
    if ((value && momentStart <= momentEnd) || !value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("End Date must be after Start Date"));
  };

  const handleDisableDateBetween = (current) => {
    if (!current) return false;
    const headerStart = validateStartDate
      ? moment(validateStartDate).startOf("day")
      : null;
    const headerEnd = validateEndDate
      ? moment(validateEndDate).endOf("day")
      : null;
    const rowStart = formTable.getFieldValue("startDate")
      ? moment(formTable.getFieldValue("startDate")).startOf("day")
      : null;
    if (headerStart && current.isBefore(headerStart, "day")) return true;
    if (headerEnd && current.isAfter(headerEnd, "day")) return true;
    if (
      dataIndex === "endDate" &&
      rowStart &&
      current.isBefore(rowStart, "day")
    )
      return true;
    return false;
  };

  const handleDisableDateBefore = (current) => {
    if (!current) return false;
    if (validateStartDate) {
      return current.isBefore(moment(validateStartDate).startOf("day"), "day");
    }
    return current.isBefore(moment().startOf("day"), "day");
  };

  const rules = required
    ? [{ required: true, message: `Please input ${title.toLowerCase()}!` }]
    : undefined;

  const getInputNode = () => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            labelInValue
            disabled={dependDataIndex ? !dataDepend : false}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {(options || []).map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "startDate":
        return (
          <DateComponent
            dateDisable={
              validateEndDate == null
                ? handleDisableDateBefore
                : handleDisableDateBetween
            }
          />
        );
      case "endDate":
        return (
          <DateComponent
            disabled={
              formTable.getFieldValue().startDate == null ||
              formTable.getFieldValue().startDate === undefined
            }
            dateDisable={
              validateEndDate == null
                ? handleDisableDateBefore
                : handleDisableDateBetween
            }
          />
        );
      default:
        return <InputComponent />;
    }
  };

  if (dataIndex === "operation" || dataIndex === "no") {
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
          style={{ margin: 0 }}
          valuePropName="value"
          getValueFromEvent={(value) =>
            handleEditDataRecord
              ? handleEditDataRecord(value, key, dataIndex)
              : value
          }
          rules={
            inputType !== "endDate"
              ? rules
              : [
                  {
                    validator: (_, value) =>
                      endDateValidator(formTable.getFieldValue().startDate)(
                        _,
                        value,
                      ),
                  },
                ]
          }
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const FunctionalCriteriaCollectionTemplate = ({
  type,
  data = [],
  updateData = () => {},
  storedData = false,
  setStoredData = () => {},
  validStartDate,
  validEndDate,
  status,
  statusApproval,
}) => {
  const dispatch = useDispatch();
  const { data_customer_segment, data_account_group } = useSelector(
    (state) => state.billing_bucket,
  );

  const [formTable] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [editDataRecord, setEditDataRecord] = useState({});

  const isEditing = (record) => record.key === editingKey;

  const customerSegmentOptions = (
    Array.isArray(data_customer_segment) ? data_customer_segment : []
  ).map((item) => ({ value: item.id, label: item.text }));

  const accountGroupOptions = (
    Array.isArray(data_account_group) ? data_account_group : []
  ).map((item) => ({ value: item.id, label: item.name }));

  useEffect(() => {
    if (type !== "detail") {
      dispatch(getCustomerSegment());
    }
  }, [dispatch, type]);

  useEffect(() => {
    setTotalData(data.length);
  }, [data]);

  const handleEditDataRecord = (value, key, index) => {
    const keyName = key + index;
    setEditDataRecord((prev) => ({ ...prev, [keyName]: value }));
    if (index === "customerSegment") {
      dispatch(getAccountGroup(value?.value));
      formTable.resetFields(["accountGroupType"]);
      setEditDataRecord((prev) => ({
        ...prev,
        [key + "accountGroupType"]: undefined,
      }));
    }
    return value;
  };

  const edit = (record) => {
    setStoredData(true);
    setStatusAction("edit");
    formTable.setFieldsValue({
      ...record,
      startDate: hasValue(record?.startDate) ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : undefined,
    });
    const { key, ...extraProps } = record || {};
    for (const attr in extraProps) {
      if (Object.hasOwnProperty.call(extraProps, attr)) {
        setEditDataRecord((prev) => ({
          ...prev,
          [`${key}${attr}`]: extraProps[attr],
        }));
      }
    }
    setEditingKey(record.key);
    if (record?.customerSegment?.value) {
      dispatch(getAccountGroup(record.customerSegment.value));
    }
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
    formTable.resetFields();
  };

  const checkOverlappingDate = useCallback((formHeaderValue, rowValue) => {
    if (
      moment(rowValue?.startDate).startOf("day") <
      moment(formHeaderValue?.startDate).startOf("day")
    ) {
      return true;
    } else if (
      hasValue(rowValue?.endDate) &&
      moment(rowValue?.endDate).startOf("day") >
        moment(formHeaderValue?.endDate).startOf("day").add(1, "days") &&
      hasValue(formHeaderValue?.endDate)
    ) {
      return true;
    }
    return false;
  }, []);

  const save = async (key) => {
    try {
      const row = await formTable.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      const isOverlapping = checkOverlappingDate(
        { startDate: validStartDate, endDate: validEndDate },
        row,
      );
      if (isOverlapping) {
        formTable.setFields([
          { name: "startDate", errors: ["Overlapping date found"] },
          { name: "endDate", errors: ["Overlapping date found"] },
        ]);
      } else {
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          updateData(newData);
          setEditingKey("");
        }
        setStoredData(false);
        setStatusAction("");
        formTable.resetFields();
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const addRow = () => {
    formTable.resetFields();
    setStoredData(true);
    setStatusAction("add");
    const newKey = data
      .reduce((cur, next) => {
        const nk = next.key || 0;
        return cur > nk ? parseInt(cur) + 1 : parseInt(nk) + 1;
      }, 1)
      .toString();
    updateData((prev) => [...prev, { key: newKey }]);
    setEditingKey(newKey);
  };

  const deleteRow = (record) => {
    updateData((prev) => prev.filter((item) => item.key !== record.key));
    setStoredData(false);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      dataIndex: "no",
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      width: 200,
      inputType: "select",
      required: true,
      render: (val) => {
        if (!val) return "-";
        return val?.label || val;
      },
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 200,
      inputType: "select",
      required: true,
      dependDataIndex: "customerSegment",
      render: (val) => {
        if (!val) return "-";
        return val?.label || val;
      },
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 140,
      inputType: "startDate",
      render: (val) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 140,
      inputType: "endDate",
      render: (val) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 200,
      inputType: "text",
      render: (val) => val || "-",
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      width: 160,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        const isDelete =
          (status === "DRAFT" && statusApproval === "DRAFT") ||
          record.type !== "exist";
        return (
          <Space className="my-3 gap-2">
            {editable ? (
              <>
                <ButtonComponent onClick={() => cancel(record)} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent onClick={() => save(record.key)} type="submit">
                  Save
                </ButtonComponent>
              </>
            ) : (
              <div className="flex w-full justify-center gap-4">
                <Tooltip title="Edit">
                  <div>
                    <SVGIcon
                      name="IconEdit"
                      color={editingKey ? "#8D91A0" : "#ACC424"}
                      className={editingKey ? "cursor-not-allowed" : ""}
                      width={24}
                      onClick={!editingKey ? () => edit(record) : undefined}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Delete">
                  <div>
                    <SVGIcon
                      name="IconDelete"
                      color={isDelete && !editingKey ? "#D90000" : "#8D91A0"}
                      width={24}
                      className={
                        isDelete && !editingKey
                          ? undefined
                          : "disabled cursor-not-allowed"
                      }
                      onClick={
                        isDelete && !editingKey
                          ? () => deleteRow(record)
                          : undefined
                      }
                    />
                  </div>
                </Tooltip>
              </div>
            )}
          </Space>
        );
      },
    },
  ];

  const listOption = {
    customerSegment: customerSegmentOptions,
    accountGroupType: accountGroupOptions,
  };

  const mergedColumns = columns
    .filter((col) => (type === "detail" ? col.dataIndex !== "operation" : true))
    .map((col) => ({
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: listOption[col.dataIndex],
        required: col.required,
        dependDataIndex: col.dependDataIndex,
        dataEditRecord: editDataRecord,
        handleEditDataRecord,
        formTable,
        validateStartDate: validStartDate,
        validateEndDate: validEndDate,
      }),
    }));

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && (
        <div className="flex w-full justify-end">
          <ButtonComponent
            disabled={storedData}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!storedData ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      )}
      <Form form={formTable} component={false}>
        <Table
          bordered
          components={{ body: { cell: EditableCell } }}
          dataSource={data}
          columns={mergedColumns}
          rowKey="key"
          scroll={{ x: 1200 }}
          pagination={{
            position: ["topRight"],
            current: page,
            pageSize,
            onChange: handleChange,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} records`,
          }}
          onChange={(_, __, ___, extra) =>
            setTotalData(extra?.currentDataSource?.length || 0)
          }
        />
      </Form>
    </div>
  );
};

export default FunctionalCriteriaCollectionTemplate;
