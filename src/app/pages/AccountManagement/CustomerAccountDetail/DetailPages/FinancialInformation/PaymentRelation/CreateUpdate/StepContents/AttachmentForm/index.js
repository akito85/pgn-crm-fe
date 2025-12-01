import { Form } from "antd";
import AttachmentPaymentRelation from "./AttachmentPaymentRelation";

export default function AttachmentForm({
  type,
  value,
  onChange,
  typeSelector,
  dispatch,
  getAPICategory,
  mandatory,
  className,
}){
  return(
    <Form.Item
      name={"attachments"}
    >
      <AttachmentPaymentRelation
        type={type}
        value={value}
        onChange={onChange}
        typeSelector={typeSelector}
        dispatch={dispatch}
        mandatory={mandatory}
        className={className}
      />
    </Form.Item>
  )
}
