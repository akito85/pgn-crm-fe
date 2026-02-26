import { Fragment } from "react";
import { Form } from "antd";
import InfoAccount from "./InfoAccount";
import InfoServiceRequest from "./InfoServiceRequest";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm(props) {

  const account = props.account;
  const customer = props.customer;
  const dropdowns = props.dropdowns;
  const form = props.form;

  return (
    <Fragment>
      <InfoAccount form={form} account={account} customer={customer} />
      <InfoServiceRequest form={form} account={account} customer={customer} dropdowns={dropdowns}/>
      <InfoDataRequirement form={form} dropdowns={dropdowns} accountId={account?.accountInformation?.accountId} />
    </Fragment>
  );
}
