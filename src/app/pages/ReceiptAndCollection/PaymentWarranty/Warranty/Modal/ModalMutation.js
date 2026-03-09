import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Tabs, message, Spin, Select } from "antd";
import DOMPurify from "dompurify";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import MutationForm from "../Form/MutationForm";
import DetailText from "../../../../../../components/DetailText";
import SectionCard from "../../../../../../components/SectionCard";
import { 
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getMutationCategoryOptions,
  createMutation,
  getDetailMutation
} from "../../../../../../redux/slices/receipt_collection/warranty";
import { getCurrencyDDL } from "../../../../../../redux/slices/receipt_collection/receipt";

import InputComponent from "../../../../../../components/InputComponent";

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
  currencyDDL = null,
  mutationDataInfo = [],
  warrantyType = null,
  headerCurrency = null,
  fetchMutation = () => {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const { 
    dataListAppHierId, 
    dataListAppHierDetail, 
    loadingMutation, 
    loadingApproval, 
    loadingCreate,
    dataDetailMutation,
    loadingDetailMutation
  } = useSelector((state) => state.warranty);

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
      dispatch(getMutationCategoryOptions());
      dispatch(getCurrencyDDL());
      
      if (modalType !== "create") {
        const targetId = selectedRecord?.id || selectedRecord?.no;
        if (targetId) {
          dispatch(getDetailMutation({ id: targetId }));
        }
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

  useEffect(() => {
    if (dataDetailMutation?.data) {
      const actualData = dataDetailMutation.data;
      const type = actualData.type || selectedRecord?.type || selectedRecord?.mutationType;
      const source = actualData.isManual ? "Manual" : (actualData.source || selectedRecord?.source || "Manual");
      const convertedCurrency = actualData.convertedCurrency || actualData.currency || selectedRecord?.convertedCurrency;

      form.setFieldsValue({
        ...selectedRecord,
        ...actualData,
        type: type,
        source: source,
        convertedCurrency: convertedCurrency,
        mutationNumber: actualData.mutationNumber || actualData.documentNumber || selectedRecord?.mutationNumber || selectedRecord?.documentNumber,
        eqvAmount: actualData.eqvAmount ?? actualData.equivalentAmount ?? selectedRecord?.eqvAmount ?? selectedRecord?.equivalentAmount,
        date: actualData.date 
          ? moment(actualData.date) 
          : actualData.transactionDate 
            ? moment(actualData.transactionDate) 
            : (selectedRecord?.date ? moment(selectedRecord.date) : selectedRecord?.transactionDate ? moment(selectedRecord.transactionDate) : null),
      });

      const appHierId = actualData.appHierId || actualData.apphierId || selectedRecord?.apphierId || selectedRecord?.appHierId;
      if (appHierId) {
        setSelectedHierarchy(appHierId);
        form.setFieldsValue({ appHierId: appHierId });
      }

      if (actualData.attachmentDtoList) {
        setListDataAttachment(actualData.attachmentDtoList.map(item => ({
          ...item,
          uid: item.uid || item.id,
          dataType: "exist"
        })));
      }
    }
  }, [dataDetailMutation, form, currencyDDL]);

  const next = () => {
    if (current === 0) {
      form.validateFields(["source", "mutationNumber", "type", "category", "date", "amount", "convertedCurrency", "rate", "eqvAmount", "description"])
        .then(() => {
          const values = form.getFieldsValue();
          const currencyName = values.convertedCurrency || "-";
          setMutationData({
            ...values,
            convertedCurrencyName: currencyName
          });
          setCurrent(prev => prev + 1);
        })
    } else if (current === 1) {
      if (!selectedHierarchy) {
        return message.error("Please select an Approval Hierarchy.");
      }
      setCurrent(prev => prev + 1);
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Online Submission
      let parsedAmount = 0;
        if (values.amount) parsedAmount = parseFloat(values.amount.toString().replace(/,/g, ""));
        
        let parsedRate = 0;
        if (values.rate) parsedRate = parseFloat(values.rate.toString().replace(/,/g, ""));

        let parsedEqvAmount = 0;
        if (values.eqvAmount) parsedEqvAmount = parseFloat(values.eqvAmount.toString().replace(/,/g, ""));

        const submitBody = {
          paymentWarrantyId: warrantyId,
          source: values.source,
          mutationNumber: values.mutationNumber,
          type: values.type, 
          category: values.category,
          transactionDate: values.date ? moment(values.date).toISOString(true) : null,
          amount: parsedAmount,
          currency: values.convertedCurrency || "IDR",
          rate: parsedRate,
          equivalentAmount: parsedEqvAmount,
          description: values.description,
          appHierId: selectedHierarchy,
          attachmentIds: listDataAttachment.filter(a => a.dataType === 'exist').map(a => a.id),
        };

        if (modalType !== 'create' && (selectedRecord?.id || selectedRecord?.no)) {
          submitBody.id = selectedRecord.id || selectedRecord.no;
        }
        const action = createMutation;
        const res = await dispatch(action({ body: submitBody })).unwrap();
        const createdMutationId = res?.id || res || selectedRecord?.id;

        // Upload new attachments
        const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
        if (newAttachments.length > 0 && createdMutationId) {
          await uploadAttachments(newAttachments, createdMutationId, "PAYMENT_WARRANTY",
              (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
          );
        }

        setIsSubmitting(false);
        handleClose();
        if (fetchMutation) fetchMutation();
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      message.error("Please fill all required fields correctly.");
    }
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
              <DetailText label="Amount">{mutationData.amount?.toLocaleString() || "-"}</DetailText>
              <DetailText label="Converted Currency">{DOMPurify.sanitize(mutationData.convertedCurrencyName) || "-"}</DetailText>
              <DetailText label="Rate">{mutationData.rate?.toLocaleString() || "-"}</DetailText>
              <DetailText label="EQV Amount">{mutationData.eqvAmount?.toLocaleString() || "-"}</DetailText>
              <div className="col-span-5">
                <DetailText label="Description">{DOMPurify.sanitize(mutationData.description) || "-"}</DetailText>
              </div>
            </div>
          </SectionCard>
        </div>

        <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
          <SectionCard title="APPROVAL INFORMATION" defaultActiveKey={['1']}>
            <ApprovalComponentGeneral
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
              typeSelector="warranty"
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
      header={`${modalType === "create" ? "CREATE" : "UPDATE"} MUTATION`}
      width={1100}
      footer={null}
      type="confirmation"
    >
      <Spin spinning={loadingMutation || loadingApproval || loadingCreate || isSubmitting || loadingDetailMutation}>
        <div className="w-full h-full flex flex-col pt-4 gap-y-5">
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form layout="vertical" form={form} onFinish={handleSubmit} id="formRequest">
          <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
            <SectionCard title="MUTATION INFORMATION" defaultActiveKey={['1']}>
              <MutationForm 
                disabled={false} 
                currencyDDL={currencyDDL} 
                warrantyType={warrantyType}
                headerCurrency={headerCurrency}
              />
            </SectionCard>
          </div>

          <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
            <SectionCard title="APPROVAL INFORMATION" defaultActiveKey={['1']}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </SectionCard>
          </div>

          <div className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}>
            <SectionCard title="ATTACHMENT INFORMATION" defaultActiveKey={['1']}>
              <AttachmentComponent
                type={modalType}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="warranty"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
                disabled={false}
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
            onNext={current === steps.length - 1 ? handleSubmit : next}
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
            isLoading={loadingMutation || loadingApproval || loadingCreate || isSubmitting}
          />
        </Form>
      </div>
      </Spin>
    </ModalCustom>
  );
};

export default ModalMutation;
