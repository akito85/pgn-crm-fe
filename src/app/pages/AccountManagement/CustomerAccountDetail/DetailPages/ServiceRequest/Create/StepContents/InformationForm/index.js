import { Fragment } from "react";
import InfoServiceRequest from "./InfoServiceRequest";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm(props) {

  const account = props.account;
  const customer = props.customer;
  const dropdowns = props.dropdowns;
  const form = props.form;
  const idAccount = props.idAccount;

  return (
    <>
      <InfoServiceRequest form={form} account={account} customer={customer} dropdowns={dropdowns}/>
      <InfoDataRequirement form={form} dropdowns={dropdowns} idAccount={idAccount} />
    </>
  );
}
