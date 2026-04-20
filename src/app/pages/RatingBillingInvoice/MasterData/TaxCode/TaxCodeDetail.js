import { useEffect, useState } from "react";
import moment from "moment";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import RadioTabs from "../../../../../components/RadioTabs";

import DetailSectionTaxCode from "./Utils/DetailSection";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCategory,
  getDetailDraftTaxCode,
  getDetailTaxCode,
  approvalRejectTaxCode,
  approvalInactiveTaxCode,
  approvalActivatedTaxCode,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/taxCode";
import ButtonComponent from "../../../../../components/ButtonComponent";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import DetailText from "../../../../../components/DetailText";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import CardContainer from "../../../../../components/CardContainer";

const TaxCodeDetail = () => {
  // Selector
  const { loading, data_detail_draft, data_detail, data_category } =
    useSelector((state) => state.tax_code);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useLocation().state?.id;

  const [bodyError, setBodyError] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);

  const [approveOrReject, setApproveOrReject] = useState("");
  const [valuePage, setValuePage] = useState("Tax Code");
  const [dataDetail, setDataDetail] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [criteriaValues, setCriteriaValues] = useState([]);

  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [listDataConditionDraft, setListDataConditionDraft] = useState([]);
  const [dataDraft, setDataDraft] = useState({});

  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Tax Code" },
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
      path: RBI_ROUTES.TAX_CODE_VIEW,
      breadcrumbName: "Tax Code",
    },
    {
      path: "",
      breadcrumbName: "Detail Tax Code",
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getDetailDraftTaxCode(id));
      dispatch(getDetailTaxCode(id));
      dispatch(getCategory());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.taxCodeId === id) {
      const criteriaSelect = data_detail?.taxCodeCriteriaDtos?.map((item) => {
        return {
          id: item.id,
          criteria: item.criteria,
        };
      });

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      const dataAttachment = (data_detail?.taxCodeAttDtos || []).map((item) => {
        return {
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.type,
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
      });

      const dataCriteriaList = (data_detail?.taxCodeCriteriaDataDtos || [])
        .filter((data) => data?.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            customer: item.customer,
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
            serviceType: item.serviceType,
            accountCategory: item.accountCategory,
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

      const dataConditionList = (data_detail?.taxCodeConditionDtos || []).map(
        (data, index) => {
          return {
            ...data,
            key: index + 1,
            name: data?.name,
            operator: data?.operator,
            dataType: data?.dataType,
            value: data?.conditionValue,
            startDate: data?.startDate,
            endDate: data?.endDate,
            type: "exist",
            createdDate: data.createdDate,
            createdBy: data.createdBy,
            updatedDate: data.updatedDate,
            updatedBy: data.updatedBy,
          };
        },
      );
      setListDataDetail(dataConditionList);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setDataDetail(data_detail);
      setListDataAttachment(dataAttachment);
      setDataLogInformation({
        recordId: data_detail.taxCodeId,
        createdDate: data_detail.createdDate,
        createdBy: data_detail.createdBy,
        updatedDate: data_detail.updatedDate,
        updatedBy: data_detail.updatedBy,
      });
      setBodyApproval({
        isApprover: data_detail?.isApprover,
        tappId: data_detail?.tappId,
        approvalDetail: data_detail?.approvalDetail,
        approvalType: data_detail?.approvalDetail?.approvalType,
      });
    }
    if (
      id &&
      data_detail_draft?.taxCodeId === id &&
      data_detail_draft?.taxCodeId === data_detail?.taxCodeId &&
      data_detail &&
      (!data_detail?.approvalDto?.approvalType ||
        !["INACTIVE_TAX_CODE", "ACTIVATED_TAX_CODE"].includes(
          data_detail?.approvalDto?.approvalType,
        ))
    ) {
      const criteriaSelect = (data_detail_draft?.taxCodeCriteriaDtos || []).map(
        (item) => {
          return {
            id: item.id,
            criteria: item.criteria,
          };
        },
      );

      const mappingCriteria = criteriaSelect?.map((a) => a.criteria);

      // Data Attachment Information
      // const dataDraftAttachment = (data_detail_draft?.taxCodeAttDtos || [])
      //   .filter((data) => data?.allCriteria !== true)
      //   .map((item) => {
      //     return {
      //       id: item.id,
      //       size: item.size,
      //       fileName: item.fileName,
      //       fileSize: item.fileSize,
      //       fileType: item.type,
      //       fileCategoryId: item.fileCategoryId,
      //       fileCategoryName: item.fileCategoryName,
      //       pathFile: item.pathFile,
      //       urlFile1: item.urlFile1,
      //       urlFile2: item.urlFile2,
      //       createdBy: item.createdBy,
      //       createdDate: item.createdDate
      //         ? moment(item.createdDate).format("DD MMM YYYY")
      //         : "",
      //       dataType: "exist",
      //     };
      //   });

      const dataDraftCriteriaList = (
        data_detail_draft?.taxCodeCriteriaDataDtos || []
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

      const dataDraftCondition = (
        data_detail_draft?.taxCodeConditionDtos || []
      ).map((item, index) => {
        return {
          ...item,
          key: index + 1,
          name: item?.name,
          operator: item?.operator,
          dataType: item?.dataType,
          value: item?.conditionValue,
          startDate: item?.startDate,
          endDate: item?.endDate,
        };
      });
      setDataDraft(data_detail_draft);
      setListDataCriteriaDraft(dataDraftCriteriaList);
      setListDataConditionDraft(dataDraftCondition);
      setCriteriaValuesDraft(mappingCriteria);
      // setListDataAttachment((prevState) => [
      //   ...prevState,
      //   ...dataDraftAttachment,
      // ]);
      setListSectionInfo([
        { value: "Tax Code" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Tax Code":
        return (
          <DetailSectionTaxCode
            key={"detail"}
            dataInvoice={dataDetail}
            dataHistory={dataLogInformation}
            criteriaValues={criteriaValues}
            dataCriteria={listDataCriteria}
            dataCondition={listDataDetail}
            dataCategory={data_category}
          />
        );
      case "Draft":
        return (
          <DetailSectionTaxCode
            key={"draft"}
            dataInvoice={dataDraft}
            dataHistory={dataLogInformation}
            criteriaValues={criteriaValuesDraft}
            dataCriteria={listDataCriteriaDraft}
            dataCondition={listDataConditionDraft}
            dataCategory={data_category}
          />
        );
      case "Attachment":
        return (
          <CardContainer header={"Attachment Information"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="tax_code"
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

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const data = {
      id: id,
      description: res.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(
      bodyApproval.approvalType === "INACTIVE_TAX_CODE"
        ? approvalInactiveTaxCode({
          body: data,
        })
        : bodyApproval.approvalType === "ACTIVATED_TAX_CODE"
          ? approvalActivatedTaxCode({
            body: data,
          })
          : approvalRejectTaxCode({
            body: data,
          }),
    )
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDetailDraftTaxCode(id));
        dispatch(getDetailTaxCode(id));
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
    console.log(data);
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-4">
          {bodyApproval.isApprover &&
            bodyApproval.approvalType &&
            bodyApproval.approvalType === "INACTIVE_TAX_CODE" && (
              <CardContainer header={"inactive request information"}>
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {bodyApproval.approvalDetail.requestedDate}
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

        <div className="flex my-[10px]">
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

        {/* Modal Approve/Reject*/}
        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Tax Code"}
          named={dataDetail?.taxCodeName}
        />

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
            <p className="pl-[70px]">{`Your data was not ${approveOrReject === "Approve" ? "Approved" : "Rejected"
              }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};
export default TaxCodeDetail;
