import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import {
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  getReadyForRequestList,
  getApprovalHierarchyList,
  getApphierDetail,
  requestApprovalStampSign,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";

const ApproverListByLevel = ({
  dataTable,
  approvalLevel,
  maxInitialShow = 2,
}) => {
  const [showAll, setShowAll] = useState(false);

  const levelData = dataTable.filter(
    (approval) => approval.approvalLevel === approvalLevel
  );

  const allApprovers = levelData.flatMap((approval) =>
    (approval.employeeDetail || [])
      .filter((emp) => emp && emp.employeeName)
      .map((emp) => ({
        name: emp.employeeName,
        position: approval.position,
      }))
  );

  const displayedApprovers = showAll
    ? allApprovers
    : allApprovers.slice(0, maxInitialShow);

  const hasMore = allApprovers.length > maxInitialShow;

  if (allApprovers.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No {approvalLevel.toLowerCase()} selected
      </p>
    );
  }

  return (
    <div>
      <div className="space-y-1.5">
        {displayedApprovers.map((approver, idx) => (
          <div
            key={idx}
            className="text-[15px] leading-[22px] text-[#000000] flex items-start gap-1.5"
          >
            <span className="font-normal">{idx + 1}.</span>
            <span className="flex-1 font-normal">
              {approver.name} | {approver.position}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-3">
          <button
            onClick={() => setShowAll(!showAll)}
            type="button"
            className="inline-flex items-center gap-1.5 text-[15px] leading-[22px] text-[#000000] font-normal bg-transparent border-none p-0 cursor-pointer hover:opacity-70 transition-opacity"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              outline: "inherit",
            }}
          >
            <span>{showAll ? "Hide" : "See More"}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform duration-200 ${
                showAll ? "rotate-180" : ""
              }`}
              style={{
                transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const CustomSteps = ({ current, steps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${
                  index < current
                    ? "bg-blue-500"
                    : index === current
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }
                transition-all duration-300
              `}
            >
              {index < current ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : index === current ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              ) : (
                <span className="text-white font-semibold text-lg">
                  {index + 1}
                </span>
              )}
            </div>
            <p
              className={`
                mt-2 text-sm font-medium
                ${index <= current ? "text-blue-500" : "text-gray-400"}
              `}
            >
              {step.title}
            </p>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`
                h-0.5 w-32 mx-4 mb-6
                ${index < current ? "bg-blue-500" : "bg-gray-300"}
                transition-all duration-300
              `}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ModalRequestApprovalEMeterai = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const {
    loading_ready_request,
    loading_modal,
    data_ready_request,
    data_approval_hierarchy,
    data_apphier_detail,
  } = useSelector((state) => state.emeterai);

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterType, setFilterType] = useState("meterai");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [remark, setRemark] = useState("");

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const dataSource = useMemo(() => {
    if (!data_ready_request) return [];
    if (Array.isArray(data_ready_request)) return data_ready_request;
    return [];
  }, [data_ready_request]);

  const dataSourceWithKeys = useMemo(() => {
    if (!Array.isArray(dataSource)) return [];
    return dataSource.map((item, index) => ({
      ...item,
      key: item.invoiceNumber || index,
    }));
  }, [dataSource]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getReadyForRequestList({ type: filterType }));
      dispatch(getApprovalHierarchyList());
    }
  }, [isOpen, dispatch, filterType]);

  useEffect(() => {
    if (boolean && data_apphier_detail) {
      if (Array.isArray(data_apphier_detail)) {
        const data = data_apphier_detail.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: Array.isArray(a.employeeDetail)
            ? a.employeeDetail.map((b, idx) => ({
                ...b,
                key: idx + 1,
              }))
            : [],
        }));
        setDataTable(data || []);
      } else {
        setDataTable([]);
      }
    }
  }, [data_apphier_detail, boolean]);

  const steps = [
    {
      title: "INVOICES",
      disabled: selectedRowKeys.length === 0 || !remark,
    },
    {
      title: "APPROVAL",
      disabled: !form.getFieldValue()?.apphierId,
    },
    {
      title: "CONFIRMATION",
      disabled: false,
    },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      name: record.invoiceNumber,
    }),
  };

  const handleSelect = (e) => {
    dispatch(getApphierDetail({ id: e }));
    setBoolean(true);
  };

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue();

    if (selectedRowKeys.length === 0) {
      setErrorMessage("Please select at least one invoice");
      setModalError(true);
      return;
    }

    if (!formValues.apphierId) {
      setErrorMessage("Please select approval hierarchy");
      setModalError(true);
      return;
    }

    if (!remark) {
      setErrorMessage("Please input remark");
      setModalError(true);
      return;
    }

    try {
      const invoiceNumbers = selectedRows.map((row) =>
        String(row.invoiceNumber)
      );
      const apphierId = String(formValues.apphierId);

      const body = {
        type: filterType,
        apphierId: apphierId,
        invoiceNumbers: invoiceNumbers,
        remark: remark.trim(),
      };

      await dispatch(requestApprovalStampSign({ body })).unwrap();

      setModalSuccess(true);
    } catch (error) {
      const errorMsg = error?.message || "Failed to create request approval";
      setErrorMessage(errorMsg);
      setModalError(true);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setBoolean(false);
    setDataTable([]);
    setRemark("");
    setCurrent(0);
    setFilterType("meterai");
    handleClose();
  };

  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 180,
        align: "left",
        render: (text) => text || "-",
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        align: "left",
        render: (text) => text || "-",
      },
      {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        width: 250,
        align: "left",
        render: (text) => text || "-",
      },
      {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        width: 160,
        render: (text) => text || "-",
      },
      {
        key: "customerName",
        title: "CUSTOMER NAME",
        dataIndex: "customerName",
        width: 250,
        render: (text) => text || "-",
      },
      {
        key: "billingPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billingPeriod",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        key: "totalAmountEqvIdr",
        title: "TOTAL AMOUNT (IDR)",
        dataIndex: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "stampStatus",
        title: "STAMP STATUS",
        dataIndex: "stampStatus",
        width: 150,
        align: "center",
        render: (status) => {
          const displayStatus = status || "NOT_PROCESSED";
          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayStatus.toLowerCase()}>
                {displayStatus.replace(/_/g, " ")}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "signStatus",
        title: "SIGN STATUS",
        dataIndex: "signStatus",
        width: 150,
        align: "center",
        render: (status) => {
          const displayStatus = status || "NOT_PROCESSED";
          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayStatus.toLowerCase()}>
                {displayStatus.replace(/_/g, " ")}
              </StatusComponent>
            </div>
          );
        },
      },
    ],
    [page, pageSize]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const columnsApproval = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "HIERARCHY",
      dataIndex: "hierarchy",
      key: "hierarchy",
      width: 150,
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 200,
    },
  ];

  const columnsExpandApproval = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 250,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
  ];

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header={`REQUEST APPROVAL`}
        handleCancel={handleCancel}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent
                type="default"
                onClick={handleCancel}
                disabled={loading_modal}
              >
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={prev}
                type="default"
                disabled={loading_modal}
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </div>
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={next}
                type="submit"
                disabled={steps[current].disabled || loading_modal}
              >
                <span className="text-base">Next</span>
                <RightOutlined style={{ fontSize: "16px", color: "#fff" }} />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <ButtonComponent
                type="submit"
                onClick={handleSubmit}
                loading={loading_modal}
                disabled={loading_modal}
              >
                {loading_modal ? "Submitting..." : "Submit Request"}
              </ButtonComponent>
            )}
          </div>
        }
      >
        <Spin spinning={loading_ready_request || loading_modal}>
          <div className="my-6">
            <CustomSteps current={current} steps={steps} />

            <Form layout="vertical" form={form}>
              {/* STEP 1: INVOICE LIST */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <div className="mb-4">
                    <style>{`
                      .filter-type-select .ant-select-selector {
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                        border: 1px solid #BDBDBD !important;
                        height: 40px !important;
                        color: black !important;
                        border-radius: 6px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        padding: 0 11px !important;
                        background: white !important;
                      }
                      .filter-type-select .ant-select-selection-placeholder {
                        color: rgba(0, 0, 0, 0.25) !important;
                        line-height: 40px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                      }
                      .filter-type-select .ant-select-selection-item {
                        line-height: 40px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        color: black !important;
                      }
                    `}</style>
                    <Select
                      value={filterType}
                      onChange={(value) => {
                        setFilterType(value);
                        setPage(1);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                      }}
                      style={{ width: 250 }}
                      className="filter-type-select"
                    >
                      <Select.Option value="esign">E-Sign (Digital)</Select.Option>
                      <Select.Option value="meterai">Manual Meterai (Physical Stamp)</Select.Option>
                      <Select.Option value="sign">Manual Sign (Wet Ink Signature)</Select.Option>
                    </Select>
                  </div>

                  <p className="text-primary uppercase font-bold mb-4 text-sm">
                    INVOICE LIST
                  </p>

                  <TableRBI
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={dataSource.length || 0}
                    tableScrolled={{ x: 2000, y: 400 }}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_ready_request}
                    rowSelection={rowSelection}
                  />
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Remark
                    <span className="text-red-500 ml-1">*</span>
                  </p>
                  <Form.Item
                    name="remark"
                    rules={[
                      {
                        required: true,
                        message: "Please input your remark!",
                      },
                    ]}
                  >
                    <InputComponent
                      rows={3}
                      type="textarea"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Type your remark"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* STEP 2: APPROVAL INFORMATION */}
              <div className={`${current !== 1 ? "hidden" : ""}`}>
                <div className="w-full grid grid-cols-1 gap-x-4">
                  <p className="text-primary uppercase font-bold mb-4 text-sm">
                    APPROVAL INFORMATION
                  </p>

                  <div className="w-1/3 mb-6">
                    <Form.Item
                      label="Approval Hierarchy"
                      name="apphierId"
                      rules={[
                        {
                          required: true,
                          message: "Please select Approval Hierarchy!",
                        },
                      ]}
                    >
                      <Select
                        onChange={handleSelect}
                        placeholder="Select approval hierarchy"
                        loading={loading_ready_request}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {data_approval_hierarchy &&
                          data_approval_hierarchy.map((data, index) => (
                            <Select.Option
                              value={data.appHierId}
                              key={data.appHierId}
                            >
                              {data.approvalName}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>

                  {boolean && dataTable.length > 0 && (
                    <TableRBI
                      dataSource={dataTable}
                      columns={columnsApproval}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div>
                            <p className="text-primary text-xs font-bold uppercase pt-4">
                              EMPLOYEE INFORMATION
                            </p>
                            <TableRBI
                              dataSource={record?.employeeDetail || []}
                              columns={columnsExpandApproval}
                              className={"mb-4"}
                              useSelect={false}
                              usePagination={false}
                            />
                          </div>
                        ),
                      }}
                      useSelect={false}
                      usePagination={false}
                    />
                  )}
                </div>
              </div>

              {/* STEP 3: CONFIRMATION */}
              <div className={`${current !== 2 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Remark</p>
                  <p className="text-base text-gray-800">{remark}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Approver</p>

                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                      APPROVER
                    </p>
                    {dataTable.length > 0 ? (
                      <ApproverListByLevel
                        dataTable={dataTable}
                        approvalLevel="Final Approver"
                        maxInitialShow={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No approver selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-3 text-sm">
                    INVOICE LIST
                  </p>

                  <TableRBI
                    dataSource={selectedRows.map((item, idx) => ({
                      ...item,
                      key: item.invoiceNumber || idx,
                    }))}
                    columns={processedColumns}
                    current={1}
                    pageSize={selectedRows.length}
                    totalData={selectedRows.length}
                    tableScrolled={{ x: 2000, y: 300 }}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                    usePagination={true}
                    showPagination={false}
                  />
                  <div className="mt-3 text-right text-sm text-gray-600">
                    Showing 1 to {selectedRows.length} of {selectedRows.length}{" "}
                    entries
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Spin>
      </ModalCustom>

      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleSuccessClose}
        handleCancel={handleSuccessClose}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success"]}
            <p className="text-[18px] font-bold">Success</p>
          </div>
          <p className="pl-[70px]">Request approval has been submitted successfully.</p>
        </div>
      </ModalSuccess>

      <ModalError
        isOpen={modalError}
        handleOk={() => setModalError(false)}
        handleCancel={() => setModalError(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalRequestApprovalEMeterai;
