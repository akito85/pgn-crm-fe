import AttachmentInvoiceRelation from "./AttachmentInvoiceRelation";

export default function AttachmentForm({
  type,
  value,
  data,
  updateData,
  dispatch,
  getAPICategory,
  mandatory,
  service,
  configApplication,
}){
  return(
    <AttachmentInvoiceRelation
      type={type}
      value={value}
      updateData={updateData}
      dispatch={dispatch}
      mandatory={mandatory}
      getAPICategory={getAPICategory}
      data={data}
      service={service}
      configApplication={configApplication}
    />
  )
}
