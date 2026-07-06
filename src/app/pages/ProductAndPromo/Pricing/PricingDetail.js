import React, { useState, Fragment, useEffect } from "react";
import { Button, Form, Spin } from "antd";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import RadioTabs from "../../../../components/RadioTabs";
import PricingSectionDetail from "./Detail/PricingSectionDetail";
import AttachmentSectionForm from "./Form/AttachmentSectionForm";
import moment from "moment";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useNavigate, useLocation } from "react-router";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import PricingInactiveRequest from "./Detail/PricingInactiveRequest";
import { useDispatch, useSelector } from "react-redux";
import {
  approvalCreatePricing,
  approvalInactivePricing,
  getDetailDraftPricingGeneral,
  getDetailPricingGeneral,
  getEndDateHistory,
  getPriceAdjustByIdPricingDetail,
} from "../../../../redux/slices/product_promo/pricing";
import { bytesConverter } from "../../../../utils/bytesConverter";
import ModalEndDateHistory from "./Detail/ModalEndDateHistory";
import LayoutContentTab from "./Detail/LayoutContentTab";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import { dateFormatting } from "../../../../utils";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

const routes = [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRICING,
    breadcrumbName: "Pricing",
  },
  {
    path: PRODUCT_PROMO_ROUTES.DETAIL_PRICING,
    breadcrumbName: "Detail Pricing",
  },
];

