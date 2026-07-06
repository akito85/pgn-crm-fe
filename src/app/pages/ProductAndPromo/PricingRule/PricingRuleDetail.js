import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import RadioTabs from "../../../../components/RadioTabs";
import PricingRule from "./Utils/PricingRule";
import {
  approveOrRejectInactivePricingRule,
  approveOrRejectPricingRule,
  getDetailPricingRule,
  getHeaderPricingRule,
} from "../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  ModalApproveOrRejectPricingRule,
  ModalErrorApproveOrRejectPricingRule,
} from "./Modal/ModalApproveOrRejectPricingRule";
import BaseContainer from "../../../../components/BaseContainer";
import moment from "moment";
import DetailText from "../../../../components/DetailText";
import { dateFormat } from "../../../../utils";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { configApp } from "../../../../constants/configApp";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

const PricingRuleDetail = () => {
  // Selector
  const { data_header, loading, message, data_detail_draft } = useSelector(
    (state) => state.pricingRule
  );

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useLocation().state.id;

  // State
  const [valuePage, setValuePage] = useState("Pricing Rule");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [dataHeader, setDataHeader] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataDetailDraft, setListDataDetailDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [dataDraft, setDataDraft] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Pricing Rule" },
    { value: "Attachment" },
  ]);
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  // Use Effect
  useEffect(() => {
    if (id) {
      dispatch(getDetailPricingRule(id));
      dispatch(getHeaderPricingRule(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_header?.pricingRuleId === id) {
      // Data Criteria Select
      const criteriaSelect = data_header?.rpricingRuleCriterias?.map((item) => {
        return {
          id: item.criteria,
          pricingRuleCriteriaId: item.pricingRuleCriteriaId,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.id);

      // Data Detail Pricing Rule
      const dataDetailPricingRule = (
        data_header?.mpricingRuleDetails || []
      ).map((item) => {
        return {
          ...item,
          pricingRuleDetailId: item.pricingRuleDetailId,
          lineNumber: item.lineNumber,
          priceCode: item.priceCodeId,
          priceCodeName: item.priceCode,
          min: item.min,
          max: item.max,
          maximumName: item.unlimited === true || item?.max?.toString() === "0" ? "Unlimited" : item.max,
          description: item.description,
          unlimited: item.unlimited,
          value: item.value,
          uom: item.uom,
          currency: item.currency,
          type: "exist",
        };
      });

      // Data Attachment Pricing Rule
      const dataAttachment = (data_header?.mattachmentLists || []).map(
        (item) => {
          return {
            ...item,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            category: item.fileCategoryName,
            categoryName: item.categoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            uploadBy: item.createdBy,
            uploadDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );

      // Data Criteria List Pricing Rule
      const dataCriteriaList = (
        data_header?.rpricingRuleCriteriaDatas || []
      ).map((item, index) => {
        return {
          id: item.id,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          country: item.country,
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
          key: index + 1,
          startDate: item?.startDate,
          endDate: item?.endDate,
          type: "exist",
        };
      });

      setDataLogInformation({
        recordId: data_header.pricingRuleId,
        createdDate: data_header.createdDate,
        createdBy: data_header.createdBy,
        updatedDate: data_header.updatedDate,
        updatedBy: data_header.updatedBy,
      });

      setDataHeader(data_header);
      setListDataDetail(dataDetailPricingRule);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setListDataAttachment(dataAttachment);
      setBodyApproval({
        isApprover: data_header.isApprover,
        tappId: data_header.tappId,
        approvalDetail: data_header.approvalDetail,
        approvalType: data_header.approvalType,
      });
    }
    if (
      id &&
      data_detail_draft?.pricingRuleId === id &&
      data_detail_draft?.pricingRuleId === data_header?.pricingRuleId &&
      data_header &&
      (!data_header.approvalType ||
        data_header.approvalType !== "INACTIVE_PRICING_RULE")
    ) {
      // Data Criteria Select
      const criteriaSelect = (
        data_detail_draft?.rPricingRuleCriterias || []
      ).map((item) => {
        return {
          id: item.criteria,
          pricingRuleCriteriaId: item.pricingRuleCriteriaId,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.id);

      // Data Detail Pricing Rule
      const dataDetailDraftPricingRule = (
        data_detail_draft?.mPricingRuleDetails || []
      )?.map((item) => {
        return {
          ...item,
          pricingRuleDetailId: item.pricingRuleDetailId,
          lineNumber: item.lineNumber,
          priceCode: item.priceCode,
          priceCodeName: item.priceCodeName,
          min: item.min,
          max: item.max,
          maximumName: item.unlimited === true || item?.max?.toString() === "0" ? "Unlimited" : item.max,
          description: item.description,
          unlimited: item.unlimited,
          value: item.value,
          uom: item.uom,
          currency: item.currency,
          type: "exist",
        };
      });

      // Data Attachment Pricing Rule
      const dataDraftAttachment = (
        data_detail_draft?.mAttachmentLists || []
      ).map((item) => {
        return {
          ...item,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          category: item.fileCategoryName,
          categoryName: item.categoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          uploadBy: item.createdBy,
          uploadDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });

      // Data Criteria List Pricing Rule
      const dataDraftCriteriaList = (
        data_detail_draft?.rPricingRuleCriteriaDatas || []
      ).map((item, index) => {
        let obj = { type: "exist", key: index + 1 };
        for (const attr in item) {
          if (
            attr !== "id" &&
            attr !== "idPricingRule" &&
            typeof item[attr] === "object" &&
            !attr?.toLowerCase()?.includes("date")
          ) {
            obj[`${attr}`] = {
              value: item[attr]?.value,
              label: item[`${attr}`]?.label,
            };
          } else {
            obj[attr] = item[attr];
          }
        }
        return obj;
      });
      // console.log(dataDraftCriteriaList);
      
      setDataDraft(data_detail_draft);
      setListDataDetailDraft(dataDetailDraftPricingRule);
      setListDataCriteriaDraft(dataDraftCriteriaList);
      setCriteriaValuesDraft(mappingCriteria);
      setListDataAttachment((prevState) => [
        ...prevState,
        ...dataDraftAttachment,
      ]);

      setListSectionInfo([
        { value: "Pricing Rule" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_header, data_detail_draft]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRICING_RULE,
      breadcrumbName: "Pricing Rule",
    },
    {
      path: PRODUCT_PROMO_ROUTES.DETAIL_PRICING_RULE,
      breadcrumbName: "Detail Pricing Rule",
    },
  ];

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Pricing Rule":
        return (
          <PricingRule
            key={"detail"}
            dataText={dataHeader}
            dataLog={dataLogInformation}
            criteriaValues={criteriaValues}
            data={listDataDetail}
            listDataCriteria={listDataCriteria}
            countryCriteriaId={(data_header?.rpricingRuleCriterias || []).find((item) => item.criteriaName === "Country")?.criteria}
          />
        );
      case "Draft":
        return (
          <PricingRule
            key={"draft"}
            dataText={{
              ...dataDraft,
              approvalStatus: dataHeader.approvalStatus,
            }}
            dataLog={dataLogInformation}
            criteriaValues={criteriaValuesDraft}
            data={listDataDetailDraft}
            listDataCriteria={listDataCriteriaDraft}
            countryCriteriaId={(data_detail_draft?.rPricingRuleCriterias || data_header?.rpricingRuleCriterias || []).find((item) => item.criteriaName === "Country")?.criteria}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              typeSelector={"pricingRule"}
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

  // handle Confirm
  const handleConfirm = (value) => {
    setModalConfirm(false);
    const successApprove = {
      title: `Successful`,
      description: `Your data has been ${approveOrReject}.`,
      width: 500,
    };
    const successReject = {
      title: `Successful`,
      description: `Your data has been ${approveOrReject}.`,
      width: 700,
      alertDescription: `Warning! if you reject this data, you will need to request approval again.`,
    };
    const data = {
      id: id,
      description: remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };
    if (bodyApproval.approvalType !== "INACTIVE_PRICING_RULE") {
      dispatch(
        approveOrRejectPricingRule({
          body: data,
          responseSuccess:
            approveOrReject === "Approve" ? successApprove : successReject,
        })
      )
        .unwrap()
        .then(() => {
          setRemark("");
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            setModalError(true);
            setRemark("");
          }
        });
    } else {
      dispatch(
        approveOrRejectInactivePricingRule({
          body: data,
          responseSuccess:
            approveOrReject === "Approve" ? successApprove : successReject,
        })
      )
        .unwrap()
        .then(() => {
          setRemark("");
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            setModalError(true);
            setRemark("");
          }
        });
    }
    // console.log(data);
  };

  const handleCancel = () => {
    setRemark("");
    setModalConfirm(false);
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className="flex flex-col w-full gap-4">
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_PRICING_RULE" && (
              <NxCardContainer header={"inactive request information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate
                      ? moment(
                          bodyApproval.approvalDetail.requestedDate
                        ).format(dateFormat)
                      : ""}
                  </DetailText>
                  <DetailText label={"Requested By"}>
                    {bodyApproval.approvalDetail.requestedBy}
                  </DetailText>
                  <DetailText label={"Remark"}>
                    {bodyApproval.approvalDetail.remarks}
                  </DetailText>
                </div>
              </NxCardContainer>
            )}
          <RadioTabs
            data={listSectionInfo}
            onChange={onChange}
            currentPosition={valuePage}
          />
          {layout(valuePage)}
        </div>

        <NxBaseContainer border className="mt-4">
          <div className="flex">
            <Button
              onClick={() => navigate(-1)}
              type="menu"
            >
              Back
            </Button>

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
        </NxBaseContainer>

        {/* Modal Approve/Reject*/}
        <ModalApproveOrRejectPricingRule
          isOpen={modalConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          handleCancel={() => handleCancel()}
          handleConfirmFooter={() => handleConfirm()}
          name={dataHeader?.name}
          remark={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        {/* Modal Error Approve/Reject */}
        <ModalErrorApproveOrRejectPricingRule
          isOpen={modalError}
          handleOk={() => {
            setModalError(false);
            handleConfirm();
          }}
          handleCancel={() => setModalError(false)}
          approveOrReject={approveOrReject}
          message={message}
        />
      </Spin>
    </>
  );
};

export default PricingRuleDetail;
