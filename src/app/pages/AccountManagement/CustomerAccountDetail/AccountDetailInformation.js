import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import React, { useEffect } from "react";
import AccountInformation from "./DetailPages/AccountInformation/AccountInformation";
import LastActivity from "./DetailPages/LastActivity";
// import ServiceRequest from "./DetailPages/ServiceRequest/ServiceRequest";
import RadioTabs from "../../../../components/RadioTabs";
import DistributionMedia from "./DetailPages/DistributionMedia/DistributionMedia";
import GasSourceInformation from "./DetailPages/GasSource/GasSourceInformation";
import AccountBilling from "./DetailPages/Billing/AccountBilling";
import AccountReceipt from "./DetailPages/Receipt/AccountReceipt";
import FinancialInformation from "./DetailPages/FinancialInformation/FinancialInformation";
import AccountAddress from "./DetailPages/AccountAddress/AccountAddress";
import AccountContact from "./DetailPages/AccountContact/AccountContact";
import ServiceAgreement from "./DetailPages/ServiceAgreement";
import Relationship from "./DetailPages/Relationship/Relationship";
import AdditionalInformation from "./DetailPages/Additionalnformation/Additionalnformation";
import Premise from "./DetailPages/Premise/Premise";
import { usePrevLocContext } from "../../../../utils/usePrevLoc";
import EquipmentPage from "./DetailPages/Equipment/Equipment";
import ProductDistribution from "./DetailPages/ProductDistribution/ProductDistribution";
import RawMaterialSource from "./DetailPages/RawMaterialSource/RawMaterialSource";
import GasUtilization from "./DetailPages/GasUtilization/GasUtilization";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { Switch } from "antd";
import AccountPromo from "./DetailPages/Promo/AccountPromo";

