import React, { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import {
  approvePayGasDepositExpired,
  getPayGasDepositExpiredList,
  rejectPayGasDepositExpired,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
};

const PayGasDepositeExpiredApprovalPage = () => {
  const dispatch = useDispatch();
  const { data_expired, loading_expired, loading_expired_action } = useSelector((state) => state.gasDepositPayment);

  const [selectedRow, setSelectedRow] = useState(null);
  const [decisionType, setDecisionType] = useState("");

  useEffect(() => {
    dispatch(getPayGasDepositExpiredList());
  }, [dispatch]);

  const routes = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.GAS_DEPOSITE_VIEW, breadcrumbName: "Gas Deposite" },
    { path: "", breadcrumbName: "Approval Expired" },
  ];

  const rows = useMemo(
    () => (data_expired || []).map((item, index) => ({
      ...item,
      key: item.payExpId,
      no: index + 1,
    })),
    [data_expired],
  );

  const refreshList = () => {
    dispatch(getPayGasDepositExpiredList());
  };

  const handleDecision = async ({ remark }, handleClear) => {
    if (!selectedRow || !decisionType) return;

    const payload = {
      payExpId: selectedRow.payExpId,
      remarks: remark,
    };

    const action = decisionType === "approve"
      ? approvePayGasDepositExpired(payload)
      : rejectPayGasDepositExpired(payload);

    const result = await dispatch(action);
    if (result.type.endsWith("/fulfilled")) {
      message.success(decisionType === "approve" ? "Approval Success" : "Reject Success");
      handleClear?.();
      setSelectedRow(null);
      setDecisionType("");
      refreshList();
    }
  };

  const columns = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 60, align: "center" },
    { key: "payExpId", title: "PAY EXP ID", dataIndex: "payExpId", width: 120 },
    { key: "rbiLedgerId", title: "RBI LEDGER ID", dataIndex: "rbiLedgerId", width: 140 },
    {
      key: "expiredBalance",
      title: "EXPIRED BALANCE",
      dataIndex: "expiredBalance",
      width: 160,
      align: "right",
      render: (value) => formatNumber(value),
    },
    { key: "currency", title: "CURRENCY", dataIndex: "currency", width: 110 },
    { key: "rateType", title: "RATE TYPE", dataIndex: "rateType", width: 150, render: (value) => value || "-" },
    {
      key: "rate",
      title: "RATE",
      dataIndex: "rate",
      width: 120,
      align: "right",
      render: (value) => formatNumber(value),
    },
    {
      key: "eqvExpiredBalance",
      title: "EQV EXPIRED BALANCE",
      dataIndex: "eqvExpiredBalance",
      width: 180,
      align: "right",
      render: (value) => formatNumber(value),
    },
    { key: "statusApproval", title: "STATUS APPROVAL", dataIndex: "statusApproval", width: 170 },
    {
      key: "action",
      title: "ACTION",
      dataIndex: "action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <ButtonComponent
            type="reject"
            onClick={() => {
              setSelectedRow(record);
              setDecisionType("reject");
            }}
          >
            Reject
          </ButtonComponent>
          <ButtonComponent
            type="approve"
            onClick={() => {
              setSelectedRow(record);
              setDecisionType("approve");
            }}
          >
            Approve
          </ButtonComponent>
        </div>
      ),
    },
  ], []);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={(
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">APPROVAL EXPIRED</p>
            <ButtonComponent type="submit" border={false} onClick={refreshList}>
              Refresh
            </ButtonComponent>
          </div>
        )}
        className="mt-2"
      >
        <TableRBI
          idTable="rc-pay-gas-deposit-expired-table"
          dataSource={rows}
          columns={columns}
          totalData={rows.length}
          tableScrolled={{ x: 1600, y: 500 }}
          showExport={false}
          usePagination={false}
          loading={loading_expired}
        />
      </CardContainer>

      <ModalApproveOrReject
        isOpen={Boolean(selectedRow && decisionType)}
        handleCloseModal={() => {
          setSelectedRow(null);
          setDecisionType("");
        }}
        onFinish={handleDecision}
        header={decisionType === "approve" ? "Approve" : "Reject"}
        approveOrReject={decisionType}
        menu="expired gas deposit staging"
        named={selectedRow?.rbiLedgerId || "-"}
        loading={loading_expired_action}
        customMessage={
          selectedRow
            ? `Are you sure you want to ${decisionType} expired gas deposit RBI Ledger ID ${selectedRow.rbiLedgerId}?`
            : undefined
        }
      />
    </>
  );
};

export default PayGasDepositeExpiredApprovalPage;
