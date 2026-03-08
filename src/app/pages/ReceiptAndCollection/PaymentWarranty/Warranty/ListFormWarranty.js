import { WarningOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Spin, Row, Col, Select, DatePicker, Input } from "antd";
import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
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
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getPaymentWarrantyPartnerList,
  getPaymentWarrantyPartnerBranchList,
  getWarrantyTypeOptions,
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

import {
  getListServiceAgreement
} from "../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";

import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { showModalError, showModalSuccess } from "../../../../../redux/slices/general_slice";
import { uploadAttachments } from "../../../../../utils/uploadHelper";
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

  const { dataListAppHierId, dataListAppHierDetail, loadingDetail, loadingApproval, dataPaymentWarrantyPartner, dataPaymentWarrantyPartnerBranch, data_detail } = useSelector((state) => state.warranty);
  
  const {
    dataAccountNumber,
    dataAccNumber,
    currencyDDL,
    rateTypeDDL,
    data_converted_currency
  } = useSelector((state) => state.receipt);

  const { data: dataServiceAgreement } = useSelector((state) => state.accountServiceAgreement);

  const [current, setCurrent] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [sendBody, setSendBody] = useState(null);
  
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [mutationDataInfo, setMutationDataInfo] = useState([]);
  const [isModalMutationOpen, setIsModalMutationOpen] = useState(false);
  const [selectedMutation, setSelectedMutation] = useState(null);
  const [mutationModalType, setMutationModalType] = useState("create");
  const warrantyType = Form.useWatch("warrantyType", form);
  const headerCurrencyId = Form.useWatch("currency", form);
  const headerCurrency = currencyDDL?.data?.find(c => c.id === headerCurrencyId)?.name;

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
        issuerBank: data_detail.issuerBank,
        issuerBranch: data_detail.issuerBranch,
        currency: currencyDDL?.data?.find(c => c.name === data_detail.currency)?.id,
        rateType: rateTypeDDL?.data?.find(r => r.name === data_detail.rateType)?.name,
        rateDate: data_detail.rateDate ? moment(data_detail.rateDate) : null,
        rateAmount: data_detail?.rateAmount,
        effStartDate: data_detail.effectiveStartDate ? moment(data_detail.effectiveStartDate) : null,
        effEndDate: data_detail.effectiveEndDate ? moment(data_detail.effectiveEndDate) : null,
        claimPeriodTermType: data_detail.claimPeriodTermType,
        claimPeriodTermValue: data_detail.claimPeriodTermValue,
        description: data_detail.description,
      });
      setSelectedHierarchy(data_detail.appHierId);
      setListDataAttachment(data_detail.attachments?.map(a => ({ ...a, dataType: 'exist' })) || []);
      setMutationDataInfo(data_detail.mutations || []);
      
      if (data_detail.accountId) {
        dispatch(getAccountNumberDDL(data_detail.accountId));
        dispatch(getListServiceAgreement({ id: data_detail.accountId, page: 1, pageSize: 999 }));
      }
      if (data_detail.issuerBankId) {
        dispatch(getPaymentWarrantyPartnerBranchList(data_detail.issuerBankId));
      }
    }
  }, [id, type, data_detail, currencyDDL, rateTypeDDL, dispatch, form]);

  const isPartialEdit = useMemo(() => {
    if (type !== "update" || !data_detail) return false;
    return (
      data_detail.status === WARRANTY_STATUS.ACTIVE && 
      data_detail.approvalStatus === WARRANTY_APPROVAL_STATUS.APPROVED
    );
  }, [type, data_detail]);

  const handleAccountChange = (value) => {
    if (hasValue(value)) {
        dispatch(getAccountNumberDDL(value));
        dispatch(getListServiceAgreement({ id: value, page: 1, pageSize: 999 }));
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
        "accountId", "warrantyType", "documentNumber", "documentDate",
        "issuerBank", "currency", "convertedCurrency", "rateType",
        "rateDate", "effStartDate", "effEndDate", "description"
      ]).then(() => {
        setCurrent(current + 1);
      }).catch((e) => {
        // Validation handled by form UI
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
    setCurrent(current + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleBack = () => {
    if (Object.keys(form.getFieldsValue(true)).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const processSubmit = async (isDraft = false) => {
    if (listDataAttachment.length === 0 && !data_detail?.isApprover && !isDraft) {
      dispatch(showModalError({ title: "Warning", description: "Attachment is mandatory.", return: false }));
      return;
    }
    
    try {
      const values = isDraft ? form.getFieldsValue(true) : await form.validateFields();
      
      let parsedRateAmount = 0;
      if (values.rateAmount) parsedRateAmount = typeof values.rateAmount === 'string' ? parseFloat(values.rateAmount.replace(/,/g, "")) : values.rateAmount;

      const submitBody = {
          accountId: values.accountId || null,
          warrantyType: values.warrantyType || null,
          documentNumber: values.documentNumber || null,
          documentDate: values.documentDate ? moment(values.documentDate).toISOString(true) : null,
          issuerBank: values.issuerBank || null,
          issuerBranch: values.issuerBranch || null,
          currency: values.currency ? (currencyDDL?.data?.find(c => c.id === values.currency)?.name || "IDR") : "IDR",
          rateType: values.rateType ? (rateTypeDDL?.data?.find(r => r.id === values.rateType)?.name || "Mid Rate") : "Mid Rate",
          rateDate: values.rateDate ? moment(values.rateDate).toISOString(true) : null,
          rateAmount: parsedRateAmount,
          effectiveStartDate: values.effStartDate ? moment(values.effStartDate).toISOString(true) : null,
          effectiveEndDate: values.effEndDate ? moment(values.effEndDate).toISOString(true) : null,
          claimPeriodTermType: values.claimPeriodTermType ? values.claimPeriodTermType.toUpperCase() : "DATE",
          claimPeriodTermValue: values.claimPeriodTermValue ? parseInt(values.claimPeriodTermValue, 10) : null,
          description: values.description || null,
          isDraft: isDraft,
          appHierId: selectedHierarchy || null,
          saNumber: values.saNumber || null,
          mutations: (mutationDataInfo || []).map(m => ({
              source: m.source,
              mutationNumber: m.mutationNumber,
              type: m.type,
              category: m.category,
              transactionDate: m.date ? moment(m.date).toISOString(true) : null,
              amount: m.amount ? parseFloat(m.amount.toString().replace(/,/g, "")) : 0,
              convertedCurrency: currencyDDL?.data?.find(c => c.id === m.convertedCurrency)?.name || "IDR",
              rate: m.rate ? parseFloat(m.rate.toString().replace(/,/g, "")) : 1,
              eqvAmount: m.eqvAmount ? parseFloat(m.eqvAmount.toString().replace(/,/g, "")) : 0,
              description: m.description
          })),
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
        console.log(error);
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
      const finalBody = {
          accountId: payloadToSave.accountId,
          saNumber: payloadToSave.saNumber,
          warrantyType: payloadToSave.warrantyType,
          documentNumber: payloadToSave.documentNumber,
          documentDate: payloadToSave.documentDate,
          issuerBank: payloadToSave.issuerBank,
          issuerBranch: payloadToSave.issuerBranch,
          currency: payloadToSave.currency,
          rateType: payloadToSave.rateType,
          rateDate: payloadToSave.rateDate,
          rateAmount: payloadToSave.rateAmount,
          effectiveStartDate: payloadToSave.effectiveStartDate,
          effectiveEndDate: payloadToSave.effectiveEndDate,
          claimPeriodTermType: payloadToSave.claimPeriodTermType,
          claimPeriodTermValue: payloadToSave.claimPeriodTermValue,
          description: payloadToSave.description,
          isDraft: payloadToSave.isDraft,
          appHierId: payloadToSave.appHierId,
          mutations: payloadToSave.mutations
      };

      if (payloadToSave.id) finalBody.id = payloadToSave.id;

      const action = type === "update" ? updatePaymentWarranty : createPaymentWarranty;
      const res = await dispatch(action({ body: finalBody })).unwrap();
      
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
    setMutationDataInfo(mutationDataInfo.filter(m => m.key !== record.key).map((m, i) => ({ ...m, key: i + 1 })));
  };

  const routesBread = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY, breadcrumbName: "Payment Guarantee" },
    { path: "", breadcrumbName: type === "update" ? "Update Payment Guarantee" : "Create Payment Guarantee" }
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routesBread} />
      <Spin spinning={loadingDetail || loadingApproval || loadingSave}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form layout="vertical" form={form} id={"formRequest"} onFinish={handleSubmit} preserve={true}>
          
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
                mutationDataInfo={mutationDataInfo}
                columnMutation={columnMutation}
                setIsModalMutationOpen={setIsModalMutationOpen}
                dispatch={dispatch}
                isPartialEdit={isPartialEdit}
                isApprover={data_detail?.isApprover}
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
            onCancel={handleBack}
            onClear={() => { form.resetFields(); setSelectedHierarchy(null); setListDataAttachment([]); setMutationDataInfo([]); }}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => form.submit()}
            type={type}
            isLoading={loadingSave}
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
            <ButtonComponent isPrimary onClick={handleSave} loading={loadingSave}>Confirm</ButtonComponent>
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
        mutationDataInfo={mutationDataInfo}
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
    </LayoutMenu>
  );
};

export default ListFormWarranty;
