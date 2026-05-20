import moment from "moment";
import { useState } from "react";
import { Tabs } from "antd";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
  dataPartner = {},
  dataCollectionAgent = {},
  dataBankList = {},
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [expanded, setExpanded] = useState(true);

  // Resolve labels from IDs
  const partnerItem = (dataPartner?.data || []).find((p) => p.id === data?.partnerId);
  const caItem = (dataCollectionAgent?.data || []).find((c) => c.id === data?.collectingAgentId);
  const bankItem = (dataBankList?.data || []).find((b) => b.id === data?.settlementBankId);

  const items = [
    {
      key: tabData[0].value,
      label: tabData[0].value,
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[200px]">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="text-[#0075bf] text-sm font-semibold uppercase">
                PARTNER COLLECTING AGENT MAPPING INFORMATION
              </div>
              <div>{expanded ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expanded && (
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-full">
                <DetailText label="Partner">
                  {partnerItem
                    ? `${partnerItem.partnerCode} - ${partnerItem.partnerName}`
                    : (data?.partnerId ?? "-")}
                </DetailText>
                <DetailText label="Collecting Agent">
                  {caItem
                    ? `${caItem.caCode} - ${caItem.name}`
                    : (data?.collectingAgentId ?? "-")}
                </DetailText>
                <DetailText label="Settlement Bank">
                  {bankItem
                    ? `${bankItem.bankCode} - ${bankItem.bankName}`
                    : (data?.settlementBankId ?? "-")}
                </DetailText>
                <DetailText label="Start Date">
                  {data?.startDate ? moment(data.startDate).format(dateFormatting.date) : "-"}
                </DetailText>
                <DetailText label="End Date">
                  {data?.endDate ? moment(data.endDate).format(dateFormatting.date) : "-"}
                </DetailText>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: tabData[1].value,
      label: tabData[1].value,
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[200px]">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).find((opt) => opt.value === selectedHierarchy)?.name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy={selectedHierarchy}
            />
          </div>
        </div>
      ),
    },
    {
      key: tabData[2].value,
      label: tabData[2].value,
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[200px]">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <AttachmentSectionForm type="preview" data={listDataAttachment} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-0 -mt-4 -mx-4 -mb-4 bg-white">
      <Tabs
        defaultActiveKey={tabData[0].value}
        activeKey={valuePage}
        onChange={(key) => setValuePage(key)}
        items={items}
        className="custom-confirm-tabs"
        tabBarStyle={{
          paddingLeft: "16px",
          paddingRight: "16px",
          marginBottom: 0,
          borderBottom: "1px solid #dbdade",
        }}
      />
    </div>
  );
};

export default ContentModalConfirm;
