import { Fragment } from "react";
import InfoAccount from "./InfoAccount";
import InfoServiceRequest from "./InfoPaymentRelation";
import InfoDataRequirement from "./InfoDataRequirement";

export default function InformationForm() {

  return (
    <Fragment>
      <InfoAccount />
      <InfoServiceRequest />
      <InfoDataRequirement />
    </Fragment>
  );
}
