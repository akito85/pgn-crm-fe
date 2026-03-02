import { Button, Spin } from "antd";
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
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTabs from "../../../../components/Nx/NxTabs";

const PromoDiscountDetail = () => {
  const {
    data_promoDiscountDetail,
    data_promoDiscountDetailDraft,
    loading,
  } = useSelector((state) => state.promo);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useLocation().state?.id;

  const [activeKey, setActiveKey] = useState("ori");
  const [approveOrReject, setApproveOrReject] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  // const [modalErrorServer, setModalErrorServer] = useState(false);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [bodyError, setBodyError] = useState({});

  const tabOptions = [
    {
      key: "ori",
      label: "Original",
    },
    {
      key: "cur",
      label: "Current",
    }
  ];
  
  const { status, statusApproval, isApprover } = data_promoDiscountDetail;

  const isApproval =
    (statusApproval === "WAITING APPROVAL" || statusApproval === "WAITING_APPROVAL") &&
    isApprover;

  const draftExist = status && status !== "DRAFT" && statusApproval && statusApproval !== "APPROVED";

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
        ""
      ),
      dataCondition: dataDetail?.productPromoConditionDtos?.map((item) => {
        return {
          ...item,
          startDate: item?.startDate ? moment(item?.startDate).format(dateFormatting.date) : undefined,
          endDate: item?.endDate ? moment(item?.endDate).format(dateFormatting.date) : undefined,
          value: item?.adjustmentValue,
        }
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

  const detail = handleAssertData(activeKey === "ori" ? data_promoDiscountDetail : data_promoDiscountDetailDraft);

  useEffect(() => {
    if (id && data_promoDiscountDetail && data_promoDiscountDetail?.id === id) {
      setListDataAttachment(
        (data_promoDiscountDetail?.attachmentListDto || []).map((item) => {
          return {
            ...item,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        })
      );
    }
  }, [id, data_promoDiscountDetail]);

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
      action: approveOrReject ? "APPROVE" : "REJECT",
    };
    dispatch(
      data_promoDiscountDetail?.approvalType?.includes("INACTIVE")
        ? inactiveApprovePromo(body)
        : approvePromo(body)
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

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <div className="flex flex-col gap-y-4">
          <BreadCrumb routes={routes} />
          {
            draftExist && (
              <NxBaseContainer border padding={false}>
                <NxTabs
                  items={tabOptions}
                  activeKey={activeKey}
                  onChange={setActiveKey}
                />
              </NxBaseContainer>
            )
          }
          <PromoDiscountDetailPages dataPromo={detail} />
          {
            isApproval && (
              <div className={"w-full flex justify-between"}>
                <Button
                  type={"menu"}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <div className={"flex gap-x-4"}>
                  <Button
                    type="reject"
                    onClick={() => {
                      setModalConfirm(true);
                      setApproveOrReject(false);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    type="approve"
                    onClick={() => {
                      setModalConfirm(true);
                      setApproveOrReject(true);
                    }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )
          }
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
