import { ArrowLeftOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

// ============================================================================
// MODAL: ModalListContact (Choose Contact from Existing)
// ============================================================================

export default function ModalListContact({
  isOpen,
  expandDataMain,
  expandColumnMain,
  columnExpand,
  dataExpand,
  expandedRowKeys,
  onExpand,
  onBack,
  onCancel,
  onOk
}) {

  return (
    <NxModal
      id="ModalListContact"
      isOpen={isOpen}
      handleCancel={onCancel}
      handleOk={onOk}
      header={"CHOOSE CONTACT"}
      width={1200}
      title={"CHOOSE CONTACT"}
      footer={
        <div className="flex flex-row items-end justify-end">
          <ButtonComponent
            type={"button"}
            onClick={onBack}
            style={{
              backgroundColor: "#ffffff",
              color: "#0075bf",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px"
            }}
          >
            Back
          </ButtonComponent>
        </div>
      }
    >
      <NxTable
        id="TableListContact"
        className="border-[0.5px] border-[#c8cdd4] border-solid "
        usePagination={true}
        useSelect={true}
        dataMain={expandDataMain}
        columnMain={expandColumnMain}
        columnExpand={columnExpand}
        dataExpand={dataExpand}
        childTitle="CONTACT DETAILS"
        tablePadding="small"
        fontSize="medium"
        expandRowByClick={true}
        expandedRowKeys={expandedRowKeys}
        onExpand={onExpand}
      />
    </NxModal>
  )
}
