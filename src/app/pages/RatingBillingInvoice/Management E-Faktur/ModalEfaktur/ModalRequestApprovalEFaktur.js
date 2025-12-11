import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import {
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";
import {
  getAvailableRequestedList,
  createRequestApprovalEFaktur,
  createRequestReplacementEFaktur,
  createRequestCancellationEFaktur,
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

  // Filter berdasarkan approvalLevel (Submitter atau Final Approver)
  const levelData = dataTable.filter(
    (approval) => approval.approvalLevel === approvalLevel
  );

  // Ambil semua employee dari level tersebut
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

const ModalRequestApprovalEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const {
    loading_available_requested,
    loading_modal,
    data_available_requested,
    data_approval,
    data_approval_list,
    pagination_available_requested,
    user_info,
  } = useSelector((state) => state.efaktur);

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("invoiceDate~desc");
  const [filterType, setFilterType] = useState("normal");

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
          type: filterType,
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
      dispatch(getAllApprovalList());
    }
  }, [isOpen, dispatch, search, page, pageSize, sort, filterType]);

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
      title: "E-FAKTUR",
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

    if (!remark) {
      setErrorMessage("Please input remark/reason");
      setModalError(true);
      return;
    }

    try {
      const efakturIds = selectedRows.map((row) => String(row.efakturId));
      const apphierId = String(formValues.apphierId);
      const reasonText = remark.trim();

      switch (filterType) {
        case "normal":
          await dispatch(
            createRequestApprovalEFaktur({
              apphierId: apphierId,
              efakturIds: efakturIds,
              remark: reasonText,
            })
          ).unwrap();
          break;

        case "replacement":
          await dispatch(
            createRequestReplacementEFaktur({
              apphierId: apphierId,
              efakturIds: efakturIds,
              reason: reasonText,
            })
          ).unwrap();
          break;

        case "cancellation":
          await dispatch(
            createRequestCancellationEFaktur({
              apphierId: apphierId,
              efakturIds: efakturIds,
              reason: reasonText,
            })
          ).unwrap();
          break;

        case "manual_upload":
          setErrorMessage(
            "Manual upload tidak support request approval. Silakan gunakan Generate XML."
          );
          setModalError(true);
          return;

        default:
          setErrorMessage(`Type "${filterType}" tidak dikenali`);
          setModalError(true);
          return;
      }

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
    setSearch({});
    setFilterType("normal");
    handleClose();
  };

  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  const getRemarkLabel = () => {
    switch (filterType) {
      case "normal":
        return "Remark";
      case "replacement":
        return "Replacement Reason";
      case "cancellation":
        return "Cancellation Reason";
      case "manual_upload":
        return "Note";
      default:
        return "Remark";
    }
  };

  const getRemarkPlaceholder = () => {
    switch (filterType) {
      case "normal":
        return "Type your remark";
      case "replacement":
        return "Type your reason for replacement";
      case "cancellation":
        return "Type your reason for cancellation";
      case "manual_upload":
        return "Type your note";
      default:
        return "Type your remark";
    }
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
      key: "accountName",
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      align: "left",
      sorter: true,
      filteredValue: [search?.accountName] || null,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text || "-",
          true,
          "input",
          search
        ),
    },
    {
      key: "invoiceDate",
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      width: 120,
      align: "center",
      sorter: true,
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      key: "efakturDate",
      title: "EFAKTUR DATE",
      dataIndex: "efakturDate",
      width: 120,
      align: "center",
      sorter: true,
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
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
        <Spin spinning={loading_available_requested || loading_modal}>
          <div className="my-6">
            <CustomSteps current={current} steps={steps} />

            <Form layout="vertical" form={form}>
              {/* STEP 1: E-FAKTUR LIST */}
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
                      style={{ width: 200 }}
                      className="filter-type-select"
                    >
                      <Select.Option value="normal">Normal</Select.Option>
                      <Select.Option value="replacement">
                        Replacement
                      </Select.Option>
                      <Select.Option value="cancellation">
                        Cancellation
                      </Select.Option>
                    </Select>
                  </div>

                  <p className="text-primary uppercase font-bold mb-4 text-sm">
                    E-FAKTUR LIST
                  </p>

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
                    tableScrolled={{ x: 2000, y: 400 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_available_requested}
                    rowSelection={rowSelection}
                  />
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    {getRemarkLabel()}
                    <span className="text-red-500 ml-1">*</span>
                  </p>
                  <Form.Item
                    name="remark"
                    rules={[
                      {
                        required: true,
                        message: `Please input your ${getRemarkLabel().toLowerCase()}!`,
                      },
                    ]}
                  >
                    <InputComponent
                      rows={3}
                      type="textarea"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder={getRemarkPlaceholder()}
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
                        loading={loading_available_requested}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {data_approval &&
                          data_approval.map((data, index) => (
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

                {/* APPROVER SECTION - HANYA INI YANG DITAMPILKAN */}
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

                {/* E-FAKTUR LIST */}
                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-3 text-sm">
                    E-FAKTUR LIST
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

export default ModalRequestApprovalEFaktur;
