import moment from "moment";
import { Fragment, useState } from "react";
import { Tabs } from "antd";
import DOMPurify from "dompurify";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import { renderDateConverter } from "../../../../../utils";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [expandedInfo, setExpandedInfo] = useState(true);

  const items = [
    {
      key: tabData[0].value,
      label: tabData[0].value,
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[200px] flex flex-col gap-4">
          {/* Warranty Partner Information */}
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setExpandedInfo(!expandedInfo)}
            >
              <div className="text-[#0075bf] text-sm font-semibold uppercase">
                PAYMENT GUARANTEE PARTNER INFORMATION
              </div>
              <div>{expandedInfo ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedInfo && (
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-full">
                <DetailText label={"Partner Code"}>{DOMPurify.sanitize(data?.partnerCode)}</DetailText>
                <DetailText label={"Partner Guarantee Issuer"}>{DOMPurify.sanitize(data?.partnerGuaranteeIssuer)}</DetailText>
                <DetailText label={"Partner Type"}>{DOMPurify.sanitize(data?.partnerType)}</DetailText>
                <DetailText label={"Start date"}>{data?.startDate ? renderDateConverter(data.startDate) : data?.startDate ? renderDateConverter(data?.startDate) : "-"}</DetailText>
                <DetailText label={"End date"}>{data?.endDate ? renderDateConverter(data.endDate) : data?.endDate ? renderDateConverter(data?.endDate) : "-"}</DetailText>
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
                (dataOption || []).filter((data) => data.value === selectedHierarchy)?.[0]?.name ||
                ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy
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
          borderBottom: "1px solid #dbdade"
        }}
      />
    </div>
  );
};

export default ContentModalConfirm;
