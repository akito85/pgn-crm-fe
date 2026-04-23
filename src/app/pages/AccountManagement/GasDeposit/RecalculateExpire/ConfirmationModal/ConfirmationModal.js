import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConfirmationModalTabs from "./ConfirmationModalTabs";
import NxModal from "../../../../../../components/Nx/NxModal";
import { Button } from "antd";

/**
 * Confirmation modal for recalculate/expire gas deposit submissions.
 * Displays a tabbed recap (Gas Deposit → Approval → Attachment → Remark)
 * and exposes Previous/Next/Confirm navigation. Supports both single and
 * bulk modes.
 *
 * @param {{
 *   form: import("antd").FormInstance;
 *   formId: string;
 *   isOpen: boolean;
 *   handleCancel: () => void;
 *   approvalData: object;
 *   attachmentDataSource: object[];
 *   type?: "draft" | "submit";
 *   service: object;
 *   accountId: number;
 *   configApplication: string;
 *   loading?: boolean;
 *   detail: object;
 *   id: number;
 *   parentKey: string;
 *   handleSubmitForm?: () => void;
 *   isBulk?: boolean;
 *   selectedRowKeys?: (string|number)[];
 *   openedMemo: Record<string|number, true>;
 *   onExpand: (expanded: boolean, record: object) => void;
 * }} props
 */
const ConfirmationModal = ({
  form,
  formId,
  isOpen,
  handleCancel,
  approvalData,
  attachmentDataSource,
  type = "",
  service,
  accountId,
  configApplication,
  loading = false,
  detail,
  id,
  parentKey,
  handleSubmitForm = () => {},
  isBulk = false,
  selectedRowKeys = [],
  openedMemo,
  onExpand,
}) => {
  // --- Hooks ---
  const { loading_recalculateExpireGd } = useSelector((state) => state.gasDeposit);

  // --- State ---
  const [activeTab, setActiveTab] = useState(0);

  // --- Derived values ---
  const tabLength = type === "submit" ? 4 : 3;
  const isSubmit = type === "submit";
  const isDraft = type === "draft";

  // --- Functions / handlers ---
  /**
   * Advances or retreats the active tab within the allowed range.
   *
   * @param {"next" | "prev"} direction
   */
  const handleChangeTab = (direction) => {
    if (direction === "next" && activeTab < tabLength - 1) {
      setActiveTab((prev) => prev + 1);
    }
    else if (direction === "prev" && activeTab >= 0) {
      setActiveTab((prev) => prev - 1);
    }
  }

  // --- Effects ---
  // Reset to the first tab whenever the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setActiveTab(0);
    }
  }, [isOpen])

  return (
    <NxModal
      isOpen={isOpen}
      width={1000}
      title={"CONFIRMATION GAS DEPOSIT"}
      type={"confirmation"}
      hidePadding={{
        top: true,
      }}
      loading={loading}
      footer={[
        <div className={"flex justify-between"} key={`footer-1`}>
          <Button type={"menu"} disabled={loading_recalculateExpireGd} onClick={() => handleCancel()}>
            Cancel
          </Button>
          <div className="flex">
            <Button disabled={loading_recalculateExpireGd || activeTab < 1} type={"menu"} onClick={() => handleChangeTab("prev")}>
              Previous
            </Button>
            {activeTab < (tabLength - 1) && (
              <Button type={"submit"} disabled={loading_recalculateExpireGd} onClick={() => handleChangeTab("next")}>
                Next
              </Button>
            )}
            {activeTab === (tabLength - 1) && (
              <Button type={"submit"} form={formId} htmlType={isSubmit ? "submit" : "button"} onClick={isDraft ? handleSubmitForm : undefined} loading={loading_recalculateExpireGd}>
                Confirm
              </Button>
            )}
          </div>
        </div>,
      ]}
    >
      <ConfirmationModalTabs
        form={form}
        detail={detail}
        id={id}
        parentKey={parentKey}
        approvalData={approvalData}
        attachmentDataSource={attachmentDataSource}
        service={service}
        accountId={accountId}
        type={type}
        configApplication={configApplication}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={loading}
        isBulk={isBulk}
        selectedRowKeys={selectedRowKeys}
        openedMemo={openedMemo}
        onExpand={onExpand}
      />
    </NxModal>
  )
}

export default ConfirmationModal;
