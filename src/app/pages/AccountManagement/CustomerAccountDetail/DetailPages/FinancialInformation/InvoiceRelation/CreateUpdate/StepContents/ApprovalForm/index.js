import ApprovalInvoiceRelation from "./ApprovalInvoiceRelation";

export default function ApprovalForm({
  dataTable,
  dataOption,
  handleSelectHiararchy,
  className,
}){
  return (
    <ApprovalInvoiceRelation
      dataTable={dataTable}
      dataOption={dataOption}
      handleSelectHiararchy={handleSelectHiararchy}
      className={className}
    />
  )
}
