import React from "react";
import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../utils";
import TablePagination from "../../../../../../components/TablePagination";
import DetailText from "../../../../../../components/DetailText";
import StatusComponent from "../../../../../../components/StatusComponent";
import CardContainer from "../../../../../../components/CardContainer";

const AdditionalCodeSection = ({
  additionalCodeList = [],
  dataHistory = {},
}) => {
  const columns = [
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      sorter: true,
      render: (text) => text || "-",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: true,
      render: (text) => text || "-",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.date) : "-"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.date) : "-"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: true,
      render: (text) => {
        return <StatusComponent colour={text}>{text}</StatusComponent>;
      },
    },
  ];

  return (
    <>
      <CardContainer header={"Additional Code Information"}>
        <TablePagination
          columns={columns}
          dataSource={additionalCodeList}
          usePagination={false}
          rowKey={(record) => record.id || record.key}
        />
      </CardContainer>
      {/* History Log Information */}
      <CardContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label={"Record ID"}>
            {dataHistory?.recordId || "-"}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataHistory?.createdBy || "-"}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataHistory?.updatedBy || "-"}
          </DetailText>
        </div>
      </CardContainer>
    </>
  );
};

export default AdditionalCodeSection;
