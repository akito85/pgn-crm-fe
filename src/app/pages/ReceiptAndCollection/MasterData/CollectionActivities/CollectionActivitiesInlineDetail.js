import React, { useMemo, useRef, useState } from "react";
import { Button, Empty, Input, Modal, Select, Tabs, Tooltip } from "antd";
import { CheckSquareOutlined, CloseSquareOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import DetailText from "../../../../../components/DetailText";
import FunctionalApproval from "../../../../../components/Approval/FuctionalApproval";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import TableRBI from "../../../../../components/TableRBI";
import StatusComponent from "../../../../../components/StatusComponent";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import SVGIcon from "../../../../../assets/Icon/index";
import { toTitleCase } from "../../../../../utils";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  bulkApproveCollectionActivities,
  getApprovalHistoryCriteriaCA,
  getListCategoryCA,
} from "../../../../../redux/slices/debt_and_collection/collectionActivities";
import CollectionActivitiesCriteriaModal from "./CollectionActivitiesCriteriaModal";

const COLLECTION_ACTIVITY_CRITERIA_CONFIG = {
  11: { field: "sor", label: "SOR", aliases: ["sor"] },
  12: {
    field: "customer",
    label: "ACCOUNT",
    aliases: ["account", "customer", "cust"],
  },
  13: {
    field: "subDistrict",
    label: "SUB-DISTRICT",
    aliases: ["subdistrict", "sub-district"],
  },
  14: { field: "district", label: "DISTRICT", aliases: ["district"] },
  15: { field: "province", label: "PROVINCE", aliases: ["province"] },
  16: {
    field: "area",
    label: "COST CENTER",
    aliases: ["costcenter", "cost center", "area"],
  },
  17: {
    field: "budget",
    label: "BUDGET",
    aliases: ["budget", "budgettype", "budget type"],
  },
  18: {
    field: "industrialSector",
    label: "INDUSTRIAL SECTOR",
    aliases: ["industrialsector", "industrial sector"],
  },
  19: {
    field: "customerSegment",
    label: "CUSTOMER SEGMENT",
    aliases: ["customersegment", "customer segment"],
  },
  20: {
    field: "accountGroup",
    label: "ACCOUNT GROUP",
    aliases: ["accountgroup", "account group", "accountgrouptype"],
  },
  21: {
    field: "serviceType",
    label: "SERVICE TYPE",
    aliases: ["servicetype", "service type"],
  },
  22: {
    field: "accountCategory",
    label: "ACCOUNT CATEGORY",
    aliases: ["accountcategory", "account category"],
  },
  23: {
    field: "gsizes",
    label: "G-SIZES",
    aliases: ["gsizes", "gsize", "g-sizes", "g sizes"],
  },
  24: {
    field: null,
    label: "ALL",
    aliases: ["all", "allcriteria", "all criteria"],
  },
  39: { field: "city", label: "CITY", aliases: ["city"] },
};

// Preferred display order — ensures dependent fields follow their parent
// (e.g. province must appear before city/district/subDistrict)
const CRITERIA_PREFERRED_FIELDS = [
  "province",
  "city",
  "district",
  "subDistrict",
  "sor",
  "customer",
  "area",
  "budget",
  "industrialSector",
  "customerSegment",
  "accountGroup",
  "serviceType",
  "accountCategory",
  "gsizes",
];

const COLLECTION_ACTIVITY_CRITERIA_LIST = Object.entries(
  COLLECTION_ACTIVITY_CRITERIA_CONFIG
).map(([id, config]) => ({ id: Number(id), ...config }));

const normalizeCollectionCriteriaLabel = (value = "") =>
  value.toString().toLowerCase().replace(/[^a-z0-9]/g, "");

const getFirstCollectionCriteriaValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const normalizeCollectionCriteriaValue = (value) => {
  const normalizedValue = Number(value);
  return Number.isNaN(normalizedValue) ? value : normalizedValue;
};

