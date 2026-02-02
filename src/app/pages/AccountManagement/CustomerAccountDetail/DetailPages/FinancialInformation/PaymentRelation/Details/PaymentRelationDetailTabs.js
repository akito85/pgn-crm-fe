import PaymentRelationDetailAttch from "./PaymentRelationDetailAttch";
import PaymentRelationDetailInfo from "./PaymentRelationDetailInfo";
import { Tabs } from "antd";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import { useState } from "react";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";

const PaymentRelationDetailTabs = ({
  subjectAccountNumber,
  idPr = 0,
  dataDetail = {},
  dispatch = () => {},
}) => {
  // Use provided options or fall back to default tabs
  const tabOptions = [
    {
      key: "pri",
      label: "Payment Relation Information",
      children: (
        <PaymentRelationDetailInfo
          subjectAccountNumber={subjectAccountNumber}
          dataDetail={dataDetail}
        />
      )
    },
    {
      key: "attch",
      label: "Attachment",
      children: (
        <PaymentRelationDetailAttch
          dispatch={dispatch}
          idPr={idPr}
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
        <NxTabs
          items={tabOptions}
          onChange={setActiveKey}
          activeKey={activeKey}
        />
      }
      hideChildren
      withoutPadding
    >
    </NxCardContainer>
  );
};

export default PaymentRelationDetailTabs;
