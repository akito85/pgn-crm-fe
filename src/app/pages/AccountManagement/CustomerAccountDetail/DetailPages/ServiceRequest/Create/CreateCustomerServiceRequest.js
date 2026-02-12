import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Steps, Button, message, Form, Spin } from "antd";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

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
  getServiceRequestTypes,
  getServiceRequestCategories,
  getServiceRequestSubcategories,
  getServiceRequestChannels,
  getServiceRequestPriorities,
  getServiceRequestSources,
  getServiceRequestDataRequirements,
  getServiceRequestPrerequisites,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

const CreateCustomerServiceRequest = (props) => {
  const containerRef = useRef(null);
  const location = useLocation();

  // Restore step from location state if returning from prerequisite create
  const [current, setCurrent] = useState(location?.state?.returnToStep || 0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { type } = props;

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
    data_country,
    data_province,
    data_city,
    data_district,
    data_subdistrict,
    data_postalcode,
    data_type,
    data_business_purpose,
  } = useSelector((state) => state.accountAddress);

  //declare
  const [formCreate] = Form.useForm();
  const id = location?.state?.id;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);
  const [data, setData] = useState({});
  const [dataSend, setDataSend] = useState({});
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
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
    if (id) {
      dispatch(getCustomerDetail(id));
      // dispatch(getDetailContact(id));
    }
  }, [dispatch, id]);

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
  }, [dispatch]);

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
    console.log("Dropdowns loaded = ", dropdowns);
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

  // Populate form with Account Standard/OneTime information
  useEffect(() => {
    if (data_accountDetail?.accountInformation) {
      const accountInfo = data_accountDetail.accountInformation;
      const accountSums = data_accountDetail.accountSummary;

      formCreate.setFieldsValue({
        accountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountId: accountInfo?.accountId || "",
        srFormAccountSor: accountInfo?.sor || "",
        srFormAccountCostCenter: accountSums?.costCenter || "",
        srFormMeterReadingCode: accountSums?.meterReadingCodes || "",
        srFormAccountSegment: accountInfo?.segment || "",
        srFormAccountGroupType: accountInfo?.accountGroupType || "",
        srFormAccountType: accountInfo?.accountType || "",
        srFormPremiseAddress: data_detail?.contactAddress || "",
        srFormDistrict: data_district || "",
        srFormSubdistrict: data_subdistrict || "",
        srFormCity: data_city || "",
        srFormCountry: data_country || "",
      });
    }
    console.log(data_district)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_accountDetail, data_detail, data_district, data_subdistrict, data_city, data_country]);

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
          account={data_accountDetail}
          customer={data_customerDetail}
          dropdowns={dropdowns}
          contactsData={contactsData}
          prerequisitesData={prerequisitesData}
          attachmentsData={attachmentsData}
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
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const handleSubmitForm = (value) => {
    setModalConfirm(true);
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Form
        id="accountForm"
        form={formCreate}
        layout={"vertical"}
        onFinish={handleSubmitForm}
        // onFinishFailed={handleErrorSubmit}
        scrollToFirstError={true}
      >
        {/* Step Contents */}
        <div className="flex flex-row gap-x-6 justify-center">
          <span className="mt-[10px]">
            <LeftCircleOutlined
              style={{ fontSize: "24px", color: "#0075bf" }}
              onClick={scrollLeftHandler}
            />
          </span>
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
          <span className="mt-[10px]">
            <RightCircleOutlined
              style={{ fontSize: "24px", color: "#0075bf" }}
              onClick={scrollRightHandler}
            />
          </span>
        </div>

        <div className="steps-content my-6">{steps[current].content}</div>

        {/* Section Action Steps */}
        <div className="steps-action my-8 flex w-full justify-between gap-x-2">
          <ButtonComponent
            type={"submit"}
            icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
            onClick={() => {
              setModalBack(true);
            }}
          >
            Back
          </ButtonComponent>
          <div className="flex w-full justify-end gap-x-4">
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={handleButtonNext}
                type={"submit"}
                disabled={steps[current].disabled}
                icon={<SVGIcon name="IconArrowNarrowRight" width={24} />}
              >
                Next
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <ButtonComponent
                onClick={() => message.success("Processing complete!")}
                type={"submit"}
                htmlType={"submit"}
                icon={<SVGIcon name="IconArrowNarrowRight" width={24} />}
              >
                Save
              </ButtonComponent>
            )}
          </div>
        </div>
      </Form>

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
    </LayoutMenu>
  );
};

export default CreateCustomerServiceRequest;
