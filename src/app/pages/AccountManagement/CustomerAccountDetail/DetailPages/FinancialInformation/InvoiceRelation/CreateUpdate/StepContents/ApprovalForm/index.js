import ApprovalInvoiceRelation from "./ApprovalInvoiceRelation";

export default function ApprovalForm({
  dataTable,
  dataOption,
  selectedAppHierId,
  handleSelectHiararchy,
  className,
}){
  return (
    <ApprovalInvoiceRelation
      dataTable={dataTable}
      dataOption={dataOption}
      selectedAppHierId={selectedAppHierId}
      handleSelectHiararchy={handleSelectHiararchy}
      className={className}
    />
  )
}
