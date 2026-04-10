import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Tabs, Table, Space, Tooltip } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import ContentDetailSection from "./ContentDetailSection";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  getDetailContentManagement,
  getDetailDraftContentManagement,
  approveRejectContentManagement,
  approveRejectInactiveContentManagement,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/contentManagement";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";

const ContentManagementDetail = () => {
  // Selector
  const { loading, data_detail, data_detail_draft } = useSelector(
    (state) => state.contentManagement
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  //State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [valuePage, setValuePage] = useState("Content Management");
  const [approveOrReject, setApproveOrReject] = useState("");

  const [dataDetail, setDataDetail] = useState({});
  const [dataCriteria, setDataCriteria] = useState([]);

  const [dataDraft, setDataDraft] = useState({});
  const [dataCriteriaDraft, setDataCriteriaDraft] = useState([]);

  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Content Management" },
    { value: "Attachment" },
  ]);
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tAppId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  // State for INFORMATION inner tabs
  const [infoTab, setInfoTab] = useState("Content Setup");

  // State for criteria table pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for modal history
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistoryDetail, setDataHistoryDetail] = useState({});

  // Use Effect - Fetch Data
  useEffect(() => {
    if (id) {
      dispatch(getDetailContentManagement(id));
      dispatch(getDetailDraftContentManagement(id));
      fetchAttachments(id);
    }
  }, [dispatch, id]);

  // Fetch Attachments
  const fetchAttachments = async (refId) => {
    try {
      const url = `/v1/dbs/api/content/list-attachment/${refId}`;
      const response = await ratingBillingHttpService.getPagination(url);
      
      // Get base URL from config or construct it
      const baseURL = configApp.RATING_BILLING_SERVICE || "";
      
      const dataAttachment = (response.data?.result || []).map((item) => {
        // Generate full URL from pathFile if urlFile1/urlFile2 is null
        const fullURL = item.urlFile1 || item.urlFile2 || (item.pathFile ? `${baseURL}${item.pathFile}` : null);
        
        return {
          id: item.id,
          size: item.fileSize,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile || "",
          urlFile1: fullURL,
          urlFile2: fullURL,
          createdBy: item.createdBy,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });
      
      setListDataAttachment(dataAttachment);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  // Process Detail Data
  useEffect(() => {
    if (id && data_detail?.contentTemplate?.id === id) {
      // Helper: extract label from object field { label, value }
      const extractLabel = (field) => {
        if (!field) return null;
        if (typeof field === "object") return field.label || null;
        return field;
      };

      // Data Criteria Information (new response: criteriaData with object fields)
      const dataCriteriaList = (data_detail?.criteriaData || data_detail?.contentCriteria || []).map(
        (item, index) => {
          return {
            id: item.id,
            budget: extractLabel(item.budget),
            subDistrict: extractLabel(item.subDistrict),
            district: extractLabel(item.district),
            city: extractLabel(item.city),
            province: extractLabel(item.province),
            area: extractLabel(item.area) || extractLabel(item.costCenter),
            sor: extractLabel(item.sor),
            industrialSector: extractLabel(item.industrialSector),
            product: extractLabel(item.product),
            gsizes: extractLabel(item.gsizes),
            customerSegment: extractLabel(item.customerSegment),
            accountGroupType: extractLabel(item.accountGroupType) || extractLabel(item.accountGroup),
            accountClass: extractLabel(item.accountClass),
            accountCategory: extractLabel(item.accountCategory),
            serviceType: extractLabel(item.serviceType),
            customer: extractLabel(item.customer),
            startDate: item.startDate,
            endDate: item.endDate,
            allCriteria: item.allCriteria,
            key: index + 1,
            type: "exist",
            createdDate: item.createdDate,
            createdBy: item.createdBy,
            updatedDate: item.updatedDate,
            updatedBy: item.updatedBy,
          };
        }
      );

      // Data History Log Information
      setDataLogInformation({
        recordId: data_detail?.contentTemplate?.id,
        createdDate: data_detail?.contentTemplate?.createdDate,
        createdBy: data_detail?.contentTemplate?.createdBy,
        updatedDate: data_detail?.contentTemplate?.updateDate,
        updatedBy: data_detail?.contentTemplate?.updatedBy,
      });

      setDataDetail(data_detail);
      setDataCriteria(dataCriteriaList);
      setBodyApproval({
        isApprover: data_detail?.approvalInformation?.isApprover,
        tAppId: data_detail?.approvalInformation?.tAppId,
        approvalDetail: data_detail?.approvalInformation,
        approvalType: data_detail?.approvalInformation?.approvalType,
      });
    }

    // Process Draft Data
    if (
      id &&
      data_detail_draft?.contentTemplate?.id === id &&
      data_detail_draft?.contentTemplate?.id === data_detail?.contentTemplate?.id &&
      data_detail &&
      (!data_detail?.approvalInformation?.approvalType ||
        data_detail?.approvalInformation?.approvalType !== "INACTIVE_CONTENT_TEMPLATE")
    ) {
      // Data Criteria Information Draft (new response: criteriaData with object fields)
      const dataDraftCriteriaList = (data_detail_draft?.criteriaData || data_detail_draft?.contentCriteria || []).map(
        (item, index) => {
          const extractLabel = (field) => {
            if (!field) return null;
            if (typeof field === "object") return field.label || null;
            return field;
          };
          return {
            id: item.id,
            budget: extractLabel(item.budget),
            subDistrict: extractLabel(item.subDistrict),
            district: extractLabel(item.district),
            city: extractLabel(item.city),
            province: extractLabel(item.province),
            area: extractLabel(item.area) || extractLabel(item.costCenter),
            sor: extractLabel(item.sor),
            industrialSector: extractLabel(item.industrialSector),
            product: extractLabel(item.product),
            gsizes: extractLabel(item.gsizes),
            customerSegment: extractLabel(item.customerSegment),
            accountGroupType: extractLabel(item.accountGroupType) || extractLabel(item.accountGroup),
            accountClass: extractLabel(item.accountClass),
            accountCategory: extractLabel(item.accountCategory),
            serviceType: extractLabel(item.serviceType),
            customer: extractLabel(item.customer),
            startDate: item.startDate,
            endDate: item.endDate,
            allCriteria: item.allCriteria,
            key: index + 1,
            type: "exist",
          };
        }
      );

      setDataDraft(data_detail_draft);
      setDataCriteriaDraft(dataDraftCriteriaList);

      setListSectionInfo([
        { value: "Content Management" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.CONTENT_MANAGEMENT,
      breadcrumbName: "Content Management",
    },
    {
      path: RBI_ROUTES.CONTENT_MANAGEMENT_DETAIL,
      breadcrumbName: "Detail Content Management",
    },
  ];

  // --- Moved from ContentDetailSection: INFORMATION section logic ---

  // Handle Detail Modal for criteria row
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

  // Handle Change page and pageSize for criteria table
  const handleChangePagination = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Render Content Tab (Subject & Body) for INFORMATION section
  const renderContentTab = () => {
    const contentTemplate = dataDetail?.contentTemplate || {};
    return (
      <CollapsibleContainer header={"CONTENT INFORMATION"} border={true} defaultOpen={true}>
        <div className="space-y-6 pb-3">
          {/* Subject */}
          <div>
            <div className="mb-1">
              <span className="font-medium text-gray-700">Subject</span>
            </div>
            <div
              style={{
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                fontSize: "14px",
              }}
            >
              {contentTemplate.contentSubject || "-"}
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="mb-1">
              <span className="font-medium text-gray-700">Body</span>
            </div>
            <div
              style={{
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: contentTemplate.contentBody || "-",
                }}
                style={{
                  wordBreak: "break-word",
                }}
              />
            </div>
          </div>
        </div>
      </CollapsibleContainer>
    );
  };

  // Define Table Columns for criteria
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

    // Helper: check if any record has a non-null/non-empty value for a field
    const hasField = (field) => dataCriteria?.some(item => {
      const val = item[field];
      return val !== null && val !== undefined && val !== "" && val !== "-";
    });

    const hasCustomer = hasField("customer");
    const hasBudget = hasField("budget");
    const hasProvince = hasField("province");
    const hasCity = hasField("city");
    const hasDistrict = hasField("district");
    const hasSubDistrict = hasField("subDistrict");
    const hasArea = hasField("area");
    const hasSor = hasField("sor");
    const hasIndustrialSector = hasField("industrialSector");
    const hasProduct = hasField("product");
    const hasGsizes = hasField("gsizes");
    const hasCustomerSegment = hasField("customerSegment");
    const hasAccountGroupType = hasField("accountGroupType");
    const hasAccountClass = hasField("accountClass");
    const hasAccountCategory = hasField("accountCategory");
    const hasServiceType = hasField("serviceType");

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

  // Render Criteria Tab with Table for INFORMATION section
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
            onChange: handleChangePagination,
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

  // --- End moved logic ---

  const handleRetry = () => {
    handleConfirm();
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      description: res.remark,
      approvalId: bodyApproval.tAppId,
      action: approveOrReject.toUpperCase(),
    };
    
    dispatch(
      bodyApproval.approvalType === "INACTIVE_CONTENT_TEMPLATE"
        ? approveRejectInactiveContentManagement({ body: data })
        : approveRejectContentManagement({ body: data })
    )
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDetailContentManagement(id));
        dispatch(getDetailDraftContentManagement(id));
        fetchAttachments(id);
      })
      .catch((error) => {
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalErrorServer(true);
        }
      });
  };

  // Check if draft tab exists
  const hasDraft = listSectionInfo.some((item) => item.value === "Draft");

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-4">
          {/* Inactive Request Information */}
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_CONTENT_TEMPLATE" && (
              <CardContainer header={"INACTIVE REQUEST INFORMATION"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate
                        ).format(dateFormatting.date)
                      : ""}
                  </DetailText>
                  <DetailText label={"Requested By"}>
                    {bodyApproval.approvalDetail.requestedBy}
                  </DetailText>
                  <DetailText label={"Remark"}>
                    {bodyApproval.approvalDetail.remarks}
                  </DetailText>
                </div>
              </CardContainer>
            )}

          {/* ===== CONTENT SETUP DETAIL - CardContainer with tabs INSIDE ===== */}
          <CardContainer
            header={
              <p className="w-full text-primary">CONTENT SETUP DETAIL</p>
            }
            className="!overflow-visible [&>div]:!overflow-visible"
          >
            {/* Tabs inside the card */}
            <Tabs
              items={listSectionInfo.map((item) => ({
                key: item.value,
                label: item.value,
                children: null,
              }))}
              onChange={(key) => setValuePage(key)}
              activeKey={valuePage}
              className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
            />

            {/* Tab Content: Content Management */}
            <div
              className="[&>div]:!mt-[2px]"
              style={{
                display: valuePage === "Content Management" ? undefined : "none",
              }}
            >
              <ContentDetailSection
                key={"detail"}
                dataContentManagement={dataDetail}
                dataCriteria={dataCriteria}
                criteriaList={dataDetail?.criteria}
              />
            </div>

            {/* Tab Content: Draft */}
            {hasDraft && (
              <div
                className="[&>div]:!mt-[2px]"
                style={{
                  display: valuePage === "Draft" ? undefined : "none",
                }}
              >
                <ContentDetailSection
                  key={"draft"}
                  dataContentManagement={dataDraft}
                  dataCriteria={dataCriteriaDraft}
                  criteriaList={dataDraft?.criteria}
                />
              </div>
            )}

            {/* Tab Content: Attachment */}
            <div
              className="[&>div]:!mt-[2px]"
              style={{
                display: valuePage === "Attachment" ? undefined : "none",
              }}
            >
              <CollapsibleContainer
                header={"ATTACHMENT INFORMATION"}
                border={true}
                defaultOpen={true}
              >
                {listDataAttachment && listDataAttachment.length > 0 ? (
                  <AttachmentComponent
                    type={"detail"}
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="contentManagement"
                    service={ratingBillingHttpService}
                    configApplication={configApp.RATING_BILLING_SERVICE}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No attachment available
                  </div>
                )}
              </CollapsibleContainer>
            </div>
          </CardContainer>

          {/* ===== INFORMATION - Always visible ===== */}
          <CardContainer header={"INFORMATION"}>
            <Tabs
              activeKey={infoTab}
              onChange={(key) => setInfoTab(key)}
              items={[
                {
                  key: "Content Setup",
                  label: "Content Setup",
                  children: renderContentTab(),
                },
                {
                  key: "Criteria",
                  label: "Criteria",
                  children: renderCriteriaTab(),
                },
              ]}
            />
          </CardContainer>

          {/* ===== HISTORY LOG INFORMATION - Always visible ===== */}
          <CardContainer header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5 gap-3">
              <DetailText label="Record ID">
                {dataLogInformation.recordId || "-"}
              </DetailText>
              <DetailText label="Created Date">
                {dataLogInformation.createdDate
                  ? moment(dataLogInformation.createdDate).format(
                      dateFormatting.dateTime
                    )
                  : "-"}
              </DetailText>
              <DetailText label="Created By">
                {dataLogInformation.createdBy || "-"}
              </DetailText>
              <DetailText label="Updated Date">
                {dataLogInformation.updatedDate
                  ? moment(dataLogInformation.updatedDate).format(
                      dateFormatting.dateTime
                    )
                  : "-"}
              </DetailText>
              <DetailText label="Updated By">
                {dataLogInformation.updatedBy || "-"}
              </DetailText>
            </div>
          </CardContainer>
        </div>

        <div className="flex mt-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("Reject");
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("Approve");
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>

        {/* Modal Approve/Reject */}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Content Management"}
          named={dataDetail?.contentTemplate?.templateName}
        />

        {/* Modal Retry */}
        <ModalError
          isOpen={modalErrorServer}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              approveOrReject === "Approve" ? "Approved" : "Rejected"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal History Log for Criteria Detail */}
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
      </Spin>
    </>
  );
};

export default ContentManagementDetail;