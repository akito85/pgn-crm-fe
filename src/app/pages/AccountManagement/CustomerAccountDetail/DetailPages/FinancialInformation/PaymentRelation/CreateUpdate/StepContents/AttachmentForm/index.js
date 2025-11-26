import AttachmentPaymentRelation from "./AttachmentPaymentRelation";

export default function AttachmentForm({
  type,
  data,
  updateData,
  typeSelector,
  dispatch,
  getAPICategory,
  mandatory,
}){
  return(
    <AttachmentPaymentRelation
      type={type}
      data={data}
      updateData={updateData}
      typeSelector={typeSelector}
      dispatch={dispatch}
      mandatory={mandatory}
    />
  )
}
