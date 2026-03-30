import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
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
      // Data Criteria Information
      const dataCriteriaList = (data_detail?.contentCriteria || []).map(
        (item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.area,
            sor: item.sor,
            industrialSector: item.industrialSector,
            product: item.product,
            gsizes: item.gsizes,
            customerSegment: item.customerSegment,
            accountGroupType: item.accountGroupType,
            accountClass: item.accountClass,
            accountCategory: item.accountCategory,
            serviceType: item.serviceType,
            customer: item.customer,
            startDate: item.startDate,
            endDate: item.endDate,
            allCriteria: item.allCriteria,
            key: index + 1,
            type: "exist",
            createdDate: item.createdDate,
            createdBy: item.createdBy,
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
      // Data Criteria Information Draft
      const dataDraftCriteriaList = (data_detail_draft?.contentCriteria || []).map(
        (item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.area,
            sor: item.sor,
            industrialSector: item.industrialSector,
            product: item.product,
            gsizes: item.gsizes,
            customerSegment: item.customerSegment,
            accountGroupType: item.accountGroupType,
            accountClass: item.accountClass,
            accountCategory: item.accountCategory,
            serviceType: item.serviceType,
            customer: item.customer,
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

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Content Management":
        return (
          <ContentDetailSection
            key={"detail"}
            dataContentManagement={dataDetail}
            dataHistory={dataLogInformation}
            dataCriteria={dataCriteria}
          />
        );
      case "Draft":
        return (
          <ContentDetailSection
            key={"draft"}
            dataContentManagement={dataDraft}
            dataHistory={dataLogInformation}
            dataCriteria={dataCriteriaDraft}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"Attachment Information"}>
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
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

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

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-4">
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_CONTENT_TEMPLATE" && (
              <BaseContainer header={"inactive request information"}>
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
              </BaseContainer>
            )}
          <RadioTabs
            data={listSectionInfo}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
          {layout(valuePage)}
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
      </Spin>
    </>
  );
};

export default ContentManagementDetail;