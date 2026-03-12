import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Form, Spin } from "antd";
import { WarningOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import HeaderDetail from "../../../HeaderDetail";

// you fucking nasty using bulky moment lazy as fuck
import moment from "moment";

import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../../../components/Modal/ModalPopUp";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerAttachment,
  getCustomerDetail,
  getGlobalCustomerType,
  getGlobalIdentificationType,
  getGlobalMartialStatus,
  getGlobalSex,
  getListCategoryFile,
  updateCustomer,
} from "../../../../../../../redux/slices/account_management/Customer/customerAccount";

import { getDetailContact } from "../../../../../../../redux/slices/account_management/MasterData/contact_slice";

import {
  getListDetailAccountContact,
  getDetailAccountContact,
} from "../../../../../../../redux/slices/account_management/detailAccount/accountContactSlice";

import {
  getListDetailAccountAddress,
  getListChooseAddress,
} from "../../../../../../../redux/slices/account_management/detailAccount/accountAddressSlice";

import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../redux/slices/account_management/accountManagement";

import {
  getServiceRequestById,
  getServiceRequestApprovalHierarchies,
  getServiceRequestApprovalHierarchyDetail,
  getServiceRequestTypes,
  getServiceRequestCategories,
  getServiceRequestSubcategories,
  getServiceRequestChannels,
  getServiceRequestPriorities,
  getServiceRequestSources,
  getServiceRequestDataRequirements,
  getServiceRequestPrerequisites,
  createCompleteServiceRequest,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";

const CreateCustomerServiceRequest = (props) => {
  const location = useLocation();

  // Restore step from location state if returning from prerequisite create
  const [current, setCurrent] = useState(location?.state?.returnToStep || 0);
  const { type } = props;
  const isUpdate = type === "update";

  const dispatch = useDispatch();

  const {
    data_customerDetailAttachment,
    data_customerDetail,
    data_globalCustomerType,
    data_globalIdentificationType,
    data_globalSex,
    data_globalMartialStatus,
    loading,
  } = useSelector((state) => state.customerAccount);

  const { data_accountDetail, loading: loadingAccount } = useSelector(
    (state) => state.accountManagement,
  );

  const {
    data_types,
    data_categories,
    data_subcategories,
    data_priorities,
    data_channels,
    data_sources,
    data_approval_hierarchy,
    data_approval_hierarchy_detail,
    data_prerequisite_types,
    data_data_requirement_types,
    data_detail: serviceRequestDetail,
  } = useSelector((state) => state.serviceRequest);

  // Map state keys to the dropdowns structure expected by child components
  const dropdowns = {
    serviceRequestTypes: data_types,
    serviceRequestCategories: data_categories,
    serviceRequestSubcategories: data_subcategories,
    serviceRequestPriorities: data_priorities,
    serviceRequestChannels: data_channels,
    serviceRequestSources: data_sources,
    serviceRequestPrerequisites: data_prerequisite_types,
    serviceRequestDataRequirements: data_data_requirement_types,
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
    data_business_purpose,
  } = useSelector((state) => state.accountAddress);

  const { idAccount, idCustomer, accountType } = useMemo(() => {
    // Prioritas 1: Ambil dari location.state (navigasi normal)
    if (location.state) {
      return {
        idAccount: location.state.idAccount,
        idCustomer: location.state.idCustomer,
        accountType: location.state.type,
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
      };
    }
    // Default jika tidak ada data sama sekali
    return { idAccount: null, idCustomer: null, accountType: null };
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
  const [loadingForm, setLoadingForm] = useState(false);
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
  const [attachmentsData, setAttachmentsData] = useState([]); // Attachments
  const [approvalOptions, setApprovalOptions] = useState([]);
  const [approvalTableData, setApprovalTableData] = useState([]);

  const isLoading = loading || loadingForm || loadingAccount;

  const {
    InformationForm,
    AttachmentForm,
    ApprovalForm,
    ContactForm,
    PreRequisiteForm,
  } = StepContents;
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  // Timeout fallback - if dropdowns don't load within 10 seconds, allow form to render anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!dropdownsLoaded) {
        console.warn("Dropdown loading timeout - proceeding without full dropdown data");
        setDropdownsLoaded(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [dropdownsLoaded]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
      breadcrumbName: "Service Requests",
    },
    {
      path: "",
      breadcrumbName: "Create",
    },
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
        sort: "createdDate~desc",
      }),
    );

    dispatch(getDetailAccountContact(idCustomer));
    dispatch(getListDetailAccountAddress({
        id: idAccount,
        search: "",
        sort: "createdDate~desc",
        page: 1,
        pageSize: 999,
      }));
    // dispatch(getServiceRequestById(idAccount));
  }, [dispatch, idAccount]);

  useEffect(() => {
    dispatch(getGlobalCustomerType());
    dispatch(getGlobalIdentificationType());
    dispatch(getGlobalSex());
    dispatch(getGlobalMartialStatus());
    dispatch(getServiceRequestTypes());
    dispatch(getServiceRequestSubcategories());
    dispatch(getServiceRequestCategories());
    dispatch(getServiceRequestPriorities());
    dispatch(getServiceRequestChannels());
    dispatch(getServiceRequestSources());
    dispatch(getServiceRequestPrerequisites());
    dispatch(getServiceRequestDataRequirements());
    dispatch(getServiceRequestApprovalHierarchies());
  }, [dispatch]);

  useEffect(() => {
    if (data_approval_hierarchy && data_approval_hierarchy.length > 0) {
      setApprovalOptions(data_approval_hierarchy);
      return;
    }

    setApprovalOptions([]);
  }, [data_approval_hierarchy]);

  useEffect(() => {
    if (
      data_approval_hierarchy_detail &&
      data_approval_hierarchy_detail.length > 0
    ) {
      const normalizedData = data_approval_hierarchy_detail.map((item, index) => ({
        ...item,
        key: item.key || `approval-hierarchy-${index + 1}`,
        employeeDetail: (item.employeeDetail || []).map((employee, employeeIndex) => ({
          ...employee,
          key:
            employee.key ||
            `approval-hierarchy-${index + 1}-employee-${employeeIndex + 1}`,
        })),
      }));

      setApprovalTableData(normalizedData);
      return;
    }

    setApprovalTableData([]);
  }, [data_approval_hierarchy_detail]);

  const handleSelectHiararchy = (value, label) => {
    formCreate.setFieldsValue({
      appHierId: value,
      appHierName: label,
    });

    if (value) {
      dispatch(getServiceRequestApprovalHierarchyDetail(value));
      return;
    }

    setApprovalTableData([]);
  };

  useEffect(() => {
    // Check if dropdowns are loaded - handle both response structures:
    // 1. Direct array: dropdowns.serviceRequestTypes = [...]
    // 2. Response object: dropdowns.serviceRequestTypes = { data: [...] }
    const isLoaded = (dropdown) => {
      if (!dropdown) return false;
      // If it's an array with items, it's loaded
      if (Array.isArray(dropdown) && dropdown.length > 0) return true;
      // If it's a response object with data array, it's loaded
      if (dropdown?.data && Array.isArray(dropdown.data)) return true;
      return false;
    };

    if (
      dropdowns &&
      isLoaded(dropdowns.serviceRequestTypes) &&
      isLoaded(dropdowns.serviceRequestCategories) &&
      isLoaded(dropdowns.serviceRequestSubcategories) &&
      isLoaded(dropdowns.serviceRequestChannels) &&
      isLoaded(dropdowns.serviceRequestPriorities) &&
      isLoaded(dropdowns.serviceRequestSources) &&
      isLoaded(dropdowns.serviceRequestPrerequisites) &&
      isLoaded(dropdowns.serviceRequestDataRequirements)
    ) {
      setDropdownsLoaded(true);
    }
  }, [dropdowns]);

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
      description: e?.description,
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
        data_globalIdentificationType?.filter((item) => item?.id !== 1123),
      );
    } else {
      setIdentificationDdlValue(data_globalIdentificationType);
    }
  }, [customerType, data_globalIdentificationType]);

  useEffect(() => {
    formCreate.setFieldsValue({
      customerName: `${firstName}${middleName ? ` ${middleName}` : ""}${lastName ? ` ${lastName}` : ""}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, middleName, lastName]);

  useEffect(() => {
    formCreate.setFieldsValue({
      ...data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Restore wizard form data from sessionStorage when returning from prerequisite create page
  useEffect(() => {
    if (location?.state?.returnToStep !== undefined) {
      try {
        const saved = sessionStorage.getItem("srWizardFormData");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.requestDate) {
            parsed.requestDate = moment(parsed.requestDate);
          }
          formCreate.setFieldsValue(parsed);
          sessionStorage.removeItem("srWizardFormData");
        }
      } catch (_) {}
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
        srFormAccountCostCenter: accountSums?.costCenter || "",
        srFormAccountCostCenterId: accountInfo?.costCenterId || null,
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
        srFormLongitude: premiseAddress?.longitude || "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_account_address, data_accountDetail, data_detail, data_district, data_subdistrict, data_city, data_country]);

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
      content: dropdownsLoaded ? (
        <InformationForm
          form={formCreate}
          account={data_accountDetail}
          customer={data_customerDetail}
          dropdowns={dropdowns}
        />
      ) : (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading dropdown data..." />
        </div>
      ),
      disabled: !dropdownsLoaded,
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
      disabled: false,
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
        />
      ),
      disabled: false,
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          form={formCreate}
          dataOption={approvalOptions}
          dataTable={approvalTableData}
          handleSelectHiararchy={handleSelectHiararchy}
        />
      ),
      disabled: false,
    },
    {
      title: "Attachment",
      content: (
        <AttachmentForm
          attachmentsData={attachmentsData}
          setAttachmentsData={setAttachmentsData}
        />
      ),
      disabled: false,
    },
  ];

  const navigate = useNavigate();
  const stepFieldMap = [
    ["category", "priority", "requestSource", "type", "channel", "requestDate"],
    [],
    [],
    ["appHierId"],
    [],
  ];

  const stepValidationTypes = [
    "DATA",
    "CONTACT",
    "PREREQUISITE",
    "APPROVAL",
    "ATTACHMENT",
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
      requestSubCategory: values.subCategory ? parseInt(values.subCategory) : null,
      priority: values.priority ? parseInt(values.priority) : null,
      description: values.description || null,
      requestedDate: values.requestDate
        ? (values.requestDate.toDate
          ? values.requestDate.toDate()
          : new Date(values.requestDate))
        : null,
      reference: values.srr || null,
      apphierId: values.appHierId ? parseInt(values.appHierId) : null,
      channel: values.channel ? parseInt(values.channel) : null,
      source: values.requestSource ? parseInt(values.requestSource) : null,
      costCenter: values.srFormAccountCostCenterId
        ? parseInt(values.srFormAccountCostCenterId)
        : null,
      action,
      isDraft,
      validationType,
      stepNumber: validationType
        ? stepValidationTypes.indexOf(validationType) + 1
        : steps.length,
      dataRequirements: (values.srFormDataRequirements || []).map((dr) => ({
        requirementType: dr.typeId ? parseInt(dr.typeId) : null,
        requirementValue: dr.value || null,
        requirementDesc: null,
      })),
      prerequisites: (values.srFormPreRequisites || []).map((pr) => ({
        prerequisiteId: pr.prerequisiteId,
        prerequisiteName: pr.prerequisiteName,
        prerequisiteComments: pr.prerequisiteComments || null,
        ...(pr.prerequisiteStatus && { prerequisiteStatus: pr.prerequisiteStatus }),
        ...(pr.prerequisiteValue && { prerequisiteValue: pr.prerequisiteValue }),
        ...(pr.prerequisiteDueDate && { prerequisiteDueDate: pr.prerequisiteDueDate }),
        ...(pr.prerequisiteAssignedTo && { prerequisiteAssignedTo: pr.prerequisiteAssignedTo }),
      })),
      attachments: attachmentsData.map((att) => ({
        category: "SERVICE_REQUEST",
        fileName: att.fileName || null,
        type: att.type || null,
        fileSize: att.size || 0,
        fileCategoryId: att.fileCategoryId ? parseInt(att.fileCategoryId) : null,
        description: att.description || null,
        base64Content: att.base64 || null,
        isDraft,
        isDeleted: false,
      })),
    };
  };

  const validateStep = async (stepIndex) => {
    const fields = stepFieldMap[stepIndex] || [];

    if (fields.length > 0) {
      await formCreate.validateFields(fields);
    }

    const validationType = stepValidationTypes[stepIndex];
    if (!validationType || !idAccount) {
      return;
    }

    const payload = buildPayload("SUBMIT", validationType);
    await dispatch(
      validateCreateUpdate({
        body: payload,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/accounts/${idAccount}/servicerequests/validate-step`,
        type: "create",
      }),
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
      if (current < steps.length - 1) {
        await validateStep(current);
      } else {
        await validateStep(3);
      }

      const action = submitType === "draft" ? "DRAFT" : "SUBMIT";
      const payload = buildPayload(action);

      await dispatch(
        validateCreateUpdate({
          body: payload,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/accounts/${idAccount}/servicerequests/validate-create`,
          type: "create",
        }),
      ).unwrap();

      setDataSend(payload);
      setConfirmationType(submitType);
      setModalConfirm(true);
    } catch (error) {
      return;
    }
  };

  const handleConfirmSubmit = async () => {
    setModalConfirm(false);
    setLoadingForm(true);
    try {
      await dispatch(
        createCompleteServiceRequest({ accountId: idAccount, body: dataSend })
      ).unwrap();
      // thunk sudah dispatch showModalSuccess — langsung navigate
      navigate(-1);
    } catch (error) {
      // thunk sudah dispatch showModalError
    } finally {
      setLoadingForm(false);
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
        srFormAccountCostCenter: accountSums?.costCenter || "",
        srFormAccountCostCenterId: accountInfo?.costCenterId || null,
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
        srFormLongitude: premiseAddress?.longitude || "",
      });
    }
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Form
        id="accountForm"
        form={formCreate}
        layout={"vertical"}
        onFinish={() => {
          if (current === steps.length - 1) {
            handleOpenConfirmation("submit");
          }
        }}
        // onFinishFailed={handleErrorSubmit}
        scrollToFirstError={true}
      >
        <HeaderDetail
          data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          dispatch={dispatch}
          idAccount={idAccount}
          idCustomer={idCustomer}
          type={accountType}
          collapsible={true}
        />

        <div className="my-4">
          <NxFormStepper
            steps={steps}
            current={current}
            onPrev={prev}
            onNext={handleButtonNext}
          />
        </div>

        <div className="steps-content my-6">{steps[current].content}</div>

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
                disabled={current !== steps.length - 1}
              >
                Save as Draft
              </Button>
              <Button
                onClick={prev}
                type={"menu"}
                disabled={current < 1}
              >
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
                  loading={loadingForm}
                >
                  Save & Submit
                </Button>
              )}
            </div>
          </div>
        </NxBaseContainer>
      </Form>

      {/* Modal Submit Confirm */}
      <ModalConfirm
        isOpen={modalConfirm}
        handleCancel={() => setModalConfirm(false)}
        handleOk={handleConfirmSubmit}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#0075bf" }} />
          <p className="text-[18px] font-bold">
            {confirmationType === "draft"
              ? "Are you sure you want to save this Service Request as draft?"
              : "Are you sure you want to submit this Service Request?"}
          </p>
        </div>
      </ModalConfirm>

      {/* Modal Back */}
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

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleCancel={() => setModalError(false)}
        handleOk={() => setModalError(false)}
        width={400}
        title={bodyError?.title || "Failed"}
        description={bodyError?.description || "Failed to create service request. Please try again."}
      />
    </LayoutMenu>
  );
};

export default CreateCustomerServiceRequest;
