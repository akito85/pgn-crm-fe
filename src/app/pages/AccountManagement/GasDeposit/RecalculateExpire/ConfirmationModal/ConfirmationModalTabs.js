import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../components/Nx/NxAttachmentInput";
import NxApprovalInput from "../../../../../../components/Nx/NxApprovalInput";
import InfoGasDeposit from "../StepContents/InformationForm/InfoGasDeposit";
import GasDepositDetailTable from "../../GasDepositDetailTable";

const ConfirmationModalTabs = ({
  form,
  detail,
  id,
  parentKey,
  approvalData,
  attachmentDataSource,
  service,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
  disabled = false,
}) => {
  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit",
      cards: [
        {
          content: <InfoGasDeposit detail={detail} />,
          header: "Gas Deposit Information",
        },
        {
          content: (
            <GasDepositDetailTable
              id={id}
              parentKey={parentKey}
              key="tab-0-card-1"
            />
          ),
          header: "Gas Deposit Detail",
        },
      ],
      disabled,
    },
    {
      key: 1,
      label: "Approval",
      cards: [
        {
          content: <NxApprovalInput form={form} hierarchyDetails={approvalData} formView={false} />,
          header: "Approval Information",
        },
      ],
      disabled,
    },
    {
      key: 2,
      label: "Attachment",
      cards: [
        {
          content: (
            <NxAttachmentInput
              data={attachmentDataSource}
              service={service}
              configApplication={configApplication}
              type={"confirmation"}
            />
          ),
          header: "Attachment Information",
        },
      ],
      disabled,
    },
    type === "submit" && {
      key: 3,
      label: "Remark",
      cards: [
        {
          content: <ConfirmationModalRemark disabled={disabled} />,
          header: "Remark",
          required: true,
        },
      ],
      disabled,
    },
  ];

  return (
    <>
      <NxTabs
        items={tabOptions}
        onChange={setActiveTab}
        activeKey={activeTab}
      />
      <div className="flex flex-col gap-y-4 p-4">
        {tabOptions[activeTab].cards.map((card, index) => (
          <NxBaseContainer border header={card.header} key={`modal-card-${index}`} required={card.required} >
            {card.content}
          </NxBaseContainer>
        ))}
      </div>
    </>
  );
};

export default ConfirmationModalTabs;
