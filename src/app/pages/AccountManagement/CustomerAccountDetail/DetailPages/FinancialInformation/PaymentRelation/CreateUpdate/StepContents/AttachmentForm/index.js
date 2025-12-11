import { Form } from "antd";
import AttachmentPaymentRelation from "./AttachmentPaymentRelation";

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
}){
  return(
    <Form.Item
      name={"attachments"}
    >
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
      />
    </Form.Item>
  )
}
