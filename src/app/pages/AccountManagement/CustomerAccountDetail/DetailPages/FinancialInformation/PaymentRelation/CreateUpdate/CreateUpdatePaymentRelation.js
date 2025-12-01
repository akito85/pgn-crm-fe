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
  getCustomerDetail,
} from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
  getAccountDetail,
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../../../utils";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import { createPaymentRelation, getPrApprovalHierarchy } from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";

const CreatePaymentRelation = ({ type }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const dispatch = useDispatch();
  const {
    data_customerDetail,
    data_globalIdentificationType,
    loading,
  } = useSelector((state) => state.customerAccount);

  const {
    data_accountDetail,
    loading: loadingAccount,
  } = useSelector((state) => state.accountManagement);

  const {
    data_approvalHierarchy,
  } = useSelector((state) => state.financialInformation);

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
  const [dataConfirm, setDataConfirm] = useState({});
  const [btnConfirm, setBtnConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const isLoading = loading || loadingForm || loadingAccount;

  const formFields = [
    [
      "accountNumber",
      "accountName",
      "priority",
      "startDate",
      "endDate",
      "description",
    ],
    [
      "appHierId",
    ],
    []
  ]
 
  const { InformationForm, AttachmentForm, ApprovalForm } = StepContents;

  useEffect(() => {
    if (idCustomer)
      getCustomerDetail(idCustomer);
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount)
      getAccountDetail(idAccount);
  }, [idAccount]);
  
  useEffect(() => {
    dispatch(getPrApprovalHierarchy())
  }, []);

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

  /**
   * @param {boolean} show 
   * @param {"draft" | "submit"} type
   */
  const handleSetShowConfirmationModal = (show, type) => {
    setShowConfirmationModal(show);
    if (show)
      setConfirmationType(type);
    else
      setConfirmationType("");
  }

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
    formCreate.setFieldValue("attachments", dataAttachment);
    console.log("dataAttachment", dataAttachment)
  }, [dataAttachment]);

  const urlLink = (itemId) => `/v1/dbs/api/account-info/download-attachment/${itemId}` 
  
  const setAccount = (accountNumber, accountName) => {
    formCreate.setFieldValue("accountNumber", accountNumber);
    formCreate.setFieldValue("accountName", accountName);
  }

  const dummyHieararchyOptions = [
    {
      name: "Data 1",
      value: 1,
    },
    {
      name: "Data 2",
      value: 2,
    },
    {
      name: "Data 3",
      value: 3,
    },
  ];

  const dummyHierarchyTableData = [
    {
      key: 1,
      approvalLevel: "Data 1 Hierarchy",
      position: "Data 1 Position",
      dataExpand: [
        {
          employeeName: "Abimana",
        },
        {
          employeeName: "Arya",
        },
      ],
    },
    {
      key: 2,
      approvalLevel: "Data 2 Hierarchy",
      position: "Data 2 Position",
      dataExpand: [
        {
          employeeName: "Juno",
        },
        {
          employeeName: "Mamat",
        },
      ],
    },
    {
      key: 3,
      approvalLevel: "Data 3 Hierarchy",
      position: "Data 3 Position",
      dataExpand: [
        {
          employeeName: "Agus",
        },
      ],
    },
  ];

  const steps = [
    {
      title: "Payment Relation",
      content: <InformationForm setAccount={setAccount} className={`${current !== 0 ? "hidden" : ""}`} key={`payment-relation-tab-0`} />,
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          dataTable={dummyHierarchyTableData}
          dataOption={dummyHieararchyOptions}
          selectedHierarchy={selectedHierarchy}
          updateSelectedHierarchy={setSelectedHierarchy}
          className={`${current !== 1 ? "hidden" : ""}`}
          key={`payment-relation-tab-1`}
        />
      ),
      disabled: false
    },
    {
      title: "Attachment",
      content: (
        <AttachmentForm
          type={type}
          data={dataAttachment}
          updateData={setDataAttachment}
          dispatch={dispatch}
          className={`${current !== 2 ? "hidden" : ""}`}
          key={`payment-relation-tab-2`}
        />
      ),
      disabled: false
    },
  ];
  

  const navigate = useNavigate();
  
  const next = async () => {
    try {
      const values = await formCreate.validateFields(formFields[current]);
    } catch (err) {
      return;
    }
    
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSetCurrent = async (newCurrent) => {
    for (let i = current; i < newCurrent; i++) {
      try {
        await formCreate.validateFields(formFields[i]);
      } catch (err) {
        setCurrent(i);
        return;
      }
    }

    setCurrent(newCurrent);
  }

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = async () => {
    await next();
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

  const handleSubmitForm = () => {
    const body = formCreate.getFieldsValue();

    dispatch(createPaymentRelation({ body }));

    navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, { state: {
      
    } });
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
              <DetailText label="Customer Number">{data_customerDetail?.customerNumber}</DetailText>
              <DetailText label="Identification Type">{data_customerDetail?.identificationType}</DetailText>
              <DetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber}</DetailText>
              <DetailText label="Customer Name">{data_customerDetail?.customerName}</DetailText>
              <DetailText label="Customer Type">{data_customerDetail?.customerType}</DetailText>
              <DetailText label="Description">{data_customerDetail?.description}</DetailText>
              <DetailText label="Birth/Founded Date">{renderDate(data_customerDetail?.birthFoundedDate)}</DetailText>
              <DetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace}</DetailText>
              <DetailText label="Sex">{data_customerDetail?.sex}</DetailText>
              <DetailText label="Maritial Status">{data_customerDetail?.maritialStatus}</DetailText>
              <DetailText label="Search Key">{data_customerDetail?.searchKey}</DetailText>
            </div>

            {/* Account Information */}
            <div className="text-primary text-xs font-bold uppercase">
              ACCOUNT INFORMATION
            </div>
            <div className="w-full grid grid-cols-4 gap-x-4">
              <DetailText label="Account Number">{data_accountDetail?.accountNumber}</DetailText>
              <DetailText label="Registration Number">{data_accountDetail?.registrationNumber}</DetailText>
              <DetailText label="Account Name">{data_accountDetail?.accountName}</DetailText>
              <DetailText label="Category">{data_accountDetail?.category}</DetailText>
              <DetailText label="SOR">{data_accountDetail?.sor}</DetailText>
              <DetailText label="Cost Center">{data_accountDetail?.costCenter}</DetailText>
              <DetailText label="Meter Reading Codes">{renderDate(data_accountDetail?.meterReadingCodes || "")}</DetailText>
              <DetailText label="Customer Management">{data_accountDetail?.customerManagement}</DetailText>
              <DetailText label="Classification Type">{data_accountDetail?.classificationType}</DetailText>
              <DetailText label="Segment">{data_accountDetail?.segment}</DetailText>
              <DetailText label="Account Group Type">{data_accountDetail?.accountGroupType}</DetailText>
              <DetailText label="Premise Address">{data_accountDetail?.premiseAddress}</DetailText>
              <DetailText label="Subdistrict">{data_accountDetail?.subdistrict}</DetailText>
              <DetailText label="District">{data_accountDetail?.district}</DetailText>
              <DetailText label="City">{data_accountDetail?.city}</DetailText>
              <DetailText label="Country">{data_accountDetail?.country}</DetailText>
              <DetailText label="Longitude">{data_accountDetail?.longitude}</DetailText>
              <DetailText label="Latitude">{data_accountDetail?.latitude}</DetailText>
              <DetailText label="Status">{data_accountDetail?.status}</DetailText>    
            </div>
          </div>
        </BaseContainer>

        <Form
          id="paymentRelationForm"
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
              <Steps current={current} onChange={handleSetCurrent} items={items} labelPlacement="vertical" />
            </div>
            <span className="mt-[10px]">
              <RightCircleOutlined style={{ fontSize: '24px', color: '#0075bf' }} onClick={scrollRightHandler}/>
            </span>
          </div>
          <div className="steps-content my-6">
          {
            steps.map((step) => step.content)
          }
          </div>

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
                    onClick={() => handleSetShowConfirmationModal(true, "draft")}
                    type={"submit"}
                  >
                    Save as Draft
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => handleSetShowConfirmationModal(true, "submit")}
                    type={"submit"}
                  >
                    Save & Submit
                  </ButtonComponent>
                </>
              )}
            </div>
          </div>
        </Form>

        <ConfirmationModal
          form={"paymentRelationForm"}
          isOpen={showConfirmationModal}
          handleCancel={() => handleSetShowConfirmationModal(false)}
          handleOk={() => handleSetShowConfirmationModal(false)}
          selectedHierarchy={selectedHierarchy}
          hierarchyTableData={dummyHierarchyTableData}
          hieararchyOptionData={dummyHieararchyOptions}
          type={confirmationType}
        />
      </div>
    </LayoutMenu>
  );
};

export default CreatePaymentRelation;
