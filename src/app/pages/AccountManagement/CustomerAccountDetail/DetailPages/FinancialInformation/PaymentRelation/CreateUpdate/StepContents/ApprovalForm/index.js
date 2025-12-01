import ApprovalPaymentRelation from "./ApprovalPaymentRelation";

export default function ApprovalForm({
  dataTable,
  dataOption,
  selectedHierarchy,
  updateSelectedHierarchy,
  className,
}){
  return (
    <ApprovalPaymentRelation
      dataTable={dataTable}
      dataOption={dataOption}
      selectedHierarchy={selectedHierarchy}
      updateSelectedHierarchy={updateSelectedHierarchy}
      className={className}
    />
  )
}