const getCollectionCriteriaConfigById = (criteriaId) =>
  COLLECTION_ACTIVITY_CRITERIA_CONFIG[
    normalizeCollectionCriteriaValue(criteriaId)
  ];

const getCollectionCriteriaConfigByType = (criteriaType = "") => {
  const normalizedType = normalizeCollectionCriteriaLabel(criteriaType);
  return COLLECTION_ACTIVITY_CRITERIA_LIST.find(
    (config) =>
      normalizeCollectionCriteriaLabel(config.label) === normalizedType ||
      config.aliases.some(
        (alias) => normalizeCollectionCriteriaLabel(alias) === normalizedType
      )
  );
};

const normalizeCriteriaColumnLabel = (value = "") =>
  value
    .toString()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getCriteriaDisplayValue = (criteriaItem = {}) => {
  const value = getFirstCollectionCriteriaValue(
    criteriaItem.criteriaValueDisplay,
    criteriaItem.criteriaValueText,
    criteriaItem.criteriaValueNumber
  );

  return value === undefined || value === null || value === "" ? "-" : value;
};

const buildCriteriaTable = (criteriaData = []) => {
  const groupedCriteria = new Map();
  const orderedColumns = [];

  criteriaData.forEach((criteriaItem, index) => {
    const criteriaConfig =
      getCollectionCriteriaConfigByType(criteriaItem.criteriaType) ||
      getCollectionCriteriaConfigById(criteriaItem.criteriaValueId);
    const criteriaGroupId = criteriaItem.criteriaGroupId || index + 1;
    const groupKey = criteriaGroupId.toString();
    const columnKey =
      criteriaConfig?.field ||
      normalizeCollectionCriteriaLabel(criteriaItem.criteriaType || `criteria-${index + 1}`);
    const columnLabel =
      criteriaConfig?.label ||
      normalizeCriteriaColumnLabel(criteriaItem.criteriaType || `Criteria ${index + 1}`);

    if (!orderedColumns.some((column) => column.key === columnKey)) {
      orderedColumns.push({
        key: columnKey,
        title: columnLabel,
      });
    }

    if (!groupedCriteria.has(groupKey)) {
      groupedCriteria.set(groupKey, {
        key: groupKey,
        criteriaGroupId,
        criteriaItemIds: [],
        startDate: criteriaItem.startDate || null,
        endDate: criteriaItem.endDate || null,
        status: criteriaItem.status || null,
        statusApproval: criteriaItem.statusApproval || null,
      });
    }

    const criteriaRow = groupedCriteria.get(groupKey);
    const cellValue = getCriteriaDisplayValue(criteriaItem);

    if (criteriaItem.id) {
      criteriaRow.criteriaItemIds.push(criteriaItem.id);
    }

    if (!criteriaRow.startDate && criteriaItem.startDate) {
      criteriaRow.startDate = criteriaItem.startDate;
    }

    if (!criteriaRow.endDate && criteriaItem.endDate) {
      criteriaRow.endDate = criteriaItem.endDate;
    }

    if (!criteriaRow.status && criteriaItem.status) {
      criteriaRow.status = criteriaItem.status;
    }

    if (!criteriaRow.statusApproval && criteriaItem.statusApproval) {
      criteriaRow.statusApproval = criteriaItem.statusApproval;
    }

    if (criteriaItem.tAppId && !criteriaRow.tAppId) {
      criteriaRow.tAppId = criteriaItem.tAppId;
    }

    if (
      criteriaRow[columnKey] &&
      criteriaRow[columnKey] !== "-" &&
      criteriaRow[columnKey] !== cellValue
    ) {
      criteriaRow[columnKey] = `${criteriaRow[columnKey]}, ${cellValue}`;
    } else {
      criteriaRow[columnKey] = cellValue;
    }
  });

  return {
    dynamicColumns: orderedColumns.sort((a, b) => {
      const ai = CRITERIA_PREFERRED_FIELDS.indexOf(a.key);
      const bi = CRITERIA_PREFERRED_FIELDS.indexOf(b.key);
      return (ai === -1 ? CRITERIA_PREFERRED_FIELDS.length : ai) -
             (bi === -1 ? CRITERIA_PREFERRED_FIELDS.length : bi);
    }),
    rows: Array.from(groupedCriteria.values()).sort(
      (left, right) => left.criteriaGroupId - right.criteriaGroupId
    ),
  };
};

