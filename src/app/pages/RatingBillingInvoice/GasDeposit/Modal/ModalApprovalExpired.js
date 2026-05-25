import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import StatusComponent from "../../../../../components/StatusComponent";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { numberFormatting } from "../../../../../utils/formatCurrency";
import {
  getApprovalExpiredList,
  processGasDepositApproval,
} from "../../../../../redux/slices/rating_billing_invoice/gasDeposit";
import { showModalSuccess } from "../../../../../redux/slices/general_slice";

const formatShortDate = (value) => {
  if (!value) return "-";
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("D-MMM-YY") : "-";
};

const formatShortPeriod = (value) => {
  if (!value) return "-";
  if (typeof value === "string" && value.includes(" - ")) {
    const [startValue] = value.split(" - ");
    const parsedStart = moment(startValue);
    return parsedStart.isValid() ? parsedStart.format("MMM YY") : value;
  }
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("MMM YY") : value;
};

const formatPeriodEarnRange = (startValue, endValue) => {
  const start = startValue ? moment(startValue) : null;
  const end = endValue ? moment(endValue) : null;

  if (start?.isValid() && end?.isValid()) {
    if (start.year() === end.year()) {
      return `${start.format("MMM")}-${end.format("MMM YYYY")}`;
    }
    return `${start.format("MMM YYYY")} - ${end.format("MMM YYYY")}`;
  }

  if (start?.isValid()) return start.format("MMM YYYY");
  if (end?.isValid()) return end.format("MMM YYYY");
  return "-";
};

const renderFormattedNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return numberFormatting(value);
};

const renderStatus = (value, isApproval = false) => {
  if (!value) return "-";
  return (
    <div className="flex justify-center">
      <StatusComponent colour={String(value).toLowerCase().replaceAll(" ", isApproval ? "_" : " ")}>
        {value}
      </StatusComponent>
    </div>
  );
};

