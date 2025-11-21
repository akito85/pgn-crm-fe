import { ArrowLeftOutlined, ClearOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxPanel from "../../../../../../../../../components/Nx/NxPanel"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

// ============================================================================
// MODAL: ModalConfirmationContactDetail (Confirm Selected Contact)
// ============================================================================

export default function ModalConfirmationContactDetail({
  isOpen,
  contactSecondary,
  columnSecondary,
  onBack,
  onClear,
  onSave,
  onCancel,
  onOk
}) {

  return (
    <NxModal
      id="ModalConfirmationContactDetail"
      isOpen={isOpen}
      handleCancel={onCancel}
      handleOk={onOk}
      header={"CONFIRMATION CONTACT INFORMATION"}
      width={1200}
      title={"CONFIRMATION CONTACT INFORMATION"}
      footer={
        <div className="self-stretch flex flex-row justify-end">
          {/* Clear and Save Buttons - Right */}
          <div className="flex flex-row items-center gap-3">
            <ButtonComponent
              type={"button"}
              onClick={onClear}
              style={{
                backgroundColor: "#ffffff",
                color: "#0075bf",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px",
                width: "135px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "9px",
                paddingBottom: "9px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: "400",
                lineHeight: "30px"
              }}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"button"}
              onClick={onSave}
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px",
                width: "135px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "9px",
                paddingBottom: "9px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: "400",
                lineHeight: "30px"
              }}
            >
              Confirm
            </ButtonComponent>
          </div>
        </div>
      }
    >
      <NxPanel title={"CONTACT INFORMATION"}>
        <div className="self-stretch mb-5 grid grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">First Name</label>
            <label className="mb-2 font-thin">Rendy</label>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Middle Name</label>
            <label className="mb-2 font-normal">Fatah</label>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Last Name</label>
            <label className="mb-2 font-normal">Setiawan</label>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Job</label>
            <label className="mb-2 font-normal">Manager</label>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Position</label>
            <label className="mb-2 font-normal">Finance</label>
          </div>
        </div>

        <div className="flex-1 mb-5 justify-start text-sky-600 text-sm font-bold">
          CONTACT DETAIL
        </div>

        <NxTable
          id="TableConfirmationContactDetail"
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={contactSecondary}
          columnMain={columnSecondary}
        />

      </NxPanel>

    </NxModal>
  )
}
