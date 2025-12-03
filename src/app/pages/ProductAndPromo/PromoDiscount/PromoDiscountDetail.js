import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { configApp } from "../../../../constants/configApp";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import DetailText from "../../../../components/DetailText";
import RadioTabs from "../../../../components/RadioTabs";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";
import PromoDiscountDetailPages from "./Pages/PromoDiscountDetailPages";
import {
  approvePromo,
  getDetailPromo,
  getDetailPromoDraft,
  inactiveApprovePromo,
} from "../../../../redux/slices/product_promo/promoSlice";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { dateFormatting } from "../../../../utils";

const PromoDiscountDetail = () => {
  const {
    data_promoDiscountDetail,
    data_promoDiscountDetailDraft,
    data_listAttachment,
    loading,
    message,
  } = useSelector((state) => state.promo);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useLocation().state?.id;

  const [valuePage, setValuePage] = useState("Promo Discount");
  const [approveOrReject, setApproveOrReject] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  // const [modalErrorServer, setModalErrorServer] = useState(false);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [bodyError, setBodyError] = useState({});

  const [promoDiscountDetail, setPromoDiscountDetail] = useState([
    { value: "Promo Discount" },
    { value: "Attachment" },
  ]);

  const [showButtonApproval, setShowButtonApproval] = useState(false);

  const [dataDetail, setDataDetail] = useState({});
  const [dataDetailDraft, setDataDetailDraft] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getDetailPromo(id));
      dispatch(getDetailPromoDraft(id));
    }
  }, [dispatch, id]);

  const handleAssertData = (dataDetail) => {
    return {
      ...dataDetail,
      criteria: (dataDetail?.productPromoCriteriaDtos || [])?.reduce(
        (prev, current, index) =>
          prev +
          (current.idCriteriaName
            ? `${index !== 0 ? ", " : ""}${current.idCriteriaName}`
            : ""),
        "",
      ),
      dataCondition: dataDetail?.productPromoConditionDtos?.map((item) => {
        return {
          ...item,
          startDate: item?.startDate
            ? moment(item?.startDate).format(dateFormatting.date)
            : undefined,
          endDate: item?.endDate
            ? moment(item?.endDate).format(dateFormatting.date)
            : undefined,
          value: item?.adjustmentValue,
        };
      }),
      dataCriteria: dataDetail?.productPromoCriteriaDataDtos,
      criteriaValues: dataDetail?.productPromoCriteriaDtos
        ?.map((item) => {
          return {
            id: item?.id || null,
            idCriteria: item?.idCriteria,
            idPromo: item?.idPromo || null,
          };
        })
        ?.map((item) => item.idCriteria),
    };
  };

  useEffect(() => {
    if (id && data_promoDiscountDetail && data_promoDiscountDetail?.id === id) {
      setShowButtonApproval(
        (data_promoDiscountDetail?.statusApproval === "WAITING APPROVAL" ||
          data_promoDiscountDetail?.statusApproval === "WAITING_APPROVAL") &&
          data_promoDiscountDetail?.isApprover,
      );
      setListDataAttachment(
        (data_promoDiscountDetail?.attachmentListDto || []).map((item) => {
          return {
            ...item,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }),
      );
      setDataDetail(handleAssertData(data_promoDiscountDetail));
      if (
        // dataRecord &&
        // data_BillingItemDetail &&
        data_promoDiscountDetailDraft &&
        data_promoDiscountDetailDraft?.id === data_promoDiscountDetail?.id &&
        data_promoDiscountDetailDraft?.id === id &&
        data_promoDiscountDetail?.statusApproval !== "APPROVED"
        //   data_BillingItemDetail?.approvalDto?.approvalType !== "INACTIVE_BILLING_ITEM")
      ) {
        setDataDetailDraft(
          handleAssertData({
            ...data_promoDiscountDetailDraft,
            status: data_promoDiscountDetail?.status,
            statusApproval: data_promoDiscountDetail?.statusApproval,
          }),
        );
        setPromoDiscountDetail([
          { value: "Promo Discount" },
          { value: "Draft" },
          { value: "Attachment" },
        ]);
      } else {
        setPromoDiscountDetail([
          { value: "Promo Discount" },
          { value: "Attachment" },
        ]);
      }
    }
  }, [id, data_promoDiscountDetail, data_promoDiscountDetailDraft]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PROMO_DISCOUNT,
      breadcrumbName: "Promo Discount",
    },
    {
      path: "",
      breadcrumbName: "Detail Promo Discount",
    },
  ];

  const handleRetry = () => {
    handleConfirm(bodyError.body, bodyError?.handleClear);
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

  // handle Confirm
  const handleConfirm = (e, handleClear = () => {}) => {
    const body = {
      id: data_promoDiscountDetail?.id,
      description: e?.remark,
      approvalId: data_promoDiscountDetail?.tappId,
      action: approveOrReject,
    };
    dispatch(
      data_promoDiscountDetail?.approvalType?.includes("INACTIVE")
        ? inactiveApprovePromo(body)
        : approvePromo(body),
    )
      .unwrap()
      .then((res) => {
        handleClear();
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message, body: { ...e }, handleClear });
          setModalError(true);
        }
      });
  };

  const renderSection = () => {
    switch (valuePage) {
      case "Promo Discount":
        return <PromoDiscountDetailPages dataPromo={dataDetail} />;
      case "Draft":
        return <PromoDiscountDetailPages dataPromo={dataDetailDraft} />;
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              typeSelector={"promo"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              type={"detail"}
              service={productPromoHttpService}
              configApplication={configApp.PRODUCT_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        {data_promoDiscountDetail?.approvalType?.includes("INACTIVE") &&
        data_promoDiscountDetail?.approvalDto?.isApprover ? (
          <div className="mt-5">
            <BaseContainer header={"Inactive Request Information"}>
              <div className="w-full grid grid-cols-4 gap-5">
                <DetailText label="Requested Date">
                  {data_promoDiscountDetail?.approvalDetail?.requestedDate}
                </DetailText>
                <DetailText label="Requested By">
                  {data_promoDiscountDetail?.approvalDetail?.requestedBy}
                </DetailText>
                <DetailText label="Remark">
                  {data_promoDiscountDetail?.approvalDetail?.remarks}
                </DetailText>
              </div>
            </BaseContainer>
          </div>
        ) : null}
        <div className="mt-5">
          <RadioTabs
            data={promoDiscountDetail}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
        </div>
        <div className={"w-full"}>{renderSection()}</div>
        <div className={"w-full flex justify-between my-10"}>
          <div className=" flex">
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
          </div>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject(false);
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject(true);
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>
      </Spin>

      {/* Modal Approve/Reject*/}
      {modalConfirm ? (
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Promo"}
          named={`${data_promoDiscountDetail.name}`}
        />
      ) : null}

      {/* Modal Retry */}
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

export default PromoDiscountDetail;
