import { Form } from "antd";
import AttachmentInvoiceRelation from "./AttachmentInvoiceRelation";

export default function AttachmentForm({
  type,
  value,
  data,
  updateData,
  dispatch,
  getAPICategory,
  mandatory,
  className,
}){
  return(
    <Form.Item
      name={"attachments"}
    >
      <AttachmentInvoiceRelation
        type={type}
        value={value}
        updateData={updateData}
        dispatch={dispatch}
        mandatory={mandatory}
        className={className}
        getAPICategory={getAPICategory}
        data={data}
      />
    </Form.Item>
  )
}
