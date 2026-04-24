import React, { useState, useEffect } from "react";
import { Form, Spin, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import {
  getAllBankNotBranch,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  createMasterBank,
  createValidasiBank,
  getJobContact,
  getPositionContact,
  getInputTypeContact,
  getInputType,
  getContryContact,
  getAllContactPaginate,
  getBankDetail,
  getContactAddress,
  getAllGLType,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { intToNPWP } from "../../../../../utils/npwp";

import BankCreate from "./BankCreate";
import ContactSection from "./ContactSection";
import ContentModalConfirmBank from "./ContentModalConfirmBank";

const BankForm = ({ type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const location = useLocation();
  const idBank = location?.state?.id;

  const {
    dataBankNotBranch,
    loading,
    dataListAppHierId,
    dataListAppHierDetail,
    data_job,
    data_position,
    data_contactType,
    data_inputType,
    data_countryCode,
    data_countryZone,
    data_contact,
    data_detail,
    data_contactAddress,
    dataGLType,
  } = useSelector((state) => state.bank);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [jobOptions, setJobOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [contactTypeOptions, setContactTypeOptions] = useState([]);
  const [inputTypeOptions, setInputTypeOptions] = useState([]);
  const [prefixOptions, setPrefixOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  
  // --- 3. BIKIN STATE UNTUK OPSI ADDRESS ---
  const [addressOptions, setAddressOptions] = useState([]);
  // -----------------------------------------
  const [glTypeOptions, setGlTypeOptions] = useState([]);

  const [contactData, setContactData] = useState([]);

  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [flag, setFlag] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [kirimBody, setKirimBody] = useState({});
  const [codeBank, setCodeBank] = useState("");

  const [contactPage, setContactPage] = useState(1); 
  const [contactPageSize, setContactPageSize] = useState(10);

  const steps = [
    { title: 'BANK' },
    { title: 'APPROVAL' },
    { title: 'ATTACHMENT' }
  ];

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK, breadcrumbName: "Bank" },
    { path: type === "create" ? RECEIPT_AND_COLLECTION_ROUTES.CREATE_MASTER_BANK : RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK, breadcrumbName: type === "create" ? "Create" : "Update" },
  ];

  useEffect(() => {
    dispatch(getAllBankNotBranch());
    dispatch(getAllApprovalList());
    dispatch(getJobContact());
    dispatch(getPositionContact());
    dispatch(getInputTypeContact());
    dispatch(getInputType());
    dispatch(getContryContact());
    
    // --- 4. TEMBAK API ADDRESS ---
    dispatch(getContactAddress());
    dispatch(getAllGLType());
    // -----------------------------
    
    if (type === "update" && idBank) {
      dispatch(getBankDetail(idBank));
    }
  }, [dispatch, type, idBank]);

  useEffect(() => {
    if (type === "update" && data_detail?.bank && data_detail.bank.id === idBank) {
      const bank = data_detail.bank;

      form.setFieldsValue({
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        bankShortName: bank.bankShortName,
        branchName: bank.branchName,
        officeType: bank.isBranch ? "Branch" : "Head Office",
        npwp: intToNPWP(bank.npwp) || bank.npwp, 
        phoneNumber: bank.phoneNumber,
        email: bank.email,
        address: bank.address,
        apphierId: bank.appHierId,
      });
      setCodeBank(bank.bankCode);

      setSelectedHierarchy(bank.appHierId);

      if (bank.bankContacts?.length > 0) {
        const mappedContacts = bank.bankContacts.map((c, idx) => ({
          key: c.id || Date.now() + idx,
          id: c.id,
          contactId: c.contactId,
          primary: c.isPrimary === "Y",
          firstName: c.firstName,
          middleName: c.middleName,
          lastName: c.lastName,
          name: c.contactName,
          job: c.jobId,
          position: c.positionId,
          address: c.address,
          note: c.additionalNote,
          desc: c.description,
          criteriaList: (c.contactDetails || []).map((det, dIdx) => ({
            key: det.contactDetailsId || Date.now() + dIdx,
            contactDetailId: det.contactDetailsId,
            type: det.type,
            inputType: det.inputType,
            valuePrefix: det.prefix1,
            prefix2: det.prefix2,
            valueText: det.value,
          }))
        }));
        setContactData(mappedContacts);
      }

      if (data_detail.attachmentDtoList?.length > 0) {
        const mappedAtt = data_detail.attachmentDtoList.map((att, index) => ({
          key: index + 1,
          id: att.id,
          uid: att.id,
          name: att.fileName,
          fileName: att.fileName,
          fileSize: att.fileSize,
          fileType: att.fileType,
          fileCategoryId: att.fileCategoryId,
          fileCategoryName: att.fileCategoryName,
          pathFile: att.pathFile,
          urlFile1: att.urlFile1,
          urlFile2: att.urlFile2,
          status: "done",
          dataType: "exist",
          file: null 
        }));
        setListDataAttachment(mappedAtt);
      }
    }
  }, [data_detail, type, idBank, form]);

  useEffect(() => {
    dispatch(getAllContactPaginate({ 
      page: contactPage - 1, 
      pageSize: contactPageSize, 
      search: "", 
      sort: "" 
    }));
  }, [dispatch, contactPage, contactPageSize]);

  // --- 5. MAPPING DATA ADDRESS DARI REDUX KE FORMAT DROPDOWN ---
  useEffect(() => {
    if (data_contactAddress?.length > 0) {
      setAddressOptions(data_contactAddress.map(item => ({
        label: item.description ? `${item.description} - ${item.fullAddress}` : item.fullAddress,
        value: item.id
      })));
    }
  }, [data_contactAddress]);
  // -------------------------------------------------------------

  useEffect(() => {
    if (dataGLType?.length > 0) {
      setGlTypeOptions(dataGLType.map(item => ({ label: item.name, value: item.id })));
    }
  }, [dataGLType]);

  useEffect(() => {
    if (data_job?.length > 0) setJobOptions(data_job.map(item => ({ label: item.name, value: item.id })));
  }, [data_job]);

  useEffect(() => {
    if (data_position?.length > 0) setPositionOptions(data_position.map(item => ({ label: item.name, value: item.id })));
  }, [data_position]);

  useEffect(() => {
    if (data_contactType?.length > 0) setContactTypeOptions(data_contactType.map(item => ({ label: item.name, value: item.id })));
  }, [data_contactType]);

  useEffect(() => {
    const inputTypeList = data_inputType?.data || data_inputType;
    if (Array.isArray(inputTypeList) && inputTypeList.length > 0) {
      setInputTypeOptions(inputTypeList.map(item => ({ label: item.name, value: item.id })));
    }
  }, [data_inputType]);

  useEffect(() => {
    if (data_countryCode?.length > 0) setPrefixOptions(data_countryCode.map(item => ({ label: item.name, value: item.id })));
  }, [data_countryCode]);

  useEffect(() => {
    if (data_countryZone?.length > 0) {
      setZoneOptions(data_countryZone.map(item => ({ label: `${item.code} (${item.name})`, value: item.id })));
    }
  }, [data_countryZone]);

  useEffect(() => {
    if (dataListAppHierId?.length > 0) {
      setAppHierOptions(dataListAppHierId.map((appHier) => ({ name: appHier.approvalName, value: appHier.appHierId })));
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      setAppHierDataDetail(dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, bIndex) => ({ ...b, key: bIndex + 1 })),
      })));
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      try {
        await form.validateFields([
          'bankCode', 'bankName', 'bankShortName', 'branchName',
          'npwp', 'phoneNumber', 'email', 'officeType', 'address'
        ]);

        if (contactData.length === 0) {
          message.error("Contact Information tidak boleh kosong!");
          return;
        }

        setCurrentStepIndex(currentStepIndex + 1);
      } catch (error) {
        message.error("Mohon lengkapi data mandatori di Step 1");
      }
    }
    else if (currentStepIndex === 1) {
      if (!selectedHierarchy) {
        message.error("Approval Information wajib diisi sebelum lanjut!");
        return;
      }
      setCurrentStepIndex(currentStepIndex + 1);
    }
    else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleBack = () => {
    const currentValues = form.getFieldsValue();
    if (!currentValues || Object.keys(currentValues).length === 0) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setCurrentStepIndex(0);
    setCodeBank("");
    setSelectedHierarchy(null);
    setContactData([]);
    setListDataAttachment([]);
  };

  const handleSubmit = () => {
    setFlag(true);
    handleSaveSubmit(true);
  };

  const handleSaveDraft = () => {
    setFlag(false);
    handleSaveSubmit(false);
  };

  const handleSaveSubmit = async (isSubmit = true) => {
    try {
      if (listDataAttachment.length === 0) {
        message.error("Attachment wajib diupload minimal 1 dokumen!");
        return;
      }

      const formValue = await form.validateFields();

      const formattedContacts = contactData.map((contact) => ({
        id: contact.id || null, 
        contactId: contact.contactId || null,
        isPrimary: contact.primary ? "Y" : "N",
        description: contact.desc || "",
        firstName: contact.firstName,
        middleName: contact.middleName || null,
        lastName: contact.lastName || null,
        contactName: contact.name,
        jobId: contact.job,
        positionId: contact.position,
        address: contact.address, 
        additionalNote: contact.note,
        viewDetails: contact.criteriaList.map((criteria) => ({
          contactDetailId: criteria.contactDetailId || null, 
          contactId: contact.contactId || null,
          type: criteria.type,
          inputType: criteria.inputType,
          prefix1: criteria.valuePrefix || null,
          prefix2: null,
          value: criteria.valueText,
          sufix: null
        }))
      }));

      const officeTypeVal = formValue.officeType?.toLowerCase();
      const isBranch = officeTypeVal === "branch" || officeTypeVal === "cabang";

      const formattedGLAccounts = [];

      const dataValue = {
        id: type === "update" ? idBank : null, 
        bankCode: formValue.bankCode,
        bankName: formValue.bankName,
        npwp: formValue.npwp?.replace(/[^a-zA-Z0-9]/g, ""),
        phoneNumber: formValue.phoneNumber,
        email: formValue.email,
        address: formValue.address,
        appHierId: selectedHierarchy,
        isBranch,
        branchName: formValue.branchName || null,
        bankShortName: formValue.bankShortName,
        bankContacts: formattedContacts,
        glAccounts: formattedGLAccounts,
        isSubmit,
      };

      setKirimBody(dataValue);

      dispatch(createValidasiBank(dataValue))
        .unwrap()
        .then((data) => {
          if (data?.success !== false) {
            setModalConfirm(true);
          }
        })
        .catch((error) => {
          const errorMsg = error?.message || "Validasi gagal dari server";
          message.error(errorMsg);
        });

    } catch (errorInfo) {
      message.error("Validasi error, cek kembali data form Anda.");
    }
  };

  const handleProcessModalConfirm = () => {
    setLoadingForm(true);

    const finalPayload = JSON.parse(JSON.stringify(kirimBody));

    if (finalPayload.bankContacts?.length > 0) {
      finalPayload.bankContacts.forEach(contact => {
        // delete contact.address; // <-- Ini aku komen ya, kalau address mau disave ke backend, jangan di-delete dari payload!
        delete contact.additionalNote;
      });
    }

    dispatch(createMasterBank(finalPayload))
      .unwrap()
      .then(async (data) => {
        let bankId = data.id;

        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          
          if (element.dataType !== "exist") { 
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: bankId,
              category: "BANK",
            };
            await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
        }

        setLoadingForm(false);
        setModalConfirm(false);
        handleClear();
        dispatch(showModalSuccess({
          title: "Successful",
          description: `Your data has been ${kirimBody.isSubmit ? "submitted" : "saved as draft"}.`,
          return: false,
        }));
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK);
      })
      .catch((error) => {
        setLoadingForm(false);
        const errorMsg = error.response?.data?.message || error.message || error.toString();
        dispatch(showModalError({ title: "Failed", description: `Your data was not created. ${errorMsg}` }));
      });
  };

  return (
    <>
      <BreadCrumb routes={routes} />

      <div className="w-full mt-4">
        <div className="mb-5">
          <FormStepper
            steps={steps}
            current={currentStepIndex}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        <Spin spinning={loading || loadingForm}>
          <Form layout="vertical" form={form} preserve={true}>
            
            <div className={currentStepIndex !== 0 ? "hidden" : ""}>
              <BankCreate
                form={form}
                setCodeBank={setCodeBank}
                dataBank={dataBankNotBranch}
              />
              <ContactSection
                mainData={contactData}
                setMainData={setContactData}
                jobOptions={jobOptions}
                positionOptions={positionOptions}
                typeOptions={contactTypeOptions}
                inputTypeOptions={inputTypeOptions}
                prefixOptions={prefixOptions}
                zoneOptions={zoneOptions}
                allContactData={data_contact?.data?.result || []}
                loadingContact={loading}
                totalContactData={data_contact?.data?.page?.totalElements || 0}
                contactPage={contactPage}
                contactPageSize={contactPageSize}
                onChangeContactPage={(page, pageSize) => {
                  setContactPage(page);
                  setContactPageSize(pageSize);
                }}
                
                // --- 6. LEMPAR PROPS ADDRESS OPTIONS KE ANAK ---
                addressOptions={addressOptions}
                // -----------------------------------------------
              />
            </div>

            <div className={currentStepIndex !== 1 ? "hidden" : ""}>
              <CardContainer header={<p className="text-primary font-bold">APPROVAL INFORMATION</p>}>
                <ApprovalComponentGeneral
                  dataTable={appHierDataDetail}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                  updateSelectedHierarchy={setSelectedHierarchy}
                />
              </CardContainer>
            </div>

            <div className={currentStepIndex !== 2 ? "hidden" : ""}>
              <CardContainer header={<p className="text-primary font-bold">ATTACHMENT INFORMATION</p>}>
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  getAPICategory={getListCategory}
                  typeSelector="bank"
                  service={receiptCollectionHttpService}
                  configApplication={configApp.MASTER_MANAGEMENT}
                  typeRBI="data"
                  mandatory={true}
                />
              </CardContainer>
            </div>

            <FormFooter
              current={currentStepIndex}
              totalSteps={steps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onCancel={handleBack}
              onClear={handleClear}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              type={type}
            />
          </Form>
        </Spin>

        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          header="Confirmation"
          width={1000}
          type="confirmation"
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent onClick={() => setModalConfirm(false)} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent type="submit" onClick={handleProcessModalConfirm} loading={loadingForm}>
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ContentModalConfirmBank
            data={kirimBody}
            glAccounts={kirimBody?.glAccounts || []}
            bankContacts={kirimBody?.bankContacts || []}
            listDataAttachment={listDataAttachment}
            dataBank={dataBankNotBranch}
            listDataAppHierDetail={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            glTypeOptions={glTypeOptions}
            jobOptions={jobOptions}
            positionOptions={positionOptions}
            addressOptions={addressOptions}
          />
        </ModalCustom>

        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>
      </div>
    </>
  );
};

export default BankForm;