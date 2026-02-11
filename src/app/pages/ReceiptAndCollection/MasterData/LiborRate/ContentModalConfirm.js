import React, { useState } from "react";
import { Tabs } from "antd";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

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
        <div className="p-5 bg-[#f8f7fa] min-h-[300px] flex flex-col gap-4">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setExpandedInfo(!expandedInfo)}
            >
              <div className="text-[#0075bf] text-sm font-semibold uppercase">
                SOURCE INFORMATION
              </div>
              <div>{expandedInfo ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedInfo && (
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-full">
                <DetailText label={"Creation Type"}>{data?.createNewSource ? "Create New Source" : "Use Existing Source"}</DetailText>
                {data?.createNewSource ? (
                  <>
                    <DetailText label={"Source Code"}>{data?.sourceCodeNew}</DetailText>
                    <DetailText label={"Source Name"}>{data?.sourceNameNew}</DetailText>
                    <div className="col-span-2 mt-2">
                       <DetailText label={"Source Description"}>{data?.descriptionNew}</DetailText>
                    </div>
                  </>
                ) : (
                   <>
                    <DetailText label={"Source Code"}>{data?.sourceCode}</DetailText>
                    <DetailText label={"Source Name"}>{data?.sourceName}</DetailText>
                    <div className="col-span-2 mt-2">
                       <DetailText label={"Source Description"}>{data?.description}</DetailText>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border border-[#dbdade] rounded-lg p-4 bg-white">
            <div className="text-[#0075bf] text-sm font-semibold uppercase mb-4">
              RATE INDEX INFORMATION
            </div>
            <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-full">
              <DetailText label={"Rate Index Code"}>{data?.indexCode}</DetailText>
              <DetailText label={"Rate Index Name"}>{data?.indexName}</DetailText>
              <DetailText label={"Tenor"}>{`${data?.tenorValue}`}</DetailText>
              <DetailText label={"Rate Value"}>{`${data?.ratePercentage}`}</DetailText>
              <DetailText label={"Unit"}>{`${data?.tenorUnit}`}</DetailText>
              <DetailText label={"Currency"}>{data?.currencyCode}</DetailText>
              <DetailText label={"Start Date"}>{data?.startDate?.format ? data?.startDate?.format("YYYY-MM-DD") : data?.startDate}</DetailText>
              <DetailText label={"End Date"}>{data?.endDate?.format ? data?.endDate?.format("YYYY-MM-DD") : data?.endDate}</DetailText>
            </div>
            <div className="grid grid-cols-1 gap-y-4 gap-x-2 w-full mt-4">
              <DetailText label={"Description"}>{data?.remarks}</DetailText>
            </div>
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
          borderBottom: "1px solid #dbdade"
        }}
      />
    </div>
  );
};

export default ContentModalConfirm;
