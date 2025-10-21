import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import CustomerInfoSection from "../Utils/CustomerInfoSection";
import AdjustmentBillingInfoSection from "../Utils/AdjustmentBillingInfoSection";
import {
  getListAccount,
  getListBillingCycle,
  getListBillingPeriod,
  getListCurrency,
  getListInvoice,
  getListType,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import InvoiceSectionForm from "../Form/InvoiceSectionForm";
import DetailText from "../../../../../components/DetailText";
import AdjustmentBISectionForm from "../Form/AdjustmentBISectionForm";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { currencyFormatting } from "../../../../../utils/formatCurrency";

const ConfirmationLayout = ({
  data,
  dataInvoice,
  isOpen,
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataABI = [],
  dataOption = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  setListDataABI = () => {},
}) => {
  // Selector
  const {
    dataListType,
    dataListBillingCycle,
    dataListBillingPeriod,
    dataListInvoice,
    dataListAdjustmentReason,
    dataCurrency,
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [valuePage, setValuePage] = useState("Adjustment Billing");
  const [tabPages, setTabPages] = useState([
    { value: "Adjustment Billing" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  // Use Effect
  useEffect(() => {
    dispatch(getListAccount());
    dispatch(getListType());
    dispatch(getListBillingCycle());
    dispatch(getListBillingPeriod());
    dispatch(getListInvoice());
    dispatch(getListCurrency());
  }, [dispatch]);

  // rendering section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Adjustment Billing":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CUSTOMER INFORMATION"}
            </p>
            <CustomerInfoSection data={data} />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INVOICE INFORMATION"}
            </p>
            <InvoiceSectionForm
              listDataABI={listDataABI}
              data={dataInvoice}
              type={"detail"}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ADJUSTMENT BILLING INFORMATION"}
            </p>
            <AdjustmentBillingInfoSection
              data={data}
              apiType={dataListType}
              apiBillingCycle={dataListBillingCycle}
              apiBillingPeriod={dataListBillingPeriod}
              apiInvoice={dataListInvoice}
              apiAdjustmentReason={dataListAdjustmentReason}
              apiCurrency={dataCurrency}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ADJUSTMENT BILLING ITEM INFORMATION INFORMATION"}
            </p>
            <AdjustmentBISectionForm
              type={"detail"}
              listDataABI={listDataABI}
              setListDataABI={setListDataABI}
            />
          </div>
        );
      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"APPROVAL INFORMATION"}
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy,
                )?.[0].name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy
            />
          </>
        );
      case "Attachment":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ATTACHMENT INFORMATION"}
            </p>
            <AttachmentComponent
              type={"preview"}
              data={listDataAttachment}
              typeSelector="adjustmentBilling"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CUSTOMER INFORMATION"}
            </p>
            <CustomerInfoSection data={data} />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ADJUSTMENT BILLING INFORMATION"}
            </p>
            <AdjustmentBillingInfoSection
              data={data}
              apiType={dataListType}
              apiBillingCycle={dataListBillingCycle}
              apiBillingPeriod={dataListBillingPeriod}
              apiInvoice={dataListInvoice}
            />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"INVOICE INFORMATION"}
            </p>
            <InvoiceSectionForm data={dataInvoice} type={"detail"} />

            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ADJUSTMENT BILLING ITEM INFORMATION INFORMATION"}
            </p>
            <AdjustmentBISectionForm
              children={
                <div className="w-full grid grid-cols-2 gap-4">
                  <DetailText label={"Total Adjustment IDR"}>
                    {sumIDR ? currencyFormatting(sumIDR, "idr") : sumIDR}
                  </DetailText>
                  <DetailText label={"Total Adjustment USD"}>
                    {sumUSD ? currencyFormatting(sumUSD, "idr") : sumUSD}
                  </DetailText>
                </div>
              }
              type={"detail"}
              listDataABI={listDataABI}
              setListDataABI={setListDataABI}
            />
          </div>
        );
    }
  };

  // Sum Total Adjustment IDR
  let dataIDR = listDataABI
    .filter((v) => v.currency === "IDR")
    .map((a) => a.adjustmentAmount);
  const sumIDR = dataIDR.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  // Sum Total Adjustment USD
  let dataUSD = listDataABI
    .filter((v) => v.currency === "USD")
    .map((a) => a.adjustmentAmount);
  const sumUSD = dataUSD.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
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
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
      />
      {renderSection(valuePage)}
    </ModalCustom>
  );
};

export default ConfirmationLayout;
