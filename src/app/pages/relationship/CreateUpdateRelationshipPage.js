import { useLocation } from "react-router-dom";
import CreateUpdateRelationship from "../AccountManagement/CustomerAccountDetail/DetailPages/Relationship/CreateUpdate/CreateUpdateRelationship";

const CreateUpdateRelationshipPage = () => {
  const { state } = useLocation();
  const formType = state?.formType ?? "create";
  return <CreateUpdateRelationship isStandalone formType={formType} />;
};

export default CreateUpdateRelationshipPage;
