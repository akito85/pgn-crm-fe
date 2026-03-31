import React from "react";
import CollapsibleContainer from "../../../../../../components/CollapsibleContainer";
import InvoiceTemplateInfo from "../Utils/InvoiceTemplateInfo";

const DetailSection = ({
  dataInvoice,
}) => {
  return (
    <CollapsibleContainer header={"Invoice Template Information"}>
      <InvoiceTemplateInfo data={dataInvoice} preview="detail" />
    </CollapsibleContainer>
  );
};

export default DetailSection;
