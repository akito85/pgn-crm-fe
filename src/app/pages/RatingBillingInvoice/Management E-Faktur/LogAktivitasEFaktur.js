import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Table, Alert } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { getLogActivity } from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const LogAktivitasEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
}) => {
  const dispatch = useDispatch();

  const { log_activity, loading_log, pagination_log } = useSelector(
    (state) => state.efaktur
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isOpen && billingData?.efakturId) {
      dispatch(
        getLogActivity({
          efakturId: billingData.efakturId,
          page: page,
          size: pageSize,
        })
      );
    }
  }, [isOpen, billingData, page, pageSize, dispatch]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen]);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columnsLog = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "WAKTU",
      dataIndex: "createdDtm",
      key: "createdDtm",
      width: 180,
      render: (text) => {
        if (!text) return "-";
        return moment(text).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "PENGGUNA",
      dataIndex: "createdBy", //
      key: "createdBy",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "AKTIVITAS",
      dataIndex: "activity",
      key: "activity",
      width: 300,
      render: (text) => <div className="text-sm">{text || "-"}</div>,
    },
    {
      title: "PESAN / CATATAN",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text) => (
        <div className="text-sm text-gray-600">{text || "-"}</div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden">
        <Spin spinning={loading_log}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-primary">
                Log Aktivitas E-Faktur
              </h2>
              {billingData && (
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>
                    Billing Code:{" "}
                    <strong className="text-gray-800">
                      {billingData.billingCode}
                    </strong>
                  </span>
                  {billingData.invoiceNumber && (
                    <span>
                      Invoice:{" "}
                      <strong className="text-gray-800">
                        {billingData.invoiceNumber}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>
            <ButtonComponent
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={handleClose}
              className="hover:bg-gray-200 rounded-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            {/* Info Banner */}
            {!billingData?.efakturId ? (
              <Alert
                message="E-Faktur Belum Dibuat"
                description="Log aktivitas hanya tersedia untuk E-Faktur yang sudah dibuat."
                type="warning"
                showIcon
                className="mb-4"
              />
            ) : (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Menampilkan riwayat semua aktivitas yang dilakukan pada
                  E-Faktur ini. Total aktivitas:{" "}
                  <strong>{pagination_log?.totalElements || 0}</strong>
                </p>
              </div>
            )}

            {/* Tabel Log Aktivitas */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table
                dataSource={log_activity}
                columns={columnsLog}
                loading={loading_log}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: pagination_log?.totalElements || 0,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} dari ${total} aktivitas`,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                onChange={handleTableChange}
                scroll={{ y: 400, x: 1000 }}
                size="small"
                bordered
                rowKey="id"
                locale={{
                  emptyText: billingData?.efakturId
                    ? "Belum ada log aktivitas untuk E-Faktur ini"
                    : "Pilih E-Faktur terlebih dahulu",
                }}
              />
            </div>

            {/* Summary Info */}
            {log_activity && log_activity.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  Informasi Log
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Total Aktivitas:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {pagination_log?.totalElements || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Aktivitas Pertama:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {log_activity[log_activity.length - 1]?.createdDtm
                        ? moment(
                            log_activity[log_activity.length - 1].createdDtm
                          ).format("DD-MM-YYYY HH:mm")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Aktivitas Terakhir:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {log_activity[0]?.createdDtm
                        ? moment(log_activity[0].createdDtm).format(
                            "DD-MM-YYYY HH:mm"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">User Terakhir:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {log_activity[0]?.createdBy || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {billingData?.efakturStatus && (
                <span>
                  Status E-Faktur:
                  <strong
                    className={`ml-2 ${
                      billingData.efakturStatus === "SUCCESS_UPLOAD"
                        ? "text-green-600"
                        : billingData.efakturStatus === "FAILED"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {billingData.efakturStatus}
                  </strong>
                </span>
              )}
            </div>
            <ButtonComponent
              type="default"
              onClick={handleClose}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={20} />}
            >
              Tutup
            </ButtonComponent>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LogAktivitasEFaktur;
