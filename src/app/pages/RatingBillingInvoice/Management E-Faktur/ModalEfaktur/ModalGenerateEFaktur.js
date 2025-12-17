import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Table, Alert, Progress, Spin, Steps, Select } from "antd";
import {
  SaveOutlined,
  CheckCircleOutlined,
  RightOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
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
  getDetailEFaktur,
  generateEFakturWithAttachments,
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
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";

const ModalGenerateEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const {
    loading,
    loading_modal,
    loading_detail,
    dataListCategory,
    data_approval,
    data_approval_list,
    data_billingItem,
    upload_progress,
    upload_results,
  } = useSelector((state) => state.efaktur);

  const [existingEFaktur, setExistingEFaktur] = useState(null);
  const [isExistingEFaktur, setIsExistingEFaktur] = useState(false);
  const [current, setCurrent] = useState(0);
  const [billingItems, setBillingItems] = useState([]);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [saveType, setSaveType] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [detailData, setDetailData] = useState({
    npwp: null,
    nikPasp: null,
    email: null,
    alamat: null,
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllApprovalList());
      dispatch(getListCategory());
      dispatch(resetUploadProgress());
      setIsDataLoaded(false);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isOpen && billingData && !isDataLoaded) {
      setIsDataLoaded(true);

      // Load billing items
      if (billingData.billingCode) {
        dispatch(getAllBillingItemPaginate(billingData.billingCode));
      }

      // Load detail E-Faktur jika efakturId tersedia
      if (billingData.efakturId) {
        dispatch(getDetailEFaktur(billingData.efakturId))
          .unwrap()
          .then((result) => {
            if (result && result.efakturId) {
              setExistingEFaktur(result);
              setIsExistingEFaktur(true);
              
              // Set detail data dari existing e-faktur
              setDetailData({
                npwp: result.npwp,
                nikPasp: result.nikPasp,
                email: result.email,
                alamat: result.alamat,
              });
            } else {
              setExistingEFaktur(null);
              setIsExistingEFaktur(false);
              setDetailDataFromBilling();
            }
          })
          .catch(() => {
            setExistingEFaktur(null);
            setIsExistingEFaktur(false);
            setDetailDataFromBilling();
          });
      } else {
        // Jika tidak ada efakturId, gunakan data dari billingData
        setDetailDataFromBilling();
      }
    }
  }, [isOpen, billingData, dispatch, isDataLoaded]);

  // Function untuk set detail data dari billingData jika tidak ada efakturId
  const setDetailDataFromBilling = () => {
    setDetailData({
      npwp: billingData?.npwp || null,
      nikPasp: billingData?.nikPasp || null,
      email: billingData?.email || null,
      alamat: billingData?.alamat || billingData?.address || null,
    });
  };

  useEffect(() => {
    if (data_billingItem && data_billingItem.length > 0) {
      setBillingItems(data_billingItem);
    } else {
      setBillingItems([]);
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

  const steps = [
    { title: "BILLING INFORMATION", disabled: false },
    {
      title: "APPROVAL INFORMATION",
      disabled: !form.getFieldValue()?.apphierId,
    },
    { title: "ATTACHMENT", disabled: false },
    { title: "CONFIRMATION & GENERATE", disabled: false },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

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
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-xs text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Kuantitas",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value) => {
        const numValue =
          typeof value === "string"
            ? parseFloat(value.replace(/,/g, ""))
            : value;

        const formatted =
          numValue % 1 === 0
            ? numValue.toLocaleString("id-ID")
            : numValue.toLocaleString("id-ID", {
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

  const calculateTotals = () => {
    if (!billingItems || billingItems.length === 0) {
      return { totalDpp: 0, totalPpn: 0, total: 0 };
    }

    const totalDpp = billingItems
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return !itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const totalPpn = billingItems
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const total = totalDpp + totalPpn;

    return { totalDpp, totalPpn, total };
  };

  const totals = calculateTotals();
  const currency = billingItems[0]?.currency || "IDR";

  const handleGenerate = async (status) => {
    const formValues = form.getFieldsValue();

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

    // Validasi attachment hanya untuk SUBMIT
    if (status === "SUBMIT" && listDataAttachment.length === 0) {
      setErrorMessage(
        "Attachment is mandatory for submission. Please upload at least one file."
      );
      setModalError(true);
      return;
    }

    const efakturData = {
      apphierId: formValues.apphierId,
      billingCode: billingData.billingCode,
      remark:
        formValues.remark ||
        (status === "DRAFT" ? "Saved as draft" : "Generated via system"),
      status: status,
    };

    try {
      setSaveType(status);

      const result = await dispatch(
        generateEFakturWithAttachments({
          efakturData,
          attachments: status === "SUBMIT" ? listDataAttachment : [],
        })
      ).unwrap();

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
      const errorMsg =
        error?.message ||
        `Gagal ${status === "DRAFT" ? "menyimpan draft" : "generate"} E-Faktur`;
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
    setExistingEFaktur(null);
    setIsExistingEFaktur(false);
    setCurrent(0);
    setIsDataLoaded(false);
    setSaveType("");
    setDetailData({
      npwp: null,
      nikPasp: null,
      email: null,
      alamat: null,
    });
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
        header="Generate E-Faktur"
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
              <>
                <ButtonComponent
                  type="default"
                  onClick={() => handleGenerate("DRAFT")}
                  loading={loading_modal && saveType === "DRAFT"}
                  disabled={loading_modal}
                  icon={<FileTextOutlined />}
                >
                  {loading_modal && saveType === "DRAFT"
                    ? "Saving..."
                    : "Save as Draft"}
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  onClick={() => handleGenerate("SUBMIT")}
                  loading={loading_modal && saveType === "SUBMIT"}
                  disabled={loading_modal}
                  icon={<SaveOutlined />}
                >
                  {loading_modal && saveType === "SUBMIT"
                    ? "Submitting..."
                    : "Save & Submit"}
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <Spin spinning={loading || loading_detail}>
          <div className="my-6">
            {/* FIXED STEPS SECTION */}
            <div className="mb-8">
              <Steps
                current={current}
                items={items}
                labelPlacement="vertical"
                size="small"
                className="custom-steps"
              />
            </div>

            <Form layout="vertical" form={form} id="formGenerateEfaktur">
              {/* STEP 1: BILLING INFORMATION */}
              <div className={`${current !== 0 ? "hidden" : ""}`}>
                {isExistingEFaktur && existingEFaktur && (
                  <Alert
                    message="E-Faktur Sudah Ada"
                    description={
                      <div>
                        <p>
                          E-Faktur untuk billing code{" "}
                          <strong>{billingData?.billingCode}</strong> sudah
                          dibuat sebelumnya.
                        </p>
                        <div className="mt-2 text-sm">
                          <p>
                            Invoice Number:{" "}
                            <strong>{existingEFaktur.invoiceNumber}</strong>
                          </p>
                          <p>
                            Status:{" "}
                            <strong className="text-orange-600">
                              {existingEFaktur.efakturStatus}
                            </strong>
                          </p>
                          {existingEFaktur.efakturNo && (
                            <p>
                              No. E-Faktur:{" "}
                              <strong>{existingEFaktur.efakturNo}</strong>
                            </p>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-600">
                          Generate ulang akan meng-update E-Faktur yang sudah
                          ada.
                        </p>
                      </div>
                    }
                    type="warning"
                    showIcon
                    className="mb-6"
                  />
                )}

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
                      <DetailText label="Account Number">
                        {billingData.accountNumber}
                      </DetailText>
                      <DetailText label="Account Name">
                        {billingData.accountName || billingData.customerName}
                      </DetailText>
                      <DetailText label="Invoice Date">
                        {billingData.invoiceDate}
                      </DetailText>
                      <DetailText label="Billing Period">
                        {billingData.billingPeriod || "-"}
                      </DetailText>
                      
                      {/* Detail data tambahan dari endpoint detail e-faktur */}
                      {/* <DetailText label="NPWP">
                        {detailData.npwp || "-"}
                      </DetailText>
                      <DetailText label="NIK/PASP">
                        {detailData.nikPasp || "-"}
                      </DetailText>
                      <DetailText label="Email">
                        {detailData.email || "-"}
                      </DetailText>
                      <div className="col-span-2">
                        <DetailText label="Alamat">
                          {detailData.alamat || "-"}
                        </DetailText>
                      </div> */}
                    </div>
                  </div>
                )}

                <div className="mb-6 p-5 bg-white border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    Rincian Item Billing
                  </h3>

                  {loading_detail ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                      <p className="mt-4 text-gray-500">
                        Loading billing items...
                      </p>
                    </div>
                  ) : billingItems.length === 0 ? (
                    <Alert
                      message="Tidak Ada Data"
                      description="Billing items tidak ditemukan untuk billing code ini."
                      type="warning"
                      showIcon
                    />
                  ) : (
                    <Table
                      dataSource={billingItems}
                      columns={columnsItems}
                      pagination={false}
                      size="small"
                      bordered
                      scroll={{ x: 900 }}
                      rowKey="key"
                    />
                  )}
                </div>

                {billingItems.length > 0 && (
                  <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h3 className="text-base font-bold text-blue-800 mb-4">
                      Ringkasan ({currency})
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-medium">DPP:</span>
                        <span className="font-semibold">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.totalDpp.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-medium">PPN:</span>
                        <span className="font-semibold">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.totalPpn.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between px-3 py-2 border-t-2 bg-blue-100">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                    Attachment Information
                  </h3>
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
                    mandatory={true}
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
                        {/* <DetailText label="NPWP">
                          {detailData.npwp || "-"}
                        </DetailText>
                        <DetailText label="Email">
                          {detailData.email || "-"}
                        </DetailText> */}
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
                  </>
                )}

                {loading_modal && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Progress{" "}
                      {saveType === "DRAFT"
                        ? "Save Draft"
                        : "Generate E-Faktur"}
                      :
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
                      {upload_progress >= 30 &&
                        upload_progress < 50 &&
                        `${
                          saveType === "DRAFT"
                            ? "Menyimpan draft"
                            : "Membuat E-Faktur"
                        }...`}
                      {upload_progress >= 50 &&
                        upload_progress < 70 &&
                        "Mengirim ke sistem..."}
                      {upload_progress >= 70 &&
                        upload_progress < 100 &&
                        "Mengupload attachment..."}
                      {upload_progress === 100 && "Selesai!"}
                    </p>
                  </div>
                )}

                {generatedData && (
                  <Alert
                    message={
                      saveType === "DRAFT"
                        ? "Draft Berhasil Disimpan!"
                        : "E-Faktur Berhasil Di-generate!"
                    }
                    description={
                      <div>
                        <p>
                          Invoice Number:{" "}
                          <strong>{generatedData.invoiceNumber}</strong>
                        </p>
                        {generatedData.efakturNo && (
                          <p>
                            No. E-Faktur:{" "}
                            <strong>{generatedData.efakturNo}</strong>
                          </p>
                        )}
                        <p>
                          Status:{" "}
                          <strong
                            className={
                              saveType === "DRAFT"
                                ? "text-gray-600"
                                : "text-orange-600"
                            }
                          >
                            {generatedData.status}
                          </strong>
                        </p>

                        {generatedData.summary && saveType === "SUBMIT" && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-semibold">
                              Upload Summary:
                            </p>
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
            {saveType === "DRAFT"
              ? "E-Faktur berhasil disimpan sebagai draft."
              : "E-Faktur berhasil di-generate dan dikirim untuk approval."}
          </p>
          {generatedData?.invoiceNumber && (
            <p className="pl-[70px]">
              Invoice Number: <strong>{generatedData.invoiceNumber}</strong>
            </p>
          )}
          {generatedData?.status && (
            <p className="pl-[70px]">
              Status:{" "}
              <strong
                className={
                  saveType === "DRAFT" ? "text-gray-600" : "text-orange-600"
                }
              >
                {generatedData.status}
              </strong>
            </p>
          )}

          {generatedData?.summary && saveType === "SUBMIT" && (
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