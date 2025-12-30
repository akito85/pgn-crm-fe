import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  approveStampSign,
  getApprovalListByType,
} from "../../../../../redux/slices/rating_billing_invoice/emeterai";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const ModalApprovalEMeterai = ({ isOpen, handleClose, onSuccess }) => {
  const {
    data_approval_list,
    loading_approval_list,
    loading_modal,
  } = useSelector((state) => state.emeterai);

  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [filterType, setFilterType] = useState("emeterai");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    status: "right",
  });

  const dataSource = useMemo(() => {
    if (!data_approval_list) return [];
    if (Array.isArray(data_approval_list)) return data_approval_list;
    return [];
  }, [data_approval_list]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getApprovalListByType({ type: filterType }));
    }
  }, [dispatch, isOpen, filterType]);

  useEffect(() => {
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setPage(1);
  }, [filterType]);

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancelForm = () => {
    handleClose();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    setAction("");
    setFilterType("emeterai");
    form.resetFields();
  };

  const handleSave = (actionType) => {
    if (!dataTableSelect || dataTableSelect.length === 0) {
      setBodyError({ message: "Tidak ada data yang dipilih" });
      setModalError(true);
      return;
    }

    // ✅ Validate tappId and invoiceNumber exist
    const invalidItems = dataTableSelect.filter(
      (item) => !item.tappId || !item.invoiceNumber
    );

    if (invalidItems.length > 0) {
      setBodyError({
        message: "Beberapa data tidak memiliki data approval yang lengkap",
      });
      setModalError(true);
      return;
    }

    if (!remark.trim()) {
      setBodyError({ message: "Remark harus diisi" });
      setModalError(true);
      return;
    }

    // ✅ Map tappId as approvalId
    const detailApproves = dataTableSelect.map((item) => ({
      approvalId: String(item.tappId), // ✅ tappId from response
      invoiceNumber: String(item.invoiceNumber),
    }));

    const body = {
      type: filterType,
      action: actionType,
      apphierId: dataTableSelect[0]?.apphierId || "",
      detailApproves: detailApproves,
      description: remark,
    };

    dispatch(approveStampSign({ body }))
      .unwrap()
      .then(() => {
        onSuccess();
        form.resetFields();
        setRemark("");
        setAction("");
        handleClose();
        setSelectedRowKeys([]);
        setDataTableSelect([]);

        dispatch(getApprovalListByType({ type: filterType }));
      })
      .catch((error) => {
        const message =
          error?.message ||
          error?.toString() ||
          "Terjadi kesalahan saat memproses approval";
        setBodyError({ message });
        setModalError(true);
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave(action);
    setModalError(false);
    setBodyError({});
  };

  const filterDataByPage = (type = "data") => {
    if (!Array.isArray(dataSource)) {
      return type === "data" ? [] : 0;
    }
    let result = dataSource.map((a, index) => ({
      ...a,
      key: index + 1,
    }));
    return type === "data" ? result : result.length;
  };

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
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 180,
        render: (text) => text || "-",
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 150,
        render: (text) => text || "-",
      },
      {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        width: 200,
        render: (text) => text || "-",
      },
      {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        width: 160,
        render: (text) => text || "-",
      },
      {
        key: "customerName",
        title: "CUSTOMER NAME",
        dataIndex: "customerName",
        width: 250,
        render: (text) => text || "-",
      },
      {
        key: "billingPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billingPeriod",
        width: 120,
        align: "center",
        render: (text) => text || "-",
      },
      {
        key: "totalAmountEqvIdr",
        title: "TOTAL AMOUNT (IDR)",
        dataIndex: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "stampStatus",
        title: "STAMP STATUS",
        dataIndex: "stampStatus",
        width: 150,
        align: "center",
        render: (status) => {
          if (!status) return "-";
          const displayStatus = status.toUpperCase();
          const statusLabel = displayStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={status.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "signStatus",
        title: "SIGN STATUS",
        dataIndex: "signStatus",
        width: 150,
        align: "center",
        render: (status) => {
          if (!status) return "-";
          const displayStatus = status.toUpperCase();
          const statusLabel = displayStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={status.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "approvalStatus",
        title: "APPROVAL STATUS",
        dataIndex: "approvalStatus",
        width: 180,
        align: "center",
        render: (status) => {
          if (!status) return "-";
          const displayStatus = status.toUpperCase();
          const statusLabel = displayStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={status.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "requestedBy",
        title: "REQUESTED BY",
        dataIndex: "requestedBy",
        width: 180,
        render: (text) => text || "-",
      },
      {
        key: "requestedDate",
        title: "REQUESTED DATE",
        dataIndex: "requestedDate",
        width: 180,
        align: "center",
        render: (text) => {
          if (!text) return "-";
          const date = new Date(text);
          return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    ],
    [page, pageSize]
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

  const isFormValid = useMemo(() => {
    return dataTableSelect.length > 0 && remark.trim() !== "";
  }, [dataTableSelect, remark]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="APPROVAL E-METERAI / E-SIGN"
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-3">
            <ButtonComponent type={"default"} onClick={handleCancelForm}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"reject"}
              onClick={() => {
                setAction("REJECT");
                handleSave("REJECT");
              }}
              loading={loading_modal}
              disabled={!isFormValid}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type={"approve"}
              onClick={() => {
                setAction("APPROVE");
                handleSave("APPROVE");
              }}
              loading={loading_modal}
              disabled={!isFormValid}
            >
              Approve
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full grid grid-cols-1 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value)}
              style={{ width: 300 }}
              className="filter-type-select"
            >
              <Select.Option value="emeterai">E-Meterai (Digital)</Select.Option>
              <Select.Option value="esign">E-Sign (Digital)</Select.Option>
              <Select.Option value="meterai">Manual Meterai (Physical Stamp)</Select.Option>
              <Select.Option value="sign">Manual Sign (Wet Ink Signature)</Select.Option>
            </Select>
          </div>

          <div>
            <TableRBI
              dataSource={filterDataByPage("data")}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={filterDataByPage("length")}
              tableScrolled={{ y: 400, x: 2000 }}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading_approval_list}
              rowSelection={rowSelection}
              showExport={false}
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark<span className="text-red-500">*</span>
            </label>
            <InputComponent
              rows={3}
              type="textarea"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={"Enter your remark here..."}
            />
          </div>
        </div>
      </ModalCustom>

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
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

export default ModalApprovalEMeterai;
