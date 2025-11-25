import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Steps, Select, Progress } from "antd";
import {
  RightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
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
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";
import {
  getEligibleEFakturForRequest,
  getAllApprovalList,
  getListApprovalById,
  bulkRequestApprovalEFaktur,
  getListCategory,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import {
  columnsApproval,
  columnsExpandApproval,
} from "../../Billing/Detail/Table/TableApproval";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import moment from "moment";

const ModalBulkRequestApproval = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const {
    loading,
    loading_modal,
    data_eligible_efaktur,
    data_approval,
    data_approval_list,
    dataListCategory,
    upload_progress,
  } = useSelector((state) => state.efaktur);

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [remark, setRemark] = useState("");
  const [listDataAttachment, setListDataAttachment] = useState([]);
  
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const dataSource = data_eligible_efaktur || [];

  useEffect(() => {
    if (isOpen) {
      dispatch(getEligibleEFakturForRequest({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }));
      dispatch(getAllApprovalList());
      dispatch(getListCategory());
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
      title: "E-FAKTUR SELECTION",
      disabled: selectedRowKeys.length === 0 || !remark,
    },
    {
      title: "APPROVAL INFORMATION",
      disabled: !form.getFieldValue()?.apphierId,
    },
    {
      title: "ATTACHMENT",
      disabled: false,
    },
    {
      title: "CONFIRMATION & SUBMIT",
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
  };

  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  const calculateSummary = () => {
    if (selectedRows.length === 0) {
      return {
        totalItems: 0,
        totalAmount: 0,
        customers: [],
        uniqueCustomers: 0,
      };
    }

    const totalAmount = selectedRows.reduce(
      (sum, item) => sum + (item.totalAmountEqvIdr || 0),
      0
    );

    const customerMap = new Map();
    selectedRows.forEach((item) => {
      const customer = item.customerName;
      customerMap.set(customer, (customerMap.get(customer) || 0) + 1);
    });

    const customers = Array.from(customerMap.entries()).map(
      ([name, count]) => ({ name, count })
    );

    return {
      totalItems: selectedRows.length,
      totalAmount,
      customers,
      uniqueCustomers: customerMap.size,
    };
  };

  const summary = calculateSummary();

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
      setErrorMessage("Please input remark");
      setModalError(true);
      return;
    }

    const payload = {
      efakturIds: selectedRows.map((row) => row.efakturId),
      apphierId: formValues.apphierId,
      remark: remark,
    };

    try {
      const result = await dispatch(
        bulkRequestApprovalEFaktur({
          requestData: payload,
          attachments: listDataAttachment,
        })
      ).unwrap();

      setSuccessData({
        totalRequested: result.totalRequested || selectedRows.length,
        successCount: result.successCount || selectedRows.length,
        failedCount: result.failedCount || 0,
        summary: result.summary,
      });

      setModalSuccess(true);
    } catch (error) {
      const errorMsg =
        error?.message || "Failed to submit bulk request approval";
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
    setListDataAttachment([]);
    setCurrent(0);
    setSearch({});
    setSuccessData(null);
    handleClose();
  };

  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  // Columns untuk Step 1
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "efakturNo",
        title: "KODE FAKTUR",
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
        key: "customerName",
        title: "CUSTOMER",
        dataIndex: "customerName",
        width: 250,
        align: "left",
        sorter: true,
        filteredValue: [search?.customerName] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "customerName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "customerName",
            hasValue(search["customerName"]),
            searchText,
            text,
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
        key: "totalAmountEqvIdr",
        title: "TOTAL AMOUNT (IDR)",
        dataIndex: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        sorter: true,
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "efakturStatus",
        title: "STATUS",
        dataIndex: "efakturStatus",
        width: 150,
        align: "center",
        sorter: true,
        render: (status) => {
          const statusColors = {
            NOT_GENERATED: "bg-gray-100 text-gray-800 border-gray-300",
            FAILED: "bg-red-100 text-red-800 border-red-300",
            REJECTED: "bg-red-100 text-red-800 border-red-300",
          };

          const displayStatus = status || "NOT_GENERATED";
          const statusLabel = displayStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[displayStatus] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {statusLabel}
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

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Bulk Request Approval E-Faktur"
        handleCancel={handleCancel}
        width={1200}
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
                {loading_modal ? "Submitting..." : "Submit"}
              </ButtonComponent>
            )}
          </div>
        }
      >
        <Spin spinning={loading || loading_modal}>
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
              {/* STEP 1: E-FAKTUR SELECTION */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-4">
                    Select E-Faktur for Request Approval
                  </p>

                  <TableRBI
                    dataSource={dataSource}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={dataSource?.length || 0}
                    tableScrolled={{ x: 1800, y: 400 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading}
                    rowSelection={rowSelection}
                  />
                </div>

                {/* Summary Box */}
                {selectedRows.length > 0 && (
                  <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h3 className="text-base font-bold text-blue-800 mb-4">
                      Selection Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailText label="Total Selected">
                        {summary.totalItems} item(s)
                      </DetailText>
                      <DetailText label="Total Amount">
                        Rp {summary.totalAmount.toLocaleString("id-ID")}
                      </DetailText>
                      <DetailText label="Unique Customers">
                        {summary.uniqueCustomers} customer(s)
                      </DetailText>
                      <div className="col-span-2">
                        <DetailText label="Customer Details">
                          {summary.customers
                            .map((c) => `${c.name} (${c.count})`)
                            .join(", ")}
                        </DetailText>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remark */}
                <div className="mb-6">
                  <Form.Item
                    label="Remark"
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
                      placeholder="Type your remark for bulk request approval..."
                    />
                  </Form.Item>
                </div>
              </div>

              {/* STEP 2: APPROVAL INFORMATION */}
              <div className={`${current !== 1 ? "hidden" : ""}`}>
                <div className="w-full grid grid-cols-1 gap-x-4">
                  <p className="text-primary uppercase font-bold mb-4">
                    Approval Information
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
                        loading={loading}
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
                    <TablePaginationNew
                      type="FE"
                      dataSource={dataTable}
                      columns={columnsApproval(
                        page,
                        pageSize,
                        searchInput,
                        searchedColumn,
                        searchText,
                        handleSearch
                      )}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div>
                            <p className="text-primary text-xs font-bold uppercase pt-4">
                              EMPLOYEE INFORMATION
                            </p>
                            <TablePaginationNew
                              type="FE"
                              useSelect={false}
                              usePagination={false}
                              dataSource={record?.employeeDetail}
                              columns={columnsExpandApproval(
                                page,
                                pageSize,
                                searchInput,
                                searchedColumn,
                                searchText,
                                handleSearch
                              )}
                              className={"mb-4"}
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

              {/* STEP 3: ATTACHMENT */}
              <div className={`${current !== 2 ? "hidden" : ""}`}>
                <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    Attachment Information (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload attachments for this bulk request. This is optional
                    and can be skipped.
                  </p>
                  <AttachmentComponent
                    type="create"
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    dispatch={dispatch}
                    getAPICategory={getListCategory}
                    typeSelector="efaktur"
                    service={ratingBillingHttpService}
                    configApplication={configApp.RATING_BILLING_SERVICE}
                    getAPIGuard={getConfigFileRBIData}
                    typeRBI={"efaktur"}
                    mandatory={false}
                  />
                </div>
              </div>

              {/* STEP 4: CONFIRMATION */}
              <div className={`${current !== 3 ? "hidden" : ""}`}>
                {!loading_modal && (
                  <>
                    {/* Review Selected E-Faktur */}
                    <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                      <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                        Review - Selected E-Faktur
                      </h3>
                      <TableRBI
                        dataSource={selectedRows}
                        columns={processedColumns}
                        current={1}
                        pageSize={selectedRows.length}
                        totalData={selectedRows.length}
                        tableScrolled={{ x: 1800, y: 300 }}
                        columnDefinitions={columnDefinitions}
                        fixedColumns={fixedColumns}
                        setFixedColumns={setFixedColumns}
                        loading={false}
                        usePagination={false}
                      />
                      <div className="mt-4 p-4 bg-blue-50 rounded">
                        <div className="grid grid-cols-2 gap-4">
                          <DetailText label="Total Items">
                            {summary.totalItems}
                          </DetailText>
                          <DetailText label="Total Amount">
                            Rp {summary.totalAmount.toLocaleString("id-ID")}
                          </DetailText>
                        </div>
                      </div>
                      <div className="mt-4">
                        <DetailText label="Remark">{remark}</DetailText>
                      </div>
                    </div>

                    {/* Review Approval */}
                    <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                        Review - Approval Information
                      </h3>
                      <DetailText label="Approval Hierarchy">
                        {data_approval
                          ?.filter(
                            (a) =>
                              a.appHierId === form.getFieldValue()?.apphierId
                          )
                          ?.find((b) => b.approvalName)?.approvalName || "-"}
                      </DetailText>
                    </div>

                    {/* Review Attachment */}
                    <div className="mb-6 p-5 bg-green-50 border-2 border-green-300 rounded-lg">
                      <h3 className="text-base font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-200">
                        Review - Attachment Information
                      </h3>
                      <DetailText label="Total Attachments">
                        {listDataAttachment.length} file(s)
                      </DetailText>
                      {listDataAttachment.length > 0 && (
                        <div className="mt-3">
                          <ul className="list-disc pl-5">
                            {listDataAttachment.map((att, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                {att.fileName || att.file.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {listDataAttachment.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          No attachments uploaded
                        </p>
                      )}
                    </div>
                  </>
                )}

                {loading_modal && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Processing Bulk Request Approval:
                    </p>
                    <Progress
                      percent={Math.floor(upload_progress)}
                      status={upload_progress === 100 ? "success" : "active"}
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {upload_progress < 30 && "Processing request..."}
                      {upload_progress >= 30 &&
                        upload_progress < 60 &&
                        "Submitting to approval system..."}
                      {upload_progress >= 60 &&
                        upload_progress < 90 &&
                        "Uploading attachments..."}
                      {upload_progress >= 90 &&
                        upload_progress < 100 &&
                        "Finalizing..."}
                      {upload_progress === 100 && "Done!"}
                    </p>
                  </div>
                )}
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
            Bulk request approval has been submitted successfully.
          </p>
          {successData && (
            <>
              <p className="pl-[70px]">
                Total Requested: <strong>{successData.totalRequested}</strong>
              </p>
              {successData.summary && (
                <div className="pl-[70px] mt-3">
                  <p className="text-sm">
                    Success: {successData.successCount}
                    {successData.failedCount > 0 &&
                      `, Failed: ${successData.failedCount}`}
                  </p>
                </div>
              )}
            </>
          )}
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

export default ModalBulkRequestApproval;