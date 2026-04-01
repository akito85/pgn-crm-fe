import moment from "moment";
import { useState } from "react";
import { Tabs } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { dateFormatting } from "../../../../../utils";

const ContentModalConfirmCaCiMapping = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
  dataPartnerList,
  dataCollectingAgentList,
  dataDeliveryChannelList,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [expanded, setExpanded] = useState(true);

  const partnerLabel = (() => {
    const found = (dataPartnerList?.data || []).find((p) => p.id === data?.partnerId);
    return found ? `${found.partnerCode} - ${found.partnerName}` : data?.partnerId;
  })();

  const caLabel = (() => {
    const found = (dataCollectingAgentList?.data || []).find((c) => c.id === data?.collectingAgentId);
    return found ? `${found.caCode} - ${found.name}` : data?.collectingAgentId;
  })();

  const dcLabel = (() => {
    const found = (dataDeliveryChannelList?.data || []).find((d) => d.id === data?.deliveryChannelId);
    return found ? `${found.code} - ${found.name}` : data?.deliveryChannelId;
  })();

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
                PAYMENT CHANNEL CA CI MAPPING INFORMATION
              </div>
              <div>{expanded ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expanded && (
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 w-full">
                <DetailText label={"Partner"}>{partnerLabel}</DetailText>
                <DetailText label={"Collecting Agent"}>{caLabel}</DetailText>
                <DetailText label={"Delivery Channel"}>{dcLabel}</DetailText>
                <DetailText label={"Name"}>{data?.name}</DetailText>
                <DetailText label={"Type"}>{data?.type}</DetailText>
                <DetailText label={"Eff Start Date"}>
                  {data?.effStartDate
                    ? moment(data.effStartDate, dateFormatting.date).format(dateFormatting.date)
                    : ""}
                </DetailText>
                <DetailText label={"Eff End Date"}>
                  {data?.effEndDate
                    ? moment(data.effEndDate, dateFormatting.date).format(dateFormatting.date)
                    : ""}
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
            <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
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

export default ContentModalConfirmCaCiMapping;
