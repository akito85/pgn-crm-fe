import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Tabs, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import DetailText from "../../../../components/DetailText";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { getAccountingAttachments } from "../../../../redux/slices/rating_billing_invoice/accounting";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
import { bytesConverter } from "../../../../utils/bytesConverter";

const attachmentColumns = [
  {
    title: "NO",
    key: "no",
    width: 60,
    align: "center",
    render: (_text, _record, index) => index + 1,
  },
  {
    title: "CATEGORY",
    dataIndex: "fileCategoryName",
    key: "fileCategoryName",
  },
  {
    title: "FILE NAME",
    dataIndex: "fileName",
    key: "fileName",
  },
  {
    title: "UPLOADED BY",
    dataIndex: "createdBy",
    key: "createdBy",
    align: "center",
  },
  {
    title: "UPLOADED DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    render: (text) => text ? moment(text).format(dateFormatting.dateTime) : "-",
  },
  {
    title: "FILE SIZE",
    dataIndex: "fileSize",
    key: "fileSize",
    align: "right",
    render: (val) => val ? bytesConverter(val) : "-",
  },
  {
    title: "ACTION",
    key: "action",
    width: 80,
    align: "center",
    fixed: "right",
    render: (_text, record) =>
      record?.urlFile1 ? (
        <a href={record.urlFile1} target="_blank" rel="noopener noreferrer">
          <SVGIcon name="IconDetail" width={20} />
        </a>
      ) : (
        <SVGIcon name="IconDetail" width={20} />
      ),
  },
];

const AccountingDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { record } = useLocation().state || {};

  const { data_attachments, loading_attachments } = useSelector(
    (state) => state.rbiAccounting
  );

  const [activeTab, setActiveTab] = useState("accounting");

  useEffect(() => {
    if (activeTab === "attachment" && record?.entryId) {
      dispatch(getAccountingAttachments(record.entryId));
    }
  }, [activeTab, record?.entryId, dispatch]);

  const routes = [
    {
      path: RBI_ROUTES.ACCOUNTING_VIEW,
      breadcrumbName: "Accounting",
    },
    {
      path: RBI_ROUTES.ACCOUNTING_DETAIL,
      breadcrumbName: "Detail Accounting",
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer type="tabs" header="ACCOUNTING DETAIL">
        <Tabs
          defaultActiveKey="accounting"
          activeKey={activeTab}
          onChange={setActiveTab}
          type="line"
          size="small"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-4"
        >
          <Tabs.TabPane tab="Accounting" key="accounting">
            <div className="flex flex-col gap-3 mt-3">
              <CardContainerNoBorder
                header="ACCOUNTING INFORMATION"
                collapsible={true}
                defaultExpanded={true}
              >
                <div className="w-full grid grid-cols-5 gap-3 p-3">
                  <DetailText label="Customer Number">
                    {record?.customerNumber ?? "-"}
                  </DetailText>
                  <DetailText label="Customer Name">
                    {record?.customerName ?? "-"}
                  </DetailText>
                  <DetailText label="Bill Period">
                    {record?.billPeriod ?? "-"}
                  </DetailText>
                  <DetailText label="Account Number">
                    {record?.accountNumber ?? "-"}
                  </DetailText>
                  <DetailText label="Account Name">
                    {record?.accountName ?? "-"}
                  </DetailText>

                  <DetailText label="Account Reference ID">
                    {record?.accountRefId ?? "-"}
                  </DetailText>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Status</p>
                    {record?.status ? (
                      <StatusComponent colour={record.status} size="small">
                        {record.status}
                      </StatusComponent>
                    ) : (
                      <p className="text-sm font-medium">-</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Status Approval</p>
                    {record?.statusApproval ? (
                      <StatusComponent colour={record.statusApproval} size="small">
                        {record.statusApproval}
                      </StatusComponent>
                    ) : (
                      <p className="text-sm font-medium">-</p>
                    )}
                  </div>
                  <DetailText label="Criteria">
                    {record?.criteria ?? "-"}
                  </DetailText>
                  <DetailText label="Description">
                    {record?.description ?? "-"}
                  </DetailText>
                </div>
              </CardContainerNoBorder>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Attachment" key="attachment">
            <div className="flex flex-col gap-3 mt-3">
              <CardContainerNoBorder
                header="ATTACHMENT INFORMATION"
                collapsible={true}
                defaultExpanded={true}
              >
                <div className="pb-3">
                  <Spin spinning={loading_attachments}>
                    <Table
                      rowKey="id"
                      dataSource={data_attachments}
                      columns={attachmentColumns}
                      pagination={false}
                      scroll={{ x: 900 }}
                      size="small"
                    />
                  </Spin>
                </div>
              </CardContainerNoBorder>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </CardContainer>

      <CardContainer header="HISTORY LOG INFORMATION">
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">{record?.entryId ?? "-"}</DetailText>
          <DetailText label="Created Date">{record?.createdDate ?? "-"}</DetailText>
          <DetailText label="Created By">{record?.createdBy ?? "-"}</DetailText>
          <DetailText label="Updated Date">{record?.updatedDate ?? "-"}</DetailText>
          <DetailText label="Updated By">{record?.updatedBy ?? "-"}</DetailText>
        </div>
      </CardContainer>

      <CardContainer>
        <div className="flex">
          <ButtonComponent
            icon={<LeftOutlined />}
            type="submit"
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>
      </CardContainer>
    </LayoutMenu>
  );
};

export default AccountingDetailPage;