const type = "detail";
const listSectionPricingDetail = [{ value: "Detail" }, { value: "Criteria" }];
const PricingDetail = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [form] = Form.useForm();
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataDetailDraft, setListDataDetailDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Pricing" },
    { value: "Attachment" },
  ]);
  const [typePricingInfo, setTypePricingInfo] = useState(
    listSectionInfo[0].value
  );
  const [typePricingDetail, setTypePricingDetail] = useState(
    listSectionPricingDetail[0].value
  );
  const [dataDetailSelected, setDataDetailSelected] = useState({});
  const [listPricingDetailAdjustment, setListPricingDetailAdjustment] =
    useState([]);

  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [dataPricingSection, setDataPricingSection] = useState({});
  const [dataPricingDraftSection, setDataPricingDraftSection] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const {
    dataDetailPricingGeneral,
    dataDetailDraftPricingGeneral,
    endDateHistoryList,
    loadingPricing,
    priceAdjustListById,
  } = useSelector((state) => state.pricing);

  const countryCriteriaId = (dataDetailPricingGeneral?.rPricingCriterias || dataDetailDraftPricingGeneral?.rPricingCriterias || [])
    .find((item) => item.criteriaName === "Country")?.criteria;
  const [modalEndDateHistory, setModalEndDateHistory] = useState(false);
  const [selectedDetailEndDate, setSelectedDetailEndDate] = useState({});
  const [tableDetailEndDate, setTableDetailEndDate] = useState([]);
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

  useEffect(() => {
    if (id) {
      dispatch(getDetailPricingGeneral({ id }));
      dispatch(getDetailDraftPricingGeneral({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (endDateHistoryList && endDateHistoryList.length) {
      setTableDetailEndDate(
        endDateHistoryList.map((item) => ({
          ...item,
          actionDate: item.actionDate
            ? moment(item.actionDate).format(dateFormatting.dateTime)
            : "",
        }))
      );
    }
  }, [endDateHistoryList]);

  useEffect(() => {
    setListPricingDetailAdjustment(priceAdjustListById || []);
  }, [priceAdjustListById]);

  useEffect(() => {
    if (id && dataDetailPricingGeneral?.id === id) {
      const criteria =
        (dataDetailPricingGeneral.rPricingCriterias || []).map(
          (item) => item.criteria
        ) || [];
      const tempCriteria = (
        dataDetailPricingGeneral.rPricingCriterias || []
      ).reduce(
        (prev, current) =>
          prev + (current.criteriaName ? `, ${current.criteriaName}` : ""),
        ""
      );
      setCriteriaValues(criteria);
      setDataLogInformation({
        recordId: dataDetailPricingGeneral.id,
        createdDate: dataDetailPricingGeneral.createdDate,
        createdBy: dataDetailPricingGeneral.createdBy,
        updatedDate: dataDetailPricingGeneral.updatedDate,
        updatedBy: dataDetailPricingGeneral.updatedBy,
      });
      setDataPricingSection({
        priceCode: dataDetailPricingGeneral.priceCode,
        criteria: tempCriteria ? tempCriteria.slice(2) : "",
        status: dataDetailPricingGeneral.status,
        statusApproval: dataDetailPricingGeneral.statusApproval,
        description: dataDetailPricingGeneral.priceDescription,
      });
      setListDataAttachment(
        (dataDetailPricingGeneral?.mAttachments || []).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
      setListDataDetail(
        (dataDetailPricingGeneral?.mPricingDetails || []).map((priceData) => ({
          ...priceData,
          currency: priceData?.currencyId?.label,
          uom: priceData?.uomId?.label,
          currencyIds: priceData?.currencyId?.value,
          uomIds: priceData?.uomId?.value,
          startDate: priceData?.startDate ? moment(priceData.startDate, "DD-MMM-YYYY").format(
            "YYYY-MM-DD"
          ): undefined,
          endDate: priceData?.endDate
            ? moment(priceData.endDate, "DD-MMM-YYYY").format("YYYY-MM-DD")
            : undefined,
          type: "exist",
        }))
      );
      setListDataCriteria(
        (dataDetailPricingGeneral.criteriasValue || []).map((item, index) => {
          let obj = { typeData: "exist", key: index + 1 };
          for (const attr in item) {
            if (
              typeof item[attr] === "object" &&
              item[attr] !== null &&
              !attr?.toLowerCase()?.includes("date")
            ) {
              obj[`${attr?.replace(/Id/, '')}`] = {
                label: item[attr]?.label || item[attr]?.name,
                value: item[attr]?.value,
              };
            } else {
              obj[attr] = item[attr];
            }
          }
          Object.keys(obj).forEach(key => {
            if (key.includes('Id')) {
              delete obj[key];
            }
          });

          return obj;
        })
      );

      setBodyApproval({
        isApprover: dataDetailPricingGeneral.isApprover,
        tappId: dataDetailPricingGeneral.tappId,
        approvalDetail: dataDetailPricingGeneral.approvalDetail,
        approvalType: dataDetailPricingGeneral.approvalType,
      });
    }

    if (
      id &&
      dataDetailDraftPricingGeneral?.id === id &&
      dataDetailDraftPricingGeneral?.id === dataDetailPricingGeneral?.id &&
      dataDetailPricingGeneral &&
      (!dataDetailPricingGeneral.approvalType ||
        dataDetailPricingGeneral.approvalType !== "INACTIVE_PRICING")
    ) {
      const criteria =
        (dataDetailDraftPricingGeneral.rPricingCriterias || []).map(
          (item) => item.criteria
        ) || [];
      const tempCriteria = (
        dataDetailDraftPricingGeneral.rPricingCriterias || []
      ).reduce(
        (prev, current) =>
          prev + (current.criteriaName ? `, ${current.criteriaName}` : ""),
        ""
      );
      setCriteriaValuesDraft(criteria);
      setDataPricingDraftSection({
        priceCode: dataDetailDraftPricingGeneral.priceCode,
        criteria: tempCriteria ? tempCriteria.slice(2) : "",
        status: dataDetailDraftPricingGeneral.status,
        statusApproval: dataDetailPricingGeneral.statusApproval,
        description: dataDetailDraftPricingGeneral.priceDescription,
      });
      setListDataAttachment((prevState) => [
        ...prevState,
        ...(dataDetailDraftPricingGeneral?.mAttachments || []).map(
          (attachData) => ({
            ...attachData,
            createdDate: attachData.createdDate
              ? moment(attachData.createdDate).format(dateFormatting.dateTime)
              : "",
            fileSize: bytesConverter(attachData.fileSize || 0),
            dataType: "exist",
          })
        ),
      ]);
      setListDataDetailDraft(
        (dataDetailDraftPricingGeneral?.mPricingDetails || []).map(
          (priceData) => {
            let obj = {
              ...priceData,
              startDate: priceData?.startDate ? moment(priceData.startDate, "DD-MMM-YYYY").format(
                "YYYY-MM-DD"
              ) : undefined,
              endDate: priceData?.endDate
                ? moment(priceData.endDate, "DD-MMM-YYYY").format("YYYY-MM-DD")
                : undefined,
              type: "exist",
            };
            obj.currencyIds = parseInt(priceData?.currency);
            obj.uomIds = parseInt(priceData?.uom);
            obj.currency = priceData?.currencyName;
            obj.uom = priceData?.uomName;
            delete obj.uomName;
            delete obj.currencyName;
            return obj;
          }
        )
      );
      setListDataCriteriaDraft(
        (dataDetailDraftPricingGeneral.criteriasValue || []).map(
          (item, index) => {
            let obj = { typeData: "exist", key: index + 1 };
            for (const attr in item) {
              if (
                typeof item[attr] === "object" &&
                item[attr] !== null &&
                !attr?.toLowerCase()?.includes("date")
              ) {
                obj[`${attr}`] = {
                  label: item[`${attr}`]?.label,
                  value: item[attr]?.value,
                };
              } else {
                obj[attr] = item[attr];
              }
            }
            return obj;
          }
        )
      );
      setListSectionInfo([
        { value: "Pricing" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, dataDetailPricingGeneral, dataDetailDraftPricingGeneral]);
  // console.log(listDataCriteria,"test");
  
  const showSection = () => {
    switch (typePricingInfo) {
      case listSectionInfo[0].value:
        return (
          <PricingSectionDetail key={"active"} data={dataPricingSection} />
        );
      case "Draft":
        return (
          <PricingSectionDetail key={"draft"} data={dataPricingDraftSection} />
        );
      case "Attachment":
        return (
          <AttachmentSectionForm
            type={type}
            data={listDataAttachment}
            updateData={setListDataAttachment}
            dispatch={dispatch}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handlePricingInfo = (e) => {
    const temp = e.target.value;
    setDataDetailSelected({});
    setTypePricingDetail(listSectionPricingDetail[0].value);
    setTypePricingInfo(temp);
  };
  const handlePricingDetail = (temp) => {
    if (temp === listSectionPricingDetail[1].value) {
      setDataDetailSelected({});
    }
    setTypePricingDetail(temp);
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
    // handleCloseModalApproveReject();
    if (bodyApproval.approvalType === "INACTIVE_PRICING") {
      return dispatch(approvalInactivePricing(obj))
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
            setBodyError({ message, formValue });
            setModalError(true);
          }
        });
    } else {
      return dispatch(approvalCreatePricing(obj))
        .unwrap()
        .then((res) => {
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

  const handleSelectedPriceDetail = (r) => {
    setDataDetailSelected(r);
    dispatch(getPriceAdjustByIdPricingDetail({ id: r.id }));
  };

  const handleOpenModalSelectedEndDate = (r) => {
    // console.log(r);
    setSelectedDetailEndDate(r);
    dispatch(getEndDateHistory({ id: r.id }));
    setModalEndDateHistory(true);
  };

  const handleCloseModalEndDate = () => {
    setModalEndDateHistory(false);
    setSelectedDetailEndDate({});
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
      <Spin spinning={loadingPricing}>
        <BreadCrumb routes={routes} />
        <div className="flex flex-col gap-4">
          {bodyApproval.isApprover &&
          bodyApproval.approvalType &&
          bodyApproval.approvalType === "INACTIVE_PRICING" ? (
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
          <RadioTabs
            data={listSectionInfo}
            onChange={handlePricingInfo}
            currentPosition={typePricingInfo}
          />
          <NxCardContainer
            header={`${
              typePricingInfo === "Draft"
                ? "PRICING"
                : typePricingInfo.toUpperCase()
            } INFORMATION`}
          >
            {showSection()}
          </NxCardContainer>
          {typePricingInfo === listSectionInfo[0].value ? (
            <LayoutContentTab
              key={"active-detail"}
              listSectionPricingDetail={listSectionPricingDetail}
              handlePricingDetail={handlePricingDetail}
              typePricingDetail={typePricingDetail}
              type={type}
              listDataDetail={listDataDetail}
              dataPricingSection={dataPricingSection}
              dataDetailSelected={dataDetailSelected}
              handleSelectedPriceDetail={handleSelectedPriceDetail}
              handleOpenModalSelectedEndDate={handleOpenModalSelectedEndDate}
              setListDataDetail={setListDataDetail}
              dispatch={dispatch}
              listDataCriteria={listDataCriteria}
              criteriaValues={criteriaValues}
              setListDataCriteria={setListDataCriteria}
              listPricingDetailAdjustment={listPricingDetailAdjustment}
              dataLogInformation={dataLogInformation}
              countryCriteriaId={countryCriteriaId}
            />
          ) : null}
          {typePricingInfo === "Draft" ? (
            <LayoutContentTab
              key={"draft-detail"}
              listSectionPricingDetail={listSectionPricingDetail}
              handlePricingDetail={handlePricingDetail}
              typePricingDetail={typePricingDetail}
              type={type}
              listDataDetail={listDataDetailDraft}
              dataPricingSection={dataPricingDraftSection}
              dataDetailSelected={dataDetailSelected}
              handleSelectedPriceDetail={handleSelectedPriceDetail}
              handleOpenModalSelectedEndDate={handleOpenModalSelectedEndDate}
              setListDataDetail={setListDataDetailDraft}
              dispatch={dispatch}
              listDataCriteria={listDataCriteriaDraft}
              criteriaValues={criteriaValuesDraft}
              setListDataCriteria={setListDataCriteriaDraft}
              listPricingDetailAdjustment={listPricingDetailAdjustment}
              dataLogInformation={dataLogInformation}
              countryCriteriaId={countryCriteriaId}
            />
          ) : null}
          <NxBaseContainer border>
            <div
              className={`flex w-full${
                showButtonApproval ? " justify-between" : ""
              } align-middle my-3`}
            >
              <Button
                onClick={() => navigate(-1)}
                type="menu"
              >
                Back
              </Button>
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
          </NxBaseContainer>
        </div>

        <ModalEndDateHistory
          openModal={modalEndDateHistory}
          dataTable={tableDetailEndDate}
          handleClose={handleCloseModalEndDate}
          dataObj={{
            priceCode: dataPricingSection.priceCode || "",
            priceDetail:
              selectedDetailEndDate && selectedDetailEndDate.id
                ? `${selectedDetailEndDate.currency}/${selectedDetailEndDate.value}/${selectedDetailEndDate.uom}`
                : "",
            description: selectedDetailEndDate.description,
          }}
        />

        {/* Modal Approve/Reject*/}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCloseModalApproveReject}
          onFinish={handleConfirm}
          header={`${approveOrReject}`}
          approveOrReject={approveOrReject}
          menu={"Pricing"}
          named={`${dataDetailPricingGeneral?.priceCode|| ""}`}
          // isOpen={modalConfirm}
          // header={`${approveOrReject} information`}
          // message={`Are you sure you want to ${approveOrReject} Pricing?`}
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
            <p className="pl-[70px]">{`Your data was not ${
              approveOrReject === "Approve" ? "approved" : "rejected"
            } ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default PricingDetail;
