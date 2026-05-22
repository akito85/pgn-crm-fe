import React, { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import moment from "moment";
import { Tabs } from "antd";
import SectionCard from "../../../../../components/SectionCard";
import { getCustomerListColumns } from "./CustomerColumns";

const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
  typeSelector = "deduction",
}) => {
  const [activeKey, setActiveKey] = useState(tabData[0]?.value || "Deduction");

  const customerColumns = getCustomerListColumns({
    actionType: "none",
  });

  const showSection = () => {
    switch (activeKey) {
      case "Deduction":
        return (
          <div className="flex flex-col gap-6">
            <SectionCard title="DEDUCTION INFORMATION">
              <div className="grid grid-cols-3 w-full gap-5">
                <DetailText label={"Deduction Period"}>
                  {data?.deductionPeriod || ""}
                </DetailText>
                <DetailText label={"Type"}>
                  {data?.type || ""}
                </DetailText>
                <DetailText label={"Deduction Date"}>
                  {data?.deductionDate ? moment(data?.deductionDate).format("DD MMM YYYY") : "-"}
                </DetailText>
                <div className="col-span-3">
                  <DetailText label={"Description"}>
                    {data?.description || ""}
                  </DetailText>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="CUSTOMER INFORMATION">
              <TableRBI
                columns={customerColumns}
                dataSource={data?.customerList?.map((item, index) => ({ ...item, key: item.id || index })) || []}
                rowKey="key"
                usePagination={false}
                tableScrolled={{ x: 1700, y: 300 }}
                size="small"
              />
            </SectionCard>
          </div>
        );
      case "Approval":
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).find(
                (item) => item.value === selectedHierarchy
              )?.name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy={selectedHierarchy}
          />
        );
      case "Attachment":
        return (
          <AttachmentComponent
            type={"preview"}
            data={listDataAttachment}
            typeRBI={"data"}
            typeSelector={typeSelector}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={tabData.map((tab) => ({
          label: tab.label || tab.value,
          key: tab.value,
        }))}
      />
      <div className="flex flex-col gap-4">
        {showSection()}
      </div>
    </div>
  );
};

export default ContentModalConfirm;