const ModalApprovalExpired = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
}) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const remarkValue = Form.useWatch("remark", form);

  const {
    data_approval_expired_list,
    loading_approval_expired_list,
  } = useSelector((state) => state.gasDepositRbi);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [current, setCurrent] = useState(0);
  const [action, setAction] = useState("");
  const [fixedColumns, setFixedColumns] = useState({ left: ["no"], right: [] });

  useEffect(() => {
    if (!isOpen) return;
    setCurrent(0);
    setAction("");
    setSelectedRowKeys([]);
    setSelectedRows([]);
    form.resetFields();
    dispatch(
      getApprovalExpiredList({
        page: 1,
        pageSize: 100,
        search: "",
        sort: "createdDate~desc",
      }),
    );
  }, [dispatch, isOpen]);

  const dataSource = useMemo(() => {
    return (data_approval_expired_list?.result || [])
      .map((item) => ({
        ...item,
        key: item.referenceId,
        amount: item.amount ?? item.balanceAmount ?? null,
        cashBalance: item.cashBalance ?? item.balanceAmount ?? null,
        quantity: item.quantity ?? item.balanceVolume ?? null,
      }));
  }, [data_approval_expired_list]);

  const baseColumns = useMemo(
    () => [
      { key: "no", title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
      { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 180 },
      { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 260 },
      { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 180 },
      { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 260 },
      { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 180 },
      { key: "sor", title: "SOR", dataIndex: "sor", width: 90, align: "center" },
      { key: "costCenter", title: "COST CENTER", dataIndex: "costCenter", width: 120 },
      { key: "accountSegment", title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", width: 150 },
      { key: "meterReadingCode", title: "METER READING CODE", dataIndex: "meterReadingCode", width: 160 },
      { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 110, align: "center" },
      { key: "uom", title: "UOM", dataIndex: "uom", width: 90, align: "center" },
      { key: "termsEarn", title: "TERMS EARN", dataIndex: "termsEarn", width: 110, align: "center" },
      { key: "termsRedeem", title: "TERMS REDEEM", dataIndex: "termsRedeem", width: 130, align: "center" },
      {
        key: "periodEarn",
        title: "PERIOD EARN",
        width: 180,
        render: (_, record) => formatPeriodEarnRange(record?.periodEarn || record?.earnStartDate, record?.periodEarnEnd || record?.earnEndDate),
      },
      {
        key: "periodRedeemStart",
        title: "PERIOD REDEEM START",
        dataIndex: "periodRedeemStart",
        width: 160,
        render: (value) => formatShortDate(value),
      },
      {
        key: "periodRedeemEnd",
        title: "PERIOD REDEEM END",
        dataIndex: "periodRedeemEnd",
        width: 160,
        render: (value) => formatShortDate(value),
      },
      {
        key: "period",
        title: "PERIOD",
        dataIndex: "period",
        width: 120,
        render: (value) => formatShortPeriod(value),
      },
      { key: "timeUnit", title: "TIME UNIT", dataIndex: "timeUnit", width: 120, align: "center" },
      {
        key: "quantity",
        title: "QUANTITY",
        dataIndex: "quantity",
        width: 140,
        align: "right",
        render: (value) => renderFormattedNumber(value),
      },
      {
        key: "amount",
        title: "AMOUNT",
        dataIndex: "amount",
        width: 160,
        align: "right",
        render: (value) => renderFormattedNumber(value),
      },
      {
        key: "cashBalance",
        title: "CASH BALANCE",
        dataIndex: "cashBalance",
        width: 160,
        align: "right",
        render: (value) => renderFormattedNumber(value),
      },
      { key: "type", title: "TYPE", dataIndex: "type", width: 130 },
      { key: "source", title: "SOURCE", dataIndex: "source", width: 140 },
      { key: "description", title: "DESCRIPTION", dataIndex: "description", width: 220 },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 140,
        align: "center",
        render: (value) => renderStatus(value, false),
      },
      {
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        width: 180,
        align: "center",
        render: (value) => renderStatus(value, true),
      },
    ],
    [],
  );

  const allColumns = useMemo(
    () => baseColumns.map((col) => ({ ...col, key: col.key || col.dataIndex || col.title })),
    [baseColumns],
  );

  const processedColumns = useMemo(
    () => applyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns],
  );

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumns],
  );

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(newSelectedRows);
    },
  };

  const hasRemark = typeof remarkValue === "string" && remarkValue.trim().length > 0;

  const steps = [
    {
      title: "GAS DEPOSIT INFORMATION",
      disabled: selectedRows.length === 0 || !hasRemark,
    },
    { title: "CONFIRMATION" },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const handleButtonNext = async () => {
    if (!selectedRows.length) return;

    try {
      await form.validateFields(["remark"]);
      setCurrent(1);
    } catch (error) {}
  };
  const handlePrev = () => setCurrent(0);

  const handleClose = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setCurrent(0);
    setAction("");
    form.resetFields();
    handleCancel();
  };

  const handleSave = async (formValue) => {
    if (!selectedRows.length || !action) return;

    const note = formValue?.remark || "";

    for (const row of selectedRows) {
      // eslint-disable-next-line no-await-in-loop
      await dispatch(
        processGasDepositApproval({
          referenceId: row.referenceId,
          referenceType: "SUMMARY",
          action,
          note,
          silentSuccess: true,
        }),
      ).unwrap();
    }

    dispatch(
      showModalSuccess({
        title: "Success",
        description: `Expired Gas Deposit ${String(action || "").toLowerCase()} successfully`,
        return: false,
      }),
    );

    handleRefresh();
    handleClose();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Approval Expired Gas Deposit Information"
      handleCancel={handleClose}
      onFinish={handleSave}
      width={1600}
      footer={
        <div className="flex w-full justify-between items-center">
          <ButtonComponent type="default" onClick={handleClose}>Cancel</ButtonComponent>
          <div className="flex gap-2">
            {current > 0 && (
              <ButtonComponent type="default" onClick={handlePrev}>
                Previous
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent type="submit" onClick={handleButtonNext} disabled={steps[current].disabled}>
                Next
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <>
                <ButtonComponent
                  type="reject"
                  htmlType="submit"
                  form="formApproveExpired"
                  onClick={() => setAction("REJECT")}
                  loading={false}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  htmlType="submit"
                  form="formApproveExpired"
                  onClick={() => setAction("APPROVE")}
                  loading={false}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-row justify-center">
        <div ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
          <Steps current={current} items={items} labelPlacement="vertical" />
        </div>
      </div>

      <div className={`steps-content my-[30px] ${current === 0 ? "" : "hidden"}`}>
        <Form layout="vertical" form={form} id="formApproveExpired" onFinish={handleSave}>
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <div className="flex justify-between items-center mb-4">
              <p className="text-primary uppercase font-bold">Gas Deposit List - Ready to Approve</p>
              {selectedRowKeys.length > 0 && (
                <p className="text-sm font-semibold text-blue-600">
                  {selectedRowKeys.length} {selectedRowKeys.length === 1 ? "row" : "rows"} selected
                </p>
              )}
            </div>

            <TableRBI
              idTable="gas-deposit-approval-expired-table"
              dataSource={dataSource}
              columns={processedColumns}
              rowSelection={rowSelection}
              totalData={dataSource.length}
              tableScrolled={{ x: 4200, y: 450 }}
              onSort={() => {}}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading_approval_expired_list}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={false}
              showRefresh={true}
              onRefresh={() => {
                dispatch(
                  getApprovalExpiredList({
                    page: 1,
                    pageSize: 100,
                    search: "",
                    sort: "createdDate~desc",
                  }),
                );
              }}
            />

            <div className="pt-[30px]">
              <Form.Item
                label="Remark"
                name="remark"
                rules={[{ required: true, message: "Please input your Remark!" }]}
              >
                <InputComponent type="textarea" rows={1} placeholder="Type your remark for approval/rejection" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className={`steps-content my-[30px] ${current === 1 ? "" : "hidden"}`}>
        <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
          <div className="flex justify-between items-center mb-4">
            <p className="text-primary uppercase font-bold">Confirmation</p>
            <p className="text-sm font-semibold text-blue-600">
              {selectedRows.length} {selectedRows.length === 1 ? "row" : "rows"} will be {action === "APPROVE" ? "approved" : "rejected"}
            </p>
          </div>

          <TableRBI
            idTable="gas-deposit-approval-expired-confirm-table"
            dataSource={selectedRows}
            columns={processedColumns}
            totalData={selectedRows.length}
            tableScrolled={{ x: 4200, y: 450 }}
            onSort={() => {}}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading_approval_expired_list}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={false}
            hasMore={false}
          />

          <div className="pt-[30px]">
            <DetailText label="Remark">{form.getFieldValue()?.remark || "-"}</DetailText>
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

ModalApprovalExpired.propTypes = {
  isOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default ModalApprovalExpired;
