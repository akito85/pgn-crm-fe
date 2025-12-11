import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Steps, Select, Upload, Button } from "antd";
import { RightOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
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
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";

const ModalUploadEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const {
    loading_available_requested,
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
  const [efakturNumbers, setEfakturNumbers] = useState({}); // { efakturId: "nomor" }
  const [uploadedFiles, setUploadedFiles] = useState({}); // { efakturId: File }
  
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [remark, setRemark] = useState("");

  const [loading_modal, setLoadingModal] = useState(false);
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

  // Load data ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAvailableRequestedList({
          page,
          pageSize,
          sort,
          type: "manual_upload", // ✅ Default type untuk manual upload
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
      title: "E-FAKTUR",
      disabled: selectedRowKeys.length === 0 || !remark || !allSelectedHaveNumbers(),
    },
    {
      title: "ATTACHMENT",
      disabled: !allSelectedHaveFiles(),
    },
    {
      title: "APPROVAL",
      disabled: !form.getFieldValue()?.apphierId,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  // ✅ Check apakah semua E-Faktur yang dipilih sudah punya nomor
  function allSelectedHaveNumbers() {
    return selectedRowKeys.every((key) => {
      const number = efakturNumbers[key];
      return number && number.trim().length > 0;
    });
  }

  // ✅ Check apakah semua E-Faktur yang dipilih sudah punya file
  function allSelectedHaveFiles() {
    return selectedRowKeys.every((key) => uploadedFiles[key]);
  }

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
    
    // ✅ Clean up data untuk row yang di-uncheck
    const removedKeys = selectedRowKeys.filter(k => !newSelectedRowKeys.includes(k));
    removedKeys.forEach(key => {
      delete efakturNumbers[key];
      delete uploadedFiles[key];
    });
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

  // ✅ Handle change nomor faktur
  const handleNumberChange = (efakturId, value) => {
    setEfakturNumbers(prev => ({
      ...prev,
      [efakturId]: value
    }));
  };

  // ✅ Handle file upload
  const handleFileUpload = (efakturId, file) => {
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (!isPDF) {
      setErrorMessage("Hanya file PDF yang diperbolehkan!");
      setModalError(true);
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      setErrorMessage("File tidak boleh lebih dari 10MB!");
      setModalError(true);
      return false;
    }

    setUploadedFiles(prev => ({
      ...prev,
      [efakturId]: file
    }));
    
    return false; // Prevent auto upload
  };

  // ✅ Handle remove file
  const handleRemoveFile = (efakturId) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[efakturId];
      return newFiles;
    });
  };

  // ✅ HANDLE SUBMIT
  const handleSubmit = async () => {
    const formValues = form.getFieldsValue();

    if (selectedRowKeys.length === 0) {
      setErrorMessage("Please select at least one E-Faktur");
      setModalError(true);
      return;
    }

    if (!allSelectedHaveNumbers()) {
      setErrorMessage("Please input Nomor Faktur for all selected E-Faktur");
      setModalError(true);
      return;
    }

    if (!allSelectedHaveFiles()) {
      setErrorMessage("Please upload PDF file for all selected E-Faktur");
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
      setLoadingModal(true);

      const formData = new FormData();
      formData.append("apphierId", String(formValues.apphierId));
      formData.append("remark", remark.trim());

      // ✅ Append data array
      selectedRowKeys.forEach((efakturId, index) => {
        formData.append(`data[${index}].efakturId`, String(efakturId));
        formData.append(`data[${index}].efakturNumber`, efakturNumbers[efakturId]);
        formData.append(`data[${index}].efakturFile`, uploadedFiles[efakturId]);
      });

      const url = "/v1/dbs/api/rbi/e-invoice/batch-manual-upload";
      const response = await ratingBillingHttpService.uploadAttachment(url, formData, () => {});

      if (response.success) {
        setModalSuccess(true);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to upload manual E-Faktur";
      setErrorMessage(errorMsg);
      setModalError(true);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setEfakturNumbers({});
    setUploadedFiles({});
    setBoolean(false);
    setDataTable([]);
    setRemark("");
    setCurrent(0);
    setSearch({});
    handleClose();
  };

  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  // ========================================
  // COLUMNS STEP 1
  // ========================================
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
        key: "inputNumber",
        title: "INPUT NO FAKTUR",
        width: 250,
        align: "left",
        render: (_, record) => {
          const isSelected = selectedRowKeys.includes(record.efakturId);
          if (!isSelected) return "-";
          
          return (
            <InputComponent
              placeholder="Contoh: 00004092893220241216000270"
              value={efakturNumbers[record.efakturId] || ""}
              onChange={(e) => handleNumberChange(record.efakturId, e.target.value)}
            />
          );
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn, selectedRowKeys, efakturNumbers]
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

  // ========================================
  // COLUMNS STEP 2 (ATTACHMENT)
  // ========================================
  const attachmentColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        key: "efakturNo",
        title: "FAKTUR CODE",
        dataIndex: "efakturNo",
        width: 150,
        align: "left",
        render: (text) => text || "-",
      },
      {
        key: "billingCode",
        title: "BILLING CODE",
        dataIndex: "billingCode",
        width: 150,
        align: "left",
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 150,
        align: "left",
        render: (text) => text || "-",
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 150,
        align: "left",
      },
      {
        key: "inputtedNumber",
        title: "NOMOR FAKTUR",
        width: 200,
        align: "left",
        render: (_, record) => (
          <span className="font-semibold text-blue-600">
            {efakturNumbers[record.efakturId] || "-"}
          </span>
        ),
      },
      {
        key: "attachment",
        title: "ATTACHMENT",
        width: 250,
        align: "left",
        render: (_, record) => {
          const file = uploadedFiles[record.efakturId];
          if (file) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            );
          }
          return <span className="text-gray-400">No file</span>;
        },
      },
      {
        key: "action",
        title: "ACTION",
        width: 150,
        align: "center",
        render: (_, record) => {
          const file = uploadedFiles[record.efakturId];
          
          return (
            <div className="flex gap-2 justify-center">
              <Upload
                accept=".pdf"
                beforeUpload={(file) => handleFileUpload(record.efakturId, file)}
                showUploadList={false}
                maxCount={1}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  size="small"
                  type={file ? "default" : "primary"}
                >
                  {file ? "Change" : "Upload"}
                </Button>
              </Upload>
              
              {file && (
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={() => handleRemoveFile(record.efakturId)}
                >
                  Remove
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [selectedRows, efakturNumbers, uploadedFiles]
  );

  // ========================================
  // APPROVAL TABLE COLUMNS
  // ========================================
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
        header="UPLOAD E-FAKTUR MANUAL"
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
                {loading_modal ? "Uploading..." : "Submit"}
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

                  <TableRBI
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    onSizeChanger={handleChangePage}
                    totalData={pagination_available_requested?.totalElements || 0}
                    tableScrolled={{ x: 2000, y: 400 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_available_requested}
                    rowSelection={rowSelection}
                  />
                </div>

                {/* Remark */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Remark <span className="text-red-500">*</span>
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

              {/* STEP 2: ATTACHMENT */}
              <div className={`${current !== 1 ? "hidden" : ""}`}>
                <div className="mb-6">
                  <p className="text-primary uppercase font-bold mb-4">
                    UPLOAD ATTACHMENT
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload PDF file untuk setiap E-Faktur yang dipilih. Maksimal ukuran file 10MB per file.
                  </p>

                  <TableRBI
                    dataSource={selectedRows}
                    columns={attachmentColumns}
                    current={1}
                    pageSize={selectedRows.length}
                    totalData={selectedRows.length}
                    tableScrolled={{ x: 1500, y: 400 }}
                    loading={false}
                    usePagination={false}
                    useSelect={false}
                  />
                </div>
              </div>

              {/* STEP 3: APPROVAL */}
              <div className={`${current !== 2 ? "hidden" : ""}`}>
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

                  {/* Review Section */}
                  <div className="mt-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                      REVIEW DATA
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailText label="Total E-Faktur">
                        <span className="font-bold">{selectedRows.length} item(s)</span>
                      </DetailText>
                      <DetailText label="Total Files Uploaded">
                        <span className="font-bold">{Object.keys(uploadedFiles).length} file(s)</span>
                      </DetailText>
                      <DetailText label="Remark" className="col-span-2">
                        {remark}
                      </DetailText>
                    </div>
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
            <p className="text-[18px] font-bold">Upload Berhasil</p>
          </div>
          <p className="pl-[70px]">
            Manual E-Faktur berhasil diupload untuk approval.
          </p>
          <p className="pl-[70px]">
            Total: <strong>{selectedRows.length}</strong> E-Faktur
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
            <p className="text-[18px] font-bold">Upload Gagal</p>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          <p className="pl-[70px]">Silakan coba lagi.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalUploadEFaktur;