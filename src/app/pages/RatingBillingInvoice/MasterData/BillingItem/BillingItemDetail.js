import moment from "moment";
import { Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BillingItemDetailInformation from "./Detail/BillingItemDetailInformation";
import CardContainer from "../../../../../components/CardContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approvalActivatedBillingItem,
  approvalInactiveBillingItem,
  approvalRejectBillingItem,
  getBillingItemDetail,
  getBillingItemTypeList,
  getBillingItemCriteriaList,
  getAttachmentDetail,
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
  const {
    data_BillingItemDetail,
    data_typeList,
    data_criteriaList,
    loading,
    loadingDetail,
  } = useSelector((state) => state.billing_item);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataRecord = useLocation().state?.id;

  const [valueTab, setValueTab] = useState("BillingItem");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  const [dataMapping, setDataMapping] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyError, setBodyError] = useState({});
  const [showButtonApproval, setShowButtonApproval] = useState(false);

  useEffect(() => {
    if (dataRecord) {
      dispatch(getBillingItemDetail({ id: dataRecord }));
      dispatch(getAttachmentDetail(dataRecord))
        .unwrap()
        .then((res) => {
          setListDataAttachment(
            (res?.result || []).map((item) => ({
              ...item,
              createdDate: item.createdDate
                ? moment(item.createdDate).format("DD MMM YYYY")
                : "",
              urlFile1: `/v1/dbs/api/billingitem/download-attachment/${item.id}`,
              dataType: "exist",
            })),
          );
        })
        .catch(() => {
           // Handle error if needed or silently ignore
        });
    }
    dispatch(getBillingItemTypeList());
    dispatch(getBillingItemCriteriaList());
  }, [dispatch, dataRecord]);

  useEffect(() => {
    if (
      dataRecord &&
      data_BillingItemDetail &&
      data_BillingItemDetail?.billingItemCode === dataRecord
    ) {
      // Tombol Approve/Reject
      setShowButtonApproval(
        (data_BillingItemDetail.statusApproval === "WAITING APPROVAL" ||
          data_BillingItemDetail.statusApproval === "WAITING_APPROVAL") &&
        data_BillingItemDetail?.approvalDto?.isApprover,
      );

      // Mapping Information
      setDataMapping(
        (data_BillingItemDetail?.mappingInformation || []).map((item) => ({
          ...item,
          categoryName: item.category,
          startDate: item.startDate ? moment(item.startDate) : "",
          endDate: item.endDate ? moment(item.endDate) : "",
          dataType: "exist",
        })),
      );

    }
  }, [dataRecord, data_BillingItemDetail]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RBI_ROUTES.BILLING_ITEM_VIEW, breadcrumbName: "Transaction Mapping" },
    { path: "", breadcrumbName: "Detail Transaction Mapping" },
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
    setModalConfirm(false);
  };

  const handleConfirm = (e, handleClear = () => { }) => {
    const body = {
      id: data_BillingItemDetail?.id,
      remark: e?.remark,
      approvalId: data_BillingItemDetail?.approvalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    const approvalType =
      data_BillingItemDetail?.approvalDto?.approvalType?.toUpperCase() || "";
    const approvalAction = approvalType.includes("INACTIVE")
      ? approvalInactiveBillingItem(body)
      : approvalType.includes("ACTIVATED")
        ? approvalActivatedBillingItem(body)
        : approvalRejectBillingItem(body);

    dispatch(approvalAction)
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        dispatch(getBillingItemDetail({ id: dataRecord }));
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

  const tabItems = [
    {
      key: "BillingItem",
      label: "Transaction Mapping",
      children: (
        <div className="my-0">
          <BillingItemDetailInformation
            dataMapping={dataMapping}
            dataBillingItem={data_BillingItemDetail}
            data_typeList={data_typeList || []}
            data_criteriaList={data_criteriaList || []}
          />
        </div>
      ),
    },
    {
      key: "Attachment",
      label: "Attachment",
      children: (
        <div className="my-0">
          <CardContainer header="ATTACHMENT INFORMATION">
            <AttachmentComponent
              typeSelector={"billing_item"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              type={"detail"}
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </CardContainer>
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading || loadingDetail}>
        <BreadCrumb routes={routes} />
        {(data_BillingItemDetail?.approvalDto?.approvalType?.includes(
          "INACTIVE",
        ) ||
          data_BillingItemDetail?.approvalDto?.approvalType?.includes(
            "ACTIVATED",
          )) &&
          data_BillingItemDetail?.approvalDto?.isApprover && (
            <div className="mt-5">
              <CardContainer
                header={
                  data_BillingItemDetail?.approvalDto?.approvalType?.includes(
                    "ACTIVATED",
                  )
                    ? "Activate Request Information"
                    : "Inactive Request Information"
                }
              >
                <div className="w-full grid grid-cols-4 gap-5">
                  <DetailText label="Requested Date">
                    {renderDateTime(
                      data_BillingItemDetail?.approvalDto?.requestedDate,
                    )}
                  </DetailText>
                  <DetailText label="Requested By">
                    {data_BillingItemDetail?.approvalDto?.requestedBy}
                  </DetailText>
                  <DetailText label="Remark">
                    {data_BillingItemDetail?.approvalDto?.remark}
                  </DetailText>
                </div>
              </CardContainer>
            </div>
          )}

        <div className="mt-5">
          <Tabs
            items={tabItems}
            onChange={(key) => setValueTab(key)}
            activeKey={valueTab}
            tabBarStyle={{ marginBottom: 0 }}
          />
        </div>

        {/* Footer: Back & Approve/Reject buttons */}
        <div className="w-full flex justify-between my-2 shadow-md bg-white p-1 rounded-md">
          <div className="flex w-full bg-white p-3 rounded-md">
            <ButtonComponent type="submit" onClick={() => navigate(-1)}>
              Back
            </ButtonComponent>
          </div>

          {showButtonApproval && (
            <div className="w-full flex justify-end gap-5 p-3">
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

      {/* Modal Approve/Reject */}
      {modalConfirm && (
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Transaction Mapping"}
          named={`${data_BillingItemDetail?.billingItemName || ""}`}
        />
      )}

      {/* Modal Error */}
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
          <p className="pl-[70px]">{`Your data was not ${approveOrReject === "Approve" ? "Approved" : "Rejected"
            }. ${bodyError.message || ""}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default BillingItemDetail;