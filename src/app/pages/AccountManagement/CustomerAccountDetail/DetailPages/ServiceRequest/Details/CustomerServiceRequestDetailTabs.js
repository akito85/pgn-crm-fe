import { useState } from "react";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";
import CustomerServiceRequestDetailAttch from "./CustomerServiceRequestDetailAttch";
import CustomerServiceRequestDetailInfo from "./CustomerServiceRequestDetailInfo";
import CustomerServiceRequestContact from "./CustomerServiceRequestContact";
import CustomerServiceRequestPreRequisite from "./CustomerServiceRequestPreRequisite";
import CustomerServiceRequestWorkOrder from "./CustomerServiceRequestWorkOrder";

const CustomerServiceRequestDetailTabs = ({
  id,
  idAccount,
  idCustomer,
  accountType,
  data_accountDetail,
  data_detail,
}) => {
  const commonProps = {
    id,
    idAccount,
    idCustomer,
    accountType,
    data_accountDetail,
    data_detail,
  };

  const items = [
    {
      key: "service-request",
      label: "Service Request",
      children: <CustomerServiceRequestDetailInfo {...commonProps} />,
    },
    {
      key: "contact",
      label: "Contact",
      children: <CustomerServiceRequestContact {...commonProps} />,
    },
    {
      key: "prerequisite",
      label: "Pre-Requisite",
      children: <CustomerServiceRequestPreRequisite {...commonProps} />,
    },
    {
      key: "work-order",
      label: "Work Order",
      children: <CustomerServiceRequestWorkOrder {...commonProps} />,
    },
    {
      key: "attachment",
      label: "Attachment",
      children: <CustomerServiceRequestDetailAttch {...commonProps} />,
    },
  ];

  const [activeKey, setActiveKey] = useState(items[0]?.key || "");

  return (
    <NxCardContainer
      header="DETAIL INFORMATION"
      type="tabs"
      element={
        <NxTabs
          items={items}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
      }
      hideChildren
      withoutPadding
    >
    </NxCardContainer>
  );
};

export default CustomerServiceRequestDetailTabs;
