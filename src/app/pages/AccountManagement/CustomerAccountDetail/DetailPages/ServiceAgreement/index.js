import React from "react";
import ServiceAgreementModule from "./ServiceAgreementModule";
import { accountServiceAgreementVariant } from "./serviceAgreementVariants";

const ServiceAgreement = ({ idAccount, idCustomer, type }) => {
  return (
    <ServiceAgreementModule
      idAccount={idAccount}
      idCustomer={idCustomer}
      type={type}
      variant={accountServiceAgreementVariant}
    />
  );
};

export default ServiceAgreement;
