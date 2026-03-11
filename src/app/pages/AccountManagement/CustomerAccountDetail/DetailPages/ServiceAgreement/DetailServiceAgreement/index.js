import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment'

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import ServiceAgreementDetailCompoment from "./ServiceAgreementDetailCompoment";
import Warranty from "./Warranty";
import TosSubmission from "./TosSubmission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import HeaderDetail from "../../../HeaderDetail";
import { approveOrRejectInactiveServiceAgreement, approveOrRejectServiceAgreement, getDetailServiceAgreement, getDetailServiceAgreementDraft } from "../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import { Spin, Form } from "antd";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import ModalErrorApproveOrRejectServiceAgreement from "./Modal/ModalErrorApproveOrRejectServiceAgreement";
import { dateFormatting } from "../../../../../../../utils";
import { usePrevLocContext } from "../../../../../../../utils/usePrevLoc";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../../../components/Nx/NxTabs";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import Attachment from "./Attachment";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import ServiceAgreementHistoryLogInformation from "../shared/HistoryLogInformation";

const DetailServiceAgreement = () => {
  const { path } = usePrevLocContext();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data_detail, data_detail_draft, loading, message } = useSelector(
    (state) => state.accountServiceAgreement
  );
  //declare
  const location = useLocation();
  const idSA = location?.state?.idSA;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type;
  const statusSa = data_detail?.saInfo?.status;

  // Single active tab key for all 4 tabs
  const [activeTab, setActiveTab] = useState("saInformation");

  // Modal Approve Or Reject SA
  const [modalError, setModalError] = useState(false);
  const [modalApproveOrReject, setModalApproveOrReject] = useState('')
  const [approveOrReject, setApproveOrReject] = useState('')
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: null,
  });
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;

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
        }
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
        breadcrumbName: "Service Agreement Detail",
      },
    ]
  }

  useEffect(() => {
    if (
      path && (
        path.pathname.includes("/account-management/account-standard/service-agreement/tos/create") ||
        path.pathname.includes("/account-management/account-standard/service-agreement/tos/view") ||
        path.pathname.includes("/account-management/account-standard/service-agreement/tos/update")
      )
    ) {
      setActiveTab("tosSubmission");
    } else {
      setActiveTab("saInformation");
    }
  }, [path])

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
        console.log(error)
      });

    dispatch(getDetailServiceAgreementDraft(idSA))
      .unwrap()
      .then((res) => {
      })
      .catch((error) => {
        console.log(error)
      });
  }, [dispatch, idSA]);


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
    };
    const data = {
      saId: idSA,
      description: formValue.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject.toUpperCase(),
    };
    if (bodyApproval.approvalType === "SERVICE_AGREEMENT" || bodyApproval.approvalType === "UPDATE_SERVICE_AGREEMENT") {
      dispatch(
        approveOrRejectServiceAgreement({
          body: data,
          responseSuccess:
            approveOrReject === "Approve" ? successApprove : successReject,
        })
      )
        .unwrap()
        .then(() => {
          handleClear()
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
        })
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

  }
  const handleCancel = () => {
    setModalApproveOrReject(false);
  };


  // SA Information content
  const renderSaInformation = () => (
    <div className="flex flex-col gap-y-4">
      <NxBaseContainer border={true} header={"SERVICE AGREEMENT INFORMATION"}>
        <div className="flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Service Type"}>{data_detail?.saInfo?.saServiceType}</NxDetailText>
            {
              data_detail?.saInfo?.saReferenceNumber && (
                <NxDetailText label={"Service Agreement Reference Number"}>{data_detail?.saInfo?.saReferenceNumber}</NxDetailText>
              )
            }
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Service Agreement Number"} className={"break-all whitespace-normal"}>{data_detail?.saInfo?.saNumber}</NxDetailText>
            <NxDetailText label={"Service Agreement Type"}>{data_detail?.saInfo?.saType}</NxDetailText>
            <NxDetailText label={"PJBG Type"}>{data_detail?.saInfo?.pjbgType}</NxDetailText>

          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Service Agreement Date"}>{data_detail?.saInfo?.saDate ? moment(data_detail?.saInfo?.saDate).format(dateFormatting.date) : ''}</NxDetailText>
            <NxDetailText label={"Start Date"}>{data_detail?.saInfo?.startDate ? moment(data_detail?.saInfo?.startDate).format(dateFormatting.date) : ''}</NxDetailText>
            <NxDetailText label={"End Date"}>{data_detail?.saInfo?.endDate ? moment(data_detail?.saInfo?.endDate).format(dateFormatting.date) : ''}</NxDetailText>
          </div>
          {data_detail?.saInfo?.isMain === "Y" && (
            <div className="w-full grid grid-cols-3 gap-4">
              <NxDetailText label={"Already Gas In"}>{data_detail?.saInfo?.alreadyGasIn ? 'Yes' : 'No'}</NxDetailText>
              <NxDetailText label={"Gas In Plan Date"}>{data_detail?.saInfo?.gasInPlanDate ? moment(data_detail?.saInfo?.gasInPlanDate).format(dateFormatting.date) : '-'}</NxDetailText>
              <NxDetailText label={"Commitment Date"}>{data_detail?.saInfo?.comitmentDate ? moment(data_detail?.saInfo?.comitmentDate).format(dateFormatting.date) : '-'}</NxDetailText>
            </div>
          )}

          {/* <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"Status"}>{data_detail?.saInfo?.status && convertToNormalcase(data_detail?.saInfo?.status)}</DetailText>
            <DetailText label={"Status Approval"}>{data_detail?.saHistory?.approvalStatus && convertToNormalcase(data_detail?.saHistory?.approvalStatus)}</DetailText>
          </div> */}

          <div className="w-full grid grid-cols-1 gap-4">
            <NxDetailText label={"Description"}>{data_detail?.saInfo?.description}</NxDetailText>
            </div>
        </div>
      </NxBaseContainer>
      <NxBaseContainer border={true} header={"BILING & PAYMENT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label={"Billing Cycle"}>{data_detail?.saInfo?.billingCycle}</NxDetailText>
          <NxDetailText label={"Term of Payment"}>{data_detail?.saInfo?.termsOfPaymentName}</NxDetailText>
          <NxDetailText label={"Invoce Template"}>{data_detail?.saInfo?.invoiceTemplate}</NxDetailText>
        </div>
      </NxBaseContainer>

      {/* Draft Section — kept as-is, shown below SA info when draft data exists */}
      {/* {data_detail_draft && (
        <div>
          <DraftComponent dataDetailDraft={data_detail_draft} />
        </div>
      )} */}
    </div>
  );

  const dataAttachment = (data_detail?.attachment || []).map(
    (item) => {
      return {
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.type,
        category: item.fileCategoryName,
        categoryName: item.categoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        uploadBy: item.createdBy,
        uploadDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY HH:mm:ss")
          : "",
        dataType: "exist",
      };
    }
  );

  const tabItems = [
    {
      key: "saInformation",
      label: "Service Agreement Information",
      children: renderSaInformation(),
    },
    {
      key: "saDetail",
      label: "Service Agreement Detail",
      children: (
        <ServiceAgreementDetailCompoment
          data={data_detail}
          dataDraft={data_detail_draft}
          idAccount={idAccount}
          idCustomer={idCustomer}
          type={type}
          idSA={idSA}
        />
      ),
    },
    {
      key: "warranty",
      label: "Warranty",
      disabled: true,
      children: <Warranty />,
    },
    {
      key: "tosSubmission",
      label: "TOS Submission",
      disabled: statusSa !== "ACTIVE",
      children: (
        <TosSubmission
          idSA={idSA}
          idAccount={idAccount}
          idCustomer={idCustomer}
          type={type}
          dataDetailSA={data_detail}
        />
      ),
    },
    {
      key: "historyUpdate",
      label: "History Update",
      children: (
        <>
        </>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <>
          <NxBaseContainer border={true}>
            <Attachment
              dataSource={dataAttachment}
            />
          </NxBaseContainer>
        </>
      ),
    }
  ];

  return (
    <div>
      <LayoutMenu>
        <Spin spinning={loading}>
          <div className="flex flex-col gap-y-4">
            {/* <BreadCrumbAdvanced routes={routes(location?.state)} /> */}
            <NxBreadCrumb routes={routes(location?.state)} />
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={idAccount}
              idCustomer={idCustomer}
              type={type}
            />

            {/* Card Requested Information */}
            {data_detail?.approvalDetail !== null && data_detail?.isApprover === true && (
              <NxCardContainer
                header={
                  data_detail?.approvalDetail.type === 'inactive' ?
                    'INACTIVE REQUEST INFORMATION' :
                    data_detail?.approvalDetail.type === 'create' ?
                      'CREATE REQUEST INFORMATION' :
                      'UPDATE REQUEST INFORMATION'
                }
              >
                <div className="w-full grid grid-cols-4 gap-3">
                  <NxDetailText label={"Requested Date"}>{data_detail?.approvalDetail?.requestedDate ? moment(data_detail?.approvalDetail?.requestedDate).format(dateFormatting.dateTime) : ''}</NxDetailText>
                  <NxDetailText label={"Requested By"}>{data_detail?.approvalDetail?.requestedBy}</NxDetailText>
                  {data_detail?.approvalDetail.type === 'inactive' && (
                    <NxDetailText label={"Remarks"}>{data_detail?.approvalDetail?.remarks}</NxDetailText>
                  )}
                </div>
              </NxCardContainer>
            )}

            {/* Single unified card with NxTabs */}
            <NxCardContainer header={"DETAIL INFORMATION"} withoutPadding>
              <NxTabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={tabItems}
              />
            </NxCardContainer>

            <ServiceAgreementHistoryLogInformation
              showRecordId
              historyData={{
                recordId: data_detail?.saHistory?.saId,
                createdDate: data_detail?.saHistory?.createdDate
                  ? moment(data_detail?.saHistory?.createdDate).format(dateFormatting.dateTime)
                  : "",
                createdBy: data_detail?.saHistory?.createdBy,
                updatedDate: data_detail?.saHistory?.updateDate
                  ? moment(data_detail?.saHistory?.updateDate).format(dateFormatting.dateTime)
                  : "",
                updatedBy: data_detail?.saHistory?.updatedBy,
              }}
            />

            <>
              <ButtonComponent
                type={"menu"}
                className="!w-fit"
                onClick={() => navigate(-1)}
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
            </>
          </div>
        </Spin>

        {/* ModalConfirmation Approve Or Reject SA */}
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
