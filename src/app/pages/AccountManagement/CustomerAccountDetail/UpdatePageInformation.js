import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import React, { useState } from "react";
import CustomerInformation from "./DetailPages/CustomerInformation";
import UpdateAccountInformation from "./DetailPages/AccountInformation/UpdateAccountInformation";
import RelationshipCreateAndUpdate from "./DetailPages/Relationship/RelationshipCreateAndUpdate";
import ServicePointAssetAssign from "./DetailPages/ServicePoint/ServicePointAssetAssign";
import ServicePoint from "./DetailPages/ServicePoint/ServicePoint";
import PremiseDetail from "./DetailPages/Premise/PremiseDetail";

const UpdatePageInformation = ({
  type = {},
  handleChangeInteraction = () => {},
}) => {
  const renderSection = () => {
    switch (type.section) {
      case "account":
        return (
          <UpdateAccountInformation
            handleChangeInteraction={handleChangeInteraction}
          />
        );

      case "relationship":
        return (
          <RelationshipCreateAndUpdate
            type={type}
            handleChangeInteraction={handleChangeInteraction}
          />
        );

      case "Premise Detail":
        return (
          <PremiseDetail
            id={type.id}
            handleChangeInteraction={handleChangeInteraction}
          />
        );

      case "Service Point":
        return (
          <ServicePoint handleChangeInteraction={handleChangeInteraction} />
        );
      default:
        return <></>;
    }
  };
  return <div className="flex flex-col gap-4">{renderSection()}</div>;
};

export default UpdatePageInformation;
