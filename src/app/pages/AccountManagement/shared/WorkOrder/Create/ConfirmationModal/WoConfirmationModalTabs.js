import { Tabs } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

const WoConfirmationModalTabs = ({ formValues, activityData, dataRequirements, approvalData, attachments }) => {
  const displayVal = (v) => v || "-";
  const displayDate = (v) => v ? NxDate.formatDate(v.format ? v.format("YYYY-MM-DD") : v, "DD MMM YYYY") : "-";

  const items = [
    {
      key: "wo-info",
      label: "Work Order",
      children: (
        <NxBaseContainer border>
          <div className="grid grid-cols-3 gap-4">
            <NxDetailText label="WO Reference">{displayVal(formValues?.workOrderReference)}</NxDetailText>
            <NxDetailText label="Source">{displayVal(formValues?.source)}</NxDetailText>
            <NxDetailText label="Source Reference">{displayVal(formValues?.sourceReference)}</NxDetailText>
            <NxDetailText label="Category">{displayVal(formValues?.category)}</NxDetailText>
            <NxDetailText label="Type">{displayVal(formValues?.type)}</NxDetailText>
            <NxDetailText label="Priority">{displayVal(formValues?.priority)}</NxDetailText>
            <NxDetailText label="Group">{displayVal(formValues?.group)}</NxDetailText>
            <NxDetailText label="Request Date">{displayDate(formValues?.requestDate)}</NxDetailText>
            <NxDetailText label="Completion Plan Date">{displayDate(formValues?.completionPlanDate)}</NxDetailText>
            <NxDetailText label="Due Date">{displayDate(formValues?.dueDate)}</NxDetailText>
          </div>
          <NxDetailText label="Description" className="mt-2">{displayVal(formValues?.description)}</NxDetailText>
        </NxBaseContainer>
      ),
    },
    {
      key: "activity-data",
      label: "Activity & Data",
      children: (
        <div className="flex flex-col gap-4">
          <NxBaseContainer border header="Activities">
            <NxTable
              idTable="confirm-activity-table"
              dataSource={(activityData || []).map((item, i) => ({ ...item, key: item.key || i }))}
              columns={[
                { title: "NO",            width: 60, align: "center", render: (_, __, i) => i + 1 },
                { title: "ACTIVITY NAME", dataIndex: "woActName",    width: 180, render: (v) => v || "-" },
                { title: "PIC POSITION",  dataIndex: "picPosition",  width: 160, render: (v) => v || "-" },
                { title: "PIC USER",      dataIndex: "picUser",      width: 160, render: (v) => v || "-" },
                { title: "PLAN DATE",     dataIndex: "planDate",     width: 130, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
                { title: "STATUS",        dataIndex: "activityStatus", width: 120, render: (v) => v || "-" },
                { title: "DESCRIPTION",   dataIndex: "description",  width: 200, render: (v) => v || "-" },
              ]}
              usePagination={false}
              useInfiniteScroll={false}
              showAdvanceSearch={false}
              tableScrolled={{ x: "max-content" }}
            />
          </NxBaseContainer>
          <NxBaseContainer border header="Data Requirements">
            <NxTable
              idTable="confirm-dr-table"
              dataSource={(dataRequirements || []).map((item, i) => ({ ...item, key: item.key || i }))}
              columns={[
                { title: "NO",    width: 60, align: "center", render: (_, __, i) => i + 1 },
                { title: "TYPE",  dataIndex: "type",  width: 200, render: (v) => v || "-" },
                { title: "VALUE", dataIndex: "value", render: (v) => v || "-" },
              ]}
              usePagination={false}
              useInfiniteScroll={false}
              showAdvanceSearch={false}
            />
          </NxBaseContainer>
        </div>
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <NxBaseContainer border header="Approval Hierarchy">
          <NxTable
            idTable="confirm-approval-table"
            dataSource={(approvalData || []).map((item, i) => ({ ...item, key: item.id || i }))}
            columns={[
              { title: "NO",    width: 60, align: "center", render: (_, __, i) => i + 1 },
              { title: "LEVEL", dataIndex: "approvalLevel", width: 100, render: (v) => v || "-" },
              { title: "NAME",  dataIndex: "approverName",  render: (v) => v || "-" },
              { title: "ROLE",  dataIndex: "approverRole",  width: 200, render: (v) => v || "-" },
            ]}
            usePagination={false}
            useInfiniteScroll={false}
            showAdvanceSearch={false}
          />
        </NxBaseContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <NxBaseContainer border header="Attachments">
          <NxTable
            idTable="confirm-attachment-table"
            dataSource={(attachments || []).map((item, i) => ({ ...item, key: item.key || i }))}
            columns={[
              { title: "NO",        width: 60, align: "center", render: (_, __, i) => i + 1 },
              { title: "FILE NAME", dataIndex: "fileName", render: (v) => v || "-" },
              { title: "SIZE",      dataIndex: "fileSize", width: 120, render: (v) => v || "-" },
            ]}
            usePagination={false}
            useInfiniteScroll={false}
            showAdvanceSearch={false}
          />
        </NxBaseContainer>
      ),
    },
  ];

  return <Tabs items={items} />;
};

export default WoConfirmationModalTabs;
