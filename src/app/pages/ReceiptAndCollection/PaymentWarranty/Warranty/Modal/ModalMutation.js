import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Tabs, message, Spin } from "antd";
import DOMPurify from "dompurify";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import MutationForm from "../Form/MutationForm";
import DetailText from "../../../../../../components/DetailText";
import SectionCard from "../../../../../../components/SectionCard";
import { 
  getAllApprovalList,
  getListApprovalById,
  getListCategory
} from "../../../../../../redux/slices/receipt_collection/warranty";
import { configApp } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import { showModalSuccess } from "../../../../../../redux/slices/general_slice";
import { uploadAttachments } from "../../../../../../utils/uploadHelper";
import { bytesConverter } from "../../../../../../utils/bytesConverter";

const ModalMutation = ({
  isOpen,
  handleCancel = () => {},
  modalType = "create",
  selectedRecord = null,
  warrantyId = null,
  fetchMutation = () => {}
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const { dataListAppHierId, dataListAppHierDetail, loading } = useSelector((state) => state.warranty);

  const [errorMessage, setErrorMessage] = useState("");
  
  // Specific Mutation Values State
  const [mutationData, setMutationData] = useState({});
  const [current, setCurrent] = useState(0);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [valuePage, setValuePage] = useState("Mutation Details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  const tabItems = [
    { key: "Mutation Details", label: "Mutation Details" },
    { key: "Approval", label: "Approval" },
    { key: "Attachment", label: "Attachment" },
  ];

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllApprovalList());
      
      if (modalType === "update" || modalType === "detail") {
        // Handle pre-fill data if needed
      } else {
        form.resetFields();
        setCurrent(0);
        setSelectedHierarchy(null);
        setListDataAttachment([]);
      }
    }
  }, [isOpen, modalType, selectedRecord, dispatch, form]);

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
      form.validateFields(["source", "mutationNumber", "type", "category", "date", "amount", "convertedCurrency", "rate", "eqvAmount", "description"])
        .then(() => {
          setMutationData(form.getFieldsValue());
          setCurrent(prev => prev + 1);
        })
        .catch(err => {
          message.error("Please fill all required fields correctly.");
        });
    } else if (current === 1) {
      form.validateFields(["approvalHierarchy", "remark"])
        .then(() => setCurrent(prev => prev + 1))
        .catch(err => {
          message.error("Please select an Approval Hierarchy.");
        });
    } else if (current === 2) {
      if (listDataAttachment.length === 0) {
        message.warning("Please add at least one attachment.");
        return;
      }
      setCurrent(prev => prev + 1);
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const prev = () => setCurrent(prev => prev - 1);

  const handleClose = () => {
    form.resetFields();
    setCurrent(0);
    setSelectedHierarchy(null);
    setListDataAttachment([]);
    setIsSubmitting(false);
    setMutationData({});
    handleCancel();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const values = form.getFieldsValue(true);
    
    // Replace with real mutation submission call once API handles it
    /*
    const payload = {
      ...values,
      paymentWarrantyId: warrantyId,
      appHierId: selectedHierarchy,
      attachmentIds: listDataAttachment.filter(a => a.dataType === "exist").map(a => a.id)
    };
    dispatch(createPaymentWarrantyMutation(payload)).unwrap().then(...)
    */
    setTimeout(() => {
      setIsSubmitting(false);
      setMutationData({});
      dispatch(showModalSuccess({ title: "Successfull", description: "Mutation have been saved", return: false }));
      handleClose();
      fetchMutation();
    }, 1000);
  };

  const steps = [
    { title: "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
    { title: "CONFIRMATION" },
  ];

  const renderConfirmationContent = () => {
    return (
      <div className="w-full">
        <Tabs activeKey={valuePage} onChange={setValuePage} items={tabItems} className="mb-4" />
        
        <div style={{ display: valuePage !== "Mutation Details" ? "none" : undefined }}>
          <SectionCard title="MUTATION INFORMATION" defaultActiveKey={['1']}>
            <div className="grid grid-cols-5 gap-y-4 gap-x-4">
              <DetailText label="Source">{DOMPurify.sanitize(mutationData.source) || "-"}</DetailText>
              <DetailText label="Mutation Number">{DOMPurify.sanitize(mutationData.mutationNumber) || "-"}</DetailText>
              <DetailText label="Type">{DOMPurify.sanitize(mutationData.type) || "-"}</DetailText>
              <DetailText label="Category">{DOMPurify.sanitize(mutationData.category) || "-"}</DetailText>
              <DetailText label="Date">{mutationData.date ? moment(mutationData.date).format("DD MMM YYYY") : "-"}</DetailText>
              <DetailText label="Amount">{mutationData.amount || "-"}</DetailText>
              <DetailText label="Converted Currency">{DOMPurify.sanitize(mutationData.convertedCurrency) || "-"}</DetailText>
              <DetailText label="Rate">{mutationData.rate || "-"}</DetailText>
              <DetailText label="EQV Amount">{mutationData.eqvAmount || "-"}</DetailText>
              <div className="col-span-5">
                <DetailText label="Description">{DOMPurify.sanitize(mutationData.description) || "-"}</DetailText>
              </div>
            </div>
          </SectionCard>
        </div>

        <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
          <SectionCard title="APPROVAL INFORMATION" defaultActiveKey={['1']}>
            <ApprovalSectionForm
              showSelect={false}
              disableSelect={true}
              approvalName={appHierOptions.find(o => o.value === selectedHierarchy)?.name || ""}
              dataTable={appHierDataDetail}
              selectedHierarchy={selectedHierarchy}
            />
          </SectionCard>
        </div>

        <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
          <SectionCard title="ATTACHMENT INFORMATION" defaultActiveKey={['1']}>
            <AttachmentComponent
              type="detail"
              data={listDataAttachment}
              updateData={setListDataAttachment}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              typeSelector="paymentWarrantyPartner"
              dispatch={dispatch}
              getAPICategory={getListCategory}
              typeRBI={"data"}
              disabled={true}
            />
          </SectionCard>
        </div>
      </div>
    );
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleClose}
      header={`${modalType === "create" ? "CREATE" : modalType === "update" ? "UPDATE" : "DETAIL"} MUTATION`}
      width={1100}
      footer={null}
      type="confirmation"
    >
      <Spin spinning={loading || isSubmitting}>
        <div className="w-full h-full flex flex-col pt-4 gap-y-5">
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form layout="vertical" form={form} onFinish={handleSubmit} id="formRequest">
          <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
            <SectionCard title="MUTATION INFORMATION" defaultActiveKey={['1']}>
              <MutationForm disabled={modalType === "detail"} />
            </SectionCard>
          </div>

          <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
            <SectionCard title="APPROVAL INFORMATION" defaultActiveKey={['1']}>
              <ApprovalSectionForm
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={(val) => {
                  setSelectedHierarchy(val);
                  form.setFieldsValue({ approvalHierarchy: val });
                }}
                disabled={modalType === "detail"}
              />
            </SectionCard>
          </div>

          <div className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}>
            <SectionCard title="ATTACHMENT INFORMATION" defaultActiveKey={['1']}>
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
            </SectionCard>
          </div>

          <div className={`steps-content my-[30px] ${current !== 3 ? "hidden" : ""}`}>
            {renderConfirmationContent()}
          </div>
        
        <FormFooter
          current={current}
          totalSteps={steps.length}
          onPrev={prev}
          onNext={next}
          onCancel={handleClose}
          onClear={() => {
            form.resetFields();
            setSelectedHierarchy(null);
            setListDataAttachment([]);
            setMutationData({});
          }}
          useClearData={false}
          useSaveDraft={false}
          onSubmit={handleSubmit}
          type={modalType}
          isLoading={loading || isSubmitting}
        />
        </Form>
      </div>
      </Spin>
    </ModalCustom>
  );
};

export default ModalMutation;
