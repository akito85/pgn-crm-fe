import ApprovalPaymentRelation from "./ApprovalPaymentRelation";

export default function ApprovalForm({
  dataTable = [],
  dataOption = [],
  selectedHierarchy = "",
  updateSelectedHierarchy = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName = "",
}){
  return (
    <ApprovalPaymentRelation
      dataTable={dataTable}
      dataOption={dataOption}
      selectedHierarchy={selectedHierarchy}
      updateSelectedHierarchy={updateSelectedHierarchy}
      showSelect={showSelect}
      disableSelect={disableSelect}
      approvalName={approvalName}
    />
  )
}
