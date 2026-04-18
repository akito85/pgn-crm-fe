import { WarningOutlined, PlusOutlined } from "@ant-design/icons";
import DOMPurify from 'dompurify';
import { Form, Spin, Row, Col, Select, DatePicker, Input, message } from "antd";
import PropTypes from 'prop-types';
import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import BaseContainer from "../../../../../components/BaseContainer";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

import {
  createPaymentWarranty,
  updatePaymentWarranty,
  getDetailWarranty,
  getDetailWarrantyMutation,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getPaymentWarrantyPartnerList,
  getPaymentWarrantyPartnerBranchList,
  getWarrantyTypeOptions,
  getServiceAgreementByAccountId,
} from "../../../../../redux/slices/receipt_collection/warranty";


import {
  getConvertedCurrency,
  getAllAccountNumberDDL,
  getAccountNumberDDL,
  resetDataAccountNumber,
  getUnifiedCreateReceiptDdl,
  getCurrencyDDL,
  getRateTypeDDL,
  getListCategoryReceipt,
} from "../../../../../redux/slices/receipt_collection/receipt";


import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { showModalError, showModalSuccess } from "../../../../../redux/slices/general_slice";
import { uploadAttachments, validateFile } from "../../../../../utils/uploadHelper";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import { dateFormatting, hasValue } from "../../../../../utils";

import ModalMutationNoStepper from "./Modal/ModalMutationNoStepper";
import ContentModalConfirmWarranty from "./Modal/ContentModalConfirmWarranty";
import WarrantyForm from "./Form/WarrantyForm";
import { columnMutation } from "./ColumnConfig/MutationColumns";
import { WARRANTY_STATUS, WARRANTY_APPROVAL_STATUS } from "../../../../../constants/warranty";

