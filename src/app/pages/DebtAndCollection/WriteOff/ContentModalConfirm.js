import React, { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../components/DetailText";
import RadioTabs from "../../../../components/RadioTabs";
import TableRBI from "../../../../components/TableRBI";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import moment from "moment";

const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
  typeSelector = "receiptSetting",
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);

  const customerColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      width: 150,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 120,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      key: "customerSegment",
      width: 120,
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (v) => (v ? v.toLocaleString() : 0),
    },
  ];

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-primary text-xs font-bold uppercase">
                CUSTOMER INFORMATION
              </div>
              <div className="grid grid-cols-3 w-full gap-4">
                <DetailText label={"Write Off Period"}>
                  {data?.writeOffPeriod}
                </DetailText>
                <DetailText label={"Type"}>
                  {data?.type}
                </DetailText>
                <DetailText label={"Write Off Date"}>
                  {data?.writeOff ? moment(data?.writeOff).format("DD MMM YYYY") : "-"}
                </DetailText>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-primary text-xs font-bold uppercase">
                CUSTOMER INFORMATION
              </div>
              <TableRBI
                columns={customerColumns}
                dataSource={data?.customerList || []}
                rowKey="id"
                usePagination={false}
                tableScrolled={{ x: 1000, y: 200 }}
              />
            </div>
          </div>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (item) => item.value === selectedHierarchy
              )?.[0]?.name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy={selectedHierarchy}
          />
        );
      case tabData[2].value:
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

  const handleMethod = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={tabData}
        onChange={handleMethod}
        currentPosition={valuePage}
      />
      <div className="flex flex-col gap-4">
        {showSection()}
      </div>
    </div>
  );
};

export default ContentModalConfirm;
