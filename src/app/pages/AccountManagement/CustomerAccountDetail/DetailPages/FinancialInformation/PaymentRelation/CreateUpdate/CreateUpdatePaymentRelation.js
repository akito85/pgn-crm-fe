import { useEffect,  useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Steps, Button, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../../components/BreadCrumb";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";

// you fucking nasty using bulky moment lazy as fuck
import moment from "moment";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerDetail,
} from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import DetailText from "../../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../../../utils";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createPaymentRelation,
  getDetailPaymentRelation,
  getDetailPrApprovalHierarchy,
  getPrAccountStandard,
  getPrApprovalHierarchy,
  getPrAttachmentCategory,
  updatePaymentRelation
} from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";

const CreatePaymentRelation = ({ type }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const dispatch = useDispatch();
  const {
    data_customerDetail,
  } = useSelector((state) => state.customerAccount);

  const {
    data_accountDetail,
  } = useSelector((state) => state.accountManagement);

  const {
    data_prApprovalHierarchy,
    detail_prApprovalHierarchy,
    detail_paymentRelation,
    data_prAccountStandard,
  } = useSelector((state) => state.financialInformation);

  //declare
  const location = useLocation();
  const [formCreate] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idPr = location?.state?.idPr;
  const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

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
  ];
 
  const { InformationForm, AttachmentForm, ApprovalForm } = StepContents;

  useEffect(() => {
    if (idCustomer)
      dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount)
      dispatch(getAccountStandardDetail({idAccount, idCustomer}));
  }, [idAccount]);

  useEffect(() => {
    if (type === "update" && idPr) {
      dispatch(getDetailPaymentRelation(idPr));
    }
  }, [type, idPr]);

  useEffect(() => {
    if (detail_paymentRelation?.data) {
      const {
        subjectId,
        objectId,
        priority,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail_paymentRelation.data;

      const accountName = formCreate.getFieldValue("accountName");
      const accountNumber =formCreate.getFieldValue("accountNumber");

      if (!data_prAccountStandard?.result?.length) {
        dispatch(getPrAccountStandard());
      }
      
      else if (!accountName && !accountNumber) {
        const result = data_prAccountStandard.result;

        const accountStandard = result.find((item) => item.accountId === objectId);        

        if (accountStandard) {
          const { accountNumber, accountName } = accountStandard;

          formCreate.setFieldsValue({
            subjectId,
            objectId,
            accountName,
            accountNumber,
            priority,
            startDate,
            endDate,
            description,
            appHierId,
          });

          handleSelectHiararchy(appHierId);
        }
      }
    }
  }, [detail_paymentRelation, data_prAccountStandard]);
  
  useEffect(() => {
    dispatch(getPrApprovalHierarchy());
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

  const setAccount = (objectId, accountNumber, accountName) => {
    formCreate.setFieldValue("objectId", objectId)
    formCreate.setFieldValue("accountNumber", accountNumber);
    formCreate.setFieldValue("accountName", accountName);
  }

  const handleSelectHiararchy = (appHierId) => {
    dispatch(getDetailPrApprovalHierarchy({id: appHierId}));
    setSelectedHierarchy(appHierId);
  }

  const steps = [
    {
      title: "Payment Relation",
      content: (
        <InformationForm
          setAccount={setAccount}
          className={`${current !== 0 ? "hidden" : ""}`}
          key={`payment-relation-tab-0`}
        />
      ),
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          dataTable={detail_prApprovalHierarchy.map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          dataOption={data_prApprovalHierarchy}
          selectedHierarchy={selectedHierarchy}
          handleSelectHiararchy={handleSelectHiararchy}
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
          getAPICategory={getPrAttachmentCategory}
        />
      ),
      disabled: false
    },
  ];

  const navigate = useNavigate();
  
  const next = async () => {
    try {
      await formCreate.validateFields(formFields[current]);
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
    const {
      objectId,
      priority,
      description, 
      startDate,
      endDate,
      appHierId,
    } = formCreate.getFieldsValue();

    const body = {
      subjectId: data_accountDetail?.accountInformation?.accountId, 
      objectId,
      priority,
      description, 
      startDate,
      endDate,
      appHierId,
      action: confirmationType
    };

    if (type === "create")
      dispatch(createPaymentRelation({ body, attachments: dataAttachment }))
      .unwrap()
      .then((data) => {
        setTimeout(() => {
          navigate(
            ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
            {
              state: {
                idAccount,
                idCustomer,
              }
            }
          );
        }, 2000)
      })
      .catch((error) => {});
    else if (type === "update")
      dispatch(updatePaymentRelation({ id: idPr, body }));
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
            <div onScroll={handleScroll} ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
              <Steps current={current} onChange={handleSetCurrent} items={items} labelPlacement="vertical" />
            </div>
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
              onClick={()=>{navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD)}}
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
          hierarchyTableData={detail_prApprovalHierarchy.map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          hieararchyOptionData={data_prApprovalHierarchy}
          type={confirmationType}
        />
      </div>
    </LayoutMenu>
  );
};

export default CreatePaymentRelation;
