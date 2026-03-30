import { Fragment } from "react";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../components/StatusComponent";

// "IN_PROGRESS" → "In Progress"
const formatStatus = (val) => {
  if (!val) return null;
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const DR_COLUMNS = [
  { title: "NO",    width: 60, align: "center", render: (_, __, i) => i + 1 },
  { title: "TYPE",  dataIndex: "drType",  width: 200, sorter: true, filter: true },
  { title: "VALUE", dataIndex: "drValue", sorter: true, filter: true },
];

const CustomerServiceRequestDetailInfo = ({ data_detail }) => {
  const sr  = data_detail || {};
  const drs = Array.isArray(sr.dataRequirements) ? sr.dataRequirements : [];

  return (
    <Fragment>
      {/* SERVICE REQUEST INFORMATION */}
      <NxBaseContainer header="SERVICE REQUEST INFORMATION" border>
        <div className="flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Service Request Reference">{sr.requestNumber || "-"}</NxDetailText>
            <NxDetailText label="Type">{sr.requestTypeName || "-"}</NxDetailText>
            <NxDetailText label="Category">{sr.requestCategoryName || "-"}</NxDetailText>

            <NxDetailText label="Sub Category">{sr.requestSubCategoryName || "-"}</NxDetailText>
            <NxDetailText label="Channel">{sr.channelName || "-"}</NxDetailText>
            <NxDetailText label="Priority">{sr.priorityName || "-"}</NxDetailText>

            <NxDetailText label="Request Source">{sr.sourceName || "-"}</NxDetailText>
            <NxDetailText label="Request Date">{NxDate.formatDate(sr.requestDate, "DD MMM YYYY")}</NxDetailText>
            <NxDetailText label="Open Date">{NxDate.formatDate(sr.openDate, "DD MMM YYYY")}</NxDetailText>

            <NxDetailText label="Resolved Date">{NxDate.formatDate(sr.resolvedDate, "DD MMM YYYY")}</NxDetailText>
            <NxDetailText label="Age (Hour)">{sr.duration ?? "-"}</NxDetailText>
            <NxDetailText label="Closed Date">{NxDate.formatDate(sr.closedDate, "DD MMM YYYY")}</NxDetailText>

            <NxDetailText label="Status">
              <StatusComponent colour={(sr.status || "").toLowerCase()} margin={false}>
                {formatStatus(sr.status)}
              </StatusComponent>
            </NxDetailText>
            <NxDetailText label="Status Pre-Requisite">
              <StatusComponent colour={(sr.statusPrerequisite || "").toLowerCase()} margin={false}>
                {formatStatus(sr.statusPrerequisite)}
              </StatusComponent>
            </NxDetailText>
            <NxDetailText label="Status Approval">
              <StatusComponent colour={(sr.statusApproval || "").toLowerCase()} margin={false}>
                {formatStatus(sr.statusApproval)}
              </StatusComponent>
            </NxDetailText>
          </div>
          <div className="w-full">
            <NxDetailText label="Description">{sr.description || "-"}</NxDetailText>
          </div>
        </div>
      </NxBaseContainer>

      {/* DATA REQUIREMENT */}
      <NxBaseContainer header="DATA REQUIREMENT" border className="overflow-hidden">
        <NxTable
          dataSource={drs.map((item, i) => ({ ...item, key: item.id || i }))}
          columns={DR_COLUMNS}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
          fontSize="small"
          tablePadding="small"
          tableScrolled={{ x: "max-content" }}
        />
      </NxBaseContainer>
    </Fragment>
  );
};

export default CustomerServiceRequestDetailInfo;