const dataTabs = {
  // ci: "Customer Information",
  ai: "Account Information",
  accountAddress: "Account Address",
  accountContact: "Account Contact",
  serviceAgreement: "Service Agreement",
  la: "Last Activity",
  bil: "Billing",
  rec: "Receipt",
  sr: "Service Request",
  as: "Account Statement",
  pr: "Pre Requisit",
  add: "Address",
  rs: "Relationship",
  dm: "Distribution Media",
  premise: "Premise",
  gs: "Gas Source",
  adi: "Additional Information",
  fi: "Financial Information",
  eq: "Equipment",
  pd: "Product Distribution",
  ras: "Raw Material Source",
  gu: "Gas Utilization",
  promo: "Promo",
};
const AccountDetailInformation = ({
  id = 0,
  section = "",
  options = [],
  handleChangeOption = () => {},
  idAccount = 0,
  idCustomer = 0,
  type = "",
  setTypeAccountInfoDetailSection = () => {},
  dispatch,
  // handleChangeInteraction = () => {},
  isApproval = false,
  setIsApproval = () => {},
  setShowApprovalButton = () => {},
  submitApprovalCondition = "",
  setSubmitApprovalCondition = () => {},
}) => {
  const { path } = usePrevLocContext();
  // useEffect(() => {
  //   switch (section) {
  //     case dataTabs.adi:
  //       dispatch(
  //         getGrantedAccessAccount(
  //           "/account-management/account-standard/additional-information"
  //         )
  //       );
  //   }
  // }, [dispatch, section]);

  useEffect(() => {
    if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/service-agreement"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement-main/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement-addon/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement-amandemen/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/service-agreement/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.serviceAgreement);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/address/create"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/address/update"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/address/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/address/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.accountAddress);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/contact/create"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/contact/update"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/contact/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/contact/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.accountContact);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/service-point/view"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/premise/view"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/service-point/view"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/premise/view"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.premise);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/account-information/update"
      ) ||
        path.pathname.includes(
          "/account-management/account-onetime/account-information/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.ai);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/gas-utilization/create"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/gas-utilization/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.gu);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/product-distribution/create"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/product-distribution/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.pd);
    } else if (
      path &&
      (path.pathname.includes(
        "/account-management/account-standard/raw-material-source/create"
      ) ||
        path.pathname.includes(
          "/account-management/account-standard/raw-material-source/update"
        ))
    ) {
      setTypeAccountInfoDetailSection(dataTabs.ras);
    } else if (
      path &&
      (
        path.pathname.includes(
          "/account-management/account-standard/relationship/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/relationship/update"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/relationship/details"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/relationship/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/relationship/update"
        ) ||
        path.pathname.includes(
          "/account-management/account-onetime/relationship/details"
        )
      )
    ) {
      setTypeAccountInfoDetailSection(dataTabs.rs);
    } else if (
      path &&
      (
        path.pathname.includes(
          "/account-management/account-standard/financial-information/payment-relation/details"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/financial-information/payment-relation/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/financial-information/payment-relation/update"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/financial-information/invoice-relation/details"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/financial-information/invoice-relation/create"
        ) ||
        path.pathname.includes(
          "/account-management/account-standard/financial-information/invoice-relation/update"
        )
      )
    ) {
      setTypeAccountInfoDetailSection(dataTabs.fi);
    }
    else {
      setTypeAccountInfoDetailSection(dataTabs.ai);
    }
  }, [path]);

  const sliderLeft = () => {
    const slider = document.getElementById("sliderTabAccount");
    slider.scrollLeft = slider.scrollLeft - 250;
  };

  const sliderRight = () => {
    const slider = document.getElementById("sliderTabAccount");
    slider.scrollLeft = slider.scrollLeft + 250;
  };
  const renderSection = () => {
    switch (section) {
      // case dataTabs.ci:
      //   return (
      //     <CustomerInformation
      //       data_header={[
      //         "CUSTOMER INFORMATION",
      //         "CUSTOMER ADDITIONAL INFORMATION",
      //         "HISTORY LOG INFORMATION",
      //       ]}
      //     />
      //   );
      case dataTabs.ai:
        return (
          <AccountInformation
            id={id}
            data_header={[
              "ACCOUNT INFORMATION",
              "ACCOUNT LOCATION INFORMATION",
              "ACCOUNT IDENTIFICATION",
              "ACCOUNT SEGMENT",
              "ACCOUNT INDUSTRIAL SECTOR",
              "ACCOUNT BUDGET",
              "HISTORY LOG INFORMATION",
            ]}
            idCustomer={idCustomer}
            type={type}
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.la:
        return (
          <LastActivity data_header={["ACCOUNT LAST ACTIVITY INFORMATION"]} />
        );
      case dataTabs.bil:
        return (
          <AccountBilling
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.sr:
        return <></>;
      // return <ServiceRequest />;
      case dataTabs.dm:
        return (
          <DistributionMedia
            id={id}
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.premise:
        return (
          <Premise
            id={id}
            idCustomer={idCustomer}
            type={type}
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.gs:
        return <GasSourceInformation />;
      case dataTabs.rec:
        return (
          <AccountReceipt
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.fi:
        return (
          <FinancialInformation
            id={id}
            idCustomer={idCustomer}
            isApproval={isApproval}
            setIsApproval={setIsApproval}
            setShowApprovalButton={setShowApprovalButton}
            submitApprovalCondition={submitApprovalCondition}
            setSubmitApprovalCondition={setSubmitApprovalCondition}
          />
        )
      case dataTabs.accountAddress:
        return <AccountAddress id={id} idCustomer={idCustomer} type={type} />;
      case dataTabs.accountContact:
        return <AccountContact id={id} idCustomer={idCustomer} type={type} />;
      case dataTabs.serviceAgreement:
        return (
          <ServiceAgreement
            idAccount={id}
            idCustomer={idCustomer}
            type={type}
          />
        );
      case dataTabs.rs:
        return (
          <Relationship
            id={id}
            type={type}
            idCustomer={idCustomer}
          />
        );
      case dataTabs.adi:
        return (
          <AdditionalInformation
            idAccount={id}
          // handleChangeInteraction={handleChangeInteraction}
          />
        );
      case dataTabs.eq:
        return (
          <EquipmentPage idAccount={id} idCustomer={idCustomer} type={type} />
        );
      case dataTabs.pd:
        return <ProductDistribution id={id} idCustomer={idCustomer} />;
      case dataTabs.ras:
        return <RawMaterialSource id={id} idCustomer={idCustomer} />;
      case dataTabs.gu:
        return (
          <GasUtilization idAccount={id} idCustomer={idCustomer} type={type} />
        );
      case dataTabs.promo:
        return <AccountPromo id={id} />;
      default:
        return <></>;
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex justify-center items-center gap-4">
        <LeftCircleFilled width={40} onClick={sliderLeft} />
        <div
          id="sliderTabAccount"
          className={
            "flex gap-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar"
          }
        >
          <RadioTabs
            currentPosition={section}
            data={options}
            onChange={handleChangeOption}
          />
        </div>
        <RightCircleFilled width={40} onClick={sliderRight} />
      </div>
      {renderSection()}
    </div>
  );
};

export default AccountDetailInformation;
