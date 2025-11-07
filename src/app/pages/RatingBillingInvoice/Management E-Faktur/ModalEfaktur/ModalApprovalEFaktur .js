import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Steps, Table, Spin, Alert } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import {
  approvedEfaktur,
  getAllBillingItemPaginate,
  getDetailEFaktur,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import {
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ModalApprovalEFaktur = ({
  isOpen,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { 
    data_billingItem, 
    loading_detail, 
    loading_modal,
    detail_efaktur 
  } = useSelector(
    (state) => state.efaktur
  );

  // State
  const [current, setCurrent] = useState(0);
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [customerDetail, setCustomerDetail] = useState(null);

  // Fetch billing items dan detail E-Faktur ketika modal dibuka
  useEffect(() => {
    if (isOpen && billingData?.billingCode) {
      dispatch(getAllBillingItemPaginate(billingData.billingCode));
      
      dispatch(getDetailEFaktur(billingData.billingCode))
        .unwrap()
        .then((result) => {
          if (result) {
            setCustomerDetail(result);
          }
        })
        .catch(() => {
          setCustomerDetail(null);
        });
    }
  }, [isOpen, billingData, dispatch]);

  // Update customer detail dari Redux state
  useEffect(() => {
    if (detail_efaktur) {
      setCustomerDetail(detail_efaktur);
    }
  }, [detail_efaktur]);

  // Steps
  const steps = [
    {
      title: "E-FAKTUR INFORMATION",
      disabled: !form.getFieldValue()?.remark,
    },
    {
      title: "CONFIRMATION",
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Navigation
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  // Calculate totals
  const calculateTotals = () => {
    if (!data_billingItem || data_billingItem.length === 0) {
      return { totalDpp: 0, totalPpn: 0, total: 0 };
    }

    const totalDpp = data_billingItem
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return !itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const totalPpn = data_billingItem
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const total = totalDpp + totalPpn;

    return { totalDpp, totalPpn, total };
  };

  const totals = calculateTotals();
  const currency = data_billingItem?.[0]?.currency || "IDR";

  // Columns untuk tabel items
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
        const numValue = parseFloat(value);
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

  // Handle Cancel
  const handleCancelForm = () => {
    handleClose();
    setRemark("");
    setAction("");
    setCurrent(0);
    setCustomerDetail(null);
    form.resetFields();
  };

  // Handle Save
  const handleSave = (formValue) => {
    if (!billingData) {
      setBodyError({ message: "Billing data not found" });
      setModalError(true);
      return;
    }

    if (!billingData.tappId) {
      setBodyError({ message: "Approval ID (tappId) tidak ditemukan" });
      setModalError(true);
      return;
    }

    if (!billingData.efakturId) {
      setBodyError({ message: "E-Faktur ID tidak ditemukan" });
      setModalError(true);
      return;
    }

    const body = {
      approvalId: billingData.tappId,
      efakturId: billingData.efakturId,
      billingCode: billingData.billingCode,
      action: action,
      description: remark,
    };

    dispatch(
      approvedEfaktur({
        body: body,
        action: action === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        setTimeout(() => {
          handleCancelForm();
          onSuccess();
        }, 2000);
      })
      .catch((error) => {
        if (!error?.response || Math.floor((error?.response?.data?.code || 0) / 100) !== 5) {
          const message =
            error?.message || 
            error?.toString() ||
            "Terjadi kesalahan saat memproses approval";
          
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="Approval E-Faktur"
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => prev()}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}

            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={() => next()}
                type={"submit"}
                className="ant-btn ant-btn-submit flex w-full justify-center"
                disabled={steps[current].disabled}
              >
                <span className="p-1 text-[18px] text-center">Next</span>
                <RightOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <>
                <ButtonComponent
                  type={"reject"}
                  htmlType={"submit"}
                  form={"formApproveEfaktur"}
                  onClick={() => setAction("REJECT")}
                  loading={loading_modal}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type={"approve"}
                  htmlType={"submit"}
                  form={"formApproveEfaktur"}
                  onClick={() => setAction("APPROVE")}
                  loading={loading_modal}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <Spin spinning={loading_detail}>
          <div className="flex flex-row justify-center mb-6 px-32">
            <div className="w-full max-w-xl">
              <Steps current={current} items={items} labelPlacement="vertical" />
            </div>
          </div>

          {/* STEP 1: E-FAKTUR INFORMATION */}
          <div className={`${current !== 0 ? "hidden" : ""}`}>
            <Form
              layout="vertical"
              form={form}
              id={"formApproveEfaktur"}
              onFinish={handleSave}
            >
              {/* Billing Information */}
              {billingData && (
                <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    Informasi Billing
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <DetailText label="Billing Code">
                      {billingData.billingCode}
                    </DetailText>
                    <DetailText label="Invoice Number">
                      {billingData.invoiceNumber || "-"}
                    </DetailText>
                    <DetailText label="Customer">
                      {billingData.customerName}
                    </DetailText>
                    <DetailText label="Account Number">
                      {billingData.accountNumber}
                    </DetailText>
                    <DetailText label="Invoice Date">
                      {billingData.invoiceDate}
                    </DetailText>
                    <DetailText label="Billing Period">
                      {billingData.billingPeriod}
                    </DetailText>
                    <DetailText label="Status">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-100 text-orange-800 border-orange-300">
                        {billingData.efakturStatus?.replace(/_/g, " ")}
                      </span>
                    </DetailText>
                  </div>
                </div>
              )}

              {/* Customer Information (dari detail E-Faktur) */}
              {customerDetail && (
                <div className="mb-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <h3 className="text-base font-bold text-purple-800 mb-4 pb-2 border-b-2 border-purple-200">
                    Informasi Customer (E-Faktur)
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <DetailText label="Customer Name">
                      {customerDetail.customerName || "-"}
                    </DetailText>
                    <DetailText label="Customer NPWP">
                      {customerDetail.customerNpwp || "-"}
                    </DetailText>
                    <DetailText label="Customer Address">
                      {customerDetail.customerAddress || "-"}
                    </DetailText>
                    <DetailText label="Customer Email">
                      {customerDetail.customerEmail || "-"}
                    </DetailText>
                    <DetailText label="Customer Phone">
                      {customerDetail.customerPhone || "-"}
                    </DetailText>
                  </div>
                </div>
              )}

              {/* Billing Items */}
              <div className="mb-6 p-5 bg-white border-2 border-gray-300 rounded-lg">
                <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Rincian Item Billing
                </h3>
                
                {loading_detail ? (
                  <div className="text-center py-8">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-500">Loading billing items...</p>
                  </div>
                ) : data_billingItem.length === 0 ? (
                  <Alert
                    message="Tidak Ada Data"
                    description="Billing items tidak ditemukan untuk billing code ini."
                    type="warning"
                    showIcon
                  />
                ) : (
                  <Table
                    dataSource={data_billingItem || []}
                    columns={columnsItems}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: 900 }}
                    locale={{
                      emptyText: "Tidak ada data",
                    }}
                  />
                )}
              </div>

              {/* Summary */}
              {data_billingItem.length > 0 && (
                <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                    Ringkasan ({currency})
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between px-3 py-2">
                      <span className="font-medium">DPP (Tanpa PPN):</span>
                      <span className="font-semibold">
                        {currency === "USD" ? "$" : "Rp"}{" "}
                        {totals.totalDpp.toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2">
                      <span className="font-medium">PPN:</span>
                      <span className="font-semibold">
                        {currency === "USD" ? "$" : "Rp"}{" "}
                        {totals.totalPpn.toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
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
              )}

              {/* Remark */}
              <div className="pt-4">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={[
                    { required: true, message: "Please input your Remark!" },
                  ]}
                >
                  <InputComponent
                    rows={3}
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={"Type your remark for approval/rejection"}
                  />
                </Form.Item>
              </div>
            </Form>
          </div>

          {/* STEP 2: CONFIRMATION */}
          <div className={`${current !== 1 ? "hidden" : ""}`}>
            {/* Billing Information Review */}
            {billingData && (
              <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                  Review - E-Faktur yang Akan Di-
                  {action === "APPROVE" ? "Approve" : "Reject"}
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailText label={"Billing Code"}>
                    {billingData.billingCode}
                  </DetailText>
                  <DetailText label={"Invoice Number"}>
                    {billingData.invoiceNumber || "-"}
                  </DetailText>
                  <DetailText label={"Customer Name"}>
                    {billingData.customerName}
                  </DetailText>
                  <DetailText label={"Account Number"}>
                    {billingData.accountNumber}
                  </DetailText>
                  <DetailText label={"Invoice Date"}>
                    {billingData.invoiceDate}
                  </DetailText>
                  <DetailText label={"Billing Period"}>
                    {billingData.billingPeriod}
                  </DetailText>
                  <DetailText label={"Total Amount"}>
                    Rp{" "}
                    {billingData.totalAmountEqvIdr?.toLocaleString("id-ID") ||
                      0}
                  </DetailText>
                  <DetailText label={"Status"}>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-100 text-orange-800 border-orange-300">
                      {billingData.efakturStatus?.replace(/_/g, " ")}
                    </span>
                  </DetailText>
                </div>
              </div>
            )}

            {/* Customer Information Review */}
            {customerDetail && (
              <div className="mb-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-lg">
                <h3 className="text-base font-bold text-purple-800 mb-4 pb-2 border-b-2 border-purple-200">
                  Review - Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailText label={"Customer Name"}>
                    {customerDetail.customerName || "-"}
                  </DetailText>
                  <DetailText label={"Customer NPWP"}>
                    {customerDetail.customerNpwp || "-"}
                  </DetailText>
                  <DetailText label={"Customer Address"}>
                    {customerDetail.customerAddress || "-"}
                  </DetailText>
                  <DetailText label={"Customer Email"}>
                    {customerDetail.customerEmail || "-"}
                  </DetailText>
                </div>
              </div>
            )}

            {/* Remark Review */}
            <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                Review - Remark
              </h3>
              <DetailText label={"Remark"}>
                {form.getFieldValue()?.remark}
              </DetailText>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Perhatian: Tindakan ini tidak dapat dibatalkan. Pastikan data
                sudah benar sebelum melanjutkan.
              </p>
            </div>
          </div>
        </Spin>
      </ModalCustom>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={() => handleCloseModalError()}
        handleCancel={() => handleCloseModalError()}
        customText={"Close"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            action === "APPROVE" ? "approved" : "rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalApprovalEFaktur;