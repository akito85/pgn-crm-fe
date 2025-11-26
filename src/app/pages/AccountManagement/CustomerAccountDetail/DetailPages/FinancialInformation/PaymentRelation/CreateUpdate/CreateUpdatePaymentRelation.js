import { useEffect,  useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Steps, Button, message, Form } from "antd";
import { LeftCircleOutlined, RightCircleOutlined, RightOutlined, WarningOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../../components/BreadCrumb";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";

// you fucking nasty using bulky moment lazy as fuck
import moment from "moment";

import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../../../../components/Modal/ModalPopUp";
import { bytesConverter } from "../../../../../../../../utils/bytesConverter";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerAttachment,
  getCustomerDetail,
  getGlobalCustomerType,
  getGlobalIdentificationType,
  getGlobalMartialStatus,
  getGlobalSex,
  getListCategoryFile,
  updateCustomer,
} from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../../../utils";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import ModalConfirmationApprovalPaymentRelation from "../ModalConfirmationApprovalPaymentRelation";
import ModalConfirmationCreateUpdateApprovalPaymentRelation from "./ModalConfirmationCreateUpdateApprovalPaymentRelation";

const CreatePaymentRelation = ({ type }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const {
    data_accountDetail,
    loading: loadingAccount,
  } = useSelector((state) => state.accountManagement);

  //declare
  const location = useLocation();
  const [formCreate] = Form.useForm();
  const id = location?.state?.id;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const accountType = location?.state?.type; // "standard" or "onetime"
  // const id = 7;
    
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
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const isLoading = loading || loadingForm || loadingAccount;

 
  const { InformationForm, AttachmentForm, ApprovalForm, ContactForm, PreRequisiteForm } = StepContents;

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
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION,
      breadcrumbName: "Payment Relation",
    },
    {
      path: "",
      breadcrumbName: (type === "create") ? "Create" : (type === "update") ? "Update" : "",
    },
  ];

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

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
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getGlobalCustomerType());
    dispatch(getGlobalIdentificationType());
    dispatch(getGlobalSex());
    dispatch(getGlobalMartialStatus());
  }, [dispatch]);

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
    if(customerType === 58){

      setIdentificationDdlValue(data_globalIdentificationType?.filter(item => item?.id !== 1123))
    } else {
      setIdentificationDdlValue(data_globalIdentificationType)
    }
  },[customerType, data_globalIdentificationType])

  useEffect(() => {
    formCreate.setFieldsValue({
      customerName: `${firstName}${middleName ? ` ${middleName}` : ""}${lastName ? ` ${lastName}` : ""}`,
    });
  },[firstName, middleName, lastName])

  useEffect(() => {
    formCreate.setFieldsValue({
      ...data,
    });
  }, [data, formCreate]);

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
  }

  const urlLink = (itemId) => `/v1/dbs/api/account-info/download-attachment/${itemId}` 
  
  const setAccount = (accountNumber, accountName) => {
    formCreate.setFieldValue("accountNumber", accountNumber);
    formCreate.setFieldValue("accountName", accountName);
  }

  const [dummyAttachmentList, setDummyAttachmentList] = useState([{}]);

  const steps = [
    {
      title: "Payment Relation",
      content: <InformationForm setAccount={setAccount} />,
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          selectedHierarchy={selectedHierarchy}
          updateSelectedHierarchy={setSelectedHierarchy}
        />
      ),
      disabled: false
    },
    {
      title: "Attachment",
      content: (
        <AttachmentForm
          type={type}
          data={dummyAttachmentList}
          updateData={setDummyAttachmentList}
          dispatch={dispatch}
          mandatory={true}
        />
      ),
      disabled: false
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
    scrollRightHandler()
  }
  
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

  const CustomerInformationDummy = {
    customerNumber: "CST009425",
    identificationType: "NPWP",
    customerIdentificationNumber: "9809149088941",
    customerName: "KERAMIK INTI",
    customerType: "Organization",
    description: "-",
    birthFoundedDate: "22-08-2022",
    birthFoundedPlace: "Jakarta",
    sex: "Male",
    maritialStatus: "Married",
    searchKey: "Keramik Inti Pusat",
  };

  const AccountInformationDummy = {
    accountNumber: "00899849211",
    registrationNumber: "00899849211467",
    accountName: "PT KERAMIK INTI 1",
    category: "External",
    sor: "SOR 3",
    costCenter: "015 - AREA BOGOR",
    meterReadingCodes: "0054",
    customerManagement: "CM Bogor 2",
    classificationType: "Related Party",
    segment: "KI",
    accountGroupType: "BRONZE1",
    premiseAddress: "JL. KEMBANG BULAN, No. 90, RT. 90, RW. 7, CIKINI, MENTENG, JAKARTA PUSAT, DKI JAKARTA, INDONESIA, 38963",
    subdistrict: "CIKINI",
    district: "MENTENG",
    city: "JAKARTA PUSAT",
    country: "INDONESIA",
    longitude: "-6.15330388502638",
    latitude: "106.74036886669953",
    status: "Active",
  };

  return (
    <LayoutMenu>
      <div className="flex flex-col gap-y-5">
        <BreadCrumb routes={routes} />
        <BaseContainer removeTopMargin>
          <div className="flex flex-col gap-y-5">
            {/* Customer Information */}
            <div className="text-primary text-xs font-bold uppercase">
              CUSTOMER INFORMATION
            </div>
            <div className="w-full grid grid-cols-4 gap-x-5">
              <DetailText label="Customer Number">{data_customerDetail?.customerNumber || CustomerInformationDummy.customerNumber}</DetailText>
              <DetailText label="Identification Type">{data_customerDetail?.identificationType || CustomerInformationDummy.identificationType}</DetailText>
              <DetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber || CustomerInformationDummy.customerIdentificationNumber}</DetailText>
              <DetailText label="Customer Name">{data_customerDetail?.customerName || CustomerInformationDummy.customerName}</DetailText>
              <DetailText label="Customer Type">{data_customerDetail?.customerType || CustomerInformationDummy.customerType}</DetailText>
              <DetailText label="Description">{data_customerDetail?.description || CustomerInformationDummy.description}</DetailText>
              <DetailText label="Birth/Founded Date">{data_customerDetail?.birthFoundedDate ? renderDate(data_customerDetail.birthFoundedDate) : renderDate(CustomerInformationDummy.birthFoundedDate)}</DetailText>
              <DetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace || CustomerInformationDummy.birthFoundedPlace}</DetailText>
              <DetailText label="Sex">{data_customerDetail?.sex || CustomerInformationDummy.sex}</DetailText>
              <DetailText label="Maritial Status">{data_customerDetail?.maritialStatus || CustomerInformationDummy.maritialStatus}</DetailText>
              <DetailText label="Search Key">{data_customerDetail?.searchKey || CustomerInformationDummy.searchKey}</DetailText>
            </div>

            {/* Account Information */}
            <div className="text-primary text-xs font-bold uppercase">
              ACCOUNT INFORMATION
            </div>
            <div className="w-full grid grid-cols-4 gap-x-4">
              <DetailText label="Account Number">{data_accountDetail?.accountNumber || AccountInformationDummy.accountNumber}</DetailText>
              <DetailText label="Registration Number">{data_accountDetail?.registrationNumber || AccountInformationDummy.registrationNumber}</DetailText>
              <DetailText label="Account Name">{data_accountDetail?.accountName || AccountInformationDummy.accountName}</DetailText>
              <DetailText label="Category">{data_accountDetail?.category || AccountInformationDummy.category}</DetailText>
              <DetailText label="SOR">{data_accountDetail?.sor || AccountInformationDummy.sor}</DetailText>
              <DetailText label="Cost Center">{data_accountDetail?.costCenter || AccountInformationDummy.costCenter}</DetailText>
              <DetailText label="Meter Reading Codes">{data_accountDetail?.meterReadingCodes ? renderDate(data_accountDetail.meterReadingCodes) : renderDate(AccountInformationDummy.birthFoundedDate)}</DetailText>
              <DetailText label="Customer Management">{data_accountDetail?.customerManagement || AccountInformationDummy.customerManagement}</DetailText>
              <DetailText label="Classification Type">{data_accountDetail?.classificationType || AccountInformationDummy.classificationType}</DetailText>
              <DetailText label="Segment">{data_accountDetail?.segment || AccountInformationDummy.segment}</DetailText>
              <DetailText label="Account Group Type">{data_accountDetail?.accountGroupType || AccountInformationDummy.accountGroupType}</DetailText>
              <DetailText label="Premise Address">{data_accountDetail?.premiseAddress || AccountInformationDummy.premiseAddress}</DetailText>
              <DetailText label="Subdistrict">{data_accountDetail?.subdistrict || AccountInformationDummy.subdistrict}</DetailText>
              <DetailText label="District">{data_accountDetail?.district || AccountInformationDummy.district}</DetailText>
              <DetailText label="City">{data_accountDetail?.city || AccountInformationDummy.city}</DetailText>
              <DetailText label="Country">{data_accountDetail?.country || AccountInformationDummy.country}</DetailText>
              <DetailText label="Longitude">{data_accountDetail?.longitude || AccountInformationDummy.longitude}</DetailText>
              <DetailText label="Latitude">{data_accountDetail?.latitude || AccountInformationDummy.latitude}</DetailText>
              <DetailText label="Status">{data_accountDetail?.status || AccountInformationDummy.status}</DetailText>    
            </div>
          </div>
        </BaseContainer>

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
              <LeftCircleOutlined style={{ fontSize: '24px', color: '#0075bf' }} onClick={scrollLeftHandler}/>
            </span>
            <div onScroll={handleScroll} ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
              <Steps current={current} items={items} labelPlacement="vertical" />
            </div>
            <span className="mt-[10px]">
              <RightCircleOutlined style={{ fontSize: '24px', color: '#0075bf' }} onClick={scrollRightHandler}/>
            </span>
          </div>
          
          <div className="steps-content my-6">{steps[current].content}</div>

          {/* Section Action Steps */}
          <div className="steps-action my-8 flex w-full justify-between gap-x-2">
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              onClick={()=>{setModalBack(true)}}
            >
              Back
            </ButtonComponent>
            <div className="flex w-full justify-end gap-x-4">
              <ButtonComponent
                onClick={() => {}}
                type={"submit"}
                icon={<SVGIcon name="IconButtonClear" width={24} />}
              >
                Clear
              </ButtonComponent>
              {current > 0 && current !== (steps.length-1) && (
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
                <Button
                  onClick={handleButtonNext}
                  type="primary"
                  className="ant-btn ant-btn-submit flex w-full justify-center"
                  disabled={steps[current].disabled}
                >
                  <span className="p-1 text-[18px] text-center">Next</span>
                  <RightOutlined
                    style={{
                      justifyItems: "center",
                      fontSize: "18px",
                      color: "#fff",
                    }}
                  />
                </Button>
              )}
              {current === steps.length - 1 && (
                <>
                  <ButtonComponent
                    onClick={() => setShowConfirmationModal(true)}
                    type={"submit"}
                    htmlType={"submit"}
                  >
                    Save as Draft
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => message.success("Processing complete!")}
                    type={"submit"}
                    htmlType={"submit"}
                  >
                    Save & Submit
                  </ButtonComponent>
                </>
              )}
            </div>
          </div>
        </Form>

        <ModalConfirmationCreateUpdateApprovalPaymentRelation
          isOpen={showConfirmationModal}
          handleCancel={() => setShowConfirmationModal(false)}
          handleOk={() => setShowConfirmationModal(false)}
          selectedHierarchy={selectedHierarchy}
        />

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
      </div>
    </LayoutMenu>
  );
};

export default CreatePaymentRelation;
