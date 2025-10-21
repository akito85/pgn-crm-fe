import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import DetailText from "../../../../../../../components/DetailText";
import RadioTabs from "../../../../../../../components/RadioTabs";
import ServiceAgreementDetailCompoment from "./ServiceAgreementDetailCompoment";
import Attachment from "./Attachment";
import Warranty from "./Warranty";
import TosSubmission from "./TosSubmission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import HeaderDetail from "../../../HeaderDetail";
import {
  approveOrRejectInactiveServiceAgreement,
  approveOrRejectServiceAgreement,
  getDetailServiceAgreement,
  getDetailServiceAgreementDraft,
} from "../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import { Spin, Form } from "antd";
// import ModalApproveOrRejectSa from "./Modal/ModalApproveOrRejectSa";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import ModalErrorApproveOrRejectServiceAgreement from "./Modal/ModalErrorApproveOrRejectServiceAgreement";
import BaseContainer from "../../../../../../../components/BaseContainer";
import { dateFormatting, hasValue } from "../../../../../../../utils";
import DraftComponent from "./ServiceAgreementDetailCompoment/DraftComponent";
import { usePrevLocContext } from "../../../../../../../utils/usePrevLoc";

const DetailServiceAgreement = () => {
  const { path } = usePrevLocContext();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data_detail, data_detail_draft, loading, message } = useSelector(
    (state) => state.accountServiceAgreement,
  );
  //declare
  const location = useLocation();
  const idSA = location?.state?.idSA;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type;
  const statusSa = data_detail?.saInfo?.status;

  const optionTab = [
    { value: "Service Agreement Detail" },
    // { value: "Attachment" },
    { value: "Warranty", disabled: true },
    { value: "TOS Submission", disabled: statusSa !== "ACTIVE" ? true : false },
  ];
  const [typeServiceAgreementSec, setTypeServiceAgreementSec] = useState(
    optionTab[0].value,
  );
  // Tab Sa Origin/Draft
  const [valuePage, setValuePage] = useState("Service Agreement Information");
  const [tabPagesSaDetail, setTabPagesSaDetail] = useState([
    { value: "Service Agreement Information" },
    { value: "Draft" },
  ]);

  // Modal Approve Or Reject SA
  const [modalError, setModalError] = useState(false);
  const [modalApproveOrReject, setModalApproveOrReject] = useState("");
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

  const handleChangeOption = (e) => {
    setTypeServiceAgreementSec(e.target.value);
  };

  const routes = (item) => {
    return [
      {
        path: "",
        breadcrumbName: "Account Management",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_CUSTOMER,
        breadcrumbName: "Customer/Account",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
        breadcrumbName: "Detail Customer",
        state: {
          idAccount: item.idAccount,
        },
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
        breadcrumbName: "Service Agreement Detail",
      },
    ];
  };

  const dataTabs = {
    serviceAgreementDetail: "Service Agreement Detail",
    // attachement: "Attachment",
    // warranty: "Warranty",
    tosSubmission: "TOS Submission",
  };
  const renderSection = () => {
    switch (typeServiceAgreementSec) {
      case dataTabs.serviceAgreementDetail:
        return (
          <ServiceAgreementDetailCompoment
            data={data_detail}
            dataDraft={data_detail_draft}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            idSA={idSA}
          />
        );
      case dataTabs.warranty:
        return <Warranty />;
      case dataTabs.tosSubmission:
        return (
          <TosSubmission
            idSA={idSA}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            dataDetailSA={data_detail}
          />
        );
      // case dataTabs.attachement:
      //   return <Attachment/>;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/service-agreement/tos/create",
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement/tos/view",
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement/tos/update",
        ))
    ) {
      setTypeServiceAgreementSec(dataTabs.tosSubmission);
    } else {
      setTypeServiceAgreementSec(dataTabs.serviceAgreementDetail);
    }
  }, [dataTabs.serviceAgreementDetail, dataTabs.tosSubmission, path]);

  useEffect(() => {
    dispatch(getDetailServiceAgreement(idSA))
      .unwrap()
      .then((res) => {
        if (res) {
          setBodyApproval({
            isApprover: res?.isApprover,
            tappId: res?.tappId,
            approvalDetail: res?.approvalDetail,
            approvalType: res?.approvalType,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    dispatch(getDetailServiceAgreementDraft(idSA))
      .unwrap()
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, idSA]);

  useEffect(() => {
    if (hasValue(data_detail_draft) === false) {
      setTabPagesSaDetail((prevState) =>
        prevState?.filter((item) => item?.value !== "Draft"),
      );
    } else {
      setTabPagesSaDetail([
        { value: "Service Agreement Information" },
        { value: "Draft" },
      ]);
    }
  }, [data_detail_draft]);

  // handle confirm
  const handleConfirm = (formValue, handleClear) => {
    setModalApproveOrReject(false);
    const successApprove = {
      title: `Successful`,
      description: `Your data has been approved.`,
      width: 500,
    };
    const successReject = {
      title: `Successful`,
      description: `Your data has been rejected.`,
      width: 700,
      // alertDescription: `Warning! if you reject this data, you will need to request approval again.`,
    };
    const data = {
      saId: idSA,
      description: formValue.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };
    if (
      bodyApproval.approvalType === "SERVICE_AGREEMENT" ||
      bodyApproval.approvalType === "UPDATE_SERVICE_AGREEMENT"
    ) {
      dispatch(
        approveOrRejectServiceAgreement({
          body: data,
          responseSuccess:
            approveOrReject === "Approve" ? successApprove : successReject,
        }),
      )
        .unwrap()
        .then(() => {
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            setModalError(true);
            form.resetFields();
          }
        });
    } else {
      dispatch(
        approveOrRejectInactiveServiceAgreement({
          body: data,
          responseSuccess:
            approveOrReject === "Approve" ? successApprove : successReject,
        }),
      )
        .unwrap()
        .then(() => {
          form.resetFields();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            setModalError(true);
            form.resetFields();
          }
        });
    }
  };
  const handleCancel = () => {
    setModalApproveOrReject(false);
    // form.resetFields();
  };

  function convertToNormalcase(inputText) {
    return inputText
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Handle Change Radio Tabs
  const onChangeTabInfo = (e) => {
    setValuePage(e.target.value);
  };
  return (
    <div>
      <LayoutMenu>
        <Spin spinning={loading}>
          <BreadCrumbAdvanced routes={routes(location?.state)} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
          />

          {/* Card Requested Information */}
          {data_detail?.approvalDetail !== null &&
            data_detail?.isApprover === true && (
              <BaseContainer
                header={
                  data_detail?.approvalDetail.type == "inactive"
                    ? "INACTIVE REQUEST INFORMATION"
                    : data_detail?.approvalDetail.type == "create"
                      ? "CREATE REQUEST INFORMATION"
                      : "UPDATE REQUEST INFORMATION"
                }
              >
                <div className="w-full grid grid-cols-4 gap-3">
                  <DetailText label={"Requested Date"}>
                    {data_detail?.approvalDetail?.requestedDate
                      ? moment(
                          data_detail?.approvalDetail?.requestedDate,
                        ).format(dateFormatting.dateTime)
                      : ""}
                  </DetailText>
                  <DetailText label={"Requested By"}>
                    {data_detail?.approvalDetail?.requestedBy}
                  </DetailText>
                  {data_detail?.approvalDetail.type == "inactive" && (
                    <DetailText label={"Remarks"}>
                      {data_detail?.approvalDetail?.remarks}
                    </DetailText>
                  )}
                </div>
              </BaseContainer>
            )}

          <BaseContainer
            type={"tabs"}
            element={
              <RadioTabs data={tabPagesSaDetail} onChange={onChangeTabInfo} />
            }
          >
            {/* SA INFO ORIGIN */}
            <div
              className={`${valuePage !== "Service Agreement Information" ? "hidden" : ""}`}
            >
              {/* {data_detail?.saInfo?.saReferenceNumber !== null &&
                <div>
                  <div className="py-4 text-primary text-xs font-bold uppercase">
                    SERVICE AGREEMENT REFERENCE NUMBER
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4">
                    <DetailText label={"Service Agreement Reference Number"} className={"break-all whitespace-normal"}>{data_detail?.saInfo?.saReferenceNumber}</DetailText>
                  </div>
                </div>
              }  */}
              <div>
                <div className="py-4 text-primary text-xs font-bold uppercase">
                  SERVICE AGREEMENT INFORMATION
                </div>
                <div className="w-full grid grid-cols-4 gap-4">
                  <DetailText
                    label={"Service Agreement Number"}
                    className={"break-all whitespace-normal"}
                  >
                    {data_detail?.saInfo?.saNumber}
                  </DetailText>
                  <DetailText label={"Service Agreement Reference Number"}>
                    {data_detail?.saInfo?.saReferenceNumber}
                  </DetailText>
                  <DetailText label={"Service Agreement Type"}>
                    {data_detail?.saInfo?.saType}
                  </DetailText>
                  <DetailText label={"PJBG Type"}>
                    {data_detail?.saInfo?.pjbgType}
                  </DetailText>
                  <DetailText label={"Service Agreement Date"}>
                    {data_detail?.saInfo?.saDate
                      ? moment(data_detail?.saInfo?.saDate).format(
                          dateFormatting.date,
                        )
                      : ""}
                  </DetailText>
                  <DetailText label={"Start Date"}>
                    {data_detail?.saInfo?.startDate
                      ? moment(data_detail?.saInfo?.startDate).format(
                          dateFormatting.date,
                        )
                      : ""}
                  </DetailText>
                  <DetailText label={"End Date"}>
                    {data_detail?.saInfo?.endDate
                      ? moment(data_detail?.saInfo?.endDate).format(
                          dateFormatting.date,
                        )
                      : ""}
                  </DetailText>
                  <DetailText label={"Commitment Date"}>
                    {data_detail?.saInfo?.comitmentDate
                      ? moment(data_detail?.saInfo?.comitmentDate).format(
                          dateFormatting.date,
                        )
                      : ""}
                  </DetailText>
                  <DetailText label={"Status"}>
                    {data_detail?.saInfo?.status &&
                      convertToNormalcase(data_detail?.saInfo?.status)}
                  </DetailText>
                  <DetailText label={"Status Approval"}>
                    {data_detail?.saHistory?.approvalStatus &&
                      convertToNormalcase(
                        data_detail?.saHistory?.approvalStatus,
                      )}
                  </DetailText>
                  <div className="col-span-4">
                    <DetailText label={"Description"}>
                      {data_detail?.saInfo?.description}
                    </DetailText>
                  </div>
                </div>
              </div>
              <div>
                <div className="py-4 text-primary text-xs font-bold uppercase">
                  BILING & PAYMENT INFORMATION
                </div>
                <div className="w-full grid grid-cols-4 gap-4">
                  <DetailText label={"Billing Cycle"}>
                    {data_detail?.saInfo?.billingCycle}
                  </DetailText>
                  <DetailText label={"Term of Payment"}>
                    {data_detail?.saInfo?.termsOfPaymentName}
                  </DetailText>
                  <DetailText label={"Invoce Template"}>
                    {data_detail?.saInfo?.invoiceTemplate}
                  </DetailText>
                </div>
              </div>
              <div>
                <div className="py-4 text-primary text-xs font-bold uppercase">
                  GAS INFORMATION
                </div>
                <div className="w-full grid grid-cols-4 gap-4">
                  <DetailText label={"Gas In Plan Date"}>
                    {data_detail?.saInfo?.gasInPlanDate
                      ? moment(data_detail?.saInfo?.gasInPlanDate).format(
                          dateFormatting.date,
                        )
                      : ""}
                  </DetailText>
                  <DetailText label={"Already Gas In"}>
                    {data_detail?.saInfo?.alreadyGasIn ? "Yes" : "No"}
                  </DetailText>
                </div>
              </div>
            </div>

            {/* SA INFO DRAFT */}
            {data_detail_draft && (
              <div className={`${valuePage !== "Draft" ? "hidden" : ""}`}>
                <DraftComponent dataDetailDraft={data_detail_draft} />
              </div>
            )}
          </BaseContainer>

          {/* Tabs  */}
          <div className="pt-8 pb-1">
            <RadioTabs
              currentPosition={typeServiceAgreementSec}
              data={optionTab}
              onChange={handleChangeOption}
            />
          </div>
          {renderSection()}
          <div className="my-5 flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>
            {showButtonApproval ? (
              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type="reject"
                  onClick={() => {
                    setModalApproveOrReject(true);
                    setApproveOrReject("Reject");
                  }}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  onClick={() => {
                    setModalApproveOrReject(true);
                    setApproveOrReject("Approve");
                  }}
                >
                  Approve
                </ButtonComponent>
              </div>
            ) : null}
          </div>
        </Spin>

        {/* ModalCOnfirmation Approve Or Reject SA */}
        {/* <ModalApproveOrRejectSa
          isOpen={modalApproveOrReject}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          handleCancel={() => handleCancel()}
          handleCancelFooter={() => handleCancel()}
          handleConfirmFooter={handleConfirm}
          remark={remark}
          onChange={(e) => setRemark(e.target.value)}
          form={form}
        /> */}
        <ModalApproveOrReject
          isOpen={modalApproveOrReject}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Service Agreement"}
          named={data_detail?.saInfo?.saNumber}
        />

        {/* Modal Error Approve/Reject */}
        <ModalErrorApproveOrRejectServiceAgreement
          isOpen={modalError}
          handleOk={() => {
            setModalError(false);
            handleConfirm();
          }}
          handleCancel={() => setModalError(false)}
          approveOrReject={approveOrReject}
          message={message}
        />
      </LayoutMenu>
    </div>
  );
};

export default DetailServiceAgreement;
