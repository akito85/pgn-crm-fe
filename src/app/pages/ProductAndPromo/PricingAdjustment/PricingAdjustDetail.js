import React, { useEffect, useState } from "react";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { Form, Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import RadioTabs from "../../../../components/RadioTabs";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import moment from "moment";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import PricingInactiveRequest from "../Pricing/Detail/PricingInactiveRequest";
import { useDispatch, useSelector } from "react-redux";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import {
  approvalCreatePriceAdjust,
  approvalInactivePriceAdjust,
  getDetailDraftPricingAdjustGeneral,
  getDetailPricing,
  getDetailPricingAdjustGeneral,
} from "../../../../redux/slices/product_promo/pricingAdjust";
import LayoutContentTabPriceAdjust from "./LayoutContentTabPriceAdjust";
import SVGIcon from "../../../../assets/Icon/index";
import { bytesConverter } from "../../../../utils/bytesConverter";
import { dateFormatting } from "../../../../utils";
import { columnsTableCriteria } from "./columnTableCriteriaPriceAdjust";

const routes = [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRICING,
    breadcrumbName: "Price Adjustment",
  },
  {
    path: PRODUCT_PROMO_ROUTES.DETAIL_PRICING,
    breadcrumbName: "Detail Price Adjustment",
  },
];

