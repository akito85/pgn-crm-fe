import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { getLogActivity } from "../../../../redux/slices/rating_billing_invoice/efakturSlice";
import moment from "moment";

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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Calculate log information
  const logInformation = useMemo(() => {
    if (!log_activity || log_activity.length === 0) {
      return {
        totalActivity: 0,
        firstActivity: null,
        lastActivity: null,
        lastUser: null,
      };
    }

    const sortedLogs = [...log_activity].sort(
      (a, b) => new Date(a.createdDtm) - new Date(b.createdDtm)
    );

    return {
      totalActivity: pagination_log?.totalElements || log_activity.length,
      firstActivity: sortedLogs[0]?.createdDtm,
      lastActivity: sortedLogs[sortedLogs.length - 1]?.createdDtm,
      lastUser: sortedLogs[sortedLogs.length - 1]?.createdBy,
    };
  }, [log_activity, pagination_log]);

  const columnsLog = [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "time",
      title: "TIME",
      dataIndex: "createdDtm",
      width: 180,
      align: "left",
      render: (text) => {
        if (!text) return " ";
        return moment(text).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      key: "user",
      title: "USER",
      dataIndex: "createdBy",
      width: 200,
      align: "left",
      render: (text) => text || " ",
    },
    {
      key: "activity",
      title: "ACTIVITY",
      dataIndex: "activity",
      width: 300,
      align: "left",
      render: (text) => <div className="text-sm">{text || " "}</div>,
    },
    {
      key: "message",
      title: "MESSAGE / NOTE",
      dataIndex: "message",
      width: 350,
      align: "left",
      render: (text) => (
        <div className="text-sm text-gray-600">{text || " "}</div>
      ),
    },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      type="view"
      header="E-Faktur Log Activity"
      handleCancel={handleClose}
      width={1000}
      footer={
        <div className="flex w-full justify-start">
          <ButtonComponent type="default" onClick={handleClose}>
            Back
          </ButtonComponent>
        </div>
      }
    >
      <div className="w-full">
        {/* Billing Information */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-primary mb-3 uppercase">
            Billing Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Billing code
              </label>
              <div className="text-sm font-medium text-gray-800">
                {billingData?.billingCode || "-"}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Invoice Number
              </label>
              <div className="text-sm font-medium text-gray-800">
                {billingData?.invoiceNumber || "-"}
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Item Detail/Services - Table Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-primary uppercase">
              Item Detail/Services
            </h3>
          </div>

          {/* Table with TableRBI */}
          <TableRBI
            dataSource={log_activity || []}
            columns={columnsLog}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={pagination_log?.totalElements || 0}
            tableScrolled={{ x: 1000, y: 300 }}
            loading={loading_log}
            showDownload={false}
            rowKey="id"
          />
        </div>

        <Divider className="my-4" />

        {/* Log Information */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-sm font-semibold text-primary uppercase">
              Log Information
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">
                  Total Activity
                </label>
                <div className="text-sm font-medium text-gray-800">
                  {logInformation.totalActivity}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Last Activity
                </label>
                <div className="text-sm font-medium text-gray-800">
                  {logInformation.lastActivity
                    ? moment(logInformation.lastActivity).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )
                    : "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">
                  First Activity
                </label>
                <div className="text-sm font-medium text-gray-800">
                  {logInformation.firstActivity
                    ? moment(logInformation.firstActivity).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )
                    : "-"}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Last User
                </label>
                <div className="text-sm font-medium text-gray-800">
                  {logInformation.lastUser || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default LogAktivitasEFaktur;