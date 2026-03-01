import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Tabs, message, Spin } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import BranchForm from "./BranchForm";
import DetailText from "../../../../../../components/DetailText";
import { 
  createPaymentWarrantyPartnerBranch,
  getDetailPaymentWarrantyPartnerBranch,
  getAllApprovalList,
  getListApprovalById,
  getListCategory
} from "../../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { configApp } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import { bytesConverter } from "../../../../../../utils/bytesConverter";

const ModalBranch = ({
  isOpen,
  handleCancel = () => {},
  modalType = "create",
  selectedRecord = null,
  partnerId = null,
  fetchBranch = () => {}
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const { dataListAppHierId, dataListAppHierDetail, data_detail_branch, loading } = useSelector((state) => state.paymentWarrantyPartner);

  const [errorMessage, setErrorMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  
  // Specific Branch Values State
  const [branchData, setBranchData] = useState({});
  const [current, setCurrent] = useState(0);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [valuePage, setValuePage] = useState("Branch Details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  const tabItems = [
    { key: "Branch Details", label: "Branch Details" },
    { key: "Approval", label: "Approval" },
    { key: "Attachment", label: "Attachment" },
  ];

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllApprovalList());
      if (modalType === "update" || modalType === "detail") {
        if (selectedRecord?.id) {
          dispatch(getDetailPaymentWarrantyPartnerBranch(selectedRecord.id));
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
    if (data_detail_branch && (modalType === "update" || modalType === "detail")) {
      const branch = data_detail_branch.branch || {};
      form.setFieldsValue({
        ...branch,
        approvalHierarchy: branch.appHierId,
      });
      setSelectedHierarchy(branch.appHierId);
      setListDataAttachment((data_detail_branch.attachmentDtoList || []).map(attach => ({
        ...attach,
        fileSize: bytesConverter(attach.fileSize || 0),
        dataType: "exist"
      })));
    }
  }, [data_detail_branch, modalType, form]);

  const next = () => {
    if (current === 0) {
      if (modalType === "detail") {
        setCurrent(prev => prev + 1);
        return;
      }
      form.validateFields(["branchCode", "branchName"])
        .then(() => {
          setBranchData(form.getFieldsValue(["branchCode", "branchName"]));
          setCurrent(prev => prev + 1);
        })
        .catch(err => {
          console.log("Validation Failed:", err);
          message.error("Please fill all required fields correctly.");
        });
    } else if (current === 1) {
      form.validateFields(["approvalHierarchy", "remark"])
        .then(() => setCurrent(prev => prev + 1))
        .catch(err => {
          console.log("Validation Failed:", err);
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
    handleCancel();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const values = form.getFieldsValue(true);
    
    const payload = {
      ...values,
      partnerId: partnerId,
      appHierId: selectedHierarchy,
      attachmentIds: listDataAttachment.filter(a => a.dataType === "exist").map(a => a.id)
    };

    if (modalType === "update" && selectedRecord?.id) {
      payload.id = selectedRecord.id;
    }

    dispatch(createPaymentWarrantyPartnerBranch(payload))
      .unwrap()
      .then(async (res) => {
        const branchId = res?.id || selectedRecord?.id;
        const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
        
        // This is a branch modal, if no branch ID is returned or selected, we can't upload attachments
        if (newAttachments.length > 0 && !branchId) {
          throw new Error("Cannot upload attachments: No branch ID returned from server.");
        }

        // Upload new attachments sequentially
        for (const element of newAttachments) {
          const uploadBody = {
            referensiId: branchId,
            files: element.file,
            category: "PAYMENT_WARRANTY_PARTNER_BRANCH",
            fileCategoryId: element.fileCategoryId,
          };
          await receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, uploadBody);
        }
        
        setIsSubmitting(false);
        message.success("Branch saved successfully");
        handleClose();
        fetchBranch();
      })
      .catch((err) => {
        setIsSubmitting(false);
        setErrorMessage(err?.message || "Failed to save branch data.");
        message.error(err?.message || "Failed to save branch data.");
      });
  };

  const steps = [
    { title: "CREATE" },
    { title: "APPROVAL" },
    { title: "ATTACHMENT" },
    { title: "CONFIRMATION" },
  ];

  const handleHierarchyChange = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ approvalHierarchy: value });
  };

  const renderConfirmationContent = () => {
    const selectedHierName = dataListAppHierId?.find(h => h.id === selectedHierarchy)?.name || "-";

    return (
      <div className="w-full">
        <Tabs activeKey={valuePage} onChange={setValuePage} items={tabItems} className="mb-4" />
        
        <div style={{ display: valuePage !== "Branch Details" ? "none" : undefined }}>
          <p className="text-primary uppercase font-bold mb-4">BRANCH INFORMATION</p>
          <div className="grid grid-cols-2 gap-4">
            <DetailText label="Branch Code">{branchData.branchCode || "-"}</DetailText>
            <DetailText label="Branch Name">{branchData.branchName || "-"}</DetailText>
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
            service={receiptCollectionHttpService}
            configApplication={configApp.PAYMENT_SERVICE}
            typeSelector="paymentWarrantyPartner"
            dispatch={dispatch}
            getAPICategory={getListCategory}
            typeRBI={"data"}
            disabled={true}
          />
        </div>
      </div>
    );
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleClose}
      header={`${modalType === "create" ? "CREATE" : modalType === "update" ? "UPDATE" : "DETAIL"} BRANCH`}
      width={1100}
      footer={null}
      type="confirmation"
    >
      <Spin spinning={loading || isSubmitting}>
        <div className="w-full h-full flex flex-col pt-4 gap-y-5">
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form layout="vertical" form={form} onFinish={handleSubmit} id="formRequest">
          {/* STEP 1: CREATE */}
          <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
            <p className="text-primary uppercase font-bold mb-4">BRANCH INFORMATION</p>
            <BranchForm disabled={modalType === "detail"} />
          </div>

          {/* STEP 2: APPROVAL */}
          <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
            <p className="text-primary uppercase font-bold mb-4">APPROVAL INFORMATION</p>
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
            setBranchData({});
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

export default ModalBranch;
