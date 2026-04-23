import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  approvedEfaktur,
  getAllEFakturApprovePaginate,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const ModalApprovalEFaktur = ({
  isOpen,
  handleClose,
  onSuccess,
  billingData,
}) => {
  const { list_efaktur_approval, loading_modal } = useSelector(
    (state) => state.efaktur
  );

  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [filterType, setFilterType] = useState("normal");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    efakturStatus: "right",
  });


  const dataSource = useMemo(() => {
    if (!list_efaktur_approval || list_efaktur_approval.length === 0) {
      return [];
    }
    return list_efaktur_approval;
  }, [list_efaktur_approval]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllEFakturApprovePaginate({ type: filterType }));
    }
  }, [dispatch, isOpen, filterType]);

  useEffect(() => {
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setPage(1);
  }, [filterType]);

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

  const onSort = (_, __, sort) => {
    // Implement if needed
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
    setFilterType("normal");
    form.resetFields();
  };

  const handleSave = (actionType) => {
    if (!dataTableSelect || dataTableSelect.length === 0) {
      setBodyError({ message: "Tidak ada E-Faktur yang dipilih" });
      setModalError(true);
      return;
    }

    const invalidItems = dataTableSelect.filter(
      (item) => !item.tappId || !item.efakturId
    );

    if (invalidItems.length > 0) {
      setBodyError({
        message: "Beberapa E-Faktur tidak memiliki data approval yang lengkap",
      });
      setModalError(true);
      return;
    }

    if (!remark.trim()) {
      setBodyError({ message: "Remark harus diisi" });
      setModalError(true);
      return;
    }

    const detailApproves = dataTableSelect.map((item) => ({
      approvalId: String(item.tappId),
      efakturId: String(item.efakturId),
    }));

    const body = {
      detailApproves: detailApproves,
      action: actionType,
      type: filterType,
      description: remark,
    };

    dispatch(
      approvedEfaktur({
        body: body,
        action: actionType === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        onSuccess();
        form.resetFields();
        setRemark("");
        setAction("");
        handleClose();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
        dispatch(getAllEFakturApprovePaginate({ type: filterType }));
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
    let result = [...dataSource].map((a, index) => ({
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
        key: "efakturCode",
        title: "FAKTUR CODE",
        dataIndex: "efakturNo",
        width: 150,
        render: (text) => text || " ",
      },
      {
        key: "efakturType",
        title: "FAKTUR TYPE",
        dataIndex: "efakturType",
        width: 140,
        align: "center",
        render: (type) => {
          if (!type) return "-";
          
          const displayType = (type || "NORMAL").toUpperCase();
          const statusLabel = displayType.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayType.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        key: "billingCode",
        title: "BILLING CODE",
        dataIndex: "billingCode",
        width: 150,
        render: (text) => text || " ",
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 150,
        render: (text) => text || " ",
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 150,
        render: (text) => text || " ",
      },
      {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        width: 200,
        render: (text) => text || " ",
      },
      {
        key: "efakturDate",
        title: "TGL E-FAKTUR",
        dataIndex: "efakturDate",
        width: 120,
        align: "center",
        render: (text) => {
          if (!text) return "-";
          const date = new Date(text);
          return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        width: 160,
        render: (text) => text || " ",
      },
      {
        key: "customerName",
        title: "CUSTOMER",
        dataIndex: "customerName",
        width: 250,
        render: (text) => text || " ",
      },
      {
        key: "billingPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billingPeriod",
        width: 120,
        align: "center",
        render: (text) => text || " ",
      },
      {
        key: "invoiceDate",
        title: "INVOICE DATE",
        dataIndex: "invoiceDate",
        width: 120,
        align: "center",
        render: (text) => {
          if (!text) return " ";
          const date = new Date(text);
          return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        key: "dpp",
        title: "DPP",
        dataIndex: "dpp",
        width: 150,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "ppn",
        title: "PPN",
        dataIndex: "ppn",
        width: 150,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "totalAmount",
        title: "TOTAL AMOUNT",
        dataIndex: "totalAmount",
        width: 180,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "totalAmountEqvIdr",
        title: "TOTAL AMOUNT (EQV IDR)",
        dataIndex: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        key: "efakturStatus",
        title: "STATUS E-FAKTUR",
        dataIndex: "efakturStatus",
        width: 180,
        align: "center",
        render: (status) => {
          if (!status) return " ";
          
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
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        width: 200,
        align: "center",
        render: (status) => {
          if (!status) return " ";
          
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
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        width: 200,
        render: (text) => text || " ",
      },
      {
        key: "reasonCanceled",
        title: "REASON CANCELED",
        dataIndex: "reasonCanceled",
        width: 250,
        render: (text) => text || " ",
      },
      {
        key: "reasonReplacement",
        title: "REASON REPLACEMENT",
        dataIndex: "reasonReplacement",
        width: 250,
        render: (text) => text || " ",
      },
      {
        key: "requestedBy",
        title: "REQUESTED BY",
        dataIndex: ["approvalDetail", "requestedBy"],
        width: 180,
        render: (text) => text || " ",
      },
      {
        key: "requestedDate",
        title: "REQUESTED DATE",
        dataIndex: ["approvalDetail", "requestedDate"],
        width: 180,
        align: "center",
        render: (text) => {
          if (!text) return " ";
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
      {
        key: "approvalRemarks",
        title: "APPROVAL REMARKS",
        dataIndex: ["approvalDetail", "remarks"],
        width: 200,
        render: (text) => text || " ",
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
        header="APPROVAL E-FAKTUR"
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
              style={{ width: 250 }}
              className="filter-type-select"
            >
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="replacement">Replacement</Select.Option>
              <Select.Option value="cancellation">Cancellation</Select.Option>
              <Select.Option value="manual_upload">Manual Upload</Select.Option>
              <Select.Option value="sync">Sync</Select.Option>
            </Select>
          </div>

          {/* Table Section */}
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
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading_modal}
              rowSelection={rowSelection}
              showExport={false}
            />
          </div>
          {/* Remark Section */}
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

      {/* Modal Error */}
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

export default ModalApprovalEFaktur;