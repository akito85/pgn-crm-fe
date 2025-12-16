import { useEffect,  useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Steps, Button, message, Form } from "antd";
import { LeftCircleOutlined, RightCircleOutlined, RightOutlined, WarningOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
// import StepContents from "./StepContents";
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
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../redux/slices/account_management/accountManagement";

const CreateCustomerServiceRequest = ({ type }) => {
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

  const isLoading = loading || loadingForm || loadingAccount;

 
  // const { InformationForm, AttachmentForm, ApprovalForm, ContactForm, PreRequisiteForm } = StepContents;
  const { InformationForm, AttachmentForm, ApprovalForm, ContactForm, PreRequisiteForm } = {};

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
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
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
  };

  useEffect(() => {
    if (data_customerDetail) {
      setCustomerType(data_customerDetail?.customerTypeId);
      handleSetData(data_customerDetail);
    }
  }, [data_customerDetail]);

  useEffect(() => {
    formCreate.setFieldsValue({
      ...data,
    });
  }, [data, formCreate]);

  // Populate form with Account Standard/OneTime information
  useEffect(() => {
    if (data_accountDetail?.accountInformation) {
      const accountInfo = data_accountDetail.accountInformation;
      formCreate.setFieldsValue({
        account: accountInfo?.accountId || "",
        accountType: accountInfo?.accountType || "",
        longitude: accountInfo?.longitude || "",
        accountSegment: accountInfo?.accountSegment || "",
        city: accountInfo?.city || "",
        accountCostCenter: accountInfo?.costCenter || "",
        subdistrict: accountInfo?.subDistrict || "",
        meterReadingCode: accountInfo?.mrc || "",
        district: accountInfo?.district || "",
        accountSOR: accountInfo?.sor || "",
        premiseAddress: accountInfo?.premiseAddress || "",
        latitude: accountInfo?.latitude || "",
        accountGroupType: accountInfo?.accountGroupType || "",
        country: accountInfo?.country || "",
      });
    }
    console.log(data_accountDetail.accountInformation)
  }, [data_accountDetail, formCreate]);

  const urlLink = (itemId) => `/v1/dbs/api/account-info/download-attachment/${itemId}` 
  
  const steps = [
    {
      title: "Service Request",
      content: <InformationForm />,
      disabled: false
    },
    {
      title: "Contact",
      content: <ContactForm />,
      disabled: false
    },    
    {
      title: "Pre-Requisite",
      content: <PreRequisiteForm />,
      disabled: false
    },
    {
      title: "Attachment",
      content: <AttachmentForm />,
      disabled: false
    },
    {
      title: "Approval",
      content: <ApprovalForm />,
      disabled: false
    }
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
