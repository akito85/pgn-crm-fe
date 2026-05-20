import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Tabs } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import DetailSection from "./Utils/DetailSection";
import DetailText from "../../../../../components/DetailText";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../utils";
import FunctionalCriteriaInvoiceTemplate from "./Form/FunctionalCriteriaInvoiceTemplate";
import {
  approveOrRejectActivatedInvoiceTemplate,
  approveOrRejectInactiveInvoiceTemplate,
  approveOrRejectInvoiceTemplate,
  getDetailDraftInvoiceTemplate,
  getDetailInvoiceTemplate,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/invoiceTemplate";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const InvoiceTemplateDetail = () => {
  // Selector
  const { loading, data_detail, data_detail_draft } = useSelector(
    (state) => state.invoice_template,
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  // State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [activeTab, setActiveTab] = useState("invoiceTemplate");
  const [approveOrReject, setApproveOrReject] = useState("");

  const [dataDetail, setDataDetail] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);

  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [dataDraft, setDataDraft] = useState({});
  const [hasDraft, setHasDraft] = useState(false);

  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });

  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  // Determine which criteria data to show based on draft availability
  const displayCriteriaValues = hasDraft ? criteriaValuesDraft : criteriaValues;
  const displayCriteriaData = hasDraft
    ? listDataCriteriaDraft
    : listDataCriteria;

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getDetailDraftInvoiceTemplate(id));
      dispatch(getDetailInvoiceTemplate(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.id === id) {
      // Criteria Data Select
      const criteriaSelect = data_detail?.criteriaDtoList?.map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        },
      );

      // Data Criteria Information
      const dataCriteriaList = (data_detail?.criteriaDataDtoList || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
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
            accountGroup: item.accountGroup,
            accountClass: item.accountClass,
            accountCategory: item.accountCategory,
            serviceType: item.serviceType,
            customer: item.customer,
            startDate: item.startDate,
            endDate: item.endDate,
            key: index + 1,
            type: "exist",
            createdDate: item.createdDate,
            createdBy: item.createdBy,
            updatedDate: item.updatedDate,
            updatedBy: item.updatedBy,
          };
        });

      // Data History Log Information
      setDataLogInformation({
        recordId: data_detail.id,
        createdDate: data_detail.createdDate,
        createdBy: data_detail.createdBy,
        updatedDate: data_detail.updatedDate,
        updatedBy: data_detail.updatedBy,
      });

      setDataDetail(data_detail);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setListDataAttachment(dataAttachment);
      setBodyApproval({
        isApprover: data_detail?.approvalDto?.isApprover,
        tappId: data_detail?.approvalDto?.tAppId,
        approvalDetail: data_detail?.approvalDto,
        approvalType: data_detail?.approvalDto?.approvalType,
      });
    }
    if (
      id &&
      data_detail_draft?.id === id &&
      data_detail_draft?.id === data_detail?.id &&
      data_detail &&
      (!data_detail?.approvalDto?.approvalType ||
        data_detail?.approvalDto?.approvalType !== "INACTIVE_INVOICE_TEMPLATE")
    ) {
      // Criteria Data Select
      const criteriaSelect = (data_detail_draft?.criteriaDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            criteria: item.criteria,
          };
        },
      );

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Criteria Information
      const dataDraftCriteriaList = (
        data_detail_draft?.criteriaDataDtoList || []
      ).map((item, index) => {
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
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          serviceType: item.serviceType,
          customer: item.customer,
          startDate: item.startDate,
          endDate: item.endDate,
          key: index + 1,
          type: "exist",
        };
      });

      setDataDraft(data_detail_draft);
      setListDataCriteriaDraft(dataDraftCriteriaList);
      setCriteriaValuesDraft(mappingCriteria);
      setHasDraft(true);
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
      path: RBI_ROUTES.INVOICE_TEMPLATE_VIEW,
      breadcrumbName: "Invoice Template",
    },
    {
      path: "",
      breadcrumbName: "Detail Invoice Template",
    },
  ];

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

  const handleConfirm = (res, handleClear) => {
    const data = {
      id: id,
      remark: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    const approvalAction =
      bodyApproval.approvalType === "INACTIVE_INVOICE_TEMPLATE"
        ? approveOrRejectInactiveInvoiceTemplate({
            body: data,
          })
        : bodyApproval.approvalType === "ACTIVATED_INVOICE_TEMPLATE"
          ? approveOrRejectActivatedInvoiceTemplate({
              body: data,
            })
          : approveOrRejectInvoiceTemplate({
              body: data,
            });

    return dispatch(approvalAction)
      .unwrap()
      .then(() => {
        setModalConfirm(false);
        handleClear();
        dispatch(getDetailDraftInvoiceTemplate(id));
        dispatch(getDetailInvoiceTemplate(id));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
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

  // Build tab items
  const tabItems = [
    {
      key: "invoiceTemplate",
      label: "Invoice Template",
      children: null,
    },
    ...(hasDraft
      ? [
          {
            key: "draft",
            label: "Draft",
            children: null,
          },
        ]
      : []),
    {
      key: "attachment",
      label: "Attachment",
      children: null,
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <p className="w-full text-primary">INVOICE TEMPLATE DETAIL</p>
          }
          className="!overflow-visible [&>div]:!overflow-visible"
        >
          {/* Inactive Request Info */}
          {/* {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_INVOICE_TEMPLATE" && (
              <CardContainer header={"Inactive Request Information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate
                        ).format(dateFormatting.dateTime)
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
            )} */}

          {/* Tabs - only switches top section */}
          <Tabs
            items={tabItems}
            onChange={(key) => setActiveTab(key)}
            activeKey={activeTab}
            className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
          />

          {/* Tab Content: Invoice Template */}
          <div
            className="[&>div]:!mt-[2px]"
            style={{
              display: activeTab === "invoiceTemplate" ? undefined : "none",
            }}
          >
            <DetailSection dataInvoice={dataDetail} />
          </div>

          {/* Tab Content: Draft */}
          {hasDraft && (
            <div
              className="[&>div]:!mt-[2px]"
              style={{
                display: activeTab === "draft" ? undefined : "none",
              }}
            >
              <DetailSection dataInvoice={dataDraft} />
            </div>
          )}

          {/* Tab Content: Attachment */}
          <div
            className="[&>div]:!mt-[2px]"
            style={{
              display: activeTab === "attachment" ? undefined : "none",
            }}
          >
            <CollapsibleContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={"detail"}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="invoice_template"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
              />
            </CollapsibleContainer>
          </div>
        </CardContainer>

        {/* Criteria Information - separate section */}
        <CardContainer header={"Criteria Information"}>
          <FunctionalCriteriaInvoiceTemplate
            data={displayCriteriaData}
            dataCriteria={displayCriteriaValues}
            type={"show"}
            showAction={"show"}
          />
        </CardContainer>

        {/* History Log Information - separate section */}
        <CardContainer header={"History Log Information"}>
          <div className="w-full grid grid-cols-5 gap-3">
            <DetailText label="Record ID">
              {dataLogInformation?.recordId}
            </DetailText>
            <DetailText label="Created Date">
              {dataLogInformation?.createdDate
                ? moment(dataLogInformation.createdDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">
              {dataLogInformation?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {dataLogInformation?.updatedDate
                ? moment(dataLogInformation.updatedDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Updated By">
              {dataLogInformation?.updatedBy}
            </DetailText>
          </div>
        </CardContainer>

        {/* Footer: Back + Approve/Reject */}
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
          menu={"Invoice Template"}
          named={dataDetail?.invoiceName}
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

export default InvoiceTemplateDetail;
