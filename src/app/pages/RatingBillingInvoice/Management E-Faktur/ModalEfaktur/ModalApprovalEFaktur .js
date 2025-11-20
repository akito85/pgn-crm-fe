import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
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
  // Selector
  const { list_efaktur_approval, loading_modal } = useSelector(
    (state) => state.efaktur
  );

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = list_efaktur_approval;

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    efakturStatus: "right",
  });

  // Use Effect
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllEFakturApprovePaginate());
    }
  }, [dispatch, isOpen]);

  // Function Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
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

  // Steps
  const steps = [
    {
      title: "E-FAKTUR INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue().remark,
    },
    {
      title: "CONFIRMATION",
    },
  ];

  // Navigation
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  // Scroll Handlers
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleClose();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    setAction("");
    setCurrent(0);
    form.resetFields();
  };

  // Handle Save
  const handleSave = (formValue) => {
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

    const detailApproves = dataTableSelect.map((item) => ({
      approvalId: Number(item.tappId),
      efakturId: Number(item.efakturId),
    }));

    const body = {
      detailApproves: detailApproves,
      action: action,
      description: remark,
    };

    dispatch(
      approvedEfaktur({
        body: { ...body, billingCode: "" },
        action: action === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        onSuccess();
        setCurrent(0);
        form.resetFields();
        setRemark("");
        setAction("");
        handleClose();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
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
    handleClose();
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
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
        key: "efakturNo",
        title: "NO. E-FAKTUR",
        dataIndex: "efakturNo",
        width: 180,
        render: (text) => text || "-",
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
        key: "efakturType",
        title: "TIPE E-FAKTUR",
        dataIndex: "efakturType",
        width: 140,
        align: "center",
        render: (text) => text || "-",
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 180,
        render: (text) => text || "-",
      },
      {
        key: "billingCode",
        title: "BILLING CODE",
        dataIndex: "billingCode",
        width: 180,
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
        title: "CUSTOMER",
        dataIndex: "customerName",
        width: 250,
        render: (text) => text || "-",
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        render: (text) => text || "-",
      },
      {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
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
        key: "invoiceDate",
        title: "INVOICE DATE",
        dataIndex: "invoiceDate",
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
          const statusColors = {
            APPROVED: "bg-green-100 text-green-800 border-green-300",
            SUCCESS: "bg-green-100 text-green-800 border-green-300",
            PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
            AWAITING_APPROVAL:
              "bg-orange-100 text-orange-800 border-orange-300",
            FAILED: "bg-red-100 text-red-800 border-red-300",
            REJECTED: "bg-red-100 text-red-800 border-red-300",
          };

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[status] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {status?.replace(/_/g, " ")}
              </span>
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
          const statusColors = {
            APPROVED: "bg-green-100 text-green-800 border-green-300",
            WAITING_CANCELLATION_APPROVAL:
              "bg-yellow-100 text-yellow-800 border-yellow-300",
            REJECTED: "bg-red-100 text-red-800 border-red-300",
            PENDING: "bg-blue-100 text-blue-800 border-blue-300",
          };

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[status] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {status?.replace(/_/g, " ")}
              </span>
            </div>
          );
        },
      },
      {
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        width: 200,
        render: (text) => text || "-",
      },
      {
        key: "reasonCanceled",
        title: "REASON CANCELED",
        dataIndex: "reasonCanceled",
        width: 250,
        render: (text) => text || "-",
      },
      {
        key: "reasonReplacement",
        title: "REASON REPLACEMENT",
        dataIndex: "reasonReplacement",
        width: 250,
        render: (text) => text || "-",
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

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="Approval E-Faktur"
        handleCancel={handleCancelForm}
        width={1200}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}

            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={handleButtonNext}
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
                  form={"formApproveEFaktur"}
                  onClick={() => setAction("REJECT")}
                  loading={loading_modal}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type={"approve"}
                  htmlType={"submit"}
                  form={"formApproveEFaktur"}
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
        <div className="flex flex-row justify-center">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
        </div>

        {/* STEP 1: E-FAKTUR INFORMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
        >
          <Form
            layout="vertical"
            form={form}
            id={"formApproveEFaktur"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <p className="text-primary uppercase font-bold mb-4">
                E-Faktur List - Ready to Approve
              </p>
              <TableRBI
                dataSource={filterDataByPage("data")}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={filterDataByPage("length")}
                tableScrolled={{ y: 525, x: 2000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading_modal}
                rowSelection={rowSelection}
              />
              <div className="pt-[30px]">
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
            </div>
          </Form>
        </div>

        {/* STEP 2: CONFIRMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <p className="text-primary uppercase font-bold mb-4">
              Review - E-Faktur yang Akan Di-
              {action === "APPROVE" ? "Approve" : "Reject"}
            </p>
            <TableRBI
              dataSource={dataTableSelect}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={dataTableSelect.length || 0}
              tableScrolled={{ y: 525, x: 2000 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={false}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
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
