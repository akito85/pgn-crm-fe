import ConfirmationModalRemark from "./ConfirmationModalRemark";
import NxTabs from "../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../components/Nx/NxAttachmentInput";
import NxApprovalInput from "../../../../../../components/Nx/NxApprovalInput";
import InfoGasDeposit from "../StepContents/InformationForm/InfoGasDeposit";
import GasDepositDetailTable from "../../GasDepositDetailTable";
import GasDepositDetailMutationTable from "../../GasDepositDetailMutationTable";
import { useState } from "react";

const ConfirmationModalTabs = ({
  form,
  detail,
  details,
  approvalData,
  attachmentDataSource,
  service,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
  disabled = false,
}) => {
  const [selectedDetailId, setSelectedDetailId] = useState();

  const tabOptions = [
    {
      key: 0,
      cards: [
        {
          content: <InfoGasDeposit detail={detail} />,
          header: "Gas Deposit Information",
        },
        {
          content: (
            <GasDepositDetailTable
              dataSource={details}
              handleView={({ id }) => setSelectedDetailId(id)}
              key="tab-0-card-1"
            />
          ),
          header: "Gas Deposit Information",
        },
        selectedDetailId && {
          content: <GasDepositDetailMutationTable detailId={selectedDetailId} />,
          header: "Gas Deposit Information",
        },
      ].filter(Boolean),
      disabled,
    },
    {
      key: 1,
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
      cards: [
        {
          content: <ConfirmationModalRemark disabled={disabled} />,
          header: "Remark",
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
      {tabOptions[activeTab].cards.map((card, index) => (
        <NxBaseContainer border header={card.header} key={`modal-card-${index}`}>
          {card.content}
        </NxBaseContainer>
      ))}
    </>
  );
};

export default ConfirmationModalTabs;
