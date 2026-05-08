/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, message } from "antd";
import moment from "moment";
import CollapsibleCardContainer from "../../../../components/CollapsibleCardContainer";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import DetailText from "../../../../components/DetailText";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon";
import { columnsMutationDetail } from "../../RatingBillingInvoice/GasDeposit/Table/TableMutationDetail";
import PayGasDepositeMutationDetailModal from "./Modal/PayGasDepositeMutationDetailModal";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import {
  getPayGasDepositApprovalHistory,
  getPayGasDepositMutationDetailPaginate,
} from "../../../../redux/slices/receipt_collection/gasDepositPayment";

const formatPeriodEarn = (startValue, endValue) => {
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

const mapApprovalRows = (approvalHistory) => {
  const approverSource = approvalHistory?.dataApprover || {};
  const rows = [];

  Object.values(approverSource).forEach((items) => {
    (items || []).forEach((item) => {
      rows.push({
        key: `${rows.length + 1}`,
        no: rows.length + 1,
        approver:
          item?.employeeName ||
          item?.approverName ||
          item?.fullName ||
          item?.name ||
          item?.userName ||
          "-",
        role:
          item?.positionName ||
          item?.roleName ||
          item?.position ||
          item?.role ||
          item?.userLevel ||
          "-",
        status:
          item?.statusApproval ||
          item?.status ||
          item?.approvalStatus ||
          "Waiting Approval",
      });
    });
  });

  return rows;
};

const LOCAL_DRAFT_MUTATION_MESSAGE = "Mutation detail was added as a local draft only. It is not saved to the payment backend yet.";

const PayGasDepositeDetail = (props) => {
  const { selectedData } = props;
  const detailRef = useRef(null);
  const dispatch = useDispatch();
  const selectedGasDepositId = selectedData?.gasDepositId;

  const {
    data_approval_history,
    data_mutation_detail,
    loading_history,
    loading_mutation_detail,
  } = useSelector((state) => state.gasDepositPayment);

  const searchInputMD = useRef(null);
  const [searchedColumnMD, setSearchedColumnMD] = useState("");
  const [searchTextMD, setSearchTextMD] = useState("");
  const [searchMD, setSearchMD] = useState({});
  const [fixedColumnsMD, setFixedColumnsMD] = useState(() => ({
    left: [],
    right: ["status", "statusApproval"],
  }));
  const [isModalCreateMutationOpen, setIsModalCreateMutationOpen] = useState(false);
  const [draftMutationRows, setDraftMutationRows] = useState([]);

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
    if (selectedGasDepositId) {
      dispatch(
        getPayGasDepositMutationDetailPaginate({
          gasDepositId: selectedGasDepositId,
          page: 1,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(searchMD)),
          sort: "mutationDate~desc",
        }),
      );
    }
  }, [dispatch, searchMD, selectedGasDepositId]);

  useEffect(() => {
    if (selectedData?.accountId) {
      dispatch(
        getPayGasDepositApprovalHistory({
          accountId: selectedData.accountId,
          summaryRefId: selectedData.pendingStgSumId,
        }),
      );
    }
  }, [dispatch, selectedData?.accountId, selectedData?.pendingStgSumId]);

  const handleSearchMD = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextMD(selectedKeys[0]);
    setSearchedColumnMD(selectedKeys[0] ? dataIndex : "");
    setSearchMD((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSortMD = () => {};

  const baseColumnsMD = useMemo(() => (
    columnsMutationDetail(
      0,
      0,
      searchInputMD,
      searchedColumnMD,
      searchTextMD,
      handleSearchMD,
      searchMD,
    )
  ), [searchedColumnMD, searchMD, searchTextMD]);

  const processedColumnsMD = useMemo(
    () => applyFixedColumns(baseColumnsMD, fixedColumnsMD),
    [baseColumnsMD, fixedColumnsMD],
  );

  const columnDefinitionsMD = useMemo(
    () => baseColumnsMD.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    })),
    [baseColumnsMD],
  );

  const dataSourceMD = useMemo(
    () => data_mutation_detail?.result || [],
    [data_mutation_detail?.result],
  );
  const mutationDataSource = useMemo(
    () => [...draftMutationRows, ...dataSourceMD],
    [dataSourceMD, draftMutationRows],
  );

  const sourceOptions = useMemo(() => {
    const values = new Set();
    const options = [];

    [selectedData?.source, ...dataSourceMD.map((item) => item?.source)].forEach((value) => {
      if (!value || values.has(value)) return;
      values.add(value);
      options.push({
        label: String(value)
          .toLowerCase()
          .replaceAll("_", " ")
          .replaceAll(/\b\w/g, (char) => char.toUpperCase()),
        value,
      });
    });

    return options;
  }, [dataSourceMD, selectedData?.source]);

  const billingPeriodOptions = useMemo(() => {
    const values = new Set();
    const options = [];

    [selectedData?.billingPeriod, ...dataSourceMD.map((item) => item?.billingPeriod)].forEach((value) => {
      if (!value || values.has(value)) return;
      values.add(value);
      options.push({
        label: value,
        value,
      });
    });

    return options;
  }, [dataSourceMD, selectedData?.billingPeriod]);

  const approvalColumnsGD = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
    { key: "approver", title: "APPROVER", dataIndex: "approver", width: 200 },
    { key: "role", title: "ROLE / POSITION", dataIndex: "role", width: 200 },
    { key: "status", title: "STATUS", dataIndex: "status", width: 150 },
  ], []);

  const approvalRows = useMemo(() => mapApprovalRows(data_approval_history), [data_approval_history]);

  const attachmentColumnsGD = useMemo(() => [
    { key: "no", title: "NO", dataIndex: "no", width: 50, align: "center" },
    { key: "fileName", title: "FILE NAME", dataIndex: "fileName", width: 200 },
    { key: "uploadedBy", title: "UPLOADED BY", dataIndex: "uploadedBy", width: 150 },
    { key: "uploadDate", title: "UPLOAD DATE", dataIndex: "uploadDate", width: 130 },
  ], []);

  const attachmentRows = [];

  const gasDepositTab = (
    <div className="flex flex-col gap-1 mt-2">
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

      <CollapsibleContainer header="Gas Deposit Information" border className="mt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
          <DetailText label="Terms Earn">{selectedData?.termsEarn ?? "-"}</DetailText>
          <DetailText label="Terms Redeem">{selectedData?.termsRedeem ?? "-"}</DetailText>
          <DetailText label="Period Earn">
            {selectedData?.periodEarn || formatPeriodEarn(selectedData?.earnStartDate, selectedData?.earnEndDate)}
          </DetailText>
          <DetailText label="Period Start Redeem">
            {selectedData?.redeemStartDate
              ? moment(selectedData.redeemStartDate).format("D-MMM-YY")
              : selectedData?.periodRedeemStart || "-"}
          </DetailText>
          <DetailText label="Period End Redeem">
            {selectedData?.redeemEndDate
              ? moment(selectedData.redeemEndDate).format("D-MMM-YY")
              : selectedData?.periodRedeemEnd || "-"}
          </DetailText>
          <DetailText label="Time Unit">{selectedData?.timeUnit || "-"}</DetailText>
          <DetailText label="Currency">{selectedData?.currency || "-"}</DetailText>
          <DetailText label="UOM">{selectedData?.uom || "-"}</DetailText>
          <DetailText label="Receipt Balance">{selectedData?.cashBalance ?? selectedData?.balanceAmount ?? "-"}</DetailText>
          <DetailText label="Source">{selectedData?.source || "-"}</DetailText>
          <DetailText label="Status">{selectedData?.status || "-"}</DetailText>
          <DetailText label="Status Approval">{selectedData?.statusApproval || "-"}</DetailText>
          <DetailText label="Description" className="sm:col-span-2 lg:col-span-5">
            {selectedData?.description || "-"}
          </DetailText>
        </div>
      </CollapsibleContainer>
    </div>
  );

  const approvalTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Approval Information" border>
        <TableRBI
          idTable="rc-gas-deposite-approval-table"
          dataSource={approvalRows}
          columns={approvalColumnsGD}
          totalData={approvalRows.length}
          tableScrolled={{ x: 800, y: 250 }}
          showExport={false}
          usePagination={false}
          showRefresh={false}
          loading={loading_history}
        />
      </CollapsibleContainer>
    </div>
  );

  const attachmentTab = (
    <div className="mt-2">
      <CollapsibleContainer header="Attachment" border>
        <TableRBI
          idTable="rc-gas-deposite-attachment-table"
          dataSource={attachmentRows}
          columns={attachmentColumnsGD}
          totalData={attachmentRows.length}
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

  return (
    <div ref={detailRef} className="scroll-mt-4">
      <CollapsibleCardContainer header="GAS DEPOSIT DETAIL" defaultOpen={false}>
        <Tabs
          items={tabItems}
          defaultActiveKey="gasDeposit"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0"
        />
      </CollapsibleCardContainer>

      <CollapsibleCardContainer header="MUTATION DETAIL" defaultOpen={true}>
        <div className="flex justify-end mb-3">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            onClick={() => setIsModalCreateMutationOpen(true)}
          >
            Create
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="rc-mutation-detail-table"
          dataSource={mutationDataSource}
          columns={processedColumnsMD}
          totalData={mutationDataSource.length}
          tableScrolled={{ x: 1200, y: 400 }}
          onSort={onSortMD}
          columnDefinitions={columnDefinitionsMD}
          fixedColumns={fixedColumnsMD}
          setFixedColumns={setFixedColumnsMD}
          loading={loading_mutation_detail}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
        />
        <div className="flex justify-end mt-2 text-sm text-amber-600">
          New mutation rows added here are local drafts only.
        </div>
      </CollapsibleCardContainer>

      <CollapsibleCardContainer header="HISTORY LOG INFORMATION" defaultOpen={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-3">
          <DetailText label="Record ID">
            {selectedData?.accountId || selectedData?.gasDepositId || "-"}
          </DetailText>
          <DetailText label="Created Date">
            {selectedData?.createdDate
              ? moment(selectedData.createdDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Created By">{selectedData?.createdBy || "-"}</DetailText>
          <DetailText label="Updated Date">
            {selectedData?.updatedDate
              ? moment(selectedData.updatedDate).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>
          <DetailText label="Updated By">{selectedData?.updatedBy || "-"}</DetailText>
        </div>
      </CollapsibleCardContainer>

      <PayGasDepositeMutationDetailModal
        isOpen={isModalCreateMutationOpen}
        handleCancel={() => setIsModalCreateMutationOpen(false)}
        handleRefresh={(values) => {
          if (!values) return;

          const mutationDateValue = values.mutationDate?.format
            ? values.mutationDate.format("D-MMM-YY")
            : values.mutationDate || "-";
          const sourceLabel = sourceOptions.find((item) => item.value === values.source)?.label
            || values.source
            || "-";
          const billingPeriodLabel = billingPeriodOptions.find((item) => item.value === values.period)?.label
            || values.period
            || "-";

          setDraftMutationRows((prev) => ([
            {
              key: `draft-${Date.now()}-${prev.length + 1}`,
              documentNumber: values.documentNumber || "-",
              source: sourceLabel,
              billingPeriod: billingPeriodLabel,
              mutationDate: mutationDateValue,
              mutationType: values.type || "-",
              category: values.category || "-",
              amount: values.amount || "-",
              type: values.type || "-",
              description: values.description || "-",
              statusApproval: "Draft",
              status: "Draft",
            },
            ...prev,
          ]));
          message.info(LOCAL_DRAFT_MUTATION_MESSAGE);
        }}
        sourceOptions={sourceOptions}
        billingPeriodOptions={billingPeriodOptions}
        mutationContext={{
          rateType: selectedData?.rateType || "",
          rateDate: selectedData?.rateDate || null,
          rate: selectedData?.rate || "",
          source: selectedData?.source || sourceOptions[0]?.value,
          billingPeriod: selectedData?.billingPeriod || billingPeriodOptions[0]?.value,
        }}
      />
    </div>
  );
};

PayGasDepositeDetail.propTypes = {
  selectedData: PropTypes.shape({
    accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasDepositId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pendingStgSumId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customerNumber: PropTypes.string,
    customerName: PropTypes.string,
    accountNumber: PropTypes.string,
    accountName: PropTypes.string,
    accountGroupType: PropTypes.string,
    sor: PropTypes.string,
    costCenter: PropTypes.string,
    accountSegment: PropTypes.string,
    meterReadingCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    accountType: PropTypes.string,
    classificationType: PropTypes.string,
    sapCustId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsEarn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termsRedeem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    periodEarn: PropTypes.string,
    redeemStartDate: PropTypes.string,
    redeemEndDate: PropTypes.string,
    earnStartDate: PropTypes.string,
    earnEndDate: PropTypes.string,
    timeUnit: PropTypes.string,
    uom: PropTypes.string,
    currency: PropTypes.string,
    cashBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    balanceAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    source: PropTypes.string,
    status: PropTypes.string,
    statusApproval: PropTypes.string,
    description: PropTypes.string,
    createdDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedDate: PropTypes.string,
    updatedBy: PropTypes.string,
  }),
};

PayGasDepositeDetail.defaultProps = {
  selectedData: null,
};

export default PayGasDepositeDetail;
