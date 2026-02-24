import { Form } from "antd";
import AttachmentPaymentRelation from "./AttachmentPaymentRelation";

export default function AttachmentForm({
  value,
  data,
  updateData,
  dispatch,
  getAPICategory,
  mandatory,
  className,
  service,
  configApplication,
}){
  return(
    <AttachmentPaymentRelation
      value={value}
      updateData={updateData}
      dispatch={dispatch}
      mandatory={mandatory}
      className={className}
      getAPICategory={getAPICategory}
      data={data}
      service={service}
      configApplication={configApplication}
    />
  )
}
