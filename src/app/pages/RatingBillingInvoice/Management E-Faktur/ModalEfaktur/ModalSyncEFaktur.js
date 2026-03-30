import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import {
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";
import {
  getAvailableRequestedList,
  requestSyncData,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import StatusComponent from "../../../../../components/StatusComponent";

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

const ModalSyncEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const {
    loading_available_requested,
    loading_sync,
    data_available_requested,
    data_approval,
    data_approval_list,
    pagination_available_requested,
  } = useSelector((state) => state.efaktur);

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("invoiceDate~desc");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [reason, setReason] = useState("");

  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusPjap"],
  }));

  const dataSource = data_available_requested || [];

  const dataSourceWithKeys = useMemo(() => {
    return dataSource.map((item, index) => ({
      ...item,
      key: item.efakturId || index,
    }));
  }, [dataSource]);

  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAvailableRequestedList({
          page,
          pageSize,
          sort,
          type: "sync",
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
      dispatch(getAllApprovalList());
    }
  }, [isOpen, dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (boolean && data_approval_list && data_approval_list.length > 0) {
      const data = data_approval_list?.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, idx) => ({
          ...b,
          key: idx + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [data_approval_list, boolean]);

  const steps = [
    {
      title: "SYNC",
      disabled: selectedRowKeys.length === 0,
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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
      disabled:
        record.statusPjap === "APPROVED" ||
        record.statusPjap === "Approved",
      name: record.efakturId,
    }),
  };

  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue();

    if (selectedRowKeys.length === 0) {
      setErrorMessage("Please select at least one E-Faktur");
      setModalError(true);
      return;
    }

    if (!formValues.apphierId) {
      setErrorMessage("Please select approval hierarchy");
      setModalError(true);
      return;
    }

    try {
      const efakturIds = selectedRows.map((row) => String(row.efakturId));
      const apphierId = String(formValues.apphierId);

      await dispatch(
        requestSyncData({
          efakturIds,
          reason: reason.trim(),
          apphierId,
        })
      ).unwrap();

      onSuccess();
      handleCancel();
    } catch (error) {
      const errorMsg = error?.message || "Failed to request sync data";
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
    setReason("");
    setCurrent(0);
    setSearch({});
    handleClose();
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
        key: "efakturNo",
        title: "FAKTUR CODE",
        dataIndex: "efakturNo",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.efakturNo] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "efakturNo",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "efakturNo",
            hasValue(search["efakturNo"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "type",
        title: "FAKTUR TYPE",
        dataIndex: "type",
        width: 150,
        align: "center",
        sorter: true,
        render: (type) => {
          const displayType = type || "STANDARD";
          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayType.toLowerCase()}>
                {displayType}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "billingCode",
        title: "BILLING CODE",
        dataIndex: "billingCode",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.billingCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billingCode",
            hasValue(search["billingCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.invoiceNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "invoiceNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "invoiceNumber",
            hasValue(search["invoiceNumber"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.accountNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accountNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "accountNumber",
            hasValue(search["accountNumber"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "statusPjap",
        title: "STATUS PJAP",
        dataIndex: "statusPjap",
        width: 150,
        align: "center",
        sorter: true,
        render: (status) => {
          const displayStatus = status || "FAILED";
          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayStatus.toLowerCase()}>
                {displayStatus}
              </StatusComponent>
            </div>
          );
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
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
        header="SYNC"
        handleCancel={handleCancel}
        width={1000}
        footer={
          <div className="flex w-full justify-between">
            <div>
              {current === 0 && (
                <ButtonComponent
                  type="default"
                  onClick={handleCancel}
                  disabled={loading_sync}
                >
                  Cancel
                </ButtonComponent>
              )}
            </div>
            <div className="flex gap-3">
              {current > 0 && (
                <ButtonComponent
                  onClick={prev}
                  type="default"
                  disabled={loading_sync}
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
              {current === 0 && (
                <ButtonComponent
                  type="submit"
                  onClick={() => {
                    dispatch(
                      getAvailableRequestedList({
                        page,
                        pageSize,
                        sort,
                        type: "sync",
                        search: encodeURIComponent(JSON.stringify(search)),
                      })
                    );
                  }}
                  disabled={loading_available_requested}
                >
                  Sync Data
                </ButtonComponent>
              )}
              {current < steps.length - 1 && (
                <ButtonComponent
                  onClick={next}
                  type="submit"
                  disabled={steps[current].disabled || loading_sync}
                >
                  <span className="text-base">Next</span>
                  <RightOutlined style={{ fontSize: "16px", color: "#fff" }} />
                </ButtonComponent>
              )}
              {current === steps.length - 1 && (
                <ButtonComponent
                  type="submit"
                  onClick={handleSubmit}
                  loading={loading_sync}
                  disabled={loading_sync}
                >
                  {loading_sync ? "Submitting..." : "Submit Request"}
                </ButtonComponent>
              )}
            </div>
          </div>
        }
      >
        <Spin spinning={loading_available_requested || loading_sync}>
          <div className="my-6">
            <CustomSteps current={current} steps={steps} />

            <Form layout="vertical" form={form}>
              {/* STEP 1: SYNC - E-FAKTUR LIST */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <TableRBI
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={
                      pagination_available_requested?.totalElements || 0
                    }
                    tableScrolled={{ x: 1500, y: 400 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_available_requested}
                    rowSelection={rowSelection}
                  />
                </div>
              </div>

              {/* STEP 2: APPROVAL */}
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
                        loading={loading_available_requested}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {data_approval &&
                          data_approval.map((data) => (
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

                  <div className="mt-6">
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      Reason
                    </p>
                    <Form.Item name="reason">
                      <InputComponent
                        rows={3}
                        type="textarea"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Type your reason for sync"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* STEP 3: CONFIRMATION */}
              <div className={`${current !== 2 ? "hidden" : ""}`}>
                {reason && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Reason</p>
                    <p className="text-base text-gray-800">{reason}</p>
                  </div>
                )}

                {/* APPROVER SECTION */}
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

                {/* SELECTED E-FAKTUR LIST */}
                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-3 text-sm">
                    SELECTED E-FAKTUR LIST
                  </p>

                  <TableRBI
                    dataSource={selectedRows.map((item, idx) => ({
                      ...item,
                      key: item.efakturId || idx,
                    }))}
                    columns={processedColumns}
                    current={1}
                    pageSize={selectedRows.length}
                    totalData={selectedRows.length}
                    tableScrolled={{ x: 1500, y: 300 }}
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

export default ModalSyncEFaktur;
