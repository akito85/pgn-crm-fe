import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Steps, Select } from "antd";
import { RightOutlined } from "@ant-design/icons";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
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

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

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

  // ✅ Dynamic Label untuk Remark berdasarkan Type
  const getRemarkLabel = () => {
    switch (filterType) {
      case "normal":
        return "Request";
      case "replacement":
        return "Replacement Reason";
      case "cancellation":
        return "Cancellation Reason";
      case "manual_upload":
        return "Note";
      default:
        return "Request/Reason";
    }
  };

  const getRemarkPlaceholder = () => {
    switch (filterType) {
      case "normal":
        return "Type your request";
      case "replacement":
        return "Type your reason for replacement";
      case "cancellation":
        return "Type your reason for cancellation";
      case "manual_upload":
        return "Type your note";
      default:
        return "Type your request or reason";
    }
  };

  // Columns untuk Step 1
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
          const typeColors = {
            STANDARD: "bg-blue-100 text-blue-800 border-blue-300",
            REPLACEMENT: "bg-orange-100 text-orange-800 border-orange-300",
            CANCELLATION: "bg-red-100 text-red-800 border-red-300",
          };

          const displayType = type || "STANDARD";

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  typeColors[displayType] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {displayType}
              </span>
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
          const statusColors = {
            FAILED: "bg-red-100 text-red-800 border-red-300",
            CANCELLED: "bg-gray-100 text-gray-800 border-gray-300",
            APPROVED: "bg-green-100 text-green-800 border-green-300",
          };

          const displayStatus = status || "FAILED";

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[displayStatus] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {displayStatus}
              </span>
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

  // Columns untuk Approval Table (Step 2)
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
        header={`REQUEST APPROVAL - ${filterType.toUpperCase()}`}
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
            {current > 0 && current < steps.length - 1 && (
              <ButtonComponent
                onClick={prev}
                type="submit"
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                disabled={loading_modal}
              >
                Previous
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={next}
                type="submit"
                disabled={steps[current].disabled || loading_modal}
              >
                <span className="p-1 text-[18px]">Next</span>
                <RightOutlined style={{ fontSize: "18px", color: "#fff" }} />
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
            {/* STEPS */}
            <div className="mb-8">
              <Steps
                current={current}
                items={items}
                labelPlacement="vertical"
                size="small"
                className="custom-steps"
              />
            </div>

            <Form layout="vertical" form={form}>
              {/* STEP 1: E-FAKTUR LIST */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-4">
                    E-FAKTUR LIST
                  </p>

                  {/* Filter Type Dropdown */}
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
                      <Select.Option value="manual_upload" disabled>
                        Manual Upload (Use Generate XML)
                      </Select.Option>
                    </Select>
                  </div>

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

                {/* Remark - Dynamic Label */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    {getRemarkLabel()}
                    <span className="text-red-500">*</span>
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
                  <p className="text-primary uppercase font-bold mb-4">
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
                {/* Review Type */}
                <div className="mb-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <h3 className="text-base font-bold text-purple-800 mb-4 pb-2 border-b-2 border-purple-200">
                    Request Type
                  </h3>
                  <DetailText label="Type">
                    <span className="font-bold text-lg uppercase">
                      {filterType}
                    </span>
                  </DetailText>
                </div>

                {/* Review Remark */}
                <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    {getRemarkLabel()}
                  </h3>
                  <DetailText label={getRemarkLabel()}>{remark}</DetailText>
                </div>

                {/* Review Approver */}
                <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                    APPROVER
                  </h3>
                  {dataTable.length > 0 && (
                    <div className="mb-4">
                      {dataTable.map((approval, idx) => (
                        <div key={idx} className="mb-3">
                          <p className="text-sm font-medium text-gray-700">
                            {idx + 1}. {approval.position} -{" "}
                            {approval.hierarchy}
                          </p>
                          {approval.employeeDetail &&
                            approval.employeeDetail.length > 0 && (
                              <ul className="ml-6 mt-1">
                                {approval.employeeDetail.map((emp, empIdx) => (
                                  <li
                                    key={empIdx}
                                    className="text-xs text-gray-600"
                                  >
                                    • {emp.employeeName} ({emp.email})
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review E-Faktur List */}
                <div className="mb-6 p-5 bg-green-50 border-2 border-green-300 rounded-lg">
                  <h3 className="text-base font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                    E-FAKTUR LIST
                  </h3>
                  <TableRBI
                    dataSource={selectedRows}
                    columns={processedColumns}
                    current={1}
                    pageSize={selectedRows.length}
                    totalData={selectedRows.length}
                    tableScrolled={{ x: 2000, y: 300 }}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                    usePagination={false}
                  />
                  <div className="mt-4 p-4 bg-white rounded">
                    <DetailText label="Total Selected">
                      {selectedRows.length} item(s)
                    </DetailText>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Spin>
      </ModalCustom>

      {/* Success Modal */}
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleSuccessClose}
        handleCancel={() => setModalSuccess(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success"]}
            <p className="text-[18px] font-bold">Success</p>
          </div>
          <p className="pl-[70px]">
            Request {filterType} has been submitted successfully.
          </p>
          <p className="pl-[70px]">
            Total Requested: <strong>{selectedRows.length}</strong> E-Faktur
          </p>
        </div>
      </ModalSuccess>

      {/* Error Modal */}
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
