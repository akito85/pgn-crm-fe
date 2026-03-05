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
  getDetailWarranty,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getPaymentWarrantyPartnerList,
  getPaymentWarrantyPartnerBranchList,
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
import { uploadAttachments } from "../../../../../utils/uploadHelper";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import { dateFormatting, hasValue } from "../../../../../utils";

import ModalMutation from "./Modal/ModalMutation";
import WarrantyForm from "./Form/WarrantyForm";
import { columnMutation } from "./ColumnConfig/MutationColumns";

const ListFormWarranty = (props) => {
  const { type } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = location?.state || {};

  const { dataListAppHierId, dataListAppHierDetail, loading, dataPaymentWarrantyPartner, dataPaymentWarrantyPartnerBranch, data_detail } = useSelector((state) => state.warranty);
  
  const {
      dataAccountNumber,
      dataAccNumber,
      currencyDDL,
      rateTypeDDL,
      data_converted_currency
  } = useSelector((state) => state.receipt);

  const [current, setCurrent] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [mutationDataInfo, setMutationDataInfo] = useState([]);
  const [isModalMutationOpen, setIsModalMutationOpen] = useState(false);

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
    
    if (id && type === "update") {
      dispatch(getDetailWarranty(id));
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
    if (dataAccountNumber && dataAccountNumber.data) {
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

  const handleAccountChange = (value) => {
    if (hasValue(value)) {
        dispatch(getAccountNumberDDL(value));
    } else {
        dispatch(getAllAccountNumberDDL());
        dispatch(resetDataAccountNumber());
        form.resetFields([
            "accountName", "customerNumber", "customerName",
            "costCenter", "customerSegment",
            "customerGroup", "accountType", "classificationType"
        ]);
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

  const handleSaveDraft = async () => {
    console.log("Save Draft action triggered");
  };

  const handleSubmit = async () => {
    if (listDataAttachment.length === 0 && !data_detail?.isApprover) {
      dispatch(showModalError({ title: "Warning", description: "Attachment is mandatory.", return: false }));
      return;
    }
    
    setLoadingSave(true);
    try {
      const values = await form.validateFields();
      
      let parsedRateAmount = 0;
      if (values.rateAmount) parsedRateAmount = parseFloat(values.rateAmount.toString().replace(/,/g, ""));

      const submitBody = {
          accountId: values.accountId,
          appHierId: selectedHierarchy,
          warrantyType: values.warrantyType,
          documentNumber: values.documentNumber,
          documentDate: values.documentDate ? moment(values.documentDate).format("YYYY-MM-DD") : null,
          currency: currencyDDL?.data?.find(c => c.id === values.currency)?.name || "IDR",
          rateType: rateTypeDDL?.data?.find(r => r.id === values.rateType)?.name || "FLOATING",
          rateDate: values.rateDate ? moment(values.rateDate).format("YYYY-MM-DD") : null,
          effectiveStartDate: values.effStartDate ? moment(values.effStartDate).format("YYYY-MM-DD") : null,
          effectiveEndDate: values.effEndDate ? moment(values.effEndDate).format("YYYY-MM-DD") : null,
          claimPeriodTermType: (values.claimPeriodTermType || "Date").toUpperCase(),
          claimPeriodTermValue: values.claimPeriodTermValue ? parseInt(values.claimPeriodTermValue, 10) : null,
          description: values.description,
          isDraft: false,
          partners: [{ partnerId: values.issuerBank, amount: parsedRateAmount }],
          attachmentIds: listDataAttachment.filter(a => a.dataType === 'exist').map(a => a.id),
          mutations: mutationDataInfo, // Attach locally managed mutation list
      };

      if (id) submitBody.id = id;

      const act = createPaymentWarranty({ body: submitBody });
      const res = await dispatch(act).unwrap();
      
      const warrantyId = res?.id || res;
      const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
      if (newAttachments.length > 0 && warrantyId) {
          await uploadAttachments(newAttachments, warrantyId, "PAYMENT_WARRANTY",
              (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
          );
      }

      dispatch(showModalSuccess({ title: "Successfull", description: "Data has been submitted", return: false }));
      navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY);
    } catch (error) {
        console.log(error);
    } finally {
        setLoadingSave(false);
    }
  };

  const routesBread = [
    { path: "", breadcrumbName: "Payment & Collection" },
    { path: "", breadcrumbName: "Payment Guarantee" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY, breadcrumbName: "Create Payment Guarantee" }
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routesBread} />
      <Spin spinning={loading || loadingSave}>
        <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
        
        <Form layout="vertical" form={form} id={"formRequest"} onFinish={handleSubmit}>
          
          <div style={{ display: current !== 0 ? "none" : undefined }}>
            <WarrantyForm
                form={form}
                dataAccNumber={dataAccNumber}
                handleAccountChange={handleAccountChange}
                dataPaymentWarrantyPartner={dataPaymentWarrantyPartner}
                dataPaymentWarrantyPartnerBranch={dataPaymentWarrantyPartnerBranch}
                currencyDDL={currencyDDL}
                rateTypeDDL={rateTypeDDL}
                mutationDataInfo={mutationDataInfo}
                columnMutation={columnMutation}
                setIsModalMutationOpen={setIsModalMutationOpen}
                dispatch={dispatch}
                getPaymentWarrantyPartnerBranchList={getPaymentWarrantyPartnerBranchList}
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
                typeSelector="paymentWarrantyPartner"
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
            onSubmit={handleSubmit}
            type={type}
            isLoading={loadingSave}
          />
        </Form>
      </Spin>

      <ModalMutation
        isOpen={isModalMutationOpen}
        handleCancel={() => setIsModalMutationOpen(false)}
        modalType="create"
        fetchMutation={(newMutation) => {
            if(newMutation) setMutationDataInfo([...mutationDataInfo, {...newMutation, key: mutationDataInfo.length + 1}]);
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
