import { useSelector } from "react-redux";
import NxTabs from "../../../../../../components/Nx/NxTabs";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../components/Nx/NxAttachmentInput";
import NxApprovalInput from "../../../../../../components/Nx/NxApprovalInput";
import InfoGasDeposit from "../StepContents/InformationForm/InfoGasDeposit";
import GasDepositDetailTable from "../../GasDepositDetailTable";
import GasDepositBulkTable from "../StepContents/InformationForm/GasDepositBulkTable";
import NxRemarkInput from "../../../../../../components/Nx/NxRemarkIInput";

/**
 * Tabbed content area inside the confirmation modal.
 * Renders Gas Deposit, Approval, Attachment, and (for submit) Remark tabs.
 * In bulk mode the Gas Deposit tab shows a read-only GasDepositBulkTable
 * of the selected rows; in single mode it shows InfoGasDeposit + detail table.
 *
 * @param {{
 *   form: import("antd").FormInstance;
 *   detail: object;
 *   id: number;
 *   parentKey: string;
 *   approvalData: object;
 *   attachmentDataSource: object[];
 *   service: object;
 *   accountId: number;
 *   type?: string;
 *   configApplication: string;
 *   activeTab?: number;
 *   setActiveTab?: (tab: number) => void;
 *   disabled?: boolean;
 *   isBulk?: boolean;
 *   selectedRowKeys?: (string|number)[];
 *   openedMemo?: Record<string|number, true>;
 *   onExpand?: (expanded: boolean, record: object) => void;
 * }} props
 */
const ConfirmationModalTabs = ({
  form,
  detail,
  id,
  parentKey,
  approvalData,
  attachmentDataSource,
  service,
  accountId,
  type = "",
  configApplication,
  activeTab = 0,
  setActiveTab = () => {},
  disabled = false,
  isBulk = false,
  selectedRowKeys = [],
  openedMemo = {},
  onExpand = () => {},
}) => {
  // --- Hooks ---
  const { list_gasDeposit } = useSelector((state) => state.gasDeposit);

  // --- Derived values ---
  const selectedRows = isBulk // rows selected in step 0, passed to the read-only recap table
    ? list_gasDeposit.filter((item) => selectedRowKeys.includes(item.id))
    : [];

  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit",
      cards: isBulk
        ? [
            {
              header: "Gas Deposit List",
              content: (
                <GasDepositBulkTable
                  readOnly
                  dataSource={selectedRows}
                  openedMemo={openedMemo}
                  onExpand={onExpand}
                  accountId={accountId}
                />
              ),
            },
          ]
        : [
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
          content: <NxRemarkInput disabled={disabled} />,
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
