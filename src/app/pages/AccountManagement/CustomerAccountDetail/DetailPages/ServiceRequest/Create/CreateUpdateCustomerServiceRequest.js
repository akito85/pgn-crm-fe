import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Form, Spin } from "antd";
import { WarningOutlined } from "@ant-design/icons";

import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxApprovalInput from "../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../components/Nx/NxAttachmentInput";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import HeaderDetail from "../../../HeaderDetail";
import { configApp } from "../../../../../../../constants/configApp";

import {
  ModalConfirm,
  ModalError,
} from "../../../../../../../components/Modal/ModalPopUp";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerAttachment,
  getCustomerDetail,
  getGlobalCustomerType,
  getGlobalIdentificationType,
  getGlobalMartialStatus,
  getGlobalSex,
  getListCategoryFile,
  updateCustomer
} from "../../../../../../../redux/slices/account_management/Customer/customerAccount";

import { getDetailContact } from "../../../../../../../redux/slices/account_management/MasterData/contact_slice";

import {
  getListDetailAccountContact,
  getDetailAccountContact
} from "../../../../../../../redux/slices/account_management/detailAccount/accountContactSlice";

import {
  getListDetailAccountAddress,
  getListChooseAddress
} from "../../../../../../../redux/slices/account_management/detailAccount/accountAddressSlice";

import {
  getAccountStandardDetail,
  getAccountOneTimeDetail
} from "../../../../../../../redux/slices/account_management/accountManagement";

