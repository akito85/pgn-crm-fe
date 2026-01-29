import InvoiceRelationDetailAttch from "./InvoiceRelationDetailAttch";
import InvoiceRelationDetailInfo from "./InvoiceRelationDetailInfo";
import { Tabs } from "antd";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import { useState } from "react";

const InvoiceRelationDetailTabs = ({
  subjectAccountNumber,
  idIr = 0,
  dataDetail = {},
  dispatch = () => {},
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = [
    {
      key: "iri",
      label: "Invoice Relation Information",
      children: (
        <InvoiceRelationDetailInfo
          subjectAccountNumber={subjectAccountNumber}
          dataDetail={dataDetail}
        />
      )
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <InvoiceRelationDetailAttch
          dispatch={dispatch}
          idIr={idIr}
        />
      )
    },
  ];

  const [activeKey, setActiveKey] = useState(tabOptions[0]?.key || "");

  return (
    <NxCardContainer
      header={"DETAIL INFORMATION"}
      type="tabs"
      element={
        <Tabs
          items={tabOptions}
          onChange={setActiveKey}
          activeKey={activeKey}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />
      }
      hideChildren
      withoutTopPadding
    >
    </NxCardContainer>
  );
};

export default InvoiceRelationDetailTabs;