const ListFormWarranty = (props) => {
  const { type } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = location?.state || {};

  const { 
    dataListAppHierId, 
    dataListAppHierDetail, 
    loadingDetail, 
    loadingApproval, 
    dataPaymentWarrantyPartner, 
    dataPaymentWarrantyPartnerBranch, 
    data_detail, 
    dataMutation,
    dataServiceAgreement,
    loadingServiceAgreement
  } = useSelector((state) => state.warranty);
  
  const {
    dataAccountNumber,
    dataAccNumber,
    currencyDDL,
    rateTypeDDL,
    data_converted_currency
  } = useSelector((state) => state.receipt);


  const [current, setCurrent] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendBody, setSendBody] = useState(null);
  
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [mutationDataInfo, setMutationDataInfo] = useState([]);
  const [isModalMutationOpen, setIsModalMutationOpen] = useState(false);
  const [selectedMutation, setSelectedMutation] = useState(null);
  const [mutationModalType, setMutationModalType] = useState("create");
  // Ref to ensure mutation data from API only populates local state once
  const mutationInitializedRef = useRef(false);
  const warrantyType = Form.useWatch("warrantyType", form);
  const headerCurrencyId = Form.useWatch("currency", form);
  const headerCurrency = useMemo(() => {
    if (!headerCurrencyId) return null;
    const foundById = currencyDDL?.data?.find(c => c.id === headerCurrencyId);
    if (foundById) return foundById.name;
    const foundByName = currencyDDL?.data?.find(c => c.name === headerCurrencyId);
    if (foundByName) return foundByName.name;
    return headerCurrencyId;
  }, [headerCurrencyId, currencyDDL]);

  const steps = [
    { title: "PAYMENT GUARANTEE", value: "Partner" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  useEffect(() => {
    dispatch(getAllAccountNumberDDL());
    dispatch(getUnifiedCreateReceiptDdl({}));
    dispatch(getPaymentWarrantyPartnerList());
    dispatch(getCurrencyDDL());
    dispatch(getRateTypeDDL());
    dispatch(getAllApprovalList());
    dispatch(getWarrantyTypeOptions());
    
    if (id && type === "update") {
      dispatch(getDetailWarranty({ id }));
    } else {
      dispatch(resetDataAccountNumber());
      form.resetFields();
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      setAppHierOptions(dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      })));
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      setAppHierDataDetail(dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, i) => ({ ...b, key: i + 1 })),
      })));
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    const currentAccountId = form.getFieldValue("accountId");
    if (dataAccountNumber && dataAccountNumber.data && currentAccountId) {
        form.setFieldsValue({
            accountName: dataAccountNumber.data.accountName,
            customerNumber: dataAccountNumber.data.customerNumber,
            customerName: dataAccountNumber.data.customerName,
            costCenter: dataAccountNumber.data.area,
            customerSegment: dataAccountNumber.data.segment,
            customerGroup: dataAccountNumber.data.accountType,
            accountType: dataAccountNumber.data.accountType,
            classificationType: dataAccountNumber.data.accountType,
        });
    }
  }, [dataAccountNumber, form]);

  useEffect(() => {
    if (id && type === "update" && data_detail) {
      form.setFieldsValue({
        accountId: data_detail.accountId,
        warrantyType: data_detail.warrantyType,
        documentNumber: data_detail.documentNumber,
        documentDate: data_detail.documentDate ? moment(data_detail.documentDate) : null,
        issuerBank: data_detail.issuerBankId,
        issuerBranch: data_detail.issuerBranchId,
        currency: data_detail.currency,
        rateType: data_detail.rateType,
        saNumber: data_detail.saNumber,
        rateDate: data_detail.rateDate ? moment(data_detail.rateDate) : null,
        rateAmount: data_detail?.rateAmount,
        effStartDate: data_detail.effectiveStartDate ? moment(data_detail.effectiveStartDate) : null,
        effEndDate: data_detail.effectiveEndDate ? moment(data_detail.effectiveEndDate) : null,
        claimPeriodTermType: data_detail.claimPeriodTermType,
        claimPeriodTermValue: data_detail.claimPeriodTermValue ? moment(data_detail.claimPeriodTermValue) : null,
        description: data_detail.description,
        // Set approval hierarchy form field so the dropdown auto-selects
        apphierId: data_detail.appHierId,
      });
      setSelectedHierarchy(data_detail.appHierId);
      setListDataAttachment((data_detail.attachmentDtoList || data_detail.attachments || []).map(a => ({ ...a, dataType: 'exist' })));
      // Load existing mutations from detail payload (if available)
      if (data_detail.mutations && data_detail.mutations.length > 0) {
        setMutationDataInfo(data_detail.mutations.map((m, i) => ({ ...m, key: i + 1 })));
      }
      
      if (data_detail.accountId) {
        dispatch(getAccountNumberDDL(data_detail.accountId));
        dispatch(getServiceAgreementByAccountId({ id: data_detail.accountId }));
      }
      if (data_detail.issuerBankId || data_detail.issuerBank) {
        dispatch(getPaymentWarrantyPartnerBranchList(data_detail.issuerBankId));
      }
    }
  // Only re-run when data_detail or id/type changes — remove DDL deps that cause re-runs
  }, [id, type, data_detail, dispatch, form]);

  // One-time fetch of mutation list from API when entering update mode
  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailWarrantyMutation({ id, page: 1, pageSize: 999 }));
    }
  }, [id, type, dispatch]);

  useEffect(() => {
    if (type === "update" && !mutationInitializedRef.current && dataMutation?.content) {
      mutationInitializedRef.current = true;
      if (dataMutation.content.length > 0) {
        setMutationDataInfo(dataMutation.content.map((m, i) => ({ ...m, key: i + 1 })));
      }
    }
  }, [dataMutation, type]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const isPartialEdit = useMemo(() => {
    if (type !== "update" || !data_detail) return false;
    return (
      data_detail.status === WARRANTY_STATUS.ACTIVE && 
      data_detail.approvalStatus === WARRANTY_APPROVAL_STATUS.APPROVED
    );
  }, [type, data_detail]);

  const isWaitingApproval = useMemo(() => {
    if (type !== "update" || !data_detail) return false;
    return data_detail.approvalStatus === WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL;
  }, [type, data_detail]);

  const handleAccountChange = (value) => {
    if (hasValue(value)) {
        dispatch(getAccountNumberDDL(value));
        dispatch(getServiceAgreementByAccountId({ id: value }));
        form.setFieldsValue({
            saNumber: null, saReference: null, saType: null, saTypeChild: null, pbgType: null,
            saDate: null, saStartDate: null, saEndDate: null, commitmentDate: null,
            saStatusApproval: null, saStatus: null, saDescription: null
        });
    } else {
        dispatch(getAllAccountNumberDDL());
        dispatch(resetDataAccountNumber());
        form.setFieldsValue({
            accountName: null, customerNumber: null, customerName: null,
            costCenter: null, customerSegment: null,
            customerGroup: null, accountType: null, classificationType: null,
            saNumber: null, saReference: null, saType: null, saTypeChild: null, pbgType: null,
            saDate: null, saStartDate: null, saEndDate: null, commitmentDate: null,
            saStatusApproval: null, saStatus: null, saDescription: null
        });
    }
  };

  const next = () => {
    if (current === 0) {
      form.validateFields([
        "accountId", "saNumber", "warrantyType", "documentNumber", "documentDate",
        "issuerBank", "issuerBranch", "currency", "rateType",
        "rateDate", "effStartDate", "effEndDate", "description",
        "claimPeriodTermType", "claimPeriodTermValue"
      ]).then(() => {
        setCurrent(current + 1);
      }).catch((e) => {
        message.warning("Mohon lengkapi semua field mandatory sebelum lanjut ke tahap berikutnya.");
      });
      return;
    }
    if (current === 1) {
      if (!selectedHierarchy) {
        dispatch(showModalError({ title: "Warning", description: "Approval Hierarchy is mandatory", return: false }));
        return;
      }
      setCurrent(current + 1);
      return;
    }
    if (current === 2) {
      if (listDataAttachment.length === 0) {
        dispatch(showModalError({ 
          title: "Warning", 
          description: "Attachment is mandatory. Please upload at least one attachment before proceeding." 
        }));
        return;
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const onBack = () => {
    if (Object.keys(form.getFieldsValue(true)).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const processSubmit = async (isDraft = false) => {
    if (isSubmitting) {
      message.warning('Submission is already in progress');
      return;
    }

    if (listDataAttachment.length === 0 && !data_detail?.isApprover && !isDraft) {
      dispatch(showModalError({ title: "Warning", description: "Attachment is mandatory.", return: false }));
      return;
    }
    
    // Pre-validate new attachments before initiating submission to avoid contradictory alerts
    const newAttachmentsForValidation = listDataAttachment.filter(a => a.dataType === 'new');
    for (const att of newAttachmentsForValidation) {
      if (att.file) {
        const validationErrors = validateFile(att.file);
        if (validationErrors.length > 0) {
          dispatch(showModalError({ 
            title: "Invalid Attachment", 
            description: `File "${att.fileName}" is invalid: ${validationErrors.join(', ')}`, 
            return: false 
          }));
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const values = isDraft ? form.getFieldsValue(true) : await form.validateFields();
      
      let parsedRateAmount = 0;
      if (values.rateAmount) parsedRateAmount = typeof values.rateAmount === 'string' ? parseFloat(values.rateAmount.replace(/,/g, "")) : values.rateAmount;

      // Separate payload for create and update
      const baseBody = {
          accountId: values.accountId || null,
          warrantyType: values.warrantyType || null,
          documentNumber: values.documentNumber || null,
          issuerBank: values.issuerBank || null,
          issuerBranch: values.issuerBranch || null,
          currency: values.currency ? (currencyDDL?.data?.find(c => c.id === values.currency)?.name || values.currency) : "IDR",
          rateType: values.rateType || null,
          rateAmount: parsedRateAmount,
          claimPeriodTermType: values.claimPeriodTermType || "DATE",
          claimPeriodTermDate: (values.claimPeriodTermValue || values.claimPeriodTermDate) ? moment(values.claimPeriodTermValue || values.claimPeriodTermDate).format("YYYY-MM-DD") : null,
          claimPeriodTermValue: null,
          description: DOMPurify.sanitize(values.description || null),
          isDraft: isDraft,
          appHierId: selectedHierarchy || null,
          saNumber: values.saNumber || null,
          mutations: (mutationDataInfo || []).map(m => ({
              ...(m.id ? { id: m.id } : {}),
              ...(m._delete ? { isDeleted: true } : {}),
              source: m.source,
              mutationNumber: m.mutationNumber || m.documentNumber,
              type: m.type,
              category: m.category,
              transactionDate: m.date ? moment(m.date).toISOString(true) : (m.transactionDate ? moment(m.transactionDate).toISOString(true) : null),
              amount: m.amount ? parseFloat(m.amount.toString().replace(/,/g, "")) : 0,
              convertedCurrency: m.convertedCurrencyName || m.convertedCurrency || "IDR",
              rate: m.rate ? parseFloat(m.rate.toString().replace(/,/g, "")) : 1,
              eqvAmount: (m.eqvAmount ?? m.equivalentAmount) ? parseFloat((m.eqvAmount ?? m.equivalentAmount).toString().replace(/,/g, "")) : 0,
              description: m.description
          })),
      };

      const submitBody = type === "update" ? {
          ...baseBody,
          documentDate: values.documentDate ? moment(values.documentDate).format("YYYY-MM-DD") : null,
          rateDate: values.rateDate ? moment(values.rateDate).format("YYYY-MM-DD") : null,
          effectiveStartDate: values.effStartDate ? moment(values.effStartDate).format("YYYY-MM-DD") : null,
          effectiveEndDate: values.effEndDate ? moment(values.effEndDate).format("YYYY-MM-DD") : null,
          submitForApproval: !isDraft,
          attachmentIds: listDataAttachment.filter(a => a.dataType === 'exist').map(a => a.id),
          partners: data_detail?.partners || [],
      } : {
          ...baseBody,
          documentDate: values.documentDate ? moment(values.documentDate).format("YYYY-MM-DD") : null,
          rateDate: values.rateDate ? moment(values.rateDate).format("YYYY-MM-DD") : null,
          effectiveStartDate: values.effStartDate ? moment(values.effStartDate).format("YYYY-MM-DD") : null,
          effectiveEndDate: values.effEndDate ? moment(values.effEndDate).format("YYYY-MM-DD") : null,
      };

      if (id) submitBody.id = id;
      setSendBody({ ...submitBody });
      
      if (isDraft) {
        // Bypass confirmation modal and submit straight to backend
        executeSave({ ...submitBody });
      } else {
        setModalConfirm(true);
      }
    } catch (error) {
        console.error('Submit warranty error:', error);
        
        dispatch(showModalError({
          title: "Submission Failed",
          description: "An error occurred while submitting warranty. Please try again."
        }));
        
        setModalConfirm(false);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    processSubmit(true);
  };

  const handleSubmit = async () => {
    processSubmit(false);
  };

  const executeSave = async (payloadToSave) => {
    setLoadingSave(true);
    try {
      const finalBody = { ...payloadToSave };
      if (payloadToSave.id) finalBody.id = payloadToSave.id;

      const action = type === "update" ? updatePaymentWarranty : createPaymentWarranty;
      const res = await dispatch(
        type === "update" 
          ? action({ id: finalBody.id, body: finalBody }) 
          : action({ body: finalBody })
      ).unwrap();
      
      const warrantyId = res?.id || res;
      const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
      if (newAttachments.length > 0 && warrantyId) {
          await uploadAttachments(newAttachments, warrantyId, "PAYMENT_WARRANTY",
              (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
          );
      }

      setModalConfirm(false);
      navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY);
    } catch (error) {
        console.log(error);
        setModalConfirm(false);
    } finally {
        setLoadingSave(false);
    }
  };

  const handleSave = async () => {
    executeSave(sendBody);
  };



  const handleMutationEdit = (record) => {
    setSelectedMutation(record);
    setMutationModalType("update");
    setIsModalMutationOpen(true);
  };

  const handleMutationDelete = (record) => {
    if (record.id) {
      // If mutation has an id (existing from backend), mark as deleted locally
      // On submit, the backend will receive isDeleted: true and delete it
      setMutationDataInfo(mutationDataInfo.map(m => m.key === record.key ? { ...m, _delete: true } : m));
    } else {
      // New mutation (no id), just remove from local state
      setMutationDataInfo(mutationDataInfo.filter(m => m.key !== record.key).map((m, i) => ({ ...m, key: i + 1 })));
    }
  };

  const routesBread = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY, breadcrumbName: "Payment Guarantee" },
    { path: "", breadcrumbName: type === "update" ? "Update Payment Guarantee" : "Create Payment Guarantee" }
  ];

  return (
    <>
      <BreadCrumb routes={routesBread} />
      <Spin spinning={loadingDetail || loadingApproval || loadingSave}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form 
          layout="vertical" 
          form={form} 
          id={"formRequest"} 
          onFinish={handleSubmit} 
          onFinishFailed={(errorInfo) => console.log('Validation Failed:', errorInfo)}
          preserve={true}
        >
          
          <div style={{ display: current !== 0 ? "none" : undefined }}>
            <WarrantyForm
                form={form}
                dataAccNumber={dataAccNumber}
                handleAccountChange={handleAccountChange}
                dataPaymentWarrantyPartner={dataPaymentWarrantyPartner}
                dataPaymentWarrantyPartnerBranch={dataPaymentWarrantyPartnerBranch}
                currencyDDL={currencyDDL}
                rateTypeDDL={rateTypeDDL}
                getPaymentWarrantyPartnerBranchList={getPaymentWarrantyPartnerBranchList}
                dataServiceAgreement={dataServiceAgreement}
                handleMutationEdit={handleMutationEdit}
                handleMutationDelete={handleMutationDelete}
                isCreate={type === "create" || type === "update"}
                warrantyType={warrantyType}
                headerCurrency={headerCurrency}
                mutationDataInfo={mutationDataInfo.filter(m => !m._delete)}
                columnMutation={columnMutation}
                setIsModalMutationOpen={setIsModalMutationOpen}
                dispatch={dispatch}
                isPartialEdit={isPartialEdit}
                isWaitingApproval={isWaitingApproval}
                isApprover={data_detail?.isApprover}
                loadingServiceAgreement={loadingServiceAgreement}
            />
          </div>

          <div style={{ display: current !== 1 ? "none" : undefined }} className="mt-8">
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          <div style={{ display: current !== 2 ? "none" : undefined }} className="mt-8">
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="warranty"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={onBack}
            onClear={() => { 
              form.resetFields(); 
              setCurrent(0);
              setSelectedHierarchy(null); 
              setListDataAttachment([]); 
              setMutationDataInfo([]); 
            }}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => form.submit()}
            type={type}
            isLoading={loadingSave || isSubmitting}
          />
        </Form>
      </Spin>

      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={() => setModalConfirm(false)}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-between gap-5 p-4">
            <ButtonComponent onClick={() => setModalConfirm(false)} type="default">Cancel</ButtonComponent>
            <ButtonComponent isPrimary onClick={handleSave} loading={loadingSave || isSubmitting}>Confirm</ButtonComponent>
          </div>
        }
      >
        <ContentModalConfirmWarranty
          data={sendBody}
          mutationDataInfo={mutationDataInfo}
          listDataAttachment={listDataAttachment}
          appHierDataDetail={appHierDataDetail}
          appHierOptions={appHierOptions}
          selectedHierarchy={selectedHierarchy}
          dataAccountNumber={dataAccountNumber}
          dataAccNumber={dataAccNumber}
          dataServiceAgreement={dataServiceAgreement}
          dataPaymentWarrantyPartner={dataPaymentWarrantyPartner}
          dataPaymentWarrantyPartnerBranch={dataPaymentWarrantyPartnerBranch}
          rateTypeDDL={rateTypeDDL}
          currencyDDL={currencyDDL}
        />
      </ModalCustom>

      <ModalMutationNoStepper
        isOpen={isModalMutationOpen}
        handleCancel={() => {
            setIsModalMutationOpen(false);
            setSelectedMutation(null);
            setMutationModalType("create");
        }}
        modalType={mutationModalType}
        selectedRecord={selectedMutation}
        currencyDDL={currencyDDL}
        mutationDataInfo={mutationDataInfo.filter(m => !m._delete)}
        warrantyType={warrantyType}
        headerCurrency={headerCurrency}
        fetchMutation={(newMutation) => {
            if (newMutation) {
                if (mutationModalType === "update") {
                    setMutationDataInfo(mutationDataInfo.map(m => m.key === selectedMutation.key ? { ...m, ...newMutation } : m));
                } else {
                    setMutationDataInfo([...mutationDataInfo, { ...newMutation, key: mutationDataInfo.length + 1 }]);
                }
            }
        }}
        isOffline={true}
      />

      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">Are you sure you want to back?</p>
        </div>
      </ModalConfirm>
    </>
  );
};

ListFormWarranty.propTypes = {
  type: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default ListFormWarranty;
