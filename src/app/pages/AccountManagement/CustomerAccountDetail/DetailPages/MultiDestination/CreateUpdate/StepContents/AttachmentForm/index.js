import { Form } from "antd";
import AttachmentPaymentRelation from "./AttachmentMultiDestination";

export default function AttachmentForm({
  type,
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
      type={type}
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
