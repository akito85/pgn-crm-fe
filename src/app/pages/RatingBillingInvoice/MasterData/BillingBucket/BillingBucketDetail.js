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
import DetailSection from "./Utils/DetailSection";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  getDetailBillingBucket,
  getDetailDraftBillingBucket,
  approveRejectBillingBucket,
  approveRejectInactiveBillingBucket,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import CardContainer from "../../../../../components/CardContainer";

const BillingBucketDetail = () => {
  // Selector
  const { loading, data_detail, data_detail_draft } = useSelector(
    (state) => state.billing_bucket,
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  //State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [valuePage, setValuePage] = useState("Billing Bucket");
  const [approveOrReject, setApproveOrReject] = useState("");

  const [dataDetail, setDataDetail] = useState({});
  const [listDataBI, setListDataBI] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);

  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [dataDraft, setDataDraft] = useState({});
  const [listDataBIDraft, setListDataBIDraft] = useState([]);

  const [bodyError, setBodyError] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Billing Bucket" },
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

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getDetailDraftBillingBucket(id));
      dispatch(getDetailBillingBucket(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.information?.id === id) {
      // Criteria Data Select
      const criteriaSelect = data_detail?.criteria?.map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Detail Billing Bucket (Billing Item)
      const dataDetailBillingBucket = data_detail?.billingBucketDetail?.map(
        (item) => {
          return {
            billingItem: item.billingItem.value,
            currency: item.currency.value,
            sequence: item.sequence,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            priority: item.priority,
            id: item.id,
            createdDate: item.createdDate,
            createdBy: item.createdBy,
            updatedDate: item.updatedDate,
            updatedBy: item.updatedBy,
          };
        },
      );

      // Data Attachment Information
      const dataAttachment = (data_detail?.mattachmentLists || []).map(
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
      const dataCriteriaList = (data_detail?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.costCenter,
            sor: item.sor,
            industrialSector: item.industrialSector,
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
        recordId: data_detail?.information?.id,
        createdDate: data_detail?.historyLog?.createdDate,
        createdBy: data_detail?.historyLog?.createdBy,
        updatedDate: data_detail?.historyLog?.updatedDate,
        updatedBy: data_detail?.historyLog?.updatedBy,
      });

      setDataDetail(data_detail);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setListDataAttachment(dataAttachment);
      setListDataBI(dataDetailBillingBucket);
      setBodyApproval({
        isApprover: data_detail?.approvalInformation?.isApprover,
        tAppId: data_detail?.approvalInformation?.tAppId,
        approvalDetail: data_detail?.approvalInformation,
        approvalType: data_detail?.approvalInformation?.approvalType,
      });
    }
    if (
      id &&
      data_detail_draft?.information?.id === id &&
      data_detail_draft?.information?.id === data_detail?.information?.id &&
      data_detail &&
      (!data_detail?.approvalInformation?.approvalType ||
        data_detail?.approvalInformation?.approvalType !==
          "INACTIVE_BILLING_BUCKET")
    ) {
      // Criteria Data Select
      const criteriaSelect = (data_detail_draft?.criteria || []).map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
        };
      });

      // console.log(criteriaSelect, "criteriaSelect");

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      // const dataDraftAttachment = (
      //   data_detail_draft?.mattachmentLists || []
      // ).map((item) => {
      //   return {
      //     id: item.id,
      //     size: item.size,
      //     fileName: item.fileName,
      //     fileSize: item.fileSize,
      //     fileType: item.fileType,
      //     fileCategoryId: item.fileCategoryId,
      //     fileCategoryName: item.fileCategoryName,
      //     pathFile: item.pathFile,
      //     urlFile1: item.urlFile1,
      //     urlFile2: item.urlFile2,
      //     createdBy: item.createdBy,
      //     createdDate: item.createdDate
      //       ? moment(item.createdDate).format("DD MMM YYYY")
      //       : "",
      //     dataType: "exist",
      //   };
      // });

      // Data Criteria Information
      const dataDraftCriteriaList = (data_detail_draft?.criteriaData || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.costCenter,
            sor: item.sor,
            industrialSector: item.industrialSector,
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

      // Data Detail Billing Bucket (Billing Item)
      const dataDraftDetailBillingBucket =
        data_detail_draft?.billingBucketDetail?.map((item) => {
          return {
            billingItem: item.billingItem.value,
            currency: item.currency.value,
            sequence: item.sequence,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            priority: item.priority,
          };
        });

      setDataDraft(data_detail_draft);
      setListDataCriteriaDraft(dataDraftCriteriaList);
      setCriteriaValuesDraft(mappingCriteria);
      // setListDataAttachment((prevState) => [
      //   ...prevState,
      //   ...dataDraftAttachment,
      // ]);
      setListDataBIDraft(dataDraftDetailBillingBucket);

      setListSectionInfo([
        { value: "Billing Bucket" },
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
      path: RBI_ROUTES.BILLING_BUCKET_VIEW,
      breadcrumbName: "Billing Bucket",
    },
    {
      path: "",
      breadcrumbName: "Detail Billing Bucket",
    },
  ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Billing Bucket":
        return (
          <DetailSection
            key={"detail"}
            dataBillingBucket={dataDetail}
            dataHistory={dataLogInformation}
            criteriaValues={criteriaValues}
            dataCriteria={listDataCriteria}
            listDataBI={listDataBI}
          />
        );
      case "Draft":
        return (
          <DetailSection
            key={"draft"}
            dataBillingBucket={dataDraft}
            dataHistory={dataLogInformation}
            criteriaValues={criteriaValuesDraft}
            dataCriteria={listDataCriteriaDraft}
            listDataBI={listDataBIDraft}
          />
        );
      case "Attachment":
        return (
          <CardContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="billing_bucket"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </CardContainer>
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
      bodyApproval.approvalType === "INACTIVE_BILLING_BUCKET"
        ? approveRejectInactiveBillingBucket({
            body: data,
          })
        : approveRejectBillingBucket({
            body: data,
          }),
    )
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDetailDraftBillingBucket(id));
        dispatch(getDetailBillingBucket(id));
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

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-4">
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_BILLING_BUCKET" && (
              <CardContainer header={"inactive request information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate,
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
          <RadioTabs
            data={listSectionInfo}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
          {layout(valuePage)}
        </div>

        <div className="flex mt-[10px]">
          <ButtonComponent type={"submit"} onClick={() => navigate(-1)}>
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
          menu={"Billing Bucket"}
          named={dataDetail?.information?.name}
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

export default BillingBucketDetail;
