import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { configApp } from "../../../../../constants/configApp";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  approveCreateUpdateTOP,
  approveInactive,
  getDetailDraftTOP,
  getDetailTOP,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/termsofPayment";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import DetailTOP from "./DetailTOP";

const ListDetailTOP = () => {
  const { data_detail, data_detail_draft } = useSelector((state) => state.top);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id || [];
  const [tabData, setTabData] = useState([
    { value: "Terms of Payment" },
    { value: "Attachment" },
  ]);
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [dataText, setDataText] = useState({});
  const [dataTextDraft, setDataTextDraft] = useState({});
  const [dataLog, setDataLog] = useState({});
  const [nameCriteria, setNameCriteria] = useState();
  const [nameCriteriaDraft, setNameCriteriaDraft] = useState();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataAttachmentDraft, setListDataAttachmentDraft] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getDetailTOP(id));
      dispatch(getDetailDraftTOP(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && data_detail?.information?.id === id) {
      // Data Criteria Select
      const criteriaSelect = data_detail?.criteria?.map((item) => {
        return {
          id: item?.criteria,
          termOfPaymentId: item?.id,
        };
      });
      const mappingCriteria = criteriaSelect?.map((a) => a.id);
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
      setListDataAttachment(dataAttachment);
      // Data Criteria name
      const findNameCriteria = data_detail?.criteria?.map((a) => {
        return {
          id: a?.criteria,
          name: a?.criteriaName,
        };
      });
      const nameCrit = findNameCriteria?.map((a) => a.name);
      const dataCriteriaList = (data_detail?.criteriaData || []).map(
        (item, index) => {
          return {
            id: item.id,
            startDate: item?.startDate,
            endDate: item?.endDate,
            referenceId: item.referenceId,
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
            customer: item.customer,
            key: index + 1,
            // type: "exist",
            createdDate: item.createdDate,
            createdBy: item.createdBy,
            updatedDate: item.updateDate,
            updatedBy: item.updatedBy,
          };
        },
      );
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setDataText(data_detail?.information);
      setDataLog({
        recordId: data_detail?.information?.id,
        ...data_detail?.historyInformation,
      });
      setNameCriteria(nameCrit);
    }
    if (
      id &&
      data_detail_draft?.information?.id === id &&
      data_detail_draft?.information?.id === data_detail?.information?.id
    ) {
      // Data Criteria Select
      const criteriaSelect = data_detail_draft?.criteria?.map((item) => {
        return {
          id: item?.criteria,
          transactionCalendarId: item?.transactionCalendarId,
        };
      });
      // setListDataAttachmentDraft(
      //   (data_detail_draft?.mattachmentLists || []).map((attachData) => ({
      //     ...attachData,
      //     fileSize: bytesConverter(attachData.fileSize || 0),
      //     dataType: "exist",
      //   }))
      // );
      // Data Criteria name
      const findNameCriteria = data_detail_draft?.criteria?.map((a) => {
        return {
          id: a?.criteria,
          name: a?.criteriaName,
        };
      });
      const nameCrit = findNameCriteria?.map((a) => a.name);
      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (data_detail_draft?.criteriaData || []).map(
        (item, index) => {
          return {
            id: item.id,
            startDate: item?.startDate,
            endDate: item?.endDate,
            referenceId: item.referenceId,
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
            customer: item.customer,
            key: index + 1,
            // type: "exist",
          };
        },
      );
      setDataTextDraft(data_detail_draft?.information);
      setListDataCriteriaDraft(dataCriteriaList);
      setCriteriaValuesDraft(mappingCriteria);
      setNameCriteriaDraft(nameCrit);
      setTabData([
        { value: "Terms of Payment" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Terms of Payment":
        return (
          <DetailTOP
            key={"active"}
            id={id}
            dataDetail={dataText}
            data_req={data_detail?.approvalInformation}
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
            updateData={setListDataCriteria}
            dataLog={dataLog}
            critName={nameCriteria}
          />
        );
      case "Draft":
        return (
          <DetailTOP
            key={"draft"}
            id={id}
            dataDetail={dataTextDraft}
            data_req={data_detail?.approvalInformation}
            type={"detail"}
            data={listDataCriteriaDraft}
            dataCriteria={criteriaValuesDraft}
            updateData={setListDataCriteriaDraft}
            dataLog={dataLog}
            critName={nameCriteriaDraft}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="top"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };
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
      path: RBI_ROUTES.TERMS_OF_PAYMENT_VIEW,
      breadcrumbName: "Terms of Payment",
    },
    {
      path: RBI_ROUTES.TERMS_OF_PAYMENT_DETAIL,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirmApprove = (res, handleClear) => {
    if (data_detail?.approvalInformation?.approvalType === "TERMS_OF_PAYMENT") {
      const data = {
        id: id,
        description: res.remark,
        approvalId: data_detail?.approvalInformation?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      setModalApprove(false);
      dispatch(approveCreateUpdateTOP({ body: data }));
      handleClear();
    } else {
      const data = {
        id: id,
        description: remark,
        approvalId: data_detail?.approvalInformation?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      setModalApprove(false);
      dispatch(approveInactive({ body: data }));
      handleClear();
    }
  };

  const handleCancel = () => {
    setRemark("");
    setModalApprove(false);
  };

  const isShowButton = data_detail?.approvalInformation?.isApprover;

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <div className="w-full gap-5">
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />

        {renderSection(segmentedPage)}
      </div>

      <div className="flex mt-[30px] justify-between py-5">
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

        {isShowButton === true ? (
          <div className="flex align-middle gap-5">
            <ButtonComponent
              type="reject"
              onClick={() => {
                setModalApprove(true);
                setApproveOrReject("reject");
              }}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => {
                setModalApprove(true);
                setApproveOrReject("approve");
              }}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : null}
      </div>

      {/* Modal Approve/Reject*/}
      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={handleCancel}
        onFinish={handleConfirmApprove}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Terms of Payment"}
        named={dataText?.name}
      />
      {/* <ModalApproveOrReject
        key={modalApprove ? true : false}
        isOpen={modalApprove}
        header={`${approveOrReject} information`}
        message={`Are you sure you want to ${approveOrReject} Terms of Payment?`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              form={"formApproveRejcet"}
              onClick={handleCancel}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form={"formApproveRejcet"}
              type={"submit"}
              htmlType={"submit"}
              border={false}
              // onClick={}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form name="formApproveRejcet" onFinish={handleConfirmApprove}>
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
    </LayoutMenu>
  );
};

export default ListDetailTOP;