const type = "detail";
const PricingAdjustDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [form] = Form.useForm();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataPriceAdjust, setListDataPriceAdjust] = useState([]);
  const [bodyPricing, setBodyPricing] = useState({});
  const [bodyDetail, setBodyDetail] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [bodyDraft, setBodyDraft] = useState({});
  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataPriceAdjustDraft, setListDataPriceAdjustDraft] = useState([]);
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Price Adjustment" },
    { value: "Attachment" },
  ]);
  const [typePriceAdjustInfo, setTypePriceAdjustInfo] =
    useState("Price Adjustment");
  const [mPricingDetailsId, setMPricingDetailsId] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;
  const {
    dataDetailPricing,
    loadingPricingAdjust,
    dataDetailPricingAdjustGeneral,
    dataDetailDraftPricingAdjustGeneral,
  } = useSelector((state) => state.pricingAdjust);

  const countryCriteriaId = (
    dataDetailPricingAdjustGeneral?.rcriteriaPricingAdjustments ||
    dataDetailDraftPricingAdjustGeneral?.rcriteriaPricingAdjustments ||
    []
  ).find((item) => item.criteriaName === "Country")?.criteria;

  useEffect(() => {
    if (id) {
      dispatch(getDetailPricingAdjustGeneral({ id }));
      dispatch(getDetailDraftPricingAdjustGeneral({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && dataDetailPricingAdjustGeneral?.id === id) {
      const criteria = (
        dataDetailPricingAdjustGeneral?.rcriteriaPricingAdjustments || []
      ).map((item) => item.criteria);

      const tempCriteria = (
        dataDetailPricingAdjustGeneral?.rcriteriaPricingAdjustments || []
      ).reduce(
        (prev, current) =>
          prev + (current.criteriaName ? `, ${current.criteriaName}` : ""),
        ""
      );
      setDataLogInformation({
        recordId: dataDetailPricingAdjustGeneral.id,
        createdDate: dataDetailPricingAdjustGeneral.createdDate,
        createdBy: dataDetailPricingAdjustGeneral.createdBy,
        updatedDate: dataDetailPricingAdjustGeneral.updatedDate,
        updatedBy: dataDetailPricingAdjustGeneral.updatedBy,
      });
      setBodyDetail({
        adjustmentId: dataDetailPricingAdjustGeneral.pricingAdjustmentId,
        adjustmentName: dataDetailPricingAdjustGeneral.name,
        criteria: tempCriteria ? tempCriteria.slice(2) : "",
        status: dataDetailPricingAdjustGeneral.status,
        description: dataDetailPricingAdjustGeneral.description,
      });
      setMPricingDetailsId(dataDetailPricingAdjustGeneral?.mpricingDetailId);
      setCriteriaValues(criteria);
      setListDataAttachment(
        (dataDetailPricingAdjustGeneral?.mattachments || []).map(
          (attachData) => ({
            ...attachData,
            createdDate: attachData.createdDate
              ? moment(attachData.createdDate).format(dateFormatting.dateTime)
              : "",
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        )
      );
      setListDataPriceAdjust(
        (dataDetailPricingAdjustGeneral?.mpricingAdjustmentDetails || []).map(
          (adjustData, index) => {
            const listIndex = columnsTableCriteria().map(
              (item) => item.dataIndex
            );
            let obj = {
              adjustmentType: {
                label: adjustData.adjustmentTypeName || "",
                value: adjustData.adjustmentType,
              },
              adjustmentValue: adjustData.adjustmentValue?.toFixed(2),
              description: adjustData.description || undefined,
              startDate: adjustData.startDate
                ? moment(adjustData.startDate, "DD-MM-YYYY")
                : undefined,
              endDate: adjustData.endDate
                ? moment(adjustData.endDate, "DD-MM-YYYY")
                : undefined,
              key: index + 1,
              typeData: "exist",
            };
            listIndex.forEach((item) => {
              obj[`${item.slice(0, -2)}`] = {
                label: adjustData[`${item.slice(0, -2)}Name`],
                value: adjustData[`${item.slice(0, -2)}`],
              };
            });
            obj["country"] = {
              label: adjustData.countryName,
              value: adjustData.country,
            };
            return obj;
          }
        )
      );
      setBodyApproval({
        isApprover: dataDetailPricingAdjustGeneral.isApprover,
        tappId: dataDetailPricingAdjustGeneral.tappId,
        approvalDetail: dataDetailPricingAdjustGeneral.approvalDetail,
        approvalType: dataDetailPricingAdjustGeneral.approvalType,
      });
    }

    if (
      id &&
      dataDetailDraftPricingAdjustGeneral?.id === id &&
      dataDetailDraftPricingAdjustGeneral?.id ===
        dataDetailPricingAdjustGeneral?.id &&
      dataDetailPricingAdjustGeneral &&
      (!dataDetailPricingAdjustGeneral.approvalType ||
        dataDetailPricingAdjustGeneral.approvalType !==
          "INACTIVE_PRICING_ADJUSTMENT")
    ) {
      const criteria = (
        dataDetailDraftPricingAdjustGeneral?.rcriteriaPricingAdjustments || []
      ).map((item) => item.criteria);

      const tempCriteria = (
        dataDetailDraftPricingAdjustGeneral?.rcriteriaPricingAdjustments || []
      ).reduce(
        (prev, current) =>
          prev + (current.criteriaName ? `, ${current.criteriaName}` : ""),
        ""
      );
      setBodyDraft({
        adjustmentId: dataDetailDraftPricingAdjustGeneral.pricingAdjustmentId,
        adjustmentName: dataDetailDraftPricingAdjustGeneral.name,
        criteria: tempCriteria ? tempCriteria.slice(2) : "",
        status: dataDetailDraftPricingAdjustGeneral.status,
        description: dataDetailDraftPricingAdjustGeneral.description,
      });
      setCriteriaValuesDraft(criteria);
      setListDataAttachment((prevState) => [
        ...prevState,
        ...(
          dataDetailDraftPricingAdjustGeneral?.mattachments ||
          dataDetailDraftPricingAdjustGeneral?.mAttachments ||
          []
        ).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        })),
      ]);
      setListDataPriceAdjustDraft(
        (
          dataDetailDraftPricingAdjustGeneral?.mpricingAdjustmentDetails || []
        ).map((adjustData, index) => {
          const listIndex = columnsTableCriteria().map(
            (item) => item.dataIndex
          );
          let obj = {
            adjustmentType: {
              label: adjustData.adjustmentTypeName || "",
              value: adjustData.adjustmentType,
            },
            adjustmentValue: adjustData.adjustmentValue?.toFixed(2),
            description: adjustData.description || undefined,
            startDate: adjustData.startDate
              ? moment(adjustData.startDate, "DD-MM-YYYY")
              : undefined,
            endDate: adjustData.endDate
              ? moment(adjustData.endDate, "DD-MM-YYYY")
              : undefined,
            key: index + 1,
            typeData: "exist",
          };
          listIndex.forEach((item) => {
            obj[`${item.slice(0, -2)}`] = {
              label: adjustData[`${item.slice(0, -2)}Name`],
              value: adjustData[`${item.slice(0, -2)}`],
            };
          });
          obj["country"] = {
            label: adjustData.countryName,
            value: adjustData.country,
          };
          return obj;
        })
      );
      setListSectionInfo([
        { value: "Price Adjustment" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, dataDetailPricingAdjustGeneral, dataDetailDraftPricingAdjustGeneral]);

  useEffect(() => {
    if (mPricingDetailsId) {
      dispatch(getDetailPricing({ id: mPricingDetailsId }));
    }
  }, [dispatch, mPricingDetailsId]);

  useEffect(() => {
    if (dataDetailPricing && dataDetailPricing.priceCode) {
      setBodyPricing({
        priceCode: dataDetailPricing.priceCode,
        currency: dataDetailPricing.currency,
        value: dataDetailPricing.value,
        uom: dataDetailPricing.uom,
      });
    }
  }, [dataDetailPricing]);

  const handlePriceAdjustInfo = (e) => {
    setTypePriceAdjustInfo(e.target.value);
  };
  const handleModalConfirmation = (type) => {
    setModalConfirm(true);
    setApproveOrReject(type);
  };

  const handleCloseModalApproveReject = () => {
    setRemark("");
    setModalConfirm(false);
    form.resetFields();
  };

  const handleConfirm = (formValue, handleClear) => {
    const obj = {
      id: id,
      description: formValue?.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject === "Approve" ? "APPROVE" : "REJECT",
    };
    // console.log(obj);
    if (bodyApproval.approvalType === "INACTIVE_PRICING_ADJUSTMENT") {
      return dispatch(approvalInactivePriceAdjust(obj))
        .unwrap()
        .then((res) => {
          handleClear();
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            // console.log(error);
            setBodyError({ message, formValue, handleClear });
            setModalError(true);
          }
        });
    } else {
      return dispatch(approvalCreatePriceAdjust(obj))
        .unwrap()
        .then((res) => {
          handleClear();
          handleCloseModalApproveReject();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message, formValue, handleClear });
            setModalError(true);
          }
        });
    }
  };
  const showSection = () => {
    switch (typePriceAdjustInfo) {
      case listSectionInfo[0].value:
        return (
          <LayoutContentTabPriceAdjust
            key={"active"}
            type={type}
            listDataDetailPricingAdjust={listDataPriceAdjust}
            criteriaValues={criteriaValues}
            setListDataDetailPricingAdjust={setListDataPriceAdjustDraft}
            dataDetail={bodyDetail}
            dataLogInformation={dataLogInformation}
            bodyPricing={bodyPricing}
            countryCriteriaId={countryCriteriaId}
          />
        );
      case "Draft":
        return (
          <LayoutContentTabPriceAdjust
            key={"draft"}
            type={type}
            listDataDetailPricingAdjust={listDataPriceAdjustDraft}
            criteriaValues={criteriaValuesDraft}
            setListDataDetailPricingAdjust={setListDataPriceAdjustDraft}
            dataDetail={bodyDraft}
            dataLogInformation={dataLogInformation}
            bodyPricing={bodyPricing}
            countryCriteriaId={countryCriteriaId}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"Attachment Information"}>
            <AttachmentSectionForm
              type={type}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
            />
          </BaseContainer>
        );
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm(bodyError.formValue, bodyError?.handleClear);
    setModalError(false);
    setBodyError({});
  };

  return (
    <>
      <Spin
        spinning={loadingPricingAdjust}
        className={"w-full top-20"}
        tip={"Loading..."}
      >
        <BreadCrumb routes={routes} />
        {bodyApproval.isApprover &&
        bodyApproval.approvalType &&
        bodyApproval.approvalType === "INACTIVE_PRICING_ADJUSTMENT" ? (
          <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
            <PricingInactiveRequest
              data={
                bodyApproval.approvalDetail !== null
                  ? bodyApproval.approvalDetail
                  : {}
              }
            />
          </BaseContainer>
        ) : null}
        <div className="mt-[30px]">
          <RadioTabs
            data={listSectionInfo}
            onChange={handlePriceAdjustInfo}
            currentPosition={typePriceAdjustInfo}
          />
        </div>
        {showSection()}
        <div
          className={`flex w-full${
            showButtonApproval ? " justify-between" : ""
          } align-middle my-3`}
        >
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
            <div className="flex align-middle gap-3">
              <ButtonComponent
                type="reject"
                onClick={() => handleModalConfirmation("Reject")}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => handleModalConfirmation("Approve")}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>
        {/* Modal Approve/Reject*/}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCloseModalApproveReject}
          onFinish={handleConfirm}
          header={`${approveOrReject} information`}
          approveOrReject={approveOrReject}
          menu={"Pricing Adjustment"}
          named={`${dataDetailPricingAdjustGeneral?.name|| ""}`}
          // isOpen={modalConfirm}
          // header={`${approveOrReject} information`}
          // message={`Are you sure you want to ${approveOrReject} Price Adjustment?`}
          // width={1000}
          // handleCancel={handleCloseModalApproveReject}
          // footer={
          //   <div className={"w-full flex justify-end gap-5"}>
          //     <ButtonComponent
          //       type={"default"}
          //       onClick={handleCloseModalApproveReject}
          //     >
          //       Cancel
          //     </ButtonComponent>
          //     <ButtonComponent
          //       form={"formApproveRejcet"}
          //       type={"submit"}
          //       htmlType={"submit"}
          //       border={false}
          //     >
          //       Confirm
          //     </ButtonComponent>
          //   </div>
          // }
        />
          {/* <Form form={form} name="formApproveRejcet" onFinish={handleConfirm}>
            <Form.Item
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}

        {/** Modal Retry */}
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
            <p className="pl-[70px]">{`Your data was not inactivate ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default PricingAdjustDetail;
