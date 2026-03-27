import React, { useState, useEffect } from 'react'
import NxTabs from '../../../../../../../../../components/Nx/NxTabs';
import NxBaseContainer from '../../../../../../../../../components/Nx/NxBaseContainer';
import ModalCustom from '../../../../../../../../../components/Modal/ModalCustom';
import ButtonComponent from '../../../../../../../../../components/ButtonComponent';
import DetailText from '../../../../../../../../../components/DetailText';
import TableApproval from './TableApproval';
import TableAttachment from './TableAttachment';
import TabsDetail from './TabsDetail';
import moment from 'moment';
import { dateFormatting } from '../../../../../../../../../utils';
import { useSelector } from 'react-redux';
import TableDetail from './TabsDetail/TableDetail';

const ConfirmationSa = ({
  isOpen,
  dataFinal,
  setModalConfirm,
  handleConfirm,
  loadingSubmit = false,
  listDataAttachment,
  saInfoObj,
  saDetailObj,
  saApprovalObj,
  dataTableApproval,
  appHierDataDetail,
  dataTableProduct,
  dataPricing,
  dataTableCalcRule,
  dataTermOfService,
  dataTableLateCharge,
  dataTaxImplication,
  dataListVersion,
  saRecordData,
  location
}) => {
  const approvalStatus = location?.state?.approvalStatus
  const status = location?.state?.status
  // Selector Slice
  const {
    data_service_type,
    data_sa_type = [],
    data_sa_child_type = [],
    data_pjbg = [],
    data_term_of_payment,
    data_billing_cycle,
    data_invoice_template,
    data_approval_list,
  } = useSelector((state) => state.accountServiceAgreement);


  const [valuePage, setValuePage] = useState("saInfo");
  const [disabledTabs, setDisabledTabs] = useState([]);

  const tabKeys = ["saInfo", "saDetail", "approval", "attachment"];
  const enabledTabKeys = tabKeys.filter((key) => !disabledTabs.includes(key));
  const activeTabIndex = enabledTabKeys.indexOf(valuePage);
  const isLastTab = activeTabIndex === enabledTabKeys.length - 1;

  useEffect(() => {
    if (approvalStatus === "DRAFT" && status === "ACTIVE") {
      setDisabledTabs(["saDetail"]);
      return;
    }

    setDisabledTabs([]);
  }, [approvalStatus, status]);

  useEffect(() => {
    if (!isOpen) {
      setValuePage("saInfo");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!enabledTabKeys.includes(valuePage)) {
      setValuePage(enabledTabKeys[0] || "saInfo");
    }
  }, [enabledTabKeys, valuePage]);

  const handleNextTab = () => {
    if (isLastTab) {
      return;
    }

    setValuePage(enabledTabKeys[activeTabIndex + 1]);
  };

  const handlePrevTab = () => {
    if (activeTabIndex <= 0) {
      return;
    }

    setValuePage(enabledTabKeys[activeTabIndex - 1]);
  };

  const getSaTypeName = (val) => {
    const saTypeName = data_sa_type && data_sa_type?.filter((item) => item?.id === val)
    if (saTypeName === undefined) {
      return ''
    }
    if (saTypeName.length !== 0) {
      return saTypeName[0].name
    }
  }
  const getServiceTypeName = (val) => {
    const ServiceTypeName = data_service_type && data_service_type?.filter((item) => item?.id === val)
    if (ServiceTypeName === undefined) {
      return ''
    }
    if (ServiceTypeName.length !== 0) {
      return ServiceTypeName[0].name
    }
  }
  const getPjbgName = (val) => {
    const PjbgName = data_pjbg && data_pjbg?.filter((item) => item?.id === val)
    if (PjbgName === undefined) {
      return ''
    }
    if (PjbgName.length !== 0) {
      return PjbgName[0].name
    }
  }

  const getBillingCycleName = (val) => {
    const BillingCycleName = data_billing_cycle && data_billing_cycle?.filter((item) => item?.id === val)
    if (BillingCycleName === undefined) {
      return ''
    }
    if (BillingCycleName.length !== 0) {
      return BillingCycleName[0].name
    }
  }

  const getInvoiceName = (val) => {
    const InvoiceName = data_invoice_template && data_invoice_template?.filter((item) => item?.id === val)
    if (InvoiceName === undefined) {
      return ''
    }
    if (InvoiceName.length !== 0) {
      return InvoiceName[0].invoiceName
    }
  }

  const getTermsName = (val) => {
    const TermsPaymentName = data_term_of_payment && data_term_of_payment?.filter((item) => item?.termsOfPaymentId === val)
    if (TermsPaymentName === undefined) {
      return ''
    }
    if (TermsPaymentName.length !== 0) {
      return TermsPaymentName[0].termsOfPaymentName
    }
  }

  const getApprovalName = (val) => {
    const ApprovalName = data_approval_list && data_approval_list?.filter((item) => item?.appHierId === val)
    if (ApprovalName === undefined) {
      return ''
    }
    if (ApprovalName.length !== 0) {
      return ApprovalName[0].approvalName
    }
  }

  const getListVersionname = (val) => {
    const ListVersionName = dataListVersion && dataListVersion?.filter((item) => item?.id === val)
    if (ListVersionName === undefined) {
      return ''
    }
    if (ListVersionName.length !== 0) {
      return ListVersionName[0].name
    }
  }

  // useEffect(() => {
  //   console.log("saRecordData", saRecordData)
  //   console.log("saInfoObj", saInfoObj)
  // }, [])


  return (
    <div>
      <ModalCustom
        hidePadding={true}
        isOpen={isOpen}
        handleCancel={() => setModalConfirm(false)}
        type="confirmation"
        header="CONFIRMATION"
        width={1000}
        footer={
          <div className={"w-full flex justify-between gap-5"}>
            <ButtonComponent type={"default"} onClick={() => setModalConfirm(false)} disabled={loadingSubmit}>
              Cancel
            </ButtonComponent>
            <div className="flex gap-2">
              <ButtonComponent type={"default"} onClick={handlePrevTab} disabled={loadingSubmit || activeTabIndex <= 0}>
                Previous
              </ButtonComponent>
              {!isLastTab && (
                <ButtonComponent type={"submit"} border={false} onClick={handleNextTab} disabled={loadingSubmit}>
                  Next
                </ButtonComponent>
              )}
              {isLastTab && (
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  onClick={handleConfirm}
                  disabled={loadingSubmit}
                  loading={loadingSubmit}
                >
                  Submit
                </ButtonComponent>
              )}
            </div>
          </div>
        }
      >
        <NxTabs
          activeKey={valuePage}
          onChange={(key) => {
            if (!loadingSubmit) {
              setValuePage(key);
            }
          }}
          items={[
            {
              key: "saInfo",
              label: "Service Agreement Information",
              children: (
                <div className="flex flex-col gap-y-4">
                  {/* SA INFORMATION */}
                  <NxBaseContainer border header={"SERVICE AGREEMENT INFORMATION"}>
                    <div className="grid grid-cols-3 gap-5">
                      <DetailText label="Service Type">{getServiceTypeName(dataFinal?.saInfo?.serviceType)}</DetailText>
                      <DetailText label="Service Agreement Reference Number">{dataFinal?.saInfo?.saReferenceNumber || "-"}</DetailText>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <DetailText label="Service Agreement Number">{dataFinal?.saInfo?.saNumber}</DetailText>
                      <DetailText label="Service Agreement Type">{getSaTypeName(dataFinal?.saInfo?.saType)}</DetailText>
                      <DetailText label="PJBG Type">{getPjbgName(dataFinal?.saInfo?.pjbgType)}</DetailText>
                      <DetailText label="Service Agreement Date">{dataFinal?.saInfo?.saDate ? moment(dataFinal?.saInfo?.saDate).format(dateFormatting.date) : ''}</DetailText>
                      <DetailText label="Start Date">{dataFinal?.saInfo?.startDate ? moment(dataFinal?.saInfo?.startDate).format(dateFormatting.date) : ''}</DetailText>
                      <DetailText label="End Date">{dataFinal?.saInfo?.endDate ? moment(dataFinal?.saInfo?.endDate).format(dateFormatting.date) : ''}</DetailText>
                      {dataFinal?.isMain && (
                        <>
                          <DetailText label="Commitment Date">
                            {dataFinal?.saInfo?.commitmentDate ? moment(dataFinal?.saInfo?.commitmentDate).format(dateFormatting.date) : ''}
                          </DetailText>
                          <DetailText label="Already Gas In">{dataFinal?.saInfo?.alreadyGasIn === true ? "Yes" : 'No'}</DetailText>
                          <DetailText label="Gas In Plan Date">{dataFinal?.saInfo?.gasInPlanDate ? moment(dataFinal?.saInfo?.gasInPlanDate).format(dateFormatting.date) : ''}</DetailText>
                        </>
                      )}
                    </div>
                    <div className='w-full'>
                      <DetailText label="Description">{dataFinal?.saInfo?.description}</DetailText>
                    </div>
                  </NxBaseContainer>

                  {/* BILLING AND PAYMENT INFORMATION */}
                  {!(saInfoObj?.serviceAgreementTypeValue === "ADDON") && (
                    <NxBaseContainer border header={"BILLING & PAYMENT INFORMATION"}>
                      <div className="grid grid-cols-3 gap-5">
                        <DetailText label="Billing Cycle">{getBillingCycleName(dataFinal?.saInfo?.billingCycle)}</DetailText>
                        <DetailText label="Term Of Payment">{getTermsName(dataFinal?.saInfo?.termOfPayment)}</DetailText>
                        <DetailText label="Invoice Template">{getInvoiceName(dataFinal?.saInfo?.invoiceTemplate)}</DetailText>
                      </div>
                    </NxBaseContainer>
                  )}
                </div>
              ),
            },
            {
              key: "saDetail",
              label: "Service Agreement Detail",
              disabled: disabledTabs.includes("saDetail"),
              children: (
                <div className="flex flex-col gap-y-4">
                  <NxBaseContainer border header={"CREATE FROM"}>
                    <div className="grid grid-cols-3 gap-5">
                      <DetailText label="Create From">{saDetailObj?.createFrom === 1 ? "Product" : "Custom"}</DetailText>
                      {/* SA Child Type */}
                      {(saInfoObj?.serviceAgreementTypeValue === "ADDON" || saInfoObj?.serviceAgreementTypeValue === "OTHERS") && (
                        <DetailText label="Service Agreement Child Type">
                          {saInfoObj?.serviceAgreementTypeValue === "ADDON"
                            ? (saDetailObj?.serviceAgreementChildType || "-")
                            : (data_sa_child_type?.find(item => item.id === saDetailObj?.serviceAgreementChildType)?.value || "-")
                          }
                        </DetailText>
                      )}

                      {saDetailObj?.createFrom === 1 && (
                        <>
                          <DetailText label="Choose Product">{saDetailObj?.productName}</DetailText></>
                      )}
                    </div>
                  </NxBaseContainer>
                  <NxBaseContainer border header={"SERVICE AGREEMENT DETAIL"}>
                    {/* {saDetailObj?.productVersionId && ( */}
                    <>
                      <div className="grid grid-cols-3 gap-5">
                        {saDetailObj?.createFrom === 1 && (
                          <>
                            <DetailText label="Product">{saDetailObj?.productName}</DetailText>
                            <DetailText label="Service Type">{saDetailObj?.serviceTypeProduct}</DetailText>
                            <DetailText label="Product Class">{saDetailObj?.productClass}</DetailText>
                            <DetailText label="Product Version">{getListVersionname(saDetailObj?.productVersionId)}</DetailText>
                            <DetailText label="Description">{saDetailObj?.description}</DetailText>
                          </>
                        )}
                      </div>

                    </>
                    {/* )} */}
                  </NxBaseContainer>
                  <NxBaseContainer border header={"PAYMENT INFORMATION"}>
                    <div>
                      <TableDetail dataTableProduct={dataTableProduct} saDetailObj={saDetailObj} />
                    </div>
                  </NxBaseContainer>
                  <NxBaseContainer border header={"PRICING INFORMATION"}>
                    <TabsDetail
                      appHierDataDetail={appHierDataDetail}
                      dataTableProduct={dataTableProduct}
                      dataPricing={dataPricing}
                      dataTableCalcRule={dataTableCalcRule}
                      dataTermOfService={dataTermOfService}
                      dataTableLateCharge={dataTableLateCharge}
                      dataTaxImplication={dataTaxImplication}
                      saDetailObj={saDetailObj}
                    />
                  </NxBaseContainer>
                </div>
              ),
            },
            {
              key: "approval",
              label: "Approval",
              children: (
                <NxBaseContainer border header={"APPROVAL"}>
                  <div className="grid grid-cols-3 gap-5">
                    <DetailText label="Approval Hierarchy">{getApprovalName(saApprovalObj?.appHierId)}</DetailText>
                  </div>
                  <div className='w-full'>
                    <TableApproval data={dataTableApproval} />
                  </div>
                </NxBaseContainer>
              ),
            },
            {
              key: "attachment",
              label: "Attachment",
              children: (
                <NxBaseContainer border header={"ATTACHMENT"}>
                  <div className='w-full'>
                    <TableAttachment saRecordData={saRecordData} data={listDataAttachment} />
                  </div>
                </NxBaseContainer>
              ),
            },
          ]}
        />
      </ModalCustom>
    </div>
  )
}

export default ConfirmationSa
