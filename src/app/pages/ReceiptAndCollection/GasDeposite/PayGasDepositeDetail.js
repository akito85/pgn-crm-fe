/* eslint-disable react/prop-types */
import React, { useRef, useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Dropdown, Tooltip } from "antd";
import moment from "moment";
import CollapsibleCardContainer from "../../../../components/CollapsibleCardContainer";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import DetailText from "../../../../components/DetailText";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsMutationDetail } from "../../RatingBillingInvoice/GasDeposit/Table/TableMutationDetail";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import {
  getAllGasDepositPaginate,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/gasDeposit";
import ModalCreateMutationDetail from "../../RatingBillingInvoice/GasDeposit/Modal/ModalCreateMutationDetail";
import ModalViewMutationDetail from "../../RatingBillingInvoice/GasDeposit/Modal/ModalViewMutationDetail";

const formatApprovalHistoryLabel = (key) => {
  const normalizedKey = key.toUpperCase();

  if (normalizedKey === "GAS_DEPOSIT_MUTATION") return "Mutation";
  if (normalizedKey === "GAS_DEPOSIT") return "Gas Deposit";
  if (normalizedKey === "INACTIVE_GAS_DEPOSIT") return "Inactive";

  return key
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const mapApprovalHistoryData = (approvalHistory, preferredKeys = []) => {
  const approverSource = approvalHistory?.dataApprover || {};
  const historySource = approvalHistory?.dataHistory || {};
  const allKeys = [...new Set([...Object.keys(approverSource), ...Object.keys(historySource)])];
  const orderedKeys = [
    ...preferredKeys.filter((key) => allKeys.includes(key)),
    ...allKeys.filter((key) => !preferredKeys.includes(key)),
  ].filter((key) => (approverSource[key] || historySource[key] || []).length > 0);

  if (!orderedKeys.length) return {};

  if (orderedKeys.length === 1) {
    const selectedKey = orderedKeys[0];
    return {
      dataApprover: approverSource[selectedKey] || [],
      dataHistory: historySource[selectedKey] || [],
      tabOptions: [],
    };
  }

  const dataApprover = {};
  const dataHistory = {};

  orderedKeys.forEach((key) => {
    const normalizedKey = key.toLowerCase();
    dataApprover[normalizedKey] = approverSource[key] || [];
    dataHistory[normalizedKey] = historySource[key] || [];
  });

  return {
    dataApprover,
    dataHistory,
    tabOptions: orderedKeys.map((key) => ({
      key,
      value: formatApprovalHistoryLabel(key),
      label: formatApprovalHistoryLabel(key),
    })),
  };
};

const DUMMY_MUTATION_DETAIL_DATA = [
  { key: 1, id: 1, documentNumber: "DOC-2026-001", source: "Billing",   billingPeriod: "JAN 26", mutationDate: "01-Jan-26", mutationType: "Earn",   category: "Billing Adjustment", uom: "MMBTU", quantity: 100, price: 5000000, amount: 500000000, type: "Billing",    description: "Earn dari tagihan Januari 2026",     status: "Active",  statusApproval: "Approved" },
  { key: 2, id: 2, documentNumber: "DOC-2026-002", source: "Billing",   billingPeriod: "FEB 26", mutationDate: "01-Feb-26", mutationType: "Earn",   category: "Billing Adjustment", uom: "MMBTU", quantity: 80,  price: 5000000, amount: 400000000, type: "Billing",    description: "Earn dari tagihan Februari 2026",    status: "Active",  statusApproval: "Waiting Approval" },
  { key: 3, id: 3, documentNumber: "DOC-2026-003", source: "Billing",   billingPeriod: "MAR 26", mutationDate: "15-Mar-26", mutationType: "Redeem", category: "Redeem",              uom: "MMBTU", quantity: 50,  price: 5000000, amount: 250000000, type: "Billing",    description: "Redeem tagihan Maret 2026",          status: "Expired", statusApproval: "Approved" },
  { key: 4, id: 4, documentNumber: "DOC-2026-004", source: "Adjustment", billingPeriod: "APR 26", mutationDate: "01-Apr-26", mutationType: "Earn",   category: "Billing Adjustment", uom: "MMBTU", quantity: 120, price: 5000000, amount: 600000000, type: "Adjustment", description: "Earn dari adjustment April 2026",     status: "Active",  statusApproval: "Approved" },
  { key: 5, id: 5, documentNumber: "DOC-2026-005", source: "Billing",   billingPeriod: "MAY 26", mutationDate: "01-May-26", mutationType: "Expire", category: "Expired",             uom: "MMBTU", quantity: 30,  price: 5000000, amount: 150000000, type: "Billing",    description: "Expired gas deposit Mei 2026",       status: "Expired", statusApproval: "Approved" },
  { key: 6, id: 6, documentNumber: "DOC-2026-006", source: "Manual",    billingPeriod: "JUN 26", mutationDate: "10-Jun-26", mutationType: "Earn",   category: "Billing Adjustment", uom: "MMBTU", quantity: 200, price: 5000000, amount: 1000000000, type: "Billing",  description: "Earn manual input Juni 2026",        status: "Active",  statusApproval: "Waiting Approval" },
  { key: 7, id: 7, documentNumber: "DOC-2026-007", source: "Billing",   billingPeriod: "JUL 26", mutationDate: "01-Jul-26", mutationType: "Redeem", category: "Redeem",              uom: "MMBTU", quantity: 60,  price: 5000000, amount: 300000000, type: "Billing",    description: "Redeem tagihan Juli 2026",           status: "Active",  statusApproval: "Rejected" },
  { key: 8, id: 8, documentNumber: "DOC-2026-008", source: "Billing",   billingPeriod: "AUG 26", mutationDate: "01-Aug-26", mutationType: "Earn",   category: "Cancel Expired",      uom: "MMBTU", quantity: 90,  price: 5000000, amount: 450000000, type: "Adjustment", description: "Cancel expired Agustus 2026",        status: "Active",  statusApproval: "Approved" },
  { key: 9, id: 9, documentNumber: "DOC-2026-009", source: "Billing",   billingPeriod: "SEP 26", mutationDate: "15-Sep-26", mutationType: "Redeem", category: "Redeem",              uom: "MMBTU", quantity: 45,  price: 5000000, amount: 225000000, type: "Billing",    description: "Redeem tagihan September 2026",      status: "Expired", statusApproval: "Approved" },
  { key: 10, id: 10, documentNumber: "DOC-2026-010", source: "Manual",  billingPeriod: "DEC 26", mutationDate: "01-Dec-26", mutationType: "Expire", category: "Expired",             uom: "MMBTU", quantity: 25,  price: 5000000, amount: 125000000, type: "Billing",    description: "Expired akhir tahun 2026",           status: "Expired", statusApproval: "Approved" },
];

const DUMMY_APPROVAL_ROWS_GD = [
  { key: 1, no: 1, approver: "Approver 1", role: "Supervisor", status: "Waiting Approval" },
  { key: 2, no: 2, approver: "Approver 2", role: "Manager", status: "Pending" },
];

const DUMMY_ATTACHMENT_ROWS_GD = [
  { key: 1, no: 1, fileName: "gas-deposit-document.pdf", uploadedBy: "maker", uploadDate: "15 Apr 2026" },
];

const PayGasDepositeDetail = (props) => {
  const { selectedData, onClose } = props;
  const detailRef = useRef(null);
  const dispatch = useDispatch();
  const selectedGasDepositId = selectedData?.gasDepositId;

  const [modalCreateMD, setModalCreateMD] = useState(false);
  const [modalViewMD, setModalViewMD] = useState(false);
  const [modalApprovalHistoryMD, setModalApprovalHistoryMD] = useState(false);
  const [selectedMutationDetail, setSelectedMutationDetail] = useState(null);
  const [dataApprovalHistoryFixMD, setDataApprovalHistoryFixMD] = useState({});

  const {
    data_approval_history,
    loading_history,
  } = useSelector((state) => state.gasDepositRbi);

  // ===================== Mutation Detail State =====================
  const searchInputMD = useRef(null);
  const [searchedColumnMD, setSearchedColumnMD] = useState("");
  const [searchTextMD, setSearchTextMD] = useState("");
  const [searchMD, setSearchMD] = useState({});
  const [fixedColumnsMD, setFixedColumnsMD] = useState(() => ({
    left: [],
    right: ["status", "statusApproval"],
  }));

  // ===================== Fetch data =====================
  useEffect(() => {
    if (selectedGasDepositId && detailRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }, [selectedGasDepositId]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      setDataApprovalHistoryFixMD(
        mapApprovalHistoryData(data_approval_history, [
          "GAS_DEPOSIT_MUTATION",
          "GAS_DEPOSIT",
          "INACTIVE_GAS_DEPOSIT",
        ]),
      );
    } else {
      setDataApprovalHistoryFixMD({});
    }
  }, [data_approval_history]);

  // ===================== Mutation Detail Handlers =====================
  const handleSearchMD = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMD(selectedKeys[0]);
    setSearchedColumnMD(selectedKeys[0] ? dataIndex : "");
    setSearchMD((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSortMD = () => {};

  const handleApprovalHistoryMD = (record) => {
    dispatch(getApprovalHistory(record?.id || selectedGasDepositId));
    setModalApprovalHistoryMD(true);
  };

  const itemGrantAccessMD = [
    {
      action: "View",
      type: "table",
      render: (record) => {
        const menuItems = [
          {
            key: "update",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconUpdateAction" width={16} />
                <span>Update</span>
              </span>
            ),
            onClick: () => {},
          },
          {
            key: "approvalHistory",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconLogHistory" width={16} />
                <span>Approval History</span>
              </span>
            ),
            onClick: () => handleApprovalHistoryMD(record),
          },
          {
            type: "divider",
          },
          {
            key: "cancel",
            label: (
              <span className="flex items-center gap-2">
                <SVGIcon name="IconSquareX" color="#ef4444" width={16} />
                <span className="text-red-500">Cancel</span>
              </span>
            ),
            onClick: () => {},
          },
        ];
        return (
          <div className="flex items-center justify-center gap-1">
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <button
                type="button"
                data-stop-row-click="true"
                className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <SVGIcon name="IconTripleDot" color="#0075bf" width={20} />
              </button>
            </Dropdown>
            <Tooltip title="View Detail">
              <button
                type="button"
                data-stop-row-click="true"
                className="inline-flex items-center justify-center rounded border-0 bg-transparent p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMutationDetail(record);
                  setModalViewMD(true);
                }}
              >
                <SVGIcon name="IconDetail" color="#0075bf" width={20} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const actionColsMD = useColumnActionPermission(["view"], itemGrantAccessMD).map((col) => ({
    ...col,
    width: 60,
    align: "center",
  }));

  const baseColumnsMD = useMemo(() => {
    return columnsMutationDetail(0, 0, searchInputMD, searchedColumnMD, searchTextMD, handleSearchMD, searchMD);
  }, [searchedColumnMD, searchTextMD, searchMD]);

  const allColumnsMD = useMemo(() => {
    return [...baseColumnsMD, ...actionColsMD].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsMD, actionColsMD]);

  const processedColumnsMD = useMemo(
    () => applyFixedColumns(allColumnsMD, fixedColumnsMD),
    [allColumnsMD, fixedColumnsMD],
  );

  const columnDefinitionsMD = useMemo(
    () => allColumnsMD.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumnsMD],
  );

  const dataSourceMD = DUMMY_MUTATION_DETAIL_DATA;

  // ===================== Approval / Attachment Columns =====================
  const approvalColumnsGD = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
    { key: "approver", title: "APPROVER", dataIndex: "approver", width: 150 },
    { key: "role", title: "ROLE", dataIndex: "role", width: 120 },
    { key: "status", title: "STATUS", dataIndex: "status", width: 150 },
  ], []);

  const attachmentColumnsGD = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
    { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 200 },
    { key: "uploadedBy", title: "UPLOADED BY", dataIndex: "uploadedBy", width: 150 },
    { key: "uploadDate", title: "UPLOAD DATE", dataIndex: "uploadDate", width: 130 },
  ], []);

  // ===================== Tabs content =====================
  const gasDepositTab = (
    <div className="flex flex-col gap-1 mt-2">
      {/* ACCOUNT INFORMATION */}
      <CollapsibleContainer header="Account Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Customer Number">{selectedData?.customerNumber || "-"}</DetailText>
          <DetailText label="Customer Name">{selectedData?.customerName || "-"}</DetailText>
          <DetailText label="Account Number">{selectedData?.accountNumber || "-"}</DetailText>
          <DetailText label="Account Name">{selectedData?.accountName || "-"}</DetailText>
          <DetailText label="Account Group Type">{selectedData?.accountGroupType || "-"}</DetailText>
          <DetailText label="SOR">{selectedData?.sor || "-"}</DetailText>
          <DetailText label="Cost Center">{selectedData?.costCenter || "-"}</DetailText>
          <DetailText label="Account Segment">{selectedData?.accountSegment || "-"}</DetailText>
          <DetailText label="Meter Reading Code">{selectedData?.meterReadingCode || "-"}</DetailText>
          <DetailText label="Account Type">{selectedData?.accountType || "-"}</DetailText>
          <DetailText label="Classification Type">{selectedData?.classificationType || "-"}</DetailText>
          <DetailText label="SAP CUST ID">{selectedData?.sapCustId || "-"}</DetailText>
        </div>
      </CollapsibleContainer>

      {/* GAS DEPOSIT INFORMATION */}
      <CollapsibleContainer header="Gas Deposit Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Terms Earn">{selectedData?.termsEarn ?? "-"}</DetailText>
          <DetailText label="Terms Redeem">{selectedData?.termsRedeem ?? "-"}</DetailText>
          <DetailText label="Period Earn">{selectedData?.periodEarn || selectedData?.earnPeriod || "-"}</DetailText>
          <DetailText label="Period Start Redeem">{selectedData?.periodRedeemStart || "-"}</DetailText>
          <DetailText label="Period End Redeem">{selectedData?.periodRedeemEnd || "-"}</DetailText>
          <DetailText label="Period">{selectedData?.period || "-"}</DetailText>
          <DetailText label="Time Unit">{selectedData?.timeUnit || "-"}</DetailText>
          <DetailText label="UOM">{selectedData?.uom || "-"}</DetailText>
          <DetailText label="Amount">{selectedData?.amount ?? "-"}</DetailText>
          <DetailText label="Receipt Balance">{selectedData?.cashBalance ?? selectedData?.receiptBalance ?? "-"}</DetailText>
          <DetailText label="Type">{selectedData?.type || "-"}</DetailText>
          <DetailText label="Source">{selectedData?.source || "-"}</DetailText>
          <DetailText label="Description" className="sm:col-span-2 lg:col-span-5">{selectedData?.description || "-"}</DetailText>
        </div>
      </CollapsibleContainer>
    </div>
  );

  const approvalTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Approval Information" border>
        <TableRBI
          idTable="rc-gas-deposite-approval-table"
          dataSource={DUMMY_APPROVAL_ROWS_GD}
          columns={approvalColumnsGD}
          totalData={DUMMY_APPROVAL_ROWS_GD.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
        />
      </CollapsibleContainer>
    </div>
  );

  const attachmentTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Attachment" border>
        <TableRBI
          idTable="rc-gas-deposite-attachment-table"
          dataSource={DUMMY_ATTACHMENT_ROWS_GD}
          columns={attachmentColumnsGD}
          totalData={DUMMY_ATTACHMENT_ROWS_GD.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
        />
      </CollapsibleContainer>
    </div>
  );

  const tabItems = [
    { key: "gasDeposit", label: "Gas Deposit", children: gasDepositTab },
    { key: "approval", label: "Approval", children: approvalTab },
    { key: "attachment", label: "Attachment", children: attachmentTab },
  ];

  // ===================== Render =====================
  return (
    <div ref={detailRef} className="scroll-mt-4">
      {/* ========== GAS DEPOSIT DETAIL ========== */}
      <CollapsibleCardContainer header="GAS DEPOSIT DETAIL" defaultOpen={false}>
        <Tabs
          items={tabItems}
          defaultActiveKey="gasDeposit"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0"
        />
      </CollapsibleCardContainer>

      {/* ========== MUTATION DETAIL ========== */}
      <CollapsibleCardContainer header="MUTATION DETAIL" defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => setModalCreateMD(true)}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="rc-mutation-detail-table"
          dataSource={dataSourceMD}
          columns={processedColumnsMD}
          totalData={DUMMY_MUTATION_DETAIL_DATA.length}
          tableScrolled={{ x: 1200, y: 400 }}
          onSort={onSortMD}
          columnDefinitions={columnDefinitionsMD}
          fixedColumns={fixedColumnsMD}
          setFixedColumns={setFixedColumnsMD}
          loading={false}
          showExport={false}
          usePagination={false}
        />
      </CollapsibleCardContainer>

      {/* ========== HISTORY LOG INFORMATION ========== */}
      <CollapsibleCardContainer header="HISTORY LOG INFORMATION" defaultOpen={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-3">
          <DetailText label="Record ID">{selectedData?.id || selectedData?.gasDepositId || "-"}</DetailText>
          <DetailText label="Created Date">
            {selectedData?.createdDate
              ? moment(selectedData.createdDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Created By">{selectedData?.createdBy || "-"}</DetailText>
          <DetailText label="Updated Date">{selectedData?.updatedDate || "-"}</DetailText>
          <DetailText label="Updated By">{selectedData?.updatedBy || "-"}</DetailText>
        </div>
      </CollapsibleCardContainer>

      {/* ========== MODAL ========== */}
      <ModalCreateMutationDetail
        isOpen={modalCreateMD}
        handleCancel={() => setModalCreateMD(false)}
        handleRefresh={() => {
          dispatch(getAllGasDepositPaginate({ page: 1, pageSize: 100, search: "", sort: "" }));
          onClose();
        }}
        selectedData={selectedData}
      />

      <ModalViewMutationDetail
        isOpen={modalViewMD}
        handleCancel={() => {
          setModalViewMD(false);
          setSelectedMutationDetail(null);
        }}
        selectedData={selectedData}
        selectedMutationDetail={selectedMutationDetail}
      />

      <ModalHistory
        isOpen={modalApprovalHistoryMD && !!dataApprovalHistoryFixMD}
        handleClose={() => setModalApprovalHistoryMD(false)}
        header={"Approval History"}
        width={1000}
        tabOptions={dataApprovalHistoryFixMD?.tabOptions}
        dataApprover={dataApprovalHistoryFixMD?.dataApprover}
        dataHistory={dataApprovalHistoryFixMD?.dataHistory}
        loading={loading_history}
      />
    </div>
  );
};

PayGasDepositeDetail.propTypes = {
  onClose: PropTypes.func,
  selectedData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasDepositId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerNumber: PropTypes.string,
    customerName: PropTypes.string,
    accountNumber: PropTypes.string,
    accountName: PropTypes.string,
    accountGroupType: PropTypes.string,
    sor: PropTypes.string,
    costCenter: PropTypes.string,
    accountSegment: PropTypes.string,
    meterReadingCode: PropTypes.string,
    accountType: PropTypes.string,
    classificationType: PropTypes.string,
    sapCustId: PropTypes.string,
    termsEarn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsRedeem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    periodEarn: PropTypes.string,
    earnPeriod: PropTypes.string,
    periodRedeemStart: PropTypes.string,
    periodRedeemEnd: PropTypes.string,
    period: PropTypes.string,
    timeUnit: PropTypes.string,
    uom: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cashBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    receiptBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    source: PropTypes.string,
    description: PropTypes.string,
    createdDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedDate: PropTypes.string,
    updatedBy: PropTypes.string,
  }),
};

PayGasDepositeDetail.defaultProps = {
  onClose: () => {},
  selectedData: null,
};

export default PayGasDepositeDetail;
