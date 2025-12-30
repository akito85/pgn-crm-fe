import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { Table, Space, Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";

const ContentDetailSection = ({
  dataContentManagement,
  dataHistory,
  dataCriteria,
}) => {
  const [valuePage, setValuePage] = useState("Content");
  const [tabPages] = useState([
    { value: "Content" },
    { value: "Criteria" },
  ]);

  // State for modal history
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistoryDetail, setDataHistoryDetail] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const contentTemplate = dataContentManagement?.contentTemplate || {};

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const labelStatus = (index) => {
    let text;
    switch (index) {
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };

  // Handle Detail Modal
  const handleDetail = (record) => {
    setModalHistory(true);
    setDataHistoryDetail({
      recordId: record?.id,
      createdDate: record?.createdDate,
      createdBy: record?.createdBy,
      updatedDate: record?.updatedDate,
      updatedBy: record?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
    setDataHistoryDetail({});
  };

  // Handle Change page and pageSize
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Render Content Tab
  const renderContentTab = () => {
    return (
      <div className="space-y-6">
        {/* Content Information - Display with proper HTML rendering */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase text-sm">
            Content Information
          </h3>
          
          {/* Subject */}
          <div className="mb-6">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Subject</span>
            </div>
            <div 
              className="bg-white border border-gray-300 rounded p-3 min-h-[50px]"
              style={{ 
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {contentTemplate.contentSubject || "-"}
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Body</span>
            </div>
            <div 
              className="bg-white border border-gray-300 rounded p-4 min-h-[300px]"
              style={{
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: contentTemplate.contentBody || "-" 
                }}
                style={{
                  wordBreak: 'break-word'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Define Table Columns
  const getCriteriaColumns = () => {
    const baseColumns = [
      {
        title: "NO",
        width: 60,
        dataIndex: "no",
        align: "center",
        fixed: "left",
        render: (text, record, index) => (page - 1) * pageSize + index + 1,
      },
    ];

    // Dynamically add columns based on available data
    const dynamicColumns = [];

    // Check if any record has these fields and add columns accordingly
    const hasCustomer = dataCriteria?.some(item => item.customer);
    const hasBudget = dataCriteria?.some(item => item.budget);
    const hasProvince = dataCriteria?.some(item => item.province);
    const hasCity = dataCriteria?.some(item => item.city);
    const hasDistrict = dataCriteria?.some(item => item.district);
    const hasSubDistrict = dataCriteria?.some(item => item.subDistrict);
    const hasArea = dataCriteria?.some(item => item.area);
    const hasSor = dataCriteria?.some(item => item.sor);
    const hasIndustrialSector = dataCriteria?.some(item => item.industrialSector);
    const hasProduct = dataCriteria?.some(item => item.product);
    const hasGsizes = dataCriteria?.some(item => item.gsizes);
    const hasCustomerSegment = dataCriteria?.some(item => item.customerSegment);
    const hasAccountGroupType = dataCriteria?.some(item => item.accountGroupType);
    const hasAccountClass = dataCriteria?.some(item => item.accountClass);
    const hasAccountCategory = dataCriteria?.some(item => item.accountCategory);
    const hasServiceType = dataCriteria?.some(item => item.serviceType);

    if (hasCustomer) {
      dynamicColumns.push({
        title: "CUSTOMER",
        dataIndex: "customer",
        key: "customer",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasBudget) {
      dynamicColumns.push({
        title: "BUDGET",
        dataIndex: "budget",
        key: "budget",
        width: 120,
        render: (text) => text || "-",
      });
    }

    if (hasProvince) {
      dynamicColumns.push({
        title: "PROVINCE",
        dataIndex: "province",
        key: "province",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasCity) {
      dynamicColumns.push({
        title: "CITY",
        dataIndex: "city",
        key: "city",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasDistrict) {
      dynamicColumns.push({
        title: "DISTRICT",
        dataIndex: "district",
        key: "district",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasSubDistrict) {
      dynamicColumns.push({
        title: "SUB DISTRICT",
        dataIndex: "subDistrict",
        key: "subDistrict",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasArea) {
      dynamicColumns.push({
        title: "AREA",
        dataIndex: "area",
        key: "area",
        width: 120,
        render: (text) => text || "-",
      });
    }

    if (hasSor) {
      dynamicColumns.push({
        title: "SOR",
        dataIndex: "sor",
        key: "sor",
        width: 120,
        render: (text) => text || "-",
      });
    }

    if (hasIndustrialSector) {
      dynamicColumns.push({
        title: "INDUSTRIAL SECTOR",
        dataIndex: "industrialSector",
        key: "industrialSector",
        width: 180,
        render: (text) => text || "-",
      });
    }

    if (hasProduct) {
      dynamicColumns.push({
        title: "PRODUCT",
        dataIndex: "product",
        key: "product",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasGsizes) {
      dynamicColumns.push({
        title: "G-SIZES",
        dataIndex: "gsizes",
        key: "gsizes",
        width: 120,
        render: (text) => text || "-",
      });
    }

    if (hasCustomerSegment) {
      dynamicColumns.push({
        title: "CUSTOMER SEGMENT",
        dataIndex: "customerSegment",
        key: "customerSegment",
        width: 180,
        render: (text) => text || "-",
      });
    }

    if (hasAccountGroupType) {
      dynamicColumns.push({
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accountGroupType",
        key: "accountGroupType",
        width: 180,
        render: (text) => text || "-",
      });
    }

    if (hasAccountClass) {
      dynamicColumns.push({
        title: "ACCOUNT CLASS",
        dataIndex: "accountClass",
        key: "accountClass",
        width: 150,
        render: (text) => text || "-",
      });
    }

    if (hasAccountCategory) {
      dynamicColumns.push({
        title: "ACCOUNT CATEGORY",
        dataIndex: "accountCategory",
        key: "accountCategory",
        width: 180,
        render: (text) => text || "-",
      });
    }

    if (hasServiceType) {
      dynamicColumns.push({
        title: "SERVICE TYPE",
        dataIndex: "serviceType",
        key: "serviceType",
        width: 150,
        render: (text) => text || "-",
      });
    }

    // Always show start and end date
    dynamicColumns.push(
      {
        title: "START DATE",
        dataIndex: "startDate",
        key: "startDate",
        width: 130,
        render: (text) => text ? moment(text).format(dateFormatting.date) : "-",
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        key: "endDate",
        width: 130,
        render: (text) => text ? moment(text).format(dateFormatting.date) : "-",
      }
    );

    // Action column
    const actionColumn = {
      title: "ACTION",
      dataIndex: "operation",
      key: "operation",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space className="my-3 gap-2">
          <Tooltip title="Detail">
            <div className="pt-1 cursor-pointer">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetail(record)}
              />
            </div>
          </Tooltip>
        </Space>
      ),
    };

    return [...baseColumns, ...dynamicColumns, actionColumn];
  };

  // Render Criteria Tab with Table
  const renderCriteriaTab = () => {
    if (!dataCriteria || dataCriteria.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No criteria data available
        </div>
      );
    }

    const columns = getCriteriaColumns();
    const numColumns = columns.length;
    const maxWidth = 10000;
    const maxHeight = 300;
    const x = numColumns * 150;
    const validatedX = Math.min(x, maxWidth);

    return (
      <div className="relative flex flex-col w-full">
        <Table
          bordered
          className="w-full"
          dataSource={dataCriteria}
          columns={columns}
          pagination={{
            position: ["topRight"],
            current: page,
            pageSize: pageSize,
            onChange: handleChange,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} records`,
          }}
          scroll={{
            x: validatedX,
            y: maxHeight,
          }}
          rowKey={(record) => record.key || record.id}
        />
      </div>
    );
  };

  return (
    <div>
      {/* Container 1: Content Setup Information */}
      <BaseContainer header={"Content Setup Information"}>
        <div className="grid grid-cols-3 gap-4">
          <DetailText label="Name">
            {contentTemplate.templateName || "-"}
          </DetailText>
          <DetailText label="Format">
            {contentTemplate.formatType || "-"}
          </DetailText>
          <DetailText label="Category">
            {contentTemplate.category || "-"}
          </DetailText>
          <DetailText label="Media">
            {contentTemplate.mediaChannel || "-"}
          </DetailText>
          <DetailText label="Start Date">
            {contentTemplate.startDate
              ? moment(contentTemplate.startDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="End Date">
            {contentTemplate.endDate
              ? moment(contentTemplate.endDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="Status">
            {labelStatus(contentTemplate.status)}
          </DetailText>
          <DetailText label="Status Approval">
            {labelStatus(contentTemplate.statusApproval)}
          </DetailText>
          <div className="col-span-3">
            <DetailText label="Criteria">
              {dataCriteria && dataCriteria.length > 0
                ? dataCriteria
                    .map((item) => {
                      const parts = [];
                      if (item.customerSegment) parts.push(item.customerSegment);
                      if (item.accountGroupType) parts.push(item.accountGroupType);
                      return parts.join(", ");
                    })
                    .filter(Boolean)
                    .join("; ") || "All Criteria"
                : "All Criteria"}
            </DetailText>
          </div>
          <div className="col-span-3">
            <DetailText label="Description">
              {contentTemplate.description || "-"}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      {/* Container 2: Content Detail Information with Tabs */}
      <BaseContainer
        header={"Content Detail Information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabPages}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Content" && renderContentTab()}
        {valuePage === "Criteria" && renderCriteriaTab()}
      </BaseContainer>

      {/* Container 3: History Log Information */}
      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">
            {dataHistory.recordId || "-"}
          </DetailText>
          <DetailText label="Created Date">
            {dataHistory.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Created By">
            {dataHistory.createdBy || "-"}
          </DetailText>
          <DetailText label="Updated Date">
            {dataHistory.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Updated By">
            {dataHistory.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="CRITERIA INFORMATION"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistoryDetail.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistoryDetail?.createdDate
              ? moment(dataHistoryDetail.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistoryDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistoryDetail?.updatedDate
              ? moment(dataHistoryDetail.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistoryDetail?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>

      <style jsx>{`
        :global(.prose) {
          max-width: none;
        }
        :global(.prose p) {
          margin: 0.5em 0;
        }
        :global(.prose ul) {
          list-style: disc;
          padding-left: 2em;
          margin: 0.5em 0;
        }
        :global(.prose ol) {
          list-style: decimal;
          padding-left: 2em;
          margin: 0.5em 0;
        }
        :global(.prose li) {
          margin: 0.25em 0;
        }
        :global(.prose a) {
          color: #1890ff;
          text-decoration: underline;
        }
        :global(.prose strong) {
          font-weight: bold;
        }
        :global(.prose em) {
          font-style: italic;
        }
        :global(.prose u) {
          text-decoration: underline;
        }
        :global(.prose s) {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default ContentDetailSection;