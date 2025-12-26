import ApprovalPaymentRelation from "./ApprovalMultiDestination";

export default function ApprovalForm({
  dataTable,
  dataOption,
  selectedAppHierId,
  handleSelectHiararchy,
  className,
}){
  return (
    <ApprovalPaymentRelation
      dataTable={dataTable}
      dataOption={dataOption}
      selectedAppHierId={selectedAppHierId}
      handleSelectHiararchy={handleSelectHiararchy}
      className={className}
    />
  )
}
