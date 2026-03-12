import moment from "moment";
import { Form, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import ApprovalForm from "../StepContents/ApprovalForm";
import { bytesConverter } from "../../../../../../../../utils/bytesConverter";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const getLabel = (dropdowns, dropdownKey, value) => {
  if (!value) return "-";
  const source = dropdowns?.[dropdownKey];
  const list = Array.isArray(source) ? source : Array.isArray(source?.data) ? source.data : [];
  const found = list.find(
    (item) =>
      item.glbTypeValId?.toString() === value?.toString() ||
      item.id?.toString() === value?.toString(),
  );
  return found?.name || found?.glbTypeValName || value || "-";
};

const formatDate = (date) => {
  if (!date) return "-";
  return moment(date).isValid() ? moment(date).format("DD MMM YYYY") : "-";
};

// ---------------------------------------------------------------------------
// Tab: Service Request
// ---------------------------------------------------------------------------
const SrInfoTab = ({ form, dropdowns }) => {
  const values = form?.getFieldsValue(true) || {};
  const dataRequirements = values.srFormDataRequirements || [];

  const drColumns = [
    { title: "NO", key: "no", render: (_, __, idx) => idx + 1, width: 60, align: "center" },
    { title: "TYPE", dataIndex: "type", key: "type" },
    { title: "VALUE", dataIndex: "value", key: "value" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <NxBaseContainer border header="SERVICE REQUEST INFORMATION">
        <div className="p-4 flex flex-col gap-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Service Request Reference">{values.srr || "-"}</NxDetailText>
            <NxDetailText label="Type">{getLabel(dropdowns, "serviceRequestTypes", values.type)}</NxDetailText>
            <NxDetailText label="Category">{getLabel(dropdowns, "serviceRequestCategories", values.category)}</NxDetailText>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Sub Category">{getLabel(dropdowns, "serviceRequestSubcategories", values.subCategory)}</NxDetailText>
            <NxDetailText label="Channel">{getLabel(dropdowns, "serviceRequestChannels", values.channel)}</NxDetailText>
            <NxDetailText label="Priority">{getLabel(dropdowns, "serviceRequestPriorities", values.priority)}</NxDetailText>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Request Date">{formatDate(values.requestDate)}</NxDetailText>
            <NxDetailText label="Request Source">{getLabel(dropdowns, "serviceRequestSources", values.requestSource)}</NxDetailText>
          </div>
          {values.description && (
            <div className="w-full">
              <NxDetailText label="Description">{values.description}</NxDetailText>
            </div>
          )}
        </div>
      </NxBaseContainer>

      <NxBaseContainer border header="DATA REQUIREMENT">
        <NxTable
          idTable="confirm-data-req-table"
          usePagination={false}
          useSelect={false}
          dataMain={dataRequirements}
          columnMain={drColumns}
          tableScrolled={{ x: "max-content", y: 300 }}
        />
      </NxBaseContainer>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tab: Contact
// ---------------------------------------------------------------------------
const ContactTab = ({ form }) => {
  const contacts = Form.useWatch("srFormContacts", form) || [];

  const columns = [
    { title: "NO", key: "no", render: (_, __, idx) => idx + 1, width: 60, align: "center" },
    { title: "PRIMARY", dataIndex: "primary", key: "primary" },
    { title: "NAME", dataIndex: "name", key: "name" },
    { title: "JOB", dataIndex: "job", key: "job" },
    { title: "POSITION", dataIndex: "position", key: "position" },
    { title: "STATUS", dataIndex: "status", key: "status" },
  ];

  return (
    <NxBaseContainer border header="CONTACT LIST">
      <NxTable
        idTable="confirm-contact-table"
        usePagination={false}
        useSelect={false}
        dataMain={contacts}
        columnMain={columns}
        tableScrolled={{ x: "max-content", y: 400 }}
      />
    </NxBaseContainer>
  );
};

// ---------------------------------------------------------------------------
// Tab: Pre-Requisite
// ---------------------------------------------------------------------------
const PreRequisiteTab = ({ form }) => {
  const prereqs = form?.getFieldValue("srFormPreRequisites") || [];

  const columns = [
    { title: "NO", key: "no", render: (_, __, idx) => idx + 1, width: 60, align: "center" },
    { title: "TYPE", dataIndex: "type", key: "type" },
    { title: "NAME", dataIndex: "name", key: "name" },
    { title: "DESCRIPTION", dataIndex: "description", key: "description" },
  ];

  return (
    <NxBaseContainer border header="PRE-REQUISITE LIST">
      <NxTable
        idTable="confirm-prereq-table"
        usePagination={false}
        useSelect={false}
        dataMain={prereqs}
        columnMain={columns}
        tableScrolled={{ x: "max-content", y: 400 }}
      />
    </NxBaseContainer>
  );
};

// ---------------------------------------------------------------------------
// Tab: Attachment
// ---------------------------------------------------------------------------
const AttachmentTab = ({ attachmentsData }) => {
  const columns = [
    { title: "NO", key: "no", render: (_, __, idx) => idx + 1, width: 60, align: "center" },
    { title: "CATEGORY", dataIndex: "fileCategoryName", key: "fileCategoryName" },
    { title: "FILE NAME", dataIndex: "fileName", key: "fileName" },
    {
      title: "FILE SIZE",
      dataIndex: "size",
      key: "size",
      render: (size) => (size ? bytesConverter(size) : "-"),
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Preview">
          <EyeOutlined
            style={{ fontSize: "20px", color: "#0075bf", cursor: "pointer" }}
            onClick={() => previewFileAttachment(record.base64)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <NxBaseContainer border header="ATTACHMENT INFORMATION">
      <NxTable
        idTable="confirm-attachment-table"
        usePagination={false}
        useSelect={false}
        dataMain={attachmentsData}
        columnMain={columns}
        tableScrolled={{ x: "max-content", y: 400 }}
      />
    </NxBaseContainer>
  );
};

// ---------------------------------------------------------------------------
// Main Tabs Component
// ---------------------------------------------------------------------------
const ConfirmationModalTabs = ({
  form,
  dropdowns,
  approvalTableData,
  attachmentsData,
  activeTab,
  setActiveTab,
  disabled,
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Service Request",
      children: <SrInfoTab form={form} dropdowns={dropdowns} />,
    },
    {
      key: 1,
      label: "Contact",
      children: <ContactTab form={form} />,
    },
    {
      key: 2,
      label: "Pre-Requisite",
      children: <PreRequisiteTab form={form} />,
    },
    {
      key: 3,
      label: "Approval",
      children: <ApprovalForm form={form} dataTable={approvalTableData} formView={false} />,
    },
    {
      key: 4,
      label: "Attachment",
      children: <AttachmentTab attachmentsData={attachmentsData} />,
    },
  ].map((tab) => ({ ...tab, disabled }));

  return (
    <NxTabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
    />
  );
};

export default ConfirmationModalTabs;
