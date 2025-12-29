import { useEffect,  useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

// you fucking nasty using bulky moment lazy as fuck
import moment from "moment";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerDetail,
} from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../../utils";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createMultiDestination,
  getDetailMultiDestination,
  getDetailMdApprovalHierarchy,
  getMultiDestinationAttachment,
  getMdApprovalHierarchy,
  getMdAttachmentCategory,
  updateMultiDestination,
} from "../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../constants/configApp";

const CreateUpdateMultiDestination = ({ type }) => {
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
    data_mdApprovalHierarchy,
    detail_mdApprovalHierarchy,
    detail_multiDestination,
    data_multiDestinationAttachment,
  } = useSelector((state) => state.financialInformation);

  //declare
  const location = useLocation();
  const [formCreate] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idMd = location?.state?.idMd;
  const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [selectedAppHierId, setSelectedAppHierId] = useState();
  const [selectedApprovalName, setSelectedApprovalName] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const formFields = [
    [
      "account",
      "accountSor",
      "accountCostCenter",
      "meterReadingCode",
      "accountSegment",
      "accountGroupType",
      "accountType",
      "premiseAddress",
      "subdistrict",
      "district",
      "city",
      "country",
      "longitude",
      "latitude",
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
    if (type === "update" && idMd) {
      dispatch(getDetailMultiDestination(idMd));
      dispatch(getMultiDestinationAttachment({ id: idMd }))
    }
  }, [type, idMd]);

  useEffect(() => {
    if (
      type === "update" &&
      detail_multiDestination?.result &&
      data_mdApprovalHierarchy?.length
    ) {
      const {
        subjectId,
        objectId,
        account,
        accountSor,
        accountCostCenter,
        meterReadingCode,
        accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subdistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail_multiDestination.result;

      formCreate.setFieldsValue({
        subjectId,
        objectId,
        account,
        accountSor,
        accountCostCenter,
        meterReadingCode,
        accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subdistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        startDate,
        endDate,
        description,
        appHierId,
      });

      const appHierOption = data_mdApprovalHierarchy.find((option) => option.appHierId === appHierId)

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail_multiDestination, data_mdApprovalHierarchy]);

  useEffect(() => {
    if (type === "update" && data_multiDestinationAttachment?.result) {
      const result = data_multiDestinationAttachment.result?.map((item, index) => ({
        ...item,
        key: `multi-destination-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([
        ...result,
      ])
    }
  }, [data_multiDestinationAttachment])

  useEffect(() => {
    dispatch(getMdApprovalHierarchy());
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
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_MULTI_DESTINATION,
      breadcrumbName: "Multi Destination",
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
   * @param {"draft" | "submit"} submitType
   */
  const handleSetShowConfirmationModal = async (show, submitType) => {
    if (show) {
      const {
        objectId,
        account,
        accountSor,
        accountCostCenter,
        meterReadingCode,
        accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subdistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        description, 
        startDate,
        endDate,
        appHierId,
      } = formCreate.getFieldsValue();

      const body = {
        id: type === "update" ? idMd : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId,
        objectId,
        account,
        accountSor,
        accountCostCenter,
        meterReadingCode,
        accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subdistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        description, 
        startDate,
        endDate,
        appHierId,
        action: submitType
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/multi-destination/validate-${type}`,
        type,
      }))
      .unwrap()
      .then((data) => {
        setShowConfirmationModal(show);
        setConfirmationType(submitType);
      }).catch(() => {});
    }
    else {
      setShowConfirmationModal(show);
      setConfirmationType("");
    }
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

  const setAccount = (
    {
      objectId,
      accountNumber,
      accountName,
      sor,
      costCenter,
      meterReadingCode,
      accountSegment,
      accountGroupType,
      accountType,
      premiseAddress,
      subdistrict,
      district,
      city,
      country,
      longitude,
      latitude,
    }
  ) => {
    formCreate.setFieldsValue({
      objectId,
      account: `${accountNumber}-${accountName}`,
      sor,
      costCenter,
      meterReadingCode,
      accountSegment,
      accountGroupType,
      accountType,
      premiseAddress,
      subdistrict,
      district,
      city,
      country,
      longitude,
      latitude,
    })
  }

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailMdApprovalHierarchy({id: appHierId}));
    setSelectedAppHierId(appHierId);
    setSelectedApprovalName(approvalName);
  }

  const steps = [
    {
      title: "Multi Destination",
      content: (
        <InformationForm
          setAccount={setAccount}
          className={`${current !== 0 ? "hidden" : ""}`}
          accountId={idAccount}
          key={`multi-destination-tab-0`}
        />
      ),
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          dataTable={(detail_mdApprovalHierarchy || []).map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          dataOption={data_mdApprovalHierarchy}
          selectedAppHierId={selectedAppHierId}
          handleSelectHiararchy={handleSelectHiararchy}
          className={`${current !== 1 ? "hidden" : ""}`}
          key={`multi-destination-tab-1`}
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
          key={`multi-destination-tab-2`}
          getAPICategory={getMdAttachmentCategory}
          service={accountManagementService}
          configApplication={configApp.ACCOUNT_SERVICE}
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
      id: idMd,
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
      dispatch(createMultiDestination({ body, attachments: dataAttachment }))
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
      dispatch(updateMultiDestination({ id: idMd, body, attachments: dataAttachment.filter((attachment => attachment.dataType !== "exist")) }))
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
        .catch((error) => {});;
  };

  const handleClear = () => {
    if (type === "create") {
      setDataAttachment([]);
      setSelectedAppHierId();
      setSelectedApprovalName();
      formCreate.resetFields();
      setCurrent(0);
    } else if (type === "update") {
      if (
        detail_multiDestination?.result &&
        data_mdApprovalHierarchy?.length
      ) {
        const {
          subjectId,
          objectId,
          accountSor,
          accountCostCenter,
          meterReadingCode,
          accountSegment,
          accountGroupType,
          accountType,
          premiseAddress,
          subdistrict,
          district,
          city,
          country,
          longitude,
          latitude,
          startDate,
          endDate,
          description,
          appHierId,
        } = detail_multiDestination.result;

        formCreate.setFieldsValue({
          subjectId,
          objectId,
          accountSor,
          accountCostCenter,
          meterReadingCode,
          accountSegment,
          accountGroupType,
          accountType,
          premiseAddress,
          subdistrict,
          district,
          city,
          country,
          longitude,
          latitude,
          startDate,
          endDate,
          description,
          appHierId,
        });

        const appHierOption = data_mdApprovalHierarchy.find((option) => option.appHierId === appHierId)

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      if (data_multiDestinationAttachment?.result) {
        const result = data_multiDestinationAttachment.result?.map((item, index) => ({
          ...item,
          key: `multi-destination-attachment-${item.id}`,
          dataType: "exist"
        }));
        setDataAttachment([
          ...result,
        ])
      }

      setCurrent(0);
    }
  }

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
              <DetailText label="Account Number">{data_accountDetail?.accountSummary?.accountNumber}</DetailText>
              <DetailText label="Registration Number">{data_accountDetail?.accountSummary?.registrationNumber}</DetailText>
              <DetailText label="Account Name">{data_accountDetail?.accountSummary?.accountName}</DetailText>
              <DetailText label="Category">{data_accountDetail?.accountSummary?.category}</DetailText>
              <DetailText label="SOR">{data_accountDetail?.accountSummary?.sor}</DetailText>
              <DetailText label="Cost Center">{data_accountDetail?.accountSummary?.costCenter}</DetailText>
              <DetailText label="Meter Reading Codes">{renderDate(data_accountDetail?.accountSummary?.meterReadingCodes || "")}</DetailText>
              <DetailText label="Customer Management">{data_accountDetail?.accountSummary?.customerManagement}</DetailText>
              <DetailText label="Classification Type">{data_accountDetail?.accountSummary?.classificationType}</DetailText>
              <DetailText label="Segment">{data_accountDetail?.accountSummary?.segment}</DetailText>
              <DetailText label="Account Group Type">{data_accountDetail?.accountSummary?.accountGroupType}</DetailText>
              <DetailText label="Premise Address">{data_accountDetail?.accountSummary?.premiseAddress}</DetailText>
              <DetailText label="Subdistrict">{data_accountDetail?.accountSummary?.subdistrict}</DetailText>
              <DetailText label="District">{data_accountDetail?.accountSummary?.district}</DetailText>
              <DetailText label="City">{data_accountDetail?.accountSummary?.city}</DetailText>
              <DetailText label="Country">{data_accountDetail?.accountSummary?.country}</DetailText>
              <DetailText label="Longitude">{data_accountDetail?.accountSummary?.longitude}</DetailText>
              <DetailText label="Latitude">{data_accountDetail?.accountSummary?.latitude}</DetailText>
              <DetailText label="Status">{data_accountDetail?.accountSummary?.status}</DetailText>    
            </div>
          </div>
        </BaseContainer>

        <Form
          id="multiDestinationForm"
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
              onClick={()=>{navigate(-1)}}
            >
              Back
            </ButtonComponent>
            <div className="flex w-full justify-end gap-x-4">
              <ButtonComponent
                onClick={handleClear}
                type={"submit"}
                icon={<SVGIcon name="IconButtonClear" width={24} />}
              >
                { type === "update" ? "Reset" : "Clear" }
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
                <ButtonComponent
                  onClick={handleButtonNext}
                  type={"submit"}
                  disabled={steps[current].disabled}
                >
                  <div className="flex gap-x-2 items-center">
                    <span>Next</span>
                    <RightOutlined
                      style={{
                        justifyItems: "center",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </ButtonComponent>
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
          form={"multiDestinationForm"}
          isOpen={showConfirmationModal}
          handleCancel={() => handleSetShowConfirmationModal(false)}
          selectedAppHierId={selectedAppHierId}
          selectedApprovalName={selectedApprovalName}
          hierarchyTableData={(detail_mdApprovalHierarchy || []).map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          hieararchyOptionData={data_mdApprovalHierarchy}
          type={confirmationType}
          dataAttachment={dataAttachment}
          data={formCreate.getFieldsValue()}
          service={accountManagementService}
          configApplication={configApp.ACCOUNT_SERVICE}
        />
      </div>
    </LayoutMenu>
  );
};

export default CreateUpdateMultiDestination;
