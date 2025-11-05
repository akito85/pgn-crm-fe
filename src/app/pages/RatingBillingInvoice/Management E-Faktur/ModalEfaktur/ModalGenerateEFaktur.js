// ✅ BEST PRACTICE: Component hanya handle UI dan dispatch action
// Semua logic API ada di slice

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Table, Alert, Progress, Spin, Steps } from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../components/SelectComponent";
import DetailText from "../../../../../components/DetailText";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import {
  getAllBillingItemPaginate,
  generateEFakturWithAttachments, // ✅ NEW: All-in-one action
  getListCategory,
  getAllApprovalList,
  getListApprovalById,
  resetUploadProgress,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import {
  columnsApproval,
  columnsExpandApproval,
} from "../../Billing/Detail/Table/TableApproval";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const ModalGenerateEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const searchInput = useRef(null);

  // ✅ Selector dari Redux State
  const {
    loading,
    loading_modal,
    loading_detail,
    dataListCategory,
    data_approval,
    data_approval_list,
    data_billingItem,
    upload_progress, // ✅ Progress dari slice
    upload_results,  // ✅ Upload results dari slice
  } = useSelector((state) => state.efaktur);

  // State untuk UI
  const [current, setCurrent] = useState(0);
  const [billingItems, setBillingItems] = useState([]);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedData, setGeneratedData] = useState(null);

  // State untuk approval
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // State untuk attachment
  const [listDataAttachment, setListDataAttachment] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllApprovalList());
      dispatch(getListCategory());
      dispatch(resetUploadProgress()); // ✅ Reset progress saat buka modal
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isOpen && billingData?.billingCode) {
      dispatch(getAllBillingItemPaginate(billingData.billingCode));
    }
  }, [isOpen, billingData, dispatch]);

  useEffect(() => {
    if (data_billingItem) {
      setBillingItems(data_billingItem);
    }
  }, [data_billingItem]);

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

  // Steps definition
  const steps = [
    { title: "BILLING INFORMATION", disabled: false },
    { title: "APPROVAL INFORMATION", disabled: !form.getFieldValue()?.apphierId },
    { title: "ATTACHMENT", disabled: false },
    { title: "CONFIRMATION & GENERATE", disabled: false },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Navigation functions
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const scrollLeftHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 250;
  };

  const scrollRightHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 250;
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Table columns
  const columnsItems = [
    {
      title: "#",
      dataIndex: "lineNumber",
      key: "lineNumber",
      width: 50,
      align: "center",
    },
    {
      title: "Produk/Jasa",
      dataIndex: "productName",
      key: "productName",
      width: 300,
    },
    {
      title: "Kuantitas",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value) => {
        const formatted =
          value % 1 === 0
            ? value.toLocaleString("id-ID")
            : value.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
        return formatted;
      },
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
      width: 80,
      align: "center",
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 150,
      align: "right",
      render: (value, record) => {
        const symbol = record.currency === "USD" ? "$" : "Rp";
        const formatted = value.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `${symbol} ${formatted}`;
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 180,
      align: "right",
      render: (value, record) => {
        const symbol = record.currency === "USD" ? "$" : "Rp";
        const formatted = value.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return (
          <span className="font-semibold text-gray-900">
            {symbol} {formatted}
          </span>
        );
      },
    },
  ];

  // Calculate totals
  const calculateTotals = () => {
    const totalDpp = billingItems
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return !itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + item.total, 0);

    const totalPpn = billingItems
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + item.total, 0);

    const total = totalDpp + totalPpn;

    return { totalDpp, totalPpn, total };
  };

  const totals = calculateTotals();
  const currency = billingItems[0]?.currency || "IDR";

  // ✅ BEST PRACTICE: Component hanya dispatch, semua logic di slice
  const handleGenerate = async (formValues) => {
    if (!billingData) {
      setErrorMessage("Data billing tidak ditemukan");
      setModalError(true);
      return;
    }

    if (!formValues.apphierId) {
      setErrorMessage("Please select approval hierarchy");
      setModalError(true);
      return;
    }

    if (listDataAttachment.length === 0) {
      setErrorMessage("Attachment is mandatory. Please upload at least one file.");
      setModalError(true);
      return;
    }

    // ✅ Prepare data untuk dispatch
    const efakturData = {
      apphierId: formValues.apphierId,
      billingCode: billingData.billingCode,
      invoiceNumber: billingData.invoiceNumber || billingData.billingCode,
      invoiceDate: billingData.invoiceDate,
      invoiceDueDate: billingData.dueDate || billingData.invoiceDate,
      dpp: totals.totalDpp,
      ppn: totals.totalPpn,
      totalAmount: totals.total,
      remark: formValues.remark || "Generated via system",
      status: "SUBMIT",
    };

    console.log("📤 Dispatching generateEFakturWithAttachments...");

    try {
      // ✅ Dispatch single action - semua logic di slice
      const result = await dispatch(
        generateEFakturWithAttachments({
          efakturData,
          attachments: listDataAttachment,
        })
      ).unwrap();

      console.log("✅ Generation completed:", result);

      // ✅ Set data untuk modal success
      setGeneratedData({
        einvoiceId: result.efaktur.einvoiceId,
        invoiceNumber: result.efaktur.invoiceNumber,
        efakturNo: result.efaktur.efakturNo,
        status: result.efaktur.status,
        billingCode: result.efaktur.billingCode,
        totalAmount: result.efaktur.totalAmount,
        createdDtm: result.efaktur.createdDtm,
        uploadResults: result.uploadResults,
        summary: result.summary,
      });

      setModalSuccess(true);

    } catch (error) {
      console.error("❌ Error:", error);
      const errorMsg = error?.message || "Gagal generate E-Faktur";
      setErrorMessage(errorMsg);
      setModalError(true);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setBillingItems([]);
    setGeneratedData(null);
    setBoolean(false);
    setDataTable([]);
    setListDataAttachment([]);
    setCurrent(0);
    dispatch(resetUploadProgress());
    handleClose();
  };

  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Generate E-Faktur ke PJAP dengan Approval"
        handleCancel={handleCancel}
        width={800}
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
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type="submit"
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                disabled={loading_modal}
              >
                Previous
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={handleButtonNext}
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
                htmlType="submit"
                form="formGenerateEfaktur"
                loading={loading_modal}
                disabled={loading_modal}
                icon={<ThunderboltOutlined />}
              >
                {loading_modal ? "Generating..." : "Generate & Kirim"}
              </ButtonComponent>
            )}
          </div>
        }
      >
        <Spin spinning={loading || loading_detail}>
          <div className="my-6">
            {/* Steps */}
            <div className="flex flex-row justify-center mb-6">
              <div
                ref={containerRef}
                className="overflow-x-scroll scrollStepsCstm"
              >
                <div className="flex flex-row justify-center mb-6 px-32">
                  <div className="w-full max-w-xl">
                    <Steps
                      current={current}
                      items={items}
                      labelPlacement="vertical"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Form
              layout="vertical"
              form={form}
              id="formGenerateEfaktur"
              onFinish={handleGenerate}
            >
              {/* STEP 1: BILLING INFORMATION */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                {billingData && (
                  <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                    <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                      Informasi Billing
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <DetailText label="Billing Code">
                        {billingData.billingCode}
                      </DetailText>
                      <DetailText label="Customer">
                        {billingData.customerName}
                      </DetailText>
                      <DetailText label="Invoice Date">
                        {billingData.invoiceDate}
                      </DetailText>
                      <DetailText label="Account Number">
                        {billingData.accountNumber}
                      </DetailText>
                    </div>
                  </div>
                )}

                <div className="mb-6 p-5 bg-white border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    Rincian Item Billing
                  </h3>
                  <Table
                    dataSource={billingItems}
                    columns={columnsItems}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: 900 }}
                    loading={loading_detail}
                  />
                </div>

                <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                    Ringkasan ({currency})
                  </h3>
                  <div className="flex justify-between items-center pt-3 pb-2 px-3 border-t-2 border-blue-300 bg-blue-100 rounded">
                    <span className="text-base font-bold text-blue-900">
                      Total Tagihan:
                    </span>
                    <span className="text-xl font-bold text-blue-700">
                      {currency === "USD" ? "$" : "Rp"}{" "}
                      {totals.total.toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
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
                      <SelectComponent onChange={handleSelect}>
                        {data_approval &&
                          data_approval?.map((data, index) => (
                            <SelectComponent.Option value={data.appHierId} key={index}>
                              {data.approvalName}
                            </SelectComponent.Option>
                          ))}
                      </SelectComponent>
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
                    Attachment Information
                  </h3>
                  <AttachmentComponent
                    type="create"
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    dispatch={dispatch}
                    getAPICategory={getListCategory}
                    typeSelector="efaktur"
                    
                    configApplication={configApp.RATING_BILLING_SERVICE}
                    getAPIGuard={getConfigFileRBIData}
                    typeRBI={"data"}
                  />
                </div>
              </div>

              {/* STEP 4: CONFIRMATION & GENERATE */}
              <div className={`${current !== 3 ? "hidden" : ""}`}>
                {!loading_modal && !generatedData && (
                  <>
                    <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                      <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                        Review - Billing Information
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <DetailText label="Billing Code">
                          {billingData?.billingCode}
                        </DetailText>
                        <DetailText label="Customer">
                          {billingData?.customerName}
                        </DetailText>
                        <DetailText label="Total Amount">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.total.toLocaleString("id-ID")}
                        </DetailText>
                      </div>
                    </div>

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
                    </div>

                    <Alert
                      message="Ready to Generate"
                      description="Semua data sudah lengkap. Klik tombol 'Generate & Kirim' untuk memproses E-Faktur ke PJAP."
                      type="info"
                      showIcon
                    />
                  </>
                )}

                {/* ✅ Progress dari Redux State */}
                {loading_modal && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Progress Generate E-Faktur:
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
                      {upload_progress < 30 && "Memproses data billing..."}
                      {upload_progress >= 30 && upload_progress < 50 && "Membuat E-Faktur..."}
                      {upload_progress >= 50 && upload_progress < 70 && "Mengirim ke sistem..."}
                      {upload_progress >= 70 && upload_progress < 100 && "Mengupload attachment..."}
                      {upload_progress === 100 && "Selesai!"}
                    </p>
                  </div>
                )}

                {generatedData && (
                  <Alert
                    message="E-Faktur Berhasil Di-generate!"
                    description={
                      <div>
                        <p>
                          Invoice Number: <strong>{generatedData.invoiceNumber}</strong>
                        </p>
                        {generatedData.efakturNo && (
                          <p>
                            No. E-Faktur: <strong>{generatedData.efakturNo}</strong>
                          </p>
                        )}
                        <p>
                          Status:{" "}
                          <strong className="text-orange-600">{generatedData.status}</strong>
                        </p>
                        
                        {/* ✅ Show upload summary */}
                        {generatedData.summary && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-semibold">Upload Summary:</p>
                            <p className="text-xs">
                              ✓ {generatedData.summary.successCount} berhasil
                              {generatedData.summary.failedCount > 0 && 
                                `, ✗ ${generatedData.summary.failedCount} gagal`}
                            </p>
                          </div>
                        )}
                      </div>
                    }
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}
              </div>
            </Form>
          </div>
        </Spin>
      </ModalCustom>

      {/* Modal Success */}
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
            E-Faktur berhasil di-generate dan dikirim untuk approval.
          </p>
          {generatedData?.invoiceNumber && (
            <p className="pl-[70px]">
              Invoice Number: <strong>{generatedData.invoiceNumber}</strong>
            </p>
          )}
          {generatedData?.status && (
            <p className="pl-[70px]">
              Status: <strong className="text-orange-600">{generatedData.status}</strong>
            </p>
          )}
          
          {/* ✅ Show upload results */}
          {generatedData?.summary && (
            <div className="pl-[70px] mt-3">
              <p className="text-sm">
                Attachment: {generatedData.summary.successCount} berhasil
                {generatedData.summary.failedCount > 0 && 
                  `, ${generatedData.summary.failedCount} gagal`}
              </p>
            </div>
          )}
        </div>
      </ModalSuccess>

      {/* Modal Error */}
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
          <p className="pl-[70px]">Silakan coba lagi.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalGenerateEFaktur;