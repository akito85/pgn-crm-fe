import ApprovalInvoiceRelation from "./ApprovalInvoiceRelation";

export default function ApprovalForm({
  form,
  dataTable,
  dataOption,
  handleSelectHiararchy,
}){
  return (
    <ApprovalInvoiceRelation
      form={form}
      dataTable={dataTable}
      dataOption={dataOption}
      handleSelectHiararchy={handleSelectHiararchy}
    />
  )
}
