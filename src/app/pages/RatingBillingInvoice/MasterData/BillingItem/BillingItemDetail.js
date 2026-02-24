import moment from "moment";
import { Spin, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BillingItemDetailInformation from "./Detail/BillingItemDetailInformation";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainer from "../../../../../components/CardContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approvalInactiveBillingItem,
  approvalRejectBillingItem,
  getBillingItemDetail,
  getDetailDraft,
} from "../../../../../redux/slices/rating_billing_invoice/billingItem";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import DetailText from "../../../../../components/DetailText";
import { renderDateTime } from "./Utils/Utils";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const BillingItemDetail = () => {
  const { data_BillingItemDetail, data_detailDraft, loading, message } =
    useSelector((state) => state.billing_item);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataRecord = useLocation().state?.id;

  const [valueTab, setValueTab] = useState("BillingItem");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");

  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  const [dataMapping, setDataMapping] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [dataDraft, setDataDraft] = useState({});
  const [dataMappingDraft, setDataMappingDraft] = useState({});

  const [bodyError, setBodyError] = useState({});

  const [showButtonApproval, setShowButtonApproval] = useState(false);
  const [showDraftTab, setShowDraftTab] = useState(false);

  useEffect(() => {
    if (dataRecord) {
      dispatch(getBillingItemDetail({ id: dataRecord }));
      dispatch(getDetailDraft({ id: dataRecord }));
    }
  }, [dispatch, dataRecord]);

  useEffect(() => {
    if (dataRecord && data_BillingItemDetail && data_BillingItemDetail?.billingItemCode === dataRecord) {
      setShowButtonApproval(
        (data_BillingItemDetail.statusApproval === "WAITING APPROVAL" ||
          data_BillingItemDetail.statusApproval === "WAITING_APPROVAL") &&
          data_BillingItemDetail?.approvalDto?.isApprover
      );

      // Mapping Information
      setDataMapping(
        (data_BillingItemDetail?.mappingInformation || [])?.map((item) => {
          return {
            ...item,
            categoryName: item.category,
            startDate: item.startDate ? moment(item.startDate) : "",
            endDate: item.endDate ? moment(item.endDate) : "",
            dataType: "exist",
          };
        })
      );

      // Attachment Information
      setListDataAttachment(
        (data_BillingItemDetail?.attachmentDtoList || []).map((item) => {
          return {
            ...item,
            createdDate: item.createdBy
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        })
      );

      if (
        data_detailDraft &&
        data_detailDraft?.billingItemCode === data_BillingItemDetail?.billingItemCode &&
        data_detailDraft?.billingItemCode === dataRecord &&
        (data_BillingItemDetail?.statusApproval !== "APPROVED")
      ) {
        // Mapping Information
        const dataMappingInfoDraft = (
          data_detailDraft?.mappingInformation || []
        )?.map((item) => {
          return {
            ...item,
            categoryName: item.category,
            startDate: item.startDate ? moment(item.startDate) : "",
            endDate: item.endDate ? moment(item.endDate) : "",
            dataType: "exist",
          };
        });

        setDataDraft((prev) => {
          return {
            id: data_BillingItemDetail?.id,
            billingItemCode: data_BillingItemDetail?.billingItemCode,
            billingItemCategory: data_detailDraft.billingItemCategory,
            billingItemName: data_detailDraft.billingItemName,
            billingType: data_detailDraft.billingType,
            startDate: data_detailDraft.startDate,
            endDate: data_detailDraft.endDate,
            lateCharge: data_detailDraft.lateCharge,
            paymentWarranty: data_detailDraft.paymentWarranty,
            description: data_detailDraft.description,
            createdBy: data_BillingItemDetail?.createdBy,
            createdDate: data_BillingItemDetail.createdDate,
            updatedBy: data_BillingItemDetail.updatedBy,
            updatedDate: data_BillingItemDetail.updatedDate,
            status: data_BillingItemDetail?.status,
            statusApproval: data_BillingItemDetail?.statusApproval,
            mappingInformation: data_detailDraft?.mappingInformation?.map(
              (item) => {
                return {
                  ...item,
                  categoryId: item.categoryId,
                };
              }
            ),
          };
        });
        setDataMappingDraft(dataMappingInfoDraft);
        setShowDraftTab(true);
      } else {
        setShowDraftTab(false);
      }
    }
  }, [dataRecord, data_BillingItemDetail, data_detailDraft]);

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
      path: RBI_ROUTES.BILLING_ITEM_VIEW,
      breadcrumbName: "Transation Mapping",
    },
    {
      path: "",
      breadcrumbName: "Detail Transaction Mapping",
    },
  ];

  const handleRetry = () => {
    handleConfirm(bodyError.value);
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleCancel = () => {
    setRemark("");
    setModalConfirm(false);
  };

  const handleConfirm = (e, handleClear = () => {}) => {
    const body = {
      id: data_BillingItemDetail?.id,
      remark: e?.remark,
      approvalId: data_BillingItemDetail?.approvalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(
      data_BillingItemDetail?.approvalDto?.approvalType?.includes("INACTIVE")
        ? approvalInactiveBillingItem(body)
        : approvalRejectBillingItem(body)
    )
      .unwrap()
      .then(async (data) => {
        handleClear();
        handleCancel();
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: {} });
          setModalError(true);
        }
      });
    setModalConfirm(false);
  };

  const onChangeTab = (key) => {
    setValueTab(key);
  };

  const tabItems = [
    {
      key: "BillingItem",
      label: "Billing Item",
      children: (
        <div className="my-0">
          <BillingItemDetailInformation
            dataMapping={dataMapping}
            dataBillingItem={data_BillingItemDetail}
          />
        </div>
      ),
    },
    ...(showDraftTab
      ? [
          {
            key: "Draft",
            label: "Draft",
            children: (
              <div className="my-0">
                <BillingItemDetailInformation
                  dataBillingItem={dataDraft}
                  dataMapping={dataMappingDraft}
                />
              </div>
            ),
          },
        ]
      : []),
    {
      key: "Attachment",
      label: "Attachment",
      children: (
        <div className="my-0">
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              typeSelector={"billing_item"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              type={"detail"}
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        </div>
      ),
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        
        {data_BillingItemDetail?.approvalDto?.approvalType?.includes("INACTIVE") && 
         data_BillingItemDetail?.approvalDto?.isApprover && (
          <div className="mt-5">
            <BaseContainer header={"Inactive Request Information"}>
              <div className="w-full grid grid-cols-4 gap-5">
                <DetailText label="Requested Date">
                  {renderDateTime(data_BillingItemDetail?.approvalDto?.requestedDate)}
                </DetailText>
                <DetailText label="Requested By">
                  {data_BillingItemDetail?.approvalDto?.requestedBy}
                </DetailText>
                <DetailText label="Remark">
                  {data_BillingItemDetail?.approvalDto?.remark}
                </DetailText>
              </div>
            </BaseContainer>
          </div>
        )}

        <div className="mt-5">
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="w-full mt-[15px] text-primary">BILLING ITEM DETAIL</p>
              </div>
            }
          >
            <Tabs
              items={tabItems}
              onChange={onChangeTab}
              activeKey={valueTab}
              className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:my-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
            />
          </CardContainer>
        </div>

        <div className="w-full flex justify-between my-10">
          <div className="flex">
            <ButtonComponent
              type="submit"
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
          </div>

          {showButtonApproval && (
            <div className="w-full flex justify-end gap-5">
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
          )}
        </div>
      </Spin>

      {modalConfirm && (
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Billing Item"}
          named={`${data_BillingItemDetail.billingItemName}`}
        />
      )}

      <ModalError
        isOpen={modalError}
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
    </LayoutMenu>
  );
};

export default BillingItemDetail;