import { useDispatch } from "react-redux";
import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import AttachmentSectionForm from "../StepContents/AttachmentForm/AttachmentInvoiceRelation";
import ApprovalSectionForm from "../StepContents/ApprovalForm/ApprovalInvoiceRelation";
import InfoInvoiceRelation from "../StepContents/InformationForm/InfoInvoiceRelation";

const ConfirmationModalTabs = ({
  form,
  approvalData,
  dataAttachment,
  service,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
}) => {
  const dispatch = useDispatch();

  const tabOptions = [
    {
      key: 0,
      label: "Invoice Relation Information",
      children: <InfoInvoiceRelation form={form} formView={false} />
    },
    {
      key: 1,
      label: "Approval",
      children: (
        <ApprovalSectionForm form={form} dataTable={approvalData} formView={false} />
      )
    },
    {
      key: 2,
      label: "Attachment",
      children: (
        <AttachmentSectionForm
          data={dataAttachment}
          dispatch={dispatch}
          service={service}
          configApplication={configApplication}
          type={"confirmation"}
        />
      )
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      children: <ConfirmationModalRemark />
    },
  ].filter(Boolean).map((tabOption) => ({
    ...tabOption,
    children:
      <NxBaseContainer border header={tabOption.label}>
        {tabOption.children}
      </NxBaseContainer>
  }));

  return (
    <NxTabs
      items={tabOptions}
      onChange={setActiveTab}
      activeKey={activeTab}
    />
  );
};

export default ConfirmationModalTabs;
