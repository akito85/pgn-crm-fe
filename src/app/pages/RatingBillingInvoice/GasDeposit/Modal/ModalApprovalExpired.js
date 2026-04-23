import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import {
  getApprovalExpiredList,
  processGasDepositApproval,
} from "../../../../../redux/slices/rating_billing_invoice/gasDeposit";

const ModalApprovalExpired = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
}) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [form] = Form.useForm();

  const {
    data_approval_expired_list,
    loading_approval_expired_list,
    loading_process_approval,
  } = useSelector((state) => state.gasDepositRbi);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [current, setCurrent] = useState(0);
  const [action, setAction] = useState("");
  const [fixedColumns, setFixedColumns] = useState({ left: ["no"], right: [] });

  useEffect(() => {
    if (!isOpen) return;
    dispatch(getApprovalExpiredList({ page: 1, pageSize: 100, search: "", sort: "createdDate~desc" }));
    setCurrent(0);
    setAction("");
    setSelectedRowKeys([]);
    setSelectedRows([]);
    form.resetFields();
  }, [dispatch, isOpen]);

  const dataSource = useMemo(() => {
    return (data_approval_expired_list?.result || []).map((item) => ({
      ...item,
      key: item.referenceId,
    }));
  }, [data_approval_expired_list]);

  const baseColumns = useMemo(
    () => [
      { key: "no", title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
      { key: "customerNumber", title: "CUSTOMER NUMBER", dataIndex: "customerNumber", width: 160 },
      { key: "customerName", title: "CUSTOMER NAME", dataIndex: "customerName", width: 180 },
      { key: "accountNumber", title: "ACCOUNT NUMBER", dataIndex: "accountNumber", width: 160 },
      { key: "accountName", title: "ACCOUNT NAME", dataIndex: "accountName", width: 180 },
      { key: "accountGroupType", title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", width: 160 },
      { key: "balanceAmount", title: "AMOUNT", dataIndex: "balanceAmount", width: 120, align: "right" },
      { key: "statusApproval", title: "STATUS APPROVAL", dataIndex: "statusApproval", width: 160, align: "center" },
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

  const steps = [
    {
      title: "GAS DEPOSIT INFORMATION",
      disabled: selectedRows.length === 0 || !form.getFieldValue()?.remark,
    },
    { title: "CONFIRMATION" },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const handleButtonNext = () => setCurrent(1);
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

    await Promise.all(
      selectedRows.map((row) =>
        dispatch(
          processGasDepositApproval({
            referenceId: row.referenceId,
            referenceType: "SUMMARY",
            action,
            note,
          }),
        ).unwrap(),
      ),
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
      width={1100}
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
                  loading={loading_process_approval}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  htmlType="submit"
                  form="formApproveExpired"
                  onClick={() => setAction("APPROVE")}
                  loading={loading_process_approval}
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
              totalData={data_approval_expired_list?.page?.totalElements || 0}
              tableScrolled={{ x: 1800, y: 450 }}
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
              onRefresh={() => dispatch(getApprovalExpiredList({ page: 1, pageSize: 100, search: "", sort: "createdDate~desc" }))}
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
            tableScrolled={{ x: 1800, y: 450 }}
            onSort={() => {}}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={false}
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
