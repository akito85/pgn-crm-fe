import React, { useEffect, useState } from "react";
import RadioTabs from "../../../../../../../../../components/RadioTabs";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../../../components/DetailText";
import TableApproval from "./TableApproval";
import TableAttachment from "./TableAttachment";
import TabsDetail from "./TabsDetail";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../../utils";
import { useSelector } from "react-redux";
import TableDetail from "./TabsDetail/TableDetail";

const ConfirmationSa = ({
  isOpen,
  dataFinal,
  setModalConfirm,
  handleConfirm,
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
  location,
}) => {
  const approvalStatus = location?.state?.approvalStatus;
  const status = location?.state?.status;
  // Selector Slice
  const {
    data_service_type,
    data_sa_type = [],
    data_pjbg = [],
    data_term_of_payment,
    data_billing_cycle,
    data_invoice_template,
    data_approval_list,
    loading,
  } = useSelector((state) => state.accountServiceAgreement);

  const [valuePage, setValuePage] = useState("Service Agreement Information");
  const [tabPagesSa, setTabPagesSa] = useState([
    { value: "Service Agreement Information" },
    { value: "Service Agreement Detail" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  useEffect(() => {
    if (approvalStatus === "DRAFT" && status === "ACTIVE") {
      setTabPagesSa([
        { value: "Service Agreement Information" },
        { value: "Service Agreement Detail", disabled: true },
        { value: "Approval" },
        { value: "Attachment" },
      ]);
    }
  }, []);

  const getSaTypeName = (val) => {
    const saTypeName =
      data_sa_type && data_sa_type?.filter((item) => item?.id === val);
    if (saTypeName === undefined) {
      return "";
    }
    if (saTypeName.length !== 0) {
      return saTypeName[0].name;
    }
  };
  const getServiceTypeName = (val) => {
    const ServiceTypeName =
      data_service_type &&
      data_service_type?.filter((item) => item?.id === val);
    if (ServiceTypeName === undefined) {
      return "";
    }
    if (ServiceTypeName.length !== 0) {
      return ServiceTypeName[0].name;
    }
  };
  const getPjbgName = (val) => {
    const PjbgName = data_pjbg && data_pjbg?.filter((item) => item?.id === val);
    if (PjbgName === undefined) {
      return "";
    }
    if (PjbgName.length !== 0) {
      return PjbgName[0].name;
    }
  };

  const getBillingCycleName = (val) => {
    const BillingCycleName =
      data_billing_cycle &&
      data_billing_cycle?.filter((item) => item?.id === val);
    if (BillingCycleName === undefined) {
      return "";
    }
    if (BillingCycleName.length !== 0) {
      return BillingCycleName[0].name;
    }
  };

  const getInvoiceName = (val) => {
    const InvoiceName =
      data_invoice_template &&
      data_invoice_template?.filter((item) => item?.id === val);
    if (InvoiceName === undefined) {
      return "";
    }
    if (InvoiceName.length !== 0) {
      return InvoiceName[0].invoiceName;
    }
  };

  const getTermsName = (val) => {
    const TermsPaymentName =
      data_term_of_payment &&
      data_term_of_payment?.filter((item) => item?.termsOfPaymentId === val);
    if (TermsPaymentName === undefined) {
      return "";
    }
    if (TermsPaymentName.length !== 0) {
      return TermsPaymentName[0].termsOfPaymentName;
    }
  };

  const getApprovalName = (val) => {
    const ApprovalName =
      data_approval_list &&
      data_approval_list?.filter((item) => item?.appHierId === val);
    if (ApprovalName === undefined) {
      return "";
    }
    if (ApprovalName.length !== 0) {
      return ApprovalName[0].approvalName;
    }
  };

  const getListVersionname = (val) => {
    const ListVersionName =
      dataListVersion && dataListVersion?.filter((item) => item?.id === val);
    if (ListVersionName === undefined) {
      return "";
    }
    if (ListVersionName.length !== 0) {
      return ListVersionName[0].name;
    }
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        handleCancel={() => setModalConfirm(false)}
        type="confirmation"
        header="CONFIRMATION"
        width={1000}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => setModalConfirm(false)}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              border={false}
              onClick={handleConfirm}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <RadioTabs
          data={tabPagesSa}
          onChange={(e) => setValuePage(e.target.value)}
        />
        {/* Sa Info */}
        <div
          className={`${valuePage !== "Service Agreement Information" ? "hidden" : ""}`}
        >
          <div className="w-full p-5">
            <div>
              <span className="text-primary uppercase font-bold">
                SERVICE AGREEMENT INFORMATION
              </span>
            </div>
            <div className="grid grid-cols-2 gap-5 py-[1.25rem]">
              <DetailText label="Service Agreement Reference Number">
                {dataFinal?.saInfo?.saReferenceNumber || null}
              </DetailText>
            </div>
            <div className="grid grid-cols-4 gap-5 pb-[30px]">
              <DetailText label="Service Type">
                {getServiceTypeName(dataFinal?.saInfo?.serviceType)}
              </DetailText>
              <DetailText label="Service Agreement Number">
                {dataFinal?.saInfo?.saNumber}
              </DetailText>
              <DetailText label="Service Agreement Type">
                {getSaTypeName(dataFinal?.saInfo?.saType)}
              </DetailText>
              <DetailText label="PJBG Type">
                {getPjbgName(dataFinal?.saInfo?.pjbgType)}
              </DetailText>
              <DetailText label="Service Agreement Date">
                {dataFinal?.saInfo?.saDate
                  ? moment(dataFinal?.saInfo?.saDate).format(
                      dateFormatting.date,
                    )
                  : ""}
              </DetailText>
              <DetailText label="Start Date">
                {dataFinal?.saInfo?.startDate
                  ? moment(dataFinal?.saInfo?.startDate).format(
                      dateFormatting.date,
                    )
                  : ""}
              </DetailText>
              <DetailText label="End Date">
                {dataFinal?.saInfo?.endDate
                  ? moment(dataFinal?.saInfo?.endDate).format(
                      dateFormatting.date,
                    )
                  : ""}
              </DetailText>
              <DetailText label="Commitment Date">
                {dataFinal?.saInfo?.commitmentDate
                  ? moment(dataFinal?.saInfo?.commitmentDate).format(
                      dateFormatting.date,
                    )
                  : ""}
              </DetailText>
            </div>
            <div className="w-full">
              <DetailText label="Description">
                {dataFinal?.saInfo?.description}
              </DetailText>
            </div>
            <div>
              <span className="text-primary uppercase font-bold">
                BILLING AND PAYMENT INFORMATION
              </span>
            </div>
            <div className="grid grid-cols-4 gap-5 py-[30px]">
              <DetailText label="Billing Cycle">
                {getBillingCycleName(dataFinal?.saInfo?.billingCycle)}
              </DetailText>
              <DetailText label="Term Of Payment">
                {getTermsName(dataFinal?.saInfo?.termOfPayment)}
              </DetailText>
              <DetailText label="Invoice Template">
                {getInvoiceName(dataFinal?.saInfo?.invoiceTemplate)}
              </DetailText>
            </div>
            <div>
              <span className="text-primary uppercase font-bold">
                Gas In Information
              </span>
            </div>
            <div className="grid grid-cols-4 gap-5 pt-[30px]">
              <DetailText label="Gas In Plan Date">
                {dataFinal?.saInfo?.gasInPlanDate
                  ? moment(dataFinal?.saInfo?.gasInPlanDate).format(
                      dateFormatting.date,
                    )
                  : ""}
              </DetailText>
              <DetailText label="Already Gas In">
                {dataFinal?.saInfo?.alreadyGasIn ? "Yes" : "No"}
              </DetailText>
            </div>
          </div>
        </div>

        {/* Sa Detail */}
        <div
          className={`${valuePage !== "Service Agreement Detail" ? "hidden" : ""}`}
        >
          <div className="w-full p-5">
            <div>
              <span className="text-primary uppercase font-bold">
                SERVICE AGREEMENT DETAIL
              </span>
            </div>
            {/* {saDetailObj?.productVersionId && ( */}
            <div className="grid grid-cols-4 gap-5 pt-[30px]">
              <DetailText label="Create From">
                {saDetailObj?.createFrom === 1 ? "Product" : "Custom"}
              </DetailText>
              {saDetailObj?.createFrom === 1 && (
                <>
                  <DetailText label="Product">
                    {saDetailObj?.productName}
                  </DetailText>
                  <DetailText label="Product Type">
                    {saDetailObj?.productType}
                  </DetailText>
                  <DetailText label="Service Type">
                    {saDetailObj?.serviceTypeProduct}
                  </DetailText>
                  <DetailText label="Product Class">
                    {saDetailObj?.productClass}
                  </DetailText>
                  <DetailText label="Product Version">
                    {getListVersionname(saDetailObj?.productVersionId)}
                  </DetailText>
                  <DetailText label="Description">
                    {saDetailObj?.description}
                  </DetailText>
                </>
              )}
            </div>
            {/* )} */}
            <div className="my-5">
              <TableDetail
                dataTableProduct={dataTableProduct}
                saDetailObj={saDetailObj}
              />
            </div>
            <div className="py-6">
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
            </div>
          </div>
        </div>

        {/* Sa Approval */}
        <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
          <div className="w-full p-5">
            <div>
              <span className="text-primary uppercase font-bold">APPROVAL</span>
            </div>
            <div className="grid grid-cols-3 gap-5 py-[30px]">
              <DetailText label="Approval Hierarchy">
                {getApprovalName(saApprovalObj?.appHierId)}
              </DetailText>
            </div>
            <div className="w-full">
              <TableApproval data={dataTableApproval} />
            </div>
          </div>
        </div>

        {/* Sa Attachment */}
        <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
          <div className="w-full p-5">
            <div className="pb-[30px]">
              <span className="text-primary uppercase font-bold">
                ATTACHMENT
              </span>
            </div>
            <div className="w-full">
              <TableAttachment
                saRecordData={saRecordData}
                data={listDataAttachment}
              />
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default ConfirmationSa;
