import ApprovalPaymentRelation from "./ApprovalPaymentRelation";

export default function ApprovalForm({
  dataTable,
  dataOption,
  selectedHierarchy,
  handleSelectHiararchy,
  className,
}){
  return (
    <ApprovalPaymentRelation
      dataTable={dataTable}
      dataOption={dataOption}
      selectedHierarchy={selectedHierarchy}
      handleSelectHiararchy={handleSelectHiararchy}
      className={className}
    />
  )
}
