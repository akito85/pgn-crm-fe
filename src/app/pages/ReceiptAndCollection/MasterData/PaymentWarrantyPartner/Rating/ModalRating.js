import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { 
  getListRating,
  getListCriteria,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getHistoryPaymentWarrantyPartnerRating,
  inactivatePaymentWarrantyPartnerRating,
  createPaymentWarrantyPartnerRating,
  getDetailPaymentWarrantyPartnerRating
} from "../../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { uploadAttachments } from "../../../../../../utils/uploadHelper";
import { Form, Spin, message, Tabs } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import RatingForm from "./RatingForm";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../../constants/configApp";
import moment from "moment";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import DetailText from "../../../../../../components/DetailText";
import { renderDateConverter } from "../../../../../../utils";
import { ModalError, ModalSuccess } from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";

const ModalRating = ({ 
  isOpen, 
  handleCancel, 
  modalType, 
  selectedRecord, 
  partnerId, 
  fetchRating 
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { 
    dataListRating, 
    dataListCriteria, 
    dataListAppHierId, 
    dataListAppHierDetail,
    data_detail_rating,
    loading 
  } = useSelector((state) => state.paymentWarrantyPartner);

  const [current, setCurrent] = useState(0);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [valuePage, setValuePage] = useState("Rating");

  // State for Feedback Modals
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "CREATE", key: "Rating" },
    { title: "APPROVAL", key: "Approval" },
    { title: "ATTACHMENT", key: "Attachment" },
    { title: "CONFIRMATION", key: "Confirmation" },
  ];

  const tabItems = [
    { key: "Rating", label: "Rating Info" },
    { key: "Approval", label: "Approval" },
    { key: "Attachment", label: "Attachment" },
  ];

  useEffect(() => {
    if (isOpen) {
      dispatch(getListRating());
      dispatch(getListCriteria());
      dispatch(getAllApprovalList());
      setCurrent(0);
      setValuePage("Rating");
      
      if (selectedRecord?.id && (modalType === "update" || modalType === "detail")) {
        dispatch(getDetailPaymentWarrantyPartnerRating(selectedRecord.id));
      } else {
        form.resetFields();
        setSelectedHierarchy(null);
        setListDataAttachment([]);
      }
    }
  }, [dispatch, isOpen, selectedRecord, modalType, form]);

  useEffect(() => {
    if (data_detail_rating && (modalType === "update" || modalType === "detail")) {
      const rating = data_detail_rating.rating || {};
      form.setFieldsValue({
        ...rating,
        ratingDate: rating.ratingDate ? moment(rating.ratingDate) : null,
        startDate: rating.startDate ? moment(rating.startDate) : null,
        endDate: rating.endDate ? moment(rating.endDate) : null,
        approvalHierarchy: rating.appHierId,
      });
      setSelectedHierarchy(rating.appHierId);
      setListDataAttachment((data_detail_rating.attachmentDtoList || []).map(attach => ({
        ...attach,
        fileSize: bytesConverter(attach.fileSize || 0),
        dataType: "exist"
      })));
    }
  }, [data_detail_rating, modalType, form]);

  useEffect(() => {
    if (dataListAppHierId?.length > 0) {
      setAppHierOptions(dataListAppHierId.map(item => ({
        name: item.approvalName,
        value: item.appHierId
      })));
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      setAppHierDataDetail(dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, idx) => ({ ...b, key: idx + 1 }))
      })));
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const next = () => {
    if (current === 0) {
      if (modalType === "detail") {
        setCurrent(prev => prev + 1);
        return;
      }
      // Validate only Step 1 fields
      form.validateFields(["rating", "criteria", "ratingDate", "startDate", "ratingIssuer", "rbc", "equity", "collateralValueAsset", "description"])
        .then(() => setCurrent(prev => prev + 1))
        .catch(err => {
          console.log("Validation Failed:", err);
          message.error("Please fill all required fields correctly.");
        });
    } else if (current === 1) {
      if (!selectedHierarchy) {
        message.warning("Please select an approval hierarchy.");
        return;
      }
      setCurrent(prev => prev + 1);
    } else if (current === 2) {
      if (listDataAttachment.length === 0) {
        message.warning("Please add at least one attachment.");
        return;
      }
      setCurrent(prev => prev + 1);
    }
  };

  const prev = () => setCurrent(prev => prev - 1);

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    const body = {
      ...values,
      partnerId,
      appHierId: selectedHierarchy,
      ratingDate: values.ratingDate ? moment(values.ratingDate).format("YYYY-MM-DD") : null,
      startDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : null,
      endDate: values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : null,
      attachmentIds: listDataAttachment.filter(a => a.dataType === "exist").map(a => a.id)
    };
    if (selectedRecord?.id) body.id = selectedRecord.id;

    dispatch(createPaymentWarrantyPartnerRating(body))
      .unwrap()
      .then(async (res) => {
        const ratingId = res?.id || selectedRecord?.id;
        const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
        
        if (newAttachments.length > 0 && !ratingId) {
          throw new Error("Cannot upload attachments: No rating ID returned from server.");
        }

        // Handle attachments using helper
        if (newAttachments.length > 0) {
          await uploadAttachments(
            newAttachments, 
            ratingId, 
            "PAYMENT_WARRANTY_PARTNER_RATING",
            (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
          );
        }

        setIsSubmitting(false);
        setModalSuccess(true);
      })
      .catch((err) => {
        setIsSubmitting(false);
        setErrorMessage(err?.message || "Failed to save rating data.");
        setModalError(true);
      });
  };

  const handleOkSuccess = () => {
    setModalSuccess(false);
    handleCancel();
    fetchRating();
  };

  return (
    <>
      <ModalCustom
        isOpen={isOpen}
        handleCancel={handleCancel}
        header={`${modalType === "create" ? "CREATE" : modalType === "update" ? "UPDATE" : "DETAIL"} RATING LIST`}
        width={1100}
        footer={null}
        type="confirmation"
      >
        <Spin spinning={loading || isSubmitting}>
          <div className="flex flex-col gap-y-5">
             <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
          </div>

          <Form layout="vertical" form={form} onFinish={handleSubmit} id="formRequest">
            {/* STEP 1: CREATE */}
            <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
              <p className="text-primary uppercase font-bold mb-4">RATING INFORMATION</p>
              <RatingForm 
                form={form}
                dataListRating={dataListRating} 
                dataListCriteria={dataListCriteria} 
                disabled={modalType === "detail"}
              />
            </div>

            {/* STEP 2: APPROVAL */}
            <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
              <p className="text-primary uppercase font-bold mb-4">APPROVAL INFORMATION</p>
              <ApprovalSectionForm
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
                disabled={modalType === "detail"}
              />
            </div>

            {/* STEP 3: ATTACHMENT */}
            <div className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}>
              <p className="text-primary uppercase font-bold mb-4">ATTACHMENT INFORMATION</p>
              <AttachmentComponent
                type={modalType}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="paymentWarrantyPartner"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
                disabled={modalType === "detail"}
              />
            </div>

            {/* STEP 4: CONFIRMATION */}
            <div className={`steps-content my-[30px] ${current !== 3 ? "hidden" : ""}`}>
              <Tabs activeKey={valuePage} onChange={setValuePage} items={tabItems} className="mb-4" />
              
              <div style={{ display: valuePage !== "Rating" ? "none" : undefined }}>
                <p className="text-primary uppercase font-bold mb-4">RATING INFORMATION</p>
                <div className="grid grid-cols-5 gap-4">
                  <DetailText label="Rating">{DOMPurify.sanitize(form.getFieldValue("rating")) || ""}</DetailText>
                  <DetailText label="Criteria">{DOMPurify.sanitize(form.getFieldValue("criteria")) || ""}</DetailText>
                  <DetailText label="Rating date">{form.getFieldValue("ratingDate") ? renderDateConverter(form.getFieldValue("ratingDate")) : "-"}</DetailText>
                  <DetailText label="Start date">{form.getFieldValue("startDate") ? renderDateConverter(form.getFieldValue("startDate")) : "-"}</DetailText>
                  <DetailText label="End date">{form.getFieldValue("endDate") ? renderDateConverter(form.getFieldValue("endDate")) : "-"}</DetailText>
                  <DetailText label="Rating Issuer">{DOMPurify.sanitize(form.getFieldValue("ratingIssuer")) || ""}</DetailText>
                  <DetailText label="RBC min 120%">{form.getFieldValue("rbc") ? `${form.getFieldValue("rbc").toLocaleString('id-ID')} %` : "-"}</DetailText>
                  <DetailText label="Equity At Least Rp200M">{form.getFieldValue("equity") ? `Rp ${form.getFieldValue("equity").toLocaleString('id-ID')}` : "-"}</DetailText>
                  <DetailText label="10X Collateral Value Asset">{form.getFieldValue("collateralValueAsset") ? form.getFieldValue("collateralValueAsset").toLocaleString('id-ID') : "-"}</DetailText>
                  <div></div>
                  <div className="col-span-1"></div>
                  <div className="col-span-5">
                    <DetailText label="Description">{DOMPurify.sanitize(form.getFieldValue("description")) || ""}</DetailText>
                  </div>
                </div>
              </div>

              <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
                <p className="text-primary uppercase font-bold mb-4">APPROVAL INFORMATION</p>
                <ApprovalSectionForm
                  showSelect={false}
                  disableSelect={true}
                  approvalName={appHierOptions.find(o => o.value === selectedHierarchy)?.name || ""}
                  dataTable={appHierDataDetail}
                  selectedHierarchy={selectedHierarchy}
                />
              </div>

              <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
                <p className="text-primary uppercase font-bold mb-4">ATTACHMENT INFORMATION</p>
                <AttachmentComponent
                  type="detail"
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  typeSelector="paymentWarrantyPartner"
                  dispatch={dispatch}
                  getAPICategory={getListCategory}
                  service={receiptCollectionHttpService}
                  configApplication={configApp.PAYMENT_SERVICE}
                  typeRBI={"data"}
                  disabled={true}
                />
              </div>
            </div>

            <FormFooter
              current={current}
              totalSteps={steps.length}
              onPrev={prev}
              onNext={next}
              onCancel={handleCancel}
              onClear={() => {
                form.resetFields();
                setSelectedHierarchy(null);
                setListDataAttachment([]);
              }}
              useClearData={false}
              useSaveDraft={false}
              onSubmit={() => form.submit()}
              type={modalType}
              isLoading={loading}
            />
          </Form>
        </Spin>
      </ModalCustom>

      {/* Success Modal */}
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleOkSuccess}
      >
        <div className={"w-full flex flex-col items-center justify-center p-5"}>
          <div className="flex gap-[20px] items-center mb-4">
            {IconModal.icon_success_default}
            <span className="text-[18px] font-bold">Success</span>
          </div>
          <p className="text-center">Data has been successfully saved.</p>
        </div>
      </ModalSuccess>

      {/* Error Modal */}
      <ModalError
        isOpen={modalError}
        handleOk={() => setModalError(false)}
      >
        <div className={"w-full flex flex-col p-5"}>
          <div className="flex gap-[20px] items-center mb-4">
            {IconModal.icon_error_default}
            <span className="text-[18px] font-bold">Failed</span>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default ModalRating;