const formatDate = (value) =>
  value ? moment(value).format("DD MMM YYYY") : "-";

const normalizeStatus = (value) =>
  (value || "").toString().trim().toUpperCase();

const mapDetailAttachments = (attachments = []) =>
  (attachments || []).map((item, index) => {
    const attachmentUrl =
      item.urlFile1 ||
      item.urlFile2 ||
      `/v1/dbs/api/collection-activities/download-attachment/${item.id}`;

    return {
      ...item,
      key: item.id || index + 1,
      fileType: item.fileType || item.type,
      type: item.type || item.fileType,
      size: item.fileSize,
      urlFile1: attachmentUrl,
      urlFile2: attachmentUrl,
      createdDate: item.createdDate
        ? moment(item.createdDate).format("DD MMM YYYY")
        : "",
      dataType: "exist",
    };
  });

const SectionPanel = ({ title, children }) => (
  <div className="rounded-lg border border-[#C8CDD4] bg-white overflow-hidden">
    <div className="border-b border-[#C8CDD4] px-4 py-3">
      <p className="text-primary uppercase">{title}</p>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const CollectionActivitiesInlineDetail = ({
  detailData,
  attachmentData = [],
  approvalOptions = [],
  approvalDetails = [],
  loadingApproval = false,
  dispatch,
  onCriteriaSubmitted = () => {},
}) => {
  const { TextArea } = Input;
  const approvalSearchInput = useRef(null);
  const [activeTab, setActiveTab] = useState("activities");
  const [criteriaModalOpen, setCriteriaModalOpen] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [criteriaApprovalRemark, setCriteriaApprovalRemark] = useState("");
  const [submittingCriteriaApproval, setSubmittingCriteriaApproval] =
    useState(false);
  const [criteriaDetailModal, setCriteriaDetailModal] = useState({ open: false, row: null });
  const [criteriaHistoryModal, setCriteriaHistoryModal] = useState({ open: false, data: null, loading: false });

  const handleApprovalSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const criteriaTable = useMemo(
    () => buildCriteriaTable(detailData?.criteriaData || []),
    [detailData]
  );

  const criteriaSummary = useMemo(() => {
    if (criteriaTable.dynamicColumns.length === 0) {
      return "-";
    }

    if (
      criteriaTable.dynamicColumns.length === 1 &&
      criteriaTable.dynamicColumns[0].key === "allCriteria"
    ) {
      return "All";
    }

    return criteriaTable.dynamicColumns
      .map((column) => column.title)
      .join(", ");
  }, [criteriaTable.dynamicColumns]);

  const hasCriteriaTemplate = (detailData?.criteriaData || []).some(
    (criteriaItem) =>
      getCollectionCriteriaConfigByType(criteriaItem.criteriaType) ||
      getCollectionCriteriaConfigById(criteriaItem.criteriaValueId)
  );
  const criteriaApprovalInfo = detailData?.criteriaApprovalInfo || null;
  const criteriaApprovalItemIds = detailData?.criteriaApprovalItemIds || [];
  const hasWaitingCriteriaApproval =
    Boolean(detailData?.isCriteriaApproval) ||
    criteriaTable.rows.some(
      (row) => normalizeStatus(row.statusApproval) === "WAITING APPROVAL"
    );
  const canApproveCriteria =
    Boolean(detailData?.canApproveCriteria) && Boolean(criteriaApprovalInfo?.tAppId);
  const canCreateCriteria =
    hasCriteriaTemplate &&
    normalizeStatus(detailData?.status) === "ACTIVE" &&
    ["APPROVED", "APPROVE"].includes(
      normalizeStatus(detailData?.statusApproval)
    );

  const createCriteriaTooltip = !hasCriteriaTemplate
    ? "Criteria detail is not available for this activity"
    : normalizeStatus(detailData?.status) !== "ACTIVE" ||
        !["APPROVED", "APPROVE"].includes(
          normalizeStatus(detailData?.statusApproval)
        )
      ? "Only active and approved activities can submit criteria approval"
      : "Create new criteria approval";

  const handleCriteriaApproval = async (action) => {
    if (!canApproveCriteria || !criteriaApprovalInfo?.tAppId) {
      return;
    }

    setSubmittingCriteriaApproval(true);
    try {
      // Collect all unique tAppIds from waiting-approval rows (+ the one from criteriaApprovalInfo)
      const waitingTAppIds = new Set();
      criteriaTable.rows.forEach((row) => {
        if (normalizeStatus(row.statusApproval) === "WAITING APPROVAL" && row.tAppId) {
          waitingTAppIds.add(row.tAppId);
        }
      });
      waitingTAppIds.add(criteriaApprovalInfo.tAppId);

      const items = Array.from(waitingTAppIds).map((tAppId) => ({
        collectionActivityId: detailData?.id,
        tAppId,
        category: criteriaApprovalInfo.category || "COLLECTION_ACTIVITY_CRITERIA",
      }));

      await dispatch(
        bulkApproveCollectionActivities({
          body: {
            action,
            remark: criteriaApprovalRemark.trim(),
            items,
          },
          action: action === "APPROVE" ? "approved" : "rejected",
        })
      ).unwrap();

      setCriteriaApprovalRemark("");
      onCriteriaSubmitted();
    } finally {
      setSubmittingCriteriaApproval(false);
    }
  };

  const handleCriteriaDetail = (row) => {
    const rawItems = (detailData?.criteriaData || []).filter(
      (item) => String(item.criteriaGroupId) === String(row.criteriaGroupId)
    );
    setCriteriaDetailModal({ open: true, row, rawItems });
  };

  const handleCriteriaApprovalHistory = async (row) => {
    const firstId = (row.criteriaItemIds || [])[0];
    if (!firstId) return;
    setCriteriaHistoryModal({ open: true, data: null, loading: true });
    try {
      const result = await dispatch(getApprovalHistoryCriteriaCA(firstId)).unwrap();
      setCriteriaHistoryModal({ open: true, data: result, loading: false });
    } catch {
      setCriteriaHistoryModal({ open: false, data: null, loading: false });
    }
  };

  const criteriaColumns = useMemo(
    () => [
      {
        title: "NO",
        dataIndex: "no",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      ...criteriaTable.dynamicColumns.map((column) => ({
        title: column.title,
        dataIndex: column.key,
        key: column.key,
        render: (value) => value || "-",
      })),
      {
        title: "START DATE",
        dataIndex: "startDate",
        key: "startDate",
        align: "center",
        render: (value) => formatDate(value),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        key: "endDate",
        align: "center",
        render: (value) => formatDate(value),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (value) => {
          if (!value) return "-";
          const text = toTitleCase(value.replace(/_/g, " "));
          return (
            <div className="flex justify-center">
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          );
        },
      },
      {
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        key: "statusApproval",
        align: "center",
        render: (value) => {
          if (!value) return "-";
          const text = toTitleCase(value.replace(/_/g, " "));
          return (
            <div className="flex justify-center">
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          );
        },
      },
      {
        title: "ACTION",
        key: "action",
        align: "center",
        fixed: "right",
        width: 90,
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Detail">
              <button
                type="button"
                className="border-0 bg-transparent p-0 cursor-pointer"
                onClick={() => handleCriteriaDetail(row)}
              >
                <SVGIcon name="IconDetail" width={18} />
              </button>
            </Tooltip>
            <Tooltip title="Approval History">
              <button
                type="button"
                className="border-0 bg-transparent p-0 cursor-pointer"
                onClick={() => handleCriteriaApprovalHistory(row)}
              >
                <SVGIcon name="IconLogHistory" color="#0075bf" width={18} />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [criteriaTable.dynamicColumns, handleCriteriaDetail, handleCriteriaApprovalHistory]
  );

  const attachments = useMemo(
    () => mapDetailAttachments(attachmentData),
    [attachmentData]
  );

  const selectedHierarchy =
    detailData?.criteriaApprovalInfo?.appHierId || detailData?.apphierId;
  const approvalSelectOptions = useMemo(() => {
    const normalizedOptions = approvalOptions.map((option) => ({
      label: option.label,
      value: option.value,
    }));

    if (
      !selectedHierarchy ||
      normalizedOptions.some((option) => option.value === selectedHierarchy)
    ) {
      return normalizedOptions;
    }

    return [
      {
        label:
          detailData?.criteriaApprovalInfo?.approvalName ||
          detailData?.approvalInfo?.approvalName ||
          `Hierarchy Approval ${selectedHierarchy}`,
        value: selectedHierarchy,
      },
      ...normalizedOptions,
    ];
  }, [approvalOptions, detailData, selectedHierarchy]);

  const tabItems = [
    {
      key: "activities",
      label: "Activities",
      children: (
        <SectionPanel title="Activities Information">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            <DetailText label="Activities Code" className="min-h-[52px]">
              {detailData?.activityCode || detailData?.activitiesCode || "-"}
            </DetailText>
            <DetailText label="Activities Name" className="min-h-[52px]">
              {detailData?.activityName || detailData?.activitiesName || "-"}
            </DetailText>
            <DetailText label="Media" className="min-h-[52px]">
              {detailData?.media || "-"}
            </DetailText>
            <DetailText label="Category" className="min-h-[52px]">
              {detailData?.category || "-"}
            </DetailText>
            <DetailText label="Start Date" className="min-h-[52px]">
              {formatDate(detailData?.startDate)}
            </DetailText>
            <DetailText label="End Date" className="min-h-[52px]">
              {formatDate(detailData?.endDate)}
            </DetailText>
            <DetailText label="Criteria" className="min-h-[52px] xl:col-span-2">
              {criteriaSummary}
            </DetailText>
            <DetailText
              label="Description"
              className="min-h-[52px] xl:col-span-3"
            >
              {detailData?.description || "-"}
            </DetailText>
          </div>
        </SectionPanel>
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <SectionPanel title="Approval Information">
          <div className="mb-4 w-full md:max-w-[360px]">
            <label className="mb-2 block text-xs font-semibold text-black">
              Approval Hierarchy
              <span className="pl-1 text-[#D90000]">*</span>
            </label>
            <Select
              value={selectedHierarchy || undefined}
              options={approvalSelectOptions}
              disabled
              placeholder="Approval Hierarchy"
              className="w-full"
            />
          </div>

          {selectedHierarchy ? (
            approvalDetails.length > 0 || loadingApproval ? (
              <FunctionalApproval
                dataTable={approvalDetails}
                selectedHierarchy={selectedHierarchy}
                searchInput={approvalSearchInput}
                searchedColumn={searchedColumn}
                searchText={searchText}
                handleSearch={handleApprovalSearch}
                showSelect={false}
                disableSelect={false}
                loading={loadingApproval}
              />
            ) : (
              <Empty description="Approval hierarchy detail not available" />
            )
          ) : (
            <Empty description="Approval hierarchy not available" />
          )}
        </SectionPanel>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <SectionPanel title="Attachment Information">
          <AttachmentComponent
            type="detail"
            data={attachments}
            updateData={() => {}}
            typeSelector="collectionActivities"
            dispatch={dispatch}
            getAPICategory={getListCategoryCA}
            service={debtAndCollectionHttpService}
            configApplication={configApp.PAYMENT_SERVICE}
          />
        </SectionPanel>
      ),
    },
  ];

  return (
    <>
      <CollapsibleContainer header="Detail Collection Activities" border className="mt-4" defaultOpen>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </CollapsibleContainer>

      {activeTab === "activities" ? (
        <CardContainer
          header={
            <div className="flex items-center justify-between gap-3">
              <span>Criteria Information</span>
              <Tooltip title={createCriteriaTooltip}>
                <span>
                  <Button
                    type="primary"
                    size="small"
                    disabled={!canCreateCriteria}
                    onClick={() => setCriteriaModalOpen(true)}
                    style={{
                      backgroundColor: "#0075BF",
                      borderColor: "#0075BF",
                      borderRadius: "6px",
                    }}
                  >
                    Create
                  </Button>
                </span>
              </Tooltip>
            </div>
          }
        >
          {criteriaTable.rows.length === 0 ? (
            <Empty description="Criteria detail not available" />
          ) : (
            <TableRBI
              idTable="inline-criteria-table"
              dataSource={criteriaTable.rows}
              columns={criteriaColumns}
              totalData={criteriaTable.rows.length}
              usePagination={false}
              loading={false}
              tableScrolled={{ x: "max-content" }}
              rowClassName={(record) =>
                record.criteriaItemIds?.some((id) =>
                  criteriaApprovalItemIds.includes(id)
                )
                  ? "bg-[#FFF7E6]"
                  : ""
              }
            />
          )}

          {detailData?.isCriteriaApproval ? (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-[#FFD591] bg-[#FFF7E6] px-4 py-3 text-[#D46B08]">
              <InfoCircleOutlined style={{ fontSize: 16, flexShrink: 0 }} />
              <span>
                {canApproveCriteria
                  ? "This criteria approval is waiting for your action."
                  : "This criteria approval is currently waiting for another approver."}
              </span>
            </div>
          ) : null}
        </CardContainer>
      ) : null}

      {activeTab === "activities" && detailData?.isCriteriaApproval && canApproveCriteria ? (
        <>
          <div className="mt-4 rounded-lg border border-[#D6E1F0] bg-white p-4">
            <label className="mb-2 block text-xs font-semibold text-black">
              Remark
              <span className="pl-1 text-[#D90000]">*</span>
            </label>
            <TextArea
              rows={4}
              value={criteriaApprovalRemark}
              onChange={(event) => setCriteriaApprovalRemark(event.target.value)}
              placeholder="Type your remark for approval/rejection"
              disabled={submittingCriteriaApproval}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <ButtonComponent
              type="default"
              onClick={() => setCriteriaApprovalRemark("")}
              disabled={submittingCriteriaApproval}
            >
              cancel
            </ButtonComponent>
            <div className="flex items-center gap-2">
              <ButtonComponent
                type="reject"
                icon={<CloseSquareOutlined />}
                onClick={() => handleCriteriaApproval("REJECT")}
                disabled={!criteriaApprovalRemark.trim() || submittingCriteriaApproval}
                loading={submittingCriteriaApproval}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                icon={<CheckSquareOutlined />}
                onClick={() => handleCriteriaApproval("APPROVE")}
                disabled={!criteriaApprovalRemark.trim() || submittingCriteriaApproval}
                loading={submittingCriteriaApproval}
              >
                Approve
              </ButtonComponent>
            </div>
          </div>
        </>
      ) : null}

      <CollectionActivitiesCriteriaModal
        isOpen={criteriaModalOpen}
        onClose={() => setCriteriaModalOpen(false)}
        detailData={detailData}
        dispatch={dispatch}
        onSubmitted={onCriteriaSubmitted}
      />

      {/* ── Criteria Detail Modal ── */}
      <Modal
        open={criteriaDetailModal.open}
        onCancel={() => setCriteriaDetailModal({ open: false, row: null })}
        footer={null}
        width={700}
        title={null}
        destroyOnClose
      >
        {criteriaDetailModal.row ? (
          <div className="p-2">
            <div className="mb-4 border-b border-[#C8CDD4] pb-2">
              <p className="text-primary font-semibold uppercase">
                Detail Criteria Information
              </p>
            </div>

            {/* Criteria Information */}
            <div className="mb-4 rounded-lg border border-[#C8CDD4] bg-white overflow-hidden">
              <div className="border-b border-[#C8CDD4] px-4 py-3">
                <p className="text-primary uppercase text-sm font-semibold">
                  Criteria Information
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {criteriaTable.dynamicColumns.map((col) => (
                    <DetailText key={col.key} label={col.title}>
                      {criteriaDetailModal.row[col.key] || "-"}
                    </DetailText>
                  ))}
                  <DetailText label="Start Date">
                    {formatDate(criteriaDetailModal.row.startDate)}
                  </DetailText>
                  <DetailText label="End Date">
                    {formatDate(criteriaDetailModal.row.endDate)}
                  </DetailText>
                  <DetailText label="Status">
                    {criteriaDetailModal.row.status
                      ? toTitleCase(criteriaDetailModal.row.status.replace(/_/g, " "))
                      : "-"}
                  </DetailText>
                  <DetailText label="Approval Status">
                    {criteriaDetailModal.row.statusApproval
                      ? toTitleCase(criteriaDetailModal.row.statusApproval.replace(/_/g, " "))
                      : "-"}
                  </DetailText>
                  <DetailText label="Description" className="col-span-2 md:col-span-3">
                    {(criteriaDetailModal.rawItems || []).find(
                      (item) => item.description
                    )?.description || "-"}
                  </DetailText>
                </div>
              </div>
            </div>

            {/* History Log Information */}
            {(criteriaDetailModal.rawItems || []).length > 0 && (
              <div className="rounded-lg border border-[#C8CDD4] bg-white overflow-hidden">
                <div className="border-b border-[#C8CDD4] px-4 py-3">
                  <p className="text-primary uppercase text-sm font-semibold">
                    History Log Information
                  </p>
                </div>
                <div className="p-4">
                  {(() => {
                    const firstItem = criteriaDetailModal.rawItems[0];
                    return (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <DetailText label="Record ID">
                          {firstItem.id || "-"}
                        </DetailText>
                        <DetailText label="Created Date">
                          {firstItem.createdDate
                            ? moment(firstItem.createdDate).format("DD MMM YYYY HH:mm")
                            : "-"}
                        </DetailText>
                        <DetailText label="Created By">
                          {firstItem.createdBy || "-"}
                        </DetailText>
                        <DetailText label="Update Date">
                          {firstItem.updatedDate
                            ? moment(firstItem.updatedDate).format("DD MMM YYYY HH:mm")
                            : "-"}
                        </DetailText>
                        <DetailText label="Updated By">
                          {firstItem.updatedBy || "-"}
                        </DetailText>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            <div className="mt-4">
              <Button
                onClick={() => setCriteriaDetailModal({ open: false, row: null })}
              >
                Back
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ── Criteria Approval History Modal ── */}
      <ModalHistory
        isOpen={criteriaHistoryModal.open}
        handleClose={() => setCriteriaHistoryModal({ open: false, data: null, loading: false })}
        header="Criteria Approval History"
        width={1000}
        loading={criteriaHistoryModal.loading}
        tabOptions={[{ value: "Criteria" }]}
        dataApprover={{
          criteria: criteriaHistoryModal.data?.dataApprover?.COLLECTION_ACTIVITY_CRITERIA || [],
        }}
        dataHistory={{
          criteria: criteriaHistoryModal.data?.dataHistory?.COLLECTION_ACTIVITY_CRITERIA || [],
        }}
      />
    </>
  );
};

export default CollectionActivitiesInlineDetail;