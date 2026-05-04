import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Form, Select, Space, Table, Tooltip, InputNumber, DatePicker } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {
  getListBillingItem,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import DateComponent from "../../../../../../components/DateComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting, hasValue } from "../../../../../../utils";

import { showModalError } from "../../../../../../redux/slices/general_slice";

// ─── Editable Cell ────────────────────────────────────────────────────────────
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  required,
  formDetail,
  validateStartDate,
  validateEndDate,
  ...restProps
}) => {
  const rules = () => {
    if (required) {
      return [
        {
          required: true,
          message: `Please input ${title?.toLowerCase()}!`,
        },
      ];
    }
    return undefined;
  };

  const endDateValidator = (_, value) => {
    const startDate = formDetail?.getFieldValue("startDate");
    if (!value) return Promise.resolve();
    if (startDate && moment(startDate) > moment(value)) {
      return Promise.reject(new Error("End Date must be after Start Date"));
    }
    if (
      hasValue(validateEndDate) &&
      moment(value).startOf("day") > moment(validateEndDate).startOf("day")
    ) {
      return Promise.reject(
        new Error("End date cannot exceed the Billing Bucket end date")
      );
    }
    return Promise.resolve();
  };

  const handleDisableStartDate = (current) => {
    if (hasValue(validateStartDate) && hasValue(validateEndDate)) {
      return (
        current.isBefore(moment(validateStartDate).startOf("day")) ||
        current.isAfter(moment(validateEndDate).endOf("day"))
      );
    } else if (hasValue(validateStartDate)) {
      return current.isBefore(moment(validateStartDate).startOf("day"));
    }
    return true;
  };

  const handleDisableEndDate = (current) => {
    const currentDay = current.clone().startOf("day");
    const sd = formDetail?.getFieldValue("startDate");
    if (hasValue(sd) && currentDay < moment(sd).startOf("day")) return true;
    if (
      hasValue(validateEndDate) &&
      currentDay > moment(validateEndDate).startOf("day")
    )
      return true;
    return false;
  };

  const getInputNode = () => {
    switch (inputType) {
      case "select":
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "number":
        return (
          <InputNumber
            type="number"
            controls={false}
            style={{ width: "100%" }}
          />
        );
      case "startDate":
        return (
          <DateComponent
            dateDisable={handleDisableStartDate}
            disabled={!hasValue(validateStartDate)}
          />
        );
      case "endDate":
        return (
          <DateComponent
            disabled={!formDetail?.getFieldValue("startDate")}
            dateDisable={handleDisableEndDate}
          />
        );
      default:
        return null;
    }
  };

  if (dataIndex === "no" || dataIndex === "operation") {
    return <td {...restProps}><div>{children}</div></td>;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={
            inputType === "endDate"
              ? [{ validator: endDateValidator }]
              : rules()
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

// ─── Main Component ───────────────────────────────────────────────────────────
const BillingBucketDetailSectionForm = ({
  listDataBI = [],
  setListDataBI,
  type,
  status,
  statusApproval,
  showAction,
  validStartDate,
  validEndDate,
  setStoredData = () => {},
}) => {
  const { data_billing_item } = useSelector(
    (state) => state.billing_bucket
  );

  const dispatch = useDispatch();
  const [formDetail] = Form.useForm();
  const isEditing = (record) => record.key === editingKey;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");
  const [dataHistory, setDataHistory] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);

  useEffect(() => {
    setTotalData(listDataBI.length);
  }, [listDataBI]);

  useEffect(() => {
    dispatch(getListBillingItem());
  }, [dispatch]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBillingItemLabel = (value) =>
    data_billing_item?.find((i) => i.value === value)?.name || "";

  const isDeleteAllowed = (record) =>
    (status === "DRAFT" && statusApproval === "DRAFT") ||
    record.type !== "exist";

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const edit = (record) => {
    setStoredData(true);
    formDetail.setFieldsValue({
      ...record,
      startDate: hasValue(record?.startDate) ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : undefined,
    });
    setEditingKey(record.key);
    setStatusAction("edit");
  };

  const cancel = (record) => {
    setEditingKey("");
    if (statusAction === "add") {
      deleteRow(record);
    }
    setStatusAction("");
    setStoredData(false);
    formDetail.resetFields();
  };

  const save = async (key) => {
    try {
      const row = await formDetail.validateFields();

      const formatted = {
        ...row,
        startDate: row.startDate
          ? moment(row.startDate).format("YYYY-MM-DD")
          : null,
        endDate: row.endDate
          ? moment(row.endDate).format("YYYY-MM-DD")
          : null,
        groups: row.groups !== undefined ? row.groups : null,
        groupSequence: row.groupSequence !== undefined ? row.groupSequence : null,
      };

      setListDataBI((prev) => {
        const idx = prev.findIndex((item) => item.key === key);
        if (idx === -1) return prev;
        const temp = [...prev];
        
        // Construct the new object explicitly with only allowed keys
        const updatedItem = {
          id: temp[idx].id, // Keep ID if it exists
          key: key,
          type: statusAction === "add" ? "new" : temp[idx].type,
          billingItem: formatted.billingItem,
          sequence: formatted.sequence,
          groups: formatted.groups,
          groupSequence: formatted.groupSequence,
          startDate: formatted.startDate,
          endDate: formatted.endDate,
        };
        
        temp[idx] = updatedItem;
        return temp;
      });

      setEditingKey("");
      setStatusAction("");
      setStoredData(false);
      formDetail.resetFields();
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const addRow = () => {
    if (!hasValue(validStartDate)) {
      dispatch(
        showModalError({
          title: "Failed",
          description: "Can't add detail data. Please select a start date.",
        })
      );
      return;
    }
    if (editingKey) return; // already editing

    formDetail.resetFields();
    setStatusAction("add");

    const newKey = listDataBI
      .reduce((current, next) => {
        const nextKey = next.key || 0;
        return current > nextKey
          ? parseInt(current) + 1
          : parseInt(nextKey) + 1;
      }, 1)
      .toString();

    setListDataBI((prev) => [...prev, { key: newKey, type: "new" }]);
    setEditingKey(newKey);
    setStoredData(true);

    const newTotal = listDataBI.length + 1;
    setPage(Math.ceil(newTotal / pageSize));
  };

  const deleteRow = (record) => {
    setListDataBI((prev) => prev.filter((item) => item.key !== record.key));
    setStoredData(false);
  };

  const handleDetail = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.id,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
    setDataHistory({});
  };

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };

  const filterColumn = (dataColumn) =>
    dataColumn.filter((col) => !optionSelectedCol.includes(col.title));

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onChange = (_, __, ___, extra) => {
    setTotalData(extra?.currentDataSource?.length || 0);
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const rawColumns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BILLING ITEM",
      dataIndex: "billingItem",
      inputType: "select",
      required: true,
      width: 200,
      options: data_billing_item?.map((i) => ({ value: i.value, label: i.name })),
      render: (text) => getBillingItemLabel(text),
    },
    {
      title: "SEQUENCE",
      dataIndex: "sequence",
      align: "right",
      inputType: "number",
      required: true,
      width: 130,
      render: (text) => text ?? "",
    },
    {
      title: "GROUPS",
      dataIndex: "groups",
      align: "right",
      inputType: "number",
      required: true,
      width: 120,
      render: (text) => text ?? "",
    },
    {
      title: "GROUP SEQUENCE",
      dataIndex: "groupSequence",
      align: "right",
      inputType: "number",
      required: true,
      width: 150,
      render: (text) => text ?? "",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      inputType: "startDate",
      required: true,
      width: 180,
      render: (text) =>
        text ? moment(text).format(dateFormatting.dateCapital || "DD MMM YYYY") : "",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      inputType: "endDate",
      width: 180,
      render: (text) =>
        text ? moment(text).format(dateFormatting.dateCapital || "DD MMM YYYY") : "",
    },

    {
      title: "ACTION",
      dataIndex: "operation",
      width: 200,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        const canDelete = isDeleteAllowed(record);

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
                {showAction === "show" ? (
                  <Tooltip title="Detail">
                    <div className="pt-1">
                      <SVGIcon
                        name="IconDetail"
                        width={24}
                        onClick={() => handleDetail(record)}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <>
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
                          color={canDelete && !editingKey ? "#D90000" : "#8D91A0"}
                          width={24}
                          className={
                            canDelete && !editingKey
                              ? undefined
                              : "disabled cursor-not-allowed"
                          }
                          onClick={
                            canDelete && !editingKey
                              ? () => deleteRow(record)
                              : undefined
                          }
                        />
                      </div>
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </Space>
        );
      },
    },
  ];

  const columns =
    type === "detail" || type === "show"
      ? rawColumns.filter((col) => col.title !== "ACTION")
      : rawColumns;

  return (
    <div className="flex flex-col w-full gap-4">
      {type !== "detail" && type !== "show" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            disabled={!!editingKey}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={!editingKey ? addRow : undefined}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}

      <div className="relative flex flex-col w-full">
        {/* Show/Hide Column dropdown — mengikuti pola Criteria */}
        <div
          className={`${
            totalData !== 0 ? "z-[1] absolute mt-4" : "my-4"
          } w-1/4 flex`}
        >
          <Select
            mode="multiple"
            placeholder="Show All Column"
            className="w-full"
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
              .slice(1)}
          </Select>
        </div>

        <Form form={formDetail} component={false}>
          <Table
            bordered
            className="w-full"
            dataSource={listDataBI}
            rowKey={(record) => record.key}
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
                  required: col.required,
                  formDetail,
                  validateStartDate: validStartDate,
                  validateEndDate: validEndDate,
                }),
              }))
            )}
            pagination={{
              position: ["topRight"],
              current: page,
              pageSize: pageSize,
              onChange: handleChange,
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
            scroll={{ x: 1200, y: 300 }}
            onChange={onChange}
          />
        </Form>
      </div>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="DETAIL INFORMATION"
        width={800}
        footer={
          <ButtonComponent type="default" onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header="HISTORY LOG INFORMATION" cols={5}>
          <DetailText label="Record ID">{dataHistory.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
    </div>
  );
};

export default BillingBucketDetailSectionForm;