import {
  getSrById,
  getServiceRequest,
  getServiceRequestDraft,
  getSrApprovalHierarchies,
  getSrApprovalHierarchy,
  getSrTypes,
  getSrCategories,
  getSrSubcategories,
  getSrChannels,
  getSrPriorities,
  getSrSources,
  getSrDataRequirementTypes,
  getSrPrerequisiteTypes,
  getSrAttachmentCategories,
  createServiceRequest,
  updateServiceRequest,
  resetCreateSr,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import moment from "moment";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";

const CreateUpdateCustomerServiceRequest = ({ formType = "create" }) => {
  const location = useLocation();

  // Restore step from location state if returning from prerequisite create
  const [current, setCurrent] = useState(location?.state?.returnToStep || 0);
  const isUpdate = formType === "update";

  const dispatch = useDispatch();

  const {
    data_customerDetailAttachment,
    data_customerDetail,
    data_globalCustomerType,
    data_globalIdentificationType,
    data_globalSex,
    data_globalMartialStatus,
    loading
  } = useSelector((state) => state.customerAccount);

  const { data_accountDetail, loading: loadingAccount } = useSelector(
    (state) => state.accountManagement
  );

  const {
    list_srTypes,
    list_srCategories,
    list_srSubcategories,
    list_srPriorities,
    list_srChannels,
    list_srSources,
    list_srApprovalHierarchy,
    detail_srApprovalHierarchy,
    list_srPrerequisiteTypes,
    list_srDataRequirementTypes,
    list_srAttachmentCategories,
    detail_serviceRequest: serviceRequestDetail,
    detailDraft_serviceRequest: serviceRequestDetailDraft,
    loading_createUpdateSr,
    loading_detailSr,
    loading_detailDraftSr,
    loading_listSrApprovalHierarchy,
    loading_detailSrApprovalHierarchy,
    create_sr,
  } = useSelector((state) => state.serviceRequest);

  // Map state keys to the dropdowns structure expected by child components
  const dropdowns = {
    serviceRequestTypes: list_srTypes,
    serviceRequestCategories: list_srCategories,
    serviceRequestSubcategories: list_srSubcategories,
    serviceRequestPriorities: list_srPriorities,
    serviceRequestChannels: list_srChannels,
    serviceRequestSources: list_srSources,
    serviceRequestPrerequisites: list_srPrerequisiteTypes,
    serviceRequestDataRequirements: list_srDataRequirementTypes
  };

  const { data_detail } = useSelector((state) => state.accountContact); // Add this selector

  const {
    data: data_account_address,
    data_country,
    data_province,
    data_city,
    data_district,
    data_subdistrict,
    data_postalcode,
    data_type,
    data_business_purpose
  } = useSelector((state) => state.accountAddress);

  const { idAccount, idCustomer, accountType, id } = useMemo(() => {
    // Prioritas 1: Ambil dari location.state (navigasi normal)
    if (location.state) {
      return {
        idAccount: location.state.idAccount,
        idCustomer: location.state.idCustomer,
        accountType: location.state.type,
        id: location.state.id || null
      };
    }
    // Prioritas 2: Fallback ke sessionStorage (setelah reload)
    const persistedData = sessionStorage.getItem("serviceRequestCreation");
    if (persistedData) {
      const parsedData = JSON.parse(persistedData);
      return {
        idAccount: parsedData.idAccount,
        idCustomer: parsedData.idCustomer,
        accountType: parsedData.type,
        id: parsedData.id || null
      };
    }
    // Default jika tidak ada data sama sekali
    return { idAccount: null, idCustomer: null, accountType: null, id: null };
  }, [location.state]);

  //declare
  const [formCreate] = Form.useForm();
  // const id = location?.state?.id;
  // const idAccount = location?.state?.idAccount;
  // const idCustomer = location?.state?.idCustomer;
  // const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);
  const [data, setData] = useState({});
  const [dataSend, setDataSend] = useState({});
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [confirmationType, setConfirmationType] = useState("submit");
  const [dataConfirm, setDataConfirm] = useState({});
  const [btnConfirm, setBtnConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [customerType, setCustomerType] = useState(0);
  const [identificationDdlValue, setIdentificationDdlValue] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  // Service Request step state objects (following StandardForm pattern)
  const [srObj, setSrObj] = useState({}); // Service Request information
  const [contactsData, setContactsData] = useState([]); // Contacts table
  const [prerequisitesData, setPrerequisitesData] = useState([]); // Prerequisites table
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const isLoading =
    loading ||
    loadingAccount ||
    loading_detailSr ||
    loading_detailDraftSr ||
    loading_listSrApprovalHierarchy ||
    loading_detailSrApprovalHierarchy;

  const { InformationForm, ContactForm, PreRequisiteForm } = StepContents;

  const routes = [
    {
      path: "",
      breadcrumbName: "Account"
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard"
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account"
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
      breadcrumbName: "Service Requests"
    },
    {
      path: "",
      breadcrumbName: isUpdate ? "Update Service Request" : "Create Service Request"
    }
  ];
  // Fetch Account Standard/OneTime Detail
  useEffect(() => {
    if (idAccount && idCustomer && accountType) {
      if (accountType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, accountType]);

  useEffect(() => {
    if (idCustomer) {
      dispatch(getCustomerDetail(idCustomer));
      // dispatch(getDetailContact(idCustomer));
    }
  }, [dispatch, idCustomer]);

  useEffect(() => {
    dispatch(
      getListDetailAccountContact({
        id: idAccount,
        page: 1,
        pageSize: 111,
        sort: "createdDate~desc"
      })
    );

    dispatch(getDetailAccountContact(idCustomer));
    dispatch(
      getListDetailAccountAddress({
        id: idAccount,
        search: "",
        sort: "createdDate~desc",
        page: 1,
        pageSize: 999
      })
    );
    // dispatch(getSrById(idAccount));
  }, [dispatch, idAccount]);

  useEffect(() => {
    dispatch(getGlobalCustomerType());
    dispatch(getGlobalIdentificationType());
    dispatch(getGlobalSex());
    dispatch(getGlobalMartialStatus());
    dispatch(getSrTypes());
    dispatch(getSrSubcategories());
    dispatch(getSrCategories());
    dispatch(getSrPriorities());
    dispatch(getSrChannels());
    dispatch(getSrSources());
    dispatch(getSrPrerequisiteTypes());
    dispatch(getSrDataRequirementTypes());
    dispatch(getSrApprovalHierarchies());
  }, [dispatch]);

  // Load detail + detail-draft when in update mode
  useEffect(() => {
    if (isUpdate && id && idAccount) {
      dispatch(getServiceRequest({ accountId: idAccount, id }));
      dispatch(getServiceRequestDraft({ accountId: idAccount, id }));
    }
  }, [dispatch, isUpdate, id, idAccount]);

  // Populate form when update detail is loaded
  useEffect(() => {
    if (!isUpdate || !list_srApprovalHierarchy.length) return;

    const status = serviceRequestDetail?.status || "";
    const statusApproval = serviceRequestDetail?.statusApproval || "";
    const isActive = status.toUpperCase() === "ACTIVE";
    const isDraftApproval = statusApproval.toUpperCase() === "DRAFT";
    const isRejectApproval = statusApproval.toUpperCase() === "REJECT";

    // Use draft data if ACTIVE record has pending changes
    const detail =
      isActive && (isDraftApproval || isRejectApproval)
        ? serviceRequestDetailDraft
        : serviceRequestDetail;

    if (!detail) return;

    formCreate.setFieldsValue({
      type: detail.requestType || detail.type,
      category: detail.requestCategory || detail.category,
      subCategory: detail.requestSubCategory || detail.subCategory,
      priority: detail.priority,
      description: detail.description,
      requestDate: detail.requestedDate ? moment(detail.requestedDate) : null,
      serviceRequestReference: detail.reference,
      appHierId: detail.apphierId,
      channel: detail.channel,
      requestSource: detail.source
    });

    const appHierOption = list_srApprovalHierarchy.find(
      (option) => option.appHierId === detail.apphierId
    );
    if (appHierOption) {
      handleSelectHierarchy(detail.apphierId, appHierOption.approvalName);
    }
  }, [isUpdate, serviceRequestDetail, serviceRequestDetailDraft, list_srApprovalHierarchy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Populate attachments from loaded detail in UPDATE mode (Gap 3)
  useEffect(() => {
    if (!isUpdate) return;
    const detail = serviceRequestDetail || serviceRequestDetailDraft;
    if (detail?.attachments?.length) {
      setAttachmentDataSource(
        detail.attachments.map((att) => ({ ...att, key: att.id }))
      );
    }
  }, [isUpdate, serviceRequestDetail, serviceRequestDetailDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectHierarchy = (value, label) => {
    formCreate.setFieldValue("appHierName", label);
    if (value) dispatch(getSrApprovalHierarchy(value));
  };

  const handleSetData = (e) => {
    const temp = (e?.customerName || "").split(" ");
    setData({
      foundedBirthDate: e.foundedBirthDate ? moment(e.foundedBirthDate) : null,
      foundedBirthPlace: e?.foundedBirthPlace,
      customerType: e?.customerTypeId,
      identificationType: e?.identificationTypeId,
      customerIdentificationNumber: e?.customerIdentificationNumber,
      sex: e?.sexId,
      maritalStatus: e?.maritalStatusId,
      searchKey: e?.searchKey,
      firstName: (temp[0] || "").toUpperCase(),
      middleName: (temp[1] || "").toUpperCase(),
      lastName: (temp[2] || "").toUpperCase(),
      customerName: (e?.customerName || "").toUpperCase(),
    });
    setFirstName((temp[0] || "").toUpperCase());
    setMiddleName((temp[1] || "").toUpperCase());
    setLastName((temp[2] || "").toUpperCase());
  };

  useEffect(() => {
    if (data_customerDetail) {
      setCustomerType(data_customerDetail?.customerTypeId);
      handleSetData(data_customerDetail);
    }
  }, [data_customerDetail]);

  useEffect(() => {
    if (customerType === 58) {
      setIdentificationDdlValue(
        data_globalIdentificationType?.filter((item) => item?.id !== 1123)
      );
    } else {
      setIdentificationDdlValue(data_globalIdentificationType);
    }
  }, [customerType, data_globalIdentificationType]);

  useEffect(() => {
    formCreate.setFieldsValue({
      customerName: `${firstName}${middleName ? ` ${middleName}` : ""}${lastName ? ` ${lastName}` : ""}`
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, middleName, lastName]);

  useEffect(() => {
    formCreate.setFieldsValue({
      ...data
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Restore wizard state from Redux when returning from prerequisite create page
  useEffect(() => {
    if (location?.state?.returnToStep !== undefined) {
      if (create_sr?.formData) {
        const { srFormPreRequisites, ...rest } = create_sr.formData;
        if (rest.requestDate) rest.requestDate = moment(rest.requestDate);
        formCreate.setFieldsValue(rest);
      }
      if (create_sr?.attachments?.length) {
        setAttachmentDataSource(create_sr.attachments);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Populate form with Account Standard/OneTime information
  useEffect(() => {
    if (data_accountDetail?.accountInformation) {
      const accountInfo = data_accountDetail.accountInformation;
      const accountSums = data_accountDetail.accountSummary;

      const premiseAddress = data_account_address?.result?.find(
        (item) => item?.premise?.bool === true
      );

      formCreate.setFieldsValue({
        accountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountId: accountInfo?.accountId || "",
        srFormAccountSor: accountInfo?.sor || "",
        srFormMeterReadingCode: accountSums?.meterReadingCodes || "",
        srFormAccountSegment: accountInfo?.segment || "",
        srFormAccountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountType: accountInfo?.accountType || "",
        srFormPremiseAddress: premiseAddress?.fullAddress || "",
        srFormDistrict: premiseAddress?.district?.name || "",
        srFormSubdistrict: premiseAddress?.subDistrict?.name || "",
        srFormCity: premiseAddress?.city?.name || "",
        srFormCountry: premiseAddress?.country?.name || "",
        srFormLatitude: premiseAddress?.latitude || "",
        srFormLongitude: premiseAddress?.longitude || ""
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data_account_address,
    data_accountDetail,
    data_detail,
    data_district,
    data_subdistrict,
    data_city,
    data_country
  ]);

  const handleChangeName = (e, type) => {
    switch (type) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "middleName":
        setMiddleName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      default:
        break;
    }
  };

  // const urlLink = (itemId) => `/v1/dbs/api/account-info/download-attachment/${itemId}`

  const steps = [
    {
      title: "Service Request",
      content: (
        <InformationForm
          form={formCreate}
          account={data_accountDetail}
          customer={data_customerDetail}
          dropdowns={dropdowns}
        />
      ),
      disabled: false
    },
    {
      title: "Contact",
      content: (
        <ContactForm
          form={formCreate}
          idAccount={idAccount}
          idCustomer={idCustomer}
          accountType={accountType}
        />
      ),
      disabled: false
    },
    {
      title: "Pre-Requisite",
      content: (
        <PreRequisiteForm
          form={formCreate}
          account={data_accountDetail}
          customer={data_customerDetail}
          dropdowns={dropdowns}
          currentStep={current}
          attachments={attachmentDataSource}
        />
      ),
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <NxCardContainer
          header="Approval Information"
        >
          <NxBaseContainer border>
            <NxApprovalInput
              form={formCreate}
              options={list_srApprovalHierarchy}
              hierarchyDetails={detail_srApprovalHierarchy}
              handleSelectHierarchy={handleSelectHierarchy}
              loading={loading_listSrApprovalHierarchy}
              tableLoading={loading_detailSrApprovalHierarchy}
            />
          </NxBaseContainer>
        </NxCardContainer>
      ),
      disabled: false
    },
    {
      title: "Attachment",
      content: (
        <NxCardContainer
          header="Approval Information"
        >
          <NxBaseContainer border>
            <NxAttachmentInput
              data={attachmentDataSource}
              updateData={setAttachmentDataSource}
              setDeleted={setDeletedAttachments}
              getAPICategory={getSrAttachmentCategories}
              categoryData={list_srAttachmentCategories}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              mandatory
            />
          </NxBaseContainer>
        </NxCardContainer>
      ),
      disabled: false
    }
  ];

  const navigate = useNavigate();
  // Field yang divalidasi FE saat klik Next (submit mode — semua required)
  const stepFieldMap = [
    [
      "category",
      "priority",
      "requestSource",
      "type",
      "subCategory",
      "channel",
      "requestDate"
    ],
    [],
    [],
    ["appHierId"],
    []
  ];

  // Field yang divalidasi FE saat Save as Draft — approval tidak required untuk draft
  const stepFieldMapDraft = [
    [
      "category",
      "priority",
      "requestSource",
      "type",
      "subCategory",
      "channel",
      "requestDate"
    ],
    [],
    [],
    [], // appHierId tidak wajib untuk draft
    []
  ];

  const stepValidationTypes = [
    "DATA",
    "CONTACT",
    "PREREQUISITE",
    "APPROVAL",
    "ATTACHMENT"
  ];

  const next = () => {
    setCurrent((prevCurrent) => prevCurrent + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const buildPayload = (action = "SUBMIT", validationType = null) => {
    const values = formCreate.getFieldsValue(true);
    const isDraft = action === "DRAFT";

    return {
      requestType: values.type ? parseInt(values.type) : null,
      requestCategory: values.category ? parseInt(values.category) : null,
      requestSubCategory: values.subCategory
        ? parseInt(values.subCategory)
        : null,
      priority: values.priority ? parseInt(values.priority) : null,
      description: values.description || null,
      requestedDate: NxDate.formatForAPI(values.requestDate),
      reference: values.serviceRequestReference || null,
      apphierId: values.appHierId ? parseInt(values.appHierId) : null,
      channel: values.channel ? parseInt(values.channel) : null,
      source: values.requestSource ? parseInt(values.requestSource) : null,
      action,
      isDraft,
      validationType,
      stepNumber: validationType
        ? stepValidationTypes.indexOf(validationType) + 1
        : steps.length,
      dataRequirements: (values.srFormDataRequirements || []).map((dr) => ({
        requirementType: dr.typeId ? parseInt(dr.typeId) : null,
        requirementValue: dr.value || null,
        requirementDesc: null
      })),
      prerequisites: (create_sr?.prerequisites || []).map((pr) => ({
        prerequisiteType: pr.prerequisiteType,
        prerequisiteName: pr.prerequisiteName,
        prerequisiteDesc: pr.prerequisiteDesc || null,
        ...(pr.prerequisiteStatus && {
          prerequisiteStatus: pr.prerequisiteStatus
        }),
        ...(pr.prerequisiteValue && {
          prerequisiteValue: pr.prerequisiteValue
        }),
        ...(pr.prerequisiteDueDate && {
          prerequisiteDueDate: pr.prerequisiteDueDate
        }),
        ...(pr.prerequisiteAssignedTo && {
          prerequisiteAssignedTo: pr.prerequisiteAssignedTo
        })
      }))
    };
  };

  const validateStep = async (stepIndex, action = "SUBMIT") => {
    const isDraft = action === "DRAFT";
    const fieldMap = isDraft ? stepFieldMapDraft : stepFieldMap;
    const fields = fieldMap[stepIndex] || [];

    if (fields.length > 0) {
      await formCreate.validateFields(fields);
    }

    const validationType = stepValidationTypes[stepIndex];
    if (!validationType || !idAccount) {
      return;
    }

    const payload = buildPayload(action, validationType);
    await dispatch(
      validateCreateUpdate({
        body: payload,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/accounts/${idAccount}/servicerequests/validate-step`,
        type: formType
      })
    ).unwrap();
  };

  const handleButtonNext = async () => {
    try {
      await validateStep(current);
      next();
    } catch (error) {
      return;
    }
  };

  const handleOpenConfirmation = async (submitType) => {
    try {
      if (submitType === "draft") {
        // Draft: selalu validasi step 1 (prevent data kosong total)
        await formCreate.validateFields(stepFieldMapDraft[0]);
        // Jika sedang di step lain selain step 1, validasi step saat ini juga
        if (current !== 0) {
          await validateStep(current, "DRAFT");
        }
        const payload = buildPayload("DRAFT");
        setDataSend(payload);
        setConfirmationType("draft");
        setModalConfirm(true);
      } else {
        // Submit: validasi step saat ini + validate-create keseluruhan
        if (current < steps.length - 1) {
          await validateStep(current);
        } else {
          await validateStep(3);
        }

        const payload = buildPayload("SUBMIT");

        await dispatch(
          validateCreateUpdate({
            body: payload,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/accounts/${idAccount}/servicerequests/validate-${formType}`,
            type: formType
          })
        ).unwrap();

        setDataSend(payload);
        setConfirmationType("submit");
        setModalConfirm(true);
      }
    } catch (error) {
      return;
    }
  };

  const handleConfirmSubmit = () => {
    const newAttachments = attachmentDataSource.filter(
      (a) => a.dataType === "new"
    );

    const onSuccess = () => {
      setTimeout(() => {
        dispatch(resetCreateSr());
        navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, {
          state: {
            idAccount,
            idCustomer,
            type: accountType,
            section: "Service Request"
          }
        });
      }, 2000);
    };

    if (isUpdate && id) {
      dispatch(
        updateServiceRequest({
          accountId: idAccount,
          id,
          body: { ...dataSend, serviceRequestId: id },
          attachments: newAttachments,
          action: confirmationType.toUpperCase(),
          successBodyExtra: { return: false }
        })
      )
        .unwrap()
        .then(onSuccess)
        .catch(() => {});
    } else {
      dispatch(
        createServiceRequest({
          accountId: idAccount,
          body: dataSend,
          attachments: newAttachments,
          action: confirmationType.toUpperCase(),
          successBodyExtra: { return: false }
        })
      )
        .unwrap()
        .then(onSuccess)
        .catch(() => {});
    }
  };

  const handleClear = () => {
    formCreate.resetFields();

    if (data_accountDetail?.accountInformation) {
      const accountInfo = data_accountDetail.accountInformation;
      const accountSums = data_accountDetail.accountSummary;
      const premiseAddress = data_account_address?.result?.find(
        (item) => item?.premise?.bool === true
      );

      formCreate.setFieldsValue({
        accountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountId: accountInfo?.accountId || "",
        srFormAccountSor: accountInfo?.sor || "",
        srFormMeterReadingCode: accountSums?.meterReadingCodes || "",
        srFormAccountSegment: accountInfo?.segment || "",
        srFormAccountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountType: accountInfo?.accountType || "",
        srFormPremiseAddress: premiseAddress?.fullAddress || "",
        srFormDistrict: premiseAddress?.district?.name || "",
        srFormSubdistrict: premiseAddress?.subDistrict?.name || "",
        srFormCity: premiseAddress?.city?.name || "",
        srFormCountry: premiseAddress?.country?.name || "",
        srFormLatitude: premiseAddress?.latitude || "",
        srFormLongitude: premiseAddress?.longitude || ""
      });
    }

    if (isUpdate) {
      const detail = serviceRequestDetail || serviceRequestDetailDraft;
      if (detail?.apphierId && list_srApprovalHierarchy.length) {
        formCreate.setFieldsValue({ appHierId: detail.apphierId });
        const appHierOption = list_srApprovalHierarchy.find(
          (option) => option.appHierId === detail.apphierId
        );
        if (appHierOption) {
          handleSelectHierarchy(detail.apphierId, appHierOption.approvalName);
        }
      }

      if (serviceRequestDetail?.attachments?.length) {
        setAttachmentDataSource(
          serviceRequestDetail.attachments.map((att) => ({ ...att, key: att.id }))
        );
      }
    } else {
      setAttachmentDataSource([]);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <NxBreadCrumb routes={routes} />
        <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={accountType}
            collapsible={true}
          />
          <Spin spinning={isLoading}>
            <Form
              id="accountForm"
              form={formCreate}
              layout={"vertical"}
              preserve={true}
              onFinish={() => {
                if (current === steps.length - 1) {
                  handleOpenConfirmation("submit");
                }
              }}
              scrollToFirstError={true}
              className="flex flex-col gap-y-4"
            >
              <NxFormStepper
                steps={steps}
                current={current}
                onPrev={prev}
                onNext={handleButtonNext}
              />

              <div className="steps-content flex flex-col gap-y-4">{steps[current].content}</div>

              {/* Section Action Steps */}
              <NxBaseContainer border>
                <div className="flex justify-between">
                  <Button
                    type={"menu"}
                    onClick={() => {
                      setModalBack(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex w-full justify-end gap-x-2">
                    <Button
                      onClick={handleClear}
                      type={"reject"}
                      icon={<SVGIcon name="IconButtonClear" width={14} />}
                    >
                      {isUpdate ? "Reset" : "Clear"}
                    </Button>
                    <Button
                      onClick={() => handleOpenConfirmation("draft")}
                      type={"secondary"}
                    >
                      Save as Draft
                    </Button>
                    <Button onClick={prev} type={"menu"} disabled={current < 1}>
                      Previous
                    </Button>
                    {current < steps.length - 1 && (
                      <Button
                        onClick={handleButtonNext}
                        type={"submit"}
                        disabled={steps[current].disabled}
                      >
                        Next
                      </Button>
                    )}
                    {current === steps.length - 1 && (
                      <Button
                        onClick={() => handleOpenConfirmation("submit")}
                        type={"submit"}
                      >
                        Save & Submit
                      </Button>
                    )}
                  </div>
                </div>
              </NxBaseContainer>
            </Form>
          </Spin>
        </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfirm}
        handleCancel={() => setModalConfirm(false)}
        handleConfirm={handleConfirmSubmit}
        form={formCreate}
        dropdowns={dropdowns}
        approvalTableData={detail_srApprovalHierarchy}
        attachmentsData={attachmentDataSource}
        prerequisites={create_sr?.prerequisites || []}
        type={confirmationType}
        loading={loading_createUpdateSr}
        service={accountManagementService}
        configApplication={configApp.ACCOUNT_SERVICE}
      />

      {/* Modal Back */}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => {
          dispatch(resetCreateSr());
          navigate(-1);
        }}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleCancel={() => setModalError(false)}
        handleOk={() => setModalError(false)}
        width={400}
        title={bodyError?.title || "Failed"}
        description={
          bodyError?.description ||
          "Failed to create service request. Please try again."
        }
      />
    </>
  );
};

export default CreateUpdateCustomerServiceRequest;
